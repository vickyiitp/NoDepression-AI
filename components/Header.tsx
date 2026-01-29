import React, { useState, useEffect } from 'react';
import { Brain, Menu, X, ChevronRight } from 'lucide-react';
import { AppState } from '../types';

interface HeaderProps {
  currentView: AppState['view'];
  onNavigate: (view: AppState['view']) => void;
  isLoggedIn: boolean;
}

const Header: React.FC<HeaderProps> = ({ currentView, onNavigate, isLoggedIn }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: { label: string; view: AppState['view'] }[] = [
    { label: 'Home', view: 'landing' },
    { label: 'About', view: 'about' },
    { label: 'Privacy', view: 'privacy' },
    { label: 'Contact', view: 'contact' },
  ];

  const handleNavClick = (view: AppState['view']) => {
    onNavigate(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-500 border-b ${
        isScrolled || mobileMenuOpen 
          ? 'bg-[#0f172a]/80 backdrop-blur-xl border-white/10 py-4' 
          : 'bg-transparent border-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          {/* Logo */}
          <button 
            onClick={() => handleNavClick('landing')}
            className="flex items-center gap-3 group"
          >
            <div className="relative">
                <div className="absolute inset-0 bg-brand-500 blur-lg opacity-40 group-hover:opacity-70 transition-opacity"></div>
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-indigo-600 flex items-center justify-center shadow-lg border border-white/10 group-hover:scale-105 transition-transform duration-300">
                    <Brain className="text-white w-6 h-6" />
                </div>
            </div>
            <span className="font-display font-bold text-xl text-white tracking-tight group-hover:text-brand-200 transition-colors">
              NoDepression AI
            </span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.view)}
                className={`text-sm font-medium transition-all duration-300 relative group ${
                  currentView === link.view ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                {link.label}
                <span className={`absolute -bottom-1 left-0 h-px bg-brand-400 transition-all duration-300 ${
                    currentView === link.view ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </button>
            ))}
            
            <button 
              onClick={() => handleNavClick(isLoggedIn ? 'dashboard' : 'onboarding')}
              className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-full text-sm font-medium transition-all hover:scale-105 border border-white/10 shadow-lg shadow-black/20 flex items-center gap-2 group"
            >
              {isLoggedIn ? 'Dashboard' : 'Start Check-in'}
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-[#0f172a] z-40 transition-transform duration-500 ease-in-out md:hidden flex flex-col pt-32 px-8 space-y-8 ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
          {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.view)}
                className={`text-2xl font-display font-bold text-left ${
                   currentView === link.view ? 'text-brand-400' : 'text-white' 
                }`}
              >
                {link.label}
              </button>
          ))}
           <button 
              onClick={() => handleNavClick(isLoggedIn ? 'dashboard' : 'onboarding')}
              className="px-8 py-4 bg-brand-600 text-white rounded-xl font-bold text-lg mt-8"
            >
              {isLoggedIn ? 'Go to Dashboard' : 'Start Free Check-in'}
            </button>
      </div>
    </nav>
  );
};

export default Header;
