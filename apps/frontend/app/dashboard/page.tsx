'use client';

import { useEffect, useState } from 'react';
import { competitionsApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';


interface Competition {
  id: string;
  title: string;
  description: string;
  capacity: number;
  regDeadline: string;
  organizer: {
    name: string;
  };
  _count: {
    registrations: number;
  };
}

export default function DashboardPage() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchCompetitions() {
      try {
        const res = await competitionsApi.getAll();
        setCompetitions(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchCompetitions();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-800 to-pink-500">
        <span className="text-white text-2xl animate-pulse">Loading competitions...</span>
      </div>
    );
  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-800 to-pink-500">
        <span className="text-white text-xl">Please login to view competitions</span>
      </div>
    );

  return (
    <div className="min-h-screen px-4 py-8 bg-gradient-to-br from-blue-900 via-purple-800 to-pink-500">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-pink-400">
            Welcome, {user.name}
          </h1>
          {/* Show button only if Organizer */}
          {user.role === 'ORGANIZER' && (
            <Link
              href="/create-competition"
              className="px-6 py-2 ml-4 bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold rounded-lg shadow-md hover:scale-105 transition"
            >
              Create Competition
            </Link>
          )}
        </div>
        <h2 className="text-2xl font-bold text-white mb-8">Available Competitions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {competitions.map((c) => (
            <CompetitionCard key={c.id} competition={c} />
          ))}
        </div>
      </div>
    </div>
  );
}
function CompetitionCard({ competition }: { competition: Competition }) {
  return (
    <div className="rounded-2xl shadow-xl bg-white p-6 flex flex-col relative animate-fade-in hover:scale-[1.025] transition-transform duration-200">
      <h3 className="text-2xl font-bold mb-1 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-pink-500">
        {competition.title}
      </h3>
      <p className="text-gray-700 mb-2">{competition.description}</p>
      <div className="flex flex-wrap gap-3 items-center mb-3 mt-1">
        <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-xs font-semibold">
          Organizer: {competition.organizer.name}
        </span>
        <span className="px-2 py-0.5 rounded bg-pink-100 text-pink-700 text-xs font-semibold">
          Registered: {competition._count.registrations}/{competition.capacity}
        </span>
        <span className="px-2 py-0.5 rounded bg-green-100 text-green-700 text-xs font-semibold">
          Deadline: {new Date(competition.regDeadline).toLocaleDateString()}
        </span>
      </div>
      <RegisterButton competitionId={competition.id} />
    </div>
  );
}


function RegisterButton({ competitionId }: { competitionId: string }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleRegister() {
    setLoading(true);
    setMessage(null);
    try {
      // Generate a unique idempotency key
      const idempotencyKey = crypto.randomUUID();
      const res = await competitionsApi.register(competitionId, idempotencyKey);
      setMessage(res.data.message || 'Registered successfully');
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-4 flex flex-col items-start">
      <button
        onClick={handleRegister}
        disabled={loading}
        className="px-6 py-2 bg-gradient-to-r from-blue-600 to-pink-500 text-white font-bold rounded-lg shadow-md hover:scale-105 active:scale-95 hover:from-pink-500 hover:to-blue-600 transition-transform disabled:bg-gray-400"
      >
        {loading ? 'Registering...' : 'Register'}
      </button>
      {message && (
        <p className="mt-2 text-sm font-medium text-gray-700 animate-fade-in">
          {message}
        </p>
      )}
    </div>
  );
}



// ...rest of your code remains unchanged
