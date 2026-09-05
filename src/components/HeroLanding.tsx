import React from 'react';
import { ArrowRight, Sparkles, Check, ShieldCheck, Zap, Lock, CreditCard } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroLandingProps {
  onStartBuyer: () => void;
  onExploreMerchant: () => void;
  onRunDemo: () => void;
  onOpenApproval: () => void;
}

export const HeroLanding: React.FC<HeroLandingProps> = ({
  onStartBuyer,
  onExploreMerchant,
  onRunDemo,
  onOpenApproval,
}) => {
  return (
    <div className="relative pt-32 sm:pt-36 lg:pt-40 pb-20 overflow-hidden">
      {/* Editorial Watermark typography behind layout */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 select-none pointer-events-none opacity-[0.03] text-[18vw] font-editorial leading-none whitespace-nowrap text-[#121212] z-0">
        AGENTIC COMMERCE
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Tag */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#121212]/5 border border-[#121212]/10 text-xs font-semibold tracking-wider text-[#121212] uppercase mb-6"
        >
          <span className="text-[#121212]">✦</span>
          <span>AGENTIC COMMERCE, REIMAGINED</span>
          <span className="w-1 h-1 rounded-full bg-[#121212]/30" />
          <span className="text-[10px] font-mono text-[#121212]/60">TRACK 01</span>
        </motion.div>

        {/* Hero Title & Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7 space-y-6">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl sm:text-7xl lg:text-[5.5rem] font-bold tracking-tight text-[#121212] leading-[0.95] uppercase"
            >
              COMMERCE,
              <br />
              <span className="font-editorial italic font-normal lowercase tracking-normal text-[#121212]/80">
                built for
              </span>
              <br />
              <span className="text-[#121212]">AI BUYERS.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-[#121212]/70 max-w-xl font-normal leading-relaxed"
            >
              BuyFlow turns merchant catalogs into AI-readable, AI-discoverable and AI-transactable commerce experiences.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-3 pt-2"
            >
              <button
                onClick={onStartBuyer}
                className="px-6 py-3.5 rounded-full bg-[#121212] hover:bg-[#262626] text-white text-xs sm:text-sm font-bold tracking-wide flex items-center space-x-2 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-black/10"
              >
                <span>TRY AI BUYER</span>
                <ArrowRight className="w-4 h-4 text-[#CCFF00]" />
              </button>

              <button
                onClick={onExploreMerchant}
                className="px-6 py-3.5 rounded-full bg-white hover:bg-[#F3F3EE] text-[#121212] border border-[#121212]/15 text-xs sm:text-sm font-bold tracking-wide transition-all hover:scale-105 active:scale-95"
              >
                <span>EXPLORE MERCHANT →</span>
              </button>

              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#EDE9FE] border border-violet-200 text-[11px] font-mono text-violet-800">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-600 animate-pulse" />
                <span>RAZORPAY TEST MODE</span>
              </div>
            </motion.div>
          </div>

          {/* RIGHT SIDE: Layered Floating "AI Commerce Transaction" Editorial Cards */}
          <div className="lg:col-span-5 relative min-h-[460px] sm:min-h-[500px] flex items-center justify-center">
            {/* Background subtle color glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#CCFF00]/20 via-violet-200/30 to-amber-200/20 rounded-3xl blur-3xl -z-10" />

            <div className="relative w-full max-w-md h-[460px] flex items-center justify-center">
              {/* CARD 1: AI Buyer Request Card */}
              <motion.div
                initial={{ opacity: 0, rotate: -8, y: -20 }}
                animate={{ opacity: 1, rotate: -4, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                whileHover={{ rotate: -2, scale: 1.02 }}
                onClick={onStartBuyer}
                className="cursor-pointer absolute top-4 -left-4 sm:-left-6 w-64 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-[#121212]/10 shadow-[0_15px_35px_rgba(0,0,0,0.08)] z-10"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#121212]/50 font-bold">
                    01 • BUYER INTENT
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#121212]" />
                </div>
                <p className="text-xs font-medium text-[#121212] leading-snug">
                  "I need a laptop under ₹60K for coding with 16GB RAM."
                </p>
                <div className="mt-2.5 flex items-center space-x-1 text-[10px] text-violet-700 font-semibold">
                  <Sparkles className="w-3 h-3" />
                  <span>Agent parsing 13 SKUs...</span>
                </div>
              </motion.div>

              {/* CARD 2: AI Recommendation Card */}
              <motion.div
                initial={{ opacity: 0, rotate: 6, y: -10 }}
                animate={{ opacity: 1, rotate: 3, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                whileHover={{ rotate: 1, scale: 1.02 }}
                onClick={onStartBuyer}
                className="cursor-pointer absolute top-24 -right-2 sm:-right-4 w-72 p-5 rounded-2xl bg-[#121212] text-white shadow-[0_25px_50px_rgba(0,0,0,0.25)] z-20 border border-white/10"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded-full bg-[#CCFF00] text-[#121212] text-[9px] font-black tracking-wider uppercase">
                    BEST MATCH • 96%
                  </span>
                  <span className="text-[10px] font-mono text-white/50">LP001</span>
                </div>
                <h4 className="text-lg font-bold tracking-tight text-white">ProBook 14</h4>
                <div className="flex items-baseline space-x-2 mt-0.5">
                  <span className="text-2xl font-black text-white">₹54,999</span>
                  <span className="text-[10px] text-white/60">16GB RAM • 512GB SSD</span>
                </div>
                <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[10px] text-white/70">
                  <span>✓ Fits ₹60K budget</span>
                  <span className="text-[#CCFF00] font-semibold">In stock (24)</span>
                </div>
              </motion.div>

              {/* CARD 3: Contextual Cross-Sell Card */}
              <motion.div
                initial={{ opacity: 0, rotate: -4, y: 20 }}
                animate={{ opacity: 1, rotate: -2, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                whileHover={{ rotate: 0, scale: 1.02 }}
                className="absolute top-56 -left-2 sm:left-2 w-60 p-4 rounded-2xl bg-[#FAF8F5] border border-[#121212]/15 shadow-[0_15px_30px_rgba(0,0,0,0.06)] z-15"
              >
                <div className="text-[9px] font-bold text-amber-700 uppercase tracking-wider mb-1 flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>COMPLETE THE SETUP</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-bold text-[#121212]">ErgoMouse M2</h5>
                    <span className="text-xs font-extrabold text-[#121212]/90">₹1,299</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#121212]/5 text-[#121212]/70 font-semibold">
                    + paired
                  </span>
                </div>
              </motion.div>

              {/* CARD 4: Cart Card */}
              <motion.div
                initial={{ opacity: 0, rotate: 8, y: 30 }}
                animate={{ opacity: 1, rotate: 5, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                whileHover={{ rotate: 3, scale: 1.02 }}
                className="absolute bottom-16 right-0 sm:right-4 w-52 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-[#121212]/10 shadow-[0_20px_40px_rgba(0,0,0,0.08)] z-25"
              >
                <div className="text-[9px] font-mono text-[#121212]/60 uppercase font-semibold">
                  STAGED CART
                </div>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-xs font-bold text-[#121212]">2 ITEMS</span>
                  <span className="text-base font-black text-[#121212]">₹56,298</span>
                </div>
              </motion.div>

              {/* CARD 5: Payment Approval Gate Card */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
                whileHover={{ scale: 1.03 }}
                onClick={onOpenApproval}
                className="cursor-pointer absolute -bottom-2 left-6 sm:left-10 w-72 p-4 rounded-2xl bg-gradient-to-br from-white to-[#F5F5F0] border-2 border-[#121212] shadow-[0_25px_50px_rgba(0,0,0,0.18)] z-30"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold text-[#121212] tracking-wider uppercase flex items-center space-x-1">
                    <Lock className="w-3 h-3 text-amber-500" />
                    <span>PAYMENT APPROVAL</span>
                  </span>
                  <span className="text-[11px] font-black text-[#121212]">₹56,298</span>
                </div>
                <p className="text-[10px] text-[#121212]/70 mb-2.5 leading-tight">
                  Human approval required before money moves.
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRunDemo();
                  }}
                  className="w-full py-2 rounded-xl bg-[#121212] hover:bg-black text-[#CCFF00] text-[11px] font-bold tracking-wider uppercase flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>[ APPROVE PAYMENT ]</span>
                </button>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Feature Highlights Ribbon */}
        <div className="mt-20 pt-10 border-t border-[#121212]/10 grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold text-[#121212]/50 uppercase">01 / DISCOVER</span>
            <h4 className="text-sm font-bold text-[#121212]">AI-Readable Catalog</h4>
            <p className="text-xs text-[#121212]/60">Semantic constraints, use cases & structured attributes.</p>
          </div>
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold text-[#121212]/50 uppercase">02 / RECOMMEND</span>
            <h4 className="text-sm font-bold text-[#121212]">Autonomous AI Buyer</h4>
            <p className="text-xs text-[#121212]/60">Evaluates alternatives with 96%+ constraint match.</p>
          </div>
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold text-[#121212]/50 uppercase">03 / GUARDRAIL</span>
            <h4 className="text-sm font-bold text-[#121212]">Zero-Trust Approval</h4>
            <p className="text-xs text-[#121212]/60">Policy Engine gates money movement until you approve.</p>
          </div>
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold text-[#121212]/50 uppercase">04 / SETTLE</span>
            <h4 className="text-sm font-bold text-[#121212]">Razorpay Verified</h4>
            <p className="text-xs text-[#121212]/60">Cryptographic HMAC signature & immutable audit trail.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
