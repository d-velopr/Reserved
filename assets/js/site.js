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
  var NEXT_RE = /^(store-locator|collection|tiger-ztripez|about|faq)(\.html)?([?#].*)?$/;
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

  /* ---------- US phone box (Contact and Carry Us) ---------- */
  // The +1 is its own box next to the field. Typing 2019870123 shows
  // (201)987-0123, building up as each digit goes in. A pasted or autofilled
  // "+1 201 987 0123" drops its leading 1. The cursor stays after the same
  // digit it was after, so fixing a digit in the middle works too.
  function phoneDigits(value) {
    var d = value.replace(/\D/g, "");
    if (d.length > 10 && d.charAt(0) === "1") d = d.slice(1);
    return d.slice(0, 10);
  }
  function formatPhone(d) {
    if (d.length <= 3) return d ? "(" + d : "";
    if (d.length <= 6) return "(" + d.slice(0, 3) + ")" + d.slice(3);
    return "(" + d.slice(0, 3) + ")" + d.slice(3, 6) + "-" + d.slice(6);
  }
  function formatPhoneAsTyped(el) {
    el.addEventListener("input", function () {
      var caret = el.selectionStart == null ? el.value.length : el.selectionStart;
      var before = phoneDigits(el.value.slice(0, caret)).length; // digits left of the cursor
      var out = formatPhone(phoneDigits(el.value));
      if (out === el.value) return;
      el.value = out;
      // Put the cursor back after the same number of digits.
      var pos = 0, seen = 0;
      while (pos < out.length && seen < before) { if (/\d/.test(out.charAt(pos))) seen++; pos++; }
      if (before === 0) pos = Math.min(out.length, 1); // just after the "("
      if (document.activeElement === el) el.setSelectionRange(pos, pos);
    });
  }

  /* ---------- Contact form (contact.html) ---------- */
  // Sends to the same Apps Script as sign-ups, as kind "contact"; it lands on
  // the Sheet's Messages tab and never adds anyone to the sign-up list.
  var contact = document.getElementById("contact-form");
  if (contact) {
    var cMsg = document.getElementById("contact-msg");
    var cFields = [contact.elements.name, contact.elements.email, contact.elements.phone, contact.elements.message];
    formatPhoneAsTyped(contact.elements.phone);

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
      var phone = phoneDigits(contact.elements.phone.value); // 10 digits
      var text = contact.elements.message.value.trim();
      if (!name) return contactError("Enter your name.", contact.elements.name);
      if (!EMAIL_RE.test(from)) return contactError("Enter an email like name@email.com.", contact.elements.email);
      // Optional, but a number that's started must be all 10 digits.
      if (phone && !/^\d{10}$/.test(phone)) return contactError("Enter all 10 digits, or leave phone blank.", contact.elements.phone);
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
        phone: phone,
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

  /* ---------- Carry Us form (carry-us.html) ---------- */
  // Same questions as 710 Labs' "Carry Us / Wholesale Inquiry" request form.
  // Same Apps Script, kind "carry": the request lands on the Sheet's "Carry Us"
  // tab, attachments go to a Drive folder linked from the row, and nobody is
  // added to the email list.
  var carry = document.getElementById("carry-form");
  if (carry) {
    var wMsg = document.getElementById("carry-msg");
    var wf = carry.elements;
    var drop = document.getElementById("w-drop");
    var fileInput = document.getElementById("w-files");
    var carryFields = [wf.name, wf.email, wf.phone, wf.state, wf.dispensary, wf.license, wf.message, fileInput];
    var fileList = document.getElementById("w-file-list");
    var MAX_FILES = 5, MAX_BYTES = 10 * 1024 * 1024; // 10 MB in all
    var files = [];

    formatPhoneAsTyped(wf.phone);

    var carryError = function (text, field) {
      wMsg.textContent = text;
      wMsg.className = "form-msg err";
      carryFields.forEach(function (f) { f.removeAttribute("aria-invalid"); });
      if (field) { field.setAttribute("aria-invalid", "true"); field.focus(); }
    };

    /* Attachments: images and PDFs, up to 5 files and 10 MB in all */
    var fmtSize = function (n) {
      return n < 1024 * 1024 ? Math.max(1, Math.round(n / 1024)) + " KB" : (n / 1024 / 1024).toFixed(1) + " MB";
    };
    var renderFiles = function () {
      fileList.innerHTML = "";
      files.forEach(function (f, i) {
        var li = document.createElement("li");
        var name = document.createElement("span");
        name.className = "f-name";
        name.textContent = f.name;
        var size = document.createElement("span");
        size.className = "f-size";
        size.textContent = fmtSize(f.size);
        var rm = document.createElement("button");
        rm.type = "button";
        rm.setAttribute("aria-label", "Remove " + f.name);
        rm.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>';
        rm.addEventListener("click", function () { files.splice(i, 1); renderFiles(); fileInput.focus(); });
        li.appendChild(name); li.appendChild(size); li.appendChild(rm);
        fileList.appendChild(li);
      });
    };
    var addFiles = function (picked) {
      var problem = "";
      Array.prototype.forEach.call(picked, function (f) {
        var total = files.reduce(function (n, x) { return n + x.size; }, 0);
        if (!/^image\//.test(f.type) && f.type !== "application/pdf") problem = f.name + " isn't an image or PDF.";
        else if (files.length >= MAX_FILES) problem = "Up to " + MAX_FILES + " files.";
        else if (total + f.size > MAX_BYTES) problem = "Attachments can be 10 MB in all.";
        else files.push(f);
      });
      renderFiles();
      if (files.length) fileInput.removeAttribute("aria-invalid");
      if (problem) { wMsg.textContent = problem; wMsg.className = "form-msg err"; }
      else if (wMsg.classList.contains("err")) { wMsg.textContent = ""; wMsg.className = "form-msg"; }
    };
    fileInput.addEventListener("change", function () { addFiles(fileInput.files); fileInput.value = ""; });
    ["dragenter", "dragover"].forEach(function (t) {
      drop.addEventListener(t, function (e) { e.preventDefault(); drop.classList.add("over"); });
    });
    ["dragleave", "drop"].forEach(function (t) {
      drop.addEventListener(t, function () { drop.classList.remove("over"); });
    });
    drop.addEventListener("drop", function (e) {
      e.preventDefault();
      if (e.dataTransfer && e.dataTransfer.files) addFiles(e.dataTransfer.files);
    });
    // Each file as { name, type, data } with the data in base64.
    var readFile = function (f) {
      return new Promise(function (resolve, reject) {
        var r = new FileReader();
        r.onload = function () { resolve({ name: f.name, type: f.type, data: String(r.result).split(",")[1] || "" }); };
        r.onerror = function () { reject(r.error); };
        r.readAsDataURL(f);
      });
    };

    carry.addEventListener("submit", function (e) {
      e.preventDefault();
      if (wf.company.value) return; // bot
      var v = {
        kind: "carry",
        topic: wf.topic.value,
        name: wf.name.value.trim(),
        from: wf.email.value.trim(), // "from", not "email": see subscribe.gs
        phone: phoneDigits(wf.phone.value), // 10 digits; the Sheet shows it as +1 (201)987-0123
        state: wf.state.value,
        dispensary: wf.dispensary.value.trim(),
        license: wf.license.value.trim(),
        via: wf.via.value, // "Phone call", "Email" or "" (optional)
        message: wf.message.value.trim()
      };
      if (!v.name) return carryError("Enter your first and last name.", wf.name);
      if (!EMAIL_RE.test(v.from)) return carryError("Enter an email like name@email.com.", wf.email);
      if (!/^\d{10}$/.test(v.phone)) return carryError("Enter your 10-digit phone number.", wf.phone);
      if (!v.state) return carryError("Pick the state you're in.", wf.state);
      if (!v.dispensary) return carryError("Enter your dispensary's name.", wf.dispensary);
      if (!v.license) return carryError("Enter your license number.", wf.license);
      if (v.message.length < 2) return carryError("Write a message.", wf.message);
      if (!files.length) return carryError("Add your license (photo or PDF).", fileInput);
      carryError("");
      wMsg.className = "form-msg";

      var btn = carry.querySelector("button[type=submit]");
      btn.disabled = true;
      btn.textContent = files.length ? "Uploading..." : "Sending...";
      Promise.all(files.map(readFile)).then(function (attachments) {
        v.attachments = attachments;
        return sendSignup(v);
      }).then(function () {
        carry.reset();
        files = [];
        renderFiles();
        wMsg.textContent = "Request sent. We'll reply by email.";
        wMsg.className = "form-msg ok";
      }).catch(function () {
        carryError("That didn't go through. Check your connection and try again.");
      }).then(function () {
        btn.disabled = false;
        btn.textContent = "Submit";
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
