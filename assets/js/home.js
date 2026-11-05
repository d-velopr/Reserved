/* Home page: category tiles (from products.js) and Coming Soon cards
   (from stores.js), so editing those files updates the home page too. */
(function () {
  "use strict";

  var CATS = window.RESERVED_CATEGORIES || [];
  var PRODUCTS = window.RESERVED_PRODUCTS || [];

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // Hero: swap in the looping video (palms + ocean) after the page has loaded,
  // so it never slows the first view. Skipped for reduced motion / data saver.
  var heroVideo = document.querySelector(".hero-video");
  if (heroVideo) {
    var calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var saveData = navigator.connection && navigator.connection.saveData;
    if (!calm && !saveData) {
      var startHero = function () {
        heroVideo.addEventListener("playing", function () { heroVideo.classList.add("is-playing"); }, { once: true });
        // MP4 is smaller; WebM covers browsers without H.264 (some Linux builds)
        var mp4 = heroVideo.canPlayType('video/mp4; codecs="avc1.640028"');
        heroVideo.src = heroVideo.getAttribute(mp4 ? "data-mp4" : "data-webm");
        var p = heroVideo.play();
        if (p && p.catch) p.catch(function () {}); // autoplay blocked: the photo stays
      };
      if (document.readyState === "complete") startHero();
      else window.addEventListener("load", startHero, { once: true });
    }
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

  // Coming Soon cards. The section hides itself when the list is empty.
  var SOON = window.RESERVED_COMING_SOON || [];
  var COLORS = ["var(--t-green)", "var(--t-red)", "var(--t-gold)", "var(--t-blue)", "var(--t-orange)", "var(--t-purple)"];
  var PIN = '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 44S10 29.5 10 19a14 14 0 0 1 28 0c0 10.5-14 25-14 25z" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/><circle cx="24" cy="19" r="5" fill="currentColor"/></svg>';
  var soonList = document.getElementById("coming-list");
  if (soonList) {
    if (!SOON.length) {
      soonList.closest("section").hidden = true;
    } else {
      soonList.innerHTML = SOON.map(function (s, i) {
        var detail = [s.name, s.when].filter(Boolean).map(esc).join(" &middot; ");
        return '<li class="soon-card" style="--tag:' + COLORS[i % COLORS.length] + '">' + PIN +
          "<h3>" + esc(s.city) + "</h3>" + (detail ? "<p>" + detail + "</p>" : "") + "</li>";
      }).join("");
    }
  }
})();
