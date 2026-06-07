const { CATEGORIES, PAYMENT_METHODS } = require("../models/Expense");
const AppError = require("../utils/AppError");

const SORT_FIELDS = ["expenseDate", "amount", "title", "category", "createdAt"];

function cleanString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function parseExpenseDate(value) {
  if (!value) return new Date();

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

function validateExpensePayload(body, { partial = false } = {}) {
  const errors = {};
  const payload = {};

  if (!partial || Object.prototype.hasOwnProperty.call(body, "title")) {
    const title = cleanString(body.title);
    if (title.length < 2) errors.title = "Title must be at least 2 characters";
    else payload.title = title;
  }

  if (!partial || Object.prototype.hasOwnProperty.call(body, "amount")) {
    const amount = Number(body.amount);
    if (!Number.isFinite(amount) || amount <= 0) errors.amount = "Amount must be greater than zero";
    else payload.amount = Math.round(amount * 100) / 100;
  }

  if (!partial || Object.prototype.hasOwnProperty.call(body, "category")) {
    const category = cleanString(body.category) || "Other";
    if (!CATEGORIES.includes(category)) errors.category = "Category is not supported";
    else payload.category = category;
  }

  if (!partial || Object.prototype.hasOwnProperty.call(body, "paymentMethod")) {
    const paymentMethod = cleanString(body.paymentMethod) || "Other";
    if (!PAYMENT_METHODS.includes(paymentMethod)) errors.paymentMethod = "Payment method is not supported";
    else payload.paymentMethod = paymentMethod;
  }

  if (Object.prototype.hasOwnProperty.call(body, "notes")) {
    const notes = cleanString(body.notes);
    if (notes.length > 500) errors.notes = "Notes cannot exceed 500 characters";
    else payload.notes = notes;
  } else if (!partial) {
    payload.notes = "";
  }

  if (!partial || Object.prototype.hasOwnProperty.call(body, "expenseDate")) {
    const expenseDate = parseExpenseDate(body.expenseDate);
    if (!expenseDate) errors.expenseDate = "Expense date is invalid";
    else payload.expenseDate = expenseDate;
  }

  if (Object.keys(errors).length > 0) {
    throw new AppError("Invalid expense data", 400, errors);
  }

  return payload;
}

function toDateBoundary(value, endOfDay = false) {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  if (endOfDay) {
    date.setHours(23, 59, 59, 999);
  } else {
    date.setHours(0, 0, 0, 0);
  }

  return date;
}

function validateListQuery(query) {
  const page = Math.max(Number.parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(query.limit, 10) || 10, 1), 50);
  const sortBy = SORT_FIELDS.includes(query.sortBy) ? query.sortBy : "expenseDate";
  const sortOrder = query.sortOrder === "asc" ? 1 : -1;
  const category = cleanString(query.category);
  const paymentMethod = cleanString(query.paymentMethod);
  const search = cleanString(query.search);
  const from = toDateBoundary(query.from);
  const to = toDateBoundary(query.to, true);

  if (category && !CATEGORIES.includes(category)) {
    throw new AppError("Invalid category filter", 400);
  }

  if (paymentMethod && !PAYMENT_METHODS.includes(paymentMethod)) {
    throw new AppError("Invalid payment method filter", 400);
  }

  if (query.from && !from) throw new AppError("Invalid from date", 400);
  if (query.to && !to) throw new AppError("Invalid to date", 400);

  return {
    page,
    limit,
    sortBy,
    sortOrder,
    category,
    paymentMethod,
    search,
    from,
    to
  };
}

module.exports = {
  validateExpensePayload,
  validateListQuery
};
