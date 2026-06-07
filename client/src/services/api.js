const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8082/api";

function buildUrl(path, query = {}) {
  const url = new URL(`${API_URL}${path}`);

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });

  return url.toString();
}

async function request(path, { method = "GET", body, token, query } = {}) {
  const headers = {};

  if (body) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(buildUrl(path, query), {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  const payload = text ? JSON.parse(text) : {};

  if (!response.ok) {
    const error = new Error(payload.message || "Request failed");
    error.details = payload.details;
    error.status = response.status;
    throw error;
  }

  return payload;
}

export const api = {
  async register(data) {
    const response = await request("/auth/register", {
      method: "POST",
      body: data,
    });
    return response.data;
  },

  async login(data) {
    const response = await request("/auth/login", {
      method: "POST",
      body: data,
    });
    return response.data;
  },

  async me(token) {
    const response = await request("/auth/me", { token });
    return response.data;
  },

  async dashboard(token) {
    const response = await request("/dashboard", { token });
    return response.data;
  },

  async listExpenses(token, query) {
    return request("/expenses", { token, query });
  },

  async createExpense(token, data) {
    const response = await request("/expenses", {
      method: "POST",
      token,
      body: data,
    });
    return response.data;
  },

  async updateExpense(token, id, data) {
    const response = await request(`/expenses/${id}`, {
      method: "PUT",
      token,
      body: data,
    });
    return response.data;
  },

  async deleteExpense(token, id) {
    const response = await request(`/expenses/${id}`, {
      method: "DELETE",
      token,
    });
    return response.data;
  },
};
