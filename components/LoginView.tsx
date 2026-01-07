
import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock, ArrowRight, Github, AlertCircle, Wifi, Loader2, Key } from 'lucide-react';

interface LoginViewProps {
  onLogin: (email: string, password: string) => string | null;
  onSocialLogin: (provider: string) => void;
  onSignUpClick: () => void;
  onForgotPasswordClick: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin, onSocialLogin, onSignUpClick, onForgotPasswordClick }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [socialHandshake, setSocialHandshake] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (email && password) {
      const loginError = onLogin(email, password);
      if (loginError) {
        setError(loginError);
      }
    }
  };

  const handleSocialClick = (provider: string) => {
    setSocialHandshake(provider);
    // Simulate high-fidelity identity provider redirection and verification
    setTimeout(() => {
      onSocialLogin(provider);
      setSocialHandshake(null);
    }, 2500);
  };

  return (
    <div className="min-h-[90vh] flex flex-col items-center justify-center px-4 py-12 relative">
      
      {/* Social Handshake Overlay */}
      {socialHandshake && (
        <div className="fixed inset-0 z-[1000] bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="max-w-md w-full bg-white rounded-[3rem] p-10 text-center shadow-2xl border border-slate-200">
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 rounded-full animate-pulse"></div>
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto border border-slate-100">
                {socialHandshake === 'Google' ? (
                  <img src="https://www.gstatic.com/images/branding/product/1x/googleg_48dp.png" className="w-12 h-12" alt="Google" />
                ) : (
                  <Github size={48} className="text-slate-950" />
                )}
              </div>
              <Loader2 className="absolute -bottom-2 -right-2 w-10 h-10 text-blue-600 animate-spin bg-white rounded-full p-2 border border-slate-200 shadow-md" />
            </div>
            
            <h3 className="text-2xl font-black text-slate-900 mb-2">Identity Handshake</h3>
            <p className="text-slate-500 text-sm font-medium mb-8 leading-relaxed">
              Authenticating via {socialHandshake} Protocol.<br /> Establishing secure vault connection...
            </p>
            
            <div className="space-y-3 bg-slate-50 p-6 rounded-2xl border border-slate-100 text-left font-mono text-[10px]">
              <div className="flex justify-between text-blue-600">
                <span className="font-bold">STATUS</span>
                <span className="animate-pulse">NEGOTIATING</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>PROVIDER</span>
                <span className="text-slate-900 font-bold uppercase">{socialHandshake}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>TLS_VER</span>
                <span className="text-slate-900 font-bold">1.3_VULCAN</span>
              </div>
              <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden mt-4">
                <div className="h-full bg-blue-600 animate-[loading_2.5s_ease-in-out_infinite]"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sandbox Status Header */}
      <div className="mb-8 bg-blue-50 border border-blue-100 px-6 py-2.5 rounded-full flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-1000">
        <Wifi size={16} className="text-blue-600 animate-pulse" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-800">
          Connected to Secure Developer Sandbox (Local Proxy Mode)
        </span>
      </div>

      <div className="max-w-md w-full bg-white rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.1)] border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-500">
        <div className="bg-slate-950 p-10 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
          <div className="flex justify-center mb-6">
            <div className="bg-blue-600 p-3 rounded-2xl shadow-2xl shadow-blue-900/50">
              <ShieldCheck size={36} />
            </div>
          </div>
          <h2 className="text-2xl font-black tracking-tight">GEO Sentinel</h2>
          <p className="text-slate-400 text-[10px] mt-2 font-black uppercase tracking-[0.3em]">Neural Access Protocol</p>
        </div>

        <div className="p-10">
          <div className="flex mb-10 bg-slate-100 p-1.5 rounded-2xl shadow-inner">
            <button 
              onClick={() => { setIsLogin(true); setError(null); }}
              className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${isLogin ? 'bg-white text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Log In
            </button>
            <button 
              onClick={onSignUpClick}
              className="flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all text-slate-400 hover:text-slate-600"
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div className="mb-8 p-5 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-4 text-red-600 animate-in slide-in-from-top-2">
              <AlertCircle size={20} className="shrink-0 mt-0.5" />
              <p className="text-xs font-bold leading-relaxed">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Identity Email</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="email" 
                  required
                  placeholder="name@company.com"
                  className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-8 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-950 font-bold"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-end mb-3">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Signature</label>
                <button 
                  type="button"
                  onClick={onForgotPasswordClick}
                  className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Restore Access
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-8 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-950"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-5 bg-slate-950 text-white rounded-[1.5rem] font-black uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-3 group shadow-2xl shadow-slate-200 active:scale-[0.98]"
            >
              Initialize Session
              <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform" />
            </button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
              <div className="relative flex justify-center text-[10px] uppercase"><span className="bg-white px-3 text-slate-300 font-black tracking-[0.4em]">Integrated Auth</span></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                type="button" 
                onClick={() => handleSocialClick('Google')}
                className="flex items-center justify-center gap-3 py-4 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all font-bold text-xs text-slate-600 shadow-sm active:scale-95"
              >
                <img src="https://www.gstatic.com/images/branding/product/1x/googleg_48dp.png" className="w-5 h-5" alt="Google" />
                Google
              </button>
              <button 
                type="button" 
                onClick={() => handleSocialClick('GitHub')}
                className="flex items-center justify-center gap-3 py-4 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all font-bold text-xs text-slate-600 shadow-sm active:scale-95"
              >
                <Github size={20} className="text-slate-950" />
                GitHub
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Disclaimer */}
      <p className="mt-12 text-center text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em] max-w-sm leading-relaxed">
        Identity Protection Protocol v2.4.1 Active • Sandbox Simulation Mode
      </p>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}} />
    </div>
  );
};
