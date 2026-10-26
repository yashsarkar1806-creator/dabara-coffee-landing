// Pure, testable logic for the Dabara & Co. landing page (fictional brand).
(function (root) {
  const CURRENCIES = {
    INR: { symbol: "₹", bagPrice: 549, shipping: 79, freeShipFrom: 2 },
    AUD: { symbol: "A$", bagPrice: 19, shipping: 9, freeShipFrom: 3 },
  };
  const FREQUENCY_DISCOUNT = { once: 0, monthly: 0.1, fortnightly: 0.15 };

  function quote({ bags = 1, frequency = "once", currency = "INR" } = {}) {
    const c = CURRENCIES[currency];
    if (!c) throw new Error("Unknown currency: " + currency);
    if (!(frequency in FREQUENCY_DISCOUNT)) throw new Error("Unknown frequency: " + frequency);
    const n = Math.max(1, Math.min(6, Math.round(Number(bags) || 1)));
    const subtotal = n * c.bagPrice;
    const discount = Math.round(subtotal * FREQUENCY_DISCOUNT[frequency]);
    const shipping = n >= c.freeShipFrom || frequency !== "once" ? 0 : c.shipping;
    const total = subtotal - discount + shipping;
    return { bags: n, frequency, currency, symbol: c.symbol, subtotal, discount, shipping, total,
      perCup: Math.round((total / (n * 30)) * 100) / 100 };
  }

  const BLENDS = {
    "classic-chicory": { name: "Classic 80/20 Chicory", note: "Thick, malty, the Chennai-canteen cup." },
    "estate-pure": { name: "Estate Pure Arabica", note: "No chicory, bright and fruity, great black." },
    "strong-peaberry": { name: "Strong Peaberry Robusta", note: "Bold and bitter-sweet, built for lots of milk." },
  };

  // answers: { milk: "lots"|"some"|"none", strength: "mild"|"medium"|"strong", chicory: "yes"|"no"|"unsure" }
  function recommend(answers = {}) {
    const score = { "classic-chicory": 0, "estate-pure": 0, "strong-peaberry": 0 };
    if (answers.milk === "lots") { score["classic-chicory"] += 2; score["strong-peaberry"] += 2; }
    if (answers.milk === "some") score["classic-chicory"] += 1;
    if (answers.milk === "none") score["estate-pure"] += 3;
    if (answers.strength === "strong") score["strong-peaberry"] += 2;
    if (answers.strength === "medium") score["classic-chicory"] += 2;
    if (answers.strength === "mild") score["estate-pure"] += 2;
    if (answers.chicory === "yes") score["classic-chicory"] += 3;
    if (answers.chicory === "no") { score["estate-pure"] += 2; score["classic-chicory"] -= 3; }
    const id = Object.keys(score).sort((a, b) => score[b] - score[a])[0];
    return { id, ...BLENDS[id], score };
  }

  // Assign A/B headline variant: URL param wins, then stored value, then random.
  function assignVariant(search, stored, rand = Math.random) {
    const p = new URLSearchParams(search || "").get("v");
    if (p === "a" || p === "b") return p;
    if (stored === "a" || stored === "b") return stored;
    return rand() < 0.5 ? "a" : "b";
  }

  function parseUtm(search) {
    const q = new URLSearchParams(search || "");
    const out = {};
    ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].forEach((k) => {
      const v = q.get(k); if (v) out[k] = v.slice(0, 100);
    });
    return out;
  }

  function isValidEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(e || "").trim()); }

  function leadsToCsv(leads) {
    const cols = ["timestamp", "email", "market", "variant", "blend", "utm_source", "utm_medium", "utm_campaign"];
    const esc = (v) => { const s = v == null ? "" : String(v); return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
    return [cols.join(","), ...leads.map((l) => cols.map((c) => esc(l[c])).join(","))].join("\n");
  }

  const api = { CURRENCIES, FREQUENCY_DISCOUNT, BLENDS, quote, recommend, assignVariant, parseUtm, isValidEmail, leadsToCsv };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.DabaraLogic = api;
})(typeof window !== "undefined" ? window : globalThis);
