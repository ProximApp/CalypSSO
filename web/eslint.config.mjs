import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  // eslint-config-next sets `settings.react.version: "detect"`, which makes
  // eslint-plugin-react call the removed `context.getFilename()` API under
  // ESLint 10. Pin an explicit version to bypass that code path.
  {
    settings: {
      react: {
        version: "19.2.8",
      },
    },
  },
  prettier,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "package/**",
    "src/components/ui/**",
    "src/api/**",
  ]),
]);
