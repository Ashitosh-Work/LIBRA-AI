const express = require("express");
const {
  createExpense,
  deleteExpense,
  getExpense,
  listExpenses,
  updateExpense
} = require("../controllers/expenseController");
const requireAuth = require("../middleware/auth");

const router = express.Router();

router.use(requireAuth);
router.route("/").get(listExpenses).post(createExpense);
router.route("/:id").get(getExpense).put(updateExpense).delete(deleteExpense);

module.exports = router;
