import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

function getLeague(score: number) {
  if (score >= 3000) return "HACK GOD";
  if (score >= 1000) return "BIG SENIOR";
  if (score >= 400) return "SENIOR";
  if (score >= 100) return "JUNIOR";
  return "TRY";
}

export async function GET(req: NextRequest) {
  try {
    const auth = req.headers.get("Authorization");
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const token = auth.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as { role: string };
    if (decoded.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const users = await prisma.user.findMany({
      orderBy: { score: "desc" },
      select: { id: true, name: true, email: true, role: true, score: true, createdAt: true },
    });

    const result = users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      score: u.score,
      league: getLeague(u.score),
      banned: u.role === "BANNED",
      createdAt: u.createdAt,
    }));

    return NextResponse.json({ users: result });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}