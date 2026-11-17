/* Strain logo slideshow (Store Locator). Swipe it, tap a dot, or let it play.
   Tapping a logo opens that product in the Collection when there is one.
   To add a strain: drop its logo in assets/img/strains/ and add a line below. */
(function () {
  "use strict";

  // name: alt text. logo: file in assets/img/strains/. glow: color behind it.
  // id: optional product id in products.js (makes the slide a link).
  var STRAINS = [
    { name: "Candy Paint OG",         logo: "candy-paint-og",         glow: "#7A1E8C", id: "candy-paint-og-vape" },
    { name: "Zandia",                 logo: "zandia",                 glow: "#1F7A4D", id: "zandia-tiger-ztripez" },
    { name: "Blueberry Chews",        logo: "blueberry-chews",        glow: "#1E5FD9", id: "blueberry-chews-vape" },
    { name: "Hardcore OG",            logo: "hardcore-og",            glow: "#D99A1E", id: "hardcore-og-tiger-ztripez" },
    { name: "Rosewater Runtz",        logo: "rosewater-runtz",        glow: "#B3203A", id: "rosewater-runtz-vape" },
    { name: "Rainbow Z",              logo: "rainbow-z",              glow: "#6B3A9A", id: "rainbow-z-tiger-ztripez" },
    { name: "Strawberry Funnel Cake", logo: "strawberry-funnel-cake", glow: "#B3203A", id: "strawberry-funnel-cake-vape" },
    { name: "Green Dragon Kush",      logo: "green-dragon-kush",      glow: "#1F7A4D", id: "green-dragon-kush-vape" },
    { name: "Jelly Zoughnutz",        logo: "jelly-zoughnutz",        glow: "#6B3A9A", id: "jelly-zoughnutz-vape" },
    { name: "Bubblegum Gelato",       logo: "bubblegum-gelato",       glow: "#C2185B", id: "bubblegum-gelato-vape" },
    { name: "Peach Bellini",          logo: "peach-bellini",          glow: "#E8641B" },
    { name: "Orange Creamsicle",      logo: "orange-creamsicle",      glow: "#E8641B" },
    { name: "Rainbow Jawbreaker",     logo: "rainbow-jawbreaker",     glow: "#1E5FD9" },
    { name: "Sour Diesel",            logo: "sour-diesel",            glow: "#3E8E1F" }
  ];
  var EVERY = 3500;   // ms between slides
  var RESUME = 8000;  // ms of quiet after a swipe before it plays again
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var track = document.getElementById("lineup-track");
  var dots = document.getElementById("lineup-dots");
  if (!track || !dots) return;

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  track.innerHTML = STRAINS.map(function (s, i) {
    var img = '<img src="assets/img/strains/' + esc(s.logo) + '.webp" alt="' + esc(s.name) + '"' +
      (i > 1 ? ' loading="lazy"' : "") + " />";
    var inner = s.id
      ? '<a class="lineup-stage" href="collection.html#' + esc(s.id) + '">' + img + "</a>"
      : '<span class="lineup-stage">' + img + "</span>";
    return '<li class="lineup-slide" style="--glow:' + esc(s.glow) + '" aria-label="' +
      (i + 1) + " of " + STRAINS.length + '">' + inner + "</li>";
  }).join("");

  dots.innerHTML = STRAINS.map(function (s, i) {
    return '<button type="button" class="lineup-dot" aria-label="Show ' + esc(s.name) + '" data-i="' + i + '"></button>';
  }).join("");

  var slides = track.children;
  var dotEls = dots.children;
  var current = -1;

  function setCurrent(i) {
    if (i === current) return;
    if (dotEls[current]) dotEls[current].removeAttribute("aria-current");
    current = i;
    dotEls[i].setAttribute("aria-current", "true");
  }

  function go(i) {
    // The track is position: relative, so offsetLeft is measured inside it
    var left = slides[i].offsetLeft - (track.clientWidth - slides[i].offsetWidth) / 2;
    track.scrollTo({ left: left, behavior: reduce ? "auto" : "smooth" });
    setCurrent(i);
  }

  // Which slide is centered right now
  var ticking = false;
  track.addEventListener("scroll", function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      var mid = track.scrollLeft + track.clientWidth / 2;
      var best = 0, bestD = Infinity;
      for (var i = 0; i < slides.length; i++) {
        var d = Math.abs(slides[i].offsetLeft + slides[i].offsetWidth / 2 - mid);
        if (d < bestD) { bestD = d; best = i; }
      }
      setCurrent(best);
    });
  }, { passive: true });

  dots.addEventListener("click", function (e) {
    var b = e.target.closest(".lineup-dot");
    if (!b) return;
    go(+b.dataset.i);
    hold();
  });

  // Autoplay: off for reduced motion, paused while touched, hidden or off screen
  var heldUntil = 0, onScreen = false;

  function hold() { heldUntil = Date.now() + RESUME; }
  function tick() {
    if (!onScreen || document.hidden || Date.now() < heldUntil) return;
    go((current + 1) % slides.length);
  }

  setCurrent(0);
  if (reduce) return;

  track.addEventListener("pointerdown", hold, { passive: true });
  track.addEventListener("wheel", hold, { passive: true });
  track.addEventListener("focusin", hold);
  track.addEventListener("mouseenter", function () { heldUntil = Infinity; });
  track.addEventListener("mouseleave", hold);

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      onScreen = entries[0].isIntersecting;
    }, { threshold: 0.5 }).observe(track);
  } else {
    onScreen = true;
  }
  setInterval(tick, EVERY);
})();
