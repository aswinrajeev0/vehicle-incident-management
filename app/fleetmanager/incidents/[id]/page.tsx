'use client'

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SeverityBadge, StatusBadge } from "@/components/incidents/incident-badges"
import { MediaGrid } from "@/components/incidents/media-grid"
import { DetailRow } from "@/components/incidents/detail-row"
import { formatCurrency, formatDateTime } from "@/lib/format"
import type { Incident } from "@/lib/types/incident"
import { useIncidentDetail } from "@/hooks/useQuery"
import { use } from "react"

export default function IncidentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)

    const { data } = useIncidentDetail(id)
    const incident = (data || {}) as Incident

    return (
        <main className="px-4 py-6 md:px-6 lg:px-8">
            {/* Header */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-col gap-2">
                    <p className="text-sm text-gray-500">
                        <Link href="/" className="hover:underline">
                            Home
                        </Link>
                        {" / "}
                        <Link href="/incidents" className="hover:underline">
                            Incidents
                        </Link>
                        {" / "}
                        <span aria-current="page" className="text-gray-700">
                            #{incident.id}
                        </span>
                    </p>
                    <h1 className="text-pretty text-2xl md:text-3xl font-semibold text-gray-900">{incident.title}</h1>
                    <div className="flex items-center gap-2">
                        <SeverityBadge severity={incident.severity} />
                        <StatusBadge status={incident.status} />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button asChild variant="outline">
                        <Link href={`/fleetmanager/incidents/${incident.id}/edit`}>Edit</Link>
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">Assign</Button>
                </div>
            </div>

            <Separator className="my-6" />

            {/* Content grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main column */}
                <section className="lg:col-span-2 flex flex-col gap-6">
                    <Card className="p-4 md:p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-2">Description</h2>
                        <p className="text-gray-700 leading-relaxed">{incident.description}</p>
                    </Card>

                    <Card className="p-4 md:p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Media</h2>
                        <MediaGrid images={incident.images} documents={incident.documents} />
                    </Card>

                    <Card className="p-4 md:p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Costs</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="rounded-md border p-3">
                                <div className="text-xs text-gray-500">Estimated Cost</div>
                                <div className="text-gray-900 font-medium">{formatCurrency(incident.estimatedCost)}</div>
                            </div>
                            <div className="rounded-md border p-3">
                                <div className="text-xs text-gray-500">Actual Cost</div>
                                <div className="text-gray-900 font-medium">{formatCurrency(incident.actualCost)}</div>
                            </div>
                        </div>
                    </Card>

                    {incident.resolutionNotes && (
                        <Card className="p-4 md:p-6">
                            <h2 className="text-lg font-medium text-gray-900 mb-2">Resolution Notes</h2>
                            <p className="text-gray-700 leading-relaxed">{incident.resolutionNotes}</p>
                        </Card>
                    )}
                </section>

                {/* Sidebar */}
                <aside className="flex flex-col gap-6">
                    <Card className="p-4 md:p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Details</h2>
                        <div className="grid grid-cols-1 gap-3">
                            <DetailRow label="Incident ID" value={`#${incident.id}`} />
                            <DetailRow label="Type" value={incident.type} />
                            <DetailRow label="Car ID" value={`#${incident.carId}`} />
                            <DetailRow label="Reported By" value={`User #${incident.reportedById}`} />
                            <DetailRow
                                label="Assigned To"
                                value={incident.assignedToId ? `User #${incident.assignedToId}` : "Unassigned"}
                            />
                            <DetailRow label="Occurred At" value={formatDateTime(incident.occurredAt)} />
                            <DetailRow label="Reported At" value={formatDateTime(incident.reportedAt)} />
                            <DetailRow label="Resolved At" value={formatDateTime(incident.resolvedAt)} />
                            {incident.carReadingId && <DetailRow label="Car Reading ID" value={`#${incident.carReadingId}`} />}
                        </div>
                    </Card>

                    <Card className="p-4 md:p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Location</h2>
                        <div className="flex flex-col gap-3">
                            <DetailRow label="Name" value={incident.location || "—"} />
                            <DetailRow
                                label="Coordinates"
                                value={
                                    incident.latitude != null && incident.longitude != null
                                        ? `${incident.latitude.toFixed(5)}, ${incident.longitude.toFixed(5)}`
                                        : "—"
                                }
                            />
                        </div>
                    </Card>

                    <Card className="p-4 md:p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Timestamps</h2>
                        <div className="flex flex-col gap-2">
                            <DetailRow label="Created" value={formatDateTime(incident.createdAt)} />
                            <DetailRow label="Updated" value={formatDateTime(incident.updatedAt)} />
                        </div>
                    </Card>
                </aside>
            </div>
        </main>
    )
}
