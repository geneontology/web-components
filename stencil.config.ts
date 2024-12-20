import { Config } from "@stencil/core";
import { sass } from "@stencil/sass";

/**
 * NOTE ABOUT STENCIL VERSION:
 * This project is pinned to @stencil/core version 4.10.0. This is because the next minor version
 * (4.11.0) made upgrades to the underlying Rollup infrastructure (https://github.com/ionic-team/stencil/pull/5274)
 * that are not compatible with our dependencies.
 *
 * Specifically, we use `cytoscape-dagre` (https://github.com/cytoscape/cytoscape.js-dagre), which
 * depends on `dagre` version 0.8.5 (https://github.com/dagrejs/dagre). This version of `dagre` uses
 * conditional requires of `lodash` (https://github.com/dagrejs/dagre/blob/v0.8.5/lib/lodash.js)
 * which are not compatible with ESM (https://github.com/rollup/rollup-plugin-commonjs/issues/424#issuecomment-559081023).
 * There are newer versions of `dagre` that might not suffer from the same issue, but
 * `cytoscape-dagre` doesn't seem to have a lot of interest in properly supporting ESM:
 * - https://github.com/cytoscape/cytoscape.js-dagre/issues/123
 * - https://github.com/cytoscape/cytoscape.js-dagre/issues/120
 * - https://github.com/cytoscape/cytoscape.js-dagre/issues/110
 */

export const config: Config = {
  namespace: "web-components",
  plugins: [sass()],
  outputTargets: [
    {
      type: "dist",
      esmLoaderPath: "../loader",
    },
    {
      type: "dist-custom-elements",
      customElementsExportBehavior: "auto-define-custom-elements",
      externalRuntime: false,
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
  testing: {
    browserHeadless: "new",
  },
  extras: {
    enableImportInjection: true,
  },
};
