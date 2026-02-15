import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "@components/Layout/Footer/Footer";

describe("Footer", () => {
  it("renders copyright text", () => {
    const { container } = render(<Footer />);
    
    // accept any 4-digit year to avoid yearly snapshot churn
    expect(screen.getByText(/© \d{4} Platonic Dice/i)).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it("renders GitHub link with correct attributes", () => {
    const { container } = render(<Footer />);
    
    const githubLink = screen.getByRole('link', { name: /github/i });
    expect(githubLink).toHaveAttribute('href', 'https://github.com/sjs2k20/platonic-dice');
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
    expect(container).toMatchSnapshot();
  });
});
