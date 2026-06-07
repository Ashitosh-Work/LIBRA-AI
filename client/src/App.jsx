import React, { useEffect, useState } from "react";
import Header from "./components/Header.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import { useHashRoute } from "./hooks/useHashRoute.js";
import DashboardPage from "./pages/DashboardPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";

function App() {
  const { isAuthenticated } = useAuth();
  const { route, navigate } = useHashRoute();
  const [theme, setTheme] = useState(
    () => localStorage.getItem("libra_theme") || "light",
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("libra_theme", theme);
  }, [theme]);

  useEffect(() => {
    if (!isAuthenticated && route !== "/login" && route !== "/register") {
      navigate("/login");
    }

    if (
      isAuthenticated &&
      (route === "/login" || route === "/register" || route === "/")
    ) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate, route]);

  function toggleTheme() {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }

  return (
    <div className="app-shell">
      {isAuthenticated && <Header theme={theme} onToggleTheme={toggleTheme} />}
      <main className={isAuthenticated ? "app-main" : "auth-main"}>
        {!isAuthenticated && route === "/register" && (
          <RegisterPage navigate={navigate} />
        )}
        {!isAuthenticated && route !== "/register" && (
          <LoginPage navigate={navigate} />
        )}
        {isAuthenticated && <DashboardPage />}
      </main>
    </div>
  );
}

export default App;
