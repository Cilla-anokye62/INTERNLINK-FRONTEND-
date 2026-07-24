# InternLink Frontend

InternLink is a cross-platform internship platform for students, companies, and universities. This repository contains the Expo/React Native frontend.

The application currently provides a working frontend prototype with role-based navigation, onboarding, internship discovery and application screens, employer recruitment workflows, university placement dashboards, messaging interfaces, settings, dark mode, and local state persistence.

> **Current status:** The frontend is not connected to a live backend. Authentication and most business operations currently use mock data, component state, or the local Zustand store.

## User roles

### Student

- Complete academic and career onboarding.
- Build a student profile and select skills.
- Discover, search, filter, and save internships.
- Complete a multi-step internship application.
- Track application status and upcoming events.
- Use local messaging, notifications, and settings screens.
- View the premium subscription interface.

### Company

The company role is stored internally as `employer`.

- Complete company onboarding.
- Create and publish local internship listings.
- Review applicants in a recruitment pipeline.
- Shortlist or reject applicants.
- Enter interview and offer details.
- View local hiring insights and messaging screens.

### University

- Complete institution and career-services onboarding.
- View placement dashboards and analytics.
- Monitor students using bundled demonstration data.
- View company-engagement information.
- Access report, notification, profile, and settings interfaces.

There is no Admin interface in the current frontend.

## Technology stack

| Area | Technology |
|---|---|
| Framework | Expo SDK 54 |
| Mobile runtime | React Native 0.81 |
| UI library | React 19.1 |
| Language | TypeScript with strict mode |
| Navigation | React Navigation Stack and Bottom Tabs v7 |
| State management | Zustand 5 |
| Local persistence | AsyncStorage through Zustand persist middleware |
| Theme | Custom `ThemeProvider` and `useAppTheme()` |
| Charts and graphics | React Native Chart Kit and React Native SVG |
| Device integrations | Expo Document Picker, Image Picker, Clipboard, and Web Browser |

`expo-router` is installed and listed as an Expo plugin, but it is not used by the current application. The active entrypoint is `index.ts`, which registers `App.tsx`.

## Prerequisites

Install the following before running the project:

- Node.js using a currently supported LTS release.
- npm, which is included with Node.js.
- Expo Go on a physical Android or iOS device, or an Android emulator.
- Git if you are cloning the repository.

An iOS Simulator requires macOS and Xcode. Windows users can still test on Android, web, or a physical iPhone through Expo Go when the project and phone can communicate over the network.

## Getting started

### 1. Clone and enter the repository

```bash
git clone <frontend-repository-url>
cd InternLink
```

If the repository is already on your computer, open a terminal in its root directory instead.

### 2. Install dependencies

```bash
npm install
```

For a clean, lockfile-based installation, use:

```bash
npm ci
```

### 3. Start Expo

```bash
npm run start
```

After Metro starts, use one of the displayed options:

- Scan the QR code with Expo Go on a physical device.
- Press `a` to open Android.
- Press `w` to open the web version.

On Windows machines that block PowerShell script wrappers, use:

```powershell
npm.cmd run start
```

## Available commands

| Command | Purpose |
|---|---|
| `npm run start` | Start the Expo development server |
| `npm run android` | Start Expo and open Android |
| `npm run ios` | Start Expo and open iOS where supported |
| `npm run web` | Start the web version |
| `npm run typecheck` | Run TypeScript validation without creating output files |

The project currently has no configured lint command, automated test command, or CI pipeline. The required repository check is:

```bash
npm run typecheck
```

## Project structure

```text
InternLink/
├── App.tsx                         # Active root stack and role/session gates
├── index.ts                        # Expo entrypoint
├── app.json                        # Expo application configuration
├── app/
│   ├── AuthScreens/                # Login, signup, verification, recovery, role selection
│   ├── StudentOnboardingScreens/   # Student onboarding flow
│   ├── CompanyOnboardingScreens/   # Company onboarding flow
│   ├── UniversityOnboarding/       # University onboarding flow
│   ├── StudentExperienceScreens/   # Student tabs, discovery, applications, chat
│   ├── CompanyExperienceScreens/   # Company tabs, listings, applicants, chat
│   ├── UniversityExperience/       # University tabs, monitoring, analytics, reports
│   ├── SettingsComponents/         # Shared settings, account, help, and legal screens
│   ├── PremiumScreens/             # Premium, payment, confirmation, management
│   └── SystemStateScreens/         # Empty, loading, error, success, search states
├── src/
│   ├── api/                        # Generic API transport scaffold; not connected
│   ├── components/                 # Shared themed components
│   ├── constants/                  # Active light/dark color palettes
│   ├── context/                    # Theme provider
│   ├── hooks/                      # Shared hooks, including useAppTheme
│   ├── navigation/                 # Planned navigator refactor; currently inactive
│   ├── store/                      # Zustand application store
│   ├── types/                      # Application-domain types
│   └── utils/                      # Small validation helpers
├── types/navigation.ts             # Active route parameter definitions
├── assets/                         # Images and application icons
└── docs/SYSTEM_DESIGN.md           # Detailed frontend system design
```

## Frontend architecture

### Application shell

`App.tsx` wraps the application with:

```text
GestureHandlerRootView
└── SafeAreaProvider
    └── ThemeProvider
        └── NavigationContainer
            └── Conditional root Stack
```

