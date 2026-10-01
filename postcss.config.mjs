const config = {
  plugins: {
    // Scan for classes from the project root. Don't derive this from
    // import.meta.url: Turbopack bundles this file into .next/, so that would
    // point Tailwind at the build folder and no utility classes get generated.
    "@tailwindcss/postcss": { base: process.cwd() },
  },
};

export default config;
