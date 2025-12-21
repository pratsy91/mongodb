"use client";

import Link from "next/link";
import { useState } from "react";

export default function ShardKeyStrategiesPage() {
  const [activeTab, setActiveTab] = useState("selection");

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
          Shard Key Strategies
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Choosing the right shard key and zone sharding
        </p>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 flex-wrap">
          <button
            onClick={() => setActiveTab("selection")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "selection"
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Shard Key Selection
          </button>
          <button
            onClick={() => setActiveTab("zones")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "zones"
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Zone Sharding
          </button>
          <button
            onClick={() => setActiveTab("monitoring")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "monitoring"
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Monitoring
          </button>
        </div>

        <div className="space-y-8">
          {/* Selection Tab */}
          {activeTab === "selection" && (
            <>
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  📚 Shard Key Selection Theory
                </h2>

                <div className="space-y-4 text-gray-200">
                  <p className="text-lg">
                    Choosing the right <strong>shard key</strong> is critical
                    for performance and scalability.
                  </p>

                  <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                    Good Shard Key Characteristics
                  </h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong>High Cardinality:</strong> Many distinct values
                    </li>
                    <li>
                      <strong>Low Frequency:</strong> No single value appears
                      too often
                    </li>
                    <li>
                      <strong>Non-Monotonic:</strong> Values don't always
                      increase (or use hashed)
                    </li>
                    <li>
                      <strong>Query Friendly:</strong> Appears in common queries
                    </li>
                  </ul>

                  <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                    Anti-Patterns
                  </h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong>Low Cardinality:</strong> Boolean, status fields
                    </li>
                    <li>
                      <strong>Monotonically Increasing:</strong> Timestamps,
                      auto-increment without hash
                    </li>
                    <li>
                      <strong>High Frequency:</strong> Single value dominates
                    </li>
                    <li>
                      <strong>Rarely Queried:</strong> Not used in queries
                    </li>
                  </ul>

                  <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                    Evaluation Criteria
                  </h3>
                  <ol className="list-decimal list-inside space-y-2 ml-4">
                    <li>
                      <strong>Cardinality:</strong> How many distinct values?
                    </li>
                    <li>
                      <strong>Frequency:</strong> How evenly distributed?
                    </li>
                    <li>
                      <strong>Monotonicity:</strong> Always increasing?
                    </li>
                    <li>
                      <strong>Query Pattern:</strong> Used in queries?
                    </li>
                    <li>
                      <strong>Write Pattern:</strong> Even write distribution?
                    </li>
                  </ol>
                </div>
              </section>

              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  Shard Key Selection Examples
                </h2>

                {/* Good Shard Keys */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    1. Good Shard Key Examples
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== EXAMPLE 1: USER DATA =====

// Good: userId (UUID/GUID)
sh.shardCollection("myDatabase.users", { userId: 1 });

/*
✓ High cardinality: Each user unique
✓ Even distribution: UUIDs random
✓ Query friendly: Most queries by userId
*/

// Query example
db.users.find({ userId: "550e8400-e29b-41d4-a716-446655440000" });
// → Targeted to single shard

// ===== EXAMPLE 2: E-COMMERCE ORDERS =====

// Good: Compound key (customerId + orderDate)
sh.shardCollection("myDatabase.orders", {
  customerId: 1,
  orderDate: 1
});

/*
✓ High cardinality: Many customers × dates
✓ Query friendly: "Find orders for customer in date range"
✓ Balanced writes: Orders distributed across customers
*/

// Query examples
db.orders.find({
  customerId: "cust123",
  orderDate: { $gte: ISODate("2024-01-01") }
});
// → Targeted to single shard

db.orders.find({
  customerId: "cust123"
});
// → Targeted to shard(s) containing cust123 data

// ===== EXAMPLE 3: IOT SENSOR DATA =====

// Good: Compound (deviceId + timestamp hashed)
sh.shardCollection("myDatabase.sensors", {
  deviceId: 1,
  _id: "hashed"
});

/*
✓ Device-level isolation
✓ Even distribution within device (via hash)
✓ Query friendly: Query by device
*/

// Query example
db.sensors.find({
  deviceId: "device-001",
  timestamp: { $gte: ISODate("2024-01-01") }
});
// → Routes to shard(s) with device-001

// ===== EXAMPLE 4: HASHED _ID =====

// Good: When no natural key exists
sh.shardCollection("myDatabase.products", { _id: "hashed" });

/*
✓ Even distribution
✓ No hotspots
✓ Good for random access
*/

// ===== EXAMPLE 5: GEOGRAPHIC DATA =====

// Good: Location-based
sh.shardCollection("myDatabase.locations", {
  country: 1,
  state: 1,
  city: 1
});

/*
✓ Geographic isolation
✓ Query friendly: Query by location
✓ Enables zone sharding by region
*/`}</code>
                  </pre>
                </div>

                {/* Bad Shard Keys */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    2. Bad Shard Key Examples (Anti-Patterns)
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== ANTI-PATTERN 1: LOW CARDINALITY =====

// BAD: Boolean field
sh.shardCollection("myDatabase.users", { active: 1 });

/*
✗ Only 2 values: true/false
✗ Maximum 2 chunks
✗ Cannot scale beyond 2 shards
✗ Uneven distribution if most users active
*/

// BAD: Status field (limited values)
sh.shardCollection("myDatabase.orders", { status: 1 });

/*
✗ Few values: pending/processing/completed/cancelled
✗ Limited scalability
✗ Hotspot on most common status
*/

// ===== ANTI-PATTERN 2: MONOTONICALLY INCREASING =====

// BAD: Timestamp without hash
sh.shardCollection("myDatabase.events", { timestamp: 1 });

/*
✗ All new writes go to same shard (latest timestamp)
✗ Hotspot on most recent shard
✗ Uneven write distribution
*/

// Result: Last shard handles all writes
/*
Shard 1: [MinKey, 2024-01-01] → 10GB (no new writes)
Shard 2: [2024-01-01, 2024-06-01] → 10GB (no new writes)
Shard 3: [2024-06-01, MaxKey] → 50GB (all new writes!) ← HOTSPOT
*/

// BAD: Auto-increment ID
sh.shardCollection("myDatabase.logs", { logId: 1 });

/*
✗ Sequential values
✗ All writes to highest shard
✗ No write distribution
*/

// ===== ANTI-PATTERN 3: HIGH FREQUENCY =====

// BAD: Field with dominant value
sh.shardCollection("myDatabase.products", { category: 1 });

/*
If 90% of products in "Electronics":
✗ One shard handles 90% of data
✗ Uneven distribution
✗ Limited scalability
*/

// ===== ANTI-PATTERN 4: NOT IN QUERIES =====

// BAD: Field rarely used in queries
sh.shardCollection("myDatabase.users", { internalId: 1 });

// Most queries use email
db.users.find({ email: "john@example.com" });
// → Scatter-gather to all shards (slow!)

/*
✗ Forces broadcast queries
✗ No query targeting
✗ Poor performance
*/

// ===== HOW TO FIX ANTI-PATTERNS =====

// Fix 1: Add hash to monotonic key
sh.shardCollection("myDatabase.events", { timestamp: "hashed" });

// Fix 2: Use compound key
sh.shardCollection("myDatabase.events", {
  eventType: 1,  // Distribute across types
  timestamp: 1   // Order within type
});

// Fix 3: Use hashed _id when no natural key
sh.shardCollection("myDatabase.products", { _id: "hashed" });

// Fix 4: Use commonly queried field
sh.shardCollection("myDatabase.users", { email: 1 });
// Now queries target specific shard`}</code>
                  </pre>
                </div>

                {/* Analyzing Shard Keys */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    3. Analyzing Potential Shard Keys
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== CARDINALITY ANALYSIS =====

// Count distinct values
db.users.distinct("userId").length;

db.users.aggregate([
  { $group: { _id: "$status", count: { $sum: 1 } } }
]);

// Check for high cardinality
db.users.aggregate([
  {
    $group: {
      _id: null,
      totalDocs: { $sum: 1 },
      distinctUsers: { $addToSet: "$userId" }
    }
  },
  {
    $project: {
      totalDocs: 1,
      distinctCount: { $size: "$distinctUsers" },
      cardinality: {
        $divide: [{ $size: "$distinctUsers" }, "$totalDocs"]
      }
    }
  }
]);

// Cardinality ratio close to 1.0 = good

// ===== FREQUENCY ANALYSIS =====

// Find most common values
db.orders.aggregate([
  { $group: { _id: "$customerId", count: { $sum: 1 } } },
  { $sort: { count: -1 } },
  { $limit: 10 }
]);

// Check distribution
db.orders.aggregate([
  { $group: { _id: "$status", count: { $sum: 1 } } },
  { $sort: { count: -1 } }
]);

// Output example:
/*
{ _id: "completed", count: 500000 }  ← 50% of data
{ _id: "pending", count: 300000 }
{ _id: "cancelled", count: 200000 }
*/
// High frequency on "completed" = potential hotspot

// ===== MONOTONICITY CHECK =====

// Sample recent documents
db.events.find().sort({ timestamp: -1 }).limit(100);

// Check if values always increasing
db.events.aggregate([
  { $sort: { timestamp: 1 } },
  { $limit: 1000 },
  { $group: {
    _id: null,
    values: { $push: "$timestamp" }
  }}
]);

// ===== QUERY PATTERN ANALYSIS =====

// Enable profiling to analyze queries
db.setProfilingLevel(2);

// After some time, analyze queries
db.system.profile.aggregate([
  { $match: { ns: "myDatabase.users" } },
  { $group: {
    _id: "$command.filter",
    count: { $sum: 1 }
  }},
  { $sort: { count: -1 } },
  { $limit: 10 }
]);

// Check which fields appear most in queries

// ===== TESTING DISTRIBUTION =====

// Create test collection with candidate shard key
db.test.insertMany(
  Array.from({ length: 100000 }, (_, i) => ({
    userId: \`user-\${i}\`,
    timestamp: new Date(Date.now() + i * 1000)
  }))
);

// Simulate sharding and check distribution
sh.shardCollection("test.simulated", { userId: 1 });
db.simulated.getShardDistribution();

// Check if balanced`}</code>
                  </pre>
                </div>
              </section>
            </>
          )}

          {/* Zones Tab */}
          {activeTab === "zones" && (
            <>
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  📚 Zone Sharding Theory
                </h2>

                <div className="space-y-4 text-gray-200">
                  <p className="text-lg">
                    <strong>Zone Sharding</strong> (formerly Tag-Aware Sharding)
                    allows you to control data placement on specific shards.
                  </p>

                  <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                    Use Cases
                  </h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong>Geographic Distribution:</strong> Keep data close
                      to users
                    </li>
                    <li>
                      <strong>Compliance:</strong> Data residency requirements
                    </li>
                    <li>
                      <strong>Hardware Optimization:</strong> Hot/cold data on
                      different hardware
                    </li>
                    <li>
                      <strong>Tiered Storage:</strong> Recent data on SSDs, old
                      on HDDs
                    </li>
                  </ul>

                  <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                    How It Works
                  </h3>
                  <ol className="list-decimal list-inside space-y-2 ml-4">
                    <li>Tag shards with zone names</li>
                    <li>Define shard key ranges for each zone</li>
                    <li>Balancer ensures chunks in correct zones</li>
                    <li>New writes routed to appropriate zone</li>
                  </ol>
                </div>
              </section>

              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  Zone Sharding Examples
                </h2>

                {/* Geographic Zones */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    1. Geographic Zone Sharding
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== SETUP GEOGRAPHIC ZONES =====

// Step 1: Tag shards with zones
sh.addShardToZone("shard0001", "US-EAST");
sh.addShardToZone("shard0002", "US-WEST");
sh.addShardToZone("shard0003", "EU");
sh.addShardToZone("shard0004", "ASIA");

// Verify shard tags
use config
db.shards.find();

// Output:
/*
{ _id: "shard0001", host: "...", tags: ["US-EAST"] }
{ _id: "shard0002", host: "...", tags: ["US-WEST"] }
{ _id: "shard0003", host: "...", tags: ["EU"] }
{ _id: "shard0004", host: "...", tags: ["ASIA"] }
*/

// Step 2: Shard collection by region
sh.shardCollection("myDatabase.users", {
  region: 1,
  userId: 1
});

// Step 3: Define zone ranges
sh.updateZoneKeyRange(
  "myDatabase.users",
  { region: "us-east", userId: MinKey },
  { region: "us-east", userId: MaxKey },
  "US-EAST"
);

sh.updateZoneKeyRange(
  "myDatabase.users",
  { region: "us-west", userId: MinKey },
  { region: "us-west", userId: MaxKey },
  "US-WEST"
);

sh.updateZoneKeyRange(
  "myDatabase.users",
  { region: "eu", userId: MinKey },
  { region: "eu", userId: MaxKey },
  "EU"
);

sh.updateZoneKeyRange(
  "myDatabase.users",
  { region: "asia", userId: MinKey },
  { region: "asia", userId: MaxKey },
  "ASIA"
);

// Verify zones
sh.status();

// Step 4: Insert data
db.users.insertOne({
  userId: "user123",
  region: "us-east",  // Will go to US-EAST zone
  name: "John"
});

db.users.insertOne({
  userId: "user456",
  region: "eu",  // Will go to EU zone
  name: "Pierre"
});

// ===== QUERY TARGETING =====

// Query with region: targeted to specific zone
db.users.find({ region: "us-east" });
// → Routes to US-EAST shard only

// Query without region: scatter-gather
db.users.find({ name: "John" });
// → Queries all shards`}</code>
                  </pre>
                </div>

                {/* Hot/Cold Data */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    2. Hot/Cold Data Tiering
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== SETUP TIERED STORAGE =====

// Shards with SSD storage (hot data)
sh.addShardToZone("shard-ssd-01", "HOT");
sh.addShardToZone("shard-ssd-02", "HOT");

// Shards with HDD storage (cold data)
sh.addShardToZone("shard-hdd-01", "COLD");
sh.addShardToZone("shard-hdd-02", "COLD");

// Shard collection by date
sh.shardCollection("myDatabase.events", {
  eventDate: 1,
  _id: 1
});

// ===== DEFINE TIME-BASED ZONES =====

// Recent data (last 30 days) → HOT zone
const thirtyDaysAgo = new Date();
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

sh.updateZoneKeyRange(
  "myDatabase.events",
  { eventDate: thirtyDaysAgo, _id: MinKey },
  { eventDate: MaxKey, _id: MaxKey },
  "HOT"
);

// Old data (older than 30 days) → COLD zone
sh.updateZoneKeyRange(
  "myDatabase.events",
  { eventDate: MinKey, _id: MinKey },
  { eventDate: thirtyDaysAgo, _id: MaxKey },
  "COLD"
);

// ===== AUTOMATIC MIGRATION =====

// As data ages, balancer automatically migrates
// from HOT to COLD zone

// ===== PERIODIC ZONE UPDATE =====

// Cron job to update zones daily
// Move yesterday's data boundary

function updateHotColdBoundary() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  // Remove old zone definitions
  sh.removeRangeFromZone(
    "myDatabase.events",
    { eventDate: MinKey, _id: MinKey },
    { eventDate: MaxKey, _id: MaxKey }
  );
  
  // Redefine with new boundary
  sh.updateZoneKeyRange(
    "myDatabase.events",
    { eventDate: thirtyDaysAgo, _id: MinKey },
    { eventDate: MaxKey, _id: MaxKey },
    "HOT"
  );
  
  sh.updateZoneKeyRange(
    "myDatabase.events",
    { eventDate: MinKey, _id: MinKey },
    { eventDate: thirtyDaysAgo, _id: MaxKey },
    "COLD"
  );
}

// Run daily
// crontab: 0 0 * * * node updateZones.js`}</code>
                  </pre>
                </div>

                {/* Multi-Tenant Zones */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    3. Multi-Tenant Zone Isolation
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== TENANT ISOLATION =====

// Dedicated shards for premium tenants
sh.addShardToZone("shard-premium-01", "PREMIUM");
sh.addShardToZone("shard-premium-02", "PREMIUM");

// Shared shards for standard tenants
sh.addShardToZone("shard-standard-01", "STANDARD");
sh.addShardToZone("shard-standard-02", "STANDARD");

// Shard collection by tenantId
sh.shardCollection("myDatabase.data", {
  tenantId: 1,
  _id: 1
});

// ===== ASSIGN TENANTS TO ZONES =====

// Premium tenants
const premiumTenants = ["tenant-001", "tenant-002", "tenant-003"];

premiumTenants.forEach(tenantId => {
  sh.updateZoneKeyRange(
    "myDatabase.data",
    { tenantId: tenantId, _id: MinKey },
    { tenantId: tenantId, _id: MaxKey },
    "PREMIUM"
  );
});

// All other tenants → STANDARD zone
// (default if no zone range matches)

// ===== TENANT MIGRATION =====

// Upgrade tenant to premium
function upgradeTenantToPremium(tenantId) {
  // Remove from STANDARD zone if exists
  sh.removeRangeFromZone(
    "myDatabase.data",
    { tenantId: tenantId, _id: MinKey },
    { tenantId: tenantId, _id: MaxKey }
  );
  
  // Add to PREMIUM zone
  sh.updateZoneKeyRange(
    "myDatabase.data",
    { tenantId: tenantId, _id: MinKey },
    { tenantId: tenantId, _id: MaxKey },
    "PREMIUM"
  );
  
  console.log(\`Tenant \${tenantId} upgraded to PREMIUM\`);
  // Balancer will migrate data to premium shards
}

// Usage
upgradeTenantToPremium("tenant-004");`}</code>
                  </pre>
                </div>

                {/* Zone Management */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    4. Zone Management Commands
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== VIEW ZONES =====

// List all shard zones
use config
db.shards.find({}, { _id: 1, tags: 1 });

// List all zone ranges
db.tags.find().pretty();

// Output:
/*
{
  _id: { ns: "myDatabase.users", min: { region: "us-east", ... } },
  ns: "myDatabase.users",
  min: { region: "us-east", userId: MinKey },
  max: { region: "us-east", userId: MaxKey },
  tag: "US-EAST"
}
*/

// ===== REMOVE ZONES =====

// Remove shard from zone
sh.removeShardFromZone("shard0001", "US-EAST");

// Remove zone range
sh.removeRangeFromZone(
  "myDatabase.users",
  { region: "us-east", userId: MinKey },
  { region: "us-east", userId: MaxKey }
);

// ===== MULTIPLE ZONES PER SHARD =====

// Shard can belong to multiple zones
sh.addShardToZone("shard0001", "US-EAST");
sh.addShardToZone("shard0001", "PREMIUM");
sh.addShardToZone("shard0001", "HOT");

// Useful for complex placement rules

// ===== VERIFY ZONE COMPLIANCE =====

// Check if chunks are in correct zones
use config

db.chunks.aggregate([
  {
    $lookup: {
      from: "shards",
      localField: "shard",
      foreignField: "_id",
      as: "shardInfo"
    }
  },
  {
    $lookup: {
      from: "tags",
      let: { ns: "$ns", min: "$min" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$ns", "$$ns"] },
                { $lte: ["$min", "$$min"] },
                { $gte: ["$max", "$$min"] }
              ]
            }
          }
        }
      ],
      as: "zoneInfo"
    }
  },
  {
    $project: {
      ns: 1,
      shard: 1,
      shardZones: { $arrayElemAt: ["$shardInfo.tags", 0] },
      expectedZone: { $arrayElemAt: ["$zoneInfo.tag", 0] }
    }
  }
]);

// ===== PROGRAMMATIC ZONE MANAGEMENT =====

const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://mongos:27016");
await client.connect();

const adminDb = client.db("admin");

// Add shard to zone
await adminDb.command({
  addShardToZone: "shard0001",
  zone: "US-EAST"
});

// Update zone key range
await adminDb.command({
  updateZoneKeyRange: "myDatabase.users",
  min: { region: "us-east", userId: MinKey },
  max: { region: "us-east", userId: MaxKey },
  zone: "US-EAST"
});

// Remove shard from zone
await adminDb.command({
  removeShardFromZone: "shard0001",
  zone: "US-EAST"
});

await client.close();`}</code>
                  </pre>
                </div>
              </section>
            </>
          )}

          {/* Monitoring Tab */}
          {activeTab === "monitoring" && (
            <>
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  Sharding Monitoring & Management
                </h2>

                {/* Cluster Status */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    1. Cluster Status Monitoring
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== SHARD STATUS =====

// Comprehensive shard status
sh.status();

// Shows:
// - Sharded databases
// - Collections and shard keys
// - Chunks per shard
// - Balancer state
// - Zone configurations

// ===== COLLECTION DISTRIBUTION =====

// Check data distribution
use myDatabase
db.users.getShardDistribution();

// Output:
/*
Shard shard0001 at shard0001/host1:27017,host2:27017
  data: 12.5GB docs: 2500000 chunks: 50
  estimated data per chunk: 256MB
  estimated docs per chunk: 50000

Shard shard0002 at shard0002/host3:27017,host4:27017
  data: 12.3GB docs: 2460000 chunks: 49
  estimated data per chunk: 251MB
  estimated docs per chunk: 50204

Totals
  data: 24.8GB docs: 4960000 chunks: 99
*/

// ===== CHUNK DISTRIBUTION =====

use config

// Count chunks per shard
db.chunks.aggregate([
  { $group: { _id: "$shard", count: { $sum: 1 } } },
  { $sort: { count: -1 } }
]);

// View chunk ranges
db.chunks.find({ ns: "myDatabase.users" })
  .sort({ min: 1 })
  .pretty();

// ===== BALANCER STATUS =====

// Check if balancer is running
sh.isBalancerRunning();

// Get balancer state
sh.getBalancerState();

// View recent balancer operations
db.actionlog.find({ what: "balancer.round" })
  .sort({ time: -1 })
  .limit(5)
  .pretty();

// ===== MIGRATION STATUS =====

// Check ongoing migrations
use config
db.locks.find({ state: { $exists: true } });

// Migration statistics
db.changelog.aggregate([
  { $match: { what: "moveChunk.commit" } },
  { $group: {
    _id: "$details.from",
    migrations: { $sum: 1 },
    avgTime: { $avg: "$details.step3" }
  }}
]);`}</code>
                  </pre>
                </div>

                {/* Performance Monitoring */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    2. Performance Monitoring
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== QUERY PERFORMANCE =====

// Check if query targets specific shard
db.users.find({ userId: "user123" }).explain("executionStats");

// Look for:
// - "shards": [] - which shards queried
// - "nReturned": number of documents
// - "executionTimeMillis": query time

// Targeted query (good):
/*
{
  "shards": {
    "shard0001": { ... }  // Only one shard
  }
}
*/

// Scatter-gather (potentially slow):
/*
{
  "shards": {
    "shard0001": { ... },
    "shard0002": { ... },
    "shard0003": { ... }  // All shards queried
  }
}
*/

// ===== IDENTIFY SLOW QUERIES =====

// Enable profiling on sharded cluster
// Must enable on each shard

db.setProfilingLevel(1, { slowms: 100 });

// View slow queries
db.system.profile.find({ millis: { $gt: 100 } })
  .sort({ ts: -1 })
  .limit(10);

// ===== HOTSPOT DETECTION =====

// Monitor operations per second per shard
const { MongoClient } = require("mongodb");

async function monitorShardLoad() {
  const client = new MongoClient("mongodb://mongos:27016");
  await client.connect();
  
  const adminDb = client.db("admin");
  
  // Get server status for each shard
  const shardStatus = await adminDb.command({
    listShards: 1
  });
  
  for (const shard of shardStatus.shards) {
    const shardConn = client.db("admin").admin().command({
      connPoolStats: 1
    });
    
    console.log(\`Shard: \${shard._id}\`);
    console.log(\`  Operations: \${shardConn.totalInUse}\`);
    console.log(\`  Available: \${shardConn.totalAvailable}\`);
  }
  
  await client.close();
}

// Run periodically
setInterval(monitorShardLoad, 10000);

// ===== MONITOR CHUNK SPLITS =====

use config

// Recent splits
db.changelog.find({ what: "split" })
  .sort({ time: -1 })
  .limit(10);

// Splits by collection
db.changelog.aggregate([
  { $match: { what: "split" } },
  { $group: {
    _id: "$ns",
    splits: { $sum: 1 }
  }},
  { $sort: { splits: -1 } }
]);

// Frequent splits may indicate:
// - Aggressive write patterns
// - Improper shard key
// - Too small chunk size`}</code>
                  </pre>
                </div>

                {/* Maintenance Operations */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    3. Maintenance Operations
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== ADDING NEW SHARD =====

// Add new shard to cluster
sh.addShard("shard0005/host9:27017,host10:27017");

// Verify added
sh.status();

// Balancer will automatically migrate chunks to new shard

// ===== REMOVING SHARD =====

// Start shard removal (drain chunks)
use admin
db.runCommand({ removeShard: "shard0005" });

// Check drain progress
db.runCommand({ removeShard: "shard0005" });

// Output shows remaining chunks:
/*
{
  msg: "draining ongoing",
  state: "ongoing",
  remaining: {
    chunks: 10,
    dbs: 0
  }
}
*/

// When complete:
/*
{
  msg: "removeshard completed successfully",
  state: "completed"
}
*/

// ===== REFINING SHARD KEY (MongoDB 5.0+) =====

// Add suffix to existing shard key
db.adminCommand({
  refineCollectionShardKey: "myDatabase.users",
  key: { userId: 1, timestamp: 1 }  // Add timestamp
});

// Existing: { userId: 1 }
// New: { userId: 1, timestamp: 1 }

// ===== RESHARDING (MongoDB 5.0+) =====

// Change shard key completely
db.adminCommand({
  reshardCollection: "myDatabase.products",
  key: { category: 1, _id: "hashed" },  // New shard key
  numInitialChunks: 100
});

// MongoDB will:
// 1. Create temporary collection
// 2. Copy and reshard data
// 3. Replace original collection
// 4. Clean up

// ===== COMPACT CHUNKS =====

// Force chunk migration to consolidate
sh.moveChunk(
  "myDatabase.users",
  { userId: "user100" },
  "shard0001"
);

// ===== DATABASE PRIMARY SHARD =====

// Each database has primary shard for unsharded collections
// Check current primary
use config
db.databases.find({ _id: "myDatabase" });

// Change primary shard
db.adminCommand({
  movePrimary: "myDatabase",
  to: "shard0002"
});`}</code>
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
                  <strong>Test shard key:</strong> Analyze cardinality and
                  distribution before production
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Include shard key in queries:</strong> Target specific
                  shards for performance
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Avoid low cardinality:</strong> Ensure many distinct
                  values
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Hash monotonic keys:</strong> Prevent write hotspots
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Use zones for compliance:</strong> Meet data residency
                  requirements
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Monitor balancer:</strong> Ensure even distribution
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Schedule balancer windows:</strong> Avoid peak hours
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Pre-split for bulk loads:</strong> Avoid migration
                  overhead
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Regular status checks:</strong> Monitor chunk
                  distribution
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Plan for growth:</strong> Choose shard key that scales
                </span>
              </li>
            </ul>
          </section>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8">
            <Link
              href="/phase9/sharding-architecture"
              className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              ← Previous: Sharding Architecture
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
