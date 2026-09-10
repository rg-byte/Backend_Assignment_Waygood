import Student from "../models/Student.js";
import asyncHandler from "../utils/asyncHandler.js";
import HttpError from "../utils/httpError.js";
import validate from "../utils/validate.js";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.utils.js";

const VALID_ROLES = ["student", "counselor"];

const register = asyncHandler(async (req, res) => {
  const { fullName, email, password, role, targetCountries, interestedFields } = req.body;

  const { errors, hasError } = validate(fullName, email, password);
  if (hasError) {
    return res.status(400).json({ success: false, errors });
  }

  if (role && !VALID_ROLES.includes(role)) {
    return res.status(400).json({
      success: false,
      message: `Role must be one of: ${VALID_ROLES.join(", ")}`,
    });
  }

  const existingUser = await Student.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ success: false, message: "User already exists" });
  }

  const student = await Student.create({
    fullName,
    email,
    password, // hashed by the pre-save hook
    role: role || "student",
    targetCountries,
  });

  const accessToken = generateAccessToken(student._id, student.role);
  const refreshToken = generateRefreshToken(student._id, student.role);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(201).json({
    success: true,
    message: "Registration successful",
    accessToken,
    user: {
      id: student._id,
      fullName: student.fullName,
      email: student.email,
      role: student.role,
      targetCountries: student.targetCountries,
    },
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required" });
  }

  const student = await Student.findOne({ email }).select("+password");
  if (!student) {
    return res.status(400).json({ success: false, message: "User doesn't exist" });
  }

  const isPasswordMatched = await bcrypt.compare(password, student.password);
  if (!isPasswordMatched) {
    return res.status(400).json({ success: false, message: "Invalid password" });
  }

  const accessToken = generateAccessToken(student._id, student.role);
  const refreshToken = generateRefreshToken(student._id, student.role);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({
    success: true,
    message: "Login successful",
    accessToken,
    user: {
      id: student._id,
      fullName: student.fullName,
      email: student.email,
      role: student.role,
      targetCountries: student.targetCountries,
    },
  });
});

const me = asyncHandler(async (req, res) => {
  // req.user is set by requireAuth middleware, already excludes password
  return res.status(200).json({
    success: true,
    data: req.user,
  });
});

export { register, login, me };