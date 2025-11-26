import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Home } from "@pages/Home/Home";

describe("Home", () => {
  it("renders page title", () => {
    const { container } = render(<Home />);
    
    expect(screen.getByRole('heading', { name: /Platonic Dice/i })).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it("renders page description", () => {
    const { container } = render(<Home />);
    
    expect(screen.getByText(/Interactive showcase for the platonic-dice packages/i)).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it("renders info section", () => {
    const { container } = render(<Home />);
    
    expect(screen.getByText(/Explore the full capabilities/i)).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
