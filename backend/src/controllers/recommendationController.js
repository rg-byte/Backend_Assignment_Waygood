import asyncHandler from "../utils/asyncHandler.js";
import { buildProgramRecommendations } from "../services/recommendationService.js";

const getRecommendations = asyncHandler(async (req, res) => {
  const { studentId } = req.params;
  const payload = await buildProgramRecommendations(studentId);

  res.json({
    success: true,
    ...payload,
  });
});

export { getRecommendations };