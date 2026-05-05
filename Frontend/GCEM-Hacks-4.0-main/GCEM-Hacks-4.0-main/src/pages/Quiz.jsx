import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, CheckCircle, XCircle, BrainCircuit, AlertTriangle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { submitAnswer } from '../services/zeroFrictionApi';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import ProgressBar from '../components/ui/ProgressBar';
import './pages.css';

const Quiz = () => {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(() => {
    const saved = localStorage.getItem('quiz_current_idx');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [score, setScore] = useState(() => {
    const saved = localStorage.getItem('quiz_score');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [answers, setAnswers] = useState(() => {
    const saved = localStorage.getItem('quiz_answers');
    return saved ? JSON.parse(saved) : [];
  });
  const [error, setError] = useState('');
  const { sessionId, quizQuestions, updateProgress, setQuizData } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionId || quizQuestions.length === 0) {
      navigate('/notes');
    }
  }, [sessionId, quizQuestions.length, navigate]);

  if (!sessionId || quizQuestions.length === 0) {
    return null;
  }

  const currentQuestion = quizQuestions[currentQuestionIdx];
  const isLastQuestion = currentQuestionIdx === quizQuestions.length - 1;

  const handleSelectOption = (idx) => {
    if (!feedback) {
      setSelectedOption(idx);
    }
  };

  const handleSubmit = async () => {
    if (!feedback) {
      setIsSubmitting(true);
      setError('');

      try {
        await new Promise(resolve => setTimeout(resolve, 800)); // Micro-interaction "thinking" delay
        const data = await submitAnswer(sessionId, {
          q_id: currentQuestion.q_id,
          selected_index: selectedOption,
          confidence: selectedOption === 0 ? 0.9 : 0.7,
          time_spent_seconds: 15,
        });
        setFeedback(data);
        const newAnswers = [...answers, data];
        setAnswers(newAnswers);
        localStorage.setItem('quiz_answers', JSON.stringify(newAnswers));
        
        if (data.is_correct) {
          const newScore = score + 1;
          setScore(newScore);
          localStorage.setItem('quiz_score', newScore.toString());
        }
      } catch (err) {
        setError(err.message || 'Unable to submit answer.');
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (isLastQuestion) {
      setQuizData({
        score,
        total: quizQuestions.length,
        answers,
        latest_feedback: feedback,
      });
      updateProgress(50);
      
      // Clear quiz progress on completion
      localStorage.removeItem('quiz_current_idx');
      localStorage.removeItem('quiz_score');
      localStorage.removeItem('quiz_answers');
      
      navigate('/results');
      return;
    }

    const nextIdx = currentQuestionIdx + 1;
    setCurrentQuestionIdx(nextIdx);
    localStorage.setItem('quiz_current_idx', nextIdx.toString());
    setSelectedOption(null);
    setFeedback(null);
  };

  const stateColorClass = feedback ? `state-${feedback.learner_state.state_color}` : '';

  return (
    <div className="page-transition flex flex-col h-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <BrainCircuit className="text-accent-primary" /> Mastery Check
          </h1>
          <p className="text-text-secondary">Testing your knowledge on Neural Networks.</p>
        </div>
        <div className="flex items-center gap-2 text-warning font-mono bg-warning/10 px-4 py-2 rounded-full border border-warning/20">
          <Timer size={18} />
          <span>04:59</span>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between text-sm text-text-secondary mb-2">
          <span>Question {currentQuestionIdx + 1} of {quizQuestions.length}</span>
          <span>{Math.round((currentQuestionIdx / quizQuestions.length) * 100)}% Completed</span>
        </div>
        <ProgressBar progress={(currentQuestionIdx / quizQuestions.length) * 100} />
      </div>

      <div className="flex-1 flex items-center justify-center py-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIdx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <Card className="quiz-card relative overflow-hidden p-8 md:p-12">
              <h2 className="text-2xl font-bold mb-8 leading-relaxed">
                {currentQuestion.question_text}
              </h2>

              <div className="space-y-3 mb-8">
                {currentQuestion.options.map((option, idx) => {
                  let btnClass = 'option-btn';
                  let icon = null;

                  if (feedback) {
                    if (idx === feedback.correct_index) {
                      btnClass += ' bg-success/20 border-success text-white';
                      icon = <CheckCircle className="text-success" size={20} />;
                    } else if (idx === selectedOption) {
                      btnClass += ' bg-danger/20 border-danger text-white';
                      icon = <XCircle className="text-danger" size={20} />;
                    }
                  } else if (selectedOption === idx) {
                    btnClass += ' selected';
                  }

                  return (
                    <button
                      key={idx}
                      className={btnClass}
                      onClick={() => handleSelectOption(idx)}
                      disabled={!!feedback}
                    >
                      <div className="flex-1 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-sm font-medium border border-white/10 shrink-0">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{option}</span>
                      </div>
                      {icon}
                    </button>
                  );
                })}
              </div>

              {feedback && (
                <div className={`learner-feedback ${stateColorClass}`}>
                  <div className="flex items-start gap-3">
                    {feedback.learner_state.state_label === 'MISCONCEPTION' && <AlertTriangle size={22} />}
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="status-badge">{feedback.learner_state.state_label}</span>
                        <strong>{feedback.learner_state.message}</strong>
                      </div>
                      <p>{feedback.explanation.text}</p>
                      {feedback.explanation.misconception_warning && (
                        <p className="mt-2 font-medium">{feedback.explanation.misconception_warning}</p>
                      )}
                      {feedback.recommendation && (
                        <div className="mt-4 p-3 bg-white/5 rounded-md border border-white/10">
                          <p className="text-sm font-medium text-accent-primary">Recommendation: {feedback.recommendation.label}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/10">
                <p className="text-text-secondary text-sm">
                  {feedback && (
                    feedback.is_correct
                      ? <span className="text-success font-medium">Excellent! That's correct.</span>
                      : <span className="text-danger font-medium">Not quite. Review this concept later.</span>
                  )}
                  {error && <span className="text-danger font-medium">{error}</span>}
                </p>
                <Button
                  onClick={handleSubmit}
                  disabled={selectedOption === null || isSubmitting}
                  variant={feedback ? 'primary' : 'outline'}
                >
                  {isSubmitting ? 'Thinking...' : (!feedback ? 'Submit Answer' : (isLastQuestion ? 'View Results' : feedback.learner_state.action_label))}
                </Button>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Quiz;
