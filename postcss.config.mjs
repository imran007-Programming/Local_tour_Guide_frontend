import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const config = {
  plugins: {
    // Resolve `@import "tailwindcss"` from this project, not from whatever
    // directory the dev server happened to be launched in.
    "@tailwindcss/postcss": { base: dirname(fileURLToPath(import.meta.url)) },
  },
};

export default config;
