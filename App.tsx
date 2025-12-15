import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { MachineIdForm } from './components/MachineIdForm';

function App() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check local storage or system preference on mount
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    
    if (newIsDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Header isDark={isDark} toggleTheme={toggleTheme} />
      
      <main className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <MachineIdForm />
      </main>

      <footer className="py-6 text-center text-sm text-slate-400 dark:text-slate-600">
        <div className="max-w-7xl mx-auto px-4">
          <p>&copy; {new Date().getFullYear()} POS.AI Technologies. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;