**Local Demo Setup (native, no Docker)**

1. Make sure MongoDB is running locally on `127.0.0.1:27017` (a native Windows MongoDB service works fine — Redis is optional and safely skipped if `REDIS_URL` is left blank).
2. From the repo root: `npm install` (installs both workspaces).
3. Copy `backend/.env.example` to `backend/.env` — dev defaults work out of the box, no secrets required outside of production.
4. Seed demo data: `npm run seed:backend` (creates seeded products, stores, and two users — `admin@smartprice.local` / `AdminPass123!` and `demo@smartprice.local`, see `backend/src/scripts/seed.js` for current passwords).
5. Start both servers together: `npm run dev` (backend on :5000, frontend on :5173).

**Deploy Guide**

- Build frontend and embed into backend image (one command):

```bash
npm run docker:build:backend-with-frontend
```

- Or build frontend and serve separately (recommended for production):

1. Build frontend image:
```bash
cd frontend
docker build -t smartprice/frontend .
```

2. Build backend image:
```bash
cd backend
docker build -t smartprice/backend .
```

- Environment variables: copy `.env.example` to `.env` and set secure values for `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET`. Configure `MONGODB_URI`, `REDIS_URL`, and SMTP settings if needed.

- Running locally (dev):
```bash
npm install
npm run dev
```

- Seeding sample data (after backend is running):
```bash
npm run seed:backend
```
