const express = require("express");
const Property = require("../models/Property");
const Room = require("../models/Room");
const Review = require("../models/Review");
const Booking = require("../models/Booking");
const { asyncHandler } = require("../middleware/error.middleware");

const router = express.Router();

/**
 * GET /api/properties/search
 * Powers the Explore page. Query params:
 *   destination, checkIn, checkOut, guests, type, minPrice, maxPrice, rating
 */
/** GET /api/properties — get all properties */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const properties = await Property.find({})
      .populate("destinationId", "name country region")
      .limit(60);
    res.json(properties);
  }),
);
router.get(
  "/search",
  asyncHandler(async (req, res) => {
    const { destination, type, minPrice, maxPrice, rating, guests } = req.query;
    const filter = {};

    if (type) filter.type = type;
    if (rating) filter.rating = { $gte: Number(rating) };
    if (minPrice || maxPrice) {
      filter.priceFrom = {};
      if (minPrice) filter.priceFrom.$gte = Number(minPrice);
      if (maxPrice) filter.priceFrom.$lte = Number(maxPrice);
    }

    let destinationIds = null;
    if (destination) {
      const Destination = require("../models/Destination");
      const matches = await Destination.find({
        $text: { $search: destination },
      }).select("_id");
      destinationIds = matches.map((d) => d._id);
      filter.destinationId = { $in: destinationIds };
    }

    const properties = await Property.find(filter)
      .populate("destinationId", "name country region")
      .sort({ rating: -1 })
      .limit(60);

    res.json({ count: properties.length, properties });
  }),
);

/** GET /api/properties/:id — property detail page with rooms + reviews */
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const property = await Property.findById(req.params.id).populate(
      "destinationId",
      "name country region",
    );
    if (!property)
      return res.status(404).json({ message: "Property not found." });

    const rooms = await Room.find({ propertyId: property._id });
    const reviews = await Review.find({ propertyId: property._id })
      .populate("userId", "name")
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({ property, rooms, reviews });
  }),
);

/**
 * GET /api/properties/:id/availability
 * Checks whether a given room has free inventory for the requested dates.
 * Query: roomId, checkIn, checkOut, rooms
 */
router.get(
  "/:id/availability",
  asyncHandler(async (req, res) => {
    const { roomId, checkIn, checkOut, rooms = 1 } = req.query;
    if (!roomId || !checkIn || !checkOut) {
      return res
        .status(400)
        .json({ message: "roomId, checkIn and checkOut are required." });
    }

    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: "Room not found." });

    // Count overlapping confirmed/pending bookings for this room
    const overlapping = await Booking.find({
      roomId,
      status: { $in: ["pending", "confirmed"] },
      checkIn: { $lt: new Date(checkOut) },
      checkOut: { $gt: new Date(checkIn) },
    });

    const reservedUnits = overlapping.reduce((sum, b) => sum + b.rooms, 0);
    const available = room.totalUnits - reservedUnits >= Number(rooms);

    res.json({ available, remainingUnits: room.totalUnits - reservedUnits });
  }),
);

module.exports = router;
