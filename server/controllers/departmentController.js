const Department = require("../models/Department");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");

exports.listDepartments = asyncHandler(async (req, res) => {
  const departments = await Department.find().sort({ name: 1 });
  res.json(departments);
});

exports.createDepartment = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    throw new ApiError(400, "Department name is required");
  }

  const existing = await Department.findOne({ name });
  if (existing) {
    throw new ApiError(400, "A department with that name already exists");
  }

  const department = await Department.create({ name, description });
  res.status(201).json(department);
});

exports.deleteDepartment = asyncHandler(async (req, res) => {
  const department = await Department.findByIdAndDelete(req.params.id);

  if (!department) {
    throw new ApiError(404, "Department not found");
  }

  res.json({ success: true, message: "Department deleted" });
});
