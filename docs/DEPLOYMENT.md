# InternLink Mobile Release Runbook

This runbook covers Android preview and Google Play builds. Admin setup is intentionally out of scope, and the production PostgreSQL provider can be selected later.

## 1. Required accounts and credentials

- Expo/EAS account and EAS project UUID
- HTTPS backend staging/production URL
- Google OAuth Web client ID whose audience is also allowed by the backend
- Firebase Android app for package `com.internlink.app`
- `google-services.json` stored as an EAS secret file, never committed
- Google Play Console app and service account when automated submission is enabled

Configure these EAS environment variables separately for `preview` and `production`:

```text
EXPO_OWNER
EXPO_PUBLIC_API_BASE_URL
EXPO_PUBLIC_EAS_PROJECT_ID
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID
GOOGLE_SERVICES_JSON
```

`EXPO_PUBLIC_*` values are compiled into the app and must never contain secrets. `GOOGLE_SERVICES_JSON` is a secret file variable.

## 2. Local preflight

Use Node.js 20 and run:

```powershell
npm ci
npm run check
npx expo-doctor
$env:EXPO_PUBLIC_API_BASE_URL = "https://api.example.com"
npm run bundle:android
```

The quality gate requires zero lint or TypeScript errors, all Jest tests to pass, and the Hermes bundle to remain under 5 MiB.

## 3. Preview APK

1. Deploy the backend to an HTTPS staging address and verify `/actuator/health`.
2. Configure the `preview` EAS environment.
3. Add the preview build's signing certificate SHA-1 and SHA-256 fingerprints to the matching Google/Firebase Android application.
4. Build:

   ```powershell
   eas build --platform android --profile preview
   ```

5. Install the APK on a physical Android device and complete the smoke test below.

## 4. Physical-device smoke test

- Register, verify, log in, refresh the app, and sign out for Student, Company, and University roles.
- Confirm Google Sign-In returns to the correct role dashboard.
- Complete each role's onboarding with the keyboard open on the last input.
- Browse/search/filter internships; save, unsave, restart, and verify persistence.
- Submit an application with every required file and confirm it appears in Applications.
- Send and receive messages, offers, and notification preference changes.
- Upload, replace, restart, and retrieve profile and company/university images.
- Open University Settings and every shared settings destination.
- Trigger password reset and open the `internlink://reset-password` link.
- Confirm notification permission and one real background push on the native build.
- Confirm request failures show user-facing messages rather than a blank screen.

The `.maestro/` directory contains repeatable login/routing smoke flows. With the signed app installed and seeded staging credentials exported, run:

```powershell
maestro test .maestro/login-student.yaml
maestro test .maestro/login-company.yaml
maestro test .maestro/login-university.yaml
```

The flow files read role-specific email/password values from environment variables and do not contain credentials.

## 5. Production AAB

After preview sign-off:

```powershell
eas build --platform android --profile production
```

The production profile creates an Android App Bundle and increments `versionCode`. Upload the AAB to an internal Play testing track before promoting it. Do not promote a build whose backend schema, OAuth fingerprints, Firebase file, privacy URL, or support contact differ from the tested preview environment.

## 6. Release rollback

- Keep the previous Play artifact available for a halted rollout.
- Treat database migrations as forward-only. Take a database snapshot before deploying a migration.
- Deploy the backend first when a mobile release depends on additive API fields.
- Never remove an API field until supported mobile versions have aged out.

## External blockers

The repository is build-ready, but a real signed preview/production build still requires the account-owned values above. Production push, Google Sign-In, SMTP delivery, object storage, and Play submission cannot be truthfully validated with placeholder credentials.
