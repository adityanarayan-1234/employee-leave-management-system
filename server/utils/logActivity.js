const ActivityLog = require("../models/ActivityLog");
const logActivity = async ({ action, message, performedBy, targetEmployee }) => {
  try {
    await ActivityLog.create({ action, message, performedBy, targetEmployee });
  } catch (error) {
    console.log("Failed to record activity log:", error.message);
  }
};

module.exports = logActivity;
