import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { Bell, User, Zap, Flame } from 'lucide-react';
import './layout.css';
import ProgressBar from '../ui/ProgressBar';

const Topbar = () => {
  const { userProgress } = useAppContext();
  
  const xpForNextLevel = userProgress.level * 500;
  const currentLevelXp = userProgress.xp % 500;
  const progressPercent = (currentLevelXp / 500) * 100;

  return (
    <header className="topbar glass-panel">
      <div className="topbar-search">
        <input type="text" placeholder="Search topics, notes..." className="search-input" />
      </div>
      
      <div className="topbar-stats">
        <div className="stat-item streak" title="Day Streak">
          <Flame size={20} color="#f59e0b" />
          <span>{userProgress.streak}</span>
        </div>
        
        <div className="stat-item level-progress">
          <div className="flex justify-between items-center w-full mb-1">
            <span className="text-sm">Lvl {userProgress.level}</span>
            <span className="text-sm text-accent"><Zap size={14} className="inline mr-1" color="#8a2be2" />{userProgress.xp} XP</span>
          </div>
          <ProgressBar progress={progressPercent} />
        </div>
      </div>
      
      <div className="topbar-actions">
        <button className="icon-btn">
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>
        <div className="avatar">
          <User size={20} />
        </div>
      </div>
    </header>
  );
};

export default Topbar;
