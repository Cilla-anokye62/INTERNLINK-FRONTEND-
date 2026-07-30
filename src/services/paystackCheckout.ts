import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';

const PAYSTACK_RETURN_URL = 'internlink://paystack-callback';

WebBrowser.maybeCompleteAuthSession();

export interface PaystackCheckoutResult {
  completed: boolean;
  reference: string | null;
}

export async function openPaystackCheckout(
  authorizationUrl: string,
  expectedReference: string,
): Promise<PaystackCheckoutResult> {
  const result = await WebBrowser.openAuthSessionAsync(
    authorizationUrl,
    PAYSTACK_RETURN_URL,
  );
  if (result.type !== 'success') {
    return { completed: false, reference: null };
  }

  const parsed = Linking.parse(result.url);
  const returnedReference = valueAsString(parsed.queryParams?.reference);
  if (!returnedReference || returnedReference !== expectedReference) {
    throw new Error('Paystack returned an invalid payment reference.');
  }
  return { completed: true, reference: returnedReference };
}

function valueAsString(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}
