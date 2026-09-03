# Security & QA Audit Report

## Critical Bugs
- **Broken Authentication in Inspection API:** The `backend/api/inspection.php` script contains a dummy JWT validation implementation that only checks if the `Authorization` header begins with `Bearer ` and fails to decode or verify the actual token. This allows any user to spoof authorization and submit unauthorized inspections.
- **Data Spoofing / Insecure Direct Object Reference in Billing Logic:** The `create_invoice` endpoint in `backend/api/api_workshop_flow.php` trusts the `subtotal` and `grand_total` values sent by the client payload. This allows a malicious user or tampered client request to alter the final price of the invoice and create invoices for arbitrary amounts despite having billed line items.
- **Silent Data Loss on Network Failures (Frontend):** The API utility (`frontend/src/utils/api.ts`) contains a fallback mechanism that intercepts failed write operations (POST, PUT, DELETE) and caches them in local storage while erroneously returning a `success: true` response to the application state. This causes the UI to report successful synchronization, leading to permanent data loss and out-of-sync states when the application unloads.

## High/Medium Risks
- **Overly Permissive CORS Policy:** The `backend/config.php` file dynamically reflects the requesting `Origin` and sets `Access-Control-Allow-Credentials: true`. This effectively allows any origin to read authenticated responses, completely undermining cross-origin security if not coupled with origin whitelisting.
- **Improper Type Casting in Financial Calculations:** Mathematical calculations involving user input or dynamic values were relying on implicit casting, which can lead to `TypeError` exceptions in PHP 8 if an empty string or null is provided for billing discounts.

## Recommended Fixes
- **Enforce Cryptographic JWT Validation:** Replaced the unsafe header prefix check in `backend/api/inspection.php` with the core `get_user_id_from_token()` function to properly validate the signature and extract the authenticated user ID.
- **Server-Side Financial Validation:** Updated `create_invoice` in `backend/api/api_workshop_flow.php` to calculate the `subtotal` and `grand_total` dynamically by iterating through the `items` array on the backend. This ensures invoices reflect the true cost of their constituent line items, and casted inputs using `floatval()`.
- **Restore Proper Error Handling:** Modified the `isWriteMethod` block in `frontend/src/utils/api.ts` to return `success: false` and a clear error message instead of the deceptive offline local storage cache. This enables the UI to properly render error boundaries and alert the user to retry the operation.
