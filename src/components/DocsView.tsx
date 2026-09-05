import React from 'react';
import {
  BookOpen,
  CheckCircle2,
  ShieldAlert,
  CreditCard,
  Sparkles,
  Bot,
  Zap,
  Lock,
  Layers,
  ArrowRight,
  Code,
} from 'lucide-react';

export const DocsView: React.FC = () => {
  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      {/* Track 1 Banner */}
      <div className="rounded-2xl bg-gradient-to-b from-indigo-950/70 via-slate-900 to-slate-950 border border-indigo-800/60 p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold">
          <Zap className="w-3.5 h-3.5" />
          <span>Razorpay AI Buildathon — Track 01: AI Growth & Agentic Commerce</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          BuyFlow AI Architecture & Hackathon Specification
        </h1>
        <p className="text-slate-300 text-sm leading-relaxed">
          BuyFlow AI bridges the gap between natural language user intent and financial settlement. It transforms
          traditional e-commerce stores into autonomous, machine-comprehensible environments where AI agents can discover,
          reason, recommend, and cross-sell products—without ever compromising human financial sovereignty.
        </p>
      </div>

      {/* The 4 Pillars */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white tracking-tight">The 4 Core Architectural Pillars</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
              1
            </div>
            <h3 className="font-bold text-white text-base">AI-Readable Merchant Catalog</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Standard product catalogs lack semantic context. BuyFlow AI enhances merchant SKUs with use-case taxonomy,
              compatibility constraints, and contextual upsell relationship graphs.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm">
              2
            </div>
            <h3 className="font-bold text-white text-base">Autonomous AI Buyer Agent</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Parses open-ended natural queries into hard constraints (budget, RAM, display, use-case), executes isolated
              catalog search tools, evaluates alternatives, and generates explainable justifications.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm">
              3
            </div>
            <h3 className="font-bold text-white text-base">Policy Engine Guardrails</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Acts as a zero-trust financial firewall between LLM generation and money movement. Enforces mandatory
              human-in-the-loop approvals, gates high-value transfers, and permanently forbids autonomous refunds.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
              4
            </div>
            <h3 className="font-bold text-white text-base">Razorpay Test Mode Integration</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Real server-side order generation and cryptographic HMAC SHA256 payment signature verification. Features
              graceful failure handling with zero duplicate execution.
            </p>
          </div>
        </div>
      </div>

      {/* End-to-End Sequence */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h2 className="text-lg font-bold text-white">End-to-End Commerce Flow</h2>
        <div className="p-4 rounded-xl bg-slate-950 font-mono text-xs text-indigo-300 overflow-x-auto border border-slate-800/80 leading-relaxed">
          <pre>{`User Prompt ("Need laptop <₹60K with 16GB RAM + mouse")
    │
    ▼
[AI Buyer: Intent & Constraint Parsing]
    │  • category: 'Laptop', budget: 60000, ram: '16GB', use: 'coding'
    │
    ▼
[Agent Tool Execution]
    ├── search_products(filter)
    ├── compare_products([LP001, LP003, LP002])
    └── suggest_upsell(LP001) ──> ErgoMouse M2
    │
    ▼
[Recommendation & Staging]
    │  • ProBook 14 (₹54,999) + ErgoMouse M2 (₹1,299)
    │  • Subtotal + 18% GST = ₹66,432
    │
    ▼
[Policy Engine Guardrail Intercept]
    │  • Action: 'initiate_payment'
    │  • Rule POL-PAY-01: Autonomous payment BLOCKED
    │  • Rule POL-PAY-02: Amount > ₹50,000 EXPLICIT APPROVAL REQUIRED
    │
    ▼
[User Human Approval]
    │  • User reviews order breakdown and clicks [Approve Payment]
    │
    ▼
[Razorpay Test Gateway]
    │  • Backend calls Razorpay /orders API
    │  • User authorizes via Test Card / UPI
    │  • Backend verifies HMAC SHA256 signature
    │
    ▼
[Order Confirmation & Immutable Audit Trail]
    └── Order stored, inventory updated, telemetry recorded`}</pre>
        </div>
      </div>

      {/* Security & Failure Policies */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white">Security Guarantees & Failure Handling</h2>
        <div className="space-y-3 text-xs text-slate-300">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="font-bold text-amber-300 block">Rule 1: Never Allow Autonomous Payment</span>
            <p>
              Under no circumstances can the AI Buyer execute a payment transaction on its own. All payment flows must
              explicitly pass through the Policy Engine and require authenticated human user approval.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="font-bold text-red-300 block">Rule 2: Zero Blind Retries on Payment Failure</span>
            <p>
              If a payment fails (e.g. card declined or bank timeout), the system halts immediately. It marks the
              transaction as FAILED and never blindly re-executes payment to prevent duplicate debits.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="font-bold text-emerald-300 block">Rule 3: Comprehensive Audit Trail</span>
            <p>
              Every agent search, recommendation, cart creation, guardrail intercept, approval, and Razorpay signature
              is permanently recorded in the immutable telemetry stream.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
