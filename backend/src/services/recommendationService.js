import Program from "../models/Program.js";
import Student from "../models/Student.js";
import HttpError from "../utils/httpError.js";

function calculateScore(student, program) {
  let score = 0;
  const reasons = [];

  if (student.targetCountries.includes(program.country)) {
    score += 35;
    reasons.push(`Preferred country match: ${program.country}`);
  }

  if (
    student.interestedFields.some((field) =>
      program.field.toLowerCase().includes(field.toLowerCase())
    )
  ) {
    score += 30;
    reasons.push(`Field alignment: ${program.field}`);
  }

  if (student.maxBudgetUsd >= program.tuitionFeeUsd) {
    score += 20;
    reasons.push("Within budget range");
  }

  if (student.preferredIntake && program.intakes.includes(student.preferredIntake)) {
    score += 10;
    reasons.push(`Preferred intake available: ${student.preferredIntake}`);
  }

  if ((student.englishTest?.score || 0) >= program.minimumIelts) {
    score += 5;
    reasons.push("English test score meets requirement");
  }

  return {
    score,
    reasons,
  };
}

async function buildProgramRecommendations(studentId) {
  const student = await Student.findById(studentId).lean();

  if (!student) {
    throw new HttpError(404, "Student not found.");
  }

  const candidatePrograms = await Program.find({
    country: { $in: student.targetCountries },
  })
    .limit(25)
    .lean();

  const recommendations = candidatePrograms
    .map((program) => {
      const { score, reasons } = calculateScore(student, program);
      return {
        ...program,
        matchScore: score,
        reasons,
      };
    })
    .sort((left, right) => right.matchScore - left.matchScore)
    .slice(0, 5);

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
    meta: {
      implementationStatus:
        "starter-scoring-in-javascript-replace-with-mongodb-aggregation",
    },
  };
}

export { buildProgramRecommendations };