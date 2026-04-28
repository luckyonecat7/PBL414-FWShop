import prisma from '../../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request, { params }: any) {
  try {
    const id = Number(params.id);
    const body = await req.json();
    const { status } = body;

    const valid = ["PENDING", "PAID", "SHIPPED", "COMPLETED"];
    if (!valid.includes(status)) {
      return NextResponse.json({ error: "Status tidak valid" }, { status: 400 });
    }

    const result = await prisma.order.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Update gagal" }, { status: 500 });
  }
}
