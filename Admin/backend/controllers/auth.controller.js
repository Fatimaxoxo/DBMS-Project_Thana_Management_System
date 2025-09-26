import { UserModel } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError } from "../utils/httpError.js";

// Signup
export const signup = asyncHandler(async (req, res) => {
  const { name, phone, password } = req.body;

  // validation
  if (!/^\d{11}$/.test(phone)) {
    throw new HttpError(400, "Phone number must be 11 digits");
  }
  if (password.length < 6) {
    throw new HttpError(400, "Password must be at least 6 characters");
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
  });

  res.status(201).json({ message: "Signup successful", user });
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

  // simple login response (NO JWT)
  res.json({
    message: "Login successful",
    user: {
      id: user.user_id,
      name: user.name,
      phone: user.phone,
    },
  });
});
