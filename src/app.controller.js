import connectToMongoDB from "./db/db.connection.js";
import express from "express";
import handleError from "./utils/error/error_handler.js";
import { CustomError } from "./utils/custom/custom_error_class.js";
import authRouter from "./modules/auth/auth.controller.js";
import userRouter from "./modules/user/user.controller.js";
import path from "node:path";
import * as dotenv from "dotenv";
import noteRouter from "./modules/note/note.controller.js";

async function bootstrap() {
  // configure dotenv file
  dotenv.config({ path: path.resolve("./src/config/.env.dev") });
  const app = express();
  const port = process.env.PORT;
  const dbConnectionResult = await connectToMongoDB();

  app.listen(port, (error) => {
    if (error) {
      console.error({ error });
    } else {
      console.warn(`Server is Running on Port ${port}`);
    }
  });

  if (!dbConnectionResult) {
    app.all("{/*d}", (req, res, next) => {
      next(
        new CustomError("Something went wrong please try again later ⛔️", 500)
      );
    });
  } else {
    app.use(express.json());
    app.use("/auth", authRouter);
    app.use("/user", userRouter);
    app.use("/note", noteRouter);
    app.all("{/*d}", (req, res, next) => {
      next(
        new CustomError(`Wrong URL ${req.url} or METHOD ${req.method} ❌`, 404)
      );
    });
  }
  app.use(handleError);
}

export default bootstrap;
