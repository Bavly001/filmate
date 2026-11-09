'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Brain, Cpu, Film } from 'lucide-react';

export const MateAnalysisLoader: React.FC = () => {
  const steps = [
    'Scanning emotional state & feeling selections...',
    'Mapping emotions to movie genres & tone...',
    'Filtering age classifications & viewing company...',
    'Checking streaming catalogs & cinema screens...',
    'Synthesizing the perfect recommendation match...',
  ];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev + 1) % steps.length);
    }, 600);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="py-12 px-6 flex flex-col items-center justify-center text-center">
      {/* Animated Glowing Dual Rings */}
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 rounded-full border-4 border-sunset/20 border-t-sunset animate-spin" />
        <div className="absolute inset-2 rounded-full border-4 border-sunset/20 border-b-sunset animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <Brain className="w-8 h-8 text-sunset animate-pulse" />
        </div>
      </div>

      <h3 className="text-xl font-extrabold text-white mb-2 tracking-tight">
        Analyzing Your Feelings...
      </h3>

      <p className="text-sm text-sunset font-semibold tracking-wide min-h-[24px] transition-all duration-300">
        {steps[currentStepIndex]}
      </p>

      <div className="mt-8 flex items-center gap-2 text-xs text-gray-400">
        <Cpu className="w-3.5 h-3.5 text-sunset" />
        <span>FilMate Intelligent Feeling Matrix v2.0</span>
      </div>
    </div>
  );
};
