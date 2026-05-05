import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, Target, BookOpen, ArrowRight, TrendingUp } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import './pages.css';

const Results = () => {
  const { quizData } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!quizData) {
      navigate('/dashboard');
    }
  }, [quizData, navigate]);

  if (!quizData) return null;

  const percentage = (quizData.score / quizData.total) * 100;
  
  return (
    <div className="page-transition max-w-4xl mx-auto py-8">
      <div className="text-center mb-12">
        <motion.div 
          initial={{ scale: 0 }} 
          animate={{ scale: 1 }} 
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-32 h-32 mx-auto bg-gradient-to-br from-accent-primary to-accent-secondary rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(138,43,226,0.5)]"
        >
          <Award size={64} className="text-white" />
        </motion.div>
        <h1 className="text-4xl font-bold mb-2">Quiz Completed!</h1>
        <p className="text-xl text-text-secondary">Here's how you performed.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="text-center py-8">
          <div className="text-5xl font-bold text-accent-primary mb-2">{quizData.score}/{quizData.total}</div>
          <p className="text-text-secondary">Correct Answers</p>
        </Card>
        <Card className="text-center py-8">
          <div className="text-5xl font-bold text-success mb-2">{percentage}%</div>
          <p className="text-text-secondary">Accuracy</p>
        </Card>
        <Card className="text-center py-8">
          <div className="text-5xl font-bold text-warning mb-2">+50</div>
          <p className="text-text-secondary">XP Earned</p>
        </Card>
      </div>

      <Card className="mb-8">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
          <Target size={24} className="text-danger" /> 
          Areas for Improvement
        </h3>
        
        <div className="space-y-4">
          <div className="p-4 bg-danger/5 border border-danger/20 rounded-lg">
            <h4 className="font-bold text-danger mb-2">Backpropagation Algorithm</h4>
            <p className="text-text-secondary text-sm mb-4">You missed a question related to weight updates during backpropagation. We've added this to your focus areas.</p>
            <Button variant="outline" className="text-sm py-1.5 px-3">Review Notes</Button>
          </div>
        </div>
      </Card>

      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
        <Button onClick={() => navigate('/learning-path')}>
          View Updated Path <ArrowRight size={18} className="ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default Results;
