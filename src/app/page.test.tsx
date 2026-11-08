import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import HomePage from './page';
import Providers from './providers';

describe('HomePage Integration', () => {
  it('renders header, hero, catalog sections and floating mate button', () => {
    render(
      <Providers>
        <HomePage />
      </Providers>
    );
    expect(screen.getAllByText('Fil').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Mate').length).toBeGreaterThan(0);
    expect(screen.getByText(/Now Showing & Featured Catalog/i)).toBeInTheDocument();
    expect(screen.getByTitle(/Open Mate Assistant/i)).toBeInTheDocument();
  });
});
