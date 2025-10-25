Bivo Health Frontend

**Pitch Deck:** https://www.canva.com/design/DAG2yUfbGyE/-KhxOWwR7Ov1WgDTLcZ81Q/edit?utm_content=DAG2yUfbGyE&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton

**2 Mins Video:** https://youtube.com/shorts/5MH3WE40SG4?si=hojKFzMwAhXyOQJY

[25/10/2025, 15:06:03] ~ Chidiebube: `https://youtube.com/shorts/5MH3WE40SG4?si=hojKFzMwAhXyOQJY`
[25/10/2025, 15:13:45] ~ Chidiebube: `https://x.com/BivoHealthhq`

**Summary:** Bivo Health is a patient‑centric medical records web app built with Next.js 15, React 19, and Tailwind. It uses Prisma with Postgres, JWT cookies, and wallet‑based auth (wagmi/web3modal), storing PHI encrypted off‑chain while mirroring minimal metadata on BlockDAG. Users get clean dashboards and CRUD flows for records, doctors, appointments, and insurance.

Overview
- Next.js 15 App Router frontend for Bivo Health, featuring user dashboards, wallet-based login, and CRUD flows for medical records, doctors, appointments, and insurance.
- Uses Prisma with SQLite for local development, optional MySQL for certain legacy/admin features, JWT cookies for API auth, React Query for client-side data flows, and Wagmi/Web3Modal for wallet connectivity.

Tech Stack
- Framework: Next.js 15, TypeScript, React 19
- Styling: Tailwind CSS 4
- Data: Prisma ORM, SQLite (local dev), optional MySQL
- State/Data: @tanstack/react-query
- Auth: JWT (cookies), wallet login (wagmi/web3modal, viem)
- Charts/UI: ApexCharts, lucide-react, framer-motion

Key Features
- Dashboard with navigation and widgets
- CRUD UIs: Medical Records, Doctors, Appointments, Insurance
- Wallet login and BlockDag page
- Admin: Loans requests and overview (MySQL-backed)

Directory Structure
- `src/app/*`: Next.js App Router pages and API routes
- `src/lib/db.ts`: Prisma client and optional MySQL pool
- `prisma/schema.prisma`: Prisma models; migrations in `prisma/migrations`
- `src/app/providers.tsx`: Global providers (React Query, Wagmi)
- `src/components/*`: UI components and layouts

Prerequisites
- Node.js 18+ (recommend 20)
- npm (or pnpm/yarn)
- SQLite available on local filesystem
- Optional: MySQL server if using admin/loans and related MySQL endpoints

Setup
1) Install dependencies
- `cd frontend`
- `npm install`

2) Environment variables
Create `frontend/.env` with at least:
- `DATABASE_URL="file:./prisma/dev.db"`
- `JWT_SECRET="your-secret-key"`
Optional MySQL (for admin/loans and other legacy endpoints):
- `MYSQL_HOST="localhost"`
- `MYSQL_USER="root"`
- `MYSQL_PASSWORD=""`
- `MYSQL_DATABASE="Bivo Health"`

3) Database: Prisma
- Ensure the SQLite file exists at `frontend/prisma/dev.db` (created by migrations)
- Apply migrations: `npx prisma migrate dev`
- Generate client: `npx prisma generate`

4) Run the app
- `npm run dev` (Turbopack)
- Dev server runs at `http://localhost:3000`

Data Models (Prisma)
- MedicalRecord
  - `id` (string, cuid)
  - `userId` (string)
  - `title` (string)
  - `description` (string | null)
  - `data` (string; JSON-encoded extras like staff details)
  - `hash` (string | null; optional)
  - `createdAt` (Date)
  - `type` (enum, e.g. ILLNESS)
  - `warningNotes` (string | null)
- Doctor
  - `id`, `userId`, `name`, `specialty`, `phone`, `createdAt`
- Appointment
  - `id`, `userId`, `doctorId`, `date`, `reason`, `notes`, `createdAt`
- Insurance
  - `id`, `userId`, `provider`, `policyNumber`, `coverage`, `phone`, `createdAt`
- User
  - `id`, `email` or `address` (for wallet), other profile fields

Primary Pages
- `/dashboard`: Overview
- `/dashboard/records`: Medical records CRUD UI
- `/dashboard/doctors`: Doctors CRUD UI
- `/dashboard/appointments`: Appointments CRUD UI
- `/dashboard/insurance`: Insurance CRUD UI
- `/dashboard/blockdag`: Wallet-enabled page with wagmi/web3modal
- `/admin/*`: Admin views (e.g. loans), requires admin token

API Overview (JSON)
- Auth (wallet): `POST /api/auth/login/wallet`
  - Body: `{ address: string }`
  - Sets `auth-token` cookie (JWT). Use cookie for subsequent requests.

- Medical Records
  - `GET /api/records` → list
  - `POST /api/records` → create `{ title, description?, type?, warningNotes?, data }`
  - `PUT /api/records/:id` → update
  - `DELETE /api/records/:id` → delete

- Doctors
  - `GET /api/doctors` → list
  - `POST /api/doctors` → create `{ name, specialty, phone }`
  - `PUT /api/doctors/:id`, `DELETE /api/doctors/:id`

- Appointments
  - `GET /api/appointments` → list (includes doctor details)
  - `POST /api/appointments` → `{ doctorId, date, reason, notes }` (validates doctor ownership)
  - `PUT /api/appointments/:id`, `DELETE /api/appointments/:id`

