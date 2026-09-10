import Program from "../models/Program.js";
import asyncHandler from "../utils/asyncHandler.js";
import { buildPaginatedResponse, parsePagination } from "../utils/paginate.js";

function parseBoolean(value) {
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
}

const SORT_OPTIONS = {
  relevance: { createdAt: -1 },
  tuitionAsc: { tuitionFeeUsd: 1 },
  tuitionDesc: { tuitionFeeUsd: -1 },
  duration: { durationMonths: 1 },
};

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
  } = req.query;

  const filters = {};

  if (country) {
    filters.country = country;
  }

  if (degreeLevel) {
    filters.degreeLevel = degreeLevel;
  }

  if (field) {
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
});

export { listPrograms };