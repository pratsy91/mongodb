"use client";

import Link from "next/link";
import { useState } from "react";

export default function ProfilingPerformancePage() {
  const [activeTab, setActiveTab] = useState("explain");

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
          Profiling & Performance
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Query optimization and performance analysis
        </p>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 flex-wrap">
          <button
            onClick={() => setActiveTab("explain")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "explain"
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Explain Plans
          </button>
          <button
            onClick={() => setActiveTab("profiling")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "profiling"
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Profiling
          </button>
          <button
            onClick={() => setActiveTab("bestPractices")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "bestPractices"
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Best Practices
          </button>
        </div>

        <div className="space-y-8">
          {/* Explain Plans Tab */}
          {activeTab === "explain" && (
            <>
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  📚 Explain Plans Theory
                </h2>

                <div className="space-y-4 text-gray-200">
                  <p className="text-lg">
                    <strong>Explain</strong> provides detailed information about
                    query execution plans.
                  </p>

                  <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                    Explain Verbosity Levels
                  </h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong>queryPlanner:</strong> Shows winning plan
                    </li>
                    <li>
                      <strong>executionStats:</strong> Shows execution
                      statistics
                    </li>
                    <li>
                      <strong>allPlansExecution:</strong> Shows all considered
                      plans
                    </li>
                  </ul>

                  <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                    Key Metrics
                  </h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong>executionTimeMillis:</strong> Total query time
                    </li>
                    <li>
                      <strong>totalDocsExamined:</strong> Documents scanned
                    </li>
                    <li>
                      <strong>totalKeysExamined:</strong> Index keys scanned
                    </li>
                    <li>
                      <strong>nReturned:</strong> Documents returned
                    </li>
                    <li>
                      <strong>executionStages:</strong> Plan stages
                    </li>
                  </ul>

                  <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                    Common Stages
                  </h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong>COLLSCAN:</strong> Full collection scan (slow)
                    </li>
                    <li>
                      <strong>IXSCAN:</strong> Index scan (fast)
                    </li>
                    <li>
                      <strong>FETCH:</strong> Retrieve documents
                    </li>
                    <li>
                      <strong>SORT:</strong> In-memory sort
                    </li>
                    <li>
                      <strong>PROJECTION:</strong> Field projection
                    </li>
                    <li>
                      <strong>LIMIT:</strong> Limit results
                    </li>
                    <li>
                      <strong>SKIP:</strong> Skip documents
                    </li>
                  </ul>
                </div>
              </section>

              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  Explain Plans Examples
                </h2>

                {/* Basic Explain */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    1. Basic Explain Plans
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== QUERY PLANNER (DEFAULT) =====

db.users.find({ email: "john@example.com" }).explain();

// Shows:
// - Winning execution plan
// - Indexes considered
// - Rejected plans

// ===== EXECUTION STATS =====

db.users.find({ email: "john@example.com" })
  .explain("executionStats");

// Output includes:
/*
{
  executionStats: {
    executionSuccess: true,
    executionTimeMillis: 5,
    totalKeysExamined: 1,
    totalDocsExamined: 1,
    nReturned: 1,
    executionStages: {
      stage: "FETCH",
      nReturned: 1,
      executionTimeMillisEstimate: 0,
      inputStage: {
        stage: "IXSCAN",
        keyPattern: { email: 1 },
        indexName: "email_1",
        keysExamined: 1,
        direction: "forward"
      }
    }
  }
}
*/

// ===== ALL PLANS EXECUTION =====

db.users.find({ age: 25, status: "active" })
  .explain("allPlansExecution");

// Shows all plans evaluated by query optimizer

// ===== MONGODB NATIVE DRIVER =====

const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://localhost:27017");
await client.connect();

const db = client.db("myDatabase");
const collection = db.collection("users");

// Get explain
const explain = await collection
  .find({ email: "john@example.com" })
  .explain("executionStats");

console.log("Execution time:", explain.executionStats.executionTimeMillis);
console.log("Docs examined:", explain.executionStats.totalDocsExamined);
console.log("Docs returned:", explain.executionStats.nReturned);

// ===== MONGOOSE =====

const mongoose = require("mongoose");
await mongoose.connect("mongodb://localhost:27017/myDatabase");

const User = mongoose.model("User", new mongoose.Schema({
  email: String,
  name: String,
  age: Number
}));

// Get explain
const explain2 = await User
  .find({ email: "john@example.com" })
  .explain("executionStats");

console.log(explain2);

await client.close();
await mongoose.disconnect();`}</code>
                  </pre>
                </div>

                {/* Analyze Explain */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    2. Analyzing Explain Output
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== GOOD QUERY (USING INDEX) =====

db.users.find({ email: "john@example.com" }).explain("executionStats");

/*
executionStats: {
  executionTimeMillis: 2,        // Fast!
  totalKeysExamined: 1,          // Scanned 1 index key
  totalDocsExamined: 1,          // Examined 1 document
  nReturned: 1,                  // Returned 1 document
  executionStages: {
    stage: "FETCH",
    inputStage: {
      stage: "IXSCAN",           // ✓ Using index
      indexName: "email_1"
    }
  }
}

Ratio: examined/returned = 1/1 = 1 (PERFECT!)
*/

// ===== BAD QUERY (COLLECTION SCAN) =====

db.users.find({ age: { $gt: 25 } }).explain("executionStats");

/*
executionStats: {
  executionTimeMillis: 145,      // Slow!
  totalKeysExamined: 0,          // No index used
  totalDocsExamined: 100000,     // Scanned all docs
  nReturned: 30000,              // Returned 30k
  executionStages: {
    stage: "COLLSCAN",           // ✗ Full collection scan
    direction: "forward"
  }
}

Ratio: examined/returned = 100000/30000 = 3.33 (BAD!)
Solution: Create index on age
*/

// ===== IN-MEMORY SORT =====

db.users.find({ status: "active" })
  .sort({ createdAt: -1 })
  .explain("executionStats");

/*
executionStages: {
  stage: "SORT",                 // ✗ In-memory sort
  sortPattern: { createdAt: -1 },
  memUsage: 3145728,             // Using 3MB memory
  inputStage: {
    stage: "COLLSCAN"            // ✗ No index
  }
}

Solution: Create index on { status: 1, createdAt: -1 }
*/

// ===== COVERED QUERY (BEST) =====

db.users.find(
  { email: "john@example.com" },
  { email: 1, _id: 0 }
).explain("executionStats");

/*
executionStages: {
  stage: "PROJECTION_COVERED",   // ✓✓ Covered query!
  inputStage: {
    stage: "IXSCAN",
    indexName: "email_1"
  }
}

totalDocsExamined: 0             // ✓ No documents fetched
totalKeysExamined: 1             // Only scanned index
nReturned: 1

Covered query = fastest possible!
*/

// ===== ANALYZE HELPER FUNCTION =====

function analyzeQuery(explain) {
  const stats = explain.executionStats;
  
  const ratio = stats.totalDocsExamined / stats.nReturned;
  const executionTime = stats.executionTimeMillis;
  const stage = stats.executionStages.stage;
  
  console.log(\`Execution Time: \${executionTime}ms\`);
  console.log(\`Examined/Returned Ratio: \${ratio.toFixed(2)}\`);
  console.log(\`Primary Stage: \${stage}\`);
  
  // Performance assessment
  if (stage === "COLLSCAN") {
    console.log("⚠️  WARNING: Full collection scan");
    console.log("   Solution: Create appropriate index");
  }
  
  if (ratio > 2) {
    console.log("⚠️  WARNING: High examine/return ratio");
    console.log("   Solution: Improve index selectivity");
  }
  
  if (executionTime > 100) {
    console.log("⚠️  WARNING: Slow query");
  }
  
  if (stage === "PROJECTION_COVERED") {
    console.log("✓ EXCELLENT: Covered query");
  }
  
  return { ratio, executionTime, stage };
}

// Usage
const explain3 = await collection
  .find({ age: 25 })
  .explain("executionStats");

analyzeQuery(explain3);`}</code>
                  </pre>
                </div>

                {/* Aggregation Explain */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    3. Explain for Aggregations
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== AGGREGATION EXPLAIN =====

db.orders.explain("executionStats").aggregate([
  { $match: { status: "completed" } },
  { $group: {
    _id: "$customerId",
    total: { $sum: "$amount" }
  }},
  { $sort: { total: -1 } },
  { $limit: 10 }
]);

// Output shows stages:
/*
stages: [
  {
    $cursor: {
      queryPlanner: {
        winningPlan: {
          stage: "IXSCAN",        // Using index on status
          indexName: "status_1"
        }
      },
      executionStats: {
        totalDocsExamined: 50000,
        executionTimeMillis: 145
      }
    }
  },
  { $group: ... },
  { $sort: ... },
  { $limit: ... }
]
*/

// ===== OPTIMIZE AGGREGATION =====

// Before: No index
db.orders.explain("executionStats").aggregate([
  { $match: { customerId: "cust123" } },
  { $group: { _id: "$product", total: { $sum: "$quantity" } } }
]);
// Result: COLLSCAN, 500ms

// Create index
db.orders.createIndex({ customerId: 1 });

// After: With index
// Result: IXSCAN, 15ms

// ===== $LOOKUP PERFORMANCE =====

db.orders.explain("executionStats").aggregate([
  { $match: { status: "completed" } },
  {
    $lookup: {
      from: "customers",
      localField: "customerId",
      foreignField: "_id",
      as: "customer"
    }
  }
]);

// Check:
// - Is $match using index?
// - Is foreignField (_id) indexed?
// - Consider denormalization if slow`}</code>
                  </pre>
                </div>
              </section>
            </>
          )}

          {/* Profiling Tab */}
          {activeTab === "profiling" && (
            <>
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  📚 Profiling Theory
                </h2>

                <div className="space-y-4 text-gray-200">
                  <p className="text-lg">
                    <strong>Profiling</strong> captures detailed information
                    about database operations for performance analysis.
                  </p>

                  <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                    Profiling Levels
                  </h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong>0:</strong> Off (default)
                    </li>
                    <li>
                      <strong>1:</strong> Log slow operations (threshold based)
                    </li>
                    <li>
                      <strong>2:</strong> Log all operations
                    </li>
                  </ul>

                  <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                    What Gets Profiled
                  </h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>CRUD operations</li>
                    <li>Aggregation pipelines</li>
                    <li>Index operations</li>
                    <li>Command execution</li>
                    <li>Execution time and statistics</li>
                  </ul>
                </div>
              </section>

              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  Profiling Examples
                </h2>

                {/* Enable Profiling */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    1. Enable & Configure Profiling
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== CHECK CURRENT PROFILING LEVEL =====

db.getProfilingStatus();

// Output:
/*
{
  was: 0,
  slowms: 100,
  sampleRate: 1.0
}
*/

// ===== ENABLE PROFILING =====

// Level 1: Log slow operations (> 100ms)
db.setProfilingLevel(1, { slowms: 100 });

// Level 1: Log slow operations (> 50ms)
db.setProfilingLevel(1, { slowms: 50 });

// Level 2: Log all operations
db.setProfilingLevel(2);

// Level 0: Disable profiling
db.setProfilingLevel(0);

// ===== SAMPLING =====

// Profile 50% of operations (reduces overhead)
db.setProfilingLevel(1, {
  slowms: 100,
  sampleRate: 0.5  // 50% sampling
});

// ===== PROFILING WITH FILTER =====

// Profile specific operations only (MongoDB 4.4+)
db.setProfilingLevel(1, {
  filter: {
    op: { $in: ["insert", "update", "remove"] }
  }
});

// Profile specific namespace
db.setProfilingLevel(1, {
  filter: {
    ns: "myDatabase.users"
  }
});

// ===== PROGRAMMATIC CONTROL =====

const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://localhost:27017");
await client.connect();

const db = client.db("myDatabase");

// Enable profiling
await db.command({
  profile: 1,
  slowms: 100
});

// Get status
const status = await db.command({ profile: -1 });
console.log("Profiling level:", status.was);

await client.close();`}</code>
                  </pre>
                </div>

                {/* Query Profiling Data */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    2. Query Profiling Data
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== VIEW PROFILING DATA =====

// Profiling data stored in system.profile collection
db.system.profile.find().pretty();

// Most recent operations
db.system.profile.find()
  .sort({ ts: -1 })
  .limit(10);

// ===== PROFILE ENTRY STRUCTURE =====

/*
{
  op: "query",                    // Operation type
  ns: "myDatabase.users",         // Namespace
  command: {
    find: "users",
    filter: { age: { $gt: 25 } }
  },
  keysExamined: 0,               // Index keys scanned
  docsExamined: 100000,          // Documents examined
  nreturned: 30000,              // Documents returned
  responseLength: 15000000,      // Response size in bytes
  millis: 145,                   // Execution time
  execStats: { ... },            // Execution statistics
  ts: ISODate("..."),           // Timestamp
  client: "127.0.0.1",          // Client IP
  user: "appUser@admin"         // User
}
*/

// ===== FIND SLOW QUERIES =====

// Queries slower than 100ms
db.system.profile.find({
  millis: { $gt: 100 }
}).sort({ millis: -1 });

// ===== FIND COLLECTION SCANS =====

db.system.profile.find({
  "execStats.stage": "COLLSCAN"
});

// ===== QUERIES WITH LOW SELECTIVITY =====

// Find queries with high docs examined / returned ratio
db.system.profile.aggregate([
  {
    $match: {
      op: "query",
      docsExamined: { $gt: 100 }
    }
  },
  {
    $project: {
      ns: 1,
      millis: 1,
      docsExamined: 1,
      nreturned: 1,
      ratio: {
        $divide: ["$docsExamined", { $max: ["$nreturned", 1] }]
      }
    }
  },
  {
    $match: { ratio: { $gt: 10 } }  // Examined 10x more than returned
  },
  { $sort: { ratio: -1 } }
]);

// ===== TOP SLOW OPERATIONS =====

db.system.profile.aggregate([
  { $match: { millis: { $gt: 50 } } },
  {
    $group: {
      _id: "$command.find",
      count: { $sum: 1 },
      avgMillis: { $avg: "$millis" },
      maxMillis: { $max: "$millis" }
    }
  },
  { $sort: { avgMillis: -1 } },
  { $limit: 10 }
]);

// ===== OPERATIONS BY TYPE =====

db.system.profile.aggregate([
  {
    $group: {
      _id: "$op",
      count: { $sum: 1 },
      avgMillis: { $avg: "$millis" }
    }
  },
  { $sort: { count: -1 } }
]);`}</code>
                  </pre>
                </div>

                {/* Profiling Analysis */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    3. Profiling Analysis Script
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== COMPREHENSIVE ANALYSIS =====

async function analyzeProfilingData(db) {
  console.log("=== MongoDB Profiling Analysis ===\\n");
  
  // 1. Total operations
  const total = await db.collection("system.profile").countDocuments();
  console.log(\`Total profiled operations: \${total}\\n\`);
  
  // 2. Slowest queries
  console.log("Top 10 Slowest Queries:");
  const slowest = await db.collection("system.profile")
    .find()
    .sort({ millis: -1 })
    .limit(10)
    .toArray();
  
  slowest.forEach((op, i) => {
    console.log(\`  \${i + 1}. \${op.ns} - \${op.millis}ms\`);
    console.log(\`     Command: \${JSON.stringify(op.command).substring(0, 100)}...\`);
  });
  
  // 3. Collection scans
  console.log("\\nCollection Scans:");
  const collScans = await db.collection("system.profile")
    .find({ "execStats.stage": "COLLSCAN" })
    .toArray();
  console.log(\`  Found \${collScans.length} collection scans\`);
  
  // 4. Operations by type
  console.log("\\nOperations by Type:");
  const byType = await db.collection("system.profile")
    .aggregate([
      {
        $group: {
          _id: "$op",
          count: { $sum: 1 },
          avgMillis: { $avg: "$millis" }
        }
      },
      { $sort: { count: -1 } }
    ]).toArray();
  
  byType.forEach(type => {
    console.log(\`  \${type._id}: \${type.count} ops, avg \${type.avgMillis.toFixed(2)}ms\`);
  });
  
  // 5. Most expensive collections
  console.log("\\nMost Expensive Collections:");
  const byCollection = await db.collection("system.profile")
    .aggregate([
      {
        $group: {
          _id: "$ns",
          count: { $sum: 1 },
          totalMillis: { $sum: "$millis" },
          avgMillis: { $avg: "$millis" }
        }
      },
      { $sort: { totalMillis: -1 } },
      { $limit: 5 }
    ]).toArray();
  
  byCollection.forEach(coll => {
    console.log(\`  \${coll._id}\`);
    console.log(\`    \${coll.count} ops, total \${coll.totalMillis}ms, avg \${coll.avgMillis.toFixed(2)}ms\`);
  });
  
  // 6. Recommendations
  console.log("\\n=== Recommendations ===");
  
  if (collScans.length > 0) {
    console.log("⚠️  Found collection scans - create indexes");
  }
  
  const slowOps = await db.collection("system.profile")
    .countDocuments({ millis: { $gt: 100 } });
  if (slowOps > 0) {
    console.log(\`⚠️  \${slowOps} operations slower than 100ms\`);
  }
}

// Usage
await analyzeProfilingData(db);

// ===== CLEAR PROFILING DATA =====

// Profile collection can grow large
// Clear periodically or use capped collection

db.system.profile.drop();

// Or create capped collection
db.createCollection("system.profile", {
  capped: true,
  size: 1048576  // 1MB
});`}</code>
                  </pre>
                </div>
              </section>
            </>
          )}

          {/* Best Practices Tab */}
          {activeTab === "bestPractices" && (
            <>
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  Performance Best Practices
                </h2>

                {/* Indexing Best Practices */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    1. Indexing Best Practices
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== ESR RULE (Equality, Sort, Range) =====

// Query: Find active users older than 25, sorted by name
db.users.find({
  status: "active",  // Equality
  age: { $gt: 25 }   // Range
}).sort({ name: 1 }); // Sort

// Best index order: ESR
db.users.createIndex({
  status: 1,  // E: Equality first
  name: 1,    // S: Sort second
  age: 1      // R: Range last
});

// ===== COVERED QUERIES =====

// Query can be satisfied entirely from index
db.users.find(
  { email: "john@example.com" },
  { email: 1, name: 1, _id: 0 }  // Project only indexed fields
);

// Create covering index
db.users.createIndex({ email: 1, name: 1 });

// ===== AVOID OVER-INDEXING =====

// Too many indexes slow down writes
// Each insert/update must update all indexes

// Before creating index, analyze:
// 1. Query frequency
// 2. Query performance impact
// 3. Write frequency
// 4. Index size

// ===== INDEX SELECTIVITY =====

// High selectivity = good (few matching documents)
// Low selectivity = bad (many matching documents)

// Bad: Boolean field
db.users.createIndex({ active: 1 });  // Only 2 values

// Better: Compound index
db.users.createIndex({ active: 1, createdAt: 1 });

// ===== INDEX INTERSECTION =====

// MongoDB can use multiple indexes
// But often slower than compound index

// Two single indexes
db.users.createIndex({ status: 1 });
db.users.createIndex({ age: 1 });

// Query uses both (intersection)
db.users.find({ status: "active", age: 25 });

// Better: Single compound index
db.users.createIndex({ status: 1, age: 1 });

// ===== PARTIAL INDEXES =====

// Index only subset of documents
db.orders.createIndex(
  { customerId: 1, orderDate: 1 },
  { partialFilterExpression: { status: "active" } }
);

// Saves space and improves performance
// Use when querying specific subset frequently`}</code>
                  </pre>
                </div>

                {/* Query Optimization */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    2. Query Optimization
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== USE PROJECTION =====

// Bad: Return all fields
db.users.find({ age: 25 });

// Good: Return only needed fields
db.users.find(
  { age: 25 },
  { name: 1, email: 1, _id: 0 }
);

// ===== LIMIT RESULTS =====

// Always use limit() when appropriate
db.users.find({ status: "active" }).limit(100);

// ===== AVOID $WHERE AND $EXPR =====

// Bad: JavaScript evaluation (slow)
db.users.find({
  $where: function() {
    return this.age > 25 && this.status === "active";
  }
});

// Good: Use query operators
db.users.find({
  age: { $gt: 25 },
  status: "active"
});

// ===== AVOID $NE AND $NIN =====

// Bad: Negation often requires collection scan
db.users.find({ status: { $ne: "deleted" } });

// Better: Query for specific values
db.users.find({ status: { $in: ["active", "pending", "blocked"] } });

// ===== REGEX OPTIMIZATION =====

// Bad: Slow regex
db.users.find({ email: /example/ });

// Better: Anchored regex
db.users.find({ email: /^john/ });  // Starts with "john"

// Best: Exact match or index
db.users.find({ email: "john@example.com" });

// ===== SORT OPTIMIZATION =====

// Bad: Sort without index (in-memory)
db.users.find({ status: "active" })
  .sort({ createdAt: -1 });

// Good: Index supports sort
db.users.createIndex({ status: 1, createdAt: -1 });

// ===== AGGREGATION OPTIMIZATION =====

// Order stages for performance
db.orders.aggregate([
  // 1. Filter early (reduce data)
  { $match: { status: "completed" } },
  
  // 2. Use indexes for $match
  { $match: { date: { $gte: ISODate("2024-01-01") } } },
  
  // 3. Project early (reduce data size)
  { $project: { customerId: 1, amount: 1 } },
  
  // 4. Group/aggregate
  { $group: { _id: "$customerId", total: { $sum: "$amount" } } },
  
  // 5. Sort after grouping (smaller dataset)
  { $sort: { total: -1 } },
  
  // 6. Limit results
  { $limit: 10 }
]);

// ===== AVOID UNBOUNDED QUERIES =====

// Bad: No filter, returns everything
db.logs.find();

// Good: Always filter
db.logs.find({
  timestamp: { $gte: new Date(Date.now() - 24*60*60*1000) }
});`}</code>
                  </pre>
                </div>

                {/* Schema Design */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    3. Schema Design for Performance
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== EMBED vs REFERENCE =====

// Embed: When data accessed together
// Reference: When data accessed independently

// Embed (One-to-Few)
{
  _id: ObjectId("..."),
  name: "John Doe",
  addresses: [
    { street: "123 Main St", city: "NYC" },
    { street: "456 Park Ave", city: "LA" }
  ]
}

// Reference (One-to-Many, Many-to-Many)
// Users collection
{ _id: ObjectId("..."), name: "John Doe" }

// Orders collection
{ _id: ObjectId("..."), userId: ObjectId("..."), amount: 100 }

// ===== DENORMALIZATION =====

// Duplicate frequently accessed data

// Instead of always joining:
db.orders.aggregate([
  {
    $lookup: {
      from: "customers",
      localField: "customerId",
      foreignField: "_id",
      as: "customer"
    }
  }
]);

// Store customer name in order
{
  _id: ObjectId("..."),
  customerId: ObjectId("..."),
  customerName: "John Doe",  // Denormalized
  amount: 100
}

// ===== DOCUMENT SIZE =====

// Keep documents under 16MB (hard limit)
// Target < 1MB for best performance

// Bad: Large arrays
{
  userId: "user123",
  activities: [ ... 100,000 items ... ]  // Too large!
}

// Good: Separate collection
// Activities collection
{ userId: "user123", activity: "...", timestamp: ... }

// ===== ATOMIC OPERATIONS =====

// Use atomic operators instead of read-modify-write

// Bad: Read, modify, write (race condition)
const doc = await db.counters.findOne({ _id: "pageViews" });
await db.counters.updateOne(
  { _id: "pageViews" },
  { $set: { count: doc.count + 1 } }
);

// Good: Atomic increment
await db.counters.updateOne(
  { _id: "pageViews" },
  { $inc: { count: 1 } }
);

// ===== WORKING SET =====

// Keep working set in RAM
// Working set = frequently accessed data + indexes

// Monitor:
db.serverStatus().wiredTiger.cache;

// Optimize:
// - Add more RAM
// - Reduce working set (archive old data)
// - Improve queries (reduce docs examined)`}</code>
                  </pre>
                </div>
              </section>
            </>
          )}

          {/* Best Practices */}
          <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
            <h2 className="text-3xl font-bold mb-6 text-yellow-300">
              ⚡ Performance Checklist
            </h2>
            <ul className="space-y-3 text-gray-200">
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Create appropriate indexes:</strong> Every query
                  should use an index
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Use explain():</strong> Analyze query plans regularly
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Enable profiling:</strong> Identify slow operations
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Project fields:</strong> Return only needed data
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Use covered queries:</strong> Fastest possible queries
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Avoid collection scans:</strong> Always filter with
                  indexed fields
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Denormalize when needed:</strong> Reduce expensive
                  joins
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Keep documents small:</strong> Target under 1MB
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Use atomic operations:</strong> Prevent race
                  conditions
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Monitor working set:</strong> Keep in RAM for best
                  performance
                </span>
              </li>
            </ul>
          </section>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8">
            <Link
              href="/"
              className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              ← Back to Home
            </Link>
            <Link
              href="/phase11/schema-patterns"
              className="bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-500 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              Next: Schema Design Patterns →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
