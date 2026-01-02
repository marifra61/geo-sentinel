
import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock, ArrowRight, Github, AlertCircle } from 'lucide-react';

interface LoginViewProps {
  onLogin: (email: string, password: string) => string | null; // Returns error message or null
  onSignUpClick: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin, onSignUpClick }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-500">
        <div className="bg-slate-900 p-8 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-2 rounded-xl">
              <ShieldCheck size={32} />
            </div>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">GEO Sentinel</h2>
          <p className="text-slate-400 text-[10px] mt-2 font-black uppercase tracking-[0.2em]">Secure Access Protocol</p>
        </div>

        <div className="p-8">
          <div className="flex mb-8 bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => { setIsLogin(true); setError(null); }}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${isLogin ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Log In
            </button>
            <button 
              onClick={() => {
                onSignUpClick();
              }}
              className="flex-1 py-2 text-sm font-bold rounded-lg transition-all text-slate-500 hover:text-slate-700"
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600 animate-in slide-in-from-top-2">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <p className="text-xs font-bold leading-tight">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
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
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Protocol Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <a href="#" className="text-[10px] font-black uppercase tracking-wider text-blue-600 hover:text-blue-700">Restore Access</a>
            </div>

            <button 
              type="submit"
              className="w-full py-4 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2 group shadow-lg hover:shadow-slate-200"
            >
              Initialize Session
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
              <div className="relative flex justify-center text-[10px] uppercase"><span className="bg-white px-2 text-slate-400 font-black tracking-[0.2em]">Or continue with</span></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button type="button" className="flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors font-bold text-xs text-slate-600">
                <img src="https://www.gstatic.com/images/branding/product/1x/googleg_48dp.png" className="w-5 h-5" alt="Google" />
                Google
              </button>
              <button type="button" className="flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors font-bold text-xs text-slate-600">
                <Github size={18} />
                GitHub
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
