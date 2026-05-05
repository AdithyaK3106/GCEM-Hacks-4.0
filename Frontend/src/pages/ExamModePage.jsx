import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useExamMode } from '../features/examMode/useExamMode';
import ExamModeView from '../features/examMode/ExamModeView';
import { ChevronLeft, Loader2, Sparkles } from 'lucide-react';

const ExamModePage = () => {
  const { sessionId } = useParams();
  const { data, loading, error } = useExamMode(sessionId);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] py-12 text-center">
        <div className="relative flex items-center justify-center w-32 h-32 mb-12">
          <Loader2 size={80} className="text-accent-primary animate-spin absolute" />
          <Sparkles size={32} className="text-accent-primary animate-pulse" />
        </div>
        <div className="mt-8 space-y-4">
          <h3 className="text-3xl font-black text-gradient">AI Synthesis in Progress</h3>
          <p className="text-text-secondary max-w-md mx-auto px-6">
            We are currently extracting key concepts and mnemonics from your lecture. 
            This usually takes 20-30 seconds for a full document.
          </p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="p-4 bg-danger/10 text-danger rounded-full">
          <Sparkles size={32} />
        </div>
        <h3 className="text-2xl font-bold">Something went wrong</h3>
        <p className="text-text-secondary">We couldn't generate your exam package right now.</p>
        <Link to="/dashboard" className="px-6 py-2 bg-accent-primary text-white rounded-xl">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="mb-8">
        <Link to={`/notes/${sessionId}`} className="flex items-center gap-2 text-text-secondary hover:text-accent-primary transition-colors mb-4 inline-flex">
          <ChevronLeft size={20} />
          <span>Back to Notes</span>
        </Link>
      </div>
      
      <ExamModeView data={data} />
    </div>
  );
};

export default ExamModePage;
