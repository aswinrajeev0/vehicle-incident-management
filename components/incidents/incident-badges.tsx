"use client"

import type { IncidentSeverity, IncidentStatus } from "@/lib/types/incident"

export function SeverityBadge({ severity }: { severity: IncidentSeverity }) {
    const base = "px-2 py-0.5 text-xs font-medium rounded border"
    const cls =
        severity === "CRITICAL"
            ? "bg-red-50 text-red-700 border-red-200"
            : severity === "HIGH"
                ? "bg-red-50 text-red-700 border-red-200"
                : severity === "MEDIUM"
                    ? "bg-blue-50 text-blue-700 border-blue-200"
                    : "bg-gray-50 text-gray-700 border-gray-200"
    return <span className={`${base} ${cls}`}>{severity}</span>
}

export function StatusBadge({ status }: { status: IncidentStatus }) {
    const base = "px-2 py-0.5 text-xs font-medium rounded border"
    const cls =
        status === "IN_PROGRESS"
            ? "bg-blue-50 text-blue-700 border-blue-200"
            : status === "RESOLVED"
                ? "bg-gray-50 text-gray-800 border-gray-200"
                : status === "CANCELLED"
                    ? "bg-gray-100 text-gray-600 border-gray-200"
                    : "bg-gray-50 text-gray-700 border-gray-200"
    return <span className={`${base} ${cls}`}>{status}</span>
}
