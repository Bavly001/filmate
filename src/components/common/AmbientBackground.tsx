'use client';

import React from 'react';

export const AmbientBackground: React.FC = () => {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
    >
      {/* Primary Warm Cinema Glow (Cinema Amber #F59E0B) */}
      <div
        className="absolute -top-32 -left-32 w-[650px] h-[650px] rounded-full blur-[140px] opacity-15 animate-pulse"
        style={{
          background: 'radial-gradient(circle, rgba(245,158,11,0.5) 0%, rgba(245,158,11,0) 70%)',
        }}
      />

      {/* Secondary Ambient Midnight Gold Projection */}
      <div
        className="absolute top-1/3 -right-40 w-[600px] h-[600px] rounded-full blur-[150px] opacity-10"
        style={{
          background: 'radial-gradient(circle, rgba(217,119,6,0.4) 0%, rgba(217,119,6,0) 70%)',
        }}
      />

      {/* Subtle Bottom Ambient Amber Glow */}
      <div
        className="absolute bottom-10 left-1/4 w-[550px] h-[550px] rounded-full blur-[130px] opacity-10"
        style={{
          background: 'radial-gradient(circle, rgba(253,230,138,0.2) 0%, rgba(245,158,11,0) 70%)',
        }}
      />

      {/* Deep Obsidian Canvas Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#07080B_95%)] opacity-95" />
    </div>
  );
};
