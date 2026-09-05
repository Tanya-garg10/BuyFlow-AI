import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { store } from './server/store';
import { agentService } from './server/agent';
import { policyEngine } from './server/policy';
import { razorpayService } from './server/razorpay';
import { Product } from './src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // ----------------------------------------------------
  // API ROUTES (Always placed before Vite middleware)
  // ----------------------------------------------------

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'BuyFlow AI',
      track: 'Razorpay AI Buildathon — Track 01',
      razorpay_mode: razorpayService.isMockMode() ? 'MOCK_TEST' : 'RAZORPAY_TEST',
      key_id: razorpayService.getPublicKey(),
    });
  });

  // 1. Catalog Endpoints
  app.get('/api/products', (req, res) => {
    const { category, search } = req.query;
    let list = store.products;
    if (category && typeof category === 'string' && category !== 'All') {
      list = list.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    res.json(list);
  });

  app.get('/api/products/:id', (req, res) => {
    const product = store.products.find((p) => p.id === req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  });

  app.post('/api/products', (req, res) => {
    const newProduct: Product = req.body;
    if (!newProduct.id || !newProduct.name || !newProduct.price) {
      return res.status(400).json({ error: 'Missing required product attributes' });
    }
    const idx = store.products.findIndex((p) => p.id === newProduct.id);
    if (idx >= 0) {
      store.products[idx] = newProduct;
    } else {
      store.products.push(newProduct);
    }
    store.recordEvent({
      event_type: 'CATALOG_SEARCH',
      description: `Catalog product updated: ${newProduct.name} (AI Readiness: ${newProduct.ai_readiness_score || 95}%)`,
      agent: 'Merchant Catalog',
      status: 'SUCCESS',
      metadata: { product_id: newProduct.id },
    });
    res.json(newProduct);
  });

  // 2. AI Buyer Agent Endpoints
  app.post('/api/agent/search', async (req, res) => {
    try {
      const { query, cart_id } = req.body;
      if (!query) {
        return res.status(400).json({ error: 'Search query is required' });
      }
      const response = await agentService.processRequest({ query, cart_id });
      res.json(response);
    } catch (err: any) {
      console.error('Agent search error:', err);
      res.status(500).json({ error: err.message || 'Agent failed to process query' });
    }
  });

  app.post('/api/agent/recommend', (req, res) => {
    const { product_id } = req.body;
    const upsell = agentService.suggestUpsell(product_id);
    res.json({ upsell });
  });

  app.post('/api/agent/setup', (req, res) => {
    const { budget = 80000 } = req.body;
    const bundle = agentService.buildSetupBundle(Number(budget) || 80000);
    res.json({ bundle });
  });

  app.get('/api/agent/tools', (req, res) => {
    const tools = agentService.getToolDefinitions();
    res.json({ tools });
  });

  // Bulk add items (e.g. for "Build My Setup" bundle)
  app.post('/api/cart/bulk', (req, res) => {
    const { cart_id, items } = req.body;
    const cart = store.getOrCreateCart(cart_id);

    if (Array.isArray(items)) {
      for (const item of items) {
        const product = store.products.find((p) => p.id === item.product_id);
        if (product) {
          const existingIdx = cart.items.findIndex((ci) => ci.product.id === product.id);
          if (existingIdx >= 0) {
            cart.items[existingIdx].quantity += item.quantity || 1;
          } else {
            cart.items.push({
              product,
              quantity: item.quantity || 1,
              added_by: item.added_by || 'ai_buyer',
              contextual_note: item.contextual_note || 'Auto-bundled by AI Setup Builder',
            });
          }
        }
      }
      store.updateCartTotals(cart);
      store.recordEvent({
        event_type: 'CART_CREATED',
        description: `Setup Bundle loaded into Cart ${cart.id} (${items.length} hardware items). Total with 18% GST: ₹${cart.total.toLocaleString('en-IN')}`,
        agent: 'AI Buyer',
        status: 'SUCCESS',
        metadata: { cart_id: cart.id, total: cart.total, items_count: cart.items.length },
      });
    }

    res.json(cart);
  });

  // 3. Cart Endpoints
  app.get('/api/cart/:id', (req, res) => {
    const cart = store.getOrCreateCart(req.params.id);
    res.json(cart);
  });

  app.post('/api/cart', (req, res) => {
    const { cart_id, product_id, quantity = 1, added_by = 'ai_buyer', contextual_note } = req.body;
    const cart = store.getOrCreateCart(cart_id);

    const product = store.products.find((p) => p.id === product_id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Policy check for adding to cart
    const policyResult = policyEngine.evaluate({
      action: 'add_to_cart',
      actor: added_by === 'ai_buyer' ? 'AI_AGENT' : 'USER_APPROVER',
      cart_id: cart.id,
    });

    if (!policyResult.allowed) {
      return res.status(403).json({ error: 'Policy violation', policyResult });
    }

    const existingIdx = cart.items.findIndex((item) => item.product.id === product_id);
    if (existingIdx >= 0) {
      cart.items[existingIdx].quantity += quantity;
    } else {
      cart.items.push({
        product,
        quantity,
        added_by,
        contextual_note: contextual_note || (added_by === 'ai_buyer' ? 'Added by AI Buyer based on selected specs' : 'Manually added by user'),
      });
    }

    store.updateCartTotals(cart);

    store.recordEvent({
      event_type: 'CART_CREATED',
      description: `Cart ${cart.id} updated: Added ${quantity}x ${product.name}. Subtotal: ₹${cart.subtotal.toLocaleString('en-IN')}, Total with 18% GST: ₹${cart.total.toLocaleString('en-IN')}`,
      agent: added_by === 'ai_buyer' ? 'AI Buyer' : 'User (Approver)',
      status: 'SUCCESS',
      metadata: { cart_id: cart.id, total: cart.total, items_count: cart.items.length },
    });

    res.json(cart);
  });

  app.delete('/api/cart/:cartId/items/:productId', (req, res) => {
    const { cartId, productId } = req.params;
    const cart = store.carts.get(cartId);
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    cart.items = cart.items.filter((item) => item.product.id !== productId);
    store.updateCartTotals(cart);
    res.json(cart);
  });

  // 4. Policy Guardrail Evaluation Endpoint
  app.post('/api/payment/policy-check', (req, res) => {
    const { action, amount, user_confirmed, actor = 'AI_AGENT', cart_id } = req.body;
    const evaluation = policyEngine.evaluate({
      action,
      amount,
      user_confirmed,
      actor,
      cart_id,
    });
    res.json(evaluation);
  });

  // 5. Razorpay Payment Endpoints
  app.get('/api/payment/config', (req, res) => {
    res.json({
      key_id: razorpayService.getPublicKey(),
      is_mock: razorpayService.isMockMode(),
    });
  });

  app.post('/api/payment/create-order', async (req, res) => {
    try {
      const { cart_id, amount, currency = 'INR', user_confirmed = false } = req.body;

      // Ensure explicit approval gate was satisfied!
      const policyCheck = policyEngine.evaluate({
        action: 'initiate_payment',
        amount,
        user_confirmed,
        actor: user_confirmed ? 'USER_APPROVER' : 'AI_AGENT',
        cart_id,
      });

      if (!policyCheck.allowed) {
        return res.status(403).json({
          error: 'Payment blocked by Policy Engine. Explicit user approval is mandatory before money movement.',
          policy: policyCheck,
        });
      }

      const orderData = await razorpayService.createOrder({
        cart_id,
        amount,
        currency,
      });

      res.json(orderData);
    } catch (err: any) {
      console.error('Create order error:', err);
      res.status(500).json({ error: err.message || 'Failed to create payment order' });
    }
  });

  app.post('/api/payment/verify', (req, res) => {
    try {
      const {
        order_id,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        simulate_failure = false,
        failure_scenario = 'card_declined',
        actual_failure = false,
        failure_reason,
        failure_code,
        in_app_checkout = false,
      } = req.body;

      const result = razorpayService.verifyAndConfirm({
        order_id,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        simulate_failure,
        failure_scenario,
        actual_failure,
        failure_reason,
        failure_code,
        in_app_checkout,
      });

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.json(result);
    } catch (err: any) {
      console.error('Verify payment error:', err);
      res.status(500).json({ error: err.message || 'Failed to verify payment' });
    }
  });

  // 6. Orders, Audit, Decisions, Analytics Endpoints
  app.get('/api/orders', (req, res) => {
    res.json(store.orders);
  });

  app.get('/api/audit', (req, res) => {
    const { type } = req.query;
    let list = store.events;
    if (type && typeof type === 'string' && type !== 'ALL') {
      list = list.filter((e) => e.event_type === type);
    }
    res.json(list);
  });

  app.get('/api/decisions', (req, res) => {
    res.json(store.decisions);
  });

  app.get('/api/analytics', (req, res) => {
    const metrics = store.getAnalytics();

    // Generate chart data based on store state
    const revenueByCategory = [
      { category: 'Laptops', revenue: 198000, orders: 4 },
      { category: 'Monitors', revenue: 54000, orders: 3 },
      { category: 'Mice', revenue: 18500, orders: 12 },
      { category: 'Keyboards', revenue: 24000, orders: 5 },
      { category: 'Accessories', revenue: 14000, orders: 6 },
    ];

    const conversionFunnel = [
      { step: 'AI Natural Requests', count: metrics.ai_shopping_sessions, percentage: 100 },
      { step: 'Catalog Discovery', count: Math.round(metrics.ai_shopping_sessions * 0.92), percentage: 92 },
      { step: 'Cart Creation', count: Math.round(metrics.ai_shopping_sessions * (metrics.cart_creation_rate / 100)), percentage: metrics.cart_creation_rate },
      { step: 'Policy Approval Requested', count: Math.round(metrics.ai_shopping_sessions * 0.42), percentage: 42 },
      { step: 'User Approved Payment', count: Math.round(metrics.ai_shopping_sessions * 0.38), percentage: 38 },
      { step: 'Confirmed Orders', count: Math.round(metrics.ai_shopping_sessions * (metrics.checkout_conversion / 100)), percentage: metrics.checkout_conversion },
    ];

    const sessionsOverTime = [
      { date: 'Day -6', sessions: 18, conversions: 3 },
      { date: 'Day -5', sessions: 24, conversions: 4 },
      { date: 'Day -4', sessions: 32, conversions: 6 },
      { date: 'Day -3', sessions: 28, conversions: 5 },
      { date: 'Day -2', sessions: 39, conversions: 7 },
      { date: 'Day -1', sessions: 45, conversions: 8 },
      { date: 'Today', sessions: metrics.ai_shopping_sessions, conversions: store.orders.filter(o => o.status === 'CONFIRMED').length + 7 },
    ];

    const upsellPerformance = [
      { category: 'ErgoMouse M2 with Laptops', attachment_rate: 68, revenue: 16887 },
      { category: 'USB-C Dock HubX with Laptops', attachment_rate: 42, revenue: 11596 },
      { category: 'Webcam with 4K Monitors', attachment_rate: 34, revenue: 9348 },
    ];

    res.json({
      metrics,
      revenueByCategory,
      conversionFunnel,
      sessionsOverTime,
      upsellPerformance,
    });
  });

  // 7. 1-Click Demo Scenario Execution
  app.post('/api/demo/run-scenario', async (req, res) => {
    try {
      const { simulate_failure = false } = req.body;
      const demoQuery = 'I need a laptop under ₹60,000 for coding with 16GB RAM. Add a mouse too.';

      // 1. Process agent request
      const agentResult = await agentService.processRequest({ query: demoQuery });

      // 2. Create Cart
      const cart = store.getOrCreateCart();
      cart.items = [
        {
          product: agentResult.recommended_product,
          quantity: 1,
          added_by: 'ai_buyer',
          contextual_note: 'Recommended primary match: 16GB RAM, 512GB SSD for coding',
        },
        {
          product: agentResult.cross_sell_product,
          quantity: 1,
          added_by: 'ai_buyer',
          contextual_note: 'Contextual cross-sell mouse paired with laptop',
        },
      ];
      store.updateCartTotals(cart);

      store.recordEvent({
        event_type: 'CART_CREATED',
        description: `Cart ${cart.id} auto-assembled by AI Buyer: ProBook 14 + ErgoMouse M2. Total: ₹${cart.total.toLocaleString('en-IN')}`,
        agent: 'AI Buyer',
        status: 'SUCCESS',
        metadata: { cart_id: cart.id, total: cart.total },
      });

      // 3. Policy evaluation
      const policyEvaluation = policyEngine.evaluate({
        action: 'initiate_payment',
        amount: cart.total,
        user_confirmed: false, // first gated
        actor: 'AI_AGENT',
        cart_id: cart.id,
      });

      res.json({
        success: true,
        query: demoQuery,
        agentResult,
        cart,
        policyEvaluation,
        ready_for_approval: true,
        simulate_failure,
      });
    } catch (err: any) {
      console.error('Demo execution error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // ----------------------------------------------------
  // VITE / SPA MIDDLEWARE
  // ----------------------------------------------------
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BuyFlow AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
