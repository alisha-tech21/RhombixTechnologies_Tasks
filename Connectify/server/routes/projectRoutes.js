const express = require("express");
const router = express.Router();

const {
  createProject,
  getUserProjects,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.use(protect);

router.post("/", upload.single("image"), createProject);
router.get("/user/:userId", getUserProjects);
router.put("/:id", upload.single("image"), updateProject);
router.delete("/:id", deleteProject);

module.exports = router;
