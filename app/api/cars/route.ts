import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = 'nodejs';

export async function GET() {
    try {
        const cars = await prisma.car.findMany({
            select: { id: true, make: true },
        });
        return NextResponse.json(cars);
    } catch (err: unknown) {
        if (err instanceof Error) {
            return NextResponse.json({ error: err.message }, { status: 500 });
        }
        return NextResponse.json({ error: "Failed to fetch cars" }, { status: 500 });
    }
}
