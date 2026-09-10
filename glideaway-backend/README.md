# GlideAway — Backend (Node.js + Express + MongoDB)

Implements the flow: **Register/Login → Explore/Search → Property Details →
Reserve → Checkout → Payment → Confirmation → Dashboard (My Bookings)**.

## 1. Setup

```bash
cd backend
npm install
cp .env.example .env      # then edit JWT_SECRET and MONGO_URI
npm run seed               # loads sample destinations, a property, rooms, deals
npm run dev                 # starts on http://localhost:5000
```

Needs a running MongoDB (local `mongod`, or a free Atlas cluster URI in `.env`).

## 2. Folder structure

```
backend/
├── server.js              # app entry point
├── config/db.js           # MongoDB connection
├── models/                # Mongoose schemas (User, Destination, Property, Room, Deal, Booking, Payment, Review)
├── routes/                # one file per resource — see API reference below
├── middleware/
│   ├── auth.middleware.js   # JWT verification (requireAuth, requireAdmin)
│   └── error.middleware.js  # asyncHandler + centralized error responses
└── seed.js                # sample data loader
```

## 3. API reference

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | – | Create account |
| POST | `/api/auth/login` | – | Log in, returns JWT |
| GET  | `/api/auth/me` | ✅ | Current user (hydrate dashboard) |
| GET  | `/api/destinations` | – | List destinations, `?region=Asia` |
| GET  | `/api/destinations/:id` | – | Destination detail page |
| GET  | `/api/properties/search` | – | Explore page search & filters |
| GET  | `/api/properties/:id` | – | Property detail (rooms + reviews) |
| GET  | `/api/properties/:id/availability` | – | Room availability check |
| GET  | `/api/deals` | – | Deals page |
| GET  | `/api/deals/:id` | – | Deal detail |
| POST | `/api/bookings` | ✅ | Reserve → creates a `pending` booking with server-computed price |
| GET  | `/api/bookings/me` | ✅ | My Bookings (dashboard) |
| GET  | `/api/bookings/:id` | ✅ | Booking details screen |
| PATCH| `/api/bookings/:id/cancel` | ✅ | Cancel a booking |
| POST | `/api/payments/pay` | ✅ | Charge card, confirms the booking |
| PATCH| `/api/users/me` | ✅ | Update profile |
| GET/POST/DELETE | `/api/users/me/saved-places/:propertyId` | ✅ | Wishlist |

Send the JWT from login/register as `Authorization: Bearer <token>` on protected routes.

## 4. Booking → Payment flow (how the pieces connect)

1. User selects a room on the property page → `POST /api/bookings` creates a `pending`
   booking and returns `priceSummary` (room total, taxes, service fee, total) — this
   is what the Checkout screen displays. **Price is always computed on the server**,
   never trusted from the request body, so the total can't be tampered with.
2. Checkout screen collects `guestDetails` (already sent with the booking) then moves
   to Payment.
3. Payment screen calls `POST /api/payments/pay` with the card fields + `bookingId`.
   On success, the booking flips to `confirmed` and a `Payment` record is stored
   (only the last 4 digits of the card are kept — never the full number).
4. Confirmation screen reads the returned `booking.bookingRef` (e.g. `GA-10245`).
5. Dashboard's "My Bookings" calls `GET /api/bookings/me`.

## 5. Payment gateway integration

`routes/payment.routes.js` currently uses `mockChargeCard()` so you can test the full
flow with no external account. To go live, swap that function for a real call, e.g.
Stripe:

```js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const intent = await stripe.paymentIntents.create({
  amount: Math.round(booking.priceSummary.total * 100), // cents
  currency: 'usd',
  payment_method_data: { type: 'card', card: { token: req.body.stripeToken } },
  confirm: true,
});
```

Never send raw card numbers to your own server in production — use Stripe.js /
Stripe Elements on the frontend so card data goes straight to Stripe and you only
ever handle a token.

## 6. Security notes already in place

- Passwords hashed with bcrypt (12 rounds), never returned in API responses.
- JWT auth on every route that touches personal data or money.
- `express-validator` on all write endpoints.
- `helmet` for HTTP security headers, `express-rate-limit` on `/api/auth`.
- Booking totals recalculated server-side at every step.
