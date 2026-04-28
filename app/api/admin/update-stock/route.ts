import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const role = req.headers.get("cookie")?.includes("role=ADMIN");

  if (!role) {
    return NextResponse.json(
      { error: "Anda tidak punya hak akses." },
      { status: 403 }
    );
  }

  const { productId, newStock } = await req.json();

  const updated = await prisma.product.update({
    where: { id: productId },
    data: { stock: newStock },
  });

  return NextResponse.json({
    message: "Stok berhasil diperbarui",
    updated,
  });
}
