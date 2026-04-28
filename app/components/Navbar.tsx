'use client';
import Link from 'next/link';
import { ShoppingCart, Menu, User, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const navItems = [
  { name: 'HOME', href: '/' },
  { name: 'ABOUT US', href: '/about' },
  { name: 'SHOP', href: '/shop' },
];

interface UserData {
  username: string;
  email: string;
}

export default function Navbar() {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('fwshop-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('fwshop-logged-in');
    localStorage.removeItem('fwshop-user');
    router.push('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-primary-dark shadow-xl border-b border-secondary-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex justify-between h-16 items-center">

          {/* Logo kiri */}
          <Link
            href="/"
            className="flex-shrink-0 text-2xl font-extrabold tracking-widest text-text-light hover:text-accent transition duration-300"
          >
            FW SHOP.
          </Link>

          {/* Menu tengah (benar-benar di tengah layar) */}
          <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="inline-flex items-center text-sm font-medium text-text-light hover:text-accent border-b-2 border-transparent hover:border-accent transition duration-300"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Kanan: Cart dan User */}
          <div className="flex items-center space-x-3 relative">
            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 hover:bg-secondary-dark rounded-full group transition duration-200"
            >
              <ShoppingCart
                size={20}
                className="text-text-light group-hover:scale-110 group-hover:text-accent"
              />
            </Link>

            {/* User dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="p-2 hover:bg-secondary-dark rounded-full group transition duration-200"
              >
                <User
                  size={20}
                  className="text-text-light group-hover:scale-110 group-hover:text-accent"
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-md shadow-lg p-3">
                  {user ? (
                    <div className="mb-2 text-sm text-text-light border-b border-gray-700 pb-2">
                      <p className="font-semibold">{user.username}</p>
                      <p className="text-xs text-text-dim">{user.email}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 mb-2">Guest</p>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-2 py-2 text-sm text-text-light hover:bg-gray-800 rounded"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Tombol menu mobile */}
            <button
              className="md:hidden p-2 hover:bg-secondary-dark rounded-full"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X size={20} className="text-text-light" />
              ) : (
                <Menu size={20} className="text-text-light" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-2 bg-primary-dark border-t border-secondary-dark p-3 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block text-text-light hover:text-accent transition"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
