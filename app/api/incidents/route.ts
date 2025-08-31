import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { buildWhere, commonInclude, parsePagination } from '@/lib/incidents-utils';
import { createIncidentSchema } from '@/lib/validators/incidents';
import { uploadFileToCloudinary } from '@/lib/cloudinary';
import { IncidentUpdateType } from '@prisma/client';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: Request) {
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    const { page, limit, skip } = parsePagination(searchParams);
    const where = buildWhere(searchParams);

    const [items, total] = await Promise.all([
        prisma.incident.findMany({
            where,
            include: commonInclude,
            orderBy: { occurredAt: 'desc' },
            skip,
            take: limit,
        }),
        prisma.incident.count({ where }),
    ]);

    return NextResponse.json({
        items,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
    });
}

export async function POST(req: Request) {
    try {
        const contentType = req.headers.get('content-type') || '';

        // Accept both JSON and multipart/form-data
        let data: any;

        if (contentType.includes('multipart/form-data')) {
            const form = await req.formData();

            // Parse scalar fields
            const fields: Record<string, any> = {};
            form.forEach((value, key) => {
                if (typeof value === "string" && key !== "images" && key !== "documents") {
                    fields[key] = value;
                }
            });

            // Parse provided JSON arrays (optional)
            const imagesFromBody = fields.images ? JSON.parse(fields.images) : [];
            const documentsFromBody = fields.documents ? JSON.parse(fields.documents) : [];

            // Upload files if provided
            const imageFiles = form.getAll('images') as File[];
            const documentFiles = form.getAll('documents') as File[];

            const uploadedImages = await Promise.all(
                imageFiles.map((f) => uploadFileToCloudinary(f, 'incidents/images'))
            );
            const uploadedDocs = await Promise.all(
                documentFiles.map((f) => uploadFileToCloudinary(f, 'incidents/documents'))
            );

            data = {
                ...fields,
                images: [...imagesFromBody, ...uploadedImages],
                documents: [...documentsFromBody, ...uploadedDocs],
            };
        } else {
            data = await req.json();
        }

        console.log(data)

        const parsed = createIncidentSchema.parse(data);

        const created = await prisma.$transaction(async (tx) => {
            const incident = await tx.incident.create({
                data: {
                    carId: parsed.carId,
                    reportedById: parsed.reportedById,
                    assignedToId: parsed.assignedToId,
                    title: parsed.title,
                    description: parsed.description,
                    severity: parsed.severity,
                    status: parsed.status,
                    type: parsed.type,
                    location: parsed.location,
                    latitude: parsed.latitude,
                    longitude: parsed.longitude,
                    occurredAt: parsed.occurredAt,
                    reportedAt: parsed.reportedAt ?? new Date(),
                    carReadingId: parsed.carReadingId,
                    images: parsed.images ?? [],
                    documents: parsed.documents ?? [],
                    resolutionNotes: parsed.resolutionNotes,
                    estimatedCost: parsed.estimatedCost,
                    actualCost: parsed.actualCost,
                    resolvedAt: parsed.resolvedAt,
                },
                include: commonInclude,
            });

            // Minimal "audit": record creation as a COMMENT
            await tx.incidentUpdate.create({
                data: {
                    incidentId: incident.id,
                    userId: incident.reportedById,
                    updateType: IncidentUpdateType.COMMENT,
                    message: 'Incident created',
                },
            });

            // If assignment present, log it
            if (incident.assignedToId) {
                await tx.incidentUpdate.create({
                    data: {
                        incidentId: incident.id,
                        userId: incident.reportedById,
                        updateType: IncidentUpdateType.ASSIGNMENT,
                        message: `Assigned to user ${incident.assignedToId}`,
                    },
                });
            }

            return incident;
        });

        return NextResponse.json(created, { status: 201 });
    } catch (err: any) {
        console.error(err)
        return NextResponse.json(
            { error: err?.message || 'Failed to create incident' },
            { status: 400 }
        );
    }
}
