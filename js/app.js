(function () {
  const L = window.DabaraLogic;
  const $ = (s) => document.querySelector(s);
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
  };

  // GA4-style dataLayer with an on-page debug panel
  window.dataLayer = window.dataLayer || [];
  function track(event, params) {
    const e = Object.assign({ event, variant }, params || {});
    window.dataLayer.push(e);
    const log = $("#event-log");
    if (log) { const li = document.createElement("li"); li.textContent = e.event + " " + JSON.stringify(params || {}); log.prepend(li); }
  }

  // UTM capture (first touch kept)
  const utm = Object.keys(L.parseUtm(location.search)).length ? L.parseUtm(location.search) : store.get("dabara_utm", {});
  store.set("dabara_utm", utm);

  // A/B headline test
  const variant = L.assignVariant(location.search, store.get("dabara_variant"));
  store.set("dabara_variant", variant);
  const HEADLINES = {
    a: { h: "Real South Indian filter coffee, without the 20-minute ritual.", s: "Fresh-ground decoction blends from small estates, shipped every month. Brew a proper dabara-tumbler cup in 4 minutes." },
    b: { h: "Your amma's filter kaapi. Delivered.", s: "The taste of home for South Indians everywhere, from Bengaluru to Brisbane. Freshly roasted, ground and posted within 72 hours." },
  };
  $("#hero-title").textContent = HEADLINES[variant].h;
  $("#hero-sub").textContent = HEADLINES[variant].s;
  $("#variant-badge").textContent = "Headline variant " + variant.toUpperCase();
  track("page_view_variant", { utm_source: utm.utm_source || "(direct)" });

  // Market / currency
  let currency = store.get("dabara_currency", "INR");
  document.querySelectorAll("[data-currency]").forEach((b) => b.addEventListener("click", () => {
    currency = b.dataset.currency; store.set("dabara_currency", currency); renderQuote(); track("select_market", { currency });
  }));

  // Subscription builder
  function renderQuote() {
    const q = L.quote({ bags: $("#bags").value, frequency: $("#frequency").value, currency });
    document.querySelectorAll("[data-currency]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.currency === currency)));
    $("#bags-out").textContent = q.bags + (q.bags === 1 ? " bag" : " bags") + " (250 g each)";
    $("#q-subtotal").textContent = q.symbol + q.subtotal;
    $("#q-discount").textContent = q.discount ? "−" + q.symbol + q.discount : "—";
    $("#q-shipping").textContent = q.shipping ? q.symbol + q.shipping : "Free";
    $("#q-total").textContent = q.symbol + q.total;
    $("#q-percup").textContent = "About " + q.symbol + q.perCup + " per cup";
    return q;
  }
  $("#bags").addEventListener("input", renderQuote);
  $("#frequency").addEventListener("change", renderQuote);
  $("#add-to-cart").addEventListener("click", () => {
    const q = renderQuote();
    track("add_to_cart", { currency: q.currency, value: q.total, bags: q.bags, frequency: q.frequency });
    $("#cart-msg").textContent = "Added to your (demo) cart. This is a fictional brand, so no order is placed.";
  });
  renderQuote();

  // Blend quiz
  let blend = store.get("dabara_blend", null);
  $("#quiz").addEventListener("submit", (ev) => {
    ev.preventDefault();
    const f = new FormData(ev.target);
    const r = L.recommend({ milk: f.get("milk"), strength: f.get("strength"), chicory: f.get("chicory") });
    blend = r.id; store.set("dabara_blend", blend);
    $("#quiz-result").innerHTML = "";
    const h = document.createElement("strong"); h.textContent = "Your match: " + r.name;
    const p = document.createElement("p"); p.textContent = r.note;
    $("#quiz-result").append(h, p);
    track("quiz_complete", { blend: r.id });
  });

  // Waitlist lead capture
  $("#lead-form").addEventListener("submit", (ev) => {
    ev.preventDefault();
    const email = $("#email").value.trim();
    const msg = $("#lead-msg");
    if (!L.isValidEmail(email)) { msg.textContent = "Please enter a valid email address."; msg.className = "msg error"; return; }
    const leads = store.get("dabara_leads", []);
    leads.push(Object.assign({ timestamp: new Date().toISOString(), email, market: $("#market").value, variant, blend: blend || "" }, utm));
    store.set("dabara_leads", leads);
    msg.textContent = "You're on the list. Your first-bag code is KAAPI15 (demo only).";
    msg.className = "msg ok";
    ev.target.reset();
    track("generate_lead", { market: leads[leads.length - 1].market });
    renderAdmin();
  });

  // FAQ accordion analytics
  document.querySelectorAll("details").forEach((d) => d.addEventListener("toggle", () => { if (d.open) track("faq_open", { q: d.querySelector("summary").textContent }); }));

  // Demo admin panel (?admin=1): leads table + CSV export + event log
  function renderAdmin() {
    if (!new URLSearchParams(location.search).has("admin")) return;
    $("#admin").hidden = false;
    const leads = store.get("dabara_leads", []);
    $("#lead-count").textContent = leads.length;
    const byVar = { a: 0, b: 0 }; leads.forEach((l) => { if (l.variant in byVar) byVar[l.variant]++; });
    $("#lead-split").textContent = "A: " + byVar.a + " · B: " + byVar.b;
  }
  $("#export-csv").addEventListener("click", () => {
    const csv = L.leadsToCsv(store.get("dabara_leads", []));
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "dabara-leads.csv"; a.click();
  });
  $("#clear-leads").addEventListener("click", () => { store.set("dabara_leads", []); renderAdmin(); });
  renderAdmin();

  // Scroll depth
  const marks = new Set();
  window.addEventListener("scroll", () => {
    const pct = Math.round(((window.scrollY + window.innerHeight) / document.body.scrollHeight) * 100);
    [50, 90].forEach((m) => { if (pct >= m && !marks.has(m)) { marks.add(m); track("scroll_depth", { percent: m }); } });
  }, { passive: true });
})();
