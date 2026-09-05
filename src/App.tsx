import React, { useState, useEffect } from 'react';
import { Navbar, NavTab } from './components/Navbar';
import { HeroLanding } from './components/HeroLanding';
import { AIBuyer } from './components/AIBuyer';
import { MerchantView } from './components/MerchantView';
import { CartView } from './components/CartView';
import { OrdersView } from './components/OrdersView';
import { AuditTrailView } from './components/AuditTrailView';
import { AnalyticsView } from './components/AnalyticsView';
import { PolicyModal } from './components/PolicyModal';
import { RazorpayModal } from './components/RazorpayModal';
import { Product, Cart, Order, AIDecision, AgentEvent, PolicyEvaluation } from './types';
import { CheckCircle2, AlertTriangle, Sparkles, X } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('landing');
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Cart | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [decisions, setDecisions] = useState<AIDecision[]>([]);
  const [events, setEvents] = useState<AgentEvent[]>([]);
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  // Demo & Mode states
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [isDemoRunning, setIsDemoRunning] = useState(false);

  // Modals state
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
  const [isRazorpayModalOpen, setIsRazorpayModalOpen] = useState(false);
  const [isApprovingPayment, setIsApprovingPayment] = useState(false);
  const [policyEvaluation, setPolicyEvaluation] = useState<PolicyEvaluation | null>(null);
  const [razorpayOrderData, setRazorpayOrderData] = useState<{
    orderId: string;
    amount: number;
    currency: string;
    keyId: string;
    rawOrder?: any;
  } | null>(null);

  // Toast banner
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 6000);
  };

  // Initial Data Fetching
  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) setProducts(await res.json());
    } catch (e) {
      console.error('Error fetching products:', e);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) setOrders(await res.json());
    } catch (e) {
      console.error('Error fetching orders:', e);
    }
  };

  const fetchDecisions = async () => {
    try {
      const res = await fetch('/api/decisions');
      if (res.ok) setDecisions(await res.json());
    } catch (e) {
      console.error('Error fetching decisions:', e);
    }
  };

  const fetchAuditTrail = async () => {
    try {
      const res = await fetch('/api/audit');
      if (res.ok) setEvents(await res.json());
    } catch (e) {
      console.error('Error fetching audit:', e);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/analytics');
      if (res.ok) setAnalyticsData(await res.json());
    } catch (e) {
      console.error('Error fetching analytics:', e);
    }
  };

  const fetchCart = async (cartId?: string) => {
    try {
      const id = cartId || cart?.id || 'demo-cart';
      const res = await fetch(`/api/cart/${id}`);
      if (res.ok) setCart(await res.json());
    } catch (e) {
      console.error('Error fetching cart:', e);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchDecisions();
    fetchAuditTrail();
    fetchAnalytics();
    fetchCart();
  }, []);

  // Cart operations
  const handleAddToCart = async (
    productId: string,
    quantity: number,
    addedBy: 'ai_buyer' | 'user',
    contextualNote?: string
  ) => {
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cart_id: cart?.id || 'demo-cart',
          product_id: productId,
          quantity,
          added_by: addedBy,
          contextual_note: contextualNote,
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setCart(updated);
        fetchAuditTrail();
        fetchAnalytics();
        showToast('success', `Added to cart (${addedBy === 'ai_buyer' ? 'AI Staged' : 'Manual'})`);
      }
    } catch (e) {
      console.error('Error adding to cart:', e);
    }
  };

  const handleAddBulkToCart = async (items: { product_id: string; quantity: number; added_by?: 'ai_buyer' | 'user'; contextual_note?: string }[]) => {
    try {
      const res = await fetch('/api/cart/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cart_id: cart?.id || 'demo-cart',
          items,
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setCart(updated);
        fetchAuditTrail();
        fetchAnalytics();
        showToast('success', `Staged complete setup bundle (${items.length} items) into cart!`);
      }
    } catch (e) {
      console.error('Error adding bulk items:', e);
    }
  };

  const handleUpdateQuantity = async (productId: string, delta: number) => {
    if (!cart) return;
    const item = cart.items.find((i) => i.product.id === productId);
    if (!item) return;
    const newQty = item.quantity + delta;
    if (newQty <= 0) {
      handleRemoveItem(productId);
      return;
    }
    await handleAddToCart(productId, delta, 'user');
  };

  const handleRemoveItem = async (productId: string) => {
    if (!cart) return;
    try {
      const res = await fetch(`/api/cart/${cart.id}/items/${productId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setCart(await res.json());
        fetchAuditTrail();
      }
    } catch (e) {
      console.error('Error removing item:', e);
    }
  };

  // Proceed to Policy Evaluation Gate
  const handleProceedToCheckout = async () => {
    if (!cart || cart.items.length === 0) {
      showToast('error', 'Your cart is empty. Add products first.');
      return;
    }

    try {
      const res = await fetch('/api/payment/policy-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'initiate_payment',
          amount: cart.total,
          user_confirmed: false,
          actor: 'AI_AGENT',
          cart_id: cart.id,
        }),
      });

      const evalData: PolicyEvaluation = await res.json();
      setPolicyEvaluation(evalData);
      setIsPolicyModalOpen(true);
      fetchAuditTrail();
    } catch (e) {
      console.error('Error in policy check:', e);
    }
  };

  // Approve payment: creates order on Razorpay and opens checkout modal
  const handleApprovePayment = async () => {
    if (!cart) return;
    setIsApprovingPayment(true);

    try {
      console.log('[RAZORPAY] Creating order');
      const res = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cart_id: cart.id,
          amount: cart.total,
          currency: 'INR',
          user_confirmed: true, // explicit user authorization passed!
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        showToast('error', err.error || 'Payment blocked by policy engine');
        setIsApprovingPayment(false);
        return;
      }

      const orderData = await res.json();
      const orderId = orderData.order_id || orderData.razorpay_order_id;
      console.log(`[RAZORPAY] Order created: ${orderId}`);

      setIsPolicyModalOpen(false);

      // Open the masked credential checkout terminal (protects Card Number, OTP, CVV, PIN from shoulder-surfing)
      setRazorpayOrderData({
        orderId,
        amount: orderData.amount,
        currency: orderData.currency,
        keyId: orderData.key_id,
        rawOrder: orderData,
      });
      setIsRazorpayModalOpen(true);
      fetchAuditTrail();
    } catch (e: any) {
      console.error('Error approving payment:', e);
      showToast('error', e.message || 'Failed to initialize payment gateway order');
    } finally {
      setIsApprovingPayment(false);
    }
  };

  // Optional: Launch Razorpay Standard Hosted Window on request
  const handleOpenHostedRazorpay = () => {
    if (!cart || !razorpayOrderData?.rawOrder) return;
    const orderData = razorpayOrderData.rawOrder;
    const orderId = razorpayOrderData.orderId;

    if (typeof window !== 'undefined' && (window as any).Razorpay) {
      console.log('[RAZORPAY] Opening standard checkout popup');

      const options = {
        key: orderData.key_id || razorpayOrderData.keyId,
        amount: orderData.amount_paise || Math.round(orderData.amount * 100),
        currency: orderData.currency || 'INR',
        name: 'BuyFlow AI',
        description: `AI Buyer Procurement (${cart.items.length} items)`,
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=200&q=80',
        order_id: orderId,
        handler: async function (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) {
          console.log('[RAZORPAY] Payment handler called');
          console.log(`[RAZORPAY] Payment ID: ${response.razorpay_payment_id}`);

          try {
            const verifyRes = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                order_id: cart.id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                simulate_failure: false,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              await handlePaymentSuccess(verifyData.order, verifyData.message || 'Payment successful and marked PAID');
              setIsRazorpayModalOpen(false);
            } else {
              await handlePaymentFailure(verifyData.message || 'Signature verification failed');
            }
          } catch (err: any) {
            await handlePaymentFailure('Verification request failed');
          }
        },
        prefill: {
          name: 'AI Buyer Approver',
          email: 'approver@buyflow.ai',
          contact: '9999999999',
        },
        theme: {
          color: '#121212',
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    }
  };

  // TEST 2: Separate Explicit Failure Simulator
  const handleSimulateFailurePayment = async () => {
    if (!cart) return;
    setIsApprovingPayment(true);
    setIsPolicyModalOpen(false);

    try {
      const fakePaymentId = `pay_fail_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
      const fakeOrderId = `order_fail_${Date.now().toString(36)}`;

      const res = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: cart.id,
          razorpay_order_id: fakeOrderId,
          razorpay_payment_id: fakePaymentId,
          simulate_failure: true,
          failure_scenario: 'card_declined',
        }),
      });

      const data = await res.json();
      await handlePaymentFailure(
        data.message || 'Payment authorization was rejected. Policy rule POL-RETRY-01 auto-retry blocked.'
      );
    } catch (e) {
      console.error('Simulate failure error:', e);
      await handlePaymentFailure('Simulated failure error');
    } finally {
      setIsApprovingPayment(false);
    }
  };

  // Handle successful payment
  const handlePaymentSuccess = async (order: Order, message: string) => {
    setIsRazorpayModalOpen(false);
    showToast('success', message);
    await fetchOrders();
    await fetchAuditTrail();
    await fetchAnalytics();
    await fetchCart();
    setCurrentTab('orders');
  };

  // Handle simulated or real failure
  const handlePaymentFailure = async (message: string) => {
    showToast('error', message);
    await fetchOrders();
    await fetchAuditTrail();
    await fetchAnalytics();
  };

  // 1-Click Fast 2-Minute Demo Scenario
  const handleRunDemo = async () => {
    setIsDemoRunning(true);
    showToast('info', 'Running 2-Min Demo: AI Buyer searching catalog under ₹60K budget...');

    try {
      const res = await fetch('/api/demo/run-scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ simulate_failure: simulateFailure }),
      });

      if (!res.ok) throw new Error('Demo failed');
      const data = await res.json();

      setCart(data.cart);
      setPolicyEvaluation(data.policyEvaluation);
      await fetchDecisions();
      await fetchAuditTrail();
      await fetchAnalytics();

      // Open Policy Gate directly
      setIsPolicyModalOpen(true);
      showToast('success', 'Demo Cart assembled! Policy Engine intercepted payment for explicit human approval.');
    } catch (e) {
      console.error('Demo run error:', e);
      showToast('error', 'Demo run failed');
    } finally {
      setIsDemoRunning(false);
    }
  };

  // Handle Merchant adding a new product
  const handleAddProduct = async (productData: Partial<Product>) => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      if (res.ok) {
        showToast('success', 'New product indexed into AI catalog graph');
        fetchProducts();
        fetchAuditTrail();
      }
    } catch (e) {
      console.error('Error adding product:', e);
      showToast('error', 'Failed to add product');
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBF9] bg-subtle-grid text-[#121212] flex flex-col antialiased selection:bg-[#CCFF00] selection:text-[#121212]">
      {/* Toast Notification Banner */}
      {toast && (
        <div className="fixed top-24 right-6 z-50 max-w-md animate-in slide-in-from-top-4 duration-300">
          <div
            className={`p-4 rounded-2xl border shadow-xl flex items-start space-x-3 backdrop-blur-md ${
              toast.type === 'success'
                ? 'bg-white border-[#121212] text-[#121212]'
                : toast.type === 'error'
                ? 'bg-red-50 border-red-300 text-red-900'
                : 'bg-[#121212] border-white/10 text-white'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-[#121212] shrink-0 mt-0.5" />
            ) : toast.type === 'error' ? (
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            ) : (
              <Sparkles className="w-5 h-5 text-[#CCFF00] shrink-0 mt-0.5" />
            )}
            <p className="text-xs font-semibold leading-relaxed flex-1">{toast.message}</p>
            <button
              onClick={() => setToast(null)}
              className="text-current opacity-50 hover:opacity-100 p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Pill Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        cart={cart}
        onRunDemo={handleRunDemo}
        isDemoRunning={isDemoRunning}
        simulateFailure={simulateFailure}
        onToggleSimulateFailure={(val) => {
          setSimulateFailure(val);
          showToast(
            'info',
            val
              ? 'Payment Failure Simulation ENABLED. Next payment test will simulate declined card.'
              : 'Normal Payment Mode restored.'
          );
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {currentTab === 'landing' && (
          <HeroLanding
            onStartBuyer={() => setCurrentTab('buyer')}
            onExploreMerchant={() => setCurrentTab('merchant')}
            onRunDemo={handleRunDemo}
            onOpenApproval={() => {
              if (cart && cart.items.length > 0) {
                handleProceedToCheckout();
              } else {
                handleRunDemo();
              }
            }}
          />
        )}

        {currentTab === 'buyer' && (
          <AIBuyer
            onAddToCart={handleAddToCart}
            onAddBulkToCart={handleAddBulkToCart}
            cart={cart}
            onProceedToCheckout={handleProceedToCheckout}
            onViewDecisions={() => setCurrentTab('audit')}
            onViewCatalog={() => setCurrentTab('merchant')}
          />
        )}

        {currentTab === 'merchant' && (
          <MerchantView
            products={products}
            onAddProduct={handleAddProduct}
            onSelectProduct={(prod) => {
              showToast('info', `Indexed SKU: ${prod.name} (${prod.ai_readiness_score}% AI Ready)`);
            }}
          />
        )}

        {currentTab === 'cart' && (
          <CartView
            cart={cart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onProceedToCheckout={handleProceedToCheckout}
            onStartShopping={() => setCurrentTab('buyer')}
          />
        )}

        {currentTab === 'orders' && (
          <OrdersView
            orders={orders}
            onViewAuditTrail={() => setCurrentTab('audit')}
          />
        )}

        {currentTab === 'audit' && (
          <AuditTrailView
            events={events}
            onRefresh={fetchAuditTrail}
          />
        )}

        {currentTab === 'analytics' && (
          <AnalyticsView
            analytics={analyticsData}
            onRefresh={fetchAnalytics}
          />
        )}
      </main>

      {/* Policy Engine Human Approval Modal */}
      {cart && (
        <PolicyModal
          isOpen={isPolicyModalOpen}
          onClose={() => setIsPolicyModalOpen(false)}
          cart={cart}
          policyEvaluation={policyEvaluation}
          onApprovePayment={handleApprovePayment}
          onSimulateFailurePayment={handleSimulateFailurePayment}
          isApproving={isApprovingPayment}
        />
      )}

      {/* Razorpay Test Mode Checkout Modal */}
      {cart && razorpayOrderData && (
        <RazorpayModal
          isOpen={isRazorpayModalOpen}
          onClose={() => setIsRazorpayModalOpen(false)}
          cart={cart}
          orderId={razorpayOrderData.orderId}
          amount={razorpayOrderData.amount}
          currency={razorpayOrderData.currency}
          keyId={razorpayOrderData.keyId}
          simulateFailure={simulateFailure}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentFailure={handlePaymentFailure}
          onOpenRazorpayPopup={handleOpenHostedRazorpay}
        />
      )}
    </div>
  );
}
