/* Collection page: category chips, product grid, and the product sheet that
   opens on tap. Products come from products.js.
   Links: collection.html#flower opens one category,
          collection.html#<product id> opens that product's sheet. */
(function () {
  "use strict";

  var PRODUCTS = window.RESERVED_PRODUCTS || [];
  // Categories with no products yet are left out (no empty chip or section).
  var CATS = (window.RESERVED_CATEGORIES || []).filter(function (c) {
    return PRODUCTS.some(function (p) { return p.cat === c.id; });
  });
  var CREST = "assets/img/gen/crest.webp";

  var catById = {}, productById = {};
  CATS.forEach(function (c) { catById[c.id] = c; });
  PRODUCTS.forEach(function (p) { productById[p.id] = p; });

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // Product photo, or the crest on the category color when there's no photo.
  // The sheet can use its own image (sheetImg). Cutouts (logos, labels with a
  // see-through background) sit whole on the category color.
  function artHtml(p, cls) {
    var c = catById[p.cat] || {};
    // Better photos on the way: the strain logo (or the crest) with a note.
    if (cls === "sheet-art" && p.sheetSoon) {
      var soonImg = p.sheetImg
        ? '<img class="art-logo" src="' + esc(p.sheetImg) + '" alt="" loading="lazy" />'
        : '<img class="art-crest" src="' + CREST + '" alt="" loading="lazy" />';
      return '<span class="sheet-art art-soon" style="--cat:' + esc(c.color || "#222") + '">' + soonImg +
        '<span class="art-soon-text">Images coming soon</span></span>';
    }
    var useSheet = cls === "sheet-art" && p.sheetImg;
    var src = useSheet ? p.sheetImg : p.img;
    var img = src
      ? '<img src="' + esc(src) + '" alt="" loading="lazy" />'
      : '<img class="art-crest" src="' + CREST + '" alt="" loading="lazy" />';
    var cut = useSheet ? p.sheetCutout : p.cutout;
    var kind = !src ? "" : cut ? " has-cutout" : " has-photo";
    return '<span class="' + cls + kind + '" style="--cat:' + esc(c.color || "#222") + '">' + img + "</span>";
  }

  function metaLine(p) {
    return [p.line, p.size, p.type].filter(Boolean).map(esc).join(" · ");
  }
  // Sheet line: adds lineage and THC when a strain has them
  function sheetMeta(p) {
    return [p.line, p.size, p.type, p.lineage, p.thc ? "THC " + p.thc : ""].filter(Boolean).map(esc).join(" · ");
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

  function setHash(h) {
    history.replaceState(null, "", location.pathname + location.search + (h ? "#" + h : ""));
  }

  /* ---------- Product sheet ---------- */
  var sheet = document.getElementById("sheet");
  var sheetBody = document.getElementById("sheet-body");
  var lastCard = null;

  function openProduct(id) {
    var p = productById[id];
    if (!p) return;
    var c = catById[p.cat] || {};
    sheetBody.innerHTML =
      artHtml(p, "sheet-art") +
      '<div class="sheet-info">' +
        '<p class="sheet-cat" style="--cat:' + esc(c.color || "#222") + '">' + esc(c.name || "") + "</p>" +
        '<h2 id="sheet-title">' + esc(p.name) + "</h2>" +
        (sheetMeta(p) ? '<p class="sheet-meta">' + sheetMeta(p) + "</p>" : "") +
        (p.soon ? '<p class="soon soon-inline">Coming soon</p>' : "") +
        (p.desc ? '<p class="sheet-desc">' + esc(p.desc) + "</p>" : "") +
        // Flower strains: the sizes it comes in
        ((p.sizes || []).length
          ? '<p class="sheet-label">Available in</p><ul class="formats">' +
            p.sizes.map(function (z) { return "<li>" + esc(z) + "</li>"; }).join("") + "</ul>" : "") +
        '<div class="sheet-actions">' +
          '<a class="btn btn-red" href="store-locator.html">' +
            '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22s-7-7.6-7-13a7 7 0 0 1 14 0c0 5.4-7 13-7 13z" fill="currentColor"/><circle cx="12" cy="9" r="2.6" fill="#E53935"/></svg>' +
            "Find it in a store</a>" +
          '<button type="button" class="btn btn-ghost" id="share">' +
            '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 15V3m0 0L7.5 7.5M12 3l4.5 4.5M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
            "Share</button>" +
        "</div>" +
        '<p class="form-msg" id="share-msg" role="status" aria-live="polite"></p>' +
      "</div>";
    document.getElementById("share").addEventListener("click", function () { share(p); });
    setHash(p.id);
    if (!sheet.open) sheet.showModal();
    sheet.scrollTop = 0;
  }

  function share(p) {
    var url = location.href.split("#")[0] + "#" + p.id;
    var shareMsg = document.getElementById("share-msg");
    if (navigator.share) {
      navigator.share({ title: "Reserved " + [p.line, p.name].filter(Boolean).join(" "), url: url }).catch(function () {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(function () {
        shareMsg.textContent = "Link copied.";
        shareMsg.className = "form-msg ok";
      });
    }
  }

  shelf.addEventListener("click", function (e) {
    var card = e.target.closest(".card");
    if (!card) return;
    lastCard = card;
    openProduct(card.dataset.id);
  });

  document.getElementById("sheet-close").addEventListener("click", function () { sheet.close(); });
  // Tap the dark area around the sheet to close it.
  sheet.addEventListener("click", function (e) { if (e.target === sheet) sheet.close(); });
  sheet.addEventListener("close", function () {
    setHash(activeCat === "all" ? "" : activeCat);
    if (lastCard) lastCard.focus();
  });

  /* ---------- Start from the link ---------- */
  var start = decodeURIComponent(location.hash.slice(1));
  if (catById[start]) {
    showCat(start, false);
  } else {
    showCat("all", false);
    if (productById[start]) {
      lastCard = shelf.querySelector('.card[data-id="' + start + '"]');
      openProduct(start);
    }
  }
})();
