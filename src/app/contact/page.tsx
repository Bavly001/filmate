'use client';

import React, { useState } from 'react';
import { Mail, MapPin, Clock, Send, CheckCircle2, Sparkles, MessageSquare } from 'lucide-react';
import { Navbar } from '@/components/common/Navbar';
import { FloatingMateButton } from '@/components/mate/FloatingMateButton';
import { MateDrawer } from '@/components/mate/MateDrawer';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#07080B] text-white flex flex-col justify-between selection:bg-amber-500/30 selection:text-amber-300">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-8 pt-32 pb-20 w-full">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-widest mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>24/7 Dedicated Support</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-6">
            Contact{' '}
            <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-yellow-500 bg-clip-text text-transparent">
              Concierge
            </span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-300 leading-relaxed font-normal">
            Have questions regarding cinematic distribution, public API feeds, partnerships, or
            general inquiries? Our concierge team is at your service.
          </p>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Inquiry Form */}
          <div className="lg:col-span-7 p-8 rounded-3xl bg-[#10121B] border border-amber-500/20 shadow-2xl relative overflow-hidden">
            {submitted ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-white">Message Received!</h3>
                <p className="text-sm text-zinc-300 max-w-md mx-auto leading-relaxed">
                  Thank you, <span className="text-amber-400 font-bold">{formData.name}</span>. Our
                  concierge team has logged your dispatch and will respond to{' '}
                  <span className="text-white font-semibold">{formData.email}</span> within 24
                  hours.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
                  }}
                  className="mt-4 px-6 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs transition-colors"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your full name"
                    className="w-full px-4 py-3 rounded-xl bg-[#07080B] border border-amber-500/25 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Your email address"
                    className="w-full px-4 py-3 rounded-xl bg-[#07080B] border border-amber-500/25 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                    Inquiry Topic
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#07080B] border border-amber-500/25 text-white text-sm focus:outline-none focus:border-amber-400 transition-all"
                  >
                    <option value="General Inquiry">General Cinema Inquiry</option>
                    <option value="API Integration">Public API & Feeds</option>
                    <option value="Partnerships">Distribution Partnerships</option>
                    <option value="Technical Support">Technical & Playback Support</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                    Your Message
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Write your inquiry or question..."
                    className="w-full px-4 py-3 rounded-xl bg-[#07080B] border border-amber-500/25 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  aria-label="Send message"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-sm shadow-[0_0_20px_rgba(245,158,11,0.4)] flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4 fill-black" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>

          {/* Contact Details & Hubs */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl bg-[#10121B] border border-amber-500/15 space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#07080B] border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm mb-0.5">Concierge Email</h4>
                  <p className="text-xs text-amber-300 font-mono">concierge@filmate.cinema</p>
                  <p className="text-[11px] text-zinc-400 mt-1">24-hour turnaround for inquiries</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#07080B] border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm mb-0.5">Operating Hours</h4>
                  <p className="text-xs text-zinc-300">Continuous 24/7 AI & Support Coverage</p>
                  <p className="text-[11px] text-zinc-400 mt-1">Global streaming assistance</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#07080B] border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm mb-0.5">Global Presence</h4>
                  <p className="text-xs text-zinc-300">Los Angeles • Cairo • London</p>
                  <p className="text-[11px] text-zinc-400 mt-1">Film curation and technical nodes</p>
                </div>
              </div>
            </div>

            {/* AI Assistant Callout */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-[#10121B] to-[#151926] border border-amber-500/25 shadow-lg">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4" />
                <span>Instant Movie Advice</span>
              </div>
              <h4 className="font-extrabold text-white text-base mb-1">Looking for a recommendation?</h4>
              <p className="text-xs text-zinc-300 leading-relaxed mb-4">
                You do not need to wait for email! Click the gold orb in the bottom-right corner to
                chat immediately with Mate AI.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Mate Assistant & Drawer */}
      <FloatingMateButton />
      <MateDrawer />

      {/* Footer */}
      <footer className="w-full border-t border-amber-500/10 py-8 px-4 text-center text-xs text-zinc-500 bg-[#07080B]">
        <p>© 2026 Filmate. All rights reserved. Crafted in Midnight Gold.</p>
      </footer>
    </div>
  );
}
