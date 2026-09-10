import mongoose from "mongoose";
import Program from "../models/Program.js";
import Student from "../models/Student.js";
import HttpError from "../utils/httpError.js";

async function buildProgramRecommendations(studentId) {
  const student = await Student.findById(studentId).lean();

  if (!student) {
    throw new HttpError(404, "Student not found.");
  }

  const targetCountries = student.targetCountries || [];
  const interestedFields = student.interestedFields || [];
  const maxBudgetUsd = student.maxBudgetUsd;
  const preferredIntake = student.preferredIntake;
  const ieltsScore = student.englishTest?.score || 0;

  const fieldRegexes = interestedFields.map(
    (field) => new RegExp(field, "i")
  );

  const recommendations = await Program.aggregate([
    {
      $match: {
        country: { $in: targetCountries.length ? targetCountries : [null] },
      },
    },
    {
      $addFields: {
        countryMatch: { $in: ["$country", targetCountries] },
        fieldMatch: fieldRegexes.length
          ? {
              $anyElementTrue: {
                $map: {
                  input: fieldRegexes.map((re) => re.source),
                  as: "pattern",
                  in: {
                    $regexMatch: {
                      input: "$field",
                      regex: "$$pattern",
                      options: "i",
                    },
                  },
                },
              },
            }
          : false,
        withinBudget:
          maxBudgetUsd != null
            ? { $lte: ["$tuitionFeeUsd", maxBudgetUsd] }
            : false,
        intakeMatch: preferredIntake
          ? { $in: [preferredIntake, "$intakes"] }
          : false,
        ieltsMatch: { $gte: [ieltsScore, { $ifNull: ["$minimumIelts", 0] }] },
      },
    },
    {
      $addFields: {
        matchScore: {
          $sum: [
            { $cond: ["$countryMatch", 35, 0] },
            { $cond: ["$fieldMatch", 30, 0] },
            { $cond: ["$withinBudget", 20, 0] },
            { $cond: ["$intakeMatch", 10, 0] },
            { $cond: ["$ieltsMatch", 5, 0] },
          ],
        },
      },
    },
    {
      $addFields: {
        reasons: {
          $concatArrays: [
            { $cond: ["$countryMatch", [{ $concat: ["Preferred country match: ", "$country"] }], []] },
            { $cond: ["$fieldMatch", [{ $concat: ["Field alignment: ", "$field"] }], []] },
            { $cond: ["$withinBudget", ["Within budget range"], []] },
            { $cond: ["$intakeMatch", [{ $concat: ["Preferred intake available: ", { $ifNull: [preferredIntake, ""] }] }], []] },
            { $cond: ["$ieltsMatch", ["English test score meets requirement"], []] },
          ],
        },
      },
    },
    { $match: { matchScore: { $gt: 0 } } },
    { $sort: { matchScore: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: "universities",
        localField: "university",
        foreignField: "_id",
        as: "universityDetails",
      },
    },
    { $unwind: { path: "$universityDetails", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        title: 1,
        field: 1,
        degreeLevel: 1,
        country: 1,
        city: 1,
        tuitionFeeUsd: 1,
        intakes: 1,
        minimumIelts: 1,
        scholarshipAvailable: 1,
        universityName: 1,
        matchScore: 1,
        reasons: 1,
        university: {
          name: "$universityDetails.name",
          qsRanking: "$universityDetails.qsRanking",
        },
      },
    },
  ]);

  return {
    data: {
      student: {
        id: student._id,
        fullName: student.fullName,
        role: student.role,
        targetCountries: student.targetCountries,
        interestedFields: student.interestedFields,
      },
      recommendations,
    },
  };
}

export { buildProgramRecommendations };