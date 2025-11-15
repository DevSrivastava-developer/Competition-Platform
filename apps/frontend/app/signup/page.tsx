'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('PARTICIPANT');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await signup(name, email, password, role);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-600 via-blue-600 to-purple-500">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-2xl bg-white/90 flex flex-col items-center animate-fade-in">
        <div className="flex items-center mb-6">
          <svg className="w-10 h-10 text-green-600 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5s-3 1.343-3 3 1.343 3 3 3zm0 2c-2.21 0-4 1.79-4 4v2h8v-2c0-2.21-1.79-4-4-4z"/>
          </svg>
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600 select-none">
            Sign Up
          </h1>
        </div>
        {error && (
          <p className="text-red-600 mb-4 font-semibold animate-shake">{error}</p>
        )}
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400 transition text-black"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <span className="absolute right-3 top-2.5 text-gray-400 pointer-events-none">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5s-3 1.343-3 3 1.343 3 3 3z"/>
              </svg>
            </span>
          </div>
          <div className="relative">
            <input
              type="email"
              placeholder="Email"
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <span className="absolute right-3 top-2.5 text-gray-400 pointer-events-none">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 12H8m0 0V8.832c0-.646.763-1.147 1.377-.805L12 10l2.623-1.973C15.237 7.685 16 8.186 16 8.832V12zm-4 0h8"/>
              </svg>
            </span>
          </div>
          <div className="relative">
            <input
              type="password"
              placeholder="Password"
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-400 transition text-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span className="absolute right-3 top-2.5 text-gray-400 pointer-events-none">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c1.657 0 3 1.343 3 3 0 .265-.035.52-.101.765M15.899 17.235A2.995 2.995 0 0112 17c-1.657 0-3-1.343-3-3a2.997 2.997 0 012.101-2.899"/>
              </svg>
            </span>
          </div>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border px-3 py-2 rounded text-black focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          >
            <option value="PARTICIPANT">Participant</option>
            <option value="ORGANIZER">Organizer</option>
          </select>
          <button
            type="submit"
            className="w-full py-2 mt-2 bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold rounded-lg shadow-md hover:scale-105 hover:from-blue-600 hover:to-green-600 transition-transform disabled:bg-gray-400"
          >
            Sign Up
          </button>
        </form>
        <div className="mt-4 text-sm text-gray-600">
          Already have an account?{' '}
          <a
            href="/login"
            className="underline text-blue-500 hover:text-green-500 transition"
          >
            Login
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
