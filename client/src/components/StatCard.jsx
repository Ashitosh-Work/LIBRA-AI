import React from "react";
import { formatCurrency } from "../utils/format.js";

function StatCard({ label, value, helper, tone = "default", money = true }) {
  return (
    <article className={`stat-card ${tone}`}>
      <p>{label}</p>
      <strong>{money ? formatCurrency(value) : value}</strong>
      <span>{helper}</span>
    </article>
  );
}

export default StatCard;
