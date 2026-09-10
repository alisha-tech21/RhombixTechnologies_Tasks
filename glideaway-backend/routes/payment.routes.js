const express = require('express');
const { body, validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const { requireAuth } = require('../middleware/auth.middleware');
const { asyncHandler } = require('../middleware/error.middleware');

const router = express.Router();

/**
 * POST /api/payments/pay
 * Charges the card and confirms the booking. This is a mock gateway call —
 * swap `mockChargeCard()` for a real Stripe/PayPal PaymentIntent call when
 * you're ready to go live (see README "Payment gateway integration").
 */
router.post(
  '/pay',
  requireAuth,
  [
    body('bookingId').notEmpty().withMessage('bookingId is required.'),
    body('cardNumber').isLength({ min: 12 }).withMessage('Enter a valid card number.'),
    body('expiry').notEmpty().withMessage('Card expiry is required.'),
    body('cvv').isLength({ min: 3, max: 4 }).withMessage('Enter a valid CVV.'),
    body('cardholderName').notEmpty().withMessage('Cardholder name is required.'),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { bookingId, cardNumber, cardholderName } = req.body;

    const booking = await Booking.findOne({ _id: bookingId, userId: req.user.id });
    if (!booking) return res.status(404).json({ message: 'Booking not found.' });
    if (booking.status === 'confirmed') {
      return res.status(400).json({ message: 'This booking has already been paid.' });
    }

    const chargeResult = mockChargeCard(booking.priceSummary.total);

    const payment = await Payment.create({
      bookingId: booking._id,
      userId: req.user.id,
      amount: booking.priceSummary.total,
      method: 'card',
      cardLast4: cardNumber.slice(-4),
      status: chargeResult.success ? 'succeeded' : 'failed',
      transactionId: chargeResult.transactionId,
      paidAt: chargeResult.success ? new Date() : undefined,
    });

    if (!chargeResult.success) {
      return res.status(402).json({ message: 'Payment declined. Please check your card details and try again.' });
    }

    booking.status = 'confirmed';
    booking.paymentId = payment._id;
    await booking.save();

    res.json({ payment, booking });
  })
);

/** Placeholder gateway call — replace with a real Stripe/PayPal integration. */
function mockChargeCard(amount) {
  return {
    success: true,
    transactionId: 'txn_' + Math.random().toString(36).slice(2, 12),
  };
}

module.exports = router;
