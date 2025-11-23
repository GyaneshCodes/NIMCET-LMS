import mongoose, { Schema } from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    questionId: {
      type: Number,
      unique: true,
      required: true,
    },
    questionText: {
      type: String,
      required: true,
    },
    options: {
      type: [
        {
          text: String,
          value: String,
          isCorrect: Boolean,
        },
      ],
      required: true,
      validate: [(arr) => arr.length >= 2, "At least 2 options are required"],
    },
    correctAnswer: {
      type: String,
      required: true,
    },
    topicId: {
      type: Schema.Types.ObjectId,
      ref: "Topic",
    },
    difficultyLevel: {
      type: String,
      required: true,
    },
    source: {
      type: String,
    },
    type: {
      type: String,
    },
    timeLimit: {
      type: Number,
      default: 120, // 2 minutes in seconds
    },
    explanation: {
      type: String,
      required: false,
    },
    tags: [
      {
        type: String,
        lowercase: true,
      },
    ],
    stats: {
      totalAttemp: {
        type: Number,
        default: 0,
      },
      correctAttemp: {
        type: Number,
        default: 0,
      },
      uniqueUsers: {
        type: Number,
        default: 0,
      },
      totalTimeSpent: {
        type: Number,
        default: 0,
      },
      wrongAnswerDistribution: {
        type: Map,
        of: Number,
        default: new Map(),
      },
    },
  },
  { timestamps: true }
);

questionSchema.index({ topicId: 1, difficultyLevel: 1 });
questionSchema.index({ questionText: "text" });
questionSchema.index({ tags: 1 });
questionSchema.index({ "stats.totalAttemp": -1 });

const Question = mongoose.model("Question", questionSchema);
export default Question;
