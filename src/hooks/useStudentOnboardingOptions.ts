import { useCallback, useEffect, useState } from 'react';
import { getAuthErrorMessage } from '../api/authSession';
import { referenceDataApi } from '../api/referenceDataApi';
import type { StudentOnboardingOptionsResponse } from '../api/types';

let cachedOptions: StudentOnboardingOptionsResponse | null = null;
let optionsRequest: Promise<StudentOnboardingOptionsResponse> | null = null;

const fetchOptions = (force: boolean) => {
  if (!force && cachedOptions) return Promise.resolve(cachedOptions);
  if (!force && optionsRequest) return optionsRequest;

  optionsRequest = referenceDataApi.getStudentOnboardingOptions()
    .then((options) => {
      cachedOptions = options;
      return options;
    })
    .finally(() => {
      optionsRequest = null;
    });

  return optionsRequest;
};

export const useStudentOnboardingOptions = () => {
  const [options, setOptions] = useState<StudentOnboardingOptionsResponse | null>(cachedOptions);
  const [isLoading, setIsLoading] = useState(!cachedOptions);
  const [error, setError] = useState('');
  const [requestVersion, setRequestVersion] = useState(0);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setError('');

    void fetchOptions(requestVersion > 0)
      .then((result) => {
        if (active) setOptions(result);
      })
      .catch((requestError) => {
        if (active) setError(getAuthErrorMessage(requestError));
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [requestVersion]);

  const retry = useCallback(() => setRequestVersion((version) => version + 1), []);

  return { options, isLoading, error, retry };
};
