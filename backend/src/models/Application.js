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
<<<<<<< HEAD
  { _id: false }
=======
  {
    _id: false,
  }
>>>>>>> bc0f2222228cda31971981bd3eefb333893e02bf
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
<<<<<<< HEAD
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

=======
    // ... keep the rest of your schema fields exactly the same
  },
  {
    timestamps: true,
  }
);

>>>>>>> bc0f2222228cda31971981bd3eefb333893e02bf
const Application = mongoose.model("Application", applicationSchema);

export default Application;