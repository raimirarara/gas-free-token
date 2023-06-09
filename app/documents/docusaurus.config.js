// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github")
const darkCodeTheme = require("prism-react-renderer/themes/dracula")

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Gas-Free Token",
  tagline: "Manage your tokens, gas-free and hassle-free.",
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: "https://raimirarara.github.io/",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "raimirarara", // Usually your GitHub org/user name.
  projectName: "gas-free-token", // Usually your repo name.

  trailingSlash: false,

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl: "https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
        },
        // blog: {
        //   showReadingTime: true,
        //   // Please change this to your repo.
        //   // Remove this to remove the "edit this page" links.
        //   editUrl: "https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
        // },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: "img/img/gas-free-token_logo.png",
      navbar: {
        title: "Gas-Free Token",
        logo: {
          alt: "Gas-Free Token Logo",
          src: "img/gas-free-token_logo.png",
        },
        items: [
          {
            label: "Overview",
            to: "/docs/intro",
          },
          {
            label: "Tutorial",
            to: "/docs/category/tutorial",
          },
          {
            label: "Get Started",
            to: "/docs/category/get-started",
          },
          {
            label: "API",
            to: "/docs/category/api",
          },

          {
            href: "https://github.com/raimirarara/gas-free-token",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Docs",
            items: [
              {
                label: "Overview",
                to: "/docs/intro",
              },
              {
                label: "Tutorial",
                to: "/docs/category/tutorial",
              },
              {
                label: "Get Started",
                to: "/docs/category/get-started",
              },
              {
                label: "API",
                to: "/docs/category/api",
              },
            ],
          },

          {
            title: "More",
            items: [
              {
                label: "GitHub",
                href: "https://github.com/raimirarara/gas-free-token",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} GasFreeToken.Inc`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
}

module.exports = config
