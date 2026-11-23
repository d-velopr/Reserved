/* Reserved genetics: every strain in the clone room, typed from the board
   photos (kept off the site). Edit this list to add or remove a strain; the
   page sorts it A-Z and builds the filters, letter groups and A-Z rail from it.

   Write crosses with " x " (e.g. "Bacio x RS11") so the Crosses filter finds
   them and the strain's card lists its parents.

   Tap a strain to open its card. To give one more to show, swap its name for
   an object (both fields optional):
     { name: "Bacio", info: "A sentence or two about it.", img: "assets/img/strains/bacio.webp" }
   Without info or a photo, the card says "More info coming soon". */
var RESERVED_GENETICS = [
  "92 OG", "A8", "Alpha Runtz", "Angel Cake",
  "Bacio", "Bacio x G33Z", "Bacio x LCG", "Bacio x RS11", "Bacio x RS11 x Z",
  "Banana OG", "BBG", "BCG", "BCR", "Bearclaw", "Billy Kimber",
  "Biscotti", "Biscotti x Bacio", "Biscotti x G33Z", "Biscotti x RS11",
  "Blue Dream", "Blue Nerds", "BPC", "BR", "Castaway", "COCO",
  "Dark Venom", "DJSBB", "Double Bubba", "Frapple",
  "G33Z A", "G33Z A x LCG", "Gary Payton", "Gary Payton x Zkit", "Gaszilla",
  "GDP", "Gelato Ice", "Gello", "Gelonade", "Ghost OG", "GMO",
  "Gorilla Fett #1", "Gorilla Fett #2", "Gorilla Fett #3", "Gorilla Rose", "Gorilla Zushi",
  "GxG33/CP #16", "Hells Angel OG", "Holy Fuck", "Honey Crisp", "Jack Herrer",
  "Kush Co OG", "Larry OG", "LCG Runtz", "LCG x JKZ", "Legend OG",
  "Lemon Cherry 420", "Lemonatti", "Lip Smacker",
  "LPC #4", "LPC x Bacio #37", "LPC x Bacio #53", "LPC x Zkit",
  "Mega Wellness OG", "Mochi x Zkit", "Oreoz x Zkit",
  "Papaya", "Piggy Bank", "Pink Fuzz", "Pink Runtz", "Plum Glue", "Plumerian",
  "RS11 x Bacio", "Sherb x Bacio", "Sherb x Zkit", "Smurfs",
  "Sour Diesel #1", "Sour Diesel #2", "Sundae Driver", "Sunset Sherbert", "Super Runtz",
  "The Rucker", "TK OG", "Toad Venom", "TR Dark Venom",
  "White Himalaya", "Wifis",
  "Zebra Fruit #9", "Zebra Fruit x Bacio", "Zixty Zix",
  "Zkit x Bacio", "Zkit x RS11 x Bacio", "ZKittlez", "Zoap",
  "Zombie Brainz #14", "Zombie Brainz #71", "Zookies"
];

/* Filter chips: label + test. "All" is added by the page. */
var RESERVED_GENETICS_FILTERS = [
  { label: "Crosses", test: function (s) { return / x /i.test(s); } },
  { label: "OG",      test: function (s) { return /\bOG\b/.test(s); } },
  { label: "Runtz",   test: function (s) { return /runtz/i.test(s); } },
  { label: "Bacio",   test: function (s) { return /bacio/i.test(s); } },
  { label: "Zkit",    test: function (s) { return /zkit/i.test(s); } },
  { label: "Gorilla", test: function (s) { return /gorilla/i.test(s); } }
];

