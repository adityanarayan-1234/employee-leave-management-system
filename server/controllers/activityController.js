const ActivityLog = require("../models/ActivityLog");
const asyncHandler = require("../utils/asyncHandler");
exports.listActivity = asyncHandler(async (req, res) => {
  const { limit = 15 } = req.query;

  const activity = await ActivityLog.find()
    .populate("performedBy", "name")
    .populate("targetEmployee", "name")
    .sort({ createdAt: -1 })
    .limit(Math.min(parseInt(limit) || 15, 50));

  res.json(activity);
});
