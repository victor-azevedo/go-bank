import dotenv from "dotenv";

const envFileMap = {
  test: ".env.test",
  development: ".env.development",
  env: ".env",
};

type EnvFileMapKeys = keyof typeof envFileMap;

const env = process.env.NODE_ENV;

export function loadEnv() {
  const defaultEnvFile = ".env";

  const path = envFileMap.hasOwnProperty(env as EnvFileMapKeys) ? envFileMap[env as EnvFileMapKeys] : defaultEnvFile;

  dotenv.config({ path, override: true });

  // eslint-disable-next-line no-console
  console.log(`Loaded env: "${path}"`);
}
