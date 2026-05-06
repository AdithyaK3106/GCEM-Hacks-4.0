// ============================================================
// /components/audio/AudioRecorder.jsx
// Main recording UI panel.
// Orchestrates: calibration → recorder → streamClient.
// Fires onTranscriptUpdate(text) and onRecordingComplete(text).
// ============================================================

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Radio, Settings2, Activity } from 'lucide-react';
import LiveTranscript from './LiveTranscript';
import ClarityMeter from './ClarityMeter';
import { runCalibration, loadCalibration } from '../../modules/audio/calibration';
import { createRecorder } from '../../modules/audio/recorder';
import { createStreamClient } from '../../modules/audio/streamClient';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/stream-audio';

/**
 * @param {Object} props
 * @param {string} props.sessionId - Current learning session ID
 * @param {function} props.onTranscriptUpdate - Called with accumulated transcript string
 * @param {function} [props.onRecordingComplete] - Called when user stops with final transcript
 */
const AudioRecorder = ({ sessionId, onTranscriptUpdate, onRecordingComplete }) => {
  const [phase, setPhase] = useState('idle'); // idle | calibrating | recording | finalizing | done
  const [transcript, setTranscript] = useState('');
  const [metrics, setMetrics] = useState({ clarity: 0, level: 'silent' });
  const [streamStatus, setStreamStatus] = useState('disconnected');
  const [calibration, setCalibration] = useState(null);
  const [error, setError] = useState('');

  const recorderRef = useRef(null);
  const clientRef = useRef(null);
  const transcriptRef = useRef('');

  // On mount, try to load a cached calibration
  useEffect(() => {
    const cached = loadCalibration();
    if (cached) setCalibration(cached);
  }, []);

  const handleCalibrate = useCallback(async () => {
    setError('');
    setPhase('calibrating');
    try {
      const profile = await runCalibration();
      setCalibration(profile);
      setPhase('idle');
    } catch (e) {
      setError('Calibration failed: ' + e.message);
      setPhase('idle');
    }
  }, []);

  const handleStartRecording = useCallback(async () => {
    if (!sessionId) { setError('No active session.'); return; }
    setError('');
    setTranscript('');
    transcriptRef.current = '';
    setPhase('recording');

    // Stream client
    const client = createStreamClient(
      { wsUrl: WS_URL, sessionId },
      {
        onTranscript: (data) => {
          // FIX: The backend now sends the full cumulative transcript
          // for both partial and final updates to ensure smoothness.
          const fullText = data.text;
          setTranscript(prev => {
            if (fullText.startsWith(prev)) return fullText;
            return fullText;
          });
          onTranscriptUpdate?.(fullText);
          transcriptRef.current = fullText;

          // If this is the final message, we can complete the phase
          if (data.isFinal) {
            setPhase('done');
            onRecordingComplete?.(fullText);
          }
        },
        onMetrics: (m) => setMetrics(m),
        onStatusChange: setStreamStatus,
        onError: (e) => setError('Stream: ' + e.message),
      }
    );
    client.connect();
    clientRef.current = client;

    // Recorder
    const recorder = createRecorder({
      calibration: calibration ?? undefined,
      noiseStrategy: 'basic',
      onChunk: (chunk) => client.sendChunk(chunk),
      onMetrics: (m) => setMetrics(m),
      onError: (e) => setError('Mic: ' + e.message),
    });
    await recorder.start(sessionId);
    recorderRef.current = recorder;
  }, [sessionId, calibration, onTranscriptUpdate]);

  const handleStop = useCallback(() => {
    // FIX: Properly stop recording
    if (recorderRef.current) {
      recorderRef.current.stop();
      recorderRef.current = null;
    }
    
    // FIX: Use stop() to signal the server instead of immediately disconnecting.
    if (clientRef.current) {
      clientRef.current.stop();
      // Don't null out immediately, wait for final message or close
    }

    setPhase('finalizing');
    setMetrics({ clarity: 0, level: 'silent' });
    
    // Safety timeout: if server doesn't respond in 180s, finish anyway
    setTimeout(() => {
      setPhase(prev => {
        if (prev === 'finalizing') {
          console.warn('[AudioRecorder] Finalization timed out after 180s, forcing completion.');
          onRecordingComplete?.(transcriptRef.current);
          return 'done';
        }
        return prev;
      });
    }, 180000);
  }, [onRecordingComplete]);

  const isRecording = phase === 'recording';
  const isCalibrating = phase === 'calibrating';
  const isFinalizing = phase === 'finalizing';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card p-8 flex flex-col gap-6 relative overflow-hidden"
    >
      {/* Background ambient glow when recording */}
      {isRecording && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 0.15 }} exit={{ opacity: 0 }}
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-accent-primary to-accent-secondary blur-3xl -z-10 pointer-events-none"
        />
      )}

      {/* Header */}
      <div className="flex justify-between items-center border-b border-white-op-10 pb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isRecording ? 'bg-danger/20 text-danger animate-pulse' : 'bg-accent-primary/20 text-accent-primary'}`}>
            {isRecording ? <Activity size={20} /> : <Radio size={20} />}
          </div>
          <div>
            <h3 className="m-0 text-xl font-bold text-white">Live Audio Analysis</h3>
            <p className="text-xs text-text-secondary mt-1">Real-time voice to knowledge</p>
          </div>
        </div>

        <span
          className="text-xs px-3 py-1.5 rounded-full font-bold uppercase tracking-wider"
          style={{
            background: streamStatus === 'connected' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(107, 114, 128, 0.15)',
            color: streamStatus === 'connected' ? '#4ade80' : '#9ca3af',
            border: `1px solid ${streamStatus === 'connected' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(107, 114, 128, 0.3)'}`
          }}
        >
          {streamStatus}
        </span>
      </div>

      {/* Clarity meter */}
      <ClarityMeter clarity={metrics.clarity} level={metrics.level} active={isRecording} />

      {/* Calibration info */}
      {calibration && (
        <div className="text-xs text-text-secondary">
          ✓ Calibrated — Gain ×{calibration.gainFactor.toFixed(1)}, Noise floor: {(calibration.noiseFloor * 100).toFixed(1)}%
        </div>
      )}

      {/* Transcript */}
      <LiveTranscript transcript={transcript} isRecording={isRecording} />

      {/* Error */}
      {error && (
        <p className="text-danger text-sm m-0">{error}</p>
      )}

      {/* Actions */}
      <div className="flex gap-4 flex-wrap mt-2 pt-4 border-t border-white-op-10">
        {!isRecording && (
          <button
            onClick={handleCalibrate}
            disabled={isCalibrating}
            className="flex items-center gap-2 px-5 py-3 rounded-xl border border-white-op-10 bg-white-op-5 text-text-secondary hover:text-white hover:bg-white-op-10 transition-all font-semibold text-sm disabled:opacity-50"
          >
            <Settings2 size={16} className={isCalibrating ? 'animate-spin' : ''} />
            {isCalibrating ? 'Calibrating...' : 'Calibrate Mic'}
          </button>
        )}

        {!isRecording ? (
          <button
            onClick={handleStartRecording}
            disabled={isCalibrating}
            className="flex-1 flex justify-center items-center gap-2 px-6 py-3 rounded-xl bg-accent-primary hover:bg-accent-secondary text-white font-bold text-sm shadow-lg shadow-accent-primary/20 transition-all disabled:opacity-50"
          >
            <Mic size={18} />
            Start Recording
          </button>
        ) : (
          <button
            onClick={handleStop}
            className="flex-1 flex justify-center items-center gap-2 px-6 py-3 rounded-xl bg-danger hover:bg-red-600 text-white font-bold text-sm shadow-lg shadow-danger/20 transition-all"
            style={{ animation: 'record-pulse 1.5s ease-in-out infinite' }}
          >
            <MicOff size={18} />
            Stop & Analyze
          </button>
        )}
        
        {isFinalizing && (
          <div className="flex-1 flex justify-center items-center gap-2 px-6 py-3 rounded-xl bg-[#2D1E3E] text-white font-bold text-sm">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Finalizing Transcription...
          </div>
        )}
      </div>

      <style>{`
        @keyframes record-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
          50% { box-shadow: 0 0 0 12px rgba(239, 68, 68, 0); }
        }
      `}</style>
    </motion.div>
  );
};

export default AudioRecorder;
