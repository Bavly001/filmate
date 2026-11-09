import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FloatingMateButton } from './FloatingMateButton';
import { MateDrawer } from './MateDrawer';
import { useMateStore } from '@/store/useMateStore';
import * as movieApi from '@/services/movieApi';

describe('AI Mate Side Messenger Popup Chat', () => {
  beforeEach(() => {
    useMateStore.getState().resetChat();
    useMateStore.getState().closeDrawer();
    vi.restoreAllMocks();
  });

  it('renders a compact floating orb button with gold styling', () => {
    render(<FloatingMateButton />);
    const btn = screen.getByRole('button', { name: /open mate assistant/i });
    expect(btn).toBeInTheDocument();
    // Compact orb size class (w-12 h-12 = 48px or w-11 h-11 = 44px)
    expect(btn.className).toContain('w-12');
    expect(btn.className).toContain('h-12');
  });

  it('opens side messenger popup window docked in bottom-right without blocking backdrop', () => {
    const { rerender } = render(<MateDrawer />);
    expect(screen.queryByTestId('mate-messenger-popup')).toBeNull();

    useMateStore.getState().openDrawer();
    rerender(<MateDrawer />);

    const popup = screen.getByTestId('mate-messenger-popup');
    expect(popup).toBeInTheDocument();
    expect(popup.className).toContain('bottom-');
    expect(popup.className).toContain('right-');
    // Ensure it does NOT have full-screen blocking classes like inset-0
    expect(popup.className).not.toContain('inset-0');
  });

  it('renders greeting message and quick vibe prompts without upcoming references', () => {
    useMateStore.getState().openDrawer();
    render(<MateDrawer />);

    expect(screen.getByText(/Film.*Mate/i)).toBeInTheDocument();
    expect(screen.getByText(/Blockbuster Action/i)).toBeInTheDocument();
    expect(screen.getByText(/Mind-Bending Sci-Fi/i)).toBeInTheDocument();
    // Strictly verify no upcoming chips exist
    expect(screen.queryByText(/upcoming/i)).toBeNull();
  });

  it('sends user message and receives a live movie recommendation from movieApi', async () => {
    const mockMovie = {
      id: 'tvm-123',
      title: 'Interstellar Odyssey',
      rating: 8.9,
      posterUrl: 'https://image.com/poster.jpg',
      genres: ['Sci-Fi', 'Adventure'],
      source: 'tvmaze' as const,
      synopsis: 'A journey through space and time.',
    };

    vi.spyOn(movieApi, 'fetchCatalogMovies').mockResolvedValueOnce([mockMovie]);

    useMateStore.getState().openDrawer();
    render(<MateDrawer />);

    const input = screen.getByPlaceholderText(/ask mate for a movie/i);
    const sendBtn = screen.getByRole('button', { name: /send message/i });

    fireEvent.change(input, { target: { value: 'Recommend a sci-fi movie' } });
    fireEvent.click(sendBtn);

    // User message bubble appears
    expect(screen.getByText('Recommend a sci-fi movie')).toBeInTheDocument();

    // Recommendation card appears after live API query
    await waitFor(() => {
      expect(screen.getByText('Interstellar Odyssey')).toBeInTheDocument();
    });
  });

  it('closes the messenger popup when close button is clicked', () => {
    useMateStore.getState().openDrawer();
    render(<MateDrawer />);

    const closeBtn = screen.getByRole('button', { name: /close mate chat/i });
    fireEvent.click(closeBtn);

    expect(useMateStore.getState().isDrawerOpen).toBe(false);
  });
});
