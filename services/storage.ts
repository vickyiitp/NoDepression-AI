import { UserProfile, MoodEntry, ChatMessage, RiskAssessment } from "../types";

const KEYS = {
  USER: 'nd_user',
  MOOD: 'nd_mood_history',
  CHAT: 'nd_chat_history',
  RISK: 'nd_risk_assessment'
};

export const storage = {
  saveUser: (user: UserProfile) => {
    localStorage.setItem(KEYS.USER, JSON.stringify(user));
  },
  getUser: (): UserProfile | null => {
    const data = localStorage.getItem(KEYS.USER);
    return data ? JSON.parse(data) : null;
  },
  
  saveMood: (entry: MoodEntry) => {
    const history = storage.getMoodHistory();
    history.push(entry);
    localStorage.setItem(KEYS.MOOD, JSON.stringify(history));
  },
  getMoodHistory: (): MoodEntry[] => {
    const data = localStorage.getItem(KEYS.MOOD);
    return data ? JSON.parse(data) : [];
  },
  
  saveChat: (messages: ChatMessage[]) => {
    localStorage.setItem(KEYS.CHAT, JSON.stringify(messages));
  },
  getChatHistory: (): ChatMessage[] => {
    const data = localStorage.getItem(KEYS.CHAT);
    return data ? JSON.parse(data) : [];
  },

  saveRisk: (assessment: RiskAssessment) => {
    localStorage.setItem(KEYS.RISK, JSON.stringify(assessment));
  },
  getLatestRisk: (): RiskAssessment | null => {
    const data = localStorage.getItem(KEYS.RISK);
    return data ? JSON.parse(data) : null;
  },

  clearAll: () => {
    localStorage.clear();
  }
};