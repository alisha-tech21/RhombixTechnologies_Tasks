const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    bookingRef: { type: String, required: true, unique: true }, // e.g. GA-10245
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
    dealId: { type: mongoose.Schema.Types.ObjectId, ref: 'Deal' }, // used instead of property/room for package bookings

    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    guests: { type: Number, required: true },
    rooms: { type: Number, default: 1 },

    guestDetails: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },

    priceSummary: {
      roomTotal: { type: Number, required: true },
      taxes: { type: Number, required: true },
      serviceFee: { type: Number, required: true },
      total: { type: Number, required: true },
    },

    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },

    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
  },
  { timestamps: true }
);

bookingSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Booking', bookingSchema);
