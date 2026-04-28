import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    const deleted = await prisma.product.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: "Produk berhasil dihapus", deleted }, { status: 200 });
  } catch (err) {
    console.error("ERROR DELETE PRODUCT:", err);
    return NextResponse.json(
      { error: "Gagal menghapus produk" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const data = await req.json();

    const updated = await prisma.product.update({
      where: { id: Number(id) },
      data,
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    console.error("ERROR UPDATE PRODUCT:", err);
    return NextResponse.json(
      { error: "Gagal update produk" },
      { status: 500 }
    );
  }
}
