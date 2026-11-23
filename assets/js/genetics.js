/* Reserved genetics: every strain in the clone room, typed from the board
   photos in assets/img/genetics/. Edit this list to add or remove a strain;
   the page sorts it A-Z and builds the filters from it.
   Write crosses with " x " (e.g. "Bacio x RS11") so the Crosses filter finds them. */
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

  var list = RESERVED_GENETICS.slice().sort(function (a, b) {
    return a.localeCompare(b, "en", { numeric: true, sensitivity: "base" });
  });
  var total = document.querySelectorAll("[data-gen-total]");
  total.forEach(function (el) { el.textContent = list.length; });

  // One tile per strain. A cross shows its parents with a gold "x" between.
  var esc = function (s) {
    return s.replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
  };
  var tiles = list.map(function (name) {
    var li = document.createElement("li");
    li.className = "gen-tile";
    li.innerHTML = "<span>" + esc(name).split(" x ").join(' <i aria-label="cross">×</i> ') + "</span>";
    li.dataset.name = name.toLowerCase();
    grid.appendChild(li);
    return { el: li, name: name };
  });

  var filters = [{ label: "All", test: function () { return true; } }].concat(RESERVED_GENETICS_FILTERS);
  var active = filters[0];
  filters.forEach(function (f) {
    var n = list.filter(f.test).length;
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

  var apply = function () {
    var term = (q.value || "").trim().toLowerCase();
    var shown = 0;
    tiles.forEach(function (t) {
      var on = active.test(t.name) && (!term || t.el.dataset.name.indexOf(term) !== -1);
      t.el.hidden = !on;
      if (on) shown++;
    });
    countEl.textContent = shown;
    empty.hidden = shown > 0;
  };
  q.addEventListener("input", apply);
  apply();
})();
