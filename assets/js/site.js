/* Shared by every page: Google Analytics, the 21+ entry gate (Home only), the
   Subscribe form and the Contact form. Load this before any page script. */
(function () {
  "use strict";

  /* Paste the Apps Script web app URL here (ends in /exec). See subscribe.gs. */
  var SIGNUP_URL = "https://script.google.com/macros/s/AKfycbwWgp5F6ZsGo_vI7E4F3nOKRrx69DUtj8EVUrfl4luhgNV2o8cQ5FT7zrQA9K3KzyI/exec";

  /* ---------- Google Analytics ---------- */
  // Only runs after the visitor agrees on the 21+ gate. The consent default
  // (analytics off) and the gtag() helper are set in each page's <head>.
  var GA_ID = "G-2X555LCLRX";
  var analyticsOn = false;
  function startAnalytics() {
    if (analyticsOn || typeof window.gtag !== "function") return;
    analyticsOn = true;
    // Turn analytics on before the first page view is sent.
    window.gtag("consent", "update", { analytics_storage: "granted" });
    window.gtag("config", GA_ID);
    var tag = document.createElement("script");
    tag.async = true;
    tag.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
    document.head.appendChild(tag);
  }

  /* ---------- Sign-up (shared by the entry gate and the Subscribe form) ---------- */
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  // Posts to the Apps Script in subscribe.gs. "no-cors" means the reply can't be
  // read, so this resolves once the request is sent and rejects only if the
  // network fails. Check the Sheet to confirm rows land.
  function sendSignup(fields) {
    fields.page = location.href;
    fields.submittedAt = new Date().toISOString();
    return fetch(SIGNUP_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(fields)
    });
  }

  /* ---------- Entry gate (Home page only) ---------- */
  // Step 1: "Yes, enter" confirms 21+ and agrees to analytics (saved together).
  // Step 2: email and ZIP code, required to get in. Each step is remembered on
  // its own, so someone who passed step 1 before step 2 existed only sees step 2.
  // The gate markup is only on index.html. The other pages send a visitor who
  // hasn't passed it to index.html?next=<page> (a small script in their <head>),
  // and once the gate is passed they're sent back to that page.
  // window.RESERVED_OPEN is true once the page is open; when the gate closes the
  // page also gets a "reserved:open" event.
  function remembered(key) {
    try { return localStorage.getItem(key) === "yes"; } catch (e) { return false; }
  }
  function remember(key) {
    try { localStorage.setItem(key, "yes"); } catch (e) {}
  }

  var ageOk = remembered("reserved21") && remembered("reservedAnalytics");
  if (ageOk) startAnalytics();

  // Only our own pages are allowed as a place to go back to.
  var NEXT_RE = /^(store-locator|collection|about|faq)(\.html)?([?#].*)?$/;
  var next = new URLSearchParams(location.search).get("next");
  if (next && !NEXT_RE.test(next)) next = null;

  var gate = document.getElementById("gate");
  if (!gate) {
    window.RESERVED_OPEN = true;
  } else {
    var ageStep = document.getElementById("gate-age");
    var joinForm = document.getElementById("gate-join");
    var gateEmail = document.getElementById("gate-email");
    var gateZip = document.getElementById("gate-zip");
    var gateMsg = document.getElementById("gate-msg");

    var showJoinStep = function () {
      ageStep.hidden = true;
      joinForm.hidden = false;
      gate.setAttribute("aria-labelledby", "gate-join-title");
      gateEmail.focus();
    };
    // zip: set only when the visitor has just joined. A first visit then lands on
    // the Store Locator with their ZIP already searched, so the closest shop is
    // the first thing they see (Back returns to Home). A visitor sent here from
    // a shared link (?next=) still goes back to that page instead.
    var openSite = function (zip) {
      if (next) {
        if (zip && /^store-locator(\.html)?(#.*)?$/.test(next)) {
          next = next.replace(/^([^#]*)/, "$1?q=" + zip);
        }
        location.replace(next);
        return;
      }
      if (zip) { location.href = "store-locator.html?q=" + zip; return; }
      gate.hidden = true;
      document.body.classList.remove("locked");
      window.RESERVED_OPEN = true;
      document.dispatchEvent(new Event("reserved:open"));
    };

    if (!ageOk || !remembered("reservedJoined")) {
      gate.hidden = false;
      document.body.classList.add("locked");
      if (ageOk) showJoinStep();
      else document.getElementById("gate-yes").focus();
    } else if (next) {
      location.replace(next); // already passed: go straight back
    } else {
      window.RESERVED_OPEN = true;
    }

    document.getElementById("gate-yes").addEventListener("click", function () {
      remember("reserved21");
      remember("reservedAnalytics");
      startAnalytics();
      showJoinStep();
    });

    // ZIP box: digits only, five max (also catches pasted "92501-1234").
    gateZip.addEventListener("input", function () {
      var digits = gateZip.value.replace(/\D/g, "").slice(0, 5);
      if (gateZip.value !== digits) gateZip.value = digits;
    });

    var gateError = function (text, field) {
      gateMsg.textContent = text;
      gateMsg.className = "form-msg err";
      gateEmail.removeAttribute("aria-invalid");
      gateZip.removeAttribute("aria-invalid");
      if (field) { field.setAttribute("aria-invalid", "true"); field.focus(); }
    };

    joinForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (joinForm.company.value) return; // bot
      var emailVal = gateEmail.value.trim();
      var zipVal = gateZip.value.trim();
      if (!EMAIL_RE.test(emailVal)) return gateError("Enter an email like name@email.com.", gateEmail);
      if (!/^\d{5}$/.test(zipVal)) return gateError("Enter your 5-digit ZIP code.", gateZip);
      gateError("");
      gateMsg.className = "form-msg";

      var btn = joinForm.querySelector("button");
      btn.disabled = true;
      btn.textContent = "Entering...";
      sendSignup({ email: emailVal, zip: zipVal, source: "entry gate" })
        .then(function () {
          remember("reservedJoined");
          openSite(zipVal);
        })
        .catch(function () {
          gateError("That didn't go through. Check your connection and try again.");
          btn.disabled = false;
          btn.textContent = "Enter";
        });
    });
  }

  /* ---------- Header height ---------- */
  // Saved as --head-h so bars that stick below the header (the Collection
  // chips) sit flush under it at every screen size.
  // Exact height, not offsetHeight: that rounds (70.7px became 71px) and left
  // a hairline gap under the header on phones.
  var header = document.querySelector(".top");
  function measureHeader() {
    if (header) document.documentElement.style.setProperty("--head-h", header.getBoundingClientRect().height + "px");
  }
  measureHeader();
  window.addEventListener("resize", measureHeader);
  window.addEventListener("load", measureHeader);
  if (header && "ResizeObserver" in window) new ResizeObserver(measureHeader).observe(header);

  /* ---------- Phone menu ---------- */
  // The menu button only shows on phones (see style.css). It opens the page
  // links as a drop-down under the header. A tap outside, Escape, or picking
  // a link closes it.
  var menuBtn = document.querySelector(".menu-btn");
  if (header && menuBtn) {
    var setMenu = function (open) {
      header.classList.toggle("menu-open", open);
      menuBtn.setAttribute("aria-expanded", String(open));
      menuBtn.setAttribute("aria-label", open ? "Close menu" : "Menu");
    };
    menuBtn.addEventListener("click", function () {
      setMenu(menuBtn.getAttribute("aria-expanded") !== "true");
    });
    document.addEventListener("click", function (e) {
      if (header.classList.contains("menu-open") && !header.contains(e.target)) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && header.classList.contains("menu-open")) {
        setMenu(false);
        menuBtn.focus();
      }
    });
    header.querySelectorAll(".nav a").forEach(function (a) {
      a.addEventListener("click", function () { setMenu(false); });
    });
    // Leaving phone width (rotating a tablet, say) closes it too
    window.matchMedia("(max-width: 640px)").addEventListener("change", function () { setMenu(false); });
  }

  /* ---------- Light / dark ---------- */
  // The site always opens light. Dark mode is kept in sessionStorage, so it
  // follows the visitor from page to page until the tab closes; a new tab or
  // visit starts light. The small script at the top of each page's <head> reads
  // it before the page draws. Two switches share this: the round header button
  // (wider screens) and the switch on the Home row of the phone menu.
  var THEME_KEY = "reservedTheme";
  var root = document.documentElement;
  var themeMeta = document.querySelector('meta[name="theme-color"]');
  var themeBtns = document.querySelectorAll(".theme-btn, .nav-theme");
  function savedLight() {
    try { return sessionStorage.getItem(THEME_KEY) !== "dark"; } catch (e) { return true; }
  }
  function showTheme(light) {
    if (light) root.setAttribute("data-theme", "light");
    else root.removeAttribute("data-theme");
    if (themeMeta) themeMeta.setAttribute("content", light ? "#F5EEDF" : "#0B0B0C");
    // Header button says what it switches to; the phone-menu row is a
    // "Dark mode" on/off switch
    themeBtns.forEach(function (b) {
      if (b.classList.contains("nav-theme")) b.setAttribute("aria-checked", light ? "false" : "true");
      else b.setAttribute("aria-label", light ? "Switch to dark mode" : "Switch to light mode");
    });
  }
  var fadeTimer;
  themeBtns.forEach(function (b) {
    b.addEventListener("click", function () {
      var light = root.getAttribute("data-theme") !== "light";
      try {
        if (light) sessionStorage.removeItem(THEME_KEY);
        else sessionStorage.setItem(THEME_KEY, "dark");
      } catch (e) {}
      // Colors fade for a moment (style.css skips it for reduced motion)
      root.classList.add("theme-fade");
      clearTimeout(fadeTimer);
      fadeTimer = setTimeout(function () { root.classList.remove("theme-fade"); }, 350);
      showTheme(light);
    });
  });
  showTheme(savedLight());
  // Back/Forward can show a page as it was left: match the tab's current choice
  window.addEventListener("pageshow", function (e) { if (e.persisted) showTheme(savedLight()); });

  /* ---------- Contact form (contact.html) ---------- */
  // Sends to the same Apps Script as sign-ups, as kind "contact"; it lands on
  // the Sheet's Messages tab and never adds anyone to the sign-up list.
  var contact = document.getElementById("contact-form");
  if (contact) {
    var cMsg = document.getElementById("contact-msg");
    var cFields = [contact.elements.name, contact.elements.email, contact.elements.message];

    var contactError = function (text, field) {
      cMsg.textContent = text;
      cMsg.className = "form-msg err";
      cFields.forEach(function (f) { f.removeAttribute("aria-invalid"); });
      if (field) { field.setAttribute("aria-invalid", "true"); field.focus(); }
    };

    contact.addEventListener("submit", function (e) {
      e.preventDefault();
      if (contact.company.value) return; // bot
      var name = contact.elements.name.value.trim();
      var from = contact.elements.email.value.trim();
      var text = contact.elements.message.value.trim();
      var license = contact.elements.license.value.trim(); // optional
      if (!name) return contactError("Enter your name.", contact.elements.name);
      if (!EMAIL_RE.test(from)) return contactError("Enter an email like name@email.com.", contact.elements.email);
      if (text.length < 2) return contactError("Write a message.", contact.elements.message);
      contactError("");
      cMsg.className = "form-msg";

      var btn = contact.querySelector("button[type=submit]");
      btn.disabled = true;
      btn.textContent = "Sending...";
      sendSignup({
        kind: "contact",
        name: name,
        from: from, // "from", not "email": see subscribe.gs
        license: license,
        message: text
      }).then(function () {
        contact.reset();
        cMsg.textContent = "Message sent. We'll reply by email.";
        cMsg.className = "form-msg ok";
      }).catch(function () {
        contactError("That didn't go through. Check your connection and try again.");
      }).then(function () {
        btn.disabled = false;
        btn.textContent = "Send Message";
      });
    });
  }

  /* ---------- Subscribe ---------- */
  var form = document.getElementById("sub-form");
  if (form) {
    var msg = document.getElementById("form-msg");
    var email = document.getElementById("email");

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var val = email.value.trim();
      msg.className = "form-msg";
      if (form.company.value) return; // bot
      if (!EMAIL_RE.test(val)) {
        msg.textContent = "Enter an email like name@email.com.";
        msg.classList.add("err");
        email.focus();
        return;
      }
      var btn = form.querySelector("button");
      btn.disabled = true;
      btn.textContent = "Subscribing...";
      sendSignup({ email: val, source: "subscribe form" }).then(function () {
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
  }

  /* ---------- Tap-to-open sections (FAQ, Privacy, Terms) ---------- */
  // A link to #some-section (the tiles at the top of Privacy and Terms, or a
  // link from another page) opens that section and scrolls to it.
  var calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function openSection(id, smooth) {
    var d = id && document.getElementById(id);
    if (!d || d.tagName !== "DETAILS") return false;
    d.open = true;
    d.scrollIntoView({ behavior: smooth && !calm ? "smooth" : "auto", block: "start" });
    d.querySelector("summary").focus({ preventScroll: true });
    return true;
  }
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (a && openSection(a.getAttribute("href").slice(1), true)) {
      e.preventDefault();
      history.replaceState(null, "", a.getAttribute("href"));
    }
  });
  if (location.hash) openSection(decodeURIComponent(location.hash.slice(1)), false);
})();
