'use client';

import { useState } from 'react';
import Link from 'next/link';
import Badge from './Badge';
import { useAuth } from '../context/AuthContext';

/**
 * Format stipend range for display
 */
function formatStipend(min, max, currency = 'INR') {
  const sym = currency === 'INR' ? '₹' : currency;
  if (min && max && min !== max) return `${sym}${min.toLocaleString()} - ${sym}${max.toLocaleString()}/mo`;
  if (min) return `${sym}${min.toLocaleString()}/mo`;
  if (max) return `${sym}${max.toLocaleString()}/mo`;
  return 'Not specified';
}

/**
 * Format a date for display
 */
function formatDate(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatJobId(sourceJobId, id) {
  const val = sourceJobId || id;
  if (!val) return '';
  const s = String(val).trim();
  if (/^\d+$/.test(s)) return `#${s}`;
  return s;
}

export default function InternshipDetailClient({ internship }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (!internship) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Internship Not Found</h2>
        <Link href="/browse" className="text-blue-600 hover:underline font-semibold">
          Return to listings
        </Link>
      </div>
    );
  }

  const {
    id, title, company, locations, isRemote,
    stipendMin, stipendMax, currency,
    durationMonths, eligibility, skills,
    description, postedAt, deadline, applyUrl,
    status, roleCategory, source, lastVerifiedAt, sourceJobId
  } = internship;

  const companyName = company?.name || 'Unknown Company';
  const isOpen = status !== 'CLOSED';
  const locationStr = locations?.length ? locations.join(', ') : 'Not specified';
  const stipendStr = formatStipend(stipendMin, stipendMax, currency);
  const formattedJobId = formatJobId(sourceJobId, id);

  const [copied, setCopied] = useState(false);
  const handleCopyJobId = () => {
    if (!formattedJobId) return;
    try {
      navigator.clipboard?.writeText(formattedJobId.replace(/^#/, ''));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      // ignore clipboard error so navigation proceeds seamlessly
    }
  };

  let rawDesc = description || 'No detailed description provided.';
  // Decode HTML entities
  rawDesc = rawDesc
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/<div id="message-list[^>]*>/gi, '')
    .replace(/<div id="message-list_bottomSpacer"[^>]*><\/div>/gi, '')
    .replace(/<span data-sheets-[^>]*>/gi, '')
    .replace(/<\/span>/gi, '');

  let renderedDescription = rawDesc;
  const hasHtml = /<[a-z][\s\S]*>/i.test(renderedDescription);
  if (!hasHtml) {
    let text = renderedDescription.replace(/\\n/g, '\n');
    text = text.replace(/### (.*)/g, '<h3 class="text-lg font-bold text-blue-900 mt-6 mb-2 border-b border-gray-100 pb-1">$1</h3>');
    text = text.replace(/## (.*)/g, '<h2 class="text-xl font-bold text-gray-900 mt-6 mb-3">$1</h2>');
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>');
    
    const lines = text.split('\n');
    let inList = false;
    const formattedLines = [];
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        if (!inList) {
          formattedLines.push('<ul class="list-disc list-inside space-y-1.5 my-3 text-gray-700 ml-2">');
          inList = true;
        }
        formattedLines.push(`<li class="leading-relaxed">${trimmed.substring(2)}</li>`);
      } else {
        if (inList) {
          formattedLines.push('</ul>');
          inList = false;
        }
        if (trimmed.length > 0) {
          if (trimmed.startsWith('<h2') || trimmed.startsWith('<h3')) {
            formattedLines.push(trimmed);
          } else {
            formattedLines.push(`<p class="mb-3 text-gray-700 leading-relaxed">${trimmed}</p>`);
          }
        }
      }
    }
    if (inList) {
      formattedLines.push('</ul>');
    }
    renderedDescription = formattedLines.join('\n');
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link href="/browse" className="inline-flex items-center text-blue-700 hover:text-blue-900 font-medium mb-6 transition-colors">
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Back to listings
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header Preview */}
        <div className="p-8 border-b border-gray-200 bg-gray-50/50">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{title}</h1>
              <p className="text-xl font-medium text-blue-700">
                {company?.slug ? (
                  <Link href={`/companies/${company.slug}`} className="hover:underline">
                    {companyName}
                  </Link>
                ) : (
                  companyName
                )}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 flex-shrink-0 items-center">
              <button
                type="button"
                onClick={handleCopyJobId}
                title="Click to copy Job Requisition ID"
                className={`inline-flex items-center gap-1.5 text-xs font-mono font-bold px-3 py-1.5 rounded-lg border transition-all ${
                  copied
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-2xs'
                    : 'text-blue-900 bg-blue-100 hover:bg-blue-200/80 border-blue-200'
                }`}
              >
                <span>{copied ? '✓ ID Copied to Clipboard!' : `Job ID: ${formattedJobId}`}</span>
                {!copied && (
                  <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>

              {source === 'LIVE_ATS' && (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2.5 py-1 rounded-md">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Live ATS Verified
                </span>
              )}
              <Badge variant={isOpen ? 'success' : 'error'}>{isOpen ? 'OPEN' : 'CLOSED'}</Badge>
              {roleCategory && (
                <Badge variant="primary">
                  {roleCategory === 'AI_ML' ? 'AI/ML' : roleCategory}
                </Badge>
              )}
              {isRemote && <Badge variant="success">Remote</Badge>}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-sm">
            <div>
              <p className="text-gray-500 mb-1">Location</p>
              <p className="font-semibold text-gray-900">{locationStr}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Stipend</p>
              <p className="font-semibold text-gray-900">{stipendStr}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Duration</p>
              <p className="font-semibold text-gray-900">
                {durationMonths ? `${durationMonths} months` : 'Not specified'}
              </p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Posted</p>
              <p className="font-semibold text-gray-900">{formatDate(postedAt) || 'Recently'}</p>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {skills && skills.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map(skill => (
                  <Badge key={skill} variant="outline">{skill}</Badge>
                ))}
              </div>
            </div>
          )}

          {(eligibility || (internship.targetDegrees && internship.targetDegrees.length > 0)) && (
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-5">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Eligibility & Target Students</h3>
              {internship.targetDegrees && internship.targetDegrees.length > 0 && (
                <div className="flex items-center flex-wrap gap-2 mb-3">
                  <span className="text-xs font-semibold text-gray-500">Target Degrees:</span>
                  {internship.targetDegrees.map(deg => (
                    <span
                      key={deg}
                      className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-200"
                    >
                      🎓 {deg === 'BTECH' ? 'B.Tech / B.E.' : deg === 'MTECH' ? 'M.Tech / M.E. / MS' : deg === 'BCA' ? 'BCA' : deg === 'MCA' ? 'MCA' : deg === 'BSC' ? 'B.Sc' : deg === 'MSC' ? 'M.Sc' : deg === 'PHD' ? 'PhD / Doctorate' : deg}
                    </span>
                  ))}
                </div>
              )}
              {eligibility && (
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm">{eligibility}</p>
              )}
            </div>
          )}

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">Description</h3>
            <div
              className="prose max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: renderedDescription }}
            />
          </div>

          {deadline && (
            <div className="bg-orange-50 border border-orange-100 rounded-lg p-4 flex items-start gap-3">
              <svg className="w-5 h-5 text-orange-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <div>
                <p className="font-bold text-orange-800 text-sm">Application Deadline</p>
                <p className="text-orange-700 text-sm mt-0.5">{formatDate(deadline)}</p>
              </div>
            </div>
          )}

          {/* Meta info */}
          <div className="text-sm text-gray-500 flex flex-wrap gap-4">
            {source && <span>Source: {source}</span>}
            {lastVerifiedAt && <span>Last verified: {formatDate(lastVerifiedAt)}</span>}
          </div>

          {/* Direct Official Apply Link */}
          <div className="pt-6 border-t border-gray-100 text-center">
            <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 max-w-xl mx-auto mb-5 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div>
                <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider block">
                  Official Requisition Code
                </span>
                <span className="text-base font-mono font-bold text-gray-900">
                  {formattedJobId}
                </span>
                <p className="text-xs text-gray-500 mt-0.5">
                  Quote this Job ID when submitting your application at {companyName}.
                </p>
              </div>
              <button
                type="button"
                onClick={handleCopyJobId}
                className={`self-start sm:self-center px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 flex-shrink-0 ${
                  copied
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white hover:bg-blue-100 text-blue-900 border border-blue-300 shadow-2xs'
                }`}
              >
                {copied ? '✓ ID Copied' : '📋 Copy Job ID'}
              </button>
            </div>

            {isAuthenticated ? (
              <>
                <a
                  href={applyUrl || company?.careerUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleCopyJobId}
                  className={`inline-block w-full md:w-auto px-10 py-4 text-xl font-extrabold rounded-lg shadow-md transition-all ${
                    isOpen
                    ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:-translate-y-1'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed pointer-events-none'
                  }`}
                >
                  {isOpen ? `Apply Directly at ${companyName} →` : 'Application Closed'}
                </a>
                {isOpen && (
                  <div className="mt-3 text-xs text-gray-500 max-w-xl mx-auto space-y-1.5">
                    <p className="font-medium text-gray-700">
                      ↗ Opens official application page: <a href={applyUrl || company?.careerUrl || '#'} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-mono break-all">{applyUrl || company?.careerUrl}</a>
                    </p>
                    <p className="text-gray-500">
                      Clicking will open the exact requisition page at {companyName}.
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white text-center shadow-lg border border-blue-800 max-w-xl mx-auto">
                <div className="w-12 h-12 bg-amber-500/20 text-amber-400 border border-amber-400/30 rounded-xl flex items-center justify-center mx-auto mb-3 text-xl">
                  🔒
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold mb-2">
                  Login to Apply Directly
                </h3>
                <p className="text-blue-100 text-xs sm:text-sm max-w-md mx-auto mb-5 leading-relaxed">
                  Sign in or create a free account to unlock the direct application link and apply directly at {companyName}.
                </p>
                <Link
                  href={`/login?applyUrl=${encodeURIComponent(applyUrl || '')}&company=${encodeURIComponent(companyName || '')}&title=${encodeURIComponent(title || '')}&redirect=${encodeURIComponent(`/internships/${id}`)}`}
                  className="inline-block px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm rounded-xl shadow-md transition-all hover:scale-105"
                >
                  Login / Register to Apply Directly at {companyName} →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
