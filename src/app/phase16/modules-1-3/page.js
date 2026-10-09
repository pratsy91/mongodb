"use client";

import { useState } from "react";
import { Lesson, QA, QueryPage } from "../ui";

export default function Modules1to3() {
  const [active, setActive] = useState("m1");

  return (
    <QueryPage
      title="Query Interviews — Modules 1–3"
      subtitle="Most-asked Mongoose query problems for fundamentals, CRUD, and query operators."
      tabs={[
        { id: "m1", label: "Module 1: Fundamentals" },
        { id: "m2", label: "Module 2: CRUD" },
        { id: "m3", label: "Module 3: Operators" },
      ]}
      active={active}
      setActive={setActive}
      next={{ href: "/phase16/modules-4-6", label: "Modules 4–6" }}
    >
      {active === "m1" && (
        <>
          <h2 className="text-2xl font-bold text-sky-300">
            Module 1 — Phase 1: Fundamentals
          </h2>

          <Lesson title="Lesson 1: Connection and identity">
            <QA
              level="Junior"
              q="Connect once at startup and reuse the connection. Do not open a client per request."
              a={`import mongoose from "mongoose";

export async function connectDB() {
  if (mongoose.connection.readyState === 1) return mongoose.connection;

  await mongoose.connect(process.env.MONGODB_URI, {
    maxPoolSize: 20,
    serverSelectionTimeoutMS: 5000,
    retryWrites: true,
    w: "majority",
  });

  return mongoose.connection;
}`}
            />
            <QA
              level="Junior"
              q="Find a user by _id. Guard against an invalid id so Mongoose does not throw CastError."
              a={`import mongoose from "mongoose";

async function findUser(id) {
  if (!mongoose.isValidObjectId(id)) return null;
  return User.findById(id).select("name email role").lean();
}`}
            />
            <QA
              level="Junior"
              q="Check whether an email is already taken without loading the document."
              a={`const exists = await User.exists({ email: "ada@example.com" });
// { _id: ... } or null

if (exists) throw new Error("Email already registered");`}
            />
            <QA
              level="Mid"
              q="Query a sibling database from the same Mongoose connection (multi-db app)."
              a={`const analytics = mongoose.connection.useDb("analytics");
const Event = analytics.model("Event", eventSchema);

const recent = await Event.find({ type: "signup" })
  .sort({ createdAt: -1 })
  .limit(50)
  .lean();`}
            />
          </Lesson>

          <Lesson title="Lesson 2: Types, dates, and nested fields">
            <QA
              level="Junior"
              q="Find orders created in the last 7 days. Store dates as Date, not strings."
              a={`const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

const orders = await Order.find({
  createdAt: { $gte: since },
})
  .sort({ createdAt: -1 })
  .lean();`}
            />
            <QA
              level="Junior"
              q="Find users who live in a nested city field."
              a={`const users = await User.find({ "address.city": "Pune" })
  .select("name address.city")
  .lean();`}
            />
            <QA
              level="Mid"
              q="Case-insensitive exact email lookup using collation, not a regex scan."
              a={`const user = await User.findOne({ email: "Ada@Example.com" })
  .collation({ locale: "en", strength: 2 })
  .lean();

// Pair this with a unique index that uses the same collation:
// userSchema.index({ email: 1 }, { unique: true, collation: { locale: "en", strength: 2 } });`}
            />
            <QA
              level="Mid"
              q="Find products whose price is missing, versus products whose price is explicitly null."
              a={`const missing = await Product.find({ price: { $exists: false } }).lean();

const explicitNull = await Product.find({
  price: null,
  $and: [{ price: { $exists: true } }],
}).lean();`}
            />
            <QA
              level="Mid"
              q="Store and query money with Decimal128, not JavaScript floats."
              a={`import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  sku: String,
  price: { type: mongoose.Schema.Types.Decimal128, required: true },
});

await Product.create({
  sku: "A1",
  price: mongoose.Types.Decimal128.fromString("19.99"),
});

const priced = await Product.find({
  price: { $gte: mongoose.Types.Decimal128.fromString("10.00") },
}).lean();`}
            />
            <QA
              level="Senior"
              q="Read the creation time out of an ObjectId without a separate createdAt field."
              a={`const user = await User.findById(id).lean();
const createdAt = user._id.getTimestamp();

// Query by id range for a time window (ObjectIds sort by time):
const from = mongoose.Types.ObjectId.createFromTime(
  Math.floor(startDate.getTime() / 1000)
);
const docs = await User.find({ _id: { $gte: from } }).lean();`}
            />
            <QA
              level="Senior"
              q="A document is near the 16MB limit. How do you query it without pulling the huge array?"
              a={`const order = await Order.findById(id)
  .select("customerId total status")
  .slice("items", 20)
  .lean();

// If the array is unbounded, do not embed it.
// Keep OrderItem as its own model and query:
const items = await OrderItem.find({ orderId: id }).limit(20).lean();`}
            />
          </Lesson>
        </>
      )}

      {active === "m2" && (
        <>
          <h2 className="text-2xl font-bold text-sky-300">
            Module 2 — Phase 2: CRUD queries
          </h2>

          <Lesson title="Lesson 1: Insert and read">
            <QA
              level="Junior"
              q="Insert one user and many users. Continue the batch if one document fails."
              a={`const user = await User.create({
  name: "Ada",
  email: "ada@example.com",
});

const result = await User.insertMany(
  [
    { name: "Grace", email: "grace@example.com" },
    { name: "Lin", email: "lin@example.com" },
  ],
  { ordered: false }
);`}
            />
            <QA
              level="Junior"
              q="List active users, newest first, page size 10, only name and email."
              a={`const page = 1;
const users = await User.find({ status: "active" })
  .select("name email")
  .sort({ createdAt: -1 })
  .skip((page - 1) * 10)
  .limit(10)
  .lean();`}
            />
            <QA
              level="Junior"
              q="Find one user by email or return a 404-style error."
              a={`const user = await User.findOne({ email }).orFail(
  new Error("User not found")
);`}
            />
            <QA
              level="Mid"
              q="Count active users accurately, and separately get a fast approximate total."
              a={`const active = await User.countDocuments({ status: "active" });
const approxTotal = await User.estimatedDocumentCount();`}
            />
          </Lesson>

          <Lesson title="Lesson 2: Update and delete">
            <QA
              level="Junior"
              q="Set a user's name and increment loginCount atomically. Return the updated document."
              a={`const user = await User.findOneAndUpdate(
  { email: "ada@example.com" },
  { $set: { name: "Ada Lovelace" }, $inc: { loginCount: 1 } },
  { new: true, runValidators: true }
).lean();`}
            />
            <QA
              level="Junior"
              q="Create the settings document if it does not exist (upsert)."
              a={`const settings = await Settings.findOneAndUpdate(
  { userId },
  {
    $set: { theme: "dark" },
    $setOnInsert: { userId, createdAt: new Date() },
  },
  { upsert: true, new: true, setDefaultsOnInsert: true }
);`}
            />
            <QA
              level="Mid"
              q="Decrement stock only if enough units remain. Detect a failed race."
              a={`const qty = 2;
const updated = await Product.findOneAndUpdate(
  { sku: "A1", stock: { $gte: qty } },
  { $inc: { stock: -qty } },
  { new: true }
);

if (!updated) {
  throw new Error("Insufficient stock");
}`}
            />
            <QA
              level="Mid"
              q="Soft-delete a user and make every normal query ignore deleted users."
              a={`await User.updateOne(
  { _id: id },
  { $set: { deletedAt: new Date() } }
);

userSchema.pre(/^find/, function () {
  this.where({ deletedAt: null });
});

const visible = await User.find({ status: "active" }).lean();`}
            />
            <QA
              level="Mid"
              q="Delete one order by id and delete every expired cart."
              a={`await Order.findByIdAndDelete(orderId);

await Cart.deleteMany({
  expiresAt: { $lt: new Date() },
});`}
            />
            <QA
              level="Senior"
              q="Update one matching item inside an items array by sku."
              a={`await Order.updateOne(
  { _id: orderId },
  { $set: { "items.$[item].qty": 3, "items.$[item].updatedAt": new Date() } },
  { arrayFilters: [{ "item.sku": "A1" }] }
);`}
            />
          </Lesson>

          <Lesson title="Lesson 3: Pagination, bulk, and replace">
            <QA
              level="Mid"
              q="Paginate a large feed without skip(). Use the last seen createdAt and _id."
              a={`const filter = cursor
  ? {
      $or: [
        { createdAt: { $lt: cursor.createdAt } },
        { createdAt: cursor.createdAt, _id: { $lt: cursor._id } },
      ],
    }
  : {};

const posts = await Post.find(filter)
  .sort({ createdAt: -1, _id: -1 })
  .limit(20)
  .lean();

const nextCursor = posts.at(-1)
  ? { createdAt: posts.at(-1).createdAt, _id: posts.at(-1)._id }
  : null;`}
            />
            <QA
              level="Mid"
              q="Apply inserts, updates, and deletes in one round trip."
              a={`await User.bulkWrite(
  [
    { insertOne: { document: { name: "New", email: "new@example.com" } } },
    {
      updateOne: {
        filter: { email: "ada@example.com" },
        update: { $set: { status: "active" } },
      },
    },
    { deleteOne: { filter: { email: "old@example.com" } } },
  ],
  { ordered: false }
);`}
            />
            <QA
              level="Senior"
              q="Replace a whole document except _id, versus a partial $set update."
              a={`await User.replaceOne(
  { _id: userId },
  { name: "Ada", email: "ada@example.com", role: "admin" }
);

await User.updateOne(
  { _id: userId },
  { $set: { role: "admin" } }
);`}
            />
            <QA
              level="Senior"
              q="Stream a huge result set instead of toArray()."
              a={`const cursor = User.find({ status: "active" })
  .select("email")
  .lean()
  .cursor();

for await (const user of cursor) {
  await sendDigest(user.email);
}`}
            />
          </Lesson>
        </>
      )}

      {active === "m3" && (
        <>
          <h2 className="text-2xl font-bold text-sky-300">
            Module 3 — Phase 3: Query operators
          </h2>

          <Lesson title="Lesson 1: Comparison and logical">
            <QA
              level="Junior"
              q="Find products priced from 100 to 500, in stock, status active or featured."
              a={`const products = await Product.find({
  price: { $gte: 100, $lte: 500 },
  stock: { $gt: 0 },
  status: { $in: ["active", "featured"] },
}).lean();`}
            />
            <QA
              level="Junior"
              q="Find users who are admins OR verified, and not banned."
              a={`const users = await User.find({
  $or: [{ role: "admin" }, { verified: true }],
  status: { $ne: "banned" },
}).lean();`}
            />
            <QA
              level="Mid"
              q="Same field needs two conditions that cannot be combined. Show $and."
              a={`const docs = await Review.find({
  $and: [
    { score: { $gte: 4 } },
    { score: { $ne: 5 } },
    { $or: [{ featured: true }, { helpful: { $gte: 10 } }] },
  ],
}).lean();`}
            />
            <QA
              level="Mid"
              q="Prefer $in over a long $or of equalities on one field."
              a={`const orders = await Order.find({
  status: { $in: ["paid", "shipped", "delivered"] },
}).lean();`}
            />
          </Lesson>

          <Lesson title="Lesson 2: Arrays — the question everyone gets">
            <QA
              level="Mid"
              q="Find students who have at least one result with score >= 80 AND pass: true on the SAME element."
              a={`const students = await Student.find({
  results: {
    $elemMatch: { score: { $gte: 80 }, pass: true },
  },
}).lean();

// Wrong: these can match different array elements
// { "results.score": { $gte: 80 }, "results.pass": true }`}
            />
            <QA
              level="Junior"
              q="Find posts tagged with both mongodb and mongoose, and posts with exactly 3 tags."
              a={`const both = await Post.find({
  tags: { $all: ["mongodb", "mongoose"] },
}).lean();

const exact = await Post.find({
  tags: { $size: 3 },
}).lean();`}
            />
            <QA
              level="Mid"
              q="$size cannot do a range. Find posts with more than 3 tags."
              a={`postSchema.add({ tagCount: { type: Number, default: 0 } });

const posts = await Post.find({ tagCount: { $gt: 3 } }).lean();

// Keep tagCount in sync:
// { $push: { tags: "new" }, $inc: { tagCount: 1 } }`}
            />
            <QA
              level="Senior"
              q="Return a user but only the first 5 comments, not the whole array."
              a={`const user = await User.findById(id).slice("comments", 5).lean();

// Last 5:
const latest = await User.findById(id).slice("comments", -5).lean();`}
            />
          </Lesson>

          <Lesson title="Lesson 3: Evaluation, text, and geo">
            <QA
              level="Junior"
              q="Prefix search for names starting with 'jo', case-insensitive, in a way an index can help."
              a={`const users = await User.find({
  name: { $regex: "^jo", $options: "i" },
}).lean();

// Leading wildcard /.*jo/ cannot use a normal index. Avoid it on large collections.`}
            />
            <QA
              level="Mid"
              q="Find orders where amountSpent is greater than budget (two fields on the same document)."
              a={`const orders = await Order.find({
  $expr: { $gt: ["$amountSpent", "$budget"] },
}).lean();`}
            />
            <QA
              level="Mid"
              q="Full-text search articles for 'mongodb indexes' and sort by relevance."
              a={`articleSchema.index({ title: "text", body: "text" });

const articles = await Article.find(
  { $text: { $search: "mongodb indexes" } },
  { score: { $meta: "textScore" } }
)
  .sort({ score: { $meta: "textScore" } })
  .lean();`}
            />
            <QA
              level="Mid"
              q="Find places within 5km of a point. Coordinates are [lng, lat]."
              a={`placeSchema.index({ location: "2dsphere" });

const places = await Place.find({
  location: {
    $near: {
      $geometry: { type: "Point", coordinates: [73.8567, 18.5204] },
      $maxDistance: 5000,
    },
  },
}).lean();`}
            />
            <QA
              level="Senior"
              q="Find places inside a polygon, which is safer to combine with other filters than $near."
              a={`const places = await Place.find({
  status: "open",
  location: {
    $geoWithin: {
      $geometry: {
        type: "Polygon",
        coordinates: [[
          [73.80, 18.48],
          [73.90, 18.48],
          [73.90, 18.56],
          [73.80, 18.56],
          [73.80, 18.48],
        ]],
      },
    },
  },
}).lean();`}
            />
            <QA
              level="Senior"
              q="Match a numeric flags field where specific bits are all set."
              a={`const docs = await Feature.find({
  flags: { $bitsAllSet: [1, 3] },
}).lean();`}
            />
          </Lesson>
        </>
      )}
    </QueryPage>
  );
}
