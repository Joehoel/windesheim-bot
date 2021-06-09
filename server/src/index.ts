import cookieParser from "cookie-parser";
import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import { join } from "path/posix";
import { errorHandler } from "./middleware/errorHandler";
import { notFound } from "./middleware/notFound";
import trim from "./middleware/trim";
import routes from "./routes";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());

app.use(trim);

app.use("/", express.static(join(__dirname, "../public")));

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: true,
    });
    console.log("Database connected!");
  } catch (error) {
    console.error(error);
  }

  console.log(`Listening at http://localhost:${PORT}`);
});
