# SellerPath – Setup & Backend Integration Guide

AI-assisted seller onboarding: **React + Vite + Tailwind** frontend, **Spring Boot + Gemini** backend.

```
seller-onboarding/
├── frontend/   React app            (runs on http://localhost:5173)
├── backend/    Spring Boot API      (runs on http://localhost:8080)
└── INTEGRATION_GUIDE.md   this file
```

---

## 1. Run the frontend (no backend needed)

```bash
cd frontend
cp .env.example .env        # Windows: copy .env.example .env
npm install
npm run dev
```

Open http://localhost:5173. With `VITE_USE_MOCK=true` (the default in `.env.example`) the app uses fake data
stored in your browser, so every page and button works without a server.
Register any test account, fill in the wizard, and on **Application status** use the demo buttons to preview
the *Approved* and *Rejected* screens.

## 2. Run the backend

You need **JDK 17+** and **Maven** (or open `backend/` in IntelliJ IDEA / VS Code, which handle Maven for you).

```bash
cd backend
cp .env.example .env        # then edit .env – at minimum set JWT_SECRET
mvn spring-boot:run
```

With no database settings it uses a local **H2 file database** (`backend/data/`), so nothing else is required.
The API is now at http://localhost:8080.

## 3. Connect the frontend to the backend

Edit **`frontend/.env`**:

```
VITE_API_BASE_URL=http://localhost:8080
VITE_API_PREFIX=/api
VITE_USE_MOCK=false
```

Restart `npm run dev` (Vite only reads `.env` at startup). Done – register a new account (mock accounts do not carry over).

If the browser shows a CORS error, make sure `CORS_ALLOWED_ORIGINS` in `backend/.env` contains the exact address of your frontend (including the port).

---

## 4. Where every secret lives

| Value | Put it in | Visible to browser? |
|---|---|---|
| Backend URL (`VITE_API_BASE_URL`) | `frontend/.env` | Yes – it is public by nature |
| Route prefix (`VITE_API_PREFIX`) | `frontend/.env` | Yes |
| Mock switch (`VITE_USE_MOCK`) | `frontend/.env` | Yes |
| **Gemini API key** (`GEMINI_API_KEY`) | `backend/.env` | **Never** |
| **Database URL / user / password** (`DB_*`) | `backend/.env` | **Never** |
| **JWT secret** (`JWT_SECRET`) | `backend/.env` | **Never** |
| **Storage credentials** (S3 etc., if you add them) | `backend/.env` | **Never** |

**The rule:** anything starting with `VITE_` is copied into the JavaScript that every visitor downloads.
Never put a key, password or token there. Both `.gitignore` files already exclude `.env`; only the
`.env.example` templates (which contain no real secrets) are committed.
If a real key is ever committed or pasted somewhere public, treat it as leaked and rotate (replace) it.

---

## 5. Database

**Default (development):** H2, a file database created automatically. Nothing to configure.

**PostgreSQL (recommended for real use):**
1. Create a database: `CREATE DATABASE selleronboarding;`
2. In `backend/.env` add:
   ```
   DB_URL=jdbc:postgresql://localhost:5432/selleronboarding
   DB_USERNAME=postgres
   DB_PASSWORD=your-password
   ```
3. Restart the backend. Tables (`users`, `seller_applications`, `seller_documents`) are created automatically
   because `DDL_AUTO` defaults to `update`.

**MySQL:** in `backend/pom.xml` replace the PostgreSQL dependency with `com.mysql:mysql-connector-j` (scope `runtime`), then use a `jdbc:mysql://…` URL.

**Hosted Postgres (Supabase, Neon, etc.):** use their JDBC connection string and password in `backend/.env`.
The frontend never talks to the database directly, so no database or "service role" key ever goes in React.

Before going live, set `DDL_AUTO=validate` and manage schema changes with a migration tool (Flyway or Liquibase).

## 6. Authentication

1. `POST /api/auth/register` or `/login` → backend checks the password (stored as a BCrypt hash) and returns a **JWT token**.
2. The frontend saves the token in `localStorage` (`AuthContext.jsx`) and `services/apiClient.js` adds
   `Authorization: Bearer <token>` to every request automatically.
3. `JwtAuthFilter` (backend) verifies the token and tells Spring who the user is.
4. If the token is invalid or expired, the backend answers `401` and the frontend sends the user to `/login`.

Configure it with `JWT_SECRET` (32+ random characters, e.g. `openssl rand -base64 48`) and `JWT_EXPIRATION_MINUTES`.
The backend refuses to start without a valid secret, on purpose.

*Trade-off to know:* `localStorage` tokens can be stolen if the site has an XSS bug. For a production hardening
step, move to httpOnly cookies.

## 7. AI assistant (Gemini)

1. Get a key from Google AI Studio and put it in `backend/.env` as `GEMINI_API_KEY=...`.
2. Flow: React chat → `POST /api/ai/chat` → `GeminiService` → Gemini → reply back to React.
3. `GeminiService` adds the seller's saved application and a server-computed "missing items" list to the prompt, so answers
   are about *their* application. Phone, tax ID and registration number are removed before anything is sent to Google.
4. The model name is `GEMINI_MODEL` (default `gemini-2.5-flash`). Model names change over time, so check Google's current model list if the call fails.
5. Without a key, the endpoint returns a clear "not configured" message and the rest of the app still works.

## 8. Document storage

Uploads go **browser → backend → storage**. `DocumentService` checks the type, size (5 MB) and the file's real
content (not just its extension), then saves it under `UPLOAD_DIR` with a random name. Only metadata is stored in the database.

