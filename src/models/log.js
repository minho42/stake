const mongoose = require("mongoose");

const logSchema = new mongoose.Schema(
  {
    isPublic: {
      type: Boolean,
      required: true,
      default: true,
    },
    action: {
      type: String,
      enum: ["buy", "sell", "watch", "log"],
      required: true,
      default: false,
      trim: true,
    },
    symbol: {
      type: String,
      required: false,
      trim: true,
    },
    amount: {
      type: Number,
      required: false,
      default: 0,
    },
    profitOrLoss: {
      type: Number,
      required: false,
      default: 0,
    },
    date: {
      type: Date,
      required: false,
    },
    note: {
      type: String,
      required: false,
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Log = mongoose.model("Log", logSchema);

module.exports = Log;
