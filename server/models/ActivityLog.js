const mongoose = require("mongoose");


const ActivityLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true, 
    },

    message: {
      type: String,
      required: true, 
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
