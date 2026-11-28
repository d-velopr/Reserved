/*
 * Reserved product list. Edit this file to add, remove or change a product;
 * the Collection page and the Home page tiles both read from it.
 *
 * Every product here is real. A category with no products is hidden.
 *
 * Flower is listed by strain (one entry per strain, sold in 3.5g jars).
 * Every other category is listed by product.
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
 *   size:  weight / count, e.g. "3.5g" or "5 x 0.5g" (shows on the card)
 *   sizes: optional list instead, for a strain sold in several sizes,
 *          e.g. ["3.5g", "7g", "14g"] (shows on the sheet only)
 *   line:  optional product line, e.g. "Tiger Ztripez" (shows on the card)
 *   type:  "Indica", "Sativa" or "Hybrid" (flower strains; optional elsewhere)
 *   lineage, thc: optional, e.g. "Gelato x OG Kush", "27%"
 *   desc:  one or two short sentences
 *   img:   optional photo path (square works best, e.g. assets/img/prerolls/x.webp).
 *          Leave it out to show the Reserved crest on the category color.
 *   sheetImg: optional different image for the sheet that opens on tap
 *          (defaults to img). Used for strain logos where the photo is low-res.
 *   sheetCutout: optional: true when sheetImg has a see-through background
 *   sheetSoon: optional: true adds "Images coming soon" on the sheet, under
 *          sheetImg (a strain logo) or the crest when there's no sheetImg.
 *          For photos too small to blow up; the card keeps its photo.
 *   cutout: optional: true when the images have a see-through background
 *          (a logo or label). They show whole, on the category color,
 *          instead of filling the frame like a photo.
 *   soon:  optional: true shows a "Coming soon" tag
 */
window.RESERVED_CATEGORIES = [
  { id: "flower",       name: "Flower",       color: "#1F7A4D", unit: "strain" },
  { id: "pre-rolls",    name: "Pre-Rolls",    color: "#B3203A" },
  { id: "concentrates", name: "Concentrates", color: "#D99A1E" },
  { id: "vapes",        name: "Vapes",        color: "#1E5FD9" }
];

