import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Layout } from "@components/Layout/Layout";

describe("Layout", () => {
  it("renders header, main content area, and footer", () => {
    const { container } = render(<Layout />, { wrapper: MemoryRouter });
    
    // Header with branding should be present
    expect(screen.getByText("Platonic Dice")).toBeInTheDocument();
    
    // Footer should be present (accept any 4-digit year to avoid yearly churn)
    expect(screen.getByText(/© \d{4} Platonic Dice/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /github/i })).toHaveAttribute(
      'href',
      'https://github.com/sjs2k20/platonic-dice'
    );
    expect(container).toMatchSnapshot();
  });

  it("renders navigation links", () => {
    const { container } = render(<Layout />, { wrapper: MemoryRouter });
    
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /die demo/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /core explorer/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
