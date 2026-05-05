import React from 'react';
import { NavLink } from 'react-router-dom';
import { BookOpen, Upload, ClipboardList, Target, LayoutDashboard, Award, Map } from 'lucide-react';
import { motion } from 'framer-motion';
import './layout.css';

const navItems = [
  { path: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
  { path: '/upload', icon: <Upload size={20} />, label: 'Upload' },
  { path: '/notes', icon: <ClipboardList size={20} />, label: 'Notes' },
  { path: '/quiz', icon: <Target size={20} />, label: 'Quiz' },
  { path: '/learning-path', icon: <Map size={20} />, label: 'Learning Path' },
  { path: '/leaderboard', icon: <Award size={20} />, label: 'Leaderboard' },
];

const Sidebar = () => {
  return (
    <aside className="sidebar glass-panel">
      <div className="sidebar-header">
        <BookOpen size={32} className="text-accent" style={{ color: '#8a2be2' }} />
        <h2 className="text-gradient">NexLearn</h2>
      </div>
      
      <nav className="sidebar-nav">
        {navItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="sidebar-footer">
        <div className="pro-banner">
          <div className="pro-glow"></div>
          <h4>Upgrade to Pro</h4>
          <p>Get unlimited AI credits</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
