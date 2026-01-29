import React, { useState, useEffect, Suspense, lazy } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { UserProfile, AppState, UIState } from './types';
import { storage } from './services/storage';

// Lazy Load Pages for Performance
const Landing = lazy(() => import('./pages/Landing'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Onboarding = lazy(() => import('./pages/Onboarding'));
const About = lazy(() => import('./pages/About'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Contact = lazy(() => import('./pages/Contact'));

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
    <div className="w-10 h-10 border-2 border-brand-400 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>({
    view: 'landing',
    user: null
  });

  // Global UI State driven by AI
  const [uiState, setUiState] = useState<UIState>({
    themeTone: 'neutral-balanced',
    backgroundAnimation: 'gentle-pulse',
    interactionDensity: 'normal',
    animationSpeed: 'normal',
    notificationStyle: 'standard'
  });

  useEffect(() => {
    // Check for existing user session
    const user = storage.getUser();
    if (user) {
      setAppState({ view: 'dashboard', user });
    }
  }, []);

  const handleStart = () => {
    setAppState(prev => ({ ...prev, view: 'onboarding' }));
  };

  const handleNavigate = (view: AppState['view']) => {
    setAppState(prev => ({ ...prev, view }));
  };

  const handleOnboardingComplete = (profile: UserProfile) => {
    setAppState({
      view: 'dashboard',
      user: profile
    });
  };

  // Helper to determine dynamic background based on AI state
  const getBackgroundStyle = () => {
    switch (uiState.themeTone) {
      case 'calm-cool':
        return 'bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900';
      case 'warm-uplifting':
        return 'bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900';
      default:
        return 'bg-[#0f172a]'; // Default calm bg
    }
  };

  return (
    <div 
      className={`antialiased text-slate-50 min-h-screen font-sans selection:bg-brand-500/30 selection:text-white transition-colors duration-[2000ms] ${getBackgroundStyle()}`}
      style={{
        // Apply AI-driven animation speed globally via CSS variable
        '--anim-speed': uiState.animationSpeed === 'slow' ? '2s' : uiState.animationSpeed === 'fast' ? '0.3s' : '1s'
      } as React.CSSProperties}
    >
      
      {/* Global Navigation - Hidden only during onboarding */}
      {appState.view !== 'onboarding' && (
        <Header 
            currentView={appState.view} 
            onNavigate={handleNavigate} 
            isLoggedIn={!!appState.user}
        />
      )}

      {/* Main Content Area */}
      <main>
        <Suspense fallback={<LoadingFallback />}>
          {appState.view === 'landing' && (
            <Landing onStart={handleStart} />
          )}
          
          {appState.view === 'onboarding' && (
            <Onboarding onComplete={handleOnboardingComplete} />
          )}

          {appState.view === 'dashboard' && appState.user && (
            <div className="pt-24">
              <Dashboard 
                user={appState.user} 
                onUIChange={setUiState} 
              />
            </div>
          )}

          {appState.view === 'about' && <About />}
          {appState.view === 'privacy' && <Privacy />}
          {appState.view === 'contact' && <Contact />}
        </Suspense>
      </main>

      {/* Global Footer - Hidden during onboarding and dashboard (Dashboard has internal structure) */}
      {appState.view !== 'onboarding' && appState.view !== 'dashboard' && (
        <Footer onNavigate={handleNavigate} />
      )}
    </div>
  );
};

export default App;