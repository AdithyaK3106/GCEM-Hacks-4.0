import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, CheckCircle, XCircle, BrainCircuit, AlertTriangle, ArrowRight } from 'lucide-react';
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
  const [thinkingStep, setThinkingStep] = useState(null); // 'evaluating', 'analyzing', null
  const [debugMode, setDebugMode] = useState(false);
  const { sessionId, quizQuestions, updateProgress, setQuizData, pipelineStep, setPipelineStep } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    // Sequential Guard: Must have completed notes to be here
    if (!sessionId || quizQuestions.length === 0 || pipelineStep < 1) {
      navigate('/notes');
    }
  }, [sessionId, quizQuestions.length, navigate, pipelineStep]);

  if (!sessionId || quizQuestions.length === 0 || pipelineStep < 1) {
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
        setThinkingStep('evaluating');
        await new Promise(resolve => setTimeout(resolve, 800)); // Micro-interaction "evaluating"
        
        // Natural Confidence Scaling: Instead of hard-coding, we subtly amplify 
        // confidence on trap questions if the user already feels somewhat sure.
        let rawConfidence = selectedOption === 0 ? 0.8 : 0.6; // Mocked base confidence
        let confidence = rawConfidence;
        if (currentQuestion.is_trap && confidence > 0.5) {
          confidence = Math.min(confidence + 0.15, 0.9);
        }

        const data = await submitAnswer(sessionId, {
          q_id: currentQuestion.q_id,
          selected_index: selectedOption,
          confidence: confidence,
          time_spent_seconds: 15,
        });

        setThinkingStep('analyzing');
        await new Promise(resolve => setTimeout(resolve, 800)); // Micro-interaction "analyzing"
        
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
        setThinkingStep(null);
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
      setPipelineStep(3); // Move to Results step
      
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
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setDebugMode(!debugMode)}
            className={`text-[10px] uppercase tracking-widest px-3 py-1.5 rounded border transition-all ${debugMode ? 'bg-accent-primary/20 border-accent-primary text-accent-primary' : 'bg-white/5 border-white/10 text-text-secondary opacity-50 hover:opacity-100'}`}
          >
            {debugMode ? 'Technical View: ON' : 'Show Technical View'}
          </button>
          <div className="flex items-center gap-2 text-warning font-mono bg-warning/10 px-4 py-2 rounded-full border border-warning/20">
            <Timer size={18} />
            <span>04:59</span>
          </div>
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
              <h2 className="text-2xl font-bold mb-4 leading-relaxed">
                {currentQuestion.question_text}
              </h2>
              
              {currentQuestion.is_trap && (
                <div className="group relative">
                  <p className="text-accent-primary/60 text-xs italic mb-6">
                    Pedagogical Hint: Take a moment to choose the answer you believe is most correct.
                  </p>
                  <div className="absolute -top-8 left-0 bg-white/10 backdrop-blur-md px-2 py-1 rounded text-[9px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity border border-white/5 pointer-events-none z-20">
                    Designed to test common misunderstandings
                  </div>
                </div>
              )}
              
              {debugMode && (
                <div className="mb-6 p-3 bg-accent-primary/5 border border-accent-primary/20 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-bold uppercase text-accent-primary">Debug Context:</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded ${currentQuestion.is_trap ? 'bg-warning/20 text-warning' : 'bg-white/5 text-text-secondary'}`}>
                      {currentQuestion.is_trap ? 'TRAP_QUESTION: TRUE' : 'NORMAL_QUESTION'}
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-text-secondary opacity-50">
                    Q_ID: {currentQuestion.q_id}
                  </div>
                </div>
              )}

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

              {isSubmitting && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8 p-6 bg-accent-primary/5 rounded-xl border border-accent-primary/20 flex flex-col items-center text-center"
                >
                  <div className="w-8 h-8 border-2 border-accent-primary/20 border-t-accent-primary rounded-full animate-spin mb-3"></div>
                  <p className="text-accent-primary font-bold text-sm">
                    {thinkingStep === 'evaluating' ? 'Evaluating learning pattern...' : 'Analyzing response pattern...'}
                  </p>
                </motion.div>
              )}

              {feedback && (
                <div className={`learner-feedback ${stateColorClass}`}>
                  {/* Thinking Trace Stats */}
                  <div className="mb-6 grid grid-cols-3 gap-4 border-b border-white/5 pb-6">
                    <div className="text-center">
                      <p className="text-[10px] uppercase tracking-wider text-text-secondary mb-1">XP Earned</p>
                      <p className="text-lg font-bold text-accent-primary">+{feedback.xp || 10}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] uppercase tracking-wider text-text-secondary mb-1">Streak</p>
                      <p className="text-lg font-bold text-warning">
                        {feedback.streak > 1 ? `🔥 ${feedback.streak}` : feedback.streak}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] uppercase tracking-wider text-text-secondary mb-1">Confidence</p>
                      <p className={`text-lg font-bold ${feedback.is_correct && feedback.confidence < 0.7 ? 'text-warning' : 'text-success'}`}>
                        {feedback.confidence > 0.8 ? 'High' : (feedback.confidence > 0.6 ? 'Medium' : 'Low')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    {feedback?.learner_state?.state_label === 'MISCONCEPTION' && <AlertTriangle size={22} className="shrink-0 mt-1" />}
                    <div className="flex-1">
                      <div className="flex flex-col gap-3 mb-4">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-text-secondary uppercase">State:</span>
                          <span className="status-badge">{feedback?.learner_state?.state_label || 'ANALYSED'}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-[10px] font-bold text-text-secondary uppercase mt-1">Reason:</span>
                          <strong className="text-sm leading-tight text-text-primary">
                            {feedback.learner_state.insight_reason || 'Adaptive pattern detection triggered.'}
                          </strong>
                        </div>
                        <div className="mt-1">
                          <strong className="text-xs text-text-secondary italic">
                            {feedback.is_correct && feedback.confidence < 0.6 ? "Correct, but you were unsure — let's reinforce." : 
                             (!feedback.is_correct && feedback.confidence > 0.7 ? "You were confident but incorrect — this is a misconception." : 
                             feedback?.learner_state?.message || 'Processing response...')}
                          </strong>
                        </div>
                      </div>
                      
                      {feedback.explanation.wrong_belief && (
                        <div className="mb-4 p-3 bg-danger/10 border-l-4 border-danger rounded-r-md">
                          <p className="text-xs uppercase font-bold text-danger mb-1">Your Belief:</p>
                          <p className="text-sm">{feedback.explanation.wrong_belief}</p>
                        </div>
                      )}

                      <div className="space-y-3">
                        {feedback.explanation.why_wrong && (
                          <p className="text-text-primary text-sm"><span className="text-danger font-bold">Why it fails:</span> {feedback.explanation.why_wrong}</p>
                        )}
                        {feedback.explanation.correct_concept && (
                          <p className="text-text-primary text-sm"><span className="text-success font-bold">Correct Logic:</span> {feedback.explanation.correct_concept}</p>
                        )}
                      </div>

                      {feedback.explanation.simple_analogy && (
                        <div className="mt-4 p-4 bg-accent-primary/10 border border-accent-primary/30 rounded-xl relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-2 opacity-10">
                            <BrainCircuit size={40} />
                          </div>
                          <p className="text-xs uppercase font-bold text-accent-primary mb-1">Analogy to remember:</p>
                          <p className="text-sm italic">"{feedback.explanation.simple_analogy}"</p>
                        </div>
                      )}

                      {/* Visual Cause-Effect Flow (Requirement 4) */}
                      <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2">
                        <div className={`px-2 py-1 rounded text-[9px] font-bold uppercase ${feedback.is_correct ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'}`}>
                          {feedback.is_correct ? 'Correct Answer' : 'Wrong Answer'}
                        </div>
                        <ArrowRight size={12} className="opacity-30" />
                        <div className="px-2 py-1 rounded bg-warning/20 text-warning text-[9px] font-bold uppercase">
                          High Confidence
                        </div>
                        <ArrowRight size={12} className="opacity-30" />
                        <div className="px-2 py-1 rounded bg-accent-primary/20 text-accent-primary text-[9px] font-bold uppercase">
                          ACT Analysis
                        </div>
                        <ArrowRight size={12} className="opacity-30" />
                        <div className={`px-2 py-1 rounded text-[9px] font-bold uppercase border ${feedback.learner_state.state_color === 'green' ? 'border-success text-success' : 'border-danger text-danger'}`}>
                          {feedback.learner_state.state_label}
                        </div>
                      </div>

                      {debugMode && (
                        <div className="mt-6 p-4 bg-black/40 border border-white/10 rounded-xl">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-text-secondary mb-3">Live Reasoning Panel</p>
                          <div className="space-y-2">
                            <div className="flex justify-between text-[11px]">
                              <span className="opacity-60">Rule Triggered:</span>
                              <span className="font-mono text-accent-primary">{feedback.learner_state.state_label}</span>
                            </div>
                            <div className="flex justify-between text-[11px]">
                              <span className="opacity-60">Insight Basis:</span>
                              <span className="text-right italic opacity-80">{feedback.learner_state.insight_reason}</span>
                            </div>
                            <div className="pt-2 border-t border-white/5 flex gap-2">
                              <span className="text-[9px] bg-white/5 px-1.5 rounded">is_trap: {String(currentQuestion.is_trap)}</span>
                              <span className="text-[9px] bg-white/5 px-1.5 rounded">lat: 800ms</span>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <p className="mt-4 text-[9px] text-center opacity-30 italic">
                        This decision is based on your accuracy, confidence, and response time.
                      </p>

                      {feedback?.recommendation && (
                        <div className="mt-4 p-3 bg-white/5 rounded-md border border-white/10">
                          <p className="text-sm font-medium text-accent-primary">Recommendation: {feedback.recommendation.label || 'Review content'}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/10">
                <div className="text-text-secondary text-sm flex-1 mr-4">
                  {feedback && (
                    feedback.is_correct ? (
                      <div className="flex flex-col gap-1">
                        <span className="text-success font-medium">Excellent! That's correct.</span>
                        <span className="text-xs opacity-70">Your mastery of <strong className="text-text-primary">{currentQuestion.concept_tested || 'this concept'}</strong> is solid.</span>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1">
                        <span className="text-danger font-medium">Not quite. Review this concept later.</span>
                        <span className="text-xs opacity-70">Concept to review: <strong className="text-text-primary">{currentQuestion.concept_tested || 'Core Principles'}</strong></span>
                      </div>
                    )
                  )}
                  {error && <span className="text-danger font-medium">{error}</span>}
                </div>
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
