import React from 'react';
import { Sparkles, Package, Calendar, User, ShoppingCart, Info } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: any;
  onLoginClick: () => void;
}

export default function Navigation({ activeTab, setActiveTab, user, onLoginClick }: NavigationProps) {
  const navItems = [
    { id: 'wizard', label: 'Engine', icon: Sparkles },
    { id: 'booking', label: 'Service', icon: Calendar },
    { id: 'admin', label: 'Inventory', icon: Package },
    { id: 'profile', label: 'Account', icon: User },
  ];

  return (
    <nav className="fixed bottom-6 left-6 right-6 z-50 flex justify-center">
      <div className="flex items-center gap-2 bg-[#050505]/90 backdrop-blur-xl border border-zinc-800 p-2 rounded-2xl shadow-2xl">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === item.id 
                ? 'bg-[#ccff00] text-black' 
                : 'text-zinc-500 hover:text-white'
            }`}
          >
            <item.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{item.label}</span>
          </button>
        ))}
        <div className="w-px h-8 bg-zinc-800 mx-2" />
        <button
          onClick={user ? () => setActiveTab('profile') : onLoginClick}
          className="flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-white"
        >
          {user ? user.name : 'Login'}
        </button>
      </div>
    </nav>
  );
}
