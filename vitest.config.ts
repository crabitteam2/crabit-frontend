import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: "node",
          include: ["src/**/*.test.{ts,mts,mjs}"],
          environment: "node",
        },
      },
      {
        plugins: [react()],
        resolve: { tsconfigPaths: true },
        test: {
          name: "ui",
          include: ["src/**/*.test.tsx"],
          environment: "jsdom",
          setupFiles: ["./vitest.setup.ts"],
        },
      },
    ],
  },
});
