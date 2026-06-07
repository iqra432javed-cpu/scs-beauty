// ============================================================
//  SUCCESS CHASER STARS — Products Data
//  products.js — All product data & rendering logic
// ============================================================

const SCS_PRODUCTS = [
  {
    id: 1,
    name: "SCS Vitamin C Serum",
    category: "Serums",
    price: 1080,
    icon: "💛",
    bg: "product-img-bg-1",
    badge: "Bestseller",
    desc: "Brightens, fades dark spots & boosts collagen with high-potency Vitamin C + Hyaluronic Acid."
  },
  {
    id: 2,
    name: "SCS Glow Skin Serum",
    category: "Serums",
    price: 960,
    icon: "✨",
    bg: "product-img-bg-2",
    badge: "New",
    desc: "Deep hydration meets radiance. Vitamin C, Hyaluronic Acid & botanical extracts for luminous skin."
  },
  {
    id: 3,
    name: "SCS Anti-Acne Serum",
    category: "Serums",
    price: 918,
    icon: "🌿",
    bg: "product-img-bg-3",
    badge: null,
    desc: "Salicylic acid, tea tree & niacinamide to clear breakouts, reduce redness & fade acne scars."
  },
  {
    id: 4,
    name: "SCS Stars Beauty Cream",
    category: "Creams",
    price: 840,
    icon: "🌙",
    bg: "product-img-bg-4",
    badge: "Night Treatment",
    desc: "Night cream for whitening & pigmentation. Evens skin tone, clears dark spots. 7-day visible results."
  },
  {
    id: 5,
    name: "SCS Skin Polish",
    category: "Polish & Exfoliation",
    price: 918,
    icon: "✦",
    bg: "product-img-bg-5",
    badge: "Instant Glow",
    desc: "Instant brightening & whitening. Removes dullness and dead cells for a smooth, polished finish."
  },
  {
    id: 6,
    name: "SCS Glass Skin Rice Serum",
    category: "Serums",
    price: 1350,
    icon: "🌞",
    bg: "product-img-bg-2",
    badge: "New 2025",
    desc: "Inspired by Korean glass-skin rituals. Rice extract + niacinamide for porcelain-smooth perfection."
  },
  {
    id: 7,
    name: "SCS Sunblock",
    category: "Sun Protection",
    price: 1098,
    icon: "🛡️",
    bg: "product-img-bg-3",
    badge: null,
    desc: "Advanced UV protection that treats pigmentation & sunburn while defending from daily sun exposure."
  },
  {
    id: 8,
    name: "SCS Anti-Melasma Gel",
    category: "Treatments",
    price: 1320,
    icon: "🌙",
    bg: "product-img-bg-6",
    badge: "New 2025",
    desc: "Targeted treatment for stubborn melasma and deep pigmentation. Clinical-grade brightening formula."
  }
];

/**
 * Renders a single product card HTML string
 * @param {Object} product
 * @returns {string} HTML string
 */
function renderProductCard(product) {
  const badgeHTML = product.badge
    ? `<div class="product-badge">${product.badge}</div>`
    : '';

  return `
    <div class="product-card reveal" data-id="${product.id}">
      <div class="product-img ${product.bg}">
        <span>${product.icon}</span>
        ${badgeHTML}
      </div>
      <div class="product-info">
        <div class="product-category">${product.category}</div>
        <div class="product-name">${product.name}</div>
        <div class="product-desc">${product.desc}</div>
        <div class="product-footer">
          <div class="product-price">PKR ${product.price.toLocaleString()}</div>
          <button
            class="product-btn"
            title="Order on WhatsApp"
            onclick="orderProduct(${product.id})"
          >+</button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Renders all product cards into the products grid
 */
function renderProducts() {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;
  grid.innerHTML = SCS_PRODUCTS.map(renderProductCard).join('');

  // Re-apply stagger delays after dynamic render
  grid.querySelectorAll('.product-card').forEach((card, i) => {
    card.style.transitionDelay = (i * 0.08) + 's';
  });

  // Re-observe newly created cards for reveal
  if (window.revealObserver) {
    grid.querySelectorAll('.reveal').forEach(el => window.revealObserver.observe(el));
  }
}

/**
 * Opens WhatsApp with a pre-filled order message
 * @param {number} productId
 */
function orderProduct(productId) {
  const product = SCS_PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  const msg = encodeURIComponent(
    `Hi! I want to order:\n\n*${product.name}*\nPrice: PKR ${product.price.toLocaleString()}\n\nPlease confirm availability. Thank you! 🌸`
  );
  window.open(`https://wa.me/923017658679?text=${msg}`, '_blank');
}

/**
 * Filters products by category and re-renders
 * @param {string} category - category name or 'all'
 */
function filterProducts(category) {
  const filtered = category === 'all'
    ? SCS_PRODUCTS
    : SCS_PRODUCTS.filter(p => p.category === category);

  const grid = document.getElementById('productsGrid');
  if (!grid) return;
  grid.innerHTML = filtered.map(renderProductCard).join('');

  filtered.forEach((_, i) => {
    const card = grid.querySelectorAll('.product-card')[i];
    if (card) card.style.transitionDelay = (i * 0.08) + 's';
  });
}

// Auto-render when DOM is ready
document.addEventListener('DOMContentLoaded', renderProducts);
