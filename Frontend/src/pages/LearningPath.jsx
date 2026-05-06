import React from 'react';
import { motion } from 'framer-motion';
import { Check, CheckCircle, Lock, Play, BookOpen, Trophy, ArrowRight, Zap, Target } from 'lucide-react';
import Card from '../components/ui/Card';
import './pages.css';

const pathNodes = [
  { id: 1, title: 'Introduction to AI', status: 'completed', type: 'video', duration: '12m' },
  { id: 2, title: 'Neural Networks Basics', status: 'completed', type: 'quiz', duration: '5m' },
  { id: 3, title: 'Forward Propagation', status: 'completed', type: 'notes', duration: '15m' },
  { id: 4, title: 'Backpropagation Algorithm', status: 'active', type: 'review', duration: '20m' },
  { id: 5, title: 'Gradient Descent', status: 'locked', type: 'video', duration: '10m' },
  { id: 6, title: 'Module Mastery Test', status: 'locked', type: 'exam', duration: '30m' },
];

const LearningPath = () => {
  return (
    <div className="page-transition max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#2D1E3E]/5 text-[#2D1E3E] rounded-lg text-xs font-black uppercase tracking-widest mb-6 border border-[#2D1E3E]/10">
          <Zap size={14} fill="currentColor" /> Mastery Roadmap
        </div>
        <h1 className="text-5xl font-black mb-4 text-[#2D1E3E] tracking-tight">
          Your Neural <span className="text-[#6D4AFF]">Path</span>
        </h1>
        <p className="text-[#5A4A6B] text-lg font-medium">Customized based on your ACT cognitive profile.</p>
      </div>

      <div className="relative">
        {/* Connection Line */}
        <div className="absolute left-10 top-0 bottom-0 w-1 bg-[#2D1E3E]/10 rounded-full hidden md:block"></div>

        <div className="space-y-12 relative z-10">
          {pathNodes.map((node, index) => {
            const isCompleted = node.status === 'completed';
            const isActive = node.status === 'active';
            const isLocked = node.status === 'locked';

            return (
              <motion.div 
                key={node.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-start gap-8 ${isLocked ? 'opacity-40' : ''}`}
              >
                {/* Node Indicator */}
                <div className={`w-20 flex-shrink-0 flex justify-center pt-2 hidden md:flex`}>
                  <div className={`w-14 h-14 rounded-lg flex items-center justify-center transition-all shadow-md ${
                    isCompleted ? 'bg-[#16A34A] text-white shadow-[#16A34A]/20' : 
                    isActive ? 'bg-[#2D1E3E] text-white shadow-[#2D1E3E]/20 scale-125' : 
                    'bg-white text-[#8B7CA3] border-2 border-[#2D1E3E]/5'
                  }`}>
                    {isCompleted ? <Check size={28} strokeWidth={3} /> : 
                     isActive ? <Target size={28} className="animate-pulse" /> : 
                     <Lock size={24} />}
                  </div>
                </div>
                
                <Card className={`flex-1 p-10 bg-white border border-gray-100 shadow-md rounded-xl transition-all hover:translate-x-3 ${
                  isActive ? 'ring-2 ring-[#6D4AFF]/20' : ''
                }`}>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <span className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border border-gray-100 ${
                          node.type === 'video' ? 'bg-[#F5EFE6] text-[#2D1E3E]' :
                          node.type === 'quiz' ? 'bg-green-50 text-[#16A34A]' :
                          node.type === 'notes' ? 'bg-indigo-50 text-indigo-600' :
                          node.type === 'review' ? 'bg-amber-50 text-amber-600' :
                          'bg-rose-50 text-rose-600'
                        }`}>
                          {node.type} • {node.duration}
                        </span>
                        {isCompleted && (
                          <span className="text-[10px] font-black text-[#16A34A] uppercase tracking-widest flex items-center gap-2">
                            <Check size={14} /> Mastered
                          </span>
                        )}
                      </div>
                      <h3 className={`text-3xl font-black ${isActive ? 'text-[#2D1E3E]' : 'text-[#2D1E3E]'}`}>{node.title}</h3>
                      <p className="text-[#8B7CA3] font-bold mt-2 text-base">
                        {isLocked ? 'Complete previous modules to unlock synthesis' : 'Neural path optimized for peak retention'}
                      </p>
                    </div>
                    
                    {!isLocked && (
                      <button className={`px-10 py-4 rounded-lg text-base font-black transition-all flex items-center gap-3 ${
                        isCompleted ? 'bg-[#F5EFE6] text-[#2D1E3E] border border-gray-100 shadow-sm' : 'bg-[#6D4AFF] text-white shadow-md hover:opacity-90'
                      }`}>
                        {isCompleted ? 'Review Core' : 'Resume Mastery'} <ArrowRight size={22} />
                      </button>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LearningPath;
