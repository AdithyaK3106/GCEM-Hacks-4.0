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
      <header className="exam-header relative overflow-hidden bg-white p-10 rounded-[3rem] border border-[#533A71]/5 shadow-2xl shadow-[#533A71]/5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#533A71]/5 blur-[100px] -mr-48 -mt-48 rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#A799B7]/5 blur-[80px] -ml-32 -mb-32 rounded-full"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <motion.div 
              className="w-16 h-16 bg-[#533A71] rounded-2xl text-white shadow-xl shadow-[#533A71]/20 flex items-center justify-center"
              whileHover={{ rotate: 15, scale: 1.1 }}
            >
              <GraduationCap size={32} />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black tracking-[0.2em] uppercase text-[#533A71]">Neural Synthesis</span>
              <span className="text-base font-black text-[#A799B7]">Comprehensive Exam Protocol</span>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black mb-10 leading-[1.1] tracking-tight text-[#533A71]">
            Master <span className="text-[#A799B7]">{topic_title}</span>
          </h1>
          
          <div className="flex flex-wrap gap-3">
            {key_concepts?.map((c, i) => (
              <motion.span 
                key={i} 
                className="px-6 py-3 bg-[#FDF4DC] border border-[#533A71]/10 rounded-2xl text-xs font-black uppercase tracking-widest text-[#533A71] hover:border-[#533A71]/30 transition-all cursor-default shadow-sm"
                whileHover={{ scale: 1.05 }}
              >
                {c}
              </motion.span>
            ))}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column: Knowledge Base */}
        <div className="space-y-12">
          <motion.section variants={itemVariants} className="space-y-8">
            <div className="flex items-center justify-between px-4">
              <h2 className="flex items-center gap-4 text-3xl font-black text-[#533A71]"><BookMarked size={32} className="text-[#A799B7]" /> Core Definitions</h2>
              <span className="text-xs font-black text-[#A799B7] uppercase tracking-widest bg-white px-4 py-1.5 rounded-full border border-[#533A71]/5 shadow-sm">{definitions?.length} concepts</span>
            </div>
            <div className="grid gap-6">
              {definitions?.map((d, i) => (
                <Card key={i} className="group relative overflow-hidden p-8 border-[#533A71]/5 bg-white shadow-xl shadow-[#533A71]/5 hover:translate-x-2 transition-all">
                  <div className="absolute top-0 left-0 w-2 h-full bg-[#533A71] opacity-20 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-2xl font-black text-[#533A71] tracking-tight">{d.term}</h4>
                      <Trophy size={20} className="text-[#A799B7]/30 group-hover:text-[#533A71] transition-colors" />
                    </div>
                    <p className="text-[#533A71]/70 text-lg leading-relaxed font-medium">{d.definition}</p>
                  </div>
                </Card>
              ))}
            </div>
          </motion.section>

          {formulas && formulas.length > 0 && (
            <motion.section variants={itemVariants} className="space-y-8">
              <h2 className="flex items-center gap-4 text-3xl font-black text-[#533A71] px-4"><Sigma size={32} className="text-indigo-500" /> Neural Formulas</h2>
              <div className="bg-[#FDF4DC]/50 border-2 border-dashed border-[#533A71]/10 rounded-[3rem] p-10 grid gap-6">
                {formulas.map((f, i) => (
                  <div key={i} className="group flex items-center justify-center p-8 bg-white rounded-3xl border border-[#533A71]/5 shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all">
                    <div className="text-3xl font-mono font-black text-[#533A71] tracking-widest">{f}</div>
                  </div>
                ))}
              </div>
            </motion.section>
          )}
        </div>

        {/* Right Column: Mastery Tools */}
        <div className="space-y-12">
          <motion.section variants={itemVariants} className="space-y-8">
            <h2 className="flex items-center gap-4 text-3xl font-black text-[#533A71] px-4"><Lightbulb size={32} className="text-amber-500" /> Memory Anchors</h2>
            <div className="grid gap-6">
              {memory_shortcuts?.map((m, i) => (
                <motion.div 
                  key={i} 
                  className="p-8 bg-white border border-[#533A71]/5 rounded-[2.5rem] shadow-xl shadow-[#533A71]/5 relative overflow-hidden group hover:border-[#533A71]/20 transition-all"
                  whileHover={{ y: -8 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
                      <Flame size={20} fill="currentColor" />
                    </div>
                    <span className="text-[11px] font-black text-amber-600 uppercase tracking-[0.2em]">{m.concept}</span>
                  </div>
                  <p className="text-2xl italic font-black text-[#533A71] leading-tight">"{m.trick}"</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          <motion.section variants={itemVariants} className="space-y-8">
            <h2 className="flex items-center gap-4 text-3xl font-black text-[#533A71] px-4"><HelpCircle size={32} className="text-emerald-500" /> Active Recall</h2>
            <div className="space-y-6">
              {exam_questions?.map((q, i) => (
                <div 
                  key={i} 
                  className={`p-8 rounded-[2.5rem] border-2 transition-all cursor-pointer select-none
                    ${revealedQuestions[i] ? 'bg-emerald-50 border-emerald-100 shadow-emerald-500/5' : 'bg-white border-[#533A71]/5 shadow-xl shadow-[#533A71]/5 hover:translate-x-2'}`}
                  onClick={() => toggleQuestion(i)}
                >
                  <div className="flex justify-between items-start mb-6">
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${revealedQuestions[i] ? 'bg-emerald-500 text-white' : 'bg-[#FDF4DC] text-[#533A71]'}`}>Question {i+1}</span>
                    {revealedQuestions[i] ? <CheckCircle2 size={24} className="text-emerald-500" /> : <ChevronRight size={24} className="text-[#A799B7]" />}
                  </div>
                  <p className="text-2xl font-black text-[#533A71] mb-6 leading-tight">{q.question}</p>
                  
                  <AnimatePresence>
                    {revealedQuestions[i] && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-6 border-t border-emerald-100 mt-6">
                          <div className="flex items-start gap-4 bg-white p-6 rounded-3xl border border-emerald-50 shadow-sm">
                            <ShieldAlert size={20} className="text-emerald-500 shrink-0 mt-1" />
                            <div className="space-y-2">
                              <span className="text-[10px] font-black uppercase text-emerald-500 tracking-widest">Synthesis Insight</span>
                              <p className="text-lg text-emerald-900 italic font-medium leading-relaxed">{q.answer_hint}</p>
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

          <motion.section variants={itemVariants} className="space-y-8">
            <h2 className="flex items-center gap-4 text-3xl font-black text-[#533A71] px-4"><Zap size={32} className="text-rose-500" /> Critical Insights</h2>
            <div className="bg-white border border-[#533A71]/5 rounded-[3rem] p-10 shadow-2xl shadow-[#533A71]/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                 <Zap size={120} className="text-[#533A71]" />
              </div>
              <div className="space-y-6 relative z-10">
                {last_minute_tips?.map((t, i) => (
                  <motion.div 
                    key={i} 
                    className="flex gap-5 p-6 bg-[#FDF4DC]/50 rounded-3xl border border-[#533A71]/5 hover:bg-[#FDF4DC] transition-all"
                    whileHover={{ x: 12 }}
                  >
                    <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0 shadow-sm">
                      <Zap size={24} fill="currentColor" />
                    </div>
                    <p className="text-lg font-black text-[#533A71] leading-relaxed">{t}</p>
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
