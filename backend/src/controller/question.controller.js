import Question from "../model/Question.model.js";
import { UserAttempt } from "../model/UserAttempt.model.js";
import { Topic } from "../model/Topic.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { DEFAULT_TIME_LIMIT, BATCH_SIZE } from "../constants.js";
import mongoose from "mongoose";

// Get questions for quiz
const getQuizQuestions = asyncHandler(async (req, res) => {
  const { topicId, difficultyLevel, limit = 10 } = req.query;
  const userId = req.user._id;

  // Validate topic exists
  if (topicId) {
    const topic = await Topic.findById(topicId);
    if (!topic) {
      throw new ApiError(404, "Topic not found");
    }
  }

  const query = {};
  if (topicId) query.topicId = new mongoose.Types.ObjectId(topicId);
  if (difficultyLevel) query.difficultyLevel = difficultyLevel;

  // Get attempted questions by user
  const attemptedQuestions = await UserAttempt.distinct("questionId", {
    userId,
  });

  // Exclude attempted questions if needed
  // query._id = { $nin: attemptedQuestions };

  const questions = await Question.aggregate([
    { $match: query },
    { $sample: { size: parseInt(limit) } },
    {
      $lookup: {
        from: "topics",
        localField: "topicId",
        foreignField: "_id",
        as: "topic",
      },
    },
    {
      $project: {
        questionId: 1,
        questionText: 1,
        options: {
          $map: {
            input: "$options",
            as: "option",
            in: {
              text: "$$option.text",
              value: "$$option.value",
            },
          },
        },
        difficultyLevel: 1,
        type: 1,
        topic: { $arrayElemAt: ["$topic", 0] },
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, questions, "Questions retrieved successfully"));
});

// Add new function for batch retrieval
const getQuestionsByTopic = asyncHandler(async (req, res) => {
  const { topicId, page = 1, limit = BATCH_SIZE } = req.query;

  if (!topicId) {
    throw new ApiError(400, "Topic ID is required");
  }

  const topic = await Topic.findById(topicId);
  if (!topic) {
    throw new ApiError(404, "Topic not found");
  }

  const questions = await Question.find({ topicId })
    .skip((page - 1) * limit)
    .limit(limit)
    .select("-correctAnswer");

  const total = await Question.countDocuments({ topicId });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        questions,
        pagination: {
          total,
          pages: Math.ceil(total / limit),
          currentPage: page,
        },
      },
      "Questions retrieved successfully"
    )
  );
});

// Submit answer
const submitAnswer = asyncHandler(async (req, res) => {
  const { questionId, userAnswer, timeTaken } = req.body;
  const userId = req.user._id;

  // Validate input
  if (!questionId || !userAnswer) {
    throw new ApiError(400, "Question ID and answer are required");
  }

  // Check if question exists
  const question = await Question.findById(questionId);
  const topic = await Topic.findById(question.topicId);
  if (!question) {
    throw new ApiError(404, "Question not found");
  }

  // Check if already attempted
  // const existingAttempt = await UserAttempt.findOne({ userId, questionId: question._id });
  // if (existingAttempt) {
  //   throw new ApiError(400, "Question already attempted");
  // }

  // Check answer
  const isCorrect = question.correctAnswer === userAnswer;

  // Validate time limit
  const timeLimit = question.timeLimit || DEFAULT_TIME_LIMIT;
  if (timeTaken > timeLimit) {
    throw new ApiError(400, "Time limit exceeded");
  }

  // Check if user has attempted this question before
  const previousAttempt = await UserAttempt.findOne({ userId, questionId: question._id });
  const isFirstAttempt = !previousAttempt;

  // Create attempt record
  const attempt = await UserAttempt.create({
    userId,
    questionId: question._id,
    userAnswer,
    isCorrect,
    timeTaken,
    topicId: question.topicId,
    difficulty: question.difficultyLevel,
  });

  // Prepare update object
  const updateStats = {
    $inc: {
      "stats.totalAttemp": 1,
      "stats.correctAttemp": isCorrect ? 1 : 0,
      "stats.totalTimeSpent": timeTaken,
      "stats.uniqueUsers": isFirstAttempt ? 1 : 0,
    },
  };

  // Update wrong answer distribution if incorrect
  if (!isCorrect) {
    updateStats.$inc[`stats.wrongAnswerDistribution.${userAnswer}`] = 1;
  }

  // Update question statistics
  await Question.findByIdAndUpdate(question._id, updateStats);
  await topic.updateStats(); // Update topic statistics

  // Enhanced response with feedback
  const responseData = {
    isCorrect,
    timeTaken,
    feedback: {
      correctAnswer: isCorrect ? undefined : question.correctAnswer,
      explanation: question.explanation,
      timeLimit,
      timeExceeded: timeTaken > timeLimit,
    },
    performance: {
      accuracy:
        ((question.correctAttemp + (isCorrect ? 1 : 0)) /
          (question.totalAttemp + 1)) *
        100,
      averageTime:
        (question.totalTimeSpent + timeTaken) / (question.totalAttemp + 1),
    },
  };

  return res
    .status(200)
    .json(new ApiResponse(200, responseData, "Answer submitted successfully"));
});

