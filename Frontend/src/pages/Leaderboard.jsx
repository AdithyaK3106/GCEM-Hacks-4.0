import React from 'react';
import Card from '../components/ui/Card';
import { Trophy, Crown, Medal, User, Zap, Star } from 'lucide-react';

const Leaderboard = () => {
  const leaderboardData = [
    { rank: 1, name: 'Learner Alpha', xp: 12500, accuracy: '98%', avatar: 'LA' },
    { rank: 2, name: 'Skill Master', xp: 11200, accuracy: '95%', avatar: 'SM' },
    { rank: 3, name: 'Knowledge Seeker', xp: 10800, accuracy: '94%', avatar: 'KS' },
    { rank: 4, name: 'Path Finder', xp: 9500, accuracy: '92%', avatar: 'PF' },
    { rank: 5, name: 'Brainiac', xp: 8900, accuracy: '91%', avatar: 'BR' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="text-center">
        <h1 className="text-5xl font-black text-[#2D1E3E] tracking-tight mb-3">Global Mastery</h1>
        <p className="text-[#5A4A6B] font-medium text-xl">Compete with top learners and climb the intelligence ladder.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {leaderboardData.map((user, idx) => {
          const isTop3 = user.rank <= 3;
          const rankColors = {
            1: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
            2: 'text-slate-400 bg-slate-400/10 border-slate-400/20',
            3: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
          };

          return (
            <Card 
              key={user.rank} 
              delay={idx * 0.1}
              className={`p-6 border-white/20 transition-all ${user.rank === 1 ? 'ring-2 ring-yellow-500/30 scale-105 shadow-2xl bg-white/40' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-8">
                  {/* Rank Badge */}
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl border ${rankColors[user.rank] || 'text-[#8B7CA3] bg-white/30 border-white/40'}`}>
                    {user.rank === 1 ? <Crown size={28} /> : user.rank}
                  </div>

                  {/* User Identity */}
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-full bg-[#533A71] text-white flex items-center justify-center font-black text-xl shadow-lg">
                      {user.avatar}
                    </div>
                    <div>
                      <h3 className={`font-black text-2xl ${user.rank === 1 ? 'text-[#2D1E3E]' : 'text-[#2D1E3E]'}`}>{user.name}</h3>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="flex items-center gap-1.5 text-xs font-bold text-[#6D4AFF] uppercase tracking-widest">
                          <Zap size={12} fill="currentColor" /> {user.xp.toLocaleString()} XP
                        </span>
                        <span className="flex items-center gap-1.5 text-xs font-bold text-[#16A34A] uppercase tracking-widest">
                          <Star size={12} fill="currentColor" /> {user.accuracy} Acc
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rank Achievement */}
                <div className="hidden md:flex items-center gap-3">
                   {isTop3 && (
                     <div className={`px-4 py-2 rounded-xl border font-black text-xs uppercase tracking-widest ${rankColors[user.rank]}`}>
                        {user.rank === 1 ? 'Master' : user.rank === 2 ? 'Expert' : 'Elite'}
                     </div>
                   )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Leaderboard;
