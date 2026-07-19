const Leave = require("../models/Leave");
const Employee = require("../models/Employee");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const { requireFields, isValidDateRange, daysBetween } = require("../utils/validators");
const logActivity = require("../utils/logActivity");


exports.applyLeave = asyncHandler(async (req, res) => {
  const { leaveType, fromDate, toDate, reason } = req.body;

  const missing = requireFields(req.body, ["leaveType", "fromDate", "toDate", "reason"]);
  if (missing.length > 0) {
    throw new ApiError(400, `Missing required field(s): ${missing.join(", ")}`);
  }

  if (!isValidDateRange(fromDate, toDate)) {
    throw new ApiError(400, "To date cannot be before from date");
  }

  const days = daysBetween(fromDate, toDate);

  if (days > req.user.leaveBalance) {
    throw new ApiError(
      400,
      `This request needs ${days} day(s) but you only have ${req.user.leaveBalance} remaining`
    );
  }

  const leave = await Leave.create({
    employee: req.user._id,
    leaveType,
    fromDate,
    toDate,
    days,
    reason,
  });

  await logActivity({
    action: "LEAVE_APPLIED",
    message: `${req.user.name} applied for ${days} day(s) of ${leaveType}`,
    performedBy: req.user._id,
    targetEmployee: req.user._id,
  });

  res.status(201).json({ success: true, leave });
});


exports.leaveHistory = asyncHandler(async (req, res) => {
  const leaves = await Leave.find()
    .populate("employee", "name email department")
    .sort({ createdAt: -1 });
  res.json(leaves);
});


exports.myLeaves = asyncHandler(async (req, res) => {
  const leaves = await Leave.find({ employee: req.user._id }).sort({ createdAt: -1 });
  res.json(leaves);
});


exports.deleteLeave = asyncHandler(async (req, res) => {
  const leave = await Leave.findByIdAndDelete(req.params.id);

  if (!leave) {
    throw new ApiError(404, "Leave request not found");
  }

  await logActivity({
    action: "LEAVE_DELETED",
    message: `A ${leave.leaveType} request was deleted`,
    performedBy: req.user._id,
    targetEmployee: leave.employee,
  });

  res.json({ success: true, message: "Leave request deleted" });
});


exports.approveLeave = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!["Approved", "Rejected", "Pending"].includes(status)) {
    throw new ApiError(400, "Invalid status");
  }

  const leave = await Leave.findById(req.params.id);

  if (!leave) {
    throw new ApiError(404, "Leave request not found");
  }

  
  if (leave.employee.toString() === req.user._id.toString()) {
    throw new ApiError(403, "You cannot approve or reject your own leave request");
  }

  const previousStatus = leave.status;

  
  if (previousStatus !== "Approved" && status === "Approved") {
    await Employee.findByIdAndUpdate(leave.employee, {
      $inc: { leaveBalance: -leave.days },
    });
  } else if (previousStatus === "Approved" && status !== "Approved") {
    await Employee.findByIdAndUpdate(leave.employee, {
      $inc: { leaveBalance: leave.days },
    });
  }

  leave.status = status;
  await leave.save();
  await leave.populate("employee", "name email department");

  await logActivity({
    action: status === "Approved" ? "LEAVE_APPROVED" : "LEAVE_REJECTED",
    message: `${leave.employee.name}'s ${leave.leaveType} request was ${status.toLowerCase()}`,
    performedBy: req.user._id,
    targetEmployee: leave.employee._id,
  });

  res.json(leave);
});


exports.leaveStats = asyncHandler(async (req, res) => {
  const [statusCounts, monthlyTrend, totalEmployees] = await Promise.all([
    Leave.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),

    
    Leave.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 5)) },
        },
      },
      {
        $group: {
          _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]),

    Employee.countDocuments(),
  ]);

  const counts = { Approved: 0, Pending: 0, Rejected: 0 };
  statusCounts.forEach((s) => {
    counts[s._id] = s.count;
  });

  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  const trend = monthlyTrend.map((m) => ({
    month: monthNames[m._id.month - 1],
    count: m.count,
  }));

  res.json({
    totalEmployees,
    totalLeaves: counts.Approved + counts.Pending + counts.Rejected,
    approved: counts.Approved,
    pending: counts.Pending,
    rejected: counts.Rejected,
    monthlyTrend: trend,
  });
});
