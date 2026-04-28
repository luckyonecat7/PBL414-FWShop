import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { address, total, cart } = body;

    if (!address || !address.name || !address.phone) {
      return NextResponse.json({ error: "Alamat tidak lengkap" }, { status: 400 });
    }

    if (!cart || cart.length === 0) {
      return NextResponse.json({ error: "Cart kosong" }, { status: 400 });
    }

    const order = await prisma.order.create({
      data: {
        customerName: address.name,
        customerPhone: address.phone,
        address: JSON.stringify(address),
        totalAmount: total,
        status: "PENDING",
        items: {
          create: cart.map((item: any) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: { items: true },
    });

    return NextResponse.json(order, { status: 201 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: true,
      },
      orderBy: {
        id: 'desc',
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
