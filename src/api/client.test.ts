import { ApiConnectionError, ApiError, createApiClient } from './client';

const fetchMock = jest.fn();

const jsonResponse = (status: number, body: unknown): Response => ({
  status,
  ok: status >= 200 && status < 300,
  headers: new Headers({ 'content-type': 'application/json' }),
  json: async () => body,
  text: async () => JSON.stringify(body),
} as Response);

describe('createApiClient', () => {
  beforeEach(() => {
    fetchMock.mockReset();
    global.fetch = fetchMock as unknown as typeof fetch;
  });

  it('serializes JSON and attaches the current access token', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(200, { id: 7 }));
    const client = createApiClient({
      baseUrl: 'https://api.example.com/',
      getAccessToken: () => 'access-token',
    });

    await expect(client.request('/api/items', {
      method: 'POST',
      body: { title: 'Internship' },
    })).resolves.toEqual({ id: 7 });

    const [url, request] = fetchMock.mock.calls[0] as [string, RequestInit];
    const headers = request.headers as Headers;
    expect(url).toBe('https://api.example.com/api/items');
    expect(request.body).toBe(JSON.stringify({ title: 'Internship' }));
    expect(headers.get('Authorization')).toBe('Bearer access-token');
    expect(headers.get('Content-Type')).toBe('application/json');
  });

  it('refreshes once after an authenticated 401 and retries with the new token', async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse(401, { message: 'Expired' }))
      .mockResolvedValueOnce(jsonResponse(200, { ok: true }));
    const refreshAccessToken = jest.fn().mockResolvedValue('new-token');
    const client = createApiClient({
      baseUrl: 'https://api.example.com',
      getAccessToken: () => 'old-token',
      refreshAccessToken,
    });

    await expect(client.request('/api/protected')).resolves.toEqual({ ok: true });

    expect(refreshAccessToken).toHaveBeenCalledTimes(1);
    const retryHeaders = fetchMock.mock.calls[1][1].headers as Headers;
    expect(retryHeaders.get('Authorization')).toBe('Bearer new-token');
  });

  it('preserves backend error metadata in ApiError', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(422, {
      message: 'Validation failed',
      code: 'VALIDATION_ERROR',
      fieldErrors: { email: ['Email is invalid'] },
    }));
    const client = createApiClient({ baseUrl: 'https://api.example.com' });

    const request = client.request('/api/profile', {
      method: 'PATCH',
      requiresAuth: false,
    });

    await expect(request).rejects.toMatchObject({
      name: 'ApiError',
      status: 422,
      message: 'Validation failed',
      code: 'VALIDATION_ERROR',
      fieldErrors: { email: ['Email is invalid'] },
    } satisfies Partial<ApiError>);
  });

  it('uses the longer cold-start timeout until the server responds', async () => {
    jest.useFakeTimers();
    fetchMock.mockImplementation((_url: string, request: RequestInit) =>
      new Promise<Response>((_resolve, reject) => {
        request.signal?.addEventListener('abort', () => {
          const error = new Error('Aborted');
          error.name = 'AbortError';
          reject(error);
        });
      }));
    const client = createApiClient({
      baseUrl: 'https://api.example.com',
      defaultTimeoutMs: 15,
      initialTimeoutMs: 75,
    });

    const request = client.request('/actuator/health', { requiresAuth: false });
    const expectedRejection = expect(request).rejects.toMatchObject({
      name: 'ApiConnectionError',
      code: 'API_TIMEOUT',
      retryable: true,
    } satisfies Partial<ApiConnectionError>);
    await jest.advanceTimersByTimeAsync(74);
    const firstRequest = fetchMock.mock.calls[0][1] as RequestInit;
    expect(firstRequest.signal?.aborted).toBe(false);
    await jest.advanceTimersByTimeAsync(1);

    await expectedRejection;
    jest.useRealTimers();
  });

  it('returns to the standard timeout after the server has responded once', async () => {
    jest.useFakeTimers();
    fetchMock
      .mockResolvedValueOnce(jsonResponse(200, { status: 'UP' }))
      .mockImplementationOnce((_url: string, request: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          request.signal?.addEventListener('abort', () => {
            const error = new Error('Aborted');
            error.name = 'AbortError';
            reject(error);
          });
        }));
    const client = createApiClient({
      baseUrl: 'https://api.example.com',
      defaultTimeoutMs: 15,
      initialTimeoutMs: 75,
    });

    await expect(client.request('/actuator/health', {
      requiresAuth: false,
    })).resolves.toEqual({ status: 'UP' });

    const secondRequest = client.request('/api/items', { requiresAuth: false });
    const expectedRejection = expect(secondRequest).rejects.toMatchObject({
      code: 'API_TIMEOUT',
    });
    await jest.advanceTimersByTimeAsync(15);

    await expectedRejection;
    jest.useRealTimers();
  });

  it('returns an actionable retryable error for an unreachable server', async () => {
    fetchMock.mockRejectedValueOnce(new TypeError('Network request failed'));
    const client = createApiClient({ baseUrl: 'https://api.example.com' });

    await expect(client.request('/api/profile')).rejects.toMatchObject({
      name: 'ApiConnectionError',
      code: 'API_UNREACHABLE',
      message: 'InternLink could not reach the server. Check your internet connection and try again.',
      retryable: true,
    } satisfies Partial<ApiConnectionError>);
  });

  it('retries one initial idempotent request after a transient network failure', async () => {
    fetchMock
      .mockRejectedValueOnce(new TypeError('Service is waking'))
      .mockResolvedValueOnce(jsonResponse(200, { status: 'UP' }));
    const client = createApiClient({
      baseUrl: 'https://api.example.com',
      initialRetryCount: 1,
      initialRetryDelayMs: 0,
    });

    await expect(client.request('/actuator/health', {
      requiresAuth: false,
    })).resolves.toEqual({ status: 'UP' });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('does not automatically replay an initial non-idempotent request', async () => {
    fetchMock.mockRejectedValueOnce(new TypeError('Network request failed'));
    const client = createApiClient({
      baseUrl: 'https://api.example.com',
      initialRetryCount: 1,
      initialRetryDelayMs: 0,
    });

    await expect(client.request('/api/auth/login', {
      method: 'POST',
      requiresAuth: false,
      body: { email: 'student@example.com' },
    })).rejects.toMatchObject({ code: 'API_UNREACHABLE' });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
