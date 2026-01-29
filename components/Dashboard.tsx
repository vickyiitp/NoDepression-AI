import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Shield, Heart, AlertTriangle, TrendingUp, UserCircle, RefreshCcw, Lock, MessageCircle } from 'lucide-react';
import MoodTracker from './MoodTracker';
import Chatbot from './Chatbot';
import BreathingExercise from './BreathingExercise';
import GiftCorner from './GiftCorner';
import { MoodEntry, RiskAssessment, RiskLevel, WellnessAction, UserProfile, UIState } from '../types';
import { analyzeRisk, generateWellnessActions } from '../services/geminiService';
import { storage } from '../services/storage';

interface DashboardProps {
    user: UserProfile;
    onUIChange: (state: UIState) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onUIChange }) => {
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [riskAssessment, setRiskAssessment] = useState<RiskAssessment | null>(null);
  const [wellnessActions, setWellnessActions] = useState<WellnessAction[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showBreathing, setShowBreathing] = useState(false);
  
  // Mobile Chat State
  const [mobileChatOpen, setMobileChatOpen] = useState(false);

  // Load real data on mount
  useEffect(() => {
    const history = storage.getMoodHistory();
    setMoodHistory(history);
    
    const latestRisk = storage.getLatestRisk();
    if (latestRisk) {
      setRiskAssessment(latestRisk);
    }
  }, []);

  const handleMoodSubmit = async (entry: MoodEntry) => {
    setIsProcessing(true);
    
    // Save to local storage immediately
    storage.saveMood(entry);
    const updatedHistory = [...moodHistory, entry];
    setMoodHistory(updatedHistory);
    
    // 🧠 AI Tasks: Risk & Wellness
    const [riskResult, actionsResult] = await Promise.all([
      analyzeRisk(updatedHistory),
      generateWellnessActions(entry.mood, entry.intensity, entry.language) // Pass language context
    ]);

    setRiskAssessment(riskResult);
    storage.saveRisk(riskResult); // Persist risk
    
    setWellnessActions(actionsResult);
    setIsProcessing(false);
  };

  const startAction = (action: WellnessAction) => {
      if (action.type === 'Breathing') {
          setShowBreathing(true);
      }
      // Can add other interactive modes later
  };

  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.HIGH: return 'text-red-400 bg-red-500/10 border-red-500/30 shadow-[0_0_15px_rgba(248,113,113,0.2)]';
      case RiskLevel.MEDIUM: return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
      case RiskLevel.LOW: return 'text-teal-400 bg-teal-500/10 border-teal-500/30';
      default: return 'text-gray-400';
    }
  };

  const chartData = moodHistory.slice(-7).map(m => ({
    name: new Date(m.timestamp).toLocaleDateString('en-US', { weekday: 'short' }),
    score: m.intensity,
  }));

  const latestMood = moodHistory.length > 0 ? moodHistory[moodHistory.length - 1] : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn pb-24">
      
      {showBreathing && <BreathingExercise onClose={() => setShowBreathing(false)} />}
      
      {/* 🎁 Emotion-Adaptive Gift Corner */}
      {latestMood && riskAssessment && (
        <GiftCorner 
            currentEmotion={latestMood.mood} 
            intensity={latestMood.intensity} 
            riskLevel={riskAssessment.level} 
        />
      )}

      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-1">
             Hi, <span className="gradient-text">{user.name}</span>.
          </h1>
          <p className="text-gray-400 text-sm">Let's check in on your peace of mind.</p>
        </div>
        <div className="flex items-center gap-3">
             {riskAssessment && (
                 <div className={`px-4 py-2 rounded-full border flex items-center gap-2 transition-all duration-500 ${getRiskColor(riskAssessment.level)}`}>
                    <Activity size={16} className={riskAssessment.level !== RiskLevel.LOW ? 'animate-pulse' : ''} />
                    <span className="text-sm font-bold tracking-wide uppercase">{riskAssessment.level} Risk</span>
                 </div>
             )}
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 border border-white/10">
                <UserCircle size={20} />
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Data & Actions (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
           
           {/* Mood Tracker */}
           <MoodTracker onMoodSubmit={handleMoodSubmit} onUIChange={onUIChange} isProcessing={isProcessing} />

           {/* Risk Engine & Stats */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Risk Insight Card */}
                <div className="glass-panel rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[240px]">
                    <div className="absolute -right-10 -bottom-10 opacity-5">
                        <Shield size={200} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-4 text-brand-300">
                            <Shield size={18} />
                            <h3 className="text-xs font-bold uppercase tracking-wider">AI Risk Engine</h3>
                        </div>
                        
                        {riskAssessment ? (
                            <div className="space-y-4 relative z-10">
                                <p className="text-lg text-white font-display leading-relaxed">
                                    "{riskAssessment.recommendedAction}"
                                </p>
                                
                                {riskAssessment.factors.length > 0 && (
                                    <div className="space-y-2">
                                        <p className="text-xs text-gray-500 uppercase font-medium">Contributing Factors</p>
                                        <div className="flex flex-wrap gap-2">
                                            {riskAssessment.factors.map((p, i) => (
                                                <span key={i} className="text-xs px-2 py-1 bg-white/10 rounded-md text-gray-300 border border-white/5">
                                                    {p}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-32 text-gray-500 text-sm text-center">
                                <RefreshCcw size={24} className="mb-2 opacity-50" />
                                <p>Log mood to activate risk engine</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Chart Card */}
                <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between">
                     <div className="flex items-center gap-2 mb-4 text-teal-300">
                        <TrendingUp size={18} />
                        <h3 className="text-xs font-bold uppercase tracking-wider">Emotional Trend</h3>
                    </div>
                    {/* Added min-w-0 to fix Recharts width calculation */}
                    <div className="h-40 w-full min-w-0">
                        {chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                                    </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                                    <Tooltip 
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }}
                                    itemStyle={{ color: '#bae6fd' }}
                                    />
                                    <Area type="monotone" dataKey="score" stroke="#38bdf8" strokeWidth={2} fillOpacity={1} fill="url(#colorScore)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                             <div className="flex items-center justify-center h-full text-xs text-gray-600">
                                 No history yet
                             </div>
                        )}
                    </div>
                </div>
           </div>

           {/* Wellness Suggestions */}
           <div>
               <div className="flex items-center gap-2 mb-4 text-pink-300 px-1">
                    <Heart size={18} />
                    <h3 className="text-xs font-bold uppercase tracking-wider">Suggested For You</h3>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                   {wellnessActions.length > 0 ? (
                       wellnessActions.map((action) => (
                           <button 
                                key={action.id} 
                                onClick={() => startAction(action)}
                                className="group glass-panel p-4 rounded-xl text-left transition-all hover:-translate-y-1 hover:border-brand-500/30 hover:shadow-lg hover:shadow-brand-500/10 relative overflow-hidden"
                            >
                                <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-gradient-to-br from-${action.colorTheme}-500 to-transparent`}></div>
                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-white/5 text-${action.colorTheme}-300`}>
                                            {action.type}
                                        </span>
                                        <span className="text-xs text-gray-500">{action.duration}</span>
                                    </div>
                                    <h4 className="text-sm font-semibold text-gray-200 mb-1 group-hover:text-white transition-colors">{action.title}</h4>
                                    <p className="text-xs text-gray-500 line-clamp-2">{action.description}</p>
                                </div>
                           </button>
                       ))
                   ) : (
                       <div className="col-span-3 text-center py-6 border border-dashed border-white/10 rounded-xl">
                            <p className="text-xs text-gray-500">Check in above to get your personalized plan.</p>
                       </div>
                   )}
               </div>
           </div>

        </div>

        {/* RIGHT COLUMN: Chat (Desktop: visible | Mobile: Hidden until toggled) */}
        <div className="hidden lg:block lg:col-span-5 h-full">
            <div className="sticky top-6">
                <Chatbot userProfile={user} />
            </div>
        </div>

      </div>

      {/* MOBILE CHAT TOGGLE (FAB) */}
      <button 
        onClick={() => setMobileChatOpen(true)}
        className="fixed bottom-6 right-6 lg:hidden z-40 w-14 h-14 bg-brand-600 rounded-full flex items-center justify-center text-white shadow-xl shadow-brand-500/30 hover:bg-brand-500 transition-all active:scale-95"
        aria-label="Open Chat"
      >
        <MessageCircle size={28} />
      </button>

      {/* MOBILE CHAT MODAL OVERLAY */}
      {mobileChatOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-[#0f172a] animate-slideUp">
             <Chatbot userProfile={user} onClose={() => setMobileChatOpen(false)} />
        </div>
      )}

      {/* Footer Disclaimer & Security Statement */}
      <div className="text-center pt-8 border-t border-white/5 space-y-2">
        <p className="text-[10px] text-gray-500 max-w-xl mx-auto flex items-center justify-center gap-2 uppercase tracking-wide">
           <Lock size={10} className="text-teal-500" />
           NoDepression AI stores only what is necessary. We never sell data. You control your information.
        </p>
        <p className="text-[10px] text-gray-600 max-w-xl mx-auto flex items-center justify-center gap-2 uppercase tracking-wide">
           <AlertTriangle size={12} className="text-yellow-600" />
           NoDepression AI is an emotional support tool, not a doctor.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;