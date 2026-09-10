# GlideAway — Database Schema (MongoDB / Mongoose)

Matches the flow: Home → Explore → Destination/Property Details → Select Room →
Reserve → Login/Register → Checkout → Payment → Confirmation → Dashboard.

## Collections overview

```
Users            Destinations         Properties            Rooms
────────         ────────────         ──────────            ─────
_id              _id                  _id                   _id
name             name                 destinationId ───┐    propertyId ───┐
email            country              name             │    name          │
passwordHash     region               type             │    guests        │
phone            description          address           │    beds          │
role             images               location{lat,lng}  │    pricePerNight │
savedPlaces[] ───┼─→Property._id      images              │    images        │
createdAt        topAttractions[]     amenities[]          │    amenities[]   │
                 createdAt            rating                └────────────────┘
                                      reviewsCount                    ▲
                                      description                     │
                                      createdAt                       │
                                                                       │
Deals                Bookings                          Payments       │
─────                ────────                          ────────       │
_id                  _id                                _id            │
title                bookingRef (e.g. GA-10245)          bookingId ──┐  │
destinationId ──┐    userId ──→ Users._id                userId       │  │
durationDays     │   propertyId ──→ Properties._id ──────┼────────────┘  │
durationNights   │   roomId ──→ Rooms._id ────────────────┼──────────────┘
price            │   dealId ──→ Deals._id (optional)       amount
includes[]       │   checkIn / checkOut                    method (card/wallet)
images           │   guests / rooms                        cardLast4
validTill        │   guestDetails{name,email,phone}         status
createdAt        └── priceSummary{roomTotal,taxes,serviceFee,total}
                     status (pending/confirmed/cancelled/completed)
                     createdAt

Reviews
───────
_id
userId ──→ Users._id
propertyId ──→ Properties._id
rating (1-5)
comment
createdAt
```

## Relationships

- `Property.destinationId` → `Destinations._id` (one destination has many properties)
- `Room.propertyId` → `Properties._id` (one property has many rooms)
- `Deal.destinationId` → `Destinations._id`
- `Booking.userId` → `Users._id`
- `Booking.propertyId` / `roomId` → for a stay booking
- `Booking.dealId` → for a package booking (roomId optional in that case)
- `Payment.bookingId` → `Bookings._id` (1:1 — one successful payment per booking)
- `Review.propertyId` / `userId` → one review per user per property (enforced in app logic)
- `User.savedPlaces[]` → array of `Properties._id` (wishlist)

## Booking status lifecycle

```
pending → confirmed → completed
   │
   └──→ cancelled
```

## Notes
- Passwords are never stored in plain text — `passwordHash` via bcrypt.
- `priceSummary.total` is recalculated server-side at checkout; never trusted from the client.
- `bookingRef` is a human-readable ID (e.g. `GA-10245`) shown in the confirmation screen, separate from Mongo's `_id`.
