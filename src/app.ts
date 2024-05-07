import cors from "cors";
import express from "express";
import "express-async-errors";
import swaggerUi from "swagger-ui-express";
import { connectMongoDB, disconnectMongoDB } from "./databases/mongodb";
import { handleApplicationError } from "./middlewares/";
import { accountRouter, authRouter, transactionRouter } from "./routes/";
import swaggerOutput from "./swagger_output.json";

const app = express();

app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV == "development") app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerOutput));

app.get("/health", (_req, res) => res.send({ health: "I'm healthy!!!" }));

app.use("/auth", (req, res, next) => {
  try {
    authRouter(req, res, next);
  } catch (next) {}
});

app.use("/account", (req, res, next) => {
  try {
    accountRouter(req, res, next);
  } catch (next) {}
});

app.use("/transaction", (req, res, next) => {
  try {
    transactionRouter(req, res, next);
  } catch (next) {}
});

app.use(handleApplicationError);

export async function init() {
  await connectMongoDB();
  return Promise.resolve(app);
}

export async function close() {
  await disconnectMongoDB();
}

export default app;
