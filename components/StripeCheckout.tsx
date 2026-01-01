
import React, { useEffect, useState } from 'react';
import { Loader2, ShieldCheck, Lock, CheckCircle2, CreditCard } from 'lucide-react';
import { UserPlan } from '../types';

interface StripeCheckoutProps {
  plan: UserPlan;
  onSuccess: () => void;
  onCancel: () => void;
}

const planPrices = {
  'Free': '$0.00',
  'Pro': '$29.00',
  'Agency': '$199.00'
};

export const StripeCheckout: React.FC<StripeCheckoutProps> = ({ plan, onSuccess, onCancel }) => {
  const [status, setStatus] = useState<'LOADING' | 'FORM' | 'PROCESSING' | 'SUCCESS'>('LOADING');

  useEffect(() => {
    const timer = setTimeout(() => setStatus('FORM'), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('PROCESSING');
    setTimeout(() => setStatus('SUCCESS'), 2000);
    setTimeout(() => onSuccess(), 3500);
  };

  if (status === 'LOADING') {
    return (
      <div className="fixed inset-0 bg-white z-[100] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium animate-pulse tracking-widest uppercase text-xs">Connecting to Stripe Secure Gateway...</p>
      </div>
    );
  }

  if (status === 'SUCCESS') {
    return (
      <div className="fixed inset-0 bg-white z-[100] flex flex-col items-center justify-center animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 scale-110">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Subscription Active</h2>
        <p className="text-slate-500 font-medium">Initializing your {plan} Protocol Access...</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-50 z-[100] overflow-y-auto">
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Order Summary */}
        <div className="space-y-8 order-2 lg:order-1">
          <div className="flex items-center gap-2 mb-8 cursor-pointer" onClick={onCancel}>
            <div className="bg-slate-900 p-1.5 rounded-lg">
              <ShieldCheck className="text-blue-500 w-5 h-5" />
            </div>
            <span className="font-bold text-xl text-slate-900 tracking-tight">GEO Sentinel</span>
          </div>

          <div className="space-y-4">
             <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                <div>
                   <h3 className="font-bold text-slate-900">{plan} Protocol Subscription</h3>
                   <p className="text-sm text-slate-500">Monthly access to neural audit tools</p>
                </div>
                <span className="font-bold text-slate-900">{planPrices[plan]}</span>
             </div>
             <div className="flex justify-between items-center text-sm font-medium text-slate-500">
                <span>Infrastructure Fee</span>
                <span>$0.00</span>
             </div>
             <div className="flex justify-between items-center pt-4 text-xl font-black text-slate-900">
                <span>Total Due Today</span>
                <span>{planPrices[plan]}</span>
             </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
             <div className="flex items-center gap-3 mb-3">
               <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                 <Lock size={16} />
               </div>
               <h4 className="font-bold text-slate-900 text-sm">Secure Transaction</h4>
             </div>
             <p className="text-sm text-slate-600 leading-relaxed italic">
               "Your card information is processed securely via Stripe. Your {plan} features will be provisioned immediately upon confirmation."
             </p>
          </div>
        </div>

        {/* Payment Form */}
        <div className="order-1 lg:order-2">
          <div className="bg-white p-8 rounded-3xl shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-8">
               <h2 className="text-xl font-bold text-slate-900">Credit Card</h2>
               <div className="flex items-center gap-2">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4 opacity-50" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4 opacity-50" />
               </div>
            </div>

            <form onSubmit={handlePay} className="space-y-6">
               <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Cardholder Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Jane Doe"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
                  />
               </div>

               <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Card Details</label>
                  <div className="relative">
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      required
                      placeholder="Card number"
                      defaultValue="4242 4242 4242 4242"
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <input type="text" placeholder="MM / YY" required defaultValue="12/29" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 font-mono" />
                    <input type="text" placeholder="CVC" required defaultValue="123" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 font-mono" />
                  </div>
               </div>

               <button 
                  type="submit"
                  disabled={status === 'PROCESSING'}
                  className="w-full py-4 bg-blue-600 text-white rounded-xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200 disabled:opacity-50"
               >
                  {status === 'PROCESSING' ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    `Initialize ${plan} Protocol`
                  )}
               </button>

               <button 
                  type="button" 
                  onClick={onCancel}
                  className="w-full py-2 text-slate-400 font-bold text-sm hover:text-slate-600 transition-colors"
                >
                  Return to Pricing
               </button>

               <div className="flex justify-center gap-6 pt-6 opacity-30">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-4" />
               </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
