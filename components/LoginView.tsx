
import React, { useState, useEffect } from 'react';
import { ShieldCheck, Mail, Lock, ArrowRight, Github, Loader2, X, User as UserIcon, CheckCircle2, Zap, Brain, Globe, Target, ChevronRight as ChevronIcon, TrendingDown, Timer, BarChart3, Radio, Sparkles, Feather, Search } from 'lucide-react';

interface LoginViewProps {
  onLogin: (email: string) => void;
  onSignUpClick: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin, onSignUpClick }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [showOAuthModal, setShowOAuthModal] = useState<string | null>(null);
  const [pulseIndex, setPulseIndex] = useState(0);

  const pulses = [
    "Gemini infrastructure re-indexed 'Global Logistics' sector... Visibility shift detected.",
    "Perplexity citation weights updated for SaaS entities.",
    "ChatGPT knowledge graph logic favoring 'Entity Authority' over backlinks.",
    "Claude neural weight update increasing value of 'Schema JSON-LD' sources."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseIndex((prev) => (prev + 1) % pulses.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsLoading('email');
      setTimeout(() => onLogin(email), 800);
    }
  };

  const handleStartOAuth = (provider: string) => {
    setShowOAuthModal(provider);
  };

  const handleSelectAccount = (selectedEmail: string) => {
    setIsLoading(showOAuthModal);
    setShowOAuthModal(null);
    setTimeout(() => {
      onLogin(selectedEmail);
    }, 1200);
  };

  const stats = [
    { label: "Search Volume Shift", value: "74%", sub: "B2B buyers starting in AI-Search", icon: <BarChart3 size={16} /> },
    { label: "Trust Index", value: "5.2x", sub: "Higher trust in AI citations vs Ads", icon: <Target size={16} /> },
    { label: "Traditional Decay", value: "-42%", sub: "Projected 2025 CTR for Blue Links", icon: <TrendingDown size={16} /> }
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* Left Side: Statistics & Urgency */}
      <div className="lg:w-1/2 bg-slate-900 relative overflow-hidden flex flex-col justify-center px-8 lg:px-20 py-16 text-white">
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 100 C 20 0 50 0 100 100" stroke="white" fill="transparent" strokeWidth="0.05" />
            <path d="M0 80 C 30 20 60 20 100 80" stroke="white" fill="transparent" strokeWidth="0.05" />
          </svg>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[160px] pointer-events-none"></div>

        <div className="relative z-10 max-w-xl">
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-500/20">
              <ShieldCheck size={28} />
            </div>
            <span className="text-xl font-black tracking-tight">GEO <span className="text-blue-500">Sentinel</span></span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest mb-6">
            <Timer size={12} className="animate-pulse" />
            The Search Apocalypse is Here
          </div>

          <h1 className="text-5xl lg:text-6xl font-black mb-8 leading-[1.1] tracking-tight">
            Rank or <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Be Forgotten.</span>
          </h1>
          
          <p className="text-slate-400 text-lg mb-12 leading-relaxed font-medium">
            90% of your future customers will find you via <span className="text-white">Neural Synthesis</span>, not a list of links. If your brand isn't in the AI knowledge graph, you effectively don't exist.
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors group">
                <div className="text-blue-400 mb-2 group-hover:scale-110 transition-transform duration-300">{stat.icon}</div>
                <div className="text-2xl font-black mb-1">{stat.value}</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{stat.label}</div>
                <div className="text-[10px] text-slate-400 leading-tight">{stat.sub}</div>
              </div>
            ))}
          </div>

          {/* Real-time Pulse */}
          <div className="bg-black/40 border border-white/5 rounded-2xl p-4 flex items-center gap-4 mb-16 overflow-hidden">
            <div className="relative flex h-3 w-3 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
            </div>
            <div className="text-xs font-medium text-slate-400 flex-1 truncate">
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 mr-2">Neural Pulse:</span>
              <span key={pulseIndex} className="animate-in fade-in slide-in-from-right-4 duration-500 inline-block">
                {pulses[pulseIndex]}
              </span>
            </div>
          </div>

          {/* LLM Platform Icons Footer */}
          <div className="flex flex-wrap items-center gap-y-6 gap-x-10 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-700">
             <div className="flex items-center gap-2 group/icon">
               <div className="bg-blue-500/10 p-1.5 rounded-lg border border-blue-500/20 text-blue-400 group-hover/icon:bg-blue-500 group-hover/icon:text-white transition-all">
                 <Sparkles size={16} />
               </div>
               <div className="text-sm font-black italic tracking-tighter uppercase group-hover/icon:text-white transition-colors">Gemini</div>
             </div>
             
             <div className="flex items-center gap-2 group/icon">
               <div className="bg-emerald-500/10 p-1.5 rounded-lg border border-emerald-500/20 text-emerald-400 group-hover/icon:bg-emerald-500 group-hover/icon:text-white transition-all">
                 <Zap size={16} />
               </div>
               <div className="text-sm font-black italic tracking-tighter uppercase group-hover/icon:text-white transition-colors">ChatGPT</div>
             </div>

             <div className="flex items-center gap-2 group/icon">
               <div className="bg-orange-500/10 p-1.5 rounded-lg border border-orange-500/20 text-orange-400 group-hover/icon:bg-orange-500 group-hover/icon:text-white transition-all">
                 <Feather size={16} />
               </div>
               <div className="text-sm font-black italic tracking-tighter uppercase group-hover/icon:text-white transition-colors">Claude</div>
             </div>

             <div className="flex items-center gap-2 group/icon">
               <div className="bg-cyan-500/10 p-1.5 rounded-lg border border-cyan-500/20 text-cyan-400 group-hover/icon:bg-cyan-500 group-hover/icon:text-white transition-all">
                 <Search size={16} />
               </div>
               <div className="text-sm font-black italic tracking-tighter uppercase group-hover/icon:text-white transition-colors">Perplexity</div>
             </div>
          </div>
        </div>
      </div>

      {/* Right Side: Authentication Card */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 bg-slate-50 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-100/20 via-transparent to-transparent pointer-events-none"></div>
        
        <div className="max-w-md w-full animate-in fade-in slide-in-from-right-8 duration-700 relative z-10">
          <div className="bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 p-10 text-center text-white relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
              <div className="flex justify-center mb-4">
                <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/20 scale-110">
                  <ShieldCheck size={28} />
                </div>
              </div>
              <h2 className="text-2xl font-bold tracking-tight">Secure Authorization</h2>
              <p className="text-slate-400 text-[10px] mt-2 font-black uppercase tracking-[0.3em]">Initialize GEO Sentinel Node</p>
            </div>

            <div className="p-10">
              <div className="flex mb-10 bg-slate-100 p-1.5 rounded-2xl">
                <button 
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-3 text-sm font-black uppercase tracking-widest rounded-xl transition-all ${isLogin ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Log In
                </button>
                <button 
                  onClick={() => {
                    setIsLogin(false);
                    onSignUpClick();
                  }}
                  className={`flex-1 py-3 text-sm font-black uppercase tracking-widest rounded-xl transition-all ${!isLogin ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Sign Up
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-5">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Identity Protocol (Email)</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="email" 
                        required
                        placeholder="name@company.com"
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-900 font-bold placeholder:text-slate-300"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Access Cipher (Password)</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="password" 
                        required
                        placeholder="••••••••"
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-900 font-bold placeholder:text-slate-300"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                  <div className="flex items-center gap-2 text-slate-400">
                    <input type="checkbox" className="rounded-sm border-slate-300 text-blue-600 focus:ring-blue-500" />
                    <span>Remember</span>
                  </div>
                  <button type="button" className="text-blue-600 hover:text-blue-700 hover:underline">Recovery Protocol</button>
                </div>

                <button 
                  type="submit"
                  disabled={!!isLoading}
                  className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-3 group shadow-2xl hover:shadow-blue-500/20 disabled:opacity-50 active:scale-[0.98]"
                >
                  {isLoading === 'email' ? <Loader2 className="animate-spin" size={20} /> : (
                    <>
                      {isLogin ? 'Initialize Session' : 'Claim Your Domain'}
                      <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform" />
                    </>
                  )}
                </button>

                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                  <div className="relative flex justify-center text-[10px] uppercase font-black tracking-[0.3em]"><span className="bg-white px-4 text-slate-300">Fast-Track Entry</span></div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button 
                    type="button" 
                    disabled={!!isLoading}
                    onClick={() => handleStartOAuth('google')}
                    className="flex items-center justify-center gap-3 py-4 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all font-bold text-sm text-slate-700 active:scale-95 disabled:opacity-50 group shadow-sm"
                  >
                    {isLoading === 'google' ? <Loader2 className="animate-spin" size={18} /> : (
                      <>
                        <img src="https://www.gstatic.com/images/branding/product/1x/googleg_48dp.png" className="w-5 h-5 group-hover:scale-110 transition-transform" alt="Google" />
                        Google
                      </>
                    )}
                  </button>
                  <button 
                    type="button" 
                    disabled={!!isLoading}
                    onClick={() => handleStartOAuth('github')}
                    className="flex items-center justify-center gap-3 py-4 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all font-bold text-sm text-slate-700 active:scale-95 disabled:opacity-50 group shadow-sm"
                  >
                    {isLoading === 'github' ? <Loader2 className="animate-spin" size={18} /> : (
                      <>
                        <Github size={20} className="group-hover:scale-110 transition-transform" />
                        GitHub
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="mt-8 flex items-center justify-center gap-4">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Neural Infrastructure Protocol v2.5.0-Final</p>
            <div className="h-4 w-px bg-slate-200"></div>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">© GEO Sentinel.net</p>
          </div>
        </div>
      </div>

      {/* OAuth Mock Modal */}
      {showOAuthModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-[400px] rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-10">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <img src={showOAuthModal === 'google' ? "https://www.gstatic.com/images/branding/product/1x/googleg_48dp.png" : "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"} className="w-6 h-6" alt="Provider" />
                  <span className="font-bold text-slate-900 text-lg">Verify via {showOAuthModal === 'google' ? 'Google' : 'GitHub'}</span>
                </div>
                <button onClick={() => setShowOAuthModal(null)} className="text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-50 rounded-full">
                  <X size={20} />
                </button>
              </div>

              <div className="text-center mb-10">
                <div className="bg-slate-900 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 text-blue-500 shadow-xl shadow-blue-500/10">
                  <ShieldCheck size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900">GEO Sentinel Access</h3>
                <p className="text-sm text-slate-500 leading-relaxed mt-2 px-4">Authorize our neural auditors to sync with your identity records.</p>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={() => handleSelectAccount(`john.doe@${showOAuthModal === 'google' ? 'gmail.com' : 'github.com'}`)}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 hover:border-blue-100 transition-all text-left group"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-black text-lg">JD</div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900">John Doe</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">john.doe@example.com</p>
                  </div>
                  <ChevronIcon size={18} className="text-slate-300 group-hover:translate-x-1.5 transition-transform" />
                </button>
                
                <button 
                  onClick={() => handleSelectAccount(`dev.mode@${showOAuthModal === 'google' ? 'google.com' : 'git.ai'}`)}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 hover:border-blue-100 transition-all text-left group"
                >
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-black text-lg">DM</div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900">Developer Mode</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">dev@protocol.ai</p>
                  </div>
                  <ChevronIcon size={18} className="text-slate-300 group-hover:translate-x-1.5 transition-transform" />
                </button>

                <button 
                  onClick={() => handleSelectAccount('marino.frank@gmail.com')}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl border border-blue-100 bg-blue-50/50 hover:bg-blue-100 transition-all text-left group"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-lg">MF</div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900">Marino Frank</p>
                    <p className="text-[10px] text-blue-600 font-black uppercase tracking-tighter">System Administrator</p>
                  </div>
                  <ShieldCheck size={18} className="text-blue-500" />
                </button>
              </div>
            </div>
            <div className="bg-slate-50 px-10 py-6 text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] flex justify-between items-center border-t border-slate-100">
              <span className="hover:text-slate-600 cursor-pointer">Privacy</span>
              <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
              <span className="hover:text-slate-600 cursor-pointer">Terms</span>
              <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
              <span className="hover:text-slate-600 cursor-pointer">Ethics</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
