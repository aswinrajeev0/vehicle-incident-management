import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = 'nodejs';

export async function GET() {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, name: true },
        });
        return NextResponse.json(users);
    } catch (err: any) {
        return NextResponse.json({ error: err.message || "Failed to fetch users" }, { status: 500 });
    }
}
