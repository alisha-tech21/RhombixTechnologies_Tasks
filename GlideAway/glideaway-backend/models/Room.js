const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
    name: { type: String, required: true }, // e.g. "Deluxe Ocean Room"
    guests: { type: Number, required: true },
    beds: { type: String }, // e.g. "1 King Bed"
    pricePerNight: { type: Number, required: true },
    images: [{ type: String }],
    amenities: [{ type: String }],
    totalUnits: { type: Number, default: 5 }, // inventory available for availability checks
  },
  { timestamps: true }
);

roomSchema.index({ propertyId: 1 });

module.exports = mongoose.model('Room', roomSchema);
