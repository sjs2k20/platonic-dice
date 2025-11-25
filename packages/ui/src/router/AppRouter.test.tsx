import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AppRouter } from "@router/AppRouter";
import { MemoryRouter } from "react-router-dom";

const createWrapper = (initialEntries: string[]) => {
  return ({ children }: { children: React.ReactNode }) => (
    <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
  );
};

describe("AppRouter", () => {
  it("renders home page at root path", () => {
    const { container } = render(<AppRouter />, { wrapper: createWrapper(['/']) });
    
    expect(screen.getByText(/Interactive showcase/i)).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it("renders 404 page for unknown routes", () => {
    const { container } = render(<AppRouter />, { wrapper: createWrapper(['/unknown-route']) });
    
    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByText("Page Not Found")).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it("renders all route pages correctly", () => {
    const routes = [
      { path: '/die', text: /Die Class Demo/i },
      { path: '/core', text: /Core Package Explorer/i },
      { path: '/about', text: /Documentation and information/i },
    ];

    routes.forEach(({ path, text }) => {
      const { container, unmount } = render(<AppRouter />, { wrapper: createWrapper([path]) });
      
      expect(screen.getByText(text)).toBeInTheDocument();
      expect(container).toMatchSnapshot();
      unmount();
    });
  });
});
