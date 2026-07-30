import { apiClient } from './configuredClient';
import type { DocumentDraftResponse, DocumentType } from './types';

const studentBase = (applicationId: number) =>
  `/api/students/applications/${applicationId}/documents`;

export const documentApi = {
  createDraft(applicationId: number, documentType: DocumentType) {
    return apiClient.request<DocumentDraftResponse>(`${studentBase(applicationId)}/draft`, {
      method: 'POST',
      body: { documentType },
    });
  },

  listOwn(applicationId: number) {
    return apiClient.request<DocumentDraftResponse[]>(studentBase(applicationId), {
      method: 'GET',
    });
  },

  edit(applicationId: number, documentId: number, draftText: string) {
    return apiClient.request<DocumentDraftResponse>(
      `${studentBase(applicationId)}/${documentId}`,
      {
        method: 'PATCH',
        body: { draftText },
      },
    );
  },

  approve(applicationId: number, documentId: number) {
    return apiClient.request<DocumentDraftResponse>(
      `${studentBase(applicationId)}/${documentId}/approve`,
      { method: 'POST' },
    );
  },

  submit(applicationId: number, documentId: number) {
    return apiClient.request<DocumentDraftResponse>(
      `${studentBase(applicationId)}/${documentId}/submit`,
      { method: 'POST' },
    );
  },

  listSubmittedForEmployer(applicationId: number) {
    return apiClient.request<DocumentDraftResponse[]>(
      `/api/companies/applications/${applicationId}/documents`,
      { method: 'GET' },
    );
  },
};
