/* Collection page: category chips and the product grid. A tap on a card
   opens the product sheet (sheet.js). Products come from products.js.
   Links: collection.html#flower opens one category,
          collection.html#<product id> opens that product's sheet. */
(function () {
  "use strict";

  var PRODUCTS = window.RESERVED_PRODUCTS || [];
  // Categories with no products yet are left out (no empty chip or section).
  var CATS = (window.RESERVED_CATEGORIES || []).filter(function (c) {
    return PRODUCTS.some(function (p) { return p.cat === c.id; });
  });
  var catById = {}, productById = {};
  CATS.forEach(function (c) { catById[c.id] = c; });
  PRODUCTS.forEach(function (p) { productById[p.id] = p; });

  var RS = window.ReservedSheet;
  var esc = RS.esc, artHtml = RS.artHtml;

  function metaLine(p) {
    return [p.line, p.size, p.type].filter(Boolean).map(esc).join(" · ");
  }

  /* ---------- Chips ---------- */
  var chipBar = document.getElementById("chips");
  var chipData = [{ id: "all", name: "All" }].concat(CATS);
  chipBar.innerHTML = chipData.map(function (c) {
    var count = c.id === "all" ? PRODUCTS.length : PRODUCTS.filter(function (p) { return p.cat === c.id; }).length;
    return '<button type="button" class="chip" data-cat="' + esc(c.id) + '" aria-pressed="false">' +
      esc(c.name) + ' <span class="chip-n">' + count + "</span></button>";
  }).join("");

  /* ---------- Sections and cards ---------- */
  var shelf = document.getElementById("shelf");
  shelf.innerHTML = CATS.map(function (c) {
    var items = PRODUCTS.filter(function (p) { return p.cat === c.id; });
    if (!items.length) return "";
    return '<section class="shelf-cat" data-cat="' + esc(c.id) + '" aria-labelledby="cat-' + esc(c.id) + '">' +
      '<div class="shelf-head"><h2 id="cat-' + esc(c.id) + '">' + esc(c.name) + "</h2></div>" +
      '<ul class="cards">' + items.map(function (p) {
        return '<li><button type="button" class="card" data-id="' + esc(p.id) + '" aria-haspopup="dialog">' +
          artHtml(p, "card-art") +
          (p.soon ? '<span class="soon">Coming soon</span>' : "") +
          '<span class="card-body"><span class="card-name">' + esc(p.name) + "</span>" +
          '<span class="card-meta">' + metaLine(p) + "</span></span></button></li>";
      }).join("") + "</ul></section>";
  }).join("");

  var activeCat = "all";
  function showCat(id, fromTap) {
    if (id !== "all" && !catById[id]) id = "all";
    activeCat = id;
    Array.prototype.forEach.call(chipBar.children, function (b) {
      var on = b.dataset.cat === id;
      b.setAttribute("aria-pressed", on ? "true" : "false");
      if (on && fromTap) b.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    });
    Array.prototype.forEach.call(shelf.children, function (s) {
      s.hidden = id !== "all" && s.dataset.cat !== id;
    });
    if (fromTap) {
      setHash(id === "all" ? "" : id);
      // Bring the first row of products into view under the sticky bars.
      var header = document.querySelector(".top");
      var top = shelf.getBoundingClientRect().top + window.scrollY -
        chipBar.parentNode.offsetHeight - (header ? header.offsetHeight : 0) - 12;
      if (window.scrollY > top) window.scrollTo({ top: top, behavior: "smooth" });
    }
  }

  chipBar.addEventListener("click", function (e) {
    var b = e.target.closest(".chip");
    if (b) showCat(b.dataset.cat, true);
  });

  var setHash = RS.setHash;

  /* ---------- Product sheet (sheet.js) ---------- */
  // Closing it goes back to the category link (or none)
  RS.onClose(function () { setHash(activeCat === "all" ? "" : activeCat); });

  shelf.addEventListener("click", function (e) {
    var card = e.target.closest(".card");
    if (card) RS.open(card.dataset.id, card);
  });

  /* ---------- Start from the link ---------- */
  var start = decodeURIComponent(location.hash.slice(1));
  if (catById[start]) {
    showCat(start, false);
  } else {
    showCat("all", false);
    if (productById[start]) RS.open(start, shelf.querySelector('.card[data-id="' + start + '"]'));
  }
})();