The root stack waits for the persisted Zustand store to hydrate, then chooses one of three route sets:

1. Public authentication routes when no local session exists.
2. Role-specific onboarding when the user is authenticated but onboarding is incomplete.
3. Role-specific tabs and feature screens when onboarding is complete.

This frontend route gating is not a security boundary. The backend must authenticate and authorize every protected request after integration.

### Navigation

The active navigation is React Navigation, not Expo Router.

- Student tabs: Home, Discover, Saved, Applications, Profile.
- Company tabs: Dashboard, Listings, Applicants, Company, Settings.
- University tabs: Overview, Students, Analytics, Reports, Settings.

`app/OnboardingRouter.tsx` maps roles to the first onboarding route:

| Role | Initial onboarding screen |
|---|---|
| Student | Academic Info |
| Employer/company | Company Information |
| University | University Info |

The navigator files under `src/navigation/` are refactor candidates and are not mounted by `App.tsx`.

### State management

`src/store/useAppStore.ts` contains the Zustand store. It currently manages:

- hydration and local authentication state;
- selected user role and onboarding completion;
- student profile, academic, location, and job preferences;
- light/dark/system theme preference;
- local premium entitlement and application usage;
- mock applications and employer listings;
- saved internship IDs;
- local notifications, conversations, and chat messages; and
- employer analytics derived from local data.

Only a selected subset is persisted to AsyncStorage. Applications, listings, saves, notifications, conversations, and messages are not durable backend records and may reset to seeded values.

### Theme management

Use `useAppTheme()` from `src/hooks/useAppTheme.ts` in screens and components. It resolves the saved `light`, `dark`, or `system` preference through `ThemeProvider` and the palettes in `src/constants/Colors.ts`.

`constants/theme.ts` is legacy. New colors should be added to the active palette only when a suitable semantic token does not already exist.

## Backend integration status

The companion backend repository is:

[internlink-backend](https://github.com/Mahama-fuseina-Joyceline/internlink-backend)

The frontend currently makes no live API requests. `src/api/client.ts` provides a generic request client with JSON/FormData support, bearer-token injection, timeouts, and normalized errors, but:

- no API base URL is configured;
- the client is not instantiated;
- no endpoint service modules exist;
- authentication tokens are not connected; and
- screens still use local or hardcoded data.

Before connecting screens, the frontend and backend need to agree on:

- authentication, token refresh, logout, and secure token storage;
- canonical role names and onboarding payloads;
- internship and employer-listing schemas;
- application statuses and allowed transitions;
- upload handling for resumes, profile images, logos, and documents;
- pagination, filters, error responses, and server timestamps;
- messaging and notification delivery; and
- premium entitlement and payment-provider behavior.

Do not place database passwords, JWT secrets, service-account JSON, or other backend secrets in the Expo project. Values bundled into a mobile application must be treated as public.

## Current limitations

- Login, signup, verification, and password recovery are simulated locally.
- The application does not send verification or password-reset emails.
- Internship, application, employer, and university data is largely seeded or hardcoded.
- Resume and image selection produces device-local URIs; files are not uploaded.
- Messages and notifications are not delivered to another user.
- Premium payment and entitlement are simulated locally.
- Company and university onboarding do not yet retain every step as one complete API payload.
- The employer Listings tab and listing wizard use different local data sources.
- The employer dashboard notification action targets a route that is not registered in the employer stack.
- Some registered screens are unreachable or duplicate older implementations.
- Theme migration is incomplete in a small group of screens with hardcoded colors.
- There are no automated tests, lint configuration, or continuous integration checks yet.

## Development guidelines

- Keep `App.tsx` as the source of truth for active navigation until the navigator refactor is deliberately integrated.
- Use the existing Zustand actions rather than creating additional storage keys inside screens.
- Use `useAppTheme()` and semantic palette tokens for all new UI.
- Keep route parameter types in `types/navigation.ts` synchronized with active routes.
- Keep backend calls behind typed feature services instead of calling `fetch` directly from screens.
- Preserve loading, validation, empty, offline, and failure behavior when replacing mocks.
- Run `npm run typecheck` before committing frontend changes.
- Do not commit `.env` files, credentials, signing keys, or generated build folders.

## Troubleshooting

### PowerShell blocks `npm` or `npx`

If Windows reports that `npm.ps1` or `npx.ps1` cannot be loaded because script execution is disabled, use the command wrappers directly:

```powershell
npm.cmd run start
npx.cmd expo start
```

### Metro cache problems

Stop Expo and restart it with a clean cache:

```powershell
npx.cmd expo start --clear
```

### Expo Go cannot connect

- Confirm that the computer and phone are on the same network.
- Allow Node.js/Expo through the Windows firewall when prompted.
- Restart Metro and Expo Go.
- Use the connection option shown by Expo when the local network blocks LAN discovery.

### TypeScript errors

Run:

```powershell
npm.cmd run typecheck
```

Fix type errors before treating a change as complete.

## Documentation

For the full architecture, screen catalog, inferred data models, proposed API contract, backend services, sequence diagrams, security considerations, and scalability plan, see:

[Frontend System Design Document](docs/SYSTEM_DESIGN.md)

## License

See [LICENSE](LICENSE) for the license text included in this repository.
