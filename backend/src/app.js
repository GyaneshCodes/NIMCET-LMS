import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
// import "./utils/cronJobs.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // Allow frontend origin
    credentials: true,
  })
);

// middleware
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// route
import questionRoute from "./route/question.route.js";
import userRouter from "./route/user.route.js";
import topicRouter from "./route/topic.route.js";
import analyticsRouter from "./route/analytics.route.js";

// Routes
app.use("/api/v1/auth/users", userRouter);
app.use("/api/v1/questions", questionRoute);
app.use("/api/v1/topics", topicRouter);
app.use("/api/v1/analytics", analyticsRouter);

export { app };
