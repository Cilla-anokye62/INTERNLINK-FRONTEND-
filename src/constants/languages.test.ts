import { SUPPORTED_LANGUAGES } from './languages';

describe('SUPPORTED_LANGUAGES', () => {
  it('has unique, stable language identifiers', () => {
    const ids = SUPPORTED_LANGUAGES.map(({ id }) => id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('includes international and Ghanaian language choices', () => {
    const ids = new Set(SUPPORTED_LANGUAGES.map(({ id }) => id));
    expect(SUPPORTED_LANGUAGES.length).toBeGreaterThanOrEqual(16);
    expect(ids.has('en')).toBe(true);
    expect(ids.has('tw')).toBe(true);
    expect(ids.has('gaa')).toBe(true);
    expect(ids.has('ee')).toBe(true);
    expect(ids.has('fr')).toBe(true);
  });
});
