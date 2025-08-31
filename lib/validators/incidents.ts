import { z } from 'zod';
import {
    IncidentSeverity,
    IncidentStatus,
    IncidentType,
    IncidentUpdateType,
} from '@prisma/client';

export const createIncidentSchema = z.object({
    carId: z.coerce.number().int(),
    reportedById: z.coerce.number().int(),
    assignedToId: z.coerce.number().int().optional(),

    title: z.string().min(3),
    description: z.string().min(1),
    severity: z.enum(IncidentSeverity).default(IncidentSeverity.LOW),
    status: z.enum(IncidentStatus).default(IncidentStatus.PENDING),
    type: z.enum(IncidentType),

    location: z.string().optional(),
    latitude: z.coerce.number().optional(),
    longitude: z.coerce.number().optional(),
    occurredAt: z.coerce.date(),
    reportedAt: z.coerce.date().optional(),

    carReadingId: z.coerce.number().int().optional(),
    images: z.array(z.string().url()).optional().default([]),
    documents: z.array(z.string().url()).optional().default([]),

    resolutionNotes: z.string().optional(),
    estimatedCost: z.coerce.number().optional(),
    actualCost: z.coerce.number().optional(),
    resolvedAt: z.coerce.date().optional(),
});

export const updateIncidentSchema = createIncidentSchema
    .partial()
    .extend({
        status: z.enum(IncidentStatus).optional(),
        severity: z.enum(IncidentSeverity).optional(),
        type: z.enum(IncidentType).optional(),
    });

export const addIncidentUpdateSchema = z.object({
    message: z.string().min(1),
    updateType: z.enum(IncidentUpdateType),
    // optional helpers when updateType === 'STATUS_CHANGE' or 'ASSIGNMENT'
    status: z.enum(IncidentStatus).optional(),
    assignedToId: z.coerce.number().int().optional(),
    estimatedCost: z.coerce.number().optional(),
    actualCost: z.coerce.number().optional(),
    resolutionNotes: z.string().optional(),
    resolvedAt: z.coerce.date().optional(),
    userId: z.coerce.number().int(),
});
