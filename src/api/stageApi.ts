import { apiClient } from './configuredClient';
import type {
  ApplicationStageProgressResponse,
  PipelineStageResponse,
  StageType,
} from './types';

export const stageApi = {
  listForStudent(applicationId: number) {
    return apiClient.request<ApplicationStageProgressResponse[]>(
      `/api/students/applications/${applicationId}/stages`,
      { method: 'GET' },
    );
  },

  setStudentMeetingLink(applicationId: number, meetingLink: string) {
    return apiClient.request<ApplicationStageProgressResponse>(
      `/api/students/applications/${applicationId}/stages/current/meeting-link`,
      {
        method: 'PUT',
        body: { meetingLink },
      },
    );
  },

  createForListing(listingId: number, name: string, type: StageType) {
    return apiClient.request<PipelineStageResponse>(
      `/api/companies/listings/${listingId}/stages`,
      {
        method: 'POST',
        body: { name, type },
      },
    );
  },

  listForListing(listingId: number) {
    return apiClient.request<PipelineStageResponse[]>(
      `/api/companies/listings/${listingId}/stages`,
      { method: 'GET' },
    );
  },

  listForCompanyApplication(applicationId: number) {
    return apiClient.request<ApplicationStageProgressResponse[]>(
      `/api/companies/applications/${applicationId}/stages`,
      { method: 'GET' },
    );
  },

  setInterviewLink(applicationId: number, interviewLink: string, interviewLinkExpiresAt: string) {
    return apiClient.request<ApplicationStageProgressResponse>(
      `/api/companies/applications/${applicationId}/stages/current/interview-link`,
      {
        method: 'PUT',
        body: { interviewLink, interviewLinkExpiresAt },
      },
    );
  },

  decide(applicationId: number, decision: 'APPROVE' | 'REJECT') {
    return apiClient.request<ApplicationStageProgressResponse>(
      `/api/companies/applications/${applicationId}/stages/current/decision`,
      {
        method: 'POST',
        body: { decision },
      },
    );
  },
};
