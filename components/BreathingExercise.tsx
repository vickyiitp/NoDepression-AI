import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface BreathingExerciseProps {
  onClose: () => void;
  durationSeconds?: number;
  isEmbedded?: boolean;
}

const BreathingExercise: React.FC<BreathingExerciseProps> = ({ onClose, durationSeconds = 120, isEmbedded = false }) => {
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [timer, setTimer] = useState(durationSeconds);
  const [instruction, setInstruction] = useState('Breathe In...');

  useEffect(() => {
    const cycleLength = 12000; // 4s in, 4s hold, 4s out = 12s total cycle? Let's do Box Breathing: 4-4-4-4
    
    // Box Breathing Animation Logic
    const breathingInterval = setInterval(() => {
      setPhase((prev) => {
        if (prev === 'Inhale') {
            setInstruction('Hold...');
            return 'Hold';
        }
        if (prev === 'Hold') {
             // Need check if holding after inhale or exhale. For simplicity, just Inhale -> Hold -> Exhale -> Hold loop
             // Implementing simpler 4-7-8 or similar
             return 'Exhale';
        } 
        return 'Inhale';
      });
    }, 4000); // This is a rough timer for the state, the CSS animation handles the smooth visual

    const countdown = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(countdown);
          clearInterval(breathingInterval);
          onClose();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
        clearInterval(breathingInterval);
        clearInterval(countdown);
    }
  }, [onClose]);

  // Sync instruction with animation time roughly
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const runCycle = () => {
        setPhase('Inhale');
        setInstruction('Breathe In...');
        timeout = setTimeout(() => {
            setPhase('Hold');
            setInstruction('Hold...');
            timeout = setTimeout(() => {
                setPhase('Exhale');
                setInstruction('Breathe Out...');
                timeout = setTimeout(() => {
                     // Loop
                     runCycle();
                }, 4000);
            }, 4000);
        }, 4000);
    };
    runCycle();
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className={`${isEmbedded ? 'absolute' : 'fixed'} inset-0 z-[${isEmbedded ? '10' : '100'}] flex flex-col items-center justify-center ${isEmbedded ? 'bg-transparent' : 'bg-black/90 backdrop-blur-xl'} transition-opacity duration-500`}>
      {!isEmbedded && (
        <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 bg-white/10 rounded-full hover:bg-white/20 text-white transition-colors"
        >
            <X size={24} />
        </button>
      )}

      {!isEmbedded && (
        <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-light text-white tracking-wider mb-2">Calm Your Mind</h2>
            <p className="text-brand-300/80">Follow the rhythm</p>
        </div>
      )}

      <div className={`relative flex items-center justify-center ${isEmbedded ? 'w-40 h-40' : 'w-64 h-64'}`}>
        {/* Outer Glow */}
        <div className={`absolute inset-0 rounded-full bg-brand-500/20 blur-3xl transition-all duration-[4000ms] ease-in-out ${
            phase === 'Inhale' ? 'scale-150 opacity-80' : phase === 'Exhale' ? 'scale-75 opacity-30' : 'scale-100 opacity-60'
        }`}></div>
        
        {/* Breathing Circle */}
        <div className={`${isEmbedded ? 'w-24 h-24' : 'w-48 h-48'} rounded-full border-2 border-brand-300/50 flex items-center justify-center shadow-[0_0_50px_rgba(56,189,248,0.3)] transition-all duration-[4000ms] ease-in-out bg-brand-900/30 backdrop-blur-sm ${
             phase === 'Inhale' ? 'scale-125' : phase === 'Exhale' ? 'scale-90' : 'scale-105'
        }`}>
          <span className={`${isEmbedded ? 'text-sm' : 'text-2xl'} font-light text-white animate-pulse`}>{instruction}</span>
        </div>
      </div>

      {!isEmbedded && (
        <div className="mt-12 text-gray-500 font-mono">
            Time Remaining: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
        </div>
      )}
    </div>
  );
};

export default BreathingExercise;