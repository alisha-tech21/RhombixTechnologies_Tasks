const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    method: { type: String, enum: ['card', 'wallet'], default: 'card' },
    cardLast4: { type: String }, // never store full card number
    status: { type: String, enum: ['pending', 'succeeded', 'failed'], default: 'pending' },
    transactionId: { type: String }, // returned by the payment gateway (e.g. Stripe PaymentIntent id)
    paidAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
