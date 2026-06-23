import React from 'react';
import { Sparkles, Package, Calendar, User, Zap } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: any;
  onLoginClick: () => void;
}

export default function Navigation({ activeTab, setActiveTab, user, onLoginClick }: NavigationProps) {
  const navItems = [
    { id: 'wizard', label: 'Engine', icon: Zap },
    { id: 'booking', label: 'Service', icon: Calendar },
    { id: 'admin', label: 'Inventory', icon: Package },
    { id: 'profile', label: 'Account', icon: User },
  ];

  return (
    <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-1 bg-[#0a0a0a]/95 backdrop-blur-2xl border border-zinc-800 p-1.5 rounded-full shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center gap-2.5 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
              activeTab === item.id 
                ? 'bg-[#ccff00] text-black' 
                : 'text-zinc-500 hover:text-white'
            }`}
          >
            <item.icon className="w-3.5 h-3.5" />
            {item.label}
          </button>
        ))}
        <div className="w-px h-6 bg-zinc-800 mx-1" />
        <button
          onClick={user ? () => setActiveTab('profile') : onLoginClick}
          className="flex items-center gap-2 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white"
        >
          {user ? user.name : 'Login'}
        </button>
      </div>
    </nav>
  );
}
