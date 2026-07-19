const express = require("express");
const router = express.Router();

const {
  applyLeave,
  leaveHistory,
  myLeaves,
  approveLeave,
  deleteLeave,
  leaveStats,
} = require("../controllers/leaveController");

const { protect, isAdmin } = require("../middleware/authMiddleware");

router.post("/apply", protect, applyLeave);
router.get("/my", protect, myLeaves);
router.get("/history", protect, isAdmin, leaveHistory);
router.get("/stats", protect, isAdmin, leaveStats);
router.put("/approve/:id", protect, isAdmin, approveLeave);
router.delete("/:id", protect, isAdmin, deleteLeave);

module.exports = router;
