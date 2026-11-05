/*
 * Reserved product list. Edit this file to add, remove or change a product;
 * the Collection page and the Home page tiles both read from it.
 *
 * PLACEHOLDERS: every product below is a stand-in (product formats only, no
 * strain names, no lab numbers). Swap in the real lineup before launch.
 *
 * Categories, in the order they show:
 *   id:    used in links, e.g. collection.html#flower
 *   color: the card background behind the crest when a product has no photo
 *          (thread colors from the wordmark)
 *
 * Products:
 *   id:    unique, lowercase-with-dashes; used in share links (collection.html#<id>)
 *   cat:   a category id from above
 *   name:  product name
 *   size:  weight / count, e.g. "3.5g" or "5 x 0.5g"
 *   type:  optional: "Indica", "Sativa" or "Hybrid"
 *   desc:  one or two short sentences
 *   img:   optional photo path (square works best, e.g. assets/img/products/x.webp).
 *          Leave it out to show the Reserved crest on the category color.
 *   soon:  optional: true shows a "Coming soon" tag
 */
window.RESERVED_CATEGORIES = [
  { id: "flower",       name: "Flower",       color: "#1F7A4D", blurb: "Cultivated by palm trees. Jarred fresh." },
  { id: "pre-rolls",    name: "Pre-Rolls",    color: "#B3203A", blurb: "Whole flower, rolled and ready." },
  { id: "concentrates", name: "Concentrates", color: "#D99A1E", blurb: "Small-batch extracts for the heads." },
  { id: "vapes",        name: "Vapes",        color: "#1E5FD9", blurb: "Pocket-size and easy to carry." },
  { id: "edibles",      name: "Edibles",      color: "#6B3A9A", blurb: "Measured doses. Start low, go slow." }
];

window.RESERVED_PRODUCTS = [
  { id: "flower-eighth",    cat: "flower",       name: "Eighth",              size: "3.5g",      desc: "Our everyday jar. Top-shelf buds, sealed fresh." },
  { id: "flower-quarter",   cat: "flower",       name: "Quarter",             size: "7g",        desc: "Same top-shelf flower, more of it." },
  { id: "flower-half",      cat: "flower",       name: "Half Ounce",          size: "14g",       desc: "For the regulars." },
  { id: "preroll-single",   cat: "pre-rolls",    name: "Single",              size: "1g",        desc: "One full gram of flower, no shake." },
  { id: "preroll-five",     cat: "pre-rolls",    name: "5 Pack",              size: "5 x 0.5g",  desc: "Five half-gram minis to pass around." },
  { id: "live-rosin",       cat: "concentrates", name: "Live Rosin",          size: "1g",        desc: "Solventless, pressed from fresh-frozen flower." },
  { id: "badder",           cat: "concentrates", name: "Badder",              size: "1g",        desc: "Whipped smooth and easy to dab.", soon: true },
  { id: "vape-aio",         cat: "vapes",        name: "All-In-One",          size: "1g",        desc: "Charge it, hit it, done. No battery needed." },
  { id: "vape-cart",        cat: "vapes",        name: "Cartridge",           size: "1g",        desc: "Fits standard 510 batteries." },
  { id: "gummies",          cat: "edibles",      name: "Gummies",             size: "10 x 10mg", desc: "Ten pieces, 10mg each.", soon: true }
];
