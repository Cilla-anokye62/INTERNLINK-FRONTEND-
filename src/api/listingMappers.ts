import type { ListingResponse } from './types';
import type { InternshipData } from '../types/application';

const COMPANY_COLORS = ['#1D8B89', '#7C3AED', '#D97706', '#2563EB', '#DC2626', '#059669'];

const fallbackClosingDate = (createdAt: string): string => {
  const date = new Date(createdAt);
  date.setDate(date.getDate() + 30);
  return date.toISOString().slice(0, 10);
};

export const listingToInternshipData = (listing: ListingResponse): InternshipData => ({
  id: String(listing.id),
  backendListingId: listing.id,
  title: listing.title,
  company: listing.companyName,
  companyId: String(listing.companyId),
  companyLogo: listing.companyName.trim().charAt(0).toUpperCase() || 'I',
  companyColor: COMPANY_COLORS[listing.companyId % COMPANY_COLORS.length],
  location: listing.location?.trim() || (listing.remote ? 'Remote' : 'Location not specified'),
  workMode: listing.remote ? 'remote' : 'onsite',
  salary: listing.allowance?.trim() || 'Allowance not specified',
  duration: listing.duration?.trim() || 'Duration not specified',
  description: listing.description?.trim() || 'No description provided.',
  responsibilities: [],
  requirements: listing.requiredSkills,
  benefits: [],
  skills: listing.requiredSkills,
  matchScore: 0,
  applicants: 0,
  postedDate: listing.createdAt,
  closingDate: listing.deadline ?? fallbackClosingDate(listing.createdAt),
});
