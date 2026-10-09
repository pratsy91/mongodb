"use client";

import { useState } from "react";
import { Lesson, OutputPage, QA } from "../ui";

export default function Modules10to12() {
  const [active, setActive] = useState("m10");

  return (
    <OutputPage
      title="Output Questions — Modules 10–12"
      subtitle="Predict injection results, slow-query plans, and operator output."
      tabs={[
        { id: "m10", label: "Module 10: Security" },
        { id: "m11", label: "Module 11: Performance" },
        { id: "m12", label: "Module 12: Operators" },
      ]}
      active={active}
      setActive={setActive}
      prev={{ href: "/phase17/modules-7-9", label: "Modules 7–9" }}
    >
      {active === "m10" && (
        <>
          <h2 className="text-2xl font-bold text-violet-300">
            Module 10 — Phase 10: Security output
          </h2>
          <Lesson title="Lesson 1: What the query really matched">
            <QA
              level="Junior"
              q="The body is { email: { $gt: '' }, password: { $gt: '' } }. Who is returned?"
              code={`const user = await User.findOne({
  email: req.body.email,
  password: req.body.password,
});
console.log(user && user.email);`}
              a={`The first user in natural order, not a failed login.

$gt: "" matches every non-empty string. findOne returns one document.
This is a login bypass.

Right:
const email = String(req.body.email || "");
const user = await User.findOne({ email }).select("+password");
const ok = user && (await bcrypt.compare(req.body.password, user.password));`}
            />
            <QA
              level="Mid"
              q="req.query is { status: 'active', role: { $ne: 'user' } }. What is returned?"
              code={`const users = await User.find(req.query).lean();`}
              a={`Every active user whose role is not "user", including admins.

The client injected an operator. A string status was expected.

Right:
const status = ["active", "invited"].includes(req.query.status)
  ? req.query.status
  : "active";
await User.find({ status });`}
            />
            <QA
              level="Mid"
              q="Tenant A calls this with a Tenant B order id. What is logged?"
              code={`const order = await Order.findById(req.params.id).lean();
console.log(order.tenantId);`}
              a={`"B"

findById does not know about tenants. The id is enough to read another tenant's order.

Right:
const order = await Order.findOne({
  _id: req.params.id,
  tenantId: req.user.tenantId,
}).lean();
// null when the id belongs to someone else`}
            />
            <QA
              level="Senior"
              q="password is select:false, but this response still contains it. Why?"
              code={`const user = await User.findById(id);
user.password = hash;
await user.save();
res.json(user);`}
              a={`Output JSON includes password.

select:false only affects queries. The in-memory document still has the field you just set, and toJSON sends it.

Right:
res.json(user.toJSON());
// and
userSchema.set("toJSON", {
  transform(doc, ret) {
    delete ret.password;
    return ret;
  },
});`}
            />
          </Lesson>
          <Lesson title="Lesson 2: Roles and projection">
            <QA
              level="Mid"
              q="What fields does a customer receive?"
              code={`const projection = req.user.role === "agent" ? "-__v" : "-internalNotes -__v";
const ticket = await Ticket.findById(id).select(projection).lean();`}
              a={`Customer object has title, body, status, and no internalNotes.
Agent object still has internalNotes.

Exclusion projection keeps unspecified fields. If a new secret field is added later, the customer will see it.

Safer: inclusion projection, "title body status".`}
            />
            <QA
              level="Senior"
              q="Deterministic encryption is on ssn. What does each query return?"
              code={`await User.findOne({ ssn: "123-45-6789" });
await User.find({ ssn: { $gt: "100-00-0000" } });`}
              a={`First: the matching user, if the driver encrypts the query value with the same deterministic key.

Second: no useful match. Deterministic encryption only supports equality.
A range is either empty or an error, depending on the encryption schema.

Random encryption cannot support the equality query either.`}
            />
          </Lesson>
        </>
      )}

      {active === "m11" && (
        <>
          <h2 className="text-2xl font-bold text-violet-300">
            Module 11 — Phase 11: Performance output
          </h2>
          <Lesson title="Lesson 1: Explain numbers">
            <QA
              level="Junior"
              q="What is wrong with these numbers?"
              code={`const stats = (await User.find({ city: "Pune" }).explain("executionStats"))
  .executionStats;
console.log(stats.nReturned, stats.totalDocsExamined);`}
              a={`Example of a bad plan: nReturned 20, totalDocsExamined 200000.
The stage is COLLSCAN.

A good plan examines about as many docs as it returns (or fewer when covered).
Fix with userSchema.index({ city: 1 }) and run explain again.`}
            />
            <QA
              level="Mid"
              q="Page 5000 uses skip(100000). limit 20. What does explain show?"
              code={`await Post.find({ published: true })
  .sort({ createdAt: -1 })
  .skip(100000)
  .limit(20)
  .explain("executionStats");`}
              a={`nReturned is 20, but totalDocsExamined or keysExamined is about 100020.
MongoDB walks the skipped docs. Latency grows with the page number.

Cursor output stays cheap:
find({ published: true, createdAt: { $lt: cursor } }).sort({ createdAt: -1 }).limit(20)`}
            />
            <QA
              level="Mid"
              q="Why is this plan a collection scan even with an index on name?"
              code={`await User.find({ name: /.*ada.*/i }).explain("executionStats");`}
              a={`Winning plan: COLLSCAN.
A leading wildcard cannot walk the name index.

/^ada/i can be an IXSCAN.
A text index plus $text is the index-backed form for unanchored search.`}
            />
            <QA
              level="Senior"
              q="What does the pipeline return, and where is the time spent?"
              code={`await Order.aggregate([
  { $lookup: { from: "customers", localField: "customerId", foreignField: "_id", as: "c" } },
  { $unwind: "$c" },
  { $match: { "c.country": "IN", status: "paid" } },
]);`}
              a={`Only paid orders whose customer is in IN.

The $match is last, so $lookup runs for every order, including drafts and other countries.
explain shows a large lookup.

Right: $match status paid first, and filter country inside a $lookup pipeline.`}
            />
          </Lesson>
          <Lesson title="Lesson 2: Pattern output">
            <QA
              level="Mid"
              q="latestReviews holds 5 reviews. reviews holds 10000. What does this response contain?"
              code={`const product = await Product.findById(id).lean();
res.json(product);`}
              a={`The whole product, including all 10000 reviews if they are embedded.
The subset field is unused.

Right:
const product = await Product.findById(id)
  .select("name price latestReviews reviewCount")
  .lean();`}
            />
            <QA
              level="Senior"
              q="What is the output shape of the attribute query?"
              code={`// attrs: [ {k:'color', v:'red'}, {k:'size', v:'M'} ]
const docs = await Product.find({
  "attrs.k": "color",
  "attrs.v": "M",
});`}
              a={`A product that is size M and some other color also matches.
color and M can come from different array elements.

Right output is only red AND size M:
attrs: {
  $all: [
    { $elemMatch: { k: "color", v: "red" } },
    { $elemMatch: { k: "size", v: "M" } },
  ],
}`}
            />
          </Lesson>
        </>
      )}

      {active === "m12" && (
        <>
          <h2 className="text-2xl font-bold text-violet-300">
            Module 12 — Phase 12: Operator output
          </h2>
          <Lesson title="Lesson 1: Update operators">
            <QA
              level="Junior"
              q="tags start as ['mongo']. What is stored after each update?"
              code={`await Post.updateOne({ _id }, { $push: { tags: "mongo" } });
await Post.updateOne({ _id }, { $addToSet: { tags: "mongo" } });
await Post.updateOne({ _id }, { $addToSet: { tags: "node" } });`}
              a={`After $push: ["mongo", "mongo"]
After $addToSet mongo: ["mongo", "mongo"]  // duplicate already there, so unchanged
After $addToSet node: ["mongo", "mongo", "node"]

$addToSet does not remove existing duplicates.`}
            />
            <QA
              level="Junior"
              q="views does not exist. What is stored?"
              code={`await Post.updateOne({ _id }, { $inc: { views: 1 } });
await Post.updateOne({ _id }, { $inc: { views: 1 } });`}
              a={`views: 2

$inc on a missing field starts at 0, then adds.
It does not throw.`}
            />
            <QA
              level="Mid"
              q="items: [{sku:'A',qty:1},{sku:'A',qty:2},{sku:'B',qty:4}]. What is qty afterwards?"
              code={`await Order.updateOne(
  { _id, "items.sku": "A" },
  { $set: { "items.$.qty": 9 } }
);`}
              a={`[9, 2, 4]

The positional $ updates only the first match.
The second A stays 2.

All A's:
$set: { "items.$[item].qty": 9 }
arrayFilters: [{ "item.sku": "A" }]
// [9, 9, 4]`}
            />
            <QA
              level="Mid"
              q="comments has 3 items. What is the stored length?"
              code={`await Post.updateOne(
  { _id },
  {
    $push: {
      comments: {
        $each: [{ t: "a" }, { t: "b" }],
        $position: 0,
        $slice: 3,
      },
    },
  }
);`}
              a={`3

Two comments are inserted at the front, then $slice keeps the first 3.
The oldest comment is dropped.`}
            />
            <QA
              level="Mid"
              q="tags: ['a','b','a','c']. What remains?"
              code={`await Post.updateOne({ _id }, { $pull: { tags: "a" } });
await Post.updateOne({ _id }, { $pop: { tags: 1 } });`}
              a={`After $pull: ["b", "c"]   // every "a" is removed
After $pop 1: ["b"]       // 1 removes the last element, -1 removes the first`}
            />
            <QA
              level="Senior"
              q="price is 200. What is discountedPrice?"
              code={`await Product.updateOne({ _id }, [
  { $set: { discountedPrice: { $multiply: ["$price", 0.9] } } },
]);`}
              a={`discountedPrice: 180
price stays 200.

The update is an array, so MongoDB runs it as an aggregation pipeline and $multiply reads price.

A normal update document does not evaluate $multiply. It is rejected because a dollar-prefixed field cannot be stored:

{ $set: { discountedPrice: { $multiply: ["$price", 0.9] } } }`}
            />
          </Lesson>
          <Lesson title="Lesson 2: Expression output">
            <QA
              level="Mid"
              q="amount values: 50, 1500, null. What are the labels?"
              code={`const rows = await Order.aggregate([
  {
    $project: {
      label: {
        $cond: [{ $gte: ["$amount", 1000] }, "high", "normal"],
      },
    },
  },
]);`}
              a={`"normal", "high", "normal"

null compared with $gte is false, so the third document is "normal", not an error.
Use $ifNull if null should be a third label.`}
            />
            <QA
              level="Mid"
              q="items: [{name:'Pen', qty:0},{name:'Book', qty:2}]. What is logged?"
              code={`const [row] = await Order.aggregate([
  {
    $project: {
      names: { $map: { input: "$items", as: "it", in: "$$it.name" } },
      stocked: {
        $filter: {
          input: "$items",
          as: "it",
          cond: { $gt: ["$$it.qty", 0] },
        },
      },
    },
  },
]);
console.log(row.names, row.stocked.map((i) => i.name));`}
              a={`["Pen", "Book"]
["Book"]

$map keeps every element. $filter drops qty 0.
The variable is $$it, not $it.`}
            />
            <QA
              level="Senior"
              q="Daily totals are 10, then 5, then 20. What is running?"
              code={`const rows = await Daily.aggregate([
  { $sort: { day: 1 } },
  {
    $setWindowFields: {
      sortBy: { day: 1 },
      output: {
        running: { $sum: "$total", window: { documents: ["unbounded", "current"] } },
      },
    },
  },
]);
console.log(rows.map((r) => r.running));`}
              a={`[10, 15, 35]

Each row adds every total from the start through itself.
Without $sort first, the window order is not the day order you expect.`}
            />
            <QA
              level="Senior"
              q="Two products in books have sold 10 and 10. A third has sold 4. What ranks do they get?"
              code={`const rows = await Product.aggregate([
  {
    $setWindowFields: {
      partitionBy: "$category",
      sortBy: { sold: -1 },
      output: { rank: { $rank: {} } },
    },
  },
]);`}
              a={`sold 10 -> rank 1
sold 10 -> rank 1
sold 4  -> rank 3

$rank skips after a tie. $denseRank would give the third document rank 2.`}
            />
            <QA
              level="Mid"
              q="What is the output of $bucket for ages 10, 20, 40, 70?"
              code={`await User.aggregate([
  {
    $bucket: {
      groupBy: "$age",
      boundaries: [0, 18, 30, 50],
      default: "other",
      output: { count: { $sum: 1 } },
    },
  },
]);`}
              a={`[
  { _id: 0, count: 1 },     // 10
  { _id: 18, count: 1 },    // 20
  { _id: 30, count: 1 },    // 40
  { _id: "other", count: 1 } // 70 is outside the last boundary
]

The last boundary is exclusive and is not its own bucket.
70 is not dropped. It goes to default.`}
            />
          </Lesson>
        </>
      )}
    </OutputPage>
  );
}
