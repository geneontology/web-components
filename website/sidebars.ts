import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  docs: [
    {
      type: "category",
      label: "Getting Started",
      collapsed: false,
      items: ["getting-started/install", "getting-started/customizing"],
    },
    {
      type: "category",
      label: "Components",
      collapsed: false,
      items: [
        {
          type: "category",
          label: "GO-CAM Viewer",
          collapsed: true,
          link: {
            type: "generated-index",
            description:
              "The GO-CAM Viewer is a web component for displaying and interacting with GO-CAM models. It allows users to visualize activities and their relationships in a pathway format.",
          },
          items: [
            "components/gocam-viewer/readme",
            "components/gocam-viewer-legend/readme",
          ],
        },
        {
          type: "category",
          label: "GO Annotation Ribbon",
          collapsed: true,
          link: {
            type: "generated-index",
            description:
              "The GO Annotation Ribbon is a web component that displays GO annotations in a ribbon format, providing a visual summary of gene products and their associated GO terms.",
          },
          items: [
            "components/annotation-ribbon/readme",
            "components/annotation-ribbon-strips/readme",
            "components/annotation-ribbon-table/readme",
          ],
        },
      ],
    },
    {
      type: "category",
      label: "Upgrade Guides",
      collapsed: false,
      items: ["upgrade-guides/upgrade-to-v1"],
    },
  ],
};

export default sidebars;
