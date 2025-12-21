"use client";

import Link from "next/link";
import { useState } from "react";

export default function IndexPropertiesPage() {
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
          Index Properties
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          TTL, Unique, Sparse, Partial, Hidden, and Collation indexes
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
                Index Properties
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Unique:</strong> Ensures no duplicate values
                </li>
                <li>
                  <strong>Sparse:</strong> Only indexes documents with the field
                </li>
                <li>
                  <strong>TTL:</strong> Automatically deletes documents after
                  time
                </li>
                <li>
                  <strong>Partial:</strong> Indexes subset based on filter
                </li>
                <li>
                  <strong>Hidden:</strong> Index exists but not used by query
                  planner
                </li>
                <li>
                  <strong>Collation:</strong> Language-specific string
                  comparison
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

              {/* Unique Indexes */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  1. Unique Indexes
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://localhost:27017");
await client.connect();
const db = client.db("myDatabase");
const users = db.collection("users");

// ===== CREATE UNIQUE INDEXES =====

// Single field unique index
await users.createIndex(
  { email: 1 },
  { unique: true }
);

// Compound unique index
await users.createIndex(
  { firstName: 1, lastName: 1 },
  { unique: true }
);

// Unique index on nested field
await users.createIndex(
  { "profile.username": 1 },
  { unique: true }
);

// ===== BEHAVIOR =====

// Insert succeeds (first time)
await users.insertOne({ 
  email: "user@example.com", 
  name: "John" 
});

// Insert fails (duplicate)
try {
  await users.insertOne({ 
    email: "user@example.com", 
    name: "Jane" 
  });
} catch (error) {
  console.log("Duplicate key error:", error.code === 11000);
}

// ===== NULL VALUES =====

// Unique indexes allow only ONE null value
await users.insertOne({ name: "User 1" });  // email is null - OK
// await users.insertOne({ name: "User 2" });  // email is null - ERROR

// ===== UNIQUE WITH SPARSE =====

// Allow multiple nulls with sparse
await users.createIndex(
  { phoneNumber: 1 },
  { 
    unique: true,
    sparse: true  // Only indexes docs with phoneNumber
  }
);

// Now multiple nulls allowed
await users.insertOne({ name: "User 1" });  // phoneNumber null - OK
await users.insertOne({ name: "User 2" });  // phoneNumber null - OK
await users.insertOne({ name: "User 3", phoneNumber: "123-456" });  // OK

// ===== PARTIAL UNIQUE INDEXES =====

// Unique only for specific subset
await users.createIndex(
  { username: 1 },
  {
    unique: true,
    partialFilterExpression: { 
      accountType: "premium" 
    }
  }
);

// ===== PRACTICAL EXAMPLES =====

// User authentication
await users.createIndex({ email: 1 }, { unique: true });
await users.createIndex({ username: 1 }, { unique: true });

// Social security numbers (sparse + unique)
await users.createIndex(
  { ssn: 1 },
  { unique: true, sparse: true }
);

// Product SKUs
const products = db.collection("products");
await products.createIndex(
  { sku: 1 },
  { unique: true }
);

await client.close();`}</code>
                </pre>
              </div>

              {/* Sparse Indexes */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  2. Sparse Indexes
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://localhost:27017");
await client.connect();
const db = client.db("myDatabase");
const users = db.collection("users");

// ===== CREATE SPARSE INDEXES =====

// Sparse index - only indexes documents with the field
await users.createIndex(
  { optionalField: 1 },
  { sparse: true }
);

// Sparse compound index
await users.createIndex(
  { field1: 1, field2: 1 },
  { sparse: true }
);

// ===== BEHAVIOR =====

await users.insertMany([
  { name: "User 1", age: 25 },
  { name: "User 2", age: 30 },
  { name: "User 3" }  // No age field
]);

// Regular index would include all 3 documents
// Sparse index only includes documents with age field (2 docs)

// ===== QUERIES WITH SPARSE INDEXES =====

// Query uses sparse index (has age field)
await users.find({ age: { $gte: 25 } }).toArray();

// Query may not use sparse index (returns docs without age)
await users.find().sort({ age: 1 }).toArray();

// ===== USE CASES =====

// Optional fields
await users.createIndex(
  { middleName: 1 },
  { sparse: true }
);

// Temporary flags
await users.createIndex(
  { resetToken: 1 },
  { sparse: true, expireAfterSeconds: 3600 }
);

// ===== SPARSE + UNIQUE =====

// Multiple nulls allowed
await users.createIndex(
  { optionalId: 1 },
  { 
    sparse: true,
    unique: true 
  }
);

// These all succeed (null not indexed)
await users.insertOne({ name: "A" });
await users.insertOne({ name: "B" });
await users.insertOne({ name: "C", optionalId: "123" });

// This fails (duplicate non-null)
// await users.insertOne({ name: "D", optionalId: "123" });

await client.close();`}</code>
                </pre>
              </div>

              {/* TTL Indexes */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  3. TTL Indexes - Time To Live
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://localhost:27017");
await client.connect();
const db = client.db("myDatabase");

// ===== CREATE TTL INDEXES =====

// Delete documents 1 hour after createdAt
const sessions = db.collection("sessions");
await sessions.createIndex(
  { createdAt: 1 },
  { expireAfterSeconds: 3600 }  // 1 hour
);

// Delete documents at specific date
const events = db.collection("events");
await events.createIndex(
  { expireAt: 1 },
  { expireAfterSeconds: 0 }  // Delete at expireAt time
);

// ===== BEHAVIOR =====

// Insert with timestamp
await sessions.insertOne({
  userId: "user123",
  token: "abc123",
  createdAt: new Date()
});

// Document deleted automatically after 3600 seconds
// Background task runs every 60 seconds

// ===== TTL WITH SPECIFIC TIME =====

await events.insertOne({
  name: "Flash Sale",
  expireAt: new Date(Date.now() + 24 * 60 * 60 * 1000)  // 24 hours from now
});

// Document deleted at expireAt time

// ===== MODIFY TTL INDEX =====

// Change expiration time
await db.command({
  collMod: "sessions",
  index: {
    keyPattern: { createdAt: 1 },
    expireAfterSeconds: 7200  // Change to 2 hours
  }
});

// ===== TTL LIMITATIONS =====

// - Only works on Date fields or arrays of Dates
// - Cannot be compound index
// - Only one TTL index per collection (on different fields)
// - Background task runs every 60 seconds (not immediate)

// ===== PRACTICAL EXAMPLES =====

// Session management
await sessions.createIndex(
  { lastAccess: 1 },
  { expireAfterSeconds: 1800 }  // 30 minutes
);

await sessions.insertOne({
  userId: "user123",
  token: "xyz789",
  lastAccess: new Date()
});

// Cache expiration
const cache = db.collection("cache");
await cache.createIndex(
  { createdAt: 1 },
  { expireAfterSeconds: 300 }  // 5 minutes
);

// Verification tokens
const tokens = db.collection("verificationTokens");
await tokens.createIndex(
  { createdAt: 1 },
  { expireAfterSeconds: 86400 }  // 24 hours
);

// Log rotation
const logs = db.collection("logs");
await logs.createIndex(
  { timestamp: 1 },
  { expireAfterSeconds: 604800 }  // 7 days
);

// Event scheduling
const scheduledTasks = db.collection("scheduledTasks");
await scheduledTasks.createIndex(
  { executeAt: 1 },
  { expireAfterSeconds: 0 }
);

await client.close();`}</code>
                </pre>
              </div>

              {/* Partial Indexes */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  4. Partial Indexes
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://localhost:27017");
await client.connect();
const db = client.db("myDatabase");
const orders = db.collection("orders");

// ===== CREATE PARTIAL INDEXES =====

// Index only active orders
await orders.createIndex(
  { customerId: 1, orderDate: -1 },
  {
    partialFilterExpression: {
      status: { $in: ["pending", "processing"] }
    }
  }
);

// Index only high-value orders
await orders.createIndex(
  { total: 1 },
  {
    partialFilterExpression: {
      total: { $gte: 1000 }
    }
  }
);

// Multiple conditions
await orders.createIndex(
  { region: 1 },
  {
    partialFilterExpression: {
      status: "active",
      total: { $gte: 100 },
      createdAt: { $gte: new Date("2024-01-01") }
    }
  }
);

// ===== QUERY REQUIREMENTS =====

// Query MUST match partial filter to use index
await orders.find({
  status: "pending",
  customerId: "customer123"
}).toArray();
// Uses index (matches partial filter)

await orders.find({
  customerId: "customer123"
}).toArray();
// Doesn't use index (no status filter)

// ===== PARTIAL + UNIQUE =====

// Unique username only for active users
const users = db.collection("users");
await users.createIndex(
  { username: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: "active"
    }
  }
);

// Allows duplicate usernames for inactive users
await users.insertOne({ 
  username: "john", 
  status: "active" 
});

await users.insertOne({ 
  username: "jane", 
  status: "inactive" 
});

await users.insertOne({ 
  username: "jane", 
  status: "inactive" 
});  // OK - not active

// ===== PARTIAL + SPARSE =====

// Combine both properties
await users.createIndex(
  { email: 1 },
  {
    sparse: true,
    partialFilterExpression: {
      emailVerified: true
    }
  }
);

// ===== PRACTICAL EXAMPLES =====

// Active subscriptions only
const subscriptions = db.collection("subscriptions");
await subscriptions.createIndex(
  { userId: 1, endDate: 1 },
  {
    partialFilterExpression: {
      status: "active"
    }
  }
);

// Recent data
const analytics = db.collection("analytics");
await analytics.createIndex(
  { userId: 1, timestamp: -1 },
  {
    partialFilterExpression: {
      timestamp: { 
        $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) 
      }
    }
  }
);

// Published content
const posts = db.collection("posts");
await posts.createIndex(
  { category: 1, publishedAt: -1 },
  {
    partialFilterExpression: {
      published: true
    }
  }
);

// Premium features
const features = db.collection("features");
await features.createIndex(
  { userId: 1 },
  {
    partialFilterExpression: {
      tier: { $in: ["premium", "enterprise"] }
    }
  }
);

await client.close();`}</code>
                </pre>
              </div>

              {/* Hidden Indexes */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  5. Hidden Indexes
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://localhost:27017");
await client.connect();
const db = client.db("myDatabase");
const users = db.collection("users");

// ===== CREATE HIDDEN INDEX =====

await users.createIndex(
  { email: 1 },
  { hidden: true }
);

// ===== HIDE EXISTING INDEX =====

// Hide by keyPattern
await db.command({
  collMod: "users",
  index: {
    keyPattern: { email: 1 },
    hidden: true
  }
});

// Hide by name
await db.command({
  collMod: "users",
  index: {
    name: "email_1",
    hidden: true
  }
});

// ===== UNHIDE INDEX =====

await db.command({
  collMod: "users",
  index: {
    keyPattern: { email: 1 },
    hidden: false
  }
});

// ===== BEHAVIOR =====

// Hidden index:
// - Still maintained (writes update it)
// - Not used by query planner
// - Visible in listIndexes()
// - Can be unhidden anytime

// ===== USE CASES =====

// 1. Test index removal impact
await users.createIndex({ lastName: 1 });

// Hide instead of dropping
await db.command({
  collMod: "users",
  index: {
    keyPattern: { lastName: 1 },
    hidden: true
  }
});

// Monitor performance
// If ok, drop index
// If problems, unhide index

// 2. Gradual index migration
await users.createIndex({ newField: 1 });
await db.command({
  collMod: "users",
  index: {
    keyPattern: { oldField: 1 },
    hidden: true
  }
});

// Test, then drop old index

// ===== VERIFY HIDDEN STATUS =====

const indexes = await users.listIndexes().toArray();
indexes.forEach(idx => {
  console.log(\`\${idx.name}: hidden = \${idx.hidden || false}\`);
});

// ===== PRACTICAL WORKFLOW =====

// Step 1: Create new index
await users.createIndex({ optimizedField: 1 });

// Step 2: Hide old index
await db.command({
  collMod: "users",
  index: {
    keyPattern: { oldField: 1 },
    hidden: true
  }
});

// Step 3: Monitor for 24-48 hours
// Check query performance

// Step 4a: If performance good, drop old index
await users.dropIndex({ oldField: 1 });

// Step 4b: If issues, unhide
await db.command({
  collMod: "users",
  index: {
    keyPattern: { oldField: 1 },
    hidden: false
  }
});

await client.close();`}</code>
                </pre>
              </div>

              {/* Collation Indexes */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  6. Collation Indexes
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://localhost:27017");
await client.connect();
const db = client.db("myDatabase");
const users = db.collection("users");

// ===== CREATE INDEX WITH COLLATION =====

// Case-insensitive index
await users.createIndex(
  { username: 1 },
  {
    collation: {
      locale: "en",
      strength: 2  // Case-insensitive
    }
  }
);

// Accent-insensitive index
await users.createIndex(
  { lastName: 1 },
  {
    collation: {
      locale: "en",
      strength: 1  // Ignore case and accents
    }
  }
);

// ===== COLLATION STRENGTHS =====

// strength: 1 - Primary (ignore case and accents)
// strength: 2 - Secondary (ignore case)
// strength: 3 - Tertiary (case-sensitive, default)

// ===== QUERIES WITH COLLATION =====

// Query must use same collation to use index
await users.find(
  { username: "John" },
  {
    collation: {
      locale: "en",
      strength: 2
    }
  }
).toArray();
// Matches: "John", "john", "JOHN"

// ===== LOCALE-SPECIFIC COLLATION =====

// German collation
await users.createIndex(
  { nameDE: 1 },
  {
    collation: {
      locale: "de",
      strength: 2
    }
  }
);

// French collation
await users.createIndex(
  { nameFR: 1 },
  {
    collation: {
      locale: "fr",
      strength: 2
    }
  }
);

// ===== NUMERIC ORDERING =====

// Numeric string ordering
const products = db.collection("products");
await products.createIndex(
  { sku: 1 },
  {
    collation: {
      locale: "en",
      numericOrdering: true
    }
  }
);

// With numericOrdering:
// "item1", "item2", "item10" (correct order)
// Without:
// "item1", "item10", "item2" (lexicographic)

// ===== CASE-INSENSITIVE UNIQUE =====

await users.createIndex(
  { email: 1 },
  {
    unique: true,
    collation: {
      locale: "en",
      strength: 2
    }
  }
);

// These are considered duplicates:
await users.insertOne({ email: "user@example.com" });
// await users.insertOne({ email: "USER@EXAMPLE.COM" });  // ERROR

// ===== COLLECTION-LEVEL COLLATION =====

// Set default collation for collection
await db.createCollection("messages", {
  collation: {
    locale: "en",
    strength: 2
  }
});

// All queries use this collation by default

// ===== PRACTICAL EXAMPLES =====

// User search (case-insensitive)
await users.createIndex(
  { displayName: 1 },
  {
    collation: {
      locale: "en",
      strength: 2
    }
  }
);

await users.find(
  { displayName: "alice" },
  { collation: { locale: "en", strength: 2 } }
).toArray();
// Finds: "Alice", "alice", "ALICE"

// International names
const contacts = db.collection("contacts");
await contacts.createIndex(
  { name: 1 },
  {
    collation: {
      locale: "en",
      strength: 1  // Ignore accents too
    }
  }
);

// Matches: "José", "Jose", "josé", "JOSE"

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

              {/* Index Properties in Mongoose */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-purple-300">
                  1. Index Properties in Mongoose
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const mongoose = require("mongoose");

await mongoose.connect("mongodb://localhost:27017/myDatabase");

// ===== UNIQUE INDEXES =====

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  username: {
    type: String,
    unique: true
  }
});

// ===== SPARSE INDEXES =====

const profileSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  socialSecurityNumber: {
    type: String,
    sparse: true,
    unique: true
  }
});

// ===== TTL INDEXES =====

const sessionSchema = new mongoose.Schema({
  userId: String,
  token: String,
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600  // TTL in seconds
  }
});

const Session = mongoose.model("Session", sessionSchema);

// ===== PARTIAL INDEXES =====

const orderSchema = new mongoose.Schema({
  customerId: String,
  status: String,
  total: Number
});

orderSchema.index(
  { customerId: 1 },
  {
    partialFilterExpression: {
      status: { $in: ["pending", "processing"] }
    }
  }
);

const Order = mongoose.model("Order", orderSchema);

// ===== COLLATION INDEXES =====

const productSchema = new mongoose.Schema({
  name: String,
  sku: String
});

productSchema.index(
  { name: 1 },
  {
    collation: {
      locale: "en",
      strength: 2
    }
  }
);

const Product = mongoose.model("Product", productSchema);

// ===== COMBINED PROPERTIES =====

const accountSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    sparse: true
  },
  resetToken: {
    type: String,
    sparse: true,
    unique: true
  },
  resetTokenExpiry: Date
});

