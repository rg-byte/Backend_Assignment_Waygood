import Student from "../models/Student.js";
import asyncHandler from "../utils/asyncHandler.js";
import HttpError from "../utils/httpError.js";
import validate from "../utils/validate.js";
<<<<<<< HEAD
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
=======
import bcrypt from "bcryptjs/dist/bcrypt.js";

function starterMessage(capability) {
  return `${capability} is intentionally left incomplete for the candidate assignment.`;
}

const register = asyncHandler(async (req, res) => {
  try {
    const { fullName, email, password, targetCountries,interestedFields } = req.body;
    const { errors, hasError } = validate(fullName, email, password);
    if (hasError) {
      return res.status(400).json(errors);
    }
    let existingUser = await Student.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User Already exist" });
    }
    
  } 
  catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ message: "Register Error", error });
  }
});

const login = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "User doesn't exist" });
    }
    
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const accessToken = await generateAccessToken(user._id);
    const refreshToken = await generateRefreshToken(user._id);

    const userData = {
      id: user._id,
      fullname: user.fullname,
      email: user.email,
      password: user.password,
      targetCountries: user.targetCountries,
      interestedFields: user.interestedFields
    };

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
      user: userData,
    });

  } 
  catch (error) {
    console.error("Login Error:", error);
    return res
      .status(500)
      .json({ message: "Something went wrong during login" });
  } 
});

const me = asyncHandler(async (req, res) => {
  throw new HttpError(
    501,
    starterMessage("Fetching the authenticated user profile")
  );
>>>>>>> bc0f2222228cda31971981bd3eefb333893e02bf
});

export { register, login, me };