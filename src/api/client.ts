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

export class ApiConnectionError extends Error {
  readonly code: 'API_TIMEOUT' | 'API_UNREACHABLE';
  readonly retryable = true;

  constructor(code: 'API_TIMEOUT' | 'API_UNREACHABLE', message: string) {
    super(message);
    this.name = 'ApiConnectionError';
    this.code = code;
  }
}

export interface ApiClientConfig {
  baseUrl: string;
  getAccessToken?: () => string | null | Promise<string | null>;
  refreshAccessToken?: () => Promise<string | null>;
  defaultTimeoutMs?: number;
  initialTimeoutMs?: number;
  initialRetryCount?: number;
  initialRetryDelayMs?: number;
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
  initialTimeoutMs = defaultTimeoutMs,
  initialRetryCount = 0,
  initialRetryDelayMs = 750,
}: ApiClientConfig): ApiClient => {
  const normalizedBaseUrl = baseUrl.replace(/\/$/, '');
  let hasReceivedResponse = false;

  return {
    async request<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
      const coldStartRequest = !hasReceivedResponse;
      const {
        body,
        headers: requestHeaders,
        requiresAuth = true,
        timeoutMs = coldStartRequest ? initialTimeoutMs : defaultTimeoutMs,
        signal: callerSignal,
        ...requestInit
      } = options;

      const controller = new AbortController();
      let timedOut = false;
      const timeout = setTimeout(() => {
        timedOut = true;
        controller.abort();
      }, timeoutMs);
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

          const url = `${normalizedBaseUrl}/${path.replace(/^\//, '')}`;
          const fetchRequest = () => fetch(url, {
            ...requestInit,
            headers,
            body: body === undefined ? undefined : isFormData ? body : JSON.stringify(body),
            signal: controller.signal,
          });
          let response: Response;
          try {
            response = await fetchRequest();
          } catch (error) {
            const method = (requestInit.method ?? 'GET').toUpperCase();
            const idempotent = method === 'GET' || method === 'HEAD' || method === 'OPTIONS';
            if (
              coldStartRequest
              && initialRetryCount > 0
              && idempotent
              && error instanceof TypeError
              && !controller.signal.aborted
            ) {
              await new Promise((resolve) => setTimeout(resolve, initialRetryDelayMs));
              response = await fetchRequest();
            } else {
              throw error;
            }
          }
          hasReceivedResponse = true;
          return response;
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
      } catch (error) {
        if (error instanceof ApiError || error instanceof ApiConnectionError) throw error;
        if (
          timedOut
          || (error instanceof Error && error.name === 'AbortError' && !callerSignal?.aborted)
        ) {
          throw new ApiConnectionError(
            'API_TIMEOUT',
            'InternLink is taking longer than expected to respond. The exhibition server may still be waking up. Please try again.',
          );
        }
        if (error instanceof TypeError) {
          throw new ApiConnectionError(
            'API_UNREACHABLE',
            'InternLink could not reach the server. Check your internet connection and try again.',
          );
        }
        throw error;
      } finally {
        clearTimeout(timeout);
        callerSignal?.removeEventListener('abort', abortFromCaller);
      }
    },
  };
};
