import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, Target, ArrowRight, Zap, Flame, Brain, BookOpen } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { getSessionSummary, getFlashcards } from '../services/zeroFrictionApi';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import './pages.css';

const Results = () => {
  const { quizData, sessionId } = useAppContext();
  const [summary, setSummary] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [showFlashcards, setShowFlashcards] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!quizData) {
      navigate('/dashboard');
      return;
    }

    const fetchData = async () => {
      const summaryData = await getSessionSummary(sessionId);
      setSummary(summaryData);
      const cards = await getFlashcards(sessionId);
      setFlashcards(cards);
    };
    fetchData();
  }, [quizData, navigate, sessionId]);

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
        <p className="text-xl text-text-secondary">Here's your intelligence-driven learning summary.</p>
        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] uppercase font-bold tracking-widest text-text-secondary">
          <span className="w-2 h-2 bg-success rounded-full"></span> Language: Hindi
        </div>
      </div>

      {/* Fix 1: Performance Dashboard */}
      <div className="summary-dashboard">
        <Card className="summary-card">
          <div className="summary-val text-accent-primary">{summary?.xp || 0}</div>
          <p className="summary-label">XP Earned</p>
        </Card>
        <Card className="summary-card warning">
          <div className="summary-val text-warning flex items-center justify-center gap-2">
            <Flame size={24} /> {summary?.streak || 0}
          </div>
          <p className="summary-label">Day Streak</p>
        </Card>
        <Card className="summary-card success">
          <div className="summary-val text-success">{summary?.accuracy || 0}%</div>
          <p className="summary-label">Session Accuracy</p>
        </Card>
        <Card className="summary-card danger">
          <div className="summary-val text-danger">{summary?.misconceptions || 0}</div>
          <p className="summary-label">Misconceptions</p>
        </Card>
      </div>

      {/* Fix 2: Recommendation Engine Visualization */}
      <Card className="mb-8" style={{ borderLeft: '4px solid var(--accent-primary)', backgroundColor: 'rgba(138,43,226,0.05)' }}>
        <div className="flex" style={{ alignItems: 'flex-start', gap: '1rem' }}>
          <div className="p-3 bg-accent-primary/20 rounded-xl" style={{ color: 'var(--accent-primary)', backgroundColor: 'rgba(138,43,226,0.1)' }}>
            <Brain size={32} />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">Mastery Path Recommendation</h3>
            <p className="text-text-primary mb-4 leading-relaxed">
              {summary?.recommendation || "Based on your cognitive patterns, we've adjusted your learning path to optimize retention."}
            </p>
            <div className="flex gap-2">
              <span className="badge badge-primary" style={{ padding: '0.25rem 0.75rem', backgroundColor: 'rgba(138,43,226,0.1)', color: 'var(--accent-primary)', fontSize: '10px', fontWeight: '700', borderRadius: '9999px', textTransform: 'uppercase' }}>Cognitive Action: Reteach</span>
              <span className="badge badge-secondary" style={{ padding: '0.25rem 0.75rem', backgroundColor: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', fontSize: '10px', fontWeight: '700', borderRadius: '9999px', border: '1px solid rgba(255,255,255,0.1)', textTransform: 'uppercase' }}>Priority: Critical</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Fix 4: Flashcard View Toggle */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <BookOpen size={20} className="text-accent-primary" /> Dynamic Flashcards
          </h3>
          <Button variant="outline" className="text-xs py-1.5" onClick={() => setShowFlashcards(!showFlashcards)}>
            {showFlashcards ? "Hide Flashcards" : "View Practice Cards"}
          </Button>
        </div>
        
        {showFlashcards && (
          <div className="flashcards-grid">
            {flashcards.map((card, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flashcard-wrapper"
              >
                <div className="flashcard-inner">
                  {/* Front */}
                  <div className="flashcard-front">
                    <span className="summary-label mb-2">Question</span>
                    <p className="font-bold text-lg">{card.front}</p>
                  </div>
                  {/* Back */}
                  <div className="flashcard-back">
                    <span className="text-[10px] uppercase tracking-widest text-white/60 mb-2">Answer</span>
                    <p className="text-sm font-medium">{card.back}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
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
