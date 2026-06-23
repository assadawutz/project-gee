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
    <header className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-zinc-800">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2" onClick={() => setActiveTab('landing')}>
          <Zap className="w-6 h-6 text-[#ccff00]" />
          <span className="text-xl font-black italic tracking-tighter text-white">GEE</span>
        </div>
        
        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                activeTab === item.id 
                  ? 'text-[#ccff00] bg-zinc-900' 
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <item.icon className="w-3.5 h-3.5" />
              {item.label}
            </button>
          ))}
        </nav>

        <button
          onClick={user ? () => setActiveTab('profile') : onLoginClick}
          className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest text-zinc-300 hover:text-white border border-zinc-700 hover:border-zinc-500 transition-all"
        >
          {user ? user.name : 'Sign In'}
        </button>
      </div>
    </header>
  );
}
