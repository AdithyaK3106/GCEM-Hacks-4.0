import { useState } from 'react';
import { motion } from 'framer-motion';
import { Book, Clock, Target, TrendingUp, Search, Zap, Star, ChevronRight, PlayCircle, BookOpen, Brain, Trophy } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import Card from '../components/ui/Card';
import './pages.css';

const Dashboard = () => {
  const { userProgress } = useAppContext();
  
  const stats = [
    { label: 'Intelligence Level', value: 'Lv. 12', icon: <Zap size={20} />, color: 'text-[#6D4AFF]', progress: 65, isAccent: true },
    { label: 'Knowledge Points', value: userProgress.xp.toLocaleString(), icon: <Star size={20} />, color: 'text-[#6D4AFF]', progress: 80, isAccent: true },
    { label: 'Accuracy Rate', value: '94%', icon: <Target size={20} />, color: 'text-[#16A34A]', progress: 94, isSuccess: true },
    { label: 'Daily Streak', value: '12 Days', icon: <Trophy size={20} />, color: 'text-[#6D4AFF]', progress: 40, isAccent: true },
  ];

  return (
    <div className="space-y-10">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-5xl font-black text-[#2D1E3E] tracking-tight mb-2">Welcome, Learner</h1>
          <p className="text-[#5A4A6B] font-medium text-xl">Your cognitive engine is primed. Ready to master something new?</p>
        </div>
        <div className="flex gap-3">
          <div className="px-6 py-3 bg-white/30 backdrop-blur-md border border-white/40 rounded-xl shadow-md flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></div>
            <span className="text-xs font-black text-[#8B7CA3] uppercase tracking-widest">Neural Link Active</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <Card key={idx} delay={idx * 0.1}>
            <div className="flex justify-between items-start mb-6">
              <div className={`p-3 rounded-lg bg-white/50 border border-white/50 ${stat.color} shadow-sm`}>
                {stat.icon}
              </div>
              <span className="text-[10px] font-black text-[#8B7CA3] uppercase tracking-widest bg-white/40 px-2 py-1 rounded-md">Real-time</span>
            </div>
            <h3 className={`text-4xl font-black mb-1 ${stat.isSuccess ? 'text-[#16A34A]' : 'text-[#2D1E3E]'}`}>
              {stat.value}
            </h3>
            <p className="text-xs font-bold text-[#8B7CA3] uppercase tracking-widest mb-6">{stat.label}</p>
            <div className="h-1.5 w-full bg-white/30 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${stat.progress}%` }}
                className={`h-full ${stat.isSuccess ? 'bg-[#16A34A]' : 'bg-[#6D4AFF]'}`}
              ></motion.div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-2xl font-black text-[#2D1E3E] flex items-center gap-3">
              <Clock size={24} className="text-[#8B7CA3]" /> Recent Knowledge Syncs
            </h3>
            <button className="text-xs font-black text-[#6D4AFF] uppercase tracking-widest hover:underline transition-all">View History</button>
          </div>
          
          <div className="space-y-4">
            {[
              { title: 'Neural Networks: Part 1', type: 'Lecture Analysis', date: '2 hours ago', score: '92%', icon: <Brain size={20} /> },
              { title: 'Backpropagation Algorithm', type: 'Practice Quiz', date: 'Yesterday', score: '88%', icon: <Target size={20} /> },
              { title: 'Introduction to AI Ethics', type: 'Content Review', date: '2 days ago', score: '100%', icon: <BookOpen size={20} /> },
            ].map((activity, idx) => (
              <Card key={idx} delay={idx * 0.05 + 0.4} className="p-5 flex items-center justify-between group cursor-pointer border-white/20">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-lg bg-white/50 text-[#6D4AFF] flex items-center justify-center group-hover:bg-[#6D4AFF] group-hover:text-white transition-all shadow-sm">
                    {activity.icon}
                  </div>
                  <div>
                    <h4 className="font-black text-[#2D1E3E] text-lg">{activity.title}</h4>
                    <p className="text-xs font-bold text-[#8B7CA3] uppercase tracking-widest">{activity.type} • {activity.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-xl font-black text-[#2D1E3E]">{activity.score}</p>
                    <p className="text-[10px] font-bold text-[#16A34A] uppercase tracking-widest">Mastery</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/40 flex items-center justify-center text-[#8B7CA3] group-hover:text-[#2D1E3E] group-hover:bg-white/60 transition-all">
                    <ChevronRight size={20} />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Recommended Learning */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-2xl font-black text-[#2D1E3E] flex items-center gap-3">
              <PlayCircle size={24} className="text-[#8B7CA3]" /> Neural Path
            </h3>
          </div>
          
          <Card className="bg-[#2D1E3E] p-8 rounded-2xl text-white shadow-2xl relative overflow-hidden group border-none">
            <div className="relative z-10">
              <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 inline-block">Next Milestone</span>
              <h4 className="text-2xl font-black mb-3 leading-tight">Advanced Gradient Descent</h4>
              <p className="text-white/60 text-sm font-medium mb-8">Master the optimization algorithms that drive modern AI engines.</p>
              <button className="w-full py-4 bg-[#6D4AFF] text-white rounded-xl font-black shadow-lg hover:brightness-110 active:scale-95 transition-all">
                Resume Path
              </button>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#6D4AFF]/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
          </Card>

          <Card className="p-6 border-white/20">
            <h4 className="text-xs font-black text-[#8B7CA3] uppercase tracking-widest mb-4">Quick Challenge</h4>
            <div className="flex items-center gap-4 p-4 bg-white/30 rounded-xl border border-white/40">
              <div className="w-10 h-10 bg-[#6D4AFF]/10 text-[#6D4AFF] rounded-lg flex items-center justify-center shadow-sm">
                <Target size={20} />
              </div>
              <div>
                <p className="text-xs font-black text-[#2D1E3E]">Mastery Drill</p>
                <p className="text-[10px] font-bold text-[#8B7CA3]">5 Questions • 200 XP</p>
              </div>
              <button className="ml-auto w-8 h-8 rounded-full bg-[#2D1E3E] text-white flex items-center justify-center hover:scale-110 transition-all">
                <ChevronRight size={16} />
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
