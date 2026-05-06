import React from 'react';
import Card from '../components/ui/Card';
import { Settings as SettingsIcon, Bell, Shield, User, Globe, Zap } from 'lucide-react';

const Settings = () => {
  const sections = [
    { icon: <User size={20} />, title: 'Account Preference', desc: 'Manage your cognitive profile and learning identity' },
    { icon: <Bell size={20} />, title: 'Intelligence Alerts', desc: 'Configure when the system notifies you of knowledge gaps' },
    { icon: <Globe size={20} />, title: 'Language & Locale', desc: 'Set your primary and target learning languages' },
    { icon: <Shield size={20} />, title: 'Data & Privacy', desc: 'Manage your local knowledge base and history' },
    { icon: <Zap size={20} />, title: 'AI Configuration', desc: 'Adjust the depth and style of AI note generation' },
  ];

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-8">
      <div>
        <h1 className="text-4xl font-black text-[#2D1E3E] tracking-tight mb-2 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#6D4AFF]/10 text-[#6D4AFF] flex items-center justify-center">
            <SettingsIcon size={28} />
          </div>
          System Configuration
        </h1>
        <p className="text-[#5A4A6B] font-medium text-lg">Optimize your learning engine and platform preferences.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {sections.map((section, idx) => (
          <Card key={idx} className="p-6 cursor-pointer hover:border-[#6D4AFF]/30 transition-all group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-xl bg-white/50 border border-white/30 text-[#8B7CA3] flex items-center justify-center group-hover:text-[#6D4AFF] group-hover:bg-[#6D4AFF]/5 transition-all">
                  {section.icon}
                </div>
                <div>
                  <h3 className="font-black text-[#2D1E3E] text-xl">{section.title}</h3>
                  <p className="text-sm font-medium text-[#5A4A6B]">{section.desc}</p>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center text-[#8B7CA3] group-hover:text-[#2D1E3E] transition-all">
                <Zap size={16} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="pt-10 border-t border-[#2D1E3E]/5 flex justify-end">
        <button className="px-10 py-4 bg-[#6D4AFF] text-white rounded-xl font-black shadow-lg hover:brightness-110 active:scale-95 transition-all">
          Sync Configurations
        </button>
      </div>
    </div>
  );
};

export default Settings;
