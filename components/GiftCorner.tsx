import React, { useState, useEffect } from 'react';
import { Gift, X, Sparkles, Brain, Quote, Gamepad2 } from 'lucide-react';
import { checkGiftVisibility, generateGiftContent } from '../services/geminiService';
import { GiftContent, RiskLevel } from '../types';
import BreathingExercise from './BreathingExercise';

interface GiftCornerProps {
  currentEmotion: string;
  intensity: number;
  riskLevel: RiskLevel;
}

const GiftCorner: React.FC<GiftCornerProps> = ({ currentEmotion, intensity, riskLevel }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState<GiftContent | null>(null);
  const [bubbles, setBubbles] = useState<{id: number, x: number, y: number, size: number}[]>([]);

  useEffect(() => {
    if (!currentEmotion) return;

    const checkVisibility = async () => {
      // Small delay to let chat/mood settle
      await new Promise(r => setTimeout(r, 2000));
      const decision = await checkGiftVisibility(currentEmotion, intensity, riskLevel);
      if (decision.showGift) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    checkVisibility();
  }, [currentEmotion, intensity, riskLevel]);

  const initBubbles = () => {
      const newBubbles = Array.from({ length: 15 }).map((_, i) => ({
          id: i,
          x: Math.random() * 80 + 10,
          y: Math.random() * 80 + 10,
          size: Math.random() * 40 + 40
      }));
      setBubbles(newBubbles);
  };

  const handleOpen = async () => {
    setIsOpen(true);
    setIsLoading(true);
    setContent(null);
    setBubbles([]); // Reset bubbles
    
    // Generate content with safe fallback from service
    const gift = await generateGiftContent(currentEmotion, riskLevel);
    
    // Artificial delay if it was too fast (e.g. offline fallback) to show "wrapping" animation
    if (!gift) {
        // Double safety for null
        setContent({ type: 'quote', text: 'You are enough.', author: 'NoDepression AI' });
    } else {
        setContent(gift);
        if (gift.type === 'game' && gift.gameType === 'bubble-pop') {
            // Wait for render cycle then init
            setTimeout(initBubbles, 100);
        }
    }
    setIsLoading(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsVisible(false); // Hide after use for a while
    setContent(null);
  };

  const popBubble = (id: number) => {
      setBubbles(prev => prev.filter(b => b.id !== id));
  };

  if (!isVisible && !isOpen) return null;

  return (
    <>
      {/* Floating Button - Moved up to bottom-24 to avoid collision with Mobile Chat FAB */}
      {!isOpen && (
        <button
          onClick={handleOpen}
          className="fixed bottom-24 right-6 z-40 group flex items-center justify-center"
          aria-label="Open Gift"
        >
            <div className="absolute inset-0 bg-brand-400 rounded-full blur-xl opacity-40 group-hover:opacity-60 animate-pulse-slow"></div>
            <div className="relative w-14 h-14 bg-gradient-to-br from-brand-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg border border-white/20 transition-transform group-hover:scale-110 group-hover:-translate-y-1">
                <Gift className="text-white w-7 h-7 animate-bounce" />
            </div>
            <span className="absolute right-full mr-4 bg-white/10 backdrop-blur-md px-3 py-1 rounded-lg text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/5">
                A small gift for you
            </span>
        </button>
      )}

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
           {/* Backdrop */}
           <div 
             className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
             onClick={handleClose}
           ></div>

           {/* Card */}
           <div className="relative w-full max-w-md bg-[#0f172a] border border-white/10 rounded-3xl p-8 shadow-2xl shadow-brand-900/50 overflow-hidden animate-slideUp">
                {/* Close Button */}
                <button 
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors z-20"
                >
                    <X size={20} />
                </button>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                        <Sparkles className="w-10 h-10 text-brand-400 animate-spin" />
                        <p className="text-brand-200 text-sm font-medium animate-pulse">Wrapping your gift...</p>
                    </div>
                )}

                {/* Content */}
                {!isLoading && content && (
                    <div className="relative z-10 text-center">
                        
                        {/* Header Icon */}
                        <div className="mx-auto w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
                            {content.type === 'quote' && <Quote className="w-8 h-8 text-yellow-400" />}
                            {content.type === 'fact' && <Brain className="w-8 h-8 text-teal-400" />}
                            {content.type === 'game' && <Gamepad2 className="w-8 h-8 text-pink-400" />}
                        </div>

                        {/* Title */}
                        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-6">
                            {content.type === 'quote' ? 'Daily Wisdom' : content.type === 'fact' ? 'Mind Science' : 'Quick Reset'}
                        </h3>

                        {/* Text Body */}
                        {content.type !== 'game' && (
                            <div className="mb-8">
                                <p className="text-xl md:text-2xl font-display font-medium text-white leading-relaxed">
                                    "{content.text}"
                                </p>
                                {content.author && (
                                    <p className="mt-4 text-brand-400 text-sm font-medium">— {content.author}</p>
                                )}
                            </div>
                        )}

                        {/* Game Body */}
                        {content.type === 'game' && (
                            <div className="mb-6 min-h-[200px] relative rounded-xl bg-black/20 overflow-hidden border border-white/5">
                                
                                {content.gameType === 'breathing' && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                         <BreathingExercise onClose={() => {}} durationSeconds={60} isEmbedded={true} />
                                         {/* Overlay to block the full screen breathing close button since we are in a card */}
                                         <div className="absolute top-0 right-0 p-4 pointer-events-none"></div>
                                    </div>
                                )}

                                {content.gameType === 'bubble-pop' && (
                                    <div className="relative w-full h-[300px] bg-gradient-to-b from-blue-900/20 to-purple-900/20">
                                        <p className="absolute top-4 left-0 right-0 text-center text-xs text-white/50 pointer-events-none">
                                            Pop the stress bubbles
                                        </p>
                                        {bubbles.length === 0 ? (
                                             <div className="absolute inset-0 flex items-center justify-center">
                                                 <span className="text-white font-bold text-lg animate-bounce">Good Job!</span>
                                             </div>
                                        ) : (
                                            bubbles.map(b => (
                                                <button
                                                    key={b.id}
                                                    onClick={() => popBubble(b.id)}
                                                    style={{
                                                        top: `${b.y}%`,
                                                        left: `${b.x}%`,
                                                        width: `${b.size}px`,
                                                        height: `${b.size}px`
                                                    }}
                                                    className="absolute rounded-full bg-brand-500/30 border border-brand-400/50 hover:bg-brand-400 hover:scale-110 transition-all cursor-pointer backdrop-blur-md shadow-[0_0_15px_rgba(56,189,248,0.3)]"
                                                />
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Footer Action */}
                        <button 
                            onClick={handleClose}
                            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full font-medium transition-colors text-sm"
                        >
                            {content.type === 'game' ? 'Done' : 'Thank you'}
                        </button>
                    </div>
                )}
                
                {/* Fail Safe State - prevents blank modal */}
                {!isLoading && !content && (
                    <div className="text-center py-8">
                        <p className="text-gray-400 mb-4">The gift couldn't be unwrapped right now.</p>
                        <button onClick={handleClose} className="text-brand-400 underline">Close</button>
                    </div>
                )}
           </div>
        </div>
      )}
    </>
  );
};

export default GiftCorner;