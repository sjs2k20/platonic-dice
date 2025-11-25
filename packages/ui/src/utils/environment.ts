import { config } from "@config/app.config";

/**
 * Environment detection utilities
 */

/**
 * Check if running in production environment
 */
export const isProduction = (): boolean => {
  return import.meta.env.PROD;
};

/**
 * Check if running in development environment
 */
export const isDevelopment = (): boolean => {
  return import.meta.env.DEV;
};

/**
 * Check if running in test environment
 */
export const isTest = (): boolean => {
  return import.meta.env.MODE === "test";
};

/**
 * Get the current environment mode
 */
export const getEnvironment = (): string => {
  return import.meta.env.MODE;
};

/**
 * Get the appropriate base path for the current environment
 * - Production (GitHub Pages): configured production path
 * - Development/Test: configured development path
 */
export const getBasePath = (): string => {
  return isProduction()
    ? config.basePath.production
    : config.basePath.development;
};
