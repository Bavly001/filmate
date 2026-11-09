import React from 'react';
import { render, screen } from '@testing-library/react';
import { Providers } from './providers';
import { describe, it, expect } from 'vitest';

describe('Providers root wrapper', () => {
  it('renders children inside NextUI and Query providers', () => {
    render(
      <Providers>
        <div data-testid="child-element">Filmate Test Child</div>
      </Providers>
    );
    expect(screen.getByTestId('child-element')).toBeInTheDocument();
  });
});
