import React, { useCallback, useEffect, useMemo, useState } from "react";
import { CategoryPieChart, TrendLineChart } from "../components/Charts.jsx";
import ExpenseForm from "../components/ExpenseForm.jsx";
import ExpenseTable from "../components/ExpenseTable.jsx";
import Filters from "../components/Filters.jsx";
import StatCard from "../components/StatCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../services/api.js";
import { formatCurrency, formatDate } from "../utils/format.js";

const DEFAULT_CATEGORIES = [
  "Food",
  "Travel",
  "Bills",
  "Shopping",
  "Health",
  "Education",
  "Entertainment",
  "Utilities",
  "Other",
];

const DEFAULT_PAYMENT_METHODS = [
  "Cash",
  "Card",
  "UPI",
  "Bank Transfer",
  "Wallet",
  "Other",
];

const defaultFilters = {
  search: "",
  category: "",
  paymentMethod: "",
  from: "",
  to: "",
  page: 1,
  limit: 8,
};

function DashboardPage() {
  const { token } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [paymentMethods, setPaymentMethods] = useState(DEFAULT_PAYMENT_METHODS);
  const [filters, setFilters] = useState(defaultFilters);
  const [meta, setMeta] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editingExpense, setEditingExpense] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [dashboardData, expenseResponse] = await Promise.all([
        api.dashboard(token),
        api.listExpenses(token, filters),
      ]);

      setDashboard(dashboardData);
      setExpenses(expenseResponse.data.expenses);
      setCategories(expenseResponse.data.categories || DEFAULT_CATEGORIES);
      setPaymentMethods(
        expenseResponse.data.paymentMethods || DEFAULT_PAYMENT_METHODS,
      );
      setMeta(expenseResponse.meta);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, [filters, token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const totals = dashboard?.totals || {
    totalExpenses: 0,
    monthlyExpenses: 0,
    totalTransactions: 0,
    monthlyTransactions: 0,
    averageExpense: 0,
  };

  const recentTransactions = useMemo(
    () => dashboard?.recentTransactions || [],
    [dashboard],
  );

  async function submitExpense(payload) {
    setSaving(true);
    setError("");

    try {
      if (editingExpense) {
        await api.updateExpense(token, editingExpense._id, payload);
      } else {
        await api.createExpense(token, payload);
      }

      setEditingExpense(null);
      await loadData();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  }

  async function deleteExpense(expense) {
    const confirmed = window.confirm(`Delete "${expense.title}"?`);
    if (!confirmed) return;

    setError("");

    try {
      await api.deleteExpense(token, expense._id);
      await loadData();
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  function changePage(nextPage) {
    setFilters((current) => ({ ...current, page: nextPage }));
  }

  return (
    <div className="dashboard">
      {error && <div className="alert error">{error}</div>}

      <section className="summary-grid">
        <StatCard
          label="Total expenses"
          value={totals.totalExpenses}
          helper={`${totals.totalTransactions} transactions`}
          tone="blue"
        />
        <StatCard
          label="This month"
          value={totals.monthlyExpenses}
          helper={`${totals.monthlyTransactions} this month`}
          tone="green"
        />
        <StatCard
          label="Average"
          value={totals.averageExpense}
          helper="Average spend per record"
          tone="orange"
        />
        <StatCard
          label="Records"
          value={totals.totalTransactions}
          helper="All saved expenses"
          tone="purple"
          money={false}
        />
      </section>

      <section className="dashboard-grid">
        <ExpenseForm
          categories={categories}
          paymentMethods={paymentMethods}
          editingExpense={editingExpense}
          onCancelEdit={() => setEditingExpense(null)}
          onSubmit={submitExpense}
          saving={saving}
        />

        <section className="panel recent-panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Latest</p>
              <h2>Recent transactions</h2>
            </div>
          </div>
          {recentTransactions.length === 0 ? (
            <div className="empty-list">No recent expenses yet.</div>
          ) : (
            <div className="recent-list">
              {recentTransactions.map((expense) => (
                <div className="recent-row" key={expense._id}>
                  <div>
                    <strong>{expense.title}</strong>
                    <span>
                      {expense.category} / {formatDate(expense.expenseDate)}
                    </span>
                  </div>
                  <b>{formatCurrency(expense.amount)}</b>
                </div>
              ))}
            </div>
          )}
        </section>
      </section>

      <section className="charts-grid">
        <CategoryPieChart data={dashboard?.categoryBreakdown || []} />
        <TrendLineChart data={dashboard?.monthlyTrend || []} />
      </section>

      <Filters
        filters={filters}
        categories={categories}
        paymentMethods={paymentMethods}
        onChange={setFilters}
        onClear={() => {
          setFilters(defaultFilters);
          setEditingExpense(null);
        }}
      />

      <ExpenseTable
        expenses={expenses}
        loading={loading}
        onEdit={setEditingExpense}
        onDelete={deleteExpense}
      />

      <div className="pagination">
        <span>
          Page {meta.page || 1} of {meta.pages || 1} / {meta.total || 0} records
        </span>
        <div>
          <button
            className="button secondary"
            type="button"
            disabled={(meta.page || 1) <= 1}
            onClick={() => changePage(meta.page - 1)}
          >
            Prev
          </button>
          <button
            className="button secondary"
            type="button"
            disabled={(meta.page || 1) >= (meta.pages || 1)}
            onClick={() => changePage(meta.page + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
