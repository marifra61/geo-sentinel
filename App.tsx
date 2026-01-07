
import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, ShieldCheck, CreditCard, User, LogOut, Crown, ChevronRight, AlertCircle, LayoutDashboard, RefreshCw, Brain, Globe, Sparkles, Loader2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from 'recharts';
import { analyzeUrl } from './services/geminiService';
import { verifyOidcCallback } from './services/authService';
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

const trendData = [
  { year: '2022', google: 98, ai: 2 },
  { year: '2023', google: 92, ai: 8 },
  { year: '2024', google: 78, ai: 22 },
  { year: '2025*', google: 60, ai: 40 },
  { year: '2026*', google: 45, ai: 55 },
  { year: '2027*', google: 30, ai: 70 },
];

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
  const [isVerifyingOidc, setIsVerifyingOidc] = useState(false);
  
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

  // Effect to handle OIDC Callback from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('code') && params.has('state')) {
      setIsVerifyingOidc(true);
      
      // Artificial delay to simulate real network handshake/token exchange
      setTimeout(() => {
        const oidcUser = verifyOidcCallback(params);
        if (oidcUser) {
          if (!users[oidcUser.email]) {
            setUsers(prev => ({
              ...prev,
              [oidcUser.email]: {
                email: oidcUser.email,
                plan: oidcUser.plan,
                dailyUsage: 0,
                monthlyUsage: 0,
                joinDate: new Date().toISOString()
              }
            }));
          }
          
          setIsAuthenticated(true);
          setCurrentUserEmail(oidcUser.email);
          setCurrentView('HOME');
          
          // Clear URL parameters
          window.history.replaceState({}, document.title, window.location.pathname);
        } else {
          setError("OIDC Handshake failed: Security state invalid.");
          setCurrentView('AUTH');
        }
        setIsVerifyingOidc(false);
      }, 1500);
    }
  }, []);

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

  const handleSocialLogin = (provider: string) => {
    // This is now handled via initiateOidcHandshake in LoginView.tsx which causes a redirect
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

  if (isVerifyingOidc) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-6">
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 rounded-full animate-pulse"></div>
          <Loader2 className="w-20 h-20 text-blue-500 animate-spin relative z-10" />
        </div>
        <h2 className="text-3xl font-black mb-4">Securing Identity Protocol</h2>
        <p className="text-slate-400 font-mono text-xs uppercase tracking-[0.3em] animate-pulse">
          Exchanging Authorization Code for Bearer Token...
        </p>
      </div>
    );
  }

  const renderViewContent = () => {
    if (!isAuthenticated) {
      if (currentView === 'PRICING') return <div className="min-h-screen bg-slate-50"><PricingView currentPlan={userAccount.plan} onSelectPlan={(p) => { setSelectedPlanForSignup(p); setCurrentView('STRIPE'); }} /></div>;
      if (currentView === 'STRIPE' && selectedPlanForSignup) return <StripeCheckout plan={selectedPlanForSignup} onSuccess={(e, p) => { setUsers(prev => ({ ...prev, [e]: { email: e, password: p, plan: selectedPlanForSignup, dailyUsage: 0, monthlyUsage: 0 } })); setIsAuthenticated(true); setCurrentUserEmail(e); setCurrentView('HOME'); }} onCancel={() => setCurrentView('PRICING')} />;
      if (currentView === 'FORGOT_PASSWORD') return <ForgotPasswordView onResetPassword={handleResetPassword} onBack={() => setCurrentView('AUTH')} />;
      return (
        <LoginView 
          onLogin={handleLogin} 
          onSocialLogin={handleSocialLogin}
          onSignUpClick={() => setCurrentView('PRICING')} 
          onForgotPasswordClick={() => setCurrentView('FORGOT_PASSWORD')} 
        />
      );
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
              <button 
                onClick={() => setCurrentView('HOW_IT_WORKS')} 
                className={`text-sm font-bold transition-colors ${currentView === 'HOW_IT_WORKS' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'}`}
              >
                How it Works
              </button>
              {userAccount.plan === 'Agency' && <button onClick={() => setCurrentView('ADMIN')} className={`text-sm font-bold transition-colors ${currentView === 'ADMIN' ? 'text-blue-600' : 'text-slate-500 hover:text-blue-600'}`}>Admin</button>}
              <button onClick={handleLogout} className="flex items-center gap-1 text-slate-400 hover:text-red-500 transition-colors font-bold text-xs uppercase"><LogOut size={16} /> Logout</button>
            </div>
          </div>
        </nav>

        <main>
          {currentView === 'ADMIN' ? <AdminDashboard users={users} currentUserEmail={currentUserEmail!} /> : 
           currentView === 'HOW_IT_WORKS' ? <HowItWorks onAnalyze={() => setCurrentView('HOME')} /> : (
            <>
              {status === AnalysisStatus.IDLE && (
                <div className="max-w-7xl mx-auto px-4 pt-16 pb-16 animate-in fade-in duration-700">
                  <div className="max-w-4xl mx-auto text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-black tracking-tight text-slate-900 mb-6 leading-tight">Neural Visibility Protocol</h1>
                    <p className="text-lg text-slate-600 mb-12">Audit your domain's visibility within the Generative Search Graph.</p>
                    <form onSubmit={handleSubmit} className="max-w-xl mx-auto relative group mb-20">
                      <div className="flex bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden p-2 ring-1 ring-slate-900/5 hover:ring-blue-500/50 transition-all">
                        <Search className="ml-4 text-slate-400 mt-3" />
                        <input 
                          type="text" placeholder="Enter business URL (e.g. acme.com)" 
                          className="w-full px-4 py-3 outline-none text-lg font-medium"
                          value={url} onChange={(e) => setUrl(e.target.value)} required
                        />
                        <button type="submit" className="bg-slate-900 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-lg">Audit</button>
                      </div>
                    </form>
                  </div>

                  {/* Market Shift Visualization */}
                  <div className="max-w-5xl mx-auto bg-white p-8 md:p-12 rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.08)] border border-slate-200 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] -mr-48 -mt-48 transition-opacity opacity-50 group-hover:opacity-100"></div>
                    <div className="relative z-10 flex flex-col lg:flex-row gap-12 items-center">
                      <div className="flex-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
                          <TrendingUp size={14} />
                          Market Evolution Analysis
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tight leading-tight">The Search Paradigm Shift</h2>
                        <p className="text-slate-500 text-sm leading-relaxed mb-8">
                          Traditional retrieval models are being superseded by neural synthesis. 
                          Our research indicates that by <span className="text-slate-900 font-bold">2027</span>, over <span className="text-blue-600 font-black">70%</span> of business discovery will occur within generative environments.
                        </p>
                        
                        <div className="space-y-4">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center shrink-0 border border-slate-100">
                              <Globe size={18} />
                            </div>
                            <div>
                              <p className="text-xs font-black text-slate-900">Traditional Retrieval (Google)</p>
                              <p className="text-[10px] text-slate-400 font-medium">Index-based, Keyword priority</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                              <Sparkles size={18} />
                            </div>
                            <div>
                              <p className="text-xs font-black text-blue-600">Neural Synthesis (AI)</p>
                              <p className="text-[10px] text-blue-400 font-medium">Context-aware, Entity authority</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 w-full h-[320px] bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100 relative group/chart shadow-inner">
                        <div className="absolute top-4 left-6 z-10">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Visibility Projection (%)</p>
                        </div>
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={trendData}>
                            <defs>
                              <linearGradient id="colorGoogle" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                              </linearGradient>
                              <linearGradient id="colorAI" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis 
                              dataKey="year" 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} 
                              dy={10} 
                            />
                            <YAxis 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} 
                            />
                            <Tooltip 
                              contentStyle={{ 
                                borderRadius: '16px', 
                                border: 'none', 
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                fontSize: '12px',
                                fontWeight: 'bold'
                              }}
                              itemStyle={{ padding: '2px 0' }}
                            />
                            <Legend 
                              verticalAlign="top" 
                              align="right" 
                              iconType="circle"
                              wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', paddingTop: '0px' }}
                            />
                            <Area 
                              type="monotone" 
                              dataKey="google" 
                              name="Traditional Search" 
                              stroke="#94a3b8" 
                              strokeWidth={3} 
                              fillOpacity={1} 
                              fill="url(#colorGoogle)" 
                              animationBegin={500}
                              animationDuration={1500}
                            />
                            <Area 
                              type="monotone" 
                              dataKey="ai" 
                              name="AI-SEO Visibility" 
                              stroke="#2563eb" 
                              strokeWidth={4} 
                              fillOpacity={1} 
                              fill="url(#colorAI)" 
                              animationBegin={1000}
                              animationDuration={2000}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                        <div className="mt-4 flex justify-end">
                          <span className="text-[10px] text-slate-400 font-bold italic">* Forecasted data based on LLM adoption rates</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {status === AnalysisStatus.ANALYZING && <LoadingState />}
              {status === AnalysisStatus.ERROR && (
                <div className="max-w-md mx-auto mt-20 p-10 bg-white border border-red-100 rounded-3xl text-center shadow-2xl">
                  <AlertCircle size={48} className="text-red-500 mx-auto mb-6" />
                  <h3 className="text-xl font-bold mb-2">Protocol Interrupted</h3>
                  <p className="text-slate-500 mb-8 text-sm">{error}</p>
                  <div className="space-y-3">
                    <button onClick={handleReset} className="w-full bg-slate-900 text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-black transition-all">Return to Dashboard</button>
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
