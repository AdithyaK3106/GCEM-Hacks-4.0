import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Brain, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';
import './pages.css';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-hero page-transition">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-accent-primary text-sm font-medium mb-8">
          <Sparkles size={16} />
          <span>AI-Powered Learning Assistant</span>
        </div>
      </motion.div>
      
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="hero-title"
      >
        Transform Lectures into <br />
        <span className="text-gradient">Personalized Mastery</span>
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="hero-subtitle"
      >
        Upload your class transcripts. We'll generate notes, build interactive quizzes, analyze your weak points, and create a custom learning path just for you.
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Button 
          variant="primary" 
          onClick={() => navigate('/upload')}
          style={{ padding: '1rem 2rem', fontSize: '1.25rem' }}
        >
          <Brain size={24} />
          Start Learning
          <ArrowRight size={20} className="ml-2" />
        </Button>
      </motion.div>

      {/* Decorative background elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob"></div>
      <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-blue-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000"></div>
    </div>
  );
};

export default Landing;
