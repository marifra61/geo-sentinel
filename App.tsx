
import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, ShieldCheck, CreditCard, User, LogOut, Crown, ChevronRight, AlertCircle, LayoutDashboard, RefreshCw } from 'lucide-react';
import { analyzeUrl } from './services/geminiService';
import { AnalysisStatus, SeoReport, UserPlan, UserAccount } from './types';
import { LoadingState } from './components/LoadingState';
import { ReportView } from './components/ReportView';
import { HowItWorks } from './components/HowItWorks';
import { PricingView } from './components/PricingView';
import { LoginView } from './components/LoginView';
import { StripeCheckout } from './components/StripeCheckout';
import { ForgotPasswordView } from './components/ForgotPasswordView';
import { AdminDashboard } from './components/AdminDashboard';

export interface UserRecord extends UserAccount {
  password?: string;
  joinDate?: string;
}

export const isPasswordStrong = (password: string): boolean => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumber && hasSymbol;
};

const App: React.FC = () => {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [report, setReport] = useState<SeoReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [currentView, setCurrentView] = useState<'HOME' | 'HOW_IT_WORKS' | 'PRICING' | 'AUTH' | 'STRIPE' | 'FORGOT_PASSWORD' | 'ADMIN'>('AUTH');
  const [selectedPlanForSignup, setSelectedPlanForSignup] = useState<UserPlan | null>(null);

  const [users, setUsers] = useState<Record<string, UserRecord>>(() => {
    try {
      const saved = localStorage.getItem('geo_sentinel_users');
      const baseUsers = saved ? JSON.parse(saved) : {};
      const adminEmail = 'marino.frank@gmail.com';
      if (!baseUsers[adminEmail]) {
        baseUsers[adminEmail] = {
          email: adminEmail,
          password: 'Password123!',
          plan: 'Agency',
          dailyUsage: 0,
          monthlyUsage: 0,
          joinDate: new Date().toISOString()
        };
      }
      return baseUsers;
    } catch {
      return { 'marino.frank@gmail.com': { email: 'marino.frank@gmail.com', password: 'Password123!', plan: 'Agency', dailyUsage: 0, monthlyUsage: 0 } };
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('geo_sentinel_auth') === 'true';
  });

  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(() => {
    return localStorage.getItem('geo_sentinel_current_user');
  });

  const userAccount = (currentUserEmail && users[currentUserEmail]) 
    ? users[currentUserEmail] 
    : { plan: 'Free' as UserPlan, dailyUsage: 0, monthlyUsage: 0 };

  useEffect(() => {
    localStorage.setItem('geo_sentinel_users', JSON.stringify(users));
    localStorage.setItem('geo_sentinel_auth', isAuthenticated.toString());
    if (currentUserEmail) {
      localStorage.setItem('geo_sentinel_current_user', currentUserEmail);
    }
  }, [users, isAuthenticated, currentUserEmail]);

  const handleLogin = (email: string, password: string): string | null => {
    const user = users[email];
    if (user && user.password === password) {
      setIsAuthenticated(true);
      setCurrentUserEmail(email);
      setCurrentView(user.plan === 'Agency' ? 'ADMIN' : 'HOME');
      return null;
    }
    return user ? "Security Protocol Failure: Incorrect password." : "Identity not found.";
  };

  const handleResetPassword = (email: string, newPassword: string): string | null => {
    if (!users[email]) return "Identity lookup failed.";
    if (!isPasswordStrong(newPassword)) return "Password standard not met.";
    setUsers(prev => ({ ...prev, [email]: { ...prev[email], password: newPassword } }));
    setCurrentView('AUTH');
    return null;
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUserEmail(null);
    setCurrentView('AUTH');
    setReport(null);
  };

  const handleReset = () => {
    setUrl('');
    setStatus(AnalysisStatus.IDLE);
    setReport(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !currentUserEmail) return;

    setStatus(AnalysisStatus.ANALYZING);
    setError(null);

    let validUrl = url.trim();
    if (!validUrl.startsWith('http')) validUrl = `https://${validUrl}`;

    try {
      const data = await analyzeUrl(validUrl);
      setReport({ ...data, planAtGeneration: userAccount.plan });
      setUsers(prev => ({
        ...prev,
        [currentUserEmail]: {
          ...prev[currentUserEmail],
          dailyUsage: (prev[currentUserEmail].dailyUsage || 0) + 1,
          monthlyUsage: (prev[currentUserEmail].monthlyUsage || 0) + 1
        }
      }));
      setStatus(AnalysisStatus.COMPLETE);
    } catch (err: any) {
      console.error("Forensic Error:", err);
      setStatus(AnalysisStatus.ERROR);
      setError(err.message || "Forensic audit failed. Verify domain and retry.");
    }
  };

  const renderViewContent = () => {
    if (!isAuthenticated) {
      if (currentView === 'PRICING') return <div className="min-h-screen bg-slate-50"><PricingView currentPlan={userAccount.plan} onSelectPlan={(p) => { setSelectedPlanForSignup(p); setCurrentView('STRIPE'); }} /></div>;
      if (currentView === 'STRIPE' && selectedPlanForSignup) return <StripeCheckout plan={selectedPlanForSignup} onSuccess={(e, p) => { setUsers(prev => ({ ...prev, [e]: { email: e, password: p, plan: selectedPlanForSignup, dailyUsage: 0, monthlyUsage: 0 } })); setIsAuthenticated(true); setCurrentUserEmail(e); setCurrentView('HOME'); }} onCancel={() => setCurrentView('PRICING')} />;
      if (currentView === 'FORGOT_PASSWORD') return <ForgotPasswordView onResetPassword={handleResetPassword} onBack={() => setCurrentView('AUTH')} />;
      return <LoginView onLogin={handleLogin} onSignUpClick={() => setCurrentView('PRICING')} onForgotPasswordClick={() => setCurrentView('FORGOT_PASSWORD')} />;
    }

    return (
      <div className="min-h-screen bg-slate-50">
        <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => { handleReset(); setCurrentView('HOME'); }}>
              <ShieldCheck className="text-blue-600 w-8 h-8" />
              <span className="font-bold text-xl tracking-tight text-slate-900">GEO <span className="text-blue-600">Sentinel</span></span>
            </div>
            <div className="flex items-center gap-6">
              {userAccount.plan === 'Agency' && <button onClick={() => setCurrentView('ADMIN')} className="text-sm font-bold text-slate-500 hover:text-blue-600">Admin</button>}
              <button onClick={handleLogout} className="flex items-center gap-1 text-slate-400 hover:text-red-500 transition-colors font-bold text-xs uppercase"><LogOut size={16} /> Logout</button>
            </div>
          </div>
        </nav>

        <main>
          {currentView === 'ADMIN' ? <AdminDashboard users={users} currentUserEmail={currentUserEmail!} /> : 
           currentView === 'HOW_IT_WORKS' ? <HowItWorks onAnalyze={() => setCurrentView('HOME')} /> : (
            <>
              {status === AnalysisStatus.IDLE && (
                <div className="max-w-4xl mx-auto px-4 pt-20 pb-16 text-center animate-in fade-in zoom-in duration-500">
                  <h1 className="text-5xl md:text-6xl font-black tracking-tight text-slate-900 mb-6 leading-tight">Neural Visibility Protocol</h1>
                  <p className="text-lg text-slate-600 mb-12">Audit your domain's visibility within the Generative Search Graph.</p>
                  <form onSubmit={handleSubmit} className="max-w-xl mx-auto relative group">
                    <div className="flex bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden p-2">
                      <Search className="ml-4 text-slate-400 mt-3" />
                      <input 
                        type="text" placeholder="Enter business URL" 
                        className="w-full px-4 py-3 outline-none text-lg font-medium"
                        value={url} onChange={(e) => setUrl(e.target.value)} required
                      />
                      <button type="submit" className="bg-slate-900 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest">Audit</button>
                    </div>
                  </form>
                </div>
              )}
              {status === AnalysisStatus.ANALYZING && <LoadingState />}
              {status === AnalysisStatus.ERROR && (
                <div className="max-w-md mx-auto mt-20 p-10 bg-white border border-red-100 rounded-3xl text-center shadow-2xl">
                  <AlertCircle size={48} className="text-red-500 mx-auto mb-6" />
                  <h3 className="text-xl font-bold mb-2">Protocol Interrupted</h3>
                  <p className="text-slate-500 mb-8 text-sm">{error}</p>
                  <div className="space-y-3">
                    <button onClick={handleReset} className="w-full bg-slate-900 text-white py-4 rounded-xl font-black uppercase tracking-widest">Return to Dashboard</button>
                  </div>
                </div>
              )}
              {status === AnalysisStatus.COMPLETE && report && <ReportView report={report} userPlan={userAccount.plan} onReset={handleReset} />}
            </>
          )}
        </main>
      </div>
    );
  };

  return <div className="min-h-screen bg-slate-50 text-slate-900 antialiased">{renderViewContent()}</div>;
};

export default App;
