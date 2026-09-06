# Event & Parking Reservation System — Angular 21 Frontend

This frontend was rebuilt from the supplied plain HTML/CSS/JavaScript frontend as a standalone Angular application and mapped to the supplied ASP.NET Core backend DTOs and endpoints.

## Stack

- Angular 21 standalone components
- Angular Router with lazy-loaded feature routes and route guards
- HttpClient with JWT interceptor
- Template-driven and reactive forms
- RxJS + Angular signals for UI/shared state
- CSS responsive layout (no UI framework required)
- Backend: supplied ASP.NET Core API on `http://localhost:5001`

## Quick start

### 1. Start the supplied backend

From the backend project folder:

```powershell
dotnet restore
dotnet run --launch-profile https
```

The supplied launch profile exposes:

- API HTTP: `http://localhost:5001`
- API HTTPS / Swagger: `https://localhost:7001/swagger`

### 2. Start this Angular frontend

```powershell
npm install
npm start
```

Open `http://localhost:4200`.

The Angular dev server uses `proxy.conf.json` so requests to `/api/...` are forwarded to `http://localhost:5001`. This avoids the current backend CORS origin mismatch during development.

## Seed login credentials from the supplied backend

Customer:

- Email: `customer@eventparking.local`
- Password: `Customer@123`

Administrator:

- Email: `admin@eventparking.local`
- Password: `Admin@123`

## Email verification / reset link integration

The supplied backend currently has:

```json
"Frontend": {
  "BaseUrl": "http://localhost:5500"
}
```

For Angular running on the BRD development port, change it to:

```json
"Frontend": {
  "BaseUrl": "http://localhost:4200"
}
```

The Angular router includes compatibility aliases for the backend-generated URLs:

- `/verify.html?token=...`
- `/reset-password.html?token=...`

When SMTP is not configured in the supplied backend, verification/reset links are written to the backend console/log as DEV EMAIL messages.

## Main customer flow

`/login` → `/events` → `/events/:id` → `/events/:id/seats` → `/events/:id/parking` → `/checkout` → `/bookings/:id` → `/bookings/:id/payment` → `/payments/:id/receipt`

## Admin flow

`/admin/login` → `/admin` with Customers, Venues, Categories, Events, Layouts and Bookings pages.

## Important backend matching decisions

- `CreateBookingDto` is sent exactly as `{ eventId, seatIds, parkingSlotId }`.
- Attendee names in checkout are a frontend-only `FormArray` to satisfy the BRD form exercise because the supplied backend DTO has no attendee-name fields.
- Simulated card fields are validated only in the frontend. The supplied backend payment endpoint accepts no card body and no card details are sent or stored.
- HTTP `409 Conflict` during booking creation triggers a fresh seat/parking fetch and removes selections that are no longer available.
- JWT is kept in Angular state with `sessionStorage` fallback and is cleared on logout.
- Admin and customer routes are separated by role guards.

## Build

```powershell
npm run build
```

Output: `dist/event-parking-frontend-angular21`

## Project structure

```text
src/app/
├── core/
│   ├── models/
│   ├── services/
│   ├── guards/
│   ├── interceptors/
│   ├── validators/
│   └── utils/
├── shared/
│   ├── components/
│   ├── directives/
│   └── pipes/
└── features/
    ├── auth/
    ├── events/
    ├── seats/
    ├── parking/
    ├── checkout/
    ├── bookings/
    ├── payments/
    ├── notifications/
    ├── profile/
    ├── dashboard/
    └── admin/
```

See `FRONTEND_INVENTORY.md` and `BACKEND_ENDPOINT_MAPPING.md` for detailed coverage.
