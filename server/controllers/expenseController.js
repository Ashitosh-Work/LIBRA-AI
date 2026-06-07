const mongoose = require("mongoose");
const { Expense, CATEGORIES, PAYMENT_METHODS } = require("../models/Expense");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const { validateExpensePayload, validateListQuery } = require("../validations/expenseValidation");

function assertValidObjectId(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid expense id", 400);
  }
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildExpenseFilter(userId, query) {
  const filter = { userId };

  if (query.category) filter.category = query.category;
  if (query.paymentMethod) filter.paymentMethod = query.paymentMethod;

  if (query.from || query.to) {
    filter.expenseDate = {};
    if (query.from) filter.expenseDate.$gte = query.from;
    if (query.to) filter.expenseDate.$lte = query.to;
  }

  if (query.search) {
    const regex = new RegExp(escapeRegex(query.search), "i");
    filter.$or = [{ title: regex }, { category: regex }, { notes: regex }, { paymentMethod: regex }];
  }

  return filter;
}

const createExpense = asyncHandler(async (req, res) => {
  const payload = validateExpensePayload(req.body);
  const expense = await Expense.create({
    ...payload,
    userId: req.user._id
  });

  res.status(201).json({
    success: true,
    data: { expense }
  });
});

const listExpenses = asyncHandler(async (req, res) => {
  const query = validateListQuery(req.query);
  const filter = buildExpenseFilter(req.user._id, query);
  const skip = (query.page - 1) * query.limit;
  const sort = { [query.sortBy]: query.sortOrder, createdAt: query.sortOrder };

  const [expenses, total] = await Promise.all([
    Expense.find(filter).sort(sort).skip(skip).limit(query.limit).lean(),
    Expense.countDocuments(filter)
  ]);

  res.json({
    success: true,
    data: {
      expenses,
      categories: CATEGORIES,
      paymentMethods: PAYMENT_METHODS
    },
    meta: {
      page: query.page,
      limit: query.limit,
      total,
      pages: Math.max(Math.ceil(total / query.limit), 1)
    }
  });
});

const getExpense = asyncHandler(async (req, res) => {
  assertValidObjectId(req.params.id);

  const expense = await Expense.findOne({ _id: req.params.id, userId: req.user._id });
  if (!expense) {
    throw new AppError("Expense not found", 404);
  }

  res.json({
    success: true,
    data: { expense }
  });
});

const updateExpense = asyncHandler(async (req, res) => {
  assertValidObjectId(req.params.id);

  const payload = validateExpensePayload(req.body, { partial: true });
  const expense = await Expense.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    payload,
    { new: true, runValidators: true }
  );

  if (!expense) {
    throw new AppError("Expense not found", 404);
  }

  res.json({
    success: true,
    data: { expense }
  });
});

const deleteExpense = asyncHandler(async (req, res) => {
  assertValidObjectId(req.params.id);

  const expense = await Expense.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!expense) {
    throw new AppError("Expense not found", 404);
  }

  res.json({
    success: true,
    data: {
      deletedId: req.params.id
    }
  });
});

module.exports = {
  createExpense,
  listExpenses,
  getExpense,
  updateExpense,
  deleteExpense
};
