const express = require("express");
const router = express.Router();

const {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  cancelFriendRequest,
  removeFriend,
  getReceivedRequests,
  getSentRequests,
  getFriendsList,
} = require("../controllers/friendController");

const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.post("/request/:id", sendFriendRequest);
router.put("/accept/:requestId", acceptFriendRequest);
router.put("/reject/:requestId", rejectFriendRequest);
router.delete("/cancel/:requestId", cancelFriendRequest);
router.delete("/:id", removeFriend);

router.get("/requests/received", getReceivedRequests);
router.get("/requests/sent", getSentRequests);
router.get("/", getFriendsList);

module.exports = router;
