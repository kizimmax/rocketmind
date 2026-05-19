import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth";

export async function GET(request: Request) {
  const gate = await requirePermission(request, "programs.places", "VIEW");
  if (gate instanceof NextResponse) return gate;
  const places = await prisma.place.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json(places);
}
