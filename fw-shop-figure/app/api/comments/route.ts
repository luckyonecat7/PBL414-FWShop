import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

// GET comments
export async function GET() {
  try {
    const comments = await prisma.comment.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal ambil data" }, { status: 500 });
  }
}

// POST comment
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, message } = body;

    if (!name || !message) {
      return NextResponse.json(
        { error: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    const newComment = await prisma.comment.create({
      data: {
        name,
        message,
      },
    });

    return NextResponse.json(newComment);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal simpan" }, { status: 500 });
  }
}