window.RESERVED_PRODUCTS = [
  // Flower: 3.5g jars
  { id: "blueberry-chews", cat: "flower", name: "Blueberry Chews", size: "3.5g", type: "Indica", lineage: "Blueberry x Hi-Chew",
    img: "assets/img/flower/blueberry-chews.webp" },
  { id: "candy-paint-og", cat: "flower", name: "Candy Paint OG", size: "3.5g", type: "Hybrid", lineage: "Candy Fumez x Permanent Marker",
    img: "assets/img/flower/candy-paint-og.webp" },
  { id: "green-dragon-kush", cat: "flower", name: "Green Dragon Kush", size: "3.5g", type: "Indica", lineage: "Green Crack x Candy Kush",
    img: "assets/img/flower/green-dragon-kush.webp" },
  { id: "rosewater-runtz", cat: "flower", name: "Rosewater Runtz", size: "3.5g", type: "Indica", lineage: "White Runtz x Gelato 41",
    img: "assets/img/flower/rosewater-runtz.webp" },
  { id: "strawberry-funnel-cakez", cat: "flower", name: "Strawberry Funnel Cakez", size: "3.5g", type: "Indica", lineage: "Chronic x White Widow x Cheese",
    img: "assets/img/flower/strawberry-funnel-cakez.webp" },
  { id: "zunami", cat: "flower", name: "Zunami", size: "3.5g", type: "Hybrid", lineage: "Zkittlez x Gelato 41 x Sherb BX1",
    img: "assets/img/flower/zunami.webp" },
  // Pre-rolls: Tiger Ztripez (infused) and Minis (flower only)
  { id: "lilas-lotus-tiger-ztripez", cat: "pre-rolls", line: "Tiger Ztripez", name: "Lila's Lotus", size: "Single", desc: "1.5g flower + 0.5g live resin concentrate in three stripes",
    img: "assets/img/prerolls/lilas-lotus-tiger-ztripez.webp" },
  { id: "hardcore-og-tiger-ztripez", cat: "pre-rolls", line: "Tiger Ztripez", name: "Hardcore OG", size: "Single", desc: "1.5g flower + 0.5g live resin concentrate in three stripes",
    img: "assets/img/prerolls/hardcore-og-tiger-ztripez.webp",
    sheetSoon: true },
  { id: "matcha-tiger-ztripez", cat: "pre-rolls", line: "Tiger Ztripez", name: "Matcha", size: "Single", desc: "1.5g flower + 0.5g live resin concentrate in three stripes",
    img: "assets/img/prerolls/matcha-tiger-ztripez.webp" },
  { id: "rainbow-z-tiger-ztripez", cat: "pre-rolls", line: "Tiger Ztripez", name: "Rainbow Z", size: "Single", desc: "1.5g flower + 0.5g live resin concentrate in three stripes",
    img: "assets/img/prerolls/rainbow-z-tiger-ztripez.webp" },
  { id: "sour-diesel-tiger-ztripez", cat: "pre-rolls", line: "Tiger Ztripez", name: "Sour Diesel", size: "Single", desc: "1.5g flower + 0.5g live resin concentrate in three stripes",
    img: "assets/img/prerolls/sour-diesel-tiger-ztripez.webp" },
  { id: "toad-venom-tiger-ztripez", cat: "pre-rolls", line: "Tiger Ztripez", name: "Toad Venom", size: "Single", desc: "1.5g flower + 0.5g live resin concentrate in three stripes",
    img: "assets/img/prerolls/toad-venom-tiger-ztripez.webp" },
  { id: "zandia-tiger-ztripez", cat: "pre-rolls", line: "Tiger Ztripez", name: "Zandia", size: "Single", desc: "1.5g flower + 0.5g live resin concentrate in three stripes",
    img: "assets/img/prerolls/zandia-tiger-ztripez.webp" },
  { id: "biscotti-minis", cat: "pre-rolls", line: "Minis", name: "Biscotti", size: "Pack of 6", desc: "Six flower pre-rolls",
    img: "assets/img/prerolls/biscotti-minis.webp" },
  { id: "bubblegum-gelato-minis", cat: "pre-rolls", line: "Minis", name: "Bubblegum Gelato", size: "Pack of 6", desc: "Six flower pre-rolls",
    img: "assets/img/prerolls/bubblegum-gelato-minis.webp" },
  { id: "sour-diesel-minis", cat: "pre-rolls", line: "Minis", name: "Sour Diesel", size: "Pack of 6", desc: "Six flower pre-rolls",
    img: "assets/img/prerolls/sour-diesel-minis.webp" },
  { id: "tahoe-og-minis", cat: "pre-rolls", line: "Minis", name: "Tahoe OG", size: "Pack of 6", desc: "Six flower pre-rolls",
    img: "assets/img/prerolls/tahoe-og-minis.webp" },
  { id: "zkittlez-minis", cat: "pre-rolls", line: "Minis", name: "Zkittlez", size: "Pack of 6", desc: "Six flower pre-rolls",
    img: "assets/img/prerolls/zkittlez-minis.webp" },
  // Concentrates
  { id: "cherry-bombs-badder", cat: "concentrates", line: "Live Resin Badder", name: "Cherry Bombs", size: "1g", type: "Hybrid", desc: "Live resin badder from fresh-frozen flower",
    img: "assets/img/concentrates/cherry-bombs-badder.webp" },
  { id: "octane-gas-badder", cat: "concentrates", line: "Live Resin Badder", name: "Octane Gas", size: "1g", type: "Indica", desc: "Live resin badder from fresh-frozen flower",
    img: "assets/img/concentrates/octane-gas-badder.webp" },
  { id: "tahiti-lime-badder", cat: "concentrates", line: "Live Resin Badder", name: "Tahiti Lime", size: "1g", type: "Sativa", desc: "Live resin badder from fresh-frozen flower",
    img: "assets/img/concentrates/tahiti-lime-badder.webp" },
  // Vapes
  { id: "blueberry-chews-vape", cat: "vapes", line: "Live Resin Vape", name: "Blueberry Chews", size: "1g",
    img: "assets/img/vapes/blueberry-chews-vape.webp" },
  { id: "bubblegum-gelato-vape", cat: "vapes", line: "Live Resin Vape", name: "Bubblegum Gelato", size: "1g",
    img: "assets/img/vapes/bubblegum-gelato-vape.webp",
    sheetSoon: true },
  { id: "candy-paint-og-vape", cat: "vapes", line: "Live Resin Vape", name: "Candy Paint OG", size: "1g",
    img: "assets/img/vapes/candy-paint-og-vape.webp",
    sheetSoon: true },
  { id: "green-dragon-kush-vape", cat: "vapes", line: "Live Resin Vape", name: "Green Dragon Kush", size: "1g",
    img: "assets/img/vapes/green-dragon-kush-vape.webp",
    sheetSoon: true },
  { id: "jelly-zoughnutz-vape", cat: "vapes", line: "Live Resin Vape", name: "Jelly Zonutz", size: "1g",
    img: "assets/img/vapes/jelly-zoughnutz-vape.webp" },
  { id: "rosewater-runtz-vape", cat: "vapes", line: "Live Resin Vape", name: "Rosewater Runtz", size: "1g",
    img: "assets/img/vapes/rosewater-runtz-vape.webp" },
  { id: "strawberry-funnel-cake-vape", cat: "vapes", line: "Live Resin Vape", name: "Strawberry Funnel Cakez", size: "1g",
    img: "assets/img/vapes/strawberry-funnel-cake-vape.webp" }
];
