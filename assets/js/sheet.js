/* Product sheet: the card that opens over the page with one product's photo,
   details, "Find it in a store" and Share. Used by the Collection and the
   Tiger Ztripez page. Products come from products.js; the page needs the
   <dialog id="sheet"> markup (see collection.html).

   Any link or button with data-sheet="<product id>" opens that product's
   sheet instead of leaving the page. */
(function () {
  "use strict";

  var PRODUCTS = window.RESERVED_PRODUCTS || [];
  var CREST = "assets/img/gen/crest.webp";
  var STAMP = "assets/img/gen/stamp.webp";

  var catById = {}, productById = {};
  (window.RESERVED_CATEGORIES || []).forEach(function (c) { catById[c.id] = c; });
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
        : '<img class="art-stamp" src="' + STAMP + '" alt="" loading="lazy" />';
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

  // Sheet line: adds lineage and THC when a strain has them
  function sheetMeta(p) {
    return [p.line, p.size, p.type, p.lineage, p.thc ? "THC " + p.thc : ""].filter(Boolean).map(esc).join(" · ");
  }

  function setHash(h) {
    history.replaceState(null, "", location.pathname + location.search + (h ? "#" + h : ""));
  }

  var sheet = document.getElementById("sheet");
  var sheetBody = document.getElementById("sheet-body");
  var lastFocus = null;
  var hashBefore = "";
  var onClose = null;

  function open(id, from) {
    var p = productById[id];
    if (!p || !sheet) return false;
    var c = catById[p.cat] || {};
    if (!sheet.open) {
      lastFocus = from || document.activeElement;
      hashBefore = location.hash.slice(1);
    }
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
    return true;
  }

  // Phones (iPhone included) get their own share menu: Messages, AirDrop,
  // WhatsApp and the rest. It has to be called straight from the tap, so
  // nothing async runs before navigator.share. Where there's no share menu
  // (most desktops, some in-app browsers), or it fails, the link is copied.
  // The link opens this same page with the sheet up.
  function share(p) {
    var url = location.href.split("#")[0] + "#" + p.id;
    var title = "Reserved " + [p.line, p.name].filter(Boolean).join(" ");
    var shareMsg = document.getElementById("share-msg");
    function say(text, ok) {
      shareMsg.textContent = text;
      shareMsg.className = "form-msg" + (ok ? " ok" : "");
    }
    function copy() {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(url).then(function () { say("Link copied.", true); }, oldCopy);
      } else {
        oldCopy();
      }
    }
    // Older browsers: copy from a hidden text box
    function oldCopy() {
      var box = document.createElement("textarea");
      box.value = url;
      box.setAttribute("readonly", "");
      box.style.cssText = "position:fixed;top:0;left:0;opacity:0;font-size:16px";
      sheet.appendChild(box);
      box.select();
      box.setSelectionRange(0, url.length);
      var done = false;
      try { done = document.execCommand("copy"); } catch (e) {}
      box.remove();
      say(done ? "Link copied." : "Copy this link: " + url, done);
    }
    var data = { title: title, url: url };
    if (navigator.share && (!navigator.canShare || navigator.canShare(data))) {
      navigator.share(data).catch(function (err) {
        // Closing the menu without sharing is fine; anything else, copy instead
        if (!err || err.name !== "AbortError") copy();
      });
    } else {
      copy();
    }
  }

  if (sheet) {
    document.getElementById("sheet-close").addEventListener("click", function () { sheet.close(); });
    // Tap the dark area around the sheet to close it.
    sheet.addEventListener("click", function (e) { if (e.target === sheet) sheet.close(); });
    sheet.addEventListener("close", function () {
      // Back to the link the page had before the sheet (not a product link,
      // or a reload would open the sheet again). A page can decide instead.
      if (onClose) onClose();
      else setHash(productById[hashBefore] ? "" : hashBefore);
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    });

    // data-sheet links: open the sheet here instead of following the link
    document.addEventListener("click", function (e) {
      var el = e.target.closest("[data-sheet]");
      if (!el || e.metaKey || e.ctrlKey || e.shiftKey || e.button > 0) return;
      if (open(el.getAttribute("data-sheet"), el)) e.preventDefault();
    });
  }

  window.ReservedSheet = {
    esc: esc,
    artHtml: artHtml,
    open: open,
    setHash: setHash,
    isProduct: function (id) { return !!productById[id]; },
    onClose: function (fn) { onClose = fn; },
    // Open the product named in the link (page.html#<product id>), if any
    openFromHash: function () {
      var id = decodeURIComponent(location.hash.slice(1));
      return productById[id] ? open(id) : false;
    }
  };
})();
