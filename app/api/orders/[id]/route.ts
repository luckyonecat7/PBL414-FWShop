import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const { status } = await req.json();

    const updated = await prisma.order.update({
      where: { id: Number(id) },
      data: { status },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    console.error("ERROR UPDATE ORDER:", err);
    return NextResponse.json({ error: "Gagal update status order" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    const deleted = await prisma.order.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: "Order berhasil dihapus", deleted }, { status: 200 });
  } catch (err) {
    console.error("ERROR DELETE ORDER:", err);
    return NextResponse.json({ error: "Gagal menghapus order" }, { status: 500 });
  }
}
