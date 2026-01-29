import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, Shield, Sparkles, 
  Mic, Lock, ChevronDown, ChevronUp, 
  XCircle, CheckCircle, BookOpen, Smartphone, Clock, Languages
} from 'lucide-react';
import Background3D from './Background3D';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (glowRef.current) {
        const x = e.clientX;
        const y = e.clientY;
        // Using translate3d for hardware acceleration
        glowRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const faqs = [
    {
      q: "Is NoDepression AI a replacement for therapists?",
      a: "No. It supports emotional well-being and encourages professional help when needed. It is an early detection and support tool, not a medical device."
    },
    {
      q: "Does it understand Hindi or Hinglish?",
      a: "Yes! NoDepression AI automatically detects if you speak English, Hindi, or Hinglish and responds in the same language style. No settings needed."
    },
    {
      q: "Is my data safe?",
      a: "Yes. Data is encrypted, minimized, and never sold. Aapki baatein surakshit aur private hain."
    },
    {
      q: "Who is this for?",
      a: "Students facing stress, anxiety, burnout, or emotional overload who need a safe, non-judgmental space."
    },
    {
      q: "Is this free?",
      a: "Yes, core features are completely free for students."
    }
  ];

  return (
    <div className="flex flex-col relative selection:bg-brand-500/30">
      
      {/* 🔮 Dynamic Background System */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Deep Space Base */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a] via-[#1e1b4b] to-[#0f172a] opacity-80"></div>
        
        {/* 3D Particle Network Layer */}
        <Background3D />

        {/* Cursor Reactive Glow */}
        <div 
            ref={glowRef}
            className="absolute top-0 left-0 w-[600px] h-[600px] bg-brand-500/15 rounded-full blur-[120px] pointer-events-none will-change-transform mix-blend-screen transition-opacity duration-500"
            style={{ transform: 'translate(-50%, -50%)' }}
        ></div>

        {/* Animated Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-brand-600/20 rounded-full blur-[100px] animate-blob mix-blend-screen will-change-transform"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[45vw] h-[45vw] bg-purple-600/20 rounded-full blur-[100px] animate-blob animation-delay-2000 mix-blend-screen will-change-transform"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[55vw] h-[55vw] bg-teal-600/20 rounded-full blur-[100px] animate-blob animation-delay-4000 mix-blend-screen will-change-transform"></div>
        
        {/* Noise & Grid Overlay for "Data/AI" Texture */}
        <div className="absolute inset-0 bg-noise opacity-[0.03]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)] pointer-events-none"></div>
      </div>

      {/* 2. Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 animate-float backdrop-blur-md shadow-lg shadow-brand-900/20">
            <Sparkles className="w-4 h-4 text-brand-300" />
            <span className="text-brand-100 text-sm font-medium tracking-wide">AI-Powered Student Wellness</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display font-bold text-white tracking-tight mb-8 leading-[1.1] drop-shadow-xl">
            Because students deserve <br />
            <span className="gradient-text">mental peace.</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-xl text-gray-300 mb-10 leading-relaxed font-light">
            NoDepression AI isn't just a chatbot. It's an intelligent companion that detects burnout, anxiety, and emotional fatigue before they become a crisis.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={onStart}
              className="px-8 py-4 bg-brand-700 hover:bg-brand-600 text-white rounded-full font-semibold text-lg transition-all hover:scale-105 shadow-[0_0_30px_rgba(56,189,248,0.3)] flex items-center justify-center gap-2 ring-1 ring-white/20"
            >
              Start Free Check-in <ArrowRight size={20} />
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')}
              className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-full font-semibold text-lg transition-colors border border-white/10 flex items-center justify-center backdrop-blur-sm"
            >
              See How It Works
            </button>
          </div>
        </div>
      </section>

      {/* 3. The Reality (Stats) */}
      <section className="py-20 relative border-t border-white/5 bg-black/10 z-10 backdrop-blur-[2px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-12">
                Depression Isn't Rare. <span className="text-gray-500">It's Quiet.</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
                 <div className="p-8 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors duration-300">
                     <div className="text-5xl font-bold text-brand-400 mb-4 drop-shadow-[0_0_15px_rgba(56,189,248,0.5)]">1 in 4</div>
                     <p className="text-gray-300">students experience anxiety or depression during their academic life.</p>
                 </div>
                 <div className="p-8 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors duration-300">
                     <div className="text-5xl font-bold text-indigo-400 mb-4 drop-shadow-[0_0_15px_rgba(129,140,248,0.5)]">Hidden</div>
                     <p className="text-gray-300">Most students don't realize they are mentally declining until burnout hits.</p>
                 </div>
                 <div className="p-8 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors duration-300">
                     <div className="text-5xl font-bold text-teal-400 mb-4 drop-shadow-[0_0_15px_rgba(45,212,191,0.5)]">Silent</div>
                     <p className="text-gray-300">Fear of judgment prevents 60% of students from seeking timely help.</p>
                 </div>
            </div>
        </div>
      </section>

      {/* 4. Causes */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-display font-bold text-white mb-12 text-center">Why Is This Happening?</h2>
            <div className="grid md:grid-cols-4 gap-6">
                 {[
                     { icon: <BookOpen className="text-brand-400"/>, title: "Academic Pressure", desc: "Constant exams & comparison." },
                     { icon: <Smartphone className="text-purple-400"/>, title: "Digital Overload", desc: "Social media & disconnection." },
                     { icon: <Clock className="text-orange-400"/>, title: "Uncertain Future", desc: "Career & financial anxiety." },
                     { icon: <Lock className="text-red-400"/>, title: "Suppression", desc: "No safe space to talk." },
                 ].map((item, i) => (
                     <div key={i} className="glass-panel p-6 rounded-2xl hover:-translate-y-2 transition-transform duration-300 border border-white/5">
                         <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4">{item.icon}</div>
                         <h3 className="font-bold text-white mb-2">{item.title}</h3>
                         <p className="text-sm text-gray-400">{item.desc}</p>
                     </div>
                 ))}
            </div>
        </div>
      </section>

      {/* 5. Problem with Existing Apps */}
      <section className="py-20 bg-white/[0.02] z-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
                        Why Most Apps Don't Work
                    </h2>
                    <p className="text-xl text-gray-400 mb-8">
                        Students don't need more generic advice. They need deep understanding and real-time adaptation.
                    </p>
                    <div className="space-y-4">
                        {["Generic advice", "Boring or overwhelming", "Reactive, not preventive", "No emotional intelligence"].map(text => (
                            <div key={text} className="flex items-center gap-3 text-gray-400">
                                <XCircle className="text-red-500/70" /> {text}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="glass-panel p-8 rounded-3xl border-l-4 border-l-brand-500 shadow-2xl">
                    <h3 className="text-2xl font-bold text-white mb-6">Enter NoDepression AI</h3>
                    <div className="space-y-4">
                         {[
                             "Understanding emotional patterns", 
                             "Early risk detection", 
                             "Adapts UI to your mood", 
                             "Hinglish & Hindi Support"
                         ].map(text => (
                            <div key={text} className="flex items-center gap-3 text-white">
                                <CheckCircle className="text-brand-400" /> {text}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* 6. Solution Highlights (Enhanced Interactions) */}
      <section id="features" className="py-24 relative z-10">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-display font-bold text-white mb-4">Meet NoDepression AI</h2>
            <p className="text-gray-400 max-w-2xl mx-auto mb-16">An AI system that understands emotional patterns, detects early risk, and gently supports students every day.</p>
            
            <div className="grid md:grid-cols-3 gap-8">
                {/* Feature Card 1 */}
                <div className="glass-panel p-8 rounded-3xl group transition-all duration-500 hover:bg-white/10 hover:scale-105 hover:shadow-2xl hover:shadow-brand-500/20 border border-white/5 hover:border-brand-500/30">
                    <div className="w-16 h-16 bg-brand-500/20 text-brand-400 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-lg shadow-brand-500/10">
                        <Shield size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-brand-300 transition-colors">AI Risk Engine</h3>
                    <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">Analyzes mood logs and tone to assign wellness risk levels proactively before burnout hits.</p>
                </div>

                {/* Feature Card 2 */}
                <div className="glass-panel p-8 rounded-3xl group transition-all duration-500 hover:bg-white/10 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 border border-white/5 hover:border-purple-500/30">
                    <div className="w-16 h-16 bg-purple-500/20 text-purple-400 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 shadow-lg shadow-purple-500/10">
                        <Languages size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">We Speak Your Language</h3>
                    <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">English, Hindi, or Hinglish. No settings needed—our AI automatically detects and responds in your comfort language.</p>
                </div>

                {/* Feature Card 3 */}
                <div className="glass-panel p-8 rounded-3xl group transition-all duration-500 hover:bg-white/10 hover:scale-105 hover:shadow-2xl hover:shadow-teal-500/20 border border-white/5 hover:border-teal-500/30">
                    <div className="w-16 h-16 bg-teal-500/20 text-teal-400 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-lg shadow-teal-500/10">
                        <Mic size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-teal-300 transition-colors">Voice Support</h3>
                    <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">Hands-free interaction. Just talk to the AI when you're feeling overwhelmed or need to vent.</p>
                </div>
            </div>
         </div>
      </section>

      {/* 7. How It Works */}
      <section id="how-it-works" className="py-20 border-y border-white/5 bg-black/20 z-10 relative backdrop-blur-[2px]">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-display font-bold text-white mb-16 text-center">How It Works</h2>
            <div className="grid md:grid-cols-4 gap-4 relative">
                 {/* Connecting Line (Desktop) */}
                 <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-brand-500/0 via-brand-500/30 to-brand-500/0"></div>
                 
                 {[
                     { step: "01", title: "Check In", desc: "Share how you feel via text or voice." },
                     { step: "02", title: "AI Analysis", desc: "Engine detects emotion & language." },
                     { step: "03", title: "Early Awareness", desc: "Identifies stress or burnout trends." },
                     { step: "04", title: "Gentle Support", desc: "Personalized guidance & calming actions." },
                 ].map((item, i) => (
                     <div key={i} className="relative z-10 text-center group">
                         <div className="w-24 h-24 rounded-full bg-[#0f172a] border-4 border-brand-500/20 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(56,189,248,0.1)] group-hover:scale-110 transition-transform duration-300 group-hover:border-brand-400/50">
                             <span className="text-2xl font-bold text-brand-400 group-hover:text-brand-300">{item.step}</span>
                         </div>
                         <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                         <p className="text-sm text-gray-400">{item.desc}</p>
                     </div>
                 ))}
            </div>
         </div>
      </section>

      {/* 8. Core Differentiator */}
      <section className="py-24 z-10 relative">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="relative glass-panel rounded-[3rem] p-10 md:p-16 text-center overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.3)]">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-brand-900/40 to-transparent pointer-events-none"></div>
                  <div className="relative z-10">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/20 text-brand-100 text-sm font-bold mb-8 uppercase tracking-wide">
                        The Difference
                      </div>
                      <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-8 drop-shadow-lg">
                          Prevention, Not Just Conversation.
                      </h2>
                      <p className="text-xl text-gray-300 mb-10 leading-relaxed max-w-3xl mx-auto">
                          NoDepression AI doesn't wait for a breakdown. It notices emotional decline early and responds gently with proactive support in your language.
                      </p>
                      <button 
                        onClick={onStart}
                        className="px-8 py-4 bg-white text-brand-900 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors shadow-xl hover:shadow-2xl hover:scale-105 transform duration-300"
                      >
                          Experience the Difference
                      </button>
                  </div>
              </div>
          </div>
      </section>

      {/* 9. Privacy & Ethics */}
      <section className="py-20 bg-black/20 z-10 relative backdrop-blur-[2px]">
         <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
             <div className="w-16 h-16 bg-teal-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-teal-400 shadow-lg shadow-teal-500/10">
                 <Lock size={32} />
             </div>
             <h2 className="text-3xl font-display font-bold text-white mb-8">Built With Care & Responsibility</h2>
             <div className="grid sm:grid-cols-2 gap-4 text-left">
                 {["Privacy-first design", "No medical diagnosis", "No emotional manipulation", "Encourages human support", "No data selling", "Transparent AI"].map((text) => (
                     <div key={text} className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                         <Shield className="text-teal-400 w-5 h-5 flex-shrink-0" />
                         <span className="text-gray-300">{text}</span>
                     </div>
                 ))}
                 <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors sm:col-span-2">
                     <Languages className="text-teal-400 w-5 h-5 flex-shrink-0" />
                     <span className="text-gray-300">"Aapki baatein surakshit aur private hain." (Language-Aware Privacy)</span>
                 </div>
             </div>
         </div>
      </section>

      {/* 10. FAQ */}
      <section id="faq" className="py-20 z-10 relative">
         <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
             <h2 className="text-3xl font-display font-bold text-white mb-12 text-center">Frequently Asked Questions</h2>
             <div className="space-y-4">
                 {faqs.map((faq, index) => (
                     <div key={index} className="glass-panel rounded-2xl overflow-hidden transition-all duration-300 hover:bg-white/5 border border-white/5">
                         <button 
                            onClick={() => toggleFaq(index)}
                            className="w-full flex items-center justify-between p-6 text-left"
                         >
                             <span className="font-semibold text-white">{faq.q}</span>
                             {openFaq === index ? <ChevronUp className="text-gray-400"/> : <ChevronDown className="text-gray-400"/>}
                         </button>
                         {openFaq === index && (
                             <div className="px-6 pb-6 text-gray-400 leading-relaxed border-t border-white/5 pt-4 bg-white/5">
                                 {faq.a}
                             </div>
                         )}
                     </div>
                 ))}
             </div>
         </div>
      </section>

      {/* 12. Final CTA */}
      <section className="py-32 relative overflow-hidden z-10">
          <div className="absolute inset-0 bg-gradient-to-t from-brand-900/60 to-transparent pointer-events-none"></div>
          <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
              <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-8 drop-shadow-xl">
                  You don't have to carry everything alone.
              </h2>
              <button 
                  onClick={onStart}
                  className="px-12 py-5 bg-brand-700 hover:bg-brand-600 text-white rounded-full font-bold text-xl transition-all hover:scale-105 shadow-2xl shadow-brand-500/40 ring-2 ring-white/10"
              >
                  Start Your Calm Journey
              </button>
          </div>
      </section>

    </div>
  );
};

export default LandingPage;
