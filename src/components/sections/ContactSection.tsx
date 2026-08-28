import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  Copy, 
  Check, 
  Send, 
  Sparkles, 
  MessageSquare,
  ArrowUpRight
} from 'lucide-react';
import { usePortfolio } from '../../context/portfolioStore';
import { MagneticButton } from '../ui/MagneticButton';
import { GithubIcon, LinkedinIcon } from '../ui/Icons';

export const ContactSection: React.FC = () => {
  const { personalInfo } = usePortfolio();
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(personalInfo.email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailtoUrl = `mailto:${personalInfo.email}?subject=Portfolio Contact from ${encodeURIComponent(formData.name)}&body=${encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    )}`;
    window.location.href = mailtoUrl;
  };

  return (
    <section id="contact" className="relative py-20 scroll-mt-24 pb-28 space-y-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-300 text-xs font-mono tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            <span>06 // CONNECT</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            Let's Build <span className="gradient-text-primary">Something Together</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base font-light">
            I am actively seeking internship opportunities, collaborative AI/ML projects, and software engineering roles.
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-brand-violet via-brand-500 to-brand-cyan mx-auto rounded-full mt-2" />
        </div>

        {/* Contact Container */}
        <div className="glass-panel-elevated rounded-3xl p-8 sm:p-12 border border-white/15 relative overflow-hidden">
          
          {/* Ambient background glow */}
          <div className="absolute -top-24 -right-24 w-72 h-72 blob-violet rounded-full blur-3xl opacity-40 pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 blob-cyan rounded-full blur-3xl opacity-30 pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Direct Channels */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-2">
                <h3 className="text-2xl font-display font-bold text-white">
                  Have an opportunity or project in mind?
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed font-light">
                  Feel free to reach out directly via email, phone, or LinkedIn. I am always excited to discuss engineering, AI research, or problem-solving opportunities.
                </p>
              </div>

              <div className="space-y-3 pt-2 text-sm font-mono">
                
                {/* Email Copy Item */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
                  <a
                    href={`mailto:${personalInfo.email}`}
                    className="flex items-center gap-3 text-slate-200 hover:text-brand-300 transition-colors truncate"
                  >
                    <Mail className="w-4 h-4 text-brand-400 flex-shrink-0" />
                    <span className="text-xs sm:text-sm truncate">{personalInfo.email}</span>
                  </a>
                  <button
                    onClick={handleCopyEmail}
                    className="px-3 py-1.5 rounded-xl text-xs bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all flex items-center gap-1.5 flex-shrink-0 ml-2"
                    title="Copy Email Address"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>

                {/* Phone Item */}
                <a
                  href={`tel:${personalInfo.phone.replace(/\s+/g, '')}`}
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 text-slate-200 hover:text-brand-300 hover:border-brand-500/30 transition-all group"
                >
                  <Phone className="w-4 h-4 text-brand-400 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">{personalInfo.phone}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 ml-auto group-hover:text-brand-300 group-hover:translate-x-0.5 transition-all" />
                </a>

                {/* LinkedIn Item */}
                <a
                  href={personalInfo.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 text-slate-200 hover:text-brand-300 hover:border-brand-500/30 transition-all group"
                >
                  <LinkedinIcon className="w-4 h-4 text-brand-400 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">linkedin.com/in/krishna-kanth-m</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 ml-auto group-hover:text-brand-300 group-hover:translate-x-0.5 transition-all" />
                </a>

                {/* GitHub Item */}
                <a
                  href={personalInfo.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 text-slate-200 hover:text-brand-300 hover:border-brand-500/30 transition-all group"
                >
                  <GithubIcon className="w-4 h-4 text-brand-400 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">github.com/{personalInfo.githubUsername}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 ml-auto group-hover:text-brand-300 group-hover:translate-x-0.5 transition-all" />
                </a>

              </div>
            </div>

            {/* Quick Dispatch Box */}
            <div className="lg:col-span-6 glass-panel rounded-2xl p-6 sm:p-7 border border-white/15 space-y-4">
              <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                <MessageSquare className="w-4 h-4 text-brand-400" />
                <h4 className="text-base font-display font-semibold text-white">
                  Send a Direct Message
                </h4>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3.5 text-xs font-mono">
                <div>
                  <label className="block text-slate-400 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Jane Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors shadow-inner"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Your Email</label>
                  <input
                    type="email"
                    required
                    placeholder="jane@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors shadow-inner"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Message</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Hi Krishna, I'd like to discuss a project or role..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors resize-none shadow-inner"
                  />
                </div>

                <MagneticButton
                  type="submit"
                  className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-brand-600 via-brand-500 to-purple-600 hover:from-brand-500 hover:to-purple-500 shadow-lg shadow-brand-500/30 transition-all flex items-center justify-center gap-2"
                >
                  <span>Dispatch Message</span>
                  <Send className="w-3.5 h-3.5" />
                </MagneticButton>
              </form>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
