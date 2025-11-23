import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  getQuizQuestions,
  submitAnswer,
  getUserProgress,
  getQuestionsByTopic,
  getPerformanceAnalytics,
  getRecentAttempts,
} from "../controller/question.controller.js";

const router = Router();

// Protect all routes
router.use(verifyJWT);

router.get("/quiz/questions", getQuizQuestions);
router.post("/quiz/submit", submitAnswer);
router.get("/quiz/progress", getUserProgress);
router.get("/quiz/topic", getQuestionsByTopic);
router.get("/quiz/analytics", getPerformanceAnalytics);
router.get("/quiz/attempts/recent", getRecentAttempts);

export default router;
