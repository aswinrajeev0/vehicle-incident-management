import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = 'nodejs';

export async function GET() {
    try {
        const readings = await prisma.carReading.findMany({
            select: { id: true },
        });
        return NextResponse.json(readings);
    } catch (err: unknown) {
        if (err instanceof Error) {
            return NextResponse.json({ error: err.message }, { status: 500 });
        }
        return NextResponse.json({ error: "Failed to fetch car readings" }, { status: 500 });
    }
}
