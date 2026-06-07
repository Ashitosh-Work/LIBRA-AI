const jwt = require("jsonwebtoken");
const User = require("../models/User");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const { validateRegisterPayload, validateLoginPayload } = require("../validations/authValidation");

function signToken(userId) {
  if (!process.env.JWT_SECRET) {
    throw new AppError("JWT_SECRET is not configured", 500);
  }

  return jwt.sign({ sub: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
  });
}

function authResponse(user, token) {
  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    }
  };
}

const register = asyncHandler(async (req, res) => {
  const payload = validateRegisterPayload(req.body);
  const existingUser = await User.findOne({ email: payload.email });

  if (existingUser) {
    throw new AppError("Email is already registered", 409, { email: "Email is already registered" });
  }

  const user = await User.create(payload);
  const token = signToken(user._id);

  res.status(201).json({
    success: true,
    data: authResponse(user, token)
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = validateLoginPayload(req.body);
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = signToken(user._id);

  res.json({
    success: true,
    data: authResponse(user, token)
  });
});

const me = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: {
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email
      }
    }
  });
});

module.exports = {
  register,
  login,
  me
};
