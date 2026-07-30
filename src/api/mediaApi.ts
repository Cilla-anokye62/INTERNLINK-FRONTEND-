import { apiBaseUrl, apiClient } from './configuredClient';
import { File } from 'expo-file-system';

export interface UploadableImage {
  uri: string;
  name: string;
  mimeType?: string | null;
}

export interface MediaUploadResponse {
  url: string;
  contentType: string;
  sizeBytes: number;
}

const inferImageMimeType = (name: string) => {
  const extension = name.split('.').pop()?.toLowerCase();
  if (extension === 'png') return 'image/png';
  if (extension === 'webp') return 'image/webp';
  return 'image/jpeg';
};

const imageForm = (file: UploadableImage) => {
  const localFile = new File(file.uri);
  if (!localFile.exists) {
    throw new Error('The selected photo is no longer available. Please choose it again.');
  }
  if ((localFile.size ?? 0) > 5 * 1024 * 1024) {
    throw new Error('The selected photo exceeds the 5 MB upload limit.');
  }
  const form = new FormData();
  form.append('file', {
    uri: file.uri,
    name: file.name,
    type: file.mimeType || inferImageMimeType(file.name),
  } as unknown as Blob);
  return form;
};

export const resolveMediaUrl = (url?: string | null) => {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  return `${apiBaseUrl}/${url.replace(/^\//, '')}`;
};

export const mediaApi = {
  uploadAccountImage(file: UploadableImage) {
    return apiClient.request<MediaUploadResponse>('/api/account/profile-image', {
      method: 'POST',
      body: imageForm(file),
      timeoutMs: 30_000,
    });
  },

  deleteAccountImage() {
    return apiClient.request<void>('/api/account/profile-image', {
      method: 'DELETE',
    });
  },

  uploadListingImage(listingId: number, file: UploadableImage) {
    return apiClient.request<MediaUploadResponse>(`/api/companies/listings/${listingId}/image`, {
      method: 'POST',
      body: imageForm(file),
      timeoutMs: 30_000,
    });
  },

  deleteListingImage(listingId: number) {
    return apiClient.request<void>(`/api/companies/listings/${listingId}/image`, {
      method: 'DELETE',
    });
  },
};
