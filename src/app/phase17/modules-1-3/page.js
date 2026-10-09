"use client";

import { useState } from "react";
import { Lesson, OutputPage, QA } from "../ui";

export default function Modules1to3() {
  const [active, setActive] = useState("m1");

  return (
    <OutputPage
      title="Output Questions — Modules 1–3"
      subtitle="Predict the output of fundamentals, CRUD, and operator code."
      tabs={[
        { id: "m1", label: "Module 1: Fundamentals" },
        { id: "m2", label: "Module 2: CRUD" },
        { id: "m3", label: "Module 3: Operators" },
      ]}
      active={active}
      setActive={setActive}
      next={{ href: "/phase17/modules-4-6", label: "Modules 4–6" }}
    >
      {active === "m1" && (
        <>
          <h2 className="text-2xl font-bold text-violet-300">
            Module 1 — Phase 1: Fundamentals
          </h2>
          <Lesson title="Lesson 1: ObjectId, connection, casting">
            <QA
              level="Junior"
              q="What does this print?"
              code={`import mongoose from "mongoose";

const id = new mongoose.Types.ObjectId("507f1f77bcf86cd799439011");
console.log(id.getTimestamp());
console.log(String(id));
console.log(mongoose.isValidObjectId("507f1f77bcf86cd799439011"));
console.log(mongoose.isValidObjectId("not-an-id"));`}
              a={`A Date built from the first 4 bytes of the ObjectId (2012-10-17T...).
"507f1f77bcf86cd799439011"
true
false

isValidObjectId checks the shape (12-byte hex). It does not check that a document exists.`}
            />
            <QA
              level="Junior"
              q="The route receives id = 'xyz'. What happens?"
              code={`const user = await User.findById("xyz");
console.log(user);`}
              a={`Throws CastError: Cast to ObjectId failed for value "xyz".
The query never reaches MongoDB.

Fix:
if (!mongoose.isValidObjectId(id)) return null;
const user = await User.findById(id).lean();`}
            />
            <QA
              level="Junior"
              q="What is readyState in each log, in order?"
              code={`console.log(mongoose.connection.readyState);
await mongoose.connect(process.env.MONGODB_URI);
console.log(mongoose.connection.readyState);
await mongoose.disconnect();
console.log(mongoose.connection.readyState);`}
              a={`0  (disconnected)
1  (connected)
0  (disconnected)

Other values: 2 = connecting, 3 = disconnecting.`}
            />
            <QA
              level="Mid"
              q="What is stored, and what does the second query return?"
              code={`const userSchema = new mongoose.Schema({
  name: String,
  birthday: Date,
});
const User = mongoose.model("User", userSchema);

await User.create({ name: "Ada", birthday: "1815-12-10", nickname: "A" });
console.log(await User.findOne({ name: "Ada" }).lean());`}
              a={`Stored document has:
name: "Ada"
birthday: ISODate("1815-12-10T00:00:00.000Z")   // string was cast to Date
nickname is DROPPED because strict mode is true by default.

Output of findOne does not contain nickname.`}
            />
          </Lesson>
          <Lesson title="Lesson 2: null, missing fields, numbers">
            <QA
              level="Mid"
              q="Collection has {name:'A'}, {name:'B', phone:null}, {name:'C', phone:'99'}. What does each query return?"
              code={`const q1 = await User.find({ phone: null }).select("name").lean();
const q2 = await User.find({ phone: { $exists: false } }).select("name").lean();
const q3 = await User.find({ phone: { $exists: true } }).select("name").lean();`}
              a={`q1 names: A and B
   { phone: null } matches explicit null AND missing phone.

q2 names: A
   only the document where phone is absent.

q3 names: B and C
   null still counts as the field existing.`}
            />
            <QA
              level="Mid"
              q="What gets stored for price, and why is a later $gt query surprising?"
              code={`await Product.create({ sku: "A", price: 0.1 + 0.2 });
const doc = await Product.findOne({ sku: "A" }).lean();
console.log(doc.price);
console.log(await Product.findOne({ sku: "A", price: 0.3 }).lean());`}
              a={`doc.price prints 0.30000000000000004 (binary float).
The equality query returns null. 0.1 + 0.2 is not stored as 0.3.

Fix: use Decimal128.

price: mongoose.Types.Decimal128.fromString("0.30")`}
            />
            <QA
              level="Senior"
              q="What is the output, and which documents match the range?"
              code={`const from = mongoose.Types.ObjectId.createFromTime(
  Math.floor(new Date("2024-01-01").getTime() / 1000)
);
console.log(from.getTimestamp());

const users = await User.find({ _id: { $gte: from } }).select("_id").lean();`}
              a={`from.getTimestamp() is 2024-01-01T00:00:00.000Z.
The query returns users whose ObjectId was generated on or after that second.
It is not a createdAt query. Documents with a custom _id are not ordered by time.`}
            />
            <QA
              level="Senior"
              q="What does lean() change in the output?"
              code={`const a = await User.findById(id);
const b = await User.findById(id).lean();
console.log(a instanceof mongoose.Document);
console.log(b instanceof mongoose.Document);
console.log(typeof b.save);`}
              a={`true
false
"undefined"

a is a Mongoose document (getters, save, virtuals).
b is a plain object. b.save is not a function.`}
            />
          </Lesson>
        </>
      )}

      {active === "m2" && (
        <>
          <h2 className="text-2xl font-bold text-violet-300">
            Module 2 — Phase 2: CRUD output
          </h2>
          <Lesson title="Lesson 1: What update and find return">
            <QA
              level="Junior"
              q="Document is { _id, name:'Ada', role:'user' }. What is stored after this?"
              code={`await User.updateOne({ name: "Ada" }, { role: "admin" });
console.log(await User.findOne({ name: "Ada" }).lean());`}
              a={`{ _id, name: "Ada", role: "admin" }

Mongoose wraps a plain object in $set. Other fields stay.
This does NOT replace the document.

replaceOne would drop name:
await User.replaceOne({ name: "Ada" }, { role: "admin" });
// stored: { _id, role: "admin" }`}
            />
            <QA
              level="Junior"
              q="What is logged? The current name is Ada."
              code={`const doc = await User.findOneAndUpdate(
  { name: "Ada" },
  { $set: { name: "Grace" } }
);
console.log(doc.name);`}
              a={`"Ada"

findOneAndUpdate returns the original document unless you pass { new: true }.

Fix:
const doc = await User.findOneAndUpdate(
  { name: "Ada" },
  { $set: { name: "Grace" } },
  { new: true }
);
// doc.name === "Grace"`}
            />
            <QA
              level="Junior"
              q="What are matchedCount and modifiedCount?"
              code={`await User.updateOne({ email: "ada@example.com" }, { $set: { name: "Ada" } });
const again = await User.updateOne(
  { email: "ada@example.com" },
  { $set: { name: "Ada" } }
);
console.log(again.matchedCount, again.modifiedCount);`}
              a={`1 0

The document matched, but the value did not change, so modifiedCount is 0.
A missing email would log 0 0.`}
            />
            <QA
              level="Mid"
              q="No settings document exists. What does this return?"
              code={`const doc = await Settings.findOneAndUpdate(
  { userId },
  { $set: { theme: "dark" }, $setOnInsert: { userId } },
  { upsert: true }
);
console.log(doc);`}
              a={`null

Upsert inserted a document, but new is false, so there is no "before" document to return.

Fix: pass { upsert: true, new: true }.
Then the log is the inserted settings document.`}
            />
          </Lesson>
          <Lesson title="Lesson 2: Delete, insert, and races">
            <QA
              level="Junior"
              q="What is logged?"
              code={`const result = await User.deleteOne({ email: "missing@example.com" });
console.log(result.deletedCount);

const many = await Session.deleteMany({ expiresAt: { $lt: new Date() } });
console.log(many.deletedCount);`}
              a={`0
N   // how many expired sessions were removed. 0 if none.

deleteOne does not throw when nothing matches.`}
            />
            <QA
              level="Mid"
              q="emails must be unique. The second document duplicates ada@example.com. What is the result?"
              code={`await User.insertMany(
  [
    { name: "Ada", email: "ada@example.com" },
    { name: "Ada2", email: "ada@example.com" },
    { name: "Grace", email: "grace@example.com" },
  ],
  { ordered: true }
);`}
              a={`Throws MongoServerError, code 11000 (duplicate key).
Ada is inserted. Grace is NOT inserted, because ordered:true stops the batch.

With ordered:false, Grace is still inserted and the error lists the duplicate write.`}
            />
            <QA
              level="Mid"
              q="stock is 1. Two requests run this at the same time with qty = 1. What can be stored?"
              code={`const product = await Product.findOne({ sku: "A1" });
product.stock -= 1;
await product.save();`}
              a={`Both reads see stock 1. Both save stock 0. One unit is oversold.
Final stock is 0, not -1, and two orders succeed.

Fix — only one request modifies:
const updated = await Product.findOneAndUpdate(
  { sku: "A1", stock: { $gte: 1 } },
  { $inc: { stock: -1 } },
  { new: true }
);
// The loser gets updated === null.`}
            />
            <QA
              level="Senior"
              q="What does the filter match after the first page, if two new posts are inserted at the top?"
              code={`const page1 = await Post.find().sort({ createdAt: -1 }).skip(0).limit(2);
const page2 = await Post.find().sort({ createdAt: -1 }).skip(2).limit(2);`}
              a={`If new posts are inserted between the two calls, page2 shifts.
A post from page1 can appear again, or a post can be skipped.

Stable output uses a cursor:
Post.find({ createdAt: { $lt: lastSeen } }).sort({ createdAt: -1 }).limit(2)`}
            />
            <QA
              level="Mid"
              q="What is logged? User.find is not awaited."
              code={`const result = User.find({ status: "active" });
console.log(Array.isArray(result));
console.log(result.constructor.name);`}
              a={`false
"Query"

You logged the query builder, not the users.
await User.find(...) returns an array.
User.find(...).lean() is still a Query until awaited.`}
            />
          </Lesson>
        </>
      )}

      {active === "m3" && (
        <>
          <h2 className="text-2xl font-bold text-violet-300">
            Module 3 — Phase 3: Which documents match?
          </h2>
          <Lesson title="Lesson 1: Comparison and logical output">
            <QA
              level="Junior"
              q="Docs: ages 17, 18, 21. What names match?"
              code={`await User.find({
  age: { $gte: 18 },
  role: { $in: ["user", "editor"] },
  status: { $ne: "banned" },
}).select("name");`}
              a={`Depends on the other fields, but age 17 is always excluded.
age 18 and 21 are included only when role is user or editor AND status is not banned.

$gte is inclusive. $ne does not match the value "banned".`}
            />
            <QA
              level="Junior"
              q="Docs: {city:'Pune', vip:false}, {city:'Delhi', vip:true}, {city:'Pune', vip:true}. What matches?"
              code={`await User.find({
  $or: [{ city: "Pune" }, { vip: true }],
});`}
              a={`All three.
The first is Pune, the second is vip, the third matches both.
$or is union, not exclusive.`}
            />
            <QA
              level="Mid"
              q="What is wrong with the output of this price filter?"
              code={`await Product.find({
  price: { $gt: 100 },
  price: { $lt: 500 },
});`}
              a={`In a JavaScript object the second price key overwrites the first.
The query sent is { price: { $lt: 500 } }. The $gt: 100 condition is gone.

Right:
await Product.find({ price: { $gt: 100, $lt: 500 } });`}
            />
          </Lesson>
          <Lesson title="Lesson 2: Arrays — predict the match">
            <QA
              level="Mid"
              q="Which names match each query?"
              code={`// A: scores: [ { s: 90, pass: false }, { s: 10, pass: true } ]
// B: scores: [ { s: 90, pass: true } ]

const loose = await Student.find({
  "scores.s": { $gte: 80 },
  "scores.pass": true,
}).select("name");

const strict = await Student.find({
  scores: { $elemMatch: { s: { $gte: 80 }, pass: true } },
}).select("name");`}
              a={`loose: A and B
  90 and pass:true can come from different elements. A matches.

strict: B only
  One element must have both s >= 80 and pass true.`}
            />
            <QA
              level="Junior"
              q="tags are ['mongo','node'], ['mongo','mongoose','node'], ['node']. What matches?"
              code={`const all = await Post.find({ tags: { $all: ["mongo", "node"] } });
const size = await Post.find({ tags: { $size: 3 } });
const has = await Post.find({ tags: "mongo" });`}
              a={`all: first and second (both values present, order does not matter)
size: only the second (length exactly 3)
has: first and second

$size cannot express "more than 3".`}
            />
            <QA
              level="Senior"
              q="What does slice return?"
              code={`// comments: ["c1","c2","c3","c4","c5","c6"]
const first = await Post.findById(id).slice("comments", 2).lean();
const last = await Post.findById(id).slice("comments", -2).lean();
console.log(first.comments, last.comments);`}
              a={`["c1","c2"]
["c5","c6"]

The stored array is unchanged. slice only limits the returned array.`}
            />
          </Lesson>
          <Lesson title="Lesson 3: $expr, regex, null">
            <QA
              level="Mid"
              q="Docs: {spent:50, budget:40} and {spent:10, budget:40}. What matches?"
              code={`await Order.find({ spent: { $gt: "budget" } });
await Order.find({ $expr: { $gt: ["$spent", "$budget"] } });`}
              a={`First query compares spent to the string "budget", not the field. Usually matches nothing.

Second query returns only {spent:50, budget:40}.`}
            />
            <QA
              level="Mid"
              q="Names: Jo, john, Johnny, Ajay. What matches?"
              code={`await User.find({ name: { $regex: "^jo", $options: "i" } });
await User.find({ name: { $regex: "jo", $options: "i" } });`}
              a={`First: Jo, john, Johnny. Ajay is excluded. ^ anchors the start.
Second: Jo, john, Johnny, and Ajay (jo appears inside Ajay? A-j-a-y has no "jo").
Ajay does not match either. "john" matches both because of the i flag.

Second regex cannot use a normal index efficiently if it is unanchored.`}
            />
            <QA
              level="Senior"
              q="What does $not do here?"
              code={`await User.find({ age: { $not: { $gte: 18 } } });`}
              a={`Returns documents whose age is less than 18, AND documents where age is missing or not a number.
$not matches anything that fails the inner operator, including missing fields.

{ age: { $lt: 18 } } does not include missing ages.`}
            />
          </Lesson>
        </>
      )}
    </OutputPage>
  );
}
