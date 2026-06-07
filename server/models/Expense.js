const mongoose = require("mongoose");

const CATEGORIES = [
  "Food",
  "Travel",
  "Bills",
  "Shopping",
  "Health",
  "Education",
  "Entertainment",
  "Utilities",
  "Other"
];

const PAYMENT_METHODS = ["Cash", "Card", "UPI", "Bank Transfer", "Wallet", "Other"];

const expenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [2, "Title must be at least 2 characters"],
      maxlength: [120, "Title cannot exceed 120 characters"]
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0.01, "Amount must be greater than zero"]
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: CATEGORIES,
      default: "Other"
    },
    paymentMethod: {
      type: String,
      required: [true, "Payment method is required"],
      enum: PAYMENT_METHODS,
      default: "Other"
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, "Notes cannot exceed 500 characters"],
      default: ""
    },
    expenseDate: {
      type: Date,
      required: [true, "Expense date is required"],
      default: Date.now
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

expenseSchema.index({ userId: 1, expenseDate: -1 });
expenseSchema.index({ userId: 1, category: 1 });
expenseSchema.index({ userId: 1, title: "text", category: "text", notes: "text" });

module.exports = {
  Expense: mongoose.model("Expense", expenseSchema),
  CATEGORIES,
  PAYMENT_METHODS
};
