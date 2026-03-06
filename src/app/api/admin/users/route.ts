import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const auth = req.headers.get("Authorization");
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const token = auth.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as { role: string };
    if (decoded.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    const usersWithScore = users.map(u => ({
      ...u,
      score: Math.floor(Math.random() * 500),
      league: "TRY",
      banned: false,
    }));

    return NextResponse.json({ users: usersWithScore });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
