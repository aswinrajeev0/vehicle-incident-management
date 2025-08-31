import { Prisma, IncidentStatus, IncidentSeverity } from '@prisma/client';

export function parsePagination(searchParams: URLSearchParams) {
    const page = Math.max(1, Number(searchParams.get('page') ?? 1));
    const limit = Math.min(100, Math.max(1, Number(searchParams.get('limit') ?? 10)));
    const skip = (page - 1) * limit;
    return { page, limit, skip };
}

export function buildWhere(searchParams: URLSearchParams): Prisma.IncidentWhereInput {
    const status = searchParams.get('status') as IncidentStatus | null;
    const severity = searchParams.get('severity') as IncidentSeverity | null;
    const carId = searchParams.get('carId');
    const assignedToId = searchParams.get('assignedToId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const q = searchParams.get('query');

    const AND: Prisma.IncidentWhereInput[] = [];

    if (status) AND.push({ status });
    if (severity) AND.push({ severity });
    if (carId) AND.push({ carId: Number(carId) });
    if (assignedToId) AND.push({ assignedToId: Number(assignedToId) });
    if (startDate || endDate) {
        AND.push({
            occurredAt: {
                gte: startDate ? new Date(startDate) : undefined,
                lte: endDate ? new Date(endDate) : undefined,
            },
        });
    }
    if (q && q.trim()) {
        AND.push({
            OR: [
                { title: { contains: q, mode: 'insensitive' } },
                { description: { contains: q, mode: 'insensitive' } },
                { location: { contains: q, mode: 'insensitive' } },
            ],
        });
    }

    return AND.length ? { AND } : {};
}

export const commonInclude = {
    car: true,
    reportedBy: { select: { id: true, name: true, email: true } },
    assignedTo: { select: { id: true, name: true, email: true } },
    carReading: true,
} as const;
