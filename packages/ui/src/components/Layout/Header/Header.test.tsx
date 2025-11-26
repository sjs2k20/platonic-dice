import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Header } from "@components/Layout/Header/Header";

describe("Header", () => {
  it("renders branding elements", () => {
    const { container } = render(<Header />, { wrapper: MemoryRouter });
    
    expect(screen.getByRole('img', { name: /Platonic Dice logo/i })).toBeInTheDocument();
    expect(screen.getByText("Platonic Dice")).toBeInTheDocument();
    expect(screen.getByText(/v0.1.0 - PREVIEW/i)).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it("renders navigation bar", () => {
    const { container } = render(<Header />, { wrapper: MemoryRouter });
    
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
