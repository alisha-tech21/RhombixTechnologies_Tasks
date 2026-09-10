const mongoose = require("mongoose");

const destinationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    country: { type: String, required: true },
    region: {
      type: String,
      enum: [
        "Asia",
        "Europe",
        "Middle East",
        "North America",
        "South America",
        "Africa",
        "Oceania",
      ],
      required: true,
    },
    description: { type: String },
    images: [{ type: String }],
    topAttractions: [{ type: String }],
    priceFrom: { type: Number },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true },
);

destinationSchema.index({ name: "text", country: "text" });

module.exports = mongoose.model("Destination", destinationSchema);
