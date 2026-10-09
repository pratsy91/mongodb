"use client";

import { useState } from "react";
import { Incident, Lesson, ScenarioPage } from "../ui";

export default function Modules4to6() {
  const [active, setActive] = useState("m4");

  return (
    <ScenarioPage
      title="Production Scenarios — Modules 4–6"
      subtitle="Incidents from aggregations, indexes, and Mongoose in Express."
      tabs={[
        { id: "m4", label: "Module 4: Aggregation" },
        { id: "m5", label: "Module 5: Indexes" },
        { id: "m6", label: "Module 6: Mongoose" },
      ]}
      active={active}
      setActive={setActive}
      prev={{ href: "/phase18/modules-1-3", label: "Modules 1–3" }}
      next={{ href: "/phase18/modules-7-9", label: "Modules 7–9" }}
    >
      {active === "m4" && (
        <>
          <h2 className="text-2xl font-bold text-amber-300">
            Module 4 — Phase 4: Aggregation incidents
          </h2>
          <Lesson title="Lesson 1: Wrong numbers on the dashboard">
            <Incident
              level="Mid"
              title="Finance says yesterday's revenue is short. Orders with no line items vanished."
              symptom={`await Order.aggregate([
  { $unwind: "$items" },
  { $group: { _id: null, revenue: { $sum: { $multiply: ["$items.price", "$items.qty"] } } } },
]);`}
              fix={`Cause: $unwind drops documents whose items array is missing or empty. Those orders never reach $group.

Fix:
{ $unwind: { path: "$items", preserveNullAndEmptyArrays: true } }

Also $match status: "paid" before $unwind so drafts are not summed.`}
            />
            <Incident
              level="Junior"
              title="The revenue card shows 0. The collection clearly has amounts."
              symptom={`{ $group: { _id: null, revenue: { $sum: "amount" } } }`}
              fix={`Cause: "amount" is a literal string. $sum ignores it and returns 0.

Fix: { $sum: "$amount" }`}
            />
            <Incident
              level="Mid"
              title="GET /admin/stats sometimes crashes with 'Cannot read properties of undefined (reading total)'."
              symptom={`const [out] = await Order.aggregate([
  { $match: filter },
  { $facet: { rows: [{ $limit: 20 }], meta: [{ $count: "total" }] } },
]);
res.json({ total: out.meta[0].total, rows: out.rows });`}
              fix={`Cause: $count emits nothing when the match is empty, so meta is [] and meta[0] is undefined.

Fix:
const total = out.meta[0] ? out.meta[0].total : 0;
res.json({ total, rows: out.rows });`}
            />
            <Incident
              level="Senior"
              title="The hourly job that rebuilds customerRevenue deleted the collection's indexes and the API 500'd until they were recreated."
              symptom={`await Order.aggregate([
  { $group: { _id: "$customerId", total: { $sum: "$amount" } } },
  { $out: "customerRevenue" },
]);`}
              fix={`Cause: $out replaces the target collection. Indexes on it are dropped with the old collection.

Fix: write with $merge into a stable collection that already has indexes.
{ $merge: { into: "customerRevenue", on: "_id", whenMatched: "replace", whenNotMatched: "insert" } }

If you must use $out, recreate indexes in the same job before traffic reads it.`}
            />
          </Lesson>
          <Lesson title="Lesson 2: The report takes down the API">
            <Incident
              level="Senior"
              title="GET /reports/sales spikes CPU and then the route returns 'Exceeded memory limit'."
              symptom={`await Order.aggregate([
  { $lookup: { from: "users", localField: "userId", foreignField: "_id", as: "user" } },
  { $unwind: "$user" },
  { $match: { status: "paid", "user.country": "IN" } },
  { $sort: { createdAt: -1 } },
]);`}
              fix={`Cause: $lookup and $unwind run on every order. $match is too late to use an index. A big $sort can exceed RAM.

Fix:
await Order.aggregate([
  { $match: { status: "paid", createdAt: { $gte: start } } },
  { $sort: { createdAt: -1 } },
  { $limit: 500 },
  { $lookup: {
      from: "users",
      let: { uid: "$userId" },
      pipeline: [
        { $match: { $expr: { $eq: ["$_id", "$$uid"] }, country: "IN" } },
        { $project: { name: 1, country: 1 } },
      ],
      as: "user",
    } },
]);
Add { status: 1, createdAt: -1 } index. Pass { allowDiskUse: true } only if a large sort is still required.`}
            />
            <Incident
              level="Mid"
              title="The 'top products' chart groups by the string 'items.productId' and shows one bucket."
              symptom={`{ $group: { _id: "items.productId", units: { $sum: "$items.qty" } } }`}
              fix={`Cause: missing $. Every order is grouped under the literal key "items.productId". qty was also not unwound, so $sum of an array is not the unit count you want.

Fix:
{ $unwind: "$items" },
{ $group: { _id: "$items.productId", units: { $sum: "$items.qty" } } },
{ $sort: { units: -1 } },
{ $limit: 10 }`}
            />
          </Lesson>
        </>
      )}

      {active === "m5" && (
        <>
          <h2 className="text-2xl font-bold text-amber-300">
            Module 5 — Phase 5: Index incidents
          </h2>
          <Lesson title="Lesson 1: Slow queries after launch">
            <Incident
              level="Junior"
              title="User search by email was fast in dev and takes 8 seconds in production."
              symptom={`await User.findOne({ email: req.body.email });
explain shows COLLSCAN, totalDocsExamined equals the collection size.`}
              fix={`Cause: dev had a few hundred users, so the scan was invisible. Production has millions and no email index.

Fix:
userSchema.index({ email: 1 }, { unique: true });
await User.syncIndexes();
Confirm explain now shows IXSCAN and totalDocsExamined 1.`}
            />
            <Incident
              level="Mid"
              title="The orders list is sorted by createdAt and filtered by status. explain still shows an in-memory SORT."
              symptom={`orderSchema.index({ createdAt: -1 });
orderSchema.index({ status: 1 });
await Order.find({ status: "paid" }).sort({ createdAt: -1 }).limit(20);`}
              fix={`Cause: two separate indexes. MongoDB can filter with one and then sort in memory.

Fix: one compound index, equality before sort.
orderSchema.index({ status: 1, createdAt: -1 });
Drop the redundant single-field indexes if nothing else uses them. Writes got slower for no benefit.`}
            />
            <Incident
              level="Senior"
              title="Signup returns 500 for some users. Logs say E11000 on phone_1 even though the phone field was left blank."
              symptom={`userSchema.index({ phone: 1 }, { unique: true });
await User.create({ email, name });
await User.create({ email: other, name });`}
              fix={`Cause: a unique index indexes null. The second user also has phone: null, so it collides.

Fix: partial index that only applies when phone is a string.
userSchema.index(
  { phone: 1 },
  { unique: true, partialFilterExpression: { phone: { $type: "string" } } }
);
Drop the old phone_1 index after the new one is built.`}
            />
            <Incident
              level="Senior"
              title="Deploying a new index on a 200GB collection made writes stall and the app error budget burned."
              symptom={`userSchema.index({ tenantId: 1, createdAt: -1 });
// syncIndexes ran inside app boot on every pod`}
              fix={`Cause: many pods started index builds at once, and a foreground build competed with traffic.

Fix: build the index from a migration script once, not from every boot.
await User.collection.createIndex(
  { tenantId: 1, createdAt: -1 },
  { background: true }
);
Roll the schema change only after the index is ready. On a replica set, build on a secondary-first rolling strategy if you are on a version that needs it. Watch currentOp for createIndexes.`}
            />
          </Lesson>
          <Lesson title="Lesson 2: Indexes that made writes worse">
            <Incident
              level="Mid"
              title="Insert latency doubled after 'adding indexes for every filter the UI might use'."
              symptom={`Twelve indexes on orders, including low-selectivity { status: 1 } and overlapping compounds.`}
              fix={`Cause: every insert updates every index. Unused indexes still cost writes and RAM.

Fix: list indexes, compare with the profiler, and drop unused ones.
const indexes = await Order.listIndexes();
Keep the ESR compounds that the hot routes actually explain() as IXSCAN.
Hide an index before dropping it so you can unhide if a query regresses:
await Order.collection.hideIndex("status_1");`}
            />
            <Incident
              level="Mid"
              title="Sessions are supposed to expire, but the sessions collection is 80GB and login is slow."
              symptom={`sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 3600 });
// documents are written with expiresAt already set to the deadline`}
              fix={`Cause: expireAfterSeconds is added on top of expiresAt. A session due at 15:00 is deleted around 16:00, or much later because the TTL monitor runs about once a minute and falls behind on a huge collection.

Fix: expireAfterSeconds: 0 when expiresAt is the exact deadline.
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
Still filter in the query: { expiresAt: { $gt: new Date() } }. Do not rely on TTL for authorization.`}
            />
          </Lesson>
        </>
      )}

      {active === "m6" && (
        <>
          <h2 className="text-2xl font-bold text-amber-300">
            Module 6 — Phase 6: Mongoose incidents in Express
          </h2>
          <Lesson title="Lesson 1: Hooks, passwords, and leaked fields">
            <Incident
              level="Junior"
              title="Password reset stores the new password in plain text. The pre('save') bcrypt hook never ran."
              symptom={`userSchema.pre("save", async function () {
  if (this.isModified("password")) this.password = await bcrypt.hash(this.password, 12);
});
await User.updateOne({ _id }, { $set: { password: req.body.password } });`}
              fix={`Cause: updateOne does not run document save middleware.

Fix: load and save, or hash in the route before the update.
const user = await User.findById(req.user.id).select("+password");
user.password = req.body.password;
await user.save();

If you keep updateOne, hash first and set runValidators: true. Do not expect pre("save") to run.`}
            />
            <Incident
              level="Junior"
              title="GET /me returns the password hash to the browser."
              symptom={`const user = await User.findById(req.user.id);
res.json(user);`}
              fix={`Cause: the field is selected, and toJSON sends it.

Fix:
password: { type: String, select: false }
userSchema.set("toJSON", {
  transform(doc, ret) { delete ret.password; return ret; },
});
res.json(await User.findById(req.user.id).lean());`}
            />
            <Incident
              level="Mid"
              title="Profile city edits 'save' with 200, then the next GET shows the old city."
              symptom={`profile: { type: mongoose.Schema.Types.Mixed }
user.profile.city = req.body.city;
await user.save();`}
              fix={`Cause: Mongoose does not detect deep changes inside Mixed.

Fix:
user.profile.city = req.body.city;
user.markModified("profile");
await user.save();

Better: make profile a nested schema so city is a real path.`}
            />
            <Incident
              level="Mid"
              title="Two tabs submit the same settings form. The second response is 500 VersionError."
              symptom={`const doc = await Settings.findOne({ userId });
doc.theme = req.body.theme;
await doc.save();`}
              fix={`Cause: optimistic concurrency. The second save still has the old __v.

Fix for a last-write-wins settings form:
await Settings.updateOne({ userId }, { $set: { theme: req.body.theme } });

If you need to keep __v, catch VersionError and return 409 so the client refetches.`}
            />
          </Lesson>
          <Lesson title="Lesson 2: Populate, strictQuery, and validation">
            <Incident
              level="Mid"
              title="The feed endpoint got slower every week. Logs show one users query plus one posts query per user."
              symptom={`const users = await User.find().limit(20);
for (const user of users) {
  user.posts = await Post.find({ authorId: user._id }).lean();
}`}
              fix={`Cause: N+1 queries.

Fix: one query, then group in memory, or populate once.
const users = await User.find().limit(20).populate({
  path: "posts",
  options: { limit: 5, sort: { createdAt: -1 } },
  select: "title",
}).lean();

For a hot feed, denormalize the latest post title onto the user instead of joining.`}
            />
            <Incident
              level="Senior"
              title="After a Mongoose upgrade, GET /users?role=admin returned every user in the tenant."
              symptom={`await User.find({ tenantId: req.user.tenantId, role: req.query.role });
// role is not in the schema yet. strictQuery became true.`}
              fix={`Cause: unknown query paths are stripped. The filter became { tenantId } only, so every role came back. That is a data leak, not an empty list.

Fix: add role to the schema, or set strictQuery carefully and allowlist query params.
const role = ["admin", "member"].includes(req.query.role) ? req.query.role : undefined;
const filter = { tenantId: req.user.tenantId };
if (role) filter.role = role;
await User.find(filter).lean();`}
            />
            <Incident
              level="Junior"
              title="Invalid emails are saved. The schema says required and match, but the route uses updateOne."
              symptom={`email: { type: String, required: true, match: /@/ }
await User.updateOne({ _id }, { $set: { email: req.body.email } });`}
              fix={`Cause: query updates do not run validators unless asked.

Fix:
await User.updateOne(
  { _id },
  { $set: { email: req.body.email } },
  { runValidators: true }
);

Map ValidationError to HTTP 400 in the Express error handler. Do not return 500.`}
            />
            <Incident
              level="Senior"
              title="Tests fail with OverwriteModelError, and locally the model sometimes has the old schema after a hot reload."
              symptom={`mongoose.model("User", userSchema) is called from every route file.`}
              fix={`Cause: the model was compiled twice, or the first compile captured a stale schema.

Fix: one module owns the model.
export default mongoose.models.User || mongoose.model("User", userSchema);

Import that module everywhere. Do not call mongoose.model("User") again with a different schema.`}
            />
          </Lesson>
        </>
      )}
    </ScenarioPage>
  );
}
