import { NextResponse } from "next/server";
import prisma from '../../../lib/prisma';

// =====================
// GET — Ambil semua product
// =====================
export async function GET() {
  try {
    const products = await prisma.product.findMany();
    return NextResponse.json(products);
  } catch (err) {
    console.error("GET Product Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// =====================
// POST — Tambah product
// =====================
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, price, category, imageUrl, description, size, stock } = body;

    // VALIDASI WAJIB
    if (!name || !price || !category || !imageUrl || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        price: Number(price),
        category,
        imageUrl,
        description,
        size: size || null,
        stock: stock ? Number(stock) : 0,
      },
    });

    return NextResponse.json(product);
  } catch (err) {
    console.error("POST Product Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
