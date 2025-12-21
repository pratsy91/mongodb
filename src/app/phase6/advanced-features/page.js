"use client";

import Link from "next/link";
import { useState } from "react";

export default function AdvancedFeaturesPage() {
  const [activeTab, setActiveTab] = useState("connections");

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
          Advanced Mongoose Features
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Connections, Transactions, Change Streams, Plugins & More
        </p>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 flex-wrap">
          <button
            onClick={() => setActiveTab("connections")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "connections"
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Connections
          </button>
          <button
            onClick={() => setActiveTab("transactions")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "transactions"
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Transactions
          </button>
          <button
            onClick={() => setActiveTab("streams")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "streams"
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Change Streams
          </button>
          <button
            onClick={() => setActiveTab("plugins")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "plugins"
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Plugins
          </button>
        </div>

        <div className="space-y-8">
          {/* Connections Tab */}
          {activeTab === "connections" && (
            <>
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  Connections
                </h2>

                {/* Basic Connections */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    1. Basic Connections
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`const mongoose = require("mongoose");

// ===== DEFAULT CONNECTION =====

// Basic connection
await mongoose.connect("mongodb://localhost:27017/myDatabase");

// With options
await mongoose.connect("mongodb://localhost:27017/myDatabase", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000
});

// Connection events
mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error("Connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("Disconnected from MongoDB");
});

// Disconnect
await mongoose.disconnect();

// Close connection
await mongoose.connection.close();

// ===== CONNECTION OPTIONS =====

await mongoose.connect(uri, {
  // Server selection
  serverSelectionTimeoutMS: 5000,
  
  // Socket options
  socketTimeoutMS: 45000,
  family: 4,  // Use IPv4
  
  // Connection pool
  maxPoolSize: 10,
  minPoolSize: 2,
  maxIdleTimeMS: 30000,
  
  // Retry options
  retryWrites: true,
  retryReads: true,
  
  // SSL/TLS
  tls: true,
  tlsCAFile: "./ca.pem",
  tlsCertificateKeyFile: "./cert.pem",
  
  // Authentication
  auth: {
    username: "user",
    password: "pass"
  },
  authSource: "admin",
  
  // Replica Set
  replicaSet: "myReplicaSet",
  
  // Read/Write concerns
  readPreference: "secondaryPreferred",
  readConcern: "majority",
  w: "majority",
  journal: true,
  wtimeoutMS: 1000,
  
  // Compression
  compressors: ["snappy", "zlib"],
  
  // Application name
  appName: "myApp"
});`}</code>
                  </pre>
                </div>

                {/* Multiple Connections */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    2. Multiple Connections
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== MULTIPLE DATABASES =====

// Default connection
await mongoose.connect("mongodb://localhost:27017/db1");

// Additional connection
const conn2 = await mongoose.createConnection("mongodb://localhost:27017/db2");

// Use models with specific connection
const User1 = mongoose.model("User", userSchema);  // Uses default
const User2 = conn2.model("User", userSchema);     // Uses conn2

// ===== CONNECTION MANAGEMENT =====

// Get default connection
const defaultConn = mongoose.connection;

// Create named connections
const connections = {
  main: await mongoose.createConnection("mongodb://localhost:27017/main"),
  analytics: await mongoose.createConnection("mongodb://localhost:27017/analytics"),
  logs: await mongoose.createConnection("mongodb://localhost:27017/logs")
};

// Models for each connection
const MainUser = connections.main.model("User", userSchema);
const AnalyticsEvent = connections.analytics.model("Event", eventSchema);
const Log = connections.logs.model("Log", logSchema);

// Close specific connection
await connections.analytics.close();

// Close all connections
await mongoose.disconnect();

// ===== CONNECTION POOLING =====

const conn = await mongoose.createConnection(uri, {
  maxPoolSize: 10,      // Max connections in pool
  minPoolSize: 2,       // Min connections in pool
  maxIdleTimeMS: 10000, // Close idle connections after 10s
  waitQueueTimeoutMS: 5000  // Wait 5s for connection from pool
});

// Get pool stats
console.log(conn.client.topology.s.pool);

// ===== REPLICA SETS =====

await mongoose.connect("mongodb://host1,host2,host3/mydb", {
  replicaSet: "myReplicaSet",
  readPreference: "secondaryPreferred"
});

// Read preferences
// - primary: Read from primary only
// - primaryPreferred: Read from primary, secondary if unavailable
// - secondary: Read from secondary only
// - secondaryPreferred: Read from secondary, primary if unavailable
// - nearest: Read from nearest member

// ===== MONGODB ATLAS =====

const atlasUri = "mongodb+srv://username:password@cluster.mongodb.net/myDatabase?retryWrites=true&w=majority";

await mongoose.connect(atlasUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});`}</code>
                  </pre>
                </div>
              </section>
            </>
          )}

          {/* Transactions Tab */}
          {activeTab === "transactions" && (
            <>
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  Transactions
                </h2>

                {/* Basic Transactions */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    1. Basic Transactions
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== START SESSION =====

const session = await mongoose.startSession();

// ===== BASIC TRANSACTION =====

session.startTransaction();

try {
  // All operations in transaction
  const user = await User.create([{
    name: "John",
    email: "john@example.com"
  }], { session });
  
  const account = await Account.create([{
    userId: user[0]._id,
    balance: 1000
  }], { session });
  
  // Commit transaction
  await session.commitTransaction();
  console.log("Transaction committed");
  
} catch (error) {
  // Abort on error
  await session.abortTransaction();
  console.error("Transaction aborted:", error);
  throw error;
  
} finally {
  // End session
  session.endSession();
}

// ===== TRANSACTION WITH OPTIONS =====

session.startTransaction({
  readConcern: { level: "snapshot" },
  writeConcern: { w: "majority" },
  readPreference: "primary",
  maxCommitTimeMS: 10000
});

// ===== WITH TRANSACTION HELPER =====

await session.withTransaction(async () => {
  await User.create([{ name: "Jane" }], { session });
  await Account.create([{ userId: "..." }], { session });
  // Auto commits or aborts
});

// Or with connection
await mongoose.connection.transaction(async (session) => {
  await User.create([{ name: "Bob" }], { session });
  await Account.create([{ userId: "..." }], { session });
});`}</code>
                  </pre>
                </div>

                {/* Advanced Transactions */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    2. Advanced Transactions
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== TRANSACTION WITH QUERIES =====

const session = await mongoose.startSession();

await session.withTransaction(async () => {
  // Find with session
  const user = await User.findOne({ email: "john@example.com" })
    .session(session);
  
  if (!user) {
    throw new Error("User not found");
  }
  
  // Update with session
  await User.updateOne(
    { _id: user._id },
    { $inc: { loginCount: 1 } },
    { session }
  );
  
  // Create with session
  await LoginLog.create([{
    userId: user._id,
    timestamp: new Date()
  }], { session });
});

// ===== MONEY TRANSFER EXAMPLE =====

async function transferMoney(fromId, toId, amount) {
  const session = await mongoose.startSession();
  
  try {
    await session.withTransaction(async () => {
      // Debit from account
      const from = await Account.findByIdAndUpdate(
        fromId,
        { $inc: { balance: -amount } },
        { session, new: true }
      );
      
      if (from.balance < 0) {
        throw new Error("Insufficient funds");
      }
      
      // Credit to account
      await Account.findByIdAndUpdate(
        toId,
        { $inc: { balance: amount } },
        { session, new: true }
      );
      
      // Create transaction record
      await Transaction.create([{
        from: fromId,
        to: toId,
        amount,
        timestamp: new Date()
      }], { session });
    });
    
    console.log("Transfer successful");
    
  } finally {
    await session.endSession();
  }
}

// ===== RETRY LOGIC =====

async function runTransactionWithRetry(txnFunc, session) {
  let retries = 3;
  
  while (retries > 0) {
    try {
      await session.withTransaction(txnFunc);
      return;
    } catch (error) {
      if (error.hasErrorLabel("TransientTransactionError")) {
        retries--;
        console.log("Retrying transaction...");
      } else {
        throw error;
      }
    }
  }
  
  throw new Error("Transaction failed after retries");
}

// ===== SESSION OPTIONS =====

const session = await mongoose.startSession({
  defaultTransactionOptions: {
    readConcern: { level: "snapshot" },
    writeConcern: { w: "majority" },
    readPreference: "primary"
  }
});

// ===== CAUSAL CONSISTENCY =====

const session = await mongoose.startSession({
  causalConsistency: true
});

// Reads after writes in session are causally consistent
await User.create([{ name: "Alice" }], { session });
const user = await User.findOne({ name: "Alice" }).session(session);`}</code>
                  </pre>
                </div>
              </section>
            </>
          )}

          {/* Change Streams Tab */}
          {activeTab === "streams" && (
            <>
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  Change Streams
                </h2>

                {/* Basic Change Streams */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    1. Basic Change Streams
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== WATCH COLLECTION =====

const changeStream = User.watch();

changeStream.on("change", (change) => {
  console.log("Change detected:", change);
  
  // Change types: insert, update, replace, delete
  console.log("Operation:", change.operationType);
  console.log("Document:", change.fullDocument);
});

// Handle errors
changeStream.on("error", (error) => {
  console.error("Change stream error:", error);
});

// Close stream
changeStream.close();

// ===== WATCH WITH PIPELINE =====

// Filter specific operations
const insertStream = User.watch([
  { $match: { operationType: "insert" } }
]);

// Filter by field values
const activeUserStream = User.watch([
  { $match: { "fullDocument.active": true } }
]);

// Multiple filters
const specificStream = User.watch([
  { $match: {
    operationType: { $in: ["insert", "update"] },
    "fullDocument.role": "admin"
  }}
]);

// ===== FULL DOCUMENT =====

// Include full document in updates
const fullDocStream = User.watch([], {
  fullDocument: "updateLookup"
});

fullDocStream.on("change", (change) => {
  if (change.operationType === "update") {
    console.log("Full document:", change.fullDocument);
  }
});

// Options:
// - "default": No full document
// - "updateLookup": Fetch full document after update
// - "whenAvailable": Include if available
// - "required": Always include or error

// ===== CHANGE EVENT STRUCTURE =====

changeStream.on("change", (change) => {
  console.log({
    _id: change._id,                    // Resume token
    operationType: change.operationType, // insert/update/delete/replace
    fullDocument: change.fullDocument,  // Complete document
    ns: change.ns,                      // { db, coll }
    documentKey: change.documentKey,    // { _id }
    updateDescription: change.updateDescription, // For updates
    clusterTime: change.clusterTime
  });
});`}</code>
                  </pre>
                </div>

                {/* Advanced Change Streams */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    2. Advanced Change Streams
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== RESUME TOKENS =====

let resumeToken;

const stream = User.watch();

stream.on("change", (change) => {
  // Save resume token
  resumeToken = change._id;
  processChange(change);
});

// Resume from token after disconnect
const resumedStream = User.watch([], {
  resumeAfter: resumeToken
});

// ===== START AFTER =====

// Start after specific timestamp
const stream = User.watch([], {
  startAtOperationTime: new Timestamp(1234567890, 1)
});

// ===== WATCH DATABASE =====

// Watch all collections in database
const dbStream = mongoose.connection.watch();

dbStream.on("change", (change) => {
  console.log("Database change:", change.ns.coll);
});

// ===== WATCH WITH OPTIONS =====

const stream = User.watch([], {
  fullDocument: "updateLookup",
  resumeAfter: resumeToken,
  startAtOperationTime: timestamp,
  maxAwaitTimeMS: 5000,
  batchSize: 100
});

// ===== PRACTICAL EXAMPLES =====

// Real-time notifications
const notificationStream = User.watch([
  { $match: { 
    operationType: "update",
    "updateDescription.updatedFields.notifications": { $exists: true }
  }}
]);

notificationStream.on("change", async (change) => {
  const userId = change.documentKey._id;
  await sendNotification(userId);
});

// Cache invalidation
const cacheStream = Product.watch([
  { $match: { operationType: { $in: ["update", "delete"] } } }
]);

cacheStream.on("change", (change) => {
  const productId = change.documentKey._id;
  cache.del(\`product:\${productId}\`);
});

// Audit logging
const auditStream = User.watch([
  { $match: { 
    operationType: { $in: ["update", "delete"] },
    "fullDocument.role": "admin"
  }}
]);

auditStream.on("change", async (change) => {
  await AuditLog.create({
    operation: change.operationType,
    collection: "users",
    documentId: change.documentKey._id,
    timestamp: new Date()
  });
});

// ===== ERROR HANDLING =====

const stream = User.watch();

stream.on("error", async (error) => {
  console.error("Stream error:", error);
  
  // Restart stream
  if (resumeToken) {
    const newStream = User.watch([], {
      resumeAfter: resumeToken
    });
  }
});

// ===== CLOSE STREAM =====

// Graceful shutdown
process.on("SIGINT", () => {
  changeStream.close();
  mongoose.disconnect();
});`}</code>
                  </pre>
                </div>
              </section>
            </>
          )}

          {/* Plugins Tab */}
          {activeTab === "plugins" && (
            <>
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  Plugins
                </h2>

                {/* Creating Plugins */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    1. Creating Plugins
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== BASIC PLUGIN =====

function timestampPlugin(schema, options) {
  // Add fields
  schema.add({
    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  });
  
  // Add pre-save hook
  schema.pre("save", function(next) {
    this.updatedAt = Date.now();
    next();
  });
  
  // Add pre-update hook
  schema.pre("findOneAndUpdate", function(next) {
    this.set({ updatedAt: Date.now() });
    next();
  });
}

// Use plugin
userSchema.plugin(timestampPlugin);

// ===== PLUGIN WITH OPTIONS =====

function softDeletePlugin(schema, options) {
  const { deletedField = "deleted", deletedAtField = "deletedAt" } = options || {};
  
  // Add fields
  schema.add({
    [deletedField]: {
      type: Boolean,
      default: false
    },
    [deletedAtField]: Date
  });
  
  // Override delete methods
  schema.methods.softDelete = function() {
    this[deletedField] = true;
    this[deletedAtField] = new Date();
    return this.save();
  };
  
  schema.methods.restore = function() {
    this[deletedField] = false;
    this[deletedAtField] = null;
    return this.save();
  };
  
  // Filter deleted by default
  schema.pre(/^find/, function(next) {
    if (this.getOptions().includeDeleted !== true) {
      this.where({ [deletedField]: false });
    }
    next();
  });
}

// Use with options
userSchema.plugin(softDeletePlugin, {
  deletedField: "isDeleted",
  deletedAtField: "deletedAt"
});

// ===== PLUGIN WITH STATICS =====

function paginationPlugin(schema) {
  // Add static method
  schema.statics.paginate = async function(query, options) {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;
    
    const [docs, total] = await Promise.all([
      this.find(query).skip(skip).limit(limit).lean(),
      this.countDocuments(query)
    ]);
    
    return {
      docs,
      total,
      page,
      pages: Math.ceil(total / limit)
    };
  };
}

userSchema.plugin(paginationPlugin);

// Usage
const result = await User.paginate(
  { active: true },
  { page: 2, limit: 20 }
);`}</code>
                  </pre>
                </div>

                {/* Common Plugins */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    2. Common Plugin Patterns
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== SLUG PLUGIN =====

function slugPlugin(schema, options) {
  const { field = "name", slugField = "slug" } = options;
  
  schema.add({ [slugField]: { type: String, unique: true } });
  
  schema.pre("save", function(next) {
    if (this.isModified(field)) {
      this[slugField] = this[field]
        .toLowerCase()
        .replace(/[^\\w\\s-]/g, "")
        .replace(/\\s+/g, "-");
    }
    next();
  });
}

// ===== VERSIONING PLUGIN =====

function versioningPlugin(schema) {
  schema.add({
    version: { type: Number, default: 1 }
  });
  
  schema.pre("save", function(next) {
    if (!this.isNew) {
      this.increment();
    }
    next();
  });
}

// ===== ENCRYPTION PLUGIN =====

function encryptionPlugin(schema, options) {
  const { fields = [] } = options;
  
  fields.forEach(field => {
    schema.path(field).set(function(value) {
      return encrypt(value);  // Your encryption function
    });
    
    schema.path(field).get(function(value) {
      return decrypt(value);  // Your decryption function
    });
  });
}

userSchema.plugin(encryptionPlugin, {
  fields: ["ssn", "creditCard"]
});

// ===== AUDIT PLUGIN =====

function auditPlugin(schema) {
  schema.add({
    audit: [{
      action: String,
      user: mongoose.Schema.Types.ObjectId,
      timestamp: Date,
      changes: mongoose.Schema.Types.Mixed
    }]
  });
  
  schema.pre("save", function(next) {
    if (!this.isNew) {
      const changes = this.modifiedPaths().reduce((acc, path) => {
        acc[path] = {
          old: this._original?.[path],
          new: this[path]
        };
        return acc;
      }, {});
      
      this.audit.push({
        action: "update",
        timestamp: new Date(),
        changes
      });
    }
    next();
  });
}

// ===== GLOBAL PLUGINS =====

// Apply to all schemas
mongoose.plugin(timestampPlugin);
mongoose.plugin(softDeletePlugin);

// With options
mongoose.plugin(paginationPlugin, { defaultLimit: 20 });

// ===== USING NPM PLUGINS =====

// mongoose-autopopulate
const autopopulate = require("mongoose-autopopulate");
userSchema.plugin(autopopulate);

// mongoose-paginate-v2
const mongoosePaginate = require("mongoose-paginate-v2");
userSchema.plugin(mongoosePaginate);

// mongoose-unique-validator
const uniqueValidator = require("mongoose-unique-validator");
userSchema.plugin(uniqueValidator);

// ===== PLUGIN ORDERING =====

// Order matters for middleware
userSchema.plugin(plugin1);  // Runs first
userSchema.plugin(plugin2);  // Runs second
userSchema.plugin(plugin3);  // Runs third`}</code>
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
                  <strong>Connection pooling:</strong> Configure appropriate
                  pool size for your workload
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Transaction retry:</strong> Implement retry logic for
                  transient errors
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Change streams resume:</strong> Save resume tokens for
                  crash recovery
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Plugin reusability:</strong> Create plugins for common
                  schema patterns
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Session cleanup:</strong> Always end sessions in
                  finally block
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Read preferences:</strong> Use appropriate read
                  preference for your use case
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Write concerns:</strong> Balance durability and
                  performance
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Change stream filters:</strong> Filter early in
                  pipeline for efficiency
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Connection events:</strong> Handle connection errors
                  gracefully
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Transactions for consistency:</strong> Use for
                  multi-document updates requiring atomicity
                </span>
              </li>
            </ul>
          </section>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8">
            <Link
              href="/phase6/documents-population"
              className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              ← Previous: Documents & Population
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
