import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AppRouter } from "@router/AppRouter";

const createWrapper = (initialEntries = ['/']) => {
  return ({ children }: { children: React.ReactNode }) => (
    <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
  );
};

describe("App", () => {
  it("renders without crashing", () => {
    const { container } = render(<AppRouter />, { wrapper: createWrapper(['/']) });
    expect(document.body).toBeTruthy();
    expect(container).toMatchSnapshot();
  });

  it("renders navigation", () => {
    const { container } = render(<AppRouter />, { wrapper: createWrapper(['/']) });
    expect(screen.getAllByText("Platonic Dice").length).toBeGreaterThan(0);
    expect(container).toMatchSnapshot();
  });

  it("renders home page by default", () => {
    const { container } = render(<AppRouter />, { wrapper: createWrapper(['/']) });
    expect(screen.getByText(/Interactive showcase/i)).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
