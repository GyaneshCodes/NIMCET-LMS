import cron from "node-cron";
import { Topic } from "../model/Topic.model.js";

// Run every day at midnight
cron.schedule("0 0 * * *", async () => {
  try {
    const topics = await Topic.find({});
    for (const topic of topics) {
      await topic.updateStats();
    }
    console.log("Topic stats updated successfully");
  } catch (error) {
    console.error("Error updating topic stats:", error);
  }
});