(function () {
  var grid = document.getElementById("gen-grid");
  if (!grid) return;
  var chipsEl = document.getElementById("gen-chips");
  var q = document.getElementById("gen-q");
  var countEl = document.getElementById("gen-count");
  var empty = document.getElementById("gen-empty");
  var rail = document.getElementById("gen-rail");
  var bar = document.querySelector(".gen-bar");

  var esc = function (s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
  };
  // Entries can be a name or { name, info, img }
  var list = RESERVED_GENETICS.map(function (g) {
    return typeof g === "string" ? { name: g } : g;
  }).sort(function (a, b) {
    return a.name.localeCompare(b.name, "en", { numeric: true, sensitivity: "base" });
  });
  var byName = {};
  list.forEach(function (g) { byName[g.name.toLowerCase()] = g; });
  document.querySelectorAll("[data-gen-total]").forEach(function (el) { el.textContent = list.length; });

  // Grouped by first letter (numbers under "#"). On wide screens the groups
  // melt into one grid of tiles (style.css); on phones each is a letter
  // heading over a list of rows, with the A-Z rail on the right.
  var CHEV = '<svg class="gen-chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var letterOf = function (name) {
    var c = name.charAt(0).toUpperCase();
    return /[A-Z]/.test(c) ? c : "#";
  };
  var groups = [], groupBy = {};
  var tiles = list.map(function (g) {
    var L = letterOf(g.name);
    var grp = groupBy[L];
    if (!grp) {
      var sec = document.createElement("section");
      sec.className = "gen-group";
      sec.id = "gen-" + (L === "#" ? "num" : L);
      sec.innerHTML = '<h3 class="gen-letter">' + L + '</h3><ul class="gen-rows"></ul>';
      grid.appendChild(sec);
      grp = groupBy[L] = { L: L, el: sec, ul: sec.querySelector("ul"), items: [] };
      groups.push(grp);
    }
    var li = document.createElement("li");
    li.className = "gen-item";
    li.innerHTML = '<button type="button" class="gen-tile"><span>' +
      esc(g.name).split(" x ").join(' <i aria-label="cross">×</i> ') + "</span>" + CHEV + "</button>";
    li.firstChild.addEventListener("click", function () { openCard(g, li.firstChild); });
    grp.ul.appendChild(li);
    var t = { el: li, g: g, name: g.name, key: g.name.toLowerCase() };
    grp.items.push(t);
    return t;
  });

  // ---- Filters ----
  var filters = [{ label: "All", test: function () { return true; } }].concat(RESERVED_GENETICS_FILTERS);
  var active = filters[0];
  filters.forEach(function (f) {
    var n = list.filter(function (g) { return f.test(g.name); }).length;
    if (!n) return;
    var b = document.createElement("button");
    b.type = "button";
    b.className = "chip";
    b.setAttribute("aria-pressed", f === active ? "true" : "false");
    b.innerHTML = esc(f.label) + ' <span class="chip-n">' + n + "</span>";
    b.addEventListener("click", function () {
      active = f;
      chipsEl.querySelectorAll(".chip").forEach(function (c) { c.setAttribute("aria-pressed", String(c === b)); });
      apply();
    });
    chipsEl.appendChild(b);
  });

  // ---- A-Z rail (phones): tap a letter, or slide a finger down it ----
  var railBtns = {};
  groups.forEach(function (grp) {
    var b = document.createElement("button");
    b.type = "button";
    b.textContent = grp.L;
    b.setAttribute("aria-label", "Jump to " + (grp.L === "#" ? "numbers" : grp.L));
    b.dataset.l = grp.L;
    rail.appendChild(b);
    railBtns[grp.L] = b;
  });
  var lastJump = null;
  var jump = function (L) {
    var grp = groupBy[L];
    if (!grp || grp.el.hidden || L === lastJump) return;
    lastJump = L;
    // Jump straight there (the site scrolls smoothly; a rail should snap)
    var root = document.documentElement;
    root.style.scrollBehavior = "auto";
    grp.el.scrollIntoView({ block: "start" });
    root.style.scrollBehavior = "";
    rail.querySelectorAll("button").forEach(function (b) { b.classList.toggle("is-at", b.dataset.l === L); });
  };
  rail.addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (b) { lastJump = null; jump(b.dataset.l); }
  });
  var fromTouch = function (e) {
    var t = e.touches[0];
    var el = document.elementFromPoint(rail.getBoundingClientRect().left + rail.offsetWidth / 2, t.clientY);
    var b = el && el.closest && el.closest(".gen-rail button");
    if (b) jump(b.dataset.l);
  };
  rail.addEventListener("touchstart", function (e) { lastJump = null; rail.classList.add("is-touch"); fromTouch(e); }, { passive: true });
  rail.addEventListener("touchmove", function (e) { e.preventDefault(); fromTouch(e); }, { passive: false });
  rail.addEventListener("touchend", function () { rail.classList.remove("is-touch"); });

  // The rail shows only while the list is on screen
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (es) {
      rail.classList.toggle("is-on", es[0].isIntersecting);
    }, { rootMargin: "-45% 0px -45% 0px" }).observe(grid);
  } else {
    rail.classList.add("is-on");
  }
  // Letter headings land just below the sticky header + search bar
  var measure = function () {
    document.documentElement.style.setProperty("--gen-bar-h", bar.getBoundingClientRect().height + "px");
  };
  measure();
  window.addEventListener("resize", measure);

  // ---- Search + filter ----
  var apply = function () {
    var term = (q.value || "").trim().toLowerCase();
    var shown = 0;
    tiles.forEach(function (t) {
      var on = active.test(t.name) && (!term || t.key.indexOf(term) !== -1);
      t.el.hidden = !on;
      if (on) shown++;
    });
    groups.forEach(function (grp) {
      var any = grp.items.some(function (t) { return !t.el.hidden; });
      grp.el.hidden = !any;
      railBtns[grp.L].disabled = !any;
    });
    countEl.textContent = shown;
    empty.hidden = shown > 0;
  };
  q.addEventListener("input", apply);
  apply();

  // ---- Strain card: name, parents (for a cross), info and photo if given ----
  var card = document.getElementById("gen-card");
  var cardBody = document.getElementById("gen-card-body");
  var lastFocus = null;
  var parentsOf = function (name) {
    if (!/ x /.test(name)) return [];
    return name.replace(/\s*#\d+$/, "").split(" x ");
  };
  var openCard = function (g, from) {
    if (!card || !card.showModal) return;
    if (!card.open) lastFocus = from || document.activeElement;
    var parents = parentsOf(g.name);
    var hasMore = g.info || g.img;
    card.classList.toggle("has-img", !!g.img);
    cardBody.innerHTML =
      (g.img ? '<div class="sheet-art gen-card-art"><img src="' + esc(g.img) + '" alt="' + esc(g.name) + '" /></div>' : "") +
      '<div class="sheet-info">' +
        '<p class="sheet-label">Genetics</p>' +
        '<h2 id="gen-card-title">' + esc(g.name).split(" x ").join(' <i aria-hidden="true">×</i> ') + "</h2>" +
        (parents.length
          ? '<p class="sheet-label">Cross of</p><ul class="formats gen-parents">' +
            parents.map(function (p) {
              var hit = byName[p.toLowerCase()];
              return hit
                ? '<li><button type="button" data-parent="' + esc(hit.name) + '">' + esc(p) + CHEV + "</button></li>"
                : "<li>" + esc(p) + "</li>";
            }).join("") + "</ul>"
          : "") +
        (g.info ? '<p class="gen-info">' + esc(g.info) + "</p>" : "") +
        (hasMore ? "" : '<p class="gen-soon">More info coming soon</p>') +
      "</div>";
    cardBody.querySelectorAll("[data-parent]").forEach(function (b) {
      b.addEventListener("click", function () { openCard(byName[b.dataset.parent.toLowerCase()]); });
    });
    if (!card.open) card.showModal();
    card.scrollTop = 0;
  };
  if (card) {
    document.getElementById("gen-card-close").addEventListener("click", function () { card.close(); });
    card.addEventListener("click", function (e) { if (e.target === card) card.close(); });
    card.addEventListener("close", function () { if (lastFocus && lastFocus.focus) lastFocus.focus(); });
  }
})();

