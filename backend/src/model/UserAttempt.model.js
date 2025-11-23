import mongoose, { Schema } from "mongoose";

const userAttemptSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  questionId: {
    type: Schema.Types.ObjectId,
    ref: "Question",
    required: true,
  },
  timeTaken: {
    type: Number,
    required: true,
  },
  isCorrect: {
    type: Boolean,
    required: true,
  },
  userAnswer: {
    type: String,
    required: true,
  },
  attemptedAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  // Add new fields
  topicId: {
    type: Schema.Types.ObjectId,
    ref: "Topic",
    required: true,
  },
  difficulty: {
    type: String,
    required: true,
  },
  timeExceeded: {
    type: Boolean,
    default: false,
  },
});

// Add new indexes
userAttemptSchema.index({ userId: 1, attemptedAt: -1 });
userAttemptSchema.index({ topicId: 1, difficulty: 1 });

export const UserAttempt = mongoose.model("UserAttempt", userAttemptSchema);
