const test = require("node:test");
const assert = require("node:assert");
const path = require("path");
const { JSDOM } = require("jsdom");

const fs = require("fs");
const root = path.join(__dirname, "..");
async function load(query) {
  // Load the real index.html, then run the real JS files inside the page window.
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8").replace(/<script[^>]*><\/script>/g, "");
  const dom = new JSDOM(html, { url: "http://localhost/index.html" + query, runScripts: "outside-only", pretendToBeVisual: true });
  for (const f of ["js/logic.js", "js/app.js"]) dom.window.eval(fs.readFileSync(path.join(root, f), "utf8"));
  return dom.window;
}

test("page renders variant, quote, quiz and captures a lead with UTMs", async () => {
  const w = await load("?v=b&admin=1&utm_source=instagram&utm_campaign=diwali_launch");
  const d = w.document;
  assert.match(d.querySelector("#hero-title").textContent, /amma/);
  assert.strictEqual(d.querySelector("#q-total").textContent, "₹988");
  d.querySelector('[data-currency="AUD"]').click();
  assert.strictEqual(d.querySelector("#q-total").textContent, "A$34");
  ["lots", "strong", "unsure"].forEach((v) => (d.querySelector(`input[value="${v}"]`).checked = true));
  d.querySelector("#quiz").dispatchEvent(new w.Event("submit", { cancelable: true }));
  assert.match(d.querySelector("#quiz-result").textContent, /Peaberry/);
  d.querySelector("#email").value = "bad";
  d.querySelector("#lead-form").dispatchEvent(new w.Event("submit", { cancelable: true }));
  assert.match(d.querySelector("#lead-msg").textContent, /valid email/);
  d.querySelector("#email").value = "test@example.com";
  d.querySelector("#lead-form").dispatchEvent(new w.Event("submit", { cancelable: true }));
  const leads = JSON.parse(w.localStorage.getItem("dabara_leads"));
  assert.strictEqual(leads.length, 1);
  assert.strictEqual(leads[0].utm_campaign, "diwali_launch");
  assert.strictEqual(leads[0].blend, "strong-peaberry");
  assert.strictEqual(d.querySelector("#admin").hidden, false);
  assert.strictEqual(d.querySelector("#lead-count").textContent, "1");
  const events = w.dataLayer.map((e) => e.event);
  ["page_view_variant", "select_market", "quiz_complete", "generate_lead"].forEach((e) => assert.ok(events.includes(e), e));
  w.close();
});
