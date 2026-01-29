import React, { useEffect, useState } from 'react';
import { Mail, MessageCircle, MapPin, Send, AlertTriangle, Phone } from 'lucide-react';

const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="pt-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16 animate-fadeIn">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">We're Here to Listen.</h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Whether you have feedback, a bug report, or just want to share your story, reach out.
            </p>
        </div>

        {/* Crisis Banner - CRITICAL */}
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 mb-16 flex flex-col md:flex-row items-center gap-6 animate-pulse-slow">
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0 text-red-400">
                <AlertTriangle size={24} />
            </div>
            <div className="flex-1 text-center md:text-left">
                <h3 className="text-white font-bold text-lg">In Immediate Danger?</h3>
                <p className="text-gray-300 text-sm">If you or someone else is in danger, please do not use this form or the AI. Call emergency services immediately.</p>
            </div>
            <a href="tel:112" className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold transition-colors flex items-center gap-2">
                <Phone size={18} /> Call 112 / 911
            </a>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
            
            {/* Contact Form */}
            <div className="glass-panel p-8 rounded-3xl border border-white/5">
                <h2 className="text-2xl font-bold text-white mb-6">Send a Message</h2>
                {submitted ? (
                    <div className="h-64 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-4">
                            <Send size={32} />
                        </div>
                        <h3 className="text-white font-bold text-xl">Message Sent</h3>
                        <p className="text-gray-400 mt-2">We'll get back to you as soon as possible.</p>
                        <button onClick={() => setSubmitted(false)} className="mt-6 text-brand-400 hover:text-white underline">Send another</button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Name</label>
                                <input required type="text" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-brand-500 focus:outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Email</label>
                                <input required type="email" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-brand-500 focus:outline-none" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Subject</label>
                            <select className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-brand-500 focus:outline-none">
                                <option className="bg-slate-900">General Support</option>
                                <option className="bg-slate-900">Feature Request</option>
                                <option className="bg-slate-900">Report a Bug</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Message</label>
                            <textarea required rows={5} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-brand-500 focus:outline-none"></textarea>
                        </div>
                        <button type="submit" className="w-full py-4 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-brand-500/20">
                            Send Message
                        </button>
                    </form>
                )}
            </div>

            {/* Info Cards */}
            <div className="space-y-6">
                <div className="glass-panel p-8 rounded-3xl border border-white/5 hover:bg-white/5 transition-colors">
                    <Mail className="text-brand-400 w-8 h-8 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Email Us</h3>
                    <p className="text-gray-400 mb-4">For general inquiries and partnerships.</p>
                    <a href="mailto:hello@nodepression.ai" className="text-white font-medium hover:text-brand-300">hello@nodepression.ai</a>
                </div>

                <div className="glass-panel p-8 rounded-3xl border border-white/5 hover:bg-white/5 transition-colors">
                    <MessageCircle className="text-teal-400 w-8 h-8 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Live Chat Support</h3>
                    <p className="text-gray-400 mb-4">Available Mon-Fri, 9am - 5pm EST.</p>
                    <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs text-white">Currently Offline</span>
                </div>

                <div className="glass-panel p-8 rounded-3xl border border-white/5 hover:bg-white/5 transition-colors">
                    <MapPin className="text-purple-400 w-8 h-8 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Global HQ</h3>
                    <p className="text-gray-400">123 Wellness Way, Innovation District<br/>Cloud City, Internet</p>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default ContactPage;
