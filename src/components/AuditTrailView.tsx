import React, { useState } from 'react';
import {
  ShieldCheck,
  Clock,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertTriangle,
  Lock,
  CreditCard,
  Bot,
  User,
  Package,
  Layers,
} from 'lucide-react';
import { AgentEvent } from '../types';

interface AuditTrailViewProps {
  events: AgentEvent[];
  onRefresh: () => void;
}

export const AuditTrailView: React.FC<AuditTrailViewProps> = ({ events, onRefresh }) => {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [filterAgent, setFilterAgent] = useState<string>('ALL');

  const filteredEvents = events.filter((e) => {
    if (filterAgent === 'ALL') return true;
    return e.agent.toLowerCase().includes(filterAgent.toLowerCase());
  });

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'USER_REQUEST':
        return <User className="w-4 h-4 text-[#121212]" />;
      case 'CATALOG_SEARCH':
        return <Package className="w-4 h-4 text-[#121212]" />;
      case 'RECOMMENDATION':
        return <Bot className="w-4 h-4 text-violet-700" />;
      case 'UPSELL':
        return <Layers className="w-4 h-4 text-amber-600" />;
      case 'CART_CREATED':
        return <Package className="w-4 h-4 text-blue-600" />;
      case 'PAYMENT_APPROVAL_REQUESTED':
      case 'PAYMENT_APPROVED':
        return <Lock className="w-4 h-4 text-amber-600" />;
      case 'PAYMENT_SUCCESS':
      case 'PAYMENT_FAILED':
        return <CreditCard className="w-4 h-4 text-[#121212]" />;
      default:
        return <ShieldCheck className="w-4 h-4 text-[#121212]" />;
    }
  };

  return (
    <div className="pt-32 sm:pt-36 lg:pt-40 pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="border-b border-[#121212]/10 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#121212]/50 font-bold block mb-1">
            IMMUTABLE TELEMETRY
          </span>
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-[#121212] uppercase leading-[0.95]">
            AUDIT{' '}
            <span className="font-editorial lowercase italic font-normal tracking-normal text-[#121212]/80">
              trail.
            </span>
          </h1>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-xs font-mono text-[#121212]/50 hidden sm:inline">
            {events.length} LOGGED TRANSACTIONS
          </span>
          <button
            onClick={onRefresh}
            className="px-4 py-2 rounded-full bg-white border border-[#121212]/15 text-xs font-mono font-bold hover:bg-[#F3F3EE] transition-colors shadow-sm cursor-pointer"
          >
            REFRESH STREAM
          </button>
        </div>
      </div>

      {/* Visual Transaction Timeline / Lifecycle Ribbon */}
      <div className="rounded-3xl bg-[#FAF8F5] border border-[#121212]/15 p-5 sm:p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#CCFF00] border border-[#121212]/20" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#121212]/60">
              TRANSACTION LIFECYCLE TIMELINE
            </span>
          </div>
          <span className="text-[10px] font-mono font-bold text-[#121212]/50">
            END-TO-END AUTONOMOUS COMMERCE SEQUENCE
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-xs font-mono">
          <div className="p-3 rounded-2xl bg-white border border-[#121212]/10 space-y-1">
            <span className="text-[9px] text-[#121212]/40 font-bold block">01. INTENT</span>
            <div className="font-bold text-[#121212] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span>User Intent</span>
            </div>
            <span className="text-[10px] text-[#121212]/60 block leading-tight">Prompt constraints parsed</span>
          </div>

          <div className="p-3 rounded-2xl bg-white border border-[#121212]/10 space-y-1">
            <span className="text-[9px] text-[#121212]/40 font-bold block">02. DISCOVERY</span>
            <div className="font-bold text-[#121212] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span>Catalog Search</span>
            </div>
            <span className="text-[10px] text-[#121212]/60 block leading-tight">MCP tools query SKUs</span>
          </div>

          <div className="p-3 rounded-2xl bg-white border border-[#121212]/10 space-y-1">
            <span className="text-[9px] text-[#121212]/40 font-bold block">03. RANKING</span>
            <div className="font-bold text-[#121212] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              <span>Recommendation</span>
            </div>
            <span className="text-[10px] text-[#121212]/60 block leading-tight">Best spec match chosen</span>
          </div>

          <div className="p-3 rounded-2xl bg-white border border-[#121212]/10 space-y-1">
            <span className="text-[9px] text-[#121212]/40 font-bold block">04. EXPANSION</span>
            <div className="font-bold text-[#121212] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Upsell Pairing</span>
            </div>
            <span className="text-[10px] text-[#121212]/60 block leading-tight">Cross-sell compatible accessory</span>
          </div>

          <div className="p-3 rounded-2xl bg-white border border-[#121212]/10 space-y-1">
            <span className="text-[9px] text-[#121212]/40 font-bold block">05. STAGING</span>
            <div className="font-bold text-[#121212] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              <span>Cart Created</span>
            </div>
            <span className="text-[10px] text-[#121212]/60 block leading-tight">Contextual notes attached</span>
          </div>

          <div className="p-3 rounded-2xl bg-white border border-[#121212]/10 space-y-1">
            <span className="text-[9px] text-[#121212]/40 font-bold block">06. GUARDRAIL</span>
            <div className="font-bold text-[#121212] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
              <span>Policy Gate</span>
            </div>
            <span className="text-[10px] text-[#121212]/60 block leading-tight">Mandatory human approval</span>
          </div>

          <div className="p-3 rounded-2xl bg-[#121212] text-white border border-[#121212] space-y-1">
            <span className="text-[9px] text-[#CCFF00] font-bold block">07. SETTLEMENT</span>
            <div className="font-bold text-white flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF00]" />
              <span>Razorpay Order</span>
            </div>
            <span className="text-[10px] text-white/60 block leading-tight">HMAC signature verified</span>
          </div>
        </div>
      </div>

      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols): Filters + Timeline Stream */}
        <div className="lg:col-span-8 space-y-6">
          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 text-xs font-mono">
            {['ALL', 'AI Buyer', 'Policy Engine', 'Razorpay', 'User'].map((f) => (
              <button
                key={f}
                onClick={() => setFilterAgent(f)}
                className={`px-3.5 py-1.5 rounded-full transition-all uppercase tracking-wider ${filterAgent === f
                  ? 'bg-[#121212] text-[#CCFF00] font-bold shadow-sm'
                  : 'bg-white text-[#121212]/60 hover:text-[#121212] border border-[#121212]/10'
                  }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Vertical Distinctive Timeline */}
          <div className="relative pl-6 sm:pl-10 space-y-6 before:content-[''] before:absolute before:left-3 sm:before:left-5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#121212]/15">
            {filteredEvents.map((evt) => {
              const isSelected = selectedEventId === evt.id;
              const isFailed = evt.status === 'FAILED';
              const isSuccess = evt.status === 'SUCCESS';

              return (
                <div key={evt.id} className="relative group">
                  {/* Timeline Node Icon Circle */}
                  <div
                    className={`absolute -left-6 sm:-left-10 top-2 w-6 h-6 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center transition-all ${isFailed
                      ? 'bg-red-50 border-red-500 text-red-600'
                      : isSuccess
                        ? 'bg-[#CCFF00] border-[#121212] text-[#121212]'
                        : 'bg-white border-[#121212]/30 text-[#121212]'
                      }`}
                  >
                    {getEventIcon(evt.event_type)}
                  </div>

                  {/* Event Card */}
                  <div
                    onClick={() => setSelectedEventId(isSelected ? null : evt.id)}
                    className={`cursor-pointer p-5 sm:p-6 rounded-3xl border transition-all ${isSelected
                      ? 'bg-[#121212] text-white border-[#121212] shadow-xl'
                      : 'bg-white text-[#121212] border-[#121212]/10 hover:border-[#121212]/30 shadow-sm'
                      }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold uppercase tracking-wider">
                          {evt.event_type}
                        </span>
                        <span
                          className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase ${isFailed
                            ? 'bg-red-100 text-red-700'
                            : isSuccess
                              ? isSelected
                                ? 'bg-[#CCFF00] text-[#121212]'
                                : 'bg-[#121212] text-[#CCFF00]'
                              : 'bg-[#121212]/10 text-[#121212]'
                            }`}
                        >
                          {evt.status}
                        </span>
                      </div>

                      <span
                        className={`text-[11px] font-mono flex items-center space-x-1 ${isSelected ? 'text-white/50' : 'text-[#121212]/40'
                          }`}
                      >
                        <Clock className="w-3 h-3" />
                        <span>{isNaN(new Date(evt.timestamp).getTime()) ? evt.timestamp : new Date(evt.timestamp).toLocaleTimeString('en-IN')}</span>
                      </span>
                    </div>

                    <p
                      className={`text-sm mt-2 font-medium leading-relaxed ${isSelected ? 'text-white/90' : 'text-[#121212]/80'
                        }`}
                    >
                      {evt.description}
                    </p>

                    <div
                      className={`mt-3 pt-3 border-t flex items-center justify-between text-xs font-mono ${isSelected ? 'border-white/10 text-white/50' : 'border-[#121212]/5 text-[#121212]/50'
                        }`}
                    >
                      <span>ACTOR: {evt.agent}</span>
                      <span className="flex items-center space-x-1">
                        <span>{isSelected ? 'Collapse' : 'Inspect event'}</span>
                        {isSelected ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </span>
                    </div>

                    {/* Expanded Drawer */}
                    {isSelected && (
                      <div className="mt-4 pt-4 border-t border-white/10 space-y-2 font-mono text-xs text-white/80">
                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                          <div>
                            <span className="text-white/40 block">TRANSACTION ID:</span>
                            <span>{evt.transaction_id || evt.id}</span>
                          </div>
                          <div>
                            <span className="text-white/40 block">TIMESTAMP:</span>
                            <span>{isNaN(new Date(evt.timestamp).getTime()) ? evt.timestamp : new Date(evt.timestamp).toISOString()}</span>
                          </div>
                        </div>

                        {evt.metadata && (
                          <div className="pt-2">
                            <span className="text-white/40 block mb-1">METADATA PAYLOAD:</span>
                            <pre className="p-3 rounded-xl bg-black/50 text-[#CCFF00] overflow-x-auto text-[10px]">
                              {JSON.stringify(evt.metadata, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (4 cols): Security & Guardrails Telemetry Summary */}
        <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
          <div className="p-7 rounded-3xl bg-[#121212] text-white shadow-[0_20px_50px_rgba(0,0,0,0.2)] space-y-5">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#CCFF00] font-bold block mb-1">
                GOVERNANCE ENGINE
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-white uppercase">
                GUARDRAILS LEDGER
              </h2>
            </div>

            <div className="space-y-3 font-mono text-xs border-y border-white/10 py-4">
              <div className="flex items-center justify-between">
                <span className="text-white/60">Policy Engine</span>
                <span className="text-[#CCFF00] font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF00] animate-pulse" />
                  ENFORCING
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60">Auto Approval Cap</span>
                <span className="text-white font-semibold">₹50,000 INR</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60">Human 2FA Gate</span>
                <span className="text-white font-semibold">MANDATORY</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60">Payment Gateway</span>
                <span className="text-[#CCFF00] font-semibold">RAZORPAY TEST</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-white/70 space-y-2">
              <div className="flex items-center gap-1.5 text-white font-semibold font-mono text-[11px]">
                <Lock className="w-3.5 h-3.5 text-[#CCFF00]" />
                <span>Zero-Trust AI Principle</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                The AI Buyer can autonomously browse, discover, compare, and stage carts. Under no circumstances can it initiate bank fund debit without direct biometric or button approval.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
