import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const pack = url.searchParams.get("pack");

  const mascots = await prisma.mascot.findMany({
    where: pack ? { pack } : undefined,
    orderBy: [{ pack: "asc" }, { name: "asc" }],
  });
  return NextResponse.json(mascots);
}
