import React from "react";
import { formatCurrency } from "../utils/format.js";

const palette = [
  "#2563eb",
  "#14b8a6",
  "#f97316",
  "#a855f7",
  "#eab308",
  "#ef4444",
  "#22c55e",
  "#64748b",
  "#0f766e",
];

function EmptyChart({ label }) {
  return (
    <div className="empty-chart">
      <strong>No data yet</strong>
      <span>{label}</span>
    </div>
  );
}

export function CategoryPieChart({ data = [] }) {
  const total = data.reduce((sum, item) => sum + item.total, 0);
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <section className="panel chart-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Breakdown</p>
          <h2>Category expenses</h2>
        </div>
      </div>
      {!total ? (
        <EmptyChart label="Add expenses to see category distribution." />
      ) : (
        <div className="pie-layout">
          <svg
            viewBox="0 0 120 120"
            className="pie-chart"
            role="img"
            aria-label="Category expense pie chart"
          >
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke="var(--line)"
              strokeWidth="18"
            />
            {data.map((item, index) => {
              const stroke = palette[index % palette.length];
              const length = (item.total / total) * circumference;
              const circle = (
                <circle
                  key={item.category}
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="none"
                  stroke={stroke}
                  strokeWidth="18"
                  strokeDasharray={`${length} ${circumference - length}`}
                  strokeDashoffset={-offset}
                  transform="rotate(-90 60 60)"
                />
              );
              offset += length;
              return circle;
            })}
            <text x="60" y="58" textAnchor="middle" className="chart-total">
              {data.length}
            </text>
            <text x="60" y="72" textAnchor="middle" className="chart-caption">
              categories
            </text>
          </svg>
          <div className="legend">
            {data.map((item, index) => (
              <div className="legend-row" key={item.category}>
                <span
                  className="swatch"
                  style={{ background: palette[index % palette.length] }}
                />
                <span>{item.category}</span>
                <strong>{formatCurrency(item.total)}</strong>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export function TrendLineChart({ data = [] }) {
  const width = 520;
  const height = 220;
  const padding = 34;
  const max = Math.max(...data.map((item) => item.total), 1);
  const usableWidth = width - padding * 2;
  const usableHeight = height - padding * 2;
  const points = data.map((item, index) => {
    const divisor = Math.max(data.length - 1, 1);
    const x = padding + (index / divisor) * usableWidth;
    const y = height - padding - (item.total / max) * usableHeight;
    return { ...item, x, y };
  });
  const path = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  return (
    <section className="panel chart-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Trend</p>
          <h2>Monthly spending</h2>
        </div>
      </div>
      {!data.some((item) => item.total > 0) ? (
        <EmptyChart label="Monthly trend will appear after expenses are added." />
      ) : (
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="line-chart"
          role="img"
          aria-label="Monthly spending chart"
        >
          {[0, 0.5, 1].map((ratio) => {
            const y = height - padding - ratio * usableHeight;
            return (
              <line
                key={ratio}
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                className="grid-line"
              />
            );
          })}
          <path d={path} fill="none" className="trend-path" />
          {points.map((point) => (
            <g key={point.month}>
              <circle cx={point.x} cy={point.y} r="4" className="trend-dot" />
              {(point.total > 0 || point === points[points.length - 1]) && (
                <text
                  x={point.x}
                  y={point.y - 10}
                  textAnchor="middle"
                  className="point-label"
                >
                  {Math.round(point.total)}
                </text>
              )}
            </g>
          ))}
          {points
            .filter(
              (_point, index) => index % 2 === 0 || index === points.length - 1,
            )
            .map((point) => (
              <text
                key={point.month}
                x={point.x}
                y={height - 8}
                textAnchor="middle"
                className="axis-label"
              >
                {point.label}
              </text>
            ))}
        </svg>
      )}
    </section>
  );
}
