import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload as UploadIcon, FileText, ArrowRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { uploadLecture, getDemoConfig, setDemoConfig } from '../services/zeroFrictionApi';
import { useEffect } from 'react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import './pages.css';

const Upload = () => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [targetLanguage, setTargetLanguage] = useState("English");
  const [isProcessing, setIsProcessing] = useState(false);
  const [demoMode, setDemoMode] = useState(true);
  const [processingStep, setProcessingStep] = useState('');
  const [error, setError] = useState('');
  const { setSessionId, setTranscript, setNotes, setQuizQuestions, setQuizData, updateProgress, setPipelineStep } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConfig = async () => {
      const config = await getDemoConfig();
      setDemoMode(config.demo_mode);
    };
    fetchConfig();
  }, []);

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
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile) => {
    setFile(selectedFile);
  };

  const processUpload = async () => {
    setIsProcessing(true);
    setError('');

    try {
      setProcessingStep('Transcribing...');
      await new Promise(r => setTimeout(r, 1200));
      setProcessingStep('Generating Notes...');
      await new Promise(r => setTimeout(r, 1500));
      setProcessingStep('Preparing Quiz...');
      await new Promise(r => setTimeout(r, 1200));

      const data = await uploadLecture(file, targetLanguage);
      setSessionId(data.session_id);
      setTranscript(data.transcript_text);
      setNotes(null);
      setQuizQuestions([]);
      setQuizData(null);
      updateProgress(10);
      setPipelineStep(1); // Ready for Notes
      navigate('/notes');
    } catch (err) {
      setError(err.message || 'Upload failed. Please try again.');
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  return (
    <div className="page-transition max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-4">Upload Lecture Material</h1>
        <p className="text-text-secondary">Upload audio, video, or a text transcript. Our AI will analyze it.</p>
      </div>

      <Card>
        {!file ? (
          <form 
            onDragEnter={handleDrag} 
            onDragLeave={handleDrag} 
            onDragOver={handleDrag} 
            onDrop={handleDrop}
            onSubmit={(e) => e.preventDefault()}
          >
            <div className={`upload-area ${dragActive ? 'drag-active' : ''}`}>
              <div className="upload-icon">
                <UploadIcon size={40} />
              </div>
              <h3 className="text-xl font-bold mb-2">Drag & Drop your files here</h3>
              <p className="text-text-secondary mb-6">Supports MP3, MP4, PDF, and TXT up to 500MB</p>
              
              <input 
                type="file" 
                id="file-upload" 
                className="hidden" 
                onChange={handleChange}
                accept=".mp3,.mp4,.pdf,.txt"
              />
              <div className="flex flex-col gap-4 items-center justify-center mt-6">
                <div className="w-full max-w-[280px] mb-6">
                  <p className="text-xs font-bold text-text-secondary mb-3 text-center uppercase tracking-wider">Output Language</p>
                  <div className="lang-selector-container">
                    {['English', 'Hindi'].map((lang) => (
                      <button
                        key={lang}
                        onClick={(e) => { e.preventDefault(); setTargetLanguage(lang); }}
                        className={`lang-btn ${targetLanguage === lang ? 'active' : ''}`}
                      >
                        {targetLanguage === lang && (
                          <motion.div
                            layoutId="activeLangEmpty"
                            className="absolute inset-0 rounded-xl"
                            style={{ background: 'var(--accent-gradient)', zIndex: -1 }}
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                          />
                        )}
                        <span className="relative z-10">{lang}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Demo Mode Toggle */}
                <div className="w-full max-w-[280px] mb-6 demo-toggle-container">
                  <div className="flex flex-col" style={{ textAlign: 'left' }}>
                    <span className="text-[10px] font-bold text-accent-primary uppercase tracking-widest">Hybrid Demo Mode</span>
                    <span className="text-[9px] text-text-secondary">Fast & Stable Mocks</span>
                  </div>
                  <button 
                    onClick={handleDemoToggle}
                    className="toggle-switch"
                    style={{ backgroundColor: demoMode ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)' }}
                  >
                    <motion.div 
                      animate={{ x: demoMode ? 24 : 0 }}
                      className="toggle-dot"
                    />
                  </button>
                </div>
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="btn btn-secondary">
                    Browse Files
                  </div>
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-text-secondary text-sm">or</span>
                </div>
                <Button 
                  variant="primary" 
                  onClick={(e) => {
                    e.preventDefault();
                    processUpload();
                  }}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-3">
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      {processingStep}
                    </span>
                  ) : 'Start Demo Session'}
                </Button>
              </div>
            </div>
          </form>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <div className="w-20 h-20 mx-auto bg-green-500/10 text-success rounded-full flex items-center justify-center mb-6">
              <FileText size={40} />
            </div>
            <h3 className="text-2xl font-bold mb-2">{file.name}</h3>
            {error && <p className="text-danger mb-4">{error}</p>}
            <p className="text-text-secondary mb-8">{(file.size / (1024 * 1024)).toFixed(2)} MB • Ready to process</p>
            
            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={() => setFile(null)}>Cancel</Button>
              <div className="flex flex-col justify-center">
                <div className="lang-selector-container" style={{ padding: '0.25rem' }}>
                  {['English', 'Hindi'].map((lang) => (
                    <button
                      key={lang}
                      onClick={(e) => { e.preventDefault(); setTargetLanguage(lang); }}
                      className={`lang-btn ${targetLanguage === lang ? 'active' : ''}`}
                      style={{ padding: '0.4rem 1rem' }}
                    >
                      {targetLanguage === lang && (
                        <motion.div
                          layoutId="activeLangReady"
                          className="absolute inset-0 rounded-lg"
                          style={{ background: 'var(--accent-gradient)', zIndex: -1 }}
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      <span className="relative z-10">{lang}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Demo Mode Toggle in File Selected View */}
              <div className="flex flex-col justify-center">
                <div className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between gap-4">
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] font-bold text-accent-primary uppercase tracking-widest">Hybrid Demo</span>
                    <span className="text-[8px] text-text-secondary">Mocked</span>
                  </div>
                  <button 
                    onClick={handleDemoToggle}
                    className="toggle-switch"
                    style={{ width: '2.5rem', height: '1.25rem', backgroundColor: demoMode ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)' }}
                  >
                    <motion.div 
                      animate={{ x: demoMode ? 18 : 0 }}
                      className="toggle-dot"
                      style={{ width: '0.75rem', height: '0.75rem' }}
                    />
                  </button>
                </div>
              </div>
              <Button onClick={processUpload} disabled={isProcessing}>
                {isProcessing ? (
                  <span className="flex items-center gap-3">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    {processingStep}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    {demoMode ? 'Start Demo Session' : 'Analyze Real PDF'} <ArrowRight size={18} />
                  </span>
                )}
              </Button>
              {demoMode && !isProcessing && (
                <p className="text-[10px] text-accent-primary font-bold mt-2 animate-pulse text-center">
                  🚀 HYBRID DEMO MODE: Mocked Content
                </p>
              )}
              {!demoMode && !isProcessing && (
                <p className="text-[10px] text-text-muted mt-2 text-center">
                  ⚡ REAL PIPELINE: Full Analysis (30-60s)
                </p>
              )}
            </div>
          </motion.div>
        )}
      </Card>
    </div>
  );
};

export default Upload;
