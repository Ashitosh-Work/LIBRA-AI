import React from "react";
import { useAuth } from "../context/AuthContext.jsx";

function Header({ theme, onToggleTheme }) {
  const { logout, user } = useAuth();

  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">Libra AI</p>
        <h1>Expense Tracker</h1>
      </div>
      <div className="topbar-actions">
        <span className="user-chip">{user?.name || "User"}</span>
        <button
          className="icon-button"
          type="button"
          onClick={onToggleTheme}
          title="Toggle theme"
        >
          {theme === "dark" ? "Light" : "Dark"}
        </button>
        <button className="button secondary" type="button" onClick={logout}>
          Logout
        </button>
      </div>
    </header>
  );
}

export default Header;
