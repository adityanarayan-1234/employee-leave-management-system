const mongoose = require("mongoose");

// A single collection that records notable events across the app.
// Doubles as both the admin "Recent Activity" feed and a basic
// audit trail (who did what, to whom, and when).
const ActivityLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true, // e.g. "LEAVE_APPLIED", "LEAVE_APPROVED", "LEAVE_REJECTED", "LEAVE_DELETED", "EMPLOYEE_REGISTERED"
    },

    message: {
      type: String,
      required: true, // human-readable summary shown directly in the UI
    },

    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },

    targetEmployee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ActivityLog", ActivityLogSchema);
