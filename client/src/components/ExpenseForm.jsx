import React, { useEffect, useMemo, useState } from "react";
import { toDateInputValue } from "../utils/format.js";

const emptyExpense = {
  title: "",
  amount: "",
  category: "Food",
  paymentMethod: "UPI",
  notes: "",
  expenseDate: toDateInputValue(),
};

function ExpenseForm({
  categories,
  paymentMethods,
  editingExpense,
  onCancelEdit,
  onSubmit,
  saving,
}) {
  const initialState = useMemo(() => {
    if (!editingExpense) return emptyExpense;

    return {
      title: editingExpense.title || "",
      amount: editingExpense.amount || "",
      category: editingExpense.category || "Other",
      paymentMethod: editingExpense.paymentMethod || "Other",
      notes: editingExpense.notes || "",
      expenseDate: toDateInputValue(editingExpense.expenseDate),
    };
  }, [editingExpense]);

  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(initialState);
    setErrors({});
  }, [initialState]);

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
  }

  function validate() {
    const nextErrors = {};

    if (form.title.trim().length < 2) nextErrors.title = "Enter a title";
    if (!Number(form.amount) || Number(form.amount) <= 0)
      nextErrors.amount = "Enter a positive amount";
    if (!form.expenseDate) nextErrors.expenseDate = "Choose a date";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!validate()) return;

    await onSubmit({
      ...form,
      amount: Number(form.amount),
    });

    if (!editingExpense) {
      setForm(emptyExpense);
    }
  }

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <div className="section-heading">
        <div>
          <p className="eyebrow">Transaction</p>
          <h2>{editingExpense ? "Edit expense" : "Add expense"}</h2>
        </div>
        {editingExpense && (
          <button
            className="button secondary"
            type="button"
            onClick={onCancelEdit}
          >
            Cancel
          </button>
        )}
      </div>

      <label className="field">
        <span>Title</span>
        <input
          value={form.title}
          onChange={(event) => updateField("title", event.target.value)}
        />
        {errors.title && <small>{errors.title}</small>}
      </label>

      <div className="form-grid">
        <label className="field">
          <span>Amount</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.amount}
            onChange={(event) => updateField("amount", event.target.value)}
          />
          {errors.amount && <small>{errors.amount}</small>}
        </label>
        <label className="field">
          <span>Date</span>
          <input
            type="date"
            value={form.expenseDate}
            onChange={(event) => updateField("expenseDate", event.target.value)}
          />
          {errors.expenseDate && <small>{errors.expenseDate}</small>}
        </label>
      </div>

      <div className="form-grid">
        <label className="field">
          <span>Category</span>
          <select
            value={form.category}
            onChange={(event) => updateField("category", event.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Payment</span>
          <select
            value={form.paymentMethod}
            onChange={(event) =>
              updateField("paymentMethod", event.target.value)
            }
          >
            {paymentMethods.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="field">
        <span>Notes</span>
        <textarea
          rows="4"
          value={form.notes}
          onChange={(event) => updateField("notes", event.target.value)}
          maxLength="500"
        />
      </label>

      <button
        className="button primary full-width"
        type="submit"
        disabled={saving}
      >
        {saving
          ? "Saving..."
          : editingExpense
            ? "Update Expense"
            : "Add Expense"}
      </button>
    </form>
  );
}

export default ExpenseForm;
