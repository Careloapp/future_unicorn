# Carelo

An AI-powered call capture system for home care agencies. Every inbound call is handled by a live voice AI, recorded, transcribed, summarized, and surfaced in a real-time dashboard — so your team never misses a lead or a client.

---

## What's in this repo

```
/                        → React dashboard (Vite + Tailwind + Framer Motion)
carelo_backend/          → Python telephony agent + FastAPI API server
```

The frontend and backend are separate. The dashboard talks to the FastAPI server. The telephony agent runs independently and writes directly to Supabase.

---

## Tech stack

**Frontend**
- React 18, Vite, Tailwind CSS, Framer Motion
- Supabase Auth (JWT sessions)
- Recharts for analytics

**Backend**
- FastAPI + Uvicorn (REST API for the dashboard)
- LiveKit Agents v1.x (telephony agent)
- Supabase (PostgreSQL + Storage + Edge Functions)
- AssemblyAI (STT), Google Gemini (LLM + summaries), Inworld TTS
- Twilio SIP trunk → LiveKit

---

## What's already done

✅ **Frontend**
- Landing page with hero, features, pricing, contact
- Signup/Login with Supabase Auth (real JWT sessions)
- Role-based dashboards (Admin + Employee)
- Admin: KPI cards, call volume chart, audit log with assign/priority/status/notes
- Employee: personal task queue filtered by assigned calls
- Analytics, Performance, Call Logs, Settings, Profile pages
- All data comes from the FastAPI backend — zero hardcoded mock data

✅ **Backend**
- FastAPI server with 12 REST endpoints (see `carelo_backend/src/api/main.py`)
- JWT verification middleware (validates Supabase tokens)
- CORS configured for localhost dev
- Graceful handling when Supabase tables are empty
- LiveKit telephony agent (handles live calls + voicemail)
- Supabase Edge Functions for transcription + summarization
- Database schema: `call_logs` and `voicemails` tables already created
- Storage buckets: `carelo_voicemails`, `call_recordings`, `assets` already created
- Cron jobs for retry logic (transcription/summary failures)

---

## What's remaining (backend setup only)

The code is complete. What's left is configuration — getting your API keys into the right places so everything can talk to each other.

### 1. Create `carelo_backend/.env`

The `.env` file wasn't pushed (it's gitignored). You have all the keys — just need to put them in a file.

Inside `carelo_backend/`, create `.env` and fill it in. Use `carelo_backend/.env.example` as the template.

Keys you need:
- **LiveKit**: URL, API key, API secret
- **Supabase**: URL + service role key (the secret one, not anon)
- **Supabase S3**: access key + secret (Dashboard → Storage → S3 Access Keys)
- **Encryption key**: Run `python carelo_backend/src/encrypt_key_gen.py` once to generate a Fernet key. Save the output as `ENCRYPTION_KEY`. Don't lose it — it encrypts all phone numbers in the DB.

### 2. Deploy Edge Functions + set secrets

From inside `carelo_backend/`:

```bash
# Login to Supabase CLI (only needed once)
npx supabase login

# Link to the project
npx supabase link --project-ref cgraitlxszqxmfwcxynq

# Set the secrets Edge Functions need
npx supabase secrets set ASSEMBLYAI_API_KEY=your_key --project-ref cgraitlxszqxmfwcxynq
npx supabase secrets set GEMINI_API_KEY=your_key --project-ref cgraitlxszqxmfwcxynq

# Deploy both functions
npx supabase functions deploy generate-summary --project-ref cgraitlxszqxmfwcxynq
npx supabase functions deploy transcribe-voicemail --project-ref cgraitlxszqxmfwcxynq
```

> Supabase auto-injects `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` into Edge Functions — don't set those manually.

### 3. Configure Supabase Webhooks

Go to **Supabase Dashboard → Database → Webhooks** and create these two:

| Name | Table | Events | URL |
|---|---|---|---|
| `on_call_log_insert` | `call_logs` | INSERT | `https://cgraitlxszqxmfwcxynq.supabase.co/functions/v1/generate-summary` |
| `on_voicemail_insert` | `voicemails` | INSERT, UPDATE | `https://cgraitlxszqxmfwcxynq.supabase.co/functions/v1/transcribe-voicemail` |

For both, add this HTTP header:
```
Authorization: Bearer <your_service_role_key>
```

### 4. Run cron job migrations

In **Supabase Dashboard → SQL Editor**, run these three files (copy-paste each):

1. `carelo_backend/supabase/migrations/20260416104046_voicemail_transcription_retry_cron.sql`
2. `carelo_backend/supabase/migrations/20260416104115_voicemail_summary_retry_cron.sql`
3. `carelo_backend/supabase/migrations/20260416104140_call_log_summary_retry_cron.sql`

These set up daily retry jobs for failed transcriptions/summaries.

### 5. Upload `beep.wav` to Storage

The voicemail agent needs this audio file.

- Go to **Storage → assets bucket**
- Upload `carelo_backend/src/voicemail/beep_sound_generator/beep.wav`
- Path must be: `beep.wav` (root of the bucket)

---

## Running locally

### Frontend

```bash
npm run dev
```

Runs on `http://localhost:8080` (or whatever port Vite picks).

### Backend API server

```bash
cd carelo_backend
python -m uvicorn api.main:app --reload --port 8000 --app-dir src
```

API docs: `http://localhost:8000/docs`

### Telephony agent

```bash
cd carelo_backend

# Install deps (needs uv — https://docs.astral.sh/uv)
uv sync

# Pre-download ML models (once)
uv run src/agent.py download-files

# Run in dev mode
uv run src/agent.py dev
```

The agent connects to LiveKit and waits for calls from Twilio.

---

## Notes

- The frontend works without the backend running — it just shows empty states.
- The backend API works without the agent running — it just returns empty arrays until calls come in.
- The agent is the only thing that writes to `call_logs` and `voicemails` tables.
- The Edge Functions run automatically when rows are inserted (via webhooks).
- The dashboard is read-only — it doesn't create calls, it just displays and manages them.

For detailed agent architecture and Supabase CLI commands, see `carelo_backend/README.md` and `carelo_backend/supabase/Supabase_README.md`.

---

## Project structure

```
/
├── src/                          # React frontend
│   ├── lib/supabase.ts           # Supabase client
│   ├── services/                 # API layer (api.ts, auth.ts, audit.ts, dashboard.ts)
│   ├── utils/                    # Auth helpers, types
│   ├── routes/                   # ProtectedRoute guard
│   ├── layouts/                  # DashboardLayout
│   ├── pages/                    # All pages (landing, auth, dashboards)
│   └── components/               # Reusable UI components
├── carelo_backend/
│   ├── src/
│   │   ├── agent.py              # Telephony agent entry point
│   │   ├── api/                  # FastAPI server (main.py, routers, middleware)
│   │   ├── config/               # Settings (env var loader)
│   │   ├── db/                   # Supabase client + encryption
│   │   ├── sessions/             # Live call + voicemail handlers
│   │   ├── recordings/           # LiveKit Egress (call recording)
│   │   ├── voicemail/            # Beep player + audio recorder
│   │   └── prompts/              # AI agent system prompt
│   └── supabase/
│       ├── functions/            # Edge Functions (generate-summary, transcribe-voicemail)
│       └── migrations/           # SQL migrations (cron jobs)
├── .env.local                    # Frontend keys (gitignored)
├── .env.example                  # Frontend template
└── README.md                     # This file
```
