import React from 'react';
import { Brain, Heart, Twitter, Linkedin, Github, Mail, Globe, Shield } from 'lucide-react';
import { AppState } from '../types';

interface FooterProps {
  onNavigate: (view: AppState['view']) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-black/40 border-t border-white/5 pt-20 pb-10 relative overflow-hidden backdrop-blur-xl">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-white/5 to-transparent"></div>
      <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-white/5 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-900/50 flex items-center justify-center border border-white/10">
                <Brain className="text-brand-400 w-6 h-6" />
              </div>
              <span className="font-display font-bold text-xl text-white tracking-tight">
                NoDepression AI
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Empowering students with emotional intelligence and early intervention. 
              Created by <strong>Vicky Kumar</strong>.
            </p>
            <div className="flex gap-4">
               {[
                 { Icon: Github, href: "https://github.com/vickyiitp" },
                 { Icon: Linkedin, href: "#" }, 
                 { Icon: Twitter, href: "#" }
                ].map((item, i) => (
                   <a 
                     key={i} 
                     href={item.href}
                     target="_blank"
                     rel="noreferrer"
                     className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all border border-white/5"
                   >
                       <item.Icon size={18} />
                   </a>
               ))}
            </div>
          </div>

          {/* Links Column */}
          <div>
            <h4 className="font-bold text-white mb-6">Platform</h4>
            <ul className="space-y-4">
              {[
                { label: 'Home', view: 'landing' },
                { label: 'How it Works', view: 'landing' },
                { label: 'Dashboard', view: 'dashboard' },
                { label: 'Success Stories', view: 'about' },
              ].map((item) => (
                <li key={item.label}>
                    <button 
                        onClick={() => onNavigate(item.view as any)}
                        className="text-gray-400 hover:text-brand-400 text-sm transition-colors"
                    >
                        {item.label}
                    </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h4 className="font-bold text-white mb-6">Support</h4>
            <ul className="space-y-4">
               {[
                { label: 'Contact Us', view: 'contact' },
                { label: 'Privacy Policy', view: 'privacy' },
                { label: 'Crisis Resources', view: 'contact' },
                { label: 'About the Team', view: 'about' },
              ].map((item) => (
                <li key={item.label}>
                    <button 
                        onClick={() => onNavigate(item.view as any)}
                        className="text-gray-400 hover:text-brand-400 text-sm transition-colors"
                    >
                        {item.label}
                    </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
             <h4 className="font-bold text-white mb-6">Stay Updated</h4>
             <p className="text-gray-400 text-sm mb-4">Get the latest student wellness features.</p>
             <div className="flex flex-col gap-3">
                 <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-500 transition-colors"
                 />
                 <button className="bg-brand-600 hover:bg-brand-500 text-white rounded-lg px-4 py-3 text-sm font-medium transition-all shadow-lg shadow-brand-500/20">
                     Subscribe
                 </button>
             </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-xs text-center md:text-left">
                © {new Date().getFullYear()} NoDepression AI. Created by <span className="text-brand-400">Vicky Kumar (vickyiitp)</span>.
            </p>
            <div className="flex items-center gap-6 text-xs text-gray-500">
                <span className="flex items-center gap-1"><Shield size={10} /> Secure & Private</span>
                <span className="flex items-center gap-1"><Heart size={10} /> Mental Health First</span>
                <span className="flex items-center gap-1"><Globe size={10} /> Multilingual</span>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;