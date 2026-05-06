import React, { useState, useEffect } from 'react';
import { Search, Bell, User, Zap, Quote as QuoteIcon } from 'lucide-react';
import './layout.css';

const quotes = [
  "The only limit to our realization of tomorrow is our doubts of today.",
  "Learning never exhausts the mind.",
  "Mistakes are the portals of discovery.",
  "The beautiful thing about learning is that no one can take it away from you.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "Accuracy is the twin brother of honesty; inaccuracy of dishonesty."
];

const Topbar = () => {
  const [quote, setQuote] = useState(quotes[0]);

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  return (
    <header className="topbar-container bg-white/10 backdrop-blur-md border-b border-white/20 relative">
      <div className="flex items-center gap-6">
        {/* Search Bar */}
        <div className="relative hidden md:flex items-center group">
          <Search className="absolute left-4 text-[#8B7CA3] transition-colors group-focus-within:text-[#2D1E3E]" size={18} />
          <input 
            type="text" 
            placeholder="Search knowledge base..." 
            className="pl-12 pr-6 py-2.5 bg-white/40 border border-white/40 rounded-xl w-64 xl:w-80 focus:outline-none focus:bg-white/60 focus:border-[#6D4AFF]/20 transition-all text-sm font-medium shadow-sm text-[#2D1E3E]"
          />
        </div>

        {/* Neural Sync Status */}
        <div className="hidden lg:flex items-center gap-3 px-5 py-2 bg-white/30 border border-white/40 rounded-xl shadow-sm">
          <div className="w-8 h-8 rounded-lg bg-[#6D4AFF]/10 flex items-center justify-center text-[#6D4AFF]">
            <Zap size={16} fill="currentColor" className="animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-[#8B7CA3] uppercase tracking-[0.15em] leading-none mb-1">Neural Sync</span>
            <span className="text-[10px] font-black text-[#2D1E3E]">Stable (99.8%)</span>
          </div>
        </div>
      </div>

      {/* Motivational Quote - Absolute Centered */}
      <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-max pointer-events-none">
        <div className="flex items-center gap-3 bg-white/80 px-6 py-2.5 rounded-full border border-white shadow-premium ring-4 ring-[#6D4AFF]/5">
          <QuoteIcon size={12} className="text-[#6D4AFF] opacity-80 shrink-0" />
          <p className="text-[12px] font-black italic text-[#2D1E3E] leading-tight tracking-tight">
            {quote}
          </p>
        </div>
      </div>

      {/* Identity & Notifications */}
      <div className="flex items-center gap-5">
        <button className="w-10 h-10 rounded-xl flex items-center justify-center text-[#8B7CA3] hover:text-[#2D1E3E] hover:bg-white/40 transition-all relative group">
           <Bell size={20} />
           <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full"></span>
        </button>
        
        <div className="h-8 w-[1px] bg-[#2D1E3E]/10"></div>

        <div className="flex items-center gap-4 pl-2 cursor-pointer group">
          <div className="flex flex-col items-end">
            <span className="text-sm font-black text-[#2D1E3E] leading-tight">Learner</span>
            <div className="flex items-center gap-1">
              <Zap size={10} className="text-[#6D4AFF]" fill="currentColor" />
              <span className="text-[10px] font-black text-[#6D4AFF] uppercase tracking-widest">Level 12</span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#533A71] shadow-lg flex items-center justify-center text-white group-hover:scale-105 transition-all overflow-hidden border border-white/20">
            <User size={22} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
