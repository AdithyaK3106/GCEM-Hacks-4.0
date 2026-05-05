import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Play, Languages, Save, Target } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import './pages.css';

const Notes = () => {
  const { transcript, setNotes, updateProgress } = useAppContext();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('summary');

  // Mock notes generation
  useEffect(() => {
    if (!transcript) {
      navigate('/upload');
    }
  }, [transcript, navigate]);

  const handleStartQuiz = () => {
    setNotes("Generated Notes Payload...");
    updateProgress(15);
    navigate('/quiz');
  };

  return (
    <div className="page-transition">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Lecture Notes</h1>
          <p className="text-text-secondary">AI-generated structured notes from your upload.</p>
        </div>
        <div className="flex gap-4">
          <Button variant="secondary"><Save size={18} /> Save PDF</Button>
          <Button onClick={handleStartQuiz}><Target size={18} /> Take Quiz</Button>
        </div>
      </div>

      <div className="notes-container">
        {/* Main Content Area */}
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
            {activeTab === 'summary' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Introduction to Neural Networks</h2>
                <p className="text-text-secondary mb-6">This lecture covers the fundamental concepts of artificial neural networks, focusing on their structure, forward propagation, and an introduction to backpropagation.</p>
                
                <h3 className="text-xl font-semibold mt-6 mb-3 text-white">1. Biological Inspiration</h3>
                <p className="text-text-secondary mb-4">Neural networks are loosely inspired by the human brain. We discussed how artificial neurons (perceptrons) mimic biological neurons by taking inputs, applying weights, and passing the result through an activation function.</p>

                <h3 className="text-xl font-semibold mt-6 mb-3 text-white">2. Network Architecture</h3>
                <ul className="list-disc pl-6 space-y-2 text-text-secondary mb-4">
                  <li><strong>Input Layer:</strong> Receives raw data features.</li>
                  <li><strong>Hidden Layers:</strong> Perform transformations and extract patterns. Deep networks have multiple hidden layers.</li>
                  <li><strong>Output Layer:</strong> Produces the final prediction or classification.</li>
                </ul>
              </div>
            )}
            {activeTab === 'transcript' && (
              <div className="text-text-secondary">
                <p>[00:00] Welcome everyone to week 3. Today we're diving into the core of deep learning: neural networks...</p>
                <p className="mt-4">[02:15] Let's start by looking at a single neuron. Imagine you have a set of inputs x1, x2, x3...</p>
              </div>
            )}
            {activeTab === 'keypoints' && (
              <ul className="space-y-4">
                <li className="flex gap-4 items-start p-4 glass-card rounded-lg">
                  <div className="text-accent-primary mt-1"><Target size={20} /></div>
                  <div>
                    <h4 className="font-bold text-white">Activation Functions</h4>
                    <p className="text-text-secondary text-sm">Non-linear functions applied to node outputs (e.g., ReLU, Sigmoid). Essential for learning complex patterns.</p>
                  </div>
                </li>
                <li className="flex gap-4 items-start p-4 glass-card rounded-lg">
                  <div className="text-accent-primary mt-1"><Target size={20} /></div>
                  <div>
                    <h4 className="font-bold text-white">Forward Propagation</h4>
                    <p className="text-text-secondary text-sm">The process of moving input data through the network layers to calculate the output.</p>
                  </div>
                </li>
              </ul>
            )}
          </motion.div>
        </Card>

        {/* Sidebar Actions */}
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
