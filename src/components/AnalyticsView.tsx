import React from 'react';
import { ArrowUpRight, Sparkles, TrendingUp, ShieldCheck, Zap } from 'lucide-react';
import { AnalyticsSummary } from '../types';

interface AnalyticsViewProps {
  analytics: AnalyticsSummary | null;
  onRefresh: () => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ analytics, onRefresh }) => {
  return (
    <div className="pt-32 sm:pt-36 lg:pt-40 pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Editorial Header */}
      <div className="border-b border-[#121212]/10 pb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#CCFF00] inline-block" />
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#121212]/60 font-bold">
              GROWTH & AGENTIC COMMERCE ENGINE • TRACK 01
            </span>
          </div>
          <h1 className="text-6xl sm:text-8xl font-black tracking-tight text-[#121212] uppercase leading-[0.9]">
            AI IS{' '}
            <span className="font-editorial lowercase italic font-normal tracking-normal text-[#121212]/80">
              selling.
            </span>
          </h1>
        </div>

        <div className="flex items-center space-x-3 self-start sm:self-end">
          <span className="text-[11px] font-mono uppercase text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full font-semibold">
            DEMO / TEST BENCHMARK DATA
          </span>
          <button
            onClick={onRefresh}
            className="px-4 py-2 rounded-full bg-white border border-[#121212]/15 text-xs font-mono font-bold hover:bg-[#F3F3EE] transition-colors"
          >
            REFRESH
          </button>
        </div>
      </div>

      {/* Oversized Typography Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="p-8 rounded-3xl bg-white border border-[#121212]/10 shadow-[0_20px_45px_rgba(0,0,0,0.04)] space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#121212]/50 font-bold block">
            CONVERSION LIFT
          </span>
          <div className="text-5xl sm:text-6xl font-black text-[#121212] tracking-tight">
            +24.8%
          </div>
          <span className="text-xs font-bold text-[#121212] uppercase tracking-wider block">
            AI CONVERSION
          </span>
          <p className="text-xs text-[#121212]/60 pt-2 border-t border-[#121212]/5">
            Natural language intent reduces catalog search drop-off by 3.2x.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-[#121212] text-white shadow-[0_25px_50px_rgba(0,0,0,0.2)] space-y-2 border border-white/10">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#CCFF00] font-bold block">
            PROCESSED VOLUME
          </span>
          <div className="text-5xl sm:text-6xl font-black text-[#CCFF00] tracking-tight">
            ₹4.2L
          </div>
          <span className="text-xs font-bold text-white uppercase tracking-wider block">
            AI-ASSISTED GMV
          </span>
          <p className="text-xs text-white/60 pt-2 border-t border-white/10">
            Across laptops, creator setups, and ergonomic peripherals.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white border border-[#121212]/10 shadow-[0_20px_45px_rgba(0,0,0,0.04)] space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#121212]/50 font-bold block">
            BASKET EXPANSION
          </span>
          <div className="text-5xl sm:text-6xl font-black text-[#121212] tracking-tight">
            18.6%
          </div>
          <span className="text-xs font-bold text-[#121212] uppercase tracking-wider block">
            UPSELL RATE
          </span>
          <p className="text-xs text-[#121212]/60 pt-2 border-t border-[#121212]/5">
            Contextual accessory pairing at point of recommendation.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-[#FAF8F5] border border-[#121212]/10 shadow-[0_20px_45px_rgba(0,0,0,0.04)] space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#121212]/50 font-bold block">
            FINTECH RELIABILITY
          </span>
          <div className="text-5xl sm:text-6xl font-black text-[#121212] tracking-tight">
            97.3%
          </div>
          <span className="text-xs font-bold text-[#121212] uppercase tracking-wider block">
            PAYMENT SUCCESS
          </span>
          <p className="text-xs text-[#121212]/60 pt-2 border-t border-[#121212]/5">
            Razorpay Test verification with zero unapproved deductions.
          </p>
        </div>
      </div>

      {/* Large Revenue & Conversion Visualizer */}
      <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[#121212]/10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#121212]/50 font-bold block mb-1">
              AGENTIC FUNNEL ARCHITECTURE
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-[#121212] uppercase">
              Intent to Settlement Pipeline
            </h3>
          </div>
          <span className="text-xs font-mono text-[#121212]/60">
            Real-time stage conversions
          </span>
        </div>

        {/* Funnel Visual Horizontal Bars */}
        <div className="space-y-5">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="font-bold text-[#121212]">01 • NATURAL LANGUAGE QUERIES</span>
              <span className="text-[#121212]/70">1,248 Sessions (100%)</span>
            </div>
            <div className="h-4 rounded-full bg-[#121212]/5 overflow-hidden">
              <div className="h-full bg-[#121212] w-full rounded-full" />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="font-bold text-[#121212]">02 • AI RECOMMENDATION ACCEPTED</span>
              <span className="text-[#121212]/70">892 Orders Staged (71.4%)</span>
            </div>
            <div className="h-4 rounded-full bg-[#121212]/5 overflow-hidden">
              <div className="h-full bg-[#121212] w-[71.4%] rounded-full" />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="font-bold text-[#121212]">03 • CONTEXTUAL UPSELL ATTACHED</span>
              <span className="text-[#121212]/70">232 Accessory Pairs (18.6%)</span>
            </div>
            <div className="h-4 rounded-full bg-[#121212]/5 overflow-hidden">
              <div className="h-full bg-[#CCFF00] border border-[#121212]/20 w-[18.6%] rounded-full" />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="font-bold text-[#121212]">04 • HUMAN APPROVAL GRANTED</span>
              <span className="text-[#121212]/70">842 Approvals (67.4%)</span>
            </div>
            <div className="h-4 rounded-full bg-[#121212]/5 overflow-hidden">
              <div className="h-full bg-[#121212] w-[67.4%] rounded-full" />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="font-bold text-[#121212]">05 • RAZORPAY PAYMENT VERIFIED</span>
              <span className="text-[#121212]/70">819 Settled Transactions (65.6%)</span>
            </div>
            <div className="h-4 rounded-full bg-[#121212]/5 overflow-hidden">
              <div className="h-full bg-[#CCFF00] border border-[#121212] w-[65.6%] rounded-full" />
            </div>
          </div>
        </div>

        {/* Footnote */}
        <div className="pt-6 border-t border-[#121212]/10 flex flex-col sm:flex-row justify-between gap-2 text-xs font-mono text-[#121212]/50">
          <span>MEASUREMENT PROTOCOL: ZERO UNAPPROVED DEDUCTIONS</span>
          <span>RAZORPAY TEST API v1</span>
        </div>
      </div>
    </div>
  );
};
