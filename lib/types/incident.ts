export type IncidentSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
export type IncidentStatus = "PENDING" | "IN_PROGRESS" | "RESOLVED" | "CANCELLED"
export type IncidentType = "ACCIDENT" | "MAINTENANCE" | "THEFT" | "OTHER"

export interface Incident {
    id: number
    carId: number
    reportedById: number
    assignedToId?: number | null
    title: string
    description: string
    severity: IncidentSeverity
    status: IncidentStatus
    type: IncidentType
    location?: string | null
    latitude?: number | null
    longitude?: number | null
    occurredAt: string 
    reportedAt: string 
    carReadingId?: number | null
    images?: string[] | null
    documents?: string[] | null
    resolutionNotes?: string | null
    estimatedCost?: number | null
    actualCost?: number | null
    resolvedAt?: string | null
    createdAt: string
    updatedAt: string
}