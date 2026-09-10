import Student from "../models/Student.js";
import asyncHandler from "../utils/asyncHandler.js";
import HttpError from "../utils/httpError.js";
import { verifyAccessToken } from "../utils/jwt.utils.js";

const requireAuth = asyncHandler(async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    throw new HttpError(401, "Authorization token missing.");
  }

  const token = authorizationHeader.replace("Bearer ", "").trim();

  let decoded;
  try {
    decoded = verifyAccessToken(token);
  } catch (error) {
    throw new HttpError(401, "Invalid or expired token.");
  }

  const student = await Student.findById(decoded.id).select("-password");

  if (!student) {
    throw new HttpError(401, "Authenticated user no longer exists.");
  }

  req.user = student;
  next();
});

export { requireAuth };