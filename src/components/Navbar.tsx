import React, { useState } from 'react';
import { Sparkles, ArrowRight, Shield, AlertTriangle, Menu, X, ShoppingBag } from 'lucide-react';
import { Cart } from '../types';

export type NavTab = 'landing' | 'buyer' | 'merchant' | 'cart' | 'orders' | 'audit' | 'analytics';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  cart: Cart | null;
  onRunDemo: () => void;
  isDemoRunning: boolean;
  simulateFailure: boolean;
  onToggleSimulateFailure: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  cart,
  onRunDemo,
  isDemoRunning,
  simulateFailure,
  onToggleSimulateFailure,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const cartItemCount = cart?.items.reduce((sum, i) => sum + i.quantity, 0) || 0;

  const navLinks: { id: NavTab; label: string; badge?: number }[] = [
    { id: 'landing', label: 'PRODUCT' },
    { id: 'buyer', label: 'AI BUYER' },
    { id: 'merchant', label: 'MERCHANT' },
    { id: 'cart', label: 'CART', badge: cartItemCount },
    { id: 'orders', label: 'ORDERS' },
    { id: 'audit', label: 'AUDIT' },
    { id: 'analytics', label: 'ANALYTICS' },
  ];

  const handleTabClick = (tab: NavTab) => {
    onSelectTab(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-3 sm:top-4 inset-x-0 z-50 flex flex-col items-center px-3 sm:px-6 pointer-events-none">
      <nav className="pointer-events-auto flex items-center justify-between gap-2 sm:gap-4 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#121212]/92 backdrop-blur-xl border border-white/10 text-white shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all max-w-6xl w-full">
        {/* Logo */}
        <button
          onClick={() => handleTabClick('landing')}
          className="flex items-center space-x-1.5 text-left group focus:outline-none pl-1 shrink-0"
        >
          <span className="font-editorial text-2xl sm:text-3xl tracking-tight text-white font-normal italic">
            buyflow
          </span>
          <span className="w-2 h-2 rounded-full bg-[#CCFF00] inline-block mb-1 group-hover:scale-125 transition-transform" />
        </button>

        {/* Center Navigation Links - Desktop & Tablets */}
        <div className="hidden lg:flex items-center space-x-1">
          {navLinks.map((link) => {
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleTabClick(link.id)}
                className={`relative px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-wider transition-all uppercase whitespace-nowrap flex items-center gap-1.5 ${
                  isActive
                    ? 'text-[#121212] bg-[#CCFF00] font-bold shadow-sm'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{link.label}</span>
                {link.badge !== undefined && link.badge > 0 && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold leading-none ${
                      isActive ? 'bg-[#121212] text-[#CCFF00]' : 'bg-[#CCFF00] text-[#121212]'
                    }`}
                  >
                    {link.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-1.5 sm:space-x-2.5 shrink-0">
          {/* Quick Cart button for small screens */}
          <button
            onClick={() => handleTabClick('cart')}
            className={`lg:hidden flex items-center space-x-1 px-2.5 py-1.5 rounded-full text-[10px] font-bold uppercase transition-all ${
              currentTab === 'cart'
                ? 'bg-[#CCFF00] text-[#121212]'
                : 'bg-white/10 text-white hover:bg-white/15'
            }`}
          >
            <ShoppingBag className="w-3 h-3" />
            <span>{cartItemCount > 0 ? cartItemCount : 'Cart'}</span>
          </button>

          {/* Failure sim toggle */}
          <button
            onClick={() => onToggleSimulateFailure(!simulateFailure)}
            title="Toggle Payment Failure Simulation"
            className={`hidden md:flex items-center space-x-1 px-2.5 py-1.5 rounded-full text-[10px] font-semibold border transition-all ${
              simulateFailure
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                : 'bg-white/5 text-white/50 border-white/10 hover:text-white/80'
            }`}
          >
            <AlertTriangle className="w-3 h-3" />
            <span className="whitespace-nowrap">{simulateFailure ? 'Fail Sim ON' : 'Fail Sim OFF'}</span>
          </button>

          {/* Test Mode pill */}
          <div className="hidden xl:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-white/70 font-mono tracking-tight whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF00] animate-pulse" />
            <span>TEST MODE</span>
          </div>

          {/* Launch Demo CTA */}
          <button
            onClick={onRunDemo}
            disabled={isDemoRunning}
            className="flex items-center space-x-1 sm:space-x-1.5 px-3 sm:px-3.5 py-1.5 rounded-full bg-[#CCFF00] hover:bg-[#d8ff33] text-[#121212] text-xs font-bold tracking-tight shadow-md hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 whitespace-nowrap"
          >
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#121212]" />
            <span className="hidden sm:inline">
              {isDemoRunning ? 'Simulating...' : 'LAUNCH DEMO'}
            </span>
            <span className="sm:hidden">{isDemoRunning ? '...' : 'DEMO'}</span>
            <ArrowRight className="w-3 h-3 text-[#121212]" />
          </button>

          {/* Mobile menu toggle button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile / Tablet Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="pointer-events-auto lg:hidden mt-2 p-3 rounded-2xl bg-[#121212]/95 backdrop-blur-xl border border-white/15 text-white shadow-2xl w-full max-w-md animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-2 gap-1.5">
            {navLinks.map((link) => {
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleTabClick(link.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-between transition-all ${
                    isActive
                      ? 'bg-[#CCFF00] text-[#121212] font-bold shadow-sm'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge !== undefined && link.badge > 0 && (
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive ? 'bg-[#121212] text-[#CCFF00]' : 'bg-[#CCFF00] text-[#121212]'
                      }`}
                    >
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between">
            <button
              onClick={() => onToggleSimulateFailure(!simulateFailure)}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-semibold border ${
                simulateFailure
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-white/5 text-white/60 border-white/10'
              }`}
            >
              <AlertTriangle className="w-3 h-3" />
              <span>{simulateFailure ? 'Fail Sim ON' : 'Fail Sim OFF'}</span>
            </button>
            <div className="flex items-center space-x-1 text-[10px] font-mono text-white/50">
              <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF00]" />
              <span>RAZORPAY TEST</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
