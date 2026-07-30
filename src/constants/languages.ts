export const SUPPORTED_LANGUAGES = [
  { id: 'en', name: 'English', nativeName: 'English' },
  { id: 'fr', name: 'French', nativeName: 'Français' },
  { id: 'es', name: 'Spanish', nativeName: 'Español' },
  { id: 'tw', name: 'Twi', nativeName: 'Twi' },
  { id: 'gaa', name: 'Ga', nativeName: 'Ga' },
  { id: 'ee', name: 'Ewe', nativeName: 'Eʋegbe' },
  { id: 'ha', name: 'Hausa', nativeName: 'Hausa' },
  { id: 'sw', name: 'Swahili', nativeName: 'Kiswahili' },
  { id: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { id: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { id: 'de', name: 'German', nativeName: 'Deutsch' },
  { id: 'it', name: 'Italian', nativeName: 'Italiano' },
  { id: 'zh-Hans', name: 'Chinese (Simplified)', nativeName: '简体中文' },
  { id: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { id: 'ja', name: 'Japanese', nativeName: '日本語' },
  { id: 'ko', name: 'Korean', nativeName: '한국어' },
] as const;

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]['id'];
