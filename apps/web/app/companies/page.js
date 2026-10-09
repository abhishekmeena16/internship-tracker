'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchCompanies } from '../../lib/api';
import SearchBar from '../../components/SearchBar';
import EmptyState from '../../components/EmptyState';
import Link from 'next/link';

export default function CompaniesPage() {
  const [search, setSearch] = useState('');
  const [hiringFilter, setHiringFilter] = useState('ALL'); // 'ALL' | 'HIRING' | 'ZERO'
  const [selectedSector, setSelectedSector] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['companies', { q: search, sector: selectedSector }],
    queryFn: () => fetchCompanies({ q: search, sector: selectedSector || undefined }),
    placeholderData: (prev) => prev,
  });

  const allCompanies = data?.data || [];

  // Count metrics
  const totalCount = allCompanies.length;
  const hiringCount = useMemo(() => {
    return allCompanies.filter((c) => (c._count?.internships || 0) > 0).length;
  }, [allCompanies]);
  const zeroCount = totalCount - hiringCount;

  // Extract unique sectors
  const sectors = useMemo(() => {
    const set = new Set();
    allCompanies.forEach((c) => {
      if (c.sector) set.add(c.sector);
    });
    return Array.from(set).sort();
  }, [allCompanies]);

  // Filter based on active tab
  const displayedCompanies = useMemo(() => {
    return allCompanies.filter((c) => {
      const openings = c._count?.internships || 0;
      if (hiringFilter === 'HIRING') return openings > 0;
      if (hiringFilter === 'ZERO') return openings === 0;
      return true;
    });
  }, [allCompanies, hiringFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold mb-3">
          <span>🏢</span>
          <span>Verified Top {totalCount || 350} Tech Employers in India</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
          Explore Companies
        </h1>
        <p className="text-base sm:text-lg text-gray-600 mb-6">
          Track official application cycles across Big Tech, Indian unicorns, global fintechs, and GCCs.
        </p>

        {/* Search */}
        <div className="max-w-xl mx-auto mb-6">
          <SearchBar value={search} onChange={setSearch} placeholder="Search by company name (e.g. Google, Netflix, Zerodha)..." />
        </div>
      </div>

      {/* Filter Tabs & Sector Selector */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setHiringFilter('ALL')}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              hiringFilter === 'ALL'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Companies ({totalCount})
          </button>
          <button
            onClick={() => setHiringFilter('HIRING')}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
              hiringFilter === 'HIRING'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Actively Hiring ({hiringCount})
          </button>
          <button
            onClick={() => setHiringFilter('ZERO')}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
              hiringFilter === 'ZERO'
                ? 'bg-slate-700 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-gray-400"></span>
            No Current Openings ({zeroCount})
          </button>
        </div>

        {/* Sector dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Sector:</span>
          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-xs sm:text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          >
            <option value="">All Sectors</option>
            {sectors.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of Companies */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="h-36 bg-gray-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : displayedCompanies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedCompanies.map((company) => {
            const count = company._count?.internships || 0;
            const isHiring = count > 0;

            return (
              <Link key={company.id} href={`/companies/${company.slug}`} className="block group">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200/90 p-5 h-full transition-all duration-200 hover:shadow-md hover:border-blue-400 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-slate-100 group-hover:bg-blue-50 rounded-xl flex items-center justify-center text-xl font-bold text-blue-900 border border-slate-200 transition-colors">
                          {company.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                            {company.name}
                          </h3>
                          <p className="text-xs font-medium text-gray-500 mt-0.5">{company.sector || 'Technology'}</p>
                        </div>
                      </div>

                      {isHiring ? (
                        <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          {count} Openings
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-500 border border-gray-200 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap">
                          0 Openings
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <span>📍</span>
                      <span className="truncate max-w-[150px]">{company.hqCity || 'India'}</span>
                    </span>
                    {isHiring ? (
                      <span className="text-emerald-700 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                        Explore {count} Role{count > 1 ? 's' : ''} →
                      </span>
                    ) : (
                      <span className="text-blue-600 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                        View Details →
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <EmptyState
          message="No companies found"
          subMessage="Try adjusting your search query, sector, or status filter."
        />
      )}
    </div>
  );
}
