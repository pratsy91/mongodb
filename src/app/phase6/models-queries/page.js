"use client";

import Link from "next/link";
import { useState } from "react";

export default function ModelsQueriesPage() {
  const [activeTab, setActiveTab] = useState("models");

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
          Models & Queries
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          All Model Methods and Complete Query API
        </p>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 flex-wrap">
          <button
            onClick={() => setActiveTab("models")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "models"
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Model Methods
          </button>
          <button
            onClick={() => setActiveTab("queries")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "queries"
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Query Methods
          </button>
          <button
            onClick={() => setActiveTab("advanced")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "advanced"
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Advanced Queries
          </button>
        </div>

        <div className="space-y-8">
          {/* Model Methods Tab */}
          {activeTab === "models" && (
            <>
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  Model Methods
                </h2>

                {/* Create Operations */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    1. Create Operations
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`const User = mongoose.model("User", userSchema);

// ===== CREATE =====

// Create single document
const user = await User.create({
  name: "John",
  email: "john@example.com"
});

// Create multiple documents
const users = await User.create([
  { name: "Alice", email: "alice@example.com" },
  { name: "Bob", email: "bob@example.com" }
]);

// ===== INSERT MANY =====

// Faster for bulk inserts (bypasses middleware)
const inserted = await User.insertMany([
  { name: "User1" },
  { name: "User2" }
]);

// With options
await User.insertMany(docs, {
  ordered: false,        // Continue on error
  rawResult: true,       // Return full result
  lean: true            // Return plain objects
});

// ===== NEW + SAVE =====

// Create instance
const newUser = new User({
  name: "Jane",
  email: "jane@example.com"
});

// Save (runs middleware)
await newUser.save();

// Save with options
await newUser.save({
  validateBeforeSave: false,  // Skip validation
  timestamps: false          // Don't update timestamps
});`}</code>
                  </pre>
                </div>

                {/* Find Operations */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    2. Find Operations
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== FIND =====

// Find all
const allUsers = await User.find();

// Find with filter
const activeUsers = await User.find({ active: true });

// Find with multiple conditions
const results = await User.find({
  age: { $gte: 18 },
  role: "user",
  "address.city": "New York"
});

// ===== FIND ONE =====

// Find single document
const user = await User.findOne({ email: "john@example.com" });

// Returns null if not found
if (!user) {
  console.log("User not found");
}

// ===== FIND BY ID =====

// Find by MongoDB ObjectId
const user = await User.findById("507f1f77bcf86cd799439011");

// Find by ID with select
const user = await User.findById(id).select("name email");

// ===== EXISTS =====

// Check if document exists
const exists = await User.exists({ email: "john@example.com" });
console.log(exists);  // { _id: ... } or null

// ===== FIND WITH OPTIONS =====

await User.find(filter, {
  limit: 10,
  skip: 20,
  sort: { createdAt: -1 },
  select: "name email",
  populate: "posts"
});`}</code>
                  </pre>
                </div>

                {/* Update Operations */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    3. Update Operations
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== UPDATE ONE =====

const result = await User.updateOne(
  { email: "john@example.com" },
  { $set: { name: "John Updated" } }
);

console.log(result.modifiedCount);  // Number of modified docs

// ===== UPDATE MANY =====

await User.updateMany(
  { active: false },
  { $set: { deleted: true } }
);

// ===== REPLACE ONE =====

// Replace entire document (except _id)
await User.replaceOne(
  { _id: userId },
  {
    name: "New Name",
    email: "new@example.com"
    // Only these fields will exist
  }
);

// ===== FIND ONE AND UPDATE =====

// Find and update, returns document
const user = await User.findOneAndUpdate(
  { email: "john@example.com" },
  { $inc: { loginCount: 1 } },
  {
    new: true,              // Return updated doc
    upsert: true,           // Create if not exists
    runValidators: true,    // Run validators
    setDefaultsOnInsert: true
  }
);

// ===== FIND BY ID AND UPDATE =====

const updated = await User.findByIdAndUpdate(
  userId,
  { $set: { status: "active" } },
  { new: true }
);

// ===== FIND ONE AND REPLACE =====

const replaced = await User.findOneAndReplace(
  { email: "old@example.com" },
  { email: "new@example.com", name: "New" },
  { new: true }
);`}</code>
                  </pre>
                </div>

                {/* Delete Operations */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    4. Delete Operations
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== DELETE ONE =====

const result = await User.deleteOne({ email: "john@example.com" });
console.log(result.deletedCount);  // 1 or 0

// ===== DELETE MANY =====

await User.deleteMany({ active: false });

// Delete all (dangerous!)
await User.deleteMany({});

// ===== FIND ONE AND DELETE =====

// Find and delete, returns deleted document
const deleted = await User.findOneAndDelete({
  email: "john@example.com"
});

if (deleted) {
  console.log("Deleted:", deleted);
}

// ===== FIND BY ID AND DELETE =====

const removed = await User.findByIdAndDelete(userId);

// ===== REMOVE (DEPRECATED) =====

// Old method (prefer deleteOne/deleteMany)
const doc = await User.findOne({ email: "john@example.com" });
if (doc) {
  await doc.remove();  // Triggers middleware
}`}</code>
                  </pre>
                </div>

                {/* Count Operations */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    5. Count Operations
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== COUNT DOCUMENTS =====

// Accurate count (scans collection)
const count = await User.countDocuments({ active: true });

// Count all
const total = await User.countDocuments();

// ===== ESTIMATED DOCUMENT COUNT =====

// Fast but approximate (uses collection metadata)
const estimate = await User.estimatedDocumentCount();

// Note: estimatedDocumentCount doesn't accept filter

// ===== COUNT (DEPRECATED) =====

// Old method (prefer countDocuments)
const count = await User.count({ active: true });`}</code>
                  </pre>
                </div>

                {/* Other Model Methods */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    6. Other Model Methods
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== DISTINCT =====

// Get unique values
const cities = await User.distinct("address.city");
console.log(cities);  // ["New York", "Boston", "Chicago"]

// With filter
const activeCities = await User.distinct("address.city", {
  active: true
});

// ===== BULK WRITE =====

await User.bulkWrite([
  {
    insertOne: {
      document: { name: "User1" }
    }
  },
  {
    updateOne: {
      filter: { name: "User2" },
      update: { $set: { active: true } }
    }
  },
  {
    deleteOne: {
      filter: { name: "User3" }
    }
  }
]);

// ===== HYDRATE =====

// Convert plain object to Mongoose document
const plain = { name: "John", _id: "..." };
const doc = User.hydrate(plain);

// Now has methods and virtuals
console.log(doc.fullName);  // Virtual works

// ===== WATCH (CHANGE STREAMS) =====

const changeStream = User.watch();

changeStream.on("change", (change) => {
  console.log("Change:", change);
});

// With pipeline
User.watch([
  { $match: { "fullDocument.active": true } }
]);

// ===== SYNC INDEXES =====

// Synchronize indexes with schema
await User.syncIndexes();

// ===== CREATE INDEXES =====

// Create all indexes defined in schema
await User.createIndexes();

// ===== LIST INDEXES =====

const indexes = await User.listIndexes();

// ===== POPULATE =====

// Populate references
const user = await User.findById(id).populate("posts");

// Multiple populate
await User.findById(id)
  .populate("posts")
  .populate("friends");`}</code>
                  </pre>
                </div>
              </section>
            </>
          )}

          {/* Query Methods Tab */}
          {activeTab === "queries" && (
            <>
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  Query Methods
                </h2>

                {/* Query Building */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    1. Query Building
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== WHERE =====

// Build query with where
const query = User.find()
  .where("age").gte(18)
  .where("name").equals("John")
  .where("email").ne(null);

await query.exec();

// Multiple conditions
User.find()
  .where("age").gte(18).lte(65)
  .where("role").in(["user", "admin"])
  .where("active").equals(true);

// ===== COMPARISON OPERATORS =====

// Greater than
User.find().where("age").gt(18);

// Greater than or equal
User.find().where("age").gte(18);

// Less than
User.find().where("age").lt(65);

// Less than or equal
User.find().where("age").lte(65);

// Not equal
User.find().where("status").ne("deleted");

// In array
User.find().where("role").in(["admin", "moderator"]);

// Not in array
User.find().where("status").nin(["banned", "suspended"]);

// ===== LOGICAL OPERATORS =====

// OR
User.find()
  .or([
    { age: { $lt: 18 } },
    { parental_consent: true }
  ]);

// AND
User.find()
  .and([
    { age: { $gte: 18 } },
    { verified: true }
  ]);

// NOR
User.find()
  .nor([
    { deleted: true },
    { banned: true }
  ]);`}</code>
                  </pre>
                </div>

                {/* Query Modifiers */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    2. Query Modifiers
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== SELECT =====

// Include specific fields
User.find().select("name email");
User.find().select({ name: 1, email: 1 });

// Exclude fields
User.find().select("-password -__v");
User.find().select({ password: 0, __v: 0 });

// ===== SORT =====

// Sort ascending
User.find().sort("age");
User.find().sort({ age: 1 });

// Sort descending
User.find().sort("-createdAt");
User.find().sort({ createdAt: -1 });

// Multiple sorts
User.find().sort({ role: 1, age: -1 });

// ===== LIMIT =====

// Limit results
User.find().limit(10);

// ===== SKIP =====

// Skip documents (pagination)
User.find().skip(20);

// Pagination example
const page = 3;
const perPage = 10;
User.find()
  .skip((page - 1) * perPage)
  .limit(perPage);

// ===== SLICE =====

// Limit array elements
User.findOne().slice("posts", 5);  // First 5
User.findOne().slice("posts", -5); // Last 5
User.findOne().slice("posts", [10, 5]); // Skip 10, limit 5

// ===== LEAN =====

// Return plain JavaScript objects (faster)
const users = await User.find().lean();
// No Mongoose document methods/virtuals

// With virtuals
await User.find().lean({ virtuals: true });

// ===== EXEC =====

// Execute query
const users = await User.find().exec();

// Returns promise
User.find().exec()
  .then(users => console.log(users))
  .catch(err => console.error(err));`}</code>
                  </pre>
                </div>

                {/* Query Options */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    3. Query Options
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== COLLATION =====

// Case-insensitive search
User.find({ name: "john" })
  .collation({ locale: "en", strength: 2 });

// ===== HINT =====

// Force index usage
User.find().hint({ email: 1 });

// ===== MAX TIME =====

// Set max execution time
User.find().maxTimeMS(5000);  // 5 seconds

// ===== READ PREFERENCE =====

// Set read preference
User.find().read("secondary");

// Options: primary, primaryPreferred, secondary, 
// secondaryPreferred, nearest

// ===== SET OPTIONS =====

User.find().setOptions({
  maxTimeMS: 5000,
  collation: { locale: "en" },
  hint: { email: 1 }
});

// ===== COMMENT =====

// Add comment to query
User.find().comment("Finding active users");

// ===== BATCH SIZE =====

// Set cursor batch size
User.find().batchSize(100);

// ===== ALLOW DISK USE =====

// Allow disk usage for large sorts
User.find()
  .sort({ score: -1 })
  .allowDiskUse(true);`}</code>
                  </pre>
                </div>

                {/* String and Array Queries */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    4. String and Array Queries
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== STRING QUERIES =====

// Regex
User.find().where("name").regex(/^john/i);

// Exact match
User.find().where("email").equals("john@example.com");

// ===== ARRAY QUERIES =====

// All elements match
User.find()
  .where("tags").all(["mongodb", "nodejs"]);

// Element match
User.find()
  .where("items").elemMatch({ price: { $gt: 100 } });

// Size
User.find()
  .where("tags").size(3);

// ===== EXISTS =====

// Field exists
User.find().where("email").exists(true);

// Field doesn't exist
User.find().where("phone").exists(false);

// ===== TYPE =====

// Field type
User.find().where("age").type("number");

// ===== MOD =====

// Modulo operation
User.find().where("age").mod([5, 0]);  // age % 5 === 0`}</code>
                  </pre>
                </div>
              </section>
            </>
          )}

          {/* Advanced Queries Tab */}
          {activeTab === "advanced" && (
            <>
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  Advanced Queries
                </h2>

                {/* Cursors */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    1. Cursors
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== CURSOR =====

// Get cursor
const cursor = User.find().cursor();

// Iterate with for-await
for await (const doc of cursor) {
  console.log(doc.name);
}

// Next method
const cursor = User.find().cursor();
let doc = await cursor.next();
while (doc) {
  console.log(doc);
  doc = await cursor.next();
}

// Close cursor
await cursor.close();

// ===== CURSOR OPTIONS =====

const cursor = User.find().cursor({
  batchSize: 100,
  transform: doc => doc.toJSON()
});

// ===== CURSOR EVENTS =====

cursor.on("data", doc => {
  console.log("Data:", doc);
});

cursor.on("end", () => {
  console.log("Cursor closed");
});

cursor.on("error", err => {
  console.error("Error:", err);
});

// ===== EACHSYNC =====

// Process each document synchronously
await User.find().cursor().eachAsync(async (doc) => {
  await processDocument(doc);
});`}</code>
                  </pre>
                </div>

                {/* Aggregation */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    2. Aggregation
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== AGGREGATE =====

// Basic aggregation
const results = await User.aggregate([
  { $match: { active: true } },
  { $group: { _id: "$role", count: { $sum: 1 } } },
  { $sort: { count: -1 } }
]);

// With explain
await User.aggregate(pipeline).explain();

// With options
await User.aggregate(pipeline, {
  allowDiskUse: true,
  maxTimeMS: 30000
});

// ===== AGGREGATION CURSOR =====

const cursor = User.aggregate(pipeline).cursor();

for await (const doc of cursor) {
  console.log(doc);
}

// ===== AGGREGATION HELPERS =====

// Append stages
User.aggregate()
  .match({ active: true })
  .group({ _id: "$role", count: { $sum: 1 } })
  .sort({ count: -1 })
  .limit(10);

// Facet
await User.aggregate()
  .facet({
    byRole: [
      { $group: { _id: "$role", count: { $sum: 1 } } }
    ],
    byAge: [
      { $bucket: {
          groupBy: "$age",
          boundaries: [0, 18, 30, 50, 100]
        }
      }
    ]
  });`}</code>
                  </pre>
                </div>

                {/* Transactions */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    3. Transactions
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== START SESSION =====

const session = await mongoose.startSession();

// ===== TRANSACTION =====

session.startTransaction();

try {
  await User.create([{ name: "John" }], { session });
  await Order.create([{ userId: "..." }], { session });
  
  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
  throw error;
} finally {
  session.endSession();
}

// ===== WITH TRANSACTION HELPER =====

await mongoose.connection.transaction(async (session) => {
  await User.create([{ name: "John" }], { session });
  await Order.create([{ userId: "..." }], { session });
  // Auto commits or aborts
});

// ===== QUERIES WITH SESSION =====

// Find with session
await User.find().session(session);

// Update with session
await User.updateOne(
  { _id: userId },
  { $set: { name: "Updated" } },
  { session }
);

// Delete with session
await User.deleteOne({ _id: userId }, { session });`}</code>
                  </pre>
                </div>

                {/* Other Advanced Features */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    4. Other Advanced Features
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== MAP REDUCE =====

const results = await User.mapReduce({
  map: function() {
    emit(this.role, 1);
  },
  reduce: function(key, values) {
    return Array.sum(values);
  },
  out: { inline: 1 }
});

// ===== GEO QUERIES =====

// Near
User.find()
  .near("location", {
    center: [-73.97, 40.77],
    maxDistance: 5000
  });

// Within
User.find()
  .within("location")
  .box([[-73.99, 40.73], [-73.95, 40.80]]);

// ===== VALIDATE =====

// Validate document without saving
const user = new User({ email: "invalid" });
const error = user.validateSync();

// Async validate
await user.validate();

// ===== EXPLAIN =====

// Explain query plan
const explain = await User
  .find({ age: { $gte: 18 } })
  .explain("executionStats");

console.log(explain);

// ===== GET/SET =====

// Get query filter
const filter = query.getFilter();

// Get update
const update = query.getUpdate();

// Get options
const options = query.getOptions();

// Set query
query.setQuery({ age: { $gte: 18 } });

// Merge update
query.setUpdate({ $inc: { views: 1 } });`}</code>
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
                  <strong>Use lean() for read-only:</strong> Faster performance
                  for data you don't modify
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Select only needed fields:</strong> Reduce network
                  transfer and memory usage
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Use cursors for large datasets:</strong> Process
                  documents one at a time
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Pagination with skip/limit:</strong> Always add sort
                  for consistent results
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Use countDocuments over count:</strong> count() is
                  deprecated
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>findOneAndUpdate over find + save:</strong> Atomic
                  operation
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Use exists() over findOne():</strong> Faster for
                  existence checks
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Enable runValidators for updates:</strong> Maintain
                  data integrity
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Use bulkWrite for multiple operations:</strong> Better
                  performance
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Use transactions for multi-document updates:</strong>{" "}
                  Ensure consistency
                </span>
              </li>
            </ul>
          </section>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8">
            <Link
              href="/phase6/schema-features"
              className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              ← Previous: Schema Features
            </Link>
            <Link
              href="/phase6/documents-population"
              className="bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-500 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              Next: Documents & Population →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
