'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import InternshipCard from './InternshipCard';

export default function CompanyInternshipsList({ internships, company }) {
  const { isAuthenticated } = useAuth();

  if (!internships || internships.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 sm:p-12 text-center border border-gray-200 shadow-sm max-w-3xl mx-auto">
        <div className="w-16 h-16 bg-slate-100 text-slate-600 border border-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-5 text-2xl shadow-inner">
          ⏳
        </div>
        <div className="inline-block px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold mb-3">
          Status: No Current Openings
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          No Active Internship Openings at {company.name} Currently
        </h3>
        <p className="text-gray-600 text-sm max-w-lg mx-auto mb-6 leading-relaxed">
          {company.name} does not have any active student internship requisitions open in India at this time. Applications for future batches or off-cycle roles will be updated here as soon as they open.
        </p>

        {company.careerUrl && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={company.careerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-all hover:scale-105"
            >
              <span>Visit Official {company.name} Careers Portal</span>
              <span>↗</span>
            </a>
            <Link
              href="/companies"
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm rounded-xl transition-colors"
            >
              Browse Actively Hiring Companies
            </Link>
          </div>
        )}
      </div>
    );
  }

  const displayedList = (internships || []).slice(0, 6);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Open Internships at {company.name}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {internships.length} active opening{internships.length === 1 ? '' : 's'} available in India
          </p>
        </div>
        <span className="text-xs font-bold text-blue-800 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
          {internships.length} Available Roles
        </span>
      </div>

      <div className="internship-grid">
        {displayedList.map((internship) => (
          <InternshipCard key={internship.id} internship={{ ...internship, company }} />
        ))}
      </div>

      {/* Alerts & Bookmarking call to action */}
      {!isAuthenticated && (
        <div className="mt-8 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white text-center shadow-lg border border-blue-800">
          <div className="w-12 h-12 bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-xl flex items-center justify-center mx-auto mb-3 text-xl">
            🔔
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold mb-2">
            Get Instant Job Alerts & Save Bookmarks
          </h3>
          <p className="text-blue-100 text-sm max-w-lg mx-auto mb-5 leading-relaxed">
            Create a free account with email OTP to track your application deadlines, save favorite roles, and receive alerts when {company.name} posts new internships.
          </p>
          <Link
            href={`/login?redirect=${encodeURIComponent(`/companies/${company.slug}`)}`}
            className="inline-block px-7 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm rounded-xl shadow-md transition-all hover:scale-105"
          >
            Create Free Account / Sign In →
          </Link>
        </div>
      )}
    </div>
  );
}
