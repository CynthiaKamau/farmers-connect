# Farmers Portal

A simple portal where farmers register and admins certify or decline applications. Built with Node.js, Express, Sequelize (MySQL).

## Features

- Farmer registration (name, contact, farm details, crop info)
- Admin dashboard to list farmers and update certification status
- Farmer dashboard to check current status

## Tech Stack

- Server: Express + Sequelize + MySQL
- Auth: JWT + bcrypt
- Client: Plain HTML + fetch

## Setup

1. Create a MySQL database named `farmers_portal` (or set `DB_NAME` in `.env`).
2. Copy `server/.env.example` to `server/.env` and adjust values.
3. Install dependencies, run migrations, and seed roles/admin:

```bash
cd server
npm install
npx sequelize db:migrate
npx sequelize db:seed:all
npm run start
```

Server runs on `http://localhost:3000`.

## Try it

- Open `client/index.html` to register a farmer.
- Login at `client/login.html`.
- Admin users are created by the seed script (`ADMIN_EMAIL`/`ADMIN_PASSWORD`). After login as admin, open `client/admin.html`.
- Farmers can view their status at `client/dashboard.html`.

## API Endpoints

- POST `/api/auth/register` – Register farmer
- POST `/api/auth/login` – Login, returns `{ token, role }`
- GET `/api/farmers/me` – Get current farmer record (requires `Authorization: Bearer <token>`)
- GET `/api/admin/farmers` – List farmers (admin only)
- POST `/api/admin/farmers/:id/status` – Update status to `pending|certified|declined` (admin only)

## Migrations

- Create tables: run `npm run db:migrate`
- Roll back all: run `npm run db:migrate:undo`
- Seed roles and admin: run `npm run db:seed`
