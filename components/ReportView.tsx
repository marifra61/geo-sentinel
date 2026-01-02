

import React, { useState } from 'react';
import { SeoReport, Metric, ContentGap, TechnicalIssue, UserPlan } from '../types';
import { PdfGenerator } from './PdfGenerator';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { 
  Check, 
  AlertTriangle, 
  AlertOctagon, 
  Info, 
  ArrowUpRight, 
  Brain, 
  Target, 
  Layers, 
  Zap, 
  Bot, 
  Search, 
  Sparkles, 
  MessageSquareMore, 
  Globe,
  FileSearch,
  BookOpen,
  Fingerprint,
  Network,
  Quote,
  Scale,
  Activity,
  Clock,
  Minus,
  Construction,
  ShieldAlert,
  ShieldCheck,
  ZapOff,
  Crown,
  MessageCircle,
  Cpu,
  Feather,
  BarChart4,
  Flame,
  Link as LinkIcon
} from 'lucide-react';

interface ReportViewProps {
  report: SeoReport;
  userPlan: UserPlan;
  onReset: () => void;
}

const ScoreBadge: React.FC<{ score: number }> = ({ score }) => {
  let colorClass = 'text-green-600 bg-green-50 border-green-200';
  if (score < 50) colorClass = 'text-red-600 bg-red-50 border-red-200';
  else if (score < 80) colorClass = 'text-yellow-600 bg-yellow-50 border-yellow-200';

  return (
    <div className={`flex items-center justify-center w-24 h-24 rounded-full border-4 ${colorClass}`}>
      <span className="text-3xl font-bold">{score}</span>
    </div>
  );
};

const MarketPositionBadge: React.FC<{ position: string }> = ({ position }) => {
  const styles: Record<string, string> = {
    'Leader': 'bg-green-100 text-green-700 border-green-200',
    'Competitive': 'bg-blue-100 text-blue-700 border-blue-200',
    'Behind': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    'At Risk': 'bg-red-100 text-red-700 border-red-200',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${styles[position] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
      {position}
    </span>
  );
};

const PlatformIcon: React.FC<{ platform: string }> = ({ platform }) => {
  switch (platform) {
    case 'Gemini':
      return (
        <div className="p-2 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/30 transition-transform hover:scale-110">
          <Sparkles className="w-5 h-5" />
        </div>
      );
    case 'ChatGPT':
      return (
        <div className="p-2 rounded-xl bg-[#10a37f] text-white shadow-lg shadow-emerald-500/30 transition-transform hover:scale-110">
          <Zap className="w-5 h-5" />
        </div>
      );
    case 'Perplexity':
      return (
        <div className="p-2 rounded-xl bg-cyan-600 text-white shadow-lg shadow-cyan-500/30 transition-transform hover:scale-110">
          <Search className="w-5 h-5" />
        </div>
      );
    case 'Claude':
      return (
        <div className="p-2 rounded-xl bg-[#d97757] text-white shadow-lg shadow-orange-500/30 transition-transform hover:scale-110">
          <Feather className="w-5 h-5" />
        </div>
      );
    default:
      return (
        <div className="p-2 rounded-xl bg-slate-900 text-white shadow-lg transition-transform hover:scale-110">
          <Bot className="w-5 h-5" />
        </div>
      );
  }
};

const MetricIcon: React.FC<{ name: string; size?: number; className?: string }> = ({ name, size = 20, className }) => {
  if (name.includes('Readability')) return <FileSearch size={size} className={className} />;
  if (name.includes('Answer Engine')) return <Target size={size} className={className} />;
  if (name.includes('Entity Authority')) return <Fingerprint size={size} className={className} />;
  if (name.includes('Semantic Coverage')) return <Network size={size} className={className} />;
  if (name.includes('Citation Potential')) return <Quote size={size} className={className} />;
  if (name.includes('Factual Accuracy')) return <Scale size={size} className={className} />;
  return <Info size={size} className={className} />;
};

const getMetricImportance = (name: string) => {
  if (name.includes('Readability')) return "Critical for LLM training data inclusion. If a model can't parse your code, you don't exist.";
  if (name.includes('Answer Engine')) return "Directly impacts being chosen as the 'featured' answer in zero-click searches.";
  if (name.includes('Entity Authority')) return "Determines how much 'trust' the model assigns to your brand's facts vs competitors.";
  if (name.includes('Semantic Coverage')) return "Essential for ranking for broad topical queries, not just specific keywords.";
  if (name.includes('Citation Potential')) return "Crucial for being referenced as a source. AI models prioritize content with high-quality outbound links and clear sourcing.";
  if (name.includes('Factual Accuracy')) return "LLMs prioritize sources that minimize hallucinations. Accuracy builds permanent authority.";
  return "Fundamental component of the generative search visibility algorithm.";
};

const CustomRadarTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const yourScore = payload.find((p: any) => p.name === 'Your Score')?.value || 0;
    const benchmark = payload.find((p: any) => p.name === 'Industry Benchmark')?.value || 0;
    const delta = yourScore - benchmark;

    return (
      <div className="bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-2xl border border-slate-200 max-w-xs z-50 ring-1 ring-slate-900/5">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-blue-600 text-white p-2 rounded-lg shadow-sm">
            <MetricIcon name={data.originalName} size={18} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm leading-none">{data.originalName}</h4>
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">AI Factor</span>
          </div>
        </div>

        <p className="text-xs text-slate-600 mb-4 leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-100">
          {data.description}
        </p>

        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Your Score</span>
            <span className={`font-bold ${yourScore < 50 ? 'text-red-600' : 'text-blue-600'}`}>{yourScore}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Industry Benchmark</span>
            <span className="font-bold text-slate-400">{benchmark}</span>
          </div>
          <div className={`flex items-center justify-between text-[10px] font-bold py-1 px-2 rounded-md ${delta >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            <span>PERFORMANCE GAP</span>
            <span>{delta >= 0 ? '+' : ''}{delta} pts</span>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-3">
          <div className="flex items-start gap-2">
            <Zap size={14} className="text-amber-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Strategic Importance</p>
              <p className="text-[11px] text-slate-700 leading-snug font-medium italic">
                "{getMetricImportance(data.originalName)}"
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const AiFrequencyBadge: React.FC<{ frequency: ContentGap['aiFrequency'] }> = ({ frequency }) => {
  const configs = {
    'Often': {
      color: 'bg-indigo-600 text-white border-indigo-700 shadow-md',
      icon: <Flame size={14} className="animate-pulse" />,
      label: 'CRITICAL AI INTEREST'
    },
    'Sometimes': {
      color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      icon: <Activity size={12} className="shrink-0" />,
      label: 'Active Trend'
    },
    'Rarely': {
      color: 'bg-slate-100 text-slate-600 border-slate-200',
      icon: <Clock size={12} className="shrink-0" />,
      label: 'Developing'
    }
  };

  const config = configs[frequency] || configs['Rarely'];

  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${config.color}`}>
      {config.icon}
      {config.label}
    </div>
  );
};