To move to S3 / Supabase Storage / Cloudinary: change only the "write the file" lines in `DocumentService.store()`
and put that service's credentials in `backend/.env`. Never serve the uploads folder publicly – these are identity documents.

---

## 9. API contract (PROPOSED – the backend developer must confirm)

All routes are defined in one file: `frontend/src/services/endpoints.js` (prefix via `VITE_API_PREFIX`).
Errors from the backend must look like `{ "message": "human readable text" }` – the frontend shows that text.

| Method | Route | Body → Response |
|---|---|---|
| POST | `/api/auth/register` | `{fullName,email,password}` → `{token,user:{id,email,fullName}}` |
| POST | `/api/auth/login` | `{email,password}` → `{token,user}` |
| GET | `/api/seller/profile` | → `{id,email,fullName}` |
| PUT | `/api/seller/profile` | `{fullName}` → same |
| GET | `/api/onboarding/status` | → `{status,currentStep,draft,feedback,missingRequirements[],submittedAt,updatedAt}` |
| PUT | `/api/onboarding/draft` | `{currentStep,draft}` → same as status (save progress) |
| POST | `/api/onboarding/submit` | `{draft}` → same as status |
| POST | `/api/documents/upload` | multipart `file`, `type` → `{id,name,size,type}` |
| POST | `/api/ai/chat` | `{message,step,history[{role,text}]}` → `{reply,suggestions[]}` |

`status` is one of `draft | pending | approved | rejected`.
`PUT /api/onboarding/draft` is an extra route (not in your original list) that powers "Save progress".

---

## 10. File map (where to look, where integration happens)

### Frontend – `frontend/`
| File | What it does | Backend integration |
|---|---|---|
| `.env.example` | Template for public settings | **Add `VITE_API_BASE_URL` here** |
| `src/services/apiClient.js` | The one shared Axios instance, token header, 401 handling, error messages | **Backend URL is read here** |
| `src/services/endpoints.js` | Every route in one place | Change routes here |
| `src/services/authAPI.js` `sellerAPI.js` `onboardingAPI.js` `documentAPI.js` `chatbotAPI.js` | One function per endpoint; each switches between real call and mock | **Each call = one backend route** |
| `src/mocks/` | Fake backend (localStorage) + demo review panel | Delete later if you like; used only when `VITE_USE_MOCK=true` |
| `src/context/AuthContext.jsx` | Login state, token storage | Uses authAPI + sellerAPI |
| `src/context/OnboardingContext.jsx` | Loads/saves the application for all pages | Uses onboardingAPI |
| `src/utils/onboarding.js` | Steps, validation rules, progress – single source of truth | Mirrored by `OnboardingService.findMissing` on the backend |
| `src/layouts/` | Public, auth (split screen) and dashboard layouts | – |
| `src/components/` | Sidebar, Navbar, ProgressBar, OnboardingSteps, Chatbot (+ChatWidget), InputField, FileUpload, StatusCard, LoadingSpinner, Button, Alert, Logo, ProtectedRoute | FileUpload → documentAPI; Chatbot → chatbotAPI |
| `src/components/onboarding/StepForms.jsx` | The six wizard steps | – |
| `src/pages/` | Landing, Login, Register, Dashboard, Onboarding (wizard), Tracking, Assistant, NotFound | – |
| `src/hooks/` | `useAuth`, `useOnboarding`, `useChat` | – |

### Backend – `backend/src/main/java/com/example/selleronboarding/`
Your requested structure, with the files below added where the feature needed them.

| Package | Files | Notes |
|---|---|---|
| `config/` | `CorsConfig`, `GeminiConfig` (as requested) + **`SecurityConfig`, `JwtAuthFilter`** (added) | Security decides which routes need a login |
| `controller/` | `AuthController`, `SellerController`, `OnboardingController`, `ChatbotController` (as requested) + **`DocumentController`** (added) | One class per route group |
| `service/` | `AuthService`, `SellerService`, `GeminiService` (as requested) + **`OnboardingService`, `DocumentService`, `JwtService`** (added) | Business logic lives here |
| `repository/` `entity/` `dto/` | Spring Data repositories, JPA entities, request/response records | |
| **`exception/`** (added) | `ApiException`, `GlobalExceptionHandler` | Turns every error into `{message}` |
| `resources/application.properties` | Reads all settings from environment variables / `.env` | **Secrets are referenced here, never written here** |

---

## 11. Honest limitations (read before going live)

- **No reviewer/admin side yet.** Nobody can approve or reject applications except by editing the database.
  To test, run for example: `UPDATE seller_applications SET status='APPROVED', feedback='Welcome!' WHERE id=1;`
  (or `'REJECTED'` with a `feedback` and `missing_requirements_json='["Upload a clearer ID"]'`). Building an admin role is the natural next feature.
- **No email verification, password reset, or rate limiting** on login and chat. Add these before real users arrive.
- **The backend was written but not compiled or run in the environment where this was generated** (no Maven/Maven Central access there).
  Expect to fix small compile errors on first run and send me the message if you hit one. The frontend, in contrast, was built and tested end to end in a real browser.
- **Document requirements are examples** (ID, business registration, tax certificate, proof of address). Confirm the real list with whoever owns the platform's seller policy, then edit `src/utils/constants.js` and `OnboardingService.findMissing`.
- Frontend validation is for convenience; the backend re-checks on submit and is the real gatekeeper.

## 12. Deploying later

- Frontend: `npm run build` → upload `dist/`. `VITE_*` values are baked in at **build time**, so set them in your host's build settings.
- Backend: set the same variables from `backend/.env` as real environment variables on the server (never upload the `.env` file),
  and set `CORS_ALLOWED_ORIGINS` to your real frontend URL.
