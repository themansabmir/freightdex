// src/constants/env.ts
const env = import.meta.env.VITE_NODE_ENV as string;

export enum NODE_ENV {
  LOCAL = "local",
  TEST = "test",
  PREPROD = "preprod",
  PROD = "prod",
}

const envEnum = {
  [NODE_ENV.LOCAL]: import.meta.env.VITE_LOCAL,
  [NODE_ENV.TEST]: import.meta.env.VITE_TEST,
  [NODE_ENV.PREPROD]: import.meta.env.VITE_PREPROD,
  [NODE_ENV.PROD]: import.meta.env.VITE_PROD,
};

type EnvKey = keyof typeof envEnum;

function getBaseUrl(): string {
  console.log(env)

  if (!env || !(env in envEnum)) {
    throw new Error(
      `[getBaseUrl] Invalid VITE_NODE_ENV: '${env}'. Must be one of: ${Object.keys(
        envEnum
      ).join(", ")}`
    );
  }

  return envEnum[env as EnvKey];
}

const base_url = getBaseUrl();

export const constants = {
    TOKEN: "TOKEN",
    BASE_URL: base_url,
    ACTIVE_ENV: env
};


