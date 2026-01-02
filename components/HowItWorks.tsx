
import React from 'react';
import { Search, Database, MousePointerClick, Brain, Cpu, MessageSquare, ArrowRight, Layers, FileText, CheckCircle2, Sparkles, Zap, Feather } from 'lucide-react';

interface HowItWorksProps {
  onAnalyze: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onAnalyze }) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-6">The Shift from <span className="text-blue-600">Retrieval</span> to <span className="text-purple-600">Synthesis</span></h1>
        <p className="text-lg text-slate-600">
          Understanding why your traditional SEO strategy might not work for AI. 
          The mechanics of how a customer finds you have fundamentally changed.
        </p>
      </div>

      {/* The Comparison Visual */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20 relative">
        {/* Connector Line (Desktop) */}
        <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full border border-slate-200 shadow-sm">
          <span className="font-bold text-xs text-slate-400">VS</span>
        </div>

        {/* Traditional Search */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
              <Search size={24} />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Traditional Search (Google)</h2>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="mt-1 bg-slate-100 p-1.5 rounded text-slate-500">
                <Database size={16} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">1. Indexing</h3>
                <p className="text-sm text-slate-600 mt-1">Bots crawl your site and store keywords in a massive database (the Index).</p>
              </div>
            </div>
            
            <div className="flex justify-center">
              <ArrowRight className="text-slate-300 rotate-90 md:rotate-0" />
            </div>

            <div className="flex items-start gap-4">
              <div className="mt-1 bg-slate-100 p-1.5 rounded text-slate-500">
                <Layers size={16} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">2. Ranking</h3>
                <p className="text-sm text-slate-600 mt-1">Algorithms rank links based on backlinks, keyword density, and page speed.</p>
              </div>
            </div>

            <div className="flex justify-center">
              <ArrowRight className="text-slate-300 rotate-90 md:rotate-0" />
            </div>

            <div className="flex items-start gap-4">
              <div className="mt-1 bg-slate-100 p-1.5 rounded text-slate-500">
                <MousePointerClick size={16} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">3. The Goal: The Click</h3>
                <p className="text-sm text-slate-600 mt-1">The user is presented with 10 blue links. They must click to find the answer. Your goal is the click-through.</p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Search */}
        <div className="bg-white p-8 rounded-2xl border border-purple-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-indigo-500"></div>
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-purple-50 rounded-full blur-2xl opacity-50 pointer-events-none"></div>
          
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-purple-100 p-3 rounded-lg text-purple-600">
              <Brain size={24} />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Neural Synthesis (ChatGPT/Gemini)</h2>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="mt-1 bg-slate-100 p-1.5 rounded text-slate-500">
                <Cpu size={16} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">1. Training & RAG</h3>
                <p className="text-sm text-slate-600 mt-1">The AI reads your site to understand <em>facts</em> and <em>entities</em>, not just keywords. It connects your data to its knowledge graph.</p>
              </div>
            </div>

            <div className="flex justify-center">
              <ArrowRight className="text-slate-300 rotate-90 md:rotate-0" />
            </div>

            <div className="flex items-start gap-4">
              <div className="mt-1 bg-slate-100 p-1.5 rounded text-slate-500">
                <FileText size={16} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">2. Synthesis</h3>
                <p className="text-sm text-slate-600 mt-1">The model generates a new, unique answer by combining facts from multiple sources. It doesn't just list links.</p>
              </div>
            </div>

            <div className="flex justify-center">
              <ArrowRight className="text-slate-300 rotate-90 md:rotate-0" />
            </div>

            <div className="flex items-start gap-4">
              <div className="mt-1 bg-slate-100 p-1.5 rounded text-slate-500">
                <div className="flex gap-1">
                  <Sparkles size={14} className="text-blue-500" />
                  <Zap size={14} className="text-emerald-500" />
                  <Feather size={14} className="text-orange-500" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">3. The Goal: The Answer</h3>
                <p className="text-sm text-slate-600 mt-1">The user gets a direct answer from Gemini, ChatGPT, or Claude. Your goal is to be the <strong>primary source</strong> cited in that answer.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Deep Dive Grid */}
      <h2 id="geo-factors" className="text-2xl font-bold text-slate-900 mb-8 text-center">What Changes for Your Content?</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 hover:bg-white hover:shadow-sm transition-all">
            <h3 className="font-bold text-slate-800 mb-3">Structured Data</h3>
            <p className="text-sm text-slate-600 mb-4">Search engines guessed what your content was. AI needs certainty via machine-readable formats.</p>
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-red-500">
                    <span>✕ Ambiguous HTML</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-green-600 font-medium">
                    <CheckCircle2 size={14} />
                    <span>Schema.org JSON-LD</span>
                </div>
            </div>
        </div>
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 hover:bg-white hover:shadow-sm transition-all">
            <h3 className="font-bold text-slate-800 mb-3">Formatting</h3>
            <p className="text-sm text-slate-600 mb-4">Humans scan for headlines. AI models scan for specific data relationships and extraction patterns.</p>
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-red-500">
                    <span>✕ Long paragraphs</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-green-600 font-medium">
                    <CheckCircle2 size={14} />
                    <span>Tables & Lists</span>
                </div>
            </div>
        </div>
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 hover:bg-white hover:shadow-sm transition-all">
            <h3 className="font-bold text-slate-800 mb-3">Authority</h3>
            <p className="text-sm text-slate-600 mb-4">Backlinks mattered most for Google. Now, "Entity Authority" within the model's training set is key.</p>
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-red-500">
                    <span>✕ Keyword stuffing</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-green-600 font-medium">
                    <CheckCircle2 size={14} />
                    <span>Expert Consensus</span>
                </div>
            </div>
        </div>
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 hover:bg-white hover:shadow-sm transition-all">
            <h3 className="font-bold text-slate-800 mb-3">Factual Density</h3>
            <p className="text-sm text-slate-600 mb-4">AI prefers data it can verify. High concentration of original stats makes your site a preferred source.</p>
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-red-500">
                    <span>✕ Generic fluff</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-green-600 font-medium">
                    <CheckCircle2 size={14} />
                    <span>Original Statistics</span>
                </div>
            </div>
        </div>
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 hover:bg-white hover:shadow-sm transition-all">
            <h3 className="font-bold text-slate-800 mb-3">HTML Extraction</h3>
            <p className="text-sm text-slate-600 mb-4">LLMs process text streams. Complex layouts or JS-heavy elements can break the "reading" flow.</p>
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-red-500">
                    <span>✕ Text hidden in JS</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-green-600 font-medium">
                    <CheckCircle2 size={14} />
                    <span>Semantic HTML</span>
                </div>
            </div>
        </div>
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 hover:bg-white hover:shadow-sm transition-all">
            <h3 className="font-bold text-slate-800 mb-3">Topical Authority</h3>
            <p className="text-sm text-slate-600 mb-4">AI values depth of knowledge over frequency. One deep guide beats ten thin blog posts.</p>
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-red-500">
                    <span>✕ Daily thin content</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-green-600 font-medium">
                    <CheckCircle2 size={14} />
                    <span>Exhaustive Guides</span>
                </div>
            </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-slate-900 rounded-2xl p-8 md:p-12 text-center text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-3xl opacity-20 -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600 rounded-full blur-3xl opacity-20 -ml-16 -mb-16"></div>
        
        <h2 className="text-2xl md:text-3xl font-bold mb-4 relative z-10">See how your site translates to AI</h2>
        <p className="text-slate-300 mb-8 max-w-xl mx-auto relative z-10">
          Our analyzer uses Gemini 3 to simulate how an LLM perceives your brand, content, and authority.
        </p>
        <button 
          onClick={onAnalyze}
          className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-lg font-bold transition-all hover:scale-105 active:scale-95 relative z-10"
        >
          Run Free Audit
        </button>
      </div>

    </div>
  );
};
