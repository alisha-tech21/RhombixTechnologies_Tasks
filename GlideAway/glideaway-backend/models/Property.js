const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    destinationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Destination",
      required: true,
    },
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["Hotel", "Resort", "Villa", "Apartment"],
      required: true,
    },
    address: { type: String },
    location: {
      lat: { type: Number },
      lng: { type: Number },
    },
    images: [{ type: String }],
    amenities: [{ type: String }], // e.g. Wi-Fi, Pool, Breakfast, Parking, Spa
    description: { type: String },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewsCount: { type: Number, default: 0 },
    pricePerNight: { type: Number, required: true },
  },
  { timestamps: true },
);

propertySchema.index({ name: "text" });
propertySchema.index({ destinationId: 1 });
propertySchema.index({ priceFrom: 1 });

module.exports = mongoose.model("Property", propertySchema);
