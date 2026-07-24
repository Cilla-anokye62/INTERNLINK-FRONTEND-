import type { ApiErrorBody } from './types';

export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly details?: unknown;
  readonly fieldErrors?: Record<string, string[]>;

  constructor(status: number, body?: ApiErrorBody) {
    super(body?.message || `Request failed with status ${status}`);
    this.name = 'ApiError';
    this.status = status;
    this.code = body?.code;
    this.details = body?.details;
    this.fieldErrors = body?.fieldErrors;
  }
}

export interface ApiClientConfig {
  baseUrl: string;
  getAccessToken?: () => string | null | Promise<string | null>;
  refreshAccessToken?: () => Promise<string | null>;
  defaultTimeoutMs?: number;
}

export type ApiRequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
  requiresAuth?: boolean;
  timeoutMs?: number;
};

export interface ApiClient {
  request<T>(path: string, options?: ApiRequestOptions): Promise<T>;
}

const parseResponse = async (response: Response): Promise<unknown> => {
  if (response.status === 204) return undefined;
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) return response.json();
  const text = await response.text();
  return text || undefined;
};

export const createApiClient = ({
  baseUrl,
  getAccessToken,
  refreshAccessToken,
  defaultTimeoutMs = 15_000,
}: ApiClientConfig): ApiClient => {
  const normalizedBaseUrl = baseUrl.replace(/\/$/, '');

  return {
    async request<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
      const {
        body,
        headers: requestHeaders,
        requiresAuth = true,
        timeoutMs = defaultTimeoutMs,
        signal: callerSignal,
        ...requestInit
      } = options;

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), timeoutMs);
      const abortFromCaller = () => controller.abort();
      callerSignal?.addEventListener('abort', abortFromCaller);

      try {
        const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
        const executeRequest = async (tokenOverride?: string | null) => {
          const headers = new Headers(requestHeaders);
          headers.set('Accept', 'application/json');
          if (body !== undefined && !isFormData) headers.set('Content-Type', 'application/json');

          if (requiresAuth) {
            const accessToken = tokenOverride ?? await getAccessToken?.();
            if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);
          }

          return fetch(`${normalizedBaseUrl}/${path.replace(/^\//, '')}`, {
            ...requestInit,
            headers,
            body: body === undefined ? undefined : isFormData ? body : JSON.stringify(body),
            signal: controller.signal,
          });
        };

        let response = await executeRequest();
        if (response.status === 401 && requiresAuth && refreshAccessToken) {
          const refreshedAccessToken = await refreshAccessToken();
          if (refreshedAccessToken) response = await executeRequest(refreshedAccessToken);
        }
        const responseBody = await parseResponse(response);

        if (!response.ok) {
          const errorBody = responseBody && typeof responseBody === 'object'
            ? responseBody as ApiErrorBody
            : { message: typeof responseBody === 'string' ? responseBody : undefined };
          throw new ApiError(response.status, errorBody);
        }

        return responseBody as T;
      } finally {
        clearTimeout(timeout);
        callerSignal?.removeEventListener('abort', abortFromCaller);
      }
    },
  };
};
