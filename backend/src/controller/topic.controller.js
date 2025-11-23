import { Topic } from "../model/Topic.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";

const getAllTopics = asyncHandler(async (req, res) => {
  const topics = await Topic.find({ isActive: true });
  return res
    .status(200)
    .json(new ApiResponse(200, topics, "Topics retrieved successfully"));
});

const getTopicsBySubject = asyncHandler(async (req, res) => {
  const { subject } = req.params;
  const topics = await Topic.find({ subjectBelongsTo: subject, isActive: true });
  return res
    .status(200)
    .json(new ApiResponse(200, topics, "Topics retrieved successfully"));
});

export { getAllTopics, getTopicsBySubject };
