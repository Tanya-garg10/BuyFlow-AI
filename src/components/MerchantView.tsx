import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  CheckCircle2,
  ArrowRight,
  Tag,
  Database,
  Cpu,
  Layers,
  Code,
  Terminal,
  Check,
  X,
  Shield,
  Zap,
  Bot,
  ShoppingBag,
} from 'lucide-react';
import { Product } from '../types';

interface MerchantViewProps {
  products: Product[];
  onAddProduct: (prod: Partial<Product>) => Promise<void>;
  onSelectProduct: (p: Product) => void;
}

export const MerchantView: React.FC<MerchantViewProps> = ({
  products,
  onAddProduct,
  onSelectProduct,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showLayerModal, setShowLayerModal] = useState(false);

  // Form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Laptop');
  const [newPrice, setNewPrice] = useState('49999');
  const [newDesc, setNewDesc] = useState('');
  const [newRam, setNewRam] = useState('16GB');
  const [newStorage, setNewStorage] = useState('512GB SSD');

  const categories = ['ALL', 'Laptop', 'Peripherals', 'Audio', 'Office'];

  const filtered = products.filter((p) => {
    if (selectedCategory === 'ALL') return true;
    return p.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    await onAddProduct({
      name: newTitle,
      category: newCategory,
      price: Number(newPrice) || 999,
      description: newDesc || 'AI-catalog item optimized for autonomous procurement.',
      image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
      attributes: {
        ram: newRam,
        storage: newStorage,
        processor: 'Octa-Core Pro',
        display: '14-inch IPS',
      },
      use_cases: ['coding', 'productivity', 'office'],
      compatible_products: [],
      upsell_products: ['AC001'],
      purchase_constraints: { min_quantity: 1, max_quantity: 5, stock_available: 30 },
      ai_readiness_score: 95,
      ai_discoverability: 'High',
    });

    setShowAddModal(false);
    setNewTitle('');
    setNewDesc('');
  };

  return (
    <div className="pt-32 sm:pt-36 lg:pt-40 pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
      {/* Editorial Headline & AI Readiness Score */}
      <div className="border-b border-[#121212]/10 pb-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-4">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#121212]/50 font-bold block">
            MERCHANT KNOWLEDGE GRAPH • TRACK 01
          </span>
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-[#121212] uppercase leading-[0.95]">
            MAKE YOUR STORE
            <br />
            <span className="font-editorial lowercase italic font-normal tracking-normal text-[#121212]/80">
              ready for
            </span>{' '}
            AI.
          </h1>
          <p className="text-base text-[#121212]/60 max-w-lg leading-relaxed">
            Your catalog can be understood by AI buyers. Convert passive static SKU listings into machine-queryable vector knowledge with zero-trust checkout capability.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 rounded-full bg-[#121212] hover:bg-[#262626] text-white text-xs font-bold uppercase tracking-wider flex items-center space-x-2 shadow-lg cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#CCFF00]" />
              <span>INDEX NEW PRODUCT</span>
            </button>

            <button
              onClick={() => setShowLayerModal(true)}
              className="px-5 py-3 rounded-full bg-white hover:bg-[#FAF8F5] border border-[#121212]/20 text-[#121212] text-xs font-mono font-bold uppercase tracking-wider flex items-center space-x-2 cursor-pointer shadow-xs"
            >
              <Terminal className="w-4 h-4 text-[#121212]" />
              <span>HUMAN → AI LAYER EXPLORER</span>
            </button>
          </div>
        </div>

        {/* Big Visual AI Readiness Score Display */}
        <div className="lg:col-span-5 p-8 sm:p-10 rounded-3xl bg-[#121212] text-white shadow-[0_25px_60px_rgba(0,0,0,0.2)] space-y-6">
          <div className="flex items-baseline justify-between border-b border-white/10 pb-4">
            <div>
              <span className="text-[10px] font-mono text-[#CCFF00] uppercase tracking-widest font-bold block">
                CATALOG HEALTH
              </span>
              <span className="text-xs text-white/60">AI Readiness Score</span>
            </div>
            <span className="text-6xl sm:text-7xl font-black text-[#CCFF00] tracking-tight">
              96%
            </span>
          </div>

          {/* Visual Readiness Progress Bars */}
          <div className="space-y-3.5 font-mono text-xs">
            <div className="space-y-1">
              <div className="flex justify-between text-white/80">
                <span>STRUCTURED ATTRIBUTES</span>
                <span className="font-bold text-[#CCFF00]">100%</span>
              </div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-[#CCFF00] w-full" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-white/80">
                <span>USE CASES & WORKLOADS</span>
                <span className="font-bold text-[#CCFF00]">95%</span>
              </div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-[#CCFF00] w-[95%]" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-white/80">
                <span>PRODUCT RELATIONSHIPS (CROSS-SELL)</span>
                <span className="font-bold text-[#CCFF00]">92%</span>
              </div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-[#CCFF00] w-[92%]" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-white/80">
                <span>REAL-TIME STOCK & CONSTRAINTS</span>
                <span className="font-bold text-[#CCFF00]">98%</span>
              </div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-[#CCFF00] w-[98%]" />
              </div>
            </div>
          </div>

          <p className="text-[11px] text-white/50 pt-2 border-t border-white/10 italic">
            "Your catalog is directly readable by autonomous purchasing agents."
          </p>
        </div>
      </div>

      {/* FEATURE 1: "AI COMMERCE READY" HIGHLIGHT SECTION */}
      <div className="rounded-3xl bg-[#FAF8F5] border border-[#121212]/15 p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#121212]/10 pb-5">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#CCFF00] border border-[#121212]/20 inline-block" />
              <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-[#121212]/60">
                AI COMMERCE READY
              </span>
            </div>
            <h3 className="text-2xl font-bold uppercase tracking-tight text-[#121212] mt-1">
              Catalog Intelligence: 96%
            </h3>
            <p className="text-xs text-[#121212]/70 mt-1 max-w-xl">
              Merchant SKU listings have been converted from passive HTML product pages into an active semantic layer queryable by AI buyer agents.
            </p>
          </div>

          <button
            onClick={() => setShowLayerModal(true)}
            className="px-5 py-2.5 rounded-full bg-[#121212] text-[#CCFF00] text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#262626] transition-all shadow-md self-start lg:self-auto cursor-pointer"
          >
            Inspect AI Commerce Architecture →
          </button>
        </div>

        {/* 5-Point Readiness Checklist */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 font-mono text-xs">
          <div className="p-3.5 rounded-2xl bg-white border border-[#121212]/10 space-y-1">
            <div className="flex items-center space-x-1.5 text-emerald-600 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Structured Attributes</span>
            </div>
            <p className="text-[11px] text-[#121212]/60 leading-snug">
              RAM, storage, display, and processor extracted as numerical filters.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-[#121212]/10 space-y-1">
            <div className="flex items-center space-x-1.5 text-emerald-600 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Product Relations</span>
            </div>
            <p className="text-[11px] text-[#121212]/60 leading-snug">
              Mutual hardware compatibility and cross-sell affinities mapped.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-[#121212]/10 space-y-1">
            <div className="flex items-center space-x-1.5 text-emerald-600 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Use Cases & Tasks</span>
            </div>
            <p className="text-[11px] text-[#121212]/60 leading-snug">
              Workload tags (coding, 4K rendering, remote work) indexed for prompt intent.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-[#121212]/10 space-y-1">
            <div className="flex items-center space-x-1.5 text-emerald-600 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Real-Time Stock</span>
            </div>
            <p className="text-[11px] text-[#121212]/60 leading-snug">
              Live unit inventory counts verified before staging into buyer carts.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-[#121212]/10 space-y-1">
            <div className="flex items-center space-x-1.5 text-emerald-600 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Purchase Gates</span>
            </div>
            <p className="text-[11px] text-[#121212]/60 leading-snug">
              Order limits and automated financial safety thresholds enforced.
            </p>
          </div>
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2 text-xs">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-4 py-2 rounded-full font-bold uppercase tracking-wider transition-all cursor-pointer ${
                selectedCategory === c
                  ? 'bg-[#121212] text-[#CCFF00]'
                  : 'bg-white text-[#121212]/60 hover:text-[#121212] border border-[#121212]/10'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <span className="text-xs font-mono text-[#121212]/50">
          Showing {filtered.length} indexed AI-ready items
        </span>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((product) => (
          <div
            key={product.id}
            onClick={() => onSelectProduct(product)}
            className="cursor-pointer group p-6 rounded-3xl bg-white border border-[#121212]/10 shadow-[0_15px_35px_rgba(0,0,0,0.04)] hover:border-[#121212] transition-all space-y-4"
          >
            {/* Image */}
            <div className="relative h-48 rounded-2xl overflow-hidden bg-[#FAF8F5]">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-mono font-bold text-[#121212]">
                {product.category}
              </div>
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-[#121212] text-[#CCFF00] text-[9px] font-mono font-bold">
                {product.ai_readiness_score}% AI READY
              </div>
            </div>

            {/* Details */}
            <div className="space-y-1">
              <h3 className="font-bold text-lg text-[#121212] tracking-tight group-hover:text-black">
                {product.name}
              </h3>
              <p className="text-xs text-[#121212]/60 line-clamp-2">
                {product.description}
              </p>
            </div>

            {/* Specs & Price */}
            <div className="pt-3 border-t border-[#121212]/5 flex items-baseline justify-between">
              <div>
                <span className="text-xl font-black text-[#121212]">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] font-mono text-[#121212]/40 block">
                  STOCK: {product.purchase_constraints.stock_available}
                </span>
              </div>

              <div className="text-right text-[10px] font-mono text-[#121212]/70">
                <span>{product.attributes.ram || 'SKU ' + product.id}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL 1: HUMAN CATALOG → AI-READABLE LAYER CONVERSION EXPLORER */}
      {showLayerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-4xl rounded-3xl bg-[#121212] text-white border border-white/15 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <Terminal className="w-4 h-4 text-[#CCFF00]" />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#CCFF00] font-bold">
                    CATALOG TRANSFORMATION ENGINE
                  </span>
                </div>
                <h3 className="text-2xl font-bold uppercase tracking-tight text-white mt-0.5">
                  Human-Readable Catalog → AI-Readable Layer
                </h3>
              </div>
              <button
                onClick={() => setShowLayerModal(false)}
                className="p-1 rounded-full hover:bg-white/10 text-white/50 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Flow Architecture Diagram */}
            <div className="p-4 rounded-2xl bg-black/50 border border-white/10 font-mono text-xs text-center space-y-2">
              <div className="text-[11px] text-white/60 uppercase font-bold">Execution Architecture Pipeline</div>
              <div className="py-2 text-stone-300 text-xs font-mono leading-relaxed bg-black/60 rounded-xl p-3 border border-white/5 overflow-x-auto text-left sm:text-center">
                <pre className="inline-block text-left text-[11px]">
{`Merchant Catalog (Static SKUs, Raw HTML & Text)
       ↓
AI Commerce Layer (MCP Server + Tool Routing)
       ↓
┌────────────────────────────────────────────────────────┐
│  • search_products(query, constraints)                 │
│  • compare_products(product_ids)                       │
│  • get_product(product_id)                             │
│  • build_setup_bundle(budget)                          │
│  • suggest_upsell(product_id)                          │
│  • create_cart(items, reasoning)                       │
│  • checkout() & payment_status()                       │
└────────────────────────────────────────────────────────┘
       ↓
AI Buyer Agent (Autonomous Discovery & Staging)`}
                </pre>
              </div>
            </div>

            {/* Side-by-Side Comparison: Human vs AI Representation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
              {/* Human Representation */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between text-[10px] uppercase font-bold text-white/50 pb-1 border-b border-white/10">
                  <span>Traditional Merchant SKU</span>
                  <span className="text-red-400">Human-Only (Unstructured)</span>
                </div>
                <div className="space-y-2 text-[11px] text-stone-300">
                  <p className="font-bold text-white">Title: ProBook 14 Laptop</p>
                  <p className="text-stone-400 leading-relaxed">
                    "A great laptop for modern professionals. Sleek aluminum unibody with fast multi-core processor, lots of memory, and vibrant display. Perfect for work and travel."
                  </p>
                  <p className="text-[10px] text-stone-500 pt-1 border-t border-white/5">
                    Problem: Autonomous agents cannot compute mathematical budget headroom, exact compiler RAM fit, or guaranteed accessory pinout compatibility from prose.
                  </p>
                </div>
              </div>

              {/* AI Layer Representation */}
              <div className="p-4 rounded-2xl bg-white/5 border border-[#CCFF00]/30 space-y-2.5">
                <div className="flex items-center justify-between text-[10px] uppercase font-bold text-[#CCFF00] pb-1 border-b border-white/10">
                  <span>AI Commerce Ready SKU</span>
                  <span className="text-[#CCFF00]">Machine-Callable (Structured)</span>
                </div>
                <pre className="p-2.5 rounded-xl bg-black/60 border border-white/10 text-[10px] text-[#CCFF00] overflow-x-auto leading-relaxed">
{`{
  "id": "L001",
  "name": "ProBook 14",
  "price": 54999,
  "attributes": {
    "ram_gb": 16,
    "storage_type": "NVMe Gen4",
    "processor_cores": 10
  },
  "workload_scores": {
    "coding": 0.98,
    "creative_4k": 0.72
  },
  "compatible_accessories": ["M001", "K001"],
  "stock_level": 24,
  "max_order_quantity": 5
}`}
                </pre>
              </div>
            </div>

            <div className="pt-2 flex justify-end border-t border-white/10">
              <button
                onClick={() => setShowLayerModal(false)}
                className="px-6 py-2.5 rounded-full bg-white text-[#121212] text-xs font-bold uppercase tracking-wider hover:bg-stone-200 cursor-pointer"
              >
                Close Explorer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white border border-[#121212]/10 p-8 shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-[#121212]/10 pb-4">
              <h3 className="text-xl font-bold uppercase tracking-tight text-[#121212]">
                INDEX NEW AI-READY SKU
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-xs font-mono text-[#121212]/40 hover:text-[#121212] cursor-pointer"
              >
                CLOSE [ESC]
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-[#121212]/70 uppercase font-mono text-[10px] mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. UltraBook Air 15"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#121212]/20 focus:border-[#121212] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#121212]/70 uppercase font-mono text-[10px] mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#121212]/20 focus:border-[#121212] focus:outline-none bg-white"
                  >
                    <option>Laptop</option>
                    <option>Peripherals</option>
                    <option>Audio</option>
                    <option>Office</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#121212]/70 uppercase font-mono text-[10px] mb-1">
                    Price (INR)
                  </label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#121212]/20 focus:border-[#121212] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#121212]/70 uppercase font-mono text-[10px] mb-1">
                    RAM Spec
                  </label>
                  <input
                    type="text"
                    value={newRam}
                    onChange={(e) => setNewRam(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#121212]/20 focus:border-[#121212] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#121212]/70 uppercase font-mono text-[10px] mb-1">
                    Storage Spec
                  </label>
                  <input
                    type="text"
                    value={newStorage}
                    onChange={(e) => setNewStorage(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#121212]/20 focus:border-[#121212] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#121212]/70 uppercase font-mono text-[10px] mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Describe hardware attributes, intended users, and key use cases..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#121212]/20 focus:border-[#121212] focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 rounded-full border border-[#121212]/20 text-[#121212] font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#121212] text-[#CCFF00] font-bold uppercase tracking-wider shadow-lg cursor-pointer"
                >
                  Publish to AI Graph
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
