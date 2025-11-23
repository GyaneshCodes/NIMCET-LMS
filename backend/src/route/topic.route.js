import { Router } from "express";
import { getAllTopics, getTopicsBySubject } from "../controller/topic.controller.js";

const router = Router();

router.route("/").get(getAllTopics);
router.route("/subject/:subject").get(getTopicsBySubject);

export default router;
