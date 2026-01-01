
import React from 'react';
import { Check, Zap, Shield, Building2, Star, CreditCard } from 'lucide-react';
import { UserPlan } from '../types';

interface PricingViewProps {
  currentPlan: UserPlan;
  onSelectPlan: (plan: UserPlan) => void;
}

const PlanCard: React.FC<{
  name: string;
  price: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
  isPopular?: boolean;
  ctaText: string;
  onCta: () => void;
  planKey: UserPlan;
  currentPlan: UserPlan;
}> = ({ name, price, description, features, icon, isPopular, ctaText, onCta, planKey, currentPlan }) => {
  const isCurrent = currentPlan === planKey;

  return (
    <div className={`relative bg-white rounded-3xl p-8 border-2 transition-all duration-300 flex flex-col ${
      isPopular ? 'border-blue-600 shadow-xl scale-105 z-10' : 'border-slate-100 shadow-sm hover:border-slate-300'
    }`}>
      {isPopular && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest py-1.5 px-4 rounded-full flex items-center gap-1.5 shadow-lg">
          <Star size={12} fill="currentColor" />
          Most Popular
        </div>
      )}
      
      <div className="mb-6">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${
          isPopular ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
        }`}>
          {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-900">{name}</h3>
        <div className="flex items-baseline gap-1 mt-2">
          <span className="text-4xl font-black text-slate-900">{price}</span>
          {price !== 'Free' && <span className="text-slate-500 font-medium">/mo</span>}
        </div>
        <p className="text-sm text-slate-500 mt-4 leading-relaxed">{description}</p>
      </div>

      <div className="flex-1 space-y-4 mb-8">
        {features.map((feature, i) => (
          <div key={i} className="flex items-start gap-3 text-sm text-slate-600">
            <div className={`mt-0.5 shrink-0 ${isPopular ? 'text-blue-600' : 'text-slate-400'}`}>
              <Check size={16} strokeWidth={3} />
            </div>
            {feature}
          </div>
        ))}
      </div>

      <button
        onClick={onCta}
        disabled={isCurrent}
        className={`w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${
          isCurrent 
            ? 'bg-slate-100 text-slate-400 cursor-default'
            : isPopular 
              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-blue-200' 
              : 'bg-slate-900 text-white hover:bg-black'
        }`}
      >
        {isCurrent ? 'Current Plan' : (
          <>
            {price !== 'Free' && <CreditCard size={18} />}
            {ctaText}
          </>
        )}
      </button>
    </div>
  );
};

export const PricingView: React.FC<PricingViewProps> = ({ currentPlan, onSelectPlan }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="text-center max-w-2xl mx-auto mb-20">
        <h2 className="text-xs font-black text-blue-600 uppercase tracking-widest mb-4">Subscription Tiers</h2>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Scale your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Neural Presence</span></h1>
        <p className="text-lg text-slate-600">Choose the right protocol for your business or agency. Secure your visibility across all Generative Engines.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-20">
        <PlanCard
          planKey="Free"
          currentPlan={currentPlan}
          name="Standard"
          price="Free"
          description="Ideal for single-brand monitoring and initial discovery."
          ctaText="Start Protocol"
          icon={<Zap size={24} />}
          features={[
            "2 Analysis Protocols per day",
            "Basic Neural Factor Audit",
            "Watermarked PDF Reports",
            "Public Knowledge Access",
            "Standard Support"
          ]}
          onCta={() => onSelectPlan('Free')}
        />

        <PlanCard
          planKey="Pro"
          currentPlan={currentPlan}
          isPopular
          name="Professional"
          price="$29"
          description="Perfect for active marketers and growing digital businesses."
          ctaText="Upgrade to Pro"
          icon={<Shield size={24} />}
          features={[
            "15 Analysis Protocols per month",
            "Clean (Non-Watermarked) Reports",
            "Historical Audit Comparison",
            "Competitor Deep-Dives",
            "Priority Support",
            "Early Access to Neural Graph Tools"
          ]}
          onCta={() => onSelectPlan('Pro')}
        />

        <PlanCard
          planKey="Agency"
          currentPlan={currentPlan}
          name="Agency"
          price="$199"
          description="Comprehensive solution for high-volume portfolio management."
          ctaText="Partner with GEO"
          icon={<Building2 size={24} />}
          features={[
            "Unlimited Analysis Protocols",
            "White-Label PDF Exports",
            "Custom Agency Branding",
            "Team Access (Up to 10)",
            "Dedicated Account Sentinel",
            "API Access Beta"
          ]}
          onCta={() => onSelectPlan('Agency')}
        />
      </div>

      <div className="bg-slate-900 rounded-3xl p-12 text-center text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <h3 className="text-2xl font-bold mb-4">Secured by Stripe</h3>
        <p className="text-slate-400 mb-8 max-w-xl mx-auto">All subscriptions are processed through our secure Stripe portal. Cancel or change plans at any time with one click.</p>
        <div className="flex justify-center gap-8 opacity-50">
          <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-8 brightness-0 invert" />
        </div>
      </div>
    </div>
  );
};
