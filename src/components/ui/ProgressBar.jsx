import React from 'react';
import './ui.css';

const ProgressBar = ({ progress }) => {
  return (
    <div className="progress-bar-container">
      <div 
        className="progress-bar-fill" 
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
