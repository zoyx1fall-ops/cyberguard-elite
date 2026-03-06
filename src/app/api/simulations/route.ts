import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const scenarios = await prisma.scenario.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "asc" },
    });

    const parsed = scenarios.map((s) => ({
      ...s,
      steps: typeof s.steps === "string" ? JSON.parse(s.steps) : s.steps,
    }));

    return NextResponse.json({ scenarios: parsed });
  } catch {
    return NextResponse.json({ error: "Failed to fetch scenarios" }, { status: 500 });
  }
}