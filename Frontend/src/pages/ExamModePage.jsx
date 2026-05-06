import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useExamMode } from '../features/examMode/useExamMode';
import ExamModeView from '../features/examMode/ExamModeView';
import { ChevronLeft, Loader2, Sparkles, Brain } from 'lucide-react';

const ExamModePage = () => {
  const { sessionId } = useParams();
  const { data, loading, error } = useExamMode(sessionId);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] py-12 text-center page-transition">
        <div className="relative flex items-center justify-center w-40 h-40 mb-12">
          <div className="absolute inset-0 bg-[#533A71]/5 rounded-full animate-ping"></div>
          <Loader2 size={100} className="text-[#533A71] animate-spin absolute opacity-20" />
          <div className="w-24 h-24 bg-white rounded-[2rem] shadow-2xl flex items-center justify-center relative z-10 border border-[#533A71]/5">
            <Brain size={48} className="text-[#533A71] animate-pulse" />
          </div>
        </div>
        <div className="mt-8 space-y-4">
          <h3 className="text-4xl font-black text-[#533A71] tracking-tight">AI Synthesis</h3>
          <p className="text-[#A799B7] font-bold max-w-md mx-auto px-6 text-lg">
            Generating mnemonics and structured exam notes for your current lecture...
          </p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 page-transition">
        <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center shadow-inner">
          <Sparkles size={40} />
        </div>
        <h3 className="text-3xl font-black text-[#533A71]">Analysis Halted</h3>
        <p className="text-[#A799B7] font-bold">The neural engine encountered an error generating this package.</p>
        <Link to="/dashboard" className="px-10 py-4 bg-[#533A71] text-white rounded-2xl font-black shadow-xl shadow-[#533A71]/30 hover:scale-105 transition-all">
          Return to Hub
        </Link>
      </div>
    );
  }

  return (
    <div className="page-transition">
      <div className="mb-10">
        <Link to={`/notes/${sessionId}`} className="flex items-center gap-3 text-[#A799B7] hover:text-[#533A71] transition-all mb-6 inline-flex font-black text-xs uppercase tracking-widest group">
          <div className="w-8 h-8 rounded-lg bg-white border border-[#533A71]/5 flex items-center justify-center group-hover:bg-[#533A71] group-hover:text-white transition-all shadow-sm">
            <ChevronLeft size={18} />
          </div>
          <span>Back to Insights</span>
        </Link>
      </div>
      
      <ExamModeView data={data} />
    </div>
  );
};

export default ExamModePage;
