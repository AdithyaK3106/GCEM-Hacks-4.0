import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload as UploadIcon, FileText, ArrowRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { uploadLecture } from '../services/zeroFrictionApi';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import './pages.css';

const Upload = () => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const { setSessionId, setTranscript, setNotes, setQuizQuestions, setQuizData, updateProgress, setPipelineStep } = useAppContext();
  const navigate = useNavigate();

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
      const data = await uploadLecture(file);
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
                <label htmlFor="file-upload">
                  <Button variant="secondary" as="span" style={{ pointerEvents: 'none' }}>
                    Browse Files
                  </Button>
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
                  {isProcessing ? 'Starting...' : 'Start Demo Session'}
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
              <Button onClick={processUpload} disabled={isProcessing}>
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Analyzing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Generate Notes <ArrowRight size={18} />
                  </span>
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </Card>
    </div>
  );
};

export default Upload;
