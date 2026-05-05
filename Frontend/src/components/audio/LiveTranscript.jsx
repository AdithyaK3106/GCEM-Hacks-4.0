// ============================================================
// /components/audio/LiveTranscript.jsx
// Streaming live transcript display component.
// Receives partial transcript chunks and updates in real time.
// ============================================================

import { useEffect, useRef } from 'react';

/**
 * @param {Object} props
 * @param {string} props.transcript - Full accumulated transcript text
 * @param {boolean} props.isRecording - Shows pulsing cursor when true
 * @param {string} [props.className] - Additional CSS classes
 */
const LiveTranscript = ({ transcript, isRecording, className = '' }) => {
  const endRef = useRef(null);

  // Auto-scroll to bottom as new text arrives
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);

  return (
    <div
      className={`live-transcript-container ${className}`}
      style={{
        background: 'var(--bg-secondary, #1a1a2e)',
        border: '1px solid var(--border-color, #2a2a4a)',
        borderRadius: '12px',
        padding: '16px',
        minHeight: '120px',
        maxHeight: '280px',
        overflowY: 'auto',
        fontFamily: 'ui-monospace, monospace',
        fontSize: '14px',
        lineHeight: '1.6',
        position: 'relative',
      }}
    >
      {!transcript && !isRecording && (
        <p style={{ color: 'var(--text-secondary, #888)', margin: 0 }}>
          Transcript will appear here as you speak…
        </p>
      )}

      {transcript && (
        <p style={{ margin: 0, color: 'var(--text-primary, #e0e0e0)', whiteSpace: 'pre-wrap' }}>
          {transcript}
          {isRecording && (
            <span
              style={{
                display: 'inline-block',
                width: '2px',
                height: '1em',
                background: 'var(--accent-primary, #7c3aed)',
                marginLeft: '2px',
                verticalAlign: 'text-bottom',
                animation: 'blink 1s step-end infinite',
              }}
            />
          )}
        </p>
      )}

      {!transcript && isRecording && (
        <p style={{ color: 'var(--text-secondary, #888)', margin: 0 }}>
          Listening
          <span style={{ animation: 'blink 1s step-end infinite' }}>…</span>
        </p>
      )}

      <div ref={endRef} />

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default LiveTranscript;
