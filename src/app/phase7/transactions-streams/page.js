"use client";

import Link from "next/link";
import { useState } from "react";

export default function TransactionsStreamsPage() {
  const [activeTab, setActiveTab] = useState("transactions");

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
          Transactions & Change Streams
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Multi-document ACID Transactions and Real-time Change Streams
        </p>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 flex-wrap">
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
        </div>

        <div className="space-y-8">
          {/* Transactions Tab */}
          {activeTab === "transactions" && (
            <>
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  📚 Transactions Theory
                </h2>

                <div className="space-y-4 text-gray-200">
                  <p className="text-lg">
                    MongoDB transactions provide{" "}
                    <strong>ACID guarantees</strong> for multi-document
                    operations across collections, databases, and shards.
                  </p>

                  <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                    Key Features
                  </h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong>Atomicity:</strong> All operations succeed or all
                      fail
                    </li>
                    <li>
                      <strong>Consistency:</strong> Data remains valid across
                      transaction
                    </li>
                    <li>
                      <strong>Isolation:</strong> Concurrent transactions
                      don&apos;t interfere
                    </li>
                    <li>
                      <strong>Durability:</strong> Committed changes are
                      permanent
                    </li>
                    <li>
                      <strong>Snapshot Isolation:</strong> Consistent read view
                      during transaction
                    </li>
                    <li>
                      <strong>Retryable Writes:</strong> Automatically retry
                      transient errors
                    </li>
                  </ul>

                  <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                    Requirements
                  </h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>MongoDB 4.0+ for replica sets</li>
                    <li>MongoDB 4.2+ for sharded clusters</li>
                    <li>WiredTiger storage engine</li>
                    <li>Replica set or sharded cluster deployment</li>
                  </ul>
                </div>
              </section>

              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  Transactions Examples
                </h2>

                {/* Basic Transactions */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    1. Basic Transactions (MongoDB Native)
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://localhost:27017?replicaSet=rs0");
await client.connect();

const db = client.db("myDatabase");
const accounts = db.collection("accounts");
const transactions = db.collection("transactions");

// ===== START SESSION =====

const session = client.startSession();

try {
  // Start transaction
  session.startTransaction({
    readConcern: { level: "snapshot" },
    writeConcern: { w: "majority" },
    readPreference: "primary"
  });

  // All operations must pass session
  await accounts.updateOne(
    { accountId: "A" },
    { $inc: { balance: -100 } },
    { session }
  );

  await accounts.updateOne(
    { accountId: "B" },
    { $inc: { balance: 100 } },
    { session }
  );

  await transactions.insertOne(
    {
      from: "A",
      to: "B",
      amount: 100,
      timestamp: new Date()
    },
    { session }
  );

  // Commit transaction
  await session.commitTransaction();
  console.log("Transaction committed successfully");

} catch (error) {
  // Abort on error
  await session.abortTransaction();
  console.error("Transaction aborted:", error);
  throw error;

} finally {
  // Always end session
  await session.endSession();
}

await client.close();`}</code>
                  </pre>
                </div>

                {/* With Transaction Helper */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    2. With Transaction Helper
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== USING WITH TRANSACTION =====

const session = client.startSession();

try {
  await session.withTransaction(async () => {
    // All operations in this callback are in transaction
    
    await accounts.updateOne(
      { accountId: "A" },
      { $inc: { balance: -100 } },
      { session }
    );

    await accounts.updateOne(
      { accountId: "B" },
      { $inc: { balance: 100 } },
      { session }
    );

    await transactions.insertOne({
      from: "A",
      to: "B",
      amount: 100
    }, { session });

    // Automatically commits or aborts based on errors
  }, {
    readConcern: { level: "snapshot" },
    writeConcern: { w: "majority" },
    readPreference: "primary",
    maxCommitTimeMS: 30000
  });

  console.log("Transaction completed");

} finally {
  await session.endSession();
}

// ===== MONEY TRANSFER EXAMPLE =====

async function transferMoney(fromAccount, toAccount, amount) {
  const session = client.startSession();

  try {
    await session.withTransaction(async () => {
      // Check balance
      const from = await accounts.findOne(
        { accountId: fromAccount },
        { session }
      );

      if (!from || from.balance < amount) {
        throw new Error("Insufficient funds");
      }

      // Debit
      await accounts.updateOne(
        { accountId: fromAccount },
        { $inc: { balance: -amount } },
        { session }
      );

      // Credit
      await accounts.updateOne(
        { accountId: toAccount },
        { $inc: { balance: amount } },
        { session }
      );

      // Log transaction
      await transactions.insertOne({
        from: fromAccount,
        to: toAccount,
        amount,
        timestamp: new Date(),
        status: "completed"
      }, { session });
    });

    return { success: true };

  } catch (error) {
    return { success: false, error: error.message };
  } finally {
    await session.endSession();
  }
}

// Usage
await transferMoney("A", "B", 100);`}</code>
                  </pre>
                </div>

                {/* Retry Logic */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    3. Retry Logic & Error Handling
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== TRANSIENT TRANSACTION ERRORS =====

async function runTransactionWithRetry(txnFunc, maxRetries = 3) {
  const session = client.startSession();
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      attempt++;
      
      await session.withTransaction(txnFunc);
      console.log("Transaction succeeded");
      break;

    } catch (error) {
      // Check if error is transient
      if (error.hasErrorLabel("TransientTransactionError")) {
        console.log(\`Attempt \${attempt} failed, retrying...\`);
        
        if (attempt >= maxRetries) {
          throw new Error("Max retries exceeded");
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 100 * attempt));
      } else {
        throw error;
      }
    }
  }

  await session.endSession();
}

// Usage
await runTransactionWithRetry(async () => {
  await accounts.updateOne(
    { accountId: "A" },
    { $inc: { balance: -50 } },
    { session }
  );
});

// ===== UNKNOWN TRANSACTION COMMIT RESULT =====

async function commitWithRetry(session) {
  let retries = 0;
  const maxRetries = 3;

  while (retries < maxRetries) {
    try {
      await session.commitTransaction();
      console.log("Transaction committed");
      return;

    } catch (error) {
      if (error.hasErrorLabel("UnknownTransactionCommitResult")) {
        retries++;
        console.log(\`Commit retry \${retries}\`);
      } else {
        throw error;
      }
    }
  }

  throw new Error("Failed to commit after retries");
}

// ===== CAUSAL CONSISTENCY =====

const session = client.startSession({
  causalConsistency: true
});

// Reads are causally consistent with writes in same session
await accounts.insertOne({ accountId: "C", balance: 0 }, { session });

const account = await accounts.findOne(
  { accountId: "C" },
  { session }
);

console.log(account);  // Guaranteed to see the insert`}</code>
                  </pre>
                </div>

                {/* Mongoose Transactions */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    4. Mongoose Transactions
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`const mongoose = require("mongoose");

await mongoose.connect("mongodb://localhost:27017/myDatabase?replicaSet=rs0");

const Account = mongoose.model("Account", new mongoose.Schema({
  accountId: String,
  balance: Number
}));

// ===== MONGOOSE WITH TRANSACTION =====

const session = await mongoose.startSession();

await session.withTransaction(async () => {
  // All model operations use session
  
  await Account.updateOne(
    { accountId: "A" },
    { $inc: { balance: -100 } }
  ).session(session);

  await Account.updateOne(
    { accountId: "B" },
    { $inc: { balance: 100 } }
  ).session(session);

  // Or pass session in options
  await Account.create([{
    accountId: "C",
    balance: 0
  }], { session });
});

await session.endSession();

// ===== MONGOOSE SHORTHAND =====

await mongoose.connection.transaction(async (session) => {
  await Account.updateOne(
    { accountId: "A" },
    { $inc: { balance: -50 } }
  ).session(session);

  await Account.updateOne(
    { accountId: "B" },
    { $inc: { balance: 50 } }
  ).session(session);
});

// ===== PRACTICAL MONGOOSE EXAMPLE =====

async function processOrder(orderId, items) {
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      // Update inventory
      for (const item of items) {
        const product = await Product.findOneAndUpdate(
          {
            _id: item.productId,
            stock: { $gte: item.quantity }
          },
          { $inc: { stock: -item.quantity } }
        ).session(session);

        if (!product) {
          throw new Error(\`Insufficient stock for \${item.productId}\`);
        }
      }

      // Create order
      await Order.create([{
        orderId,
        items,
        status: "confirmed",
        createdAt: new Date()
      }], { session });

      // Send notification (non-transactional)
      // await sendOrderConfirmation(orderId);
    });

    return { success: true };

  } catch (error) {
    return { success: false, error: error.message };
  } finally {
    await session.endSession();
  }
}

await mongoose.disconnect();`}</code>
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
                  📚 Change Streams Theory
                </h2>

                <div className="space-y-4 text-gray-200">
                  <p className="text-lg">
                    Change Streams provide{" "}
                    <strong>real-time notifications</strong> of data changes in
                    MongoDB collections, databases, or clusters.
                  </p>

                  <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                    Key Features
                  </h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong>Real-time:</strong> Immediate notification of
                      changes
                    </li>
                    <li>
                      <strong>Resumable:</strong> Can resume from specific point
                      using tokens
                    </li>
                    <li>
                      <strong>Ordered:</strong> Events delivered in order they
                      occurred
                    </li>
                    <li>
                      <strong>Filterable:</strong> Use aggregation pipeline to
                      filter events
                    </li>
                    <li>
                      <strong>Full Document:</strong> Option to include complete
                      document
                    </li>
                  </ul>

                  <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                    Change Event Types
                  </h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong>insert:</strong> New document inserted
                    </li>
                    <li>
                      <strong>update:</strong> Document modified
                    </li>
                    <li>
                      <strong>replace:</strong> Document replaced
                    </li>
                    <li>
                      <strong>delete:</strong> Document removed
                    </li>
                    <li>
                      <strong>drop:</strong> Collection dropped
                    </li>
                    <li>
                      <strong>rename:</strong> Collection renamed
                    </li>
                    <li>
                      <strong>dropDatabase:</strong> Database dropped
                    </li>
                    <li>
                      <strong>invalidate:</strong> Change stream invalidated
                    </li>
                  </ul>
                </div>
              </section>

              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  Change Streams Examples
                </h2>

                {/* Basic Change Streams */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    1. Basic Change Streams (MongoDB Native)
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://localhost:27017?replicaSet=rs0");
await client.connect();

const db = client.db("myDatabase");
const collection = db.collection("users");

// ===== WATCH COLLECTION =====

const changeStream = collection.watch();

changeStream.on("change", (change) => {
  console.log("Change detected:");
  console.log("Operation:", change.operationType);
  console.log("Document ID:", change.documentKey._id);
  
  if (change.fullDocument) {
    console.log("Full document:", change.fullDocument);
  }
  
  if (change.updateDescription) {
    console.log("Updated fields:", change.updateDescription.updatedFields);
    console.log("Removed fields:", change.updateDescription.removedFields);
  }
});

changeStream.on("error", (error) => {
  console.error("Change stream error:", error);
});

// ===== CHANGE EVENT STRUCTURE =====

/*
{
  _id: {  // Resume token
    _data: "826..."
  },
  operationType: "insert" | "update" | "replace" | "delete",
  clusterTime: Timestamp,
  fullDocument: { ... },  // Complete document
  ns: {  // Namespace
    db: "myDatabase",
    coll: "users"
  },
  documentKey: {
    _id: ObjectId("...")
  },
  updateDescription: {  // For updates
    updatedFields: { name: "New Name" },
    removedFields: ["oldField"],
    truncatedArrays: []
  }
}
*/

// ===== CLOSE CHANGE STREAM =====

// Graceful shutdown
process.on("SIGINT", () => {
  changeStream.close();
  client.close();
});`}</code>
                  </pre>
                </div>

                {/* Filtered Change Streams */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    2. Filtered Change Streams
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== FILTER BY OPERATION TYPE =====

// Watch only inserts
const insertStream = collection.watch([
  { $match: { operationType: "insert" } }
]);

// Watch inserts and updates
const stream = collection.watch([
  { $match: {
    operationType: { $in: ["insert", "update"] }
  }}
]);

// ===== FILTER BY DOCUMENT FIELDS =====

// Watch specific user role
const adminStream = collection.watch([
  { $match: {
    "fullDocument.role": "admin"
  }}
]);

// Watch value changes
const priceChangeStream = collection.watch([
  { $match: {
    operationType: "update",
    "updateDescription.updatedFields.price": { $exists: true }
  }}
]);

// ===== COMPLEX FILTERS =====

// Multiple conditions
const complexStream = collection.watch([
  { $match: {
    $and: [
      { operationType: { $in: ["insert", "update"] } },
      { "fullDocument.status": "active" },
      { "fullDocument.priority": { $gte: 5 } }
    ]
  }}
]);

// ===== PROJECT FIELDS =====

// Only return specific fields
const projectedStream = collection.watch([
  {
    $project: {
      operationType: 1,
      "fullDocument.name": 1,
      "fullDocument.email": 1
    }
  }
]);

// ===== WATCH WITH FULL DOCUMENT =====

// Include full document for all operations
const fullDocStream = collection.watch([], {
  fullDocument: "updateLookup"
});

// Options:
// - "default": No full document
// - "updateLookup": Fetch current document for updates
// - "whenAvailable": Include if available
// - "required": Always include or error

fullDocStream.on("change", (change) => {
  console.log("Full document:", change.fullDocument);
});`}</code>
                  </pre>
                </div>

                {/* Resume Tokens */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    3. Resume Tokens & Error Recovery
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== SAVE RESUME TOKEN =====

let resumeToken;

const stream = collection.watch();

stream.on("change", (change) => {
  // Save resume token after each change
  resumeToken = change._id;
  
  // Process change
  processChange(change);
});

// ===== RESUME FROM TOKEN =====

// After disconnect or restart
if (resumeToken) {
  const resumedStream = collection.watch([], {
    resumeAfter: resumeToken
  });

  resumedStream.on("change", (change) => {
    resumeToken = change._id;
    processChange(change);
  });
}

// ===== START AFTER TIMESTAMP =====

// Start from specific time
const startTime = new Date("2024-01-01");

const timestampStream = collection.watch([], {
  startAtOperationTime: startTime
});

// ===== START AFTER TOKEN =====

// Similar to resumeAfter but continues even if token expired
const stream2 = collection.watch([], {
  startAfter: resumeToken
});

// ===== ERROR HANDLING =====

function createResilientStream() {
  const stream = collection.watch([], {
    resumeAfter: resumeToken
  });

  stream.on("change", (change) => {
    resumeToken = change._id;
    processChange(change);
  });

  stream.on("error", (error) => {
    console.error("Stream error:", error);
    
    // Recreate stream with last known token
    setTimeout(() => {
      createResilientStream();
    }, 1000);
  });

  stream.on("close", () => {
    console.log("Stream closed");
  });

  return stream;
}

const resilientStream = createResilientStream();`}</code>
                  </pre>
                </div>

                {/* Practical Examples */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    4. Practical Change Stream Patterns
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== REAL-TIME NOTIFICATIONS =====

const users = db.collection("users");

users.watch([
  { $match: {
    operationType: "update",
    "updateDescription.updatedFields.notifications": { $exists: true }
  }}
]).on("change", async (change) => {
  const userId = change.documentKey._id;
  const user = await users.findOne({ _id: userId });
  
  // Send push notification
  await sendPushNotification(user.deviceToken, user.notifications);
});

// ===== CACHE INVALIDATION =====

const products = db.collection("products");

products.watch([
  { $match: {
    operationType: { $in: ["update", "delete"] }
  }}
]).on("change", (change) => {
  const productId = change.documentKey._id;
  
  // Invalidate cache
  cache.del(\`product:\${productId}\`);
  
  // Broadcast to connected clients
  io.emit("product:updated", { productId });
});

// ===== AUDIT LOGGING =====

const sensitiveData = db.collection("users");
const auditLog = db.collection("auditLog");

sensitiveData.watch([
  { $match: {
    "fullDocument.role": "admin",
    operationType: { $in: ["update", "delete"] }
  }}
]).on("change", async (change) => {
  await auditLog.insertOne({
    operation: change.operationType,
    collection: "users",
    documentId: change.documentKey._id,
    timestamp: new Date(),
    changes: change.updateDescription
  });
});

// ===== DATA SYNCHRONIZATION =====

const sourceCollection = db.collection("source");
const targetCollection = db.collection("target");

sourceCollection.watch().on("change", async (change) => {
  switch (change.operationType) {
    case "insert":
      await targetCollection.insertOne(change.fullDocument);
      break;
    
    case "update":
      await targetCollection.updateOne(
        { _id: change.documentKey._id },
        { $set: change.updateDescription.updatedFields }
      );
      break;
    
    case "delete":
      await targetCollection.deleteOne({ _id: change.documentKey._id });
      break;
  }
});

// ===== WATCH DATABASE =====

// Watch all collections in database
const dbStream = db.watch();

dbStream.on("change", (change) => {
  console.log(\`Change in \${change.ns.coll}:\`, change.operationType);
});

// ===== WATCH CLUSTER =====

// Watch all databases (requires admin privileges)
const clusterStream = client.watch();

clusterStream.on("change", (change) => {
  console.log(\`\${change.ns.db}.\${change.ns.coll}\`);
});

await client.close();`}</code>
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
                  <strong>Transaction size:</strong> Keep transactions small and
                  fast
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
                  <strong>Retry logic:</strong> Handle transient errors with
                  exponential backoff
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Read concern:</strong> Use &quot;snapshot&quot; for
                  consistent reads
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Write concern:</strong> Use &quot;majority&quot; for
                  durability
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Resume tokens:</strong> Persist tokens for change
                  stream recovery
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Filter early:</strong> Use $match early in change
                  stream pipeline
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Full document:</strong> Use &quot;updateLookup&quot;
                  only when needed
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Error handling:</strong> Implement reconnection logic
                  for streams
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Resource cleanup:</strong> Close change streams on
                  shutdown
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
              href="/phase7/geospatial-text"
              className="bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-500 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              Next: Geospatial & Text Search →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
