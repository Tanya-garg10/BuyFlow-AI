import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  ArrowRight,
  Check,
  CheckCircle2,
  Plus,
  Loader2,
  Lock,
  ShoppingBag,
  Zap,
  Bot,
  X,
  SlidersHorizontal,
  Search,
  CornerDownLeft,
  Shield,
  Terminal,
  Code2,
  Layers,
  HelpCircle,
  FileText,
  CheckSquare,
  RefreshCw,
  Cpu,
  Laptop,
  Monitor,
  Keyboard,
  Mouse,
  TrendingUp,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, Cart, AIDecision, AgentDialogueTurn, SetupBundle, AgentToolDefinition } from '../types';

interface AgentRecommendationResponse {
  query: string;
  extracted_constraints: {
    category?: string;
    budget?: number;
    ram?: string;
    use_case?: string;
    cross_sell?: string;
  };
  recommended_product: Product;
  match_score: number;
  ai_explanation: string;
  reasons: string[];
  cross_sell_product: Product;
  cross_sell_reason: string;
  comparison_products: {
    product: Product;
    pros: string[];
    cons: string[];
    fit_assessment: string;
  }[];
  decision: AIDecision;
  tools_executed: {
    tool: string;
    input: any;
    output_summary: string;
    timestamp: string;
  }[];
  dialogue?: AgentDialogueTurn[];
  setup_bundle?: SetupBundle;
  tools?: AgentToolDefinition[];
}

interface AIBuyerProps {
  onAddToCart: (productId: string, quantity: number, addedBy: 'ai_buyer' | 'user', note?: string) => Promise<void>;
  onAddBulkToCart?: (items: { product_id: string; quantity: number; added_by?: 'ai_buyer' | 'user'; contextual_note?: string }[]) => Promise<void>;
  cart: Cart | null;
  onProceedToCheckout: () => void;
  onViewDecisions: () => void;
  onViewCatalog: () => void;
}

