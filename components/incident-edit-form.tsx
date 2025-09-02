"use client"

import * as React from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import UserDropdown from "@/components/user-dropdown"
import CarDropdown from "@/components/car-dropdown"
import { useIncidentDetail, useUpdateIncident } from "@/hooks/useQuery"
import { useParams } from "next/navigation"
import { Incident } from "@/lib/types/incident"
import { FormValues } from "@/lib/validators/form.validator"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { zodResolver } from "@hookform/resolvers/zod"
import { schema } from "@/lib/validators/form.validator"

export default function IncidentEditForm({ onCancel }: { onCancel?: () => void }) {
    const params = useParams()
    const id = params.id as string
    const [submitting, setSubmitting] = React.useState(false)
    const router = useRouter();

    const { data } = useIncidentDetail(id)
    const incident = (data || {}) as Incident

    const { mutateAsync: updateIncident, isPending } = useUpdateIncident()

    const formatDateTimeLocal = (dateString?: string) => {
        if (!dateString) return ""
        const date = new Date(dateString)
        return date.toISOString().slice(0, 16)
    }

    const form = useForm<FormValues>({
        resolver: zodResolver(schema) as any,
        defaultValues: {
            carId: incident.carId || 0,
            reportedById: incident.reportedById || 0,
            assignedToId: incident.assignedToId || 0,
            title: incident.title || "",
            description: incident.description || "",
            severity: incident.severity || "",
            status: incident.status || "",
            type: incident.type || "",
            location: incident.location || "",
            latitude: incident.latitude || undefined,
            longitude: incident.longitude || undefined,
            occurredAt: formatDateTimeLocal(incident.occurredAt),
            reportedAt: formatDateTimeLocal(incident.reportedAt),
            carReadingId: incident.carReadingId?.toString() || undefined,
            resolutionNotes: incident.resolutionNotes || "",
            estimatedCost: incident.estimatedCost || undefined,
            actualCost: incident.actualCost || undefined,
            resolvedAt: incident.resolvedAt || undefined,
        },
    })

    const onSubmit: SubmitHandler<FormValues> = async (values) => {
        setSubmitting(true)
        try {
            const fd = new FormData()
            fd.append("id", String(incident.id))

            Object.entries(values).forEach(([key, val]) => {
                if (
                    val === undefined ||
                    val === null ||
                    (typeof val === "string" && val.trim() === "")
                ) {
                    return
                }
                if (typeof val === "object") {
                    fd.append(key, JSON.stringify(val))
                } else {
                    fd.append(key, String(val))
                }
            })

            await updateIncident({ id, data: fd })
            toast("Incident updated")

            router.push(`/fleetmanager/incidents/${id}`)
        } catch (err) {
            console.error(err)
            toast("Something went wrong")
        } finally {
            setSubmitting(false)
        }
    }

    const handleReset = () => {
        form.reset()
    }

    React.useEffect(() => {
        if (incident && incident.id) {
            form.reset({
                carId: incident.carId || 0,
                reportedById: incident.reportedById || 0,
                assignedToId: incident.assignedToId || 0,
                title: incident.title || "",
                description: incident.description || "",
                severity: incident.severity || "",
                status: incident.status || "",
                type: incident.type || "",
                location: incident.location || "",
                latitude: incident.latitude ?? undefined,
                longitude: incident.longitude ?? undefined,
                occurredAt: formatDateTimeLocal(incident.occurredAt),
                reportedAt: formatDateTimeLocal(incident.reportedAt),
                carReadingId: incident.carReadingId?.toString() ?? undefined,
                resolutionNotes: incident.resolutionNotes || "",
                estimatedCost: incident.estimatedCost ?? undefined,
                actualCost: incident.actualCost ?? undefined,
                resolvedAt: incident.resolvedAt ? formatDateTimeLocal(incident.resolvedAt) : "",
            })
        }
    }, [incident, form])

    return (
        <div className="w-full max-w-4xl mx-auto p-4 sm:p-6">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
                {/* Basic Information Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
                        <div className="sm:col-span-2 xl:col-span-1">
                            <CarDropdown form={form} />
                        </div>
                        <div className="sm:col-span-2 xl:col-span-1">
                            <UserDropdown form={form} fieldName="reportedById" label="Reported by" />
                        </div>
                        <div className="sm:col-span-2 xl:col-span-1">
                            <UserDropdown form={form} fieldName="assignedToId" label="Assigned to" />
                        </div>
                        <div className="sm:col-span-2 xl:col-span-1">
                            <Label htmlFor="carReadingId" className="text-sm font-medium text-gray-700">
                                Car Reading ID
                            </Label>
                            <Input
                                id="carReadingId"
                                placeholder="reading_456 (optional)"
                                className="mt-1"
                                {...form.register("carReadingId")}
                            />
                        </div>
                    </div>
                </div>

                {/* Incident Details Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Incident Details</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                            <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                                Title <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="title"
                                placeholder="Brief incident title"
                                className="mt-1"
                                {...form.register("title")}
                            />
                        </div>
                        <div>
                            <Label htmlFor="type" className="text-sm font-medium text-gray-700">
                                Type <span className="text-red-500">*</span>
                            </Label>
                            <Select value={form.watch("type")} onValueChange={(value) => form.setValue("type", value)}>
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Select incident type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ACCIDENT">Accident</SelectItem>
                                    <SelectItem value="BREAKDOWN">Breakdown</SelectItem>
                                    <SelectItem value="THEFT">Theft</SelectItem>
                                    <SelectItem value="VANDALISM">Vandalism</SelectItem>
                                    <SelectItem value="MAINTENANCE_ISSUE">Maintenance Issue</SelectItem>
                                    <SelectItem value="TRAFFIC_VIOLATION">Traffic Violation</SelectItem>
                                    <SelectItem value="FUEL_ISSUE">Fuel Issue</SelectItem>
                                    <SelectItem value="OTHER">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                            Description
                        </Label>
                        <Textarea
                            id="description"
                            placeholder="Provide a detailed description of what happened..."
                            rows={4}
                            className="mt-1 resize-vertical"
                            {...form.register("description")}
                        />
                    </div>
                </div>

                {/* Status and Priority Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Status & Priority</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        <div>
                            <Label htmlFor="severity" className="text-sm font-medium text-gray-700">
                                Severity <span className="text-red-500">*</span>
                            </Label>
                            <Select value={form.watch("severity")} onValueChange={(value) => form.setValue("severity", value)}>
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Select severity level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="LOW">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                            Low
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="MEDIUM">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                            Medium
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="HIGH">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                                            High
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="CRITICAL">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                            Critical
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="status" className="text-sm font-medium text-gray-700">
                                Status <span className="text-red-500">*</span>
                            </Label>
                            <Select value={form.watch("status")} onValueChange={(value) => form.setValue("status", value)}>
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="PENDING">Pending</SelectItem>
                                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                    <SelectItem value="RESOLVED">Resolved</SelectItem>
                                    <SelectItem value="CLOSED">Closed</SelectItem>
                                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="sm:col-span-2 lg:col-span-1">
                            <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                                Location
                            </Label>
                            <Input
                                id="location"
                                placeholder="Street address or area"
                                className="mt-1"
                                {...form.register("location")}
                            />
                        </div>
                    </div>
                </div>

                {/* Location & Timing Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Location & Timing</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        <div>
                            <Label htmlFor="latitude" className="text-sm font-medium text-gray-700">
                                Latitude
                            </Label>
                            <Input
                                id="latitude"
                                type="number"
                                step="any"
                                placeholder="e.g., 37.7749"
                                className="mt-1"
                                {...form.register("latitude")}
                            />
                        </div>
                        <div>
                            <Label htmlFor="longitude" className="text-sm font-medium text-gray-700">
                                Longitude
                            </Label>
                            <Input
                                id="longitude"
                                type="number"
                                step="any"
                                placeholder="e.g., -122.4194"
                                className="mt-1"
                                {...form.register("longitude")}
                            />
                        </div>
                        <div className="sm:col-span-2 lg:col-span-1">
                            <Label htmlFor="occurredAt" className="text-sm font-medium text-gray-700">
                                Occurred At
                            </Label>
                            <Input
                                id="occurredAt"
                                type="datetime-local"
                                className="mt-1"
                                {...form.register("occurredAt")}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                            <Label htmlFor="reportedAt" className="text-sm font-medium text-gray-700">
                                Reported At
                            </Label>
                            <Input
                                id="reportedAt"
                                type="datetime-local"
                                className="mt-1"
                                {...form.register("reportedAt")}
                            />
                        </div>
                        <div>
                            <Label htmlFor="resolvedAt" className="text-sm font-medium text-gray-700">
                                Resolved At
                            </Label>
                            <Input
                                id="resolvedAt"
                                type="datetime-local"
                                className="mt-1"
                                {...form.register("resolvedAt")}
                            />
                        </div>
                    </div>
                </div>

                {/* Costs and Resolution Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Costs & Resolution</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        <div>
                            <Label htmlFor="estimatedCost" className="text-sm font-medium text-gray-700">
                                Estimated Cost
                            </Label>
                            <div className="relative mt-1">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                                <Input
                                    id="estimatedCost"
                                    type="number"
                                    step="0.01"
                                    placeholder="250.00"
                                    className="pl-8"
                                    {...form.register("estimatedCost")}
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="actualCost" className="text-sm font-medium text-gray-700">
                                Actual Cost
                            </Label>
                            <div className="relative mt-1">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                                <Input
                                    id="actualCost"
                                    type="number"
                                    step="0.01"
                                    placeholder="220.00"
                                    className="pl-8"
                                    {...form.register("actualCost")}
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-2 lg:col-span-1">
                            <Label htmlFor="resolutionNotes" className="text-sm font-medium text-gray-700">
                                Resolution Notes
                            </Label>
                            <Input
                                id="resolutionNotes"
                                placeholder="How was it resolved?"
                                className="mt-1"
                                {...form.register("resolutionNotes")}
                            />
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 border-t">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleReset}
                        disabled={submitting}
                        className="w-full sm:w-auto"
                    >
                        Reset Changes
                    </Button>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        {onCancel && (
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={onCancel}
                                disabled={submitting}
                                className="w-full sm:w-auto"
                            >
                                Cancel
                            </Button>
                        )}
                        <Button
                            type="submit"
                            disabled={submitting}
                            className="w-full sm:w-auto min-w-[140px]"
                        >
                            {isPending ? "Updating..." : "Update Incident"}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    )
}