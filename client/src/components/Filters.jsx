import React from "react";

function Filters({ filters, categories, paymentMethods, onChange, onClear }) {
  function update(key, value) {
    onChange({ ...filters, [key]: value, page: 1 });
  }

  return (
    <section className="toolbar" aria-label="Expense filters">
      <label className="field search-field">
        <span>Search</span>
        <input
          type="search"
          value={filters.search}
          onChange={(event) => update("search", event.target.value)}
          placeholder="Title, category, notes"
        />
      </label>
      <label className="field">
        <span>Category</span>
        <select
          value={filters.category}
          onChange={(event) => update("category", event.target.value)}
        >
          <option value="">All</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>
      <label className="field">
        <span>Method</span>
        <select
          value={filters.paymentMethod}
          onChange={(event) => update("paymentMethod", event.target.value)}
        >
          <option value="">All</option>
          {paymentMethods.map((method) => (
            <option key={method} value={method}>
              {method}
            </option>
          ))}
        </select>
      </label>
      <label className="field date-field">
        <span>From</span>
        <input
          type="date"
          value={filters.from}
          onChange={(event) => update("from", event.target.value)}
        />
      </label>
      <label className="field date-field">
        <span>To</span>
        <input
          type="date"
          value={filters.to}
          onChange={(event) => update("to", event.target.value)}
        />
      </label>
      <button className="button secondary" type="button" onClick={onClear}>
        Reset
      </button>
    </section>
  );
}

export default Filters;
