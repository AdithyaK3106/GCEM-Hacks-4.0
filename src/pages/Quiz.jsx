import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, CheckCircle, XCircle, BrainCircuit } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import ProgressBar from '../components/ui/ProgressBar';
import './pages.css';

const mockQuestions = [
  {
    id: 1,
    question: "What is the primary function of an activation function in a neural network?",
    options: [
      "To initialize weights",
      "To introduce non-linearity into the network",
      "To calculate the loss",
      "To normalize the input data"
    ],
    correctAnswer: 1
  },
  {
    id: 2,
    question: "Which algorithm is commonly used to update weights during training?",
    options: [
      "K-Means Clustering",
      "Principal Component Analysis",
      "Gradient Descent",
      "Support Vector Machines"
    ],
    correctAnswer: 2
  }
];

const Quiz = () => {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const { updateProgress, setQuizData } = useAppContext();
  const navigate = useNavigate();

  const currentQuestion = mockQuestions[currentQuestionIdx];
  const isLastQuestion = currentQuestionIdx === mockQuestions.length - 1;

  const handleSelectOption = (idx) => {
    if (!isAnswered) {
      setSelectedOption(idx);
    }
  };

  const handleSubmit = () => {
    if (!isAnswered) {
      setIsAnswered(true);
      if (selectedOption === currentQuestion.correctAnswer) {
        setScore(score + 1);
      }
    } else {
      if (isLastQuestion) {
        // Finish quiz
        setQuizData({
          score: score + (selectedOption === currentQuestion.correctAnswer ? 1 : 0),
          total: mockQuestions.length
        });
        updateProgress(50); // XP reward for completing quiz
        navigate('/results');
      } else {
        // Next question
        setCurrentQuestionIdx(currentQuestionIdx + 1);
        setSelectedOption(null);
        setIsAnswered(false);
      }
    }
  };

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
          <span>Question {currentQuestionIdx + 1} of {mockQuestions.length}</span>
          <span>{Math.round((currentQuestionIdx / mockQuestions.length) * 100)}% Completed</span>
        </div>
        <ProgressBar progress={(currentQuestionIdx / mockQuestions.length) * 100} />
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
                {currentQuestion.question}
              </h2>
              
              <div className="space-y-3 mb-8">
                {currentQuestion.options.map((option, idx) => {
                  let btnClass = "option-btn";
                  let icon = null;
                  
                  if (isAnswered) {
                    if (idx === currentQuestion.correctAnswer) {
                      btnClass += " bg-success/20 border-success text-white";
                      icon = <CheckCircle className="text-success" size={20} />;
                    } else if (idx === selectedOption) {
                      btnClass += " bg-danger/20 border-danger text-white";
                      icon = <XCircle className="text-danger" size={20} />;
                    }
                  } else if (selectedOption === idx) {
                    btnClass += " selected";
                  }

                  return (
                    <button
                      key={idx}
                      className={btnClass}
                      onClick={() => handleSelectOption(idx)}
                      disabled={isAnswered}
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

              <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/10">
                <p className="text-text-secondary text-sm">
                  {isAnswered && (
                    selectedOption === currentQuestion.correctAnswer 
                      ? <span className="text-success font-medium">Excellent! That's correct.</span> 
                      : <span className="text-danger font-medium">Not quite. Review this concept later.</span>
                  )}
                </p>
                <Button 
                  onClick={handleSubmit} 
                  disabled={selectedOption === null}
                  variant={isAnswered ? "primary" : "outline"}
                >
                  {!isAnswered ? "Submit Answer" : (isLastQuestion ? "View Results" : "Next Question")}
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
