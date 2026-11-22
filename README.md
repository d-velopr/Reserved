# Reserved

Static site for Reserved LLC (reservedwayornoway.com). No build step: open the HTML files or serve the folder.

| Page | File | Script |
|------|------|--------|
| Home | `index.html` | `assets/js/home.js` |
| Collection | `collection.html` | `assets/js/collection.js`, `assets/js/sheet.js` (the product sheet) |
| Tiger Ztripez | `tiger-ztripez.html` | `assets/js/sheet.js` (strain cards open the product sheet on the page); linked from the FAQ and About pages |
| Terp Tunnel | `terp-tunnel.html` | none; linked from the FAQ and About pages |
| Store Locator | `store-locator.html` | `assets/js/locator.js` |
| About | `about.html` | none |
| FAQ | `faq.html` | none |
| Contact | `contact.html` | form handled in `assets/js/site.js` |
| Privacy Policy | `privacy.html` | none |
| Terms & Conditions | `terms.html` | none |
| Not found | `404.html` | none (GitHub Pages shows it for any missing URL, so its links start with `/`) |

Every page also loads `assets/js/site.js` (analytics, Subscribe form) and `assets/css/style.css`.

The 21+ entry gate is on the Home page only. A first-time visitor who opens another page is sent to `index.html?next=<that page>`, passes the gate, then goes back to the page they asked for. Contact, Privacy, Terms and 404 skip the gate, so anyone can read the policies before agreeing. To add a gated page, copy the gate script from `collection.html`'s `<head>` and add the page name to `NEXT_RE` in `site.js`.

## Editing content

- **Products:** `assets/js/products.js`. Flower is listed by strain (type and sizes); the other categories by product. The Collection page and the Home tiles both read it. A category with no products is hidden on both (Flower, until strains are added).
- **Stores:** `assets/js/stores.js`. The map and the store list read it, and the Home page's Coming Soon cards come from `RESERVED_COMING_SOON` in the same file.
- **Sign-ups:** go to a Google Sheet through `subscribe.gs`. Contact-page messages go to the same Sheet, on its Messages tab.

## Links you can share

- `collection.html#flower` opens one category
- `collection.html#live-rosin` opens one product (`#strain-1` opens one flower strain)
- `store-locator.html?q=Riverside` (or a ZIP code) starts with that search

## Start Up Dev Server
python3 -m http.server 8000
- Then open `http://localhost:8000`
