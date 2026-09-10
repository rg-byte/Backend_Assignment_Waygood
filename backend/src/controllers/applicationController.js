import Application from "../models/Application.js";
import Program from "../models/Program.js";
import Student from "../models/Student.js";
import asyncHandler from "../utils/asyncHandler.js";
import HttpError from "../utils/httpError.js";
import { validStatusTransitions } from "../config/constants.js";

const listApplications = asyncHandler(async (req, res) => {
  const { studentId, status } = req.query;
  const filters = {};

  if (studentId) filters.student = studentId;
  if (status) filters.status = status;

  const applications = await Application.find(filters)
    .populate("student", "fullName email role")
    .populate("program", "title degreeLevel tuitionFeeUsd")
    .populate("university", "name country city")
    .sort({ createdAt: -1 })
    .lean();

  res.json({ success: true, data: applications });
});

const createApplication = asyncHandler(async (req, res) => {
  const { studentId, programId, intake, note } = req.body;

  if (!studentId || !programId || !intake) {
    throw new HttpError(400, "studentId, programId, and intake are required.");
  }

  const [student, program] = await Promise.all([
    Student.findById(studentId),
    Program.findById(programId),
  ]);

  if (!student) throw new HttpError(404, "Student not found.");
  if (!program) throw new HttpError(404, "Program not found.");

  if (!program.intakes.includes(intake)) {
    throw new HttpError(400, `Program does not offer a "${intake}" intake.`);
  }

  const existing = await Application.findOne({
    student: studentId,
    program: programId,
    intake,
  });

  if (existing) {
    throw new HttpError(
      409,
      "An application already exists for this student, program, and intake."
    );
  }

  const application = await Application.create({
    student: studentId,
    program: programId,
    university: program.university,
    intake,
    status: "draft",
    timeline: [
      {
        status: "draft",
        note: note || "Application created.",
      },
    ],
  });

  const populated = await application.populate([
    { path: "student", select: "fullName email role" },
    { path: "program", select: "title degreeLevel tuitionFeeUsd" },
    { path: "university", select: "name country city" },
  ]);

  res.status(201).json({ success: true, data: populated });
});

const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status: nextStatus, note } = req.body;

  if (!nextStatus) {
    throw new HttpError(400, "New status is required.");
  }

  const application = await Application.findById(id);
  if (!application) {
    throw new HttpError(404, "Application not found.");
  }

  const currentStatus = application.status;
  const allowedNextStatuses = validStatusTransitions[currentStatus] || [];

  if (!allowedNextStatuses.includes(nextStatus)) {
    throw new HttpError(
      400,
      `Cannot transition from "${currentStatus}" to "${nextStatus}". Allowed: ${
        allowedNextStatuses.length ? allowedNextStatuses.join(", ") : "none (terminal status)"
      }.`
    );
  }

  application.status = nextStatus;
  application.timeline.push({
    status: nextStatus,
    note: note || `Status changed to ${nextStatus}.`,
  });

  await application.save();

  const populated = await application.populate([
    { path: "student", select: "fullName email role" },
    { path: "program", select: "title degreeLevel tuitionFeeUsd" },
    { path: "university", select: "name country city" },
  ]);

  res.json({ success: true, data: populated });
});

export { listApplications, createApplication, updateApplicationStatus };