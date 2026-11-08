'use client';

import React from 'react';
import { Sparkles, Bot, Zap, Laugh, Heart, Brain, Skull, Baby, User, Users, Home, Clapperboard, ShieldAlert } from 'lucide-react';
import { useMateStore } from '@/store/useMateStore';
import { CompanyType, VenueType, AgeRating } from '@/types/movie';

export const MateQuestionnaire: React.FC = () => {
  const { preferences, toggleMood, setCompany, setVenue, setAgeRating, startAnalysis } = useMateStore();

  const moodChoices = [
    { id: 'Action', label: '⚡ High Adrenaline & Action', desc: 'Explosive thrills' },
    { id: 'Comedy', label: '😂 Need a Good Laugh', desc: 'Pure humor' },
    { id: 'Romance', label: '🍷 Warm Romance & Feelings', desc: 'Heartwarming' },
    { id: 'Sci-Fi', label: '🧠 Mind-Bending & Mystery', desc: 'Deep twists' },
    { id: 'Horror', label: '😱 Terrified & Chills', desc: 'Dark & spooky' },
    { id: 'Drama', label: '🎭 Emotional & Acclaimed', desc: 'Riveting stories' },
    { id: 'Family', label: '🍿 Feel-Good & Fun', desc: 'Pure entertainment' },
  ];

  const companyChoices: { id: CompanyType; label: string; icon: React.ReactNode }[] = [
    { id: 'solo', label: 'Alone in my room', icon: <User className="w-4 h-4" /> },
    { id: 'partner', label: 'With Partner / Date', icon: <Heart className="w-4 h-4" /> },
    { id: 'family', label: 'Family & Kids', icon: <Baby className="w-4 h-4" /> },
    { id: 'friends', label: 'Friends Night Out', icon: <Users className="w-4 h-4" /> },
  ];

  const venueChoices: { id: VenueType; label: string; icon: React.ReactNode }[] = [
    { id: 'both', label: 'Anywhere Good', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'cinema', label: 'In Cinema (Big Screen)', icon: <Clapperboard className="w-4 h-4" /> },
    { id: 'home', label: 'At Home (Streaming)', icon: <Home className="w-4 h-4" /> },
  ];

  const ageChoices: { id: AgeRating; label: string }[] = [
    { id: '18+', label: '🔞 18+ (Mature / Unrestricted)' },
    { id: 'All Ages', label: '👨‍👩‍👧 All Ages (Family Friendly)' },
  ];

  return (
    <div className="space-y-6">
      {/* Scripted Mate Bot Bubble 1: Greeting & Mood */}
      <div className="p-4 rounded-2xl bg-dark-surface/90 border border-sunset/20 shadow-md">
        <div className="flex items-center gap-2 text-sunset text-xs font-bold uppercase tracking-wider mb-2">
          <Bot className="w-4 h-4" />
          <span>FilMate Assistant</span>
        </div>
        <p className="text-white text-base font-bold leading-snug">
          &ldquo;Hi mate! I&apos;m your mate that will help you choose which movie you watch.&rdquo;
        </p>
        <p className="text-xs text-gray-400 mt-1">
          How are you feeling right now? Pick one or more feelings:
        </p>

        {/* Mood Multi-Select Pills */}
        <div className="flex flex-wrap gap-2 mt-3.5">
          {moodChoices.map((mood) => {
            const isSelected = preferences.moods.includes(mood.id);
            return (
              <button
                key={mood.id}
                onClick={() => toggleMood(mood.id)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-sunset to-cyber text-white shadow-neon-sunset scale-102 border-transparent'
                    : 'bg-dark-card border border-gray-800 text-gray-300 hover:border-sunset/40 hover:text-white'
                }`}
              >
                {mood.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Scripted Mate Bot Bubble 2: Viewing Company */}
      <div className="p-4 rounded-2xl bg-dark-surface/90 border border-sunset/20 shadow-md">
        <p className="text-sm text-gray-200 font-bold mb-1">
          Who are you watching with?
        </p>
        <div className="grid grid-cols-2 gap-2 mt-2.5">
          {companyChoices.map((comp) => {
            const isSelected = preferences.company === comp.id;
            return (
              <button
                key={comp.id}
                onClick={() => setCompany(comp.id)}
                className={`p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-sunset/20 border border-sunset text-white shadow-sm font-bold'
                    : 'bg-dark-card border border-gray-800 text-gray-400 hover:text-white hover:border-gray-700'
                }`}
              >
                {comp.icon}
                <span className="truncate">{comp.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Scripted Mate Bot Bubble 3: Venue & Age Group */}
      <div className="p-4 rounded-2xl bg-dark-surface/90 border border-sunset/20 shadow-md">
        <p className="text-sm text-gray-200 font-bold mb-1">
          Venue preference & Audience age:
        </p>

        <div className="flex flex-wrap gap-2 mt-2">
          {venueChoices.map((ven) => {
            const isSelected = preferences.venue === ven.id;
            return (
              <button
                key={ven.id}
                onClick={() => setVenue(ven.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-sunset/20 border border-sunset text-white font-bold'
                    : 'bg-dark-card border border-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                {ven.icon}
                <span>{ven.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          {ageChoices.map((age) => {
            const isSelected = preferences.ageRating === age.id;
            return (
              <button
                key={age.id}
                onClick={() => setAgeRating(age.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-cyber/20 border border-cyber text-white font-bold'
                    : 'bg-dark-card border border-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                {age.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Trigger Button: Find Recommendation */}
      <button
        onClick={() => startAnalysis(2800)}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-sunset via-sunset-hover to-cyber text-white font-extrabold text-base shadow-neon-sunset hover:shadow-neon-glow-lg hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        <Sparkles className="w-5 h-5 text-yellow-300" />
        <span>Analyze My Feelings & Recommend Movie</span>
      </button>
    </div>
  );
};
