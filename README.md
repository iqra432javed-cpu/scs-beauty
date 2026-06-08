# Success Chaser Stars — SCS Beauty Website

Pakistan's premium organic beauty & wellness brand website. Built with clean, modular vanilla HTML/CSS/JS — no frameworks, no dependencies, no build tools required.

---

## 📁 Project Structure

```
scs-beauty/
│
├── index.html          ← Main homepage (all sections)
├── shop.html           ← Full product shop page (coming soon)
├── partner.html        ← Partner/reseller program page (coming soon)
├── about.html          ← About & brand story page (coming soon)
├── blog.html           ← Beauty tips & blog page (coming soon)
│
├── css/
│   ├── style.css       ← All variables, layout, component styles
│   └── animations.css  ← Keyframes + responsive breakpoints
│
├── js/
│   ├── app.js          ← Nav, scroll reveal, counters, newsletter
│   └── products.js     ← Product data array + rendering logic
│
├── assets/
│   ├── images/         ← General site images
│   ├── products/       ← Product photography
│   └── icons/          ← Favicon, app icons
│
└── README.md
```

---

## 🚀 How to Run

No build step needed. Just open `index.html` in your browser — or use VS Code Live Server for hot reload.

```bash
# Option 1: Direct open
open index.html

# Option 2: Python local server
python3 -m http.server 8080
# then visit http://localhost:8080

# Option 3: VS Code Live Server extension (recommended)
# Right-click index.html → Open with Live Server
```

---

## ✨ Features

- Fully responsive (mobile, tablet, desktop)
- Scroll-reveal animations on all sections
- Animated number counters
- Marquee banner
- Product cards dynamically rendered from `products.js` data array
- WhatsApp direct order integration
- Newsletter email capture
- Sticky WhatsApp + Shop buttons
- Active nav link highlighting
- Mobile hamburger menu

---

## 🎨 Brand Colors

| Name          | Hex       | Usage                        |
|---------------|-----------|------------------------------|
| Rose Gold     | `#B76E79` | Primary — buttons, accents   |
| Champagne     | `#D8B47A` | Secondary — tags, highlights |
| Soft Blush    | `#E8D6D0` | Backgrounds, cards           |
| Warm Ivory    | `#FAF5F0` | Section backgrounds          |
| Deep Rose     | `#8B4A56` | Hover states                 |
| Text Dark     | `#2D2D2D` | Body text                    |

---

## 📦 Adding a New Product

Open `js/products.js` and add a new object to the `SCS_PRODUCTS` array:

```js
{
  id: 9,                          // unique number
  name: "SCS New Product",
  category: "Serums",             // shown as tag
  price: 1200,                    // PKR
  icon: "🌟",                    // emoji displayed on card
  bg: "product-img-bg-1",         // bg-1 through bg-6
  badge: "New",                   // or null for no badge
  desc: "Short description here."
}
```

The product will automatically appear on the homepage grid.

---

## 📱 Social & Contact

| Platform  | Link |
|-----------|------|
| WhatsApp  | [+92 301 765 8679](https://wa.me/923017658679) |
| Instagram | [@scs_skin.care](https://www.instagram.com/scs_skin.care/) |
| Facebook  | [SuccessChaserStars](https://www.facebook.com/SuccessChaserStars/) |
| TikTok    | [@successchaserstar](https://www.tiktok.com/@successchaserstar) |
| Email     | shahzebali0202@gmail.com |

---

## 🔮 Roadmap (Next Pages)

- [ ] `shop.html` — Full product listing with filters by category
- [ ] `partner.html` — Dedicated partner registration + commission breakdown
- [ ] `about.html` — Extended brand story + team
- [ ] `blog.html` — Full beauty tips blog with post pages
- [ ] Cart / WhatsApp bulk order system
- [ ] Before/After gallery section

---

*© 2026 Success Chaser Stars. All rights reserved.*
