import connectToMongoDB from "./db/db.connection.js";
import express from "express";
import handleError from "./utils/error/error_handler.js";
import { CustomError } from "./utils/custom/custom_error_class.js";

async function bootstrap() {
  const app = express();
  const port = 3000;
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
    app.all("{/*d}", (req, res, next) => {
      next(
        new CustomError(`Wrong URL ${req.url} or METHOD ${req.method} ❌`, 404)
      );
    });
  }
  app.use(handleError);
}

export default bootstrap;
