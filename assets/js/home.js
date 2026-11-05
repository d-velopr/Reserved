/* Home page: category tiles (from products.js) and city chips (from stores.js),
   so adding a product or store updates the home page too. */
(function () {
  "use strict";

  var CATS = window.RESERVED_CATEGORIES || [];
  var PRODUCTS = window.RESERVED_PRODUCTS || [];
  var STORES = window.RESERVED_STORES || [];

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  var tiles = document.getElementById("cat-tiles");
  if (tiles) {
    tiles.innerHTML = CATS.map(function (c) {
      var n = PRODUCTS.filter(function (p) { return p.cat === c.id; }).length;
      return '<li><a class="tile" href="collection.html#' + esc(c.id) + '" style="--cat:' + esc(c.color) + '">' +
        '<img src="assets/img/gen/crest.webp" alt="" loading="lazy" />' +
        '<span class="tile-name">' + esc(c.name) + "</span>" +
        '<span class="tile-n">' + n + (n === 1 ? " product" : " products") + "</span></a></li>";
    }).join("");
  }

  var cities = document.getElementById("city-chips");
  if (cities) {
    cities.innerHTML = STORES.map(function (s) {
      return '<li><a class="city-chip" style="--tag:' + esc(s.tag) + '" href="store-locator.html?q=' +
        encodeURIComponent(s.city) + '">' + esc(s.city) + "</a></li>";
    }).join("");
  }

  var count = document.getElementById("store-count");
  if (count && STORES.length) count.textContent = STORES.length;
})();
