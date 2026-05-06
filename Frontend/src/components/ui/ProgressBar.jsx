import React from 'react';
import './ui.css';

const ProgressBar = ({ progress, color = 'var(--accent-primary)', className = '' }) => {
  return (
    <div className={`progress-container ${className}`}>
      <div 
        className="progress-fill" 
        style={{ 
          width: `${progress}%`, 
          background: color 
        }} 
      />
    </div>
  );
};

export default ProgressBar;
