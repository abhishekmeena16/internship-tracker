'use client';

import { useState, useEffect } from 'react';

export default function SearchBar({ value = '', onChange, placeholder = "Search by role, company, or skills..." }) {
  const [localValue, setLocalValue] = useState(value || '');

  useEffect(() => {
    setLocalValue(value || '');
  }, [value]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onChange) {
      onChange(localValue.trim());
    }
  };

  const handleClear = () => {
    setLocalValue('');
    if (onChange) {
      onChange('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto w-full flex items-center gap-2">
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </div>
        <input
          type="text"
          name="search"
          autoComplete="off"
          style={{ color: '#111827', backgroundColor: '#ffffff' }}
          className="block w-full pl-10 pr-10 py-3.5 border border-gray-300 rounded-xl leading-5 bg-white text-gray-900 font-medium placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-base transition-shadow shadow-md"
          placeholder={placeholder}
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
        />
        {localValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600"
            title="Clear search"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      <button 
        type="submit" 
        className="px-7 py-3.5 bg-blue-600 text-white font-semibold text-base rounded-xl hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-md flex-shrink-0 cursor-pointer"
      >
        Search
      </button>
    </form>
  );
}
