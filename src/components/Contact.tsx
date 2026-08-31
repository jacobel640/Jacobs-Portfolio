import { useState, FC } from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Github, Mail, ArrowUpRight, Heart, Copy, Check, ArrowUp } from 'lucide-react';

export const Contact: FC = () => {
  const currentYear = new Date().getFullYear();
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText('Jacobel640@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinks = [
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/jacob-elcharar-b9ba3a3a1/',
      icon: Linkedin,
      label: 'in/jacob-elcharar',
      actionText: 'Connect',
      glowColor: 'hover:border-blue-500/40 hover:shadow-blue-500/10 text-blue-400',
    },
    {
      name: 'GitHub',
      url: 'https://github.com/jacob-elcharar',
      icon: Github,
      label: 'github.com/jacob-elcharar',
      actionText: 'Follow',
      glowColor: 'hover:border-purple-500/40 hover:shadow-purple-500/10 text-purple-400',
    },
    {
      name: 'Email',
      url: 'mailto:Jacobel640@gmail.com',
      icon: Mail,
      label: 'Jacobel640@gmail.com',
      actionText: 'Send Email',
      glowColor: 'hover:border-emerald-500/40 hover:shadow-emerald-500/10 text-emerald-400',
    },
  ];

  return (
    <footer id="contact" className="relative bg-[#030712] text-slate-100 overflow-hidden pt-20 pb-12">
      {/* Background Decorative Mesh Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-gradient-to-b from-indigo-600/15 via-purple-600/10 to-transparent blur-[120px]" />
        <div className="absolute -bottom-24 right-10 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px]" />
        <div className="absolute -bottom-24 left-10 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16"
        >
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 shadow-sm mb-6 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Open to Opportunities</span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 mb-6">
            Let's Build Something Exceptional
          </h2>

          <p className="text-base sm:text-lg text-slate-400 mb-10 max-w-xl leading-relaxed">
            Have a project in mind, an opportunity to discuss, or looking for a specialized Android engineer / fullstack developer? Let's connect.
          </p>

          {/* Contact Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl mb-8">
            {socialLinks.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.url}
                  target={item.url.startsWith('http') ? '_blank' : undefined}
                  rel={item.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className={`group relative flex flex-col justify-between p-5 rounded-2xl bg-slate-900/50 hover:bg-slate-900/80 border border-white/[0.08] hover:border-white/[0.2] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl backdrop-blur-xl ${item.glowColor}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>

                  <div className="text-left">
                    <div className="text-sm font-bold text-white mb-0.5">{item.name}</div>
                    <div className="text-xs text-slate-400 truncate">{item.label}</div>
                  </div>
                </a>
              );
            })}
          </div>

          {/* Quick Copy Email Action */}
          <div className="flex items-center gap-3 bg-slate-900/60 border border-white/[0.08] rounded-2xl px-5 py-2.5 backdrop-blur-xl shadow-inner">
            <Mail className="w-4 h-4 text-slate-400" />
            <span className="text-xs sm:text-sm text-slate-300 font-mono">Jacobel640@gmail.com</span>
            <button
              onClick={handleCopyEmail}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 border border-white/[0.08] transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Bottom Footer Divider & Bar */}
        <div className="pt-8 mt-12 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {currentYear} Jacob Elcharar. All rights reserved.</p>

          <p className="flex items-center gap-1.5 text-slate-400">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>using React, Tailwind CSS &amp; Framer Motion</span>
          </p>

          <button
            onClick={scrollToTop}
            type="button"
            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Contact;
