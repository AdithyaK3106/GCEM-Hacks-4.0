import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, CheckCircle, Clock, Zap, ArrowRight, Info, FileText, List, ChevronDown, ChevronUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useAppContext } from '../context/AppContext';
import { getNotes, getQuiz } from '../services/zeroFrictionApi';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
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
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-accent-primary/20 border-t-accent-primary rounded-full animate-spin mb-6"></div>
        <h2 className="text-2xl font-bold">Structuring Your Learning...</h2>
      </div>
    );
  }

  const topics = notes?.topics || [];

  return (
    <div className="page-transition max-w-6xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Lecture Insights</h1>
          <p className="text-text-secondary">{notes?.topic_title || 'Structured Topic Breakdown'}</p>
        </div>
      </div>

      <div className="notes-container">
        <div className="space-y-6">
          <Card className="overflow-hidden">
            <div className="flex gap-4 p-4 border-b border-white/5 bg-white/2">
              <button 
                onClick={() => setActiveTab('summary')}
                className={`tab-btn ${activeTab === 'summary' ? 'active' : ''}`}
              >
                <FileText size={18} /> Structured Notes
              </button>
              <button 
                onClick={() => setActiveTab('transcript')}
                className={`tab-btn ${activeTab === 'transcript' ? 'active' : ''}`}
              >
                <BookOpen size={18} /> Source Text
              </button>
            </div>
            
            <div className="p-8 min-h-[500px]">
              <AnimatePresence mode="wait">
                {activeTab === 'summary' && (
                  <motion.div key="summary" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    {topics.length > 0 ? (
                      topics.map((topic, index) => (
                        <div key={index} className="border border-white/10 rounded-xl overflow-hidden bg-white/2 transition-all hover:border-accent-primary/30">
                          <button 
                            onClick={() => setExpandedTopic(expandedTopic === index ? -1 : index)}
                            className="w-full p-6 flex justify-between items-center text-left hover:bg-white/5"
                          >
                            <div>
                              <h3 className="text-xl font-bold text-accent-primary mb-1">{topic.name}</h3>
                              <p className="text-text-secondary text-sm line-clamp-1">{topic.summary}</p>
                            </div>
                            {expandedTopic === index ? <ChevronUp /> : <ChevronDown />}
                          </button>
                          
                          <AnimatePresence>
                            {expandedTopic === index && (
                              <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="px-6 pb-6 border-t border-white/5 pt-4"
                              >
                                <p className="text-text-primary mb-6 leading-relaxed">{topic.summary}</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {topic.key_concepts.map((concept, cIdx) => (
                                    <div key={cIdx} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5">
                                      <CheckCircle size={14} className="text-success shrink-0" />
                                      <span className="text-sm">{concept}</span>
                                    </div>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))
                    ) : (
                      <div className="prose prose-invert max-w-none note-content !overflow-visible !whitespace-normal">
                        <ReactMarkdown>{notes?.content_markdown || 'No summary available.'}</ReactMarkdown>
                      </div>
                    )}
                  </motion.div>
                )}
                
                {activeTab === 'transcript' && (
                  <motion.div key="transcript" initial={{ opacity: 0 }} className="text-text-secondary leading-relaxed whitespace-pre-wrap font-mono text-sm opacity-80">
                    {transcript || 'Full transcript not available.'}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-accent-primary/5 border-accent-primary/20 sticky top-24">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Zap className="text-warning" size={20} />
              Verify Mastery
            </h3>
            <p className="text-text-secondary mb-6 text-sm">
              Ready to test your understanding of these {topics.length} topics?
            </p>
            <Button onClick={handleProceedToQuiz} className="w-full">
              Start Quiz <ArrowRight size={18} />
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Notes;
