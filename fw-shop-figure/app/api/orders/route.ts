import prisma from '../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const orders = await prisma.order.findMany({
    orderBy: { id: "desc" },
    include: { items: true },
  });

  return NextResponse.json(orders);
}
