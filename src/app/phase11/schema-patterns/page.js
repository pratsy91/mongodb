"use client";

import Link from "next/link";
import { useState } from "react";

export default function SchemaPatternsPage() {
  const [activeTab, setActiveTab] = useState("basic");

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
          Schema Design Patterns
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          All 12+ MongoDB schema design patterns
        </p>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 flex-wrap">
          <button
            onClick={() => setActiveTab("basic")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "basic"
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Basic Patterns
          </button>
          <button
            onClick={() => setActiveTab("advanced")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "advanced"
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Advanced Patterns
          </button>
          <button
            onClick={() => setActiveTab("specialized")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "specialized"
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Specialized Patterns
          </button>
        </div>

        <div className="space-y-8">
          {/* Basic Patterns Tab */}
          {activeTab === "basic" && (
            <>
              {/* Attribute Pattern */}
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  1. Attribute Pattern
                </h2>

                <div className="mb-6 text-gray-200">
                  <p className="text-lg mb-4">
                    <strong>Problem:</strong> Many similar fields that need to
                    be queried together, or fields with varying types.
                  </p>
                  <p className="text-lg mb-4">
                    <strong>Solution:</strong> Use key-value pairs instead of
                    individual fields.
                  </p>
                </div>

                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto mb-4">
                  <code className="text-sm">{`// ===== BEFORE (BAD) =====

// Movie with multiple release dates
{
  _id: ObjectId("..."),
  title: "The Matrix",
  releaseUSA: ISODate("1999-03-31"),
  releaseUK: ISODate("1999-06-11"),
  releaseJapan: ISODate("1999-09-11"),
  releaseFrance: ISODate("1999-06-23"),
  // ... 100+ countries
}

// Problem: Cannot index all fields efficiently
// Problem: Hard to query "all releases after date"

// ===== AFTER (GOOD) =====

{
  _id: ObjectId("..."),
  title: "The Matrix",
  releases: [
    { country: "USA", date: ISODate("1999-03-31") },
    { country: "UK", date: ISODate("1999-06-11") },
    { country: "Japan", date: ISODate("1999-09-11") },
    { country: "France", date: ISODate("1999-06-23") }
  ]
}

// Create index on array
db.movies.createIndex({ "releases.country": 1, "releases.date": 1 });

// Query any country
db.movies.find({ "releases.country": "USA" });

// Query date range across all countries
db.movies.find({ "releases.date": { $gte: ISODate("1999-06-01") } });

// ===== USE CASE: PRODUCT SPECIFICATIONS =====

// Before
{
  productId: "laptop-001",
  name: "Gaming Laptop",
  cpu: "Intel i7",
  ram: "16GB",
  storage: "512GB SSD",
  screen: "15.6 inch",
  weight: "2.1kg"
  // ... many specs
}

// After
{
  productId: "laptop-001",
  name: "Gaming Laptop",
  specs: [
    { key: "cpu", value: "Intel i7" },
    { key: "ram", value: "16GB" },
    { key: "storage", value: "512GB SSD" },
    { key: "screen", value: "15.6 inch" },
    { key: "weight", value: "2.1kg" }
  ]
}

// Index for fast spec lookup
db.products.createIndex({ "specs.key": 1, "specs.value": 1 });

// Find products by any spec
db.products.find({
  specs: {
    $elemMatch: {
      key: "ram",
      value: { $regex: /16GB/ }
    }
  }
});`}</code>
                </pre>
              </section>

              {/* Bucket Pattern */}
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  2. Bucket Pattern
                </h2>

                <div className="mb-6 text-gray-200">
                  <p className="text-lg mb-4">
                    <strong>Problem:</strong> Too many documents, or need to
                    group time-series data.
                  </p>
                  <p className="text-lg mb-4">
                    <strong>Solution:</strong> Group documents into buckets.
                  </p>
                </div>

                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto mb-4">
                  <code className="text-sm">{`// ===== BEFORE (BAD) =====

// One document per sensor reading
{
  sensorId: "sensor-001",
  temperature: 22.5,
  timestamp: ISODate("2024-01-01T00:00:00")
}
{
  sensorId: "sensor-001",
  temperature: 22.6,
  timestamp: ISODate("2024-01-01T00:01:00")
}
// ... millions of documents per day

// ===== AFTER (GOOD) =====

// One document per hour (bucket)
{
  sensorId: "sensor-001",
  date: ISODate("2024-01-01T00:00:00"),
  readings: [
    { minute: 0, temperature: 22.5 },
    { minute: 1, temperature: 22.6 },
    { minute: 2, temperature: 22.7 },
    // ... 60 readings per hour
  ],
  count: 60,
  avgTemp: 22.8,
  minTemp: 22.5,
  maxTemp: 23.1
}

// Benefits:
// - Fewer documents (60x reduction)
// - Pre-aggregated stats
// - Better query performance

// Insert reading
db.sensors.updateOne(
  {
    sensorId: "sensor-001",
    date: ISODate("2024-01-01T00:00:00")
  },
  {
    $push: {
      readings: { minute: 5, temperature: 22.9 }
    },
    $inc: { count: 1 },
    $max: { maxTemp: 22.9 },
    $min: { minTemp: 22.9 }
  },
  { upsert: true }
);

// Query hourly data
db.sensors.find({
  sensorId: "sensor-001",
  date: {
    $gte: ISODate("2024-01-01T00:00:00"),
    $lt: ISODate("2024-01-01T23:59:59")
  }
});

// ===== USE CASE: WEB ANALYTICS =====

// Daily page views bucket
{
  url: "/products/laptop",
  date: ISODate("2024-01-01"),
  hourlyViews: [
    { hour: 0, count: 150 },
    { hour: 1, count: 120 },
    // ... 24 hours
  ],
  totalViews: 5230,
  uniqueVisitors: 3421
}`}</code>
                </pre>
              </section>

              {/* Computed Pattern */}
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  3. Computed Pattern
                </h2>

                <div className="mb-6 text-gray-200">
                  <p className="text-lg mb-4">
                    <strong>Problem:</strong> Expensive computations repeated on
                    every read.
                  </p>
                  <p className="text-lg mb-4">
                    <strong>Solution:</strong> Pre-compute and store results.
                  </p>
                </div>

                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto mb-4">
                  <code className="text-sm">{`// ===== USE CASE: PRODUCT RATINGS =====

// Before: Compute on every query
{
  productId: "prod-001",
  reviews: [
    { rating: 5, comment: "Great!" },
    { rating: 4, comment: "Good" },
    { rating: 5, comment: "Excellent" }
    // ... thousands of reviews
  ]
}

// Query (slow - computes every time)
db.products.aggregate([
  { $match: { productId: "prod-001" } },
  { $unwind: "$reviews" },
  { $group: {
    _id: "$productId",
    avgRating: { $avg: "$reviews.rating" },
    reviewCount: { $sum: 1 }
  }}
]);

// After: Pre-computed
{
  productId: "prod-001",
  reviews: [ ... ],
  computed: {
    avgRating: 4.67,
    reviewCount: 3,
    ratingDistribution: {
      5: 2,
      4: 1,
      3: 0,
      2: 0,
      1: 0
    },
    lastUpdated: ISODate("2024-01-01T12:00:00")
  }
}

// Update computed values when review added
db.products.updateOne(
  { productId: "prod-001" },
  {
    $push: { reviews: newReview },
    $inc: {
      "computed.reviewCount": 1,
      [\`computed.ratingDistribution.\${newReview.rating}\`]: 1
    }
  }
);

// Recalculate average (can be done async)
const product = await db.products.findOne({ productId: "prod-001" });
const avgRating = product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length;

await db.products.updateOne(
  { productId: "prod-001" },
  {
    $set: {
      "computed.avgRating": avgRating,
      "computed.lastUpdated": new Date()
    }
  }
);

// Query (fast - pre-computed)
db.products.find({ productId: "prod-001" }, { computed: 1 });

// ===== USE CASE: TOTAL ORDER AMOUNT =====

{
  orderId: "order-123",
  items: [
    { product: "A", price: 10, quantity: 2 },
    { product: "B", price: 15, quantity: 1 }
  ],
  computed: {
    subtotal: 35,
    tax: 3.5,
    shipping: 5,
    total: 43.5
  }
}`}</code>
                </pre>
              </section>

              {/* Subset Pattern */}
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  4. Subset Pattern
                </h2>

                <div className="mb-6 text-gray-200">
                  <p className="text-lg mb-4">
                    <strong>Problem:</strong> Large documents with infrequently
                    accessed data.
                  </p>
                  <p className="text-lg mb-4">
                    <strong>Solution:</strong> Store frequently accessed data in
                    main document, move rest to separate collection.
                  </p>
                </div>

                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto mb-4">
                  <code className="text-sm">{`// ===== USE CASE: PRODUCT REVIEWS =====

// Before: All reviews in one document
{
  productId: "prod-001",
  name: "Gaming Laptop",
  price: 1200,
  reviews: [
    { user: "user1", rating: 5, comment: "..." },
    { user: "user2", rating: 4, comment: "..." },
    // ... 10,000 reviews (approaching 16MB limit!)
  ]
}

// After: Main document with subset
// Products collection (frequently accessed)
{
  productId: "prod-001",
  name: "Gaming Laptop",
  price: 1200,
  recentReviews: [
    { user: "user999", rating: 5, comment: "...", date: "..." },
    { user: "user998", rating: 4, comment: "...", date: "..." }
    // Only last 10 reviews
  ],
  reviewCount: 10000,
  avgRating: 4.5
}

// Reviews collection (less frequently accessed)
{
  productId: "prod-001",
  user: "user1",
  rating: 5,
  comment: "Great laptop!",
  date: ISODate("2024-01-01")
}

// Typical query (fast - small document)
db.products.findOne({ productId: "prod-001" });

// All reviews when needed
db.reviews.find({ productId: "prod-001" });

// ===== USE CASE: SOCIAL MEDIA =====

// User profile (frequently accessed)
{
  userId: "user123",
  name: "John Doe",
  avatar: "...",
  recentPosts: [
    // Last 20 posts only
  ],
  followerCount: 50000,
  followingCount: 150
}

// Posts collection
{
  postId: "post-001",
  userId: "user123",
  content: "...",
  timestamp: ISODate("...")
}

// Comments collection
{
  commentId: "comment-001",
  postId: "post-001",
  userId: "user456",
  content: "...",
  timestamp: ISODate("...")
}`}</code>
                </pre>
              </section>
            </>
          )}

          {/* Advanced Patterns Tab */}
          {activeTab === "advanced" && (
            <>
              {/* Extended Reference Pattern */}
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  5. Extended Reference Pattern
                </h2>

                <div className="mb-6 text-gray-200">
                  <p className="text-lg mb-4">
                    <strong>Problem:</strong> Frequently join referenced
                    documents.
                  </p>
                  <p className="text-lg mb-4">
                    <strong>Solution:</strong> Duplicate frequently accessed
                    fields from referenced document.
                  </p>
                </div>

                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto mb-4">
                  <code className="text-sm">{`// ===== BEFORE =====

// Orders collection
{
  orderId: "order-123",
  customerId: ObjectId("..."),  // Reference only
  items: [ ... ],
  total: 150
}

// Always need customer name and email
// Requires $lookup on every query
db.orders.aggregate([
  { $match: { orderId: "order-123" } },
  {
    $lookup: {
      from: "customers",
      localField: "customerId",
      foreignField: "_id",
      as: "customer"
    }
  }
]);

// ===== AFTER =====

// Orders collection (extended reference)
{
  orderId: "order-123",
  customer: {
    id: ObjectId("..."),
    name: "John Doe",      // Duplicated
    email: "john@example.com"  // Duplicated
  },
  items: [ ... ],
  total: 150
}

// No $lookup needed
db.orders.findOne({ orderId: "order-123" });

// Full customer details when needed
db.customers.findOne({ _id: ObjectId("...") });

// ===== USE CASE: BLOG POSTS =====

// Posts collection
{
  postId: "post-001",
  title: "MongoDB Patterns",
  content: "...",
  author: {
    id: ObjectId("..."),
    name: "Jane Smith",    // Extended reference
    avatar: "avatar.jpg"   // Extended reference
  },
  createdAt: ISODate("...")
}

// Benefits:
// - No lookup for author name/avatar
// - Fast post rendering
// - Full author profile available if needed`}</code>
                </pre>
              </section>

              {/* Outlier Pattern */}
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  6. Outlier Pattern
                </h2>

                <div className="mb-6 text-gray-200">
                  <p className="text-lg mb-4">
                    <strong>Problem:</strong> A few documents have
                    disproportionately more data.
                  </p>
                  <p className="text-lg mb-4">
                    <strong>Solution:</strong> Handle outliers differently from
                    normal documents.
                  </p>
                </div>

                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto mb-4">
                  <code className="text-sm">{`// ===== PROBLEM =====

// Most books have < 10 reviews
// But Harry Potter has 100,000 reviews
// Embedding all reviews would create huge document

// ===== SOLUTION =====

// Normal book (< 100 reviews)
{
  bookId: "book-001",
  title: "Regular Book",
  reviews: [
    { user: "user1", rating: 5, comment: "..." },
    // ... < 100 reviews embedded
  ],
  reviewCount: 25,
  hasOverflow: false
}

// Outlier book (> 100 reviews)
{
  bookId: "book-999",
  title: "Harry Potter",
  reviews: [
    // Only recent 100 reviews
  ],
  reviewCount: 100000,
  hasOverflow: true  // Flag for application
}

// Overflow reviews in separate collection
// reviewOverflow collection
{
  bookId: "book-999",
  reviews: [
    { user: "user1", rating: 5, comment: "..." },
    // ... batches of reviews
  ]
}

// Application logic
async function getReviews(bookId) {
  const book = await db.books.findOne({ bookId });
  
  let reviews = book.reviews;
  
  if (book.hasOverflow) {
    // Fetch overflow reviews
    const overflow = await db.reviewOverflow
      .find({ bookId })
      .toArray();
    
    reviews = [...reviews, ...overflow.flatMap(o => o.reviews)];
  }
  
  return reviews;
}

// ===== USE CASE: SOCIAL MEDIA =====

// Normal user (< 1000 followers)
{
  userId: "user-001",
  name: "Regular User",
  followers: [
    "follower1", "follower2", // ... embedded
  ],
  followerCount: 150,
  hasOverflow: false
}

// Celebrity (millions of followers)
{
  userId: "celebrity-001",
  name: "Famous Person",
  followers: [], // Empty - too many to embed
  followerCount: 5000000,
  hasOverflow: true
}

// Followers collection
{
  userId: "celebrity-001",
  followers: [ ... ] // Paginated
}`}</code>
                </pre>
              </section>

              {/* Polymorphic Pattern */}
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  7. Polymorphic Pattern
                </h2>

                <div className="mb-6 text-gray-200">
                  <p className="text-lg mb-4">
                    <strong>Problem:</strong> Similar but not identical
                    documents need to be queried together.
                  </p>
                  <p className="text-lg mb-4">
                    <strong>Solution:</strong> Use common fields with
                    type-specific fields.
                  </p>
                </div>

                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto mb-4">
                  <code className="text-sm">{`// ===== USE CASE: E-COMMERCE PRODUCTS =====

// Books
{
  _id: ObjectId("..."),
  type: "book",
  name: "MongoDB Handbook",
  price: 29.99,
  // Book-specific fields
  author: "John Doe",
  isbn: "978-...",
  pages: 350
}

// Electronics
{
  _id: ObjectId("..."),
  type: "electronics",
  name: "Laptop",
  price: 999.99,
  // Electronics-specific fields
  brand: "Dell",
  warranty: "2 years",
  specs: {
    cpu: "Intel i7",
    ram: "16GB"
  }
}

// Clothing
{
  _id: ObjectId("..."),
  type: "clothing",
  name: "T-Shirt",
  price: 19.99,
  // Clothing-specific fields
  size: "M",
  color: "Blue",
  material: "Cotton"
}

// Query all products
db.products.find({ price: { $lt: 50 } });

// Query specific type
db.products.find({ type: "book" });

// Create indexes for common fields
db.products.createIndex({ price: 1 });
db.products.createIndex({ type: 1, name: 1 });

// ===== USE CASE: EVENT LOGGING =====

// User login event
{
  eventId: "evt-001",
  type: "login",
  timestamp: ISODate("..."),
  userId: "user123",
  // Login-specific
  ipAddress: "192.168.1.1",
  userAgent: "..."
}

// Purchase event
{
  eventId: "evt-002",
  type: "purchase",
  timestamp: ISODate("..."),
  userId: "user123",
  // Purchase-specific
  orderId: "order-456",
  amount: 99.99
}

// Page view event
{
  eventId: "evt-003",
  type: "pageView",
  timestamp: ISODate("..."),
  userId: "user123",
  // PageView-specific
  url: "/products",
  duration: 45
}

// Query all user events
db.events.find({ userId: "user123" })
  .sort({ timestamp: -1 });

// Query by event type
db.events.find({ type: "purchase" });`}</code>
                </pre>
              </section>

              {/* Document Versioning Pattern */}
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  8. Document Versioning Pattern
                </h2>

                <div className="mb-6 text-gray-200">
                  <p className="text-lg mb-4">
                    <strong>Problem:</strong> Need to track document history.
                  </p>
                  <p className="text-lg mb-4">
                    <strong>Solution:</strong> Store versions in same or
                    separate collection.
                  </p>
                </div>

                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto mb-4">
                  <code className="text-sm">{`// ===== APPROACH 1: EMBEDDED VERSIONS =====

{
  documentId: "doc-001",
  currentVersion: 3,
  data: {
    title: "Current Document",
    content: "Latest content...",
    updatedBy: "user123",
    updatedAt: ISODate("2024-01-03")
  },
  versions: [
    {
      version: 1,
      data: {
        title: "First Version",
        content: "Original content..."
      },
      createdBy: "user123",
      createdAt: ISODate("2024-01-01")
    },
    {
      version: 2,
      data: {
        title: "Second Version",
        content: "Updated content..."
      },
      updatedBy: "user456",
      updatedAt: ISODate("2024-01-02")
    }
  ]
}

// Get current version
db.documents.findOne({ documentId: "doc-001" }, { data: 1 });

// Get specific version
db.documents.findOne(
  { documentId: "doc-001" },
  { versions: { $elemMatch: { version: 2 } } }
);

// ===== APPROACH 2: SEPARATE VERSIONS COLLECTION =====

// Current documents collection
{
  documentId: "doc-001",
  version: 3,
  title: "Current Document",
  content: "Latest content...",
  updatedBy: "user123",
  updatedAt: ISODate("2024-01-03")
}

// History collection
{
  documentId: "doc-001",
  version: 1,
  title: "First Version",
  content: "Original content...",
  createdBy: "user123",
  createdAt: ISODate("2024-01-01"),
  archived: true
}
{
  documentId: "doc-001",
  version: 2,
  title: "Second Version",
  content: "Updated content...",
  updatedBy: "user456",
  updatedAt: ISODate("2024-01-02"),
  archived: true
}

// Update document (creates new version)
async function updateDocument(documentId, newData, userId) {
  // Get current version
  const current = await db.documents.findOne({ documentId });
  
  // Archive current version
  await db.history.insertOne({
    ...current,
    archived: true,
    archivedAt: new Date()
  });
  
  // Update current
  await db.documents.updateOne(
    { documentId },
    {
      $set: {
        ...newData,
        version: current.version + 1,
        updatedBy: userId,
        updatedAt: new Date()
      }
    }
  );
}

// ===== APPROACH 3: CHANGE TRACKING =====

{
  documentId: "doc-001",
  title: "Current Document",
  content: "Latest content...",
  changes: [
    {
      version: 1,
      field: "title",
      oldValue: "First Version",
      newValue: "Second Version",
      changedBy: "user456",
      changedAt: ISODate("2024-01-02")
    },
    {
      version: 2,
      field: "content",
      oldValue: "Original content...",
      newValue: "Updated content...",
      changedBy: "user456",
      changedAt: ISODate("2024-01-02")
    }
  ]
}`}</code>
                </pre>
              </section>
            </>
          )}

          {/* Specialized Patterns Tab */}
          {activeTab === "specialized" && (
            <>
              {/* Tree Patterns */}
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  9. Tree Patterns
                </h2>

                <div className="mb-6 text-gray-200">
                  <p className="text-lg mb-4">
                    <strong>Problem:</strong> Represent hierarchical data.
                  </p>
                  <p className="text-lg mb-4">
                    <strong>Solutions:</strong> Multiple approaches depending on
                    use case.
                  </p>
                </div>

                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto mb-4">
                  <code className="text-sm">{`// ===== PATTERN A: PARENT REFERENCE =====

// Best for: Finding parent, updates to node

{
  _id: "electronics",
  name: "Electronics",
  parent: null  // Root
}
{
  _id: "laptops",
  name: "Laptops",
  parent: "electronics"  // Reference to parent
}
{
  _id: "gaming-laptops",
  name: "Gaming Laptops",
  parent: "laptops"
}

// Find parent
db.categories.findOne({ _id: "gaming-laptops" });

// Find all children
db.categories.find({ parent: "electronics" });

// ===== PATTERN B: CHILD REFERENCES =====

// Best for: Finding children

{
  _id: "electronics",
  name: "Electronics",
  children: ["laptops", "phones", "tablets"]
}
{
  _id: "laptops",
  name: "Laptops",
  children: ["gaming-laptops", "business-laptops"]
}

// Find children
const category = await db.categories.findOne({ _id: "electronics" });
const children = await db.categories.find({
  _id: { $in: category.children }
}).toArray();

// ===== PATTERN C: ARRAY OF ANCESTORS =====

// Best for: Finding all ancestors, breadcrumbs

{
  _id: "gaming-laptops",
  name: "Gaming Laptops",
  ancestors: ["electronics", "laptops"],  // All ancestors
  parent: "laptops"  // Direct parent
}

// Find all descendants of electronics
db.categories.find({ ancestors: "electronics" });

// Get breadcrumb path
const category = await db.categories.findOne({ _id: "gaming-laptops" });
const ancestors = await db.categories.find({
  _id: { $in: category.ancestors }
}).toArray();

// ===== PATTERN D: MATERIALIZED PATH =====

// Best for: Full path queries

{
  _id: "gaming-laptops",
  name: "Gaming Laptops",
  path: ",electronics,laptops,gaming-laptops,"
}

// Find all descendants
db.categories.find({
  path: { $regex: /^,electronics,/ }
});

// Find direct children
db.categories.find({
  path: { $regex: /^,electronics,laptops,[^,]+,$/ }
});

// Create index
db.categories.createIndex({ path: 1 });

// ===== PATTERN E: NESTED SETS =====

// Best for: Read-heavy hierarchies

{
  _id: "electronics",
  name: "Electronics",
  left: 1,
  right: 10
}
{
  _id: "laptops",
  name: "Laptops",
  left: 2,
  right: 7
}
{
  _id: "gaming-laptops",
  name: "Gaming Laptops",
  left: 3,
  right: 4
}

// Find all descendants
db.categories.find({
  left: { $gt: 2 },
  right: { $lt: 7 }
});`}</code>
                </pre>
              </section>

              {/* Approximation Pattern */}
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  10. Approximation Pattern
                </h2>

                <div className="mb-6 text-gray-200">
                  <p className="text-lg mb-4">
                    <strong>Problem:</strong> Need real-time stats but exact
                    values not critical.
                  </p>
                  <p className="text-lg mb-4">
                    <strong>Solution:</strong> Update statistics periodically or
                    in batches.
                  </p>
                </div>

                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto mb-4">
                  <code className="text-sm">{`// ===== USE CASE: PAGE VIEW COUNTER =====

// Bad: Update on every view (slow)
await db.pages.updateOne(
  { pageId: "page-001" },
  { $inc: { views: 1 } }
);

// Good: Approximate with batching
// In-memory counter
let viewCounts = {};

function recordView(pageId) {
  viewCounts[pageId] = (viewCounts[pageId] || 0) + 1;
}

// Flush to database every 10 seconds
setInterval(async () => {
  for (const [pageId, count] of Object.entries(viewCounts)) {
    await db.pages.updateOne(
      { pageId },
      { $inc: { views: count } }
    );
  }
  viewCounts = {};
}, 10000);

// Document structure
{
  pageId: "page-001",
  url: "/products",
  views: 15234,  // Approximate (within 10 seconds)
  lastUpdated: ISODate("2024-01-01T12:00:00")
}

// ===== USE CASE: LIKE/VOTE COUNTS =====

// Increment every N operations
let pendingLikes = {};

async function likePost(postId) {
  // Increment in-memory
  pendingLikes[postId] = (pendingLikes[postId] || 0) + 1;
  
  // Flush if threshold reached
  if (pendingLikes[postId] >= 10) {
    await db.posts.updateOne(
      { postId },
      { $inc: { likes: pendingLikes[postId] } }
    );
    pendingLikes[postId] = 0;
  }
}

// Document
{
  postId: "post-001",
  content: "...",
  likes: 5243,  // Approximate (within 10 likes)
  comments: 89
}

// ===== USE CASE: SEARCH RESULT COUNTS =====

// Instead of exact count
const exactCount = await db.products.countDocuments({
  category: "electronics"
});
// Takes long time for large collections

// Use approximation
{
  category: "electronics",
  productCount: 15000,  // Updated hourly
  lastCounted: ISODate("2024-01-01T12:00:00")
}

// Update via cron job
async function updateCategoryCounts() {
  const categories = await db.products.distinct("category");
  
  for (const category of categories) {
    const count = await db.products.countDocuments({ category });
    
    await db.categoryStats.updateOne(
      { category },
      {
        $set: {
          productCount: count,
          lastCounted: new Date()
        }
      },
      { upsert: true }
    );
  }
}`}</code>
                </pre>
              </section>

              {/* Schema Versioning Pattern */}
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  11. Schema Versioning Pattern
                </h2>

                <div className="mb-6 text-gray-200">
                  <p className="text-lg mb-4">
                    <strong>Problem:</strong> Schema evolves over time, old
                    documents exist.
                  </p>
                  <p className="text-lg mb-4">
                    <strong>Solution:</strong> Version schemas and migrate
                    on-read or batch.
                  </p>
                </div>

                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto mb-4">
                  <code className="text-sm">{`// ===== VERSION 1: ORIGINAL SCHEMA =====

{
  _id: ObjectId("..."),
  schemaVersion: 1,
  name: "John Doe",
  phone: "555-1234"
}

// ===== VERSION 2: SPLIT NAME =====

{
  _id: ObjectId("..."),
  schemaVersion: 2,
  firstName: "John",
  lastName: "Doe",
  phone: "555-1234"
}

// ===== MIGRATE ON READ =====

async function getUser(userId) {
  let user = await db.users.findOne({ _id: userId });
  
  // Migrate if old version
  if (user.schemaVersion === 1) {
    const [firstName, lastName] = user.name.split(" ");
    
    user = {
      ...user,
      schemaVersion: 2,
      firstName,
      lastName
    };
    delete user.name;
    
    // Update in database
    await db.users.replaceOne({ _id: userId }, user);
  }
  
  return user;
}

// ===== BATCH MIGRATION =====

async function migrateV1ToV2() {
  const cursor = db.users.find({ schemaVersion: 1 });
  
  for await (const user of cursor) {
    const [firstName, lastName] = user.name.split(" ");
    
    await db.users.updateOne(
      { _id: user._id },
      {
        $set: {
          schemaVersion: 2,
          firstName,
          lastName
        },
        $unset: { name: "" }
      }
    );
  }
}

// Run migration
await migrateV1ToV2();

// ===== VERSION 3: ADD EMAIL FIELD =====

{
  _id: ObjectId("..."),
  schemaVersion: 3,
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",  // New field
  phone: "555-1234"
}

// Backward compatible migration
async function migrateV2ToV3() {
  await db.users.updateMany(
    { schemaVersion: 2 },
    {
      $set: {
        schemaVersion: 3,
        email: null  // Default value
      }
    }
  );
}

// ===== APPLICATION CODE =====

class UserService {
  async getUser(userId) {
    let user = await db.users.findOne({ _id: userId });
    
    // Handle all versions
    switch (user.schemaVersion) {
      case 1:
        user = this.migrateV1ToV2(user);
        await this.saveUser(user);
        // Fall through
      case 2:
        user = this.migrateV2ToV3(user);
        await this.saveUser(user);
        // Fall through
      case 3:
        return user;
      default:
        throw new Error(\`Unknown schema version: \${user.schemaVersion}\`);
    }
  }
  
  migrateV1ToV2(user) {
    const [firstName, lastName] = user.name.split(" ");
    return {
      ...user,
      schemaVersion: 2,
      firstName,
      lastName
    };
  }
  
  migrateV2ToV3(user) {
    return {
      ...user,
      schemaVersion: 3,
      email: null
    };
  }
}`}</code>
                </pre>
              </section>

              {/* Preallocated Pattern */}
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  12. Preallocated Pattern
                </h2>

                <div className="mb-6 text-gray-200">
                  <p className="text-lg mb-4">
                    <strong>Problem:</strong> Documents grow frequently, causing
                    moves.
                  </p>
                  <p className="text-lg mb-4">
                    <strong>Solution:</strong> Preallocate space to reduce
                    document moves.
                  </p>
                </div>

                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto mb-4">
                  <code className="text-sm">{`// ===== USE CASE: APPOINTMENT SCHEDULING =====

// Bad: Document grows with each booking
{
  doctorId: "doc-001",
  date: ISODate("2024-01-15"),
  appointments: []  // Grows as bookings added
}

// Good: Preallocate slots
{
  doctorId: "doc-001",
  date: ISODate("2024-01-15"),
  slots: [
    { time: "09:00", patientId: null, status: "available" },
    { time: "09:30", patientId: null, status: "available" },
    { time: "10:00", patientId: null, status: "available" },
    // ... all slots for the day
    { time: "17:00", patientId: null, status: "available" }
  ]
}

// Book appointment (update existing slot)
await db.schedule.updateOne(
  {
    doctorId: "doc-001",
    date: ISODate("2024-01-15"),
    "slots.time": "10:00"
  },
  {
    $set: {
      "slots.$.patientId": "patient-123",
      "slots.$.status": "booked"
    }
  }
);

// ===== USE CASE: GAME BOARD =====

// Tic-tac-toe board
{
  gameId: "game-001",
  board: [
    [null, null, null],
    [null, null, null],
    [null, null, null]
  ],
  players: ["player1", "player2"],
  currentTurn: "player1"
}

// Make move (update preallocated cell)
await db.games.updateOne(
  { gameId: "game-001" },
  { $set: { "board.1.1": "X" } }  // Center cell
);

// ===== USE CASE: SEATING CHART =====

{
  eventId: "concert-001",
  venue: "Stadium A",
  seats: [
    { row: "A", number: 1, status: "available", holderId: null },
    { row: "A", number: 2, status: "available", holderId: null },
    // ... preallocate all seats
  ]
}

// Reserve seat
await db.events.updateOne(
  {
    eventId: "concert-001",
    "seats": {
      $elemMatch: { row: "A", number: 1 }
    }
  },
  {
    $set: {
      "seats.$.status": "reserved",
      "seats.$.holderId": "user-123"
    }
  }
);`}</code>
                </pre>
              </section>
            </>
          )}

          {/* Best Practices */}
          <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
            <h2 className="text-3xl font-bold mb-6 text-yellow-300">
              ⚡ Pattern Selection Guide
            </h2>
            <div className="space-y-4 text-gray-200">
              <div className="bg-white/5 p-4 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">
                  Many similar fields → Attribute Pattern
                </h3>
                <p>Product specifications, multi-region data</p>
              </div>
              <div className="bg-white/5 p-4 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">
                  Time-series data → Bucket Pattern
                </h3>
                <p>IoT sensors, analytics, metrics</p>
              </div>
              <div className="bg-white/5 p-4 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">
                  Expensive computations → Computed Pattern
                </h3>
                <p>Aggregations, statistics, totals</p>
              </div>
              <div className="bg-white/5 p-4 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">
                  Large arrays → Subset Pattern
                </h3>
                <p>Reviews, comments, activity logs</p>
              </div>
              <div className="bg-white/5 p-4 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">
                  Frequent joins → Extended Reference Pattern
                </h3>
                <p>Orders with customer info, posts with author</p>
              </div>
              <div className="bg-white/5 p-4 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">
                  Some docs much larger → Outlier Pattern
                </h3>
                <p>Popular content, celebrity accounts</p>
              </div>
              <div className="bg-white/5 p-4 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">
                  Mixed document types → Polymorphic Pattern
                </h3>
                <p>Products, events, content types</p>
              </div>
              <div className="bg-white/5 p-4 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">
                  Need history → Document Versioning Pattern
                </h3>
                <p>Document edits, audit trail</p>
              </div>
              <div className="bg-white/5 p-4 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">
                  Hierarchical data → Tree Patterns
                </h3>
                <p>Categories, org charts, file systems</p>
              </div>
              <div className="bg-white/5 p-4 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">
                  Real-time stats → Approximation Pattern
                </h3>
                <p>View counts, likes, votes</p>
              </div>
            </div>
          </section>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8">
            <Link
              href="/phase11/profiling-performance"
              className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              ← Previous: Profiling & Performance
            </Link>
            <Link
              href="/phase11/monitoring-backup"
              className="bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-500 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              Next: Monitoring & Backup →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
