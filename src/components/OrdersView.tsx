import React from 'react';
import {
  Receipt,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Package,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { Order } from '../types';

interface OrdersViewProps {
  orders: Order[];
  onViewAuditTrail: () => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({ orders, onViewAuditTrail }) => {
  if (orders.length === 0) {
    return (
      <div className="pt-36 sm:pt-44 pb-36 max-w-md mx-auto px-4 text-center space-y-6">
        <span className="text-[11px] font-mono uppercase tracking-widest text-[#121212]/50 font-bold block">
          SETTLEMENT LEDGER
        </span>
        <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#121212] uppercase">
          NO ORDERS{' '}
          <span className="font-editorial lowercase italic font-normal tracking-normal text-[#121212]/70">
            yet.
          </span>
        </h2>
        <p className="text-sm text-[#121212]/60 leading-relaxed">
          Complete an AI Buyer shopping journey and Razorpay payment authorization to view verified orders.
        </p>
      </div>
    );
  }

  return (
    <div className="pt-32 sm:pt-36 lg:pt-40 pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="border-b border-[#121212]/10 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#121212]/50 font-bold block mb-1">
            CONFIRMED RECEIPTS
          </span>
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-[#121212] uppercase leading-[0.95]">
            ORDERS{' '}
            <span className="font-editorial lowercase italic font-normal tracking-normal text-[#121212]/80">
              ledger.
            </span>
          </h1>
        </div>

        <button
          onClick={onViewAuditTrail}
          className="px-5 py-2.5 rounded-full bg-white border border-[#121212]/15 text-xs font-mono font-bold hover:bg-[#F3F3EE] transition-colors shadow-sm self-start"
        >
          INSPECT AUDIT TRAIL →
        </button>
      </div>

      <div className="space-y-6">
        {orders.map((order, idx) => {
          const isPaid = order.status === 'PAID' || order.status === 'CONFIRMED';
          const orderNum = String(idx + 1).padStart(2, '0');

          return (
            <div
              key={order.id}
              className={`rounded-3xl border p-6 sm:p-8 space-y-5 transition-all ${
                isPaid
                  ? 'bg-white border-[#121212]/15 shadow-[0_15px_35px_rgba(0,0,0,0.04)]'
                  : 'bg-red-50/60 border-red-200 shadow-sm'
              }`}
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-[#121212]/10 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-editorial text-2xl text-[#121212]/40 italic">
                      #{orderNum}
                    </span>
                    <span className="font-mono text-base font-bold text-[#121212]">
                      {order.id}
                    </span>
                    <span
                      className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase ${
                        isPaid
                          ? 'bg-[#121212] text-[#CCFF00]'
                          : 'bg-red-200 text-red-900'
                      }`}
                    >
                      {order.status}
                    </span>
                    {order.verified && (
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        VERIFIED
                      </span>
                    )}
                  </div>

                  <div className="text-xs font-mono text-[#121212]/50 flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span>{new Date(order.created_at).toLocaleString('en-IN')}</span>
                    {(order.payment_id || order.razorpay_payment_id) && (
                      <span>• Payment ID: {order.payment_id || order.razorpay_payment_id}</span>
                    )}
                    {(order.order_id || order.razorpay_order_id) && (
                      <span>• Order ID: {order.order_id || order.razorpay_order_id}</span>
                    )}
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-2xl sm:text-3xl font-black text-[#121212]">
                    ₹{order.total.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] font-mono text-[#121212]/40 block">
                    {order.payment_mode}
                  </span>
                </div>
              </div>

              {/* Items Breakdown */}
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {order.items.map((item, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#121212]/5 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center space-x-2.5">
                        <Package className="w-4 h-4 text-[#121212]/60 shrink-0" />
                        <div>
                          <div className="font-bold text-[#121212]">{item.product.name}</div>
                          <div className="text-[10px] text-[#121212]/50 font-mono">
                            Qty: {item.quantity} • {item.product.category}
                          </div>
                        </div>
                      </div>
                      <span className="font-bold text-[#121212]">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Note */}
              {order.failure_reason ? (
                <div className="p-4 rounded-2xl bg-red-100/70 border border-red-300 text-xs text-red-900 space-y-1">
                  <div className="font-bold">Failure Diagnostics & Policy Halt:</div>
                  <p>{order.failure_reason}</p>
                  <div className="text-[10px] font-mono text-red-700 pt-1">
                    Auto-retry policy: Disabled. Transaction logged: {order.audit_transaction_id}
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="font-medium">Payment verified via Razorpay HMAC signature.</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-800">
                    Txn: {order.audit_transaction_id}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
