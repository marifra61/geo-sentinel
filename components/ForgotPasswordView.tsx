
import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Mail, 
  Key, 
  ArrowLeft, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  Check, 
  X, 
  Bell, 
  Inbox, 
  Send, 
  ShieldAlert, 
  Copy,
  Terminal,
  Info,
  Globe,
  Lock,
  Wifi,
  Code,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
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

// Component to show the "Real World" code for Resend integration
const ProductionMigrationGuide: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const codeSnippet = `// PRODUCTION BACKEND CODE (Node.js + Resend)
// 1. Install: npm install resend
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  const { email, token } = await request.json();

  await resend.emails.send({
    from: 'GEO Sentinel Security <security@yourdomain.com>',
    to: email,
    subject: 'URGENT: Identity Recovery Protocol',
    html: \`<h1>Secure Token: \${token}</h1>
           <p>Use this code to reset your GEO Sentinel access.</p>\`
  });

  return Response.json({ success: true });
}`;

  return (
    <div className="fixed inset-0 z-[2000] bg-slate-900/95 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 w-full max-w-2xl rounded-3xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Code className="text-blue-400" size={20} />
            <h3 className="text-white font-bold">Production Integration Guide</h3>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white"><X size={24} /></button>
        </div>
        <div className="p-8 overflow-y-auto">
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            In a real-world scenario, you would host a small backend (Node.js/Next.js) and call the <strong>Resend API</strong>. The frontend code you see here is already structured to support this transition.
          </p>
          <div className="bg-black/50 p-6 rounded-2xl border border-slate-800 font-mono text-xs text-blue-300 leading-relaxed overflow-x-auto whitespace-pre">
            {codeSnippet}
          </div>
          <div className="mt-8 flex gap-4">
            <a href="https://resend.com/docs" target="_blank" rel="noreferrer" className="flex-1 bg-white text-slate-950 py-3 rounded-xl font-bold text-center text-sm flex items-center justify-center gap-2 hover:bg-slate-100 transition-all">
              Resend Documentation <ExternalLink size={14} />
            </a>
            <button onClick={onClose} className="flex-1 bg-slate-800 text-white py-3 rounded-xl font-bold text-sm">Close Guide</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// High-Fidelity Simulated Email Client
const SimulatedInbox: React.FC<{ 
  email: string; 
  token: string; 
  onConfirm: () => void;
  onClose: () => void 
}> = ({ email, token, onConfirm, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-4xl rounded-[2rem] shadow-[0_0_100px_rgba(37,99,235,0.2)] overflow-hidden flex flex-col h-[85vh] border border-slate-200">
        
        {/* Chrome-style Tab Bar */}
        <div className="bg-slate-100 px-6 py-3 flex items-center justify-between border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-6">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <Inbox size={14} />
              <span className="font-bold text-[10px] uppercase tracking-widest">Sentinel Mail Gateway (v1.0.4)</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase">
               <Wifi size={12} />
               Sandbox Link Active
             </div>
             <button onClick={onClose} className="text-slate-400 hover:text-slate-900 transition-colors">
               <X size={20} />
             </button>
          </div>
        </div>
        
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="hidden md:flex w-64 bg-slate-50 p-6 flex-col border-r border-slate-200 shrink-0">
            <button className="bg-blue-600 text-white rounded-2xl py-3 px-4 font-bold text-sm shadow-lg shadow-blue-200 flex items-center gap-2 mb-8">
              <Mail size={16} /> Compose
            </button>
            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between p-3 bg-blue-100/50 text-blue-700 rounded-xl text-sm font-bold border border-blue-200/50">
                <div className="flex items-center gap-3"><Inbox size={18} /> Inbox</div>
                <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-md">1</span>
              </div>
              <div className="flex items-center gap-3 p-3 text-slate-500 text-sm font-semibold hover:bg-slate-100 rounded-xl cursor-not-allowed">
                <Send size={18} /> Sent
              </div>
              <div className="flex items-center gap-3 p-3 text-slate-500 text-sm font-semibold hover:bg-slate-100 rounded-xl cursor-not-allowed">
                <ShieldAlert size={18} /> Junk
              </div>
            </div>
          </div>
          
          {/* Email Content Rendering */}
          <div className="flex-1 flex flex-col bg-white">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-xl shadow-lg">S</div>
                 <div>
                   <h1 className="text-lg font-black text-slate-900">URGENT: Identity Recovery Protocol</h1>
                   <div className="flex items-center gap-2 mt-0.5">
                     <span className="text-[10px] font-bold text-slate-500">From: <span className="text-slate-900">security@geosentinel.io</span></span>
                   </div>
                 </div>
              </div>
            </div>
            
            <div className="flex-1 p-10 overflow-y-auto">
               <div className="max-w-2xl mx-auto">
                  <div className="bg-slate-50 rounded-3xl p-10 border border-slate-100 relative overflow-hidden">
                    <div className="text-center mb-10">
                      <h2 className="text-2xl font-black text-slate-900 mb-4">Reset Credentials</h2>
                      <p className="text-sm text-slate-600 leading-relaxed font-medium">
                        To authorize the credential reset for identity: <strong>{email}</strong>, click the protocol confirm button.
                      </p>
                    </div>

                    <div className="flex flex-col gap-6">
                      <button 
                        onClick={onConfirm}
                        className="w-full bg-slate-900 hover:bg-black text-white py-5 rounded-2xl font-black uppercase tracking-widest transition-all shadow-2xl shadow-slate-300 flex items-center justify-center gap-3"
                      >
                        <ShieldCheck size={20} className="text-blue-400" />
                        Authorize Identity Reset
                      </button>
                      
                      <div className="bg-white border border-slate-200 p-6 rounded-2xl text-center">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Manual Token</p>
                         <div className="text-3xl font-black tracking-[0.3em] text-slate-900 font-mono">{token}</div>
                      </div>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ForgotPasswordView: React.FC<ForgotPasswordViewProps> = ({ onResetPassword, onBack }) => {
  const [step, setStep] = useState<'EMAIL' | 'SENDING' | 'VERIFY_TOKEN' | 'NEW_PASSWORD' | 'SUCCESS'>('EMAIL');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [userInputToken, setUserInputToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showInbox, setShowInbox] = useState(false);
  const [mailArrived, setMailArrived] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  // Generate token and simulate mail arrival
  useEffect(() => {
    if (step === 'SENDING') {
      const timer = setTimeout(() => {
        const newToken = Math.floor(100000 + Math.random() * 900000).toString();
        setToken(newToken);
        setStep('VERIFY_TOKEN');
        setTimeout(() => setMailArrived(true), 2500);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleIdentify = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    setTimeout(() => {
      const savedUsers = JSON.parse(localStorage.getItem('geo_sentinel_users') || '{}');
      if (savedUsers[email]) {
        setStep('SENDING');
      } else {
        setError("Identity lookup failure: No protocol account associated with this email.");
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleVerifyToken = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInputToken === token) {
      setStep('NEW_PASSWORD');
      setError(null);
    } else {
      setError("Verification Protocol Failed: The entered code does not match the system dispatch.");
    }
  };

  const handleMagicConfirm = () => {
    setShowInbox(false);
    setStep('NEW_PASSWORD');
    setError(null);
  };

  const handleFinalize = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isPasswordStrong(newPassword)) {
      setError("Security Threshold Not Met.");
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
    <div className="min-h-[90vh] flex flex-col items-center justify-center px-4 py-12">
      {showGuide && <ProductionMigrationGuide onClose={() => setShowGuide(false)} />}
      
      {/* Toast Notification for Incoming Mail */}
      {mailArrived && !showInbox && step === 'VERIFY_TOKEN' && (
        <div 
          onClick={() => setShowInbox(true)}
          className="fixed top-8 right-8 z-[2000] bg-slate-900 text-white p-6 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-slate-700 flex items-center gap-5 cursor-pointer hover:scale-105 transition-all animate-in slide-in-from-right-8"
        >
          <div className="bg-blue-600 p-3 rounded-2xl relative shadow-lg shadow-blue-500/20">
            <Bell size={24} className="animate-bounce" />
            <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-slate-900 rounded-full"></div>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-1">Incoming Gateway Message</p>
            <p className="text-sm font-bold">New Security Token Received</p>
          </div>
          <ArrowLeft className="rotate-180 text-slate-500 ml-4" size={18} />
        </div>
      )}

      {showInbox && (
        <SimulatedInbox 
          email={email} 
          token={token} 
          onConfirm={handleMagicConfirm}
          onClose={() => setShowInbox(false)}
        />
      )}
      
      <div className="max-w-md w-full bg-white rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.1)] border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-500 relative">
        {/* Header */}
        <div className="bg-slate-950 p-10 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/10 rounded-full blur-[80px] -mr-16 -mt-16"></div>
          <div className="flex justify-center mb-6">
            <div className="bg-blue-600 p-4 rounded-3xl shadow-2xl shadow-blue-900/50 relative group">
              <ShieldCheck size={36} />
              <div className="absolute inset-0 animate-ping bg-blue-400 rounded-3xl opacity-10"></div>
            </div>
          </div>
          <h2 className="text-2xl font-black tracking-tight">Identity Recovery</h2>
          <p className="text-slate-400 text-[10px] mt-2 font-black uppercase tracking-[0.3em]">Neural Rescue Protocol</p>
        </div>

        <div className="p-10">
          {error && (
            <div className="mb-8 p-5 bg-red-50 border border-red-100 rounded-[1.5rem] flex items-start gap-4 text-red-600 text-xs font-bold">
              <AlertCircle size={20} className="shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{error}</div>
            </div>
          )}

          {step === 'EMAIL' && (
            <form onSubmit={handleIdentify} className="space-y-8">
              <button 
                type="button"
                onClick={() => setShowGuide(true)}
                className="w-full p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-between text-left group hover:bg-blue-100 transition-all"
              >
                <div>
                  <p className="text-[10px] font-black text-blue-700 uppercase tracking-widest mb-1">Developer Insights</p>
                  <p className="text-xs text-blue-900 font-bold">How to move to real-world email?</p>
                </div>
                <ChevronRight className="text-blue-400 group-hover:translate-x-1 transition-transform" size={20} />
              </button>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Target Protocol Email</label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                    type="email" 
                    required
                    placeholder="marino.frank@gmail.com"
                    className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-3xl outline-none focus:ring-8 focus:ring-blue-500/10 focus:border-blue-500 font-bold"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full py-5 bg-slate-950 text-white rounded-3xl font-black uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-3 shadow-2xl shadow-slate-200"
              >
                {isLoading ? <Loader2 className="animate-spin" size={24} /> : "Locate Identity"}
              </button>
              
              <button type="button" onClick={onBack} className="w-full text-slate-400 hover:text-slate-900 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
                <ArrowLeft size={14} /> Return to Portal
              </button>
            </form>
          )}

          {step === 'SENDING' && (
            <div className="py-16 text-center">
              <div className="relative inline-block mb-10">
                <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-30 rounded-full animate-pulse"></div>
                <Loader2 className="w-24 h-24 text-blue-600 animate-spin relative z-10 mx-auto" />
              </div>
              <h3 className="text-2xl font-black text-slate-950">Generating Token</h3>
              <p className="text-sm text-slate-500 mt-2 font-medium">Encrypting payload for <strong>{email}</strong>...</p>
            </div>
          )}

          {step === 'VERIFY_TOKEN' && (
            <form onSubmit={handleVerifyToken} className="space-y-8 animate-in fade-in duration-500">
              <div className="text-center mb-8">
                <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-6 transition-all duration-1000 ${mailArrived ? 'bg-emerald-50 text-emerald-600 scale-110 shadow-2xl' : 'bg-slate-50 text-slate-300'}`}>
                  {mailArrived ? <CheckCircle2 size={48} strokeWidth={2.5} /> : <Loader2 size={48} className="animate-spin" />}
                </div>
                <h3 className="text-2xl font-black text-slate-950">
                  {mailArrived ? 'Token Available' : 'Retrieving Response'}
                </h3>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 text-center">Enter 6-Digit Token</label>
                <input 
                  type="text" 
                  required
                  placeholder="000000"
                  maxLength={6}
                  className="w-full px-6 py-6 bg-slate-50 border border-slate-200 rounded-[2rem] outline-none focus:ring-8 focus:ring-blue-500/10 focus:border-blue-500 font-mono text-center text-5xl tracking-[0.4em] font-black shadow-inner"
                  value={userInputToken}
                  onChange={(e) => {
                    setUserInputToken(e.target.value.replace(/\D/g, ''));
                    setError(null);
                  }}
                />
              </div>

              <div className="bg-slate-950 p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl relative overflow-hidden group">
                <div className="relative z-10">
                   <p className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-4 flex items-center gap-2">
                     <Terminal size={14} />
                     Gateway Intercept Active
                   </p>
                   <p className="text-xs text-slate-400 leading-relaxed font-medium mb-6">
                    Real-world email traffic is captured here for security testing.
                   </p>
                   <button 
                    type="button"
                    onClick={() => setShowInbox(true)}
                    className="w-full py-5 bg-blue-600 text-white rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-blue-500 transition-all flex items-center justify-center gap-3 shadow-xl"
                   >
                    <Inbox size={20} />
                    Open Virtual Inbox
                   </button>
                </div>
              </div>
            </form>
          )}

          {step === 'NEW_PASSWORD' && (
            <form onSubmit={handleFinalize} className="space-y-8">
              <div className="text-center mb-8">
                 <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <ShieldCheck size={40} />
                </div>
                <h3 className="text-2xl font-black text-slate-950">Identity Verified</h3>
                <p className="text-sm text-slate-500 mt-2 font-medium">Define your new credentials.</p>
              </div>
              
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">New Password</label>
                <div className="relative mb-6">
                  <Key className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                    type="password" 
                    required
                    placeholder="Set new password"
                    className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-3xl outline-none focus:ring-8 focus:ring-blue-500/10 font-bold"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-y-3 gap-x-5 bg-slate-50 p-6 rounded-[2rem] border border-slate-100 shadow-inner">
                  <PasswordRequirement label="8+ Chars" met={newPassword.length >= 8} />
                  <PasswordRequirement label="Uppercase" met={/[A-Z]/.test(newPassword)} />
                  <PasswordRequirement label="Lowercase" met={/[a-z]/.test(newPassword)} />
                  <PasswordRequirement label="Numeric" met={/[0-9]/.test(newPassword)} />
                </div>
              </div>
              <button 
                type="submit"
                className="w-full py-5 bg-slate-950 text-white rounded-3xl font-black uppercase tracking-widest hover:bg-black transition-all shadow-2xl"
              >
                Commit Changes
              </button>
            </form>
          )}

          {step === 'SUCCESS' && (
            <div className="space-y-10 text-center py-10">
              <div className="w-28 h-28 bg-emerald-100 text-emerald-600 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl relative z-10">
                <CheckCircle2 size={56} strokeWidth={2.5} />
              </div>
              <h3 className="text-3xl font-black text-slate-950 tracking-tight">Recovery Success</h3>
              <button 
                onClick={onBack}
                className="w-full py-6 bg-slate-950 text-white rounded-[2rem] font-black uppercase tracking-widest hover:bg-black transition-all"
              >
                Log In Now
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Forensic Diagnostic Log */}
      <div className="mt-12 w-full max-w-md bg-slate-950 rounded-3xl p-6 border border-slate-800 shadow-2xl font-mono text-[10px] relative overflow-hidden group">
        <div className="flex justify-between items-center mb-5 border-b border-slate-800 pb-3">
          <span className="text-slate-500 font-black flex items-center gap-3 uppercase tracking-[0.2em]">
            <Terminal size={14} className="text-blue-500" />
            Outgoing Forensic Trace
          </span>
          <div className="flex items-center gap-2">
            <span className="text-slate-600 font-bold uppercase tracking-tighter">Gateway: 127.0.0.1</span>
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
          </div>
        </div>
        <div className="space-y-2 overflow-hidden max-h-32">
          {step === 'SENDING' && (
            <p className="text-blue-400">
              <span className="text-slate-700">[{new Date().toLocaleTimeString()}]</span> POST /api/resend: {"{"} "to": "{email}", "subject": "Recovery", "token": "******" {"}"}
            </p>
          )}
          {step === 'VERIFY_TOKEN' && (
            <p className="text-emerald-500">
              <span className="text-slate-700">[{new Date().toLocaleTimeString()}]</span> INTERCEPT_SUCCESS: Email was intercepted by Virtual Mail Gateway v1.0.4
            </p>
          )}
          <p className="text-slate-600 tracking-tighter uppercase">... monitor active ...</p>
        </div>
      </div>
    </div>
  );
};
