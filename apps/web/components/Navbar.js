'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-blue-900 text-white shadow-md sticky top-0 z-50 border-b border-blue-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="font-extrabold text-xl tracking-tight flex items-center gap-2.5">
              <span className="bg-white text-blue-900 rounded-lg p-1.5 shadow-sm font-black">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </span>
              <span>Internship Tracker</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-7">
            <Link href="/" className="text-blue-100 hover:text-white font-semibold text-sm transition-colors">
              Home
            </Link>
            <Link href="/browse" className="text-blue-100 hover:text-white font-semibold text-sm transition-colors">
              Browse Internships
            </Link>
            <Link href="/companies" className="text-blue-100 hover:text-white font-semibold text-sm transition-colors">
              Companies (350)
            </Link>
            {isAuthenticated && (
              <Link href="/saved" className="text-blue-100 hover:text-white font-semibold text-sm transition-colors flex items-center gap-1.5">
                <svg className="w-4 h-4 text-amber-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                </svg>
                Saved
              </Link>
            )}
          </div>

          {/* User / Auth Action */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-blue-800/80 border border-blue-700/60 px-3 py-1.5 rounded-full text-xs">
                  <div className="w-6 h-6 rounded-full bg-blue-500 text-white font-bold flex items-center justify-center text-xs">
                    {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium text-blue-100 max-w-[120px] truncate">
                    {user?.name || user?.email}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="text-xs text-blue-200 hover:text-white font-medium bg-blue-800/50 hover:bg-blue-800 px-3 py-1.5 rounded-lg transition-colors border border-blue-700/40"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-white text-blue-900 hover:bg-blue-50 px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-all hover:shadow"
              >
                Sign In / Register
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-blue-100 hover:text-white focus:outline-none p-1.5"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-blue-950 border-t border-blue-800 pb-5 pt-3 px-5 space-y-3 shadow-xl">
          <Link 
            href="/" 
            className="block py-2 text-blue-100 hover:text-white font-medium"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            href="/browse" 
            className="block py-2 text-blue-100 hover:text-white font-medium"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Browse Internships
          </Link>
          <Link 
            href="/companies" 
            className="block py-2 text-blue-100 hover:text-white font-medium"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Companies (350)
          </Link>
          {isAuthenticated ? (
            <>
              <Link 
                href="/saved" 
                className="block py-2 text-blue-100 hover:text-white font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Saved Internships
              </Link>
              <div className="pt-2 border-t border-blue-900 flex justify-between items-center">
                <span className="text-xs text-blue-200 truncate">{user?.email}</span>
                <button
                  onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                  className="text-xs text-red-300 font-bold"
                >
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <div className="pt-2 border-t border-blue-900">
              <Link
                href="/login"
                className="block text-center py-2.5 bg-white text-blue-900 rounded-xl font-bold text-sm"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign In / Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
