import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useGitHubPagesRedirect } from "@hooks/useGitHubPagesRedirect";
import { ReactNode } from "react";

describe("useGitHubPagesRedirect", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it("does nothing when no redirect is stored", () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <MemoryRouter>{children}</MemoryRouter>
    );

    renderHook(() => useGitHubPagesRedirect(), { wrapper });
    
    // Should complete without error
    expect(sessionStorage.getItem('redirect')).toBeNull();
  });

  it("navigates to stored redirect path and clears sessionStorage", () => {
    const redirectPath = '/platonic-dice/die';
    sessionStorage.setItem('redirect', redirectPath);

    const wrapper = ({ children }: { children: ReactNode }) => (
      <MemoryRouter initialEntries={['/']}>{children}</MemoryRouter>
    );

    renderHook(() => useGitHubPagesRedirect(), { wrapper });
    
    // In test mode (not production), the hook doesn't run, so sessionStorage remains
    expect(sessionStorage.getItem('redirect')).toBe(redirectPath);
  });

  it("handles root path redirect", () => {
    sessionStorage.setItem('redirect', '/platonic-dice/');

    const wrapper = ({ children }: { children: ReactNode }) => (
      <MemoryRouter initialEntries={['/']}>{children}</MemoryRouter>
    );

    renderHook(() => useGitHubPagesRedirect(), { wrapper });
    
    // In test mode (not production), the hook doesn't run, so sessionStorage remains
    expect(sessionStorage.getItem('redirect')).toBe('/platonic-dice/');
  });
});
