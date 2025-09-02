"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { StatsCharts } from "@/components/stats-chart"
import { StatsSkeleton } from "@/components/stats-skeleton"
import { useIncidentStats } from "@/hooks/useQuery"

type StatsResponse = {
    total: number
    byStatus: Record<string, number>
    bySeverity: Record<string, number>
    avgResolutionTime: number
    openIncidents: number
}

export default function StatsPage() {
    const {data, isLoading, error} = useIncidentStats()

    if (isLoading) {
        return (
            <main className="p-4 md:p-8 max-w-6xl mx-auto">
                <header className="mb-6">
                    <h1 className="text-2xl md:text-3xl font-semibold text-balance">Incident Statistics</h1>
                    <p className="text-muted-foreground mt-1">Overview of incidents by status, severity, and resolution time.</p>
                </header>
                <StatsSkeleton />
            </main>
        )
    }

    if (error) {
        return (
            <main className="p-4 md:p-8 max-w-3xl mx-auto">
                <h1 className="text-2xl font-semibold mb-4">Incident Statistics</h1>
                <Card>
                    <CardHeader>
                        <CardTitle>Failed to load</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">There was an error loading stats. Please try again later.</p>
                        <pre className="mt-3 rounded bg-muted p-3 text-xs overflow-x-auto">{String(error)}</pre>
                    </CardContent>
                </Card>
            </main>
        )
    }

    const stats = data as StatsResponse
    const hasData = (stats?.total ?? 0) > 0

    return (
        <main className="p-4 md:p-8 max-w-6xl mx-auto">
            <header className="mb-6">
                <h1 className="text-2xl md:text-3xl font-semibold text-balance">Incident Statistics</h1>
                <p className="text-muted-foreground mt-1">Overview of incidents by status, severity, and resolution time.</p>
            </header>

            {/* KPI cards */}
            <section aria-label="Key metrics" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard label="Total Incidents" value={stats.total} />
                <MetricCard label="Open Incidents" value={stats.openIncidents} badge="Open" />
                <MetricCard
                    label="Avg Resolution (hrs)"
                    value={Number.isFinite(stats.avgResolutionTime) ? stats.avgResolutionTime.toFixed(1) : "0.0"}
                />
                <MetricCard label="Resolved %" value={percentResolved(stats)} suffix="%" />
            </section>

            <Separator className="my-6" />

            {/* Charts */}
            <section aria-label="Charts" className={cn("grid grid-cols-1 lg:grid-cols-2 gap-6")}>
                <Card className="min-h-[360px]">
                    <CardHeader>
                        <CardTitle className="text-balance">Incidents by Status</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        {hasData ? (
                            <StatsCharts.PieChart
                                data={objectToChartData(stats.byStatus)}
                                dataKey="value"
                                nameKey="name"
                                colors={["#2563eb", "#16a34a", "#f59e0b", "#ef4444", "#6b7280"]}
                            />
                        ) : (
                            <EmptyState message="No incident data for statuses yet." />
                        )}
                    </CardContent>
                </Card>

                <Card className="min-h-[360px]">
                    <CardHeader>
                        <CardTitle className="text-balance">Incidents by Severity</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        {hasData ? (
                            <StatsCharts.BarChart
                                data={objectToChartData(stats.bySeverity)}
                                xKey="name"
                                barKey="value"
                                color="#2563eb"
                            />
                        ) : (
                            <EmptyState message="No incident data for severity yet." />
                        )}
                    </CardContent>
                </Card>
            </section>
        </main>
    )
}

function MetricCard({
    label,
    value,
    suffix,
    badge,
}: {
    label: string
    value: number | string
    suffix?: string
    badge?: string
}) {
    return (
        <Card>
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">{label}</p>
                    {badge ? <Badge variant="secondary">{badge}</Badge> : null}
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl md:text-3xl font-semibold">
                    {value}
                    {suffix ? <span className="text-base font-normal text-muted-foreground ml-1">{suffix}</span> : null}
                </div>
            </CardContent>
        </Card>
    )
}

function percentResolved(stats: StatsResponse) {
    if (!stats.total) return 0
    const resolvedCount = stats.total - stats.openIncidents
    return Math.round((resolvedCount / stats.total) * 100)
}

function objectToChartData(obj: Record<string, number>) {
    return Object.entries(obj || {}).map(([name, value]) => ({ name, value }))
}

function EmptyState({ message }: { message: string }) {
    return (
        <div className="h-full w-full flex items-center justify-center">
            <p className="text-sm text-muted-foreground text-center">{message}</p>
        </div>
    )
}
