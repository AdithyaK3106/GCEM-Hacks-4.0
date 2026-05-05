import React from 'react';
import { motion } from 'framer-motion';
import { Check, Lock, Play, BookOpen, Trophy } from 'lucide-react';
import Card from '../components/ui/Card';
import './pages.css';

const pathNodes = [
  { id: 1, title: 'Introduction to AI', status: 'completed', type: 'video' },
  { id: 2, title: 'Neural Networks Basics', status: 'completed', type: 'quiz' },
  { id: 3, title: 'Forward Propagation', status: 'completed', type: 'notes' },
  { id: 4, title: 'Backpropagation Algorithm', status: 'active', type: 'review' },
  { id: 5, title: 'Gradient Descent', status: 'locked', type: 'video' },
  { id: 6, title: 'Module Mastery Test', status: 'locked', type: 'exam' },
];

const LearningPath = () => {
  return (
    <div className="page-transition max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Your Learning Path</h1>
        <p className="text-text-secondary">Customized based on your performance and goals.</p>
      </div>

      <div className="relative pl-8 md:pl-0">
        <div className="md:w-3/4 mx-auto">
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
                className={`path-node ${node.status}`}
              >
                <div className="node-icon">
                  {isCompleted && <Check size={14} />}
                  {isActive && <div className="w-2 h-2 rounded-full bg-accent-primary animate-pulse"></div>}
                  {isLocked && <Lock size={12} className="text-text-secondary" />}
                </div>
                
                <Card className={`ml-4 ${isLocked ? 'opacity-50' : ''} ${isActive ? 'border-accent-primary shadow-[0_0_15px_rgba(138,43,226,0.2)]' : ''}`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider mb-1 block text-text-muted">
                        {node.type === 'video' && <span className="flex items-center gap-1"><Play size={12}/> Lecture</span>}
                        {node.type === 'notes' && <span className="flex items-center gap-1"><BookOpen size={12}/> Notes</span>}
                        {node.type === 'quiz' && <span className="flex items-center gap-1 text-success">Quiz</span>}
                        {node.type === 'review' && <span className="flex items-center gap-1 text-warning">Targeted Review</span>}
                        {node.type === 'exam' && <span className="flex items-center gap-1 text-accent-primary"><Trophy size={12}/> Exam</span>}
                      </span>
                      <h3 className={`text-lg font-bold ${isActive ? 'text-accent-primary' : ''}`}>{node.title}</h3>
                    </div>
                    
                    {isActive && (
                      <button className="px-4 py-2 bg-accent-gradient rounded-full text-sm font-bold shadow-[0_0_10px_rgba(138,43,226,0.5)] transition-transform hover:scale-105">
                        Start
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
