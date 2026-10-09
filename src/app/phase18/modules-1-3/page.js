"use client";

import { useState } from "react";
import { Incident, Lesson, ScenarioPage } from "../ui";

export default function Modules1to3() {
  const [active, setActive] = useState("m1");

  return (
    <ScenarioPage
      title="Production Scenarios — Modules 1–3"
      subtitle="Real incidents from connection setup, CRUD, and query filters."
      tabs={[
        { id: "m1", label: "Module 1: Fundamentals" },
        { id: "m2", label: "Module 2: CRUD" },
        { id: "m3", label: "Module 3: Operators" },
      ]}
      active={active}
      setActive={setActive}
      next={{ href: "/phase18/modules-4-6", label: "Modules 4–6" }}
    >
      {active === "m1" && (
        <>
          <h2 className="text-2xl font-bold text-amber-300">
            Module 1 — Phase 1: Connection and data-shape incidents
          </h2>
          <Lesson title="Lesson 1: The API cannot reach MongoDB">
            <Incident
              level="Junior"
              title="Every request opens a new connection. MongoDB hits max connections and the API starts timing out."
              symptom={`// routes/users.js
router.get("/", async (req, res) => {
  await mongoose.connect(process.env.MONGODB_URI);
  const users = await User.find().lean();
  await mongoose.disconnect();
  res.json(users);
});`}
              fix={`Cause: connect + disconnect per request exhausts the pool and adds a handshake to every call.

Fix: connect once before listen, and reuse the pool.

await mongoose.connect(process.env.MONGODB_URI, { maxPoolSize: 20 });
app.listen(3000);

In a route, only query:
const users = await User.find().limit(50).lean();`}
            />
            <Incident
              level="Mid"
              title="Express starts listening, then the first users get 'buffering timed out' for 10 seconds."
              symptom={`app.listen(3000);
mongoose.connect(process.env.MONGODB_URI);`}
              fix={`Cause: listen() ran before the connection was ready. Queries buffered and then failed.

Fix:
await mongoose.connect(process.env.MONGODB_URI);
app.listen(3000);

Also set serverSelectionTimeoutMS so a dead database fails fast instead of hanging the event loop's request.`}
            />
            <Incident
              level="Senior"
              title="On Cloud Run / Lambda, connections climb forever and Atlas alerts 'connections exceeded'."
              symptom={`export async function handler(req, res) {
  await mongoose.connect(process.env.MONGODB_URI);
  res.json(await User.find().lean());
}`}
              fix={`Cause: each cold start creates a client, and warm instances never reuse it across invocations if the model is recompiled.

Fix: cache the connection on globalThis.

const g = globalThis;
export async function connectDB() {
  if (g._conn) return g._conn;
  g._conn = mongoose.connect(process.env.MONGODB_URI, { maxPoolSize: 5 });
  await g._conn;
}
Call connectDB() at the top of the handler. Do not disconnect at the end.`}
            />
            <Incident
              level="Junior"
              title="GET /users/xyz returns 500 with CastError. The client sent a bad id."
              symptom={`router.get("/users/:id", async (req, res) => {
  const user = await User.findById(req.params.id).lean();
  res.json(user);
});`}
              fix={`Cause: "xyz" is not an ObjectId. Mongoose throws before the query.

Fix:
if (!mongoose.isValidObjectId(req.params.id)) {
  return res.status(400).json({ error: "Invalid id" });
}
const user = await User.findById(req.params.id).lean();
if (!user) return res.status(404).json({ error: "Not found" });
res.json(user);`}
            />
          </Lesson>
          <Lesson title="Lesson 2: Wrong types in production data">
            <Incident
              level="Mid"
              title="The 'orders from last 7 days' screen is empty, but Compass shows recent orders."
              symptom={`createdAt was saved as "2026-10-09" (string) from a CSV import.
router.get("/orders", async (req, res) => {
  const since = new Date(Date.now() - 7 * 86400000);
  const orders = await Order.find({ createdAt: { $gte: since } }).lean();
  res.json(orders);
});`}
              fix={`Cause: a Date compared with a string does not match the way you expect. Range queries miss the imported rows.

Fix the write path so Express always stores a Date:
orderSchema.path("createdAt", Date);
createdAt: new Date(req.body.createdAt)

Backfill with an aggregation update pipeline on the model:
await Order.updateMany({ createdAt: { $type: "string" } }, [
  { $set: { createdAt: { $toDate: "$createdAt" } } },
]);`}
            />
            <Incident
              level="Mid"
              title="Checkout totals are off by one cent. Finance cannot reconcile."
              symptom={`await Order.create({
  total: items.reduce((s, i) => s + i.price * i.qty, 0),
});`}
              fix={`Cause: JavaScript number is a binary float. 0.1 + 0.2 is not 0.3, and that value is what got stored.

Fix: store Decimal128, or store integer paise/cents.

total: mongoose.Types.Decimal128.fromString(totalString)

Never compute money with binary floats and then query price: 19.99.`}
            />
            <Incident
              level="Senior"
              title="Saving an order throws 'document is larger than 16777216 bytes'."
              symptom={`orderSchema: { items: [itemSchema], events: [eventSchema] }
Every status change pushes another full snapshot into events.
After a year, save() fails and the order cannot be updated.`}
              fix={`Cause: the 16MB document limit. Unbounded arrays will hit it.

Fix: stop embedding the log.
await OrderEvent.create({ orderId, type, at: new Date() });
await Order.updateOne({ _id }, { $set: { status } });

Keep only a small latestEvents array on the order if the UI needs it.
Existing huge docs must be split with a one-off script before updates will succeed.`}
            />
            <Incident
              level="Mid"
              title="The mobile app sends nickname, the API returns 201, but the field is never in the database."
              symptom={`await User.create({ ...req.body, email });
// schema has name and email only. nickname is absent in Compass.`}
              fix={`Cause: strict mode strips unknown paths. The write 'succeeds' and the field is discarded.

Fix: add the path to the schema before the deploy that starts sending it.
nickname: { type: String }

Do not turn strict off to make this pass. You will persist attacker fields too.`}
            />
          </Lesson>
        </>
      )}

      {active === "m2" && (
        <>
          <h2 className="text-2xl font-bold text-amber-300">
            Module 2 — Phase 2: CRUD incidents
          </h2>
          <Lesson title="Lesson 1: Lost updates and empty filters">
            <Incident
              level="Junior"
              title="Two customers bought the last item. Stock went to 0 and both orders succeeded."
              symptom={`const product = await Product.findOne({ sku });
if (product.stock < qty) return res.status(409).json({ error: "Out of stock" });
product.stock -= qty;
await product.save();
await Order.create({ sku, qty, userId: req.user.id });`}
              fix={`Cause: both requests read stock 1, both saved stock 0.

Fix with one atomic update, and only then create the order:
const updated = await Product.findOneAndUpdate(
  { sku, stock: { $gte: qty } },
  { $inc: { stock: -qty } },
  { new: true }
);
if (!updated) return res.status(409).json({ error: "Out of stock" });
await Order.create({ sku, qty, userId: req.user.id });`}
            />
            <Incident
              level="Junior"
              title="PATCH /users/me returns the old name. The database has the new name."
              symptom={`const user = await User.findByIdAndUpdate(req.user.id, {
  name: req.body.name,
});
res.json(user);`}
              fix={`Cause: findByIdAndUpdate returns the pre-update document unless new: true.

Fix:
const user = await User.findByIdAndUpdate(
  req.user.id,
  { $set: { name: req.body.name } },
  { new: true, runValidators: true }
).select("name email");
res.json(user);`}
            />
            <Incident
              level="Senior"
              title="A cleanup job deleted every user. The filter was built from an empty query string."
              symptom={`router.delete("/users", async (req, res) => {
  const filter = {};
  if (req.query.inactiveSince) filter.lastLogin = { $lt: new Date(req.query.inactiveSince) };
  const result = await User.deleteMany(filter);
  res.json(result);
});`}
              fix={`Cause: inactiveSince was missing, filter was {}, and deleteMany({}) deletes the collection.

Fix: refuse an empty filter.
if (!req.query.inactiveSince) {
  return res.status(400).json({ error: "inactiveSince is required" });
}
const result = await User.deleteMany({
  lastLogin: { $lt: new Date(req.query.inactiveSince) },
});`}
            />
            <Incident
              level="Mid"
              title="Deleted accounts can still call /me and appear in search."
              symptom={`await User.updateOne({ _id: req.user.id }, { $set: { deletedAt: new Date() } });
// login route still does User.findOne({ email })`}
              fix={`Cause: soft delete only set a flag. Every read path forgot it.

Fix: one query middleware, plus a partial unique index so the email can be reused.
userSchema.pre(/^find/, function () {
  this.where({ deletedAt: null });
});
userSchema.index(
  { email: 1 },
  { unique: true, partialFilterExpression: { deletedAt: null } }
);`}
            />
          </Lesson>
          <Lesson title="Lesson 2: Pagination, upserts, and batches">
            <Incident
              level="Mid"
              title="The infinite scroll shows the same post twice and skips another after a new post is published."
              symptom={`const page = Number(req.query.page) || 1;
const posts = await Post.find({ published: true })
  .sort({ createdAt: -1 })
  .skip((page - 1) * 20)
  .limit(20);`}
              fix={`Cause: skip/limit shifts when new posts are inserted at the top.

Fix: keyset pagination.
const filter = { published: true };
if (req.query.cursor) filter._id = { $lt: req.query.cursor };
const posts = await Post.find(filter).sort({ _id: -1 }).limit(20).lean();
res.json({ posts, next: posts.at(-1)?._id || null });`}
            />
            <Incident
              level="Mid"
              title="Signup sometimes creates two users for one email under load. No 11000 is thrown."
              symptom={`let user = await User.findOne({ email });
if (!user) user = await User.create({ email, name });`}
              fix={`Cause: two requests both see null, both insert. There is no unique index.

Fix:
userSchema.index({ email: 1 }, { unique: true });
try {
  user = await User.create({ email, name });
} catch (err) {
  if (err.code === 11000) return res.status(409).json({ error: "Email taken" });
  throw err;
}`}
            />
            <Incident
              level="Senior"
              title="A nightly import stopped at row 200 of 10,000. The other 9,800 rows never ran."
              symptom={`await User.insertMany(rows, { ordered: true });
// one row has a duplicate email`}
              fix={`Cause: ordered:true aborts the batch on the first error.

Fix for an import that should keep going:
const result = await User.insertMany(rows, { ordered: false });
Catch the bulk error and record result.insertedCount plus the writeErrors.
Do not retry the rows that already inserted.`}
            />
            <Incident
              level="Mid"
              title="PUT /users/:id from a form wiped bio, phone, and role. Only the submitted fields remain."
              symptom={`await User.replaceOne({ _id: req.params.id }, req.body);`}
              fix={`Cause: replaceOne replaces the whole document. A partial form body dropped every omitted field.

Fix: patch with $set of an allowlist.
const allowed = ["name", "bio", "phone"];
const patch = {};
for (const key of allowed) if (req.body[key] !== undefined) patch[key] = req.body[key];
await User.updateOne({ _id: req.params.id }, { $set: patch }, { runValidators: true });`}
            />
          </Lesson>
        </>
      )}

      {active === "m3" && (
        <>
          <h2 className="text-2xl font-bold text-amber-300">
            Module 3 — Phase 3: Filter incidents
          </h2>
          <Lesson title="Lesson 1: The filter does not mean what the author thought">
            <Incident
              level="Junior"
              title="The catalog filter 'price 100 to 500' returns expensive products too."
              symptom={`await Product.find({
  price: { $gt: 100 },
  price: { $lt: 500 },
  category: req.query.category,
});`}
              fix={`Cause: the second price key overwrites the first in JavaScript. MongoDB only received $lt.

Fix:
await Product.find({
  category,
  price: { $gt: 100, $lt: 500 },
}).lean();`}
            />
            <Incident
              level="Mid"
              title="Students are marked eligible if any score is high and any result is a pass, even when those are different subjects."
              symptom={`await Student.find({
  "results.score": { $gte: 80 },
  "results.pass": true,
});`}
              fix={`Cause: the two conditions can match different array elements.

Fix:
await Student.find({
  results: { $elemMatch: { score: { $gte: 80 }, pass: true } },
}).lean();`}
            />
            <Incident
              level="Mid"
              title="'Hide products with no price' also hid products whose price was never set. Merchandising sees an empty category."
              symptom={`await Product.find({ price: { $ne: null }, category });`}
              fix={`Cause: { price: null } matches both null and missing, and $ne: null is easy to get wrong in the other direction. Missing prices were excluded together with explicit nulls, which the business did not want. Confirm the stored shape first.

If the rule is "field must exist and be a number":
await Product.find({
  category,
  price: { $exists: true, $type: "number", $ne: null },
}).lean();`}
            />
            <Incident
              level="Senior"
              title="Search box /.*user text.*/i pegs CPU and the whole products API times out."
              symptom={`const q = req.query.q;
await Product.find({ name: { $regex: q, $options: "i" } });`}
              fix={`Cause: unanchored regex cannot use the name index. A user can also send a catastrophic pattern.

Fix: escape input and anchor, or use a text index.
const safe = String(q || "").slice(0, 40).replace(/[.*+?^$()|[\]\\{}]/g, "\\$&");
await Product.find({ name: { $regex: "^" + safe, $options: "i" } }).limit(20).lean();

For real search, add schema.index({ name: "text" }) and query with $text.`}
            />
          </Lesson>
          <Lesson title="Lesson 2: Arrays and geo in production">
            <Incident
              level="Mid"
              title="'Posts with more than 3 tags' always returns nothing. $size: { $gt: 3 } errors."
              symptom={`await Post.find({ tags: { $size: { $gt: 3 } } });`}
              fix={`Cause: $size only accepts an exact integer.

Fix: maintain tagCount on write.
await Post.updateOne(
  { _id },
  { $addToSet: { tags: tag }, $inc: { tagCount: 1 } }
);
await Post.find({ tagCount: { $gt: 3 } }).lean();`}
            />
            <Incident
              level="Senior"
              title="Store locator returns shops in the ocean. QA in India used lat, lng from the maps UI."
              symptom={`await Store.create({
  location: { type: "Point", coordinates: [req.body.lat, req.body.lng] },
});`}
              fix={`Cause: GeoJSON is [longitude, latitude]. The values were swapped, so $near searches the wrong place.

Fix on write:
coordinates: [Number(req.body.lng), Number(req.body.lat)]
storeSchema.index({ location: "2dsphere" });

Reject values outside lng -180..180 and lat -90..90 before create.`}
            />
            <Incident
              level="Mid"
              title="A campaign query 'spent over budget' returns no orders, even when the fields are correct."
              symptom={`await Order.find({ spent: { $gt: "$budget" } });`}
              fix={`Cause: "$budget" is a string, not a field path, in a find filter.

Fix:
await Order.find({ $expr: { $gt: ["$spent", "$budget"] } }).lean();`}
            />
          </Lesson>
        </>
      )}
    </ScenarioPage>
  );
}
