const ActivityLog = require("../models/ActivityLog");

// Fire-and-forget style helper for recording an activity log entry.
// Failing to log an activity should never break the actual request,
// so errors here are only logged to the console, not thrown.
const logActivity = async ({ action, message, performedBy, targetEmployee }) => {
  try {
    await ActivityLog.create({ action, message, performedBy, targetEmployee });
  } catch (error) {
    console.log("Failed to record activity log:", error.message);
  }
};

module.exports = logActivity;
