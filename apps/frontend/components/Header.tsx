'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="w-full shadow-md bg-white/90 backdrop-blur-sm sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="font-bold text-2xl text-blue-700">
          CompeteApp
        </Link>

        <ul className="flex items-center space-x-6">
          {user ? (
            <>
              <li>
                <Link href="/dashboard" className="text-black hover:text-blue-600">
                  Dashboard
                </Link>
              </li>
              {/* {user.role === 'ORGANIZER' && (
                <li>
                  <Link href="/create-competition" className="text-black hover:text-blue-600">
                    Create Competition
                  </Link>
                </li>
              )} */}
              <li>
                <button
                  onClick={logout}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link href="/login" className="hover:text-green-600">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-green-600">
                  Sign Up
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
