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

  // Hero: after the page has loaded, play the intro (tagline spray-painted
  // onto the wall) once, then hand off to the palms + ocean loop. The intro
  // ends on the loop's first frame, so the switch is seamless.
  // Reduced motion / data saver / autoplay blocked: the full photo stays.
  var heroIntro = document.querySelector(".hero-intro");
  var heroLoop = document.querySelector(".hero-loop");
  var heroPic = document.querySelector(".hero picture");
  if (heroLoop) {
    var calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var saveData = navigator.connection && navigator.connection.saveData;
    var mp4 = heroLoop.canPlayType('video/mp4; codecs="avc1.640028"'); // else WebM (some Linux builds)
    var showFullPhoto = function () {
      // The tagline-free photo only makes sense if the spray plays
      var src = heroPic && heroPic.querySelector("source");
      if (src) src.remove();
    };
    var load = function (v) { v.src = v.getAttribute(mp4 ? "data-mp4" : "data-webm"); };
    var play = function (v, onFail) {
      v.addEventListener("playing", function () { v.classList.add("is-playing"); }, { once: true });
      var p = v.play();
      if (p && p.catch) p.catch(onFail);
    };
    var startHero = function () {
      var img = heroPic && heroPic.querySelector("img");
      var cleanShown = img && /hero-clean/.test(img.currentSrc);
      if (heroIntro && cleanShown) {
        // If the intro hasn't started in 4s (slow network), put the tagline back
        var slow = setTimeout(showFullPhoto, 4000);
        heroIntro.addEventListener("playing", function () { clearTimeout(slow); }, { once: true });
        heroIntro.addEventListener("ended", function () { play(heroLoop, function () {}); }, { once: true });
        load(heroIntro);
        load(heroLoop);
        heroLoop.preload = "auto";
        play(heroIntro, function () { clearTimeout(slow); showFullPhoto(); });
      } else {
        showFullPhoto();
        load(heroLoop);
        play(heroLoop, function () {});
      }
    };
    // Wait for the page to load and, on a first visit, for the 21+ gate to
    // close, so the spray isn't over before anyone can see it.
    var whenOpen = function (fn) {
      if (window.RESERVED_OPEN) fn();
      else document.addEventListener("reserved:open", fn, { once: true });
    };
    if (calm || saveData) showFullPhoto();
    else if (document.readyState === "complete") whenOpen(startHero);
    else window.addEventListener("load", function () { whenOpen(startHero); }, { once: true });
  }

  var tiles = document.getElementById("cat-tiles");
  if (tiles) {
    tiles.innerHTML = CATS.map(function (c) {
      var n = PRODUCTS.filter(function (p) { return p.cat === c.id; }).length;
      return '<li><a class="tile" href="collection.html#' + esc(c.id) + '" style="--cat:' + esc(c.color) + '">' +
        '<img src="assets/img/gen/crest.webp" alt="" loading="lazy" />' +
        '<span class="tile-name">' + esc(c.name) + "</span>" +
        '<span class="tile-n">' + n + " " + (c.unit || "product") + (n === 1 ? "" : "s") + "</span></a></li>";
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
