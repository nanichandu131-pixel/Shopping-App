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
