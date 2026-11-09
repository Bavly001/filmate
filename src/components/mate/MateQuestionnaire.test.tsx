import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MateQuestionnaire } from './MateQuestionnaire';
import { useMateStore } from '@/store/useMateStore';

describe('MateQuestionnaire Step-by-Step Chat Component', () => {
  beforeEach(() => {
    useMateStore.getState().resetQuiz();
  });

  it('renders greeting and Question 1 (Moods) without any text inputs', () => {
    render(<MateQuestionnaire />);
    expect(screen.getByText(/Hi mate! I'm your mate/i)).toBeInTheDocument();
    expect(screen.queryByRole('textbox')).toBeNull(); // Strictly zero typing
    expect(screen.getByText(/High Adrenaline/i)).toBeInTheDocument();
    // Subsequent questions should NOT be visible yet
    expect(screen.queryByText(/Who are you watching with/i)).toBeNull();
  });

  it('allows selecting mood and advancing to Question 2 (Company)', () => {
    render(<MateQuestionnaire />);
    const moodPill = screen.getByText(/High Adrenaline/i);
    fireEvent.click(moodPill);
    expect(useMateStore.getState().preferences.moods).toContain('Action');

    // Click continue to advance to question 2
    const nextBtn = screen.getByRole('button', { name: /continue/i });
    fireEvent.click(nextBtn);

    // Question 2 should now appear in chat
    expect(screen.getByText(/Who are you watching with/i)).toBeInTheDocument();
    expect(screen.getByText(/Family & Kids/i)).toBeInTheDocument();
  });

  it('advances through the full chat question-by-question to analysis', async () => {
    const startAnalysisSpy = vi.fn();
    useMateStore.setState({ startAnalysis: startAnalysisSpy });

    render(<MateQuestionnaire />);

    // Q1: Mood
    fireEvent.click(screen.getByText(/Need a Good Laugh/i));
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));

    // Q2: Company
    fireEvent.click(screen.getByText(/With Partner \/ Date/i));

    // Q3: Venue
    expect(screen.getByText(/Where would you like to watch/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/At Home \(Streaming\)/i));

    // Q4: Age Rating
    expect(screen.getByText(/what age rating/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/18\+ \(Mature/i));

    // Should trigger analysis
    expect(startAnalysisSpy).toHaveBeenCalled();
  });
});
