/* Strain logo strip (Store Locator). Glides left at one steady speed and
   loops forever. Drag it sideways to scrub; tap a logo to open that product
   in the Collection when there is one.
   To add a strain: drop its logo in assets/img/strains/ and add a line below. */
(function () {
  "use strict";

  // name: alt text. logo: file in assets/img/strains/. glow: color behind it.
  // id: optional product id in products.js (makes the logo a link).
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
  var SPEED = 40; // pixels per second, the same on every screen

  var track = document.getElementById("lineup-track");
  if (!track) return;
  var view = track.parentNode;

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // Two copies back to back, so when the first slides off the second is in
  // exactly its place and the loop has no seam. The copy is hidden from
  // screen readers and the keyboard.
  function slidesHtml(copy) {
    return STRAINS.map(function (s, i) {
      var img = '<img src="assets/img/strains/' + esc(s.logo) + '.webp" alt="' + (copy ? "" : esc(s.name)) + '"' +
        (!copy && i < 3 ? "" : ' loading="lazy"') + ' draggable="false" />';
      var inner = s.id
        ? '<a class="lineup-stage" href="collection.html#' + esc(s.id) + '"' + (copy ? ' tabindex="-1"' : "") + ' draggable="false">' + img + "</a>"
        : '<span class="lineup-stage">' + img + "</span>";
      return '<li class="lineup-slide" style="--glow:' + esc(s.glow) + '"' + (copy ? ' aria-hidden="true"' : "") + ">" + inner + "</li>";
    }).join("");
  }
  track.innerHTML = slidesHtml(false) + slidesHtml(true);

  var n = STRAINS.length;
  var loopW = 0; // width of one full copy, including the gap after it
  function measure() { loopW = track.children[n].offsetLeft - track.children[0].offsetLeft; }
  measure();
  window.addEventListener("resize", measure);

  var x = 0;
  function wrap() {
    if (!loopW) return;
    x = ((x % loopW) + loopW) % loopW;
  }
  function paint() { track.style.transform = "translate3d(" + (-x) + "px,0,0)"; }

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var onScreen = true, focused = false, dragging = false;

  // The steady glide. Time-based, so it moves at SPEED whatever the frame rate.
  var last = 0;
  function frame(t) {
    var dt = last ? Math.min(t - last, 100) / 1000 : 0;
    last = t;
    if (!reduce && onScreen && !focused && !dragging) {
      x += SPEED * dt;
      wrap();
      paint();
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (e) { onScreen = e[0].isIntersecting; }).observe(view);
  }
  // Hold still only for keyboard focus. A mouse press also focuses a link, and
  // pausing for that would stop the strip after a drag (or after Back).
  view.addEventListener("focusin", function (e) {
    try { focused = e.target.matches(":focus-visible"); } catch (err) { focused = false; }
  });
  view.addEventListener("focusout", function () { focused = false; });

  // Drag to scrub. Vertical swipes still scroll the page (touch-action: pan-y).
  var startX = 0, startPos = 0, moved = false, pid = null;
  view.addEventListener("pointerdown", function (e) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    pid = e.pointerId; startX = e.clientX; startPos = x; moved = false; dragging = true;
  });
  view.addEventListener("pointermove", function (e) {
    if (e.pointerId !== pid) return;
    var dx = e.clientX - startX;
    if (!moved && Math.abs(dx) > 6) { moved = true; view.setPointerCapture(pid); }
    if (moved) { x = startPos - dx; wrap(); paint(); }
  });
  function end(e) {
    if (e.pointerId !== pid) return;
    pid = null; dragging = false; last = 0;
  }
  // On window, not the strip: a press that wanders off the strip before it
  // lets go must still end the drag, or the strip would stay stopped.
  window.addEventListener("pointerup", end);
  window.addEventListener("pointercancel", end);
  // A drag is not a tap: don't open the product after scrubbing.
  view.addEventListener("click", function (e) {
    if (moved) { e.preventDefault(); moved = false; }
  }, true);
})();
