"use client"

import {
    PieChart as RePieChart,
    Pie,
    Cell,
    Tooltip as ReTooltip,
    ResponsiveContainer,
    BarChart as ReBarChart,
    XAxis,
    YAxis,
    CartesianGrid,
    Bar,
} from "recharts"

export const StatsCharts = {
    PieChart: function PieChart({
        data,
        dataKey,
        nameKey,
        colors,
    }: {
        data: Array<{ [k: string]: string | number }>
        dataKey: string
        nameKey: string
        colors: string[]
    }) {
        const palette = colors.length ? colors : ["#2563eb", "#16a34a", "#f59e0b", "#ef4444", "#6b7280"]
        return (
            <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                    <Pie
                        data={data}
                        dataKey={dataKey}
                        nameKey={nameKey}
                        outerRadius={100}
                        innerRadius={50}
                        paddingAngle={2}
                        stroke="#ffffff"
                    >
                        {data.map((_, i) => (
                            <Cell key={i} fill={palette[i % palette.length]} />
                        ))}
                    </Pie>
                    <ReTooltip />
                </RePieChart>
            </ResponsiveContainer>
        )
    },

    BarChart: function BarChart({
        data,
        xKey,
        barKey,
        color = "#2563eb",
    }: {
        data: Array<{ [k: string]: string | number }>
        xKey: string
        barKey: string
        color?: string
    }) {
        return (
            <ResponsiveContainer width="100%" height="100%">
                <ReBarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={xKey} tickMargin={8} />
                    <YAxis allowDecimals={false} />
                    <ReTooltip />
                    <Bar dataKey={barKey} fill={color} radius={[6, 6, 0, 0]} />
                </ReBarChart>
            </ResponsiveContainer>
        )
    },
}
