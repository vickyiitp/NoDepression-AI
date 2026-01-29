import React, { useEffect } from 'react';
import { Lock, Shield, EyeOff, Database } from 'lucide-react';

const PrivacyPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-24 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 text-teal-400 text-sm font-medium mb-6 border border-teal-500/20">
                <Shield size={14} /> Trust Center
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">Your Secrets are Safe.</h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                We believe privacy is the foundation of mental health support. Here is exactly how we handle your data.
            </p>
        </div>

        {/* Key Points Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
            {[
                { icon: Lock, title: "End-to-End Encryption", desc: "Your conversations are encrypted in transit and at rest." },
                { icon: EyeOff, title: "No Human Review", desc: "No human reads your chats. Only the AI processes them for response." },
                { icon: Database, title: "Local First", desc: "We prioritize local storage for mood history whenever possible." },
                { icon: Shield, title: "Zero Selling", desc: "We never sell your emotional data to advertisers. Ever." },
            ].map((item, i) => (
                <div key={i} className="bg-white/5 rounded-2xl p-6 border border-white/5">
                    <div className="flex items-center gap-4 mb-3">
                        <item.icon className="text-brand-400" size={24} />
                        <h3 className="font-bold text-white">{item.title}</h3>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
            ))}
        </div>

        {/* Detailed Policy Text */}
        <div className="glass-panel p-8 md:p-12 rounded-3xl border border-white/5 space-y-8 text-gray-300 leading-relaxed font-light">
            <section>
                <h3 className="text-xl font-bold text-white mb-4">1. Information We Collect</h3>
                <p>We collect input data (text and voice transcripts) solely for the purpose of generating AI responses and analyzing emotional trends. This data is processed securely and stored temporarily to maintain conversation context.</p>
            </section>
            
            <section>
                <h3 className="text-xl font-bold text-white mb-4">2. AI Processing</h3>
                <p>We use enterprise-grade AI models from Google Cloud. Your data is sent to the API for processing. Google does not use data sent via this API to train their public models, ensuring your conversations remain private.</p>
            </section>

            <section>
                <h3 className="text-xl font-bold text-white mb-4">3. Data Retention</h3>
                <p>You have full control. You can clear your chat history and mood logs at any time via the settings in your dashboard. Once deleted, it is gone forever.</p>
            </section>

            <section>
                <h3 className="text-xl font-bold text-white mb-4">4. Emergency Situations</h3>
                <p>NoDepression AI is not a crisis service. We do not monitor chats in real-time for emergencies. If you indicate severe harm to self or others, the AI is trained to provide standardized crisis resource numbers, but it cannot call emergency services for you.</p>
            </section>

            <div className="pt-8 border-t border-white/10 text-xs text-gray-500">
                Last Updated: October 2025
            </div>
        </div>

      </div>
    </div>
  );
};

export default PrivacyPage;