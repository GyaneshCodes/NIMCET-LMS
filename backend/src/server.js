import connectDB from "./DB/config.js";
import { app } from "./app.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000;
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running at Port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("DataBase Connection FAILED!!", error);
  });
