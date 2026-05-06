import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, CheckCircle, Clock, Zap, ArrowRight, Info, FileText, List, ChevronDown, ChevronUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useAppContext } from '../context/AppContext';
import { getNotes, getQuiz } from '../services/zeroFrictionApi';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import ExamModeButton from '../features/examMode/ExamModeButton';
import './pages.css';

const Notes = () => {
  const { sessionId: contextSessionId, transcript, notes, setNotes, setQuizQuestions, setPipelineStep, pipelineStep } = useAppContext();
  const { sessionId: paramSessionId } = useParams();
  const sessionId = contextSessionId || paramSessionId;
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('summary');
  const [loading, setLoading] = useState(!notes);
  const [error, setError] = useState('');
  const [expandedTopic, setExpandedTopic] = useState(0);

  useEffect(() => {
    if (pipelineStep < 1 && !notes) {
      navigate('/upload');
      return;
    }

    const loadData = async () => {
      if (notes) return;
      try {
        setLoading(true);
        const notesData = await getNotes(sessionId);
        setNotes(notesData);
        const quizData = await getQuiz(sessionId);
        setQuizQuestions(quizData);
      } catch (err) {
        setError('Failed to load notes.');
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) loadData();
  }, [sessionId, notes, setNotes, setQuizQuestions, navigate, pipelineStep]);

  const handleProceedToQuiz = () => {
    setPipelineStep(2);
    navigate(`/quiz/${sessionId}`);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] page-transition bg-[#F5EFE6]">
        <div className="w-16 h-16 border-4 border-[#6D4AFF]/20 border-t-[#6D4AFF] rounded-full animate-spin mb-6"></div>
        <h2 className="text-2xl font-black text-[#2D1E3E]">Structuring Your Learning...</h2>
      </div>
    );
  }

  const topics = notes?.topics || [];

  return (
    <div className="page-transition">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black text-[#2D1E3E] mb-2 tracking-tight leading-tight">Lecture Insights</h1>
          <p className="text-[#5A4A6B] font-bold text-lg">{notes?.topic_title || 'Structured Topic Breakdown'}</p>
        </div>
        <div className="flex gap-4">
          <ExamModeButton className="bg-[#2D1E3E]" />
        </div>
      </div>

      <div className="notes-container grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <Card className="p-0 overflow-hidden bg-white shadow-md rounded-xl border border-gray-100">
            <div className="flex gap-1 p-2 bg-[#F5EFE6]/50 border-b border-gray-100">
              <button 
                onClick={() => setActiveTab('summary')}
                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-lg text-sm font-black transition-all ${activeTab === 'summary' ? 'bg-white text-[#2D1E3E] shadow-sm' : 'text-[#8B7CA3] hover:text-[#2D1E3E]'}`}
              >
                <FileText size={20} /> Structured Notes
              </button>
              <button 
                onClick={() => setActiveTab('transcript')}
                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-lg text-sm font-black transition-all ${activeTab === 'transcript' ? 'bg-white text-[#2D1E3E] shadow-sm' : 'text-[#8B7CA3] hover:text-[#2D1E3E]'}`}
              >
                <BookOpen size={20} /> Source Text
              </button>
            </div>
            
            <div className="p-8 md:p-12 min-h-[500px]">
              <AnimatePresence mode="wait">
                {activeTab === 'summary' && (
                  <motion.div key="summary" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    {topics.length > 0 ? (
                      topics.map((topic, index) => (
                        <div key={index} className="border border-gray-100 rounded-xl overflow-hidden bg-white transition-all hover:border-[#6D4AFF]/20">
                          <button 
                            onClick={() => setExpandedTopic(expandedTopic === index ? -1 : index)}
                            className={`w-full p-8 flex justify-between items-center text-left transition-colors ${expandedTopic === index ? 'bg-[#F5EFE6]/30' : 'bg-white hover:bg-[#F5EFE6]/10'}`}
                          >
                            <div>
                              <h3 className="text-2xl font-black text-[#2D1E3E] mb-1">{topic.name}</h3>
                              <p className="text-[#8B7CA3] text-sm font-bold uppercase tracking-widest line-clamp-1">{topic.summary}</p>
                            </div>
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${expandedTopic === index ? 'bg-[#2D1E3E] text-white' : 'bg-[#F5EFE6] text-[#8B7CA3]'}`}>
                              {expandedTopic === index ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
                            </div>
                          </button>
                          
                          <AnimatePresence>
                            {expandedTopic === index && (
                              <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="px-8 pb-10 border-t border-gray-100 pt-8"
                              >
                                <p className="text-[#5A4A6B] text-xl mb-10 leading-relaxed font-medium">{topic.summary}</p>
                                
                                {topic.intuition && (
                                  <div className="mb-10 p-6 bg-[#6D4AFF]/5 border-l-4 border-[#6D4AFF] rounded-r-xl">
                                    <p className="text-[10px] uppercase font-black text-[#6D4AFF] mb-2 tracking-widest">Concept Intuition</p>
                                    <p className="text-[#2D1E3E] italic font-bold text-lg leading-relaxed">"{topic.intuition}"</p>
                                  </div>
                                )}
  
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                                  {topic.real_world_example && (
                                    <div className="p-6 bg-green-50 border border-green-100 rounded-xl shadow-sm">
                                      <p className="text-[10px] uppercase font-black text-[#16A34A] mb-3 tracking-widest">Real World Example</p>
                                      <p className="text-base text-[#16A34A] leading-relaxed font-bold">{topic.real_world_example}</p>
                                    </div>
                                  )}
                                  
                                  {topic.common_mistake && (
                                    <div className="p-6 bg-rose-50 border border-rose-100 rounded-xl shadow-sm">
                                      <p className="text-[10px] uppercase font-black text-rose-600 mb-3 tracking-widest">Common Mistake</p>
                                      <p className="text-base text-rose-900 leading-relaxed font-bold">{topic.common_mistake}</p>
                                    </div>
                                  )}
                                </div>
  
                                <div>
                                  <p className="text-[10px] uppercase font-black text-[#8B7CA3] mb-5 tracking-widest">Key Terms & Core Concepts</p>
                                  <div className="flex flex-wrap gap-3">
                                    {topic.key_concepts && topic.key_concepts.map((concept, cIdx) => (
                                      <div key={cIdx} className="flex items-center gap-3 px-6 py-3 bg-[#F5EFE6] rounded-lg border border-gray-100 shadow-sm">
                                        <CheckCircle size={16} className="text-[#16A34A]" />
                                        <span className="text-sm font-black text-[#2D1E3E]">{concept}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))
                    ) : (
                      <div className="prose prose-slate max-w-none prose-headings:text-[#2D1E3E] prose-p:text-[#5A4A6B] prose-strong:text-[#2D1E3E]">
                        <ReactMarkdown>{notes?.content_markdown || 'No summary available.'}</ReactMarkdown>
                      </div>
                    )}
                  </motion.div>
                )}
                
                {activeTab === 'transcript' && (
                  <motion.div key="transcript" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#5A4A6B] leading-relaxed whitespace-pre-wrap font-mono text-base bg-[#F5EFE6]/30 p-10 rounded-xl border border-gray-100">
                    {transcript || 'Full transcript not available.'}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Card>
        </div>
  
        <div className="lg:col-span-1">
          <Card className="bg-white border border-gray-100 shadow-md rounded-xl p-10 sticky top-24">
            <div className="w-14 h-14 rounded-lg bg-[#6D4AFF]/10 text-[#6D4AFF] flex items-center justify-center mb-8 shadow-sm">
              <Zap size={28} fill="currentColor" />
            </div>
            <h3 className="text-2xl font-black mb-4 text-[#2D1E3E] leading-tight">Verify Mastery</h3>
            <p className="text-[#5A4A6B] mb-10 text-lg font-medium leading-relaxed">
              Ready to test your understanding of these <strong className="text-[#2D1E3E] font-black">{topics.length}</strong> core topics?
            </p>
            <Button onClick={handleProceedToQuiz} className="w-full py-5 text-xl font-black rounded-xl bg-[#6D4AFF] text-white shadow-lg hover:opacity-90">
              Start Quiz <ArrowRight size={24} className="ml-2" />
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Notes;
