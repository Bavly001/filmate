import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { MateQuestionnaire } from './MateQuestionnaire';
import { useMateStore } from '@/store/useMateStore';

describe('MateQuestionnaire Component', () => {
  beforeEach(() => {
    useMateStore.getState().resetQuiz();
  });

  it('renders greeting and mood choice pills without any text inputs', () => {
    render(<MateQuestionnaire />);
    expect(screen.getByText(/Hi mate! I'm your mate/i)).toBeInTheDocument();
    expect(screen.queryByRole('textbox')).toBeNull(); // Strictly NO typing inputs
    expect(screen.getByText(/High Adrenaline/i)).toBeInTheDocument();
  });

  it('toggles mood pill selection on click', () => {
    render(<MateQuestionnaire />);
    const pill = screen.getByText(/High Adrenaline/i);
    fireEvent.click(pill);
    expect(useMateStore.getState().preferences.moods).toContain('Action');
  });

  it('allows selecting viewing company and enforces age rule', () => {
    render(<MateQuestionnaire />);
    const familyBtn = screen.getByText(/Family & Kids/i);
    fireEvent.click(familyBtn);
    expect(useMateStore.getState().preferences.company).toBe('family');
    expect(useMateStore.getState().preferences.ageRating).toBe('All Ages');
  });
});
