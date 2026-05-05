import { createContext, useState, useContext, useEffect } from 'react';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

const getStorageItem = (key, defaultValue) => {
  const item = localStorage.getItem(key);
  try {
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
};

const setStorageItem = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const AppProvider = ({ children }) => {
  const [sessionId, setSessionIdState] = useState(() => localStorage.getItem('demo_session_id') || null);
  const [transcript, setTranscriptState] = useState(() => getStorageItem('demo_transcript', null));
  const [notes, setNotesState] = useState(() => getStorageItem('demo_notes', null));
  const [quizQuestions, setQuizQuestionsState] = useState(() => getStorageItem('demo_quiz_questions', []));
  const [quizData, setQuizDataState] = useState(() => getStorageItem('demo_quiz_data', null));
  
  // Pipeline Step: 0: Upload, 1: Notes, 2: Quiz, 3: Results
  const [pipelineStep, setPipelineStepState] = useState(() => getStorageItem('demo_pipeline_step', 0));

  const [userProgress, setUserProgress] = useState(() => getStorageItem('demo_user_progress', {
    xp: 1250,
    level: 5,
    streak: 12,
    completedModules: 4,
  }));

  const [weakTopics, setWeakTopics] = useState(() => getStorageItem('demo_weak_topics', [
    { topic: 'Neural Networks Backpropagation', score: 45 },
    { topic: 'Gradient Descent Optimization', score: 60 }
  ]));

  const setSessionId = (id) => {
    if (id) {
      localStorage.setItem('demo_session_id', id);
    } else {
      localStorage.removeItem('demo_session_id');
      localStorage.removeItem('demo_transcript');
      localStorage.removeItem('demo_notes');
      localStorage.removeItem('demo_quiz_questions');
      localStorage.removeItem('demo_quiz_data');
      localStorage.removeItem('demo_pipeline_step');
    }
    setSessionIdState(id);
  };

  const setPipelineStep = (step) => {
    setStorageItem('demo_pipeline_step', step);
    setPipelineStepState(step);
  };

  const setTranscript = (data) => {
    setStorageItem('demo_transcript', data);
    setTranscriptState(data);
  };

  const setNotes = (data) => {
    setStorageItem('demo_notes', data);
    setNotesState(data);
  };

  const setQuizQuestions = (data) => {
    setStorageItem('demo_quiz_questions', data);
    setQuizQuestionsState(data);
  };

  const setQuizData = (data) => {
    setStorageItem('demo_quiz_data', data);
    setQuizDataState(data);
  };

  const updateProgress = (xpGain) => {
    setUserProgress(prev => {
      const newXp = prev.xp + xpGain;
      const newLevel = Math.floor(newXp / 500) + 1;
      const newState = { ...prev, xp: newXp, level: newLevel };
      setStorageItem('demo_user_progress', newState);
      return newState;
    });
  };

  const value = {
    sessionId, setSessionId,
    transcript, setTranscript,
    notes, setNotes,
    quizQuestions, setQuizQuestions,
    quizData, setQuizData,
    pipelineStep, setPipelineStep,
    userProgress, updateProgress,
    weakTopics, setWeakTopics
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
