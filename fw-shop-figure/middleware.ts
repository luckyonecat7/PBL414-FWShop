import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const cookie = req.cookies.get("fwshop-user");

  if (req.nextUrl.pathname.startsWith("/admin")) {
    if (req.nextUrl.pathname !== "/admin/login") {
      if (!cookie) {
        return NextResponse.redirect(new URL("/admin/login", req.url));
      }

      // cek role admin
      try {
        const data = JSON.parse(cookie.value);
        if (data.role !== "ADMIN") {
          return NextResponse.redirect(new URL("/", req.url));
        }
      } catch {
        return NextResponse.redirect(new URL("/admin/login", req.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
