# LIBRA-AI Expense Tracker

A full-stack expense tracker built for the Libra AI assignment. The backend is a Node.js, Express, MongoDB, and Mongoose API with JWT authentication, protected expense CRUD, validation, filtering, pagination, and dashboard aggregations. The frontend is React with plain CSS only for styling.

## Features

- JWT registration and login with password hashing.
- Protected APIs so users can only access their own expenses.
- Add, edit, delete, view, search, and filter expenses.
- Pagination, category filter, payment method filter, and date range filter.
- Dashboard totals for all-time spend, current month spend, transaction count, and average spend.
- Recent transactions, category-wise spending, and 12-month spending trend.
- Dark mode with persisted theme preference.
- Plain CSS responsive UI with no styling framework.

## Tech Stack

- Frontend: React, Vite, plain CSS, native Fetch API.
- Backend: Node.js, Express.js, MongoDB, Mongoose.
- Auth: JWT and bcryptjs.

## Project Structure

```text
client/
  src/
    components/
    context/
    hooks/
    pages/
    services/
    utils/
server/
  config/
  controllers/
  middleware/
  models/
  routes/
  utils/
  validations/
```

## Setup

1. Install dependencies:

```bash
npm run install:all
```

2. Start MongoDB locally or use MongoDB Atlas and update `server/.env`.

3. Start the backend:

```bash
npm run dev:server
```

4. Start the frontend in another terminal:

```bash
npm run dev:client
```

5. Open `http://127.0.0.1:5173`.

## API Documentation

Base URL: `http://localhost:5000/api`

### Health

`GET /health`

Returns API health status.

### Auth

`POST /auth/register`

```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

`POST /auth/login`

```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

`GET /auth/me`

Requires `Authorization: Bearer <token>`.

### Dashboard

`GET /dashboard`

Requires auth. Returns summary totals, category breakdown, monthly trend, and recent transactions.

### Expenses

All expense endpoints require `Authorization: Bearer <token>`.

`POST /expenses`

```json
{
  "title": "Lunch",
  "amount": 350,
  "category": "Food",
  "paymentMethod": "UPI",
  "notes": "Office lunch",
  "expenseDate": "2026-06-07"
}
```

`GET /expenses`

Query parameters:

- `search`: search title, category, notes, and payment method.
- `category`: one of `Food`, `Travel`, `Bills`, `Shopping`, `Health`, `Education`, `Entertainment`, `Utilities`, `Other`.
- `paymentMethod`: one of `Cash`, `Card`, `UPI`, `Bank Transfer`, `Wallet`, `Other`.
- `from`: start date.
- `to`: end date.
- `page`: page number.
- `limit`: page size, max 50.
- `sortBy`: `expenseDate`, `amount`, `title`, `category`, or `createdAt`.
- `sortOrder`: `asc` or `desc`.

`GET /expenses/:id`

`PUT /expenses/:id`

`DELETE /expenses/:id`

## Screenshots

Add screenshots after running locally or deploying:

- Login page.
- Dashboard summary and charts.
- Expense history with search and filters.
- Dark mode.

## Deployment Notes

- Frontend can be deployed to Vercel or Netlify from `client/`.
- Backend can be deployed to Render or Railway from `server/`.
- Set `CLIENT_ORIGIN` on the backend to the deployed frontend URL.
- Set `VITE_API_URL` on the frontend to the deployed backend API URL.
