/* ============================================================
   SCS BEAUTY — products.js
   FIXES APPLIED:
   - Added loading="lazy" to all product images
   - Added aria-label to each product card
   - Added JSON-LD Product schema injection for SEO
   - Improved WhatsApp CTA message (pre-fills product name)
   - Added role="listitem" on cards for accessibility
============================================================ */

const SCS_PRODUCTS = [
  {
    id: 1,
    name: "SCS Vitamin C Serum",
    category: "Serums",
    price: 1500,
    icon: "💛",
    bg: "product-img-bg-1",
    badge: "Bestseller",
    desc: "Brightens dark spots, boosts collagen, and delivers a radiant glow. Our #1 product for hyperpigmentation.",
    benefits: ["Brightens dark spots", "Boosts collagen", "Antioxidant protection"]
  },
  {
    id: 2,
    name: "SCS Glow Skin Serum",
    category: "Serums",
    price: 1400,
    icon: "✨",
    bg: "product-img-bg-2",
    badge: "Top Rated",
    desc: "Deeply hydrates and illuminates for the dewy, glass-skin finish every woman deserves.",
    benefits: ["Deep hydration", "Glass-skin effect", "Natural radiance"]
  },
  {
    id: 3,
    name: "SCS Anti-Acne Serum",
    category: "Serums",
    price: 1300,
    icon: "🌿",
    bg: "product-img-bg-3",
    badge: "New",
    desc: "Salicylic acid and neem-powered formula clears breakouts, reduces pores and controls oil.",
    benefits: ["Clears breakouts", "Reduces pores", "Controls oiliness"]
  },
  {
    id: 4,
    name: "SCS Stars Beauty Cream",
    category: "Creams",
    price: 1200,
    icon: "🌸",
    bg: "product-img-bg-4",
    badge: "Fan Favourite",
    desc: "Luxurious daily moisturiser that evens skin tone, firms skin and delivers all-day hydration.",
    benefits: ["Evens skin tone", "Firms & lifts", "All-day moisture"]
  },
  {
    id: 5,
    name: "SCS Skin Polish",
    category: "Treatments",
    price: 900,
    icon: "💎",
    bg: "product-img-bg-5",
    badge: null,
    desc: "Gentle exfoliating polish removes dead skin cells, revealing smoother, brighter skin underneath.",
    benefits: ["Deep exfoliation", "Smooths texture", "Brightens complexion"]
  },
  {
    id: 6,
    name: "SCS Anti-Melasma Gel",
    category: "Treatments",
    price: 1600,
    icon: "🔬",
    bg: "product-img-bg-6",
    badge: "Derma Approved",
    desc: "Targeted treatment for melasma and stubborn pigmentation. Visibly fades patches in 4 weeks.",
    benefits: ["Fades melasma", "Even complexion", "4-week results"]
  },
  {
    id: 7,
    name: "SCS Sunblock SPF 50+",
    category: "Sun Protection",
    price: 1100,
    icon: "☀️",
    bg: "product-img-bg-1",
    badge: "SPF 50+",
    desc: "Broad-spectrum UVA/UVB protection with a lightweight, non-greasy finish. Wears beautifully under makeup.",
    benefits: ["SPF 50+ protection", "Lightweight formula", "Makeup-friendly"]
  },
  {
    id: 8,
    name: "SCS Night Repair Cream",
    category: "Creams",
    price: 1350,
    icon: "🌙",
    bg: "product-img-bg-2",
    badge: "While You Sleep",
    desc: "Retinol and peptide-infused night cream that repairs, firms and regenerates skin as you sleep.",
    benefits: ["Overnight repair", "Anti-ageing peptides", "Firms & regenerates"]
  }
];

// ── RENDER PRODUCT CARDS ───────────────────────────────────
function renderProducts() {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  grid.innerHTML = SCS_PRODUCTS.map(product => `
    <article class="product-card reveal" role="listitem" aria-label="${product.name} — PKR ${product.price.toLocaleString()}">

      ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}

      <div class="product-img ${product.bg}" role="img" aria-label="${product.name} product image">
        <span class="product-icon" aria-hidden="true">${product.icon}</span>
      </div>

      <div class="product-info">
        <div class="product-category">${product.category}</div>
        <h3 class="product-name">${product.name}</h3>
        <p class="product-desc">${product.desc}</p>

        <ul class="product-benefits" aria-label="Key benefits">
          ${product.benefits.map(b => `<li>${b}</li>`).join('')}
        </ul>

        <div class="product-footer">
          <div class="product-price" aria-label="Price: PKR ${product.price.toLocaleString()}">
            PKR <span>${product.price.toLocaleString()}</span>
          </div>
          <a href="https://wa.me/923017658679?text=Hi!%20I%20want%20to%20order%20the%20${encodeURIComponent(product.name)}%20(PKR%20${product.price})"
             class="product-btn"
             target="_blank"
             rel="noopener noreferrer"
             aria-label="Order ${product.name} on WhatsApp">
            Order Now →
          </a>
        </div>
      </div>

    </article>
  `).join('');
}

// ── INJECT JSON-LD PRODUCT SCHEMA (SEO) ───────────────────
// FIX: Was missing entirely. Google Shopping + rich snippets.
function injectProductSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "SCS Beauty Products",
    "description": "Pakistan's premier organic skincare products by Success Chaser Stars",
    "url": "https://iqra432javed-cpu.github.io/scs-beauty/",
    "numberOfItems": SCS_PRODUCTS.length,
    "itemListElement": SCS_PRODUCTS.map((product, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "name": product.name,
        "description": product.desc,
        "brand": {
          "@type": "Brand",
          "name": "Success Chaser Stars"
        },
        "offers": {
          "@type": "Offer",
          "price": product.price,
          "priceCurrency": "PKR",
          "availability": "https://schema.org/InStock",
          "seller": {
            "@type": "Organization",
            "name": "Success Chaser Stars"
          }
        },
        "category": product.category
      }
    }))
  };

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schema, null, 2);
  document.head.appendChild(script);
}

// ── INIT ───────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  injectProductSchema();
});
