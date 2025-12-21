"use client";

import Link from "next/link";
import { useState } from "react";

export default function BasicIndexesPage() {
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
          Basic Indexes
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Single field, Compound, Multikey indexes and Index operations
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
              <p className="text-lg">
                <strong>Indexes</strong> are special data structures that store
                a small portion of the collection&apos;s data in an
                easy-to-traverse form. They dramatically improve query
                performance by reducing the number of documents MongoDB needs to
                examine.
              </p>

              <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                Index Types
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Single Field:</strong> Index on a single field
                </li>
                <li>
                  <strong>Compound:</strong> Index on multiple fields
                </li>
                <li>
                  <strong>Multikey:</strong> Index on array fields (automatic)
                </li>
              </ul>

              <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                Key Concepts
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>_id Index:</strong> Automatically created on _id field
                </li>
                <li>
                  <strong>Ascending (1):</strong> Sort order ascending
                </li>
                <li>
                  <strong>Descending (-1):</strong> Sort order descending
                </li>
                <li>
                  <strong>Index Prefix:</strong> Leftmost fields of compound
                  index
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

              {/* Single Field Indexes */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  1. Single Field Indexes
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://localhost:27017");
await client.connect();
const db = client.db("myDatabase");
const users = db.collection("users");

// ===== CREATE SINGLE FIELD INDEXES =====

// Basic single field index (ascending)
await users.createIndex({ email: 1 });

// Descending index
await users.createIndex({ createdAt: -1 });

// Index on nested field
await users.createIndex({ "address.city": 1 });

// Index on embedded document
await users.createIndex({ "profile.settings": 1 });

// ===== LIST INDEXES =====

// View all indexes on collection
const indexes = await users.listIndexes().toArray();
console.log(indexes);
// Output: [
//   { v: 2, key: { _id: 1 }, name: "_id_" },
//   { v: 2, key: { email: 1 }, name: "email_1" },
//   ...
// ]

// ===== DROP INDEXES =====

// Drop specific index by name
await users.dropIndex("email_1");

// Drop index by key specification
await users.dropIndex({ email: 1 });

// Drop all indexes except _id
await users.dropIndexes();

// ===== QUERIES USING SINGLE FIELD INDEXES =====

// Query that uses email index
await users.find({ email: "user@example.com" }).toArray();

// Range query using createdAt index
await users.find({
  createdAt: {
    $gte: new Date("2024-01-01"),
    $lt: new Date("2024-12-31")
  }
}).toArray();

// Sort query using index
await users.find().sort({ createdAt: -1 }).limit(10).toArray();

// Nested field query
await users.find({ "address.city": "New York" }).toArray();

// ===== INDEX WITH OPTIONS =====

// Create index with name
await users.createIndex(
  { username: 1 },
  { name: "username_idx" }
);

// Background index creation (non-blocking)
await users.createIndex(
  { lastName: 1 },
  { background: true }
);

// ===== PRACTICAL EXAMPLES =====

// User lookup by email
await users.createIndex({ email: 1 });
await users.find({ email: "john@example.com" }).toArray();

// Recent users query
await users.createIndex({ registrationDate: -1 });
await users.find().sort({ registrationDate: -1 }).limit(20).toArray();

// Search by status
await users.createIndex({ accountStatus: 1 });
await users.find({ accountStatus: "active" }).toArray();

// Age range query
await users.createIndex({ age: 1 });
await users.find({ age: { $gte: 18, $lte: 65 } }).toArray();

await client.close();`}</code>
                </pre>
              </div>

              {/* Compound Indexes */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  2. Compound Indexes
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://localhost:27017");
await client.connect();
const db = client.db("myDatabase");
const orders = db.collection("orders");

// ===== CREATE COMPOUND INDEXES =====

// Two-field compound index
await orders.createIndex({ customerId: 1, orderDate: -1 });

// Three-field compound index
await orders.createIndex({ 
  status: 1, 
  priority: 1, 
  createdAt: -1 
});

// Mixed ascending/descending
await orders.createIndex({ 
  region: 1,      // Ascending
  total: -1,      // Descending
  date: -1        // Descending
});

// Nested fields in compound index
await orders.createIndex({ 
  "customer.id": 1,
  "shipping.country": 1 
});

// ===== INDEX PREFIX USAGE =====

// Compound index: { a: 1, b: 1, c: 1 }
await orders.createIndex({ customerId: 1, status: 1, orderDate: -1 });

// These queries can use the index:
await orders.find({ customerId: "123" }).toArray();
await orders.find({ customerId: "123", status: "completed" }).toArray();
await orders.find({ customerId: "123", status: "completed", orderDate: { $gte: new Date() } }).toArray();

// These CANNOT use the index efficiently:
await orders.find({ status: "completed" }).toArray();  // Skips first field
await orders.find({ orderDate: { $gte: new Date() } }).toArray();  // Skips first fields

// ===== SORT WITH COMPOUND INDEX =====

// Compound index: { customerId: 1, orderDate: -1 }
await orders.createIndex({ customerId: 1, orderDate: -1 });

// Can use index for sorting
await orders.find({ customerId: "123" }).sort({ orderDate: -1 }).toArray();

// Can use index in reverse
await orders.find({ customerId: "123" }).sort({ orderDate: 1 }).toArray();

// Cannot use index (mixed sort order)
await orders.find({ customerId: "123" }).sort({ orderDate: 1, total: -1 }).toArray();

// ===== EQUALITY + RANGE QUERIES =====

// Best practice: Put equality fields first, range fields last
await orders.createIndex({ status: 1, orderDate: -1 });

// Efficient query
await orders.find({
  status: "pending",  // Equality
  orderDate: { $gte: new Date("2024-01-01") }  // Range
}).toArray();

// ===== PRACTICAL EXAMPLES =====

// Customer order history
await orders.createIndex({ customerId: 1, orderDate: -1 });
await orders.find({ customerId: "customer123" })
  .sort({ orderDate: -1 })
  .limit(10)
  .toArray();

// E-commerce product search
const products = db.collection("products");
await products.createIndex({ category: 1, price: 1, rating: -1 });
await products.find({
  category: "electronics",
  price: { $lte: 1000 }
}).sort({ rating: -1 }).toArray();

// User activity tracking
const activities = db.collection("activities");
await activities.createIndex({ userId: 1, timestamp: -1, type: 1 });
await activities.find({
  userId: "user123",
  timestamp: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
}).toArray();

// Order fulfillment
await orders.createIndex({ status: 1, priority: -1, createdAt: 1 });
await orders.find({
  status: { $in: ["pending", "processing"] }
}).sort({ priority: -1, createdAt: 1 }).limit(50).toArray();

// ===== INDEX INTERSECTION =====

// MongoDB can use multiple indexes together
await orders.createIndex({ customerId: 1 });
await orders.createIndex({ status: 1 });

// Can use both indexes (index intersection)
await orders.find({
  customerId: "customer123",
  status: "completed"
}).toArray();

// Note: Single compound index is usually more efficient
await orders.createIndex({ customerId: 1, status: 1 });

await client.close();`}</code>
                </pre>
              </div>

              {/* Multikey Indexes */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  3. Multikey Indexes
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://localhost:27017");
await client.connect();
const db = client.db("myDatabase");
const products = db.collection("products");

// ===== MULTIKEY INDEXES ON ARRAYS =====

// Document structure:
// {
//   name: "Product A",
//   tags: ["electronics", "sale", "new"],
//   categories: ["computers", "laptops"]
// }

// Create index on array field (automatically multikey)
await products.createIndex({ tags: 1 });

// MongoDB automatically creates multikey index
// Each array element gets indexed separately

// ===== QUERIES WITH MULTIKEY INDEXES =====

// Query for single array element
await products.find({ tags: "electronics" }).toArray();
// Uses index efficiently

// Query for multiple elements
await products.find({ tags: { $in: ["electronics", "sale"] } }).toArray();

// Query with $all
await products.find({ tags: { $all: ["electronics", "sale"] } }).toArray();

// Query with array operators
await products.find({ tags: { $size: 3 } }).toArray();

// ===== COMPOUND MULTIKEY INDEXES =====

// Compound index with one array field
await products.createIndex({ tags: 1, price: -1 });

// LIMITATION: Cannot have multiple array fields in same compound index
// This is NOT allowed:
// await products.createIndex({ tags: 1, categories: 1 });  // ERROR if both are arrays

// Valid: One array field + scalar fields
await products.createIndex({ tags: 1, price: 1, inStock: 1 });

// ===== MULTIKEY INDEXES ON EMBEDDED DOCUMENTS =====

// Document structure:
// {
//   name: "Order 1",
//   items: [
//     { productId: "p1", quantity: 2, price: 10 },
//     { productId: "p2", quantity: 1, price: 20 }
//   ]
// }

const orders = db.collection("orders");

// Index on array of embedded documents
await orders.createIndex({ "items.productId": 1 });

// Query embedded array field
await orders.find({ "items.productId": "p1" }).toArray();

// Compound index with embedded array field
await orders.createIndex({ customerId: 1, "items.productId": 1 });
await orders.find({
  customerId: "customer123",
  "items.productId": "p1"
}).toArray();

// ===== MULTIKEY INDEX SIZE CONSIDERATIONS =====

// Large arrays can create many index entries
// Document with 100 tags creates 100 index entries

// Example: Document with many tags
await products.insertOne({
  name: "Popular Product",
  tags: Array.from({ length: 100 }, (_, i) => \`tag\${i}\`)
});

// This creates 100 index entries for "tags" index
// Consider limiting array sizes or using different approach

// ===== PRACTICAL EXAMPLES =====

// Blog posts with tags
const posts = db.collection("posts");
await posts.createIndex({ tags: 1, published: -1 });
await posts.find({
  tags: "mongodb",
  published: true
}).sort({ createdAt: -1 }).toArray();

// Products with multiple categories
await products.createIndex({ categories: 1, price: 1 });
await products.find({
  categories: "electronics",
  price: { $lte: 1000 }
}).toArray();

// User permissions
const users = db.collection("users");
await users.createIndex({ roles: 1 });
await users.find({ roles: "admin" }).toArray();

// Skills search
const candidates = db.collection("candidates");
await candidates.createIndex({ skills: 1, experience: -1 });
await candidates.find({
  skills: { $in: ["javascript", "mongodb", "react"] }
}).sort({ experience: -1 }).toArray();

// Order items search
await orders.createIndex({ "items.sku": 1, status: 1 });
await orders.find({
  "items.sku": "SKU-12345",
  status: { $in: ["shipped", "delivered"] }
}).toArray();

await client.close();`}</code>
                </pre>
              </div>

              {/* Index Operations */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  4. Index Operations & Management
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://localhost:27017");
await client.connect();
const db = client.db("myDatabase");
const collection = db.collection("myCollection");

// ===== CREATE INDEXES =====

// Create single index
await collection.createIndex({ field1: 1 });

// Create multiple indexes at once
await collection.createIndexes([
  { key: { field1: 1 } },
  { key: { field2: -1 } },
  { key: { field3: 1, field4: -1 } }
]);

// Create with options
await collection.createIndex(
  { email: 1 },
  {
    name: "email_index",
    unique: true,
    background: true,
    sparse: true
  }
);

// ===== LIST INDEXES =====

// Get all indexes
const indexes = await collection.listIndexes().toArray();
console.log(indexes);

// Check if specific index exists
const hasIndex = indexes.some(idx => idx.name === "email_1");

// ===== DROP INDEXES =====

// Drop by name
await collection.dropIndex("email_1");

// Drop by specification
await collection.dropIndex({ email: 1 });

// Drop all indexes except _id
await collection.dropIndexes();

// Drop multiple specific indexes
await collection.dropIndex("index1");
await collection.dropIndex("index2");

// ===== REINDEX =====

// Rebuild all indexes (use with caution - blocking operation)
await collection.reIndex();

// Note: Usually not needed, MongoDB handles index maintenance

// ===== HIDE/UNHIDE INDEXES =====

// Hide index (MongoDB 4.4+)
await db.command({
  collMod: "myCollection",
  index: {
    keyPattern: { field1: 1 },
    hidden: true
  }
});

// Unhide index
await db.command({
  collMod: "myCollection",
  index: {
    keyPattern: { field1: 1 },
    hidden: false
  }
});

// ===== INDEX STATS =====

// Get index statistics
const stats = await collection.aggregate([
  { $indexStats: {} }
]).toArray();

console.log(stats);
// Shows: name, key, host, accesses (ops, since)

// ===== CHECK INDEX USAGE =====

// Get collection stats including index sizes
const collStats = await db.command({ collStats: "myCollection" });
console.log(collStats.indexSizes);
// Output: { _id_: 229376, email_1: 114688, ... }

// ===== PRACTICAL INDEX MANAGEMENT =====

// Setup indexes for new collection
async function setupIndexes(collection) {
  // Create multiple indexes
  await collection.createIndexes([
    { 
      key: { email: 1 },
      unique: true,
      name: "email_unique"
    },
    { 
      key: { createdAt: -1 },
      name: "created_desc"
    },
    { 
      key: { status: 1, priority: -1 },
      name: "status_priority"
    }
  ]);
  
  console.log("Indexes created successfully");
}

// Remove old unused indexes
async function cleanupIndexes(collection) {
  const indexes = await collection.listIndexes().toArray();
  
  for (const index of indexes) {
    if (index.name !== "_id_") {
      // Check index usage from stats
      // Drop if not used (pseudo-code)
      console.log(\`Index: \${index.name}\`);
    }
  }
}

// Monitor index creation progress
async function monitorIndexCreation(collection, indexName) {
  const status = await db.command({
    currentOp: true,
    $or: [
      { op: "command", "command.createIndexes": collection.collectionName }
    ]
  });
  
  console.log(status);
}

// ===== ERROR HANDLING =====

try {
  // Attempt to create duplicate unique index
  await collection.createIndex({ email: 1 }, { unique: true });
} catch (error) {
  if (error.code === 11000) {
    console.log("Duplicate key error - index already exists or duplicate values");
  }
}

// ===== BEST PRACTICES =====

// 1. Create indexes before bulk inserts
await collection.createIndex({ userId: 1, timestamp: -1 });
await collection.insertMany(largeDataset);

// 2. Use background: true for production
await collection.createIndex(
  { field: 1 },
  { background: true }
);

// 3. Name your indexes descriptively
await collection.createIndex(
  { userId: 1, createdAt: -1 },
  { name: "user_activity_timeline" }
);

// 4. Drop unused indexes
const unusedIndexes = ["old_index_1", "deprecated_index_2"];
for (const indexName of unusedIndexes) {
  try {
    await collection.dropIndex(indexName);
    console.log(\`Dropped: \${indexName}\`);
  } catch (e) {
    console.log(\`Index not found: \${indexName}\`);
  }
}

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

              {/* Indexes in Mongoose */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-purple-300">
                  1. Indexes in Mongoose Schemas
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const mongoose = require("mongoose");

await mongoose.connect("mongodb://localhost:27017/myDatabase");

// ===== SINGLE FIELD INDEXES IN SCHEMA =====

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,        // Creates unique index
    index: true          // Creates regular index
  },
  username: {
    type: String,
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// ===== COMPOUND INDEXES IN SCHEMA =====

// Method 1: Schema-level index
userSchema.index({ lastName: 1, firstName: 1 });

// Method 2: Multiple fields
userSchema.index({ status: 1, priority: -1, createdAt: -1 });

// ===== MULTIKEY INDEXES =====

const postSchema = new mongoose.Schema({
  title: String,
  tags: [String],              // Automatically multikey when indexed
  categories: [String]
});

// Index on array field
postSchema.index({ tags: 1 });

// Compound with array field
postSchema.index({ tags: 1, published: -1 });

// ===== INDEX OPTIONS =====

const productSchema = new mongoose.Schema({
  sku: {
    type: String,
    unique: true,
    sparse: true           // Sparse index
  },
  name: String,
  price: Number
});

// Index with options
productSchema.index(
  { name: "text" },
  { 
    weights: { name: 10 },
    name: "product_text_search"
  }
);

// ===== ENSURE INDEXES =====

const User = mongoose.model("User", userSchema);

// Create indexes defined in schema
await User.createIndexes();

// Or use syncIndexes (removes old indexes)
await User.syncIndexes();

// ===== LIST INDEXES =====

// Get all indexes
const indexes = await User.collection.listIndexes().toArray();
console.log(indexes);

// ===== DROP INDEXES =====

// Drop specific index
await User.collection.dropIndex("email_1");

// Drop all indexes
await User.collection.dropIndexes();

// ===== DISABLE AUTO INDEX CREATION =====

// In production, disable auto-indexing
userSchema.set("autoIndex", false);

// Or globally
mongoose.set("autoIndex", false);

// Manually create indexes
await User.createIndexes();

// ===== PRACTICAL EXAMPLES =====

// E-commerce product model
const productSchema = new mongoose.Schema({
  name: String,
  sku: { type: String, unique: true },
  category: String,
  price: Number,
  inStock: Boolean,
  tags: [String],
  createdAt: Date
});

// Define indexes
productSchema.index({ category: 1, price: 1 });
productSchema.index({ tags: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ sku: 1 }, { unique: true, sparse: true });

const Product = mongoose.model("Product", productSchema);

// Blog post model
const blogSchema = new mongoose.Schema({
  title: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  tags: [String],
  published: Boolean,
  publishedAt: Date
});

blogSchema.index({ author: 1, publishedAt: -1 });
blogSchema.index({ tags: 1, published: 1 });
blogSchema.index({ title: "text" });

const Blog = mongoose.model("Blog", blogSchema);

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
                  <strong>Index frequently queried fields:</strong> Analyze
                  query patterns before creating indexes
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Compound index order matters:</strong> Place equality
                  fields first, then sort fields, then range fields
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Use index prefixes:</strong> Compound index on {"{"}a,
                  b, c{"}"} supports queries on a, {"{"}a,b{"}"}, {"{"}a,b,c
                  {"}"}
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Limit number of indexes:</strong> Each index has
                  overhead for writes
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>
                    One compound index over multiple single indexes:
                  </strong>{" "}
                  More efficient than index intersection
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Monitor index usage:</strong> Use $indexStats to
                  identify unused indexes
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Background index creation:</strong> Use background:
                  true in production to avoid blocking
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Array field limitation:</strong> Only one array field
                  per compound index
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Index size matters:</strong> Keep indexed fields small
                  for better performance
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Name your indexes:</strong> Use descriptive names for
                  easier management
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
              href="/phase5/specialized-indexes"
              className="bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-500 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              Next: Specialized Indexes →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
