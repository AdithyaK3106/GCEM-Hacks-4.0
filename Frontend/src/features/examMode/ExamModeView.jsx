import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Lightbulb, HelpCircle, BookMarked, Sparkles, Sigma, Zap, GraduationCap, ChevronRight, CheckCircle2, Trophy, Flame } from 'lucide-react';
import Card from '../../components/ui/Card';

const ExamModeView = ({ data }) => {
  const { 
    topic_title, key_concepts, definitions, formulas, 
    memory_shortcuts, exam_questions, last_minute_tips 
  } = data;

  const [revealedQuestions, setRevealedQuestions] = useState({});

  const toggleQuestion = (id) => {
    setRevealedQuestions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="exam-mode-view space-y-12 pb-24"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <header className="exam-header relative overflow-hidden glass-panel p-10 rounded-[2.5rem] border-white/10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-primary/10 blur-[100px] -mr-48 -mt-48 rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-secondary/10 blur-[80px] -ml-32 -mb-32 rounded-full"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <motion.div 
              className="p-3 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-2xl text-white shadow-lg shadow-accent-primary/20"
              whileHover={{ rotate: 15, scale: 1.1 }}
            >
              <GraduationCap size={28} />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black tracking-[0.2em] uppercase text-accent-primary">Premium Synthesis</span>
              <span className="text-sm font-bold text-text-primary">Ultimate Exam Preparation Guide</span>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-black mb-8 leading-tight tracking-tight">
            Ready to <span className="text-gradient">Ace</span> <br />{topic_title}?
          </h1>
          
          <div className="flex flex-wrap gap-3">
            {key_concepts?.map((c, i) => (
              <motion.span 
                key={i} 
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[11px] font-bold uppercase tracking-wider text-text-secondary hover:border-accent-primary/50 hover:bg-white/10 transition-all cursor-default"
                whileHover={{ scale: 1.05 }}
              >
                {c}
              </motion.span>
            ))}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left Column: Knowledge Base */}
        <div className="space-y-10">
          <motion.section variants={itemVariants} className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="flex items-center gap-3 text-2xl font-black"><BookMarked className="text-accent-primary" /> Key Definitions</h2>
              <span className="text-xs font-bold text-accent-primary/50 uppercase tracking-widest">{definitions?.length} concepts</span>
            </div>
            <div className="grid gap-5">
              {definitions?.map((d, i) => (
                <Card key={i} className="group relative overflow-hidden p-0 border-white/5 bg-white-[0.02] hover:bg-white-[0.04]">
                  <div className="absolute top-0 left-0 w-1 h-full bg-accent-primary opacity-20 group-hover:opacity-100 transition-opacity"></div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-lg font-black text-accent-primary tracking-tight">{d.term}</h4>
                      <Trophy size={18} className="text-accent-primary/20 group-hover:text-accent-primary transition-colors" />
                    </div>
                    <p className="text-text-secondary text-[15px] leading-relaxed group-hover:text-text-primary transition-colors">{d.definition}</p>
                  </div>
                </Card>
              ))}
            </div>
          </motion.section>

          {formulas && formulas.length > 0 && (
            <motion.section variants={itemVariants} className="space-y-6">
              <h2 className="flex items-center gap-3 text-2xl font-black px-2"><Sigma className="text-info" /> Essential Formulas</h2>
              <div className="bg-gradient-to-br from-info/10 to-info/5 border border-info/20 rounded-[2rem] p-8 grid gap-5 shadow-inner">
                {formulas.map((f, i) => (
                  <div key={i} className="group flex items-center justify-center p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-info/50 hover:shadow-lg hover:shadow-info/10 transition-all">
                    <div className="text-2xl font-mono font-bold text-info tracking-wider group-hover:scale-105 transition-transform">{f}</div>
                  </div>
                ))}
              </div>
            </motion.section>
          )}
        </div>

        {/* Right Column: Mastery Tools */}
        <div className="space-y-10">
          <motion.section variants={itemVariants} className="space-y-6">
            <h2 className="flex items-center gap-3 text-2xl font-black px-2"><Lightbulb className="text-warning" /> Memory Hacks</h2>
            <div className="grid gap-5">
              {memory_shortcuts?.map((m, i) => (
                <motion.div 
                  key={i} 
                  className="p-7 bg-gradient-to-br from-warning/10 to-transparent border border-warning/20 rounded-3xl relative overflow-hidden group hover:border-warning/50 transition-all"
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-warning/20 flex items-center justify-center">
                      <Flame size={16} className="text-warning" />
                    </div>
                    <span className="text-[11px] font-black text-warning uppercase tracking-[0.2em]">{m.concept}</span>
                  </div>
                  <p className="text-xl italic font-bold text-text-primary leading-snug">"{m.trick}"</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          <motion.section variants={itemVariants} className="space-y-6">
            <h2 className="flex items-center gap-3 text-2xl font-black px-2"><HelpCircle className="text-success" /> Practice Flashcards</h2>
            <div className="space-y-5">
              {exam_questions?.map((q, i) => (
                <div 
                  key={i} 
                  className={`p-7 rounded-3xl border transition-all cursor-pointer select-none
                    ${revealedQuestions[i] ? 'bg-success/10 border-success/40' : 'bg-white/5 border-white/10 hover:border-success/30'}`}
                  onClick={() => toggleQuestion(i)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 bg-success/20 text-success text-[10px] font-black uppercase rounded-lg">Question {i+1}</span>
                    {revealedQuestions[i] ? <CheckCircle2 size={20} className="text-success" /> : <ChevronRight size={20} className="text-text-muted" />}
                  </div>
                  <p className="text-lg font-bold mb-4 leading-tight">{q.question}</p>
                  
                  <AnimatePresence>
                    {revealedQuestions[i] && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-4 border-t border-success/20 mt-4">
                          <div className="flex items-start gap-3 bg-success/5 p-4 rounded-2xl">
                            <ShieldAlert size={18} className="text-success shrink-0 mt-1" />
                            <div className="space-y-1">
                              <span className="text-[10px] font-black uppercase text-success tracking-widest">Mastery Hint</span>
                              <p className="text-sm text-text-primary italic">{q.answer_hint}</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section variants={itemVariants} className="space-y-6">
            <h2 className="flex items-center gap-3 text-2xl font-black px-2"><Zap className="text-danger" /> Last Minute Tips</h2>
            <div className="bg-gradient-to-br from-danger/10 to-transparent border border-danger/20 rounded-[2.5rem] p-8">
              <div className="space-y-5">
                {last_minute_tips?.map((t, i) => (
                  <motion.div 
                    key={i} 
                    className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-danger/30 transition-all"
                    whileHover={{ x: 10 }}
                  >
                    <div className="w-10 h-10 rounded-xl bg-danger/20 flex items-center justify-center shrink-0">
                      <Zap size={20} className="text-danger" />
                    </div>
                    <p className="text-sm font-medium text-text-primary leading-relaxed">{t}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </motion.div>
  );
};

export default ExamModeView;

