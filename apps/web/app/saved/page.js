'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { fetchBookmarks } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import InternshipCard from '../../components/InternshipCard';
import SkeletonList from '../../components/Skeleton';

export default function SavedInternshipsPage() {
  const { token, isAuthenticated, isLoading: authLoading } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ['saved-bookmarks', token],
    queryFn: () => fetchBookmarks(token),
    enabled: !!token,
  });

  if (authLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="inline-block animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
        <p className="text-gray-500 font-medium">Checking authentication...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6">
          🔒
        </div>
        <h1 className="text-2xl font-black text-gray-900 mb-3">Sign in to Access Saved Internships</h1>
        <p className="text-gray-600 text-sm mb-8 leading-relaxed">
          Log in with your email verification code to track application deadlines, bookmark target firms, and manage your internship pipeline.
        </p>
        <Link
          href="/login"
          className="inline-block px-7 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all"
        >
          Sign In / Register with Email →
        </Link>
      </div>
    );
  }

  const savedList = (data?.data || []).filter((item) => item?.internship);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <Link href="/browse" className="inline-flex items-center text-sm font-semibold text-blue-700 hover:underline mb-3">
          ← Back to Browse Internships
        </Link>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Your Saved Internships</h1>
            <p className="text-gray-600 text-sm mt-1">
              Positions you&apos;ve bookmarked for upcoming deadlines.
            </p>
          </div>
          <span className="bg-blue-50 text-blue-700 font-bold px-3 py-1 rounded-lg text-sm border border-blue-100">
            {savedList.length} Saved {savedList.length === 1 ? 'Role' : 'Roles'}
          </span>
        </div>
      </div>

      {isLoading ? (
        <SkeletonList count={4} />
      ) : savedList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedList.map((item) => (
            <InternshipCard
              key={item.id}
              internship={item.internship}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
            📌
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No Saved Internships Yet</h2>
          <p className="text-gray-500 text-sm mb-6">
            Browse through verified active opportunities across 350 top companies and save your favorites.
          </p>
          <Link
            href="/browse"
            className="inline-block px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all"
          >
            Explore Opportunities →
          </Link>
        </div>
      )}
    </div>
  );
}
