import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { openPaystackCheckout } from './paystackCheckout';

jest.mock('expo-linking', () => ({
  parse: jest.fn(),
}));

jest.mock('expo-web-browser', () => ({
  maybeCompleteAuthSession: jest.fn(),
  openAuthSessionAsync: jest.fn(),
}));

const parseMock = Linking.parse as jest.MockedFunction<typeof Linking.parse>;
const openAuthSessionMock = WebBrowser.openAuthSessionAsync as jest.MockedFunction<
  typeof WebBrowser.openAuthSessionAsync
>;

describe('openPaystackCheckout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('accepts the matching reference returned through the app callback', async () => {
    openAuthSessionMock.mockResolvedValue({
      type: 'success',
      url: 'internlink://paystack-callback?reference=internlink-student-1-test',
    });
    parseMock.mockReturnValue({
      scheme: 'internlink',
      hostname: 'paystack-callback',
      path: 'paystack-callback',
      queryParams: { reference: 'internlink-student-1-test' },
    });

    await expect(openPaystackCheckout(
      'https://checkout.paystack.com/test-access-code',
      'internlink-student-1-test',
    )).resolves.toEqual({
      completed: true,
      reference: 'internlink-student-1-test',
    });
    expect(openAuthSessionMock).toHaveBeenCalledWith(
      'https://checkout.paystack.com/test-access-code',
      'internlink://paystack-callback',
    );
  });

  it('reports a dismissed checkout without claiming payment success', async () => {
    openAuthSessionMock.mockResolvedValue({
      type: 'dismiss' as WebBrowser.WebBrowserResultType,
    });

    await expect(openPaystackCheckout(
      'https://checkout.paystack.com/test-access-code',
      'internlink-student-1-test',
    )).resolves.toEqual({ completed: false, reference: null });
  });

  it('rejects a callback carrying a different reference', async () => {
    openAuthSessionMock.mockResolvedValue({
      type: 'success',
      url: 'internlink://paystack-callback?reference=unexpected',
    });
    parseMock.mockReturnValue({
      scheme: 'internlink',
      hostname: 'paystack-callback',
      path: 'paystack-callback',
      queryParams: { reference: 'unexpected' },
    });

    await expect(openPaystackCheckout(
      'https://checkout.paystack.com/test-access-code',
      'internlink-student-1-test',
    )).rejects.toThrow('Paystack returned an invalid payment reference.');
  });
});
