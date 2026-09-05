# BuyFlow AI

> Autonomous Agentic Commerce with Guarded Payments

BuyFlow AI turns merchant catalogs into machine-readable knowledge graphs and enables autonomous AI Buyers to complete end-to-end purchasing journeys — from a natural language request to a verified Razorpay payment — while enforcing zero-trust financial guardrails.

---

## Features

- **Natural Language Shopping** — AI parses queries like *"laptop under ₹60K with 16GB RAM for coding"* and maps them to catalog constraints automatically.
- **AI Recommendation Engine** — Scores products by match percentage, suggests contextual upsells, and assembles the cart.
- **Policy Engine (Guardrails)** — Blocks autonomous payment execution for high-value orders and enforces explicit human approval.
- **Razorpay Integration** — Creates real Razorpay orders and verifies HMAC SHA256 payment signatures server-side.
- **Failure Handling** — Clean failure reporting with no blind auto-retries (Policy `POL-RETRY-01`).
- **Audit Trail & Explainability** — Immutable event log and transparent AI decision trees with confidence scores.
- **Analytics Dashboard** — Real-time conversion funnel and merchant revenue metrics.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Tailwind CSS v4 |
| Backend | Node.js, Express, TypeScript (tsx) |
| AI | Google Gemini (`@google/genai`) |
| Payments | Razorpay Test Gateway |
| Build | Vite, esbuild |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Razorpay Test Mode](https://dashboard.razorpay.com/) account (optional — mock mode works without it)
- A [Google Gemini API Key](https://aistudio.google.com/app/apikey) (optional — for dynamic AI explanations)

### Installation

```bash
# Clone the repo
git clone https://github.com/Tanya-garg10/BuyFlow-AI.git
cd BuyFlow-AI

# Install dependencies
npm install

# Copy environment config
cp .env.example .env
```

### Environment Setup

Edit `.env` with your credentials:

```env
GEMINI_API_KEY=your_gemini_api_key_here
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret
MOCK_PAYMENT=true   # set to false to use live Razorpay test keys
APP_URL=http://localhost:3000
```

> If `MOCK_PAYMENT=true`, the app runs fully offline with simulated payment transitions — no Razorpay keys needed.

### Run Locally

```bash
# Development server (port 3000)
npm run dev

# Production build
npm run build

# Start production server
npm run start
```

---

## How It Works

1. **User sends a natural language query** to the AI Buyer Agent.
2. **AI extracts constraints** (category, budget, specs) and searches the catalog.
3. **Products are scored and ranked** — best match is recommended with optional upsells.
4. **Cart is assembled** — line items are attributed (`ai_buyer` vs `user`).
5. **Policy Engine evaluates** the cart before payment. High-value orders (≥ ₹50,000) are blocked until explicit human approval.
6. **User approves** → Razorpay order is created → payment is completed via Test Card / UPI / NetBanking.
7. **Signature is verified** server-side (HMAC SHA256) → order is confirmed and logged to the Audit Trail.

---

## Financial Guardrail Policies

| Policy ID | Action | Condition | Resolution |
|---|---|---|---|
| `POL-CAT-01` | Search & Compare | Any | Allowed (Autonomous) |
| `POL-CART-01` | Add to Cart | Valid catalog item | Allowed (Autonomous) |
| `POL-PAY-01` | Initiate Payment | Without user approval | Blocked — requires approval |
| `POL-PAY-02` | Initiate Payment | Amount ≥ ₹50,000 | Explicit approval required |
| `POL-REF-01` | Refund | AI Agent | Permanently forbidden |
| `POL-RETRY-01` | Payment failure | Gateway rejection | Halt & log — no auto-retry |

---

## API Reference

### Catalog
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/products` | List catalog items (filters: `category`, `search`) |
| `POST` | `/api/products` | Create or update a product |

### Agentic Intelligence
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/agent/search` | Natural language query → recommendations |
| `POST` | `/api/agent/recommend` | Suggest peripherals for a given SKU |

### Cart & Payments
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/cart/:id` | Get active cart |
| `POST` | `/api/cart` | Add item to cart |
| `DELETE` | `/api/cart/:cartId/items/:productId` | Remove item |
| `POST` | `/api/payment/policy-check` | Evaluate guardrails |
| `POST` | `/api/payment/create-order` | Create Razorpay order |
| `POST` | `/api/payment/verify` | Verify payment signature |

### Telemetry
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/orders` | List confirmed and failed orders |
| `GET` | `/api/audit` | Immutable event stream |
| `GET` | `/api/decisions` | AI decision trees |
| `GET` | `/api/analytics` | Conversion funnel metrics |

---

## Project Structure

```
BuyFlow-AI/
├── server/
│   ├── agent.ts          # AI Buyer Agent logic
│   ├── policy.ts         # Financial guardrail policy engine
│   ├── razorpay.ts       # Razorpay order creation & verification
│   └── store.ts          # In-memory data store
├── src/
│   ├── components/       # React UI components
│   ├── data/products.ts  # Catalog product data
│   ├── types.ts          # Shared TypeScript types
│   └── App.tsx           # Root application component
├── server.ts             # Express server entry point
├── .env.example          # Environment variable template
└── vite.config.ts        # Vite build config
```

---

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.
