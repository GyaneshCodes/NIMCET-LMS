import mongoose from "mongoose";

const topicSchema = new mongoose.Schema(
  {
    topicId: {
      type: Number,
      required: true,
      unique: true,
    },
    topicName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    subjectBelongsTo: {
      type: String,
      required: true,
    },
    stats: {
      totalQuestions: {
        type: Number,
        default: 0,
      },
      activeQuestions: {
        type: Number,
        default: 0,
      },
      averageAccuracy: {
        type: Number,
        default: 0,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

topicSchema.index({ subjectBelongsTo: 1, topicName: 1 });

// Add stats update method
topicSchema.methods.updateStats = async function () {
  const questions = await mongoose
    .model("Question")
    .find({ topicId: this._id });
  this.stats.totalQuestions = questions.length;
  this.stats.activeQuestions = questions.filter((q) => q.isActive).length;
  // Calculate average accuracy
  if (questions.length > 0) {
    this.stats.averageAccuracy =
      questions.reduce(
        (acc, q) => acc + q.stats.correctAttemp / (q.stats.totalAttemp || 1),
        0
      ) / questions.length;
  }
  await this.save();
};

export const Topic = mongoose.model("Topic", topicSchema);
