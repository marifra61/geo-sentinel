

import React, { useState, useEffect } from 'react';
import { Search, Sparkles, AlertCircle, TrendingUp, ShieldCheck, CreditCard, User, LogOut, Crown, ChevronRight, LayoutDashboard, Zap, Feather } from 'lucide-react';
import { analyzeUrl } from './services/geminiService';
import { AnalysisStatus, SeoReport, UserPlan, UserAccount, AdminAnalytics } from './types';
import { LoadingState } from './components/LoadingState';
import { ReportView } from './components/ReportView';
import { HowItWorks } from './components/HowItWorks';
import { PricingView } from './components/PricingView';
import { LoginView } from './components/LoginView';
import { StripeCheckout } from './components/StripeCheckout';
import { AdminView } from './components/AdminView';

// Mock Initial Data
const INITIAL_USERS: UserAccount[] = [
  { id: '1', email: 'admin@geosentinel.ai', plan: 'Agency', dailyUsage: 5, monthlyUsage: 140, joinedDate: '2024-01-10T10:00:00Z', isAdmin: true },
  { id: 'admin-frank', email: 'marino.frank@gmail.com', plan: 'Agency', dailyUsage: 0, monthlyUsage: 0, joinedDate: new Date().toISOString(), isAdmin: true },
  { id: '2', email: 'mark@acme.corp', plan: 'Pro', dailyUsage: 2, monthlyUsage: 12, joinedDate: '2024-02-15T14:30:00Z' },
  { id: '3', email: 'sarah@design.studio', plan: 'Free', dailyUsage: 1, monthlyUsage: 4, joinedDate: '2024-03-01T09:15:00Z' },
  { id: '4', email: 'dev@github.io', plan: 'Agency', dailyUsage: 0, monthlyUsage: 250, joinedDate: '2023-11-20T11:45:00Z' },
];

