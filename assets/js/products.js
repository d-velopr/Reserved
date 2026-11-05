/*
 * Reserved product list. Edit this file to add, remove or change a product;
 * the Collection page and the Home page tiles both read from it.
 *
 * PLACEHOLDERS: every product below is a stand-in ("Strain 1" and so on for
 * Flower, product formats only for the rest, no lab numbers). Swap in the
 * real lineup before launch.
 *
 * Flower is listed by strain (one entry per strain, with the sizes it comes
 * in). Every other category is listed by product.
 *
 * Categories, in the order they show:
 *   id:    used in links, e.g. collection.html#flower
 *   color: the card background behind the crest when a product has no photo
 *          (thread colors from the wordmark)
 *   unit:  optional: what one entry is called in counts ("strain"); default "product"
 *
 * Products:
 *   id:    unique, lowercase-with-dashes; used in share links (collection.html#<id>)
 *   cat:   a category id from above
 *   name:  product name
 *   size:  weight / count, e.g. "3.5g" or "5 x 0.5g" (non-flower products)
 *   sizes: flower strains: the sizes it comes in, e.g. ["3.5g", "7g", "14g"]
 *   type:  "Indica", "Sativa" or "Hybrid" (flower strains; optional elsewhere)
 *   lineage, thc: optional, e.g. "Gelato x OG Kush", "27%"
 *   desc:  one or two short sentences
 *   img:   optional photo path (square works best, e.g. assets/img/products/x.webp).
 *          Leave it out to show the Reserved crest on the category color.
 *   soon:  optional: true shows a "Coming soon" tag
 */
window.RESERVED_CATEGORIES = [
  { id: "flower",       name: "Flower",       color: "#1F7A4D", blurb: "Cultivated by palm trees. Jarred fresh.", unit: "strain" },
  { id: "pre-rolls",    name: "Pre-Rolls",    color: "#B3203A", blurb: "Whole flower, rolled and ready." },
  { id: "concentrates", name: "Concentrates", color: "#D99A1E", blurb: "Small-batch extracts for the heads." },
  { id: "vapes",        name: "Vapes",        color: "#1E5FD9", blurb: "Pocket-size and easy to carry." },
  { id: "edibles",      name: "Edibles",      color: "#6B3A9A", blurb: "Measured doses. Start low, go slow." }
];

window.RESERVED_PRODUCTS = [
  { id: "strain-1",         cat: "flower",       name: "Strain 1",            type: "Indica",    sizes: ["3.5g", "7g", "14g"] },
  { id: "strain-2",         cat: "flower",       name: "Strain 2",            type: "Indica",    sizes: ["3.5g", "7g"] },
  { id: "strain-3",         cat: "flower",       name: "Strain 3",            type: "Sativa",    sizes: ["3.5g", "7g", "14g"] },
  { id: "strain-4",         cat: "flower",       name: "Strain 4",            type: "Sativa",    sizes: ["3.5g"], soon: true },
  { id: "strain-5",         cat: "flower",       name: "Strain 5",            type: "Hybrid",    sizes: ["3.5g", "7g", "14g"] },
  { id: "strain-6",         cat: "flower",       name: "Strain 6",            type: "Hybrid",    sizes: ["3.5g", "7g"] },
  { id: "preroll-single",   cat: "pre-rolls",    name: "Single",              size: "1g",        desc: "One full gram of flower, no shake." },
  { id: "preroll-five",     cat: "pre-rolls",    name: "5 Pack",              size: "5 x 0.5g",  desc: "Five half-gram minis to pass around." },
  { id: "live-rosin",       cat: "concentrates", name: "Live Rosin",          size: "1g",        desc: "Solventless, pressed from fresh-frozen flower." },
  { id: "badder",           cat: "concentrates", name: "Badder",              size: "1g",        desc: "Whipped smooth and easy to dab.", soon: true },
  { id: "vape-aio",         cat: "vapes",        name: "All-In-One",          size: "1g",        desc: "Charge it, hit it, done. No battery needed." },
  { id: "vape-cart",        cat: "vapes",        name: "Cartridge",           size: "1g",        desc: "Fits standard 510 batteries." },
  { id: "gummies",          cat: "edibles",      name: "Gummies",             size: "10 x 10mg", desc: "Ten pieces, 10mg each.", soon: true }
];
