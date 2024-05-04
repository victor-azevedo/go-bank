import cors from "cors";
import express from "express";

const app = express();

app
  .use(cors())
  .use(express.json())

  .get("/health", (_req, res) => res.send("I'm healthy!!!"));

export function init() {
  return Promise.resolve(app);
}

export async function close() {}

export default app;
