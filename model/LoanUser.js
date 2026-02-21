const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true },
    date: { type: String, required: true },
    type: { type: String, enum: ["payment", "interest"], default: "payment" },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

const loanUserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    amount: { type: Number, required: true },   // principal
    joinDate: { type: String },
    notes: { type: String, default: "" },
    payments: [paymentSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("LoanUser", loanUserSchema);
