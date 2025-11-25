import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AppRouter } from "@router/AppRouter";

const createWrapper = (initialEntries: string[]) => {
  return ({ children }: { children: React.ReactNode }) => (
    <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
  );
};

describe("NotFound", () => {
  it("renders 404 page for invalid routes", () => {
    const { container } = render(<AppRouter />, { wrapper: createWrapper(['/invalid-route']) });
    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByText("Page Not Found")).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it("shows link to return home", () => {
    const { container } = render(<AppRouter />, { wrapper: createWrapper(['/does-not-exist']) });
    const homeLink = screen.getByRole('link', { name: /return to home/i });
    expect(homeLink).toHaveAttribute('href', '/');
    expect(container).toMatchSnapshot();
  });
});
