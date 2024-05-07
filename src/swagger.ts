import swaggerAutogen from "swagger-autogen";
import { loadEnv } from "./config";

loadEnv();

const doc = {
  info: {
    version: "v1.0.0",
    title: "Go Bank API",
    description: "Simule account transactions of a digital bank",
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT || 4000}`,
      description: "",
    },
  ],
  paths: {},
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "Bearer",
      },
    },
  },
};

const outputFile = "./swagger_output.json";
const endpointsFiles = [
  "./src/app.ts",
  "src/routes/account-router.ts",
  "src/routes/authentication-router.ts",
  "src/routes/transaction-router.ts",
];

const options = {
  openapi: "3.0.0",
  // language:         //<string>,     Change response language.                      By default is 'en-US'
  // disableLogs:      //<boolean>,    Enable/Disable logs.                           By default is false
  autoHeaders: false, //<boolean>,    Enable/Disable automatic headers recognition.  By default is true
  autoQuery: false, //<boolean>,    Enable/Disable automatic query recognition.    By default is true
  autoBody: false, //<boolean>,    Enable/Disable automatic body recognition.     By default is true
  writeOutputFile: true, //<boolean>     Enable/Disable writing the output file.        By default is true
};
swaggerAutogen(options)(outputFile, endpointsFiles, doc);
