const express = require("express");

const Deal = require("../models/Deal");

const { asyncHandler } = require("../middleware/error.middleware");

const router = express.Router();

/**
 * GET /api/deals
 * Active deals for Deals section
 */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const deals = await Deal.find({ isActive: true })
      .populate("destinationId", "name country")
      .populate("propertyId", "name images address type priceFrom")
      .sort({ createdAt: -1 });

    res.json({ deals });
  }),
);

/**
 * GET /api/deals/:id
 * Single deal
 */
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const deal = await Deal.findById(req.params.id)
      .populate("destinationId", "name country")
      .populate("propertyId", "name images address type priceFrom");

    if (!deal) {
      return res.status(404).json({
        message: "Deal not found.",
      });
    }

    res.json({ deal });
  }),
);

module.exports = router;
