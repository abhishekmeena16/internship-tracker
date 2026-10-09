'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchInternships, fetchCompanies } from '../lib/api';
import SearchBar from '../components/SearchBar';
import InternshipCard from '../components/InternshipCard';
import SkeletonList from '../components/Skeleton';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [heroSearch, setHeroSearch] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');

  // Fetch 24 verified internships for homepage showcase
  const { data: recentJobs, isLoading: jobsLoading } = useQuery({
    queryKey: ['recent-internships'],
    queryFn: () => fetchInternships({ limit: 24, sort: 'newest' }),
  });

  // Fetch top hiring companies that actually have active openings
  const { data: companiesData } = useQuery({
    queryKey: ['featured-companies'],
    queryFn: () => fetchCompanies({ limit: 18, hiringOnly: 'true', sort: 'openings' }),
  });

  const handleSearchSubmit = (query) => {
    if (query && query.trim()) {
      router.push(`/browse?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push('/browse');
    }
  };

  const topCategories = [
    { title: 'Software Engineering (SDE)', role: 'SDE', desc: 'Backend, Frontend, Full Stack & Systems', count: '250+ Roles', color: 'from-blue-600 to-indigo-600', icon: '💻' },
    { title: 'AI & Machine Learning', role: 'AI_ML', desc: 'Generative AI, Computer Vision, LLMs & NLP', count: '180+ Roles', color: 'from-purple-600 to-pink-600', icon: '🤖' },
    { title: 'Data Science & Analytics', role: 'DATA', desc: 'Predictive Modeling, BI & Data Engineering', count: '30+ Roles', color: 'from-emerald-600 to-teal-600', icon: '📊' },
    { title: 'Quant & Silicon Hardware', role: 'OTHER', desc: 'HFT Trading, Semiconductor & Firmware', count: '20+ Roles', color: 'from-amber-600 to-orange-600', icon: '⚡' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900">
      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-b from-blue-900 via-blue-800 to-indigo-900 text-white pt-20 pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-blue-500/10 blur-3xl pointer-events-none rounded-full" />
        
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-800/80 border border-blue-700 text-blue-200 text-xs sm:text-sm font-semibold mb-6 shadow-sm">
            <span>🇮🇳</span>
            <span>India&apos;s #1 Curated Tech Internship Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-6">
            Land Your Dream Internship at{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-cyan-200 to-teal-200">
              India&apos;s Top 350 Tech Firms
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-blue-100/90 max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
            Direct official application links. Verified Job IDs. Zero third-party spam. Find high-impact software engineering, AI/ML, and data roles across Bengaluru, Hyderabad, Pune, Mumbai, Delhi NCR, and remote.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-6">
            <SearchBar 
              value={heroSearch} 
              onChange={handleSearchSubmit} 
              placeholder="Search by role (e.g. SDE, Python), company (Google, CRED), or city..."
            />
          </div>

          {/* Quick filter chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm text-blue-100">
            <span className="text-blue-300 font-semibold mr-1">Trending:</span>
            {[
              { label: '🔥 SDE Internships', path: '/browse?role=SDE' },
              { label: '🤖 AI & Machine Learning', path: '/browse?role=AI_ML' },
              { label: '📍 Bengaluru Hub', path: '/browse?location=Bengaluru' },
              { label: '💻 Remote (India)', path: '/browse?remote=true' },
              { label: '🏢 Top 350 Companies', path: '/companies' },
            ].map((chip) => (
              <Link 
                key={chip.label} 
                href={chip.path}
                className="bg-blue-800/60 hover:bg-blue-700/80 border border-blue-700/80 px-3 py-1 rounded-full transition-colors font-medium"
              >
                {chip.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 2. LIVE METRICS BAR */}
      <section className="-mt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-16">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-gray-100">
          <div className="pt-2 md:pt-0">
            <p className="text-3xl sm:text-4xl font-black text-blue-700">100%</p>
            <p className="text-xs sm:text-sm font-semibold text-gray-500 mt-1 uppercase tracking-wider">Verified Working Links</p>
          </div>
          <div className="pt-4 md:pt-0">
            <p className="text-3xl sm:text-4xl font-black text-indigo-700">350</p>
            <p className="text-xs sm:text-sm font-semibold text-gray-500 mt-1 uppercase tracking-wider">Tracked Tech Firms</p>
          </div>
          <div className="pt-4 md:pt-0">
            <p className="text-3xl sm:text-4xl font-black text-emerald-600">110+</p>
            <p className="text-xs sm:text-sm font-semibold text-gray-500 mt-1 uppercase tracking-wider">Actively Hiring Now</p>
          </div>
          <div className="pt-4 md:pt-0">
            <p className="text-3xl sm:text-4xl font-black text-amber-600">₹40k–1.5L</p>
            <p className="text-xs sm:text-sm font-semibold text-gray-500 mt-1 uppercase tracking-wider">Real Monthly Stipends</p>
          </div>
        </div>
      </section>

      {/* 3. EXPLORE BY DOMAIN / ROLES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Explore by Tech Specialization</h2>
          <p className="text-gray-600 mt-3 text-base">
            Target high-impact roles aligned with your CSE coursework, personal projects, and competitive programming skills.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {topCategories.map((cat) => (
            <Link 
              key={cat.role} 
              href={`/browse?role=${cat.role}`}
              className="group bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                  {cat.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                  {cat.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">
                  {cat.desc}
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-100 text-xs font-bold text-blue-600">
                <span>{cat.count}</span>
                <span className="group-hover:translate-x-1 transition-transform">View Openings →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. FRESH OPPORTUNITIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-blue-700 text-sm font-bold uppercase tracking-wider mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Opportunities
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Latest India Internships</h2>
          </div>
          <Link
            href="/browse"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition-colors"
          >
            Browse All 150+ Open Roles →
          </Link>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-8 border-b border-gray-200 pb-4">
          {[
            { label: '🌟 All Featured', value: 'ALL' },
            { label: '💻 SDE & Full Stack', value: 'SDE' },
            { label: '🤖 AI & Machine Learning', value: 'AI_ML' },
            { label: '📊 Data Science & Eng', value: 'DATA' },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === tab.value
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {jobsLoading ? (
          <SkeletonList count={6} />
        ) : recentJobs?.data?.length > 0 ? (
          (() => {
            const displayed = recentJobs.data.filter((job) => {
              if (activeTab === 'ALL') return true;
              return job.roleCategory === activeTab;
            });

            return displayed.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayed.map((internship) => (
                  <InternshipCard key={internship.id} internship={internship} />
                ))}
              </div>
            ) : (
              <div className="bg-white p-12 text-center rounded-2xl border border-gray-200">
                <p className="text-gray-500 font-medium">No roles currently in this specialization. Explore full directory for more.</p>
              </div>
            );
          })()
        ) : (
          <div className="bg-white p-12 text-center rounded-2xl border border-gray-200">
            <p className="text-gray-500">Loading verified openings...</p>
          </div>
        )}

        <div className="mt-12 text-center flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/browse"
            className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm sm:text-base rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
          >
            Explore All 150+ Verified Openings on Directory →
          </Link>
          {!isAuthenticated && (
            <Link
              href="/login?redirect=/browse"
              className="w-full sm:w-auto px-7 py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm sm:text-base rounded-xl shadow-md transition-all hover:scale-105"
            >
              🔒 Sign In with OTP for 1-Click Apply →
            </Link>
          )}
        </div>
      </section>

      {/* 5. FEATURED COMPANIES CAROUSEL/GRID */}
      <section className="bg-white border-y border-gray-200 py-16 px-4 sm:px-6 lg:px-8 mb-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
            <div>
              <p className="text-xs font-bold text-blue-700 uppercase tracking-widest mb-1">Elite Employers</p>
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Top Companies Hiring in India</h2>
            </div>
            <Link href="/companies" className="text-sm font-bold text-blue-600 hover:underline">
              See All 350 Listed Companies →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {companiesData?.data?.slice(0, 18).map((comp) => (
              <Link
                key={comp.id}
                href={`/companies/${comp.slug}`}
                className="group p-4 bg-slate-50 hover:bg-blue-50/50 rounded-xl border border-gray-200/80 hover:border-blue-300 transition-all text-center flex flex-col items-center justify-center h-28"
              >
                <div className="w-10 h-10 rounded-lg bg-white shadow-xs border border-gray-100 flex items-center justify-center font-bold text-blue-800 text-lg mb-2 group-hover:scale-110 transition-transform">
                  {comp.name.charAt(0)}
                </div>
                <span className="font-bold text-xs text-gray-800 group-hover:text-blue-700 truncate max-w-full">
                  {comp.name}
                </span>
                <span className="text-[11px] text-gray-500 mt-0.5 font-medium">
                  {(comp._count?.internships || 0) > 0 ? `${comp._count.internships} openings` : '0 openings'}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 6. WHY CHOOSE INTERNSHIP TRACKER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Built Specifically for Engineering Students</h2>
          <p className="text-gray-600 mt-3 text-base">
            No aggregator spam, no expired listings, and no paywalls.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-gray-200/80 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center text-xl font-bold mb-5">
              🎯
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Direct Official Links</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Every apply button opens the company&apos;s verified recruitment portal. You never have to submit your resume through middleman websites.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-gray-200/80 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-xl font-bold mb-5">
              🏷️
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Verified Requisition Job IDs</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Every opening includes the official Job Requisition ID so you can easily reference it in cold emails, referral requests, or portal search bars.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-gray-200/80 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center text-xl font-bold mb-5">
              ⚡
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Passwordless Email OTP</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Register and log in in seconds with a single-use 6-digit email code. Bookmark target positions and manage upcoming deadlines effortlessly.
            </p>
          </div>
        </div>
      </section>

      {/* 7. CTA REGISTER BANNER */}
      {!isAuthenticated && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 rounded-3xl p-8 sm:p-12 text-white text-center shadow-xl relative overflow-hidden">
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-black mb-4">Never Miss an Application Window</h2>
              <p className="text-blue-100 text-base mb-8 leading-relaxed">
                Top companies like Google, Microsoft, and Goldman Sachs close their internship portals early. Sign up with your email to bookmark jobs and track deadlines.
              </p>
              <Link
                href="/login"
                className="inline-block px-8 py-4 bg-white text-blue-900 font-extrabold text-base rounded-xl shadow-md hover:bg-blue-50 transition-all hover:scale-105"
              >
                Sign In / Register with Email OTP →
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
