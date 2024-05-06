import "express-async-errors";
import cors from "cors";
import express from "express";
import { accountRouter, authRouter, transactionRouter } from "./routes/";
import { handleApplicationError } from "./middlewares/";
import { connectMongoDB, disconnectMongoDB } from "./databases/mongodb";

const app = express();

app
  .use(cors())
  .use(express.json())

  .get("/health", (_req, res) => res.send("I'm healthy!!!"));

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