// Get user progress
const getUserProgress = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { topicId } = req.query;

  if (topicId) {
    const topic = await Topic.findById(topicId);
    if (!topic) {
      throw new ApiError(404, "Topic not found");
    }
  }

  const query = { userId };
  if (topicId) query.topicId = topicId;

  const progress = await UserAttempt.aggregate([
    { $match: query },
    {
      $lookup: {
        from: "topics",
        localField: "topicId",
        foreignField: "_id",
        as: "topic",
      },
    },
    {
      $group: {
        _id: "$topic._id",
        topicName: { $first: "$topic.topicName" },
        totalAttempts: { $sum: 1 },
        correctAttempts: {
          $sum: { $cond: ["$isCorrect", 1, 0] },
        },
        totalTime: { $sum: "$timeTaken" },
      },
    },
  ]);

  const progressData = progress[0] || {
    totalAttempts: 0,
    correctAttempts: 0,
    totalTime: 0,
  };

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        ...progressData,
        accuracy:
          (progressData.correctAttempts / progressData.totalAttempts) * 100 ||
          0,
        averageTime: progressData.totalTime / progressData.totalAttempts || 0,
      },
      "Progress retrieved successfully"
    )
  );
});

// Add new function for performance analytics
const getPerformanceAnalytics = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { timeFrame = "all" } = req.query;

  const dateQuery = {};
  if (timeFrame !== "all") {
    const date = new Date();
    date.setDate(date.getDate() - (timeFrame === "week" ? 7 : 30));
    dateQuery.attemptedAt = { $gte: date };
  }

  const analytics = await UserAttempt.aggregate([
    {
      $match: {
        userId: userId,
        ...dateQuery,
      },
    },
    {
      $lookup: {
        from: "topics",
        localField: "topicId",
        foreignField: "_id",
        as: "topic",
      },
    },
    {
      $group: {
        _id: {
          topic: "$topic._id",
          difficulty: "$difficulty",
        },
        topicName: { $first: "$topic.topicName" },
        totalQuestions: { $sum: 1 },
        correctAnswers: { $sum: { $cond: ["$isCorrect", 1, 0] } },
        averageTime: { $avg: "$timeTaken" },
        bestTime: { $min: "$timeTaken" },
        worstTime: { $max: "$timeTaken" },
      },
    },
    {
      $project: {
        topic: "$topicName",
        difficulty: "$_id.difficulty",
        accuracy: {
          $multiply: [{ $divide: ["$correctAnswers", "$totalQuestions"] }, 100],
        },
        averageTime: 1,
        bestTime: 1,
        worstTime: 1,
        totalQuestions: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        analytics,
        "Performance analytics retrieved successfully"
      )
    );
});

// Get recent attempts for user profile
const getRecentAttempts = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { limit = 5 } = req.query;

  const attempts = await UserAttempt.aggregate([
    { $match: { userId } },
    { $sort: { attemptedAt: -1 } },
    { $limit: parseInt(limit) },
    {
      $lookup: {
        from: "questions",
        localField: "questionId",
        foreignField: "_id",
        as: "question",
      },
    },
    {
      $lookup: {
        from: "topics",
        localField: "topicId",
        foreignField: "_id",
        as: "topic",
      },
    },
    {
      $project: {
        _id: 1,
        isCorrect: 1,
        timeTaken: 1,
        attemptedAt: 1,
        userAnswer: 1,
        questionText: { $arrayElemAt: ["$question.questionText", 0] },
        correctAnswer: { $arrayElemAt: ["$question.correctAnswer", 0] },
        topicName: { $arrayElemAt: ["$topic.topicName", 0] },
        difficulty: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, attempts, "Recent attempts retrieved successfully"));
});

export {
  getQuizQuestions,
  submitAnswer,
  getUserProgress,
  getQuestionsByTopic,
  getPerformanceAnalytics,
  getRecentAttempts,
};
