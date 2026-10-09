"use client";

import { useState } from "react";
import { Lesson, OutputPage, QA } from "../ui";

export default function Modules4to6() {
  const [active, setActive] = useState("m4");

  return (
    <OutputPage
      title="Output Questions — Modules 4–6"
      subtitle="Predict aggregation results, index errors, and Mongoose gotchas."
      tabs={[
        { id: "m4", label: "Module 4: Aggregation" },
        { id: "m5", label: "Module 5: Indexes" },
        { id: "m6", label: "Module 6: Mongoose" },
      ]}
      active={active}
      setActive={setActive}
      prev={{ href: "/phase17/modules-1-3", label: "Modules 1–3" }}
      next={{ href: "/phase17/modules-7-9", label: "Modules 7–9" }}
    >
      {active === "m4" && (
        <>
          <h2 className="text-2xl font-bold text-violet-300">
            Module 4 — Phase 4: Aggregation output
          </h2>
          <Lesson title="Lesson 1: $group and $sum mistakes">
            <QA
              level="Junior"
              q="Orders: {status:'paid', amount:100}, {status:'paid', amount:40}, {status:'draft', amount:999}. What is logged?"
              code={`const rows = await Order.aggregate([
  { $match: { status: "paid" } },
  { $group: { _id: null, revenue: { $sum: "$amount" }, n: { $sum: 1 } } },
]);
console.log(rows);`}
              a={`[ { _id: null, revenue: 140, n: 2 } ]

The draft order is removed by $match.
_id: null means one group for the whole set.`}
            />
            <QA
              level="Junior"
              q="Same orders. What is revenue this time?"
              code={`const rows = await Order.aggregate([
  { $match: { status: "paid" } },
  { $group: { _id: null, revenue: { $sum: "amount" } } },
]);
console.log(rows[0].revenue);`}
              a={`0

"amount" is a string constant, not a field path.
$sum ignores non-numeric values.
The field path must be "$amount".`}
            />
            <QA
              level="Mid"
              q="Users: two with role user, one admin. What is the output shape?"
              code={`console.log(await User.aggregate([
  { $group: { _id: "$role", count: { $sum: 1 } } },
  { $sort: { count: -1 } },
]));`}
              a={`[
  { _id: "user", count: 2 },
  { _id: "admin", count: 1 },
]

After $group, the role lives in _id, not in role.
A later $match must use { _id: "user" }, not { role: "user" }.`}
            />
          </Lesson>
          <Lesson title="Lesson 2: $unwind, $project, $lookup">
            <QA
              level="Mid"
              q="Docs: {name:'A', tags:['x','y']}, {name:'B', tags:[]}, {name:'C'}. How many docs come out?"
              code={`const rows = await User.aggregate([{ $unwind: "$tags" }]);
console.log(rows.map((r) => r.name + ":" + r.tags));`}
              a={`["A:x", "A:y"]

B and C disappear.
Empty and missing arrays are dropped unless you set preserveNullAndEmptyArrays: true.

Right, if B and C must remain:
{ $unwind: { path: "$tags", preserveNullAndEmptyArrays: true } }`}
            />
            <QA
              level="Junior"
              q="What fields survive?"
              code={`const rows = await User.aggregate([
  { $project: { name: 1, city: "$address.city" } },
]);`}
              a={`Each document has _id, name, and city.
email and the address object are gone.
_id is kept unless you set _id: 0.

$project: { password: 0 } is the exclusion form and keeps every other field.`}
            />
            <QA
              level="Mid"
              q="Customer has no orders. What is the orders field?"
              code={`const rows = await Customer.aggregate([
  { $match: { _id: customerId } },
  {
    $lookup: {
      from: "orders",
      localField: "_id",
      foreignField: "customerId",
      as: "orders",
    },
  },
]);
console.log(rows[0].orders);`}
              a={`[]

$lookup always writes an array.
No match is an empty array, not null and not a missing field.
One match is still an array of one document.`}
            />
            <QA
              level="Senior"
              q="What does $facet return?"
              code={`const [out] = await Product.aggregate([
  { $match: { status: "active" } },
  {
    $facet: {
      page: [{ $sort: { name: 1 } }, { $limit: 2 }],
      meta: [{ $count: "total" }],
    },
  },
]);
console.log(Object.keys(out));
console.log(out.meta);`}
              a={`["page", "meta"]
[{ total: <number of active products> }]

If nothing matches, meta is [] because $count emits no document for an empty input.
Do not read out.meta[0].total without a check. That throws.`}
            />
            <QA
              level="Senior"
              q="Items: [{qty:2, price:10},{qty:1, price:5}]. What is revenue?"
              code={`const [row] = await Order.aggregate([
  { $match: { _id: orderId } },
  { $unwind: "$items" },
  {
    $group: {
      _id: "$_id",
      revenue: { $sum: { $multiply: ["$items.qty", "$items.price"] } },
    },
  },
]);
console.log(row.revenue);`}
              a={`25

2*10 + 1*5.
After $unwind, each item is its own document, so $sum adds both lines.
Forgetting $unwind would multiply arrays incorrectly or yield null.`}
            />
          </Lesson>
        </>
      )}

      {active === "m5" && (
        <>
          <h2 className="text-2xl font-bold text-violet-300">
            Module 5 — Phase 5: Index output
          </h2>
          <Lesson title="Lesson 1: Unique, explain, prefixes">
            <QA
              level="Junior"
              q="email has a unique index. What is thrown?"
              code={`await User.create({ email: "ada@example.com" });
await User.create({ email: "ada@example.com" });`}
              a={`MongoServerError
code: 11000
codeName: "DuplicateKey"
keyValue: { email: "ada@example.com" }

The second create does not return a document.`}
            />
            <QA
              level="Mid"
              q="Index is { status: 1, createdAt: -1 }. Which query uses it as a proper prefix?"
              code={`await Order.find({ status: "paid" }).sort({ createdAt: -1 });
await Order.find({}).sort({ createdAt: -1 });
await Order.find({ createdAt: { $gte: start } });`}
              a={`First: IXSCAN on { status: 1, createdAt: -1 }. Sort is covered by the index.

Second: the index is not a useful sort index because status is missing. In-memory sort or another index.

Third: createdAt is not a prefix. The compound index is not used for this range.`}
            />
            <QA
              level="Mid"
              q="What do you read from this explain?"
              code={`const plan = await User.find({ email: "ada@example.com" }).explain(
  "executionStats"
);
console.log(plan.executionStats.nReturned);
console.log(plan.executionStats.totalDocsExamined);`}
              a={`With an email index, a good answer is:
nReturned: 1
totalDocsExamined: 1

If totalDocsExamined is close to the collection size, the winning plan is a COLLSCAN.
The stage name to look for is IXSCAN, not COLLSCAN.`}
            />
            <QA
              level="Senior"
              q="Partial index is { email: 1 } where status is active. What does each find use?"
              code={`userSchema.index(
  { email: 1 },
  { partialFilterExpression: { status: "active" } }
);

await User.find({ email: "ada@example.com" });
await User.find({ status: "active", email: "ada@example.com" });`}
              a={`First query cannot use the partial index, because the predicate does not include status: "active". It scans or uses another index.

Second query can use the partial index.

A unique partial index does not reject a duplicate email on a non-active user.`}
            />
          </Lesson>
          <Lesson title="Lesson 2: Wrong hint, TTL, covered query">
            <QA
              level="Mid"
              q="What happens?"
              code={`await User.find({ status: "active" }).hint({ email: 1 });`}
              a={`If { email: 1 } exists, MongoDB uses it even though email is not in the filter.
The plan is a bad index scan or a fetch of the whole index.

If that index does not exist, the query throws:
"hint provided does not correspond to an existing index"`}
            />
            <QA
              level="Mid"
              q="TTL index is { expiresAt: 1 }, expireAfterSeconds: 0. When is the session gone?"
              code={`await Session.create({
  userId,
  expiresAt: new Date(Date.now() - 1000),
});
console.log(await Session.countDocuments({ userId }));`}
              a={`The log can still be 1.

TTL deletion is a background task, about once a minute. It is not immediate.
A query should still filter expiresAt: { $gt: new Date() } if the session must be invalid now.`}
            />
            <QA
              level="Senior"
              q="Index is { status: 1, email: 1 }. Which projection is covered?"
              code={`await User.find({ status: "active" }).select("email");
await User.find({ status: "active" }).select("email -_id");
await User.find({ status: "active" }).select("email name -_id");`}
              a={`First still fetches documents because _id is returned and _id is not part of this index.

Second can be covered: both filter and projection are in the index, and _id is excluded.
totalDocsExamined can be 0.

Third cannot be covered because name is not in the index.`}
            />
          </Lesson>
        </>
      )}

      {active === "m6" && (
        <>
          <h2 className="text-2xl font-bold text-violet-300">
            Module 6 — Phase 6: Mongoose output and wrong code
          </h2>
          <Lesson title="Lesson 1: Hooks, virtuals, lean">
            <QA
              level="Junior"
              q="Does the hook run? What is logged?"
              code={`userSchema.pre("save", function () {
  console.log("saving", this.email);
});

await User.create({ email: "ada@example.com" });
await User.updateOne({ email: "ada@example.com" }, { $set: { name: "Ada" } });`}
              a={`Logs once: saving ada@example.com
create/save runs document middleware.

updateOne does not run pre("save"). The name is still updated.

To hook the update:
userSchema.pre("updateOne", function () {
  console.log(this.getUpdate());
});`}
            />
            <QA
              level="Mid"
              q="What is logged?"
              code={`userSchema.virtual("fullName").get(function () {
  return this.first + " " + this.last;
});

const a = await User.findById(id);
const b = await User.findById(id).lean();
console.log(a.fullName);
console.log(b.fullName);
console.log(a.toJSON().fullName);`}
              a={`"Ada Lovelace"     // document getter works
undefined            // lean() strips virtuals
undefined            // toJSON omits virtuals unless configured

Fix the JSON output:
userSchema.set("toJSON", { virtuals: true });
// or .lean({ virtuals: true })`}
            />
            <QA
              level="Mid"
              q="What is wrong, and what is the output?"
              code={`userSchema.methods.label = () => {
  return this.name.toUpperCase();
};
const user = await User.findById(id);
console.log(user.label());`}
              a={`Throws TypeError: Cannot read properties of undefined (reading 'toUpperCase').

An arrow function does not get the document as this.

Right:
userSchema.methods.label = function () {
  return this.name.toUpperCase();
};`}
            />
            <QA
              level="Junior"
              q="password is select:false. What is in the object?"
              code={`const hidden = await User.findById(id).lean();
const shown = await User.findById(id).select("+password").lean();
console.log(hidden.password, shown.password);`}
              a={`undefined, "<hash>"

select:false removes the field from queries.
+password opts back in. A normal find must not log the hash.`}
            />
          </Lesson>
          <Lesson title="Lesson 2: Populate, Mixed, version, strictQuery">
            <QA
              level="Mid"
              q="post.authorId is a valid id, but the path is declared as author. What is populated?"
              code={`postSchema.add({ author: { type: mongoose.Schema.Types.ObjectId, ref: "User" } });
const post = await Post.findById(id).populate("authorId");
console.log(post.author);`}
              a={`author stays an ObjectId (or undefined). populate("authorId") does nothing useful because that path is not a ref.

Right:
const post = await Post.findById(id).populate("author");
// post.author is the user document, or null if the user was deleted.`}
            />
            <QA
              level="Senior"
              q="profile is Schema.Types.Mixed. What is stored?"
              code={`const user = await User.findById(id);
user.profile.city = "Pune";
await user.save();
console.log((await User.findById(id)).profile);`}
              a={`The city change is missing. Mongoose cannot detect nested Mixed changes.

Right:
user.profile.city = "Pune";
user.markModified("profile");
await user.save();`}
            />
            <QA
              level="Senior"
              q="Two requests load the same user, then both save. What happens?"
              code={`const a = await User.findById(id);
const b = await User.findById(id);
a.name = "Ada";
await a.save();
b.name = "Grace";
await b.save();`}
              a={`The second save throws VersionError.
Mongoose increments __v on save. b still has the old __v.

The stored name stays "Ada" unless you catch the error and reload.
Disable only if you accept last-write-wins:
new Schema({...}, { versionKey: false })`}
            />
            <QA
              level="Senior"
              q="Schema has name and email only. Mongoose 7+, strictQuery defaults to strict:true. What does this return?"
              code={`const users = await User.find({ notARealField: "x" });
console.log(users.length);`}
              a={`The length of the whole collection.

notARealField is stripped from the filter, so the query becomes {}.

Right, if the field should be queried:
schema option strictQuery: false
or only query paths that exist on the schema.`}
            />
            <QA
              level="Mid"
              q="What does exists return, and what does orFail throw?"
              code={`const hit = await User.exists({ email: "ada@example.com" });
console.log(hit);

await User.findOne({ email: "missing@example.com" }).orFail();`}
              a={`hit is { _id: ObjectId("...") }, not true.
A miss returns null. Do not write if (hit === true).

orFail() throws DocumentNotFoundError.
findOne without orFail returns null and does not throw.`}
            />
            <QA
              level="Mid"
              q="What is wrong with this select?"
              code={`await User.find().select("name -password");`}
              a={`Throws a projection error. Inclusion and exclusion cannot be mixed.
The usual message is that you cannot exclude password while including name.

You cannot mix include and exclude, except excluding _id.

Right:
.select("name email")
// or
.select("-password")`}
            />
          </Lesson>
        </>
      )}
    </OutputPage>
  );
}
