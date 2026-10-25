(function () {
  "use strict";

  /* Paste the Apps Script web app URL here (ends in /exec). See subscribe.gs. */
  var SIGNUP_URL = "REPLACE_ME_APPS_SCRIPT_URL";

  var STORES = window.RESERVED_STORES || [];
  var PIN_IMG = "assets/img/gen/pin-r.webp";
  var RED_PIN = '<svg class="mk-pin" viewBox="0 0 26 34" aria-hidden="true"><path d="M13 33S2 20.5 2 12.5a11 11 0 0 1 22 0C24 20.5 13 33 13 33z" fill="#E53935" stroke="#7F1414" stroke-width="1.5"/><circle cx="13" cy="12.5" r="4.2" fill="#fff"/></svg>';

  /* ---------- 21+ gate ---------- */
  var gate = document.getElementById("gate");
  var passed = false;
  try { passed = localStorage.getItem("reserved21") === "yes"; } catch (e) {}
  if (!passed) {
    gate.hidden = false;
    document.body.classList.add("locked");
    document.getElementById("gate-yes").focus();
  }
  document.getElementById("gate-yes").addEventListener("click", function () {
    try { localStorage.setItem("reserved21", "yes"); } catch (e) {}
    gate.hidden = true;
    document.body.classList.remove("locked");
  });

  /* ---------- Map ---------- */
  // gestureHandling: on phones one finger scrolls the page and two fingers move
  // the map; on desktop, ctrl/cmd + scroll zooms. Stops the map trapping scrolls.
  // zoomSnap 1: whole zoom levels only. In-between levels stretch the map images
  // and make the map look blurry.
  var map = L.map("map", { zoomControl: true, zoomSnap: 1, gestureHandling: true });
  // Esri street map: no API key, and unlike OpenStreetMap's server it doesn't
  // return 403 "Access blocked" when the page is opened from a file.
  // CSS turns it into the black-and-gray look of the Instagram store-locator post.
  L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", {
    maxZoom: 19,
    // On sharp phone/laptop screens, load the next zoom level's images at half
    // size so the map stays crisp instead of soft.
    detectRetina: true,
    attribution: 'Tiles &copy; <a href="https://www.esri.com/">Esri</a>, HERE, Garmin, &copy; OpenStreetMap contributors'
  }).addTo(map);

  // Zoomed out: hide city tags and trim the logo a bit so neighbors don't pile up.
  function sizePins() {
    var z = map.getZoom(), el = map.getContainer();
    el.classList.toggle("z-far", z < 9.5);
    el.classList.toggle("z-nudge", z < 11);
    el.classList.toggle("z-vfar", z < 8);
  }
  map.on("zoomend", sizePins);

  // Hide any logo that would cover another store's logo or pin, so the map never
  // turns into a pile of logos on small screens. Hidden stores keep their red pin;
  // their logo comes back as soon as there's room (zoom in). Closest/first stores win.
  function overlaps(a, b) {
    return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
  }
  function shrink(r, k) {
    var dx = r.width * k, dy = r.height * k;
    return { left: r.left + dx, right: r.right - dx, top: r.top + dy, bottom: r.bottom - dy };
  }
  function declutter() {
    var shown = current.filter(function (s) { return map.hasLayer(s.marker) && s.marker.getElement(); });
    shown.forEach(function (s) { s.marker.getElement().querySelector(".mk").classList.remove("no-logo"); });
    var pins = shown.map(function (s) {
      return { id: s.id, r: shrink(s.marker.getElement().querySelector(".mk-pin").getBoundingClientRect(), .15) };
    });
    var taken = [];
    shown.forEach(function (s) {
      var el = s.marker.getElement();
      var logoRect = el.querySelector(".mk-logo").getBoundingClientRect();
      // Logos keep a clear gap from each other, but may brush past another pin.
      var boxes = [shrink(logoRect, .04)];
      var tag = el.querySelector(".mk-city");
      if (tag.offsetWidth) boxes.push(tag.getBoundingClientRect());
      var core = shrink(logoRect, .25);
      var blocked = boxes.some(function (b) {
        return taken.some(function (t) { return overlaps(b, t); });
      }) || pins.some(function (p) { return p.id !== s.id && overlaps(core, p.r); });
      if (blocked) el.querySelector(".mk").classList.add("no-logo");
      else taken.push.apply(taken, boxes);
    });
  }
  var declutterTimer;
  function scheduleDeclutter() {
    clearTimeout(declutterTimer);
    declutterTimer = setTimeout(declutter, 260); // after the logo shift animation settles
  }
  map.on("zoomend moveend", scheduleDeclutter);

  // Marker, top to bottom: red pin (its tip is the store), city tag, store logo
  // (the chrome R if the store has no logo).
  function storeIcon(s) {
    var n = s.nudge || [0, 0];
    return L.divIcon({
      className: "mk-wrap",
      html: '<div class="mk" style="--tag:' + s.tag + ";--nx:" + n[0] + "px;--ny:" + n[1] + 'px">' + RED_PIN +
        '<div class="mk-body"><span class="mk-city">' + esc(s.city) + "</span>" +
        '<img class="mk-logo" src="' + esc(s.logo || PIN_IMG) + '" alt="" /></div></div>',
      iconSize: [120, 140],
      iconAnchor: [60, 34],
      popupAnchor: [0, -30]
    });
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function directionsUrl(s) {
    return "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(s.name + ", " + s.address);
  }

  function popupHtml(s) {
    return '<div class="pop"><strong>' + esc(s.name) + "</strong>" +
      "<span>" + esc(s.address) + "</span>" +
      '<a class="btn btn-gold btn-sm" target="_blank" rel="noopener" href="' + directionsUrl(s) + '">Directions</a></div>';
  }

  STORES.forEach(function (s, i) {
    s.id = i;
    s.marker = L.marker([s.lat, s.lng], { icon: storeIcon(s), title: s.name + ", " + s.city, riseOnHover: true })
      .bindPopup(popupHtml(s), { closeButton: true, maxWidth: 240 })
      .addTo(map);
    s.marker.on("click", function () { setActive(s.id, false); });
  });

  function fitTo(stores, extra) {
    var pts = stores.map(function (s) { return [s.lat, s.lng]; });
    if (extra) pts.push(extra);
    if (!pts.length) return;
    // Extra bottom room: each logo hangs below its pin.
    map.fitBounds(pts, { paddingTopLeft: [48, 48], paddingBottomRight: [48, 100], maxZoom: 13 });
  }
  fitTo(STORES);
  sizePins();

  // Re-measure once fonts and images settle (and on rotate/resize) so the
  // first view always shows every store.
  var userMoved = false;
  map.on("dragstart", function () { userMoved = true; });
  function refit() {
    map.invalidateSize();
    if (!userMoved && !q.value) fitTo(current);
  }
  window.addEventListener("load", refit);
  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(refit, 200);
  });

  /* ---------- List ---------- */
  var list = document.getElementById("list");
  var statusEl = document.getElementById("status");

  function render(stores) {
    list.innerHTML = "";
    stores.forEach(function (s) {
      var li = document.createElement("li");
      li.dataset.id = s.id;
      li.innerHTML =
        '<button type="button" class="store">' +
          '<span class="store-city" style="--tag:' + s.tag + '">' + esc(s.city) + "</span>" +
          '<span class="store-name">' + esc(s.name) + "</span>" +
          (s.miles != null ? '<em class="store-mi">' + s.miles.toFixed(1) + " mi</em>" : "") +
        "</button>" +
        '<a class="dir" target="_blank" rel="noopener" href="' + directionsUrl(s) + '" aria-label="Directions to ' + esc(s.name) + '">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l10 10-10 10L2 12z" fill="currentColor"/><path d="M9 14v-2.5a1.5 1.5 0 0 1 1.5-1.5H15m-2-2l2 2-2 2" fill="none" stroke="#FAF4E6" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
        "</a>";
      li.querySelector(".store").addEventListener("click", function () { setActive(s.id, true); });
      list.appendChild(li);
    });
    document.getElementById("list-count").textContent = stores.length;
    list.scrollTop = 0;
    if (typeof markListEnd === "function") markListEnd();
  }

  function setActive(id, fromList) {
    var s = STORES[id];
    Array.prototype.forEach.call(list.children, function (li) {
      li.classList.toggle("active", Number(li.dataset.id) === id);
    });
    if (fromList) {
      userMoved = true;
      map.flyTo([s.lat, s.lng], 14, { duration: 0.8 });
      s.marker.openPopup();
      if (window.matchMedia("(max-width: 859px)").matches) {
        document.getElementById("map").scrollIntoView({ behavior: "smooth", block: "center" });
      }
    } else {
      var li = list.querySelector('[data-id="' + id + '"]');
      if (li) li.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }

  function showOnly(stores) {
    var ids = {};
    stores.forEach(function (s) { ids[s.id] = true; });
    STORES.forEach(function (s) {
      if (ids[s.id]) { if (!map.hasLayer(s.marker)) s.marker.addTo(map); }
      else map.removeLayer(s.marker);
    });
    scheduleDeclutter();
  }

  /* ---------- Distance sorting (shared by ZIP search and Near me) ---------- */
  var youMarker = null;
  function miles(a, b, c, d) {
    var R = 3958.8, r = Math.PI / 180;
    var dLat = (c - a) * r, dLng = (d - b) * r;
    var h = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(a * r) * Math.cos(c * r) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return 2 * R * Math.asin(Math.sqrt(h));
  }

  // Sort every store by distance from a point, mark the point, zoom to it and the closest shop.
  function sortFrom(lat, lng, pointLabel, statusLead) {
    STORES.forEach(function (s) { s.miles = miles(lat, lng, s.lat, s.lng); });
    current = STORES.slice().sort(function (a, b) { return a.miles - b.miles; });
    render(current);
    showOnly(current);
    if (youMarker) map.removeLayer(youMarker);
    youMarker = L.circleMarker([lat, lng], { radius: 9, color: "#FFFFFF", weight: 3, fillColor: "#1E5FD9", fillOpacity: 1 })
      .bindTooltip(pointLabel).addTo(map);
    var near = current[0];
    userMoved = true;
    fitTo([near], [lat, lng]);
    statusEl.textContent = statusLead + near.name + " in " + near.city + ", " + near.miles.toFixed(1) + " mi away.";
  }

  /* ---------- Search: city, store name, or 5-digit ZIP ---------- */
  var q = document.getElementById("q");
  var current = STORES.slice();
  var zipCache = {};
  var zipWanted = null;

  function lookupZip(zip) {
    zipWanted = zip;
    if (zipCache[zip]) { showZip(zip, zipCache[zip]); return; }
    statusEl.textContent = "Looking up " + zip + "...";
    // Zippopotam.us: free ZIP-to-location lookup, no key needed.
    fetch("https://api.zippopotam.us/us/" + zip)
      .then(function (res) {
        if (res.status === 404) return null;
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(function (data) {
        if (zipWanted !== zip) return; // the box changed while we waited
        if (!data || !data.places || !data.places.length) {
          statusEl.textContent = "We couldn't find ZIP " + zip + ". Check the number and try again.";
          return;
        }
        var p = data.places[0];
        zipCache[zip] = { lat: parseFloat(p.latitude), lng: parseFloat(p.longitude), place: p["place name"] };
        showZip(zip, zipCache[zip]);
      })
      .catch(function () {
        if (zipWanted !== zip) return;
        statusEl.textContent = "ZIP lookup isn't working right now. Search by city or use Near me.";
      });
  }

  function showZip(zip, z) {
    sortFrom(z.lat, z.lng, zip + " " + z.place, "Closest to " + zip + ": ");
  }

  q.addEventListener("input", function () {
    var raw = q.value.trim();
    var term = raw.toLowerCase();
    zipWanted = null;

    if (/^\d+$/.test(raw)) {
      render(current);
      showOnly(current);
      if (raw.length === 5) lookupZip(raw);
      else if (raw.length < 5) statusEl.textContent = "Keep typing: ZIP codes have 5 digits.";
      else statusEl.textContent = "ZIP codes have 5 digits. Check the number and try again.";
      return;
    }

    var hits = current.filter(function (s) {
      return !term || (s.name + " " + s.city + " " + s.address).toLowerCase().indexOf(term) !== -1;
    });
    render(hits);
    showOnly(hits);
    if (hits.length) {
      statusEl.textContent = "";
      fitTo(hits);
    } else {
      statusEl.textContent = 'No shops match "' + raw + '". Try a city like Riverside, or a ZIP code.';
    }
  });

  /* ---------- Near me ---------- */
  document.getElementById("near").addEventListener("click", function () {
    if (!navigator.geolocation) {
      statusEl.textContent = "This browser can't share location. Search by city or ZIP instead.";
      return;
    }
    statusEl.textContent = "Finding you...";
    navigator.geolocation.getCurrentPosition(function (pos) {
      q.value = "";
      zipWanted = null;
      sortFrom(pos.coords.latitude, pos.coords.longitude, "You", "Closest: ");
    }, function () {
      statusEl.textContent = "Location is turned off. Search by city or ZIP instead.";
    }, { timeout: 10000, maximumAge: 300000 });
  });

  render(STORES);

  // Phone scroll box: drop the bottom fade once the list is scrolled to the end
  // (or when it's short enough not to scroll at all).
  function markListEnd() {
    list.classList.toggle("at-end", list.scrollTop + list.clientHeight >= list.scrollHeight - 4);
  }
  list.addEventListener("scroll", markListEnd, { passive: true });
  window.addEventListener("resize", markListEnd);
  markListEnd();

  /* ---------- Subscribe ---------- */
  var form = document.getElementById("sub-form");
  var msg = document.getElementById("form-msg");
  var email = document.getElementById("email");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var val = email.value.trim();
    msg.className = "form-msg";
    if (form.company.value) return; // bot
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val)) {
      msg.textContent = "Enter an email like name@email.com.";
      msg.classList.add("err");
      email.focus();
      return;
    }
    if (SIGNUP_URL.indexOf("REPLACE_ME") === 0) {
      msg.textContent = "Sign-up isn't connected yet. Check back soon.";
      msg.classList.add("err");
      return;
    }
    var btn = form.querySelector("button");
    btn.disabled = true;
    btn.textContent = "Subscribing...";
    fetch(SIGNUP_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ email: val, page: location.href, submittedAt: new Date().toISOString() })
    }).then(function () {
      form.reset();
      msg.textContent = "Subscribed. Watch your inbox for the next drop.";
      msg.classList.add("ok");
    }).catch(function () {
      msg.textContent = "That didn't go through. Check your connection and try again.";
      msg.classList.add("err");
    }).then(function () {
      btn.disabled = false;
      btn.textContent = "Subscribe";
    });
  });
})();
