import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ContactPage from './page';

describe('Contact Us Page', () => {
  it('renders concierge inquiry form and contact channels', () => {
    render(<ContactPage />);
    expect(screen.getByRole('heading', { name: /contact concierge/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/your full name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/your email address/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/write your inquiry/i)).toBeInTheDocument();
  });

  it('submits message and shows success confirmation', () => {
    render(<ContactPage />);
    fireEvent.change(screen.getByPlaceholderText(/your full name/i), {
      target: { value: 'Bavly' },
    });
    fireEvent.change(screen.getByPlaceholderText(/your email address/i), {
      target: { value: 'bavly@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/write your inquiry/i), {
      target: { value: 'Inquiring about premium cinema IMAX integrations.' },
    });

    const submitBtn = screen.getByRole('button', { name: /send message/i });
    fireEvent.click(submitBtn);

    expect(screen.getByText(/message received/i)).toBeInTheDocument();
  });
});
