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
      if (!n) return ""; // no tile for an empty category
      return '<li><a class="tile" href="collection.html#' + esc(c.id) + '" style="--cat:' + esc(c.color) + '">' +
        '<img src="assets/img/gen/crest.webp" alt="" loading="lazy" />' +
        '<span class="tile-name">' + esc(c.name) + "</span>" +
        '<span class="tile-n">' + n + " " + (c.unit || "product") + (n === 1 ? "" : "s") + "</span></a></li>";
    }).join("");
  }

  // Find a Store: one chip per city, each opening the locator on that city.
  var STORES = window.RESERVED_STORES || [];
  var cityList = document.getElementById("store-cities");
  if (cityList) {
    var cities = [];
    STORES.forEach(function (s) { if (cities.indexOf(s.city) < 0) cities.push(s.city); });
    cityList.innerHTML = cities.map(function (c) {
      return '<li><a href="store-locator.html?q=' + encodeURIComponent(c) + '">' + esc(c) + "</a></li>";
    }).join("");
  }
})();
