/**
 * Application configuration
 */

export const config = {
  /**
   * Base path for the application
   * Used for GitHub Pages deployment
   */
  basePath: {
    production: "/platonic-dice",
    development: "/",
  },

  /**
   * GitHub repository information
   */
  repository: {
    owner: "sjs2k20",
    name: "platonic-dice",
    url: "https://github.com/sjs2k20/platonic-dice",
  },

  /**
   * Application metadata
   */
  app: {
    name: "Platonic Dice",
    version: "0.1.0",
    description: "Interactive showcase for the platonic-dice packages",
  },
} as const;
