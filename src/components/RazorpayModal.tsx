import React, { useState } from 'react';
import {
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Lock,
  X,
  Loader2,
  ShieldCheck,
  Building2,
  Smartphone,
  ArrowRight,
  Eye,
  EyeOff,
  KeyRound,
  ExternalLink,
} from 'lucide-react';
import { Cart, Order } from '../types';

interface RazorpayModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: Cart;
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
  simulateFailure: boolean;
  onPaymentSuccess: (order: Order, message: string) => void;
  onPaymentFailure: (message: string) => void;
  onOpenRazorpayPopup?: () => void;
}

export const RazorpayModal: React.FC<RazorpayModalProps> = ({
  isOpen,
  onClose,
  cart,
  orderId,
  amount,
  currency,
  keyId,
  simulateFailure,
  onPaymentSuccess,
  onPaymentFailure,
  onOpenRazorpayPopup,
}) => {
  if (!isOpen) return null;

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking'>('card');
  const [processing, setProcessing] = useState(false);

  // Credential masking states: Hidden by default while typing
  const [testCardNumber, setTestCardNumber] = useState('4111 1111 1111 1111');
  const [showCardNumber, setShowCardNumber] = useState(false);

  const [testExpiry, setTestExpiry] = useState('12/28');

  const [testCvv, setTestCvv] = useState('123');
  const [showCvv, setShowCvv] = useState(false);

  // Bank OTP state - masked by default
  const [testOtp, setTestOtp] = useState('749201');
  const [showOtp, setShowOtp] = useState(false);

  // UPI credentials
  const [testUpiId, setTestUpiId] = useState('success@razorpay');
  const [testUpiPin, setTestUpiPin] = useState('8391');
  const [showUpiPin, setShowUpiPin] = useState(false);

  // Netbanking credentials
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [netbankingUserId, setNetbankingUserId] = useState('HDFC_USER_9941');
  const [showNetbankingUserId, setShowNetbankingUserId] = useState(false);
  const [netbankingPassword, setNetbankingPassword] = useState('BankSecure#2026');
  const [showNetbankingPassword, setShowNetbankingPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [failureCode, setFailureCode] = useState<string>('PAYMENT_FAILED');

  const handleSimulatePayment = async (forceFailure = false) => {
    setProcessing(true);
    setErrorMessage(null);

    const isFailing = forceFailure;
    const fakePaymentId = `pay_test_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
    const fakeSignature = `sig_test_${Date.now().toString(36)}`;

    try {
      console.log('[RAZORPAY] Payment handler called');
      console.log('[RAZORPAY] Payment ID received');
      console.log(`[RAZORPAY] Payment ID: ${fakePaymentId}`);
      console.log('[RAZORPAY] Signature verification started');

      // Call server verification with in_app_checkout
      const res = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: cart.id,
          razorpay_order_id: orderId,
          razorpay_payment_id: fakePaymentId,
          razorpay_signature: fakeSignature,
          in_app_checkout: true,
          simulate_failure: isFailing,
          failure_scenario: isFailing ? 'card_declined' : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        const errCode = data.order?.failure_code || (isFailing ? 'SIMULATED_FAILURE' : 'PAYMENT_FAILED');
        setFailureCode(errCode);
        setErrorMessage(
          data.message ||
            'Payment failed. No money movement was confirmed. The transaction has been marked FAILED and no automatic retry was attempted.'
        );
        onPaymentFailure(
          data.message ||
            'Payment failed. No money movement was confirmed. The transaction has been marked FAILED and no automatic retry was attempted.'
        );
      } else {
        console.log('[RAZORPAY] Signature verification successful');
        console.log('[RAZORPAY] Payment marked successful');
        onPaymentSuccess(data.order, data.message);
        onClose();
      }
    } catch (err: any) {
      const msg = 'Payment could not be completed due to gateway error. Transaction marked FAILED.';
      setFailureCode('GATEWAY_ERROR');
      setErrorMessage(msg);
      onPaymentFailure(msg);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#121212]/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-white border border-[#121212]/15 shadow-2xl overflow-hidden text-[#121212]">
        {/* Header Banner */}
        <div className="bg-[#121212] px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-[#CCFF00] text-[#121212] flex items-center justify-center font-black text-xs">
              RZP
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm text-white">Razorpay Standard Checkout</span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-[#CCFF00] text-[#121212] uppercase tracking-wide">
                  TEST MODE
                </span>
              </div>
              <p className="text-[11px] text-white/60 font-mono">Order: {orderId}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount bar */}
        <div className="px-6 py-3.5 bg-[#FAF8F5] border-b border-[#121212]/10 flex items-center justify-between">
          <span className="text-xs font-mono uppercase text-[#121212]/60 font-bold">Approved Total:</span>
          <span className="text-xl font-black text-[#121212]">
            ₹{amount.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Error message banner & Failure Recovery Simulator View */}
        {errorMessage ? (
          <div className="p-6 space-y-5 bg-red-50/50">
            <div className="p-5 rounded-2xl bg-white border border-red-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-red-100 pb-3">
                <div className="flex items-center space-x-2 text-red-600 font-bold text-sm">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <span className="uppercase tracking-wide">❌ PAYMENT FAILED</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-100 text-red-800 uppercase">
                  CODE: {failureCode}
                </span>
              </div>

              {/* AI Diagnosis Block */}
              <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/80 space-y-1">
                <span className="text-[10px] font-mono uppercase font-bold text-amber-800 tracking-wider block">
                  🤖 AI BUYER DIAGNOSIS
                </span>
                <p className="text-xs text-[#121212] leading-relaxed italic font-serif">
                  "The payment was unsuccessful. No valid payment confirmation was received from the gateway, so I will not mark the order as paid or retry automatically."
                </p>
              </div>

              {/* Policy Engine Action */}
              <div className="p-3.5 rounded-xl bg-[#121212] text-white space-y-2 font-mono text-xs">
                <div className="flex justify-between items-center text-[#CCFF00] text-[10px] uppercase font-bold">
                  <span>Policy Guardrail: POL-RETRY-01</span>
                  <span>ENFORCED</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-white/10">
                  <div>
                    <span className="text-white/50 block text-[9px]">AUTOMATIC RETRY:</span>
                    <strong className="text-red-400 font-bold">BLOCKED</strong>
                  </div>
                  <div>
                    <span className="text-white/50 block text-[9px]">REASON:</span>
                    <span className="text-white/80">Every financial action requires explicit human approval</span>
                  </div>
                </div>
              </div>

              {/* Audit Trail Note */}
              <div className="text-[11px] font-mono text-[#121212]/60 flex items-center justify-between pt-1">
                <span>Logged to Immutable Audit Trail:</span>
                <strong className="text-[#121212]">EVENT: PAYMENT_FAILED</strong>
              </div>
            </div>

            {/* Recovery Action Buttons */}
            <div className="space-y-2.5 pt-1">
              <button
                onClick={() => {
                  setErrorMessage(null);
                  handleSimulatePayment(false);
                }}
                disabled={processing}
                className="w-full py-3.5 rounded-full bg-[#121212] hover:bg-black text-[#CCFF00] text-xs font-bold uppercase tracking-wider shadow-lg transition-all flex items-center justify-center space-x-2"
              >
                <CreditCard className="w-4 h-4 text-[#CCFF00]" />
                <span>TRY AGAIN WITH VALID TEST CARD</span>
              </button>

              <button
                onClick={() => {
                  setErrorMessage(null);
                  onClose();
                }}
                className="w-full py-2.5 rounded-full bg-white hover:bg-gray-100 text-[#121212]/70 text-xs font-bold uppercase tracking-wider border border-[#121212]/15 transition-colors"
              >
                CANCEL ORDER & RETURN TO CART
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            {/* Zero-Exposure Masking Notice Banner */}
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-950 text-xs flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium text-[11px]">
                  <strong>Zero-Exposure Masking:</strong> Card numbers, OTPs, CVVs, & PINs are masked (<span className="font-mono font-bold">••••</span>) while typing.
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 font-mono text-[9px] font-extrabold uppercase shrink-0">
                ACTIVE
              </span>
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-2xl border text-xs font-semibold flex flex-col items-center space-y-1 transition-all ${
                  paymentMethod === 'card'
                    ? 'bg-[#121212] text-[#CCFF00] border-[#121212]'
                    : 'bg-[#FAF8F5] border-[#121212]/10 text-[#121212]/70 hover:text-[#121212]'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Test Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`p-3 rounded-2xl border text-xs font-semibold flex flex-col items-center space-y-1 transition-all ${
                  paymentMethod === 'upi'
                    ? 'bg-[#121212] text-[#CCFF00] border-[#121212]'
                    : 'bg-[#FAF8F5] border-[#121212]/10 text-[#121212]/70 hover:text-[#121212]'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('netbanking')}
                className={`p-3 rounded-2xl border text-xs font-semibold flex flex-col items-center space-y-1 transition-all ${
                  paymentMethod === 'netbanking'
                    ? 'bg-[#121212] text-[#CCFF00] border-[#121212]'
                    : 'bg-[#FAF8F5] border-[#121212]/10 text-[#121212]/70 hover:text-[#121212]'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>NetBanking</span>
              </button>
            </div>

            {/* Payment Details Form */}
            {paymentMethod === 'card' && (
              <div className="space-y-3.5 p-4 rounded-2xl bg-[#FAF8F5] border border-[#121212]/10 text-xs">
                {/* Card Number Input with Masking & Eye Toggle */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[#121212]/80 block text-[10px] uppercase font-mono font-bold">
                      Card Number (16-Digit)
                    </label>
                    <span className="text-[10px] font-mono text-[#121212]/50">
                      {showCardNumber ? 'Visible (Unmasked)' : '●●● Masked while typing'}
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type={showCardNumber ? 'text' : 'password'}
                      value={testCardNumber}
                      onChange={(e) => setTestCardNumber(e.target.value)}
                      placeholder="•••• •••• •••• ••••"
                      autoComplete="off"
                      className="w-full pl-3 pr-10 py-2.5 rounded-xl bg-white border border-[#121212]/15 text-[#121212] font-mono text-xs focus:outline-none focus:border-[#121212] tracking-wider font-semibold"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCardNumber(!showCardNumber)}
                      title={showCardNumber ? 'Hide card number' : 'Show card number'}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#121212]/50 hover:text-[#121212] p-1 rounded-md transition-colors"
                    >
                      {showCardNumber ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expiry & CVV */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[#121212]/80 block text-[10px] uppercase font-mono font-bold mb-1">
                      Expiry (MM/YY)
                    </label>
                    <input
                      type="text"
                      value={testExpiry}
                      onChange={(e) => setTestExpiry(e.target.value)}
                      maxLength={5}
                      placeholder="12/28"
                      className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#121212]/15 text-[#121212] font-mono text-xs focus:outline-none focus:border-[#121212]"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[#121212]/80 block text-[10px] uppercase font-mono font-bold">
                        CVV / CVC
                      </label>
                      <span className="text-[10px] font-mono text-[#121212]/50">
                        {showCvv ? 'Visible' : '●●●'}
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type={showCvv ? 'text' : 'password'}
                        value={testCvv}
                        onChange={(e) => setTestCvv(e.target.value)}
                        maxLength={4}
                        placeholder="•••"
                        autoComplete="off"
                        className="w-full pl-3 pr-10 py-2.5 rounded-xl bg-white border border-[#121212]/15 text-[#121212] font-mono text-xs focus:outline-none focus:border-[#121212] tracking-widest font-semibold"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCvv(!showCvv)}
                        title={showCvv ? 'Hide CVV' : 'Show CVV'}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#121212]/50 hover:text-[#121212] p-1 rounded-md transition-colors"
                      >
                        {showCvv ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Bank 3D-Secure OTP Input with Masking & Eye Toggle */}
                <div className="pt-2 border-t border-[#121212]/10 space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[#121212] flex items-center space-x-1.5 text-[11px] font-mono font-bold uppercase">
                      <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                      <span>Bank 3D-Secure OTP</span>
                    </label>
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-100 text-amber-900">
                      {showOtp ? 'UNMASKED' : '●●● MASKED WHILE TYPING'}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#121212]/60 leading-tight">
                    Enter the one-time password sent by the bank. Digits are masked while typing to prevent shoulder-surfing.
                  </p>
                  <div className="relative pt-1">
                    <input
                      type={showOtp ? 'text' : 'password'}
                      value={testOtp}
                      onChange={(e) => setTestOtp(e.target.value)}
                      maxLength={6}
                      placeholder="••••••"
                      autoComplete="off"
                      className="w-full pl-3 pr-10 py-2.5 rounded-xl bg-white border border-[#121212]/20 text-[#121212] font-mono text-xs focus:outline-none focus:border-[#121212] tracking-widest font-bold"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOtp(!showOtp)}
                      title={showOtp ? 'Hide OTP' : 'Show OTP'}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#121212]/50 hover:text-[#121212] p-1 rounded-md transition-colors"
                    >
                      {showOtp ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'upi' && (
              <div className="space-y-3.5 p-4 rounded-2xl bg-[#FAF8F5] border border-[#121212]/10 text-xs">
                <div className="space-y-1">
                  <label className="text-[#121212]/80 block text-[10px] uppercase font-mono font-bold">
                    Test UPI Virtual Payment Address (VPA)
                  </label>
                  <input
                    type="text"
                    value={testUpiId}
                    onChange={(e) => setTestUpiId(e.target.value)}
                    placeholder="success@razorpay or failure@razorpay"
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#121212]/15 text-[#121212] font-mono text-xs"
                  />
                </div>

                <div className="flex space-x-2 pt-0.5">
                  <button
                    type="button"
                    onClick={() => setTestUpiId('success@razorpay')}
                    className="text-[10px] px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 font-semibold"
                  >
                    Set: success@razorpay
                  </button>
                  <button
                    type="button"
                    onClick={() => setTestUpiId('failure@razorpay')}
                    className="text-[10px] px-3 py-1 rounded-full bg-red-100 border border-red-300 text-red-800 font-semibold"
                  >
                    Set: failure@razorpay
                  </button>
                </div>

                {/* Masked UPI MPIN */}
                <div className="space-y-1 pt-2 border-t border-[#121212]/10">
                  <div className="flex items-center justify-between">
                    <label className="text-[#121212] flex items-center space-x-1.5 text-[11px] font-mono font-bold uppercase">
                      <Lock className="w-3.5 h-3.5 text-[#121212]" />
                      <span>UPI MPIN / Secret Pin</span>
                    </label>
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-[#121212]/10 text-[#121212]">
                      {showUpiPin ? 'UNMASKED' : '●●● MASKED'}
                    </span>
                  </div>
                  <div className="relative pt-1">
                    <input
                      type={showUpiPin ? 'text' : 'password'}
                      value={testUpiPin}
                      onChange={(e) => setTestUpiPin(e.target.value)}
                      placeholder="••••"
                      maxLength={6}
                      autoComplete="off"
                      className="w-full pl-3 pr-10 py-2.5 rounded-xl bg-white border border-[#121212]/20 text-[#121212] font-mono text-xs focus:outline-none focus:border-[#121212] tracking-widest font-bold"
                    />
                    <button
                      type="button"
                      onClick={() => setShowUpiPin(!showUpiPin)}
                      title={showUpiPin ? 'Hide UPI PIN' : 'Show UPI PIN'}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#121212]/50 hover:text-[#121212] p-1 rounded-md transition-colors"
                    >
                      {showUpiPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'netbanking' && (
              <div className="space-y-3.5 p-4 rounded-2xl bg-[#FAF8F5] border border-[#121212]/10 text-xs">
                <label className="text-[#121212]/80 block text-[10px] uppercase font-mono font-bold">Select Test Bank</label>
                <div className="grid grid-cols-2 gap-2">
                  {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank'].map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setSelectedBank(b)}
                      className={`p-2 rounded-xl border text-left text-xs font-medium transition-colors ${
                        selectedBank === b
                          ? 'bg-[#121212] border-[#121212] text-white'
                          : 'bg-white border-[#121212]/10 text-[#121212]'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>

                {/* Masked NetBanking User ID & Password */}
                <div className="space-y-3 pt-2 border-t border-[#121212]/10">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[#121212]/70 block text-[10px] uppercase font-mono font-bold">
                        Customer ID / NetBanking User ID
                      </label>
                      <span className="text-[9px] font-mono text-[#121212]/50">
                        {showNetbankingUserId ? 'Visible' : '●●● Masked'}
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type={showNetbankingUserId ? 'text' : 'password'}
                        value={netbankingUserId}
                        onChange={(e) => setNetbankingUserId(e.target.value)}
                        placeholder="••••••••••"
                        autoComplete="off"
                        className="w-full pl-3 pr-10 py-2 rounded-xl bg-white border border-[#121212]/15 text-[#121212] font-mono text-xs focus:outline-none focus:border-[#121212]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNetbankingUserId(!showNetbankingUserId)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#121212]/50 hover:text-[#121212] p-1 rounded-md transition-colors"
                      >
                        {showNetbankingUserId ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[#121212]/70 block text-[10px] uppercase font-mono font-bold">
                        NetBanking Password / Transaction PIN
                      </label>
                      <span className="text-[9px] font-mono text-[#121212]/50">
                        {showNetbankingPassword ? 'Visible' : '●●● Masked'}
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type={showNetbankingPassword ? 'text' : 'password'}
                        value={netbankingPassword}
                        onChange={(e) => setNetbankingPassword(e.target.value)}
                        placeholder="••••••••••••"
                        autoComplete="off"
                        className="w-full pl-3 pr-10 py-2 rounded-xl bg-white border border-[#121212]/15 text-[#121212] font-mono text-xs focus:outline-none focus:border-[#121212] tracking-widest font-bold"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNetbankingPassword(!showNetbankingPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#121212]/50 hover:text-[#121212] p-1 rounded-md transition-colors"
                      >
                        {showNetbankingPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => handleSimulatePayment(false)}
                disabled={processing}
                className="w-full py-3.5 rounded-full bg-[#121212] hover:bg-black text-[#CCFF00] text-xs font-bold uppercase tracking-wider shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#CCFF00]" />
                    <span>Verifying HMAC Signature Server-Side...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-[#CCFF00]" />
                    <span>Confirm & Pay ₹{amount.toLocaleString('en-IN')}</span>
                  </>
                )}
              </button>

              {/* Optional: Launch Razorpay Standard Popup if handler provided */}
              {onOpenRazorpayPopup && (
                <button
                  type="button"
                  onClick={onOpenRazorpayPopup}
                  disabled={processing}
                  className="w-full py-2.5 rounded-full bg-[#FAF8F5] hover:bg-[#121212]/5 text-[#121212] border border-[#121212]/15 text-xs font-semibold transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#121212]/70" />
                  <span>Or Launch Razorpay Hosted Checkout Popup</span>
                </button>
              )}

              {/* Deliberate Failure Simulation Button */}
              <button
                type="button"
                onClick={() => handleSimulatePayment(true)}
                disabled={processing}
                className="w-full py-2.5 rounded-full bg-white hover:bg-red-50 text-red-600 border border-red-200 text-xs font-semibold transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                <span>Simulate Payment Failure Demo (Pol-Retry-01)</span>
              </button>
            </div>
          </div>
      )}
    </div>
  </div>
);
};
