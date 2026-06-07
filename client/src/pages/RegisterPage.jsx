import React, { useState } from "react";
import AuthCard from "../components/AuthCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";

function RegisterPage({ navigate }) {
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);

    try {
      await register(form);
      navigate("/dashboard");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard
      title="Create account"
      subtitle="Register once, then keep every expense scoped to your own account."
    >
      <form className="auth-form" onSubmit={handleSubmit}>
        {error && <div className="alert error">{error}</div>}
        <label className="field">
          <span>Name</span>
          <input
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            required
          />
        </label>
        <label className="field">
          <span>Email</span>
          <input
            type="email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            autoComplete="email"
            required
          />
        </label>
        <div className="form-grid">
          <label className="field">
            <span>Password</span>
            <input
              type="password"
              minLength="8"
              value={form.password}
              onChange={(event) => updateField("password", event.target.value)}
              autoComplete="new-password"
              required
            />
          </label>
          <label className="field">
            <span>Confirm</span>
            <input
              type="password"
              minLength="8"
              value={form.confirmPassword}
              onChange={(event) =>
                updateField("confirmPassword", event.target.value)
              }
              autoComplete="new-password"
              required
            />
          </label>
        </div>
        <button
          className="button primary full-width"
          type="submit"
          disabled={loading}
        >
          {loading ? "Creating..." : "Register"}
        </button>
      </form>
      <p className="auth-switch">
        Already registered?{" "}
        <button type="button" onClick={() => navigate("/login")}>
          Back to login
        </button>
      </p>
    </AuthCard>
  );
}

export default RegisterPage;
