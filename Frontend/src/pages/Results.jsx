import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, Target, ArrowRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import './pages.css';

const Results = () => {
  const { quizData, sessionId } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!quizData) {
      navigate('/dashboard');
    }
  }, [quizData, navigate]);

  if (!quizData) return null;

  const percentage = Math.round((quizData.score / (quizData.total || 1)) * 100);
  const misconception = quizData.answers?.find((answer) => answer.learner_state.state_label === 'MISCONCEPTION');
  
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
          {quizData.answers && quizData.answers.filter(a => !a.is_correct).length > 0 ? (
            quizData.answers.filter(a => !a.is_correct).map((ans, idx) => (
              <div key={idx} className="p-4 bg-accent-primary/5 border border-accent-primary/20 rounded-lg">
                <h4 className="font-bold text-accent-primary mb-2">
                  {ans.learner_state.state_label === 'MISCONCEPTION' ? "Critical Misconception Detected" : "Area for Reinforcement"}
                </h4>
                {ans.explanation?.correct_concept && (
                  <div className="mb-3 p-3 bg-black/20 rounded-md border border-white/5">
                    <p className="text-xs uppercase tracking-wider text-text-secondary mb-1">Target Concept</p>
                    <p className="text-sm text-white">{ans.explanation.correct_concept}</p>
                  </div>
                )}
                {ans.explanation?.why_wrong && (
                  <p className="text-text-primary text-sm mb-3">
                    <span className="text-danger font-medium">Diagnostic:</span> {ans.explanation.why_wrong}
                  </p>
                )}
                <p className="text-text-secondary text-sm mb-4 italic">
                  "{ans.recommendation?.label || "We've identified a subtle area for reinforcement based on your response pattern."}"
                </p>
                <Button variant="outline" className="text-sm py-1.5 px-3" onClick={() => navigate(`/notes/${sessionId}`)}>
                  Retrain Concept
                </Button>
              </div>
            ))
          ) : (
            <div className="p-6 bg-success/10 border border-success/20 rounded-lg text-center">
              <p className="text-success font-bold text-lg mb-1">Flawless Mastery</p>
              <p className="text-text-secondary text-sm">You answered all questions correctly. Keep up the excellent work!</p>
            </div>
          )}
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
