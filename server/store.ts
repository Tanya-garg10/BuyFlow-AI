import { Product, Cart, CartItem, Order, AgentEvent, AIDecision, AnalyticsMetrics } from '../src/types';
import { INITIAL_PRODUCTS } from '../src/data/products';

class Store {
  public products: Product[] = [...INITIAL_PRODUCTS];
  public carts: Map<string, Cart> = new Map();
  public orders: Order[] = [];
  public events: AgentEvent[] = [];
  public decisions: AIDecision[] = [];
  public config = {
    highValueThreshold: 50000,
    mockPayment: process.env.MOCK_PAYMENT === 'true' || !process.env.RAZORPAY_KEY_ID,
    razorpayKeyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_demo_mode',
    razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || 'rzp_secret_demo_mode',
  };

  constructor() {
    this.seedInitialEvents();
  }

  private seedInitialEvents() {
    const now = new Date();
    const tMinus = (mins: number) => new Date(now.getTime() - mins * 60000).toISOString();

    this.events.push(
      {
        id: 'EVT-INIT-1',
        timestamp: tMinus(45),
        event_type: 'CATALOG_SEARCH',
        description: 'Catalog indexed 13 structured hardware products with 100% AI attributes completeness.',
        agent: 'Merchant Catalog',
        status: 'SUCCESS',
        metadata: { indexed_count: 13, ai_readiness_avg: 95.8 }
      },
      {
        id: 'EVT-INIT-2',
        timestamp: tMinus(30),
        event_type: 'USER_REQUEST',
        description: 'Previous session: User requested "High refresh rate monitor for frontend UI testing"',
        agent: 'AI Buyer',
        status: 'INFO',
        metadata: { query: 'Monitor for frontend UI' }
      },
      {
        id: 'EVT-INIT-3',
        timestamp: tMinus(29),
        event_type: 'RECOMMENDATION',
        description: 'Recommended ProSpeed 24" 165Hz Monitor based on sub-₹15,000 price point and fast IPS panel.',
        agent: 'AI Buyer',
        status: 'SUCCESS',
        metadata: { product_id: 'MN002', confidence: 94 }
      },
      {
        id: 'EVT-INIT-4',
        timestamp: tMinus(25),
        event_type: 'ORDER_CREATED',
        description: 'Order #ORD-7841 confirmed via Razorpay Test Mode for ₹14,499. Payment signature verified.',
        agent: 'Razorpay Gateway',
        status: 'SUCCESS',
        transaction_id: 'pay_test_784192a',
        metadata: { amount: 14499 }
      }
    );

    // Seed an initial decision
    this.decisions.push({
      id: 'DEC-INIT-1',
      timestamp: tMinus(29),
      decision: 'Recommended ProSpeed 24" 165Hz Dev Monitor',
      action: 'RECOMMEND',
      confidence: 94,
      reasons: [
        'Within user requested budget of ₹15,000 (actual: ₹14,499)',
        'Fast 165Hz IPS panel suitable for frontend animations testing',
        'In-stock with immediate dispatch'
      ],
      evaluated_alternatives: ['UltraView 27" 4K IPS Monitor (exceeded budget at ₹24,999)'],
      constraints_detected: {
        category: 'Monitor',
        budget: 15000,
        feature: '165Hz refresh rate'
      },
      selected_product_id: 'MN002',
      selected_product_name: 'ProSpeed 24" 165Hz Dev Monitor'
    });
  }

  public recordEvent(event: Omit<AgentEvent, 'id' | 'timestamp'>): AgentEvent {
    const newEvent: AgentEvent = {
      id: `EVT-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      timestamp: new Date().toISOString(),
      ...event
    };
    this.events.unshift(newEvent); // most recent first
    return newEvent;
  }

  public recordDecision(decision: Omit<AIDecision, 'id' | 'timestamp'>): AIDecision {
    const newDecision: AIDecision = {
      id: `DEC-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      timestamp: new Date().toISOString(),
      ...decision
    };
    this.decisions.unshift(newDecision);
    return newDecision;
  }

  public getOrCreateCart(cartId?: string): Cart {
    if (cartId && this.carts.has(cartId)) {
      return this.carts.get(cartId)!;
    }
    const newId = `CART-${Date.now().toString(36).toUpperCase()}`;
    const cart: Cart = {
      id: newId,
      items: [],
      subtotal: 0,
      tax: 0,
      total: 0,
      currency: 'INR',
      created_at: new Date().toISOString()
    };
    this.carts.set(newId, cart);
    return cart;
  }

  public updateCartTotals(cart: Cart): Cart {
    cart.subtotal = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    cart.tax = Math.round(cart.subtotal * 0.18); // 18% GST standard in India
    cart.total = cart.subtotal + cart.tax;
    return cart;
  }

  public getAnalytics(): AnalyticsMetrics {
    const ordersCount = this.orders.filter(o => o.status === 'CONFIRMED').length;
    const failedOrders = this.orders.filter(o => o.status === 'FAILED').length;
    const totalOrderValue = this.orders
      .filter(o => o.status === 'CONFIRMED')
      .reduce((sum, o) => sum + o.total, 0);

    const sessionRequests = this.events.filter(e => e.event_type === 'USER_REQUEST').length;
    const cartCreatedCount = this.events.filter(e => e.event_type === 'CART_CREATED').length;
    const blockedActionsCount = this.events.filter(e => e.event_type === 'BLOCKED_ACTION').length;

    // Base mock baseline + live runtime updates
    const baseSessions = 42;
    const baseDiscovered = 184;
    const totalSessions = baseSessions + sessionRequests;
    const totalDiscovered = baseDiscovered + (sessionRequests * 4);

    const totalCheckoutAttempts = ordersCount + failedOrders;
    const paymentSuccessRate = totalCheckoutAttempts > 0
      ? Math.round((ordersCount / totalCheckoutAttempts) * 100)
      : 96;

    const baseRevenue = 284500;
    const totalRevenue = baseRevenue + totalOrderValue;
    const calculatedAov = ordersCount > 0 ? Math.round(totalRevenue / (7 + ordersCount)) : 35560;

    return {
      ai_shopping_sessions: totalSessions,
      products_discovered: totalDiscovered,
      cart_creation_rate: Math.min(100, Math.round(((18 + cartCreatedCount) / totalSessions) * 100)),
      checkout_conversion: Math.min(100, Math.round(((7 + ordersCount) / totalSessions) * 100)),
      average_order_value: calculatedAov,
      upsell_acceptance: 38,
      payment_success_rate: paymentSuccessRate,
      blocked_unsafe_actions: 3 + blockedActionsCount,
      is_demo_data: true
    };
  }
}

export const store = new Store();
