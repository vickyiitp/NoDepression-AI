export interface UIState {
  themeTone: 'calm-cool' | 'warm-uplifting' | 'neutral-balanced';
  backgroundAnimation: 'slow-wave' | 'gentle-pulse' | 'static';
  interactionDensity: 'minimal' | 'normal' | 'high';
  animationSpeed: 'slow' | 'normal' | 'fast';
  notificationStyle: 'gentle' | 'standard';
}

export interface MoodEntry {
  id: string;
  timestamp: string; // ISO string for storage
  mood: string;      // AI detected emotion
  intensity: number; // 1-10
  sentiment: 'positive' | 'neutral' | 'negative';
  note: string;
  reason?: string;
  source: 'text' | 'voice' | 'emoji';
  language?: string; // 'English' | 'Hindi' | 'Hinglish'
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string; // ISO string
}

export enum RiskLevel {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export interface RiskAssessment {
  level: RiskLevel;
  factors: string[];
  recommendedAction: string;
  lastUpdated: string; // ISO string
}

export interface WellnessAction {
  id: string;
  title: string;
  description: string;
  duration: string;
  type: 'Breathing' | 'Journaling' | 'Focus' | 'Physical';
  colorTheme: string;
}

export interface UserProfile {
  name: string;
  stressors: string[];
  isStudent: boolean;
  onboardingCompleted: boolean;
}

export interface AppState {
  view: 'landing' | 'onboarding' | 'dashboard' | 'about' | 'privacy' | 'contact';
  user: UserProfile | null;
}

export interface GiftDecision {
  showGift: boolean;
  urgency: 'low' | 'medium' | 'high';
}

export type GiftType = 'quote' | 'fact' | 'game';

export interface GiftContent {
  type: GiftType;
  text: string; // The quote or fact text, or instruction for game
  gameType?: 'breathing' | 'bubble-pop' | 'box-breathing';
  author?: string; // For quotes
}
