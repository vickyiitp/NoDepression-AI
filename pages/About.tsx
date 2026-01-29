import React, { useEffect } from 'react';
import { ArrowRight, Target, Users, Zap, Heart } from 'lucide-react';

const About: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-24 min-h-screen">
       {/* Hero */}
       <section className="relative py-20 overflow-hidden">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
               <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 animate-slideUp">
                   Technology with a <span className="gradient-text">Heartbeat.</span>
               </h1>
               <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-fadeIn delay-100">
                   Prioritizing student mental health for 2025–2026. Accessible, private, and powered by empathy.
               </p>
           </div>
           
           {/* Abstract BG */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-brand-500/10 blur-[100px] rounded-full pointer-events-none"></div>
       </section>

       {/* Story Section */}
       <section className="py-20 bg-white/5 border-y border-white/5">
           <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="grid md:grid-cols-2 gap-12 items-center">
                   <div className="relative">
                       <div className="aspect-square rounded-2xl overflow-hidden bg-brand-900/20 border border-white/10 relative group">
                           <div className="absolute inset-0 bg-gradient-to-tr from-brand-500/20 to-transparent opacity-50"></div>
                           <img 
                                src="https://github.com/vickyiitp.png" 
                                alt="Vicky Kumar" 
                                className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
                           />
                       </div>
                   </div>
                   <div>
                       <h2 className="text-3xl font-display font-bold text-white mb-6">The Origin Story</h2>
                       <div className="space-y-4 text-gray-400 leading-relaxed">
                           <p>
                               Created by <strong>Vicky Kumar (vickyiitp)</strong>, NoDepression AI was born from a simple observation: students are suffering in silence. The pressure to perform, combined with the stigma of seeking help, creates a dangerous isolation.
                           </p>
                           <p>
                               We aimed to build a non-clinical, supportive space available 24/7. An intelligent companion that understands context, not just keywords.
                           </p>
                           <p>
                               NoDepression AI is privacy-first and designed to bridge the gap between silent struggle and professional help.
                           </p>
                       </div>
                   </div>
               </div>
           </div>
       </section>

       {/* Values Grid */}
       <section className="py-24">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="grid md:grid-cols-3 gap-8">
                   {[
                       { icon: Target, title: "Precision", desc: "Using advanced neural embeddings to understand emotional nuance, not just keywords." },
                       { icon: Heart, title: "Deep Empathy", desc: "Designed to validate feelings first. We don't fix you; we support you." },
                       { icon: Zap, title: "Always On", desc: "Help that is available in milliseconds, 24/7, anywhere in the world." }
                   ].map((item, i) => (
                       <div key={i} className="glass-panel p-8 rounded-3xl border border-white/5 hover:bg-white/5 transition-all group">
                           <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6 text-brand-400 group-hover:scale-110 transition-transform">
                               <item.icon size={24} />
                           </div>
                           <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                           <p className="text-gray-400">{item.desc}</p>
                       </div>
                   ))}
               </div>
           </div>
       </section>

       {/* Team Section (Simulated) */}
       <section className="py-20 border-t border-white/5">
            <div className="max-w-3xl mx-auto text-center px-4">
                <h2 className="text-3xl font-display font-bold text-white mb-12">Created By</h2>
                <div className="glass-panel p-8 rounded-full inline-flex items-center gap-6 pr-12 hover:bg-white/5 transition-colors border border-white/5">
                    <img 
                        src="https://github.com/vickyiitp.png" 
                        alt="Vicky Kumar"
                        className="w-20 h-20 rounded-full object-cover border-2 border-brand-400/50 shadow-lg"
                    />
                    <div className="text-left">
                        <h3 className="text-xl font-bold text-white">Vicky Kumar</h3>
                        <p className="text-brand-300 text-sm">@vickyiitp</p>
                        <p className="text-gray-500 text-xs mt-1">AI Developer & Student Innovator</p>
                    </div>
                </div>
            </div>
       </section>
    </div>
  );
};

export default About;