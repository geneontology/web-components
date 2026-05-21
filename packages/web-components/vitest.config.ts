import { defineVitestConfig } from "@stencil/vitest/config";

export default defineVitestConfig({
  stencilConfig: "./stencil.config.ts",
  test: {
    // See: https://stenciljs.com/docs/testing-vitest-configuration#test-projects
    projects: [
      {
        // For testing pure functions and logic without DOM
        test: {
          name: "unit",
          include: ["src/**/*.unit.{ts,tsx}"],
          environment: "node",
        },
      },
      {
        // For testing components in a simulated DOM environment
        test: {
          name: "spec",
          include: ["src/**/*.spec.{ts,tsx}"],
          environment: "stencil",
          setupFiles: ["./vitest-setup.ts"],
        },
      },
    ],
  },
});
