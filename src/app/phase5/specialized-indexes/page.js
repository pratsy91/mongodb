"use client";

import Link from "next/link";
import { useState } from "react";

export default function SpecializedIndexesPage() {
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
          Specialized Indexes
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Text, Geospatial (2d, 2dsphere), Hashed, and Wildcard indexes
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
                Specialized Index Types
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Text:</strong> Full-text search on string content
                </li>
                <li>
                  <strong>2dsphere:</strong> Geospatial queries on sphere
                  (Earth-like)
                </li>
                <li>
                  <strong>2d:</strong> Geospatial queries on flat plane (legacy)
                </li>
                <li>
                  <strong>Hashed:</strong> Hash-based sharding and equality
                  queries
                </li>
                <li>
                  <strong>Wildcard:</strong> Index on all fields or dynamic
                  field patterns
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

              {/* Text Indexes */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  1. Text Indexes - Full-Text Search
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://localhost:27017");
await client.connect();
const db = client.db("myDatabase");
const articles = db.collection("articles");

// ===== CREATE TEXT INDEXES =====

// Single field text index
await articles.createIndex({ content: "text" });

// Multiple fields text index
await articles.createIndex({ 
  title: "text", 
  content: "text",
  tags: "text"
});

// Text index with weights
await articles.createIndex(
  { 
    title: "text", 
    content: "text" 
  },
  {
    weights: {
      title: 10,      // Title matches are 10x more important
      content: 1      // Content matches have normal weight
    },
    name: "article_text_index"
  }
);

// Text index with language
await articles.createIndex(
  { content: "text" },
  { 
    default_language: "english",
    language_override: "lang"  // Field that specifies document language
  }
);

// ===== TEXT SEARCH QUERIES =====

// Basic text search
await articles.find({ 
  $text: { $search: "mongodb database" } 
}).toArray();

// Search with phrase
await articles.find({ 
  $text: { $search: '"NoSQL database"' }  // Exact phrase
}).toArray();

// Exclude terms
await articles.find({ 
  $text: { $search: "mongodb -sql" }  // Contains mongodb, not sql
}).toArray();

// Case-sensitive search
await articles.find({ 
  $text: { 
    $search: "MongoDB",
    $caseSensitive: true 
  }
}).toArray();

// Get text score
await articles.find(
  { $text: { $search: "mongodb tutorial" } },
  { 
    score: { $meta: "textScore" } 
  }
).toArray();

// Sort by relevance
await articles.find({ 
  $text: { $search: "mongodb" } 
})
  .sort({ score: { $meta: "textScore" } })
  .limit(10)
  .toArray();

// Combine text search with other filters
await articles.find({
  $text: { $search: "mongodb" },
  category: "tutorial",
  published: true
}).toArray();

// ===== TEXT INDEX LIMITATIONS =====

// Only ONE text index per collection
// Cannot combine with $near queries
// $text must be first in $or queries

// ===== PRACTICAL EXAMPLES =====

// Blog search
const posts = db.collection("posts");
await posts.createIndex(
  { title: "text", body: "text", tags: "text" },
  { 
    weights: { title: 10, tags: 5, body: 1 },
    name: "post_search"
  }
);

await posts.find({ 
  $text: { $search: "javascript tutorial" } 
})
  .sort({ score: { $meta: "textScore" } })
  .limit(20)
  .toArray();

// Product search
const products = db.collection("products");
await products.createIndex({
  name: "text",
  description: "text",
  category: "text"
});

await products.find({
  $text: { $search: "laptop dell i7" },
  price: { $lte: 1500 }
}).toArray();

await client.close();`}</code>
                </pre>
              </div>

              {/* Geospatial Indexes */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  2. Geospatial Indexes - 2d and 2dsphere
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://localhost:27017");
await client.connect();
const db = client.db("myDatabase");
const places = db.collection("places");

// ===== 2dsphere INDEX (RECOMMENDED) =====

// Create 2dsphere index for GeoJSON
await places.createIndex({ location: "2dsphere" });

// Compound 2dsphere index
await places.createIndex({ 
  location: "2dsphere",
  category: 1 
});

// Insert GeoJSON data
await places.insertMany([
  {
    name: "Central Park",
    location: {
      type: "Point",
      coordinates: [-73.968285, 40.785091]  // [longitude, latitude]
    }
  },
  {
    name: "Times Square",
    location: {
      type: "Point",
      coordinates: [-73.985130, 40.758896]
    }
  }
]);

// ===== QUERIES WITH 2dsphere =====

// Find places near a point
await places.find({
  location: {
    $near: {
      $geometry: {
        type: "Point",
        coordinates: [-73.97, 40.77]
      },
      $maxDistance: 5000  // 5km in meters
    }
  }
}).toArray();

// Find places within area
await places.find({
  location: {
    $geoWithin: {
      $geometry: {
        type: "Polygon",
        coordinates: [[
          [-74.0, 40.7], [-73.9, 40.7],
          [-73.9, 40.8], [-74.0, 40.8],
          [-74.0, 40.7]
        ]]
      }
    }
  }
}).toArray();

// Find intersecting geometries
await places.find({
  location: {
    $geoIntersects: {
      $geometry: {
        type: "LineString",
        coordinates: [
          [-73.97, 40.77],
          [-73.99, 40.79]
        ]
      }
    }
  }
}).toArray();

// ===== 2d INDEX (LEGACY) =====

const locations = db.collection("locations");

// Create 2d index for flat coordinates
await locations.createIndex({ loc: "2d" });

// Insert legacy coordinate data
await locations.insertOne({
  name: "Location A",
  loc: [-73.97, 40.77]  // [x, y]
});

// Query with 2d index
await locations.find({
  loc: {
    $near: [-73.97, 40.77],
    $maxDistance: 0.01  // In coordinate units
  }
}).toArray();

// ===== GEOSPATIAL INDEX OPTIONS =====

// 2dsphere with index version
await places.createIndex(
  { location: "2dsphere" },
  { "2dsphereIndexVersion": 3 }
);

// 2d with bounds
await locations.createIndex(
  { loc: "2d" },
  { 
    min: -180,
    max: 180
  }
);

await client.close();`}</code>
                </pre>
              </div>

              {/* Hashed Indexes */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  3. Hashed Indexes
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://localhost:27017");
await client.connect();
const db = client.db("myDatabase");
const users = db.collection("users");

// ===== CREATE HASHED INDEXES =====

// Single field hashed index
await users.createIndex({ userId: "hashed" });

// Hashed index for sharding
await users.createIndex({ email: "hashed" });

// ===== USE CASES FOR HASHED INDEXES =====

// 1. Hash-based sharding (even data distribution)
// Good for: _id, userId, sessionId fields
await users.createIndex({ _id: "hashed" });

// 2. Equality queries only (no range queries)
await users.find({ userId: "user12345" }).toArray();

// ===== LIMITATIONS =====

// Cannot use for:
// - Range queries
// - Sorting
// - Multikey (array) fields
// - Compound indexes with multiple hashed fields

// ===== COMPOUND INDEXES WITH HASHED =====

// Can have one hashed field in compound index
await users.createIndex({ 
  userId: "hashed",
  status: 1 
});

// NOT allowed: multiple hashed fields
// await users.createIndex({ 
//   userId: "hashed",
//   email: "hashed"  // ERROR
// });

// ===== PRACTICAL EXAMPLES =====

// Session store with hashed sharding
const sessions = db.collection("sessions");
await sessions.createIndex({ sessionId: "hashed" });

await sessions.insertOne({
  sessionId: "abc123xyz",
  userId: "user456",
  data: { /* ... */ }
});

await sessions.find({ sessionId: "abc123xyz" }).toArray();

// User data with even distribution
await users.createIndex({ email: "hashed" });
await users.find({ email: "user@example.com" }).toArray();

await client.close();`}</code>
                </pre>
              </div>

              {/* Wildcard Indexes */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  4. Wildcard Indexes
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://localhost:27017");
await client.connect();
const db = client.db("myDatabase");
const products = db.collection("products");

// ===== CREATE WILDCARD INDEXES =====

// Index all fields in document
await products.createIndex({ "$**": 1 });

// Index all fields in subdocument
await products.createIndex({ "attributes.$**": 1 });

// Index specific path pattern
await products.createIndex({ "metadata.$**": 1 });

// ===== WILDCARD INDEX WITH PROJECTION =====

// Include specific fields
await products.createIndex(
  { "$**": 1 },
  {
    wildcardProjection: {
      name: 1,
      price: 1,
      "attributes.color": 1
    }
  }
);

// Exclude specific fields
await products.createIndex(
  { "$**": 1 },
  {
    wildcardProjection: {
      internalData: 0,
      privateInfo: 0
    }
  }
);

// ===== QUERIES WITH WILDCARD INDEXES =====

// Document structure with dynamic fields:
await products.insertOne({
  name: "Product A",
  attributes: {
    color: "red",
    size: "M",
    material: "cotton",
    customField1: "value1",
    customField2: "value2"
  }
});

// Query any attribute field
await products.find({ 
  "attributes.color": "red" 
}).toArray();

await products.find({ 
  "attributes.customField1": "value1" 
}).toArray();

// ===== USE CASES =====

// 1. Dynamic schemas
const logs = db.collection("logs");
await logs.createIndex({ "metadata.$**": 1 });

await logs.insertOne({
  timestamp: new Date(),
  level: "error",
  metadata: {
    userId: "123",
    requestId: "xyz",
    customField: "value"
  }
});

await logs.find({ "metadata.requestId": "xyz" }).toArray();

// 2. JSON/BSON documents with variable structure
const configs = db.collection("configs");
await configs.createIndex({ "settings.$**": 1 });

// 3. User-defined fields
const userProfiles = db.collection("userProfiles");
await userProfiles.createIndex({ "customFields.$**": 1 });

// ===== LIMITATIONS =====

// Cannot use with:
// - Compound indexes (only one wildcard per index)
// - Text indexes
// - 2dsphere indexes
// - Hashed indexes

// Cannot index:
// - _id field
// - Array elements specifically

// ===== PERFORMANCE CONSIDERATIONS =====

// More specific indexes are usually better
// Use wildcard indexes when:
// - Schema is truly dynamic
// - Query patterns are unpredictable
// - Many optional fields exist

// Prefer specific indexes when possible:
// await products.createIndex({ "attributes.color": 1 });
// vs
// await products.createIndex({ "attributes.$**": 1 });

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

              {/* Specialized Indexes in Mongoose */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-purple-300">
                  1. Specialized Indexes in Mongoose
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const mongoose = require("mongoose");

await mongoose.connect("mongodb://localhost:27017/myDatabase");

// ===== TEXT INDEXES =====

const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
  tags: [String]
});

// Create text index
articleSchema.index({ 
  title: "text", 
  content: "text" 
}, {
  weights: { title: 10, content: 1 }
});

const Article = mongoose.model("Article", articleSchema);

// Text search
await Article.find({ 
  $text: { $search: "mongodb tutorial" } 
});

// ===== 2dsphere INDEXES =====

const placeSchema = new mongoose.Schema({
  name: String,
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
});

placeSchema.index({ location: "2dsphere" });

const Place = mongoose.model("Place", placeSchema);

// Geospatial query
await Place.find({
  location: {
    $near: {
      $geometry: {
        type: "Point",
        coordinates: [-73.97, 40.77]
      },
      $maxDistance: 5000
    }
  }
});

// ===== HASHED INDEXES =====

const userSchema = new mongoose.Schema({
  userId: String,
  email: String
});

userSchema.index({ userId: "hashed" });

const User = mongoose.model("User", userSchema);

// ===== WILDCARD INDEXES =====

const productSchema = new mongoose.Schema({
  name: String,
  attributes: mongoose.Schema.Types.Mixed
});

productSchema.index({ "attributes.$**": 1 });

const Product = mongoose.model("Product", productSchema);

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
                  <strong>Text indexes:</strong> Only one per collection, use
                  weights to prioritize fields
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>2dsphere over 2d:</strong> Use 2dsphere for real-world
                  geographic data
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>GeoJSON format:</strong> Always [longitude, latitude]
                  for 2dsphere
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Hashed for sharding:</strong> Great for even data
                  distribution
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Hashed limitations:</strong> Equality queries only, no
                  ranges or sorts
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Wildcard sparingly:</strong> Use specific indexes when
                  schema is known
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Wildcard projection:</strong> Limit indexed fields to
                  reduce index size
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Text search performance:</strong> Combine with
                  specific filters
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Geospatial index size:</strong> Consider field
                  projection for large datasets
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Test query performance:</strong> Use explain() to
                  verify index usage
                </span>
              </li>
            </ul>
          </section>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8">
            <Link
              href="/phase5/basic-indexes"
              className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              ← Previous: Basic Indexes
            </Link>
            <Link
              href="/phase5/index-properties"
              className="bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-500 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              Next: Index Properties →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
