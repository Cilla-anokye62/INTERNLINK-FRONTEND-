// ─── validateCard.ts ──────────────────────────────────────────────
// Pure validation functions for credit/debit card details.
// No React dependencies — usable from any screen or store.
// ──────────────────────────────────────────────────────────────────

export type CardType = 'visa' | 'mastercard' | 'amex' | 'discover' | 'unknown';

export interface CardDetails {
  cardNumber: string;
  expiry: string;
  cvv: string;
  cardholderName: string;
}

export interface CardErrors {
  cardNumber?: string;
  expiry?: string;
  cvv?: string;
  cardholderName?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────

/** Strip all non-digit characters. */
export function stripDigits(value: string): string {
  return value.replace(/\D/g, '');
}

/** Detect card brand from the raw digit string. */
export function detectCardType(raw: string): CardType {
  if (/^4/.test(raw)) return 'visa';
  if (/^(5[1-5]\d{4}|2(?:2[2-9]\d{3}|[3-6]\d{4}|7[01]\d{3}|720\d{2}))/.test(raw)) return 'mastercard';
  if (/^3[47]\d{13}/.test(raw)) return 'amex';
  if (/^6(?:011|5\d{2})/.test(raw)) return 'discover';
  return 'unknown';
}

/** Max expected length per card brand. */
function maxLen(type: CardType): number {
  switch (type) {
    case 'amex': return 15;
    case 'visa': return 16;
    case 'mastercard': return 16;
    case 'discover': return 16;
    default: return 19;
  }
}

function minLen(type: CardType): number {
  switch (type) {
    case 'amex': return 15;
    default: return 13;
  }
}

// ─── Individual validators ────────────────────────────────────────

/**
 * Luhn algorithm (mod-10). Returns true if the card number passes.
 */
export function passesLuhn(raw: string): boolean {
  let sum = 0;
  let alternate = false;
  for (let i = raw.length - 1; i >= 0; i--) {
    let n = parseInt(raw[i], 10);
    if (isNaN(n)) return false;
    if (alternate) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alternate = !alternate;
  }
  return sum % 10 === 0;
}

/** Validate card number. Returns error string or undefined. */
export function isValidCardNumber(value: string): string | undefined {
  const raw = stripDigits(value);
  if (raw.length === 0) return 'Card number is required';
  const type = detectCardType(raw);
  if (raw.length < minLen(type)) return `Card number must be at least ${minLen(type)} digits`;
  if (raw.length > 19) return 'Card number is too long';
  if (!/^\d+$/.test(raw)) return 'Card number must contain only digits';
  if (!passesLuhn(raw)) return 'Invalid card number';
  return undefined;
}

/**
 * Validate expiry string (MM/YY or MM/YYYY).
 * Returns error string or undefined.
 */
export function isValidExpiry(value: string): string | undefined {
  const raw = stripDigits(value);
  if (raw.length < 4) return 'Enter a valid expiry date';
  const month = parseInt(raw.slice(0, 2), 10);
  const yearPart = raw.slice(2);
  if (month < 1 || month > 12) return 'Invalid month';

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  let fullYear: number;
  if (yearPart.length === 2) {
    fullYear = 2000 + parseInt(yearPart, 10);
  } else if (yearPart.length === 4) {
    fullYear = parseInt(yearPart, 10);
  } else {
    return 'Enter a valid year';
  }

  if (fullYear < currentYear) return 'Card has expired';
  if (fullYear === currentYear && month < currentMonth) return 'Card has expired';
  if (fullYear > currentYear + 20) return 'Year seems too far in the future';
  return undefined;
}

/**
 * Validate CVV. Accepts 3 digits for Visa/MC/Discover, 4 for Amex.
 */
export function isValidCVV(value: string, cardType?: CardType): string | undefined {
  const raw = stripDigits(value);
  if (raw.length === 0) return 'CVV is required';
  if (!/^\d+$/.test(raw)) return 'CVV must be numeric';
  const expected = cardType === 'amex' ? 4 : 3;
  if (raw.length !== expected) return `CVV must be ${expected} digits`;
  return undefined;
}

/** Validate cardholder name. */
export function isValidCardholderName(value: string): string | undefined {
  const trimmed = value.trim();
  if (trimmed.length === 0) return 'Name is required';
  if (trimmed.length < 2) return 'Name must be at least 2 characters';
  if (trimmed.length > 100) return 'Name is too long';
  if (!/^[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF\s\-'.]+$/.test(trimmed)) {
    return 'Name can only contain letters, spaces, hyphens, and apostrophes';
  }
  return undefined;
}

// ─── Ghana mobile money number ───────────────────────────────────

/** Validate Ghana mobile money number. */
export function isValidMomoNumber(value: string): string | undefined {
  const raw = stripDigits(value);
  if (raw.length === 0) return 'Number is required';
  // Accept with or without country code
  const local = raw.startsWith('233') ? raw.slice(3) : raw;
  if (local.length < 9 || local.length > 10) return 'Enter a valid Ghana phone number';
  if (!/^0[235]\d{8}$/.test(local)) return 'Enter a valid Ghana mobile number';
  return undefined;
}

// ─── Combined validator ───────────────────────────────────────────

export function validateCardDetails(details: CardDetails): CardErrors {
  const raw = stripDigits(details.cardNumber);
  const type = detectCardType(raw);
  return {
    cardNumber: isValidCardNumber(details.cardNumber),
    expiry: isValidExpiry(details.expiry),
    cvv: isValidCVV(details.cvv, type),
    cardholderName: isValidCardholderName(details.cardholderName),
  };
}

/** Returns true when there are no errors (all fields pass). */
export function isCardValid(errors: CardErrors): boolean {
  return !errors.cardNumber && !errors.expiry && !errors.cvv && !errors.cardholderName;
}

// ─── Common form validators (reusable across the app) ─────────────

export function isValidEmail(value: string): string | undefined {
  const trimmed = value.trim();
  if (trimmed.length === 0) return 'Email is required';
  // RFC 5322 simplified
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return 'Enter a valid email address';
  return undefined;
}

export function isValidPassword(value: string): string | undefined {
  if (value.length === 0) return 'Password is required';
  if (value.length < 8) return 'Password must be at least 8 characters';
  if (value.length > 128) return 'Password is too long';
  if (!/[A-Z]/.test(value)) return 'Include at least one uppercase letter';
  if (!/[a-z]/.test(value)) return 'Include at least one lowercase letter';
  if (!/[0-9]/.test(value)) return 'Include at least one number';
  return undefined;
}

export function passwordsMatch(password: string, confirm: string): string | undefined {
  if (confirm.length === 0) return 'Please confirm your password';
  if (password !== confirm) return 'Passwords do not match';
  return undefined;
}

export function isValidName(value: string, label = 'Name'): string | undefined {
  const trimmed = value.trim();
  if (trimmed.length === 0) return `${label} is required`;
  if (trimmed.length < 2) return `${label} must be at least 2 characters`;
  if (trimmed.length > 100) return `${label} is too long`;
  if (/^\d+$/.test(trimmed)) return `${label} cannot be only numbers`;
  return undefined;
}

export function isValidGpa(value: string): string | undefined {
  if (value.trim().length === 0) return undefined; // optional field
  const num = parseFloat(value);
  if (isNaN(num)) return 'GPA must be a number';
  if (num < 0 || num > 4) return 'GPA must be between 0 and 4';
  return undefined;
}

export function isValidUrl(value: string, label = 'URL'): string | undefined {
  if (value.trim().length === 0) return undefined; // optional
  try {
    new URL(value);
    return undefined;
  } catch {
    return `Enter a valid ${label.toLowerCase()}`;
  }
}

export function isValidDateNotFuture(value: string): string | undefined {
  if (!value) return 'Date is required';
  const date = new Date(value);
  if (isNaN(date.getTime())) return 'Enter a valid date';
  if (date > new Date()) return 'Date cannot be in the future';
  return undefined;
}

export function isValidAge(value: string, minAge = 16): string | undefined {
  if (!value) return 'Date of birth is required';
  const dob = new Date(value);
  if (isNaN(dob.getTime())) return 'Enter a valid date';
  if (dob > new Date()) return 'Date of birth cannot be in the future';
  const ageMs = Date.now() - dob.getTime();
  const ageYears = ageMs / (365.25 * 24 * 60 * 60 * 1000);
  if (ageYears < minAge) return `You must be at least ${minAge} years old`;
  return undefined;
}

export function nonEmpty(value: string, label: string): string | undefined {
  if (value.trim().length === 0) return `${label} is required`;
  return undefined;
}
