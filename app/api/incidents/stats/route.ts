import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { IncidentStatus } from '@prisma/client';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
    const total = await prisma.incident.count();

    const byStatusRaw = await prisma.incident.groupBy({
        by: ['status'],
        _count: { _all: true },
    });
    const byStatus = Object.fromEntries(byStatusRaw.map(r => [r.status, r._count._all]));

    const bySeverityRaw = await prisma.incident.groupBy({
        by: ['severity'],
        _count: { _all: true },
    });
    const bySeverity = Object.fromEntries(bySeverityRaw.map(r => [r.severity, r._count._all]));

    const openIncidents = await prisma.incident.count({
        where: { status: { in: [IncidentStatus.PENDING, IncidentStatus.IN_PROGRESS] } },
    });

    const resolved = await prisma.incident.findMany({
        where: { resolvedAt: { not: null } },
        select: { reportedAt: true, resolvedAt: true },
    });
    let avgResolutionTime = 0;
    if (resolved.length) {
        const sumMs = resolved.reduce((acc, r) => acc + (r.resolvedAt!.getTime() - r.reportedAt.getTime()), 0);
        avgResolutionTime = sumMs / resolved.length / (1000 * 60 * 60); // hours
    }

    return NextResponse.json({
        total,
        byStatus,
        bySeverity,
        avgResolutionTime,
        openIncidents,
    });
}
