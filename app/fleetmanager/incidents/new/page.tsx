import IncidentForm from "@/components/incident-form"

export const metadata = {
    title: "Create Incident",
}

export default function NewIncidentPage() {
    return (
        <main className="p-4 md:p-8">
            <div className="max-w-3xl mx-auto">
                <header className="mb-6">
                    <h1 className="text-2xl md:text-3xl font-semibold text-pretty">Create Incident</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Fill in the details and attach any images or documents. All fields available in the database are supported.
                    </p>
                </header>
                <IncidentForm />
            </div>
        </main>
    )
}
