"use client";

import { useState } from "react";
import { Incident, Lesson, ScenarioPage } from "../ui";

export default function Modules7to9() {
  const [active, setActive] = useState("m7");

  return (
    <ScenarioPage
      title="Production Scenarios — Modules 7–9"
      subtitle="Incidents from transactions, change streams, replication, and sharding."
      tabs={[
        { id: "m7", label: "Module 7: Advanced" },
        { id: "m8", label: "Module 8: Replication" },
        { id: "m9", label: "Module 9: Sharding" },
      ]}
      active={active}
      setActive={setActive}
      prev={{ href: "/phase18/modules-4-6", label: "Modules 4–6" }}
      next={{ href: "/phase18/modules-10-12", label: "Modules 10–12" }}
    >
      {active === "m7" && (
        <>
          <h2 className="text-2xl font-bold text-amber-300">
            Module 7 — Phase 7: Transactions, streams, and large files
          </h2>
          <Lesson title="Lesson 1: Money and side effects">
            <Incident
              level="Mid"
              title="A failed checkout still charged the sender. The receiver balance did not change. Support is flooded."
              symptom={`const session = await mongoose.startSession();
await session.withTransaction(async () => {
  await Account.updateOne({ _id: from }, { $inc: { balance: -amt } }, { session });
  await Account.updateOne({ _id: to }, { $inc: { balance: amt } });
  await notify(to);
});`}
              fix={`Cause: the credit did not use the session, so it committed on its own. The email ran inside the transaction, so a later abort could not unsend it. If the credit throws, the debit rolls back and the mail may already be gone, or the opposite.

Fix: pass { session } on every read and write.
Send the email only after withTransaction resolves.
await session.withTransaction(async () => {
  await Account.updateOne({ _id: from, balance: { $gte: amt } }, { $inc: { balance: -amt } }, { session });
  await Account.updateOne({ _id: to }, { $inc: { balance: amt } }, { session });
});
await notify(to);`}
            />
            <Incident
              level="Senior"
              title="Checkout works locally and throws 'Transaction numbers are only allowed on a replica set member or mongos' in a fresh Docker mongo."
              symptom={`await session.withTransaction(async () => { ... });`}
              fix={`Cause: transactions need a replica set. A standalone mongod rejects them.

Fix local dev with a single-node replica set, or mongodb+srv to Atlas.
Do not wrap a one-document stock decrement in a transaction. $inc with a condition is enough and works on a standalone.

MongoDB fallback for local infra only: start mongod with --replSet rs0 and run rs.initiate().`}
            />
            <Incident
              level="Senior"
              title="Peak sale traffic returns WriteConflict inside transactions. Retries stampede and the route times out."
              symptom={`await session.withTransaction(async () => {
  const items = await Cart.find({ userId }).session(session);
  for (const item of items) {
    await Inventory.updateOne({ sku: item.sku }, { $inc: { stock: -item.qty } }, { session });
  }
  await Order.create([{ userId, items }], { session });
});`}
              fix={`Cause: a long transaction touches many hot inventory documents. Other checkouts conflict and retry the whole cart.

Fix: keep the transaction tiny, or decrement stock with conditional $inc before the transaction and compensate on failure.
Prefer one inventory update per sku with { stock: { $gte: qty } }.
Do not call external HTTP inside withTransaction.
Idempotency-Key header so a client retry does not create a second order.`}
            />
          </Lesson>
          <Lesson title="Lesson 2: Change streams and disk">
            <Incident
              level="Mid"
              title="The websocket service misses orders after a restart. It only sees new events from the moment it booted."
              symptom={`Order.watch().on("change", (change) => io.emit("order", change.fullDocument));`}
              fix={`Cause: no resume token was stored, and fullDocument was not requested for updates.

Fix:
const stream = Order.watch(
  [{ $match: { operationType: { $in: ["insert", "update"] } } }],
  { fullDocument: "updateLookup", resumeAfter: savedToken }
);
stream.on("change", async (change) => {
  await handle(change);
  savedToken = change._id;
  await Cursor.saveToken(savedToken);
});`}
            />
            <Incident
              level="Mid"
              title="The watcher was supposed to emit only paid orders. It emits every insert."
              symptom={`Order.watch([{ $match: { status: "paid" } }]);`}
              fix={`Cause: the change event is not the order. status is under fullDocument.

Fix:
Order.watch([
  { $match: { "fullDocument.status": "paid", operationType: "insert" } },
]);`}
            />
            <Incident
              level="Senior"
              title="Atlas disk is full. The orders collection is small. uploads.chunks is 900GB."
              symptom={`Files were saved with GridFS through mongoose.mongo.GridFSBucket on every user upload, including thumbnails.`}
              fix={`Cause: GridFS keeps file bytes inside the database. That disk is expensive and now blocks writes, because MongoDB needs free space.

Fix: stop writing new files to GridFS. Store the object in S3/GCS and save only the URL on the Mongoose model.
await Image.create({ userId, url, contentType });

Migrate old chunks out, then drop uploads.chunks and uploads.files.
GridFS remains reasonable only when the file must be in MongoDB and is rarely large.`}
            />
          </Lesson>
        </>
      )}

      {active === "m8" && (
        <>
          <h2 className="text-2xl font-bold text-amber-300">
            Module 8 — Phase 8: Replication incidents
          </h2>
          <Lesson title="Lesson 1: Users cannot see their own write">
            <Incident
              level="Mid"
              title="After checkout the app redirects to the order page and shows 404. Refresh a second later works."
              symptom={`await Order.create({ userId, total });
const order = await Order.findOne({ userId }).read("secondaryPreferred").sort({ _id: -1 });`}
              fix={`Cause: the read went to a lagging secondary.

Fix: read-your-writes uses the primary.
const order = await Order.findById(orderId).read("primary");

Use secondaryPreferred only for analytics that can be a few seconds old.`}
            />
            <Incident
              level="Senior"
              title="The payment API returned 200. The primary crashed. The order is gone and the customer was charged by the gateway."
              symptom={`await Order.create(payload, { writeConcern: { w: 1 } });
await gateway.capture(paymentId);`}
              fix={`Cause: w:1 returns before a majority has the write. Failover can roll it back. The gateway capture cannot be rolled back with it.

Fix:
await Order.create([payload], { writeConcern: { w: "majority", j: true } });
Capture the gateway only after the majority ack.
Store the gateway id on the order and make capture idempotent, so a retry does not charge twice.`}
            />
            <Incident
              level="Mid"
              title="The status page says replication lag is 40 seconds. The product admin panel, which reads secondaries, sells items that were already disabled."
              symptom={`await Product.find({ active: true }).read("secondary");`}
              fix={`Cause: the admin disable landed on the primary and has not replicated. The shop is still reading the old document.

Fix: the shop's availability read uses primary, or primaryPreferred.
await Product.find({ active: true, stock: { $gt: 0 } }).read("primary");
Alert on lag. Do not use a lagged secondary for authorization or inventory.`}
            />
            <Incident
              level="Senior"
              title="One report route holds connections until the pool is exhausted. Other routes then hang."
              symptom={`router.get("/export", async (req, res) => {
  const rows = await Order.find({ status: "paid" });
  res.json(rows);
});`}
              fix={`Cause: an unbounded query with no maxTimeMS. It occupies a pooled connection and loads a huge array into Node.

Fix:
const cursor = Order.find({ status: "paid" })
  .select("total createdAt")
  .maxTimeMS(5000)
  .lean()
  .cursor();
res.setHeader("Content-Type", "application/json");
for await (const row of cursor) res.write(JSON.stringify(row) + "\\n");
res.end();

Cap pool wait with maxPoolSize and serverSelectionTimeoutMS so a stuck report fails instead of stalling checkout.`}
            />
          </Lesson>
        </>
      )}

      {active === "m9" && (
        <>
          <h2 className="text-2xl font-bold text-amber-300">
            Module 9 — Phase 9: Sharding incidents
          </h2>
          <Lesson title="Lesson 1: After the cluster was sharded">
            <Incident
              level="Senior"
              title="Enabling sharding on orders made PATCH /orders/:id start failing in production only."
              symptom={`await Order.updateOne({ _id: req.params.id }, { $set: { status } });
// MongoServerError: query must contain the shard key`}
              fix={`Cause: the shard key is customerId, and the update filter only has _id. mongos will not broadcast an update that might hit the wrong shard.

Fix: the client already knows the customer, or you look it up in a non-sharded directory.
await Order.updateOne(
  { _id: req.params.id, customerId: req.user.id },
  { $set: { status } }
);`}
            />
            <Incident
              level="Senior"
              title="One shard is at 95% disk. The other two are almost empty. The shard key is createdAt."
              symptom={`New orders all land on the highest createdAt chunk. The balancer cannot split a monotonically increasing hot chunk fast enough.`}
              fix={`Cause: a monotonic shard key creates a single hot shard.

Fix going forward: shard new collections on a hashed or high-cardinality prefix such as { customerId: "hashed" } or { customerId: 1, createdAt: 1 }.
You cannot casually change a shard key in place. New data goes to a new collection with the better key, and reads dual-write during migration.

MongoDB fallback: confirm with the config.chunks distribution. Mongoose has no API for that.
const chunks = await mongoose.connection.useDb("config").collection("chunks").find({ ns: "shop.orders" }).toArray();`}
            />
            <Incident
              level="Mid"
              title="The admin 'all paid orders today' page timed out the day after sharding. It was fine before."
              symptom={`await Order.find({ status: "paid", createdAt: { $gte: startOfDay } });`}
              fix={`Cause: the filter has no shard key, so every shard runs it (scatter-gather) and mongos merges a huge result.

Fix: require a customerId or tenantId in the route, and index { customerId: 1, createdAt: -1 }.
If the business truly needs a global report, run a pre-aggregated DailyStats model updated on write, and read that. Do not scan every shard from Express.`}
            />
            <Incident
              level="Senior"
              title="Inserts of guest orders fail with 'document missing shard key' after a schema change made customerId optional."
              symptom={`await Order.create({ items, total });`}
              fix={`Cause: a sharded collection rejects documents without the shard key. undefined was stripped by strict mode.

Fix: guest checkout still needs a shard key. Use a guestId or a constant is wrong (one hot chunk).
await Order.create({ customerId: req.user?.id || guestId, items, total });
Make customerId required in the schema again so Mongoose fails in dev before production does.`}
            />
          </Lesson>
        </>
      )}
    </ScenarioPage>
  );
}
