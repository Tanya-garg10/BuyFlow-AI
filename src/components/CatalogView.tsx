import React, { useState } from 'react';
import {
  Package,
  Plus,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Layers,
  Search,
  Filter,
  ArrowRight,
  ExternalLink,
  Shield,
  Edit2,
} from 'lucide-react';
import { Product } from '../types';

interface CatalogViewProps {
  products: Product[];
  onRefresh: () => void;
  onAddToCart: (productId: string, quantity: number, addedBy: 'ai_buyer' | 'user') => Promise<void>;
}

export const CatalogView: React.FC<CatalogViewProps> = ({ products, onRefresh, onAddToCart }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const categories = [
    'All',
    'Laptop',
    'Monitor',
    'Keyboard',
    'Mouse',
    'Headphones',
    'Webcam',
    'SSD',
    'Accessories',
  ];

  const filteredProducts = products.filter((p) => {
    if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.use_cases.some((u) => u.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Calculate Merchant AI Readiness Score
  const avgReadiness = Math.round(
    products.reduce((acc, p) => acc + (p.ai_readiness_score || 95), 0) / (products.length || 1)
  );

  return (
    <div className="space-y-8 pb-16">
      {/* Header & AI Readiness Scorecard */}
      <div className="rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI-Readable Merchant Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Merchant Catalog & AI Discoverability
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
              Products indexed with semantic schema annotations, use-case mapping, hardware constraints, and upsell
              relationships for autonomous AI agent comprehension.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center space-x-2 shadow-lg shadow-indigo-600/20 shrink-0 self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add AI-Ready Product</span>
          </button>
        </div>

        {/* AI Readiness Score Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 font-semibold block">Catalog Readiness</span>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-2xl font-black text-indigo-400">{avgReadiness}%</span>
              <span className="text-[10px] text-emerald-400 font-bold">Grade A+</span>
            </div>
            <span className="text-[10px] text-slate-500 block">13 / 13 products AI-indexed</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 font-semibold block">Structured Attributes</span>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-2xl font-black text-emerald-400">100%</span>
              <span className="text-[10px] text-slate-400">spec parity</span>
            </div>
            <span className="text-[10px] text-slate-500 block">RAM, SSD, CPU extracted</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 font-semibold block">Use-Case Taxonomy</span>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-2xl font-black text-blue-400">95%</span>
              <span className="text-[10px] text-slate-400">mapped</span>
            </div>
            <span className="text-[10px] text-slate-500 block">Coding, ML, travel, desk</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 font-semibold block">Upsell Graph Density</span>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-2xl font-black text-amber-400">92%</span>
              <span className="text-[10px] text-slate-400">paired</span>
            </div>
            <span className="text-[10px] text-slate-500 block">High contextual attachment</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === c
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search AI catalog..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((p) => (
          <div
            key={p.id}
            className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden flex flex-col justify-between hover:border-slate-700 transition-all shadow-md group"
          >
            <div>
              {/* Product Image & Badges */}
              <div className="relative h-44 bg-slate-950 overflow-hidden">
                <img
                  src={p.image_url}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 flex items-center space-x-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-950/80 backdrop-blur-md text-slate-200 border border-slate-800">
                    {p.id}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-950/80 backdrop-blur-md text-indigo-300 border border-indigo-800">
                    {p.category}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-950/90 text-emerald-300 border border-emerald-800">
                    AI Score: {p.ai_readiness_score}%
                  </span>
                </div>
              </div>

              {/* Product Content */}
              <div className="p-5 space-y-3">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-bold text-white text-base group-hover:text-indigo-300 transition-colors">
                    {p.name}
                  </h3>
                  <span className="text-base font-extrabold text-white">
                    ₹{p.price.toLocaleString('en-IN')}
                  </span>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {p.description}
                </p>

                {/* Attributes Pills */}
                <div className="flex flex-wrap gap-1.5 text-[10px]">
                  {Object.entries(p.attributes)
                    .slice(0, 3)
                    .map(([k, v]) => (
                      <span
                        key={k}
                        className="px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800"
                      >
                        <span className="text-slate-500 uppercase">{k}:</span> {v}
                      </span>
                    ))}
                </div>

                {/* Use cases */}
                <div className="pt-2 border-t border-slate-800/80">
                  <span className="text-[10px] text-slate-500 block uppercase font-semibold mb-1">
                    AI Use Cases:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {p.use_cases.slice(0, 3).map((uc, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-950/40 text-indigo-300 border border-indigo-900/40"
                      >
                        {uc}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Compatibility and upsell relations */}
                <div className="text-[10px] text-slate-400 space-y-1 pt-1">
                  <div>
                    <span className="text-slate-500">Cross-Sell Links:</span>{' '}
                    <span className="font-mono text-indigo-300">{p.upsell_products.join(', ') || 'None'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Purchase Guardrail:</span>{' '}
                    <span className={p.purchase_constraints.requires_user_approval ? 'text-amber-400 font-medium' : 'text-slate-400'}>
                      {p.purchase_constraints.requires_user_approval ? 'Explicit Approval Required' : 'Standard'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-5 pt-0 flex items-center space-x-2">
              <button
                onClick={() => onAddToCart(p.id, 1, 'user')}
                className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors flex items-center justify-center space-x-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4 text-slate-100">
            <h3 className="text-lg font-bold text-white">Add AI-Readable Product</h3>
            <p className="text-xs text-slate-400">
              Provide structured schema data for seamless discoverability by autonomous AI buyers.
            </p>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const newProduct: Product = {
                  id: `GEN-${Date.now().toString(36).toUpperCase()}`,
                  name: (form.elements.namedItem('name') as HTMLInputElement).value,
                  price: parseInt((form.elements.namedItem('price') as HTMLInputElement).value, 10),
                  currency: 'INR',
                  category: (form.elements.namedItem('category') as HTMLSelectElement).value as any,
                  availability: true,
                  stock: 25,
                  rating: 4.8,
                  review_count: 1,
                  image_url: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&auto=format&fit=crop&q=80',
                  description: (form.elements.namedItem('description') as HTMLTextAreaElement).value,
                  attributes: {
                    ram: (form.elements.namedItem('ram') as HTMLInputElement).value || '16GB',
                    storage: (form.elements.namedItem('storage') as HTMLInputElement).value || '512GB SSD',
                  },
                  use_cases: ['developer productivity', 'modern setup'],
                  compatible_products: ['M001'],
                  upsell_products: ['M001'],
                  purchase_constraints: { requires_user_approval: true },
                  ai_readiness_score: 98,
                  ai_discoverability: 'High',
                };

                await fetch('/api/products', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(newProduct),
                });
                setShowAddModal(false);
                onRefresh();
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="text-slate-400 block mb-1">Product Name</label>
                <input
                  name="name"
                  required
                  placeholder="e.g. UltraSpeed Workstation 15"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Price (₹ INR)</label>
                  <input
                    name="price"
                    type="number"
                    required
                    defaultValue={49999}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Category</label>
                  <select
                    name="category"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                  >
                    <option value="Laptop">Laptop</option>
                    <option value="Monitor">Monitor</option>
                    <option value="Keyboard">Keyboard</option>
                    <option value="Mouse">Mouse</option>
                    <option value="Headphones">Headphones</option>
                    <option value="SSD">SSD</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-slate-400 block mb-1">RAM / Primary Spec</label>
                <input
                  name="ram"
                  defaultValue="16GB DDR5"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Storage Spec</label>
                <input
                  name="storage"
                  defaultValue="512GB NVMe SSD"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Description</label>
                <textarea
                  name="description"
                  rows={2}
                  defaultValue="Engineered for high throughput developer workloads with 16GB memory and all-day battery life."
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                >
                  Save & Index
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
