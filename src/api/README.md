# API integration boundary

`createApiClient` is intentionally not instantiated yet because the backend URL,
endpoint paths, and authentication provider are not defined in this repository.

When the backend contract is available:

1. Create one configured client from the environment-specific base URL.
2. Supply access tokens through `getAccessToken`; keep tokens in secure device
   storage, not Zustand or AsyncStorage.
3. Add feature modules such as `authApi.ts`, `applicationsApi.ts`, and
   `messagesApi.ts`. Screens should call those modules rather than `fetch`.
4. Map the authenticated user response into `establishSession` in the app store.
5. Keep server collections out of Zustand persistence. The existing mock
   collections are already excluded by `partialize`.

The client supports JSON and `FormData` bodies, request cancellation, timeouts,
Bearer authorization, empty responses, and normalized `ApiError` instances.
