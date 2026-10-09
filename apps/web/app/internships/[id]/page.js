import { fetchInternship } from '../../../lib/api';
import InternshipDetailClient from '../../../components/InternshipDetailClient';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const internship = await fetchInternship(id);
  if (!internship) return { title: 'Not Found | Internship Tracker' };
  return { title: `${internship.title} at ${internship.company?.name || 'Unknown'} | Internship Tracker` };
}

export default async function InternshipDetail({ params }) {
  const { id } = await params;
  const internship = await fetchInternship(id);

  return <InternshipDetailClient internship={internship} />;
}
