import { Bell, User, Zap, Flame, Search, Settings, LogOut, Book, Trophy } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../../context/AppContext';
import './layout.css';
import ProgressBar from '../ui/ProgressBar';

const Topbar = () => {
  const { userProgress } = useAppContext();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const xpForNextLevel = userProgress.level * 500;
  const currentLevelXp = userProgress.xp % 500;
  const progressPercent = (currentLevelXp / 500) * 100;

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = () => {
      setShowNotifications(false);
      setShowProfile(false);
    };
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  return (
    <header className="topbar glass-panel">
      <div className="search-container" onClick={(e) => e.stopPropagation()}>
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
          <input 
            type="text" 
            placeholder="Search topics, notes..." 
            className="search-input" 
            style={{ paddingLeft: '2.5rem' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {searchQuery.length > 0 && (
          <div className="search-results">
            <div className="p-2">
              <p className="text-[10px] uppercase font-bold text-text-muted mb-2 px-2">Quick results</p>
              <div className="notification-item">
                <Book size={16} />
                <span className="text-sm">Supervised Learning Basics</span>
              </div>
              <div className="notification-item">
                <Book size={16} />
                <span className="text-sm">Machine Learning Module 4</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="topbar-stats">
        <div className="stat-item streak" title="Your daily learning streak!">
          <Flame size={20} color="#f59e0b" />
          <span className="font-bold">{userProgress.streak}</span>
        </div>
        
        <div className="stat-item level-progress">
          <div className="flex justify-between items-center w-full mb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest">Level {userProgress.level}</span>
            <span className="text-[10px] font-bold text-accent-primary"><Zap size={10} className="inline mr-1" />{userProgress.xp} XP</span>
          </div>
          <ProgressBar progress={progressPercent} />
        </div>
      </div>
      
      <div className="topbar-actions" onClick={(e) => e.stopPropagation()}>
        <div className="relative">
          <button className="icon-btn" onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}>
            <Bell size={20} />
            <span className="notification-dot"></span>
          </button>
          
          <AnimatePresence>
            {showNotifications && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="dropdown-menu"
              >
                <div className="dropdown-header">
                  <h4>Notifications</h4>
                </div>
                <div className="notification-list">
                  <div className="notification-item">
                    <div className="notification-icon"><Trophy size={16} /></div>
                    <div className="notification-content">
                      <p>You've earned 50 XP today!</p>
                      <span>2 minutes ago</span>
                    </div>
                  </div>
                  <div className="notification-item">
                    <div className="notification-icon"><Zap size={16} /></div>
                    <div className="notification-content">
                      <p>New study materials available for ML</p>
                      <span>1 hour ago</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative">
          <div className="avatar" onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}>
            <User size={20} color="white" />
          </div>

          <AnimatePresence>
            {showProfile && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="dropdown-menu profile-menu"
              >
                <div className="dropdown-header">
                  <h4>My Account</h4>
                </div>
                <div className="notification-list">
                  <div className="profile-link">
                    <User size={16} /> <span>Profile</span>
                  </div>
                  <div className="profile-link">
                    <Settings size={16} /> <span>Settings</span>
                  </div>
                  <div className="profile-link logout">
                    <LogOut size={16} /> <span>Logout</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
