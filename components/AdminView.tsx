
import React, { useState, useMemo } from 'react';
import { 
  Users, 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Trash2, 
  Plus, 
  Search, 
  Filter, 
  ShieldCheck, 
  ChevronRight, 
  X,
  ArrowUpRight,
  PieChart as PieChartIcon,
  Activity,
  UserPlus
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { UserAccount, UserPlan, AdminAnalytics } from '../types';

interface AdminViewProps {
  users: UserAccount[];
  analytics: AdminAnalytics;
  onAddUser: (user: Partial<UserAccount>) => void;
  onDeleteUser: (userId: string) => void;
  onClose: () => void;
}

const COLORS = ['#2563eb', '#8b5cf6', '#cbd5e1'];

export const AdminView: React.FC<AdminViewProps> = ({ users, analytics, onAddUser, onDeleteUser, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUserInfo, setNewUserInfo] = useState({ email: '', plan: 'Free' as UserPlan });

  const filteredUsers = useMemo(() => {
    return users.filter(u => u.email.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [users, searchTerm]);

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    onAddUser({
      email: newUserInfo.email,
      plan: newUserInfo.plan,
      joinedDate: new Date().toISOString(),
      dailyUsage: 0,
      monthlyUsage: 0,
      id: Math.random().toString(36).substr(2, 9)
    });
    setNewUserInfo({ email: '', plan: 'Free' });
    setShowAddModal(false);
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20 animate-in fade-in duration-500">
      {/* Admin Header */}
      <header className="bg-slate-900 text-white pt-10 pb-24 px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="text-blue-400" size={24} />
              <h1 className="text-2xl font-black uppercase tracking-widest">Admin Command Center</h1>
            </div>
            <p className="text-slate-400 text-sm">Platform health and intelligence portal</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all"
            >
              <UserPlus size={18} />
              Provision User
            </button>
            <button 
              onClick={onClose}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-5 py-2.5 rounded-xl font-bold text-sm transition-all"
            >
              Exit Console
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 -mt-16 relative z-20">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Active Users', value: users.length, icon: Users, color: 'text-blue-600', trend: `+${analytics.growthRate}% MoM` },
            { label: 'Est. Monthly Revenue', value: `$${analytics.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-600', trend: 'High Margin' },
            { label: 'Aggregate Audits', value: analytics.totalAudits.toLocaleString(), icon: Activity, color: 'text-purple-600', trend: 'Network Load: 12%' },
            { label: 'Platform Readiness', value: '99.9%', icon: ShieldCheck, color: 'text-amber-600', trend: 'Operational' },
          ].map((kpi, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl bg-slate-50 group-hover:bg-slate-100 transition-colors ${kpi.color}`}>
                  <kpi.icon size={24} />
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{kpi.trend}</span>
              </div>
              <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{kpi.label}</h3>
              <p className="text-2xl font-black text-slate-900">{kpi.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Growth Chart */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp size={20} className="text-blue-600" />
                Network Traffic (Audits/Day)
              </h2>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-lg text-xs font-bold text-slate-500 border border-slate-100">
                Last 30 Days
              </div>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.usageHistory}>
                  <defs>
                    <linearGradient id="colorAudits" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" hide />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ fontSize: '12px', fontWeight: 700 }}
                  />
                  <Area type="monotone" dataKey="audits" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorAudits)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Plan Distribution */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-8 flex items-center gap-2">
              <PieChartIcon size={20} className="text-purple-600" />
              Plan Distribution
            </h2>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.planDistribution}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {analytics.planDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3 mt-6">
              {analytics.planDistribution.map((plan, i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2 font-medium text-slate-600">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                    {plan.name}
                  </div>
                  <span className="font-bold text-slate-900">{plan.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* User Management Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="text-lg font-bold text-slate-900">Protocol Subscribers</h2>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search by identity email..."
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  <th className="px-6 py-4">Identity Protocol</th>
                  <th className="px-6 py-4">Plan Access</th>
                  <th className="px-6 py-4">Session Logs</th>
                  <th className="px-6 py-4">Provision Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                          {user.email.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{user.email}</p>
                          {user.isAdmin && <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-tighter">System Admin</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        user.plan === 'Agency' ? 'bg-slate-900 text-blue-400 border-slate-800' :
                        user.plan === 'Pro' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                        'bg-slate-100 text-slate-500 border-slate-200'
                      }`}>
                        {user.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="text-xs font-bold text-slate-700">{user.dailyUsage} today</p>
                          <p className="text-[10px] text-slate-400 uppercase font-black">{user.monthlyUsage} total</p>
                        </div>
                        <div className="flex-1 max-w-[60px] bg-slate-100 h-1 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${user.monthlyUsage > 10 ? 'bg-amber-500' : 'bg-blue-600'}`} 
                            style={{ width: `${Math.min(100, (user.monthlyUsage / 20) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-500">
                      {new Date(user.joinedDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Activity size={18} /></button>
                        {!user.isAdmin && (
                          <button 
                            onClick={() => onDeleteUser(user.id)}
                            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900">Provision New Identity</h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateUser} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Target Email Address</label>
                  <input 
                    type="email" 
                    required
                    placeholder="partner@company.com"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
                    value={newUserInfo.email}
                    onChange={(e) => setNewUserInfo({ ...newUserInfo, email: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Assigned Protocol Level</label>
                  <select 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 font-bold text-slate-700"
                    value={newUserInfo.plan}
                    onChange={(e) => setNewUserInfo({ ...newUserInfo, plan: e.target.value as UserPlan })}
                  >
                    <option value="Free">Standard (Free)</option>
                    <option value="Pro">Professional (Pro)</option>
                    <option value="Agency">Agency (Unlimited)</option>
                  </select>
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2 group shadow-xl"
                >
                  Create Protocol Access
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
