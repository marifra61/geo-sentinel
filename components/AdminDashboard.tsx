
import React from 'react';
import { 
  Users, 
  BarChart4, 
  ShieldCheck, 
  Globe, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight, 
  UserPlus, 
  Database, 
  Activity,
  Search,
  CheckCircle2,
  AlertCircle,
  // Fix: Added missing Settings icon import
  Settings
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { UserRecord } from '../App';

interface AdminDashboardProps {
  users: Record<string, UserRecord>;
  currentUserEmail: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ users, currentUserEmail }) => {
  // Explicitly type userList to UserRecord[] to fix "unknown" type errors
  const userList: UserRecord[] = Object.values(users);
  // Add type annotations to parameters in reduce and filter
  const totalAudits = userList.reduce((sum, u: UserRecord) => sum + u.monthlyUsage, 0);
  const agencyUsers = userList.filter((u: UserRecord) => u.plan === 'Agency').length;
  const proUsers = userList.filter((u: UserRecord) => u.plan === 'Pro').length;
  const freeUsers = userList.filter((u: UserRecord) => u.plan === 'Free').length;

  const usageData = [
    { name: 'Mon', audits: 12 },
    { name: 'Tue', audits: 19 },
    { name: 'Wed', audits: 15 },
    { name: 'Thu', audits: 22 },
    { name: 'Fri', audits: 30 },
    { name: 'Sat', audits: 10 },
    { name: 'Sun', audits: 8 },
  ];

  const planData = [
    { name: 'Agency', count: agencyUsers, color: '#0f172a' },
    { name: 'Pro', count: proUsers, color: '#2563eb' },
    { name: 'Free', count: freeUsers, color: '#94a3b8' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in duration-700">
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Database className="text-blue-600" size={32} />
            Administrative Intelligence
          </h1>
          <p className="text-slate-500 mt-1 font-medium">Oversight for all Neural Identity Protocols across the portfolio.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-blue-50 border border-blue-100 px-4 py-2 rounded-xl flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div>
            <span className="text-xs font-black uppercase tracking-widest text-blue-800">System Online</span>
          </div>
          <button className="bg-slate-900 text-white p-2.5 rounded-xl hover:bg-black transition-all">
            <UserPlus size={20} />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: 'Total Neural Audits', value: totalAudits, icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+12%', trendUp: true },
          { label: 'Active Identities', value: userList.length, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50', trend: '+3', trendUp: true },
          { label: 'Avg. Readiness Score', value: '78.4', icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '-2.1%', trendUp: false },
          { label: 'Portfolio Domains', value: '142', icon: Globe, color: 'text-amber-600', bg: 'bg-amber-50', trend: '+8', trendUp: true },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between group hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-wider ${stat.trendUp ? 'text-emerald-600' : 'text-red-500'}`}>
                {stat.trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {stat.trend}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
              <h3 className="text-2xl font-black text-slate-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* Usage Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <BarChart4 size={20} className="text-blue-600" />
              Usage Pulse
            </h2>
            <select className="bg-slate-50 border border-slate-200 text-xs font-bold p-2 rounded-lg outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={usageData}>
                <defs>
                  <linearGradient id="colorAudits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  labelStyle={{ fontWeight: 800, color: '#0f172a' }}
                />
                <Area type="monotone" dataKey="audits" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorAudits)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Plan Distribution */}
        <div className="bg-slate-900 p-8 rounded-3xl text-white flex flex-col shadow-xl">
          <h2 className="text-lg font-bold mb-8 flex items-center gap-2">
            <ShieldCheck size={20} className="text-blue-400" />
            Tier Distribution
          </h2>
          <div className="h-48 mb-8">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={planData}>
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {planData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color === '#0f172a' ? '#3b82f6' : entry.color} />
                  ))}
                </Bar>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10}} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff'}} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            {planData.map((item, i) => (
              <div key={i} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${item.name === 'Agency' ? 'bg-blue-400' : item.name === 'Pro' ? 'bg-blue-600' : 'bg-slate-500'}`}></div>
                  <span className="text-slate-400 font-medium">{item.name} Users</span>
                </div>
                <span className="font-bold">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Identity Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-10">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Users size={20} className="text-blue-600" />
            Managed Identity Protocols
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input 
              type="text" 
              placeholder="Filter protocols..." 
              className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/10"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Identity</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Plan Tier</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Activity (30d)</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Joined</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {userList.map((user: UserRecord, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 font-black">
                        {user.email?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{user.email}</p>
                        <p className="text-[10px] text-slate-400 font-medium">Neural ID: {Math.random().toString(36).substring(7).toUpperCase()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                      user.plan === 'Agency' ? 'bg-slate-900 text-blue-400 border-slate-800' :
                      user.plan === 'Pro' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                      'bg-slate-100 text-slate-500 border-slate-200'
                    }`}>
                      {user.plan}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-blue-600 h-full" style={{ width: `${(user.monthlyUsage / 20) * 100}%` }}></div>
                      </div>
                      <span className="text-xs font-bold text-slate-900">{user.monthlyUsage}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-xs font-medium text-slate-500 flex items-center gap-2">
                      <Clock size={12} />
                      {user.joinDate ? new Date(user.joinDate).toLocaleDateString() : 'Active'}
                    </p>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="text-slate-400 hover:text-blue-600 transition-colors">
                      <Settings size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security Health Section */}
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-8">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
          <CheckCircle2 size={32} />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-black text-slate-900 mb-1">Portfolio Infrastructure Health: Excellent</h3>
          <p className="text-sm text-slate-500 leading-relaxed max-w-2xl">
            All administrative nodes are active. Neural citation signals across 142 domains are stable. No security compromises detected in the identity vault during the last 24-hour cycle.
          </p>
        </div>
        <button className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all text-xs whitespace-nowrap">
          Run Global Audit
        </button>
      </div>
    </div>
  );
};
