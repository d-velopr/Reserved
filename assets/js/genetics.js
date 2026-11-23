/* Reserved genetics: every strain in the clone room, typed from the board
   photos (kept off the site). Edit this list to add or remove a strain; the
   page sorts it A-Z and builds the filters, letter groups and A-Z rail from it.

   Write crosses with " x " (e.g. "Bacio x RS11") so the Crosses filter finds
   them and the strain's card lists its parents.

   Tap a strain to open its card. What the card says comes from
   RESERVED_GENETICS_INFO below; a cross with no entry there describes itself
   from its parents (spelled out with RESERVED_GENETICS_NAMES). Anything else
   says "More info coming soon". Every card shows the "Images coming soon"
   art until a strain gets its own photo (img). */
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

/* What each strain's card says. Researched November 2026 from public strain
   databases, breeder notes and growers' posts on X (Leafly, Seedfinder, Weedmaps and others).
   Lineage only, no effects or potency claims. Where sources disagreed, or the
   name belongs to more than one strain, there is no entry and the card says
   "More info coming soon". Add a photo with img: "assets/img/strains/x.webp"
   (not assets/img/genetics/, which never leaves this computer), and tappable
   parents with parents: ["Name", "Name"] when both are on the list. */
var RESERVED_GENETICS_INFO = {
  "Alpha Runtz": "A Runtz cross: Runtz bred with Alpha Express.",
  "Angel Cake": "Fire OG crossed with Forum Cut Cookies, credited to RedEyed Genetics.",
  "Bacio": "Bacio Gelato, also known as Gelato #41, from Sherbinskis. Sunset Sherbet crossed with Thin Mint Cookies.",
  "Banana OG": "OG Kush crossed with Banana, with a sweet banana nose over OG fuel.",
  "Billy Kimber": "An OG Kush phenotype from California curator Garrison Lane, named after the Peaky Blinders crime boss. A 2018 High Times Cannabis Cup winner.",
  "Biscotti": "From Cookies: Gelato #25 crossed with South Florida OG.",
  "Blue Dream": "A California classic: Blueberry crossed with Haze, with sweet berry notes.",
  "DJSBB": "DJ Short Blueberry, the berry line from breeder DJ Short that's behind decades of blueberry crosses.",
  "Double Bubba": "Bubba on Bubba: Pre-98 Bubba Kush crossed with Bubba Kush.",
  "Gary Payton": "From Cookies and Powerzzzup: The Y crossed with Snowman, named after the NBA Hall of Famer.",
  "Gaszilla": "Gas Face crossed with Gorilla Glue #4, credited to Small Barn Farms.",
  "GDP": "Granddaddy Purple: Purple Urkle crossed with Big Bud, known for grape and berry notes.",
  "Gelonade": "Connected Cannabis' cross of Lemon Tree and Gelato 41, with lemon and citrus up front.",
  "Ghost OG": "A well-known cut of OG Kush.",
  "GMO": "Also called Garlic Cookies: Chemdawg crossed with Girl Scout Cookies, with a savory garlic-and-diesel nose.",
  "Gorilla Fett #1": "Han Solo Burger crossed with Gorilla Glue #4. Our #1 selection.",
  "Gorilla Fett #2": "Han Solo Burger crossed with Gorilla Glue #4. Our #2 selection.",
  "Gorilla Fett #3": "Han Solo Burger crossed with Gorilla Glue #4. Our #3 selection.",
  "Hells Angel OG": "An OG Kush line, usually listed as OG Kush crossed with Blackberry. Original breeder unknown.",
  "Honey Crisp": "Forbidden Jelly crossed with Gas Bugnes, credited to ALTVM.",
  "Jack Herrer": "Named after cannabis activist Jack Herer. A Sensi Seeds classic built from Haze, Northern Lights #5 and Shiva Skunk.",
  "Kush Co OG": "A clone-only member of the OG Kush family.",
  "Larry OG": "OG Kush crossed with SFV OG.",
  "Legend OG": "A clone-only OG Kush descendant with Southern California roots.",
  "Lemonatti": { info: "Gelonade crossed with Biscotti.", parents: ["Gelonade", "Biscotti"] },
  "Lip Smacker": "Exotic Genetix's cross of Sherbert and Strawberries & Cream.",
  "Mega Wellness OG": "From Nameless Genetics in Los Angeles: a Chemdawg mother crossed with an OG Kush father.",
  "Papaya": "Nirvana Seeds' cross of Citral #13 and Ice #2, with a ripe tropical-fruit nose.",
  "Pink Runtz": "A pink-hued member of the Runtz family (Zkittlez crossed with Gelato).",
  "Sour Diesel #1": "Our #1 cut of Sour Diesel, the East Coast classic known for its sharp diesel aroma.",
  "Sour Diesel #2": "Our #2 cut of Sour Diesel, the East Coast classic known for its sharp diesel aroma.",
  "Sundae Driver": "Cannarado Genetics' cross of Fruity Pebbles OG and Grape Pie.",
  "Sunset Sherbert": "Sherbinskis' cross of Girl Scout Cookies and Pink Panties, and a parent of the Gelato line.",
  "Super Runtz": "Lemon Cherry Gelato crossed with Runtz.",
  "The Rucker": "From New York breeder N.Y.Ceeds, who keep its lineage private.",
  "TK OG": "An OG from the Triangle Kush (TK) line, the Florida cut many growers credit as an OG Kush ancestor.",
  "Toad Venom": "Credited to Ronin; most often listed as Animal Face crossed with SinMint Cookies.",
  "White Himalaya": "From Backpackboyz; reportedly LA Traffic crossed with Birkinz.",
  "ZKittlez": "Grape Ape crossed with Grapefruit, made famous by Terp Hogz and 3rd Gen Family. Sweet, fruity candy flavor.",
  "Zoap": "Deo Farms' cross of Rainbow Sherbet and Pink Guava, out of Oakland.",
  "Zookies": "Animal Cookies crossed with Gorilla Glue #4."
};

