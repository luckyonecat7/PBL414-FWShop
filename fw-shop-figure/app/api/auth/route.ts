// app/api/auth/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeLog } from '../../../lib/logWriter';

// Dummy data user (untuk simulasi)
const VALID_ADMIN = { username: "admin", password: "S0c_P@ss" };
const VALID_USER = { username: "user", password: "user123" };

// Fungsi untuk mendapatkan IP (sederhana)
const getUserIP = (req: NextRequest): string => {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "127.0.0.1"
  );
};

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    const userIP = getUserIP(req);

    // 1. Deteksi Serangan SQL Injection
    if (password.includes("' OR '1'='1") || password.includes("union select")) {
      writeLog({
        level: "ATTACK",
        action: "SQL_INJECTION_ATTEMPT",
        ip: userIP,
        user: username,
        payload: { input: password, endpoint: '/api/auth' }
      });
      return NextResponse.json({ message: "Request blocked: Malicious pattern detected." }, { status: 403 });
    }

    // 2. Login Berhasil (Admin - Log CRITICAL)
    if (username === VALID_ADMIN.username && password === VALID_ADMIN.password) {
      writeLog({
        level: "CRITICAL",
        action: "ADMIN_LOGIN_SUCCESS",
        ip: userIP,
        user: username
      });
      return NextResponse.json({ message: "Login Berhasil (Admin)" }, { status: 200 });
    }
    
    // 3. Login Berhasil (User - Log INFO)
    if (username === VALID_USER.username && password === VALID_USER.password) {
      writeLog({
        level: "INFO",
        action: "USER_LOGIN_SUCCESS",
        ip: userIP,
        user: username
      });
      return NextResponse.json({ message: "Login Berhasil" }, { status: 200 });
    } 
    
    // 4. Login Gagal (Log WARNING)
    writeLog({
      level: "WARNING",
      action: "LOGIN_FAILED",
      ip: userIP,
      user: username,
      payload: { reason: "Invalid credentials" }
    });
    return NextResponse.json({ message: "Username atau Password salah." }, { status: 401 });

} catch (error) {
    // Memberi tahu TypeScript untuk memperlakukan error sebagai objek Error standar
    const errorMessage = (error instanceof Error) ? error.message : "An unknown API error occurred";

    writeLog({
      level: "ERROR",
      action: "API_AUTH_ERROR",
      ip: getUserIP(req),
      payload: { error: errorMessage } // <--- SEKARANG BENAR
    });
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}