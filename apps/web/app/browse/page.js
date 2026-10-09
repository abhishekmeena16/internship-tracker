'use client';

import { useState, useEffect, Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { fetchInternships } from '../../lib/api';
import SearchBar from '../../components/SearchBar';
import FilterPanel from '../../components/FilterPanel';
import InternshipCard from '../../components/InternshipCard';
import Pagination from '../../components/Pagination';
import SkeletonList from '../../components/Skeleton';
import EmptyState from '../../components/EmptyState';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

export default function Home() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500 font-medium">Loading opportunities...</div>}>
      <HomeContent />
    </Suspense>
  );
}

function HomeContent() {
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();
  
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);

  // Sync state from URL search params (e.g. from homepage hero or trending chips)
  useEffect(() => {
    const qParam = searchParams.get('q');
    const roleParam = searchParams.get('role');
    const degreeParam = searchParams.get('degree');
    const locParam = searchParams.get('location');
    const remoteParam = searchParams.get('remote');
    const companyParam = searchParams.get('company');

    if (qParam !== null && qParam !== undefined) {
      setSearch(qParam);
    }
    
    setFilters(prev => {
      const next = { ...prev };
      if (companyParam) next.company = companyParam;
      if (locParam) next.location = locParam;
      if (remoteParam !== null && remoteParam !== undefined) next.remoteOnly = remoteParam === 'true';
      if (roleParam) next.roles = roleParam.split(',').filter(Boolean);
      if (degreeParam) next.degrees = degreeParam.split(',').filter(Boolean);
      return next;
    });
  }, [searchParams]);

  const queryParams = {
    q: search || undefined,
    page,
    limit: 18,
    location: filters.location || undefined,
    remote: filters.remoteOnly ? 'true' : undefined,
    minStipend: filters.minStipend || undefined,
    role: filters.roles?.length ? filters.roles.join(',') : undefined,
    degree: filters.degrees?.length ? filters.degrees.join(',') : undefined,
    duration: filters.duration || undefined,
    company: filters.company || undefined,
    sort: sort || 'newest',
  };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['internships', queryParams],
    queryFn: () => fetchInternships(queryParams),
    placeholderData: (prev) => prev,
    staleTime: 30000,
  });

  const handleFilterChange = (key, value) => {
    if (key === 'clear') {
      setFilters({});
      setSearch('');
    } else {
      setFilters(prev => ({ ...prev, [key]: value }));
    }
    setPage(1);
  };

  const handleSearch = (val) => {
    setSearch(val);
    setPage(1);
  };

  const removeFilter = (key, valueToRemove = null) => {
    if (key === 'q') {
      setSearch('');
    } else if (key === 'roles' && valueToRemove) {
      setFilters(prev => ({
        ...prev,
        roles: (prev.roles || []).filter(r => r !== valueToRemove)
      }));
    } else if (key === 'degrees' && valueToRemove) {
      setFilters(prev => ({
        ...prev,
        degrees: (prev.degrees || []).filter(d => d !== valueToRemove)
      }));
    } else {
      setFilters(prev => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
    setPage(1);
  };

  const totalResults = data?.pagination?.total || 0;
  // Show all openings returned on current page
  const allOpenings = data?.data || [];
  const displayedOpenings = allOpenings;

  // Check if any filters are active
  const hasActiveFilters = Boolean(
    search ||
    filters.location ||
    filters.remoteOnly ||
    filters.minStipend ||
    (filters.roles && filters.roles.length > 0) ||
    (filters.degrees && filters.degrees.length > 0) ||
    filters.duration ||
    filters.company
  );

  return (
    <div className="pb-16 bg-slate-50 min-h-screen">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 shadow-md mb-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-800/80 border border-blue-700/80 text-blue-200 text-xs font-semibold mb-3 shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Live Automated Tracker Active • Monitored Every 2h Across 350 Companies</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-3 tracking-tight">
            Explore Tech Internship Openings
          </h1>
          <p className="text-base sm:text-lg text-blue-100 max-w-2xl mx-auto mb-8 font-normal">
            Direct apply links with official Job Requisition IDs. Filter by role, company, city, and stipend.
          </p>
          <SearchBar value={search} onChange={handleSearch} placeholder="Search by role (SDE, AI/ML), company (Google, CRED), or skills (Python, React)..." />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-1/4 flex-shrink-0">
            <FilterPanel filters={filters} onFilterChange={handleFilterChange} />
          </aside>

          {/* Main Content */}
          <section className="flex-1">
            {/* Header with Title, Result Count, and Sort Dropdown */}
            <div className="mb-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3 bg-white p-4 rounded-xl border border-gray-200/80 shadow-xs">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-gray-900">
                  {hasActiveFilters ? 'Filtered Opportunities' : 'All Verified Opportunities'}
                </h2>
                {!isLoading && data && (
                  <span className="text-xs font-bold text-blue-800 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full">
                    {totalResults} Verified Roles Available
                  </span>
                )}
              </div>

              {/* Sort Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-500">Sort:</span>
                <select
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value);
                    setPage(1);
                  }}
                  className="text-xs font-semibold bg-gray-50 border border-gray-300 rounded-lg px-2.5 py-1.5 text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="stipend">Highest Stipend</option>
                  <option value="deadline">Closing Soon</option>
                </select>
              </div>
            </div>

            {/* Active Filter Badges */}
            {hasActiveFilters && (
              <div className="mb-6 flex flex-wrap items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-gray-200/60 text-xs">
                <span className="font-semibold text-gray-500 mr-1">Active Filters:</span>
                {search && (
                  <span className="bg-blue-100 text-blue-800 px-2.5 py-1 rounded-md flex items-center gap-1 font-medium">
                    Search: &ldquo;{search}&rdquo;
                    <button onClick={() => removeFilter('q')} className="hover:text-blue-950 font-bold ml-1">×</button>
                  </span>
                )}
                {filters.company && (
                  <span className="bg-blue-100 text-blue-800 px-2.5 py-1 rounded-md flex items-center gap-1 font-medium capitalize">
                    Company: {filters.company}
                    <button onClick={() => removeFilter('company')} className="hover:text-blue-950 font-bold ml-1">×</button>
                  </span>
                )}
                {filters.location && (
                  <span className="bg-blue-100 text-blue-800 px-2.5 py-1 rounded-md flex items-center gap-1 font-medium">
                    Location: {filters.location}
                    <button onClick={() => removeFilter('location')} className="hover:text-blue-950 font-bold ml-1">×</button>
                  </span>
                )}
                {filters.remoteOnly && (
                  <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-md flex items-center gap-1 font-medium">
                    Remote Only
                    <button onClick={() => removeFilter('remoteOnly')} className="hover:text-emerald-950 font-bold ml-1">×</button>
                  </span>
                )}
                {filters.roles?.map(r => (
                  <span key={r} className="bg-purple-100 text-purple-800 px-2.5 py-1 rounded-md flex items-center gap-1 font-medium">
                    Role: {r}
                    <button onClick={() => removeFilter('roles', r)} className="hover:text-purple-950 font-bold ml-1">×</button>
                  </span>
                ))}
                {filters.degrees?.map(d => {
                  const degreeLabels = {
                    BTECH: 'B.Tech / B.E.',
                    MTECH: 'M.Tech / MS',
                    BCA_MCA: 'BCA / MCA',
                    BSC_MSC: 'B.Sc / M.Sc',
                    PHD: 'PhD / Doctoral'
                  };
                  return (
                    <span key={d} className="bg-indigo-100 text-indigo-800 px-2.5 py-1 rounded-md flex items-center gap-1 font-medium">
                      Degree: {degreeLabels[d] || d}
                      <button onClick={() => removeFilter('degrees', d)} className="hover:text-indigo-950 font-bold ml-1">×</button>
                    </span>
                  );
                })}
                {filters.minStipend && (
                  <span className="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-md flex items-center gap-1 font-medium">
                    Min ₹{Number(filters.minStipend).toLocaleString()}
                    <button onClick={() => removeFilter('minStipend')} className="hover:text-amber-950 font-bold ml-1">×</button>
                  </span>
                )}
                <button
                  onClick={() => handleFilterChange('clear', null)}
                  className="text-red-600 hover:text-red-800 underline font-semibold ml-auto"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Content List */}
            {isLoading ? (
              <SkeletonList count={6} />
            ) : isError ? (
              <div className="bg-white p-12 text-center rounded-2xl border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Unable to load opportunities</h3>
                <p className="text-gray-500 text-sm mb-4">Please check your connection or try again.</p>
                <button
                  onClick={() => refetch()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                >
                  Retry Loading
                </button>
              </div>
            ) : displayedOpenings.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayedOpenings.map(internship => (
                    <InternshipCard key={internship.id} internship={internship} />
                  ))}
                </div>

                {/* Pagination for all users */}
                <Pagination 
                  currentPage={page} 
                  totalPages={data.pagination?.totalPages || 1} 
                  onPageChange={setPage} 
                />

                {/* If guest, show persistent notification banner below pagination */}
                {!isAuthenticated && (
                  <div className="mt-10 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white text-center shadow-lg border border-blue-700/60 relative overflow-hidden">
                    <div className="inline-block px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold mb-3">
                      🔒 Tip: 1-Click Apply & Job Bookmarking
                    </div>
                    <h3 className="text-xl sm:text-2xl font-extrabold mb-2">
                      Sign In to Apply Directly with 1 Click
                    </h3>
                    <p className="text-blue-100 text-xs sm:text-sm max-w-xl mx-auto mb-5 leading-relaxed">
                      Register with your college email and OTP to unlock instant 1-click application redirection, save jobs to bookmarks, and receive automated notifications for new openings.
                    </p>
                    <Link
                      href={`/login?redirect=${encodeURIComponent('/browse')}`}
                      className="inline-block px-7 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm rounded-xl shadow-md transition-all hover:scale-105"
                    >
                      Sign In / Register with Email OTP →
                    </Link>
                  </div>
                )}
              </>
            ) : (
              <EmptyState
                message="No internships match your current filters"
                subMessage="Try clearing some filters, expanding your location, or searching for broader skills like SDE or Python."
              />
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
