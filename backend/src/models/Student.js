import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    role: {
      type: String,
      enum: ["student", "counselor"],
      default: "student",
    },
    targetCountries: {
      type: [String],
    },
    interestedFields: { type: [String], default: [] },
    maxBudgetUsd: { type: Number },
    preferredIntake: { type: String },
    englishTest: {
      exam: {
        type: String,
        default: "IELTS",
      },
      score: {
        type: Number,
      },
    },
    profileComplete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Keep your pre-save hook and methods if they exist
// Example:
studentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const Student = mongoose.model("Student", studentSchema);

export default Student;