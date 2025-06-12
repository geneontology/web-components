import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import { version } from "./package.json";
import { createMDXFallbackPlugin } from "@docusaurus/core/lib/server/plugins/synthetic";

const config: Config = {
  title: "GO Web Components",
  tagline: "Easily integrate GO data into your web application",
  favicon: "img/favicon.ico",
  url: "https://geneontology.github.io",
  baseUrl: "/web-components/",
  trailingSlash: false,

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "throw",

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: "img/go-log-large.png",
    colorMode: {
      // TODO: come up with a dark mode color palette
      defaultMode: "light",
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    announcementBar: {
      content:
        "This package is an experimental prototype. Do not use in production.See <a href='https://github.com/geneontology/go-technical-announcements' target='_blank' rel='noopener noreferrer'>go-technical-annoucements</a> to get updates on the status of this package.",
      backgroundColor: "orange",
      isCloseable: false,
    },
    navbar: {
      title: "GO Web Components",
      logo: {
        alt: "GO Logo",
        src: "img/go-logo-icon.png",
      },
      items: [
        {
          type: "doc",
          position: "left",
          docId: "getting-started/install",
          label: "Docs",
        },
        {
          position: "left",
          label: "Showcase",
          to: "/showcase",
        },
        {
          type: "html",
          position: "right",
          value: `Version: ${version}`,
        },
        {
          href: "https://github.com/geneontology/web-components",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "GO Web Components",
          items: [
            {
              label: "Home",
              to: "/",
            },
            {
              label: "Docs",
              to: "/docs/getting-started/install",
            },
          ],
        },
        {
          title: "Gene Ontology",
          items: [
            {
              label: "Home",
              href: "https://geneontology.org/",
            },
            {
              label: "Contact Us",
              href: "https://help.geneontology.org/",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/facebook/docusaurus",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} The Gene Ontology Consortium.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
