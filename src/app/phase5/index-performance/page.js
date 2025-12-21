"use client";

import Link from "next/link";
import { useState } from "react";

export default function IndexPerformancePage() {
  const [activeTab, setActiveTab] = useState("mongodb");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <Link
          href="/"
          className="text-purple-400 hover:text-purple-300 mb-6 inline-block"
        >
          ← Back to Home
        </Link>

        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Index Performance & Analysis
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          explain(), hint(), Covered Queries, and Index Optimization
        </p>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab("mongodb")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "mongodb"
                ? "bg-blue-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            MongoDB Native Driver
          </button>
          <button
            onClick={() => setActiveTab("mongoose")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "mongoose"
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Mongoose
          </button>
        </div>

        <div className="space-y-8">
          {/* Theory Section */}
          <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
            <h2 className="text-3xl font-bold mb-6 text-purple-300">
              📚 Theory
            </h2>

            <div className="space-y-4 text-gray-200">
              <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                Performance Analysis Tools
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>explain():</strong> Analyze query execution plan
                </li>
                <li>
                  <strong>hint():</strong> Force specific index usage
                </li>
                <li>
                  <strong>Covered Queries:</strong> Query using index only, no
                  document scan
                </li>
                <li>
                  <strong>Index Intersection:</strong> Use multiple indexes
                  together
                </li>
                <li>
                  <strong>$indexStats:</strong> View index usage statistics
                </li>
              </ul>
            </div>
          </section>

          {/* MongoDB Native Driver Examples */}
          {activeTab === "mongodb" && (
            <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
              <h2 className="text-3xl font-bold mb-6 text-blue-300">
                MongoDB Native Driver Examples
              </h2>

              {/* explain() */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  1. explain() - Query Analysis
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://localhost:27017");
await client.connect();
const db = client.db("myDatabase");
const users = db.collection("users");

// ===== EXPLAIN VERBOSITY LEVELS =====

// queryPlanner (default) - Shows winning plan
const plan1 = await users.find({ age: { $gte: 18 } }).explain();
console.log(plan1.queryPlanner.winningPlan);

// executionStats - Shows execution details
const plan2 = await users.find({ age: { $gte: 18 } }).explain("executionStats");
console.log(plan2.executionStats);

// allPlansExecution - Shows all considered plans
const plan3 = await users.find({ age: { $gte: 18 } }).explain("allPlansExecution");
console.log(plan3.executionStats.allPlansExecution);

// ===== KEY FIELDS TO ANALYZE =====

const explain = await users.find({ 
  status: "active",
  age: { $gte: 18 }
}).explain("executionStats");

// Check if index was used
console.log("Stage:", explain.executionStats.executionStages.stage);
// "IXSCAN" = index scan (good)
// "COLLSCAN" = collection scan (bad for large collections)

// Documents examined vs returned
console.log("Docs examined:", explain.executionStats.totalDocsExamined);
console.log("Docs returned:", explain.executionStats.nReturned);
// Lower ratio = better

// Execution time
console.log("Time (ms):", explain.executionStats.executionTimeMillis);

// Index used
if (explain.executionStats.executionStages.indexName) {
  console.log("Index:", explain.executionStats.executionStages.indexName);
}

// ===== ANALYZE DIFFERENT QUERIES =====

// Collection scan (no index)
await users.find({ randomField: "value" }).explain("executionStats");
// stage: "COLLSCAN"

// Index scan (with index)
await users.createIndex({ email: 1 });
await users.find({ email: "user@example.com" }).explain("executionStats");
// stage: "IXSCAN", indexName: "email_1"

// Covered query (index-only)
await users.createIndex({ age: 1, status: 1 });
await users.find(
  { age: { $gte: 18 } },
  { projection: { age: 1, status: 1, _id: 0 } }
).explain("executionStats");
// stage: "IXSCAN", totalDocsExamined: 0

// ===== EXPLAIN WITH AGGREGATION =====

const aggExplain = await users.aggregate([
  { $match: { age: { $gte: 18 } } },
  { $group: { _id: "$status", count: { $sum: 1 } } }
]).explain("executionStats");

console.log(aggExplain.stages);

// ===== EXPLAIN WITH UPDATE =====

const updateExplain = await users.explain("executionStats").updateMany(
  { status: "inactive" },
  { $set: { archived: true } }
);

console.log(updateExplain);

// ===== EXPLAIN WITH DELETE =====

const deleteExplain = await users.explain("executionStats").deleteMany(
  { createdAt: { $lt: new Date("2020-01-01") } }
);

console.log(deleteExplain);

// ===== PRACTICAL ANALYSIS =====

// Check if query is efficient
async function analyzeQuery(collection, query) {
  const explain = await collection.find(query).explain("executionStats");
  
  const stats = explain.executionStats;
  const ratio = stats.totalDocsExamined / stats.nReturned;
  
  console.log("Query Analysis:");
  console.log("- Stage:", stats.executionStages.stage);
  console.log("- Docs examined:", stats.totalDocsExamined);
  console.log("- Docs returned:", stats.nReturned);
  console.log("- Ratio:", ratio.toFixed(2));
  console.log("- Time (ms):", stats.executionTimeMillis);
  
  if (stats.executionStages.stage === "COLLSCAN") {
    console.log("⚠ WARNING: Collection scan - consider adding index");
  }
  
  if (ratio > 10) {
    console.log("⚠ WARNING: High examine/return ratio - optimize query/index");
  }
  
  return explain;
}

await analyzeQuery(users, { status: "active" });

await client.close();`}</code>
                </pre>
              </div>

              {/* hint() */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  2. hint() - Force Index Usage
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://localhost:27017");
await client.connect();
const db = client.db("myDatabase");
const orders = db.collection("orders");

// ===== CREATE MULTIPLE INDEXES =====

await orders.createIndex({ customerId: 1 });
await orders.createIndex({ orderDate: -1 });
await orders.createIndex({ customerId: 1, orderDate: -1 });

// ===== USE hint() TO FORCE INDEX =====

// Force specific index by name
await orders.find({ 
  customerId: "customer123",
  orderDate: { $gte: new Date("2024-01-01") }
}).hint("customerId_1_orderDate_-1").toArray();

// Force index by specification
await orders.find({ 
  customerId: "customer123" 
}).hint({ customerId: 1 }).toArray();

// ===== FORCE COLLECTION SCAN =====

// Use natural order (no index)
await orders.find({ status: "pending" }).hint({ $natural: 1 }).toArray();

// ===== hint() WITH SORT =====

// Force index for sort
await orders.find({ status: "completed" })
  .sort({ orderDate: -1 })
  .hint({ orderDate: -1 })
  .toArray();

// ===== COMPARE QUERY PLANS =====

// Without hint - MongoDB chooses index
const explain1 = await orders.find({
  customerId: "customer123",
  orderDate: { $gte: new Date("2024-01-01") }
}).explain("executionStats");

console.log("Auto-selected:", explain1.executionStats.executionStages.indexName);

// With hint - Force different index
const explain2 = await orders.find({
  customerId: "customer123",
  orderDate: { $gte: new Date("2024-01-01") }
}).hint({ customerId: 1 }).explain("executionStats");

console.log("Forced:", explain2.executionStats.executionStages.indexName);

// ===== hint() WITH AGGREGATION =====

await orders.aggregate([
  { $match: { customerId: "customer123" } },
  { $group: { _id: "$status", total: { $sum: "$amount" } } }
], {
  hint: { customerId: 1 }
}).toArray();

// ===== WHEN TO USE hint() =====

// 1. Query planner chooses suboptimal index
// 2. Testing different index strategies
// 3. Forcing specific index for consistency
// 4. Override default behavior for special cases

// ===== PRACTICAL EXAMPLES =====

// Force compound index for better performance
await orders.find({
  customerId: "customer123",
  status: "pending"
}).hint({ customerId: 1, status: 1 }).toArray();

// Disable index for testing
await orders.find({ status: "active" })
  .hint({ $natural: 1 })
  .toArray();

// Force index for sort optimization
await orders.find()
  .sort({ createdAt: -1 })
  .limit(100)
  .hint({ createdAt: -1 })
  .toArray();

await client.close();`}</code>
                </pre>
              </div>

              {/* Covered Queries */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  3. Covered Queries - Index-Only Queries
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://localhost:27017");
await client.connect();
const db = client.db("myDatabase");
const users = db.collection("users");

// ===== WHAT IS A COVERED QUERY? =====

// A query that can be satisfied entirely using index
// - Query fields are in index
// - Projection fields are in index
// - No document fetch needed
// Result: totalDocsExamined = 0

// ===== CREATE INDEX FOR COVERED QUERY =====

await users.createIndex({ 
  status: 1, 
  age: 1, 
  email: 1 
});

// ===== COVERED QUERY EXAMPLE =====

// This IS a covered query
const covered = await users.find(
  { status: "active", age: { $gte: 18 } },
  { projection: { status: 1, age: 1, email: 1, _id: 0 } }  // Must exclude _id
).toArray();

// Verify with explain
const explainCovered = await users.find(
  { status: "active", age: { $gte: 18 } },
  { projection: { status: 1, age: 1, email: 1, _id: 0 } }
).explain("executionStats");

console.log("Docs examined:", explainCovered.executionStats.totalDocsExamined);
// Should be 0 for covered query

// ===== NOT COVERED QUERIES =====

// Including _id (not in index)
await users.find(
  { status: "active" },
  { projection: { status: 1, age: 1 } }  // _id included by default
).toArray();
// Not covered - fetches documents for _id

// Projecting field not in index
await users.find(
  { status: "active" },
  { projection: { status: 1, age: 1, name: 1, _id: 0 } }  // name not in index
).toArray();
// Not covered - fetches documents for name

// Query field not in index
await users.find(
  { status: "active", country: "USA" },  // country not in index
  { projection: { status: 1, age: 1, _id: 0 } }
).toArray();
// Not covered

// ===== COVERED QUERY REQUIREMENTS =====

// 1. All query fields must be in index
// 2. All projection fields must be in index
// 3. Must explicitly exclude _id (unless _id is in index)
// 4. Cannot use array fields (multikey indexes)
// 5. Cannot use $text queries

// ===== PRACTICAL EXAMPLES =====

// User status check (covered)
await users.createIndex({ userId: 1, status: 1 });

await users.find(
  { userId: "user123" },
  { projection: { status: 1, _id: 0 } }
).toArray();

// Order summary (covered)
const orders = db.collection("orders");
await orders.createIndex({ 
  customerId: 1, 
  orderDate: -1, 
  total: 1 
});

await orders.find(
  { customerId: "customer123" },
  { projection: { orderDate: 1, total: 1, _id: 0 } }
).sort({ orderDate: -1 })
.limit(10)
.toArray();

// Analytics query (covered)
const analytics = db.collection("analytics");
await analytics.createIndex({ 
  userId: 1, 
  timestamp: -1, 
  eventType: 1 
});

await analytics.find(
  { userId: "user123", timestamp: { $gte: new Date("2024-01-01") } },
  { projection: { eventType: 1, timestamp: 1, _id: 0 } }
).toArray();

// ===== VERIFY COVERED QUERY =====

async function isCovered(collection, query, projection) {
  const explain = await collection
    .find(query, { projection })
    .explain("executionStats");
  
  const docsExamined = explain.executionStats.totalDocsExamined;
  const stage = explain.executionStats.executionStages.stage;
  
  console.log("Stage:", stage);
  console.log("Docs examined:", docsExamined);
  console.log("Covered:", docsExamined === 0 && stage === "IXSCAN");
  
  return docsExamined === 0 && stage === "IXSCAN";
}

await isCovered(
  users,
  { status: "active" },
  { status: 1, age: 1, _id: 0 }
);

await client.close();`}</code>
                </pre>
              </div>

              {/* Index Intersection & Statistics */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  4. Index Intersection & Statistics
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://localhost:27017");
await client.connect();
const db = client.db("myDatabase");
const products = db.collection("products");

// ===== INDEX INTERSECTION =====

// Create separate indexes
await products.createIndex({ category: 1 });
await products.createIndex({ price: 1 });
await products.createIndex({ inStock: 1 });

// MongoDB can use multiple indexes together
await products.find({
  category: "electronics",
  price: { $lte: 1000 },
  inStock: true
}).toArray();

// Check if intersection is used
const explain = await products.find({
  category: "electronics",
  price: { $lte: 1000 },
  inStock: true
}).explain("executionStats");

console.log("Stage:", explain.executionStats.executionStages.stage);
// May show "AND_SORTED" or "AND_HASH" for index intersection

// ===== COMPOUND INDEX VS INTERSECTION =====

// Usually, single compound index is better than intersection
await products.createIndex({ 
  category: 1, 
  price: 1, 
  inStock: 1 
});

// This is more efficient than index intersection
await products.find({
  category: "electronics",
  price: { $lte: 1000 },
  inStock: true
}).toArray();

// ===== INDEX STATISTICS =====

// Get index usage statistics
const indexStats = await products.aggregate([
  { $indexStats: {} }
]).toArray();

indexStats.forEach(stat => {
  console.log("Index:", stat.name);
  console.log("- Accesses:", stat.accesses.ops);
  console.log("- Since:", stat.accesses.since);
});

// ===== INDEX SIZE =====

// Get collection statistics
const stats = await db.command({ collStats: "products" });

console.log("Index sizes:");
Object.entries(stats.indexSizes).forEach(([name, size]) => {
  console.log(\`- \${name}: \${(size / 1024 / 1024).toFixed(2)} MB\`);
});

// Total index size
const totalIndexSize = Object.values(stats.indexSizes).reduce((a, b) => a + b, 0);
console.log(\`Total: \${(totalIndexSize / 1024 / 1024).toFixed(2)} MB\`);

// ===== FIND UNUSED INDEXES =====

async function findUnusedIndexes(collection) {
  const stats = await collection.aggregate([
    { $indexStats: {} }
  ]).toArray();
  
  const unused = stats.filter(idx => {
    return idx.name !== "_id_" && idx.accesses.ops === 0;
  });
  
  console.log("Unused indexes:");
  unused.forEach(idx => {
    console.log(\`- \${idx.name}\`);
  });
  
  return unused;
}

await findUnusedIndexes(products);

// ===== QUERY PERFORMANCE MONITORING =====

async function monitorQuery(collection, query, options = {}) {
  const startTime = Date.now();
  
  const explain = await collection
    .find(query, options)
    .explain("executionStats");
  
  const stats = explain.executionStats;
  const endTime = Date.now();
  
  console.log("Performance Report:");
  console.log("==================");
  console.log("Execution time:", stats.executionTimeMillis, "ms");
  console.log("Wall time:", endTime - startTime, "ms");
  console.log("Stage:", stats.executionStages.stage);
  console.log("Index used:", stats.executionStages.indexName || "None");
  console.log("Docs examined:", stats.totalDocsExamined);
  console.log("Docs returned:", stats.nReturned);
  console.log("Efficiency:", (stats.nReturned / Math.max(stats.totalDocsExamined, 1)).toFixed(2));
  
  return stats;
}

await monitorQuery(products, { category: "electronics" });

// ===== INDEX OPTIMIZATION WORKFLOW =====

async function optimizeIndexes(collection) {
  console.log("1. Getting current indexes...");
  const indexes = await collection.listIndexes().toArray();
  console.log(\`Found \${indexes.length} indexes\`);
  
  console.log("\\n2. Checking index usage...");
  const stats = await collection.aggregate([
    { $indexStats: {} }
  ]).toArray();
  
  const unused = stats.filter(idx => 
    idx.name !== "_id_" && idx.accesses.ops === 0
  );
  
  console.log(\`Found \${unused.length} unused indexes\`);
  
  console.log("\\n3. Checking index sizes...");
  const collStats = await collection.stats();
  const indexSize = collStats.totalIndexSize / 1024 / 1024;
  console.log(\`Total index size: \${indexSize.toFixed(2)} MB\`);
  
  console.log("\\n4. Recommendations:");
  if (unused.length > 0) {
    console.log("- Consider dropping unused indexes");
    unused.forEach(idx => console.log(\`  * \${idx.name}\`));
  }
  
  if (indexSize > 100) {
    console.log("- Large index size, review necessity of all indexes");
  }
  
  return {
    total: indexes.length,
    unused: unused.length,
    size: indexSize
  };
}

await optimizeIndexes(products);

await client.close();`}</code>
                </pre>
              </div>
            </section>
          )}

          {/* Mongoose Examples */}
          {activeTab === "mongoose" && (
            <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
              <h2 className="text-3xl font-bold mb-6 text-purple-300">
                Mongoose Examples
              </h2>

              {/* Index Performance in Mongoose */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-purple-300">
                  1. Index Performance in Mongoose
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const mongoose = require("mongoose");

await mongoose.connect("mongodb://localhost:27017/myDatabase");

const userSchema = new mongoose.Schema({
  email: String,
  age: Number,
  status: String
});

userSchema.index({ status: 1, age: 1 });

const User = mongoose.model("User", userSchema);

// ===== explain() IN MONGOOSE =====

const explain = await User
  .find({ status: "active", age: { $gte: 18 } })
  .explain("executionStats");

console.log(explain);

// ===== hint() IN MONGOOSE =====

await User
  .find({ status: "active" })
  .hint({ status: 1 })
  .exec();

// ===== COVERED QUERIES =====

await User
  .find({ status: "active" })
  .select({ status: 1, age: 1, _id: 0 })
  .exec();

// Verify covered
const explainCovered = await User
  .find({ status: "active" })
  .select({ status: 1, age: 1, _id: 0 })
  .explain("executionStats");

console.log("Docs examined:", explainCovered.executionStats.totalDocsExamined);

// ===== INDEX STATISTICS =====

const stats = await User.collection.aggregate([
  { $indexStats: {} }
]).toArray();

console.log(stats);

// ===== LEAN QUERIES FOR PERFORMANCE =====

// Use lean() for better performance (returns plain objects)
await User
  .find({ status: "active" })
  .select({ email: 1, age: 1 })
  .lean()
  .exec();

await mongoose.disconnect();`}</code>
                </pre>
              </div>
            </section>
          )}

          {/* Best Practices */}
          <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
            <h2 className="text-3xl font-bold mb-6 text-yellow-300">
              ⚡ Best Practices
            </h2>
            <ul className="space-y-3 text-gray-200">
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Use explain():</strong> Always analyze slow queries
                  with executionStats
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Check IXSCAN vs COLLSCAN:</strong> COLLSCAN indicates
                  missing index
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Monitor examine ratio:</strong> Keep totalDocsExamined
                  close to nReturned
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Covered queries:</strong> Exclude _id and only project
                  indexed fields
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Compound over intersection:</strong> Single compound
                  index usually faster
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Use hint() sparingly:</strong> Only when query planner
                  is wrong
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Monitor $indexStats:</strong> Drop unused indexes
                  regularly
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Index selectivity:</strong> Most selective fields
                  first in compound index
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Test in production-like data:</strong> Index
                  performance varies with data size
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Balance indexes:</strong> More indexes = slower
                  writes, faster reads
                </span>
              </li>
            </ul>
          </section>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8">
            <Link
              href="/phase5/index-properties"
              className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              ← Previous: Index Properties
            </Link>
            <Link
              href="/"
              className="bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-500 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              Back to Home →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
