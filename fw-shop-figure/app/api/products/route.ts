import { NextResponse } from "next/server";
import prisma from '../../../lib/prisma';

export async function GET() {
  const products = await prisma.product.findMany();
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, price, category, imageUrl, description, size, stock } = body;

    if (!name || !price || !category || !imageUrl || !description)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

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

  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
