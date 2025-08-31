import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = 'nodejs';

export async function GET() {
    try {
        const readings = await prisma.carReading.findMany({
            select: { id: true },
        });
        return NextResponse.json(readings);
    } catch (err: any) {
        return NextResponse.json({ error: err.message || "Failed to fetch car readings" }, { status: 500 });
    }
}
