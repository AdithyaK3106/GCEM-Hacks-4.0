import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, 
  Zap, 
  FileAudio, 
  CheckCircle,
  UploadCloud,
  ArrowRight,
  AlertCircle,
  Mic
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { uploadLecture, getDemoConfig, setDemoConfig } from '../services/zeroFrictionApi';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import AudioRecorder from '../components/audio/AudioRecorder';
import './pages.css';

const Upload = () => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const [targetLanguage, setTargetLanguage] = useState("English");
  const [isProcessing, setIsProcessing] = useState(false);
  const [demoMode, setDemoMode] = useState(true);
  const [processingStep, setProcessingStep] = useState('');
  const [error, setError] = useState('');
  const [inputMode, setInputMode] = useState('file'); 
  const { sessionId, setSessionId, setTranscript, setNotes, setQuizQuestions, setQuizData, updateProgress, setPipelineStep } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConfig = async () => {
      const config = await getDemoConfig();
      setDemoMode(config.demo_mode);
    };
    fetchConfig();
    
    // Ensure we have a sessionId for AudioRecorder
    if (!sessionId) {
      setSessionId('session-' + Math.random().toString(36).substring(2, 11));
    }
  }, [sessionId, setSessionId]);

  const handleDemoToggle = async () => {
    const newStatus = !demoMode;
    setDemoMode(newStatus);
    await setDemoConfig(newStatus);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const processUpload = async (overrideFile = null) => {
    let fileToProcess = overrideFile || file;
    
    if (!fileToProcess && demoMode) {
      fileToProcess = new File(["mock content"], "lecture.txt", { type: "text/plain" });
    }

    if (!fileToProcess) {
      setError('Please select a file or enable Demo Mode to proceed.');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      setProcessingStep('Initializing AI Pipeline...');
      await new Promise(r => setTimeout(r, 1000));
      setProcessingStep('Analyzing Context...');
      await new Promise(r => setTimeout(r, 1200));
      setProcessingStep('Structuring Knowledge...');
      await new Promise(r => setTimeout(r, 1000));

      const data = await uploadLecture(fileToProcess, targetLanguage);
      setSessionId(data.session_id);
      setTranscript(data.transcript_text);
      setNotes(null);
      setQuizQuestions([]);
      setQuizData(null);
      updateProgress(10);
      setPipelineStep(1); 
      navigate('/notes');
    } catch (err) {
      setError(err.message || 'System error during analysis. Please try again.');
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  const handleRecordingComplete = useCallback((text) => {
    if (!text || text.trim().length < 10) {
      setError('Transcript too short. Please speak more to analyze.');
      return;
    }
    
    // Create a virtual file from the transcript
    const blob = new Blob([text], { type: 'text/plain' });
    const virtualFile = new File([blob], "recorded_lecture.txt", { type: "text/plain" });
    
    // Trigger standard upload process
    processUpload(virtualFile);
  }, [processUpload]);

  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-black text-[#2D1E3E] tracking-tight leading-tight">
          Neural Knowledge <span className="text-[#6D4AFF]">Ingestion</span>
        </h1>
        <p className="text-[#5A4A6B] text-2xl font-medium max-w-2xl mx-auto">
          Sync your external materials with the AI intelligence layer.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-8 border-white/40">
          <div className="flex items-center gap-5 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-[#6D4AFF]/10 text-[#6D4AFF] flex items-center justify-center shadow-sm">
              <Globe size={28} />
            </div>
            <div>
              <h3 className="font-black text-[#2D1E3E] text-xl">Output Language</h3>
              <p className="text-[10px] text-[#8B7CA3] font-black uppercase tracking-[0.2em]">Cross-Lingual Synthesis</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {['English', 'Hindi', 'Spanish'].map(lang => (
              <button
                key={lang}
                onClick={() => setTargetLanguage(lang)}
                className={`px-8 py-3 rounded-xl text-sm font-black transition-all border ${targetLanguage === lang ? 'bg-[#6D4AFF] text-white border-[#6D4AFF] shadow-lg shadow-[#6D4AFF]/20' : 'bg-white/40 text-[#5A4A6B] border-white/60 hover:bg-white/60'}`}
              >
                {lang}
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-8 border-white/40 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center shadow-sm">
                <Zap size={28} fill="currentColor" />
              </div>
              <div>
                <h3 className="font-black text-[#2D1E3E] text-xl">Walkthrough Engine</h3>
                <p className="text-[10px] text-[#8B7CA3] font-black uppercase tracking-[0.2em]">Zero-Friction Prototype</p>
              </div>
            </div>
            <button 
              onClick={handleDemoToggle}
              className={`w-16 h-9 rounded-full transition-all relative ${demoMode ? 'bg-[#2D1E3E]' : 'bg-[#8B7CA3]/20'}`}
            >
              <div className={`absolute top-1 w-7 h-7 bg-white rounded-full transition-all shadow-md ${demoMode ? 'left-8' : 'left-1'}`} />
            </button>
          </div>
          <div className="mt-6">
            <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] inline-block ${demoMode ? 'bg-[#6D4AFF]/10 text-[#6D4AFF]' : 'bg-white/40 text-[#8B7CA3]'}`}>
              {demoMode ? '✨ Status: Adaptive Mock Sequence' : 'Live Integration Active'}
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-0 overflow-hidden border-white/30" hover={false}>
        <div className="flex gap-1 p-2 bg-white/20 border-b border-white/30">
          <button 
            onClick={() => setInputMode('file')}
            className={`flex-1 flex items-center justify-center gap-4 py-6 rounded-xl text-sm font-black transition-all ${inputMode === 'file' ? 'bg-[#2D1E3E] text-white shadow-xl' : 'text-[#8B7CA3] hover:text-[#2D1E3E] hover:bg-white/40'}`}
          >
            <FileAudio size={24} /> Material Upload
          </button>
          <button 
            onClick={() => setInputMode('audio')}
            className={`flex-1 flex items-center justify-center gap-4 py-6 rounded-xl text-sm font-black transition-all ${inputMode === 'audio' ? 'bg-[#2D1E3E] text-white shadow-xl' : 'text-[#8B7CA3] hover:text-[#2D1E3E] hover:bg-white/40'}`}
          >
            <Mic size={24} /> Live Stream
          </button>
        </div>
        
        <div className="p-20 text-center">
          {inputMode === 'file' ? (
            <div 
              className={`border-4 border-dashed rounded-2xl p-20 transition-all group relative ${dragActive ? 'border-[#6D4AFF] bg-[#6D4AFF]/5' : file ? 'border-[#16A34A]/30 bg-[#16A34A]/5' : 'border-[#2D1E3E]/10 hover:border-[#6D4AFF]/40 hover:bg-[#6D4AFF]/5'}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center">
                <div className={`w-28 h-28 rounded-2xl flex items-center justify-center mb-10 transition-transform group-hover:scale-110 shadow-2xl ${file ? 'bg-[#16A34A] text-white shadow-[#16A34A]/20' : 'bg-[#2D1E3E] text-white shadow-black/20'}`}>
                  {file ? <CheckCircle size={48} /> : <UploadCloud size={48} />}
                </div>
                {file ? (
                  <>
                    <h3 className="text-4xl font-black text-[#2D1E3E] mb-3">{file.name}</h3>
                    <p className="text-[#16A34A] font-black text-xs tracking-[0.2em] uppercase">Data Packet Locked</p>
                    <button onClick={() => setFile(null)} className="mt-10 text-rose-500 font-black text-[10px] uppercase tracking-[0.2em] hover:text-rose-600 px-8 py-3 rounded-xl border border-rose-200 bg-white/60 hover:bg-rose-50 transition-all">Reset Buffer</button>
                  </>
                ) : (
                  <>
                    <h3 className="text-4xl font-black text-[#2D1E3E] mb-6 tracking-tight">Drop your assets here</h3>
                    <p className="text-[#5A4A6B] font-medium mb-12 text-xl">Audio, Video, or Transcripts</p>
                    <input 
                      type="file" 
                      id="fileInput" 
                      ref={fileInputRef}
                      className="hidden" 
                      onChange={(e) => setFile(e.target.files[0])}
                    />
                    <Button 
                      className="px-16 py-6 text-2xl h-auto"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Browse Filesystem
                    </Button>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center py-10 max-w-2xl mx-auto">
              <AudioRecorder 
                sessionId={sessionId} 
                onRecordingComplete={handleRecordingComplete}
              />
              <p className="text-[#5A4A6B] font-medium mt-12 text-center text-xl">
                Click "Start Recording" to begin high-fidelity knowledge extraction from a live source.
              </p>
            </div>
          )}

          {inputMode === 'file' && (
            <div className="mt-20 flex flex-col items-center gap-8">
              <Button 
                onClick={() => processUpload()} 
                disabled={isProcessing || (!file && !demoMode)}
                variant="accent"
                className="px-24 py-10 text-3xl h-auto"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-6">
                    <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                    {processingStep}
                  </span>
                ) : (
                  <span className="flex items-center gap-6">
                    Sync Knowledge Base <ArrowRight size={36} />
                  </span>
                )}
              </Button>
              
              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 text-rose-600 font-black text-xs uppercase tracking-widest bg-rose-500/10 px-8 py-4 rounded-xl border border-rose-200"
                  >
                    <AlertCircle size={20} /> {error}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Upload;
