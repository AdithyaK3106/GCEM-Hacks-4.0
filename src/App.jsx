import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/layout/Layout';

import Landing from './pages/Landing';
import Upload from './pages/Upload';
import Notes from './pages/Notes';
import Quiz from './pages/Quiz';
import Results from './pages/Results';
import Dashboard from './pages/Dashboard';
import Leaderboard from './pages/Leaderboard';
import LearningPath from './pages/LearningPath';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/results" element={<Results />} />
            <Route path="/learning-path" element={<LearningPath />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
