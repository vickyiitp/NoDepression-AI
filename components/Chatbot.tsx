import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, MoreHorizontal, X, Wifi, WifiOff } from 'lucide-react';
import { ChatMessage, UserProfile } from '../types';
import { sendChatMessage } from '../services/geminiService';
import { storage } from '../services/storage';

interface ChatbotProps {
  userProfile: UserProfile | null;
  onClose?: () => void; // Optional prop for mobile close
}

const Chatbot: React.FC<ChatbotProps> = ({ userProfile, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check connection status (simple check if API key exists in env via our service fallback logic)
    // In a real app, this might ping a health endpoint. 
    // Here we assume online unless the service returns the specific offline message.
    const apiKey = typeof process !== 'undefined' && process.env ? process.env.API_KEY : '';
    setIsOnline(!!apiKey);

    // Load chat history from storage
    const history = storage.getChatHistory();
    if (history.length > 0) {
      setMessages(history);
    } else if (userProfile) {
      // Only set initial greeting if no history exists
      const greeting: ChatMessage = {
        id: 'welcome',
        role: 'model',
        text: `Hi ${userProfile.name}. I'm here to listen. No judgment, just a safe space. How are you feeling right now?`,
        timestamp: new Date().toISOString()
      };
      setMessages([greeting]);
      storage.saveChat([greeting]);
    }
  }, [userProfile]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || !userProfile) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date().toISOString()
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    storage.saveChat(newMessages); // Persist immediately
    setInput('');
    setIsTyping(true);

    const history = newMessages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));
    
    // 🧠 AI Task 4: Conversational Response
    const responseText = await sendChatMessage(input, history, userProfile);

    // Check if offline message was returned
    if (responseText.includes("offline mode")) {
        setIsOnline(false);
    }

    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: new Date().toISOString()
    };

    const finalMessages = [...newMessages, botMsg];
    setMessages(finalMessages);
    storage.saveChat(finalMessages); // Persist
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={`glass-panel rounded-2xl flex flex-col w-full overflow-hidden border border-white/10 shadow-2xl shadow-black/20 ${onClose ? 'h-[100dvh] rounded-none' : 'h-[70vh] md:h-[600px] lg:h-[calc(100vh-140px)] min-h-[500px]'}`}>
      {/* Header */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
             <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-brand-500/20">
               <Bot className="text-white w-5 h-5" />
             </div>
             {/* Status Dot */}
             <span className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-gray-900 rounded-full ${isOnline ? 'bg-green-400' : 'bg-red-500'}`}></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
                <h3 className="font-semibold text-white text-sm">NoDepression AI</h3>
                {!isOnline && <WifiOff size={12} className="text-red-400" />}
            </div>
            <p className="text-[10px] text-brand-200/60 uppercase tracking-wider font-medium">
                {isOnline ? 'Your Safe Space' : 'Offline Mode'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
            {onClose && (
                <button onClick={onClose} className="p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors">
                    <X size={20} />
                </button>
            )}
            {!onClose && (
                <button className="text-gray-400 hover:text-white transition-colors">
                    <MoreHorizontal size={20} />
                </button>
            )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gradient-to-b from-transparent to-black/20">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-end gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-slideUp`}
          >
            {msg.role === 'model' && (
               <div className="w-6 h-6 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-300 mb-1 shrink-0">
                 <Sparkles size={12} />
               </div>
            )}
            
            <div className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed shadow-sm break-words ${
              msg.role === 'user' 
                ? 'bg-brand-600 text-white rounded-br-sm' 
                : 'bg-white/10 text-gray-100 rounded-bl-sm backdrop-blur-sm border border-white/5'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-center gap-2 text-gray-500 text-xs ml-10">
            <div className="flex gap-1 bg-white/5 p-2 rounded-full">
                <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce delay-100"></span>
                <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce delay-200"></span>
            </div>
            <span className="text-brand-300/50">Thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/5 bg-black/20 backdrop-blur-md shrink-0">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={isOnline ? "Type your thoughts..." : "Offline mode (Chat unavailable)"}
            disabled={!isOnline}
            className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-6 pr-14 text-white text-sm focus:outline-none focus:border-brand-500/30 focus:bg-white/10 transition-all placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping || !isOnline}
            className="absolute right-2 top-2 p-2 bg-brand-600 rounded-full text-white hover:bg-brand-500 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg shadow-brand-500/20"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;