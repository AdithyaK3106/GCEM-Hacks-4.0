import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Target, Flame, TrendingUp, AlertTriangle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import Card from '../components/ui/Card';
import ProgressBar from '../components/ui/ProgressBar';
import './pages.css';

const Dashboard = () => {
  const { userProgress, weakTopics } = useAppContext();

  return (
    <div className="page-transition">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome back, Learner!</h1>
          <p className="text-text-secondary">Here's your learning progress so far.</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <Card>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(138, 43, 226, 0.1)', color: '#8a2be2' }}>
              <Target size={24} />
            </div>
            <div>
              <p className="text-text-secondary text-sm">Modules Completed</p>
              <h3 className="text-2xl font-bold">{userProgress.completedModules}</h3>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
              <Flame size={24} />
            </div>
            <div>
              <p className="text-text-secondary text-sm">Day Streak</p>
              <h3 className="text-2xl font-bold">{userProgress.streak} Days</h3>
            </div>
          </div>
        </Card>

        <Card>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-text-secondary text-sm">Total XP</p>
              <h3 className="text-2xl font-bold">{userProgress.xp}</h3>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <Card>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <AlertTriangle size={20} className="text-warning" />
            Focus Areas
          </h3>
          <p className="text-text-secondary mb-4 text-sm">Topics you need to review based on recent quizzes.</p>
          
          <div className="space-y-4">
            {weakTopics.map((topic, idx) => (
              <div key={idx}>
                <div className="flex justify-between mb-1 text-sm">
                  <span>{topic.topic}</span>
                  <span className="text-danger">{topic.score}% Mastery</span>
                </div>
                <div className="progress-bar-container">
                  <div 
                    className="progress-bar-fill" 
                    style={{ 
                      width: `${topic.score}%`, 
                      background: `linear-gradient(90deg, #ef4444 ${topic.score}%, transparent ${topic.score}%)` 
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <BookOpen size={20} className="text-info" />
            Recent Activity
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 glass-card rounded-md border-none">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                <Target size={18} />
              </div>
              <div>
                <p className="font-medium">Completed Quiz: Linear Algebra</p>
                <p className="text-xs text-text-secondary">2 hours ago • +50 XP</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 glass-card rounded-md border-none">
              <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500">
                <BookOpen size={18} />
              </div>
              <div>
                <p className="font-medium">Generated Notes: ML Basics</p>
                <p className="text-xs text-text-secondary">Yesterday • +20 XP</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
