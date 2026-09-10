const express = require('express');
const { body, validationResult } = require('express-validator');
const Room = require('../models/Room');
const Deal = require('../models/Deal');
const Booking = require('../models/Booking');
const { requireAuth } = require('../middleware/auth.middleware');
const { asyncHandler } = require('../middleware/error.middleware');

const router = express.Router();
const TAX_RATE = 0.1; // 10%
const SERVICE_FEE = 20; // flat fee, matches the wireframe's "Service Fee: $20"

function generateBookingRef() {
  const n = Math.floor(10000 + Math.random() * 89999);
  return `GA-${n}`;
}

function nightsBetween(checkIn, checkOut) {
  const ms = new Date(checkOut) - new Date(checkIn);
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)));
}

/**
 * POST /api/bookings
 * Creates a pending booking (the "Reserve" step) and returns the price summary
 * for the checkout screen. Price is always computed server-side, never trusted
 * from the client, so totals can't be tampered with in the browser.
 */
router.post(
  '/',
  requireAuth,
  [
    body('checkIn').isISO8601().withMessage('Valid check-in date is required.'),
    body('checkOut').isISO8601().withMessage('Valid check-out date is required.'),
    body('guests').isInt({ min: 1 }).withMessage('At least 1 guest is required.'),
    body('guestDetails.name').notEmpty().withMessage('Guest name is required.'),
    body('guestDetails.email').isEmail().withMessage('Valid guest email is required.'),
    body('guestDetails.phone').notEmpty().withMessage('Guest phone is required.'),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { roomId, dealId, propertyId, checkIn, checkOut, guests, rooms = 1, guestDetails } = req.body;

    if (!roomId && !dealId) {
      return res.status(400).json({ message: 'Either a room or a deal must be selected.' });
    }

    const nights = nightsBetween(checkIn, checkOut);
    let roomTotal = 0;

    if (roomId) {
      const room = await Room.findById(roomId);
      if (!room) return res.status(404).json({ message: 'Room not found.' });
      roomTotal = room.pricePerNight * nights * rooms;
    } else {
      const deal = await Deal.findById(dealId);
      if (!deal) return res.status(404).json({ message: 'Deal not found.' });
      roomTotal = deal.price * rooms;
    }

    const taxes = Math.round(roomTotal * TAX_RATE);
    const serviceFee = SERVICE_FEE;
    const total = roomTotal + taxes + serviceFee;

    const booking = await Booking.create({
      bookingRef: generateBookingRef(),
      userId: req.user.id,
      propertyId: propertyId || undefined,
      roomId: roomId || undefined,
      dealId: dealId || undefined,
      checkIn,
      checkOut,
      guests,
      rooms,
      guestDetails,
      priceSummary: { roomTotal, taxes, serviceFee, total },
      status: 'pending',
    });

    res.status(201).json({ booking });
  })
);

/** GET /api/bookings/me — powers the "My Bookings" dashboard panel */
router.get(
  '/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate('propertyId', 'name images')
      .populate('dealId', 'title images')
      .sort({ createdAt: -1 });
    res.json({ bookings });
  })
);

/** GET /api/bookings/:id — booking details screen */
router.get(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const booking = await Booking.findOne({ _id: req.params.id, userId: req.user.id })
      .populate('propertyId')
      .populate('roomId')
      .populate('dealId')
      .populate('paymentId');
    if (!booking) return res.status(404).json({ message: 'Booking not found.' });
    res.json({ booking });
  })
);

/** PATCH /api/bookings/:id/cancel */
router.patch(
  '/:id/cancel',
  requireAuth,
  asyncHandler(async (req, res) => {
    const booking = await Booking.findOne({ _id: req.params.id, userId: req.user.id });
    if (!booking) return res.status(404).json({ message: 'Booking not found.' });
    if (booking.status === 'completed') {
      return res.status(400).json({ message: 'Completed bookings cannot be cancelled.' });
    }
    booking.status = 'cancelled';
    await booking.save();
    res.json({ booking });
  })
);

module.exports = router;
