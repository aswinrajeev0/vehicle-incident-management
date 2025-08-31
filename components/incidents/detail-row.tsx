"use client"

export function DetailRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-start justify-between gap-4">
            <div className="text-xs text-gray-500">{label}</div>
            <div className="text-sm text-gray-900 text-right">{value}</div>
        </div>
    )
}