/* Photo viewer: tap a photo in "Explore the Collection" to see it full
   size. Arrows, arrow keys or a swipe go to the next one; tapping outside
   the photo, the X or Escape closes it. */
(function () {
  var dlg = document.getElementById("gen-viewer");
  var btns = Array.prototype.slice.call(document.querySelectorAll(".gen-zoom"));
  if (!dlg || !btns.length || !dlg.showModal) return;
  var img = document.getElementById("gen-viewer-img");
  var cap = document.getElementById("gen-viewer-cap");
  var at = 0;

  var photos = btns.map(function (b) {
    var i = b.querySelector("img");
    var fc = b.parentNode.querySelector("figcaption");
    return { src: i.currentSrc || i.src, alt: i.alt, cap: fc ? fc.textContent : "" };
  });

  var show = function (n) {
    at = (n + photos.length) % photos.length;
    var p = photos[at];
    img.src = p.src;
    img.alt = p.alt;
    cap.textContent = (p.cap ? p.cap + " · " : "") + (at + 1) + " / " + photos.length;
  };

  btns.forEach(function (b, n) {
    b.setAttribute("aria-label", "Enlarge: " + photos[n].alt);
    b.addEventListener("click", function () { show(n); dlg.showModal(); });
  });
  document.getElementById("gen-viewer-close").addEventListener("click", function () { dlg.close(); });
  document.getElementById("gen-viewer-prev").addEventListener("click", function () { show(at - 1); });
  document.getElementById("gen-viewer-next").addEventListener("click", function () { show(at + 1); });
  // A tap anywhere that isn't the photo or a button closes it
  dlg.addEventListener("click", function (e) {
    if (!e.target.closest("img, button")) dlg.close();
  });
  dlg.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") show(at - 1);
    if (e.key === "ArrowRight") show(at + 1);
  });
  // Swipe left / right for the next / previous photo
  var x0 = null;
  dlg.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
  dlg.addEventListener("touchend", function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0;
    x0 = null;
    if (Math.abs(dx) > 50) show(at + (dx < 0 ? 1 : -1));
  });
})();

