import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'LP001',
    name: 'ProBook 14 Coding Edition',
    description: '14-inch developer ultrabook equipped with high-speed 16GB DDR5 RAM, 512GB PCIe Gen4 SSD, and 10-core Intel Core i5 processor designed for code compilation, Docker workloads, and all-day battery.',
    price: 54999,
    currency: 'INR',
    category: 'Laptop',
    availability: true,
    stock: 24,
    rating: 4.8,
    review_count: 318,
    image_url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&auto=format&fit=crop&q=80',
    attributes: {
      ram: '16GB DDR5',
      storage: '512GB NVMe SSD',
      processor: 'Intel Core i5-1340P (10 cores)',
      display: '14" 16:10 FHD+ Anti-Glare IPS (300 nits)',
      battery_life: '11 hours',
      weight: '1.38 kg',
      connectivity: 'Wi-Fi 6E, Thunderbolt 4, HDMI 2.1, USB-A',
      color: 'Space Gray'
    },
    use_cases: [
      'software development',
      'web engineering',
      'college students',
      'productivity',
      'docker environments'
    ],
    compatible_products: ['M001', 'KB001', 'MN001', 'ACC001', 'SSD001'],
    upsell_products: ['LP002', 'M001', 'ACC001'],
    purchase_constraints: {
      requires_user_approval: true,
      max_order_quantity: 3
    },
    ai_readiness_score: 98,
    ai_discoverability: 'High'
  },
  {
    id: 'LP002',
    name: 'DevStudio Pro 16 Max',
    description: 'High-performance workstation laptop for machine learning engineers and full-stack architects with 32GB RAM, 1TB SSD, and 14-core Intel Core i7.',
    price: 89999,
    currency: 'INR',
    category: 'Laptop',
    availability: true,
    stock: 12,
    rating: 4.9,
    review_count: 142,
    image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
    attributes: {
      ram: '32GB DDR5',
      storage: '1TB NVMe Gen4 SSD',
      processor: 'Intel Core i7-13700H (14 cores)',
      display: '16" 2.5K (2560x1600) 120Hz 500 nits IPS',
      battery_life: '9.5 hours',
      weight: '1.85 kg',
      connectivity: '2x Thunderbolt 4, SD Card Reader, HDMI 2.1',
      color: 'Deep Titanium'
    },
    use_cases: [
      'deep learning',
      'large monorepo compilation',
      'virtual machines',
      'creative production',
      'senior engineers'
    ],
    compatible_products: ['M002', 'KB001', 'MN001', 'SSD001'],
    upsell_products: ['MN001', 'M002'],
    purchase_constraints: {
      requires_user_approval: true,
      max_order_quantity: 2
    },
    ai_readiness_score: 96,
    ai_discoverability: 'High'
  },
  {
    id: 'LP003',
    name: 'AirLite 13 Ultraportable',
    description: 'Featherlight 1.15kg laptop with 16GB LPDDR5, 256GB SSD, and AMD Ryzen 5 with 14-hour battery life for traveling developers and students.',
    price: 46500,
    currency: 'INR',
    category: 'Laptop',
    availability: true,
    stock: 30,
    rating: 4.6,
    review_count: 89,
    image_url: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&auto=format&fit=crop&q=80',
    attributes: {
      ram: '16GB LPDDR5',
      storage: '256GB SSD',
      processor: 'AMD Ryzen 5 7530U (6 cores)',
      display: '13.3" IPS FHD 100% sRGB',
      battery_life: '14 hours',
      weight: '1.15 kg',
      connectivity: '2x USB-C PD, Audio Jack',
      color: 'Silver Mist'
    },
    use_cases: [
      'daily coding',
      'remote travel',
      'college classes',
      'web browsing'
    ],
    compatible_products: ['M001', 'ACC001', 'HP001'],
    upsell_products: ['LP001', 'M001'],
    purchase_constraints: {
      requires_user_approval: true,
      max_order_quantity: 5
    },
    ai_readiness_score: 94,
    ai_discoverability: 'High'
  },
  {
    id: 'M001',
    name: 'ErgoMouse M2 Wireless',
    description: 'Precision ergonomic contour mouse with 4000 DPI sensor, quiet click switches, dual Bluetooth & 2.4GHz USB wireless connection, and 70-day rechargeable battery.',
    price: 1299,
    currency: 'INR',
    category: 'Mouse',
    availability: true,
    stock: 85,
    rating: 4.7,
    review_count: 512,
    image_url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop&q=80',
    attributes: {
      dpi: '4000 DPI adjustable',
      connectivity: 'Dual Bluetooth 5.1 + 2.4GHz nano receiver',
      battery_life: '70 days per USB-C charge',
      weight: '98g',
      color: 'Matte Graphite'
    },
    use_cases: [
      'wrist pain prevention',
      'software development',
      'productivity desk setup',
      'laptop companion'
    ],
    compatible_products: ['LP001', 'LP002', 'LP003', 'KB001', 'KB002'],
    upsell_products: ['M002', 'KB001'],
    purchase_constraints: {
      requires_user_approval: false,
      max_order_quantity: 10
    },
    ai_readiness_score: 100,
    ai_discoverability: 'High'
  },
  {
    id: 'M002',
    name: 'PrecisionMaster MX Pro',
    description: 'Flagship developer mouse with 8000 DPI Darkfield tracking (works on glass), electromagnetic MagSpeed scroll wheel, and app-specific gesture controls.',
    price: 3499,
    currency: 'INR',
    category: 'Mouse',
    availability: true,
    stock: 45,
    rating: 4.9,
    review_count: 320,
    image_url: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80',
    attributes: {
      dpi: '8000 DPI Darkfield glass sensor',
      connectivity: 'Multi-device Bluetooth (3 devices) + USB-C',
      battery_life: '70 days with quick charge',
      weight: '141g',
      color: 'Space Black'
    },
    use_cases: [
      'professional code review',
      'multi-monitor navigation',
      'UI/UX design',
      'continuous terminal scrolling'
    ],
    compatible_products: ['LP001', 'LP002', 'MN001', 'KB001'],
    upsell_products: ['KB001'],
    purchase_constraints: {
      requires_user_approval: false,
      max_order_quantity: 5
    },
    ai_readiness_score: 95,
    ai_discoverability: 'High'
  },
  {
    id: 'KB001',
    name: 'CodeCraft 75 Mechanical Keyboard',
    description: 'Compact 75% hot-swappable mechanical keyboard with lubricated Gateron Brown tactile switches, sound-dampening silicone gaskets, and south-facing RGB.',
    price: 4899,
    currency: 'INR',
    category: 'Keyboard',
    availability: true,
    stock: 38,
    rating: 4.8,
    review_count: 278,
    image_url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
    attributes: {
      switch_type: 'Gateron Brown Tactile (Hot-swappable)',
      connectivity: 'Tri-mode: Type-C, Bluetooth 5.0, 2.4G Wireless',
      battery_life: '200 hours without backlight',
      layout: '75% 82-key ANSI with aluminum volume knob',
      weight: '820g'
    },
    use_cases: [
      'tactile programming',
      'ergonomic desktop typing',
      'speed typing',
      'minimal desk clutter'
    ],
    compatible_products: ['LP001', 'LP002', 'M001', 'M002', 'MN001'],
    upsell_products: ['M002', 'MN001'],
    purchase_constraints: {
      requires_user_approval: false,
      max_order_quantity: 4
    },
    ai_readiness_score: 97,
    ai_discoverability: 'High'
  },
  {
    id: 'KB002',
    name: 'SlimKey Wireless Minimalist',
    description: 'Ultra-slim low-profile scissor switch keyboard with aircraft-grade anodized aluminum body and instant multi-OS switching for clean desk setups.',
    price: 2199,
    currency: 'INR',
    category: 'Keyboard',
    availability: true,
    stock: 50,
    rating: 4.5,
    review_count: 110,
    image_url: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=600&auto=format&fit=crop&q=80',
    attributes: {
      switch_type: 'Low-profile scissor mechanism (1.5mm travel)',
      connectivity: 'Bluetooth 5.0 (Pair up to 3 devices)',
      battery_life: '5 months on 2x AAA',
      weight: '430g',
      color: 'Silver Grey'
    },
    use_cases: [
      'quiet office typing',
      'minimalist workstation',
      'travel companion'
    ],
    compatible_products: ['LP003', 'M001'],
    upsell_products: ['KB001'],
    purchase_constraints: {
      requires_user_approval: false,
      max_order_quantity: 8
    },
    ai_readiness_score: 91,
    ai_discoverability: 'Medium'
  },
  {
    id: 'MN001',
    name: 'UltraView 27" 4K IPS Monitor',
    description: '27-inch 4K UHD professional IPS display with 99% sRGB color accuracy, 65W USB-C Power Delivery single-cable laptop connection, and 4-way ergonomic stand.',
    price: 24999,
    currency: 'INR',
    category: 'Monitor',
    availability: true,
    stock: 19,
    rating: 4.9,
    review_count: 195,
    image_url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80',
    attributes: {
      resolution: '3840 x 2160 4K UHD @ 60Hz',
      display: 'IPS Panel with HDR400, Delta E < 2',
      connectivity: 'USB-C (65W PD, DisplayPort, Data), HDMI 2.0, DP 1.4, USB 3.0 Hub',
      refresh_rate: '60Hz',
      stand: 'Height, Pivot, Swivel, Tilt'
    },
    use_cases: [
      'multi-window code development',
      'UI/UX design',
      'single-cable laptop docking',
      'prolonged screen reading'
    ],
    compatible_products: ['LP001', 'LP002', 'KB001', 'M002', 'WC001'],
    upsell_products: ['WC001', 'ACC001'],
    purchase_constraints: {
      requires_user_approval: true,
      max_order_quantity: 2
    },
    ai_readiness_score: 99,
    ai_discoverability: 'High'
  },
  {
    id: 'MN002',
    name: 'ProSpeed 24" 165Hz Dev & Game Monitor',
    description: 'Fast IPS 24-inch Full HD display with 165Hz refresh rate, 1ms response time, AMD FreeSync Premium, and flicker-free eye comfort mode.',
    price: 14499,
    currency: 'INR',
    category: 'Monitor',
    availability: true,
    stock: 28,
    rating: 4.7,
    review_count: 180,
    image_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
    attributes: {
      resolution: '1920 x 1080 FHD @ 165Hz',
      display: 'Fast IPS Panel, 350 nits',
      refresh_rate: '165Hz 1ms (GtG)',
      connectivity: '2x HDMI 2.0, DisplayPort 1.2, Audio Out'
    },
    use_cases: [
      'smooth UI animations debugging',
      'dual monitor productivity',
      'after-hours gaming'
    ],
    compatible_products: ['LP001', 'LP003', 'KB001'],
    upsell_products: ['MN001'],
    purchase_constraints: {
      requires_user_approval: false,
      max_order_quantity: 3
    },
    ai_readiness_score: 93,
    ai_discoverability: 'Medium'
  },
  {
    id: 'HP001',
    name: 'AcousticFlow ANC Studio Headphones',
    description: 'Hybrid active noise cancellation headphones with custom 40mm titanium diaphragm drivers, 45-hour battery life, and AI clear-voice beamforming mics for calls.',
    price: 6999,
    currency: 'INR',
    category: 'Headphones',
    availability: true,
    stock: 40,
    rating: 4.8,
    review_count: 230,
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    attributes: {
      connectivity: 'Bluetooth 5.3 + 3.5mm Aux backup',
      battery_life: '45 hours with ANC ON, 60 hours ANC OFF',
      weight: '245g',
      noise_cancellation: 'Hybrid ANC up to -38dB',
      color: 'Onyx Midnight'
    },
    use_cases: [
      'deep focus coding sessions',
      'noisy coworking spaces',
      'remote standup calls'
    ],
    compatible_products: ['LP001', 'LP002', 'LP003'],
    upsell_products: ['WC001'],
    purchase_constraints: {
      requires_user_approval: false,
      max_order_quantity: 4
    },
    ai_readiness_score: 95,
    ai_discoverability: 'High'
  },
  {
    id: 'WC001',
    name: 'ClearCam 4K Stream Webcam',
    description: 'Crystal-clear 4K Ultra HD webcam with Sony STARVIS sensor, autofocus, AI auto-framing, dual noise-canceling stereo mics, and physical sliding privacy shutter.',
    price: 5499,
    currency: 'INR',
    category: 'Webcam',
    availability: true,
    stock: 35,
    rating: 4.6,
    review_count: 94,
    image_url: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?w=600&auto=format&fit=crop&q=80',
    attributes: {
      resolution: '4K @ 30fps / 1080p @ 60fps',
      field_of_view: '90° wide angle with digital zoom',
      connectivity: 'USB-C to USB-A/C detachable cable',
      privacy: 'Built-in magnetic lens privacy cover'
    },
    use_cases: [
      'remote technical interviews',
      'client presentations',
      'high-definition team meetings'
    ],
    compatible_products: ['MN001', 'LP001', 'LP002'],
    upsell_products: ['HP001'],
    purchase_constraints: {
      requires_user_approval: false,
      max_order_quantity: 6
    },
    ai_readiness_score: 92,
    ai_discoverability: 'Medium'
  },
  {
    id: 'SSD001',
    name: 'FastDrive 1TB NVMe Gen4 SSD',
    description: 'Ultra-fast M.2 PCIe 4.0 NVMe SSD with read speeds up to 7400 MB/s and custom graphene heat spreader for large code bases, datasets, and game storage.',
    price: 6299,
    currency: 'INR',
    category: 'SSD',
    availability: true,
    stock: 55,
    rating: 4.9,
    review_count: 410,
    image_url: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&auto=format&fit=crop&q=80',
    attributes: {
      storage: '1TB (1000GB)',
      speed: 'Read: 7400 MB/s, Write: 6800 MB/s',
      interface: 'PCIe 4.0 x4, NVMe 2.0',
      tbw: '800 TBW endurance warranty'
    },
    use_cases: [
      'local database caching',
      'heavy dataset storage',
      'laptop storage expansion',
      'fast boot times'
    ],
    compatible_products: ['LP001', 'LP002'],
    upsell_products: ['ACC001'],
    purchase_constraints: {
      requires_user_approval: false,
      max_order_quantity: 5
    },
    ai_readiness_score: 94,
    ai_discoverability: 'High'
  },
  {
    id: 'ACC001',
    name: 'HubX 8-in-1 USB-C Docking Station',
    description: 'Compact aluminum multiport adapter with 100W Power Delivery pass-through, 4K@60Hz HDMI, Gigabit Ethernet, 3x USB 3.2 Gen 1, and SD/MicroSD card readers.',
    price: 2899,
    currency: 'INR',
    category: 'Accessories',
    availability: true,
    stock: 70,
    rating: 4.7,
    review_count: 280,
    image_url: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=600&auto=format&fit=crop&q=80',
    attributes: {
      ports: '1x 100W PD USB-C, 1x 4K@60Hz HDMI, 1x RJ45 Gigabit, 3x USB-A 3.2, SD/TF slots',
      material: 'Space Gray Sandblasted Aluminum',
      weight: '85g'
    },
    use_cases: [
      'single cable desk docking',
      'wired gigabit internet',
      'external monitor connection'
    ],
    compatible_products: ['LP001', 'LP002', 'LP003', 'MN001', 'M001'],
    upsell_products: ['MN001'],
    purchase_constraints: {
      requires_user_approval: false,
      max_order_quantity: 10
    },
    ai_readiness_score: 96,
    ai_discoverability: 'High'
  }
];
