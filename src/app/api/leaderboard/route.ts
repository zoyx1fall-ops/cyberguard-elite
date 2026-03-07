import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

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
    const users = await prisma.user.findMany({
      where: { role: { not: "ADMIN" } },
      orderBy: { score: "desc" },
      select: { id: true, name: true, score: true },
    });

    const leaderboard = users.map((u, i) => ({
      rank: i + 1,
      name: u.name,
      score: u.score,
      league: getLeague(u.score),
    }));

    return NextResponse.json({ users: leaderboard });
  } catch {
    return NextResponse.json({ users: [] });
  }
}