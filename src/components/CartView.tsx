import React from 'react';
import { ArrowRight, Trash2, Plus, Minus, Lock, Sparkles } from 'lucide-react';
import { Cart } from '../types';

interface CartViewProps {
  cart: Cart | null;
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: () => void;
  onStartShopping: () => void;
}

export const CartView: React.FC<CartViewProps> = ({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  onStartShopping,
}) => {
  if (!cart || cart.items.length === 0) {
    return (
      <div className="pt-36 sm:pt-44 pb-36 max-w-xl mx-auto px-4 text-center space-y-6">
        <span className="text-[11px] font-mono uppercase tracking-widest text-[#121212]/50 font-bold block">
          STAGED CHECKOUT
        </span>
        <h2 className="text-4xl sm:text-6xl font-bold tracking-tight text-[#121212] uppercase">
          YOUR CART IS{' '}
          <span className="font-editorial lowercase italic font-normal tracking-normal text-[#121212]/70">
            empty.
          </span>
        </h2>
        <p className="text-sm sm:text-base text-[#121212]/60 max-w-md mx-auto leading-relaxed">
          Start a request with the AI Buyer or explore merchant items to stage an order.
        </p>
        <div className="pt-2">
          <button
            onClick={onStartShopping}
            className="px-7 py-3.5 rounded-full bg-[#121212] hover:bg-[#262626] text-white text-xs font-bold uppercase tracking-wider flex items-center space-x-2.5 mx-auto shadow-xl hover:scale-105 transition-all"
          >
            <span>START WITH AI BUYER</span>
            <ArrowRight className="w-4 h-4 text-[#CCFF00]" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 sm:pt-36 lg:pt-40 pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="border-b border-[#121212]/10 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#121212]/50 font-bold block mb-1">
            STAGED CHECKOUT
          </span>
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-[#121212] uppercase leading-[0.95]">
            YOUR{' '}
            <span className="font-editorial lowercase italic font-normal tracking-normal text-[#121212]/80">
              cart.
            </span>
          </h1>
        </div>
        <div className="text-sm font-mono text-[#121212]/60">
          {cart.items.length} {cart.items.length === 1 ? 'ITEM' : 'ITEMS'} ASSEMBLED
        </div>
      </div>

      {/* 2-Column Responsive Layout aligned with max-w-7xl */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Numbered Staged Items */}
        <div className="lg:col-span-8 space-y-5">
          {cart.items.map((item, idx) => {
            const numStr = String(idx + 1).padStart(2, '0');
            const isAIStaged = item.added_by === 'ai_buyer';

            return (
              <div
                key={item.product.id}
                className="p-6 sm:p-7 rounded-3xl bg-white border border-[#121212]/10 shadow-[0_15px_35px_rgba(0,0,0,0.04)] flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-all hover:border-[#121212]/30"
              >
                <div className="flex items-start sm:items-center space-x-5">
                  <span className="font-editorial text-3xl sm:text-4xl text-[#121212]/30 italic shrink-0">
                    {numStr}
                  </span>

                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-2xl border border-[#121212]/10 bg-[#FAF8F5] shrink-0"
                  />

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg sm:text-xl font-bold text-[#121212] tracking-tight">
                        {item.product.name}
                      </h3>
                      {isAIStaged && (
                        <span className="px-2 py-0.5 rounded-full bg-[#121212] text-[#CCFF00] text-[9px] font-mono uppercase font-bold tracking-wide">
                          AI STAGED
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#121212]/60 max-w-md line-clamp-2">
                      {item.contextual_note || item.product.description}
                    </p>
                    <span className="text-base sm:text-lg font-black text-[#121212] block">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Quantity Controls & Delete */}
                <div className="flex items-center space-x-3 self-end sm:self-center shrink-0">
                  <div className="flex items-center space-x-2 bg-[#FAF8F5] border border-[#121212]/10 px-3 py-1.5 rounded-full text-xs">
                    <button
                      onClick={() => onUpdateQuantity(item.product.id, -1)}
                      className="text-[#121212]/60 hover:text-[#121212] p-0.5 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-bold text-[#121212] px-2 font-mono">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.product.id, 1)}
                      className="text-[#121212]/60 hover:text-[#121212] p-0.5 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => onRemoveItem(item.product.id)}
                    className="p-2 rounded-full text-[#121212]/40 hover:text-red-500 hover:bg-red-50 transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Order Summary Card */}
        <div className="lg:col-span-4 lg:sticky lg:top-28">
          <div className="p-7 sm:p-8 rounded-3xl bg-[#121212] text-white shadow-[0_25px_60px_rgba(0,0,0,0.25)] space-y-6">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#CCFF00] font-bold block mb-1">
                FINANCIAL BREAKDOWN
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white uppercase">
                ORDER SUMMARY
              </h2>
            </div>

            <div className="space-y-3 font-mono text-xs border-y border-white/10 py-5">
              <div className="flex justify-between text-white/70">
                <span>Subtotal</span>
                <span className="text-white font-semibold">₹{cart.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-white/70">
                <span>GST (18%)</span>
                <span className="text-white font-semibold">₹{cart.tax.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-white/70">
                <span>Autonomous Delivery</span>
                <span className="text-[#CCFF00] font-semibold">FREE</span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-white/10 text-sm">
                <span className="text-white font-bold uppercase tracking-wider">Total</span>
                <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  ₹{cart.total.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Guardrail Policy Disclaimer */}
            <div className="flex items-start space-x-2 text-xs text-white/70 bg-white/5 p-3.5 rounded-2xl border border-white/10">
              <Lock className="w-4 h-4 text-[#CCFF00] shrink-0 mt-0.5" />
              <span className="leading-relaxed">
                Requires explicit human authorization. AI Buyer is gated by Policy Engine before fund transfer.
              </span>
            </div>

            {/* Large Rounded Action Button */}
            <button
              onClick={onProceedToCheckout}
              className="w-full py-4 sm:py-5 rounded-full bg-[#CCFF00] hover:bg-[#d8ff33] text-[#121212] text-xs sm:text-sm font-black tracking-wider uppercase flex items-center justify-center space-x-2.5 transition-all hover:scale-[1.01] active:scale-95 shadow-xl"
            >
              <span>CONTINUE TO PAYMENT</span>
              <ArrowRight className="w-4 h-4 text-[#121212]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
