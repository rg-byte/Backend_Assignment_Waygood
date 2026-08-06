import mongoose from "mongoose";

const programSchema = new mongoose.Schema(
  {
    university: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "University",
      required: true,
      index: true,
    },
    universityName: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
      index: true,
    },
    city: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    field: {
      type: String,
      required: true,
      index: true,
    },
    degreeLevel: {
      type: String,
      required: true,
      enum: ["bachelor", "master", "diploma", "certificate"],
    },
    // ... keep the rest of your schema fields exactly the same
  },
  {
    timestamps: true,
  }
);

const Program = mongoose.model("Program", programSchema);

export default Program;