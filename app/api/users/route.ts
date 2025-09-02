import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = 'nodejs';

export async function GET() {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, name: true },
        });
        return NextResponse.json(users);
    } catch (err: unknown) {
        if (err instanceof Error) {
            return NextResponse.json({ error: err.message }, { status: 500 });
        }
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}
