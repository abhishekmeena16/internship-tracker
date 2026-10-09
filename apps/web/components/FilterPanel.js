'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchCompanies } from '../lib/api';

const roleOptions = [
  { label: 'SDE', value: 'SDE' },
  { label: 'Data', value: 'DATA' },
  { label: 'AI / ML', value: 'AI_ML' },
  { label: 'Other', value: 'OTHER' },
];

const degreeOptions = [
  { label: 'B.Tech / B.E.', value: 'BTECH', icon: '🎓' },
  { label: 'M.Tech / M.E. / MS', value: 'MTECH', icon: '🎓' },
  { label: 'BCA / MCA', value: 'BCA_MCA', icon: '💻' },
  { label: 'B.Sc / M.Sc', value: 'BSC_MSC', icon: '📊' },
  { label: 'PhD / Doctoral', value: 'PHD', icon: '🔬' },
];

export default function FilterPanel({ filters, onFilterChange }) {
  const { data: companiesData } = useQuery({
    queryKey: ['companies-filter'],
    queryFn: () => fetchCompanies({ hiringOnly: 'true', limit: 200 }),
  });

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm sticky top-24">
      <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Filters</h2>

      {/* Remote Toggle */}
      <div className="mb-6 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Remote Only</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={filters.remoteOnly || false}
            onChange={(e) => onFilterChange('remoteOnly', e.target.checked)}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      {/* Company Filter */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Company</h3>
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
          value={filters.company || ''}
          onChange={(e) => onFilterChange('company', e.target.value)}
        >
          <option value="">All Companies</option>
          {companiesData?.data
            ?.filter(c => (c._count?.internships || 0) > 0)
            ?.map(c => (
              <option key={c.slug} value={c.slug}>
                {c.name} ({c._count.internships})
              </option>
            ))}
        </select>
      </div>

      {/* Location Filter */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Location (India)</h3>
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
          value={filters.location || ''}
          onChange={(e) => onFilterChange('location', e.target.value)}
        >
          <option value="">All Indian Cities</option>
          <option value="Bengaluru">Bengaluru / Bangalore</option>
          <option value="Hyderabad">Hyderabad</option>
          <option value="Pune">Pune</option>
          <option value="Mumbai">Mumbai</option>
          <option value="Gurgaon">Gurgaon / Gurugram</option>
          <option value="Noida">Noida / Greater Noida</option>
          <option value="Chennai">Chennai</option>
          <option value="Delhi">Delhi NCR</option>
        </select>
      </div>

      {/* Role Category */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Role Category</h3>
        <div className="space-y-2">
          {roleOptions.map(({ label, value }) => (
            <label key={value} className="flex items-center text-sm text-gray-600 hover:text-gray-900 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 mr-2"
                checked={filters.roles?.includes(value) || false}
                onChange={(e) => {
                  const currentRoles = filters.roles || [];
                  const newRoles = e.target.checked
                    ? [...currentRoles, value]
                    : currentRoles.filter(r => r !== value);
                  onFilterChange('roles', newRoles);
                }}
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      {/* Target Degree / Student Eligibility */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center justify-between">
          <span>Target Degree / Eligibility</span>
          {filters.degrees?.length > 0 && (
            <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
              {filters.degrees.length} selected
            </span>
          )}
        </h3>
        <div className="space-y-2">
          {degreeOptions.map(({ label, value, icon }) => (
            <label key={value} className="flex items-center text-sm text-gray-600 hover:text-gray-900 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 mr-2"
                checked={filters.degrees?.includes(value) || false}
                onChange={(e) => {
                  const current = filters.degrees || [];
                  const newDegrees = e.target.checked
                    ? [...current, value]
                    : current.filter(d => d !== value);
                  onFilterChange('degrees', newDegrees);
                }}
              />
              <span className="mr-1.5">{icon}</span>
              <span>{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Minimum Stipend */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Min Stipend (₹/mo)</h3>
        <input
          type="number"
          placeholder="e.g. 10000"
          style={{ color: '#111827', backgroundColor: '#ffffff' }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
          value={filters.minStipend || ''}
          onChange={(e) => onFilterChange('minStipend', e.target.value)}
        />
      </div>

      {/* Duration Filter */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Duration (months)</h3>
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
          value={filters.duration || ''}
          onChange={(e) => onFilterChange('duration', e.target.value)}
        >
          <option value="">Any</option>
          <option value="1">1 month</option>
          <option value="2">2 months</option>
          <option value="3">3 months</option>
          <option value="6">6 months</option>
        </select>
      </div>

      {/* Clear Filters */}
      <button
        onClick={() => onFilterChange('clear', null)}
        className="w-full py-2 text-sm text-blue-700 font-medium bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  );
}
