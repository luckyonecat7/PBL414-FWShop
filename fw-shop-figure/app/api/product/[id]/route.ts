import { NextResponse } from "next/server";
import prisma from '../../../../lib/prisma';

// =====================
// PUT — Update product
// =====================
export async function PUT(req: Request, context: any) {
  const id = Number(context.params.id);
  const body = await req.json();

  try {
    const product = await prisma.product.update({
      where: { id },
      data: {
        name: body.name,
        price: Number(body.price),
        category: body.category,
        imageUrl: body.imageUrl,
        description: body.description,
        size: body.size,
        stock: Number(body.stock),
      },
    });

    return NextResponse.json(product);
  } catch (err) {
    console.error("PUT Product Error:", err);
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
}

// =====================
// DELETE — Hapus product
// =====================
export async function DELETE(req, context) {
  const { id } = context.params;
  const productId = Number(id);

  if (isNaN(productId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    await prisma.product.delete({ where: { id: productId } });
    return NextResponse.json({ message: "Product deleted" }, { status: 200 });
  } catch (err) {
    console.error("DELETE Product Error:", err);
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
}
