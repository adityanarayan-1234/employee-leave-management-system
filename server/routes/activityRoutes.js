const express = require("express");
const router = express.Router();

const { listActivity } = require("../controllers/activityController");
const { protect, isAdmin } = require("../middleware/authMiddleware");

router.get("/", protect, isAdmin, listActivity);

module.exports = router;
