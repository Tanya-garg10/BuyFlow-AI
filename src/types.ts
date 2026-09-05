export interface ProductAttributes {
  ram?: string;
  storage?: string;
  processor?: string;
  display?: string;
  refresh_rate?: string;
  switch_type?: string;
  dpi?: string;
  battery_life?: string;
  connectivity?: string;
  weight?: string;
  resolution?: string;
  speed?: string;
  color?: string;
  [key: string]: string | undefined;
}

export interface PurchaseConstraints {
  requires_user_approval: boolean;
  max_order_quantity?: number;
  restricted_jurisdiction?: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: 'Laptop' | 'Monitor' | 'Keyboard' | 'Mouse' | 'Headphones' | 'Webcam' | 'SSD' | 'Accessories';
  availability: boolean;
  stock: number;
  rating: number;
  review_count: number;
  image_url: string;
  attributes: ProductAttributes;
  use_cases: string[];
  compatible_products: string[];
  upsell_products: string[];
  purchase_constraints: PurchaseConstraints;
  ai_readiness_score: number; // 0-100
  ai_discoverability: 'High' | 'Medium' | 'Low';
}

export interface CartItem {
  product: Product;
  quantity: number;
  added_by: 'ai_buyer' | 'user';
  contextual_note?: string;
}

export interface Cart {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  created_at: string;
}

export interface PolicyEvaluation {
  action: string;
  allowed: boolean;
  requires_approval: boolean;
  reason: string;
  risk_level: 'low' | 'medium' | 'high' | 'blocked';
  threshold_amount?: number;
  triggered_rule: string;
}

export type OrderStatus = 'PAID' | 'CONFIRMED' | 'FAILED' | 'CANCELLED' | 'PENDING_APPROVAL';

export interface Order {
  id: string;
  cart_id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  status: OrderStatus;
  payment_id?: string;
  order_id?: string;
  signature?: string;
  verified?: boolean;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  payment_method: string;
  payment_mode: 'RAZORPAY_TEST' | 'MOCK_TEST';
  failure_reason?: string;
  failure_code?: string;
  created_at: string;
  audit_transaction_id: string;
}

export type EventType =
  | 'USER_REQUEST'
  | 'CATALOG_SEARCH'
  | 'PRODUCT_COMPARISON'
  | 'RECOMMENDATION'
  | 'UPSELL'
  | 'CART_CREATED'
  | 'POLICY_EVALUATION'
  | 'PAYMENT_APPROVAL_REQUESTED'
  | 'PAYMENT_APPROVED'
  | 'PAYMENT_CANCELLED'
  | 'PAYMENT_SUCCESS'
  | 'PAYMENT_FAILED'
  | 'ORDER_CREATED'
  | 'BLOCKED_ACTION';

export interface AgentEvent {
  id: string;
  timestamp: string;
  event_type: EventType;
  description: string;
  agent: 'AI Buyer' | 'Policy Engine' | 'User (Approver)' | 'Razorpay Gateway' | 'Merchant Catalog';
  status: 'SUCCESS' | 'WARNING' | 'ERROR' | 'INFO' | 'FAILED' | 'GATED';
  transaction_id?: string;
  metadata?: Record<string, any>;
}

export interface AIDecision {
  id: string;
  timestamp: string;
  decision: string;
  action: 'RECOMMEND' | 'UPSELL' | 'COMPARE' | 'GATE' | 'REJECT';
  confidence: number; // 0 - 100
  reasons: string[];
  evaluated_alternatives: string[];
  constraints_detected: {
    category?: string;
    budget?: number;
    ram?: string;
    use_case?: string;
    cross_sell?: string;
    [key: string]: any;
  };
  selected_product_id?: string;
  selected_product_name?: string;
}

export interface AnalyticsMetrics {
  ai_shopping_sessions: number;
  products_discovered: number;
  cart_creation_rate: number; // percentage
  checkout_conversion: number; // percentage
  average_order_value: number; // in INR
  upsell_acceptance: number; // percentage
  payment_success_rate: number; // percentage
  blocked_unsafe_actions: number;
  is_demo_data: boolean;
}

export type AnalyticsSummary = AnalyticsMetrics;

export interface CategoryRevenue {
  category: string;
  revenue: number;
  orders: number;
}

export interface FunnelStep {
  step: string;
  count: number;
  percentage: number;
}

export interface SessionTimelinePoint {
  date: string;
  sessions: number;
  conversions: number;
}

export interface AgentDialogueTurn {
  speaker: 'AI_BUYER' | 'MERCHANT_AGENT' | 'COMMERCE_PROTOCOL' | 'POLICY_GATE';
  message: string;
  timestamp: string;
  badge?: string;
  action?: string;
}

export interface SetupBundle {
  title: string;
  target_budget: number;
  total_price: number;
  budget_remaining: number;
  savings_pct: number;
  items: {
    product: Product;
    role: string;
    why: string;
  }[];
}

export interface AgentToolDefinition {
  name: string;
  description: string;
  http_method: 'POST' | 'GET';
  endpoint: string;
  parameters: Record<string, string>;
  returns: Record<string, string>;
  example_curl: string;
}
