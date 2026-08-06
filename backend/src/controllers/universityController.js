import University from "../models/University.js";
import cacheService from "../services/cacheService.js";
import asyncHandler from "../utils/asyncHandler.js";

function parseBoolean(value) {
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
}

const listUniversities = asyncHandler(async (req, res) => {
  const {
    country,
    partnerType,
    q,
    scholarshipAvailable,
    sortBy = "popular",
    page = 1,
    limit = 10,
  } = req.query;

  const filters = {};

  if (country) {
    filters.country = country;
  }

  if (partnerType) {
    filters.partnerType = partnerType;
  }

  const scholarshipFlag = parseBoolean(scholarshipAvailable);
  if (typeof scholarshipFlag === "boolean") {
    filters.scholarshipAvailable = scholarshipFlag;
  }

  // ... keep the rest of your existing logic

  res.json({
    success: true,
    // data: ...
  });
});

const listPopularUniversities = asyncHandler(async (req, res) => {
  // keep your existing logic
});

export { listUniversities, listPopularUniversities };