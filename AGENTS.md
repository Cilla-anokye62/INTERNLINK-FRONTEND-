# InternLink

Expo SDK 54 / React Native 0.81 / React 19.1. Docs: https://docs.expo.dev/versions/v54.0.0/

## Verify

No lint, no tests, no CI. Only check: `npx tsc --noEmit`

## Navigation

- **Single flat Stack in `App.tsx`** — all 40+ screens registered manually. This is the real entrypoint.
- `src/navigation/` has refactored navigator files (`AuthNavigator.tsx`, `StudentAppNavigator.tsx`, etc.) that are **NOT integrated yet** — they're a planned refactor.
- `expo-router` is a dependency/plugin but is **not used**. All navigation is `@react-navigation/stack` v7 + `@react-navigation/bottom-tabs` v7.
- `app/CompanyExperienceScreens/CompanyTabs.tsx` is wired into `App.tsx` and reachable after company onboarding completes.
- `OnboardingRouter.tsx` maps roles to first onboarding screen: `student→AcademicInfo`, `employer→CompanyInformation`, `university→UniversityInfo`.

## Theme

- **Use `useAppTheme()`** from `src/hooks/useAppTheme` → reads `src/constants/Colors.ts` (200+ key palette, light + dark).
- `constants/theme.ts` is legacy — simpler `LightColors`/`DarkColors` pair. Don't add new colors here.
- All screens now use `useAppTheme()` exclusively. No more hardcoded `const COLORS` blocks.
- `app.json` sets `"userInterfaceStyle": "automatic"` — dark mode is supported system-wide.

### Dark mode palette (from RealtimeColors)

Base tokens: `Text #EBE9FC`, `Background #02364A`, `Primary #024D60`, `Secondary #2CACAD`, `Accent #1D8B89`.
All 200+ dark tokens in `Colors.ts` derive from these. Don't add new dark colors outside this system.

## State

- **Zustand** with `persist` middleware → `src/store/useAppStore.ts`. Stores auth state (`isAuthenticated`, `userRole`) and `themePreference`.
- Three roles: `student`, `employer`, `university`. Each has separate onboarding and dashboard flows.

## Structure

- `app/` — all screen components, organized by feature (AuthScreens, StudentOnboardingScreens, etc.)
- `src/` — reusable code: `components/`, `constants/`, `context/`, `hooks/`, `navigation/`, `store/`
- `src/components/PrimaryButton.tsx` — shared button component using theme
- Tab navigators: `StudentTabs.tsx`, `UniversityTabs.tsx`, `CompanyTabs.tsx` (each wraps Bottom Tab Navigator)
- `ts-morph` is a devDependency used for AST-based refactoring scripts (e.g. `ast_refactor.js`)

## Conventions

- TypeScript strict mode enabled (`tsconfig.json`)
- Relative imports from screens back to shared code: `../../src/hooks/useAppTheme`
- Colors accessed as `colors.propertyName` (e.g. `colors.primary`, `colors.background`, `colors.tabBarBg`)
- All screens use `headerShown: false` and `CardStyleInterpolators.forFadeFromCenter`
