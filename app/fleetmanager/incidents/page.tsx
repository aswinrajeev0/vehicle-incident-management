'use client';

import Link from "next/link"
import { Button } from "@/components/ui/button" // assuming you're using shadcn/ui
import { IncidentCards } from "@/components/incident-cards"
import { IncidentsTable } from "@/components/incidents-table"
import type { Incident } from "@/lib/types/incident"
import { useIncidents } from "@/hooks/useQuery"

export default function IncidentsPage() {
    const { data } = useIncidents()
    const incidents = (data?.items || []) as Incident[]

    return (
        <main className="mx-auto w-full max-w-6xl px-4 py-6">
            <header className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-pretty text-2xl font-semibold tracking-tight">Incidents</h1>
                    <p className="text-sm text-muted-foreground">
                        Browse and track reported incidents.
                    </p>
                </div>
                <div>
                    <Link href="/fleetmanager/incidents/new">
                        <Button>
                            + New Incident
                        </Button>
                    </Link>
                    &nbsp;
                    <Link href="/fleetmanager/incidents/stats">
                        <Button variant={"secondary"}>
                            Stats
                        </Button>
                    </Link>
                </div>
            </header>

            {/* Mobile: cards */}
            <section className="md:hidden" aria-label="Incidents (cards)">
                <IncidentCards incidents={incidents} />
            </section>

            {/* Desktop: table */}
            <section className="hidden md:block" aria-label="Incidents (table)">
                <IncidentsTable incidents={incidents} />
            </section>
        </main>
    )
}