export const ReportView: React.FC<ReportViewProps> = ({ report, userPlan, onReset }) => {
  const radarData = report.metrics.map(m => ({
    subject: m.name.split(' ').join('\n'), 
    originalName: m.name,
    Score: m.score,
    Benchmark: report.benchmarks.industryAverage,
    fullMark: 100,
    description: m.description
  }));

  const ProgressBar = ({ value, color, label }: { value: number, color: string, label: string }) => (
    <div className="mb-3">
      <div className="flex justify-between text-xs font-medium mb-1 text-slate-600">
        <span>{label}</span>
        <span>{value}/100</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2.5">
        <div className={`h-2.5 rounded-full ${color} transition-all duration-1000 ease-out`} style={{ width: `${value}%` }}></div>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-slate-200 pb-6">
        <div className="flex items-center gap-4">
          <div className={`p-2 rounded-xl ${
            userPlan === 'Agency' ? 'bg-slate-900 text-blue-400' : 
            userPlan === 'Pro' ? 'bg-blue-600 text-white' : 
            'bg-slate-100 text-slate-600'
          }`}>
            {userPlan === 'Agency' ? <Crown size={24} /> : <ShieldCheck size={24} />}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">AI Optimization Audit</h1>
            <p className="text-slate-500 mt-1 flex items-center gap-2">
              Analysis for 
              <a href={report.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-1 font-medium">
                {report.url}
                <ArrowUpRight size={14} />
              </a>
              {userPlan === 'Free' && <span className="text-[10px] font-black uppercase bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full ml-2">Standard Protocol</span>}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={onReset}
            className="px-4 py-2 text-slate-600 hover:text-slate-900 font-semibold transition-colors text-sm"
          >
            New Analysis
          </button>
          <PdfGenerator report={report} userPlan={userPlan} />
        </div>
      </div>

      {/* Grounding Sources: MUST extract and list URLs if using Google Search */}
      {report.groundingSources && report.groundingSources.length > 0 && (
        <div className="mb-8 bg-slate-50 border border-slate-200 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Globe className="text-blue-500" size={20} />
            Search Grounding Sources
          </h2>
          <div className="flex flex-wrap gap-4">
            {report.groundingSources.map((source, i) => (
              <a 
                key={i} 
                href={source.uri} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"
              >
                <LinkIcon size={14} className="shrink-0" />
                <span className="truncate max-w-[200px]">{source.title || source.uri}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Score & Benchmark Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 lg:col-span-1 flex flex-col group transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800">AI Readiness</h2>
            <MarketPositionBadge position={report.benchmarks.marketPosition} />
          </div>
          
          <div className="flex items-center gap-6 mb-8 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <ScoreBadge score={report.overallScore} />
            <div className="flex-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Impact Summary</p>
              <p className="text-sm text-slate-700 leading-snug font-medium italic">
                "{report.summary.split('. ')[0]}."
              </p>
            </div>
          </div>

          <div className="mt-auto border-t border-slate-100 pt-5">
            <h3 className="text-xs font-bold uppercase text-slate-400 mb-4 tracking-widest flex items-center gap-2">
              <Layers size={14} />
              Competitive Landscape
            </h3>
            <ProgressBar value={report.overallScore} color="bg-blue-600" label="Your Site" />
            <ProgressBar value={report.benchmarks.industryAverage} color="bg-slate-400" label="Industry Average" />
            <ProgressBar value={report.benchmarks.topCompetitor.score} color="bg-purple-500" label={`Top Competitor (${report.benchmarks.topCompetitor.name})`} />
          </div>
        </div>

        {/* Chart Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Performance vs. Industry</h2>
              <p className="text-xs text-slate-500">Hover over points to see detailed AI-SEO factor analysis</p>
            </div>
          </div>
          <div className="h-[340px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#f1f5f9" />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} 
                />
                <Radar
                  name="Your Score"
                  dataKey="Score"
                  stroke="#2563eb"
                  strokeWidth={3}
                  fill="#3b82f6"
                  fillOpacity={0.3}
                  animationBegin={200}
                  animationDuration={1000}
                />
                <Radar
                  name="Industry Benchmark"
                  dataKey="Benchmark"
                  stroke="#94a3b8"
                  strokeWidth={2}
                  fill="#cbd5e1"
                  fillOpacity={0.05}
                  strokeDasharray="5 5"
                />
                <Tooltip content={<CustomRadarTooltip />} cursor={{ strokeOpacity: 0.1 }} />
                <Legend 
                  iconType="circle" 
                  wrapperStyle={{ paddingTop: '20px', fontSize: '12px', fontWeight: 600, color: '#475569' }} 
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Metrics Grid */}
      <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
        <BookOpen className="text-blue-600" size={24} />
        Deep Dive: Analysis Metrics
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {report.metrics.map((metric, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col gap-4 group hover:shadow-lg transition-all hover:-translate-y-1">
            <div className="flex justify-between items-start">
               <div className={`p-3 rounded-xl transition-colors ${
                metric.status === 'Critical' ? 'bg-red-50 text-red-600 group-hover:bg-red-100' :
                metric.status === 'Warning' ? 'bg-yellow-50 text-yellow-600 group-hover:bg-yellow-100' :
                'bg-green-50 text-green-600 group-hover:bg-green-100'
              }`}>
                <MetricIcon name={metric.name} size={24} />
              </div>
              <div className="text-right">
                <span className={`text-2xl font-black ${
                    metric.score < 50 ? 'text-red-600' : metric.score < 80 ? 'text-yellow-600' : 'text-green-600'
                  }`}>{metric.score}</span>
                <span className="block text-[10px] font-bold text-slate-400 tracking-widest uppercase mt-0.5">Score</span>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-1.5 text-base">{metric.name}</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">{metric.description}</p>
              <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100 group-hover:bg-blue-100/50 transition-colors">
                <span className="block text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Strategic Importance</span>
                <p className="text-[11px] font-medium text-blue-900/80 leading-snug">
                  {getMetricImportance(metric.name)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Content Gaps & Technical Issues */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Content Gaps Section */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <BarChart4 className="text-indigo-600" size={24} />
            AI Content Opportunities
          </h2>
          <div className="space-y-4">
            {report.contentGaps.map((gap, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-200 transition-all group">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors text-lg">{gap.topic}</h3>
                    <p className="text-xs text-slate-500 font-black mt-1 uppercase tracking-widest flex items-center gap-2">
                      <Layers size={12} className="text-slate-400" />
                      Global Demand: <span className="text-indigo-600">{gap.searchVolume}</span>
                    </p>
                  </div>
                  <AiFrequencyBadge frequency={gap.aiFrequency} />
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest w-full mb-1">Competitive Presence:</span>
                  {gap.competitorsCovering.map((comp, ci) => (
                    <span key={ci} className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-[10px] font-bold text-slate-600">
                      {comp}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Issues Section */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Construction className="text-amber-600" size={24} />
            Technical Barriers
          </h2>
          <div className="space-y-4">
            {report.technicalIssues.length > 0 ? report.technicalIssues.map((issue, i) => (
              <div key={i} className={`p-5 rounded-2xl border shadow-sm transition-all flex items-start gap-4 ${
                issue.severity === 'Critical' ? 'bg-red-50 border-red-100' :
                issue.severity === 'Major' ? 'bg-orange-50 border-orange-100' :
                'bg-slate-50 border-slate-200'
              }`}>
                <div className={`p-2 rounded-xl shrink-0 ${
                  issue.severity === 'Critical' ? 'bg-red-100 text-red-600' :
                  issue.severity === 'Major' ? 'bg-orange-100 text-orange-600' :
                  'bg-slate-200 text-slate-600'
                }`}>
                  {issue.severity === 'Critical' ? <ShieldAlert size={20} /> : <ZapOff size={20} />}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-slate-900">{issue.issue}</h3>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest border ${
                      issue.severity === 'Critical' ? 'bg-red-600 text-white border-red-600' :
                      issue.severity === 'Major' ? 'bg-orange-500 text-white border-orange-500' :
                      'bg-slate-400 text-white border-slate-400'
                    }`}>
                      {issue.severity}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    <span className="font-bold text-slate-800">AI Impact:</span> {issue.aiImpact}
                  </p>
                </div>
              </div>
            )) : (
              <div className="bg-green-50 border border-green-100 p-8 rounded-2xl text-center">
                <ShieldCheck className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <h3 className="font-bold text-green-800">Clean Technical Audit</h3>
                <p className="text-sm text-green-700">No major technical barriers found preventing AI accessibility.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Platform Insights */}
        <div className="flex flex-col">
           <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
             <Brain className="text-purple-600" size={24} />
             Platform Insights
           </h2>
           <div className="grid grid-cols-1 gap-4 flex-1">
             {report.aiInsights.map((insight, idx) => (
               <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                 <div className="flex justify-between items-center mb-3">
                   <div className="flex items-center gap-4">
                     <PlatformIcon platform={insight.platform} />
                     <span className="font-black text-slate-900 text-lg uppercase tracking-tight">{insight.platform}</span>
                   </div>
                   <span className={`text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-wider ${
                     insight.visibility === 'High' ? 'bg-green-100 text-green-700' :
                     insight.visibility === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                     'bg-slate-100 text-slate-700'
                   }`}>
                     {insight.visibility} Visibility
                   </span>
                 </div>
                 <p className="text-sm text-slate-600 font-medium leading-relaxed group-hover:text-slate-800 transition-colors">
                   {insight.suggestion}
                 </p>
                 <div className="absolute top-0 right-0 h-full w-1.5 bg-gradient-to-b from-transparent via-slate-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
               </div>
             ))}
           </div>
        </div>

        {/* Strategic Roadmap */}
        <div>
           <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
             <ArrowUpRight className="text-blue-600" size={24} />
             Execution Roadmap
           </h2>
           <div className="space-y-4">
             {report.recommendations.map((rec, idx) => (
               <div key={idx} className="bg-white border-l-4 border-blue-600 shadow-sm rounded-r-2xl p-6 border border-slate-200 hover:shadow-md transition-all">
                 <div className="flex justify-between items-start mb-3">
                   <h3 className="font-bold text-slate-900 text-base">{rec.title}</h3>
                   <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
                     rec.impact === 'High' ? 'bg-red-50 text-red-700 border border-red-100' : 
                     rec.impact === 'Medium' ? 'bg-orange-50 text-orange-700 border border-orange-100' : 
                     'bg-blue-50 text-blue-700 border border-blue-100'
                   }`}>{rec.impact} Impact</span>
                 </div>
                 <p className="text-sm text-slate-500 mb-4 leading-relaxed">{rec.description}</p>
                 <div className="bg-slate-50 p-4 rounded-xl text-sm text-slate-800 font-bold border border-slate-100 flex items-center gap-3">
                   <div className="bg-blue-600 text-white p-1.5 rounded-lg shrink-0">
                     <Target size={14} />
                   </div>
                   <p><span className="text-blue-600 uppercase text-[10px] tracking-widest block mb-0.5">Primary Action</span>{rec.actionItem}</p>
                 </div>
                 {rec.estimatedLift && (
                    <div className="text-xs font-bold text-green-600 mt-4 flex items-center gap-1.5 bg-green-50 w-fit px-3 py-1 rounded-full border border-green-100">
                      <Zap size={12} />
                      Expected Visibility Lift: {rec.estimatedLift}
                    </div>
                 )}
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};