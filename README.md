# Chubby’s, The Dessert Studio: website

Plain HTML, CSS and JavaScript. No build step. Open `index.html` in a browser, or upload the whole folder to any hosting.

## Folder map (what to open to change what)

| I want to change... | Open this file |
|---|---|
| Menu items and prices | `js/menu-data.js` |
| WhatsApp order number, page titles | `js/config.js` |
| Address, phone, wording, page content | `index.html` (sections are labelled with comments) |
| Colours, fonts, spacing, animations | `css/style.css` (table of contents at the top; brand colours are the variables in section 01) |
| How the site behaves (cart, spin, preloader, hero swirl) | `js/app.js` (table of contents at the top) |
| Photos | `assets/photos/` |
| Instagram reels | `assets/videos/` |
| Search engine files | `robots.txt`, `sitemap.xml`, `site.webmanifest` |

## Photos: `assets/photos/`
| File | Where it shows | Size |
|---|---|---|
| `space.jpg` | Big wave-cut photo at the top of the Space page | about 1600 x 900 |
| `shop-1.jpg` to `shop-5.jpg` | Gallery on the Space page | about 1000 x 700 (shop-2 portrait) |
| `og-image.jpg` | Picture shown when the link is shared on WhatsApp, Instagram, Google | 1200 x 630 |

Use .jpg and keep each under 400 KB.

## Reels: `assets/videos/`
`reel-1.mp4` to `reel-4.mp4` (vertical 9:16, under 8 MB and 20 seconds each). Optional covers: `reel-1.jpg` to `reel-4.jpg`.
They play muted when scrolled into view, customers tap "Tap for sound". Only 3 reels? Delete the 4th `<figure class="rv slot">` block in `index.html`.

## SEO checklist (do these after the site goes live)
Already done in the code: page title and description, canonical link, social sharing tags, Google structured data (shop, address, phone, full menu with prices, FAQ), geo tags, readable text for crawlers, fast loading, mobile friendly, `robots.txt`, `sitemap.xml`.

1. Replace `YOUR-DOMAIN.com` with the real address in `index.html`, `robots.txt` and `sitemap.xml`.
2. Add `assets/photos/og-image.jpg`.
3. In `index.html` add opening hours to the structured data (`openingHoursSpecification`) once they are known.
4. Add the site to Google Search Console and submit `sitemap.xml`. Do the same in Bing Webmaster Tools.
5. Claim and fully fill the Google Business Profile for Chubby’s (same name, address and phone as the footer, photos, hours, menu, website link). This matters most for "dessert near me" searches in Navrangpura.
6. Ask happy customers for Google reviews, and list the shop on Zomato, Swiggy, Justdial and Instagram with the website link.
7. Keep the name, address and phone identical everywhere (NAP consistency).

Note: nobody can promise the number 1 spot on Google. Ranking depends on competition, reviews and time. These steps give the site the best foundation.
