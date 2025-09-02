"use client"

import type { Incident } from "@/lib/types/incident"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { useUpdateIncidentStatus } from "@/hooks/useQuery"

function formatDate(d: string) {
    try {
        return new Intl.DateTimeFormat(undefined, {
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        }).format(new Date(d))
    } catch {
        return d
    }
}

function statusClasses(status: Incident["status"]) {
    switch (status) {
        case "IN_PROGRESS":
            return "bg-blue-600 text-white"
        case "RESOLVED":
            return "bg-muted text-foreground"
        case "CANCELLED":
            return "bg-muted text-foreground line-through"
        case "PENDING":
        default:
            return "bg-muted text-foreground"
    }
}

export function IncidentsTable({ incidents }: { incidents: Incident[] }) {
    const router = useRouter()
    const {mutateAsync: updateIncidentStatus} = useUpdateIncidentStatus()

    const [editingId, setEditingId] = useState<number | null>(null)

    const updateStatus = async (id: number, newStatus: Incident["status"]) => {
        try {
            await updateIncidentStatus({id: id.toString(), status: newStatus})

            setEditingId(null)
        } catch (err) {
            console.error("Failed to update status:", err)
        }
    }

    if (!incidents?.length) {
        return <div className="rounded-lg border p-6 text-center text-sm text-muted-foreground">No incidents found.</div>
    }

    return (
        <Table>
            <TableCaption className="text-xs">Showing {incidents.length} incident(s)</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[32%]">Title</TableHead>
                    <TableHead className="w-[12%]">Severity</TableHead>
                    <TableHead className="w-[14%]">Status</TableHead>
                    <TableHead className="w-[14%]">Type</TableHead>
                    <TableHead className="w-[18%]">Location</TableHead>
                    <TableHead className="w-[10%] text-right">Occurred</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {incidents.map((inc) => (
                    <TableRow
                        key={inc.id}
                        className="align-top"
                        onClick={() => router.push(`/fleetmanager/incidents/${inc.id}`)}
                    >
                        <TableCell className="font-medium">
                            <div className="max-w-md">
                                <div className="truncate">{inc.title}</div>
                                <div className="mt-1 line-clamp-2 text-xs text-muted-foreground">{inc.description}</div>
                            </div>
                        </TableCell>
                        <TableCell>
                            <span className="rounded bg-muted px-2 py-0.5 text-xs">{inc.severity}</span>
                        </TableCell>
                        <TableCell
                            onClick={(e) => {
                                e.stopPropagation()
                                setEditingId(inc.id)
                            }}
                        >
                            {editingId === inc.id ? (
                                <Select
                                    defaultValue={inc.status}
                                    onValueChange={(val) => updateStatus(inc.id, val as Incident["status"])}
                                >
                                    <SelectTrigger className="w-[140px]">
                                        <SelectValue placeholder="Change status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="PENDING">Pending</SelectItem>
                                        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                        <SelectItem value="RESOLVED">Resolved</SelectItem>
                                        <SelectItem value="CLOSED">Closed</SelectItem>
                                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                            ) : (
                                <Badge
                                    className={statusClasses(inc.status)}
                                    aria-label={`Status: ${inc.status}`}
                                >
                                    {inc.status.replace("_", " ")}
                                </Badge>
                            )}
                        </TableCell>
                        <TableCell className="text-xs">{inc.type}</TableCell>
                        <TableCell className="text-xs">
                            <span className="block max-w-[16rem] truncate">{inc.location ?? "—"}</span>
                        </TableCell>
                        <TableCell className="text-right text-xs">{formatDate(inc.occurredAt)}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
