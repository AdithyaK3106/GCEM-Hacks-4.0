import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Brain, Zap, Target, Shield, BookOpen, Clock, Users } from 'lucide-react';
import Button from '../components/ui/Button';
import './pages.css';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="page-transition min-h-screen bg-[#F5EFE6]">
      {/* Hero Section */}
      <section className="landing-hero px-6 py-20 max-w-7xl mx-auto flex flex-col items-center justify-center text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-24 h-24 bg-[#2D1E3E] rounded-2xl flex items-center justify-center text-white mb-10 shadow-lg"
        >
          <Brain size={52} />
        </motion.div>
        
        <h1 className="text-6xl md:text-8xl font-black mb-6 text-[#2D1E3E] tracking-tight leading-none">
          Master Anything <br />
          <span className="text-[#6D4AFF]">Intelligently.</span>
        </h1>
        
        <p className="hero-subtitle text-xl md:text-2xl text-[#5A4A6B] max-w-2xl mx-auto mb-12">
          The only AI platform that measures Accuracy, Confidence, and Time (ACT) to guarantee total concept mastery.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 mb-20">
          <Button 
            className="px-12 py-6 text-2xl font-black rounded-xl bg-[#6D4AFF] text-white shadow-xl hover:opacity-90 active:scale-95 transition-all" 
            onClick={() => navigate('/upload')}
          >
            Start Mastery Session <ArrowRight size={28} className="ml-3" />
          </Button>
          <Button 
            className="px-12 py-6 text-2xl font-black rounded-xl border-2 border-[#2D1E3E] text-[#2D1E3E] bg-white hover:bg-[#F5EFE6] transition-all" 
            onClick={() => navigate('/help')}
          >
            How it Works
          </Button>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {[
            { icon: <Zap className="text-[#6D4AFF]" />, title: 'Real-time Extraction', desc: 'Convert live lectures or files into structured knowledge instantly.' },
            { icon: <Target className="text-[#16A34A]" />, title: 'Cognitive Tracking', desc: 'Our ACT engine detects subtle gaps in your understanding before you do.' },
            { icon: <Shield className="text-[#2D1E3E]" />, title: 'Privacy First', desc: 'Local-first processing ensures your data stays your knowledge.' }
          ].map((feature, idx) => (
            <div key={idx} className="p-10 bg-white border border-gray-100 rounded-xl shadow-md text-left hover:translate-y-[-4px] transition-all">
              <div className="w-12 h-12 bg-[#F5EFE6] rounded-lg flex items-center justify-center mb-6 shadow-sm">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-black text-[#2D1E3E] mb-3">{feature.title}</h3>
              <p className="text-[#5A4A6B] font-medium leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-[#2D1E3E] py-20 text-white">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 text-center">
          <div>
            <p className="text-5xl font-black text-[#6D4AFF] mb-2">98.2%</p>
            <p className="text-[#8B7CA3] font-black uppercase tracking-widest text-xs">Retention Rate</p>
          </div>
          <div>
            <p className="text-5xl font-black text-[#6D4AFF] mb-2">12ms</p>
            <p className="text-[#8B7CA3] font-black uppercase tracking-widest text-xs">Latency</p>
          </div>
          <div>
            <p className="text-5xl font-black text-[#6D4AFF] mb-2">500k+</p>
            <p className="text-[#8B7CA3] font-black uppercase tracking-widest text-xs">Concepts Synced</p>
          </div>
          <div>
            <p className="text-5xl font-black text-[#6D4AFF] mb-2">24/7</p>
            <p className="text-[#8B7CA3] font-black uppercase tracking-widest text-xs">Neural Uptime</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
