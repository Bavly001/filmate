'use client';

import React, { useEffect } from 'react';
import { X, Bot, Sparkles, RotateCcw } from 'lucide-react';
import { useMateStore } from '@/store/useMateStore';
import { MateQuestionnaire } from './MateQuestionnaire';
import { MateAnalysisLoader } from './MateAnalysisLoader';
import { MateResultCard } from './MateResultCard';

export const MateDrawer: React.FC = () => {
  const { isDrawerOpen, closeDrawer, step, resetQuiz } = useMateStore();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        closeDrawer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen, closeDrawer]);

  if (!isDrawerOpen) return null;

  return (
    <div
      data-testid="mate-drawer"
      className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-200"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-dark-bg/80 backdrop-blur-md transition-opacity"
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-lg h-full bg-dark-surface/95 border-l border-sunset/30 shadow-2xl shadow-sunset/10 backdrop-blur-xl flex flex-col z-10 animate-in slide-in-from-right duration-300 overflow-hidden">
        {/* Top Header */}
        <div className="px-6 py-5 border-b border-gray-800/80 flex items-center justify-between bg-dark-bg/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sunset to-cyber flex items-center justify-center shadow-neon-sunset">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white tracking-wide">
                  FilMate Assistant
                </h3>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-sunset/20 text-sunset border border-sunset/30 uppercase tracking-wider">
                  AI Match
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Pick your vibe • Zero typing • Instant pick
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {step !== 'idle' && step !== 'analyzing' && (
              <button
                onClick={resetQuiz}
                title="Restart Quiz"
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800/80 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={closeDrawer}
              aria-label="Close Mate Drawer"
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800/80 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar">
          {step === 'analyzing' ? (
            <MateAnalysisLoader />
          ) : step === 'result' || step === 'exhausted' ? (
            <MateResultCard />
          ) : (
            <MateQuestionnaire />
          )}
        </div>

        {/* Footer Subtext */}
        <div className="px-6 py-3.5 border-t border-gray-900 bg-dark-bg/80 text-center">
          <p className="text-[11px] text-gray-400 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-sunset" />
            <span>Smart relaxation engine automatically finds alternate gems</span>
          </p>
        </div>
      </div>
    </div>
  );
};
