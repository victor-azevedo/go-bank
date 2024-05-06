import { loadEnv } from "./envs-config";

loadEnv();

export const mongodbConfig = {
  connection: {
    url: getConnectionUrlOrThrow(),
  },
};

function getConnectionUrlOrThrow(): string {
  if (!process.env.MONGODB_URL) throw new Error("MONGODB_URL not provided");
  return process.env.MONGODB_URL;
}
