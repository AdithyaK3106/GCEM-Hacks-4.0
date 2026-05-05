import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Languages, Save, Target } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { getNotes, getQuiz } from '../services/zeroFrictionApi';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import './pages.css';

const renderMarkdown = (markdown) => {
  const elements = [];
  let listItems = [];

  const flushList = () => {
    if (listItems.length) {
      elements.push(
        <ul key={`list-${elements.length}`} className="list-disc pl-6 space-y-2 text-text-secondary mb-4">
          {listItems}
        </ul>,
      );
      listItems = [];
    }
  };

  markdown.split('\n').forEach((line, index) => {
    if (line.startsWith('- ')) {
      listItems.push(<li key={index}>{line.slice(2)}</li>);
      return;
    }

    flushList();

    if (line.startsWith('# ')) {
      elements.push(<h2 key={index} className="text-2xl font-bold mb-4">{line.slice(2)}</h2>);
    } else if (line.startsWith('## ')) {
      elements.push(<h3 key={index} className="text-xl font-semibold mt-6 mb-3 text-white">{line.slice(3)}</h3>);
    } else if (line.trim()) {
      elements.push(<p key={index} className="text-text-secondary mb-4">{line}</p>);
    }
  });

  flushList();
  return elements;
};

const Notes = () => {
  const { sessionId, transcript, notes, setNotes, setQuizQuestions, updateProgress } = useAppContext();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('summary');
  const [isLoading, setIsLoading] = useState(true);
  const [isQuizLoading, setIsQuizLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!sessionId || !transcript) {
      navigate('/upload');
      return;
    }

    let ignore = false;
    getNotes(sessionId)
      .then((data) => {
        if (!ignore) {
          setNotes(data);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err.message || 'Unable to load notes.');
        }
      })
      .finally(() => {
        if (!ignore) {
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [sessionId, transcript, navigate, setNotes]);

  const handleStartQuiz = async () => {
    setIsQuizLoading(true);
    setError('');

    try {
      const questions = await getQuiz(sessionId);
      setQuizQuestions(questions);
      updateProgress(15);
      navigate('/quiz');
    } catch (err) {
      setError(err.message || 'Unable to load quiz.');
    } finally {
      setIsQuizLoading(false);
    }
  };

  return (
    <div className="page-transition">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Lecture Notes</h1>
          <p className="text-text-secondary">{notes?.topic_title || 'AI-generated structured notes from your upload.'}</p>
        </div>
        <div className="flex gap-4">
          <Button variant="secondary"><Save size={18} /> Save PDF</Button>
          <Button onClick={handleStartQuiz} disabled={isLoading || isQuizLoading}>
            <Target size={18} /> {isQuizLoading ? 'Loading Quiz...' : 'Take Quiz'}
          </Button>
        </div>
      </div>

      {error && <p className="text-danger mb-4">{error}</p>}

      <div className="notes-container">
        <Card className="h-full">
          <div className="flex gap-6 border-b border-white/10 pb-4 mb-6">
            <button
              className={`font-medium pb-4 -mb-4 border-b-2 transition-colors ${activeTab === 'summary' ? 'text-accent-primary border-accent-primary' : 'text-text-secondary border-transparent hover:text-text-primary'}`}
              onClick={() => setActiveTab('summary')}
            >
              Summary
            </button>
            <button
              className={`font-medium pb-4 -mb-4 border-b-2 transition-colors ${activeTab === 'transcript' ? 'text-accent-primary border-accent-primary' : 'text-text-secondary border-transparent hover:text-text-primary'}`}
              onClick={() => setActiveTab('transcript')}
            >
              Full Transcript
            </button>
            <button
              className={`font-medium pb-4 -mb-4 border-b-2 transition-colors ${activeTab === 'keypoints' ? 'text-accent-primary border-accent-primary' : 'text-text-secondary border-transparent hover:text-text-primary'}`}
              onClick={() => setActiveTab('keypoints')}
            >
              Key Points
            </button>
          </div>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="note-content prose prose-invert max-w-none"
          >
            {isLoading && <p className="text-text-secondary">Loading notes...</p>}
            {!isLoading && notes && activeTab === 'summary' && <div>{renderMarkdown(notes.content_markdown)}</div>}
            {!isLoading && activeTab === 'transcript' && (
              <div className="text-text-secondary">
                <p>{transcript}</p>
              </div>
            )}
            {!isLoading && notes && activeTab === 'keypoints' && (
              <ul className="space-y-4">
                {notes.key_highlights.map((highlight) => (
                  <li key={highlight} className="flex gap-4 items-start p-4 glass-card rounded-lg">
                    <div className="text-accent-primary mt-1"><Target size={20} /></div>
                    <div>
                      <h4 className="font-bold text-white">{highlight}</h4>
                      <p className="text-text-secondary text-sm">Key concept extracted from the uploaded lecture notes.</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        </Card>

        <div className="flex flex-col gap-6">
          <Card className="p-5">
            <h3 className="font-bold mb-4 flex items-center gap-2"><Play size={18} className="text-accent-primary"/> Audio Player</h3>
            <div className="h-12 bg-white/5 rounded-full flex items-center px-4 mb-2">
              <div className="w-full bg-white/20 h-1 rounded-full relative">
                <div className="absolute left-0 top-0 h-full bg-accent-primary w-1/3 rounded-full"></div>
                <div className="absolute left-1/3 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow"></div>
              </div>
            </div>
            <div className="flex justify-between text-xs text-text-secondary">
              <span>12:45</span>
              <span>45:20</span>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="font-bold mb-4 flex items-center gap-2"><Languages size={18} className="text-accent-primary"/> Translation</h3>
            <select className="w-full bg-white/5 border border-white/10 rounded-md p-2 text-white outline-none focus:border-accent-primary transition-colors mb-4">
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="hi">Hindi</option>
            </select>
            <Button variant="outline" className="w-full justify-center">Translate Notes</Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Notes;
