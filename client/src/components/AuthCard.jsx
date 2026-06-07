import React from "react";

function AuthCard({ title, subtitle, children }) {
  return (
    <section className="auth-card" aria-labelledby="auth-title">
      <div className="auth-brand">
        <span className="brand-mark">L</span>
        <div>
          <p className="eyebrow">Libra AI</p>
          <h1 id="auth-title">{title}</h1>
        </div>
      </div>
      <p className="auth-subtitle">{subtitle}</p>
      {children}
    </section>
  );
}

export default AuthCard;
