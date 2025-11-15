'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { competitionsApi } from '@/lib/api';

export default function CreateCompetitionPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [capacity, setCapacity] = useState(10);
  const [regDeadline, setRegDeadline] = useState('');
  const [startDate, setStartDate] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!user || user.role !== 'ORGANIZER') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-800 to-pink-500">
        <p className="text-white text-xl">You must be logged in as an Organizer to create competitions.</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Prepare tags as array of trimmed strings
    const tagsArr = tags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    try {
      await competitionsApi.create({
        title,
        description,
        tags: tagsArr,
        capacity,
        regDeadline,
        startDate: startDate || null,
      });
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create competition');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-800 to-pink-500 p-4">
      <div className="w-full max-w-3xl bg-white/90 rounded-3xl p-10 shadow-lg animate-fade-in">
        <h1 className="text-3xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-pink-500 select-none">
          Create a New Competition
        </h1>
        {error && (
          <p className="text-red-600 mb-4 font-semibold animate-shake">{error}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="font-bold text-black">
              Title <span className="text-red-600">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border rounded-md px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Competition title"
            />
          </div>
          <div>
            <label htmlFor="description" className="font-bold text-black">
              Description <span className="text-red-600">*</span>
            </label>
            <textarea
              id="description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full border rounded-md px-4 py-2 text-black resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Provide a detailed competition description"
            />
          </div>
          <div>
            <label htmlFor="tags" className="font-bold text-black">
              Tags (optional)
            </label>
            <input
              id="tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full border rounded-md px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Comma-separated tags, e.g. coding, ai, hackathon"
            />
          </div>
          <div className="flex gap-6">
            <div className="flex-1">
              <label htmlFor="capacity" className="font-bold text-black">
                Capacity <span className="text-red-600">*</span>
              </label>
              <input
                id="capacity"
                type="number"
                value={capacity}
                min={1}
                onChange={(e) => setCapacity(Number(e.target.value))}
                required
                className="w-full border rounded-md px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="regDeadline" className="font-bold text-black">
                Registration Deadline <span className="text-red-600">*</span>
              </label>
              <input
                id="regDeadline"
                type="date"
                value={regDeadline}
                onChange={(e) => setRegDeadline(e.target.value)}
                required
                className="w-full border rounded-md px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
          </div>
          <div>
            <label htmlFor="startDate" className="font-bold text-black">
              Start Date (optional)
            </label>
            <input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border rounded-md px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-pink-500 rounded-lg font-extrabold text-white hover:scale-105 active:scale-95 transition-transform disabled:bg-gray-400"
          >
            {loading ? 'Creating...' : 'Create Competition'}
          </button>
        </form>
      </div>
      <style>{`
            input, textarea {
            color: #000 !important;
            }
            input::selection, textarea::selection {
            background: #a7f3d0;
            color: #000;
            }             

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
