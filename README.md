# COCOVANTA Website — Hosting Package

## Deploy
Upload the **contents of this folder** to the public web root (`public_html`, `www`, or the hosting provider's publish directory). Keep the `assets`, `css`, `js`, and `products` folders in their current relative locations. The homepage is `index.html`.

This is a static HTML/CSS/JavaScript website. No build command or database is required. HTTPS should be enabled in the hosting control panel.

## Included
- Responsive B2B website pages and six product detail pages.
- Local SVG artwork and favicon; no missing-image dependency on the previously absent photo/video files. These are **illustrative graphics**, not actual supplier/factory/product photographs. Replace them with owned, accurate photography when available.
- Product search/filter, volume estimate calculator, FAQ interactions, accessible mobile navigation, and WhatsApp RFQ handoff.
- SEO metadata, canonical URLs, sitemap, robots.txt, 404 page, security headers examples, and deployment checklist.

## Important functional boundaries
- RFQ is validated in the browser and opens a prefilled WhatsApp conversation to +62 857-3627-7955. The visitor must press Send. The website does not store leads or send email automatically.
- Do not publish unverified supplier identities, certifications, stock, capacity, test results, prices, shipment history, or technical guarantees. Technical requirements are buyer targets pending written supplier and batch verification.
- COCOVANTA is described as an independent sourcing and export coordination desk, not as a manufacturer.
- Verify that the published domain is controlled by you before using the canonical URLs and sitemap. Current canonical domain configured: https://cocovanta.com/. Change it in all HTML canonical tags, sitemap.xml, robots.txt and structured data if your real domain differs.

## External resources
Tailwind CSS CDN, Google Fonts, and Font Awesome CDN are used for styling/icons. A network connection is required for those resources; core page content and local illustrations remain hosted locally. For strict offline/self-contained deployment, bundle these libraries locally before launch.

## Pre-launch checklist
1. Confirm domain ownership and update canonical domain if needed.
2. Verify business email and WhatsApp number are correct and monitored.
3. Replace illustrative artwork with genuine, permission-cleared images if available.
4. Confirm all product specs, supplier options, sample availability, price, MOQ, lead time, Incoterms and documents case by case.
5. Test every page and RFQ handoff on Android, iOS and desktop browsers.
6. Enable HTTPS; submit sitemap to search engines after deployment.
7. Add a privacy-compliant backend/CRM only if you need lead storage or automated email.

## QA status
Automated/static checks are included in `QA-AND-HOSTING-REPORT.txt`. A live deployment, DNS, SSL certificate, actual devices, third-party CDN uptime, and real WhatsApp delivery cannot be certified from a ZIP file.
