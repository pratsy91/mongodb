"use client";

import { useState } from "react";
import { Incident, Lesson, ScenarioPage } from "../ui";

export default function Modules10to12() {
  const [active, setActive] = useState("m10");

  return (
    <ScenarioPage
      title="Production Scenarios — Modules 10–12"
      subtitle="Incidents from security, performance, and operator misuse."
      tabs={[
        { id: "m10", label: "Module 10: Security" },
        { id: "m11", label: "Module 11: Performance" },
        { id: "m12", label: "Module 12: Operators" },
      ]}
      active={active}
      setActive={setActive}
      prev={{ href: "/phase18/modules-7-9", label: "Modules 7–9" }}
      next={{ href: "/phase18/general", label: "General incidents" }}
    >
      {active === "m10" && (
        <>
          <h2 className="text-2xl font-bold text-amber-300">
            Module 10 — Phase 10: Security incidents
          </h2>
          <Lesson title="Lesson 1: Auth bypass and mass assignment">
            <Incident
              level="Junior"
              title="A pentest logs in as the first user without a password. The body is JSON, not a string."
              symptom={`router.post("/login", async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
    password: req.body.password,
  });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  res.json({ token: sign(user.id) });
});`}
              fix={`Cause: the client sent email: { $gt: "" } and password: { $gt: "" }. findOne returned the first user. Passwords were also compared in plain text.

Fix:
const email = String(req.body.email || "").toLowerCase();
const user = await User.findOne({ email }).select("+password");
if (!user) return res.status(401).json({ error: "Invalid credentials" });
const ok = await bcrypt.compare(String(req.body.password || ""), user.password);
if (!ok) return res.status(401).json({ error: "Invalid credentials" });
res.json({ token: sign(user.id) });`}
            />
            <Incident
              level="Senior"
              title="Anyone can become admin by adding role to the signup body."
              symptom={`const user = await User.create(req.body);`}
              fix={`Cause: mass assignment. req.body.role is "admin" and the schema allows it.

Fix: allowlist.
const { name, email, password } = req.body;
const user = await User.create({
  name,
  email,
  password: await bcrypt.hash(password, 12),
  role: "user",
});
Never spread req.body into a model.`}
            />
            <Incident
              level="Mid"
              title="User A can read User B's invoice by changing the id in the URL."
              symptom={`router.get("/invoices/:id", async (req, res) => {
  const invoice = await Invoice.findById(req.params.id).lean();
  res.json(invoice);
});`}
              fix={`Cause: the id is a capability. Authentication is not authorization.

Fix:
const invoice = await Invoice.findOne({
  _id: req.params.id,
  userId: req.user.id,
}).lean();
if (!invoice) return res.status(404).json({ error: "Not found" });
res.json(invoice);
Return 404, not 403, so you do not reveal that the id exists.`}
            />
            <Incident
              level="Senior"
              title="A support export logged full user documents, including password hashes and reset tokens, into CloudWatch."
              symptom={`console.log("export", await User.find().lean());`}
              fix={`Cause: the log pipeline is now a copy of your user table.

Fix:
const users = await User.find().select("email createdAt").lean();
console.log("export", { count: users.length, actor: req.user.id });
select: false is not enough if the code used a raw log of the document before that option existed.
Rotate any secret that was logged.`}
            />
          </Lesson>
          <Lesson title="Lesson 2: Tenant leaks">
            <Incident
              level="Senior"
              title="Tenant A searched orders and saw Tenant B's customer names. The index and the query both looked fine."
              symptom={`router.get("/orders", async (req, res) => {
  const filter = { status: req.query.status || "paid" };
  if (req.query.q) filter["customer.name"] = new RegExp(req.query.q, "i");
  res.json(await Order.find(filter).lean());
});`}
              fix={`Cause: tenantId was never added. A shared collection without a tenant predicate is a cross-tenant read.

Fix on every route, including updates and deletes:
const filter = { tenantId: req.user.tenantId, status };
res.json(await Order.find(filter).select("total status").limit(50).lean());

Add { tenantId: 1, status: 1, createdAt: -1 } and test with two tenants in CI.`}
            />
            <Incident
              level="Mid"
              title="The reset-password link still works after the user changed their password, because the token query ignores expiry."
              symptom={`const user = await User.findOne({ resetToken: req.body.token });
user.password = hash;
user.resetToken = undefined;
await user.save();`}
              fix={`Cause: the token is not bound to a time, and undefined may not unset the path the way you expect on a string field. Also the token was stored in plain text, so a DB read equals account takeover.

Fix:
const user = await User.findOne({
  resetTokenHash: sha256(req.body.token),
  resetTokenExp: { $gt: new Date() },
}).select("+password");
if (!user) return res.status(400).json({ error: "Invalid or expired token" });
user.password = req.body.password;
user.resetTokenHash = undefined;
user.resetTokenExp = undefined;
await user.save();`}
            />
          </Lesson>
        </>
      )}

      {active === "m11" && (
        <>
          <h2 className="text-2xl font-bold text-amber-300">
            Module 11 — Phase 11: Performance incidents
          </h2>
          <Lesson title="Lesson 1: The site is slow, find the query">
            <Incident
              level="Mid"
              title="p99 jumped from 40ms to 4s after a marketing email. CPU on the API is low. MongoDB CPU is high."
              symptom={`No code change. Traffic mix shifted to GET /products?category=&sort=price.`}
              fix={`Cause: an unindexed sort/filter became the hot path.

Fix from Express, in order:
1. Log the slow route. Confirm it is one query.
2. const plan = await Product.find(filter).sort(sort).explain("executionStats");
3. If COLLSCAN or an in-memory sort, add the compound index that matches equality then sort.
4. .select() only the card fields and .limit(24).
5. Re-check explain. nReturned and totalDocsExamined should be close.

Do not scale the API tier first. It is waiting on MongoDB.`}
            />
            <Incident
              level="Mid"
              title="Node RSS climbs until the process is OOMKilled every few hours. The route is a CSV export."
              symptom={`const orders = await Order.find({ tenantId }).lean();
res.send(toCsv(orders));`}
              fix={`Cause: the whole collection is materialized in the Node heap.

Fix: stream a cursor and bound the query.
const cursor = Order.find({ tenantId, createdAt: { $gte: start, $lt: end } })
  .select("total createdAt")
  .lean()
  .cursor();
for await (const order of cursor) res.write(line(order));
res.end();`}
            />
            <Incident
              level="Senior"
              title="MongoDB cache hit ratio collapses and disk IO saturates, but explain on the hot query is an IXSCAN."
              symptom={`Working set of users + orders + 15 indexes is larger than RAM. The index scan still fetches large documents with comments arrays.`}
              fix={`Cause: the working set does not fit in RAM. Fetching fat documents evicts the cache.

Fix:
- Project the fields the route needs so fetches are small.
- Move comments to their own collection (subset / outlier).
- Archive orders older than a year to a cold collection the API does not query.
- Then size RAM to the hot set, not the whole disk.

Mongoose cannot fix a working set that does not fit. The schema and the query shape can shrink it.`}
            />
            <Incident
              level="Mid"
              title="Page 1 of the admin table is fine. Page 400 takes 20 seconds."
              symptom={`const skip = (page - 1) * 50;
await AuditLog.find({ tenantId }).sort({ createdAt: -1 }).skip(skip).limit(50);`}
              fix={`Cause: skip walks every skipped index entry.

Fix:
await AuditLog.find({ tenantId, createdAt: { $lt: cursor } })
  .sort({ createdAt: -1 })
  .limit(50)
  .lean();
The UI uses next/prev cursors instead of jump-to-page.`}
            />
          </Lesson>
          <Lesson title="Lesson 2: Schema incidents that look like slow queries">
            <Incident
              level="Senior"
              title="Product detail p99 tracks the number of reviews. A popular product has 80,000 embedded reviews."
              symptom={`res.json(await Product.findById(req.params.id).lean());`}
              fix={`Cause: one document read returns the entire review history.

Fix:
const product = await Product.findById(req.params.id)
  .select("name price latestReviews reviewCount")
  .lean();
const reviews = await Review.find({ productId: product._id })
  .sort({ createdAt: -1 })
  .limit(20)
  .lean();
res.json({ product, reviews });
Backfill latestReviews with the 5 newest and stop pushing into the product.`}
            />
            <Incident
              level="Mid"
              title="The home page computes 'revenue today' with an aggregation on every refresh. It gets slower every month."
              symptom={`await Order.aggregate([
  { $match: { status: "paid", createdAt: { $gte: startOfDay } } },
  { $group: { _id: null, total: { $sum: "$amount" } } },
]);`}
              fix={`Cause: a hot read is doing a write-time job.

Fix: increment a daily counter when the order is paid.
await DailyStat.updateOne(
  { day: today },
  { $inc: { revenue: amount, orders: 1 } },
  { upsert: true }
);
The home page reads DailyStat.findOne({ day: today }).lean().`}
            />
          </Lesson>
        </>
      )}

      {active === "m12" && (
        <>
          <h2 className="text-2xl font-bold text-amber-300">
            Module 12 — Phase 12: Operator incidents
          </h2>
          <Lesson title="Lesson 1: The update said success and did the wrong thing">
            <Incident
              level="Junior"
              title="The UI shows 'quantity updated'. modifiedCount is 0. The cart still has the old qty."
              symptom={`const result = await Cart.updateOne(
  { userId },
  { $set: { "items.$[item].qty": qty } },
  { arrayFilters: [{ "item.sku": sku }] }
);
res.json({ ok: true });`}
              fix={`Cause: no array element matched the filter. updateOne still acknowledges. The route ignored modifiedCount.

Fix:
if (result.matchedCount === 0) return res.status(404).json({ error: "Cart not found" });
if (result.modifiedCount === 0) return res.status(404).json({ error: "Item not in cart" });
res.json({ ok: true });`}
            />
            <Incident
              level="Mid"
              title="Updating one line item changed only the first duplicate sku. The second line stayed wrong."
              symptom={`await Order.updateOne(
  { _id, "items.sku": sku },
  { $set: { "items.$.qty": qty } }
);`}
              fix={`Cause: the positional $ updates the first match only.

Fix when every matching sku should change:
await Order.updateOne(
  { _id },
  { $set: { "items.$[item].qty": qty } },
  { arrayFilters: [{ "item.sku": sku }] }
);`}
            />
            <Incident
              level="Mid"
              title="Tags now contain the same tag dozens of times and the document is near 16MB."
              symptom={`await Post.updateOne({ _id }, { $push: { tags: req.body.tag } });`}
              fix={`Cause: $push always appends. Clients retry, so duplicates pile up.

Fix:
await Post.updateOne({ _id }, { $addToSet: { tags: req.body.tag } });
One-off cleanup is an update pipeline that $set tags to $setUnion of the current array.`}
            />
            <Incident
              level="Senior"
              title="Removing a cart item by object does nothing. The logged item looks identical."
              symptom={`await Cart.updateOne(
  { userId },
  { $pull: { items: { sku, qty: 1 } } }
);`}
              fix={`Cause: $pull of a document matches the whole subdocument. qty in the database is 2, or extra keys exist, so nothing equals { sku, qty: 1 }.

Fix: match only the sku.
await Cart.updateOne({ userId }, { $pull: { items: { sku } } });`}
            />
          </Lesson>
          <Lesson title="Lesson 2: Counters and pipelines">
            <Incident
              level="Junior"
              title="View counter skips and sometimes goes backwards under load."
              symptom={`const post = await Post.findById(id);
post.views += 1;
await post.save();`}
              fix={`Cause: lost update. Two reads of 10 both save 11.

Fix:
await Post.updateOne({ _id: id }, { $inc: { views: 1 } });`}
            />
            <Incident
              level="Senior"
              title="A discount job wrote the object { $multiply: [...] } into discountedPrice, then a later deploy started throwing on the same update."
              symptom={`await Product.updateMany({ onSale: true }, {
  $set: { discountedPrice: { $multiply: ["$price", 0.9] } },
});`}
              fix={`Cause: a plain update does not evaluate aggregation operators. Dollar-prefixed fields are rejected or stored as junk depending on server version.

Fix: pass an array so it is an update pipeline.
await Product.updateMany({ onSale: true }, [
  { $set: { discountedPrice: { $multiply: ["$price", 0.9] } } },
]);`}
            />
            <Incident
              level="Mid"
              title="Comments are capped at 50 in code, but popular posts have thousands. The detail API is slow."
              symptom={`await Post.updateOne({ _id }, { $push: { comments: comment } });
if (post.comments.length > 50) { /* never runs, post was not reloaded */ }`}
              fix={`Cause: the cap ran against a stale in-memory array, not the database.

Fix: let $slice enforce it on the server.
await Post.updateOne({ _id }, {
  $push: { comments: { $each: [comment], $position: 0, $slice: 50 } },
});`}
            />
          </Lesson>
        </>
      )}
    </ScenarioPage>
  );
}
