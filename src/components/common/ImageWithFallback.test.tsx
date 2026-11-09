import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ImageWithFallback } from './ImageWithFallback';

describe('ImageWithFallback Component', () => {
  it('renders standard img when valid src is provided', () => {
    render(<ImageWithFallback src="https://example.com/poster.jpg" alt="Dune" />);
    const img = screen.getByRole('img', { name: /dune/i });
    expect(img).toBeInTheDocument();
  });

  it('swaps to placeholder when image triggers onError', () => {
    render(<ImageWithFallback src="https://example.com/broken.jpg" alt="Inception" fallbackTitle="Inception" />);
    const img = screen.getByRole('img', { name: /inception/i });
    fireEvent.error(img);
    expect(screen.getByTestId('image-fallback')).toBeInTheDocument();
    expect(screen.getByText('Inception')).toBeInTheDocument();
  });

  it('renders placeholder immediately when src is empty or undefined', () => {
    render(<ImageWithFallback src="" alt="Unknown Movie" fallbackTitle="Mystery Movie" />);
    expect(screen.getByTestId('image-fallback')).toBeInTheDocument();
    expect(screen.getByText('Mystery Movie')).toBeInTheDocument();
  });
});
