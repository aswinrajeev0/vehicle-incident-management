import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { updateIncidentSchema } from '@/lib/validators/incidents';
import { commonInclude } from '@/lib/incidents-utils';
import { IncidentUpdateType } from '@prisma/client';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(
    _req: Request,
    { params }: { params: { id: string } }
) {
    const id = Number(params.id);
    const incident = await prisma.incident.findUnique({
        where: { id },
        include: {
            ...commonInclude,
            updates: {
                include: { user: { select: { id: true, name: true, email: true } } },
                orderBy: { createdAt: 'desc' },
            },
        },
    });

    if (!incident) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(incident);
}

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = Number((await params).id);
        const formData = await req.formData();
        const body: Record<string, any> = {};
        formData.forEach((value, key) => {
            body[key] = value;
        });

        const patch = updateIncidentSchema.parse(body);

        const existing = await prisma.incident.findUnique({ where: { id } });
        if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        const updatesToCreate: { message: string; updateType: IncidentUpdateType }[] = [];

        if (patch.status && patch.status !== existing.status) {
            updatesToCreate.push({
                updateType: IncidentUpdateType.STATUS_CHANGE,
                message: `Status: ${existing.status} -> ${patch.status}`,
            });
        }
        if (typeof patch.assignedToId === 'number' && patch.assignedToId !== existing.assignedToId) {
            updatesToCreate.push({
                updateType: IncidentUpdateType.ASSIGNMENT,
                message: `Assigned to: ${patch.assignedToId}`,
            });
        }
        if (
            (patch.estimatedCost && patch.estimatedCost !== existing.estimatedCost) ||
            (patch.actualCost && patch.actualCost !== existing.actualCost)
        ) {
            updatesToCreate.push({
                updateType: IncidentUpdateType.COST_UPDATE,
                message: `Cost updated`,
            });
        }
        if (
            (patch.resolutionNotes && patch.resolutionNotes !== existing.resolutionNotes) ||
            (patch.resolvedAt && patch.resolvedAt !== existing.resolvedAt)
        ) {
            updatesToCreate.push({
                updateType: IncidentUpdateType.RESOLUTION,
                message: `Resolution updated`,
            });
        }

        const dataToUpdate: Partial<typeof patch> = {};

        for (const key of Object.keys(patch) as (keyof typeof patch)[]) {
            const value = patch[key];

            if (key === "images" || key === "documents") {
                if (Array.isArray(value) && value.length > 0) {
                    dataToUpdate[key] = value;
                }
            } else if (value !== undefined) {
                dataToUpdate[key] = value as any;
            }
        }

        const updated = await prisma.$transaction(async (tx) => {
            const inc = await tx.incident.update({
                where: { id },
                data: dataToUpdate,
                include: commonInclude,
            });

            const userId = Number((body.userId ?? inc.assignedToId ?? inc.reportedById) || inc.reportedById);

            for (const u of updatesToCreate) {
                await tx.incidentUpdate.create({
                    data: { incidentId: id, userId, updateType: u.updateType, message: u.message },
                });
            }

            return inc;
        });

        return NextResponse.json(updated);
    } catch (err: any) {
        return NextResponse.json(
            { error: err?.message || 'Failed to update incident' },
            { status: 400 }
        );
    }
}
