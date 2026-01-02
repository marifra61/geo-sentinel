
import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock, ArrowRight, Github, Loader2, X, User as UserIcon } from 'lucide-react';

interface LoginViewProps {
  onLogin: (email: string) => void;
  onSignUpClick: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin, onSignUpClick }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [showOAuthModal, setShowOAuthModal] = useState<string | null>(null);

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
    // Simulate verification delay
    setTimeout(() => {
      onLogin(selectedEmail);
    }, 1200);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      {/* OAuth Mock Modal */}
      {showOAuthModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-[400px] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <img src={showOAuthModal === 'google' ? "https://www.gstatic.com/images/branding/product/1x/googleg_48dp.png" : "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"} className="w-6 h-6" alt="Provider" />
                  <span className="font-bold text-slate-900">Sign in with {showOAuthModal === 'google' ? 'Google' : 'GitHub'}</span>
                </div>
                <button onClick={() => setShowOAuthModal(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="text-center mb-8">
                <div className="bg-slate-900 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 text-blue-500">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">GEO Sentinel</h3>
                <p className="text-sm text-slate-500">To continue, {showOAuthModal === 'google' ? 'Google' : 'GitHub'} will share your name and email address with GEO Sentinel.</p>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={() => handleSelectAccount(`john.doe@${showOAuthModal === 'google' ? 'gmail.com' : 'github.com'}`)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-all text-left group"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">JD</div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900">John Doe</p>
                    <p className="text-xs text-slate-500">john.doe@example.com</p>
                  </div>
                  <ChevronRight size={16} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button 
                  onClick={() => handleSelectAccount(`dev.mode@${showOAuthModal === 'google' ? 'google.com' : 'git.ai'}`)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-all text-left group"
                >
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">DM</div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900">Developer Mode</p>
                    <p className="text-xs text-slate-500">dev@protocol.ai</p>
                  </div>
                  <ChevronRight size={16} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                </button>

                <button className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-all text-left group">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <UserIcon size={20} />
                  </div>
                  <p className="text-sm font-bold text-slate-600">Use another account</p>
                </button>
              </div>
            </div>
            <div className="bg-slate-50 px-8 py-4 text-[10px] text-slate-400 font-medium">
              Privacy Policy • Terms of Service
            </div>
          </div>
        </div>
      )}

      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-500">
        <div className="bg-slate-900 p-8 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-500/20">
              <ShieldCheck size={32} />
            </div>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">GEO Sentinel</h2>
          <p className="text-slate-400 text-[10px] mt-2 font-black uppercase tracking-[0.2em]">Secure Access Protocol</p>
        </div>

        <div className="p-8">
          <div className="flex mb-8 bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${isLogin ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Log In
            </button>
            <button 
              onClick={() => {
                setIsLogin(false);
                onSignUpClick();
              }}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${!isLogin ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="email" 
                  required
                  placeholder="name@company.com"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 font-medium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Secure Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 font-medium"
                />
              </div>
            </div>

            {isLogin && (
              <div className="flex justify-end">
                <button type="button" className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700">Recovery Protocol</button>
              </div>
            )}

            <button 
              type="submit"
              disabled={!!isLoading}
              className="w-full py-4 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2 group shadow-xl hover:shadow-slate-200 disabled:opacity-50"
            >
              {isLoading === 'email' ? <Loader2 className="animate-spin" size={20} /> : (
                <>
                  {isLogin ? 'Initialize Session' : 'Create Account'}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
              <div className="relative flex justify-center text-[10px] uppercase font-black tracking-[0.2em]"><span className="bg-white px-4 text-slate-400">Multi-Factor Auth</span></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                type="button" 
                disabled={!!isLoading}
                onClick={() => handleStartOAuth('google')}
                className="flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all font-bold text-sm text-slate-600 active:scale-95 disabled:opacity-50 group"
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
                className="flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all font-bold text-sm text-slate-600 active:scale-95 disabled:opacity-50 group"
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
    </div>
  );
};

// Internal Helper for Layout
const ChevronRight = ({ size, className }: { size: number, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="m9 18 6-6-6-6"/>
  </svg>
);
