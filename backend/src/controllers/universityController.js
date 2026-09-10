import University from "../models/University.js";
import cacheService from "../services/cacheService.js";
import asyncHandler from "../utils/asyncHandler.js";
import { buildPaginatedResponse, parsePagination } from "../utils/paginate.js";

function parseBoolean(value) {
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
}

const SORT_OPTIONS = {
  popular: { popularScore: -1 },
  ranking: { qsRanking: 1 },
  name: { name: 1 },
};

const listUniversities = asyncHandler(async (req, res) => {
  const { country, partnerType, q, scholarshipAvailable, sortBy = "popular" } = req.query;

  const filters = {};
  if (country) filters.country = country;
  if (partnerType) filters.partnerType = partnerType;

  const scholarshipFlag = parseBoolean(scholarshipAvailable);
  if (typeof scholarshipFlag === "boolean") filters.scholarshipAvailable = scholarshipFlag;

  if (q) {
    filters.$or = [
      { name: { $regex: q, $options: "i" } },
      { city: { $regex: q, $options: "i" } },
      { tags: { $regex: q, $options: "i" } },
    ];
  }

  const { page, limit, skip } = parsePagination(req.query);
  const sort = SORT_OPTIONS[sortBy] || SORT_OPTIONS.popular;

  const [universities, totalCount] = await Promise.all([
    University.find(filters).sort(sort).skip(skip).limit(limit).lean(),
    University.countDocuments(filters),
  ]);

  res.json(buildPaginatedResponse(universities, { page, limit, totalCount }));
});

const listPopularUniversities = asyncHandler(async (req, res) => {
  const cacheKey = "universities-popular";
  const cached = cacheService.get(cacheKey);
  if (cached) return res.json({ success: true, data: cached, meta: { cache: "hit" } });

  const universities = await University.find().sort({ popularScore: -1 }).limit(10).lean();
  cacheService.set(cacheKey, universities);

  res.json({ success: true, data: universities, meta: { cache: "miss" } });
});

export { listUniversities, listPopularUniversities };