"use client";

import Link from "next/link";
import { useState } from "react";

export default function ShardingArchitecturePage() {
  const [activeTab, setActiveTab] = useState("architecture");

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
          Sharding Architecture & Basics
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Horizontal scaling with distributed data
        </p>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 flex-wrap">
          <button
            onClick={() => setActiveTab("architecture")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "architecture"
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Architecture
          </button>
          <button
            onClick={() => setActiveTab("setup")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "setup"
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Setup
          </button>
          <button
            onClick={() => setActiveTab("shardTypes")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "shardTypes"
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Shard Types
          </button>
        </div>

        <div className="space-y-8">
          {/* Architecture Tab */}
          {activeTab === "architecture" && (
            <>
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  📚 Sharding Theory
                </h2>

                <div className="space-y-4 text-gray-200">
                  <p className="text-lg">
                    <strong>Sharding</strong> is MongoDB's approach to
                    horizontal scaling, distributing data across multiple
                    servers (shards).
                  </p>

                  <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                    Sharded Cluster Components
                  </h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong>Shards:</strong> Store the data (each shard is a
                      replica set)
                    </li>
                    <li>
                      <strong>Config Servers:</strong> Store cluster metadata
                      and configuration (replica set)
                    </li>
                    <li>
                      <strong>Mongos:</strong> Query routers that direct
                      operations to appropriate shards
                    </li>
                  </ul>

                  <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                    Chunks
                  </h3>
                  <p>
                    Data is divided into <strong>chunks</strong> based on the
                    shard key:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Default chunk size: 64MB (configurable: 1MB-1024MB)</li>
                    <li>Each chunk covers a range of shard key values</li>
                    <li>MongoDB automatically splits chunks when they grow</li>
                    <li>Balancer migrates chunks between shards</li>
                  </ul>

                  <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                    Balancer
                  </h3>
                  <p>
                    The <strong>balancer</strong> ensures even data
                    distribution:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Runs on config server primary</li>
                    <li>Migrates chunks when imbalance detected</li>
                    <li>Configurable scheduling and throttling</li>
                    <li>Can be stopped for maintenance</li>
                  </ul>

                  <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                    Benefits
                  </h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong>Horizontal Scaling:</strong> Add more shards for
                      capacity
                    </li>
                    <li>
                      <strong>Distributed Reads:</strong> Parallel query
                      execution
                    </li>
                    <li>
                      <strong>Distributed Writes:</strong> Write to multiple
                      shards
                    </li>
                    <li>
                      <strong>Geographic Distribution:</strong> Data locality
                      with zones
                    </li>
                  </ul>
                </div>
              </section>

              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  Architecture Deep Dive
                </h2>

                {/* Request Flow */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    1. Request Flow
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== SHARDED QUERY FLOW =====

/*
Client Application
      ↓
   mongos (Query Router)
      ↓
Config Servers (metadata)
      ↓
   mongos routes to appropriate shard(s)
      ↓
Shard 1    Shard 2    Shard 3
(RS)       (RS)       (RS)
      ↓
   mongos aggregates results
      ↓
Returns to Client
*/

// ===== TARGETED QUERY =====
// Query includes shard key → routes to single shard

db.users.find({ userId: "user123" });
// mongos: "userId is shard key"
// mongos: "routes to Shard 2 only"

// ===== SCATTER-GATHER QUERY =====
// Query without shard key → broadcasts to all shards

db.users.find({ email: "john@example.com" });
// mongos: "email is not shard key"
// mongos: "queries all shards"
// mongos: "merges results"

// ===== WRITE OPERATIONS =====

// Insert
db.users.insertOne({
  userId: "user456",
  name: "John"
});
// mongos: "extract shard key: userId"
// mongos: "determine target chunk"
// mongos: "route to owning shard"

// Update with shard key
db.users.updateOne(
  { userId: "user123" },
  { $set: { name: "Updated" } }
);
// mongos: "routes to single shard"

// Update without shard key
db.users.updateMany(
  { active: true },
  { $set: { notified: true } }
);
// mongos: "broadcasts to all shards"`}</code>
                  </pre>
                </div>

                {/* Chunk Management */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    2. Chunk Management
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== CHUNK LIFECYCLE =====

/*
1. Initial State:
   Chunk 1: [MinKey, 1000]  → Shard A
   Chunk 2: [1000, MaxKey]  → Shard A

2. Chunk 1 grows > 64MB:
   Split triggered
   Chunk 1a: [MinKey, 500]  → Shard A
   Chunk 1b: [500, 1000]    → Shard A
   Chunk 2:  [1000, MaxKey] → Shard A

3. Imbalance detected (3 chunks on A, 0 on B):
   Balancer migrates
   Chunk 1a: [MinKey, 500]  → Shard A
   Chunk 1b: [500, 1000]    → Shard B (migrated)
   Chunk 2:  [1000, MaxKey] → Shard A
*/

// ===== VIEW CHUNKS =====

// Connect to mongos
use config

// View all chunks for a collection
db.chunks.find({
  ns: "myDatabase.users"
}).pretty();

// Chunk document structure:
/*
{
  _id: ObjectId("..."),
  ns: "myDatabase.users",
  min: { userId: "user000" },
  max: { userId: "user100" },
  shard: "shard0001",
  lastmod: Timestamp(1, 0)
}
*/

// Count chunks per shard
db.chunks.aggregate([
  { $match: { ns: "myDatabase.users" } },
  { $group: { _id: "$shard", count: { $sum: 1 } } }
]);

// ===== CHUNK OPERATIONS =====

// Split chunk manually
sh.splitFind("myDatabase.users", { userId: "user500" });

// Split at specific value
sh.splitAt("myDatabase.users", { userId: "user500" });

// Move chunk manually
sh.moveChunk(
  "myDatabase.users",
  { userId: "user000" },
  "shard0002"
);

// ===== CHUNK SIZE =====

// View current chunk size
use config
db.settings.findOne({ _id: "chunksize" });

// Modify chunk size (in MB)
db.settings.updateOne(
  { _id: "chunksize" },
  { $set: { value: 128 } },
  { upsert: true }
);`}</code>
                  </pre>
                </div>

                {/* Balancer */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    3. Balancer Management
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== BALANCER STATUS =====

// Check if balancer is running
sh.isBalancerRunning();

// Get balancer state
sh.getBalancerState();

// View balancer status (detailed)
sh.status();

// ===== BALANCER CONTROL =====

// Stop balancer (for maintenance)
sh.stopBalancer();

// Start balancer
sh.startBalancer();

// Set balancer window (only run during specific hours)
use config

db.settings.updateOne(
  { _id: "balancer" },
  {
    $set: {
      activeWindow: {
        start: "01:00",  // 1 AM
        stop: "05:00"    // 5 AM
      }
    }
  },
  { upsert: true }
);

// Remove balancer window
db.settings.updateOne(
  { _id: "balancer" },
  { $unset: { activeWindow: "" } }
);

// ===== BALANCER CONFIGURATION =====

// Disable balancing for specific collection
sh.disableBalancing("myDatabase.users");

// Enable balancing for collection
sh.enableBalancing("myDatabase.users");

// Check if collection balancing is enabled
use config
db.collections.findOne({ _id: "myDatabase.users" }).noBalance;

// ===== WAIT FOR BALANCER =====

// Wait for balancer round to complete
sh.waitForBalancer(true);

// Wait with timeout
sh.waitForBalancer(true, 60000);  // 60 seconds

// ===== MIGRATION THROTTLING =====

// Configure migration settings
db.adminCommand({
  setParameter: 1,
  rangeDeleterBatchSize: 128,
  rangeDeleterBatchDelayMS: 20
});

// Configure chunk migration concurrency
db.adminCommand({
  setParameter: 1,
  chunkMigrationConcurrency: 1  // Parallel migrations
});`}</code>
                  </pre>
                </div>
              </section>
            </>
          )}

          {/* Setup Tab */}
          {activeTab === "setup" && (
            <>
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  Setting Up a Sharded Cluster
                </h2>

                {/* Deploy Cluster */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    1. Deploy Sharded Cluster
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== STEP 1: START CONFIG SERVERS =====

// Config servers must be a replica set (CSRS)

// Terminal 1
mongod --configsvr --replSet configReplSet --port 27019 --dbpath /data/configdb1

// Terminal 2
mongod --configsvr --replSet configReplSet --port 27020 --dbpath /data/configdb2

// Terminal 3
mongod --configsvr --replSet configReplSet --port 27021 --dbpath /data/configdb3

// Initialize config server replica set
mongosh --port 27019

rs.initiate({
  _id: "configReplSet",
  configsvr: true,
  members: [
    { _id: 0, host: "localhost:27019" },
    { _id: 1, host: "localhost:27020" },
    { _id: 2, host: "localhost:27021" }
  ]
});

// ===== STEP 2: START SHARDS =====

// Each shard should be a replica set

// Shard 1 Replica Set
mongod --shardsvr --replSet shard1 --port 27017 --dbpath /data/shard1a
mongod --shardsvr --replSet shard1 --port 27018 --dbpath /data/shard1b

mongosh --port 27017
rs.initiate({
  _id: "shard1",
  members: [
    { _id: 0, host: "localhost:27017" },
    { _id: 1, host: "localhost:27018" }
  ]
});

// Shard 2 Replica Set
mongod --shardsvr --replSet shard2 --port 27022 --dbpath /data/shard2a
mongod --shardsvr --replSet shard2 --port 27023 --dbpath /data/shard2b

mongosh --port 27022
rs.initiate({
  _id: "shard2",
  members: [
    { _id: 0, host: "localhost:27022" },
    { _id: 1, host: "localhost:27023" }
  ]
});

// ===== STEP 3: START MONGOS =====

mongos --configdb configReplSet/localhost:27019,localhost:27020,localhost:27021 --port 27016

// ===== STEP 4: ADD SHARDS =====

// Connect to mongos
mongosh --port 27016

// Add shards
sh.addShard("shard1/localhost:27017,localhost:27018");
sh.addShard("shard2/localhost:27022,localhost:27023");

// Verify shards
sh.status();

// ===== PRODUCTION CONFIGURATION =====

// Config servers (3 members)
mongod --configsvr --replSet configRS \\
  --bind_ip localhost,<external-ip> \\
  --port 27019 \\
  --dbpath /data/configdb

// Shards (3+ members each)
mongod --shardsvr --replSet shard1RS \\
  --bind_ip localhost,<external-ip> \\
  --port 27017 \\
  --dbpath /data/shard1

// Mongos (multiple for high availability)
mongos --configdb configRS/<config-hosts> \\
  --bind_ip localhost,<external-ip> \\
  --port 27016`}</code>
                  </pre>
                </div>

                {/* Enable Sharding */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    2. Enable Sharding
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// Connect to mongos
mongosh --port 27016

// ===== ENABLE SHARDING ON DATABASE =====

sh.enableSharding("myDatabase");

// Verify
use config
db.databases.find({ _id: "myDatabase" });

// ===== SHARD A COLLECTION =====

// Ranged sharding on userId
sh.shardCollection(
  "myDatabase.users",
  { userId: 1 }  // Ascending shard key
);

// Compound shard key
sh.shardCollection(
  "myDatabase.orders",
  { customerId: 1, orderDate: 1 }
);

// Hashed sharding (covered in next section)
sh.shardCollection(
  "myDatabase.products",
  { _id: "hashed" }
);

// ===== VERIFY SHARDING =====

// Check collection sharding status
use myDatabase
db.users.getShardDistribution();

// Output shows:
/*
Shard shard1 at shard1/localhost:27017,localhost:27018
  data: 500MB docs: 100000 chunks: 10
  estimated data per chunk: 50MB
  estimated docs per chunk: 10000

Shard shard2 at shard2/localhost:27022,localhost:27023
  data: 520MB docs: 104000 chunks: 11
  estimated data per chunk: 47.27MB
  estimated docs per chunk: 9454
*/

// Detailed shard status
sh.status();

// ===== PROGRAMMATIC SETUP =====

const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://localhost:27016");
await client.connect();

const adminDb = client.db("admin");

// Add shard
await adminDb.command({
  addShard: "shard3/localhost:27024,localhost:27025"
});

// Enable sharding on database
await adminDb.command({
  enableSharding: "myDatabase"
});

// Shard collection
await adminDb.command({
  shardCollection: "myDatabase.users",
  key: { userId: 1 }
});

await client.close();`}</code>
                  </pre>
                </div>
              </section>
            </>
          )}

          {/* Shard Types Tab */}
          {activeTab === "shardTypes" && (
            <>
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  📚 Sharding Strategies
                </h2>

                <div className="space-y-4 text-gray-200">
                  <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                    Ranged Sharding
                  </h3>
                  <p>
                    Divides data based on <strong>ranges</strong> of shard key
                    values:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong>Pros:</strong> Good for range queries, maintains
                      sort order
                    </li>
                    <li>
                      <strong>Cons:</strong> Risk of hotspots with monotonic
                      keys
                    </li>
                    <li>
                      <strong>Use Case:</strong> Date ranges, geographic data
                    </li>
                  </ul>

                  <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                    Hashed Sharding
                  </h3>
                  <p>
                    Uses <strong>hash</strong> of shard key for distribution:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong>Pros:</strong> Even distribution, prevents
                      hotspots
                    </li>
                    <li>
                      <strong>Cons:</strong> Cannot use for range queries
                    </li>
                    <li>
                      <strong>Use Case:</strong> Monotonic keys (_id,
                      timestamps)
                    </li>
                  </ul>
                </div>
              </section>

              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  Sharding Strategy Examples
                </h2>

                {/* Ranged Sharding */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    1. Ranged Sharding
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== BASIC RANGED SHARDING =====

// Shard by userId (good if userId is random/UUID)
sh.shardCollection("myDatabase.users", { userId: 1 });

/*
Chunk Distribution:
Chunk 1: [MinKey, "user-100"] → Shard A
Chunk 2: ["user-100", "user-200"] → Shard B
Chunk 3: ["user-200", MaxKey] → Shard A
*/

// Queries:
// Targeted query (includes shard key)
db.users.find({ userId: "user-150" });
// → Routes to Shard B only

// Range query (benefits from ranged sharding)
db.users.find({
  userId: { $gte: "user-100", $lte: "user-199" }
});
// → Routes to Shard B only

// ===== COMPOUND RANGED SHARD KEY =====

sh.shardCollection(
  "myDatabase.orders",
  { customerId: 1, orderDate: 1 }
);

/*
Benefits:
- First level: distribute by customer
- Second level: order within customer
- Range queries on orderDate efficient
*/

// Targeted query
db.orders.find({
  customerId: "cust123",
  orderDate: { $gte: ISODate("2024-01-01") }
});
// → Routes to single shard

// ===== TIME-BASED RANGED SHARDING =====

sh.shardCollection(
  "myDatabase.events",
  { timestamp: 1, eventType: 1 }
);

// Problem: Hotspot on most recent shard
// All new writes go to same shard (highest timestamp)

// Better: Add prefix to distribute
sh.shardCollection(
  "myDatabase.events",
  { eventType: 1, timestamp: 1 }
);

// Now writes distributed across eventType first`}</code>
                  </pre>
                </div>

                {/* Hashed Sharding */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    2. Hashed Sharding
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== BASIC HASHED SHARDING =====

// Hash _id for even distribution
sh.shardCollection("myDatabase.products", { _id: "hashed" });

/*
Chunk Distribution (based on hash):
Chunk 1: [MinKey, hash1] → Shard A
Chunk 2: [hash1, hash2] → Shard B
Chunk 3: [hash2, MaxKey] → Shard C

Writes evenly distributed regardless of _id pattern
*/

// ===== HASHED SHARD KEY BENEFITS =====

// Even with monotonic _id (ObjectId)
db.products.insertOne({
  _id: ObjectId(),  // Sequential
  name: "Product"
});
// Hash ensures even distribution

// Check distribution
db.products.getShardDistribution();
// Should show roughly equal data on all shards

// ===== HASHED WITH PREFIX =====

// Compound: ranged + hashed
sh.shardCollection(
  "myDatabase.logs",
  { appId: 1, _id: "hashed" }
);

/*
Benefits:
- Queries with appId: targeted
- Within appId: evenly distributed via hash
*/

// Targeted query
db.logs.find({ appId: "app1" });
// → May hit multiple shards, but only those with app1 data

// ===== HASHED LIMITATIONS =====

// Range queries not efficient
db.products.find({
  _id: { $gte: ObjectId("..."), $lte: ObjectId("...") }
});
// → Scatter-gather to all shards

// Hash indexes required
// MongoDB automatically creates hashed index on shard key

// ===== PRE-SPLITTING WITH HASHED =====

// Create chunks before loading data
sh.shardCollection(
  "myDatabase.users",
  { _id: "hashed" },
  false,  // Not unique
  {
    numInitialChunks: 100  // Create 100 chunks upfront
  }
);

// Useful for bulk loading to avoid balancer overhead`}</code>
                  </pre>
                </div>

                {/* Comparison */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    3. Ranged vs Hashed Comparison
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== PERFORMANCE COMPARISON =====

/*
RANGED SHARDING:
✓ Range queries efficient
✓ Maintains sort order
✓ Good for queries with ranges
✗ Hotspots with monotonic keys
✗ Uneven distribution possible

HASHED SHARDING:
✓ Even distribution
✓ No hotspots
✓ Good for random access
✗ Range queries inefficient
✗ Loses sort order
*/

// ===== EXAMPLE SCENARIOS =====

// Scenario 1: E-commerce Orders
// Good: Ranged (customerId + orderDate)
sh.shardCollection("orders", {
  customerId: 1,
  orderDate: 1
});
// Why: Query orders by customer and date range

// Scenario 2: IoT Sensor Data
// Good: Hashed (_id) or Compound (sensorId + hash)
sh.shardCollection("sensors", {
  sensorId: 1,
  _id: "hashed"
});
// Why: Even distribution, many sensors

// Scenario 3: Social Media Posts
// Good: Hashed (_id)
sh.shardCollection("posts", { _id: "hashed" });
// Why: No natural shard key, prevent hotspots

// Scenario 4: Geographic Data
// Good: Ranged (location)
sh.shardCollection("locations", {
  country: 1,
  city: 1
});
// Why: Query by geographic region

// ===== TESTING DISTRIBUTION =====

// Insert test data
for (let i = 0; i < 100000; i++) {
  db.testCollection.insertOne({
    _id: i,  // Sequential
    data: "test"
  });
}

// Ranged on _id (BAD: hotspot on latest shard)
sh.shardCollection("db.testRanged", { _id: 1 });
db.testRanged.getShardDistribution();
// → Uneven: last shard has most data

// Hashed on _id (GOOD: even distribution)
sh.shardCollection("db.testHashed", { _id: "hashed" });
db.testHashed.getShardDistribution();
// → Even: all shards similar size`}</code>
                  </pre>
                </div>
              </section>
            </>
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
                  <strong>Choose shard key carefully:</strong> Cannot change
                  after sharding (MongoDB 5.0+ allows refining)
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>High cardinality:</strong> Shard key should have many
                  distinct values
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Even distribution:</strong> Avoid monotonic keys
                  without hashing
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Query isolation:</strong> Include shard key in queries
                  when possible
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Config servers:</strong> Always use 3-member replica
                  set
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Shards as replica sets:</strong> Each shard should be
                  3+ member replica set
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Multiple mongos:</strong> Deploy multiple for high
                  availability
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Monitor balancer:</strong> Ensure chunks distributed
                  evenly
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Chunk size:</strong> Adjust based on data patterns
                  (default 64MB)
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Pre-split for bulk loads:</strong> Avoid balancer
                  overhead during initial load
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
              href="/phase9/shard-key-strategies"
              className="bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-500 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              Next: Shard Key Strategies →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
