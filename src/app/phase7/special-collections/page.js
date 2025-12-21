"use client";

import Link from "next/link";
import { useState } from "react";

export default function SpecialCollectionsPage() {
  const [activeTab, setActiveTab] = useState("capped");

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
          Special Collections & Features
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Capped, Time Series, Views, and Collation
        </p>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 flex-wrap">
          <button
            onClick={() => setActiveTab("capped")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "capped"
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Capped
          </button>
          <button
            onClick={() => setActiveTab("timeseries")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "timeseries"
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Time Series
          </button>
          <button
            onClick={() => setActiveTab("views")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "views"
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Views
          </button>
          <button
            onClick={() => setActiveTab("collation")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "collation"
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Collation
          </button>
        </div>

        <div className="space-y-8">
          {/* Capped Collections Tab */}
          {activeTab === "capped" && (
            <>
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  📚 Capped Collections Theory
                </h2>

                <div className="space-y-4 text-gray-200">
                  <p className="text-lg">
                    <strong>Capped collections</strong> are fixed-size
                    collections that automatically overwrite oldest documents
                    when reaching size limit.
                  </p>

                  <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                    Key Features
                  </h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong>FIFO:</strong> First-in-first-out ordering
                    </li>
                    <li>
                      <strong>Fixed Size:</strong> Maximum size in bytes
                    </li>
                    <li>
                      <strong>Insertion Order:</strong> Guaranteed insertion
                      order
                    </li>
                    <li>
                      <strong>No Deletion:</strong> Cannot delete individual
                      documents
                    </li>
                    <li>
                      <strong>High Throughput:</strong> Optimized for inserts
                    </li>
                    <li>
                      <strong>Tailable Cursors:</strong> Stream-like behavior
                    </li>
                  </ul>

                  <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                    Use Cases
                  </h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Log files and event tracking</li>
                    <li>Cache with automatic cleanup</li>
                    <li>Message queues</li>
                    <li>Real-time data streams</li>
                  </ul>
                </div>
              </section>

              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  Capped Collections Examples
                </h2>

                {/* Create Capped Collection */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    1. Create & Use Capped Collections
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://localhost:27017");
await client.connect();

const db = client.db("logsDatabase");

// ===== CREATE CAPPED COLLECTION =====

// By size (bytes)
await db.createCollection("logs", {
  capped: true,
  size: 5242880,  // 5MB
  max: 5000       // Optional: max 5000 documents
});

const logs = db.collection("logs");

// ===== INSERT TO CAPPED COLLECTION =====

// Normal inserts
await logs.insertMany([
  { message: "Server started", timestamp: new Date() },
  { message: "User logged in", user: "john", timestamp: new Date() },
  { message: "Request received", path: "/api/users", timestamp: new Date() }
]);

// When collection is full, oldest documents are automatically removed

// ===== QUERY CAPPED COLLECTION =====

// Find all (maintains insertion order)
const allLogs = await logs.find().toArray();

// Find with filter
const recentLogs = await logs.find({
  timestamp: { $gte: new Date(Date.now() - 3600000) }
}).toArray();

// ===== TAILABLE CURSOR =====

// Stream-like cursor that remains open
const cursor = logs.find({}, {
  tailable: true,
  awaitData: true,
  noCursorTimeout: true
});

// Process documents as they arrive
cursor.on("data", (doc) => {
  console.log("New log:", doc.message);
});

cursor.on("error", (error) => {
  console.error("Cursor error:", error);
});

// ===== CHECK IF CAPPED =====

const stats = await db.command({ collStats: "logs" });
console.log("Is capped:", stats.capped);
console.log("Max size:", stats.maxSize);
console.log("Max documents:", stats.max);

// ===== CONVERT TO CAPPED =====

// Not directly supported, must create new collection
const newColl = db.collection("logs_capped");

await db.createCollection("logs_capped", {
  capped: true,
  size: 5242880
});

// Copy data
const docs = await logs.find().toArray();
await newColl.insertMany(docs);

await client.close();`}</code>
                  </pre>
                </div>

                {/* Tailable Cursors */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    2. Tailable Cursors (Real-time Streaming)
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== BASIC TAILABLE CURSOR =====

async function tailCollection(collection) {
  const cursor = collection.find({}, {
    tailable: true,
    awaitData: true,
    noCursorTimeout: true
  });

  try {
    while (await cursor.hasNext()) {
      const doc = await cursor.next();
      if (doc) {
        console.log("Received:", doc);
        processDocument(doc);
      }
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// ===== TAILABLE WITH ASYNC ITERATOR =====

async function tailWithIterator(collection) {
  const cursor = collection.find({}, {
    tailable: true,
    awaitData: true
  });

  for await (const doc of cursor) {
    console.log("Document:", doc);
  }
}

// ===== MESSAGE QUEUE PATTERN =====

// Producer
async function produce(queue, message) {
  await queue.insertOne({
    message,
    processed: false,
    timestamp: new Date()
  });
}

// Consumer with tailable cursor
async function consume(queue) {
  const cursor = queue.find(
    { processed: false },
    {
      tailable: true,
      awaitData: true
    }
  );

  for await (const doc of cursor) {
    try {
      // Process message
      await processMessage(doc.message);
      
      // Mark as processed (update, not delete)
      await queue.updateOne(
        { _id: doc._id },
        { $set: { processed: true } }
      );
    } catch (error) {
      console.error("Processing failed:", error);
    }
  }
}

// ===== RECONNECTING TAILABLE CURSOR =====

async function createResilientTailableCursor(collection) {
  let lastId;

  async function startTailing() {
    const query = lastId ? { _id: { $gt: lastId } } : {};
    
    const cursor = collection.find(query, {
      tailable: true,
      awaitData: true
    });

    try {
      for await (const doc of cursor) {
        lastId = doc._id;
        console.log("Document:", doc);
      }
    } catch (error) {
      console.error("Cursor error, reconnecting...", error);
      await new Promise(resolve => setTimeout(resolve, 1000));
      await startTailing();
    }
  }

  await startTailing();
}`}</code>
                  </pre>
                </div>
              </section>
            </>
          )}

          {/* Time Series Tab */}
          {activeTab === "timeseries" && (
            <>
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  📚 Time Series Collections Theory
                </h2>

                <div className="space-y-4 text-gray-200">
                  <p className="text-lg">
                    <strong>Time series collections</strong> are optimized for
                    storing sequences of measurements over time (MongoDB 5.0+).
                  </p>

                  <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                    Key Features
                  </h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong>Optimized Storage:</strong> Efficient compression
                    </li>
                    <li>
                      <strong>Query Performance:</strong> Optimized for
                      time-based queries
                    </li>
                    <li>
                      <strong>Automatic Bucketing:</strong> Data organized by
                      time buckets
                    </li>
                    <li>
                      <strong>TTL Support:</strong> Automatic expiration of old
                      data
                    </li>
                  </ul>

                  <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                    Required Fields
                  </h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong>timeField:</strong> Field containing timestamp
                    </li>
                    <li>
                      <strong>metaField:</strong> (Optional) Identifies data
                      source
                    </li>
                    <li>
                      <strong>granularity:</strong> seconds, minutes, or hours
                    </li>
                  </ul>
                </div>
              </section>

              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  Time Series Examples
                </h2>

                {/* Create Time Series */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    1. Create & Use Time Series Collections
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://localhost:27017");
await client.connect();

const db = client.db("metricsDatabase");

// ===== CREATE TIME SERIES COLLECTION =====

await db.createCollection("weather", {
  timeseries: {
    timeField: "timestamp",
    metaField: "metadata",
    granularity: "hours"  // "seconds", "minutes", or "hours"
  },
  expireAfterSeconds: 2592000  // Optional: 30 days TTL
});

const weather = db.collection("weather");

// ===== INSERT TIME SERIES DATA =====

await weather.insertMany([
  {
    timestamp: new Date("2024-01-01T00:00:00Z"),
    metadata: {
      sensorId: "sensor1",
      location: "New York"
    },
    temperature: 25.5,
    humidity: 65,
    pressure: 1013
  },
  {
    timestamp: new Date("2024-01-01T01:00:00Z"),
    metadata: {
      sensorId: "sensor1",
      location: "New York"
    },
    temperature: 24.8,
    humidity: 67,
    pressure: 1012
  }
]);

// ===== QUERY TIME SERIES =====

// Query by time range
const recentData = await weather.find({
  timestamp: {
    $gte: new Date("2024-01-01T00:00:00Z"),
    $lt: new Date("2024-01-02T00:00:00Z")
  }
}).toArray();

// Query with metadata filter
const sensor1Data = await weather.find({
  "metadata.sensorId": "sensor1",
  timestamp: { $gte: new Date("2024-01-01") }
}).toArray();

// ===== AGGREGATION ON TIME SERIES =====

// Average temperature by hour
const hourlyAvg = await weather.aggregate([
  {
    $match: {
      timestamp: {
        $gte: new Date("2024-01-01"),
        $lt: new Date("2024-01-02")
      }
    }
  },
  {
    $group: {
      _id: {
        $dateTrunc: {
          date: "$timestamp",
          unit: "hour"
        }
      },
      avgTemp: { $avg: "$temperature" },
      avgHumidity: { $avg: "$humidity" },
      count: { $sum: 1 }
    }
  },
  {
    $sort: { _id: 1 }
  }
]).toArray();

console.log("Hourly averages:", hourlyAvg);`}</code>
                  </pre>
                </div>

                {/* Advanced Time Series */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    2. Advanced Time Series Queries
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== WINDOW FUNCTIONS =====

// Moving average
const movingAvg = await weather.aggregate([
  {
    $setWindowFields: {
      partitionBy: "$metadata.sensorId",
      sortBy: { timestamp: 1 },
      output: {
        movingAvgTemp: {
          $avg: "$temperature",
          window: {
            documents: [-2, 0]  // Current + 2 previous
          }
        }
      }
    }
  }
]).toArray();

// ===== DOWNSAMPLE DATA =====

// Aggregate to 1-hour buckets
const downsampled = await weather.aggregate([
  {
    $bucket: {
      groupBy: "$timestamp",
      boundaries: [
        new Date("2024-01-01T00:00:00Z"),
        new Date("2024-01-01T01:00:00Z"),
        new Date("2024-01-01T02:00:00Z"),
        new Date("2024-01-01T03:00:00Z")
      ],
      default: "Other",
      output: {
        count: { $sum: 1 },
        avgTemp: { $avg: "$temperature" },
        minTemp: { $min: "$temperature" },
        maxTemp: { $max: "$temperature" }
      }
    }
  }
]).toArray();

// ===== FILL MISSING DATA =====

const filled = await weather.aggregate([
  {
    $setWindowFields: {
      sortBy: { timestamp: 1 },
      output: {
        filledTemp: {
          $locf: "$temperature"  // Last observation carried forward
        }
      }
    }
  }
]).toArray();

// ===== IOT SENSOR PATTERN =====

// Store sensor readings
await db.createCollection("sensors", {
  timeseries: {
    timeField: "timestamp",
    metaField: "device",
    granularity: "seconds"
  }
});

const sensors = db.collection("sensors");

// Insert readings
await sensors.insertOne({
  timestamp: new Date(),
  device: {
    id: "device123",
    type: "temperature",
    location: "warehouse-a"
  },
  value: 22.5,
  unit: "celsius"
});

// Query latest readings per device
const latest = await sensors.aggregate([
  {
    $sort: { timestamp: -1 }
  },
  {
    $group: {
      _id: "$device.id",
      latestReading: { $first: "$$ROOT" }
    }
  }
]).toArray();

await client.close();`}</code>
                  </pre>
                </div>
              </section>
            </>
          )}

          {/* Views Tab */}
          {activeTab === "views" && (
            <>
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  📚 Views Theory
                </h2>

                <div className="space-y-4 text-gray-200">
                  <p className="text-lg">
                    <strong>Views</strong> are read-only collections created
                    from aggregation pipelines on existing collections.
                  </p>

                  <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                    Key Features
                  </h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong>Read-only:</strong> Cannot insert/update/delete
                    </li>
                    <li>
                      <strong>Computed:</strong> Data computed on query
                    </li>
                    <li>
                      <strong>No Storage:</strong> No additional disk space
                    </li>
                    <li>
                      <strong>Aggregation-based:</strong> Uses aggregation
                      pipeline
                    </li>
                  </ul>

                  <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                    Use Cases
                  </h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Hide sensitive fields</li>
                    <li>Precomputed joins</li>
                    <li>Simplified queries</li>
                    <li>Data transformation layer</li>
                  </ul>
                </div>
              </section>

              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  Views Examples
                </h2>

                {/* Create Views */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    1. Create & Use Views
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://localhost:27017");
await client.connect();

const db = client.db("viewsDatabase");

// Sample data
const users = db.collection("users");
await users.insertMany([
  { name: "John", age: 30, role: "admin", salary: 75000 },
  { name: "Jane", age: 25, role: "user", salary: 55000 },
  { name: "Bob", age: 35, role: "user", salary: 65000 }
]);

// ===== CREATE VIEW =====

// Basic view (hide sensitive fields)
await db.createCollection("publicUsers", {
  viewOn: "users",
  pipeline: [
    {
      $project: {
        name: 1,
        age: 1,
        role: 1,
        _id: 0
      }
    }
  ]
});

// Query view like a collection
const publicUsers = db.collection("publicUsers");
const result = await publicUsers.find().toArray();
console.log("Public users:", result);

// ===== VIEW WITH FILTERING =====

// Active users view
await db.createCollection("activeUsers", {
  viewOn: "users",
  pipeline: [
    {
      $match: { active: true }
    },
    {
      $project: {
        name: 1,
        email: 1,
        lastLogin: 1
      }
    }
  ]
});

// ===== VIEW WITH AGGREGATION =====

// Users by role count
await db.createCollection("usersByRole", {
  viewOn: "users",
  pipeline: [
    {
      $group: {
        _id: "$role",
        count: { $sum: 1 },
        avgAge: { $avg: "$age" },
        users: { $push: "$name" }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]
});

const roleStats = await db.collection("usersByRole").find().toArray();
console.log("Users by role:", roleStats);

// ===== VIEW WITH LOOKUP =====

// Assuming we have orders collection
await db.createCollection("userOrders", {
  viewOn: "users",
  pipeline: [
    {
      $lookup: {
        from: "orders",
        localField: "_id",
        foreignField: "userId",
        as: "orders"
      }
    },
    {
      $project: {
        name: 1,
        email: 1,
        orderCount: { $size: "$orders" },
        totalSpent: { $sum: "$orders.total" }
      }
    }
  ]
});`}</code>
                  </pre>
                </div>

                {/* Advanced Views */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    2. Advanced View Patterns
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== MODIFY VIEW =====

// Drop old view
await db.collection("publicUsers").drop();

// Recreate with new pipeline
await db.createCollection("publicUsers", {
  viewOn: "users",
  pipeline: [
    {
      $match: { active: true }
    },
    {
      $project: {
        name: 1,
        age: 1
      }
    }
  ]
});

// ===== LIST VIEWS =====

const collections = await db.listCollections().toArray();
const views = collections.filter(c => c.type === "view");

console.log("Views:", views.map(v => ({
  name: v.name,
  viewOn: v.options.viewOn
})));

// ===== VIEW ON VIEW =====

// Create view on another view
await db.createCollection("seniorPublicUsers", {
  viewOn: "publicUsers",
  pipeline: [
    {
      $match: { age: { $gte: 30 } }
    }
  ]
});

// ===== COLLATION IN VIEWS =====

await db.createCollection("caseInsensitiveUsers", {
  viewOn: "users",
  pipeline: [
    { $match: { name: { $ne: null } } }
  ],
  collation: { locale: "en", strength: 2 }
});

// Queries on this view will be case-insensitive
const found = await db.collection("caseInsensitiveUsers")
  .find({ name: "john" })  // Matches "John", "JOHN", etc.
  .toArray();

// ===== MATERIALIZED VIEWS PATTERN =====

// Views are not materialized, but you can create a similar pattern

// 1. Create aggregation
async function refreshMaterializedView() {
  const pipeline = [
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
        avgPrice: { $avg: "$price" }
      }
    }
  ];

  const results = await db.collection("products")
    .aggregate(pipeline)
    .toArray();

  // 2. Store in separate collection
  await db.collection("productStats").deleteMany({});
  await db.collection("productStats").insertMany(results);
}

// Refresh on schedule
setInterval(refreshMaterializedView, 3600000);  // Every hour

await client.close();`}</code>
                  </pre>
                </div>
              </section>
            </>
          )}

          {/* Collation Tab */}
          {activeTab === "collation" && (
            <>
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  📚 Collation Theory
                </h2>

                <div className="space-y-4 text-gray-200">
                  <p className="text-lg">
                    <strong>Collation</strong> allows locale-specific rules for
                    string comparison (sorting, case sensitivity, accent
                    sensitivity).
                  </p>

                  <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                    Collation Options
                  </h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong>locale:</strong> Language (e.g., "en", "fr", "es")
                    </li>
                    <li>
                      <strong>strength:</strong> Comparison level (1-5)
                    </li>
                    <li>
                      <strong>caseLevel:</strong> Case comparison
                    </li>
                    <li>
                      <strong>numericOrdering:</strong> Numeric string sorting
                    </li>
                    <li>
                      <strong>alternate:</strong> Handle spaces/punctuation
                    </li>
                    <li>
                      <strong>backwards:</strong> French accent sorting
                    </li>
                  </ul>

                  <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                    Strength Levels
                  </h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong>1:</strong> Base characters (a = A = á)
                    </li>
                    <li>
                      <strong>2:</strong> Accents (a = A, a ≠ á)
                    </li>
                    <li>
                      <strong>3:</strong> Case + accents (default)
                    </li>
                    <li>
                      <strong>4:</strong> Punctuation
                    </li>
                    <li>
                      <strong>5:</strong> Identical
                    </li>
                  </ul>
                </div>
              </section>

              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  Collation Examples
                </h2>

                {/* Basic Collation */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    1. Basic Collation Usage
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://localhost:27017");
await client.connect();

const db = client.db("collationDatabase");
const names = db.collection("names");

// Sample data
await names.insertMany([
  { name: "Apple" },
  { name: "apple" },
  { name: "APPLE" },
  { name: "Banana" },
  { name: "banana" }
]);

// ===== CASE-INSENSITIVE SEARCH =====

// Without collation (case-sensitive)
const caseSensitive = await names.find({ name: "apple" }).toArray();
console.log("Case sensitive:", caseSensitive.length);  // 1

// With collation (case-insensitive)
const caseInsensitive = await names.find(
  { name: "apple" },
  {
    collation: {
      locale: "en",
      strength: 2  // Ignore case and accents
    }
  }
).toArray();

console.log("Case insensitive:", caseInsensitive.length);  // 3

// ===== CASE-INSENSITIVE SORT =====

const sorted = await names.find().sort({ name: 1 }).collation({
  locale: "en",
  strength: 2
}).toArray();

console.log("Sorted:", sorted.map(n => n.name));

// ===== CREATE INDEX WITH COLLATION =====

await names.createIndex(
  { name: 1 },
  {
    collation: {
      locale: "en",
      strength: 2
    }
  }
);

// Queries with same collation will use index
const indexed = await names.find({ name: "apple" })
  .collation({ locale: "en", strength: 2 })
  .toArray();`}</code>
                  </pre>
                </div>

                {/* Advanced Collation */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    2. Advanced Collation Options
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== NUMERIC STRING ORDERING =====

const versions = db.collection("versions");

await versions.insertMany([
  { version: "1.2" },
  { version: "1.10" },
  { version: "1.3" }
]);

// Without numeric ordering
const alpha = await versions.find().sort({ version: 1 }).toArray();
console.log("Alphabetic:", alpha.map(v => v.version));
// ["1.10", "1.2", "1.3"]

// With numeric ordering
const numeric = await versions.find()
  .sort({ version: 1 })
  .collation({ locale: "en", numericOrdering: true })
  .toArray();

console.log("Numeric:", numeric.map(v => v.version));
// ["1.2", "1.3", "1.10"]

// ===== ACCENT SENSITIVITY =====

const words = db.collection("words");

await words.insertMany([
  { word: "resume" },
  { word: "résumé" }
]);

// Strength 1: Ignore accents
const noAccents = await words.find({ word: "resume" })
  .collation({ locale: "en", strength: 1 })
  .toArray();

console.log("Matches:", noAccents.length);  // 2

// Strength 2: Consider accents
const withAccents = await words.find({ word: "resume" })
  .collation({ locale: "en", strength: 2 })
  .toArray();

console.log("Matches:", withAccents.length);  // 1

// ===== COLLECTION-LEVEL COLLATION =====

// Set default collation for collection
await db.createCollection("users", {
  collation: {
    locale: "en",
    strength: 2,
    caseLevel: false
  }
});

const users = db.collection("users");

// All queries use default collation
await users.insertMany([
  { username: "John" },
  { username: "JOHN" },
  { username: "john" }
]);

const count = await users.countDocuments({ username: "john" });
console.log("Count:", count);  // 3 (case-insensitive)

// ===== AGGREGATION WITH COLLATION =====

const grouped = await users.aggregate([
  {
    $group: {
      _id: { $toLower: "$username" },
      count: { $sum: 1 }
    }
  }
], {
  collation: { locale: "en", strength: 2 }
}).toArray();

// ===== LANGUAGE-SPECIFIC COLLATION =====

// French collation
const french = db.collection("french");

await french.insertMany([
  { word: "côte" },
  { word: "coté" },
  { word: "côté" }
]);

const frenchSorted = await french.find()
  .sort({ word: 1 })
  .collation({ locale: "fr", strength: 1 })
  .toArray();

// German collation (ß = ss)
const german = db.collection("german");

await german.insertMany([
  { word: "Straße" },
  { word: "Strasse" }
]);

const germanMatch = await german.find({ word: "Strasse" })
  .collation({ locale: "de", strength: 1 })
  .toArray();

console.log("German matches:", germanMatch.length);  // 2

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
                  <strong>Capped size:</strong> Choose size based on data
                  retention needs
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Tailable cursors:</strong> Handle reconnection for
                  resilience
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Time series granularity:</strong> Match to data
                  frequency
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Time series TTL:</strong> Automatically expire old
                  data
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>View simplification:</strong> Use views to hide
                  complexity
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>View security:</strong> Use views to restrict data
                  access
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Collation indexes:</strong> Match query collation to
                  index
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Collection collation:</strong> Set default for all
                  queries
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Locale selection:</strong> Choose appropriate locale
                  for data
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Performance testing:</strong> Test collation impact on
                  queries
                </span>
              </li>
            </ul>
          </section>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8">
            <Link
              href="/phase7/gridfs-storage"
              className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              ← Previous: GridFS & Storage
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
