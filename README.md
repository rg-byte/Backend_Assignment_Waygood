# WayGood Backend — Review Notes

Setup, credentials, and endpoint documentation for reviewing:

- `POST /api/applications`
- `GET /api/universities/popular`
- `PATCH /api/applications/:id/status`

---

## Setup Instructions

1. **Clone and install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Create your `.env` file**

   Copy `.env.example` to `.env` in the `backend` folder (not committed to git):
   ```bash
   cp .env.example .env
   ```

3. **Fill in `.env`** with real values:
   ```
   PORT=4000
   MONGODB_URI=<your MongoDB Atlas connection string>
   JWT_ACCESS_SECRET=<long random string>
   JWT_REFRESH_SECRET=<a different long random string>
   JWT_EXPIRES_IN=1d
   CACHE_TTL_SECONDS=300
   REDIS_URL=
   OPENAI_API_KEY=
   ```

   Generate strong secrets with:
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```
   Run twice — `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` must be two **different** values.

   > **Note on special characters:** if your MongoDB password contains `@`, `:`, `/`, or `%`, it must be URL-encoded in the connection string (e.g. `@` → `%40`).

4. **Seed the database**
   ```bash
   npm run seed
   ```
   This wipes and repopulates `universities`, `programs`, `students`, and `applications` collections from `src/data/seedData.js`. Console output confirms counts on success.

5. **Start the server**
   ```bash
   npm run dev
   ```
   Server runs at `http://localhost:4000` (or whatever `PORT` is set to).

---

## Sample Credentials

Seeded via `npm run seed` — use these to obtain a JWT via `POST /api/auth/login` if a route requires auth:

| Role | Email | Password |
|---|---|---|
| Student | `aarav@example.com` | `Candidate123!` |
| Student | `sara@example.com` | `Candidate123!` |
| Counselor | `counselor@example.com` | `Candidate123!` |

> **IDs are not stable across reseeds.** Every `npm run seed` run generates new MongoDB `_id`s. Always fetch current IDs from the database (MongoDB Compass, or `GET /api/universities` / `GET /api/programs` / a login response) before testing — don't hardcode IDs from a previous session.

---

## Environment Notes

- **Caching**: `GET /api/universities/popular` and the dashboard overview endpoint use an in-memory cache (`services/cacheService.js`) with TTL from `CACHE_TTL_SECONDS` (default 300s). This is **per-process** — it resets on server restart and does not sync across multiple instances. Redis (`REDIS_URL`) is stubbed for a production-grade swap but not required to run the project.
- **Indexes**: compound indexes exist on `University` (`country + scholarshipAvailable`), `Program` (`country + degreeLevel + tuitionFeeUsd`), and `Application` (`student + status`, plus a unique index on `student + program + intake` to prevent duplicate applications at the database level).
- **DNS on Windows**: if `npm run seed` fails with `querySrv ECONNREFUSED`, this is a known Node-on-Windows DNS resolution issue unrelated to your Atlas credentials. `database.js` already sets `dns.setServers(["8.8.8.8", "1.1.1.1"])` to work around it.

---

## Endpoint 1: `GET /api/universities/popular`

Returns the top 10 universities by `popularScore`, cached.

**Request**
```
GET http://localhost:4000/api/universities/popular
```
No auth, no body, no query params required.

**Success response** — `200 OK`
```json
{
  "success": true,
  "data": [ /* array of up to 10 university objects */ ],
  "meta": { "cache": "miss" }
}
```
Call it again within `CACHE_TTL_SECONDS` and `meta.cache` should read `"hit"`.

### Edge Cases

| Case | How to trigger | Expected result |
|---|---|---|
| Cache hit | Call the route twice in a row | Second call returns `meta.cache: "hit"`, same data, faster response |
| Cache expiry | Wait past `CACHE_TTL_SECONDS`, call again | `meta.cache: "miss"` again, cache repopulated |
| Empty collection | Run against a freshly-created, unseeded database | `200 OK`, `data: []` — not an error |
| Wrong method | `POST` or `DELETE` to the same URL | `404 Not Found` (route only registers `GET`) |

