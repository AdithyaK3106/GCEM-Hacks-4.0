import React from 'react';
import { motion } from 'framer-motion';
import { Award, Medal, Crown } from 'lucide-react';
import Card from '../components/ui/Card';
import { useAppContext } from '../context/AppContext';

const leaderboardData = [
  { rank: 1, name: 'Alex Chen', xp: 14500, avatar: 'A' },
  { rank: 2, name: 'Sarah Jenkins', xp: 13200, avatar: 'S' },
  { rank: 3, name: 'Mike Ross', xp: 12800, avatar: 'M' },
  { rank: 4, name: 'You', xp: 1250, avatar: 'Y', isCurrentUser: true },
  { rank: 5, name: 'Emma Wilson', xp: 1100, avatar: 'E' },
  { rank: 6, name: 'David Lee', xp: 950, avatar: 'D' },
];

const Leaderboard = () => {
  const { userProgress } = useAppContext();

  // Update current user XP in leaderboard
  const data = leaderboardData.map(user => 
    user.isCurrentUser ? { ...user, xp: userProgress.xp } : user
  ).sort((a, b) => b.xp - a.xp);

  // Recalculate ranks after sorting
  const rankedData = data.map((user, index) => ({ ...user, rank: index + 1 }));

  return (
    <div className="page-transition max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">
          <Award className="text-warning" size={32} /> Global Leaderboard
        </h1>
        <p className="text-text-secondary">Compete with other learners worldwide.</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-12 items-end">
        {/* Rank 2 */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center"
        >
          <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center text-2xl font-bold border-4 border-slate-400 mb-2 shadow-[0_0_15px_rgba(148,163,184,0.3)]">
            {rankedData[1]?.avatar}
          </div>
          <div className="text-center mb-2">
            <p className="font-bold">{rankedData[1]?.name}</p>
            <p className="text-sm text-text-secondary">{rankedData[1]?.xp} XP</p>
          </div>
          <div className="w-full h-32 bg-slate-800 rounded-t-lg border-t-2 border-slate-400 flex justify-center pt-4">
            <Medal size={32} className="text-slate-400" />
          </div>
        </motion.div>

        {/* Rank 1 */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center"
        >
          <div className="w-20 h-20 rounded-full bg-yellow-600 flex items-center justify-center text-3xl font-bold border-4 border-warning mb-2 shadow-[0_0_25px_rgba(245,158,11,0.5)]">
            {rankedData[0]?.avatar}
          </div>
          <div className="text-center mb-2">
            <p className="font-bold text-warning">{rankedData[0]?.name}</p>
            <p className="text-sm text-text-secondary">{rankedData[0]?.xp} XP</p>
          </div>
          <div className="w-full h-40 bg-yellow-900/30 rounded-t-lg border-t-2 border-warning flex justify-center pt-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-warning/20 to-transparent"></div>
            <Crown size={40} className="text-warning relative z-10" />
          </div>
        </motion.div>

        {/* Rank 3 */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col items-center"
        >
          <div className="w-16 h-16 rounded-full bg-amber-900 flex items-center justify-center text-2xl font-bold border-4 border-amber-600 mb-2 shadow-[0_0_15px_rgba(217,119,6,0.3)]">
            {rankedData[2]?.avatar}
          </div>
          <div className="text-center mb-2">
            <p className="font-bold">{rankedData[2]?.name}</p>
            <p className="text-sm text-text-secondary">{rankedData[2]?.xp} XP</p>
          </div>
          <div className="w-full h-24 bg-amber-900/40 rounded-t-lg border-t-2 border-amber-600 flex justify-center pt-4">
            <Medal size={28} className="text-amber-600" />
          </div>
        </motion.div>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="divide-y divide-white/10">
          {rankedData.slice(3).map((user, index) => (
            <div 
              key={user.rank} 
              className={`flex items-center justify-between p-4 hover:bg-white/5 transition-colors ${user.isCurrentUser ? 'bg-accent-primary/10 border-l-4 border-accent-primary' : ''}`}
            >
              <div className="flex items-center gap-4">
                <span className="w-8 text-center text-text-secondary font-bold">{user.rank}</span>
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold">
                  {user.avatar}
                </div>
                <span className={`font-medium ${user.isCurrentUser ? 'text-accent-primary font-bold' : ''}`}>
                  {user.name} {user.isCurrentUser && '(You)'}
                </span>
              </div>
              <span className="font-mono text-text-secondary">{user.xp} XP</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Leaderboard;
