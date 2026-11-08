import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { MateDrawer } from './MateDrawer';
import { useMateStore } from '@/store/useMateStore';

describe('MateDrawer Component', () => {
  beforeEach(() => {
    useMateStore.getState().resetQuiz();
    useMateStore.getState().closeDrawer();
  });

  it('does not render when isDrawerOpen is false', () => {
    render(<MateDrawer />);
    expect(screen.queryByTestId('mate-drawer')).toBeNull();
  });

  it('renders drawer and questionnaire when isDrawerOpen is true', () => {
    useMateStore.getState().openDrawer();
    render(<MateDrawer />);
    expect(screen.getByTestId('mate-drawer')).toBeInTheDocument();
    expect(screen.getByText(/Hi mate! I'm your mate/i)).toBeInTheDocument();
  });

  it('closes drawer when close button is clicked', () => {
    useMateStore.getState().openDrawer();
    render(<MateDrawer />);
    const closeBtn = screen.getByLabelText(/Close Mate Drawer/i);
    fireEvent.click(closeBtn);
    expect(useMateStore.getState().isDrawerOpen).toBe(false);
  });

  it('renders analysis loader when step is analyzing', () => {
    useMateStore.getState().openDrawer();
    useMateStore.setState({ step: 'analyzing' });
    render(<MateDrawer />);
    expect(screen.getByText(/Analyzing Your Feelings/i)).toBeInTheDocument();
  });
});
