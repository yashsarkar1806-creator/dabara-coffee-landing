const test = require("node:test");
const assert = require("node:assert");
const L = require("../js/logic.js");

test("quote: one-off INR single bag pays shipping", () => {
  const q = L.quote({ bags: 1, frequency: "once", currency: "INR" });
  assert.deepStrictEqual([q.subtotal, q.discount, q.shipping, q.total], [549, 0, 79, 628]);
});
test("quote: monthly subscription gets 10% off and free shipping", () => {
  const q = L.quote({ bags: 2, frequency: "monthly", currency: "INR" });
  assert.strictEqual(q.discount, 110); assert.strictEqual(q.shipping, 0); assert.strictEqual(q.total, 988);
});
test("quote: AUD free shipping threshold and clamping", () => {
  assert.strictEqual(L.quote({ bags: 3, currency: "AUD" }).shipping, 0);
  assert.strictEqual(L.quote({ bags: 2, currency: "AUD" }).shipping, 9);
  assert.strictEqual(L.quote({ bags: 99 }).bags, 6);
  assert.strictEqual(L.quote({ bags: "x" }).bags, 1);
  assert.throws(() => L.quote({ currency: "EUR" }));
});
test("recommend maps quiz answers to blends", () => {
  assert.strictEqual(L.recommend({ milk: "none", strength: "mild", chicory: "no" }).id, "estate-pure");
  assert.strictEqual(L.recommend({ milk: "lots", strength: "strong", chicory: "unsure" }).id, "strong-peaberry");
  assert.strictEqual(L.recommend({ milk: "some", strength: "medium", chicory: "yes" }).id, "classic-chicory");
});
test("assignVariant precedence: URL > stored > random", () => {
  assert.strictEqual(L.assignVariant("?v=b", "a"), "b");
  assert.strictEqual(L.assignVariant("", "a"), "a");
  assert.strictEqual(L.assignVariant("", null, () => 0.9), "b");
});
test("parseUtm, email validation and CSV escaping", () => {
  assert.deepStrictEqual(L.parseUtm("?utm_source=ig&utm_medium=paid_social&x=1"), { utm_source: "ig", utm_medium: "paid_social" });
  assert.ok(L.isValidEmail("a@b.co")); assert.ok(!L.isValidEmail("nope@x"));
  const csv = L.leadsToCsv([{ email: "a@b.co", utm_campaign: 'diwali, "launch"' }]);
  assert.match(csv, /"diwali, ""launch"""/);
});
