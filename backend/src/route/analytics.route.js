import { Router } from "express";
import {
  getUserAnalytics,
  getTopicAnalytics,
} from "../controller/analytics.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

// Apply authentication middleware to all analytics routes
router.use(verifyJWT);

router.route("/user/:userId").get(getUserAnalytics);
router.route("/topic/:userId/:topicId").get(getTopicAnalytics);

export default router;
