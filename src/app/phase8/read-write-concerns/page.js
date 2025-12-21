"use client";

import Link from "next/link";
import { useState } from "react";

export default function ReadWriteConcernsPage() {
  const [activeTab, setActiveTab] = useState("readPreference");

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
          Read & Write Concerns
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Control consistency and durability guarantees
        </p>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 flex-wrap">
          <button
            onClick={() => setActiveTab("readPreference")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "readPreference"
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Read Preferences
          </button>
          <button
            onClick={() => setActiveTab("writeConcern")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "writeConcern"
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Write Concerns
          </button>
          <button
            onClick={() => setActiveTab("readConcern")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "readConcern"
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Read Concerns
          </button>
        </div>

        <div className="space-y-8">
          {/* Read Preferences Tab */}
          {activeTab === "readPreference" && (
            <>
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  📚 Read Preferences Theory
                </h2>

                <div className="space-y-4 text-gray-200">
                  <p className="text-lg">
                    <strong>Read Preferences</strong> determine which members of
                    a replica set MongoDB routes read operations to.
                  </p>

                  <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                    Read Preference Modes
                  </h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong>primary (default):</strong> Read from primary only
                    </li>
                    <li>
                      <strong>primaryPreferred:</strong> Read from primary,
                      fallback to secondary
                    </li>
                    <li>
                      <strong>secondary:</strong> Read from secondary only
                    </li>
                    <li>
                      <strong>secondaryPreferred:</strong> Read from secondary,
                      fallback to primary
                    </li>
                    <li>
                      <strong>nearest:</strong> Read from member with lowest
                      network latency
                    </li>
                  </ul>

                  <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                    Use Cases
                  </h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong>primary:</strong> Strong consistency required
                    </li>
                    <li>
                      <strong>secondary:</strong> Analytics, reporting (stale
                      reads OK)
                    </li>
                    <li>
                      <strong>nearest:</strong> Minimize latency for
                      geo-distributed apps
                    </li>
                    <li>
                      <strong>primaryPreferred:</strong> High availability with
                      consistency preference
                    </li>
                  </ul>
                </div>
              </section>

              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  Read Preference Examples
                </h2>

                {/* MongoDB Native Driver */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    1. MongoDB Native Driver
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`const { MongoClient, ReadPreference } = require("mongodb");

const uri = "mongodb://localhost:27017,localhost:27018,localhost:27019/?replicaSet=rs0";
const client = new MongoClient(uri);

await client.connect();
const db = client.db("myDatabase");
const collection = db.collection("users");

// ===== PRIMARY (DEFAULT) =====

// Read from primary only
const users = await collection.find().toArray();

// Explicit primary
const primaryUsers = await collection
  .find()
  .readPreference(ReadPreference.PRIMARY)
  .toArray();

// ===== PRIMARY PREFERRED =====

// Try primary, fallback to secondary
const ppUsers = await collection
  .find()
  .readPreference(ReadPreference.PRIMARY_PREFERRED)
  .toArray();

// ===== SECONDARY =====

// Read from secondary only
const secUsers = await collection
  .find()
  .readPreference(ReadPreference.SECONDARY)
  .toArray();

// ===== SECONDARY PREFERRED =====

// Try secondary, fallback to primary
const spUsers = await collection
  .find()
  .readPreference(ReadPreference.SECONDARY_PREFERRED)
  .toArray();

// ===== NEAREST =====

// Read from nearest member (lowest latency)
const nearUsers = await collection
  .find()
  .readPreference(ReadPreference.NEAREST)
  .toArray();

// ===== WITH TAG SETS =====

// Read from members with specific tags
const taggedUsers = await collection
  .find()
  .readPreference(
    ReadPreference.SECONDARY,
    [
      { dc: "east", usage: "reporting" },  // Preferred
      { dc: "west" }                        // Fallback
    ]
  )
  .toArray();

// ===== CONNECTION-LEVEL =====

// Set read preference in connection string
const client2 = new MongoClient(
  "mongodb://localhost:27017/?replicaSet=rs0&readPreference=secondary"
);

// Set in client options
const client3 = new MongoClient(uri, {
  readPreference: ReadPreference.SECONDARY_PREFERRED
});

// ===== MAX STALENESS =====

// Only read from secondaries within 90 seconds of primary
const staleUsers = await collection
  .find()
  .readPreference(
    ReadPreference.SECONDARY,
    [],
    { maxStalenessSeconds: 90 }
  )
  .toArray();

await client.close();`}</code>
                  </pre>
                </div>

                {/* Mongoose */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    2. Mongoose Read Preferences
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`const mongoose = require("mongoose");

await mongoose.connect(
  "mongodb://localhost:27017,localhost:27018,localhost:27019/myDatabase?replicaSet=rs0"
);

const User = mongoose.model("User", new mongoose.Schema({
  name: String,
  email: String
}));

// ===== QUERY-LEVEL =====

// Primary
const users = await User.find().read("primary");

// Secondary
const analytics = await User.find().read("secondary");

// Nearest
const nearby = await User.find().read("nearest");

// ===== WITH OPTIONS =====

// Secondary with tag sets
const reporting = await User.find().read("secondary", [
  { dc: "east", usage: "reporting" },
  { dc: "west" }
]);

// ===== SCHEMA-LEVEL =====

const reportSchema = new mongoose.Schema({
  data: String,
  timestamp: Date
}, {
  read: "secondary"  // Default for this model
});

const Report = mongoose.model("Report", reportSchema);

// All queries use secondary by default
const reports = await Report.find();

// Override for specific query
const primaryReports = await Report.find().read("primary");

// ===== CONNECTION-LEVEL =====

await mongoose.connect(uri, {
  readPreference: "secondaryPreferred"
});

await mongoose.disconnect();`}</code>
                  </pre>
                </div>
              </section>
            </>
          )}

          {/* Write Concerns Tab */}
          {activeTab === "writeConcern" && (
            <>
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  📚 Write Concerns Theory
                </h2>

                <div className="space-y-4 text-gray-200">
                  <p className="text-lg">
                    <strong>Write Concerns</strong> describe the level of
                    acknowledgment requested from MongoDB for write operations.
                  </p>

                  <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                    Write Concern Options
                  </h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong>w:</strong> Number of members that must
                      acknowledge write
                    </li>
                    <li>
                      <strong>j:</strong> Wait for journal commit
                    </li>
                    <li>
                      <strong>wtimeout:</strong> Time limit for write concern
                    </li>
                  </ul>

                  <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                    Write Concern Levels
                  </h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong>w: 0:</strong> No acknowledgment (fire and forget)
                    </li>
                    <li>
                      <strong>w: 1 (default):</strong> Acknowledge from primary
                    </li>
                    <li>
                      <strong>w: &quot;majority&quot;:</strong> Acknowledge from
                      majority of members
                    </li>
                    <li>
                      <strong>w: N:</strong> Acknowledge from N members
                    </li>
                    <li>
                      <strong>w: &quot;tag&quot;:</strong> Acknowledge from
                      members with tag
                    </li>
                  </ul>

                  <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                    Trade-offs
                  </h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong>Higher w:</strong> More durability, slower writes
                    </li>
                    <li>
                      <strong>Lower w:</strong> Faster writes, less durability
                    </li>
                    <li>
                      <strong>j: true:</strong> Durability, slower writes
                    </li>
                  </ul>
                </div>
              </section>

              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  Write Concern Examples
                </h2>

                {/* MongoDB Native Driver */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    1. MongoDB Native Driver
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`const { MongoClient } = require("mongodb");

const client = new MongoClient(uri);
await client.connect();

const db = client.db("myDatabase");
const collection = db.collection("users");

// ===== W: 1 (DEFAULT) =====

// Acknowledge from primary only
await collection.insertOne({ name: "John" });

// Explicit w: 1
await collection.insertOne(
  { name: "Jane" },
  { writeConcern: { w: 1 } }
);

// ===== W: 0 (UNACKNOWLEDGED) =====

// Fire and forget (fastest, no durability guarantee)
await collection.insertOne(
  { name: "Bob" },
  { writeConcern: { w: 0 } }
);

// ===== W: MAJORITY =====

// Wait for majority of replica set members
await collection.insertOne(
  { name: "Alice" },
  { writeConcern: { w: "majority" } }
);

// With timeout
await collection.insertOne(
  { name: "Charlie" },
  { writeConcern: { w: "majority", wtimeout: 5000 } }
);

// ===== W: NUMBER =====

// Wait for specific number of members
await collection.insertOne(
  { name: "David" },
  { writeConcern: { w: 2 } }  // Primary + 1 secondary
);

// ===== JOURNAL (J) =====

// Wait for journal commit
await collection.insertOne(
  { name: "Eve" },
  { writeConcern: { w: 1, j: true } }
);

// Majority + journal
await collection.insertOne(
  { name: "Frank" },
  { writeConcern: { w: "majority", j: true } }
);

// ===== TAG SETS =====

// Wait for members with specific tags
await collection.insertOne(
  { name: "Grace" },
  { writeConcern: { w: "eastDC", wtimeout: 5000 } }
);

// Custom write concern (configured on replica set)
// rs.conf().settings.getLastErrorModes = {
//   eastDC: { dc: "east": 2 }
// }

// ===== CONNECTION-LEVEL =====

const client2 = new MongoClient(uri, {
  writeConcern: {
    w: "majority",
    j: true,
    wtimeout: 5000
  }
});

// ===== BULK OPERATIONS =====

const bulkOps = [
  { insertOne: { document: { name: "User1" } } },
  { updateOne: { filter: { name: "User2" }, update: { $set: { active: true } } } }
];

await collection.bulkWrite(bulkOps, {
  writeConcern: { w: "majority" }
});

// ===== ERROR HANDLING =====

try {
  await collection.insertOne(
    { name: "Test" },
    { writeConcern: { w: "majority", wtimeout: 1000 } }
  );
} catch (error) {
  if (error.code === 64) {  // WriteConcernError
    console.error("Write concern failed:", error.message);
    // Handle timeout or replication failure
  }
}

await client.close();`}</code>
                  </pre>
                </div>

                {/* Mongoose */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    2. Mongoose Write Concerns
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`const mongoose = require("mongoose");

await mongoose.connect(uri);

const User = mongoose.model("User", new mongoose.Schema({
  name: String,
  email: String
}));

// ===== OPERATION-LEVEL =====

// Majority write concern
await User.create(
  { name: "John", email: "john@example.com" },
  { writeConcern: { w: "majority" } }
);

// With journal
await User.create(
  { name: "Jane" },
  { writeConcern: { w: "majority", j: true } }
);

// Update with write concern
await User.updateOne(
  { name: "John" },
  { $set: { active: true } },
  { writeConcern: { w: "majority", wtimeout: 5000 } }
);

// Delete with write concern
await User.deleteOne(
  { name: "Bob" },
  { writeConcern: { w: "majority" } }
);

// ===== SCHEMA-LEVEL =====

const criticalSchema = new mongoose.Schema({
  data: String
}, {
  writeConcern: {
    w: "majority",
    j: true,
    wtimeout: 5000
  }
});

const Critical = mongoose.model("Critical", criticalSchema);

// All operations use majority write concern
await Critical.create({ data: "Important" });

// ===== CONNECTION-LEVEL =====

await mongoose.connect(uri, {
  writeConcern: {
    w: "majority",
    j: true,
    wtimeout: 5000
  }
});

// ===== SAVE METHOD =====

const user = new User({ name: "Alice" });

await user.save({
  writeConcern: { w: "majority" }
});

await mongoose.disconnect();`}</code>
                  </pre>
                </div>
              </section>
            </>
          )}

          {/* Read Concerns Tab */}
          {activeTab === "readConcern" && (
            <>
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  📚 Read Concerns Theory
                </h2>

                <div className="space-y-4 text-gray-200">
                  <p className="text-lg">
                    <strong>Read Concerns</strong> allow you to control the
                    consistency and isolation properties of data read from
                    replica sets.
                  </p>

                  <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                    Read Concern Levels
                  </h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong>local (default):</strong> Returns most recent
                      data, may be rolled back
                    </li>
                    <li>
                      <strong>available:</strong> Same as local for replica sets
                    </li>
                    <li>
                      <strong>majority:</strong> Returns data acknowledged by
                      majority
                    </li>
                    <li>
                      <strong>linearizable:</strong> Guarantees reads reflect
                      all successful majority writes
                    </li>
                    <li>
                      <strong>snapshot:</strong> Returns consistent snapshot
                      (transactions only)
                    </li>
                  </ul>

                  <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                    Use Cases
                  </h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong>local:</strong> Default, fastest reads
                    </li>
                    <li>
                      <strong>majority:</strong> Prevent reading data that may
                      be rolled back
                    </li>
                    <li>
                      <strong>linearizable:</strong> Strictest consistency (only
                      with primary reads)
                    </li>
                    <li>
                      <strong>snapshot:</strong> Consistent reads within
                      transactions
                    </li>
                  </ul>

                  <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                    Trade-offs
                  </h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong>Higher consistency:</strong> Slower reads, more
                      guarantees
                    </li>
                    <li>
                      <strong>Lower consistency:</strong> Faster reads, less
                      guarantees
                    </li>
                  </ul>
                </div>
              </section>

              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  Read Concern Examples
                </h2>

                {/* MongoDB Native Driver */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    1. MongoDB Native Driver
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`const { MongoClient } = require("mongodb");

const client = new MongoClient(uri);
await client.connect();

const db = client.db("myDatabase");
const collection = db.collection("users");

// ===== LOCAL (DEFAULT) =====

// Fastest reads, may return data that could be rolled back
const localUsers = await collection.find().toArray();

// Explicit local
const local2 = await collection
  .find()
  .readConcern({ level: "local" })
  .toArray();

// ===== AVAILABLE =====

// Same as local for replica sets
const availableUsers = await collection
  .find()
  .readConcern({ level: "available" })
  .toArray();

// ===== MAJORITY =====

// Only returns data acknowledged by majority
// Prevents reading data that may be rolled back
const majorityUsers = await collection
  .find()
  .readConcern({ level: "majority" })
  .toArray();

// With find options
const majority2 = await collection.find(
  { active: true },
  { readConcern: { level: "majority" } }
).toArray();

// ===== LINEARIZABLE =====

// Strictest consistency
// Must use with readPreference: "primary"
const linearUsers = await collection
  .find()
  .readPreference("primary")
  .readConcern({ level: "linearizable" })
  .toArray();

// ===== SNAPSHOT (TRANSACTIONS) =====

const session = client.startSession();

try {
  await session.withTransaction(
    async () => {
      // Read with snapshot isolation
      const users = await collection
        .find()
        .session(session)
        .toArray();
      
      // All reads in transaction see consistent snapshot
      const orders = await db
        .collection("orders")
        .find()
        .session(session)
        .toArray();
    },
    {
      readConcern: { level: "snapshot" },
      writeConcern: { w: "majority" }
    }
  );
} finally {
  await session.endSession();
}

// ===== CONNECTION-LEVEL =====

const client2 = new MongoClient(uri, {
  readConcern: { level: "majority" }
});

// ===== DATABASE-LEVEL =====

const db2 = client.db("myDatabase", {
  readConcern: { level: "majority" }
});

// ===== AGGREGATION =====

const pipeline = [
  { $match: { active: true } },
  { $group: { _id: "$role", count: { $sum: 1 } } }
];

const results = await collection.aggregate(pipeline, {
  readConcern: { level: "majority" }
}).toArray();

await client.close();`}</code>
                  </pre>
                </div>

                {/* Mongoose */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    2. Mongoose Read Concerns
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`const mongoose = require("mongoose");

await mongoose.connect(uri);

const User = mongoose.model("User", new mongoose.Schema({
  name: String,
  email: String
}));

// ===== QUERY-LEVEL =====

// Majority read concern
const users = await User.find().readConcern("majority");

// Linearizable
const linearUsers = await User
  .find()
  .read("primary")
  .readConcern("linearizable");

// ===== WITH TRANSACTIONS =====

const session = await mongoose.startSession();

await session.withTransaction(
  async () => {
    const users = await User.find().session(session);
    const orders = await Order.find().session(session);
    // Both reads see consistent snapshot
  },
  {
    readConcern: { level: "snapshot" },
    writeConcern: { w: "majority" }
  }
);

await session.endSession();

// ===== SCHEMA-LEVEL =====

const consistentSchema = new mongoose.Schema({
  data: String
}, {
  readConcern: { level: "majority" }
});

const Consistent = mongoose.model("Consistent", consistentSchema);

// All queries use majority read concern
const data = await Consistent.find();

// ===== CONNECTION-LEVEL =====

await mongoose.connect(uri, {
  readConcern: { level: "majority" }
});

await mongoose.disconnect();`}</code>
                  </pre>
                </div>

                {/* Combined Example */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    3. Combined Read/Write Concerns
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== STRONG CONSISTENCY =====

// Write with majority, read with majority
await collection.insertOne(
  { name: "John" },
  { writeConcern: { w: "majority", j: true } }
);

const user = await collection
  .findOne({ name: "John" })
  .readConcern({ level: "majority" });

// ===== EVENTUAL CONSISTENCY =====

// Fast writes, read from secondaries
await collection.insertOne(
  { name: "Jane" },
  { writeConcern: { w: 1 } }
);

const user2 = await collection
  .findOne({ name: "Jane" })
  .readPreference("secondaryPreferred");

// ===== TRANSACTION CONSISTENCY =====

const session = client.startSession();

await session.withTransaction(
  async () => {
    // Write
    await collection.insertOne(
      { name: "Bob" },
      { session }
    );
    
    // Read (sees own write)
    const user = await collection
      .findOne({ name: "Bob" })
      .session(session);
    
    return user;
  },
  {
    readConcern: { level: "snapshot" },
    writeConcern: { w: "majority", j: true },
    readPreference: "primary"
  }
);

await session.endSession();

// ===== PRACTICAL PATTERNS =====

// Financial transactions (strongest guarantees)
async function transferMoney(from, to, amount) {
  const session = client.startSession();
  
  try {
    await session.withTransaction(
      async () => {
        await accounts.updateOne(
          { _id: from },
          { $inc: { balance: -amount } },
          { session }
        );
        
        await accounts.updateOne(
          { _id: to },
          { $inc: { balance: amount } },
          { session }
        );
      },
      {
        readConcern: { level: "snapshot" },
        writeConcern: { w: "majority", j: true },
        readPreference: "primary"
      }
    );
  } finally {
    await session.endSession();
  }
}

// Analytics (eventual consistency OK)
async function getAnalytics() {
  return await collection
    .aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ])
    .readPreference("secondary")
    .readConcern({ level: "local" })
    .toArray();
}

// Real-time dashboard (balance performance and consistency)
async function getDashboard() {
  return await collection
    .find({ active: true })
    .readPreference("nearest")
    .readConcern({ level: "majority" })
    .toArray();
}`}</code>
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
                  <strong>Default to primary reads:</strong> For strong
                  consistency
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Use secondary for analytics:</strong> Offload
                  reporting queries
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Majority write concern:</strong> Prevent rollback for
                  critical data
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Journal for durability:</strong> Use j: true for
                  critical writes
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Set wtimeout:</strong> Prevent indefinite waits
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Majority read concern:</strong> Avoid stale reads from
                  potential rollback
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Snapshot for transactions:</strong> Consistent
                  multi-document reads
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Balance consistency vs performance:</strong> Choose
                  based on use case
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Test failover scenarios:</strong> Verify behavior with
                  different concerns
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Monitor write concern errors:</strong> Alert on
                  replication issues
                </span>
              </li>
            </ul>
          </section>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8">
            <Link
              href="/phase8/replica-sets"
              className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              ← Previous: Replica Sets
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
