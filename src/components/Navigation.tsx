import React from 'react';
import { Package, Calendar, User, Zap, Database, Navigation as NavIcon } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: any;
  onLoginClick: () => void;
}

export default function Navigation({ activeTab, setActiveTab, user, onLoginClick }: NavigationProps) {
  // Production-grade menu flow
  const navItems = [
    { id: 'wizard', label: 'Fitment Engine', icon: Zap, roles: ['guest', 'user', 'admin'] },
    { id: 'booking', label: 'Service Center', icon: Calendar, roles: ['guest', 'user', 'admin'] },
    { id: 'admin', label: 'Data Hub (Admin)', icon: Database, roles: ['admin'] },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-zinc-900">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer group" 
          onClick={() => setActiveTab('landing')}
        >
          <div className="w-8 h-8 bg-[#ff3300] text-black flex items-center justify-center rounded-lg transform group-hover:-rotate-6 transition-transform">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black italic tracking-tighter text-white leading-none">GGLORSING</span>
            <span className="text-[8px] font-mono font-bold tracking-[0.3em] text-[#ff3300] uppercase">System vFINAL</span>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center gap-2">
          {navItems
            .filter(item => !item.roles || item.roles.includes(user?.role || 'guest'))
            .map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === item.id 
                  ? 'text-black bg-[#ff3300] shadow-[0_0_15px_rgba(255,51,0,0.3)]' 
                  : 'text-zinc-500 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={user ? () => setActiveTab('profile') : onLoginClick}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border ${
              user 
                ? (activeTab === 'profile' ? 'border-[#ff3300] text-[#ff3300] bg-[#ff3300]/10' : 'border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-600') 
                : 'border-[#ff3300] text-[#ff3300] hover:bg-[#ff3300] hover:text-black'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            {user ? `ID: ${user.name.split(' ')[0]}` : 'Authenticate'}
          </button>
          <button className="md:hidden text-zinc-400 hover:text-white">
             <NavIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
