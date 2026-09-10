import Program from "../models/Program.js";
import asyncHandler from "../utils/asyncHandler.js";
<<<<<<< HEAD
import { buildPaginatedResponse, parsePagination } from "../utils/paginate.js";
=======
>>>>>>> bc0f2222228cda31971981bd3eefb333893e02bf

function parseBoolean(value) {
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
}

<<<<<<< HEAD
const SORT_OPTIONS = {
  relevance: { createdAt: -1 },
  tuitionAsc: { tuitionFeeUsd: 1 },
  tuitionDesc: { tuitionFeeUsd: -1 },
  duration: { durationMonths: 1 },
};

=======
>>>>>>> bc0f2222228cda31971981bd3eefb333893e02bf
const listPrograms = asyncHandler(async (req, res) => {
  const {
    country,
    degreeLevel,
    intake,
    field,
    q,
    maxTuition,
    scholarshipAvailable,
    sortBy = "relevance",
<<<<<<< HEAD
=======
    page = 1,
    limit = 10,
>>>>>>> bc0f2222228cda31971981bd3eefb333893e02bf
  } = req.query;

  const filters = {};

  if (country) {
    filters.country = country;
  }

  if (degreeLevel) {
    filters.degreeLevel = degreeLevel;
  }

  if (field) {
<<<<<<< HEAD
    filters.field = { $regex: field, $options: "i" };
  }

  if (intake) {
    filters.intakes = intake; // matches if intake string is present in the intakes array
  }

  if (maxTuition) {
    const maxTuitionNumber = Number(maxTuition);
    if (!Number.isNaN(maxTuitionNumber)) {
      filters.tuitionFeeUsd = { $lte: maxTuitionNumber };
    }
  }

  const scholarshipFlag = parseBoolean(scholarshipAvailable);
  if (typeof scholarshipFlag === "boolean") {
    filters.scholarshipAvailable = scholarshipFlag;
  }

  if (q) {
    filters.$or = [
      { title: { $regex: q, $options: "i" } },
      { field: { $regex: q, $options: "i" } },
      { universityName: { $regex: q, $options: "i" } },
      { city: { $regex: q, $options: "i" } },
    ];
  }

  const { page, limit, skip } = parsePagination(req.query);
  const sort = SORT_OPTIONS[sortBy] || SORT_OPTIONS.relevance;

  const [programs, totalCount] = await Promise.all([
    Program.find(filters)
      .populate("university", "name country city qsRanking")
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    Program.countDocuments(filters),
  ]);

  res.json(buildPaginatedResponse(programs, { page, limit, totalCount }));
=======
    filters.field = field;
  }

  // ... keep the rest of your existing filter + query logic

  res.json({
    success: true,
    // data: ...
  });
>>>>>>> bc0f2222228cda31971981bd3eefb333893e02bf
});

export { listPrograms };