import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, ArrowRight, CheckCircle, AlertCircle, Clock, Zap, Brain } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { submitQuiz } from '../services/zeroFrictionApi';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import ProgressBar from '../components/ui/ProgressBar';
import './pages.css';

const Quiz = () => {
  const { sessionId: paramSessionId } = useParams();
  const { sessionId: contextSessionId, quizQuestions, setQuizData, pipelineStep, setPipelineStep } = useAppContext();
  const sessionId = contextSessionId || paramSessionId;
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

  useEffect(() => {
    if (pipelineStep < 2 && quizQuestions.length === 0) {
      navigate('/upload');
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate, pipelineStep, quizQuestions]);

  const handleOptionSelect = (optionIdx) => {
    if (showFeedback) return;
    
    const timeTaken = Math.round((Date.now() - startTime) / 1000);
    const newAnswer = {
      question_id: quizQuestions[currentIndex].id,
      selected_option: optionIdx,
      time_taken: timeTaken,
      confidence: 1.0,
    };

    const newAnswers = [...answers];
    newAnswers[currentIndex] = newAnswer;
    setAnswers(newAnswers);
    setShowFeedback(true);
  };

  const nextQuestion = async () => {
    if (currentIndex < quizQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowFeedback(false);
      setStartTime(Date.now());
    } else {
      await handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const result = await submitQuiz(sessionId, answers);
      setQuizData(result);
      setPipelineStep(3);
      navigate(`/results/${sessionId}`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (quizQuestions.length === 0) return null;

  const currentQuestion = quizQuestions[currentIndex];
  const progress = ((currentIndex + 1) / quizQuestions.length) * 100;
  const currentAnswer = answers[currentIndex];
  const isCorrect = currentAnswer && currentAnswer.selected_option === currentQuestion.correct_idx;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#6D4AFF] text-white flex items-center justify-center shadow-lg shadow-[#6D4AFF]/20">
            <Brain size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-[#2D1E3E] tracking-tight">Mastery Check</h2>
            <p className="text-[#8B7CA3] text-xs font-black uppercase tracking-widest">Integrating Module {currentIndex + 1} of {quizQuestions.length}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 px-6 py-3 glass-card bg-white/40">
          <Clock size={20} className={timeLeft < 60 ? 'text-rose-500 animate-pulse' : 'text-[#2D1E3E]'} />
          <span className={`font-black text-2xl tabular-nums ${timeLeft < 60 ? 'text-rose-500' : 'text-[#2D1E3E]'}`}>
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      <ProgressBar progress={progress} className="mb-12 h-3 bg-white/20 rounded-full overflow-hidden shadow-inner border border-white/20" barClassName="bg-[#6D4AFF] shadow-[0_0_15px_rgba(109,74,255,0.5)]" />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          <Card className="p-10 border-white/30" hover={false}>
             <h3 className="text-3xl font-black text-[#2D1E3E] mb-10 leading-tight">{currentQuestion.text}</h3>
             
             <div className="grid grid-cols-1 gap-4">
               {currentQuestion.options.map((option, idx) => {
                 let statusClass = "bg-white/40 border-white/40 text-[#5A4A6B] hover:bg-white/60";
                 if (showFeedback) {
                   if (idx === currentQuestion.correct_idx) statusClass = "bg-[#16A34A] text-white border-[#16A34A] shadow-lg shadow-[#16A34A]/20";
                   else if (currentAnswer?.selected_option === idx) statusClass = "bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-500/20";
                   else statusClass = "bg-white/10 opacity-40 border-transparent cursor-not-allowed";
                 } else if (currentAnswer?.selected_option === idx) {
                   statusClass = "bg-[#6D4AFF] text-white border-[#6D4AFF] shadow-lg shadow-[#6D4AFF]/20";
                 }

                 return (
                   <button
                     key={idx}
                     onClick={() => handleOptionSelect(idx)}
                     disabled={showFeedback}
                     className={`w-full p-6 text-left rounded-xl font-bold text-xl transition-all border flex items-center justify-between group active:scale-[0.98] ${statusClass}`}
                   >
                     <span className="flex items-center gap-5">
                        <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black border transition-all ${
                          showFeedback && idx === currentQuestion.correct_idx ? 'bg-white/20 border-white/20' : 
                          currentAnswer?.selected_option === idx ? 'bg-white/20 border-white/20' : 'bg-[#2D1E3E]/5 border-[#2D1E3E]/10 text-[#2D1E3E]'
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        {option}
                     </span>
                     {showFeedback && idx === currentQuestion.correct_idx && <CheckCircle size={28} className="text-white" />}
                   </button>
                 );
               })}
             </div>
          </Card>

          <AnimatePresence>
            {showFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className={`p-8 glass-card border-none flex flex-col md:flex-row items-start gap-8 ${isCorrect ? 'bg-[#16A34A]/10' : 'bg-rose-500/10'}`}>
                  <div className={`p-5 rounded-2xl ${isCorrect ? 'bg-[#16A34A]' : 'bg-rose-500'} text-white shadow-xl shadow-current/20`}>
                    {isCorrect ? <Zap size={40} /> : <AlertCircle size={40} />}
                  </div>
                  <div className="flex-1">
                    <h4 className={`text-3xl font-black mb-3 ${isCorrect ? 'text-[#16A34A]' : 'text-rose-600'}`}>
                      {isCorrect ? 'Precision Achieved!' : 'Growth Opportunity'}
                    </h4>
                    <p className="text-xl font-medium leading-relaxed text-[#5A4A6B]">
                      {currentQuestion.explanation || "This concept focuses on the core mechanics of AI inference and pattern recognition."}
                    </p>
                  </div>
                </div>

                <div className="flex justify-center pt-6">
                  <Button 
                    onClick={nextQuestion} 
                    disabled={isSubmitting}
                    variant="accent"
                    className="px-24 py-8 text-3xl h-auto"
                  >
                    {isSubmitting ? 'Syncing...' : currentIndex === quizQuestions.length - 1 ? 'Finalize Synthesis' : 'Next Integration'}
                    <ArrowRight size={32} className="ml-6" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Quiz;
