import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function StatsSkeleton() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="pb-2">
                            <div className="h-4 w-28 bg-muted rounded" />
                        </CardHeader>
                        <CardContent>
                            <div className="h-8 w-24 bg-muted rounded" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[0, 1].map((i) => (
                    <Card key={i} className="min-h-[360px]">
                        <CardHeader>
                            <CardTitle>
                                <div className="h-5 w-48 bg-muted rounded" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                            <div className="h-full w-full bg-muted rounded" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
