"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Image, FileText } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import UserDropdown from "./user-dropdown"
import CarDropdown from "./car-dropdown"
import { useCreateIncident } from "@/hooks/useQuery"
import { FileUploadArea } from "./file-upload-area"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { FormValues, schema } from "@/lib/validators/form.validator"

export default function IncidentForm() {
    const router = useRouter()
    const [submitting, setSubmitting] = React.useState(false)
    const [images, setImages] = React.useState<File[]>([])
    const [documents, setDocuments] = React.useState<File[]>([])
    const { mutateAsync: createIncident, isPending } = useCreateIncident()

    const form = useForm<FormValues>({
        resolver: zodResolver(schema) as any,
        defaultValues: {
            carId: 0,
            reportedById: 0,
            assignedToId: 0,
            title: "",
            description: "",
            severity: "",
            status: "",
            type: "",
            location: "",
            latitude: undefined,
            longitude: undefined,
            occurredAt: "",
            reportedAt: "",
            carReadingId: undefined,
            resolutionNotes: "",
            estimatedCost: undefined,
            actualCost: undefined,
            resolvedAt: "",
        },
    })

    React.useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    form.setValue("latitude", position.coords.latitude)
                    form.setValue("longitude", position.coords.longitude)
                },
                (error) => {
                    console.error("Error getting location:", error)
                },
                { enableHighAccuracy: true }
            )
        } else {
            console.warn("Geolocation is not supported by this browser.")
        }
    }, [form])

    const onSubmit = async (values: FormValues) => {
        setSubmitting(true)
        try {
            const fd = new FormData()

            Object.entries(values).forEach(([key, val]) => {
                if (
                    val === undefined ||
                    val === null ||
                    (typeof val === "string" && val.trim() === "")
                ) {
                    return
                }
                if (key === "images" || key === "documents") return

                if (typeof val === "object") {
                    fd.append(key, JSON.stringify(val))
                } else {
                    fd.append(key, String(val))
                }
            })
            images.forEach((file) => fd.append("images", file))
            documents.forEach((file) => fd.append("documents", file))

            await createIncident(fd)

            toast("Incident created")
            form.reset()
            setImages([])
            setDocuments([])
            router.push("/fleetmanager/incidents")
        } catch (err: any) {
            console.error(err)
            toast("Unable to create incident")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* IDs and basic info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <CarDropdown form={form} />
                </div>
                <div>
                    <UserDropdown form={form} fieldName="reportedById" label="Reported by" />
                </div>
                <div>
                    <UserDropdown form={form} fieldName="assignedToId" label="Assigned to" />
                </div>
                <div>
                    <Label htmlFor="carReadingId">Car Reading ID</Label>
                    <Input id="carReadingId" placeholder="reading_456 (optional)" {...form.register("carReadingId")} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" placeholder="Brief incident title" {...form.register("title")} />
                    {form.formState.errors.title && (
                        <p className="text-sm text-destructive mt-1">{form.formState.errors.title.message}</p>
                    )}
                </div>
                <div>
                    <Label htmlFor="type">Type</Label>
                    <Select value={form.watch("type")} onValueChange={(value) => form.setValue("type", value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ACCIDENT">Accident</SelectItem>
                            <SelectItem value="BREAKDOWN">Breakdown</SelectItem>
                            <SelectItem value="THEFT">Theft</SelectItem>
                            <SelectItem value="VANDALISM">Vandalism</SelectItem>
                            <SelectItem value="MAINTENANCE_ISSUE">Maintenance issue</SelectItem>
                            <SelectItem value="TRAFFIC_VIOLATION">Traffic violation</SelectItem>
                            <SelectItem value="FUEL_ISSUE">Fuel issue</SelectItem>
                            <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Describe what happened…" rows={4} {...form.register("description")} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <Label htmlFor="severity">Severity</Label>
                    <Select value={form.watch("severity")} onValueChange={(value) => form.setValue("severity", value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select severity level" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="LOW">Low</SelectItem>
                            <SelectItem value="MEDIUM">Medium</SelectItem>
                            <SelectItem value="HIGH">High</SelectItem>
                            <SelectItem value="CRITICAL">Critical</SelectItem>
                        </SelectContent>
                    </Select>
                    {form.formState.errors.severity && (
                        <p className="text-sm text-destructive mt-1">{form.formState.errors.severity.message}</p>
                    )}
                </div>
                <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={form.watch("status")} onValueChange={(value) => form.setValue("status", value)}>
                        <SelectTrigger>
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
                    {form.formState.errors.status && (
                        <p className="text-sm text-destructive mt-1">{form.formState.errors.status.message}</p>
                    )}
                </div>
                <div>
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" placeholder="Street / area (optional)" {...form.register("location")} />
                </div>
            </div>

            {/* Geo and timing */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input id="latitude" type="number" step="any" placeholder="e.g., 37.7749" {...form.register("latitude")} />
                </div>
                <div>
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input id="longitude" type="number" step="any" placeholder="-122.4194" {...form.register("longitude")} />
                </div>
                <div>
                    <Label htmlFor="occurredAt">Occurred At</Label>
                    <Input id="occurredAt" type="datetime-local" {...form.register("occurredAt")} />
                    {form.formState.errors.occurredAt && (
                        <p className="text-sm text-destructive mt-1">{form.formState.errors.occurredAt.message}</p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="reportedAt">Reported At</Label>
                    <Input id="reportedAt" type="datetime-local" {...form.register("reportedAt")} />
                    <p className="text-xs text-muted-foreground mt-1">If omitted, server will use current time.</p>
                </div>
                <div>
                    <Label htmlFor="resolvedAt">Resolved At</Label>
                    <Input id="resolvedAt" type="datetime-local" {...form.register("resolvedAt")} />
                </div>
            </div>

            {/* Costs and resolution */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <Label htmlFor="estimatedCost">Estimated Cost</Label>
                    <Input
                        id="estimatedCost"
                        type="number"
                        step="0.01"
                        placeholder="e.g., 250.00"
                        {...form.register("estimatedCost")}
                    />
                </div>
                <div>
                    <Label htmlFor="actualCost">Actual Cost</Label>
                    <Input
                        id="actualCost"
                        type="number"
                        step="0.01"
                        placeholder="e.g., 220.00"
                        {...form.register("actualCost")}
                    />
                </div>
                <div className="md:col-span-1 col-span-1">
                    <Label htmlFor="resolutionNotes">Resolution Notes</Label>
                    <Input
                        id="resolutionNotes"
                        placeholder="How it was resolved (optional)"
                        {...form.register("resolutionNotes")}
                    />
                </div>
            </div>

            {/* Enhanced File Upload Areas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <Label className="text-base font-medium mb-3 block">Images</Label>
                    <FileUploadArea
                        files={images}
                        onFilesChange={setImages}
                        accept="image/*"
                        label="Upload Images"
                        icon={<Image className="h-8 w-8 text-muted-foreground" />}
                        description="Upload incident photos (JPEG, PNG, etc.)"
                    />
                </div>

                <div>
                    <Label className="text-base font-medium mb-3 block">Documents</Label>
                    <FileUploadArea
                        files={documents}
                        onFilesChange={setDocuments}
                        label="Upload Documents"
                        icon={<FileText className="h-8 w-8 text-muted-foreground" />}
                        description="Upload reports, receipts, or other documents"
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                        form.reset()
                        setImages([])
                        setDocuments([])
                    }}
                    disabled={submitting}
                >
                    Reset
                </Button>
                <Button type="submit" disabled={submitting}>
                    {isPending ? "Creating..." : "Create Incident"}
                </Button>
            </div>
        </form>
    )
}