import { useState } from 'react';
import { useAppContext } from '../../context/AppContext';

const DebugPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const state = useAppContext();

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 w-10 h-10 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center border border-white/10 z-50 transition-colors opacity-20 hover:opacity-100"
        title="Open Debug Panel"
      >
        🛠️
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[80vh] bg-[#0a0a0c] border border-white/10 rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden text-xs font-mono">
      <div className="p-3 bg-white/5 border-b border-white/10 flex justify-between items-center">
        <h3 className="font-bold text-accent-primary flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          QA STABILIZATION PANEL
        </h3>
        <button onClick={() => setIsOpen(false)} className="text-text-secondary hover:text-white p-1">✕</button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <section>
          <h4 className="text-text-secondary mb-1 border-b border-white/5 flex justify-between">
            PIPELINE <span>STEP: {state.pipelineStep}</span>
          </h4>
          <div className="flex gap-1 mt-2">
            {[0, 1, 2, 3].map(s => (
              <div key={s} className={`h-1 flex-1 rounded-full ${state.pipelineStep >= s ? 'bg-accent-primary' : 'bg-white/10'}`}></div>
            ))}
          </div>
        </section>

        <section>
          <h4 className="text-text-secondary mb-1 border-b border-white/5">SESSION IDENTIFIER</h4>
          <pre className="text-success truncate">{state.sessionId || 'NOT_INITIALIZED'}</pre>
        </section>

        <section>
          <h4 className="text-text-secondary mb-1 border-b border-white/5">DATA METRICS</h4>
          <div className="grid grid-cols-2 gap-2 mt-1 text-[10px]">
            <div className="p-2 bg-white/5 rounded">
              <span className="block text-text-secondary">NOTES TOPICS</span>
              <span className="text-lg font-bold">{state.notes?.key_highlights?.length || 0}</span>
            </div>
            <div className="p-2 bg-white/5 rounded">
              <span className="block text-text-secondary">QUIZ QUESTIONS</span>
              <span className="text-lg font-bold">{state.quizQuestions?.length || 0}</span>
            </div>
          </div>
        </section>

        <section>
          <h4 className="text-text-secondary mb-1 border-b border-white/5">INTELLIGENCE LAYER</h4>
          <div className="p-2 bg-white/5 rounded space-y-1">
            <p><span className="text-text-secondary">STATE:</span> <span className="text-warning">{state.quizData?.latest_feedback?.learner_state?.state_label || 'WAITING'}</span></p>
            <p><span className="text-text-secondary">COLOR:</span> <span style={{ color: state.quizData?.latest_feedback?.learner_state?.state_color }}>{state.quizData?.latest_feedback?.learner_state?.state_color || 'NONE'}</span></p>
          </div>
        </section>

        <section>
          <h4 className="text-text-secondary mb-1 border-b border-white/5">PERSISTENCE AUDIT</h4>
          <div className="space-y-1 opacity-60">
            <p>LOCALSTORAGE_ID: {localStorage.getItem('demo_session_id') ? '✅' : '❌'}</p>
            <p>LOCALSTORAGE_STEP: {localStorage.getItem('demo_pipeline_step') ? '✅' : '❌'}</p>
            <p>LOCALSTORAGE_NOTES: {localStorage.getItem('demo_notes') ? '✅' : '❌'}</p>
          </div>
        </section>
      </div>

      <div className="p-3 bg-white/5 border-t border-white/10 text-[10px] text-text-secondary flex justify-between">
        <span>MODE: DETERMINISTIC_DEMO</span>
        <span>VERSION: {API_VERSION}</span>
      </div>
    </div>
  );
};

export default DebugPanel;
