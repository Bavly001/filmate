import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { MateDrawer } from './MateDrawer';
import { useMateStore } from '@/store/useMateStore';

describe('MateDrawer Component (Messenger Popup Chat)', () => {
  beforeEach(() => {
    useMateStore.getState().resetChat();
    useMateStore.getState().closeDrawer();
  });

  it('does not render when isDrawerOpen is false', () => {
    render(<MateDrawer />);
    expect(screen.queryByTestId('mate-messenger-popup')).toBeNull();
  });

  it('renders messenger popup when isDrawerOpen is true', () => {
    useMateStore.getState().openDrawer();
    render(<MateDrawer />);
    expect(screen.getByTestId('mate-messenger-popup')).toBeInTheDocument();
    expect(screen.getByText(/Film.*Mate/i)).toBeInTheDocument();
  });

  it('closes popup when close button is clicked', () => {
    useMateStore.getState().openDrawer();
    render(<MateDrawer />);
    const closeBtn = screen.getByLabelText(/Close Mate Chat/i);
    fireEvent.click(closeBtn);
    expect(useMateStore.getState().isDrawerOpen).toBe(false);
  });
});
