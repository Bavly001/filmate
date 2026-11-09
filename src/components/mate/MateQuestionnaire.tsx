'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Bot,
  Zap,
  Laugh,
  Heart,
  Brain,
  Skull,
  Baby,
  User,
  Users,
  Home,
  Clapperboard,
  ArrowRight,
  Edit2,
} from 'lucide-react';
import { useMateStore } from '@/store/useMateStore';
import { CompanyType, VenueType, AgeRating } from '@/types/movie';

export const MateQuestionnaire: React.FC = () => {
  const {
    preferences,
    toggleMood,
    setCompany,
    setVenue,
    setAgeRating,
    startAnalysis,
  } = useMateStore();

  const [activeQuestion, setActiveQuestion] = useState<number>(1);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to latest question
  useEffect(() => {
    if (chatEndRef.current && typeof chatEndRef.current.scrollIntoView === 'function') {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeQuestion]);

  const moodChoices = [
    { id: 'Action', label: '⚡ High Adrenaline & Action' },
    { id: 'Comedy', label: '😂 Need a Good Laugh' },
    { id: 'Romance', label: '🍷 Warm Romance & Feelings' },
    { id: 'Sci-Fi', label: '🧠 Mind-Bending & Mystery' },
    { id: 'Horror', label: '😱 Terrified & Chills' },
    { id: 'Drama', label: '🎭 Emotional & Acclaimed' },
    { id: 'Family', label: '🍿 Feel-Good & Fun' },
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

  const handleConfirmMood = () => {
    if (preferences.moods.length === 0) return;
    setActiveQuestion(2);
  };

  const handleSelectCompany = (comp: CompanyType) => {
    setCompany(comp);
    setActiveQuestion(3);
  };

  const handleSelectVenue = (ven: VenueType) => {
    setVenue(ven);
    if (preferences.company === 'family') {
      // Family automatically enforces All Ages & starts analysis
      setAgeRating('All Ages');
      startAnalysis(2800);
    } else {
      setActiveQuestion(4);
    }
  };

  const handleSelectAge = (age: AgeRating) => {
    setAgeRating(age);
    startAnalysis(2800);
  };

  const getCompanyLabel = (c: CompanyType) =>
    companyChoices.find((x) => x.id === c)?.label || c;

  const getVenueLabel = (v: VenueType) =>
    venueChoices.find((x) => x.id === v)?.label || v;

  return (
    <div className="flex flex-col gap-5 py-2">
      {/* Question 1: Greeting & Moods */}
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-dark-surface border border-sunset/40 text-sunset flex items-center justify-center shadow-neon-sunset shrink-0 mt-1">
          <Bot className="w-5 h-5" />
        </div>
        <div className="flex-1 space-y-3">
          <div className="p-4 rounded-2xl bg-dark-surface/90 border border-sunset/25 shadow-md">
            <p className="text-white text-sm sm:text-base font-bold leading-snug">
              &ldquo;Hi mate! I&apos;m your mate that will help you choose which movie you watch.&rdquo;
            </p>
            <p className="text-xs text-gray-300 mt-1.5">
              How are you feeling right now? Pick one or more feelings:
            </p>

            {/* Interactive Mood Pills */}
            {activeQuestion === 1 ? (
              <div className="mt-3.5 space-y-3">
                <div className="flex flex-wrap gap-2">
                  {moodChoices.map((mood) => {
                    const isSelected = preferences.moods.includes(mood.id);
                    return (
                      <button
                        key={mood.id}
                        type="button"
                        onClick={() => toggleMood(mood.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? 'bg-sunset text-white shadow-neon-sunset scale-102 border-transparent'
                            : 'bg-dark-card border border-gray-800 text-gray-300 hover:border-sunset/40 hover:text-white'
                        }`}
                      >
                        {mood.label}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleConfirmMood}
                    disabled={preferences.moods.length === 0}
                    className="px-5 py-2 rounded-xl bg-sunset hover:bg-sunset-hover text-white text-xs sm:text-sm font-bold shadow-neon-sunset hover:shadow-neon-glow disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* User Q1 Answer Bubble */}
      {activeQuestion > 1 && (
        <div className="flex justify-end">
          <div className="p-3 rounded-2xl rounded-tr-sm bg-sunset text-white text-xs font-bold shadow-neon-sunset max-w-[85%] flex items-center gap-2">
            <span>Feeling: {preferences.moods.join(', ')}</span>
            <button
              onClick={() => setActiveQuestion(1)}
              title="Edit mood"
              className="text-white/80 hover:text-white p-0.5"
            >
              <Edit2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Question 2: Viewing Company */}
      {activeQuestion >= 2 && (
        <div className="flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="w-9 h-9 rounded-xl bg-dark-surface border border-sunset/40 text-sunset flex items-center justify-center shadow-neon-sunset shrink-0 mt-1">
            <Bot className="w-5 h-5" />
          </div>
          <div className="flex-1 space-y-3">
            <div className="p-4 rounded-2xl bg-dark-surface/90 border border-sunset/25 shadow-md">
              <p className="text-white text-sm sm:text-base font-bold leading-snug">
                &ldquo;Who are you watching with tonight?&rdquo;
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Select your movie company:
              </p>

              {activeQuestion === 2 && (
                <div className="grid grid-cols-2 gap-2 mt-3.5">
                  {companyChoices.map((comp) => {
                    const isSelected = preferences.company === comp.id;
                    return (
                      <button
                        key={comp.id}
                        type="button"
                        onClick={() => handleSelectCompany(comp.id)}
                        className={`p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-sunset text-white shadow-neon-sunset font-bold'
                            : 'bg-dark-card border border-gray-800 text-gray-300 hover:text-white hover:border-sunset/40'
                        }`}
                      >
                        {comp.icon}
                        <span className="truncate">{comp.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* User Q2 Answer Bubble */}
      {activeQuestion > 2 && (
        <div className="flex justify-end">
          <div className="p-3 rounded-2xl rounded-tr-sm bg-sunset text-white text-xs font-bold shadow-neon-sunset max-w-[85%] flex items-center gap-2">
            <span>Company: {getCompanyLabel(preferences.company)}</span>
            <button
              onClick={() => setActiveQuestion(2)}
              title="Edit company"
              className="text-white/80 hover:text-white p-0.5"
            >
              <Edit2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Question 3: Venue */}
      {activeQuestion >= 3 && (
        <div className="flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="w-9 h-9 rounded-xl bg-dark-surface border border-sunset/40 text-sunset flex items-center justify-center shadow-neon-sunset shrink-0 mt-1">
            <Bot className="w-5 h-5" />
          </div>
          <div className="flex-1 space-y-3">
            <div className="p-4 rounded-2xl bg-dark-surface/90 border border-sunset/25 shadow-md">
              <p className="text-white text-sm sm:text-base font-bold leading-snug">
                &ldquo;Where would you like to watch?&rdquo;
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Choose cinema screens or at-home streaming:
              </p>

              {activeQuestion === 3 && (
                <div className="flex flex-wrap gap-2 mt-3.5">
                  {venueChoices.map((ven) => {
                    const isSelected = preferences.venue === ven.id;
                    return (
                      <button
                        key={ven.id}
                        type="button"
                        onClick={() => handleSelectVenue(ven.id)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-sunset text-white shadow-neon-sunset font-bold'
                            : 'bg-dark-card border border-gray-800 text-gray-300 hover:text-white hover:border-sunset/40'
                        }`}
                      >
                        {ven.icon}
                        <span>{ven.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* User Q3 Answer Bubble */}
      {activeQuestion > 3 && (
        <div className="flex justify-end">
          <div className="p-3 rounded-2xl rounded-tr-sm bg-sunset text-white text-xs font-bold shadow-neon-sunset max-w-[85%] flex items-center gap-2">
            <span>Venue: {getVenueLabel(preferences.venue)}</span>
            <button
              onClick={() => setActiveQuestion(3)}
              title="Edit venue"
              className="text-white/80 hover:text-white p-0.5"
            >
              <Edit2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Question 4: Age Rating */}
      {activeQuestion >= 4 && preferences.company !== 'family' && (
        <div className="flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="w-9 h-9 rounded-xl bg-dark-surface border border-sunset/40 text-sunset flex items-center justify-center shadow-neon-sunset shrink-0 mt-1">
            <Bot className="w-5 h-5" />
          </div>
          <div className="flex-1 space-y-3">
            <div className="p-4 rounded-2xl bg-dark-surface/90 border border-sunset/25 shadow-md">
              <p className="text-white text-sm sm:text-base font-bold leading-snug">
                &ldquo;Last question mate: what age rating are you looking for?&rdquo;
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Choose audience rating restrictions:
              </p>

              {activeQuestion === 4 && (
                <div className="flex flex-wrap gap-2 mt-3.5">
                  {ageChoices.map((age) => {
                    const isSelected = preferences.ageRating === age.id;
                    return (
                      <button
                        key={age.id}
                        type="button"
                        onClick={() => handleSelectAge(age.id)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-sunset text-white shadow-neon-sunset font-bold'
                            : 'bg-dark-card border border-gray-800 text-gray-300 hover:text-white hover:border-sunset/40'
                        }`}
                      >
                        {age.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div ref={chatEndRef} />
    </div>
  );
};