const App: React.FC = () => {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [report, setReport] = useState<SeoReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Navigation State
  const [currentView, setCurrentView] = useState<'HOME' | 'HOW_IT_WORKS' | 'PRICING' | 'AUTH' | 'STRIPE' | 'ADMIN'>('AUTH');
  const [selectedPlanForSignup, setSelectedPlanForSignup] = useState<UserPlan | null>(null);

  // Authentication & Plan State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('geo_sentinel_auth') === 'true';
  });

  // Global Users State (for admin management)
  const [allUsers, setAllUsers] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem('geo_sentinel_all_users');
    if (!saved || saved === 'null') return INITIAL_USERS;
    try {
      return JSON.parse(saved);
    } catch {
      return INITIAL_USERS;
    }
  });

  const [userAccount, setUserAccount] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem('geo_sentinel_account');
    if (!saved || saved === 'null') return null;
    try {
      const parsed = JSON.parse(saved);
      if (!parsed || !parsed.email) return null;
      return parsed;
    } catch {
      return null;
    }
  });

  // Persist State
  useEffect(() => {
    localStorage.setItem('geo_sentinel_all_users', JSON.stringify(allUsers));
    localStorage.setItem('geo_sentinel_account', JSON.stringify(userAccount));
    localStorage.setItem('geo_sentinel_auth', isAuthenticated.toString());
  }, [allUsers, userAccount, isAuthenticated]);

  const handleLogin = (email: string) => {
    setIsAuthenticated(true);
    const existing = allUsers.find(u => u.email === email);
    const account = existing || { 
      id: Math.random().toString(36).substr(2, 9), 
      email, 
      plan: 'Free' as UserPlan, 
      dailyUsage: 0, 
      monthlyUsage: 0, 
      joinedDate: new Date().toISOString() 
    };
    
    if (!existing) {
      setAllUsers(prev => [...prev, account]);
    }

    setUserAccount(account);
    setCurrentView('HOME');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView('AUTH');
    setReport(null);
    setUrl('');
    setUserAccount(null);
  };

  const handleSignUpStart = () => {
    setCurrentView('PRICING');
  };

  const handleSelectPlan = (plan: UserPlan) => {
    setSelectedPlanForSignup(plan);
    setCurrentView('STRIPE');
  };

  const handleStripeSuccess = () => {
    if (!userAccount) return;
    setIsAuthenticated(true);
    const updatedAccount = { 
      ...userAccount, 
      plan: selectedPlanForSignup || 'Free',
      dailyUsage: 0,
      monthlyUsage: 0
    };
    setUserAccount(updatedAccount);
    setAllUsers(prev => prev.map(u => u.email === updatedAccount.email ? updatedAccount : u));
    setCurrentView('HOME');
    setSelectedPlanForSignup(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !userAccount) return;

    // PLAN ENFORCEMENT LOGIC
    if (userAccount.plan === 'Free' && userAccount.dailyUsage >= 2) {
      setError("Protocol Limit Reached. The Free tier is capped at 2 daily audits. Please upgrade for expanded bandwidth.");
      return;
    }
    
    if (userAccount.plan === 'Pro' && userAccount.monthlyUsage >= 15) {
      setError("Monthly Quota Exhausted. The Professional tier is limited to 15 audits per month. Agency status required for unlimited scans.");
      return;
    }

    let validUrl = url;
    if (!url.startsWith('http')) {
      validUrl = `https://${url}`;
    }

    setStatus(AnalysisStatus.ANALYZING);
    setError(null);

    try {
      const data = await analyzeUrl(validUrl);
      setReport({ ...data, planAtGeneration: userAccount.plan });
      
      const updated = {
        ...userAccount,
        dailyUsage: userAccount.dailyUsage + 1,
        monthlyUsage: userAccount.monthlyUsage + 1
      };
      setUserAccount(updated);
      setAllUsers(prev => prev.map(u => u.email === updated.email ? updated : u));
      
      setStatus(AnalysisStatus.COMPLETE);
    } catch (err: any) {
      console.error(err);
      setStatus(AnalysisStatus.ERROR);
      setError(err.message || "Forensic scan failed. Verify connection to neural infrastructure and try again.");
    }
  };

  const handleReset = () => {
    setUrl('');
    setStatus(AnalysisStatus.IDLE);
    setReport(null);
    setError(null);
  };

  const handleAdminAddUser = (user: Partial<UserAccount>) => {
    const newUser = user as UserAccount;
    setAllUsers(prev => [...prev, newUser]);
  };

  const handleAdminDeleteUser = (userId: string) => {
    setAllUsers(prev => prev.filter(u => u.id !== userId));
  };

  const adminAnalytics: AdminAnalytics = {
    totalAudits: allUsers.reduce((sum, u) => sum + (u.monthlyUsage || 0), 0),
    totalRevenue: allUsers.reduce((sum, u) => sum + (u.plan === 'Pro' ? 29 : u.plan === 'Agency' ? 199 : 0), 0),
    growthRate: 18,
    planDistribution: [
      { name: 'Agency', value: Math.round((allUsers.filter(u => u.plan === 'Agency').length / Math.max(1, allUsers.length)) * 100) },
      { name: 'Pro', value: Math.round((allUsers.filter(u => u.plan === 'Pro').length / Math.max(1, allUsers.length)) * 100) },
      { name: 'Free', value: Math.round((allUsers.filter(u => u.plan === 'Free').length / Math.max(1, allUsers.length)) * 100) },
    ],
    usageHistory: Array.from({ length: 30 }, (_, i) => ({
      date: `${i + 1} Apr`,
      audits: Math.floor(Math.random() * 50) + 20
    }))
  };

  if (!isAuthenticated && currentView === 'AUTH') {
    return <LoginView onLogin={handleLogin} onSignUpClick={handleSignUpStart} />;
  }

  if (currentView === 'PRICING') {
    return (
      <div className="bg-slate-50 min-h-screen">
        <nav className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8">
           <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView('HOME')}>
             <ShieldCheck className="text-blue-600" size={24} />
             <span className="font-bold text-xl text-slate-900">GEO Sentinel</span>
           </div>
           <button onClick={() => setCurrentView('AUTH')} className="text-slate-500 font-medium hover:text-slate-800">Cancel</button>
        </nav>
        <PricingView currentPlan={userAccount?.plan || 'Free'} onSelectPlan={handleSelectPlan} />
      </div>
    );
  }

  if (currentView === 'STRIPE' && selectedPlanForSignup) {
    return <StripeCheckout plan={selectedPlanForSignup} onSuccess={handleStripeSuccess} onCancel={() => setCurrentView('PRICING')} />;
  }

  if (currentView === 'ADMIN' && userAccount?.isAdmin) {
    return <AdminView users={allUsers} analytics={adminAnalytics} onAddUser={handleAdminAddUser} onDeleteUser={handleAdminDeleteUser} onClose={() => setCurrentView('HOME')} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <nav className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView('HOME')}>
            <ShieldCheck className="text-blue-600" size={24} />
            <span className="font-bold text-xl text-slate-900 tracking-tight">GEO Sentinel</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <button onClick={() => setCurrentView('HOME')} className={`text-sm font-semibold transition-colors ${currentView === 'HOME' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'}`}>Dashboard</button>
            <button onClick={() => setCurrentView('HOW_IT_WORKS')} className={`text-sm font-semibold transition-colors ${currentView === 'HOW_IT_WORKS' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'}`}>Intelligence</button>
            <button onClick={() => setCurrentView('PRICING')} className={`text-sm font-semibold transition-colors ${currentView === 'PRICING' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'}`}>Protocol Levels</button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {userAccount?.isAdmin && (
            <button onClick={() => setCurrentView('ADMIN')} className="hidden sm:flex items-center gap-2 bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-black transition-all">
              <LayoutDashboard size={14} />
              Admin
            </button>
          )}
          <div className="h-8 w-px bg-slate-200"></div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{userAccount?.plan} ACCESS</p>
              <p className="text-xs font-bold text-slate-700">{userAccount?.email}</p>
            </div>
            <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1 overflow-y-auto">
        {currentView === 'HOW_IT_WORKS' ? (
          <HowItWorks onAnalyze={() => setCurrentView('HOME')} />
        ) : report ? (
          <ReportView report={report} userPlan={userAccount?.plan || 'Free'} onReset={handleReset} />
        ) : status === AnalysisStatus.ANALYZING ? (
          <LoadingState />
        ) : (
          <div className="max-w-4xl mx-auto px-4 py-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100 text-[10px] font-black uppercase tracking-widest mb-6">
                <Sparkles size={12} />
                Now Powered by Gemini 3 Neural Graph
              </div>
              <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">Perform a <span className="text-blue-600">Forensic SEO</span> Audit</h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">Analyze how your digital entity is indexed, cited, and summarized by leading Generative AI engines.</p>
            </div>

            <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto group">
              <div className="absolute inset-0 bg-blue-600 blur-3xl opacity-5 group-hover:opacity-10 transition-opacity rounded-full"></div>
              <div className="relative bg-white p-2 rounded-2xl shadow-2xl border border-slate-200 flex items-center gap-2 group-focus-within:border-blue-500 transition-all">
                <div className="pl-4 text-slate-400">
                  <Search size={24} />
                </div>
                <input 
                  type="text" 
                  placeholder="Enter domain or target URL (e.g., acme.com)"
                  className="flex-1 py-4 px-2 outline-none text-slate-900 font-bold text-lg placeholder:text-slate-300"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                <button 
                  type="submit"
                  disabled={!url || status === AnalysisStatus.ANALYZING}
                  className="bg-slate-900 hover:bg-black text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100"
                >
                  Analyze
                </button>
              </div>
              {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 animate-in slide-in-from-top-4 duration-300">
                  <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
                  <div>
                    <p className="text-sm font-bold text-red-900">Scan Interrupted</p>
                    <p className="text-xs text-red-700 font-medium mt-1 leading-relaxed">{error}</p>
                    {userAccount?.plan === 'Free' && error.includes('Limit') && (
                      <button onClick={() => setCurrentView('PRICING')} className="mt-3 text-[10px] font-black uppercase text-red-600 hover:underline">Upgrade to Pro Protocol</button>
                    )}
                  </div>
                </div>
              )}
            </form>

            <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 opacity-60">
               {[
                 { icon: <ShieldCheck size={18} />, label: "Privacy Ensured", sub: "Data encrypted at rest" },
                 { icon: <TrendingUp size={18} />, label: "Industry Benchmarks", sub: "Compared to top 5% of web" },
                 { icon: <Sparkles size={18} />, label: "LLM Ready", sub: "Optimized for Gemini & GPT-4o" }
               ].map((feat, i) => (
                 <div key={i} className="flex items-center gap-3 px-4">
                   <div className="text-blue-600">{feat.icon}</div>
                   <div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-800">{feat.label}</p>
                     <p className="text-[10px] text-slate-500 font-medium">{feat.sub}</p>
                   </div>
                 </div>
               ))}
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-100 py-8 px-8 text-center">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">GEO Sentinel Neural Infrastructure Protocol v2.5</p>
      </footer>
    </div>
  );
};

export default App;