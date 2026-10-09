"use client";

import { useState } from "react";
import { Lesson, QA, QueryPage } from "../ui";

export default function Modules7to9() {
  const [active, setActive] = useState("m7");

  return (
    <QueryPage
      title="Query Interviews — Modules 7–9"
      subtitle="Most-asked Mongoose query problems for advanced features, replication options, and sharding."
      tabs={[
        { id: "m7", label: "Module 7: Advanced" },
        { id: "m8", label: "Module 8: Replication" },
        { id: "m9", label: "Module 9: Sharding" },
      ]}
      active={active}
      setActive={setActive}
      prev={{ href: "/phase16/modules-4-6", label: "Modules 4–6" }}
      next={{ href: "/phase16/modules-10-12", label: "Modules 10–12" }}
    >
      {active === "m7" && (
        <>
          <h2 className="text-2xl font-bold text-sky-300">
            Module 7 — Phase 7: Advanced query features
          </h2>

          <Lesson title="Lesson 1: Transactions and change streams">
            <QA
              level="Mid"
              q="Transfer money between two accounts atomically."
              a={`const session = await mongoose.startSession();

await session.withTransaction(async () => {
  const debit = await Account.updateOne(
    { _id: fromId, balance: { $gte: amount } },
    { $inc: { balance: -amount } },
    { session }
  );
  if (debit.modifiedCount !== 1) {
    throw new Error("Insufficient balance");
  }
  await Account.updateOne(
    { _id: toId },
    { $inc: { balance: amount } },
    { session }
  );
});

session.endSession();`}
            />
            <QA
              level="Mid"
              q="Watch new paid orders and resume after a restart."
              a={`const stream = Order.watch(
  [{ $match: { operationType: "insert", "fullDocument.status": "paid" } }],
  { fullDocument: "updateLookup", resumeAfter: savedToken }
);

stream.on("change", async (change) => {
  await handle(change.fullDocument);
  savedToken = change._id;
});`}
            />
            <QA
              level="Senior"
              q="Retry a transaction only on transient errors."
              a={`const session = await mongoose.startSession();
try {
  await session.withTransaction(async () => {
    await Order.create([{ userId, total }], { session });
    await Inventory.updateOne(
      { sku, stock: { $gte: 1 } },
      { $inc: { stock: -1 } },
      { session }
    );
  });
} finally {
  session.endSession();
}

// withTransaction already retries TransientTransactionError.
// Still make the work idempotent if the commit result is unknown.`}
            />
          </Lesson>

          <Lesson title="Lesson 2: Text, geo, time series, GridFS">
            <QA
              level="Mid"
              q="Search products by text and also filter category."
              a={`const products = await Product.find(
  {
    category: "books",
    $text: { $search: "mongodb performance" },
  },
  { score: { $meta: "textScore" } }
)
  .sort({ score: { $meta: "textScore" } })
  .lean();`}
            />
            <QA
              level="Mid"
              q="Stores inside 2km, plus distance is not required. Use $geoWithin so other filters stay easy."
              a={`const stores = await Store.find({
  open: true,
  location: {
    $geoWithin: {
      $centerSphere: [[73.8567, 18.5204], 2 / 6378.1],
    },
  },
}).lean();`}
            />
            <QA
              level="Mid"
              q="Query a time-series style collection for one sensor in a time window."
              a={`const points = await Metric.find({
  sensorId,
  ts: { $gte: start, $lt: end },
})
  .sort({ ts: 1 })
  .lean();`}
            />
            <QA
              level="Senior"
              q="Create the time-series collection. Mongoose schemas do not declare this option."
              a={`MongoDB fallback — collection creation options are a driver command:

const db = mongoose.connection.db;
await db.createCollection("metrics", {
  timeseries: { timeField: "ts", metaField: "sensorId", granularity: "seconds" },
});

// After that, normal Mongoose queries work on the Metric model.`}
            />
            <QA
              level="Senior"
              q="Upload and read a file larger than 16MB."
              a={`MongoDB fallback — GridFS is a driver bucket, not a Mongoose model:

const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
  bucketName: "uploads",
});

const upload = bucket.openUploadStream("report.pdf", {
  metadata: { userId },
});
readable.pipe(upload);

const files = await mongoose.connection.db
  .collection("uploads.files")
  .find({ "metadata.userId": userId })
  .toArray();`}
            />
            <QA
              level="Senior"
              q="Expose a stable 'activeUsers' shape without copying data. Creating a view is not a Mongoose API."
              a={`MongoDB fallback:

await mongoose.connection.db.createCollection("activeUsers", {
  viewOn: "users",
  pipeline: [
    { $match: { status: "active", deletedAt: null } },
    { $project: { name: 1, email: 1 } },
  ],
});

// Read it with a loose model afterwards:
const ActiveUser = mongoose.connection.model(
  "ActiveUser",
  new mongoose.Schema({}, { strict: false }),
  "activeUsers"
);
const rows = await ActiveUser.find().lean();`}
            />
          </Lesson>
        </>
      )}

      {active === "m8" && (
        <>
          <h2 className="text-2xl font-bold text-sky-300">
            Module 8 — Phase 8: Read and write concern on queries
          </h2>

          <Lesson title="Lesson 1: Where the query runs">
            <QA
              level="Junior"
              q="Send analytics reads to a secondary so the primary stays free for writes."
              a={`const rows = await Event.find({ type: "click" })
  .read("secondaryPreferred")
  .sort({ createdAt: -1 })
  .limit(100)
  .lean();`}
            />
            <QA
              level="Mid"
              q="A payment write must be acknowledged by a majority before the API returns."
              a={`await Payment.updateOne(
  { _id: paymentId },
  { $set: { status: "captured", capturedAt: new Date() } },
  { writeConcern: { w: "majority", j: true, wtimeout: 5000 } }
);`}
            />
            <QA
              level="Mid"
              q="Read your own write from the primary. Do not use secondary for this screen."
              a={`const order = await Order.findById(orderId).read("primary").lean();`}
            />
            <QA
              level="Mid"
              q="Set a default read preference for one query chain, including nearest."
              a={`const inventory = await Inventory.find({ sku })
  .read("nearest")
  .lean();`}
            />
          </Lesson>

          <Lesson title="Lesson 2: Consistency inside transactions">
            <QA
              level="Senior"
              q="Run a report transaction that must not see partial writes (snapshot)."
              a={`const session = await mongoose.startSession();
session.startTransaction({
  readConcern: { level: "snapshot" },
  writeConcern: { w: "majority" },
});

try {
  const orders = await Order.find({ status: "paid" }).session(session).lean();
  const payments = await Payment.find({ status: "captured" })
    .session(session)
    .lean();
  await session.commitTransaction();
  return { orders, payments };
} catch (err) {
  await session.abortTransaction();
  throw err;
} finally {
  session.endSession();
}`}
            />
            <QA
              level="Senior"
              q="Causal consistency: a user reads a note they just wrote, even with secondaryPreferred."
              a={`const session = await mongoose.startSession({ causalConsistency: true });

const note = await Note.create([{ userId, body }], { session });
const notes = await Note.find({ userId })
  .session(session)
  .read("secondaryPreferred")
  .lean();

session.endSession();`}
            />
            <QA
              level="Senior"
              q="maxTimeMS so a runaway report cannot hold a connection."
              a={`const rows = await Order.find({ status: "paid" })
  .maxTimeMS(3000)
  .lean();`}
            />
            <QA
              level="Mid"
              q="Tag a slow query so it shows up in the profiler."
              a={`const rows = await Order.find({ status: "paid" })
  .comment("checkout: paid orders report")
  .lean();`}
            />
          </Lesson>
        </>
      )}

      {active === "m9" && (
        <>
          <h2 className="text-2xl font-bold text-sky-300">
            Module 9 — Phase 9: Sharded query patterns
          </h2>

          <Lesson title="Lesson 1: Target the shard">
            <QA
              level="Mid"
              q="Shard key is customerId. Write the query that hits one shard, not every shard."
              a={`orderSchema.index({ customerId: 1, createdAt: -1 });

const orders = await Order.find({
  customerId,
  createdAt: { $gte: start },
})
  .sort({ createdAt: -1 })
  .limit(50)
  .lean();

// Missing customerId => scatter-gather across all shards.`}
            />
            <QA
              level="Mid"
              q="Hashed shard key on userId. Which lookup is targeted?"
              a={`const user = await Profile.findOne({ userId }).lean();

// Targeted: equality on the hashed key.
// Not targeted: a range on userId. Hashed keys do not preserve order.`}
            />
            <QA
              level="Senior"
              q="Update in a sharded collection. The filter must include the shard key."
              a={`await Order.updateOne(
  { customerId, _id: orderId },
  { $set: { status: "shipped" } }
);

// { _id: orderId } alone can be rejected or broadcast,
// depending on whether the shard key is _id.`}
            />
            <QA
              level="Senior"
              q="Compound shard key { customerId, createdAt }. Query by customer and a time range."
              a={`const orders = await Order.find({
  customerId,
  createdAt: { $gte: start, $lt: end },
}).lean();`}
            />
          </Lesson>

          <Lesson title="Lesson 2: What not to query, and admin fallbacks">
            <QA
              level="Senior"
              q="Avoid a hot shard when the key is an ever-increasing createdAt."
              a={`// Do not query/write as if createdAt alone is the shard key.
// Prefer a hashed or high-cardinality prefix:

const events = await Event.find({
  tenantId,
  createdAt: { $gte: start },
})
  .sort({ createdAt: -1 })
  .limit(100)
  .lean();`}
            />
            <QA
              level="Senior"
              q="Zone sharding: EU customers must be read from the EU range."
              a={`const customers = await Customer.find({
  region: "EU",
  country: "DE",
}).lean();

// The zone is defined on the shard key (region).
// Queries that include region are routed to the EU shards.`}
            />
            <QA
              level="Senior"
              q="Show chunk distribution. This is not a Mongoose query."
              a={`MongoDB fallback — admin command via the driver:

const status = await mongoose.connection.db.admin().command({
  listShards: 1,
});

const chunks = await mongoose.connection
  .useDb("config")
  .collection("chunks")
  .find({ ns: "shop.orders" })
  .toArray();`}
            />
            <QA
              level="Mid"
              q="A cross-shard $lookup in aggregation. Filter the local side first."
              a={`const rows = await Customer.aggregate([
  { $match: { region: "EU", _id: customerId } },
  {
    $lookup: {
      from: "orders",
      localField: "_id",
      foreignField: "customerId",
      as: "orders",
    },
  },
]);`}
            />
          </Lesson>
        </>
      )}
    </QueryPage>
  );
}
