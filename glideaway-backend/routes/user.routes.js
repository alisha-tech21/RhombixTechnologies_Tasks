const express = require('express');
const User = require('../models/User');
const { requireAuth } = require('../middleware/auth.middleware');
const { asyncHandler } = require('../middleware/error.middleware');

const router = express.Router();

/** PATCH /api/users/me — update profile (name, phone) */
router.patch(
  '/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { name, phone } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { ...(name && { name }), ...(phone && { phone }) } },
      { new: true }
    );
    res.json({ user });
  })
);

/** POST /api/users/me/saved-places/:propertyId — add to wishlist */
router.post(
  '/me/saved-places/:propertyId',
  requireAuth,
  asyncHandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $addToSet: { savedPlaces: req.params.propertyId } },
      { new: true }
    ).populate('savedPlaces', 'name images priceFrom');
    res.json({ user });
  })
);

/** DELETE /api/users/me/saved-places/:propertyId — remove from wishlist */
router.delete(
  '/me/saved-places/:propertyId',
  requireAuth,
  asyncHandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { savedPlaces: req.params.propertyId } },
      { new: true }
    ).populate('savedPlaces', 'name images priceFrom');
    res.json({ user });
  })
);

/** GET /api/users/me/saved-places */
router.get(
  '/me/saved-places',
  requireAuth,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).populate('savedPlaces');
    res.json({ savedPlaces: user.savedPlaces });
  })
);

module.exports = router;
