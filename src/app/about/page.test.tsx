import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AboutPage from './page';

describe('About Us Page', () => {
  it('renders the luxury About Filmate heading and brand mission', () => {
    render(<AboutPage />);
    expect(screen.getByRole('heading', { name: /about filmate/i })).toBeInTheDocument();
    expect(screen.getByText(/Modern Luxury Cinematic Platform/i)).toBeInTheDocument();
  });

  it('renders core pillars and technology highlights', () => {
    render(<AboutPage />);
    expect(screen.getByText(/bespoke curation/i)).toBeInTheDocument();
    expect(screen.getByText(/live premiere feeds/i)).toBeInTheDocument();
    expect(screen.getByText(/mate cinema ai/i)).toBeInTheDocument();
  });
});
