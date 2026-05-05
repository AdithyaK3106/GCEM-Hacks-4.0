// ============================================================
// /components/audio/ClarityMeter.jsx
// Visual clarity indicator driven by AudioMetrics.
// Shows a red → yellow → green gradient bar + label.
// ============================================================

/**
 * @param {Object} props
 * @param {number} props.clarity    - 0–2+ clarity score from audio_metrics
 * @param {string} props.level      - 'silent' | 'noisy' | 'clear'
 * @param {boolean} props.active    - Show animated pulse when true
 */
const ClarityMeter = ({ clarity = 0, level = 'silent', active = false }) => {
  // Normalize 0–1 for display (clarity > 1.0 = great)
  const normalized = Math.min(clarity / 1.5, 1);
  const percent = Math.round(normalized * 100);

  const colorMap = {
    silent: '#6b7280',
    noisy: '#f59e0b',
    clear: '#22c55e',
  };
  const labelMap = {
    silent: 'Silent',
    noisy: 'Noisy',
    clear: 'Clear',
  };

  const color = colorMap[level] ?? colorMap.silent;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', color: 'var(--text-secondary, #888)', fontWeight: 500 }}>
          Audio Clarity
        </span>
        <span
          style={{
            fontSize: '12px',
            fontWeight: 700,
            color,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          {active && level !== 'silent' && (
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: color,
                display: 'inline-block',
                animation: 'pulse-dot 1.2s ease-in-out infinite',
              }}
            />
          )}
          {labelMap[level]}
        </span>
      </div>

      {/* Bar track */}
      <div
        style={{
          height: '6px',
          borderRadius: '3px',
          background: 'var(--bg-tertiary, #2a2a4a)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${percent}%`,
            background: `linear-gradient(90deg, #ef4444, #f59e0b, #22c55e)`,
            clipPath: `inset(0 ${100 - percent}% 0 0)`,
            borderRadius: '3px',
            transition: 'width 0.25s ease',
          }}
        />
      </div>

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.4); }
        }
      `}</style>
    </div>
  );
};

export default ClarityMeter;
