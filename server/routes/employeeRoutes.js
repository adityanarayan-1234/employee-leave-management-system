const express = require("express");
const router = express.Router();

const {
  login,
  register,
  getMe,
  listEmployees,
  getEmployeeById,
  createEmployee,
  deleteEmployee,
} = require("../controllers/employeeController");
const { protect, isAdmin } = require("../middleware/authMiddleware");

router.post("/login", login);
router.post("/register", register);
router.get("/me", protect, getMe);
router.get("/", protect, isAdmin, listEmployees);
router.post("/", protect, isAdmin, createEmployee);
router.get("/:id", protect, isAdmin, getEmployeeById);
router.delete("/:id", protect, isAdmin, deleteEmployee);

module.exports = router;
