import app, { init } from "./app";
import { loadEnv } from "./config/envs";

loadEnv();

const port = process.env.PORT || 4000;

init().then(() => {
  app.listen(port, () => {
    console.log(`Server is listening on port ${port}.`);
  });
});
