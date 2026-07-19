const express = require("express");
const router = express.Router();

const {
  listDepartments,
  createDepartment,
  deleteDepartment,
} = require("../controllers/departmentController");

const { protect, isAdmin } = require("../middleware/authMiddleware");

router.get("/", protect, listDepartments);
router.post("/", protect, isAdmin, createDepartment);
router.delete("/:id", protect, isAdmin, deleteDepartment);

module.exports = router;
