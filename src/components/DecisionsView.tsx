import React from 'react';
import {
  BrainCircuit,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  ShieldAlert,
  Cpu,
} from 'lucide-react';
import { AIDecision } from '../types';

interface DecisionsViewProps {
  decisions: AIDecision[];
  onStartSearch: () => void;
}

export const DecisionsView: React.FC<DecisionsViewProps> = ({ decisions, onStartSearch }) => {
  if (decisions.length === 0) {
    return (
      <div className="py-20 text-center max-w-md mx-auto space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
          <BrainCircuit className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white">No AI Decisions Logged Yet</h2>
        <p className="text-xs text-slate-400">
          Run a query with the AI Buyer to view complete, transparent, and auditable reasoning trees.
        </p>
        <button
          onClick={onStartSearch}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
        >
          Run AI Buyer Query
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      <div className="rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 p-6 sm:p-8 space-y-3">
        <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
          <BrainCircuit className="w-4 h-4" />
          <span>Explainable Autonomous Commerce</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          AI Decision Ledger & Transparency
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
          Zero opaque black-box hallucination. Every catalog recommendation, cross-sell suggestion, and guardrail check
          exposes verifiable constraints, confidence scores, and evaluated alternatives.
        </p>
      </div>

      <div className="space-y-6">
        {decisions.map((d) => (
          <div
            key={d.id}
            className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-5 shadow-lg relative overflow-hidden"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-white text-lg tracking-tight">{d.decision}</span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                    {d.action}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono mt-1">
                  ID: {d.id} • {new Date(d.timestamp).toLocaleString('en-IN')}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-400">Confidence Score:</span>
                <div className="flex items-baseline space-x-1 px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-300 font-extrabold text-sm">
                  <span>{d.confidence}%</span>
                </div>
              </div>
            </div>

            {/* Extracted Constraints */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Extracted Constraints
              </span>
              <div className="flex flex-wrap gap-2 text-xs">
                {Object.entries(d.constraints_detected).map(([key, val]) => (
                  <span
                    key={key}
                    className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300"
                  >
                    <span className="text-slate-500 uppercase text-[10px] font-semibold mr-1">{key}:</span>
                    <strong className="text-indigo-300">{String(val)}</strong>
                  </span>
                ))}
              </div>
            </div>

            {/* Reasons (Bulleted Evidence) */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Verifiable Evidence & Selection Reasons
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {d.reasons.map((reason, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/70 flex items-start space-x-2 text-slate-200"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{reason}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Evaluated Alternatives and Exclusion Reasons */}
            {d.evaluated_alternatives && d.evaluated_alternatives.length > 0 && (
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Evaluated Alternatives & Exclusion Rationale
                </span>
                <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800 space-y-1.5 text-xs text-slate-300">
                  {d.evaluated_alternatives.map((alt, idx) => (
                    <div key={idx} className="flex items-start space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-1.5 shrink-0" />
                      <span>{alt}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
