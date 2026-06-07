const { Expense } = require("../models/Expense");
const asyncHandler = require("../utils/asyncHandler");

function startOfCurrentMonth() {
  const date = new Date();
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
  return date;
}

function monthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function lastTwelveMonths() {
  const months = [];
  const cursor = new Date();
  cursor.setDate(1);
  cursor.setHours(0, 0, 0, 0);

  for (let index = 11; index >= 0; index -= 1) {
    const date = new Date(cursor.getFullYear(), cursor.getMonth() - index, 1);
    months.push({
      month: monthKey(date),
      label: date.toLocaleString("en", { month: "short", year: "2-digit" }),
      total: 0,
      count: 0
    });
  }

  return months;
}

const getDashboard = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const monthStart = startOfCurrentMonth();
  const trendStart = lastTwelveMonths()[0].month;

  const [totals, monthlyTotals, categoryBreakdown, rawTrend, recentTransactions] = await Promise.all([
    Expense.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          totalExpenses: { $sum: "$amount" },
          totalTransactions: { $sum: 1 },
          averageExpense: { $avg: "$amount" }
        }
      }
    ]),
    Expense.aggregate([
      { $match: { userId, expenseDate: { $gte: monthStart } } },
      { $group: { _id: null, monthlyExpenses: { $sum: "$amount" }, monthlyTransactions: { $sum: 1 } } }
    ]),
    Expense.aggregate([
      { $match: { userId } },
      { $group: { _id: "$category", total: { $sum: "$amount" }, count: { $sum: 1 } } },
      { $sort: { total: -1 } },
      { $project: { _id: 0, category: "$_id", total: { $round: ["$total", 2] }, count: 1 } }
    ]),
    Expense.aggregate([
      {
        $match: {
          userId,
          $expr: {
            $gte: [{ $dateToString: { format: "%Y-%m", date: "$expenseDate" } }, trendStart]
          }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$expenseDate" } },
          total: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]),
    Expense.find({ userId }).sort({ expenseDate: -1, createdAt: -1 }).limit(5).lean()
  ]);

  const baseTrend = lastTwelveMonths();
  const trendByMonth = new Map(rawTrend.map((item) => [item._id, item]));
  const monthlyTrend = baseTrend.map((item) => {
    const match = trendByMonth.get(item.month);
    return match
      ? {
          ...item,
          total: Math.round(match.total * 100) / 100,
          count: match.count
        }
      : item;
  });

  const totalSummary = totals[0] || {};
  const monthlySummary = monthlyTotals[0] || {};

  res.json({
    success: true,
    data: {
      totals: {
        totalExpenses: Math.round((totalSummary.totalExpenses || 0) * 100) / 100,
        monthlyExpenses: Math.round((monthlySummary.monthlyExpenses || 0) * 100) / 100,
        totalTransactions: totalSummary.totalTransactions || 0,
        monthlyTransactions: monthlySummary.monthlyTransactions || 0,
        averageExpense: Math.round((totalSummary.averageExpense || 0) * 100) / 100
      },
      categoryBreakdown,
      monthlyTrend,
      recentTransactions
    }
  });
});

module.exports = {
  getDashboard
};