/* Short names in crosses, spelled out on the card ("Bacio x RS11" reads
   "A cross of Bacio Gelato and Rainbow Sherbet #11"). Names not here stay as written. */
var RESERVED_GENETICS_NAMES = {
  "Bacio": "Bacio Gelato",
  "RS11": "Rainbow Sherbet #11",
  "Zkit": "Zkittlez",
  "LCG": "Lemon Cherry Gelato",
  "Sherb": "Sunset Sherbert",
  "Mochi": "Mochi Gelato"
};

/* Strain photos, one per strain, in assets/img/strains/: a bud on white,
   4:3. Picked in November 2026 from Leafly, Weedmaps and posts on X (X photos
   had their backgrounds removed); where each came from is in the private
   assets/img/strain-refs/ (credits.json, db/sources.json). Swap in your own photo by replacing
   the file. A strain not here shows the "Images coming soon" stamp. */
var RESERVED_GENETICS_PHOTOS = {
  "Banana OG": "assets/img/strains/banana-og.webp",
  "Biscotti": "assets/img/strains/biscotti.webp",
  "Blue Dream": "assets/img/strains/blue-dream.webp",
  "DJSBB": "assets/img/strains/djsbb.webp",
  "GDP": "assets/img/strains/gdp.webp",
  "Gary Payton": "assets/img/strains/gary-payton.webp",
  "Ghost OG": "assets/img/strains/ghost-og.webp",
  "GMO": "assets/img/strains/gmo.webp",
  "Hells Angel OG": "assets/img/strains/hells-angel-og.webp",
  "Jack Herrer": "assets/img/strains/jack-herrer.webp",
  "Larry OG": "assets/img/strains/larry-og.webp",
  "Legend OG": "assets/img/strains/legend-og.webp",
  "Papaya": "assets/img/strains/papaya.webp",
  "Sour Diesel #1": "assets/img/strains/sour-diesel-bud.webp",
  "Sour Diesel #2": "assets/img/strains/sour-diesel-bud.webp",
  "Sundae Driver": "assets/img/strains/sundae-driver.webp",
  "Sunset Sherbert": "assets/img/strains/sunset-sherbert.webp",
  "ZKittlez": "assets/img/strains/zkittlez.webp",
  "Zoap": "assets/img/strains/zoap.webp",
  "92 OG": "assets/img/strains/92-og.webp",
  "Alpha Runtz": "assets/img/strains/alpha-runtz.webp",
  "Bacio": "assets/img/strains/bacio.webp",
  "Blue Nerds": "assets/img/strains/blue-nerds.webp",
  "Gelonade": "assets/img/strains/gelonade.webp",
  "Gorilla Fett #1": "assets/img/strains/gorilla-fett.webp",
  "Gorilla Fett #2": "assets/img/strains/gorilla-fett.webp",
  "Gorilla Fett #3": "assets/img/strains/gorilla-fett.webp",
  "Kush Co OG": "assets/img/strains/kush-co-og.webp",
  "LCG Runtz": "assets/img/strains/lcg-runtz.webp",
  "Lemonatti": "assets/img/strains/lemonatti.webp",
  "Lip Smacker": "assets/img/strains/lip-smacker.webp",
  "Mega Wellness OG": "assets/img/strains/mega-wellness-og.webp",
  "Pink Runtz": "assets/img/strains/pink-runtz.webp",
  "Sherb x Bacio": "assets/img/strains/sherb-x-bacio.webp",
  "Super Runtz": "assets/img/strains/super-runtz.webp",
  "Zookies": "assets/img/strains/zookies.webp",
  "Biscotti x RS11": "assets/img/strains/biscotti-x-rs11.webp"
};

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
  var STAMP = "assets/img/gen/stamp.webp";
  var parentsOf = function (name) {
    if (!/ x /.test(name)) return [];
    return name.replace(/\s*#\d+$/, "").split(" x ");
  };
  var listOf = function (a) {
    return a.length < 3 ? a.join(" and ") : a.slice(0, -1).join(", ") + " and " + a[a.length - 1];
  };
  // A cross with no write-up describes itself from its parents
  var crossInfo = function (name, parents) {
    var pheno = (name.match(/#(\d+)$/) || [])[1];
    var full = parents.map(function (p) { return RESERVED_GENETICS_NAMES[p] || p; });
    return "A cross of " + listOf(full) + (pheno ? ", pheno #" + pheno : "") + ".";
  };
  var openCard = function (g, from) {
    if (!card || !card.showModal) return;
    if (!card.open) lastFocus = from || document.activeElement;
    var extra = RESERVED_GENETICS_INFO[g.name] || {};
    if (typeof extra === "string") extra = { info: extra };
    var img = g.img || extra.img || RESERVED_GENETICS_PHOTOS[g.name];
    var parents = extra.parents || parentsOf(g.name);
    var info = g.info || extra.info || (/ x /.test(g.name) ? crossInfo(g.name, parents) : "");
    cardBody.innerHTML =
      (img
        ? '<div class="sheet-art has-photo gen-card-art"><img src="' + esc(img) + '" alt="' + esc(g.name) + '" /></div>'
        : '<div class="sheet-art art-soon gen-card-art"><img class="art-stamp" src="' + STAMP + '" alt="" />' +
          '<span class="art-soon-text">Images coming soon</span></div>') +
      '<div class="sheet-info">' +
        '<p class="sheet-label">Genetics</p>' +
        '<h2 id="gen-card-title">' + esc(g.name).split(" x ").join(' <i aria-hidden="true">×</i> ') + "</h2>" +
        (info ? '<p class="gen-info">' + esc(info) + "</p>" : "") +
        (parents.length
          ? '<p class="sheet-label">Cross of</p><ul class="formats gen-parents">' +
            parents.map(function (p) {
              var hit = byName[p.toLowerCase()];
              return hit
                ? '<li><button type="button" data-parent="' + esc(hit.name) + '">' + esc(p) + CHEV + "</button></li>"
                : "<li>" + esc(p) + "</li>";
            }).join("") + "</ul>"
          : "") +
        (info ? "" : '<p class="gen-soon">More info coming soon</p>') +
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

/* Header seal: a DNA helix bent into a ring around the Reserved stamp,
   like a plasmid. The side of each strand facing you is brighter and
   thicker. It twists and slowly orbits while on screen; reduced motion
   draws it once. */
(function () {
  var g = document.getElementById("gen-helix");
  if (!g) return;
  var NS = "http://www.w3.org/2000/svg";
  var CX = 200, CY = 200, R0 = 123, AMP = 9.5, TWISTS = 14, SEGS = 168, RUNGS = 56;
  var TAU = Math.PI * 2;

  function el(name, attrs) {
    var e = document.createElementNS(NS, name);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    g.appendChild(e);
    return e;
  }

  // Rungs behind, then strands, then the beads on top
  var rungs = [], strands = [[], []], beads = [];
  for (var i = 0; i < RUNGS; i++)
    rungs.push(el("line", { stroke: "#D6C8AE", "stroke-width": "1.3", "stroke-linecap": "round" }));
  for (var s = 0; s < 2; s++)
    for (var k = 0; k < SEGS; k++)
      strands[s].push(el("line", { stroke: s ? "#D99A1E" : "#F0BE6A", "stroke-linecap": "round" }));
  for (i = 0; i < RUNGS * 2; i++) beads.push(el("circle", { fill: "#F0BE6A" }));

  // Point on strand s at fraction u of the way round (0 = top, clockwise)
  function at(u, s, twist, spin) {
    var a = u * TWISTS * TAU + twist + s * Math.PI;
    var r = R0 + AMP * Math.sin(a);
    var th = u * TAU + spin - Math.PI / 2;
    return { x: CX + r * Math.cos(th), y: CY + r * Math.sin(th), d: (Math.cos(a) + 1) / 2 };
  }
  function set(e, o) { for (var k in o) e.setAttribute(k, o[k]); }
  function f(n) { return n.toFixed(1); }

  function draw(twist, spin) {
    var s, k, p, q;
    for (s = 0; s < 2; s++) {
      for (k = 0; k < SEGS; k++) {
        p = at(k / SEGS, s, twist, spin);
        q = at((k + 1) / SEGS, s, twist, spin);
        var d = (p.d + q.d) / 2;
        set(strands[s][k], { x1: f(p.x), y1: f(p.y), x2: f(q.x), y2: f(q.y),
          "stroke-width": (1.4 + 2.2 * d).toFixed(2), "stroke-opacity": (0.25 + 0.75 * d).toFixed(2) });
      }
    }
    for (k = 0; k < RUNGS; k++) {
      var u = (k + 0.5) / RUNGS;
      p = at(u, 0, twist, spin); q = at(u, 1, twist, spin);
      var gap = Math.hypot(p.x - q.x, p.y - q.y) / (AMP * 2);
      set(rungs[k], { x1: f(p.x), y1: f(p.y), x2: f(q.x), y2: f(q.y), "stroke-opacity": (0.15 + 0.45 * gap).toFixed(2) });
      set(beads[k * 2], { cx: f(p.x), cy: f(p.y), r: (1.2 + 1.8 * p.d).toFixed(2), "fill-opacity": (0.3 + 0.7 * p.d).toFixed(2) });
      set(beads[k * 2 + 1], { cx: f(q.x), cy: f(q.y), r: (1.2 + 1.8 * q.d).toFixed(2), "fill-opacity": (0.3 + 0.7 * q.d).toFixed(2) });
    }
  }

  var calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  draw(0.6, 0);
  if (calm) return;

  var on = true, raf = 0, t0 = 0, last = 0;
  function tick(t) {
    if (!t0) t0 = t - last;
    last = t - t0;
    draw(0.6 + last * 0.0011, last * 0.00006); // twists every ~6s, orbits every ~100s
    raf = on ? requestAnimationFrame(tick) : 0;
  }
  raf = requestAnimationFrame(tick);
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (es) {
      on = es[0].isIntersecting;
      if (on && !raf) { t0 = 0; raf = requestAnimationFrame(tick); }
    }).observe(g.ownerSVGElement);
  }
})();
