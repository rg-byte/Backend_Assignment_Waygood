import Application from "../models/Application.js";
import Program from "../models/Program.js";
import Student from "../models/Student.js";
import cacheService from "../services/cacheService.js";
import asyncHandler from "../utils/asyncHandler.js";

const getOverview = asyncHandler(async (req, res) => {
  const cacheKey = "dashboard-overview";
  const cachedPayload = cacheService.get(cacheKey);

  if (cachedPayload) {
    return res.json({
      success: true,
      data: cachedPayload,
      meta: { cache: "hit" },
    });
  }

  const [totalStudents, totalPrograms, totalApplications, statusBreakdown, topCountries] =
    await Promise.all([
      Student.countDocuments(),
      Program.countDocuments(),
      Application.countDocuments(),
      Application.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Application.aggregate([
<<<<<<< HEAD
        {
          $lookup: {
            from: "programs",
            localField: "program",
            foreignField: "_id",
            as: "programDetails",
          },
        },
        { $unwind: "$programDetails" },
        { $group: { _id: "$programDetails.country", count: { $sum: 1 } } },
=======
        { $group: { _id: "$destinationCountry", count: { $sum: 1 } } },
>>>>>>> bc0f2222228cda31971981bd3eefb333893e02bf
        { $sort: { count: -1 } },
        { $limit: 5 },
      ]),
    ]);

  const payload = {
    totalStudents,
    totalPrograms,
<<<<<<< HEAD
    totalApplications,
    statusBreakdown,
    topCountries,
  };

  cacheService.set(cacheKey, payload);
=======
    // ... keep the rest of your existing payload logic
  };

  // cacheService.set(cacheKey, payload);  // if you have this
>>>>>>> bc0f2222228cda31971981bd3eefb333893e02bf

  res.json({
    success: true,
    data: payload,
    meta: { cache: "miss" },
  });
});

export { getOverview };