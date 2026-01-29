import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { UserProfile } from '../types';
import { storage } from '../services/storage';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [stressors, setStressors] = useState<string[]>([]);

  const commonStressors = [
    "Academic Pressure", "Social Anxiety", "Sleep Issues", 
    "Loneliness", "Future Career", "Burnout", "Financial Stress"
  ];

  const toggleStressor = (s: string) => {
    if (stressors.includes(s)) {
      setStressors(stressors.filter(i => i !== s));
    } else {
      setStressors([...stressors, s]);
    }
  };

  const handleFinish = () => {
    const profile: UserProfile = {
      name,
      stressors,
      isStudent: true,
      onboardingCompleted: true
    };
    storage.saveUser(profile);
    onComplete(profile);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-calm-bg relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-600/20 rounded-full blur-[120px] animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] animate-float"></div>

      <div className="glass-panel w-full max-w-lg p-8 rounded-3xl relative z-10 transition-all duration-500">
        
        {/* Progress Bar */}
        <div className="w-full h-1 bg-white/10 rounded-full mb-8">
          <div className="h-full bg-brand-400 rounded-full transition-all duration-500" style={{ width: step === 1 ? '50%' : '100%' }}></div>
        </div>

        {step === 1 ? (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-3xl font-display font-bold text-white mb-2">Hi there.</h2>
              <p className="text-gray-400 text-lg">I'm NoDepression AI. What should I call you?</p>
            </div>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              className="w-full bg-black/20 border-b-2 border-white/10 p-4 text-2xl text-white focus:outline-none focus:border-brand-400 transition-colors placeholder-gray-600 font-light"
              autoFocus
            />
            <button 
              onClick={() => name && setStep(2)}
              disabled={!name}
              className="w-full py-4 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-8"
            >
              Continue <ArrowRight size={20} />
            </button>
          </div>
        ) : (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-3xl font-display font-bold text-white mb-2">Nice to meet you, {name}.</h2>
              <p className="text-gray-400 text-lg">What’s been on your mind lately? (Select all that apply)</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {commonStressors.map((s) => (
                <button
                  key={s}
                  onClick={() => toggleStressor(s)}
                  className={`p-3 rounded-xl text-sm font-medium transition-all duration-300 border ${
                    stressors.includes(s) 
                      ? 'bg-brand-500/20 border-brand-400 text-white' 
                      : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    {s}
                    {stressors.includes(s) && <Check size={14} className="text-brand-300"/>}
                  </div>
                </button>
              ))}
            </div>

            <button 
              onClick={handleFinish}
              className="w-full py-4 bg-gradient-to-r from-brand-600 to-indigo-600 hover:shadow-lg hover:shadow-brand-500/25 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-all mt-8"
            >
              Start My Safe Space <ArrowRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;