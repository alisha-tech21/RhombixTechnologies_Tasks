const express = require('express');
const Destination = require('../models/Destination');
const { asyncHandler } = require('../middleware/error.middleware');

const router = express.Router();

/** GET /api/destinations?region=Asia — list, optionally filtered by region */
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const filter = {};
    if (req.query.region) filter.region = req.query.region;
    if (req.query.featured === 'true') filter.isFeatured = true;

    const destinations = await Destination.find(filter).sort({ name: 1 });
    res.json({ destinations });
  })
);

/** GET /api/destinations/:id — single destination detail page */
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const destination = await Destination.findById(req.params.id);
    if (!destination) return res.status(404).json({ message: 'Destination not found.' });
    res.json({ destination });
  })
);

module.exports = router;