- Insurance
  - `GET /api/insurance`
  - `POST /api/insurance` → `{ provider, policyNumber, coverage, phone }`
  - `PUT /api/insurance/:id`, `DELETE /api/insurance/:id`

Auth Model
- JWT cookie: `auth-token` set by wallet login route
- Most dashboard API routes read `auth-token` and verify with `process.env.JWT_SECRET`
- Send requests from pages (browser) so cookies are included automatically

Providers
- React Query is registered globally in `src/app/providers.tsx` via `QueryClientProvider`, imported by `app/layout.tsx`
- Wagmi/Web3Modal are configured to provide wallet connectivity for BlockDag-related flows

Development Tips
- If Prisma complains about missing required fields, check `schema.prisma` and migrations (e.g. `hash` is optional)
- Keep `DATABASE_URL` as a `file:` path that resolves correctly; recommended `file:./prisma/dev.db`
- If MySQL-backed features are used, ensure MySQL is running and env vars are set

Troubleshooting
- SQLite “Unable to open database file”
  - Ensure `frontend/prisma/dev.db` exists
  - Use `DATABASE_URL="file:./prisma/dev.db"` (note `./`)
  - The app resolves `file:` URLs to absolute paths, but wrong relative paths can still fail if the working directory differs
- React Query “No QueryClient set”
  - Confirm `src/app/providers.tsx` wraps the app and `app/layout.tsx` uses `Providers`
- Auth errors
  - Make sure `JWT_SECRET` is set and wallet login returns `200` with cookie

Deployment Notes
- SQLite is great for local/dev; for production/serverless consider PostgreSQL (Supabase/Neon). Update `schema.prisma` provider and `DATABASE_URL` accordingly.
- If deploying to environments with read-only or ephemeral filesystems, avoid SQLite files and use a managed DB.

Common Scripts
- `npm run dev` → start local dev server (Turbopack)
- `npm run build` → production build
- `npm run start` → run production server
- `npx prisma migrate dev` → apply migrations
- `npx prisma generate` → regenerate Prisma client

Contact & Support
- Help page: `/dashboard/help`
- For issues with setup, share logs from the dev server and API responses.

Smart Contracts (BlockDAG)
- Location: `contracts/hardhat/contracts/MedicalRecords.sol`
- Purpose: Store medical record metadata on-chain while keeping PHI encrypted off-chain.
- Access model: Patient is the owner; per-patient operator auth via `grantAccess(operator, allowed)`.
- Core functions:
  - `createRecord(title, description, uri, contentHash, encryptedData, iv, mime)`
  - `createRecordFor(patient, title, description, uri, contentHash, encryptedData, iv, mime)`
  - `updateRecord(id, title, description, uri, contentHash, encryptedData, iv, mime)`
  - `deleteRecord(id)` (soft delete)
  - `getRecord(id)`, `getRecordData(id)`, `getRecordsByOwner(owner)`, `recordsCount(owner)`
- Stored fields: `owner`, `title`, `description`, `uri`, `contentHash`, `encryptedData`, `iv`, `mime`, `createdAt`, `updatedAt`, `deleted`.

BlockDAG Network
- Awakening network (chainId `1043`) via `https://relay.awakening.bdagscan.com`.
- Hardhat config: `contracts/hardhat/hardhat.config.ts` defines the `awakening` network and custom Etherscan settings for BDAG Scan.

Deploy Contracts (Hardhat)
- `cd contracts/hardhat`
- `npm install`
- Create `.env` with `DEPLOYER_PRIVATE_KEY="<your-private-key>"`
- Compile: `npm run compile`
- Deploy MedicalRecords: `npm run deploy:records`
- Output shows the deployed address. Visit BDAG Scan to view transactions and contract.

Verify on BDAG Scan
- BDAG Scan supports custom chain verification configured in Hardhat.
- Use `@nomicfoundation/hardhat-verify` (or the BDAG Scan UI) with your source files.
- If using the UI, flatten the contract and paste code; otherwise run a verify task if available.

On‑Chain Record Flow
- `contentHash`: Compute as keccak256 of the plaintext JSON record (e.g., staff data) for integrity.
- `encryptedData`: AES-GCM ciphertext of the JSON record; keep keys off-chain.
- `iv`: AES-GCM IV (12 bytes recommended) used for encryption; store alongside ciphertext.
- `mime`: Typically `application/json` for structured payloads.
- `uri`: Optional IPFS/HTTP pointer to off-chain content.
- Ownership: The patient is `owner`. Practitioners can act via `createRecordFor` after `grantAccess`.

Frontend Integration (wagmi/viem)
- Set `NEXT_PUBLIC_MEDICAL_RECORDS_ADDRESS` in `frontend/.env` with the deployed address.
- Use wagmi/viem to call contract methods from the wallet-enabled BlockDag page or dedicated flows.
- Typical create flow:
  - Build JSON payload; compute `contentHash`.
  - Encrypt to `encryptedData`, generate 12-byte `iv`.
  - Call `createRecord(...)` via the connected wallet; await tx receipt.
- Recommended: Mirror minimal metadata (on-chain `id`, `contentHash`) into Prisma for indexing/search. Keep PHI off-chain.

Contracts Source and Tooling
- Hardhat sources: `contracts/hardhat/contracts`, scripts: `contracts/hardhat/scripts`.
- Foundry setup exists under `contracts/foundry` for advanced workflows; OpenZeppelin libs included.

Security Notes
- Never put PHI directly on-chain; only encrypted blobs and hashes.
- Rotate operator access via `grantAccess` and ensure wallets are controlled by authorized providers.
- Consider adding role separation and event indexing for audit trails if expanding functionality.