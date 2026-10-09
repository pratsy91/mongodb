"use client";

import { useState } from "react";
import { Lesson, QA, QueryPage } from "../ui";

export default function Modules10to12() {
  const [active, setActive] = useState("m10");

  return (
    <QueryPage
      title="Query Interviews — Modules 10–12"
      subtitle="Most-asked Mongoose query problems for security, performance, and operator cookbook questions."
      tabs={[
        { id: "m10", label: "Module 10: Security" },
        { id: "m11", label: "Module 11: Performance" },
        { id: "m12", label: "Module 12: Operators" },
      ]}
      active={active}
      setActive={setActive}
      prev={{ href: "/phase16/modules-7-9", label: "Modules 7–9" }}
    >
      {active === "m10" && (
        <>
          <h2 className="text-2xl font-bold text-sky-300">
            Module 10 — Phase 10: Secure queries
          </h2>

          <Lesson title="Lesson 1: Injection and tenancy">
            <QA
              level="Junior"
              q="Login lookup. Never pass req.body straight into find()."
              a={`const email = String(req.body.email || "").toLowerCase();
const user = await User.findOne({ email }).select("+password");

// Attack if you do User.find(req.body):
// { email: { $gt: "" }, password: { $gt: "" } }`}
            />
            <QA
              level="Mid"
              q="Allow a status filter from the query string without allowing operators."
              a={`const allowed = ["active", "invited", "disabled"];
const status = allowed.includes(req.query.status)
  ? req.query.status
  : "active";

const users = await User.find({ accountId, status })
  .select("name email status")
  .lean();`}
            />
            <QA
              level="Mid"
              q="Every query in a multi-tenant app must include the tenant id."
              a={`function tenantQuery(tenantId, filter) {
  return { ...filter, tenantId };
}

const orders = await Order.find(
  tenantQuery(req.user.tenantId, { status: "paid" })
).lean();

await Order.updateOne(
  tenantQuery(req.user.tenantId, { _id: orderId }),
  { $set: { status: "shipped" } }
);`}
            />
            <QA
              level="Junior"
              q="Never return password or reset tokens from a profile query."
              a={`userSchema.add({
  password: { type: String, select: false },
  resetToken: { type: String, select: false },
});

const me = await User.findById(req.user.id).lean();

// Explicitly opt in only on the login path:
const login = await User.findOne({ email }).select("+password");`}
            />
          </Lesson>

          <Lesson title="Lesson 2: Roles, projection, and field encryption">
            <QA
              level="Mid"
              q="Support users can read tickets but not internal notes."
              a={`const projection =
  req.user.role === "agent"
    ? "title body status internalNotes"
    : "title body status";

const ticket = await Ticket.findOne({
  _id: ticketId,
  $or: [{ customerId: req.user.id }, { assigneeId: req.user.id }],
})
  .select(projection)
  .lean();`}
            />
            <QA
              level="Senior"
              q="Search users without exposing the raw filter object from the client."
              a={`const q = String(req.query.q || "").slice(0, 40);
const filter = {
  tenantId: req.user.tenantId,
  name: { $regex: "^" + q.replace(/[.*+?^\${}()|[\\]\\\\]/g, "\\\\$&"), $options: "i" },
};

const users = await User.find(filter).select("name email").limit(20).lean();`}
            />
            <QA
              level="Senior"
              q="Query a field encrypted with client-side field level encryption."
              a={`MongoDB fallback for setup — CSFLE is driver-level, not a Mongoose schema option.

Equality queries work only when the field uses deterministic encryption:

const user = await User.findOne({ ssn: "123-45-6789" }).lean();

// Random encryption cannot be queried.
// The encryption schema and master key live in the MongoClient autoEncryption options,
// which you pass when creating the underlying client. Mongoose then uses that connection.`}
            />
            <QA
              level="Mid"
              q="Audit-sensitive read: record who exported customers."
              a={`const customers = await Customer.find({ tenantId })
  .select("name email")
  .comment("export by " + req.user.id)
  .lean();

await AuditLog.create({
  actorId: req.user.id,
  action: "customer.export",
  count: customers.length,
  at: new Date(),
});`}
            />
          </Lesson>
        </>
      )}

      {active === "m11" && (
        <>
          <h2 className="text-2xl font-bold text-sky-300">
            Module 11 — Phase 11: Performance query patterns
          </h2>

          <Lesson title="Lesson 1: Make the query cheap">
            <QA
              level="Junior"
              q="Rewrite a slow list endpoint. It currently loads full documents and uses a large skip."
              a={`const posts = await Post.find(
  cursor ? { published: true, _id: { $lt: cursor } } : { published: true }
)
  .select("title slug createdAt")
  .sort({ _id: -1 })
  .limit(20)
  .lean();`}
            />
            <QA
              level="Mid"
              q="The profiler shows COLLSCAN on { status, createdAt }. Fix the query and the index together."
              a={`orderSchema.index({ status: 1, createdAt: -1 });

const orders = await Order.find({ status: "paid" })
  .sort({ createdAt: -1 })
  .limit(50)
  .select("total createdAt")
  .lean();

const plan = await Order.find({ status: "paid" })
  .sort({ createdAt: -1 })
  .explain("executionStats");`}
            />
            <QA
              level="Mid"
              q="A search box uses /.*term.*/ and times out. Give an index-friendly alternative."
              a={`// Prefix match can use an index:
const term = String(q).slice(0, 40);
const users = await User.find({
  name: { $regex: "^" + term.replace(/[.*+?^\${}()|[\\]\\\\]/g, "\\\\$&") },
})
  .select("name")
  .limit(20)
  .lean();

// For real search, a text index:
userSchema.index({ name: "text" });
const found = await User.find({ $text: { $search: term } }).limit(20).lean();`}
            />
            <QA
              level="Mid"
              q="Process 1 million users for a newsletter without loading them all."
              a={`await User.find({ marketingOptIn: true })
  .select("email")
  .lean()
  .cursor()
  .eachAsync(
    async (user) => {
      await enqueue(user.email);
    },
    { parallel: 8 }
  );`}
            />
          </Lesson>

          <Lesson title="Lesson 2: Schema patterns as queries">
            <QA
              level="Mid"
              q="Subset pattern: the product page should not load 10,000 reviews."
              a={`const product = await Product.findById(id)
  .select("name price latestReviews reviewCount")
  .lean();

const reviews = await Review.find({ productId: id })
  .sort({ createdAt: -1 })
  .limit(20)
  .lean();`}
            />
            <QA
              level="Mid"
              q="Bucket pattern: return one day's sensor readings stored in hourly buckets."
              a={`const buckets = await SensorBucket.find({
  sensorId,
  day: "2026-10-09",
})
  .select("hour readings")
  .sort({ hour: 1 })
  .lean();`}
            />
            <QA
              level="Senior"
              q="Computed pattern: the dashboard reads a pre-aggregated daily total instead of grouping orders live."
              a={`const totals = await DailyRevenue.find({
  day: { $gte: "2026-10-01", $lte: "2026-10-09" },
})
  .sort({ day: 1 })
  .lean();

// Writer, run by a job or $merge:
await Order.aggregate([
  { $match: { status: "paid", createdAt: { $gte: start, $lt: end } } },
  {
    $group: {
      _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
      total: { $sum: "$amount" },
    },
  },
  {
    $merge: {
      into: "dailyrevenues",
      on: "_id",
      whenMatched: "replace",
      whenNotMatched: "insert",
    },
  },
]);`}
            />
            <QA
              level="Senior"
              q="Extended reference: show an order list with the customer name without populate N+1."
              a={`const orders = await Order.find({ customerId })
  .select("total status customerName createdAt")
  .sort({ createdAt: -1 })
  .limit(20)
  .lean();

// customerName is copied onto the order at write time.
// Use populate or $lookup only on the detail page.`}
            />
            <QA
              level="Senior"
              q="Attribute pattern: query products where the flexible attr color is red and size is M."
              a={`productSchema.index({ "attrs.k": 1, "attrs.v": 1 });

const products = await Product.find({
  attrs: {
    $all: [
      { $elemMatch: { k: "color", v: "red" } },
      { $elemMatch: { k: "size", v: "M" } },
    ],
  },
}).lean();`}
            />
            <QA
              level="Senior"
              q="Outlier pattern: most users have few addresses. Query the rare user whose addresses spilled to another collection."
              a={`const user = await User.findById(id).lean();

const addresses = user.hasExtraAddresses
  ? await Address.find({ userId: id }).lean()
  : user.addresses;`}
            />
          </Lesson>
        </>
      )}

      {active === "m12" && (
        <>
          <h2 className="text-2xl font-bold text-sky-300">
            Module 12 — Phase 12: Operator cookbook (query round)
          </h2>

          <Lesson title="Lesson 1: Update operators interviewers ask you to type">
            <QA
              level="Junior"
              q="Push a tag, add a tag only if missing, and remove a tag."
              a={`await Post.updateOne({ _id }, { $push: { tags: "mongodb" } });
await Post.updateOne({ _id }, { $addToSet: { tags: "mongoose" } });
await Post.updateOne({ _id }, { $pull: { tags: "draft" } });`}
            />
            <QA
              level="Mid"
              q="Push several comments at position 0 and keep only the latest 50."
              a={`await Post.updateOne(
  { _id },
  {
    $push: {
      comments: {
        $each: [{ body: "Nice", at: new Date() }],
        $position: 0,
        $slice: 50,
      },
    },
  }
);`}
            />
            <QA
              level="Mid"
              q="Remove every cart item cheaper than 10, and remove a list of skus."
              a={`await Cart.updateOne(
  { userId },
  { $pull: { items: { price: { $lt: 10 } } } }
);

await Cart.updateOne(
  { userId },
  { $pullAll: { savedSkus: ["A1", "B2"] } }
);`}
            />
            <QA
              level="Mid"
              q="Rename a field, unset a secret, and set updatedAt to the server time."
              a={`await User.updateMany(
  {},
  {
    $rename: { fullname: "fullName" },
    $unset: { tempPassword: "" },
    $currentDate: { updatedAt: true },
  }
);`}
            />
            <QA
              level="Senior"
              q="Set qty on every item, then set qty only on items with sku A1."
              a={`await Order.updateOne({ _id }, { $set: { "items.$[].qty": 1 } });

await Order.updateOne(
  { _id },
  { $set: { "items.$[item].qty": 4 } },
  { arrayFilters: [{ "item.sku": "A1" }] }
);`}
            />
            <QA
              level="Senior"
              q="Pipeline update: set discountedPrice to price * 0.9 without reading the doc in Node."
              a={`await Product.updateMany({ onSale: true }, [
  { $set: { discountedPrice: { $multiply: ["$price", 0.9] } } },
]);`}
            />
          </Lesson>

          <Lesson title="Lesson 2: Aggregation operators interviewers ask you to type">
            <QA
              level="Mid"
              q="Bucket ages into 0-18, 18-30, 30-50, 50+."
              a={`const buckets = await User.aggregate([
  {
    $bucket: {
      groupBy: "$age",
      boundaries: [0, 18, 30, 50, 120],
      default: "other",
      output: { count: { $sum: 1 } },
    },
  },
]);`}
            />
            <QA
              level="Mid"
              q="Map an items array to names, and filter it to qty > 0."
              a={`const orders = await Order.aggregate([
  {
    $project: {
      names: {
        $map: { input: "$items", as: "item", in: "$$item.name" },
      },
      inStock: {
        $filter: {
          input: "$items",
          as: "item",
          cond: { $gt: ["$$item.qty", 0] },
        },
      },
    },
  },
]);`}
            />
            <QA
              level="Senior"
              q="Running total of daily revenue."
              a={`const series = await DailyRevenue.aggregate([
  { $sort: { day: 1 } },
  {
    $setWindowFields: {
      sortBy: { day: 1 },
      output: {
        running: {
          $sum: "$total",
          window: { documents: ["unbounded", "current"] },
        },
      },
    },
  },
]);`}
            />
            <QA
              level="Senior"
              q="Rank products inside each category by units sold."
              a={`const ranked = await Product.aggregate([
  {
    $setWindowFields: {
      partitionBy: "$category",
      sortBy: { sold: -1 },
      output: { rank: { $rank: {} } },
    },
  },
  { $match: { rank: { $lte: 3 } } },
]);`}
            />
            <QA
              level="Mid"
              q="$cond: label an order high-value when amount >= 1000."
              a={`const orders = await Order.aggregate([
  {
    $project: {
      amount: 1,
      label: {
        $cond: [{ $gte: ["$amount", 1000] }, "high", "normal"],
      },
    },
  },
]);`}
            />
            <QA
              level="Senior"
              q="Classic round: monthly active customers and their order count for a year."
              a={`const rows = await Order.aggregate([
  {
    $match: {
      status: "paid",
      createdAt: {
        $gte: new Date("2026-01-01"),
        $lt: new Date("2027-01-01"),
      },
    },
  },
  {
    $group: {
      _id: {
        month: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
        customerId: "$customerId",
      },
      orders: { $sum: 1 },
      spend: { $sum: "$amount" },
    },
  },
  {
    $group: {
      _id: "$_id.month",
      activeCustomers: { $sum: 1 },
      orders: { $sum: "$orders" },
      spend: { $sum: "$spend" },
    },
  },
  { $sort: { _id: 1 } },
]);`}
            />
            <QA
              level="Senior"
              q="Union recent posts from two collections, then sort."
              a={`const feed = await Post.aggregate([
  { $match: { published: true } },
  { $project: { title: 1, createdAt: 1, source: { $literal: "posts" } } },
  {
    $unionWith: {
      coll: "announcements",
      pipeline: [
        { $project: { title: 1, createdAt: 1, source: { $literal: "announcements" } } },
      ],
    },
  },
  { $sort: { createdAt: -1 } },
  { $limit: 30 },
]);`}
            />
          </Lesson>
        </>
      )}
    </QueryPage>
  );
}
