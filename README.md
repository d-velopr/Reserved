# Reserved

Static site for Reserved LLC (reservedwayornoway.com). No build step: open the HTML files or serve the folder.

| Page | File | Script |
|------|------|--------|
| Home | `index.html` | `assets/js/home.js` |
| Collection | `collection.html` | `assets/js/collection.js` |
| Store Locator | `store-locator.html` | `assets/js/locator.js` |

Every page also loads `assets/js/site.js` (analytics, Subscribe form) and `assets/css/style.css`.

The 21+ entry gate is on the Home page only. A first-time visitor who opens another page is sent to `index.html?next=<that page>`, passes the gate, then goes back to the page they asked for.

## Editing content

- **Products:** `assets/js/products.js`. The Collection page and the Home tiles both read it.
- **Stores:** `assets/js/stores.js`. The map, the store list, and the Home city chips all read it.
- **Sign-ups:** go to a Google Sheet through `subscribe.gs`.

## Links you can share

- `collection.html#flower` opens one category
- `collection.html#live-rosin` opens one product
- `store-locator.html?q=Riverside` (or a ZIP code) starts with that search
