
export enum AnalysisStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}

export type UserPlan = 'Free' | 'Pro' | 'Agency';

export interface UserAccount {
  plan: UserPlan;
  dailyUsage: number;
  monthlyUsage: number;
  email?: string;
}

export interface Metric {
  name: string;
  score: number; // 0-100
  description: string;
  status: 'Critical' | 'Warning' | 'Good' | 'Excellent';
}

export interface Recommendation {
  title: string;
  impact: 'High' | 'Medium' | 'Low';
  description: string;
  actionItem: string;
  estimatedLift?: string;
}

export interface AiPlatformInsight {
  platform: 'Gemini' | 'ChatGPT' | 'Perplexity' | 'Claude';
  visibility: 'High' | 'Medium' | 'Low' | 'Unknown';
  suggestion: string;
}

export interface Benchmark {
  industryAverage: number;
  topCompetitor: {
    name: string;
    score: number;
    strengths: string;
  };
  marketPosition: 'Leader' | 'Competitive' | 'Behind' | 'At Risk';
}

export interface ContentGap {
  topic: string;
  searchVolume: 'High' | 'Medium' | 'Low';
  competitorsCovering: string[];
  aiFrequency: 'Often' | 'Sometimes' | 'Rarely';
}

export interface TechnicalIssue {
  issue: string;
  severity: 'Critical' | 'Major' | 'Minor';
  aiImpact: string;
}

export interface SeoReport {
  url: string;
  timestamp: string;
  overallScore: number;
  summary: string;
  metrics: Metric[];
  benchmarks: Benchmark;
  googleVsAiComparison: {
    googleFocus: string[];
    aiFocus: string[];
  };
  contentGaps: ContentGap[];
  technicalIssues: TechnicalIssue[];
  aiInsights: AiPlatformInsight[];
  recommendations: Recommendation[];
  // Plan-specific metadata
  planAtGeneration: UserPlan;
  // Mandatory source attribution for Search Grounding
  groundingSources?: Array<{ title: string; uri: string }>;
}