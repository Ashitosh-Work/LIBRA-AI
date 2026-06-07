import React from "react";
import { formatCurrency, formatDate } from "../utils/format.js";

function ExpenseTable({ expenses, loading, onEdit, onDelete }) {
  return (
    <section className="panel history-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Records</p>
          <h2>Expense history</h2>
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Title</th>
              <th>Category</th>
              <th>Payment</th>
              <th className="amount-cell">Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="6" className="empty-cell">
                  Loading expenses...
                </td>
              </tr>
            )}
            {!loading && expenses.length === 0 && (
              <tr>
                <td colSpan="6" className="empty-cell">
                  No matching expenses.
                </td>
              </tr>
            )}
            {!loading &&
              expenses.map((expense) => (
                <tr key={expense._id}>
                  <td>{formatDate(expense.expenseDate)}</td>
                  <td>
                    <strong>{expense.title}</strong>
                    {expense.notes && (
                      <span className="row-note">{expense.notes}</span>
                    )}
                  </td>
                  <td>
                    <span className="category-pill">{expense.category}</span>
                  </td>
                  <td>{expense.paymentMethod}</td>
                  <td className="amount-cell">
                    {formatCurrency(expense.amount)}
                  </td>
                  <td>
                    <div className="row-actions">
                      <button
                        className="text-button"
                        type="button"
                        onClick={() => onEdit(expense)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-button danger"
                        type="button"
                        onClick={() => onDelete(expense)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default ExpenseTable;
