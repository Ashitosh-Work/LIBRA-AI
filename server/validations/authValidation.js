const AppError = require("../utils/AppError");

function cleanString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function validateRegisterPayload(body) {
  const name = cleanString(body.name);
  const email = cleanString(body.email).toLowerCase();
  const password = typeof body.password === "string" ? body.password : "";
  const confirmPassword = typeof body.confirmPassword === "string" ? body.confirmPassword : "";
  const errors = {};

  if (name.length < 2) errors.name = "Name must be at least 2 characters";
  if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = "Enter a valid email address";
  if (password.length < 8) errors.password = "Password must be at least 8 characters";
  if (password !== confirmPassword) errors.confirmPassword = "Passwords do not match";

  if (Object.keys(errors).length > 0) {
    throw new AppError("Invalid registration data", 400, errors);
  }

  return { name, email, password };
}

function validateLoginPayload(body) {
  const email = cleanString(body.email).toLowerCase();
  const password = typeof body.password === "string" ? body.password : "";
  const errors = {};

  if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = "Enter a valid email address";
  if (!password) errors.password = "Password is required";

  if (Object.keys(errors).length > 0) {
    throw new AppError("Invalid login data", 400, errors);
  }

  return { email, password };
}

module.exports = {
  validateRegisterPayload,
  validateLoginPayload
};
