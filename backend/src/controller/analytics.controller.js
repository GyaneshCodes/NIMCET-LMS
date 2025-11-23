import { UserAttempt } from "../model/UserAttempt.model.js";
import { Topic } from "../model/Topic.model.js";
import mongoose from "mongoose";

export const getUserAnalytics = async (req, res) => {
  try {
    const { userId } = req.params;

    // 1. Overall Statistics
    const overallStats = await UserAttempt.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalQuestionsAttempted: { $sum: 1 },
          correctAnswers: {
            $sum: { $cond: [{ $eq: ["$isCorrect", true] }, 1, 0] },
          },
          totalTimeTaken: { $sum: "$timeTaken" },
        },
      },
      {
        $project: {
          _id: 0,
          totalQuestionsAttempted: 1,
          correctAnswers: 1,
          overallAccuracy: {
            $multiply: [
              { $divide: ["$correctAnswers", "$totalQuestionsAttempted"] },
              100,
            ],
          },
          averageTimePerQuestion: {
            $divide: ["$totalTimeTaken", "$totalQuestionsAttempted"],
          },
        },
      },
    ]);

    // 2. Topic-wise Performance
    const topicWiseStats = await UserAttempt.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: "$topicId",
          totalQuestions: { $sum: 1 },
          correctAnswers: {
            $sum: { $cond: [{ $eq: ["$isCorrect", true] }, 1, 0] },
          },
          avgTime: { $avg: "$timeTaken" },
        },
      },
      {
        $lookup: {
          from: "topics",
          localField: "_id",
          foreignField: "_id",
          as: "topicInfo",
        },
      },
      { $unwind: "$topicInfo" },
      {
        $project: {
          topicId: "$_id",
          topicName: "$topicInfo.topicName",
          totalQuestions: 1,
          correctAnswers: 1,
          accuracy: {
            $multiply: [{ $divide: ["$correctAnswers", "$totalQuestions"] }, 100],
          },
          avgTime: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        overall: overallStats[0] || {
          totalQuestionsAttempted: 0,
          correctAnswers: 0,
          overallAccuracy: 0,
          averageTimePerQuestion: 0,
        },
        topicWise: topicWiseStats,
      },
    });
  } catch (error) {
    console.error("Error in getUserAnalytics:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getTopicAnalytics = async (req, res) => {
  try {
    const { userId, topicId } = req.params;

    const stats = await UserAttempt.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          topicId: new mongoose.Types.ObjectId(topicId),
        },
      },
      {
        $group: {
          _id: null,
          totalQuestions: { $sum: 1 },
          correctAnswers: {
            $sum: { $cond: [{ $eq: ["$isCorrect", true] }, 1, 0] },
          },
          avgTime: { $avg: "$timeTaken" },
          difficultyBreakdown: {
            $push: {
              difficulty: "$difficulty",
              isCorrect: "$isCorrect",
              timeTaken: "$timeTaken",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalQuestions: 1,
          correctAnswers: 1,
          accuracy: {
            $multiply: [{ $divide: ["$correctAnswers", "$totalQuestions"] }, 100],
          },
          avgTime: 1,
          difficultyBreakdown: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: stats[0] || {
        totalQuestions: 0,
        correctAnswers: 0,
        accuracy: 0,
        avgTime: 0,
        difficultyBreakdown: [],
      },
    });
  } catch (error) {
    console.error("Error in getTopicAnalytics:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
