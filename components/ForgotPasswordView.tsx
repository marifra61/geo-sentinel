
import React, { useState } from 'react';
import { ShieldCheck, Mail, Key, ArrowLeft, Loader2, AlertCircle, CheckCircle2, Check, X } from 'lucide-react';
import { isPasswordStrong } from '../App';

interface ForgotPasswordViewProps {
  onResetPassword: (email: string, newPassword: string) => string | null;
  onBack: () => void;
}

const PasswordRequirement: React.FC<{ label: string; met: boolean }> = ({ label, met }) => (
  <div className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-tight ${met ? 'text-emerald-500' : 'text-slate-400'}`}>
    {met ? <Check size={12} strokeWidth={3} /> : <X size={12} strokeWidth={3} />}
    {label}
  </div>
);

export const ForgotPasswordView: React.FC<ForgotPasswordViewProps> = ({ onResetPassword, onBack }) => {
  const [step, setStep] = useState<'EMAIL' | 'VERIFY' | 'NEW_PASSWORD' | 'SUCCESS'>('EMAIL');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleIdentify = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    // Simulate lookup
    setTimeout(() => {
      const savedUsers = JSON.parse(localStorage.getItem('geo_sentinel_users') || '{}');
      if (savedUsers[email]) {
        setStep('VERIFY');
      } else {
        setError("Identity lookup failure: No protocol account associated with this email.");
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleVerify = () => {
    setIsLoading(true);
    // Simulate "Rescue Code" verification
    setTimeout(() => {
      setStep('NEW_PASSWORD');
      setIsLoading(false);
    }, 1200);
  };

  const handleFinalize = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isPasswordStrong(newPassword)) {
      setError("Security Threshold Not Met: Follow mandatory standards below.");
      return;
    }

    const result = onResetPassword(email, newPassword);
    if (result) {
      setError(result);
    } else {
      setStep('SUCCESS');
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
          <h2 className="text-2xl font-bold tracking-tight">Identity Recovery</h2>
          <p className="text-slate-400 text-[10px] mt-2 font-black uppercase tracking-[0.2em]">Secure Rescue Protocol</p>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600 text-xs font-bold animate-in slide-in-from-top-2">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          {step === 'EMAIL' && (
            <form onSubmit={handleIdentify} className="space-y-6">
              <p className="text-sm text-slate-500 leading-relaxed mb-4">
                Enter your registered email to initiate the biometric-simulated identity verification loop.
              </p>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Account Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="email" 
                    required
                    placeholder="admin@company.com"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Locate Identity"}
              </button>
              <button type="button" onClick={onBack} className="w-full text-slate-400 hover:text-slate-600 font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-1">
                <ArrowLeft size={12} /> Return to Access Point
              </button>
            </form>
          )}

          {step === 'VERIFY' && (
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                <ShieldCheck size={32} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Identity Found</h3>
                <p className="text-sm text-slate-500 mt-2">A temporary rescue token has been generated for <strong>{email}</strong>.</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-[10px] font-black uppercase tracking-widest text-blue-600">
                Protocol Override: Ready for Reset
              </div>
              <button 
                onClick={handleVerify}
                disabled={isLoading}
                className="w-full py-4 bg-blue-600 text-white rounded-xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Continue Rescue"}
              </button>
            </div>
          )}

          {step === 'NEW_PASSWORD' && (
            <form onSubmit={handleFinalize} className="space-y-6">
              <p className="text-sm text-slate-500 leading-relaxed mb-4">
                Define your new security credential. Ensure it adheres to the Sentinel Encryption standards.
              </p>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">New Protocol Password</label>
                <div className="relative mb-4">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="password" 
                    required
                    placeholder="Define new password"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-y-2 gap-x-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <PasswordRequirement label="8+ Characters" met={newPassword.length >= 8} />
                  <PasswordRequirement label="Uppercase" met={/[A-Z]/.test(newPassword)} />
                  <PasswordRequirement label="Lowercase" met={/[a-z]/.test(newPassword)} />
                  <PasswordRequirement label="Number" met={/[0-9]/.test(newPassword)} />
                  <PasswordRequirement label="Symbol" met={/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)} />
                </div>
              </div>
              <button 
                type="submit"
                className="w-full py-4 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2"
              >
                Finalize New Identity
              </button>
            </form>
          )}

          {step === 'SUCCESS' && (
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={32} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Access Restored</h3>
                <p className="text-sm text-slate-500 mt-2">Your credentials have been successfully updated in the local security vault.</p>
              </div>
              <button 
                onClick={onBack}
                className="w-full py-4 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest hover:bg-black transition-all"
              >
                Log In Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
