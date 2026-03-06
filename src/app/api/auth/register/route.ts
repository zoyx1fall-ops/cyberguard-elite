import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { z } from "zod";

const prisma = new PrismaClient();
const schema = z.object({ name: z.string().min(2), email: z.string().email(), password: z.string().min(8) });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password } = schema.parse(body);
    const exists = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (exists) return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({ data: { name, email: email.toLowerCase(), passwordHash } });
    return NextResponse.json({ success: true, userId: user.id });
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: "Invalid input: " + err.errors[0].message }, { status: 400 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
