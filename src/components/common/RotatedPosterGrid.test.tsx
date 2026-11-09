import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { RotatedPosterGrid } from './RotatedPosterGrid';

describe('RotatedPosterGrid Component', () => {
  const samplePosters = [
    'https://images.unsplash.com/photo-1536440136628-849c177e76a1',
    'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c',
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba',
  ];

  it('renders rotated poster grid container with posters', () => {
    const { container } = render(<RotatedPosterGrid posters={samplePosters} />);
    const grid = container.querySelector('[data-testid="rotated-poster-grid"]');
    expect(grid).toBeInTheDocument();
  });
});
