import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { addIncidentUpdateSchema } from '@/lib/validators/incidents';
import { IncidentUpdateType, IncidentStatus } from '@prisma/client';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: Request, { params }: { params: { id: string } }) {
    try {
        const id = Number(params.id);
        const formData = await req.formData();
        const body: Record<string, any> = {};
        formData.forEach((value, key) => {
            body[key] = value;
        });

        const parsed = addIncidentUpdateSchema.parse(body);
        const exists = await prisma.incident.findUnique({ where: { id } });
        if (!exists) return NextResponse.json({ error: 'Incident not found' }, { status: 404 });

        const result = await prisma.$transaction(async (tx) => {
            if (parsed.updateType === IncidentUpdateType.STATUS_CHANGE && parsed.status) {
                await tx.incident.update({
                    where: { id },
                    data: { status: parsed.status as IncidentStatus },
                });
            }
            if (parsed.updateType === IncidentUpdateType.ASSIGNMENT && typeof parsed.assignedToId === 'number') {
                await tx.incident.update({
                    where: { id },
                    data: { assignedToId: parsed.assignedToId },
                });
            }
            if (parsed.updateType === IncidentUpdateType.COST_UPDATE) {
                await tx.incident.update({
                    where: { id },
                    data: {
                        estimatedCost: parsed.estimatedCost ?? undefined,
                        actualCost: parsed.actualCost ?? undefined,
                    },
                });
            }
            if (parsed.updateType === IncidentUpdateType.RESOLUTION) {
                await tx.incident.update({
                    where: { id },
                    data: {
                        resolutionNotes: parsed.resolutionNotes ?? undefined,
                        resolvedAt: parsed.resolvedAt ?? undefined,
                    },
                });
            }

            const update = await tx.incidentUpdate.create({
                data: {
                    incidentId: id,
                    userId: parsed.userId,
                    updateType: parsed.updateType,
                    message: parsed.message,
                },
            });

            return update;
        });

        return NextResponse.json(result, { status: 201 });
    } catch (err: any) {
        return NextResponse.json(
            { error: err?.message || 'Failed to add update' },
            { status: 400 }
        );
    }
}
