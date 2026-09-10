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
<<<<<<< HEAD
    tuitionFeeUsd: {
      type: Number,
      required: true,
      index: true,
    },
    intakes: {
      type: [String],
      default: [],
    },
    durationMonths: {
      type: Number,
    },
    minimumIelts: {
      type: Number,
    },
    scholarshipAvailable: {
      type: Boolean,
      default: false,
    },
    stem: {
      type: Boolean,
      default: false,
    },
=======
    // ... keep the rest of your schema fields exactly the same
>>>>>>> bc0f2222228cda31971981bd3eefb333893e02bf
  },
  {
    timestamps: true,
  }
);

<<<<<<< HEAD
programSchema.index({ country: 1, degreeLevel: 1, tuitionFeeUsd: 1 });
=======
>>>>>>> bc0f2222228cda31971981bd3eefb333893e02bf
const Program = mongoose.model("Program", programSchema);

export default Program;