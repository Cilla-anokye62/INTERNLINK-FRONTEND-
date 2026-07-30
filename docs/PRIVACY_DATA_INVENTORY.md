# Privacy and Google Play Data Inventory

This inventory is based on the current code and is a review aid, not legal advice. Confirm retention periods and the public privacy policy before release.

| Data category | Examples | Purpose | Storage/handling |
|---|---|---|---|
| Account identity | Name, email, phone, role | Authentication and account operation | Backend PostgreSQL; sensitive contact fields are encrypted |
| Education and career | University, programme, level, skills, interests | Matching, applications, university placement | Backend PostgreSQL |
| Profile media | Profile photo, company/university logo | Account presentation | Private cloud object storage; database stores the returned URL |
| Application content | Resume, portfolio, cover letter, answers, availability | Internship application processing | Private object storage and PostgreSQL metadata |
| User communications | Conversations, messages, offers, support requests | Recruitment communication and support | Backend PostgreSQL |
| App activity | Applications, bookmarks, listing views, notification state | Core app behavior and analytics | Backend PostgreSQL |
| Device identifiers | Expo/FCM push token | Push notification delivery | Backend PostgreSQL; cleared on sign-out where possible |
| Authentication data | Password hash, refresh-token hash, Google subject ID | Authentication and session security | Backend only; refresh token is stored in device SecureStore |

The app does not intentionally collect precise GPS location, contacts, advertising IDs, health data, financial account data, or payment card data.

## User controls present in the app

- Export account data
- Clear non-session local cache
- Manage notification, privacy, and personalization preferences
- Delete/anonymize the account
- Sign out and revoke the local session

## Before Play submission

- Publish a privacy policy on a stable HTTPS URL.
- Set a monitored support email and data-deletion contact.
- Complete Google Play's Data safety form from the production behavior, including any analytics or crash-reporting provider added later.
- Confirm encryption in transit for every production endpoint.
- Document retention periods for applications, messages, support requests, and object-storage files.
- Verify that account deletion removes or anonymizes linked object-storage content as stated by the final policy.
