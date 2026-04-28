import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { identifier, password } = await req.json();

    // hanya cari berdasarkan email (karena tidak ada username)
    const user = await prisma.user.findFirst({
      where: { email: identifier },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Akun belum terdaftar." },
        { status: 404 }
      );
    }

    // verifikasi hash password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Password salah." },
        { status: 401 }
      );
    }

    // login sukses
    return NextResponse.json(
      {
        message: "Login berhasil!",
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}
