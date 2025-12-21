"use client";

import Link from "next/link";
import { useState } from "react";

export default function ReplicaSetsPage() {
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
          Replica Sets & Architecture
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          High Availability, Elections, and Replication
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
            onClick={() => setActiveTab("elections")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "elections"
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Elections
          </button>
          <button
            onClick={() => setActiveTab("oplog")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "oplog"
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Oplog & Sync
          </button>
        </div>

        <div className="space-y-8">
          {/* Architecture Tab */}
          {activeTab === "architecture" && (
            <>
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  📚 Replica Sets Theory
                </h2>

                <div className="space-y-4 text-gray-200">
                  <p className="text-lg">
                    A <strong>Replica Set</strong> is a group of MongoDB servers
                    that maintain the same data set, providing redundancy and
                    high availability.
                  </p>

                  <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                    Key Components
                  </h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong>Primary:</strong> Receives all write operations
                    </li>
                    <li>
                      <strong>Secondary:</strong> Replicate primary&apos;s data
                    </li>
                    <li>
                      <strong>Arbiter:</strong> Participates in elections only
                      (no data)
                    </li>
                  </ul>

                  <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                    Minimum Configuration
                  </h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong>Production:</strong> 3 data-bearing members (1
                      Primary + 2 Secondaries)
                    </li>
                    <li>
                      <strong>Alternative:</strong> 2 data members + 1 Arbiter
                    </li>
                    <li>
                      <strong>Maximum:</strong> 50 members (7 voting members)
                    </li>
                  </ul>

                  <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                    Benefits
                  </h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong>High Availability:</strong> Automatic failover
                    </li>
                    <li>
                      <strong>Data Redundancy:</strong> Multiple data copies
                    </li>
                    <li>
                      <strong>Read Scaling:</strong> Distribute reads to
                      secondaries
                    </li>
                    <li>
                      <strong>Disaster Recovery:</strong> Geographically
                      distributed
                    </li>
                  </ul>
                </div>
              </section>

              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  Replica Set Configuration
                </h2>

                {/* Initialize Replica Set */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    1. Initialize Replica Set
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== START MONGODB INSTANCES =====

// Terminal 1 - Primary
mongod --replSet rs0 --port 27017 --dbpath /data/db1

// Terminal 2 - Secondary 1
mongod --replSet rs0 --port 27018 --dbpath /data/db2

// Terminal 3 - Secondary 2
mongod --replSet rs0 --port 27019 --dbpath /data/db3

// ===== CONNECT AND INITIALIZE =====

// Connect to one instance
mongosh --port 27017

// Initialize replica set
rs.initiate({
  _id: "rs0",
  members: [
    { _id: 0, host: "localhost:27017" },
    { _id: 1, host: "localhost:27018" },
    { _id: 2, host: "localhost:27019" }
  ]
});

// Check status
rs.status();

// Check configuration
rs.conf();

// ===== ADD MEMBERS AFTER INIT =====

// Add secondary
rs.add("localhost:27020");

// Add with configuration
rs.add({
  _id: 3,
  host: "localhost:27020",
  priority: 0.5,
  votes: 1
});

// Add arbiter
rs.addArb("localhost:27021");

// ===== REMOVE MEMBERS =====

rs.remove("localhost:27020");

// ===== MEMBER CONFIGURATION =====

cfg = rs.conf();

// Modify member
cfg.members[1].priority = 2;
cfg.members[1].hidden = false;
cfg.members[1].slaveDelay = 0;

// Reconfigure
rs.reconfig(cfg);`}</code>
                  </pre>
                </div>

                {/* Member Priorities */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    2. Member Priorities & Settings
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== PRIORITY =====

// Priority: 0-1000 (default: 1)
// Higher priority = more likely to become primary
// Priority 0 = cannot become primary

cfg = rs.conf();

// High priority member (preferred primary)
cfg.members[0].priority = 10;

// Normal priority
cfg.members[1].priority = 1;

// Passive member (cannot be primary)
cfg.members[2].priority = 0;

rs.reconfig(cfg);

// ===== HIDDEN MEMBERS =====

// Hidden members:
// - Cannot be primary (priority must be 0)
// - Not visible to application drivers
// - Can vote in elections
// - Good for backups, analytics

cfg.members[2].priority = 0;
cfg.members[2].hidden = true;
rs.reconfig(cfg);

// ===== DELAYED MEMBERS =====

// Delayed secondary:
// - Lags behind primary by specified time
// - Protection against human errors
// - Must be hidden and priority 0

cfg.members[3].priority = 0;
cfg.members[3].hidden = true;
cfg.members[3].slaveDelay = 3600;  // 1 hour delay
rs.reconfig(cfg);

// ===== VOTES =====

// Voting: 0 or 1 (default: 1)
// Maximum 7 voting members

cfg.members[4].votes = 0;  // Non-voting member
rs.reconfig(cfg);

// ===== TAGS =====

// Tags for targeting specific members

cfg.members[0].tags = { dc: "east", usage: "production" };
cfg.members[1].tags = { dc: "west", usage: "production" };
cfg.members[2].tags = { dc: "east", usage: "reporting" };
rs.reconfig(cfg);

// ===== ARBITER =====

// Arbiters:
// - No data replication
// - Participate in elections only
// - Use minimal resources
// - Not recommended for production

rs.addArb("localhost:27021");`}</code>
                  </pre>
                </div>

                {/* Connection String */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    3. Connect to Replica Set
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== MONGODB NATIVE DRIVER =====

const { MongoClient } = require("mongodb");

// Connection string with replica set
const uri = "mongodb://localhost:27017,localhost:27018,localhost:27019/?replicaSet=rs0";

const client = new MongoClient(uri, {
  // Connection options
  replicaSet: "rs0",
  readPreference: "primary",
  w: "majority",
  retryWrites: true,
  retryReads: true,
  serverSelectionTimeoutMS: 5000
});

await client.connect();
console.log("Connected to replica set");

const db = client.db("myDatabase");

// ===== MONGOOSE =====

const mongoose = require("mongoose");

await mongoose.connect(
  "mongodb://localhost:27017,localhost:27018,localhost:27019/myDatabase?replicaSet=rs0",
  {
    replicaSet: "rs0"
  }
);

// ===== WITH AUTHENTICATION =====

const authUri = "mongodb://user:password@localhost:27017,localhost:27018,localhost:27019/admin?replicaSet=rs0&authSource=admin";

// ===== MONGODB ATLAS =====

const atlasUri = "mongodb+srv://username:password@cluster0.mongodb.net/myDatabase?retryWrites=true&w=majority";

await client.close();`}</code>
                  </pre>
                </div>

                {/* Monitoring */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    4. Monitoring Replica Set
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== STATUS COMMANDS =====

// Full replica set status
rs.status();

// Check if instance is master
db.isMaster();

// Configuration
rs.conf();

// Print replica set info
rs.printReplicationInfo();

// Print secondary replication info
rs.printSecondaryReplicationInfo();

// ===== HEALTH CHECKS =====

// Member states:
// - PRIMARY (1)
// - SECONDARY (2)
// - RECOVERING (3)
// - STARTUP (0)
// - STARTUP2 (5)
// - UNKNOWN (6)
// - ARBITER (7)
// - DOWN (8)
// - ROLLBACK (9)
// - REMOVED (10)

// Check member health
rs.status().members.forEach(member => {
  console.log(\`\${member.name}: \${member.stateStr}\`);
});

// ===== PROGRAMMATIC MONITORING =====

const { MongoClient } = require("mongodb");

const client = new MongoClient(uri);
await client.connect();

// Get replica set status
const adminDb = client.db("admin");
const status = await adminDb.command({ replSetGetStatus: 1 });

console.log("Replica Set:", status.set);
console.log("Members:");

status.members.forEach(member => {
  console.log(\`  \${member.name}: \${member.stateStr}\`);
  console.log(\`    Health: \${member.health}\`);
  console.log(\`    Optime: \${member.optimeDate}\`);
});

// Check if connected to primary
const isMaster = await adminDb.command({ isMaster: 1 });
console.log("Is Primary:", isMaster.ismaster);
console.log("Primary:", isMaster.primary);
console.log("Hosts:", isMaster.hosts);

await client.close();`}</code>
                  </pre>
                </div>
              </section>
            </>
          )}

          {/* Elections Tab */}
          {activeTab === "elections" && (
            <>
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  📚 Elections Theory
                </h2>

                <div className="space-y-4 text-gray-200">
                  <p className="text-lg">
                    <strong>Elections</strong> determine which member becomes
                    the primary when the current primary becomes unavailable.
                  </p>

                  <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                    When Elections Occur
                  </h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Primary becomes unavailable</li>
                    <li>Replica set initialization</li>
                    <li>Adding a new member to the set</li>
                    <li>Manual stepdown (rs.stepDown())</li>
                    <li>Secondary has higher priority and can catch up</li>
                  </ul>

                  <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                    Election Process
                  </h3>
                  <ol className="list-decimal list-inside space-y-2 ml-4">
                    <li>Member requests votes from other members</li>
                    <li>
                      Members vote based on priority, recency, and connectivity
                    </li>
                    <li>Majority votes (more than half) needed to win</li>
                    <li>Member with majority becomes primary</li>
                    <li>Election typically completes in seconds</li>
                  </ol>

                  <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                    Factors Affecting Elections
                  </h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong>Priority:</strong> Higher priority members
                      preferred
                    </li>
                    <li>
                      <strong>Oplog Position:</strong> Most up-to-date member
                      preferred
                    </li>
                    <li>
                      <strong>Network Connectivity:</strong> Must reach majority
                    </li>
                    <li>
                      <strong>Votes:</strong> Need majority of voting members
                    </li>
                  </ul>
                </div>
              </section>

              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  Election Commands & Examples
                </h2>

                {/* Triggering Elections */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    1. Triggering Elections
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== MANUAL STEPDOWN =====

// Force primary to step down
// Connect to primary
rs.stepDown();

// Step down with specific duration
rs.stepDown(120);  // Step down for 120 seconds

// Step down and wait for secondary to catch up
rs.stepDown(60, 30);  // Wait 30s for secondary to catch up

// ===== FREEZE MEMBER =====

// Prevent member from seeking election
rs.freeze(120);  // Freeze for 120 seconds

// Unfreeze (allow to seek election)
rs.freeze(0);

// ===== RECONFIGURE TO TRIGGER =====

cfg = rs.conf();
cfg.members[1].priority = 5;  // Increase priority
rs.reconfig(cfg);

// If secondary is eligible and caught up, election may occur

// ===== PROGRAMMATIC STEPDOWN =====

const { MongoClient } = require("mongodb");

const client = new MongoClient(uri);
await client.connect();

const adminDb = client.db("admin");

// Step down primary
await adminDb.command({
  replSetStepDown: 60,  // Step down for 60 seconds
  secondaryCatchUpPeriodSecs: 30  // Wait for secondary
});

await client.close();`}</code>
                  </pre>
                </div>

                {/* Priority-based Elections */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    2. Priority-based Elections
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== CONFIGURE PRIORITIES =====

cfg = rs.conf();

// Datacenter preference
// East datacenter (preferred)
cfg.members[0].priority = 10;  // Highest priority
cfg.members[1].priority = 9;

// West datacenter (fallback)
cfg.members[2].priority = 5;
cfg.members[3].priority = 4;

// Analytics member (never primary)
cfg.members[4].priority = 0;

rs.reconfig(cfg);

// ===== DISASTER RECOVERY SCENARIO =====

// Primary data center fails
// Secondary with highest priority in other DC becomes primary

// Manual failover to specific member:

// 1. Connect to desired new primary
// 2. Check it's a secondary
rs.status();

// 3. Increase its priority temporarily
cfg = rs.conf();
cfg.members[2].priority = 100;
rs.reconfig(cfg);

// 4. Step down current primary (if available)
rs.stepDown();

// 5. New member with highest priority becomes primary

// 6. Later, restore original priorities
cfg = rs.conf();
cfg.members[2].priority = 5;
rs.reconfig(cfg);`}</code>
                  </pre>
                </div>

                {/* Election Monitoring */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    3. Monitoring Elections
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== CHECK ELECTION STATUS =====

// Get election metrics
const adminDb = client.db("admin");

const serverStatus = await adminDb.command({ serverStatus: 1 });
const electionMetrics = serverStatus.electionMetrics;

console.log("Election Metrics:");
console.log("  Step Up Attempts:", electionMetrics.numStepUpCmd);
console.log("  Priority Takeovers:", electionMetrics.numPriorityTakeovers);
console.log("  Catchup Takeovers:", electionMetrics.numCatchUps);
console.log("  Elections Called:", electionMetrics.numElectionsSuccessful);

// ===== REPLICA SET STATUS =====

const status = await adminDb.command({ replSetGetStatus: 1 });

status.members.forEach(member => {
  console.log(\`\${member.name}:\`);
  console.log(\`  State: \${member.stateStr}\`);
  console.log(\`  Health: \${member.health}\`);
  console.log(\`  Optime: \${member.optimeDate}\`);
  
  if (member.electionDate) {
    console.log(\`  Election Date: \${member.electionDate}\`);
  }
});

// ===== LOG ANALYSIS =====

// Check MongoDB logs for election messages
// Look for: "election succeeded", "stepping down", "syncing"

// mongosh command to tail logs
db.adminCommand({ getLog: "global" }).log.forEach(log => {
  if (log.includes("election")) {
    console.log(log);
  }
});`}</code>
                  </pre>
                </div>
              </section>
            </>
          )}

          {/* Oplog & Sync Tab */}
          {activeTab === "oplog" && (
            <>
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  📚 Oplog & Replication Theory
                </h2>

                <div className="space-y-4 text-gray-200">
                  <p className="text-lg">
                    The <strong>Oplog</strong> (operations log) is a special
                    capped collection that records all operations that modify
                    data.
                  </p>

                  <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                    How Replication Works
                  </h3>
                  <ol className="list-decimal list-inside space-y-2 ml-4">
                    <li>Client writes to primary</li>
                    <li>Primary applies operation to data</li>
                    <li>Primary records operation in oplog</li>
                    <li>Secondaries pull oplog entries</li>
                    <li>Secondaries apply operations to their data</li>
                  </ol>

                  <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                    Initial Sync
                  </h3>
                  <p>
                    When a member joins the replica set or falls too far behind:
                  </p>
                  <ol className="list-decimal list-inside space-y-2 ml-4">
                    <li>Clone all databases (except local)</li>
                    <li>Apply oplog entries during cloning</li>
                    <li>Build indexes</li>
                    <li>Pull and apply remaining oplog entries</li>
                    <li>Transition to secondary state</li>
                  </ol>

                  <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                    Rollback
                  </h3>
                  <p>
                    When a primary steps down before secondaries replicate all
                    writes:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Un-replicated operations are rolled back</li>
                    <li>Rolled back operations saved to rollback files</li>
                    <li>Manual intervention may be required</li>
                    <li>Use write concern &quot;majority&quot; to prevent</li>
                  </ul>
                </div>
              </section>

              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  Oplog Management
                </h2>

                {/* Oplog Inspection */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    1. Inspect Oplog
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== ACCESS OPLOG =====

// Connect to any member
use local

// View oplog collection
db.oplog.rs.find().pretty();

// ===== OPLOG SIZE =====

// Check oplog size
db.oplog.rs.stats().maxSize / (1024 * 1024);  // MB

// Check oplog time window
rs.printReplicationInfo();

// Output example:
// configured oplog size:   1024MB
// log length start to end: 7200secs (2hrs)
// oplog first event time:  Mon Jan 01 2024 10:00:00
// oplog last event time:   Mon Jan 01 2024 12:00:00

// ===== OPLOG ENTRIES =====

// View recent entries
db.oplog.rs.find().sort({ $natural: -1 }).limit(10);

// Oplog entry structure:
/*
{
  ts: Timestamp(1234567890, 1),  // Operation timestamp
  t: NumberLong("1"),            // Term
  h: NumberLong("123456"),       // Hash
  v: 2,                          // Oplog version
  op: "i",                       // Operation type
  ns: "mydb.users",              // Namespace
  o: { _id: ObjectId("..."), name: "John" },  // Operation
  wall: ISODate("...")           // Wall clock time
}
*/

// Operation types:
// "i" - insert
// "u" - update
// "d" - delete
// "c" - command
// "n" - no-op

// ===== PROGRAMMATIC ACCESS =====

const { MongoClient } = require("mongodb");

const client = new MongoClient(uri);
await client.connect();

const local = client.db("local");
const oplog = local.collection("oplog.rs");

// Get oplog stats
const stats = await oplog.stats();
console.log("Oplog size:", stats.maxSize / (1024 * 1024), "MB");
console.log("Document count:", stats.count);

// Get first and last entries
const first = await oplog.find().sort({ $natural: 1 }).limit(1).toArray();
const last = await oplog.find().sort({ $natural: -1 }).limit(1).toArray();

console.log("First entry:", first[0].ts);
console.log("Last entry:", last[0].ts);

// Time difference
const timeWindow = (last[0].ts.getHighBits() - first[0].ts.getHighBits());
console.log("Oplog window:", timeWindow, "seconds");

await client.close();`}</code>
                  </pre>
                </div>

                {/* Replication Lag */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    2. Monitor Replication Lag
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== CHECK REPLICATION LAG =====

// On mongosh
rs.printSecondaryReplicationInfo();

// Output shows lag for each secondary:
// source: localhost:27018
//   syncedTo: Mon Jan 01 2024 12:00:00 GMT+0000 (UTC)
//   0 secs (0 hrs) behind the primary

// ===== PROGRAMMATIC LAG CHECK =====

const { MongoClient } = require("mongodb");

const client = new MongoClient(uri);
await client.connect();

const adminDb = client.db("admin");
const status = await adminDb.command({ replSetGetStatus: 1 });

const primary = status.members.find(m => m.state === 1);
const primaryOptime = primary.optimeDate;

console.log("Replication Lag:");

status.members.forEach(member => {
  if (member.state === 2) {  // Secondary
    const lag = (primaryOptime - member.optimeDate) / 1000;
    console.log(\`  \${member.name}: \${lag} seconds\`);
    
    if (lag > 10) {
      console.warn(\`    WARNING: High lag on \${member.name}\`);
    }
  }
});

// ===== MONITORING SCRIPT =====

async function monitorReplication() {
  const status = await adminDb.command({ replSetGetStatus: 1 });
  
  const metrics = {
    replSetName: status.set,
    members: []
  };
  
  const primary = status.members.find(m => m.state === 1);
  
  status.members.forEach(member => {
    const memberInfo = {
      name: member.name,
      state: member.stateStr,
      health: member.health,
      optime: member.optimeDate
    };
    
    if (member.state === 2 && primary) {
      memberInfo.lagSeconds = (primary.optimeDate - member.optimeDate) / 1000;
    }
    
    metrics.members.push(memberInfo);
  });
  
  return metrics;
}

// Run every 10 seconds
setInterval(async () => {
  const metrics = await monitorReplication();
  console.log(JSON.stringify(metrics, null, 2));
}, 10000);

await client.close();`}</code>
                  </pre>
                </div>

                {/* Rollback Handling */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    3. Rollback Detection & Recovery
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== DETECT ROLLBACK =====

// Check member state
rs.status().members.forEach(member => {
  if (member.state === 9) {  // ROLLBACK state
    console.log(\`Rollback on \${member.name}\`);
  }
});

// Check MongoDB logs
db.adminCommand({ getLog: "global" }).log.forEach(log => {
  if (log.includes("rollback")) {
    console.log(log);
  }
});

// ===== ROLLBACK FILES =====

// Rollback files location:
// <dbpath>/rollback/

// File format:
// <database>.<collection>.<timestamp>.bson

// Example:
// mydb.users.2024-01-01T12-00-00.0.bson

// ===== RECOVER FROM ROLLBACK =====

// 1. Identify rollback files
// ls /data/db/rollback/

// 2. Extract documents
// mongorestore --db mydb --collection users /data/db/rollback/mydb.users.*.bson

// 3. Or use bsondump to inspect
// bsondump /data/db/rollback/mydb.users.*.bson

// ===== PREVENT ROLLBACK =====

// Use write concern "majority"
const result = await collection.insertOne(
  { name: "John" },
  { writeConcern: { w: "majority" } }
);

// Mongoose
await User.create(
  { name: "John" },
  { writeConcern: { w: "majority" } }
);

// ===== ROLLBACK MONITORING =====

async function checkForRollback() {
  const status = await adminDb.command({ replSetGetStatus: 1 });
  
  const rollbackMembers = status.members.filter(m => m.state === 9);
  
  if (rollbackMembers.length > 0) {
    console.error("ROLLBACK DETECTED:");
    rollbackMembers.forEach(member => {
      console.error(\`  Member: \${member.name}\`);
      console.error(\`  State: \${member.stateStr}\`);
    });
    
    // Alert operations team
    // sendAlert("Rollback detected", rollbackMembers);
  }
  
  return rollbackMembers;
}

// Check periodically
setInterval(checkForRollback, 30000);  // Every 30 seconds`}</code>
                  </pre>
                </div>

                {/* Initial Sync */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    4. Initial Sync Management
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== TRIGGER INITIAL SYNC =====

// On the member to re-sync:

// 1. Stop MongoDB
// 2. Delete data directory (except config files)
// rm -rf /data/db/*

// 3. Restart MongoDB
// Member will automatically start initial sync

// ===== MONITOR INITIAL SYNC =====

// Check member state
rs.status().members.forEach(member => {
  if (member.stateStr === "STARTUP2") {
    console.log(\`Initial sync in progress: \${member.name}\`);
    
    // Get sync progress
    const currentOp = db.currentOp();
    const syncOp = currentOp.inprog.find(op => 
      op.desc && op.desc.includes("initial sync")
    );
    
    if (syncOp) {
      console.log("Progress:", syncOp.progress);
    }
  }
});

// ===== PROGRAMMATIC MONITORING =====

async function monitorInitialSync() {
  const status = await adminDb.command({ replSetGetStatus: 1 });
  
  const syncingMembers = status.members.filter(
    m => m.state === 5  // STARTUP2
  );
  
  if (syncingMembers.length > 0) {
    console.log("Initial Sync in Progress:");
    
    for (const member of syncingMembers) {
      console.log(\`  Member: \${member.name}\`);
      console.log(\`  State: \${member.stateStr}\`);
      
      // Get current operations
      const currentOp = await adminDb.command({
        currentOp: true,
        desc: { $regex: "initial sync" }
      });
      
      if (currentOp.inprog.length > 0) {
        console.log("  Operations:", currentOp.inprog.length);
      }
    }
  }
}

// ===== INITIAL SYNC SETTINGS =====

// Configure initial sync behavior (MongoDB 4.4+)
db.adminCommand({
  setParameter: 1,
  initialSyncOplogBuffer: 100 * 1024 * 1024  // 100MB
});

// Maximum number of initial sync attempts
db.adminCommand({
  setParameter: 1,
  numInitialSyncAttempts: 10
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
                  <strong>Odd number of members:</strong> Ensures majority for
                  elections
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Geographic distribution:</strong> Spread members
                  across data centers
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Priority configuration:</strong> Prefer specific
                  members as primary
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Hidden members:</strong> Use for backups and analytics
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Delayed members:</strong> Protection against human
                  errors
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Avoid arbiters:</strong> Use data-bearing members in
                  production
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Monitor replication lag:</strong> Alert on high lag
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Adequate oplog size:</strong> Ensure sufficient time
                  window
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Write concern majority:</strong> Prevent rollback
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Regular testing:</strong> Test failover procedures
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
              href="/phase8/read-write-concerns"
              className="bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-500 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              Next: Read & Write Concerns →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
