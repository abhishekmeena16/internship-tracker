'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Badge from './Badge';
import { useAuth } from '../context/AuthContext';
import { saveBookmark } from '../lib/api';

/**
 * Format a date string to relative time (e.g. "2 days ago")
 * @param {string} dateStr
 * @returns {string}
 */
function timeAgo(dateStr) {
  if (!dateStr) return 'recently';
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now - date) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

function formatJobId(sourceJobId, id) {
  const val = sourceJobId || id;
  if (!val) return '';
  const s = String(val).trim();
  if (/^\d+$/.test(s)) return `#${s}`;
  return s;
}

/**
 * Format stipend range for display
 * @param {number|null} min
 * @param {number|null} max
 * @param {string} currency
 * @returns {string|null}
 */
function formatStipend(min, max, currency = 'INR') {
  const sym = currency === 'INR' ? '₹' : currency;
  if (min && max && min !== max) return `${sym}${min.toLocaleString()} - ${sym}${max.toLocaleString()}/mo`;
  if (min) return `${sym}${min.toLocaleString()}/mo`;
  if (max) return `${sym}${max.toLocaleString()}/mo`;
  return null;
}

export default function InternshipCard({ internship }) {
  const router = useRouter();
  const { token, isAuthenticated } = useAuth();
  const [bookmarked, setBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);

  const {
    id, title, company, locations, isRemote,
    stipendMin, stipendMax, currency,
    durationMonths, skills, postedAt, roleCategory
  } = internship;

  const stipendStr = formatStipend(stipendMin, stipendMax, currency);
  const locationStr = locations?.length ? locations.join(', ') : 'Not specified';
  const companyName = company?.name || 'Unknown Company';
  const formattedId = formatJobId(internship.sourceJobId, id);

  const handleCopyJobId = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!formattedId) return;
    navigator.clipboard.writeText(formattedId.replace(/^#/, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyClick = () => {
    if (formattedId) {
      try {
        navigator.clipboard.writeText(formattedId.replace(/^#/, ''));
      } catch (err) {}
    }
  };

  const handleBookmarkToggle = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    try {
      await saveBookmark(id, token);
      setBookmarked(true);
    } catch (err) {
      console.error(err);
    }
  };

  const roleBadgeColors = {
    SDE: 'primary',
    DATA: 'warning',
    AI_ML: 'success',
    OTHER: 'default'
  };

  return (
    <div className="card flex flex-col h-full bg-white transition-all hover:-translate-y-1 hover:shadow-lg duration-300">
      <div className="p-5 flex-grow">
        <div className="flex justify-between items-start mb-3 gap-2">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1">
              <Link href={`/internships/${id}`} className="hover:text-blue-700 hover:underline">
                {title}
              </Link>
            </h3>
            <div className="flex items-center flex-wrap gap-2 mt-0.5">
              {company?.slug ? (
                <Link href={`/companies/${company.slug}`} className="text-sm font-semibold text-blue-700 hover:underline">
                  {companyName}
                </Link>
              ) : (
                <span className="text-sm font-semibold text-blue-700">{companyName}</span>
              )}

              {/* 1-Click Copy Job ID Button */}
              <button
                type="button"
                onClick={handleCopyJobId}
                title="Click to copy Job Requisition ID"
                className={`inline-flex items-center gap-1 text-[11px] font-mono font-medium px-2 py-0.5 rounded border transition-all ${
                  copied
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300 font-bold'
                    : 'text-gray-600 bg-gray-100 hover:bg-blue-50 hover:text-blue-700 border-gray-200 hover:border-blue-300'
                }`}
              >
                <span>{copied ? '✓ ID Copied' : `Job ID: ${formattedId}`}</span>
                {!copied && (
                  <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>

              {internship.source === 'LIVE_ATS' && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Live ATS
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {roleCategory && (
              <Badge variant={roleBadgeColors[roleCategory] || 'default'}>
                {roleCategory === 'AI_ML' ? 'AI/ML' : roleCategory}
              </Badge>
            )}
            {isRemote && <Badge variant="success">Remote</Badge>}
            <button
              onClick={handleBookmarkToggle}
              title={bookmarked ? "Saved to your bookmarks" : "Save for later"}
              className={`p-1.5 rounded-lg border transition-colors ${
                bookmarked
                  ? 'bg-amber-50 border-amber-300 text-amber-500'
                  : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-400 hover:text-gray-600'
              }`}
            >
              <svg className="w-4 h-4" fill={bookmarked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
          </div>
        </div>

        <div className="text-sm text-gray-600 mb-4 space-y-1">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{locationStr}</span>
          </div>
          {(stipendStr || durationMonths) && (
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>
                {stipendStr || 'Stipend not specified'}
                {durationMonths ? ` • ${durationMonths} months` : ''}
              </span>
            </div>
          )}
        </div>

        {/* Target Degrees Badges */}
        {internship.targetDegrees && internship.targetDegrees.length > 0 && (
          <div className="flex items-center flex-wrap gap-1 mb-2.5">
            <span className="text-[11px] text-gray-400 font-medium mr-0.5">Eligible:</span>
            {internship.targetDegrees.slice(0, 3).map(deg => (
              <span
                key={deg}
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200"
              >
                {deg === 'BTECH' ? 'B.Tech / BE' : deg === 'MTECH' ? 'M.Tech / MS' : deg === 'BCA' ? 'BCA' : deg === 'MCA' ? 'MCA' : deg === 'BSC' ? 'B.Sc' : deg === 'MSC' ? 'M.Sc' : deg === 'PHD' ? 'PhD' : deg}
              </span>
            ))}
            {internship.targetDegrees.length > 3 && (
              <span className="text-[10px] text-gray-500 font-medium">+{internship.targetDegrees.length - 3}</span>
            )}
          </div>
        )}

        {skills && skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {skills.slice(0, 4).map(skill => (
              <Badge key={skill} variant="outline">{skill}</Badge>
            ))}
            {skills.length > 4 && (
              <Badge variant="outline">+{skills.length - 4}</Badge>
            )}
          </div>
        )}
      </div>

      <div className="border-t border-gray-100 bg-gray-50 px-4 py-3 flex items-center justify-between mt-auto gap-2">
        <span className="text-xs text-gray-500 truncate">Posted {timeAgo(postedAt)}</span>
        <div className="flex items-center gap-2">
          <Link href={`/internships/${id}`} className="text-xs font-semibold text-gray-700 hover:text-blue-700 px-2.5 py-1.5 rounded hover:bg-gray-200 transition-colors">
            Details
          </Link>
          <a
            href={internship.applyUrl || internship.company?.careerUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleApplyClick}
            className="btn-primary text-xs px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-sm transition-all flex items-center gap-1 hover:shadow hover:scale-105 active:scale-95"
          >
            Apply Directly
            <svg className="w-3 h-3 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          </a>
        </div>
      </div>
    </div>
  );
}
