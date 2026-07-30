import { ApiError } from './client';
import { bookmarkApi } from './bookmarkApi';
import { apiClient } from './configuredClient';

jest.mock('./configuredClient', () => ({
  apiClient: { request: jest.fn() },
}));

const mockRequest = apiClient.request as jest.MockedFunction<typeof apiClient.request>;

describe('bookmarkApi.setSaved', () => {
  beforeEach(() => {
    mockRequest.mockReset();
  });

  it('saves and removes through the persistent backend endpoints', async () => {
    mockRequest.mockResolvedValueOnce({ id: 1 }).mockResolvedValueOnce(undefined);

    await bookmarkApi.setSaved(8, true);
    await bookmarkApi.setSaved(8, false);

    expect(mockRequest).toHaveBeenNthCalledWith(1, '/api/students/bookmarks', {
      method: 'POST',
      body: { listingId: 8 },
    });
    expect(mockRequest).toHaveBeenNthCalledWith(2, '/api/students/bookmarks/8', {
      method: 'DELETE',
    });
  });

  it('treats already-saved and already-removed responses as success', async () => {
    mockRequest
      .mockRejectedValueOnce(new ApiError(409, { message: 'Already bookmarked' }))
      .mockRejectedValueOnce(new ApiError(404, { message: 'Bookmark not found' }));

    await expect(bookmarkApi.setSaved(8, true)).resolves.toBeUndefined();
    await expect(bookmarkApi.setSaved(8, false)).resolves.toBeUndefined();
  });

  it('does not hide real backend failures', async () => {
    mockRequest.mockRejectedValueOnce(new ApiError(401, { message: 'Unauthorized' }));

    await expect(bookmarkApi.setSaved(8, true)).rejects.toMatchObject({
      status: 401,
    });
  });
});
