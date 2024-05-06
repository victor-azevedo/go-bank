import { loadEnv } from "./envs-config";

loadEnv();

const DEFAULT_JWT_EXPIRE_IN = "180";

export const jwtConfig = {
  secretKey: getSecretOrThrow(),
  expireIn: process.env.JWT_EXPIRE_IN || DEFAULT_JWT_EXPIRE_IN,
};

function getSecretOrThrow(): string {
  if (!process.env.JWT_SECRET_KEY) throw new Error("JWT_SECRET_KEY not provided");
  return process.env.JWT_SECRET_KEY;
}
