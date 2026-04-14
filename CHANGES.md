# Home Clarity Report — Change Log

## April 14, 2026 — Full Redesign + Multi-Page Buildout (Phase 2)

### Design System Upgrade
- `base.css`: Updated core color tokens to premium palette
  - Navy: `#1B2B4D` → `#0C1830` (deeper cinematic navy)
  - Amber: `#C4873A` → `#B87A2A` (refined warm gold)
  - Off-white cream: `#F5F2EC` → `#F5F0E8`
  - All shadow, border, and glow rgba values updated to match

- `style.css`: Updated all rgba() color references to match new tokens
  - Added cinematic hero styles (`.hero--cinematic`, `.hero__trust-bar`)
  - Added smooth bg-image animation (`@keyframes slowZoom`)

### Homepage (index.html)
- **Hero redesign**: Replaced CSS gradient background with full-bleed `assets/hero-bg.jpg` photo (twilight luxury home exterior)
- **Headline updated**: "Most homeowners guess. / The best ones don't." (Playfair Display, cinematic treatment)
- **Trust bar added**: "27+ Years · 5 Business Days · Lifetime Advisory · One Visit. One Advisor. For Life."
- **Nav updated**: Links now point to actual pages (/about, /what-you-get, /faq, /blog) instead of anchor fragments
- **Footer updated**: Anchor links replaced with clean page routes; Client Stories + Blog added to Company nav
- **Logo SVG**: Updated inline fill colors to #0C1830 + #B87A2A

### New Pages Added
- `about.html` — Adam Kilgore founder story, Person schema, credentials grid, philosophy quote
- `what-you-get.html` — Detailed breakdown of all 8 deliverables, Service schema
- `faq.html` — 10+ Q&As, FAQPage schema
- `testimonials.html` — 6 client review cards, ItemList/Review schema, pull quote, CTA (**NEW in this phase**)
- `contact.html` — Contact form (Formspree), Calendly embed, direct contact info

### Blog Infrastructure
- `blog/index.html` — Grid of 5 posts with hero images
- `blog/how-to-vet-a-contractor.html`
- `blog/what-a-home-clarity-report-covers.html`
- `blog/renovation-plan-before-quotes.html`
- `blog/renovation-mistakes.html`
- `blog/home-improvement-roadmap.html`

### SEO Infrastructure
- `vercel.json`: Routing for all pages, headers security config
- `sitemap.xml`: Updated with all 12 URLs (/, /about, /what-you-get, /testimonials, /faq, /contact, /blog, 5 blog posts)
- All pages: canonical URL, OG tags, meta description, Google Analytics (G-1KKHNGT001)
- Blog posts: BlogPosting schema
- testimonials.html: Review + ItemList schema

### Assets
- `assets/hero-bg.jpg` — Twilight luxury home exterior (AI-generated cinematic image)
- `assets/about-hero.jpg` — Interior/about section image
