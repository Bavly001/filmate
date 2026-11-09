import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Navbar } from './Navbar';
import { useMateStore } from '@/store/useMateStore';

describe('Luxury Navbar Component', () => {
  beforeEach(() => {
    useMateStore.getState().resetQuiz();
    useMateStore.getState().closeDrawer();
    window.scrollY = 0;
  });

  it('renders brand crest logo and FILMATE typography', () => {
    render(<Navbar />);
    expect(screen.getByLabelText('FILMATE')).toBeInTheDocument();
    expect(screen.getByTestId('brand-crest')).toBeInTheDocument();
  });

  it('renders required navigation links: Discover, Movies, Trending, Top Rated, About Us, Contact Us', () => {
    render(<Navbar />);
    expect(screen.getAllByRole('link', { name: /discover/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /^movies$/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /trending/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /top rated/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /about us/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /contact us/i }).length).toBeGreaterThan(0);
  });

  it('strictly contains NO search bar and NO trailers tab in header', () => {
    render(<Navbar />);
    expect(screen.queryByPlaceholderText(/search/i)).toBeNull();
    expect(screen.queryByRole('textbox')).toBeNull();
    expect(screen.queryByRole('link', { name: /trailers/i })).toBeNull();
  });

  it('transitions from transparent to frosted glassmorphism on scroll', () => {
    const { container } = render(<Navbar />);
    const header = container.querySelector('header');
    expect(header).toBeInTheDocument();
    expect(header?.className).toContain('bg-transparent');

    act(() => {
      window.scrollY = 80;
      fireEvent.scroll(window);
    });

    expect(header?.className).toContain('backdrop-blur-md');
    expect(header?.className).toContain('bg-[#0B0D13]/85');
  });

  it('triggers mate side messenger when Talk to Mate button is clicked', () => {
    render(<Navbar />);
    const btn = screen.getByRole('button', { name: /talk to mate/i });
    fireEvent.click(btn);
    expect(useMateStore.getState().isDrawerOpen).toBe(true);
  });

  it('toggles mobile drawer menu with touch-friendly links', () => {
    render(<Navbar />);
    const menuBtn = screen.getByLabelText(/Toggle mobile navigation/i);
    fireEvent.click(menuBtn);
    expect(screen.getByTestId('mobile-nav-menu')).toBeInTheDocument();
    fireEvent.click(menuBtn);
    expect(screen.queryByTestId('mobile-nav-menu')).toBeNull();
  });
});
