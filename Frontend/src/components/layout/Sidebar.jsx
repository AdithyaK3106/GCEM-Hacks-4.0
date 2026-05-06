import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Upload, 
  BookOpen, 
  HelpCircle, 
  LogOut,
  Trophy,
  Target,
  Brain,
  ArrowRight,
  Sparkles,
  Settings as SettingsIcon
} from 'lucide-react';
import './layout.css';

const Sidebar = () => {
  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <Target size={20} />, label: 'Learning Path', path: '/learning-path' },
    { icon: <Upload size={20} />, label: 'Upload Content', path: '/upload' },
    { icon: <Brain size={20} />, label: 'Exam Mode', path: '/exam-mode' },
    { icon: <BookOpen size={20} />, label: 'My Notes', path: '/notes' },
    { icon: <Trophy size={20} />, label: 'Leaderboard', path: '/leaderboard' },
    { icon: <SettingsIcon size={20} />, label: 'Settings', path: '/settings' },
  ];

  return (
    <aside className="sidebar-container w-64 bg-[#533A71] text-white border-none shadow-2xl z-50">
      <div className="sidebar-header">
        <div className="logo-icon bg-white text-[#533A71] shadow-lg shadow-black/20">
          <Brain size={24} />
        </div>
        <h2 className="sidebar-title text-white">Learn<span className="text-[#8B7CA3]">AI</span></h2>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <p className="nav-label text-white/40">Mastery Hub</p>
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active bg-white/10 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-text">{item.label}</span>
              <div className="active-indicator bg-white" />
            </NavLink>
          ))}
        </div>

        <div className="nav-section mt-auto mb-6">
          <p className="nav-label text-white/40">Support</p>
          <NavLink to="/help" className="nav-item text-white/70 hover:bg-white/5 hover:text-white">
            <span className="nav-icon"><HelpCircle size={20} /></span>
            <span className="nav-text">Help Center</span>
          </NavLink>
          
          <button className="nav-item logout-btn mt-4 group text-rose-300 hover:bg-rose-500/10 transition-all">
            <span className="nav-icon transition-transform group-hover:scale-110"><LogOut size={20} /></span>
            <span className="nav-text">Sign Out</span>
          </button>
        </div>
      </nav>
      
      {/* Premium Badge */}
      <div className="pro-badge bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between hover:bg-white/10 transition-all cursor-pointer">
         <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#6D4AFF]/20 text-[#6D4AFF] flex items-center justify-center">
              <Sparkles size={16} fill="currentColor" />
            </div>
            <div className="flex flex-col">
               <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Plan</span>
               <span className="text-sm font-black text-white">Pro Member</span>
            </div>
         </div>
         <ArrowRight size={16} className="text-white/30" />
      </div>
    </aside>
  );
};

export default Sidebar;
