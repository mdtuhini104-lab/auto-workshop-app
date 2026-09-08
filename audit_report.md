# End-to-End Code Audit and Security Review

## Critical Bugs

### 1. Backend Dynamic CORS Misconfiguration
**File:** `backend/config.php` and `backend/api/*.php`
**Issue:** The CORS policy dynamically reflects the `HTTP_ORIGIN` header back into the `Access-Control-Allow-Origin` header and sets `Access-Control-Allow-Credentials: true`. This entirely defeats CORS protections, allowing any malicious domain to make cross-origin requests on behalf of an authenticated user (CSRF).
**Impact:** A malicious site can steal or modify user data, bypass authentication, and exploit internal APIs on the victim's behalf.

### 2. Broken Access Control / Incomplete Authorization
**File:** `backend/api/api_customers.php`, `backend/api/api_inventory_ledger.php`, `backend/api/api_purchases_grn.php`, `backend/api/api_quotations.php`
**Issue:** These files entirely lack calls to `get_user_id_from_token()` and `require_permission()`.
**Impact:** Anyone can make unauthenticated requests to modify customers, modify inventory ledgers, submit goods received notes (GRN), and save quotations. This results in complete data loss or compromise of core business domains.

### 3. Arbitrary DDL Statements in Application Logic
**File:** `backend/api/api_customers.php` and `backend/api/api_quotations.php`
**Issue:** These endpoints execute `ALTER TABLE` (in `api_customers.php`) and `CREATE TABLE IF NOT EXISTS` (in `api_quotations.php`) as part of normal request handling. Additionally, `api_customers.php` catches exceptions from these queries silently (`catch (Exception $e) { }`).
**Impact:** This is a severe architectural flaw. It can lead to severe race conditions, database locking issues, performance degradation, and potential data corruption. Schema migrations must never be performed dynamically on user requests.

### 4. Hardcoded JWT Secret & Missing Environment Variables
**File:** `backend/config.php`
**Issue:** The `JWT_SECRET` is hardcoded as `'super_secret_jwt_key_for_auto_workshop_app'`. The database credentials are also hardcoded.
**Impact:** If the source code is compromised or publicly accessible, an attacker can forge JWT tokens with any `user_id` and role (`Super Admin`), gaining full administrative access to the system.

## High/Medium Risks

### 1. Inconsistent Permission Checking Structure
**File:** Multiple `backend/api/*.php` files.
**Issue:** Permission checks rely on hardcoded magic strings for modules and sub-modules (e.g., `'masterData'`, `'units'`). Some endpoints require `true` for edit access, but others use `false` or omit checks completely for critical operations. For instance, `save_inspection` requires permission on `quotations` / `inspections` instead of a dedicated inspection module, creating tightly coupled, fragile permissions.

### 2. Frontend "Silent" Endpoints and Mock Fallbacks
**File:** `frontend/src/utils/api.ts`
**Issue:** The frontend uses an intricate fallback mock system (`getFallbackMockData`) that automatically intercepts 404s, 500s, and network errors for specific endpoints and injects dummy data (e.g., mocked categories, departments, customers).
**Impact:** When the backend fails (as it does currently due to the missing database), the frontend masks the failure and presents hardcoded mock data. This creates a deeply confusing user experience (UX friction), as users appear to have data but cannot persist changes or see real application state.

### 3. Missing CSRF Protections & API Sanitization
**Issue:** The backend does not implement robust input sanitization. While PDO parameterized queries are mostly used to prevent SQL injection, there is no validation for data shapes or types beyond simple `empty()` checks. There's no CSRF token mechanism to accompany the JWT tokens (especially given the broken CORS policy).

### 4. Direct State Modification and Implicit Transaction Complications
**File:** `backend/api/api_workshop_flow.php` (and others)
**Issue:** Transactions (`$pdo->beginTransaction()`) are used, but error handling is inconsistent. If an exception is thrown before a transaction is started but after some state modification, or if multiple transactions are initiated incorrectly, data could be left in an inconsistent state.

## Recommended Fixes

### 1. Fix CORS Misconfiguration
Replace the dynamic reflection with a strict whitelist in `backend/config.php`.

```php
// backend/config.php
$allowed_origins = ['http://localhost:3000', 'https://your-production-domain.com'];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
    header('Access-Control-Allow-Credentials: true');
}
```

### 2. Enforce Authentication and Authorization Globally
Refactor the API architecture to use a centralized router or middleware that guarantees `get_user_id_from_token()` and `require_permission()` are called before executing any controller logic.

```php
// Example Centralized Check for api_customers.php
$user_id = get_user_id_from_token();
if (!$user_id) {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized"]);
    exit;
}
require_permission($pdo, $user_id, 'peoples', 'customers', $action === 'save_customer');
```

### 3. Remove DDL from Application Endpoints
Extract all `CREATE TABLE` and `ALTER TABLE` statements from `api_customers.php` and `api_quotations.php`. Move these to a dedicated, version-controlled database migration script (e.g., `schema.sql` or `migration.sql`).

```php
// Remove this from backend/api/api_customers.php:
// try { $pdo->exec("ALTER TABLE customers ADD COLUMN..."); } catch (Exception $e) { }
```

### 4. Secure Secrets
Use `getenv()` or a `$_ENV` configuration loader (like `vlucas/phpdotenv`) for secrets.

```php
// backend/config.php
define('JWT_SECRET', getenv('JWT_SECRET') ?: die('Missing JWT_SECRET'));
$user = getenv('DB_USER') ?: 'root';
```

### 5. Remove Frontend Mocks in Production
Ensure the mock fallback in `frontend/src/utils/api.ts` is strictly isolated to development or demonstration environments via environment variables, so production users see real errors rather than fake data.

```typescript
// frontend/src/utils/api.ts
if (process.env.NEXT_PUBLIC_USE_MOCKS !== 'true') {
   throw error; // Or return a standardized error response instead of mock data
}
```