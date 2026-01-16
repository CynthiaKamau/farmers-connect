# Farmers Portal

A portal where farmers register and admins certify or decline applications. Built with Node.js, Express, Sequelize (MySQL) for the backend and Next.js for the frontend.

## Features

- Farmer registration with Google Maps location picker (captures coordinates)
- Role-based authentication (Farmer/Admin)
- Admin dashboard with farmer statistics and map visualization
- Admin can list, certify, or decline farmer applications
- Farmer dashboard to view current certification status

## Tech Stack

- **Backend:** Express.js + Sequelize + MySQL
- **Frontend:** Next.js 16 + React 19 + TailwindCSS 4 + TypeScript
- **Auth:** JWT + bcrypt
- **Maps:** Google Maps API (Places Autocomplete + Markers)

## Setup

### Backend

1. Create a MySQL database named `farmers_portal` (or set `DB_NAME` in `.env`).
2. Copy `server/.env.example` to `server/.env` and adjust values.
3. Install dependencies, run migrations, and seed roles/admin:

```bash
cd server

yarn install
yarn db:migrate
yarn db:seed
yarn dev
```

Server runs on `http://localhost:5001`.

### Frontend

1. Copy `client/.env.example` to `client/.env.local` and set:

   - `NEXT_PUBLIC_API_URL=http://localhost:5001`
   - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key`

2. Install and run:

```bash
cd client
yarn install
yarn dev
```

Client runs on `http://localhost:3000`.

## API Endpoints

### Authentication (`/auth`)

| Method | Endpoint         | Description                        | Auth |
| ------ | ---------------- | ---------------------------------- | ---- |
| POST   | `/auth/register` | Register a new user (farmer/admin) | No   |
| POST   | `/auth/login`    | Login, returns `{ token, role }`   | No   |

### Users (`/users`)

| Method | Endpoint         | Description              | Auth         |
| ------ | ---------------- | ------------------------ | ------------ |
| GET    | `/users/roles`   | Get all available roles  | No           |
| GET    | `/users/profile` | Get current user profile | Bearer Token |
| GET    | `/users/:id`     | Get user by ID           | Bearer Token |

### Farmers (`/farmers`)

| Method | Endpoint           | Description                            | Auth         |
| ------ | ------------------ | -------------------------------------- | ------------ |
| GET    | `/farmers/profile` | Get current farmer's record and status | Bearer Token |

### Admin (`/admin`)

| Method | Endpoint                    | Description                                                       | Auth       |
| ------ | --------------------------- | ----------------------------------------------------------------- | ---------- |
| GET    | `/admin/farmers`            | List all farmers with user details                                | Admin only |
| GET    | `/admin/farmers/stats`      | Get farmer counts by status (total, pending, certified, declined) | Admin only |
| POST   | `/admin/farmers/:id/status` | Update farmer status (`pending`, `certified`, `declined`)         | Admin only |

## Database Commands

```bash
# Run migrations
yarn db:migrate

# Rollback all migrations
yarn db:migrate:undo

# Seed roles and admin user
yarn db:seed

# Undo all seeds
yarn db:seed:undo
```

## CI/CD

GitHub Actions workflow runs on push/PR to `main`:

- **Frontend:** Lint + Build
- **Backend:** Syntax check

## Environment Variables

### Backend (`server/.env`)

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=farmers_portal
JWT_SECRET=your_jwt_secret
PORT=5001
```

### Frontend (`client/.env.local`)

```
NEXT_PUBLIC_API_URL=http://localhost:5001
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```
