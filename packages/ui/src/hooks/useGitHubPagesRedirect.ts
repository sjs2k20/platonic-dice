import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isProduction } from "@utils/environment";
import { config } from "@config/app.config";

/**
 * Hook to handle GitHub Pages redirects from 404.html
 *
 * When a user refreshes on a route like /platonic-dice/die, GitHub Pages
 * serves 404.html which stores the intended path and redirects to index.html.
 * This hook reads that stored path and navigates to it.
 *
 * Only runs in production (GitHub Pages deployment).
 */
export const useGitHubPagesRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Only handle redirects in production (GitHub Pages)
    if (!isProduction()) return;

    const redirect = sessionStorage.getItem("redirect");
    if (redirect) {
      sessionStorage.removeItem("redirect");
      // Remove the basename from the stored path
      const path = redirect.replace(config.basePath.production, "");
      navigate(path || "/", { replace: true });
    }
  }, [navigate]);
};
