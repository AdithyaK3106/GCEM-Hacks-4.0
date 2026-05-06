import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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

  return (
    <div className="page-transition">
      <div className="text-center mb-12">
        <motion.div 
          initial={{ scale: 0 }} 
          animate={{ scale: 1 }} 
          className="w-40 h-40 mx-auto bg-[#2D1E3E] rounded-xl flex items-center justify-center mb-10 shadow-lg"
        >
          <Award size={80} className="text-white" />
        </motion.div>
        <h1 className="text-5xl font-black mb-4 text-[#2D1E3E] tracking-tight">Synthesis Complete</h1>
        <p className="text-xl text-[#5A4A6B] font-bold">Your cognitive mastery profile has been updated.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
        <Card className="flex flex-col items-center justify-center p-8 bg-white border border-gray-100 shadow-md rounded-xl hover:translate-y-[-2px] transition-all">
          <div className="text-4xl font-black text-[#6D4AFF] mb-2">{summary?.xp || 0}</div>
          <p className="text-[10px] font-black text-[#8B7CA3] uppercase tracking-widest">XP Acquired</p>
        </Card>
        <Card className="flex flex-col items-center justify-center p-8 bg-white border border-gray-100 shadow-md rounded-xl hover:translate-y-[-2px] transition-all">
          <div className="text-4xl font-black text-amber-500 mb-2 flex items-center gap-2">
            <Flame size={32} fill="currentColor" /> {summary?.streak || 0}
          </div>
          <p className="text-[10px] font-black text-[#8B7CA3] uppercase tracking-widest">Day Streak</p>
        </Card>
        <Card className="flex flex-col items-center justify-center p-8 bg-white border border-gray-100 shadow-md rounded-xl hover:translate-y-[-2px] transition-all">
          <div className="text-4xl font-black text-[#16A34A] mb-2">{summary?.accuracy || 0}%</div>
          <p className="text-[10px] font-black text-[#8B7CA3] uppercase tracking-widest">Precision</p>
        </Card>
        <Card className="flex flex-col items-center justify-center p-8 bg-white border border-gray-100 shadow-md rounded-xl hover:translate-y-[-2px] transition-all">
          <div className="text-4xl font-black text-rose-500 mb-2">{summary?.misconceptions || 0}</div>
          <p className="text-[10px] font-black text-[#8B7CA3] uppercase tracking-widest">Gaps Found</p>
        </Card>
      </div>

      <Card className="mb-12 p-10 border-l-8 border-[#2D1E3E] bg-white rounded-xl shadow-md border-t border-r border-b border-gray-100">
        <div className="flex flex-col md:flex-row items-start gap-8">
          <div className="p-5 bg-[#2D1E3E] text-white rounded-lg shadow-sm">
            <Brain size={40} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <h3 className="text-3xl font-black text-[#2D1E3E]">Adaptive Learning Path</h3>
              <span className="px-4 py-1.5 bg-[#F5EFE6] text-[#2D1E3E] text-[10px] font-black uppercase rounded-lg tracking-widest border border-gray-100 shadow-sm">Neural Optimization</span>
            </div>
            <p className="text-[#5A4A6B] text-xl leading-relaxed mb-8 font-medium">
              {summary?.recommendation || "Based on your cognitive patterns, we've adjusted your learning path to optimize retention and address subtle knowledge gaps."}
            </p>
            <div className="flex flex-wrap gap-4">
              <span className="px-6 py-3 bg-[#F5EFE6] border border-gray-100 text-[#2D1E3E] text-xs font-black rounded-lg shadow-sm uppercase tracking-widest">Action: Targeted Reteach</span>
              <span className="px-6 py-3 bg-rose-50 border border-rose-100 text-rose-600 text-xs font-black rounded-lg shadow-sm uppercase tracking-widest">Priority: High</span>
            </div>
          </div>
        </div>
      </Card>

      <div className="mb-16">
        <div className="flex items-center justify-between mb-8 px-4">
          <h3 className="text-3xl font-black flex items-center gap-4 text-[#2D1E3E]">
            <BookOpen size={32} className="text-[#8B7CA3]" /> 
            Integration Flashcards
          </h3>
          <Button 
            className={`px-10 py-4 font-black text-sm rounded-lg transition-all shadow-md ${showFlashcards ? 'border border-[#2D1E3E] text-[#2D1E3E] bg-white' : 'bg-[#2D1E3E] text-white'}`} 
            onClick={() => setShowFlashcards(!showFlashcards)}
          >
            {showFlashcards ? "Collapse Deck" : "Activate Practice Set"}
          </Button>
        </div>
        
        <AnimatePresence>
          {showFlashcards && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {flashcards.map((card, idx) => (
                <div 
                  key={idx}
                  className="flashcard-wrapper h-56 cursor-pointer group"
                >
                  <div className="flashcard-inner relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                    <div className="flashcard-front absolute inset-0 backface-hidden bg-white border border-gray-100 rounded-xl p-8 flex flex-col justify-center items-center text-center shadow-md">
                      <p className="text-[10px] font-black text-[#8B7CA3] uppercase tracking-widest mb-6">Inquiry</p>
                      <p className="font-black text-[#2D1E3E] text-xl leading-tight">{card.front}</p>
                    </div>
                    <div className="flashcard-back absolute inset-0 backface-hidden [transform:rotateY(180deg)] bg-[#2D1E3E] text-white rounded-xl p-8 flex flex-col justify-center items-center text-center shadow-md">
                      <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-6">Neural Fact</p>
                      <p className="text-lg font-bold leading-relaxed">{card.back}</p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-8 pt-8">
        <Button className="px-12 py-5 text-xl font-black rounded-xl border border-[#2D1E3E] text-[#2D1E3E] bg-white hover:bg-[#F5EFE6] transition-all" onClick={() => navigate('/dashboard')}>
          Back to Hub
        </Button>
        <Button className="px-12 py-5 text-xl font-black rounded-xl bg-[#6D4AFF] text-white shadow-lg hover:opacity-90 transition-all" onClick={() => navigate('/learning-path')}>
          View Neural Path <ArrowRight size={24} className="ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default Results;
