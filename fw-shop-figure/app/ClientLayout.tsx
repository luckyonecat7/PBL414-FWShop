'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname(); 
    // Menggunakan state ini untuk memblokir render konten sampai verifikasi selesai
    const [isAuthVerified, setIsAuthVerified] = useState(false); 

    // Daftar halaman yang TIDAK memerlukan login
    const publicPaths = ['/login', '/signup'];
    const isPublicPath = publicPaths.includes(pathname);
  
    useEffect(() => {
        const checkAuth = () => {
            const loggedIn = localStorage.getItem('fwshop-logged-in');
            
            // 1. Redirect ke Login jika belum login dan bukan halaman publik
            if (!loggedIn && !isPublicPath) {
                router.replace('/login'); 
                return; // Berhenti di sini, tidak perlu set isAuthVerified
            }
    
            // 2. Redirect ke Home jika sudah login dan mencoba mengakses halaman publik
            if (loggedIn && isPublicPath) {
                router.replace('/'); 
                return; // Berhenti di sini, tidak perlu set isAuthVerified
            }
            
            // 3. JIKA TIDAK ADA REDIRECT yang terjadi (Aman untuk render konten)
            setIsAuthVerified(true); 
        };
    
        checkAuth();
    }, [router, isPublicPath, pathname]);

    // Blokir render: Jika verifikasi belum selesai, kembalikan null (kosong/tidak terlihat).
    // Ini menghilangkan flicker karena browser tidak merender konten Home
    // sebelum keputusan redirect dibuat.
    if (!isAuthVerified) {
        return null; 
        // Anda juga bisa menggunakan: return <></>;
    }
    
    // Setelah verifikasi selesai (isAuthVerified = true), render children.
    // Navbar kini ada di app/(main)/layout.tsx, jadi di sini cukup children.
    return <>{children}</>;
}
