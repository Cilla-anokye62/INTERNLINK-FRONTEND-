import { apiClient } from './configuredClient';
import type { StudentOnboardingOptionsResponse } from './types';

export const referenceDataApi = {
  getStudentOnboardingOptions() {
    return apiClient.request<StudentOnboardingOptionsResponse>(
      '/api/reference-data/student-onboarding',
      { method: 'GET' },
    );
  },
};
