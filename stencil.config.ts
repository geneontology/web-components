import { Config } from "@stencil/core";
import { sass } from "@stencil/sass";

export const config: Config = {
  namespace: "web-components",
  plugins: [sass()],
  buildEs5: "prod",
  outputTargets: [
    {
      type: "dist",
      esmLoaderPath: "../loader",
    },
    {
      type: "dist-custom-elements",
      customElementsExportBehavior: "auto-define-custom-elements",
      externalRuntime: false,
      generateTypeDeclarations: true,
    },
    {
      type: "docs-readme",
    },
    {
      type: "www",
      serviceWorker: null, // disable service workers
      copy: [{ src: "**/*.html" }, { src: "*.css" }],
    },
  ],
  extras: {
    enableImportInjection: true,
  },
};
