'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) return setError(data.error || 'Login gagal');

    data.user.role === 'ADMIN'
      ? router.push('/admin')
      : router.push('/');
  };

  return (
    <div 
      className="flex flex-col items-center justify-center min-h-screen text-[#e0e1dd] bg-[#1e1e1e] px-4"
    >
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-2">Selamat Datang Admin!</h1>
        <p className="text-[#778da9] text-sm">Masukkan akun admin untuk melanjutkan.</p>
      </div>

      {/* Card Login */}
      <form 
        onSubmit={handleLogin}
        className="w-full max-w-sm bg-[#1b263b] border border-[#415a77] rounded-2xl p-8 shadow-xl"
      >
        <h2 className="text-2xl font-semibold text-center mb-6">
           Admin Login
        </h2>

        <input
          type="email"
          placeholder="Email Admin"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 rounded bg-[#415a77] text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-[#778da9]"
          required
        />

        <input
          type="password"
          placeholder="Password Admin"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 rounded bg-[#415a77] text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-[#778da9]"
          required
        />

        {error && (
          <p className="text-red-400 text-sm mb-3 text-center">{error}</p>
        )}

        <button
          type="submit"
          className="w-full p-3 rounded-xl font-bold bg-[#778da9] hover:bg-[#415a77] transition"
        >
          Login Admin
        </button>
      </form>

      {/* Footer biar tidak kosong */}
      <p className="text-xs text-[#6c7a89] mt-10">
        © {new Date().getFullYear()} Admin Panel — FW SHOP
      </p>
    </div>
  );
}
