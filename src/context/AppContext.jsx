import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [transcript, setTranscript] = useState(null);
  const [notes, setNotes] = useState(null);
  const [quizData, setQuizData] = useState(null);
  const [userProgress, setUserProgress] = useState({
    xp: 1250,
    level: 5,
    streak: 12,
    completedModules: 4,
  });
  const [weakTopics, setWeakTopics] = useState([
    { topic: 'Neural Networks Backpropagation', score: 45 },
    { topic: 'Gradient Descent Optimization', score: 60 }
  ]);

  const updateProgress = (xpGain) => {
    setUserProgress(prev => {
      const newXp = prev.xp + xpGain;
      const newLevel = Math.floor(newXp / 500) + 1; // Simple leveling logic
      return { ...prev, xp: newXp, level: newLevel };
    });
  };

  const value = {
    transcript, setTranscript,
    notes, setNotes,
    quizData, setQuizData,
    userProgress, updateProgress,
    weakTopics, setWeakTopics
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
