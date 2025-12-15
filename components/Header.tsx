import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheck, Terminal, Settings, Moon, Sun } from 'lucide-react';

interface HeaderProps {
  isDark: boolean;
  toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isDark, toggleTheme }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsSettingsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="w-full py-6 px-4 sm:px-6 lg:px-8 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors duration-300 relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-md">
            <Terminal size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">POS.AI <span className="text-indigo-600 dark:text-indigo-400 font-medium">Activation</span></span>
        </div>
        
        <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm text-green-600 dark:text-green-400 font-medium bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full border border-green-100 dark:border-green-900/30">
                <ShieldCheck size={16} />
                <span>Connexion Sécurisée</span>
            </div>

            {/* Settings Cog Dropdown */}
            <div className="relative" ref={dropdownRef}>
                <button 
                    onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                    className="p-2 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    aria-label="Paramètres"
                >
                    <Settings size={20} className={isSettingsOpen ? "rotate-90 transition-transform duration-300" : "transition-transform duration-300"} />
                </button>

                {isSettingsOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700 mb-2">
                            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Paramètres</h3>
                        </div>
                        
                        <div className="px-2">
                             <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                                    {isDark ? <Moon size={16} /> : <Sun size={16} />}
                                    <span>Mode Apparence</span>
                                </div>
                                <button 
                                    onClick={toggleTheme}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${isDark ? 'bg-indigo-600' : 'bg-slate-200'}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isDark ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                             </div>
                        </div>
                         <div className="mt-2 px-4 py-2 border-t border-slate-100 dark:border-slate-700 text-xs text-slate-400">
                            Version 1.0.2
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
    </header>
  );
};