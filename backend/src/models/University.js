import mongoose from "mongoose";

const universitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
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
    partnerType: {
      type: String,
      enum: ["direct", "recruitment-partner", "institution-partner"],
      default: "direct",
    },
    qsRanking: Number,
    scholarshipAvailable: {
      type: Boolean,
      default: false,
    },
    popularScore: {
      type: Number,
      default: 0,
      index: true,
    },
    tags: [String],
    websiteUrl: String,
  },
  {
    timestamps: true,
  }
);

<<<<<<< HEAD
universitySchema.index({ country: 1, scholarshipAvailable: 1 });
=======
>>>>>>> bc0f2222228cda31971981bd3eefb333893e02bf
const University = mongoose.model("University", universitySchema);

export default University;