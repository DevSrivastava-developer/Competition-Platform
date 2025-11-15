'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-800 via-purple-700 to-pink-500">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-2xl bg-white/90 flex flex-col items-center animate-fade-in">
        <div className="flex items-center mb-6">
          <svg
            className="w-10 h-10 text-blue-600 mr-2"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16 21v-2a4 4 0 00-8 0v2M12 11a4 4 0 100-8 4 4 0 000 8z"
            />
          </svg>
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-pink-500 select-none">
            Login
          </h1>
        </div>
        {error && (
          <p className="text-red-600 mb-4 font-semibold animate-shake">{error}</p>
        )}
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="relative">
           <input
            type="email"
            placeholder="Email"
             className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            />
            <input
             type="password"
            placeholder="Password"
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-400 transition text-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            />

            <span className="absolute right-3 top-2.5 text-gray-400 pointer-events-none">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 11c1.657 0 3 1.343 3 3 0 .265-.035.52-.101.765M15.899 17.235A2.995 2.995 0 0112 17c-1.657 0-3-1.343-3-3a2.997 2.997 0 012.101-2.899M21 12.84A9 9 0 003.055 6.26m1.69 2.793a9.017 9.017 0 010 9.895" /></svg>
            </span>
          </div>
          <button
            type="submit"
            className="w-full py-2 mt-2 bg-gradient-to-r from-blue-600 to-pink-500 text-white font-semibold rounded-lg shadow-md hover:scale-105 hover:from-pink-500 hover:to-blue-600 transition transform"
          >
            Log In
          </button>
        </form>
        <div className="mt-4 text-sm text-gray-600">
          Don't have an account?{' '}
          <a
            href="/signup"
            className="underline text-blue-500 hover:text-pink-500 transition"
          >
            Sign Up
          </a>
        </div>
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.98);}
          to { opacity: 1; transform: scale(1);}
        }
        .animate-fade-in {
          animation: fade-in 0.7s cubic-bezier(0.39, 0.575, 0.565, 1) forwards;
        }
        @keyframes shake {
          10%, 90% { transform: translateX(-1px);} 
          20%, 80% { transform: translateX(2px);} 
          30%, 50%, 70% { transform: translateX(-4px);} 
          40%, 60% { transform: translateX(4px);} 
        }
        .animate-shake {
          animation: shake 0.4s;
        }
      `}</style>
    </div>
  );
}
