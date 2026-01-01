import React, { useEffect, useState } from 'react';
import { Loader2, Search, Brain, FileText, CheckCircle, BarChart3 } from 'lucide-react';

const steps = [
  { icon: Search, text: "Scanning website footprint..." },
  { icon: BarChart3, text: "Benchmarking against competitors..." },
  { icon: Brain, text: "Analyzing semantic structure..." },
  { icon: FileText, text: "Evaluating content for LLM readability..." },
  { icon: CheckCircle, text: "Generating optimization report..." },
];

export const LoadingState: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-700">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 rounded-full animate-pulse"></div>
        <Loader2 className="w-16 h-16 text-blue-600 animate-spin relative z-10" />
      </div>
      
      <h3 className="text-xl font-semibold text-slate-800 mb-6">Analyzing AI-SEO Readiness</h3>
      
      <div className="space-y-4 w-full max-w-md">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          
          return (
            <div 
              key={index}
              className={`flex items-center gap-4 p-3 rounded-lg transition-all duration-500 ${
                isActive ? 'bg-white shadow-md border border-blue-100 scale-105' : 
                isCompleted ? 'opacity-50' : 'opacity-30 grayscale'
              }`}
            >
              <div className={`p-2 rounded-full ${isActive ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                <Icon size={20} />
              </div>
              <span className={`text-sm font-medium ${isActive ? 'text-blue-900' : 'text-slate-600'}`}>
                {step.text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};