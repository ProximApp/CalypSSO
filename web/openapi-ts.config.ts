import { defineConfig } from "@hey-api/openapi-ts";
import { clientFetch } from "@hey-api/openapi-ts/plugins";

export default defineConfig({
  input: `http://127.0.0.1:8000/openapi.json`,
  output: "src/api",
  plugins: [
    "@hey-api/typescript",
    "@hey-api/schemas",
    "@hey-api/sdk",
    clientFetch({
      client: true,
    }),
  ],
});
