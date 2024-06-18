import dotenv from "dotenv";
import express from "express";
import swaggerDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import colors from "colors";
import { connectDB } from "./config/db.js";
import cors from "cors";
import morgan from "morgan";
import { router } from "./route/auth.route.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import { userRouter } from "./route/user.route.js";
import { jobrouter } from "./route/job.route.js";
//Security Package
import helmet from "helmet";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";

dotenv.config();
connectDB();

//swagger api config
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Job portal app",
      description: "Node Express Job portal application",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis:['./route/*.js'],

};
const inspect = swaggerDoc(options)

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());

app.get("/", (req, res) => {
  res.send("Welcome to job portal app");
});
app.use("/api", router);
app.use("/api/user", userRouter);
app.use("/api/job", jobrouter);

//home Route
app.use("/api-doc",swaggerUI.serve,swaggerUI.setup(inspect))

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  console.log(
    `server is listenning on port ${process.env.PORT}`.bgMagenta.white
  );
});
