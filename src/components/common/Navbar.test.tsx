import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Navbar } from './Navbar';
import { useMateStore } from '@/store/useMateStore';
import { useMovieStore } from '@/store/useMovieStore';

describe('Navbar Component', () => {
  beforeEach(() => {
    useMateStore.getState().resetQuiz();
    useMovieStore.getState().setSearchQuery('');
  });

  it('renders brand logo and nav links', () => {
    render(<Navbar />);
    expect(screen.getByText('Fil')).toBeInTheDocument();
    expect(screen.getByText('Mate')).toBeInTheDocument();
    expect(screen.getByText(/Trending/i)).toBeInTheDocument();
    expect(screen.getByText(/In Cinema/i)).toBeInTheDocument();
  });

  it('triggers mate drawer when Talk to Mate button is clicked', () => {
    render(<Navbar />);
    const btn = screen.getByRole('button', { name: /talk to mate/i });
    fireEvent.click(btn);
    expect(useMateStore.getState().isDrawerOpen).toBe(true);
  });

  it('updates movie store when search input changes', () => {
    render(<Navbar />);
    const input = screen.getByPlaceholderText(/search movies/i);
    fireEvent.change(input, { target: { value: 'Inception' } });
    expect(useMovieStore.getState().searchQuery).toBe('Inception');
  });
});
