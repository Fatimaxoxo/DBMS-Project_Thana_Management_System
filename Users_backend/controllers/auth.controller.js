import { UserModel } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError } from "../utils/httpError.js";
import jwt from "jsonwebtoken";

// Signup
export const signup = asyncHandler(async (req, res) => {
  const { name, phone, password, role = "user", thana_id = null } = req.body;

  // validation
  if (!/^\d{11}$/.test(phone)) {
    throw new HttpError(400, "Phone number must be 11 digits");
  }
  if (password.length < 6) {
    throw new HttpError(400, "Password must be at least 6 characters");
  }

  // Validate role
  const validRoles = ["user", "thana-officer", "warrant-officer"];
  if (!validRoles.includes(role)) {
    throw new HttpError(400, "Invalid role specified");
  }

  // If role is thana-officer or warrant-officer, thana_id is required
  if ((role === "thana-officer" || role === "warrant-officer") && !thana_id) {
    throw new HttpError(400, "Thana ID is required for officer roles");
  }

  const existing = await UserModel.findByPhone(phone);
  if (existing) {
    throw new HttpError(400, "Phone number already registered");
  }

  // directly save password (NO hash)
  const user = await UserModel.create({
    name,
    phone,
    password,
    role,
    thana_id,
  });

  // Generate JWT token
  const token = jwt.sign(
    {
      userId: user.user_id,
      role: user.user_type,
      thanaId: user.thana_id,
    },
    process.env.JWT_SECRET || "fallback_secret",
    { expiresIn: "30d" }
  );

  res.status(201).json({
    message: "Signup successful",
    user: {
      id: user.user_id,
      name: user.name,
      phone: user.phone,
      role: user.user_type,
      userType: user.user_type,
      thana_id: user.thana_id,
    },
    token,
  });
});

// Login
export const login = asyncHandler(async (req, res) => {
  const { phone, password } = req.body;

  const user = await UserModel.findByPhone(phone);
  if (!user) throw new HttpError(400, "Invalid phone or password");

  // direct password check (NO bcrypt)
  if (user.password !== password) {
    throw new HttpError(400, "Invalid phone or password");
  }

  // Generate JWT token
  const token = jwt.sign(
    {
      userId: user.user_id,
      role: user.user_type,
      thanaId: user.thana_id,
    },
    process.env.JWT_SECRET || "fallback_secret",
    { expiresIn: "30d" }
  );

  // Role-based login response
  res.json({
    message: "Login successful",
    user: {
      user_id: user.user_id,
      id: user.user_id,
      name: user.name,
      phone: user.phone,
      role: user.user_type,
      userType: user.user_type,
      thana_id: user.thana_id,
      thana_name: user.thana_name,
    },
    token,
  });
});

// Get user profile
export const getProfile = asyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.user.userId);
  if (!user) throw new HttpError(404, "User not found");

  res.json({
    user: {
      id: user.user_id,
      name: user.name,
      phone: user.phone,
      role: user.user_type,
      userType: user.user_type,
      thana_id: user.thana_id,
      thana_name: user.thana_name,
      created_at: user.created_at,
    },
  });
});
