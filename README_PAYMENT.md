# Cashfree Payment Module Integration
This module provides a secure, production-ready integration for Cashfree Payment Gateway in your Next.js e-commerce application. It allows you to switch between Sandbox and Live modes without code changes and manages API keys securely.

## Features
- **Admin UI**: Manage API keys, modes (Sandbox/Live), and callback URLs directly from the admin panel.
- **Secure Storage**: API secrets are encrypted using AES-256-GCM before being saved to `src/data/payment_settings.json`.
- **Mode Switching**: Seamlessly toggle between Sandbox and Live environments.
- **Webhook Handling**: Basic webhook verification and order status updates.
- **Encryption**: Uses a server-side `ENCRYPTION_KEY` to protect sensitive credentials.

## Setup Instructions

### 1. Environment Variables
Create or update your `.env` file with the following:

```env
# Required for encrypting API secrets
ENCRYPTION_KEY=your-32-char-random-string-here

# Optional: Admin password for the demo login
# ADMIN_PASSWORD=admin123 
```

> **Important**: The `ENCRYPTION_KEY` must be exactly 32 characters long. You can generate one using `openssl rand -hex 16`.

### 2. Installation
Ensure you have the necessary dependencies (already installed in this project):
- `crypto` (Node.js built-in)
- `lucide-react` (Icons)
- `shadcn/ui` components (`tabs`, `switch`, `alert`, `tooltip`)

### 3. Usage

#### Accessing Settings
1. Navigate to `/admin/settings`.
2. Click on the **Payment** tab.
3. Enter your Cashfree credentials for Sandbox and/or Live modes.
4. Toggle the **Mode** switch to select the active environment.
5. Click **Save Changes**.

#### Webhooks
Configure your Cashfree dashboard to send webhooks to:
`https://your-domain.com/api/webhook/cashfree`

**Note**: In the `src/app/api/webhook/cashfree/route.ts` file, signature verification is currently commented out for easier testing. **You must uncomment and verify the logic against the latest Cashfree documentation before going to production.**

## Security Checklist for Production

1.  **[ ] HTTPS**: Ensure your site is served over HTTPS.
2.  **[ ] Secrets Management**: 
    *   Replace the file-based storage (`payment_settings.json`) with a secure database or a dedicated secrets manager (e.g., AWS Secrets Manager, HashiCorp Vault) if scaling.
    *   Do not commit `payment_settings.json` to version control if it contains real keys.
3.  **[ ] Webhook Verification**: Uncomment and strictly enforce signature verification in `src/app/api/webhook/cashfree/route.ts`.
4.  **[ ] Authentication**: Replace the demo login (`/login`) and middleware with a robust authentication system (e.g., NextAuth.js, Clerk).
5.  **[ ] Key Rotation**: Implement a strategy to rotate your `ENCRYPTION_KEY` and Cashfree API keys periodically.

## Developer Notes
- **Encryption**: Logic is in `src/lib/encryption.ts`.
- **Payment Logic**: Core logic for creating orders is in `src/lib/payment.ts`.
- **Database**: `src/lib/db.ts` handles reading/writing to JSON files.
