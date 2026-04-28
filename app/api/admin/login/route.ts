import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const admin = await prisma.user.findFirst({
    where: { email },
  });

  if (!admin || admin.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Akun admin tidak ditemukan.' }, { status: 400 });
  }

  const match = await bcrypt.compare(password, admin.password);
  if (!match) {
    return NextResponse.json({ error: 'Password salah.' }, { status: 400 });
  }

  // generate JWT
  const token = jwt.sign(
    {
      id: admin.id,
      email: admin.email,
      role: admin.role,
    },
    process.env.JWT_SECRET || "FWSECRET",
    { expiresIn: "1d" }
  );

  const response = NextResponse.json({
    message: "Login berhasil",
    user: {
      id: admin.id,
      email: admin.email,
      role: admin.role,
    },
  });

  // 🔥 PENTING: SET COOKIE YANG DIPAKAI DASHBOARD
  response.cookies.set(
    "fwshop-user",
    JSON.stringify({
      id: admin.id,
      email: admin.email,
      role: admin.role,
      token: token, // kalau mau simpan token juga
    }),
    {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24,
    }
  );

  return response;
}
