const mongoose = require("mongoose");

const dealSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // e.g. "Paris Escape"
    destinationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Destination",
      required: true,
    },
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
    },
    durationDays: { type: Number, required: true },
    durationNights: { type: Number, required: true },
    price: { type: Number, required: true },
    includes: [{ type: String }], // e.g. ["Flights", "Hotel", "Breakfast"]
    images: [{ type: String }],
    validTill: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Deal", dealSchema);
