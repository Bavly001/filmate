'use client';

import React from 'react';

export const AmbientBackground: React.FC = () => {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
    >
      {/* Primary Warm Projector Beam (Sunset) */}
      <div
        className="absolute -top-32 -left-32 w-[650px] h-[650px] rounded-full blur-[140px] opacity-25 animate-pulse-slow"
        style={{
          background: 'radial-gradient(circle, rgba(255,107,43,0.7) 0%, rgba(255,107,43,0) 70%)',
        }}
      />

      {/* Cyber Violet Premiere Glow */}
      <div
        className="absolute top-1/3 -right-40 w-[600px] h-[600px] rounded-full blur-[150px] opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(224,64,251,0.6) 0%, rgba(224,64,251,0) 70%)',
          animation: 'pulse 8s ease-in-out infinite alternate',
        }}
      />

      {/* Golden Cinema Accent Glow */}
      <div
        className="absolute bottom-10 left-1/4 w-[550px] h-[550px] rounded-full blur-[130px] opacity-15"
        style={{
          background: 'radial-gradient(circle, rgba(255,167,38,0.5) 0%, rgba(255,167,38,0) 70%)',
          animation: 'pulse 12s ease-in-out infinite alternate-reverse',
        }}
      />

      {/* Cinema Screen Projection Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#08070d_95%)] opacity-85" />
    </div>
  );
};
