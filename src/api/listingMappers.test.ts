import type { ListingResponse } from './types';
import { listingToInternshipData } from './listingMappers';

jest.mock('./mediaApi', () => ({
  resolveMediaUrl: (url?: string | null) => url ? `resolved:${url}` : null,
}));

const listing = (overrides: Partial<ListingResponse> = {}): ListingResponse => ({
  id: 12,
  companyId: 4,
  companyName: 'InternLink Labs',
  title: 'Software Engineering Intern',
  description: ' Build useful products. ',
  duration: null,
  location: null,
  remote: true,
  industry: 'Technology',
  deadline: null,
  allowance: null,
  status: 'OPEN',
  multiStage: false,
  requiredSkills: ['TypeScript'],
  department: 'Engineering',
  employmentType: 'Internship',
  category: 'Software',
  branch: null,
  openPositions: 1,
  responsibilities: 'Build features\n Review code ',
  dailyTasks: null,
  learningOutcomes: null,
  teamInfo: null,
  preferredSkills: [],
  studentLevel: null,
  degreeProgramme: null,
  minimumGpa: null,
  paid: false,
  benefits: ['Mentorship'],
  workMode: null,
  workingHours: null,
  maxApplicants: null,
  allowCoverLetter: true,
  resumeRequired: true,
  portfolioRequired: false,
  autoScreening: false,
  aiMatching: true,
  requiredDocuments: ['resume'],
  viewCount: 0,
  imageUrl: '/media/listing.png',
  createdAt: '2026-07-01T10:00:00Z',
  updatedAt: '2026-07-01T10:00:00Z',
  ...overrides,
});

describe('listingToInternshipData', () => {
  it('maps backend listing metadata used by application and bookmark flows', () => {
    const mapped = listingToInternshipData(listing(), 91);

    expect(mapped).toMatchObject({
      id: '12',
      backendListingId: 12,
      companyId: '4',
      matchScore: 91,
      location: 'Remote',
      workMode: 'remote',
      imageUrl: 'resolved:/media/listing.png',
      responsibilities: ['Build features', 'Review code'],
      requiredDocuments: ['resume'],
      allowCoverLetter: true,
      resumeRequired: true,
      portfolioRequired: false,
    });
  });

  it('uses stable display fallbacks for optional backend fields', () => {
    const mapped = listingToInternshipData(listing({
      companyName: ' ',
      remote: false,
      imageUrl: null,
      responsibilities: null,
    }));

    expect(mapped.companyLogo).toBe('I');
    expect(mapped.location).toBe('Location not specified');
    expect(mapped.salary).toBe('Allowance not specified');
    expect(mapped.duration).toBe('Duration not specified');
    expect(mapped.responsibilities).toEqual([]);
    expect(mapped.closingDate).toBe('2026-07-31');
  });
});
