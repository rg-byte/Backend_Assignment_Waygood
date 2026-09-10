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
<<<<<<< HEAD
    targetCountries: {
      type: [String],
    },
    interestedFields: { type: [String], default: [] },
    maxBudgetUsd: { type: Number },
    preferredIntake: { type: String },
=======
    targetCountries:{
      type:[String],
    },
>>>>>>> bc0f2222228cda31971981bd3eefb333893e02bf
    englishTest: {
      exam: {
        type: String,
        default: "IELTS",
      },
      score: {
<<<<<<< HEAD
        type: Number,
      },
    },
    profileComplete: {
      type: Boolean,
      default: false,
    },
=======
        type:Number,       
      },
    },
    mathsTest:{
      exam:{
        type:String,
        default:"IMO",
      },
      score:{
        type:Number,
      }
    }
>>>>>>> bc0f2222228cda31971981bd3eefb333893e02bf
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