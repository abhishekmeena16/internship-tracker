import { fetchCompany } from '../../../lib/api';
import Link from 'next/link';
import CompanyInternshipsList from '../../../components/CompanyInternshipsList';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const res = await fetchCompany(slug);
  if (!res || !res.data) return { title: 'Not Found | Internship Tracker' };
  return { title: `${res.data.name} | Internship Tracker` };
}

export default async function CompanyDetail({ params }) {
  const { slug } = await params;
  const res = await fetchCompany(slug);

  if (!res || !res.data) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Company Not Found</h2>
        <Link href="/companies" className="text-blue-600 hover:underline">Return to companies</Link>
      </div>
    );
  }

  const company = res.data;
  const internships = company.internships || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link href="/companies" className="inline-flex items-center text-blue-700 hover:text-blue-900 font-medium mb-6 transition-colors">
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Back to companies
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
        <div className="flex items-center gap-6 mb-6">
          <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center text-3xl font-bold text-blue-800">
            {company.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">{company.name}</h1>
            <div className="flex gap-4 mt-2 text-gray-600">
              {company.sector && <span>{company.sector}</span>}
              {company.hqCity && <span>📍 {company.hqCity}</span>}
            </div>
          </div>
        </div>
        {company.description && (
          <p className="text-gray-700 max-w-3xl mb-6">{company.description}</p>
        )}
        {company.careerUrl && (
          <a href={company.careerUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">
            Visit Careers Page →
          </a>
        )}
      </div>

      <CompanyInternshipsList internships={internships} company={company} />
    </div>
  );
}
