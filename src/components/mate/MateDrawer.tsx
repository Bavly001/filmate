'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  X,
  Sparkles,
  RotateCcw,
  Send,
  Star,
  ExternalLink,
} from 'lucide-react';
import { useMateStore } from '@/store/useMateStore';
import { ImageWithFallback } from '@/components/common/ImageWithFallback';

export const MateDrawer: React.FC = () => {
  const {
    isDrawerOpen,
    closeDrawer,
    messages,
    isTyping,
    sendMessage,
    selectQuickVibe,
    resetChat,
  } = useMateStore();

  const [inputVal, setInputVal] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickVibes = [
    '🔥 Blockbuster Action',
    '🌌 Mind-Bending Sci-Fi',
    '🕵️ Crime & Mystery',
    '😂 Feel-Good Comedy',
    '🍿 Date Night Picks',
  ];

  const scrollToBottom = () => {
    if (typeof messagesEndRef.current?.scrollIntoView === 'function') {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (isDrawerOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, isDrawerOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim() || isTyping) return;
    const text = inputVal;
    setInputVal('');
    await sendMessage(text);
  };

  if (!isDrawerOpen) return null;

  return (
    <div
      data-testid="mate-messenger-popup"
      className="fixed bottom-20 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[380px] h-[520px] max-h-[82vh] backdrop-blur-2xl bg-[#0B0D13]/95 border border-amber-500/25 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300"
    >
      {/* Top Messenger Header */}
      <div className="px-4 py-3.5 border-b border-amber-500/20 bg-[#10121B] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 rounded-lg bg-[#07080B] border border-amber-500/40 flex items-center justify-center p-1 shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-[#07080B]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-white tracking-wide">
                Film<span className="text-amber-400">Mate</span>
              </span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-widest">
                AI Concierge
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 leading-none mt-0.5">
              Side talk • Real-time cinema matches
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={resetChat}
            aria-label="Reset Mate Chat"
            title="Reset Chat"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Close Mate Chat"
            title="Close"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 custom-scrollbar bg-gradient-to-b from-transparent to-[#07080B]/50">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold rounded-2xl rounded-tr-xs shadow-md'
                    : 'bg-[#10121B] border border-amber-500/20 text-zinc-200 rounded-2xl rounded-tl-xs shadow-md'
                }`}
              >
                <p>{msg.text}</p>
              </div>

              {/* Inline Movie Recommendation Card */}
              {msg.recommendation && (
                <div className="mt-2 w-full max-w-[92%] rounded-xl overflow-hidden bg-[#10121B] border border-amber-500/30 p-2.5 shadow-lg">
                  <div className="flex gap-2.5">
                    <div className="relative w-16 h-22 rounded-lg overflow-hidden bg-black flex-shrink-0">
                      <ImageWithFallback
                        src={msg.recommendation.posterUrl}
                        alt={msg.recommendation.title}
                        fallbackTitle={msg.recommendation.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <h4 className="font-bold text-xs text-white truncate">
                            {msg.recommendation.title}
                          </h4>
                          <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-400 flex-shrink-0">
                            <Star className="w-2.5 h-2.5 fill-amber-400" />
                            {msg.recommendation.rating.toFixed(1)}
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-400 line-clamp-1">
                          {msg.recommendation.genres?.join(', ') || 'Feature'}
                        </p>
                      </div>

                      <Link
                        href={`/movies/${msg.recommendation.id}`}
                        onClick={closeDrawer}
                        className="mt-1 inline-flex items-center justify-center gap-1 px-2.5 py-1 rounded-md bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[10px] font-bold border border-amber-500/40 transition-colors w-fit"
                      >
                        <span>View Details</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-[#10121B] border border-amber-500/20 w-fit text-amber-400 text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" />
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce [animation-delay:0.2s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce [animation-delay:0.4s]" />
          </div>
        )}

        {/* Quick Vibe Chips (shown when few messages) */}
        {messages.length <= 2 && (
          <div className="pt-2">
            <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              Popular Vibes
            </p>
            <div className="flex flex-wrap gap-1.5">
              {quickVibes.map((vibe) => (
                <button
                  key={vibe}
                  type="button"
                  onClick={() => selectQuickVibe(vibe.replace(/^[^\w]+/, ''))}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-[#10121B] border border-amber-500/20 text-zinc-300 hover:text-amber-300 hover:border-amber-400/50 hover:bg-amber-500/10 transition-colors cursor-pointer"
                >
                  {vibe}
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form Bar */}
      <form
        onSubmit={handleSend}
        className="p-2.5 border-t border-amber-500/20 bg-[#10121B] flex items-center gap-2"
      >
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Ask Mate for a movie..."
          className="flex-1 px-3 py-2 rounded-xl bg-[#07080B] border border-amber-500/25 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-amber-400 transition-colors"
        />
        <button
          type="submit"
          aria-label="Send message"
          disabled={!inputVal.trim() || isTyping}
          className="p-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold disabled:opacity-30 disabled:pointer-events-none hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <Send className="w-4 h-4 fill-black" />
        </button>
      </form>
    </div>
  );
};
