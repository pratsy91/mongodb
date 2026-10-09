"use client";

import { useState } from "react";
import { Lesson, QA, QueryPage } from "../ui";

export default function Modules4to6() {
  const [active, setActive] = useState("m4");

  return (
    <QueryPage
      title="Query Interviews — Modules 4–6"
      subtitle="Most-asked Mongoose query problems for aggregation, indexes, and the Mongoose query API."
      tabs={[
        { id: "m4", label: "Module 4: Aggregation" },
        { id: "m5", label: "Module 5: Indexes" },
        { id: "m6", label: "Module 6: Mongoose API" },
      ]}
      active={active}
      setActive={setActive}
      prev={{ href: "/phase16/modules-1-3", label: "Modules 1–3" }}
      next={{ href: "/phase16/modules-7-9", label: "Modules 7–9" }}
    >
      {active === "m4" && (
        <>
          <h2 className="text-2xl font-bold text-sky-300">
            Module 4 — Phase 4: Aggregation queries
          </h2>

          <Lesson title="Lesson 1: Match, group, project">
            <QA
              level="Junior"
              q="Count users per role and sort by the count descending."
              a={`const rows = await User.aggregate([
  { $group: { _id: "$role", count: { $sum: 1 } } },
  { $sort: { count: -1 } },
]);`}
            />
            <QA
              level="Junior"
              q="Total revenue of paid orders in the last 30 days."
              a={`const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

const [row] = await Order.aggregate([
  { $match: { status: "paid", createdAt: { $gte: since } } },
  { $group: { _id: null, revenue: { $sum: "$amount" }, orders: { $sum: 1 } } },
]);`}
            />
            <QA
              level="Mid"
              q="Top 5 products by revenue. Line items are an embedded items array."
              a={`const top = await Order.aggregate([
  { $match: { status: "paid" } },
  { $unwind: "$items" },
  {
    $group: {
      _id: "$items.productId",
      revenue: { $sum: { $multiply: ["$items.qty", "$items.price"] } },
      units: { $sum: "$items.qty" },
    },
  },
  { $sort: { revenue: -1 } },
  { $limit: 5 },
]);`}
            />
            <QA
              level="Mid"
              q="Add a computed field fullName and drop the password before returning users."
              a={`const users = await User.aggregate([
  { $match: { status: "active" } },
  {
    $addFields: {
      fullName: { $concat: ["$firstName", " ", "$lastName"] },
    },
  },
  { $project: { password: 0 } },
]);`}
            />
          </Lesson>

          <Lesson title="Lesson 2: Joins, facets, and dates">
            <QA
              level="Mid"
              q="Left-join orders onto customers and keep only paid orders in the join."
              a={`const customers = await Customer.aggregate([
  { $match: { country: "IN" } },
  {
    $lookup: {
      from: "orders",
      let: { cid: "$_id" },
      pipeline: [
        {
          $match: {
            $expr: { $eq: ["$customerId", "$$cid"] },
            status: "paid",
          },
        },
        { $project: { amount: 1, createdAt: 1 } },
      ],
      as: "orders",
    },
  },
]);`}
            />
            <QA
              level="Mid"
              q="One request should return both the page of products and the total count."
              a={`const page = 2;
const limit = 20;

const [result] = await Product.aggregate([
  { $match: { status: "active" } },
  {
    $facet: {
      data: [
        { $sort: { createdAt: -1 } },
        { $skip: (page - 1) * limit },
        { $limit: limit },
      ],
      meta: [{ $count: "total" }],
    },
  },
]);`}
            />
            <QA
              level="Mid"
              q="Group signups by day."
              a={`const series = await User.aggregate([
  {
    $group: {
      _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
      signups: { $sum: 1 },
    },
  },
  { $sort: { _id: 1 } },
]);`}
            />
            <QA
              level="Senior"
              q="Top 3 products inside each category."
              a={`const rows = await Product.aggregate([
  { $sort: { category: 1, sold: -1 } },
  {
    $group: {
      _id: "$category",
      products: {
        $topN: { n: 3, sortBy: { sold: -1 }, output: { name: "$name", sold: "$sold" } },
      },
    },
  },
]);`}
            />
            <QA
              level="Senior"
              q="Walk a manager tree and return everyone under a given manager."
              a={`const tree = await Employee.aggregate([
  { $match: { _id: managerId } },
  {
    $graphLookup: {
      from: "employees",
      startWith: "$_id",
      connectFromField: "_id",
      connectToField: "managerId",
      as: "reports",
      maxDepth: 5,
    },
  },
]);`}
            />
            <QA
              level="Senior"
              q="Rebuild a reporting collection from an aggregation. Say when $merge is the better write."
              a={`await Order.aggregate([
  { $match: { status: "paid" } },
  { $group: { _id: "$customerId", revenue: { $sum: "$amount" } } },
  { $out: "customerRevenue" },
]);

// $merge upserts into an existing collection instead of replacing it:
await Order.aggregate([
  { $group: { _id: "$customerId", revenue: { $sum: "$amount" } } },
  {
    $merge: {
      into: "customerRevenue",
      on: "_id",
      whenMatched: "replace",
      whenNotMatched: "insert",
    },
  },
]);`}
            />
          </Lesson>
        </>
      )}

      {active === "m5" && (
        <>
          <h2 className="text-2xl font-bold text-sky-300">
            Module 5 — Phase 5: Index-aware queries
          </h2>

          <Lesson title="Lesson 1: Declare the index, then query it">
            <QA
              level="Junior"
              q="Unique email lookup. Show the schema index and the query."
              a={`userSchema.index({ email: 1 }, { unique: true });

const user = await User.findOne({ email: "ada@example.com" })
  .select("name email")
  .lean();`}
            />
            <QA
              level="Junior"
              q="Equality + sort query. Put equality before the sort in the compound index (ESR)."
              a={`orderSchema.index({ status: 1, createdAt: -1 });

const orders = await Order.find({ status: "paid" })
  .sort({ createdAt: -1 })
  .limit(20)
  .lean();`}
            />
            <QA
              level="Mid"
              q="Range on price after equality on category. Index order is category, then price."
              a={`productSchema.index({ category: 1, price: 1 });

const products = await Product.find({
  category: "books",
  price: { $gte: 100, $lte: 500 },
})
  .sort({ price: 1 })
  .lean();`}
            />
            <QA
              level="Mid"
              q="Partial index: only index active users, and write the query that can use it."
              a={`userSchema.index(
  { email: 1 },
  { partialFilterExpression: { status: "active" } }
);

const user = await User.findOne({
  status: "active",
  email: "ada@example.com",
}).lean();`}
            />
            <QA
              level="Mid"
              q="TTL: sessions should disappear 1 hour after expiresAt."
              a={`sessionSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

await Session.create({
  userId,
  expiresAt: new Date(Date.now() + 60 * 60 * 1000),
});

const live = await Session.findOne({
  userId,
  expiresAt: { $gt: new Date() },
}).lean();`}
            />
          </Lesson>

          <Lesson title="Lesson 2: Explain, hint, covered queries">
            <QA
              level="Mid"
              q="Prove a query uses an index. What do you look for?"
              a={`const plan = await User.find({ email: "ada@example.com" }).explain(
  "executionStats"
);

// Look at:
// plan.executionStats.executionTimeMillis
// winningPlan input stage IXSCAN vs COLLSCAN
// totalDocsExamined vs nReturned`}
            />
            <QA
              level="Mid"
              q="Force a specific index when the planner picks the wrong one."
              a={`const users = await User.find({ status: "active" })
  .sort({ createdAt: -1 })
  .hint({ status: 1, createdAt: -1 })
  .lean();`}
            />
            <QA
              level="Senior"
              q="Write a covered query: answer it from the index only."
              a={`userSchema.index({ status: 1, email: 1 });

const rows = await User.find({ status: "active" })
  .select("email -_id")
  .lean();

// explain should show no document fetch when email and status are both in the index
// and _id is excluded.`}
            />
            <QA
              level="Senior"
              q="Multikey index on tags. Which query uses it, and which compound shape is illegal?"
              a={`postSchema.index({ tags: 1, createdAt: -1 });

const posts = await Post.find({ tags: "mongodb" })
  .sort({ createdAt: -1 })
  .limit(20)
  .lean();

// Illegal: two array fields in one compound index
// postSchema.index({ tags: 1, comments: 1 });`}
            />
            <QA
              level="Senior"
              q="Case-insensitive unique username. The query collation must match the index collation."
              a={`userSchema.index(
  { username: 1 },
  { unique: true, collation: { locale: "en", strength: 2 } }
);

const user = await User.findOne({ username: "Ada" }).collation({
  locale: "en",
  strength: 2,
});`}
            />
          </Lesson>
        </>
      )}

      {active === "m6" && (
        <>
          <h2 className="text-2xl font-bold text-sky-300">
            Module 6 — Phase 6: Mongoose query API
          </h2>

          <Lesson title="Lesson 1: Populate">
            <QA
              level="Junior"
              q="Load a user with their posts."
              a={`const user = await User.findById(id).populate("posts").lean();`}
            />
            <QA
              level="Mid"
              q="Populate only published posts, newest 5, title only."
              a={`const user = await User.findById(id).populate({
  path: "posts",
  match: { published: true },
  select: "title createdAt",
  options: { sort: { createdAt: -1 }, limit: 5 },
});`}
            />
            <QA
              level="Mid"
              q="Nested populate: post author, and each comment's user."
              a={`const post = await Post.findById(id)
  .populate("author", "name email")
  .populate({
    path: "comments",
    populate: { path: "user", select: "name" },
  });`}
            />
            <QA
              level="Senior"
              q="Virtual populate: comments are stored with postId, not an array on Post."
              a={`postSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "postId",
});

const post = await Post.findById(id).populate("comments");`}
            />
            <QA
              level="Senior"
              q="When is populate the wrong answer?"
              a={`// populate issues extra queries. If you always need the join and a shaped result,
// one aggregation $lookup is usually faster:

const rows = await User.aggregate([
  { $match: { _id: userId } },
  {
    $lookup: {
      from: "posts",
      localField: "_id",
      foreignField: "authorId",
      as: "posts",
    },
  },
]);`}
            />
          </Lesson>

          <Lesson title="Lesson 2: lean, chain, hooks, discriminators">
            <QA
              level="Junior"
              q="Read-only API response. Skip Mongoose document overhead."
              a={`const users = await User.find({ status: "active" })
  .select("name email")
  .lean();`}
            />
            <QA
              level="Mid"
              q="Build the same filter with the query builder."
              a={`const users = await User.find()
  .where("age")
  .gte(18)
  .lte(65)
  .where("role")
  .in(["user", "editor"])
  .where("status")
  .equals("active")
  .sort("-createdAt")
  .limit(20)
  .lean();`}
            />
            <QA
              level="Mid"
              q="Interview trap: pre('save') did not run. Rewrite the update so validation runs."
              a={`// updateOne does not run document save hooks.
const user = await User.findOneAndUpdate(
  { _id: id },
  { $set: { email } },
  { new: true, runValidators: true }
);

// Hooks for this path are query middleware:
userSchema.pre("findOneAndUpdate", function () {
  this.setOptions({ runValidators: true });
});`}
            />
            <QA
              level="Mid"
              q="Query helper used by the team: onlyActive()."
              a={`userSchema.query.onlyActive = function () {
  return this.where({ status: "active", deletedAt: null });
};

const users = await User.find().onlyActive().select("name").lean();`}
            />
            <QA
              level="Senior"
              q="Discriminator query: list only PremiumUser documents from a shared collection."
              a={`const User = mongoose.model("User", userSchema);
const PremiumUser = User.discriminator(
  "premium",
  new mongoose.Schema({ plan: String })
);

const premiums = await PremiumUser.find({ plan: "pro" }).lean();`}
            />
            <QA
              level="Senior"
              q="Attach a transaction session to a query and an update."
              a={`const session = await mongoose.startSession();
session.startTransaction();
try {
  const account = await Account.findOne({ _id: fromId }).session(session);
  await Account.updateOne(
    { _id: fromId, balance: { $gte: amount } },
    { $inc: { balance: -amount } },
    { session }
  );
  await session.commitTransaction();
} catch (err) {
  await session.abortTransaction();
  throw err;
} finally {
  session.endSession();
}`}
            />
            <QA
              level="Senior"
              q="Map CastError and ValidationError from a bad query/update into API responses."
              a={`try {
  await User.findByIdAndUpdate(id, { $set: body }, { runValidators: true });
} catch (err) {
  if (err.name === "CastError") {
    // invalid ObjectId -> 400
  }
  if (err.name === "ValidationError") {
    // err.errors is a map of path -> message -> 400
  }
  if (err.code === 11000) {
    // duplicate key -> 409
  }
  throw err;
}`}
            />
          </Lesson>
        </>
      )}
    </QueryPage>
  );
}
