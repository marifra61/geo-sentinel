
import React, { useState, useEffect } from 'react';
import { Search, Sparkles, AlertCircle, TrendingUp, ShieldCheck, CreditCard, User, LogOut, Crown, ChevronRight, LayoutDashboard, Zap, Feather } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
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
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [userAccount, setUserAccount] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem('geo_sentinel_account');
    if (!saved) return null;
    const parsed = JSON.parse(saved);
    // Sync with the latest plan/data from the allUsers list if possible
    return INITIAL_USERS.find(u => u.email === parsed.email) || parsed;
  });

  // Persist State
  useEffect(() => {
    localStorage.setItem('geo_sentinel_all_users', JSON.stringify(allUsers));
    localStorage.setItem('geo_sentinel_account', JSON.stringify(userAccount));
    localStorage.setItem('geo_sentinel_auth', isAuthenticated.toString());
  }, [allUsers, userAccount, isAuthenticated]);

  const handleLogin = (email: string) => {
    setIsAuthenticated(true);
    // Find existing user or create mock session
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
    setIsAuthenticated(true);
    const updatedAccount = { 
      ...userAccount!, 
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
      setStatus(AnalysisStatus.ERROR);
      return;
    }
    
    if (userAccount.plan === 'Pro' && userAccount.monthlyUsage >= 15) {
      setError("Monthly Quota Exhausted. The Professional tier is limited to 15 audits per month. Agency status required for unlimited scans.");
      setStatus(AnalysisStatus.ERROR);
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
      
      // Update counters
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

  // Mock Analytics Generation
  const adminAnalytics: AdminAnalytics = {
    totalAudits: allUsers.reduce((sum, u) => sum + u.monthlyUsage, 0),
    totalRevenue: allUsers.reduce((sum, u) => sum + (u.plan === 'Pro' ? 29 : u.plan === 'Agency' ? 199 : 0), 0),
    growthRate: 18,
    planDistribution: [
      { name: 'Agency', value: Math.round((allUsers.filter(u => u.plan === 'Agency').length / allUsers.length) * 100) },
      { name: 'Pro', value: Math.round((allUsers.filter(u => u.plan === 'Pro').length / allUsers.length) * 100) },
      { name: 'Free', value: Math.round((allUsers.filter(u => u.plan === 'Free').length / allUsers.length) * 100) },
    ],
    usageHistory: Array.from({ length: 30 }, (_, i) => ({
      date: `${i + 1} Apr`,
      audits: Math.floor(Math.random() * 50) + 20
    }))
  };

  const searchTrendData = [
    { year: '2022', traditional: 95, ai: 5 },
    { year: '2023', traditional: 85, ai: 15 },
    { year: '2024', traditional: 72, ai: 28 },
    { year: '2025', traditional: 58, ai: 42 },
    { year: '2026', traditional: 45, ai: 55 },
    { year: '2027', traditional: 30, ai: 70 },
  ];

  // GATE: Forced Auth Check
  if (!isAuthenticated && currentView === 'AUTH') {
    return <LoginView onLogin={handleLogin} onSignUpClick={handleSignUpStart} />;
  }

  // SIGNUP STEP: Pricing selection
  if (currentView === 'PRICING') {
    return (
      <div className="bg-slate-50 min-h-screen">
        <nav className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8">
           <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView('AUTH')}>
             <ShieldCheck className="text-blue-600" />
             <span className="font-bold">GEO Sentinel</span>
           </div>
           <button onClick={() => setCurrentView('AUTH')} className="text-sm font-bold text-slate-500 hover:text-slate-900 underline">Back to Login</button>
        </nav>
        <PricingView currentPlan={userAccount?.plan || 'Free'} onSelectPlan={handleSelectPlan} />
      </div>
    );
  }

  // STRIPE STEP: Payment Processing
  if (currentView === 'STRIPE' && selectedPlanForSignup) {
    return <StripeCheckout plan={selectedPlanForSignup} onSuccess={handleStripeSuccess} onCancel={() => setCurrentView('PRICING')} />;
  }

  // ADMIN VIEW
  if (currentView === 'ADMIN' && userAccount?.isAdmin) {
    return (
      <AdminView 
        users={allUsers} 
        analytics={adminAnalytics} 
        onAddUser={handleAdminAddUser} 
        onDeleteUser={handleAdminDeleteUser} 
        onClose={() => setCurrentView('HOME')} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100">
      
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => { handleReset(); setCurrentView('HOME'); }}>
            <div className="bg-slate-900 p-1.5 rounded-lg">
              <ShieldCheck className="text-blue-500 w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">GEO <span className="text-blue-600">Sentinel</span></span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500">
            <button 
              onClick={() => setCurrentView('HOW_IT_WORKS')}
              className={`transition-colors ${currentView === 'HOW_IT_WORKS' ? 'text-blue-600 font-bold' : 'hover:text-blue-600'}`}
            >
              How it Works
            </button>
            <button 
              onClick={() => setCurrentView('PRICING')}
              className="hover:text-blue-600 transition-colors"
            >
              Manage Plan
            </button>
            
            {userAccount?.isAdmin && (
              <button 
                onClick={() => setCurrentView('ADMIN')}
                className="flex items-center gap-1.5 text-blue-600 font-bold hover:text-blue-700 transition-colors"
              >
                <LayoutDashboard size={16} />
                Admin Console
              </button>
            )}

            <div className="h-6 w-px bg-slate-200"></div>
            
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${
                userAccount?.plan === 'Agency' ? 'bg-slate-900 text-blue-400 border-slate-800' :
                userAccount?.plan === 'Pro' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                'bg-slate-100 text-slate-500 border-slate-200'
              }`}>
                {userAccount?.plan === 'Agency' ? <Crown size={12} /> : userAccount?.plan === 'Pro' ? <ShieldCheck size={12} /> : <User size={12} />}
                {userAccount?.plan} Protocol
              </div>
              <button 
                onClick={handleLogout} 
                className="flex items-center gap-1.5 text-slate-400 hover:text-red-500 transition-colors font-bold text-xs uppercase"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <main>
        {currentView === 'HOW_IT_WORKS' ? (
          <HowItWorks onAnalyze={() => {
            setCurrentView('HOME');
            handleReset();
          }} />
        ) : (
          <>
            {status === AnalysisStatus.IDLE && (
              <div className="max-w-4xl mx-auto px-4 pt-20 pb-16 text-center animate-in fade-in zoom-in duration-500">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 text-white text-xs font-bold tracking-widest uppercase mb-8 border border-slate-800 shadow-xl">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                  Neural Visibility Protocol Active
                </div>
                
                <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 mb-6 leading-tight">
                  Verify your brand in <br className="hidden md:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Neural Search Synthesis</span>
                </h1>
                
                <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-12 font-medium">
                  Perform forensic analysis of your domain to determine visibility within Generative AI citation engines.
                </p>

                <form onSubmit={handleSubmit} className="relative max-w-xl mx-auto group">
                  <div className="absolute inset-0 bg-blue-200 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                  <div className="relative flex items-center bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden p-2">
                    <Search className="ml-4 text-slate-400 w-6 h-6" />
                    <input 
                      type="text" 
                      placeholder="Enter business URL (e.g., example.com)"
                      className="w-full px-4 py-3 outline-none bg-transparent text-slate-900 placeholder:text-slate-400 text-lg font-medium"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      required
                    />
                    <button 
                      type="submit"
                      className="bg-slate-900 hover:bg-black text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest transition-all hover:shadow-lg active:scale-95 whitespace-nowrap"
                    >
                      Audit
                    </button>
                  </div>
                </form>

                <div className="mt-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center justify-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    PLAN: {userAccount?.plan}
                  </div>
                  <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                  <div className="flex items-center gap-2">
                    {userAccount?.plan === 'Free' ? (
                      <span className="text-blue-600">AUDITS REMAINING: {2 - (userAccount?.dailyUsage || 0)}/2 today</span>
                    ) : userAccount?.plan === 'Pro' ? (
                      <span className="text-blue-600">AUDITS REMAINING: {15 - (userAccount?.monthlyUsage || 0)}/15 this month</span>
                    ) : (
                      <span className="text-emerald-600">UNLIMITED AGENCY ACCESS</span>
                    )}
                  </div>
                  {userAccount?.plan !== 'Agency' && (
                    <button onClick={() => setCurrentView('PRICING')} className="text-blue-500 hover:underline flex items-center gap-1 font-bold">
                      UPGRADE <ChevronRight size={10} />
                    </button>
                  )}
                </div>

                {/* AI Stack Icons Marquee */}
                <div className="mt-16 flex flex-wrap items-center justify-center gap-x-12 gap-y-8 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-700 mb-20 px-8">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-500/10 p-2 rounded-xl border border-blue-500/20 text-blue-500">
                      <Sparkles size={20} />
                    </div>
                    <div className="font-black text-xl text-slate-900 italic tracking-tighter">GEMINI</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20 text-emerald-500">
                      <Zap size={20} />
                    </div>
                    <div className="font-black text-xl text-slate-900 italic tracking-tighter">CHATGPT</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-orange-500/10 p-2 rounded-xl border border-orange-500/20 text-orange-500">
                      <Feather size={20} />
                    </div>
                    <div className="font-black text-xl text-slate-900 italic tracking-tighter">CLAUDE</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-cyan-500/10 p-2 rounded-xl border border-cyan-500/20 text-cyan-500">
                      <Search size={20} />
                    </div>
                    <div className="font-black text-xl text-slate-900 italic tracking-tighter">PERPLEXITY</div>
                  </div>
                </div>

                {/* Projection Graph */}
                <div className="relative w-full max-w-3xl mx-auto bg-white p-8 rounded-3xl border border-slate-200 shadow-xl text-left overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mr-16 -mt-16"></div>
                  <div className="flex items-center gap-2 mb-2 relative z-10">
                    <div className="bg-blue-600 p-2 rounded-lg text-white">
                      <TrendingUp size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">Neural Visibility Projection</h3>
                  </div>
                  <p className="text-slate-500 mb-6 text-sm relative z-10">Generative Synthesis is displacing traditional link-based search.</p>
                  
                  <div className="h-64 w-full relative z-10">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={searchTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                        <YAxis hide={false} axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} unit="%" />
                        <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} itemStyle={{ fontSize: '12px', fontWeight: 700 }} />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                        <Line type="monotone" dataKey="traditional" name="Google Search" stroke="#cbd5e1" strokeWidth={2} dot={{ r: 4, fill: '#cbd5e1' }} strokeDasharray="5 5" />
                        <Line type="monotone" dataKey="ai" name="Neural Synthesis" stroke="#2563eb" strokeWidth={4} dot={{ r: 5, fill: '#2563eb' }} activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>
            )}

            {status === AnalysisStatus.ANALYZING && <LoadingState />}

            {status === AnalysisStatus.ERROR && (
              <div className="max-w-md mx-auto mt-20 p-8 bg-white border border-red-100 rounded-3xl text-center shadow-2xl">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Protocol Interrupted</h3>
                <p className="text-slate-500 mb-8 text-sm leading-relaxed">{error}</p>
                <div className="space-y-3">
                  <button onClick={handleReset} className="bg-slate-900 text-white hover:bg-black w-full py-4 rounded-xl font-black uppercase tracking-widest transition-colors">Return to Dashboard</button>
                  {error?.includes("Limit") && (
                    <button onClick={() => setCurrentView('PRICING')} className="bg-blue-600 text-white hover:bg-blue-700 w-full py-4 rounded-xl font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
                      <CreditCard size={18} />
                      Upgrade Protocol
                    </button>
                  )}
                </div>
              </div>
            )}

            {status === AnalysisStatus.COMPLETE && report && (
              <ReportView report={report} userPlan={userAccount?.plan || 'Free'} onReset={handleReset} />
            )}
          </>
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-16 mt-20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-blue-600 w-6 h-6" />
            <span className="font-bold text-lg tracking-tight text-slate-900">GEO <span className="text-blue-600">Sentinel</span></span>
          </div>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">Neural Infrastructure Protocol v2.5.0-Final</p>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <a href="#" onClick={() => setCurrentView('PRICING')} className="hover:text-blue-600 font-bold">Billing Portal</a>
            <span className="font-medium opacity-50">© {new Date().getFullYear()} GEO Sentinel.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
