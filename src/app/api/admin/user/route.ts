import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

function checkAdmin(req: NextRequest) {
  const auth = req.headers.get("Authorization");
  if (!auth) return false;
  try {
    const decoded = jwt.verify(auth.replace("Bearer ", ""), process.env.JWT_SECRET || "secret") as { role: string };
    return decoded.role === "ADMIN";
  } catch { return false; }
}

export async function DELETE(req: NextRequest) {
  if (!checkAdmin(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { userId } = await req.json();
  await prisma.user.delete({ where: { id: userId } });
  return NextResponse.json({ success: true });
}

export async function PATCH(req: NextRequest) {
  if (!checkAdmin(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { userId, action, amount } = await req.json();

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  if (action === "ban") {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { role: user.role === "BANNED" ? "USER" : "BANNED" },
    });
    return NextResponse.json({ success: true, user: updated });
  }

  if (action === "addPoints" || action === "removePoints") {
    const delta = action === "addPoints" ? amount : -amount;
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { score: { increment: delta } },
    });
    return NextResponse.json({ success: true, user: updated });
  }

  if (action === "resetPoints") {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { score: 0 },
    });
    return NextResponse.json({ success: true, user: updated });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}