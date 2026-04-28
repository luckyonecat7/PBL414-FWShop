'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const validatePassword = (pw: string) => {
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(pw);
    const hasMinLength = pw.length >= 6;
    return hasSymbol && hasMinLength;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePassword(password)) {
      setError('Password minimal 6 karakter dan harus mengandung simbol seperti !@#$');
      setSuccess('');
      return;
    }

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Gagal mendaftar.');

      setSuccess('Akun berhasil dibuat! Mengarahkan ke login...');
      setError('');

      setTimeout(() => router.push('/login'), 2000);
    } catch (err: any) {
      setError(err.message);
      setSuccess('');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary-dark to-gray-900 text-text-light px-4">
      <div className="bg-secondary-dark/60 backdrop-blur-lg p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">
        <h2 className="text-3xl font-extrabold text-center mb-6 text-accent">
          Create Account
        </h2>
        <p className="text-center text-sm text-text-dim mb-8">
          Daftar untuk mulai berbelanja
        </p>

        <form onSubmit={handleSignup} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-2">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 rounded-md bg-primary-dark border border-gray-600 focus:border-accent focus:ring-2 focus:ring-accent outline-none text-text-light transition"
              placeholder="Masukkan username"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-md bg-primary-dark border border-gray-600 focus:border-accent focus:ring-2 focus:ring-accent outline-none text-text-light transition"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-md bg-primary-dark border border-gray-600 focus:border-accent focus:ring-2 focus:ring-accent outline-none text-text-light transition"
              placeholder="password"
              required
            />
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          {success && <p className="text-green-400 text-sm text-center">{success}</p>}

          <button
            type="submit"
            className="w-full py-3 mt-4 bg-accent text-primary-dark font-bold rounded-md hover:bg-transparent hover:text-accent border-2 border-accent transition transform hover:scale-105"
          >
            SIGN UP
          </button>
        </form>

        <p className="text-center text-sm text-text-dim mt-8">
          Sudah punya akun?{' '}
          <Link href="/login" className="text-accent font-semibold hover:underline">
            Login di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
