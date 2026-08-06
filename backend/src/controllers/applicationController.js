import Application from "../models/Application.js";
import asyncHandler from "../utils/asyncHandler.js";
import HttpError from "../utils/httpError.js";

const listApplications = asyncHandler(async (req, res) => {
  const { studentId, status } = req.query;
  const filters = {};

  if (studentId) {
    filters.student = studentId;
  }

  if (status) {
    filters.status = status;
  }

  const applications = await Application.find(filters)
    .populate("student", "fullName email role")
    .populate("program", "title degreeLevel tuitionFeeUsd")
    .populate("university", "name country city")
    .sort({ createdAt: -1 })
    .lean();

  res.json({
    success: true,
    data: applications,
  });
});

const createApplication = asyncHandler(async (req, res) => {
  throw new HttpError(
    501,
    "Application creation is intentionally incomplete for the assignment."
  );
});

const updateApplicationStatus = asyncHandler(async (req, res) => {
  // keep the rest of your existing logic here
});

export { listApplications, createApplication, updateApplicationStatus };