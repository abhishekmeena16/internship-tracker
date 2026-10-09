import { redirect } from 'next/navigation';

export default async function InternshipsPage({ searchParams }) {
  const sp = await searchParams;
  const qs = new URLSearchParams(sp).toString();
  redirect(qs ? `/browse?${qs}` : '/browse');
}
