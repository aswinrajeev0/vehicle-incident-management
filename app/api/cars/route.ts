import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = 'nodejs';

export async function GET() {
    try {
        const cars = await prisma.car.findMany({
            select: { id: true, make: true },
        });
        return NextResponse.json(cars);
    } catch (err: any) {
        return NextResponse.json({ error: err.message || "Failed to fetch cars" }, { status: 500 });
    }
}
