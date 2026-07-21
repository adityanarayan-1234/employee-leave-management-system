const Employee = require("../models/Employee");
const Leave = require("../models/Leave");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const { isValidEmail, requireFields } = require("../utils/validators");
const logActivity = require("../utils/logActivity");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// Shape returned to the client - never includes the password hash
const publicEmployee = (employee) => ({
  _id: employee._id,
  name: employee.name,
  email: employee.email,
  role: employee.role,
  department: employee.department,
  leaveBalance: employee.leaveBalance,
  createdAt: employee.createdAt,
});

// Shared creation logic used by both public self-registration and
// admin-initiated employee creation - keeps validation in one place
const createEmployeeRecord = async ({ name, email, password, role, department }) => {
  const missing = requireFields({ name, email, password }, ["name", "email", "password"]);
  if (missing.length > 0) {
    throw new ApiError(400, `Missing required field(s): ${missing.join(", ")}`);
  }

  if (!isValidEmail(email)) {
    throw new ApiError(400, "Please enter a valid email address");
  }

  if (password.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters");
  }

  const existing = await Employee.findOne({ email });
  if (existing) {
    throw new ApiError(400, "Employee already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return Employee.create({
    name,
    email,
    password: hashedPassword,
    role: role === "admin" ? "admin" : "employee",
    department: department || "General",
  });
};

exports.register = asyncHandler(async (req, res) => {
  const newEmployee = await createEmployeeRecord(req.body);

  await logActivity({
    action: "EMPLOYEE_REGISTERED",
    message: `${newEmployee.name} joined as ${newEmployee.role}`,
    targetEmployee: newEmployee._id,
  });

  res.status(201).json({
    success: true,
    message: "Registration successful",
    employee: publicEmployee(newEmployee),
  });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const missing = requireFields(req.body, ["email", "password"]);
  if (missing.length > 0) {
    throw new ApiError(400, `Missing required field(s): ${missing.join(", ")}`);
  }

  const employee = await Employee.findOne({ email });
  if (!employee) {
    throw new ApiError(404, "Employee not found");
  }

  const match = await bcrypt.compare(password, employee.password);
  if (!match) {
    throw new ApiError(401, "Invalid password");
  }

  const token = generateToken(employee._id);

  res.json({
    success: true,
    token,
    employee: publicEmployee(employee),
  });
});

// Returns the currently logged-in employee's profile (used on page refresh)
exports.getMe = asyncHandler(async (req, res) => {
  res.json({ employee: publicEmployee(req.user) });
});

// Admin only - paginated employee directory with search + department filter
exports.listEmployees = asyncHandler(async (req, res) => {
  const { search = "", department = "", page = 1, limit = 8 } = req.query;

  const query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  if (department) {
    query.department = department;
  }

  const pageNum = Math.max(parseInt(page) || 1, 1);
  const limitNum = Math.max(parseInt(limit) || 8, 1);

  const [employees, total] = await Promise.all([
    Employee.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Employee.countDocuments(query),
  ]);

  res.json({
    employees,
    page: pageNum,
    totalPages: Math.ceil(total / limitNum) || 1,
    total,
  });
});

// Admin only - a single employee's profile detail
exports.getEmployeeById = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id).select("-password");

  if (!employee) {
    throw new ApiError(404, "Employee not found");
  }

  res.json({ employee });
});

// Admin only - add a new employee directly from the admin panel
exports.createEmployee = asyncHandler(async (req, res) => {
  const newEmployee = await createEmployeeRecord(req.body);

  await logActivity({
    action: "EMPLOYEE_ADDED",
    message: `${req.user.name} added ${newEmployee.name} as ${newEmployee.role}`,
    performedBy: req.user._id,
    targetEmployee: newEmployee._id,
  });

  res.status(201).json({
    success: true,
    message: "Employee added successfully",
    employee: publicEmployee(newEmployee),
  });
});

// Admin only - remove an employee from the system
exports.deleteEmployee = asyncHandler(async (req, res) => {
  if (req.params.id === req.user._id.toString()) {
    throw new ApiError(400, "You cannot remove your own account");
  }

  const target = await Employee.findById(req.params.id);
  if (!target) {
    throw new ApiError(404, "Employee not found");
  }

  // Never allow the last remaining admin to be removed - the system
  // must always have at least one admin able to manage it
  if (target.role === "admin") {
    const adminCount = await Employee.countDocuments({ role: "admin" });
    if (adminCount <= 1) {
      throw new ApiError(400, "Cannot remove the only remaining admin account");
    }
  }

  await Leave.deleteMany({ employee: target._id });
  await target.deleteOne();

  await logActivity({
    action: "EMPLOYEE_REMOVED",
    message: `${req.user.name} removed ${target.name} from the system`,
    performedBy: req.user._id,
  });

  res.json({ success: true, message: "Employee removed successfully" });
});
