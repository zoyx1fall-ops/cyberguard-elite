import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const users = await prisma.user.findMany({
      where: { role: "USER" },
      orderBy: { createdAt: "asc" },
      select: { id: true, name: true, createdAt: true },
    });

    const leaderboard = users.map((u, i) => ({
      rank: i + 1,
      name: u.name,
      score: 0,
      league: "TRY",
    }));

    return NextResponse.json({ users: leaderboard });
  } catch {
    return NextResponse.json({ users: [] });
  }
}