/* Photos on phones: one at a time, swipe for the next (style.css does the
   swiping). The dots show which photo is up; tap one to go to it. */
(function () {
  var track = document.getElementById("gen-photos");
  var dotsEl = document.getElementById("gen-dots");
  if (!track || !dotsEl) return;
  var figs = Array.prototype.slice.call(track.querySelectorAll(".gen-photo"));
  var dots = figs.map(function (fig, n) {
    var b = document.createElement("button");
    b.type = "button";
    b.setAttribute("aria-label", "Photo " + (n + 1) + " of " + figs.length);
    b.addEventListener("click", function () {
      track.scrollTo({ left: fig.offsetLeft - parseFloat(getComputedStyle(track).paddingLeft), behavior: "smooth" });
    });
    dotsEl.appendChild(b);
    return b;
  });
  var mark = function () {
    // The photo whose middle is closest to the middle of the strip
    var mid = track.scrollLeft + track.clientWidth / 2;
    var best = 0, bestD = Infinity;
    figs.forEach(function (fig, n) {
      var c = fig.offsetLeft + fig.offsetWidth / 2; // the strip is position: relative
      var d = Math.abs(c - mid);
      if (d < bestD) { bestD = d; best = n; }
    });
    dots.forEach(function (b, n) { b.setAttribute("aria-current", n === best ? "true" : "false"); });
  };
  track.addEventListener("scroll", mark, { passive: true }); // four photos: cheap
  window.addEventListener("resize", mark);
  mark();
})();
