import { File, Paths } from 'expo-file-system';
import { apiBaseUrl, apiClient, refreshStoredSession } from './configuredClient';
import { getAccessToken } from './tokenStorage';
import { getValidatedResumeFile } from '../utils/resumeFiles';
import type {
  BackendApplicantResponse,
  BackendApplicationResponse,
  BackendApplicationStatus,
  ApplicantDetailResponse,
  ApplicationFileKind,
  ApplicationFileResponse,
} from './types';

const inferMimeType = (name: string) => {
  const extension = name.split('.').pop()?.toLowerCase();
  return extension === 'pdf'
    ? 'application/pdf'
    : extension === 'docx'
      ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      : extension === 'doc'
        ? 'application/msword'
        : extension === 'png'
          ? 'image/png'
          : extension === 'jpg' || extension === 'jpeg'
            ? 'image/jpeg'
            : 'application/octet-stream';
};

export const applicationApi = {
  apply(listingId: number, details: {
    coverLetter?: string;
    motivation?: string;
    whyThisInternship?: string;
    strongCandidate?: string;
    portfolioLinks?: Record<string, string>;
    earliestStartDate?: string;
    expectedDuration?: string;
    preferredWorkMode?: string;
    canRelocate?: boolean;
  } = {}, resume?: { uri: string; name: string; mimeType?: string | null }) {
    if (resume) {
      getValidatedResumeFile(resume);
      const form = new FormData();
      form.append('application', JSON.stringify({ listingId, ...details }));
      form.append('resume', {
        uri: resume.uri,
        name: resume.name,
        type: resume.mimeType || inferMimeType(resume.name),
      } as unknown as Blob);
      return apiClient.request<BackendApplicationResponse>('/api/students/applications/submit', {
        method: 'POST',
        body: form,
        timeoutMs: 60_000,
      });
    }
    return apiClient.request<BackendApplicationResponse>('/api/students/applications', {
      method: 'POST',
      body: { listingId, ...details },
    });
  },

  listOwn() {
    return apiClient.request<BackendApplicationResponse[]>('/api/students/applications', {
      method: 'GET',
    });
  },

  async findOwnByListing(listingId: number) {
    const applications = await this.listOwn();
    return applications.find((application) => application.listingId === listingId) ?? null;
  },

  listApplicants(listingId: number, status?: BackendApplicationStatus) {
    const query = status ? `?status=${encodeURIComponent(status)}` : '';
    return apiClient.request<BackendApplicantResponse[]>(
      `/api/companies/listings/${listingId}/applications${query}`,
      { method: 'GET' },
    );
  },

  updateStatus(applicationId: number, status: 'ACCEPTED' | 'REJECTED') {
    return apiClient.request<BackendApplicantResponse>(
      `/api/companies/applications/${applicationId}/status`,
      {
        method: 'PATCH',
        body: { status },
      },
    );
  },

  details(applicationId: number) {
    return apiClient.request<ApplicantDetailResponse>(
      `/api/companies/applications/${applicationId}`,
      { method: 'GET' },
    );
  },

  uploadFile(
    applicationId: number,
    kind: ApplicationFileKind,
    file: { uri: string; name: string; mimeType?: string | null },
  ) {
    const form = new FormData();
    form.append('kind', kind);
    form.append('file', {
      uri: file.uri,
      name: file.name,
      type: file.mimeType || inferMimeType(file.name),
    } as unknown as Blob);
    return apiClient.request<ApplicationFileResponse>(
      `/api/students/applications/${applicationId}/files`,
      { method: 'POST', body: form },
    );
  },

  listFiles(applicationId: number) {
    return apiClient.request<ApplicationFileResponse[]>(
      `/api/students/applications/${applicationId}/files`,
      { method: 'GET' },
    );
  },

  async downloadCompanyFile(file: ApplicationFileResponse) {
    const refreshed = await refreshStoredSession().catch(() => null);
    const token = refreshed?.accessToken ?? await getAccessToken();
    if (!token) throw new Error('Your session has expired. Please sign in again.');

    const safeName = file.originalFileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const destination = new File(Paths.cache, `internlink-${file.id}-${safeName}`);
    const downloaded = await File.downloadFileAsync(
      `${apiBaseUrl}/api/companies/application-files/${file.id}/download`,
      destination,
      {
        headers: { Authorization: `Bearer ${token}` },
        idempotent: true,
      },
    );
    return downloaded.uri;
  },
};
