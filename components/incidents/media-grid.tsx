"use client"

import Image from "next/image"
import { Card } from "@/components/ui/card"
import { lastSegment } from "@/lib/format"

export function MediaGrid({
    images = [],
    documents = [],
}: {
    images?: string[] | null
    documents?: string[] | null
}) {
    const safeImages = images?.filter(Boolean) ?? []
    const safeDocs = documents?.filter(Boolean) ?? []

    if (safeImages.length === 0 && safeDocs.length === 0) {
        return <Card className="p-4 text-sm text-gray-500">No media attached.</Card>
    }

    return (
        <div className="flex flex-col gap-6">
            {safeImages.length > 0 && (
                <div className="flex flex-col gap-3">
                    <h3 className="text-sm font-medium text-gray-900">Images</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {safeImages.map((src, idx) => (
                            <Card key={src + idx} className="overflow-hidden">
                                <div className="relative w-full h-48">
                                    <Image
                                        src={src || "/placeholder.svg?height=192&width=320&query=Incident%20image"} // hard-coded query as required
                                        alt="Incident image"
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        priority={idx === 0}
                                    />
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {safeDocs.length > 0 && (
                <div className="flex flex-col gap-3">
                    <h3 className="text-sm font-medium text-gray-900">Documents</h3>
                    <ul className="flex flex-col gap-2">
                        {safeDocs.map((href, idx) => (
                            <li key={href + idx}>
                                <a
                                    className="text-sm text-blue-700 hover:underline break-all"
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {lastSegment(href)}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}
