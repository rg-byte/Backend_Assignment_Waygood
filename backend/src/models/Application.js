import mongoose from "mongoose";
import { applicationStatuses } from "../config/constants.js";

const applicationTimelineSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: applicationStatuses,
      required: true,
    },
    note: String,
    changedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const applicationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      index: true,
    },
    program: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Program",
      required: true,
      index: true,
    },
    university: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "University",
      required: true,
      index: true,
    },
    intake: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: applicationStatuses,
      default: "draft",
      index: true,
    },
    timeline: {
      type: [applicationTimelineSchema],
      default: [],
    },
  },
  { timestamps: true }
);

applicationSchema.index({ student: 1, status: 1 });

const Application = mongoose.model("Application", applicationSchema);

export default Application;