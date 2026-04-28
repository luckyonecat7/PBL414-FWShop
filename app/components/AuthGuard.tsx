'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = () => {
      // Periksa status login yang Anda simpan di localStorage
      // Di kode Navbar Anda, Anda menggunakan 'fwshop-logged-in' atau 'fwshop-user'
      const userLoggedInFlag = localStorage.getItem('fwshop-logged-in'); 
      const userData = localStorage.getItem('fwshop-user'); 

      // Tentukan apakah user dianggap login
      const isLoggedIn = userLoggedInFlag && userData; 

      if (pathname === '/login') {
        // Jika user sudah login tapi berada di halaman login, redirect ke Home
        if (isLoggedIn) {
            router.replace('/');
        } else {
            setIsAuthenticated(false);
            setIsLoading(false);
        }
        return;
      }

      // Jika halaman yang diakses adalah halaman yang dilindungi (selain /login)
      if (isLoggedIn) {
        setIsAuthenticated(true);
      } else {
        // Jika TIDAK ADA, langsung redirect ke halaman login
        // Gunakan .replace() agar halaman Home tidak masuk ke riwayat browser
        router.replace('/login');
        // Jangan set isAuthenticated = true di sini karena kita ingin mencegah rendering
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, [router, pathname]);

  // Tampilkan Loading/Splash Screen selama pengecekan status
  // Ini mencegah layar Home berkedip sebelum di-redirect
  if (isLoading || (pathname !== '/login' && !isAuthenticated)) {
    return (
        <div className="flex justify-center items-center h-screen bg-primary-dark text-white text-2xl">
            Memeriksa Status Login...
        </div>
    );
  }

  // Jika sudah terautentikasi ATAU sedang berada di halaman login (yang tidak butuh autentikasi), 
  // tampilkan konten halaman (children)
  return <>{children}</>;
}