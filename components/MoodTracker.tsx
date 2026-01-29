import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Send, Smile, Frown, Meh, CloudRain, Sun, Zap, CheckCircle2 } from 'lucide-react';
import { MoodEntry, UIState } from '../types';
import { analyzeEmotionAndUI } from '../services/geminiService';

interface MoodTrackerProps {
  onMoodSubmit: (entry: MoodEntry) => void;
  onUIChange: (uiState: UIState) => void;
  isProcessing?: boolean;
}

const MoodTracker: React.FC<MoodTrackerProps> = ({ onMoodSubmit, onUIChange, isProcessing }) => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      // @ts-ignore
      const recognitionInstance = new window.webkitSpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      // Note: We don't force 'en-US' strictly if we want to support Hinglish, but usually it helps with mixed inputs.
      // Ideally, modern browsers detect system lang, or we assume English and let AI handle the Hinglish phonetics.
      recognitionInstance.lang = 'en-US'; 

      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setNote((prev) => prev + (prev ? ' ' : '') + transcript);
        setIsListening(false);
      };

      recognitionInstance.onerror = () => setIsListening(false);
      recognitionInstance.onend = () => setIsListening(false);

      setRecognition(recognitionInstance);
    }
  }, []);

  const toggleListening = () => {
    if (recognition) {
      if (isListening) {
        recognition.stop();
      } else {
        recognition.start();
        setIsListening(true);
      }
    }
  };

  const moods = [
    { label: 'Happy', icon: <Sun className="w-5 h-5" />, color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/20' },
    { label: 'Calm', icon: <Smile className="w-5 h-5" />, color: 'text-teal-400', bg: 'bg-teal-400/10 border-teal-400/20' },
    { label: 'Neutral', icon: <Meh className="w-5 h-5" />, color: 'text-gray-400', bg: 'bg-gray-400/10 border-gray-400/20' },
    { label: 'Stressed', icon: <Zap className="w-5 h-5" />, color: 'text-orange-400', bg: 'bg-orange-400/10 border-orange-400/20' },
    { label: 'Anxious', icon: <CloudRain className="w-5 h-5" />, color: 'text-indigo-400', bg: 'bg-indigo-400/10 border-indigo-400/20' },
    { label: 'Sad', icon: <Frown className="w-5 h-5" />, color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/20' },
  ];

  const handleSubmit = async () => {
    if (!selectedMood) return;
    setAnalyzing(true);
    
    // 🧠 AI Task: Real-Time Emotion & UI Control + Language Detection
    const aiAnalysis = await analyzeEmotionAndUI(note || selectedMood, selectedMood);

    // 🚀 IMMEDIATE UI ADAPTATION
    if (aiAnalysis.uiState) {
        onUIChange(aiAnalysis.uiState);
    }

    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      mood: aiAnalysis.emotion || selectedMood,
      intensity: aiAnalysis.intensity || 5,
      sentiment: aiAnalysis.sentiment || 'neutral',
      note: note,
      reason: aiAnalysis.reason,
      source: isListening ? 'voice' : (note ? 'text' : 'emoji'),
      language: aiAnalysis.detectedLanguage || 'English'
    };

    onMoodSubmit(newEntry);
    setAnalyzing(false);
    setSelectedMood(null);
    setNote('');
  };

  return (
    <div className="glass-panel rounded-2xl p-6 w-full relative overflow-hidden transition-all duration-300 hover:shadow-[0_8px_40px_rgba(0,0,0,0.2)]">
      {/* Dynamic Background Gradient based on selection */}
      {selectedMood && (
        <div className={`absolute inset-0 opacity-10 blur-3xl transition-colors duration-700 pointer-events-none
          ${selectedMood === 'Happy' ? 'bg-yellow-500' : 
            selectedMood === 'Stressed' ? 'bg-orange-600' : 
            selectedMood === 'Anxious' ? 'bg-indigo-600' : 
            'bg-brand-500'}`} 
        />
      )}

      <div className="relative z-10">
        <h3 className="text-xl font-display font-semibold text-white mb-6 flex items-center gap-2">
          How are you feeling?
          {analyzing && <span className="text-xs font-normal text-brand-300 animate-pulse">(AI Listening & Analyzing...)</span>}
        </h3>
        
        <div className="grid grid-cols-6 gap-2 mb-6">
          {moods.map((m) => (
            <button
              key={m.label}
              onClick={() => setSelectedMood(m.label)}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 border ${
                selectedMood === m.label 
                  ? `${m.bg} scale-110 shadow-lg` 
                  : 'bg-white/5 border-transparent opacity-60 hover:opacity-100 hover:bg-white/10'
              }`}
            >
              <div className={`${m.color}`}>{m.icon}</div>
              <span className="text-[10px] mt-2 text-gray-300 font-medium">{m.label}</span>
            </button>
          ))}
        </div>

        <div className="relative group">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Describe it... (I understand English, Hindi, or Hinglish)"
            className="w-full bg-black/20 text-white rounded-xl p-4 pr-12 text-sm focus:outline-none focus:border-white/10 resize-none h-20 placeholder-gray-500 transition-all border border-transparent focus:ring-1 focus:ring-brand-500/50"
          />
          <button 
            onClick={toggleListening}
            className={`absolute right-3 top-3 p-2 rounded-full transition-colors ${isListening ? 'bg-red-500/80 animate-pulse text-white' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
            title="Voice Check-in (Supports Hinglish)"
          >
            {isListening ? <MicOff size={14} /> : <Mic size={14} />}
          </button>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!selectedMood || analyzing || isProcessing}
          className={`w-full mt-4 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
            selectedMood 
              ? 'bg-brand-600 text-white hover:bg-brand-500 hover:shadow-lg shadow-brand-500/20' 
              : 'bg-white/5 text-gray-500 cursor-not-allowed'
          }`}
        >
          {analyzing || isProcessing ? (
             <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Adapting...</span>
             </div>
          ) : (
             <>
               <CheckCircle2 size={18} />
               Log Emotion
             </>
          )}
        </button>
      </div>
    </div>
  );
};

export default MoodTracker;
