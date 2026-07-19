const express = require("express");
const router = express.Router();

const {
  login,
  register,
  getMe,
  listEmployees,
  getEmployeeById,
} = require("../controllers/employeeController");
const { protect, isAdmin } = require("../middleware/authMiddleware");

router.post("/login", login);
router.post("/register", register);
router.get("/me", protect, getMe);
router.get("/", protect, isAdmin, listEmployees);
router.get("/:id", protect, isAdmin, getEmployeeById);

module.exports = router;