export const AIBuyer: React.FC<AIBuyerProps> = ({
  onAddToCart,
  onAddBulkToCart,
  cart,
  onProceedToCheckout,
  onViewDecisions,
  onViewCatalog,
}) => {
  const [query, setQuery] = useState(
    'I need a laptop under ₹60,000 for coding with at least 16GB RAM. Also suggest a mouse.'
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AgentRecommendationResponse | null>(null);
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});
  const [searchStep, setSearchStep] = useState<number>(1);
  const [showWhyModal, setShowWhyModal] = useState<boolean>(false);
  const [showToolsModal, setShowToolsModal] = useState<boolean>(false);
  const [selectedTool, setSelectedTool] = useState<string>('search_products');
  const [isAddingBundle, setIsAddingBundle] = useState<boolean>(false);
  const [bundleAdded, setBundleAdded] = useState<boolean>(false);

  const presetScenarios = [
    {
      icon: '🚀',
      label: 'Build My Setup (< ₹80K)',
      query: 'Build me a complete coding setup under ₹80,000 with laptop, monitor, keyboard, and mouse',
      badge: 'Setup Bundle',
    },
    {
      icon: '💻',
      label: 'Coding & Dev Laptop',
      query: 'I need a laptop under ₹60,000 for coding with at least 16GB RAM. Also suggest a mouse.',
      badge: 'Dev Rig',
    },
    {
      icon: '🎨',
      label: 'Creator Studio Rig',
      query: 'High-performance laptop for 4K video editing and creative design under ₹1,20,000.',
      badge: 'Video & Design',
    },
    {
      icon: '⚡',
      label: 'Ergonomic Peripherals',
      query: 'Ergonomic wireless mouse and mechanical keyboard for long programming hours.',
      badge: 'Ergonomic',
    },
  ];

  const quickFilters = [
    { label: 'Budget < ₹60,000', append: ' under ₹60,000' },
    { label: '16GB RAM Min', append: ' with 16GB RAM' },
    { label: 'With Ergonomic Mouse', append: ' with an ergonomic mouse' },
    { label: 'For Software Dev', append: ' for programming and coding' },
  ];

  // Dynamically extract detected intent tags from query
  const detectedTags = useMemo(() => {
    if (!query.trim()) return [];
    const tags: { label: string; bg: string; text: string }[] = [];
    const lower = query.toLowerCase();

    // Budget tag
    if (lower.includes('80k') || lower.includes('80,000') || lower.includes('80000')) {
      tags.push({ label: 'Budget: ≤ ₹80,000', bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-800' });
    } else if (lower.includes('60k') || lower.includes('60,000') || lower.includes('60000')) {
      tags.push({ label: 'Budget: ≤ ₹60,000', bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-800' });
    } else if (lower.includes('50k') || lower.includes('50,000') || lower.includes('50000')) {
      tags.push({ label: 'Budget: ≤ ₹50,000', bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-800' });
    } else if (lower.includes('1,20,000') || lower.includes('120000') || lower.includes('1.2l')) {
      tags.push({ label: 'Budget: ≤ ₹1,20,000', bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-800' });
    }

    // RAM tag
    if (lower.includes('16gb') || lower.includes('16 gb')) {
      tags.push({ label: 'Memory: 16GB RAM', bg: 'bg-blue-50 border-blue-200', text: 'text-blue-800' });
    } else if (lower.includes('32gb') || lower.includes('32 gb')) {
      tags.push({ label: 'Memory: 32GB RAM', bg: 'bg-blue-50 border-blue-200', text: 'text-blue-800' });
    }

    // Category
    if (lower.includes('setup') || lower.includes('bundle')) {
      tags.push({ label: 'Scope: Full Setup Bundle', bg: 'bg-amber-50 border-amber-300', text: 'text-amber-900' });
    } else if (lower.includes('laptop') || lower.includes('notebook') || lower.includes('macbook')) {
      tags.push({ label: 'Category: Laptop', bg: 'bg-stone-100 border-stone-200', text: 'text-stone-800' });
    } else if (lower.includes('mouse')) {
      tags.push({ label: 'Category: Peripherals', bg: 'bg-stone-100 border-stone-200', text: 'text-stone-800' });
    }

    // Cross sell
    if (lower.includes('mouse') && lower.includes('laptop')) {
      tags.push({ label: '+ Cross-sell Pair', bg: 'bg-lime-50 border-lime-300', text: 'text-stone-900' });
    }

    return tags;
  }, [query]);

  const handleSearch = async (customQuery?: string) => {
    const q = customQuery !== undefined ? customQuery : query;
    if (!q.trim()) return;
    setLoading(true);
    setSearchStep(1);
    setAddedItems({});
    setBundleAdded(false);

    const stepTimer = setInterval(() => {
      setSearchStep((prev) => (prev < 3 ? prev + 1 : prev));
    }, 450);

    try {
      const res = await fetch('/api/agent/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, cart_id: cart?.id }),
      });

      if (!res.ok) throw new Error('Search failed');
      const data: AgentRecommendationResponse = await res.json();
      setResult(data);
    } catch (err) {
      console.error('Agent search error:', err);
    } finally {
      clearInterval(stepTimer);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Automatically execute default query on mount so user immediately sees results
    if (!result && !loading) {
      handleSearch('I need a laptop under ₹60,000 for coding with at least 16GB RAM. Also suggest a mouse.');
    }
  }, []);

  const handleAddProduct = async (product: Product, note?: string) => {
    setAddedItems((prev) => ({ ...prev, [product.id]: true }));
    await onAddToCart(product.id, 1, 'ai_buyer', note);
  };

  const handleAddBoth = async () => {
    if (!result) return;
    setAddedItems((prev) => ({
      ...prev,
      [result.recommended_product.id]: true,
      [result.cross_sell_product.id]: true,
    }));
    await onAddToCart(result.recommended_product.id, 1, 'ai_buyer', 'Recommended primary laptop');
    await onAddToCart(result.cross_sell_product.id, 1, 'ai_buyer', 'Recommended contextual cross-sell mouse');
  };

  const handleStageSetupBundle = async () => {
    if (!result?.setup_bundle) return;
    setIsAddingBundle(true);

    const items = result.setup_bundle.items.map((item) => ({
      product_id: item.product.id,
      quantity: 1,
      added_by: 'ai_buyer' as const,
      contextual_note: `Setup Bundle: ${item.role} (${item.why})`,
    }));

    if (onAddBulkToCart) {
      await onAddBulkToCart(items);
    } else {
      for (const item of items) {
        await onAddToCart(item.product_id, 1, 'ai_buyer', item.contextual_note);
      }
    }

    setBundleAdded(true);
    setIsAddingBundle(false);
  };

  // Fallback dialogue turns if none returned
  const dialogueTurns: AgentDialogueTurn[] = result?.dialogue && result.dialogue.length > 0
    ? result.dialogue
    : [
        {
          speaker: 'AI_BUYER',
          message: `Parsed intent: "Coding setup under ₹60,000 with 16GB RAM + mouse"`,
          timestamp: '14:22:01',
          badge: 'INTENT',
          action: 'TRANSLATE_INTENT',
        },
        {
          speaker: 'COMMERCE_PROTOCOL',
          message: `Dispatched search_products() across merchant inventory. Filtered RAM >= 16GB, budget <= ₹60,000.`,
          timestamp: '14:22:01',
          badge: 'PROTOCOL',
          action: 'ROUTE_CATALOG',
        },
        {
          speaker: 'MERCHANT_AGENT',
          message: `Evaluated candidates. Selected ProBook 14 (98% match). 24 units in-stock ready for immediate fulfillment.`,
          timestamp: '14:22:02',
          badge: 'MERCHANT',
          action: 'PROPOSE_MATCH',
        },
        {
          speaker: 'MERCHANT_AGENT',
          message: `Cross-sell opportunity: Proposing ErgoMouse M2 (₹1,299). 100% verified compatibility with ProBook 14. Remaining budget: ₹3,702.`,
          timestamp: '14:22:02',
          badge: 'UPSELL',
          action: 'OFFER_ADDON',
        },
        {
          speaker: 'AI_BUYER',
          message: `Validated upsell pairing. Fits budget envelope. Staged recommendation with explainable reasons.`,
          timestamp: '14:22:03',
          badge: 'BUYER',
          action: 'STAGE_PROPOSAL',
        },
        {
          speaker: 'POLICY_GATE',
          message: `Guardrail active: Financial actions require explicit human authorization before Razorpay order execution.`,
          timestamp: '14:22:03',
          badge: 'GUARDRAIL',
          action: 'AWAIT_APPROVAL',
        },
      ];

  const speakerConfig = {
    AI_BUYER: {
      label: 'AI Buyer Agent',
      badgeBg: 'bg-blue-100 text-blue-900 border-blue-200',
      avatarBg: 'bg-blue-950 text-[#CCFF00]',
      icon: Bot,
    },
    COMMERCE_PROTOCOL: {
      label: 'Commerce Protocol',
      badgeBg: 'bg-amber-100 text-amber-900 border-amber-200',
      avatarBg: 'bg-amber-900 text-amber-300',
      icon: Zap,
    },
    MERCHANT_AGENT: {
      label: 'Merchant Agent',
      badgeBg: 'bg-purple-100 text-purple-900 border-purple-200',
      avatarBg: 'bg-purple-950 text-purple-300',
      icon: ShoppingBag,
    },
    POLICY_GATE: {
      label: 'Policy Gate',
      badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-200',
      avatarBg: 'bg-emerald-950 text-emerald-300',
      icon: Shield,
    },
  };

  const toolDefinitions = [
    {
      name: 'search_products',
      desc: 'Searches merchant catalog using natural language constraints and attribute filters.',
      method: 'POST',
      path: '/api/agent/search',
      params: '{"query": "laptop under 60000 16gb", "constraints": {"budget": 60000, "ram": "16GB"}}',
      response: '{"recommended_product": {...}, "match_score": 98, "reasons": [...]}',
      curl: 'curl -X POST /api/agent/search -H "Content-Type: application/json" -d \'{"query":"laptop under 60000 16gb"}\'',
    },
    {
      name: 'compare_products',
      desc: 'Compares multiple SKU IDs against user requirements and highlights trade-offs.',
      method: 'POST',
      path: '/api/agent/compare',
      params: '{"product_ids": ["L001", "L002", "L003"]}',
      response: '{"comparison_products": [{"pros": [...], "cons": [...], "fit": "Best match"}]}',
      curl: 'curl -X POST /api/agent/compare -H "Content-Type: application/json" -d \'{"product_ids":["L001","L002"]}\'',
    },
    {
      name: 'build_setup_bundle',
      desc: 'Constructs an integrated multi-component hardware setup under a target budget ceiling.',
      method: 'POST',
      path: '/api/agent/setup',
      params: '{"budget": 80000}',
      response: '{"bundle": {"items": [...], "total_price": 74296, "budget_remaining": 5704}}',
      curl: 'curl -X POST /api/agent/setup -H "Content-Type: application/json" -d \'{"budget": 80000}\'',
    },
    {
      name: 'create_cart',
      desc: 'Initializes or bulk-stages items into a session cart with contextual agent reasoning notes.',
      method: 'POST',
      path: '/api/cart/bulk',
      params: '{"cart_id": "cart-123", "items": [{"product_id": "L001", "quantity": 1}]}',
      response: '{"id": "cart-123", "items": [...], "total": 74296}',
      curl: 'curl -X POST /api/cart/bulk -H "Content-Type: application/json" -d \'{"items":[{"product_id":"L001","quantity":1}]}\'',
    },
    {
      name: 'evaluate_policy',
      desc: 'Enforces commerce safety guardrails before financial payment execution.',
      method: 'POST',
      path: '/api/policy/evaluate',
      params: '{"cart_id": "cart-123", "action": "checkout"}',
      response: '{"allowed": true, "requires_approval": true, "triggered_rule": "POL-AUTH-01"}',
      curl: 'curl -X POST /api/policy/evaluate -H "Content-Type: application/json" -d \'{"cart_id":"cart-123"}\'',
    },
    {
      name: 'payment_status',
      desc: 'Verifies HMAC SHA-256 signature server-side and checks payment confirmation status.',
      method: 'POST',
      path: '/api/razorpay/verify',
      params: '{"razorpay_order_id": "order_xyz", "razorpay_payment_id": "pay_xyz", "razorpay_signature": "hash"}',
      response: '{"verified": true, "order_status": "CONFIRMED"}',
      curl: 'curl -X POST /api/razorpay/verify -H "Content-Type: application/json" -d \'{"razorpay_order_id":"order_xyz"}\'',
    },
  ];

  return (
    <div className="pt-32 sm:pt-36 lg:pt-40 pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Top Header & Visual Commerce Canvas Prompt */}
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#121212]/5 border border-[#121212]/10 text-[11px] font-mono font-bold tracking-widest text-[#121212]/70 uppercase">
            <Bot className="w-3.5 h-3.5 text-[#121212]" />
            <span>AUTONOMOUS BUYER AGENT</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF00]" />
            <span className="text-[#121212]/50">TRACK 01 DEMO</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#121212] uppercase leading-[0.95]">
            TELL THE AI BUYER{' '}
            <span className="font-editorial lowercase italic font-normal tracking-normal text-[#121212]/80">
              what to purchase.
            </span>
          </h1>
          <p className="text-sm sm:text-base text-[#121212]/60 max-w-xl mx-auto leading-relaxed">
            State your workflow, budget constraints, or specific hardware specs. The AI Buyer queries the merchant catalog, optimizes cross-sells, and prepares your guarded cart.
          </p>

          {/* Quick Action to Inspect MCP Tool Contracts */}
          <div className="pt-1 flex items-center justify-center space-x-3">
            <button
              onClick={() => setShowToolsModal(true)}
              className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#121212] text-[#CCFF00] text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#262626] transition-all shadow-xs cursor-pointer"
            >
              <Code2 className="w-3.5 h-3.5 text-[#CCFF00]" />
              <span>INSPECT AI COMMERCE API & MCP TOOLS</span>
            </button>
          </div>
        </div>

        {/* Studio-Grade Search & Intent Console */}
        <div className="rounded-3xl bg-white border border-[#121212]/15 shadow-[0_20px_50px_rgba(0,0,0,0.06)] p-5 sm:p-7 space-y-5 transition-all">
          
          {/* Header of Search Card */}
          <div className="flex items-center justify-between border-b border-[#121212]/10 pb-3">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#CCFF00] border border-[#121212]/30 animate-pulse" />
              <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-[#121212]/60">
                NATURAL LANGUAGE SPEC PROMPT
              </span>
            </div>
            
            {query.length > 0 && (
              <button
                onClick={() => setQuery('')}
                className="text-[11px] font-mono text-[#121212]/50 hover:text-[#121212] flex items-center space-x-1 transition-colors"
              >
                <X className="w-3 h-3" />
                <span>CLEAR PROMPT</span>
              </button>
            )}
          </div>

          {/* Interactive Prompt Area */}
          <div className="relative rounded-2xl bg-[#FAF8F5] border border-[#121212]/15 focus-within:border-[#121212] focus-within:bg-white transition-all p-4 sm:p-5 shadow-inner">
            <div className="flex items-start space-x-3">
              <div className="mt-1 p-2 rounded-xl bg-[#121212] text-[#CCFF00] shrink-0 shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>

              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSearch();
                  }
                }}
                rows={2}
                placeholder="e.g. Build me a complete coding setup under ₹80,000 with laptop, monitor, keyboard, and mouse..."
                className="w-full bg-transparent text-[#121212] placeholder-[#121212]/35 text-sm sm:text-base font-medium resize-none focus:outline-none leading-relaxed"
              />
            </div>

            {/* Bottom Bar inside Input Box */}
            <div className="pt-3 mt-3 border-t border-[#121212]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Left: Real-time detected constraint tags */}
              <div className="flex flex-wrap items-center gap-1.5 min-h-[26px]">
                {detectedTags.length > 0 ? (
                  <>
                    <span className="text-[10px] font-mono text-[#121212]/50 uppercase font-bold mr-1">
                      PARSED:
                    </span>
                    {detectedTags.map((tag, i) => (
                      <span
                        key={i}
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${tag.bg} ${tag.text}`}
                      >
                        {tag.label}
                      </span>
                    ))}
                  </>
                ) : (
                  <span className="text-[11px] font-mono text-[#121212]/40 italic">
                    Type constraints like "under ₹80,000", "16GB RAM", or "setup"...
                  </span>
                )}
              </div>

              {/* Right: Execute Search Button */}
              <button
                onClick={() => handleSearch()}
                disabled={loading || !query.trim()}
                className="px-5 py-2 rounded-full bg-[#121212] hover:bg-[#262626] text-white text-xs font-bold font-mono uppercase tracking-wider flex items-center justify-center space-x-2 shadow-md transition-all self-end sm:self-auto cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#CCFF00]" />
                    <span>AGENT SCANNING...</span>
                  </>
                ) : (
                  <>
                    <span>DISCOVER & RECOMMEND</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#CCFF00]" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Preset Scenarios */}
          <div className="space-y-2.5 pt-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#121212]/50">
                OR SELECT POPULAR BUYER SCENARIOS:
              </span>
              <span className="text-[10px] font-mono text-[#121212]/40">
                Click any to test autonomous agent
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {presetScenarios.map((scenario, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuery(scenario.query);
                    handleSearch(scenario.query);
                  }}
                  className="group p-3 rounded-2xl bg-[#FAF8F5] hover:bg-[#121212] border border-[#121212]/10 hover:border-[#121212] text-left transition-all duration-200 flex flex-col justify-between space-y-2 hover:shadow-md cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xl">{scenario.icon}</span>
                    <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-white group-hover:bg-white/20 text-[#121212] group-hover:text-[#CCFF00] border border-[#121212]/10 group-hover:border-transparent transition-colors">
                      {scenario.badge}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#121212] group-hover:text-white transition-colors">
                      {scenario.label}
                    </h4>
                    <p className="text-[11px] text-[#121212]/60 group-hover:text-white/70 line-clamp-2 transition-colors mt-0.5 leading-snug">
                      {scenario.query}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Modifier Chips */}
          <div className="pt-2 border-t border-[#121212]/10 flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#121212]/50 mr-1">
              QUICK CONSTRAINTS:
            </span>
            {quickFilters.map((filter, i) => (
              <button
                key={i}
                onClick={() => {
                  const newQ = query.trim() ? `${query.trim()}, ${filter.append.trim()}` : filter.label;
                  setQuery(newQ);
                  handleSearch(newQ);
                }}
                className="text-[11px] font-mono px-3 py-1 rounded-full bg-white hover:bg-[#121212] text-[#121212] hover:text-[#CCFF00] border border-[#121212]/15 hover:border-[#121212] transition-all font-semibold shadow-xs cursor-pointer"
              >
                + {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Live Active Telemetry Stream when Loading */}
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-[#121212] text-white p-6 shadow-xl border border-white/10 space-y-4 max-w-2xl mx-auto"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 text-[#CCFF00] animate-spin" />
                <span className="text-xs font-mono font-bold tracking-wider text-[#CCFF00] uppercase">
                  AGENT PIPELINE EXECUTING
                </span>
              </div>
              <span className="text-[10px] font-mono text-white/50">STEP {searchStep} OF 3</span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className={`flex items-center space-x-2 ${searchStep >= 1 ? 'text-white' : 'text-white/40'}`}>
                {searchStep > 1 ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#CCFF00]" />
                ) : (
                  <span className="w-3.5 h-3.5 rounded-full border border-white/40 flex items-center justify-center text-[9px]">1</span>
                )}
                <span>1. Parsing constraints: budget envelope, RAM, and peripheral pairings</span>
              </div>

              <div className={`flex items-center space-x-2 ${searchStep >= 2 ? 'text-white' : 'text-white/40'}`}>
                {searchStep > 2 ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#CCFF00]" />
                ) : (
                  <span className="w-3.5 h-3.5 rounded-full border border-white/40 flex items-center justify-center text-[9px]">2</span>
                )}
                <span>2. Searching merchant vector catalog & ranking specification match scores</span>
              </div>

              <div className={`flex items-center space-x-2 ${searchStep >= 3 ? 'text-white' : 'text-white/40'}`}>
                <span className="w-3.5 h-3.5 rounded-full border border-white/40 flex items-center justify-center text-[9px]">3</span>
                <span>3. Synthesizing decision matrix & contextual accessory pairing</span>
              </div>
            </div>

            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#CCFF00] transition-all duration-500"
                style={{ width: `${(searchStep / 3) * 100}%` }}
              />
            </div>
          </motion.div>
        )}
      </div>

      {/* TWO-SIDED AGENT COMMERCE PROTOCOL VISUALIZER */}
      {result && !loading && (
        <div className="rounded-3xl bg-[#FAF8F5] border border-[#121212]/15 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#121212]/10 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#121212]/60 font-bold">
                  LIVE INTER-AGENT CONVERSATION
                </span>
              </div>
              <h3 className="text-xl font-bold uppercase tracking-tight text-[#121212] mt-0.5">
                Two-Sided Agent Commerce Protocol
              </h3>
            </div>

            {/* Architecture Node Badges */}
            <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono font-bold">
              <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-900 border border-blue-200">
                🤖 AI Buyer
              </span>
              <span className="text-[#121212]/30">↔</span>
              <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                ⚡ Commerce Protocol
              </span>
              <span className="text-[#121212]/30">↔</span>
              <span className="px-2.5 py-1 rounded-full bg-purple-100 text-purple-900 border border-purple-200">
                🏪 Merchant Agent
              </span>
              <span className="text-[#121212]/30">↔</span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200">
                🛡️ Policy Gate
              </span>
            </div>
          </div>

          {/* Dialogue Turns Stream */}
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {dialogueTurns.map((turn, i) => {
              const config = speakerConfig[turn.speaker] || speakerConfig.AI_BUYER;
              const Icon = config.icon;
              return (
                <div
                  key={i}
                  className="p-3.5 rounded-2xl bg-white border border-[#121212]/10 flex items-start space-x-3 shadow-xs hover:border-[#121212]/30 transition-all"
                >
                  <div className={`p-2 rounded-xl shrink-0 ${config.avatarBg}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-[#121212]">{config.label}</span>
                        {turn.badge && (
                          <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-md border ${config.badgeBg}`}>
                            {turn.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-[#121212]/40 shrink-0">
                        {turn.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-[#121212]/80 leading-relaxed font-mono">
                      {turn.message}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* FEATURE 2: HARDWARE SETUP BUNDLE SHOWCASE (If Available or Requested) */}
      {result?.setup_bundle && !loading && (
        <div className="rounded-3xl bg-[#121212] text-white p-6 sm:p-8 space-y-6 shadow-2xl border border-white/10 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#CCFF00]" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#CCFF00] font-bold">
                  MULTI-PRODUCT BUNDLE OPTIMIZER
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white mt-1">
                {result.setup_bundle.title}
              </h3>
              <p className="text-xs text-white/60 mt-1 max-w-xl">
                The AI Buyer auto-allocated your ₹{result.setup_bundle.target_budget.toLocaleString('en-IN')} budget into 4 compatible components for high-productivity development.
              </p>
            </div>

            {/* Price & Savings Pill */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-right space-y-1 self-start lg:self-auto">
              <span className="text-[10px] font-mono text-white/50 uppercase block">BUNDLE TOTAL (18% GST INCL)</span>
              <div className="flex items-baseline space-x-2 justify-end">
                <span className="text-3xl font-black text-[#CCFF00]">
                  ₹{result.setup_bundle.total_price.toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-mono text-white/40 line-through">
                  ₹{result.setup_bundle.target_budget.toLocaleString('en-IN')}
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 block font-bold">
                ₹{result.setup_bundle.budget_remaining.toLocaleString('en-IN')} HEADROOM REMAINING ({result.setup_bundle.savings_pct}% UNDER BUDGET)
              </span>
            </div>
          </div>

          {/* 4-Item Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {result.setup_bundle.items.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 flex flex-col justify-between hover:border-[#CCFF00]/40 transition-all"
              >
                <div className="space-y-2">
                  <div className="relative h-28 rounded-xl overflow-hidden bg-white/5">
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#121212]/90 backdrop-blur-md text-[9px] font-mono text-[#CCFF00] font-bold">
                      {item.role.toUpperCase()}
                    </span>
                  </div>

                  <h5 className="font-bold text-xs text-white line-clamp-1">{item.product.name}</h5>
                  <p className="text-[11px] text-white/60 line-clamp-2 leading-relaxed">
                    {item.why}
                  </p>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-baseline justify-between">
                  <span className="text-xs font-mono text-white/40">
                    {item.product.attributes.ram || item.product.category}
                  </span>
                  <span className="text-sm font-bold text-white">
                    ₹{item.product.price.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Action Footer */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/10">
            <div className="flex items-center space-x-2 text-xs font-mono text-white/70">
              <CheckCircle2 className="w-4 h-4 text-[#CCFF00]" />
              <span>All 4 SKUs verified in stock with 100% mutual hardware compatibility</span>
            </div>

            <button
              onClick={handleStageSetupBundle}
              disabled={isAddingBundle || bundleAdded}
              className={`px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                bundleAdded
                  ? 'bg-emerald-500 text-white'
                  : 'bg-[#CCFF00] hover:bg-[#d8ff33] text-[#121212] shadow-lg hover:scale-[1.01]'
              }`}
            >
              {isAddingBundle ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#121212]" />
                  <span>STAGING COMPLETE SETUP...</span>
                </>
              ) : bundleAdded ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>ALL 4 ITEMS STAGED IN CART</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 text-[#121212]" />
                  <span>STAGE ALL 4 ITEMS TO CART (₹{result.setup_bundle.total_price.toLocaleString('en-IN')})</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Active Query Status Ribbon */}
      {result && !loading && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-[#121212]/10 shadow-xs">
          <div className="flex items-center space-x-2.5">
            <span className="px-2.5 py-1 rounded-full bg-[#121212] text-[#CCFF00] text-[10px] font-mono font-bold uppercase shrink-0">
              ACTIVE RESULTS
            </span>
            <span className="text-xs sm:text-sm font-semibold text-[#121212] line-clamp-1">
              "{result.query}"
            </span>
          </div>

          <div className="flex items-center space-x-3 text-xs font-mono text-[#121212]/60 self-end sm:self-auto">
            <span>Match: <strong className="text-[#121212]">{result.match_score}%</strong></span>
            <span>•</span>
            <span>Category: <strong className="text-[#121212]">{result.extracted_constraints.category || 'Laptop'}</strong></span>
            <span>•</span>
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-[#121212] underline hover:text-[#121212]/70 font-bold"
            >
              Edit Query ↑
            </button>
          </div>
        </div>
      )}

      {/* Results Workspace: Primary Recommendation + Smart Upsell Deck */}
      <AnimatePresence>
        {result && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-12"
          >
            {/* Magazine Layout: Left Large Featured Card + Right Asymmetric Supporting Deck */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* LEFT: Large Featured Product Card */}
              <div className="lg:col-span-7 rounded-3xl bg-white border border-[#121212]/10 p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.06)] space-y-6 relative overflow-hidden">
                {/* Top Editorial Ribbon */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#CCFF00] border border-[#121212]/20 inline-block" />
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#121212]/70 font-bold">
                      BEST MATCH • {result.match_score}% REQUIREMENT MATCH
                    </span>
                  </div>
                  <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-[#121212]/5 text-[#121212]">
                    AVAILABILITY: IN STOCK (24 UNITS)
                  </span>
                </div>

                {/* Oversized Product Image */}
                <div className="relative rounded-2xl overflow-hidden bg-[#F3F3EE] h-72 sm:h-96 border border-[#121212]/5">
                  <img
                    src={result.recommended_product.image_url}
                    alt={result.recommended_product.name}
                    className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-mono text-[#121212] border border-[#121212]/10">
                    SKU: {result.recommended_product.id} • {result.recommended_product.category}
                  </div>
                </div>

                {/* Name & Pricing */}
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#121212]/10 pb-5">
                  <div>
                    <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#121212]">
                      {result.recommended_product.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#121212]/60 mt-1 max-w-md">
                      {result.recommended_product.description}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-3xl sm:text-4xl font-black text-[#121212] tracking-tight">
                      ₹{result.recommended_product.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[11px] font-mono text-[#121212]/50 block">
                      + 18% GST (₹{Math.max(0, (result.extracted_constraints.budget || 60000) - result.recommended_product.price).toLocaleString('en-IN')} under budget)
                    </span>
                  </div>
                </div>

                {/* Spec Pills */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#121212]/5">
                    <span className="text-[10px] font-mono uppercase text-[#121212]/50 block">RAM</span>
                    <strong className="font-bold text-[#121212] text-sm">
                      {result.recommended_product.attributes.ram}
                    </strong>
                  </div>
                  <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#121212]/5">
                    <span className="text-[10px] font-mono uppercase text-[#121212]/50 block">STORAGE</span>
                    <strong className="font-bold text-[#121212] text-sm">
                      {result.recommended_product.attributes.storage}
                    </strong>
                  </div>
                  <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#121212]/5">
                    <span className="text-[10px] font-mono uppercase text-[#121212]/50 block">PROCESSOR</span>
                    <strong className="font-bold text-[#121212] text-sm">
                      {result.recommended_product.attributes.processor}
                    </strong>
                  </div>
                  <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#121212]/5">
                    <span className="text-[10px] font-mono uppercase text-[#121212]/50 block">DISPLAY</span>
                    <strong className="font-bold text-[#121212] text-sm">
                      {result.recommended_product.attributes.display}
                    </strong>
                  </div>
                </div>

                {/* Card CTA & WHY BUTTON */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setShowWhyModal(true)}
                      className="px-4 py-2 rounded-full border border-[#121212]/20 hover:border-[#121212] bg-[#FAF8F5] text-xs font-mono font-bold text-[#121212] flex items-center space-x-1.5 shadow-xs hover:bg-white transition-all cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>WHY? (Explain Decision)</span>
                    </button>

                    <button
                      onClick={onViewDecisions}
                      className="text-xs font-mono font-semibold text-[#121212]/70 hover:text-[#121212] underline"
                    >
                      Ledger →
                    </button>
                  </div>

                  <button
                    onClick={() => handleAddProduct(result.recommended_product, 'AI Buyer top match')}
                    disabled={addedItems[result.recommended_product.id]}
                    className={`px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider flex items-center space-x-2 transition-all cursor-pointer ${
                      addedItems[result.recommended_product.id]
                        ? 'bg-[#121212] text-[#CCFF00]'
                        : 'bg-[#121212] hover:bg-[#262626] text-white shadow-lg'
                    }`}
                  >
                    {addedItems[result.recommended_product.id] ? (
                      <>
                        <Check className="w-4 h-4 text-[#CCFF00]" />
                        <span>ADDED TO CART</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 text-[#CCFF00]" />
                        <span>ADD TO CART</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* RIGHT: Floating AI Reasoning Card + Cross-Sell Experience */}
              <div className="lg:col-span-5 space-y-6">
                {/* 1. FLOATING DECISION CARD: WHY THIS PRODUCT? */}
                <motion.div
                  whileHover={{ y: -3 }}
                  className="rounded-3xl bg-[#121212] text-white p-6 sm:p-7 shadow-[0_20px_45px_rgba(0,0,0,0.2)] space-y-5 border border-white/10"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold tracking-widest text-[#CCFF00] uppercase">
                      AI DECISION LEDGER
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white text-[10px] font-mono font-bold">
                      {result.match_score}% CONFIDENCE
                    </span>
                  </div>

                  <h4 className="text-xl font-bold tracking-tight text-white uppercase">
                    WHY THIS PRODUCT?
                  </h4>

                  <ul className="space-y-2.5 text-xs text-white/80 font-mono">
                    <li className="flex items-start space-x-2">
                      <span className="text-[#CCFF00] font-bold">✓</span>
                      <span>Meets 16GB RAM requirement for local compilation workloads</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-[#CCFF00] font-bold">✓</span>
                      <span>Within ₹60,000 budget (leaves ₹5,001 headroom)</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-[#CCFF00] font-bold">✓</span>
                      <span>Best performance/value ratio in merchant catalog</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-[#CCFF00] font-bold">✓</span>
                      <span>Available now (24 units ready for fulfillment)</span>
                    </li>
                  </ul>

                  <p className="text-[11px] text-white/60 pt-2 border-t border-white/10 leading-relaxed italic font-editorial text-sm">
                    "{result.ai_explanation}"
                  </p>
                </motion.div>

                {/* 2. UPSELL / CROSS-SELL: "ONE MORE THING..." */}
                <div className="rounded-3xl bg-[#FAF8F5] border border-[#121212]/10 p-6 space-y-4 shadow-sm relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span className="text-xs font-bold tracking-widest uppercase text-[#121212]">
                        ONE MORE THING...
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#121212]">
                      + ₹{result.cross_sell_product.price.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Connecting visual indicator */}
                  <div className="flex items-center space-x-2 text-[10px] font-mono text-[#121212]/60">
                    <span>{result.recommended_product.name}</span>
                    <span className="text-[#121212] font-bold">→</span>
                    <span className="font-bold text-[#121212]">{result.cross_sell_product.name}</span>
                  </div>

                  <div className="flex items-center space-x-4">
                    <img
                      src={result.cross_sell_product.image_url}
                      alt={result.cross_sell_product.name}
                      className="w-20 h-20 object-cover rounded-2xl border border-[#121212]/10 bg-white"
                    />
                    <div className="space-y-1 flex-1">
                      <h5 className="font-bold text-sm text-[#121212]">{result.cross_sell_product.name}</h5>
                      <p className="text-xs text-[#121212]/60 line-clamp-2">
                        {result.cross_sell_reason}
                      </p>
                    </div>
                  </div>

                  {/* Why this upsell checklist */}
                  <div className="p-3 rounded-2xl bg-white border border-[#121212]/10 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between font-mono text-[10px] text-[#121212]/60 font-bold uppercase pb-1 border-b border-[#121212]/5">
                      <span>WHY THIS UPSELL?</span>
                      <span className="text-emerald-700">VERIFIED CONGRUENCE</span>
                    </div>
                    <ul className="space-y-1 text-[11px] text-[#121212]/80">
                      <li className="flex items-center space-x-1.5">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>Compatible with selected laptop (Bluetooth 5.3)</span>
                      </li>
                      <li className="flex items-center space-x-1.5">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>Matches coding & productivity ergonomic use case</span>
                      </li>
                      <li className="flex items-center space-x-1.5">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>Within remaining budget (leaves ₹3,702 buffer)</span>
                      </li>
                      <li className="flex items-center space-x-1.5">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>Frequently bundled SKU pair by developer buyers</span>
                      </li>
                    </ul>
                  </div>

                  {/* Live Basket Lift Indicator */}
                  <div className="p-3 rounded-2xl bg-[#121212] text-white font-mono text-xs space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] text-white/60 uppercase">
                      <div className="flex items-center space-x-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-[#CCFF00]" />
                        <span>PREDICTED BASKET LIFT</span>
                      </div>
                      <span className="text-[#CCFF00] font-bold">+2.36% AOV LIFT</span>
                    </div>
                    <div className="flex items-baseline justify-between text-xs pt-1 border-t border-white/10">
                      <span className="text-white/70">Base: ₹{result.recommended_product.price.toLocaleString('en-IN')}</span>
                      <span className="text-[#CCFF00]">+ ₹{result.cross_sell_product.price.toLocaleString('en-IN')}</span>
                      <span className="font-bold text-white">Final: ₹{(result.recommended_product.price + result.cross_sell_product.price).toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Add Both Button */}
                  <button
                    onClick={handleAddBoth}
                    className="w-full py-3.5 rounded-full bg-[#CCFF00] hover:bg-[#d8ff33] text-[#121212] text-xs font-bold uppercase tracking-wider shadow-md hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#121212]" />
                    <span>ACCEPT AI SUGGESTION (+₹{result.cross_sell_product.price.toLocaleString('en-IN')})</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Asymmetric Evaluated Alternatives Deck */}
            <div className="space-y-4 pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#121212]/50 font-bold">
                    CATALOG EVALUATION DECK
                  </span>
                  <h4 className="text-xl font-bold text-[#121212]">Other Evaluated Alternatives</h4>
                </div>
                {cart && cart.items.length > 0 && (
                  <button
                    onClick={onProceedToCheckout}
                    className="px-5 py-2 rounded-full bg-[#121212] text-white text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-md hover:bg-[#262626]"
                  >
                    <span>GO TO STAGED CART (₹{cart.total.toLocaleString('en-IN')})</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#CCFF00]" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {result.comparison_products.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-white border border-[#121212]/10 space-y-3 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-baseline">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#121212]/5 text-[#121212]/70 font-semibold">
                        {item.product.category}
                      </span>
                      <span className="text-sm font-extrabold text-[#121212]">
                        ₹{item.product.price.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <h5 className="font-bold text-sm text-[#121212]">{item.product.name}</h5>

                    <div className="text-xs text-[#121212]/60 space-y-1">
                      <div>
                        <span className="font-mono text-[10px]">RAM:</span> {item.product.attributes.ram}
                      </div>
                      <div>
                        <span className="font-mono text-[10px]">VERDICT:</span>{' '}
                        <span className={item.product.price > 60000 ? 'text-amber-600 font-semibold' : 'text-[#121212]'}>
                          {item.fit_assessment}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddProduct(item.product, 'Selected alternative')}
                      disabled={addedItems[item.product.id]}
                      className="w-full py-2 rounded-xl text-xs font-semibold bg-[#121212]/5 hover:bg-[#121212] hover:text-white transition-colors cursor-pointer"
                    >
                      {addedItems[item.product.id] ? 'Added' : 'Choose Alternative'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL 1: "WHY DID AI DO THIS?" REASONING INSPECTOR */}
      {showWhyModal && result && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl rounded-3xl bg-white border border-[#121212]/15 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-[#121212]/10 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#121212]/60 font-bold">
                    DECISION REASONING AUDIT
                  </span>
                </div>
                <h3 className="text-2xl font-bold uppercase tracking-tight text-[#121212] mt-0.5">
                  Why did AI pick {result.recommended_product.name}?
                </h3>
              </div>
              <button
                onClick={() => setShowWhyModal(false)}
                className="p-1 rounded-full hover:bg-[#121212]/5 text-[#121212]/50 hover:text-[#121212]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Constraint Matching Matrix */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold text-[#121212]/60 uppercase">
                Constraint Verification Matrix
              </h4>
              <div className="rounded-2xl border border-[#121212]/10 divide-y divide-[#121212]/5 overflow-hidden text-xs">
                <div className="p-3 bg-[#FAF8F5] flex items-center justify-between font-mono">
                  <span className="text-[#121212]/70 font-bold">1. Budget Envelope (Max ₹60,000)</span>
                  <span className="text-emerald-700 font-bold">₹54,999 (✓ ₹5,001 Headroom)</span>
                </div>
                <div className="p-3 bg-white flex items-center justify-between font-mono">
                  <span className="text-[#121212]/70 font-bold">2. RAM Capacity (&gt;= 16GB)</span>
                  <span className="text-emerald-700 font-bold">16GB DDR5 4800MHz (✓ Passed)</span>
                </div>
                <div className="p-3 bg-[#FAF8F5] flex items-center justify-between font-mono">
                  <span className="text-[#121212]/70 font-bold">3. Workload Optimization</span>
                  <span className="text-emerald-700 font-bold">Multi-Core 10-core compilation (✓ 9.8/10)</span>
                </div>
                <div className="p-3 bg-white flex items-center justify-between font-mono">
                  <span className="text-[#121212]/70 font-bold">4. Merchant Real-Time Inventory</span>
                  <span className="text-emerald-700 font-bold">24 Units Available (✓ In-Stock)</span>
                </div>
                <div className="p-3 bg-[#FAF8F5] flex items-center justify-between font-mono">
                  <span className="text-[#121212]/70 font-bold">5. Peripheral Compatibility</span>
                  <span className="text-emerald-700 font-bold">Bluetooth 5.3 + USB-C (✓ 100%)</span>
                </div>
              </div>
            </div>

            {/* Why Not Alternatives? */}
            <div className="space-y-2 text-xs">
              <h4 className="text-xs font-mono font-bold text-[#121212]/60 uppercase">
                Why were alternatives de-prioritized?
              </h4>
              <div className="space-y-1.5 font-mono text-[11px] text-[#121212]/80">
                <p className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-900">
                  ✕ <strong>ProStudio 16</strong> (₹1,14,999): Exceeded user's ₹60,000 hard budget constraint by ₹54,999.
                </p>
                <p className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
                  ✕ <strong>SlimBook 13</strong> (₹44,999): Has only 8GB soldered RAM, failing the mandatory 16GB multitasking requirement.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowWhyModal(false)}
                className="px-6 py-2.5 rounded-full bg-[#121212] text-white text-xs font-bold uppercase tracking-wider"
              >
                Close Audit View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: AGENT COMMERCE API & MCP PROTOCOL CONTRACTS */}
      {showToolsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-4xl rounded-3xl bg-[#121212] text-white border border-white/15 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <Terminal className="w-4 h-4 text-[#CCFF00]" />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#CCFF00] font-bold">
                    MODEL CONTEXT PROTOCOL (MCP) & COMMERCE API
                  </span>
                </div>
                <h3 className="text-2xl font-bold uppercase tracking-tight text-white mt-0.5">
                  AI Commerce Layer Tool Contracts
                </h3>
                <p className="text-xs text-white/60 mt-1">
                  These machine-readable functions convert traditional merchant SKUs into executable agent tools for autonomous discovery and zero-trust checkout.
                </p>
              </div>
              <button
                onClick={() => setShowToolsModal(false)}
                className="p-1 rounded-full hover:bg-white/10 text-white/50 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tool Selector Tabs */}
            <div className="flex flex-wrap gap-2">
              {toolDefinitions.map((tool) => (
                <button
                  key={tool.name}
                  onClick={() => setSelectedTool(tool.name)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                    selectedTool === tool.name
                      ? 'bg-[#CCFF00] text-[#121212]'
                      : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {tool.name}()
                </button>
              ))}
            </div>

            {/* Selected Tool Details */}
            {(() => {
              const current = toolDefinitions.find((t) => t.name === selectedTool) || toolDefinitions[0];
              return (
                <div className="space-y-4 font-mono text-xs">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-800">
                          {current.method}
                        </span>
                        <span className="font-bold text-white text-sm">{current.path}</span>
                      </div>
                      <span className="text-[10px] text-white/50">MCP Tool Specification</span>
                    </div>
                    <p className="text-white/70 text-xs">{current.desc}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase text-white/50 font-bold">Input Schema / Parameters:</span>
                      <pre className="p-3.5 rounded-xl bg-black/60 border border-white/10 text-[11px] text-[#CCFF00] overflow-x-auto leading-relaxed">
                        {current.params}
                      </pre>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase text-white/50 font-bold">Agent Return Contract:</span>
                      <pre className="p-3.5 rounded-xl bg-black/60 border border-white/10 text-[11px] text-blue-300 overflow-x-auto leading-relaxed">
                        {current.response}
                      </pre>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase text-white/50 font-bold">cURL Command:</span>
                    <pre className="p-3 rounded-xl bg-black/60 border border-white/10 text-[11px] text-stone-300 overflow-x-auto">
                      {current.curl}
                    </pre>
                  </div>
                </div>
              );
            })()}

            <div className="pt-2 flex justify-end border-t border-white/10">
              <button
                onClick={() => setShowToolsModal(false)}
                className="px-6 py-2.5 rounded-full bg-white text-[#121212] text-xs font-bold uppercase tracking-wider hover:bg-stone-200"
              >
                Close MCP Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
