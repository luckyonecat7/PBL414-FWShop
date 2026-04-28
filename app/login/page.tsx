'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState(''); // username / email
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // autofill jika sebelumnya dicentang "Ingat Saya"
  useEffect(() => {
    const savedIdentifier = localStorage.getItem('fwshop-remember-identifier');
    if (savedIdentifier) {
      setIdentifier(savedIdentifier);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || 'Gagal login.');
        setLoading(false);
        return;
      }

      // bersihkan status login lama (guest/user sebelumnya)
      localStorage.removeItem('fwshop-user-type');

      // simpan status login (user resmi)
      localStorage.setItem('fwshop-logged-in', 'true');
      localStorage.setItem('fwshop-user', JSON.stringify(data.user));
      localStorage.setItem('fwshop-user-type', 'user');

      // simpan identifier jika "ingat saya" dicentang
      if (rememberMe) {
        localStorage.setItem('fwshop-remember-identifier', identifier);
      } else {
        localStorage.removeItem('fwshop-remember-identifier');
      }

      router.push('/');
    } catch (err) {
      console.error('Login gagal:', err);
      setError('Terjadi kesalahan server.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    // guest login: tidak bisa tambah ke keranjang
    localStorage.setItem('fwshop-logged-in', 'true');
    localStorage.setItem('fwshop-user-type', 'guest');
    localStorage.removeItem('fwshop-user');
    router.push('/');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary-dark to-gray-900 text-text-light px-4">
      <div className="bg-secondary-dark/60 backdrop-blur-lg p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">
        <h2 className="text-3xl font-extrabold text-center mb-4 text-accent">
          Welcome to FW SHOP!
        </h2>
        <p className="text-center text-sm text-text-dim mb-6">Login untuk melanjutkan</p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="identifier" className="block text-sm font-medium mb-2">
              Username / Email
            </label>
            <input
              id="identifier"
              name="identifier"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full p-3 rounded-md bg-primary-dark border border-gray-600 focus:border-accent focus:ring-2 focus:ring-accent outline-none text-text-light transition"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-md bg-primary-dark border border-gray-600 focus:border-accent focus:ring-2 focus:ring-accent outline-none text-text-light transition"
              required
            />

            {/* Bar yang menyamakan posisi "Ingat Saya" dan "Lupa password?" */}
            <div className="flex items-center justify-between mt-3">
              <label htmlFor="remember-me" className="inline-flex items-center cursor-pointer text-sm text-text-dim">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-accent border-gray-700 rounded bg-primary-dark focus:ring-accent"
                />
                <span className="ml-2 select-none">Ingat Saya</span>
              </label>

              <Link href="/forgot-password" className="text-sm text-accent hover:underline">
                Lupa password?
              </Link>
            </div>
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 mt-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''} bg-accent text-primary-dark font-bold rounded-md hover:bg-transparent hover:text-accent border-2 border-accent transition transform hover:scale-105`}
          >
            {loading ? 'Loading...' : 'LOGIN'}
          </button>
        </form>

        <button
          onClick={handleGuestLogin}
          className="w-full py-3 mt-3 bg-gray-600 text-white font-bold rounded-md hover:bg-gray-700 transition transform hover:scale-105"
        >
          LOGIN SEBAGAI GUEST
        </button>

        <p className="text-center text-sm text-text-dim mt-8">
          Belum punya akun?{' '}
          <Link href="/signup" className="text-accent font-semibold hover:underline">
            Sign up di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
