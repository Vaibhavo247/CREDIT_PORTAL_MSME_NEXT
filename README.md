# Suryoday MSME Portal - Developer Guide

This repository contains the Next.js App Router frontend for the Suryoday MSME and FT-Cash Underwriting Management Portal.

## 1. Project Architecture & Local Setup

### Setup Instructions
1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```
2. Copy the environment variables template:
   ```bash
   cp .env.example .env.local
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

### Architecture
- **Next.js 15 App Router**: Uses Server Components (`page.js`) for data fetching and authorization, and Client Components (`*Client.js`) for interactive UI elements.
- **Tailwind CSS**: Utility-first styling.
- **Centralized API Services**: All networking and encryption goes through `src/services/api.js`.

---

## 2. Role-Based Access Control (RBAC) Matrix

The portal strictly enforces authorization at the Server Component level. If a user attempts to access an unmapped page, they will be securely redirected to the `/unauthorized` route.

- **`ADMIN`**: Super user access. Full read/write access to all pages and workflow actions.
- **`CREDIT`**: Underwriter access. Has access to all dashboard metrics, leads, application lists, and the **Workflow Action** panel (Approve/Reject).
- **`AUDIT`**: Read-only compliance access. Can view all applications (Pending, Approved, Rejected) but **cannot** see the Workflow Action panel or mutate data.
- **`USERACCESS`**: IT/Access management. Only has access to the `/add-employee` and `/employee-access` panels.

> Roles are defined and centrally managed in `src/constants/index.js`.

---

## 3. API Configuration & Headers

All external network requests to the bank's backend are routed through `src/services/api.js` (`serverFetch` function).

### Where Headers are defined
If you need to change headers (like `Authorization` or `x-api-key`), you must do it inside the `serverFetch` function in `src/services/api.js`.
- The `Authorization: Bearer <token>` is automatically injected from the `sso_token` HTTP-only cookie.
- The `x-api-key` is automatically injected from `process.env.API_KEY`.
- Payloads are **AES Encrypted** by default using `CryptoJS` inside `api.js`.

### Environment Variables
- `API_BASE_URL`: Base URL for the Java/Spring API.
- `API_KEY`: The AES secret key used to encrypt the payload bodies.

---

## 4. Troubleshooting API Data Mapping

If data from the backend API is not rendering correctly in the UI, follow these steps:

1. **Check the Client Component Props**: Look at the `page.js` (Server Component). It fetches data using `serverFetch()` and passes it to the `*Client.js` component as `initialData`.
2. **Verify the Response Format**: 
   - `serverFetch` automatically attempts to decrypt the payload. 
   - The standardized returned structure will ALWAYS expose the decrypted data at `response.data`.
3. **Inspect the `useEffect` Logs**:
   - Inside your `*Client.js` files, temporarily add a `useEffect` to trace the data structure:
     ```javascript
     useEffect(() => {
       console.log("=== API DATA ===", initialData);
     }, [initialData]);
     ```
   - If `initialData` is empty but the network request succeeded, it means the API's JSON keys have changed (e.g., from `response.data` to `response.payload.details`). You must map the new keys inside the `page.js` before passing them down.

---

## 5. Logging & Debugging Strategy

For security and compliance reasons, do not leave `console.log()` statements containing Sensitive PII in production Client Components.

### Server-Side Debugging
If an API request fails, `src/services/api.js` will output server-side logs to the **terminal running `npm run dev`**. It will print:
- `SERVER FETCH TO: [URL] HEADERS: {...}`
- `FETCH ERROR STATUS: 500`

### Local Development Bypass (`DEV_BYPASS`)
To work locally without relying on the live SSO authentication flow:
1. Ensure `DEV_BYPASS=true` is set in your `.env.local`.
2. On the login screen (`/`), click the **DEV BYPASS** button at the bottom right.
3. This will locally stub a dummy SSO token and route you into the dashboard as an Admin, allowing you to bypass the bank's SSO gateway for UI development.

> **Security Note:** `DEV_BYPASS` will **only** work if `NODE_ENV === "development"`. It is structurally disabled in production builds. SSL Bypass (`rejectUnauthorized: false`) is also strictly isolated to local development environments.