accountSchema.index(
  { resetToken: 1 },
  {
    sparse: true,
    unique: true,
    partialFilterExpression: {
      resetToken: { $exists: true }
    }
  }
);

const Account = mongoose.model("Account", accountSchema);

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
                  <strong>Unique + Sparse:</strong> Allow multiple nulls while
                  enforcing uniqueness
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>TTL Background:</strong> Cleanup runs every 60
                  seconds, not immediate
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>TTL Date Field:</strong> Must be Date type or array of
                  Dates
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Partial Index Query:</strong> Query filter must match
                  partialFilterExpression
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Partial Reduce Size:</strong> Smaller indexes improve
                  performance and reduce storage
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Hidden for Testing:</strong> Test index removal impact
                  before dropping
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Collation Match:</strong> Query collation must match
                  index collation
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Case-Insensitive Unique:</strong> Use collation
                  strength: 2 with unique: true
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Sparse + Unique Pattern:</strong> Common for optional
                  unique identifiers
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Monitor TTL:</strong> Check index is working with
                  collStats
                </span>
              </li>
            </ul>
          </section>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8">
            <Link
              href="/phase5/specialized-indexes"
              className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              ← Previous: Specialized Indexes
            </Link>
            <Link
              href="/phase5/index-performance"
              className="bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-500 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              Next: Index Performance →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
