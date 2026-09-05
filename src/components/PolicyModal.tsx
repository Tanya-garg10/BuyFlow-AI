import React from 'react';
import { ShieldCheck, Lock, X, ArrowRight, AlertTriangle, CheckCircle2, ChevronRight } from 'lucide-react';
import { Cart, PolicyEvaluation } from '../types';

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: Cart;
  policyEvaluation: PolicyEvaluation | null;
  onApprovePayment: () => void;
  onSimulateFailurePayment: () => void;
  isApproving: boolean;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({
  isOpen,
  onClose,
  cart,
  policyEvaluation,
  onApprovePayment,
  onSimulateFailurePayment,
  isApproving,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#121212]/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-white border border-[#121212]/15 p-6 sm:p-8 shadow-[0_30px_70px_rgba(0,0,0,0.3)] space-y-6 text-[#121212] overflow-hidden">
        {/* Top Accent line */}
        <div className="absolute top-0 inset-x-0 h-2 bg-[#121212]" />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#121212]/40 hover:text-[#121212] hover:bg-[#121212]/5 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header: COMMERCE POLICY ENGINE */}
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#CCFF00] border border-[#121212]/20" />
            <span className="text-[11px] font-mono uppercase font-bold tracking-widest text-[#121212]/70">
              COMMERCE POLICY ENGINE
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#121212] uppercase">
            AUTHORIZATION GATE
          </h2>
          <p className="text-xs text-[#121212]/60">
            Razorpay Principle: <em>"Every money action explainable, bounded and gated."</em>
          </p>
        </div>

        {/* Financial Flow Pipeline Diagram */}
        <div className="p-3 rounded-2xl bg-[#121212] text-white space-y-2 font-mono text-[10px]">
          <div className="flex items-center justify-between text-white/50 border-b border-white/10 pb-1.5 uppercase tracking-wider">
            <span>Execution Lifecycle</span>
            <span className="text-[#CCFF00]">Strict Zero-Trust</span>
          </div>
          <div className="flex items-center justify-between text-center overflow-x-auto py-1 gap-1">
            <span className="px-2 py-1 rounded bg-white/10 text-white/90">AI Decision</span>
            <ChevronRight className="w-3 h-3 text-[#CCFF00] shrink-0" />
            <span className="px-2 py-1 rounded bg-white/10 text-white/90">Policy Check</span>
            <ChevronRight className="w-3 h-3 text-[#CCFF00] shrink-0" />
            <span className="px-2 py-1 rounded bg-white/10 text-white/90">Risk Limits</span>
            <ChevronRight className="w-3 h-3 text-[#CCFF00] shrink-0" />
            <span className="px-2 py-1 rounded bg-[#CCFF00] text-[#121212] font-bold">User Approval</span>
            <ChevronRight className="w-3 h-3 text-[#CCFF00] shrink-0" />
            <span className="px-2 py-1 rounded bg-white/10 text-white/90">Razorpay</span>
          </div>
        </div>

        {/* Structured Policy Decision Matrix */}
        <div className="rounded-2xl border border-[#121212]/15 bg-[#FAF8F5] p-4 sm:p-5 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-[#121212]/10 pb-2.5">
            <span className="text-[#121212]/60 uppercase text-[10px] font-bold">ACTION:</span>
            <span className="font-bold px-2 py-0.5 rounded bg-[#121212] text-[#CCFF00] text-[11px]">
              CREATE_PAYMENT
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-[10px] text-[#121212]/50 uppercase block">Amount</span>
              <strong className="text-base text-[#121212] font-black">
                ₹{cart.total.toLocaleString('en-IN')}
              </strong>
            </div>
            <div>
              <span className="text-[10px] text-[#121212]/50 uppercase block">Merchant</span>
              <strong className="text-sm text-[#121212]">BuyFlow Store</strong>
            </div>
            <div>
              <span className="text-[10px] text-[#121212]/50 uppercase block">Reason</span>
              <span className="text-xs text-[#121212]/80">User-approved cart</span>
            </div>
            <div>
              <span className="text-[10px] text-[#121212]/50 uppercase block">Policy Check</span>
              <span className="text-xs text-emerald-700 font-bold inline-flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                ALLOWED (GATE-ACTIVE)
              </span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="font-sans font-medium leading-snug">
              <strong>Explicit approval gate:</strong> Money movement requires clicking approve below to initialize Razorpay checkout.
            </span>
          </div>
        </div>

        {/* Distinct Action Buttons: TEST 1 vs TEST 2 */}
        <div className="space-y-3 pt-1">
          {/* TEST 1: Real Razorpay Test Payment */}
          <button
            onClick={onApprovePayment}
            disabled={isApproving}
            className="w-full py-4 rounded-full bg-[#121212] hover:bg-black text-[#CCFF00] text-xs sm:text-sm font-black uppercase tracking-wider shadow-xl flex items-center justify-center space-x-2 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-[#CCFF00]" />
            <span>
              {isApproving ? 'CREATING RAZORPAY ORDER...' : `APPROVE & PAY (₹${cart.total.toLocaleString('en-IN')}) → RAZORPAY`}
            </span>
            <ArrowRight className="w-4 h-4 text-[#CCFF00]" />
          </button>

          {/* TEST 2: Separate Explicit Failure Simulator */}
          <div className="p-3 rounded-2xl bg-[#121212]/5 border border-[#121212]/10 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#121212]/70">
              <span className="font-bold uppercase">Failure Recovery Demo (Test 2)</span>
              <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 text-[9px] font-bold">POL-RETRY-01</span>
            </div>
            <button
              type="button"
              onClick={onSimulateFailurePayment}
              disabled={isApproving}
              className="w-full py-2.5 rounded-xl bg-white hover:bg-red-50 text-red-700 border border-red-200 text-xs font-mono font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-xs disabled:opacity-50"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
              <span>SIMULATE PAYMENT FAILURE (DECLINED CARD DEMO)</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2 rounded-full bg-transparent hover:bg-[#121212]/5 text-[#121212]/50 hover:text-[#121212] text-xs font-bold uppercase tracking-wider transition-colors"
          >
            CANCEL AND RETURN TO CART
          </button>
        </div>
      </div>
    </div>
  );
};