---

## Endpoint 2: `POST /api/applications`

Creates a new application for a student to a program/intake.

**Request**
```
POST http://localhost:4000/api/applications
Content-Type: application/json
```
```json
{
  "studentId": "<real student _id>",
  "programId": "<real program _id>",
  "intake": "September",
  "note": "Optional note"
}
```

**Success response** — `201 Created`
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "student": { "fullName": "...", "email": "...", "role": "..." },
    "program": { "title": "...", "degreeLevel": "...", "tuitionFeeUsd": 0 },
    "university": { "name": "...", "country": "...", "city": "..." },
    "intake": "September",
    "status": "draft",
    "timeline": [ { "status": "draft", "note": "...", "changedAt": "..." } ]
  }
}
```

### Edge Cases

| Case | How to trigger | Expected result |
|---|---|---|
| Missing required field | Omit `studentId`, `programId`, or `intake` | `400` — `"studentId, programId, and intake are required."` |
| Nonexistent student | Valid-format but unmatched `studentId` | `404` — `"Student not found."` |
| Nonexistent program | Valid-format but unmatched `programId` | `404` — `"Program not found."` |
| Invalid intake | `intake` not in the program's `intakes` array | `400` — `"Program does not offer a "<value>" intake."` |
| Duplicate application | Same `studentId` + `programId` + `intake` sent twice | `409 Conflict` — `"An application already exists for this student, program, and intake."` |
| Malformed ObjectId | `studentId: "not-a-real-id"` | Mongoose `CastError` (not yet normalized to a clean 4xx — known gap, see below) |

> **Known gap:** malformed (non-ObjectId-shaped) IDs currently throw a raw Mongoose `CastError` rather than a clean `400`. Recommended fix: validate ID format with `mongoose.Types.ObjectId.isValid()` before querying.

---

## Endpoint 3: `PATCH /api/applications/:id/status`

Transitions an application to a new status and appends a timeline entry.

**Valid transitions**
```
draft → submitted
submitted → under-review | rejected
under-review → offer-received | rejected
offer-received → visa-processing | rejected
visa-processing → enrolled | rejected
enrolled → (terminal, no further transitions)
rejected → (terminal, no further transitions)
```

**Request**
```
PATCH http://localhost:4000/api/applications/<application _id>/status
Content-Type: application/json
```
```json
{
  "status": "submitted",
  "note": "Optional note"
}
```

**Success response** — `200 OK`
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "status": "submitted",
    "timeline": [
      { "status": "draft", "note": "...", "changedAt": "..." },
      { "status": "submitted", "note": "...", "changedAt": "..." }
    ]
  }
}
```

### Edge Cases

| Case | How to trigger | Expected result |
|---|---|---|
| Invalid transition | `draft` → `enrolled` directly | `400` — lists the allowed next statuses for the current status |
| Terminal status | Attempt any transition from `enrolled` or `rejected` | `400` — `"Allowed: none (terminal status)."` |
| Missing status in body | Send `{}` | `400` — `"New status is required."` |
| Nonexistent application | Valid-format but unmatched `:id` | `404` — `"Application not found."` |
| Same status resent | `submitted` → `submitted` | `400` (not in its own allowed-transitions list — no-op transitions are rejected) |

---

## Quick Test Order (recommended)

1. `POST /api/auth/register` or use seeded credentials above to confirm login works
2. `GET /api/universities/popular` — confirm cache miss → hit
3. `GET /api/universities` and `GET /api/programs` — grab fresh IDs from the response
4. `POST /api/applications` — create, then retry the same payload to confirm the 409 duplicate check
5. `PATCH /api/applications/:id/status` — walk it through `draft → submitted → under-review`, then try an invalid jump to confirm the transition guard