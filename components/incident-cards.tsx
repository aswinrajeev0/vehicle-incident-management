import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Incident } from "@/lib/types/incident"
import Link from "next/link"

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
    // neutrals + blue accent for visibility
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

export function IncidentCards({ incidents }: { incidents: Incident[] }) {
    if (!incidents?.length) {
        return <div className="rounded-lg border p-6 text-center text-sm text-muted-foreground">No incidents found.</div>
    }

    return (
        <div className="grid grid-cols-1 gap-4">
            {incidents.map((inc) => (
                <Link key={inc.id} href={`/fleetmanager/incidents/${inc.id}`} passHref>
                    <Card className="overflow-hidden">
                        <CardHeader className="space-y-1">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-balance text-base font-semibold">{inc.title}</CardTitle>
                                <Badge className={statusClasses(inc.status)} aria-label={`Status: ${inc.status}`}>
                                    {inc.status.replace("_", " ")}
                                </Badge>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                <span className="rounded bg-muted px-2 py-0.5">{inc.severity}</span>
                                <span className="rounded bg-muted px-2 py-0.5">{inc.type}</span>
                                {inc.location ? <span className="truncate">{inc.location}</span> : null}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <p className="text-sm leading-6 text-foreground">{inc.description}</p>
                            <div className="grid grid-cols-2 gap-3 text-xs">
                                <div className="rounded border p-2">
                                    <div className="text-muted-foreground">Occurred</div>
                                    <div className="font-medium">{formatDate(inc.occurredAt)}</div>
                                </div>
                                <div className="rounded border p-2">
                                    <div className="text-muted-foreground">Reported</div>
                                    <div className="font-medium">{formatDate(inc.reportedAt)}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
    )
}
