import { z } from "zod"

export const schema = z.object({
    carId: z.coerce.number().min(1, "Car ID is required"),
    reportedById: z.coerce.number().min(1, "Reported By is required"),
    assignedToId: z.coerce.number().optional().nullable(),
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    severity: z.string().min(1, "Severity is required"),
    status: z.string().min(1, "Status is required"),
    type: z.string().min(1, "Type is required"),
    location: z.string().optional(),
    latitude: z.coerce.number().optional().nullable(),
    longitude: z.coerce.number().optional().nullable(),
    occurredAt: z.string().min(1, "Occurred At is required"),
    reportedAt: z.string().optional(),
    carReadingId: z.string().optional().nullable(),
    resolutionNotes: z.string().optional(),
    estimatedCost: z.coerce.number().optional().nullable(),
    actualCost: z.coerce.number().optional().nullable(),
    resolvedAt: z.string().optional(),
})

export type FormValues = z.infer<typeof schema>