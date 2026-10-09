"use client";

import { useState } from "react";
import { Lesson, OutputPage, QA } from "../ui";

export default function Modules7to9() {
  const [active, setActive] = useState("m7");

  return (
    <OutputPage
      title="Output Questions — Modules 7–9"
      subtitle="Predict transaction, change-stream, read-concern, and shard-key results."
      tabs={[
        { id: "m7", label: "Module 7: Advanced" },
        { id: "m8", label: "Module 8: Replication" },
        { id: "m9", label: "Module 9: Sharding" },
      ]}
      active={active}
      setActive={setActive}
      prev={{ href: "/phase17/modules-4-6", label: "Modules 4–6" }}
      next={{ href: "/phase17/modules-10-12", label: "Modules 10–12" }}
    >
      {active === "m7" && (
        <>
          <h2 className="text-2xl font-bold text-violet-300">
            Module 7 — Phase 7: Transactions and streams
          </h2>
          <Lesson title="Lesson 1: What the transaction actually wrote">
            <QA
              level="Mid"
              q="The debit throws. What is each balance afterwards? Start: A=100, B=40. Amount=30."
              code={`const session = await mongoose.startSession();
await session.withTransaction(async () => {
  await Account.updateOne({ _id: aId }, { $inc: { balance: -30 } }, { session });
  await Account.updateOne({ _id: bId }, { $inc: { balance: 30 } }, { session });
  throw new Error("boom");
});`}
              a={`A stays 100. B stays 40.
withTransaction aborts on throw, so both session writes roll back.`}
            />
            <QA
              level="Senior"
              q="Same transfer, but the credit forgot { session }. The debit throws after the credit. Final balances?"
              code={`await session.withTransaction(async () => {
  await Account.updateOne({ _id: aId }, { $inc: { balance: -30 } }, { session });
  await Account.updateOne({ _id: bId }, { $inc: { balance: 30 } });
  throw new Error("boom");
});`}
              a={`A stays 100 (rolled back, it used the session).
B becomes 70 (committed immediately, it ignored the session).

Money was created. Every read and write in the transaction needs { session }.`}
            />
            <QA
              level="Mid"
              q="What does the change document look like?"
              code={`const stream = Order.watch([], { fullDocument: "updateLookup" });
stream.on("change", (change) => {
  console.log(change.operationType);
  console.log(Object.keys(change));
});
await Order.create({ status: "paid", total: 10 });`}
              a={`operationType: "insert"
Keys include _id (resume token), operationType, documentKey, fullDocument, ns, clusterTime.

fullDocument is the inserted order.
Without fullDocument: "updateLookup", an update event's fullDocument is omitted.`}
            />
            <QA
              level="Senior"
              q="What is wrong with this watch filter?"
              code={`Order.watch([
  { $match: { status: "paid" } },
]);`}
              a={`The stream stays silent for paid inserts.

Change-stream documents are not orders. status lives under fullDocument.

Right:
Order.watch([
  { $match: { operationType: "insert", "fullDocument.status": "paid" } },
]);`}
            />
          </Lesson>
          <Lesson title="Lesson 2: Text and geo output">
            <QA
              level="Mid"
              q="A text index exists on title. What is wrong with the output?"
              code={`const docs = await Article.find(
  { $text: { $search: "mongodb indexes" } },
  { score: { $meta: "textScore" } }
).lean();
console.log(docs[0].score);`}
              a={`score is a number only if the projection was applied.
find(filter, projection) in Mongoose can be treated as the projection, so this usually works and logs a relevance number.

If someone sorts without the meta projection:
.sort({ score: -1 })
the sort field is a missing path and the order is wrong.

Right:
.sort({ score: { $meta: "textScore" } })`}
            />
            <QA
              level="Mid"
              q="location is stored as [18.52, 73.85] (lat, lng). What does $near return?"
              code={`await Place.find({
  location: {
    $near: {
      $geometry: { type: "Point", coordinates: [73.8567, 18.5204] },
      $maxDistance: 1000,
    },
  },
});`}
              a={`The place is missing, or the distance is nonsense.

GeoJSON order is [longitude, latitude].
The stored pair is reversed, so the point is not in Pune.

Stored value must be [73.8567, 18.5204].`}
            />
            <QA
              level="Senior"
              q="What does this aggregation write, and what is left in dailyRevenue?"
              code={`await Order.aggregate([
  { $group: { _id: "$customerId", total: { $sum: "$amount" } } },
  { $out: "dailyRevenue" },
]);`}
              a={`The collection dailyRevenue is replaced entirely with the pipeline output.
Previous documents in that collection are gone.
$out does not upsert one row. $merge does.`}
            />
          </Lesson>
        </>
      )}

      {active === "m8" && (
        <>
          <h2 className="text-2xl font-bold text-violet-300">
            Module 8 — Phase 8: Replication output
          </h2>
          <Lesson title="Lesson 1: Stale reads and acknowledgements">
            <QA
              level="Mid"
              q="Write goes to the primary. The next line reads from a secondary. What can user be?"
              code={`await User.create({ email: "ada@example.com" });
const user = await User.findOne({ email: "ada@example.com" })
  .read("secondary")
  .lean();
console.log(user);`}
              a={`null is a valid output.

secondary can lag the primary. The insert is not wrong.
read("primary") returns the document.

secondaryPreferred may also be null if every secondary is behind and a secondary is still chosen.`}
            />
            <QA
              level="Mid"
              q="What is different about these two return values?"
              code={`const a = await Payment.updateOne(
  { _id },
  { $set: { status: "captured" } },
  { writeConcern: { w: 1 } }
);
const b = await Payment.updateOne(
  { _id },
  { $set: { status: "settled" } },
  { writeConcern: { w: "majority", wtimeout: 2000 } }
);
console.log(a.acknowledged, b.acknowledged);`}
              a={`Both can print true true.

w:1 returns after the primary applies the write. A crash can still roll it back.
w:"majority" returns only after a majority applied it. If they do not within 2s, Mongo throws a write concern error and b.acknowledged is not the success path.

The document may still be on the primary when the timeout fires. Check the error before retrying blindly.`}
            />
            <QA
              level="Senior"
              q="What does the snapshot transaction see?"
              code={`const session = await mongoose.startSession();
session.startTransaction({ readConcern: { level: "snapshot" } });
const before = await Counter.findOne({ _id: "visitors" }).session(session);
await Counter.updateOne({ _id: "visitors" }, { $inc: { n: 1 } });
const after = await Counter.findOne({ _id: "visitors" }).session(session);
console.log(before.n, after.n);`}
              a={`Both numbers are equal.

The $inc did not use { session }, so it is outside the transaction.
The snapshot read does not see that concurrent write.

Right: pass { session } on the update. Then after.n is before.n + 1.`}
            />
            <QA
              level="Mid"
              q="The collection is huge and there is no useful index. What is thrown?"
              code={`await Order.find({ note: /refund/ }).maxTimeMS(50);`}
              a={`MongoServerError: operation exceeded time limit.
codeName is often MaxTimeMSExpired.

The query is killed. It does not return a partial array.`}
            />
          </Lesson>
        </>
      )}

      {active === "m9" && (
        <>
          <h2 className="text-2xl font-bold text-violet-300">
            Module 9 — Phase 9: Sharding output
          </h2>
          <Lesson title="Lesson 1: Targeted vs broadcast">
            <QA
              level="Mid"
              q="orders is sharded on customerId. What is the difference in where these run?"
              code={`await Order.find({ customerId, status: "paid" });
await Order.find({ status: "paid" });`}
              a={`First: mongos routes to the shard that owns that customerId.

Second: scatter-gather. Every shard runs the query and mongos merges the results.
The output documents can look the same, but the second call's explain shows multiple shards.`}
            />
            <QA
              level="Senior"
              q="Shard key is { customerId: 1, createdAt: 1 }. What does this update do?"
              code={`await Order.updateOne({ _id: orderId }, { $set: { status: "shipped" } });`}
              a={`On a sharded cluster this throws if the shard key is not in the filter, unless the collection is using the "updateOne without shard key" feature and a broadcast is allowed.

Typical error: "Query for sharded findAndModify must contain the shard key".

Right:
await Order.updateOne(
  { customerId, _id: orderId },
  { $set: { status: "shipped" } }
);`}
            />
            <QA
              level="Senior"
              q="userId is a hashed shard key. What does each query do?"
              code={`await Profile.findOne({ userId: "u1" });
await Profile.find({ userId: { $gte: "u1", $lte: "u9" } });`}
              a={`First: targeted. Equality on a hashed key routes to one shard.

Second: scatter-gather. A hashed key has no range order, so a range cannot pick a shard.`}
            />
            <QA
              level="Mid"
              q="What is wrong with this insert on shard key customerId?"
              code={`await Order.create({ total: 50, status: "paid" });`}
              a={`Throws a write error: document is missing the shard key.

customerId must be present on every insert.
null is a real key and dumps every such document onto one chunk.`}
            />
          </Lesson>
        </>
      )}
    </OutputPage>
  );
}
