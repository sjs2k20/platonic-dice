import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { NavBar } from "@components/Layout/Header/NavBar";

describe("NavBar", () => {
  it("renders navigation links from routes config", () => {
    const { container } = render(<NavBar />, { wrapper: MemoryRouter });
    
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /die demo/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /core explorer/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it("accepts custom items via props", () => {
    const customItems = [
      { to: '/custom1', label: 'Custom Link 1' },
      { to: '/custom2', label: 'Custom Link 2' },
    ];
    
    const { container } = render(<NavBar items={customItems} />, { wrapper: MemoryRouter });
    
    expect(screen.getByRole('link', { name: 'Custom Link 1' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Custom Link 2' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /home/i })).not.toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it("renders hamburger menu toggle button", () => {
    const { container } = render(<NavBar />, { wrapper: MemoryRouter });
    
    const toggleButton = screen.getByRole('button', { name: /toggle navigation menu/i });
    expect(toggleButton).toBeInTheDocument();
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    expect(container).toMatchSnapshot();
  });

  it("toggles menu state when hamburger is clicked", () => {
    const { container } = render(<NavBar />, { wrapper: MemoryRouter });
    
    const toggleButton = screen.getByRole('button', { name: /toggle navigation menu/i });
    
    // Initially closed
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    
    // Click to open
    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
    
    // Click to close
    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    expect(container).toMatchSnapshot();
  });

  it("closes menu when a link is clicked", () => {
    const { container } = render(<NavBar />, { wrapper: MemoryRouter });
    
    const toggleButton = screen.getByRole('button', { name: /toggle navigation menu/i });
    
    // Open menu
    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
    
    // Click a link
    const homeLink = screen.getByRole('link', { name: /home/i });
    fireEvent.click(homeLink);
    
    // Menu should close
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    expect(container).toMatchSnapshot();
  });
});
