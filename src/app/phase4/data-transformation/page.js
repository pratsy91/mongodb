"use client";

import Link from "next/link";
import { useState } from "react";

export default function DataTransformationPage() {
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
          Data Transformation
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          $unwind, $replaceRoot, $addFields, $bucket, $redact and more
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
                Transformation Stages
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>$unwind:</strong> Deconstruct array field into
                  separate documents
                </li>
                <li>
                  <strong>$replaceRoot / $replaceWith:</strong> Replace document
                  with specified embedded document
                </li>
                <li>
                  <strong>$addFields / $set:</strong> Add new fields to
                  documents
                </li>
                <li>
                  <strong>$unset:</strong> Remove fields from documents
                </li>
                <li>
                  <strong>$bucket:</strong> Categorize documents into buckets
                </li>
                <li>
                  <strong>$bucketAuto:</strong> Automatically determine bucket
                  boundaries
                </li>
                <li>
                  <strong>$redact:</strong> Restrict content of documents based
                  on conditions
                </li>
                <li>
                  <strong>$merge:</strong> Write results to output collection
                </li>
                <li>
                  <strong>$out:</strong> Write results to output collection
                  (replace)
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

              {/* $unwind */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  1. $unwind - Deconstruct Arrays
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://localhost:27017");
await client.connect();
const db = client.db("myDatabase");
const orders = db.collection("orders");

// Sample document:
// {
//   _id: 1,
//   customer: "Alice",
//   items: [
//     { product: "A", quantity: 2, price: 10 },
//     { product: "B", quantity: 1, price: 20 }
//   ]
// }

// ===== BASIC $unwind =====

// Unwind array into separate documents
await orders.aggregate([
  { $unwind: "$items" }
]).toArray();
// Result:
// { _id: 1, customer: "Alice", items: { product: "A", quantity: 2, price: 10 } }
// { _id: 1, customer: "Alice", items: { product: "B", quantity: 1, price: 20 } }

// ===== $unwind WITH OPTIONS =====

// Preserve null and empty arrays
await orders.aggregate([
  { 
    $unwind: { 
      path: "$items",
      preserveNullAndEmptyArrays: true  // Keep documents without items
    } 
  }
]).toArray();

// Include array index
await orders.aggregate([
  { 
    $unwind: { 
      path: "$items",
      includeArrayIndex: "itemIndex"  // Add index field
    } 
  }
]).toArray();
// Result includes: itemIndex: 0, itemIndex: 1, etc.

// ===== MULTIPLE $unwind =====

// Unwind nested arrays
await orders.aggregate([
  { $unwind: "$items" },
  { $unwind: "$items.variants" }  // Unwind nested array
]).toArray();

// ===== $unwind FOR ANALYSIS =====

// Analyze individual items
await orders.aggregate([
  { $unwind: "$items" },
  {
    $group: {
      _id: "$items.product",
      totalQuantity: { $sum: "$items.quantity" },
      totalRevenue: { 
        $sum: { $multiply: ["$items.quantity", "$items.price"] } 
      }
    }
  },
  { $sort: { totalRevenue: -1 } }
]).toArray();

// ===== $unwind WITH FILTERING =====

// Filter after unwind
await orders.aggregate([
  { $unwind: "$items" },
  { $match: { "items.quantity": { $gte: 5 } } }
]).toArray();

// Filter before unwind (more efficient)
await orders.aggregate([
  { $match: { "items.quantity": { $gte: 5 } } },
  { $unwind: "$items" },
  { $match: { "items.quantity": { $gte: 5 } } }  // Filter unwound docs
]).toArray();

// ===== PRACTICAL EXAMPLES =====

// Product sales report
await orders.aggregate([
  { $unwind: "$items" },
  {
    $group: {
      _id: {
        product: "$items.product",
        month: { $month: "$orderDate" }
      },
      quantity: { $sum: "$items.quantity" },
      revenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } }
    }
  }
]).toArray();

// Customer purchase patterns
await orders.aggregate([
  { $unwind: "$items" },
  {
    $group: {
      _id: "$customerId",
      uniqueProducts: { $addToSet: "$items.product" },
      totalItems: { $sum: "$items.quantity" }
    }
  },
  {
    $project: {
      productCount: { $size: "$uniqueProducts" },
      totalItems: 1
    }
  }
]).toArray();

await client.close();`}</code>
                </pre>
              </div>

              {/* $replaceRoot, $addFields, $set, $unset */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  2. $replaceRoot, $addFields, $set, $unset
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://localhost:27017");
await client.connect();
const db = client.db("myDatabase");
const products = db.collection("products");

// ===== $replaceRoot / $replaceWith =====

// Replace document with nested field
await products.aggregate([
  {
    $replaceRoot: { newRoot: "$details" }
  }
]).toArray();
// If doc: { _id: 1, name: "A", details: { color: "red", size: "M" } }
// Result: { color: "red", size: "M" }

// $replaceWith (alias for $replaceRoot)
await products.aggregate([
  {
    $replaceWith: "$specifications"
  }
]).toArray();

// Merge fields to top level
await products.aggregate([
  {
    $replaceRoot: {
      newRoot: {
        $mergeObjects: [{ _id: "$_id", name: "$name" }, "$details"]
      }
    }
  }
]).toArray();
// Result: { _id: 1, name: "A", color: "red", size: "M" }

// Conditional replacement
await products.aggregate([
  {
    $replaceRoot: {
      newRoot: {
        $cond: {
          if: { $gte: ["$price", 100] },
          then: { name: "$name", category: "premium" },
          else: { name: "$name", category: "standard" }
        }
      }
    }
  }
]).toArray();

// ===== $addFields / $set =====

// Add new fields
await products.aggregate([
  {
    $addFields: {
      totalPrice: { $multiply: ["$price", "$quantity"] },
      inStock: { $gt: ["$quantity", 0] }
    }
  }
]).toArray();

// $set (alias for $addFields)
await products.aggregate([
  {
    $set: {
      discountPrice: { $multiply: ["$price", 0.9] },
      tags: { $concatArrays: ["$tags", ["featured"]] }
    }
  }
]).toArray();

// Overwrite existing field
await products.aggregate([
  {
    $addFields: {
      price: { $multiply: ["$price", 1.1] }  // Increase price by 10%
    }
  }
]).toArray();

// Add nested fields
await products.aggregate([
  {
    $addFields: {
      "metadata.lastUpdated": new Date(),
      "metadata.version": { $add: ["$metadata.version", 1] }
    }
  }
]).toArray();

// Conditional fields
await products.aggregate([
  {
    $addFields: {
      status: {
        $switch: {
          branches: [
            { case: { $eq: ["$quantity", 0] }, then: "out_of_stock" },
            { case: { $lt: ["$quantity", 10] }, then: "low_stock" },
            { case: { $gte: ["$quantity", 10] }, then: "in_stock" }
          ],
          default: "unknown"
        }
      }
    }
  }
]).toArray();

// ===== $unset =====

// Remove single field
await products.aggregate([
  {
    $unset: "internalCode"
  }
]).toArray();

// Remove multiple fields
await products.aggregate([
  {
    $unset: ["internalCode", "supplierInfo", "costPrice"]
  }
]).toArray();

// Remove nested field
await products.aggregate([
  {
    $unset: "metadata.internal"
  }
]).toArray();

// Remove array element positions (not common)
await products.aggregate([
  {
    $unset: ["tags.0", "tags.2"]  // Remove first and third tags
  }
]).toArray();

// ===== COMBINING OPERATIONS =====

// Transform document structure
await products.aggregate([
  {
    $addFields: {
      finalPrice: { 
        $subtract: ["$price", "$discount"] 
      }
    }
  },
  {
    $set: {
      priceCategory: {
        $cond: {
          if: { $gte: ["$finalPrice", 100] },
          then: "premium",
          else: "standard"
        }
      }
    }
  },
  {
    $unset: ["internalCode", "costPrice"]
  }
]).toArray();

// Reshape with replaceRoot
await products.aggregate([
  {
    $addFields: {
      summary: {
        name: "$name",
        price: "$price",
        inStock: { $gt: ["$quantity", 0] }
      }
    }
  },
  {
    $replaceRoot: { newRoot: "$summary" }
  }
]).toArray();

await client.close();`}</code>
                </pre>
              </div>

              {/* $bucket and $bucketAuto */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  3. $bucket and $bucketAuto - Categorize Data
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://localhost:27017");
await client.connect();
const db = client.db("myDatabase");
const products = db.collection("products");

// ===== $bucket - MANUAL BOUNDARIES =====

// Basic bucketing
await products.aggregate([
  {
    $bucket: {
      groupBy: "$price",
      boundaries: [0, 50, 100, 500, 1000],
      default: "1000+",  // For values outside boundaries
      output: {
        count: { $sum: 1 },
        products: { $push: "$name" }
      }
    }
  }
]).toArray();
// Result:
// { _id: 0, count: 15, products: ["A", "B", ...] }      // 0 <= price < 50
// { _id: 50, count: 25, products: ["C", "D", ...] }     // 50 <= price < 100
// { _id: 100, count: 10, products: ["E", ...] }         // 100 <= price < 500
// { _id: "1000+", count: 5, products: ["F", ...] }      // price >= 1000

// Price range analysis
await products.aggregate([
  {
    $bucket: {
      groupBy: "$price",
      boundaries: [0, 25, 50, 100, 200],
      default: "Luxury",
      output: {
        count: { $sum: 1 },
        avgPrice: { $avg: "$price" },
        totalRevenue: { $sum: { $multiply: ["$price", "$soldCount"] } }
      }
    }
  }
]).toArray();

// Age demographics
const users = db.collection("users");

await users.aggregate([
  {
    $bucket: {
      groupBy: "$age",
      boundaries: [0, 18, 25, 35, 50, 65, 100],
      output: {
        count: { $sum: 1 },
        avgIncome: { $avg: "$income" },
        users: { $push: "$name" }
      }
    }
  }
]).toArray();

// Time-based bucketing
const orders = db.collection("orders");

await orders.aggregate([
  {
    $bucket: {
      groupBy: { $hour: "$orderDate" },
      boundaries: [0, 6, 12, 18, 24],
      output: {
        count: { $sum: 1 },
        totalSales: { $sum: "$total" }
      }
    }
  }
]).toArray();

// ===== $bucketAuto - AUTOMATIC BOUNDARIES =====

// Automatically determine buckets
await products.aggregate([
  {
    $bucketAuto: {
      groupBy: "$price",
      buckets: 5,  // Number of buckets to create
      output: {
        count: { $sum: 1 },
        avgPrice: { $avg: "$price" }
      }
    }
  }
]).toArray();
// MongoDB automatically calculates boundaries for 5 evenly distributed buckets

// With granularity
await products.aggregate([
  {
    $bucketAuto: {
      groupBy: "$price",
      buckets: 4,
      granularity: "R5",  // Renard series: preferred numbers
      output: {
        count: { $sum: 1 },
        products: { $push: "$name" }
      }
    }
  }
]).toArray();
// Granularity options: R5, R10, R20, R40, R80, 1-2-5, E6, E12, E24, E48, E96, E192, POWERSOF2

// Score distribution
await users.aggregate([
  {
    $bucketAuto: {
      groupBy: "$testScore",
      buckets: 10,  // Deciles
      output: {
        count: { $sum: 1 },
        minScore: { $min: "$testScore" },
        maxScore: { $max: "$testScore" },
        avgScore: { $avg: "$testScore" }
      }
    }
  }
]).toArray();

// ===== PRACTICAL EXAMPLES =====

// E-commerce price analysis
await products.aggregate([
  {
    $bucket: {
      groupBy: "$price",
      boundaries: [0, 10, 25, 50, 100, 250, 500, 1000],
      default: "Premium",
      output: {
        count: { $sum: 1 },
        avgRating: { $avg: "$rating" },
        totalSold: { $sum: "$soldCount" },
        revenue: { 
          $sum: { $multiply: ["$price", "$soldCount"] } 
        }
      }
    }
  },
  {
    $addFields: {
      priceRange: {
        $switch: {
          branches: [
            { case: { $eq: ["$_id", 0] }, then: "$0-$10" },
            { case: { $eq: ["$_id", 10] }, then: "$10-$25" },
            { case: { $eq: ["$_id", 25] }, then: "$25-$50" },
            { case: { $eq: ["$_id", 50] }, then: "$50-$100" },
            { case: { $eq: ["$_id", 100] }, then: "$100-$250" },
            { case: { $eq: ["$_id", 250] }, then: "$250-$500" },
            { case: { $eq: ["$_id", 500] }, then: "$500-$1000" }
          ],
          default: "$1000+"
        }
      }
    }
  }
]).toArray();

// Customer segmentation
await users.aggregate([
  {
    $bucketAuto: {
      groupBy: "$lifetimeValue",
      buckets: 5,
      output: {
        count: { $sum: 1 },
        avgOrders: { $avg: "$orderCount" },
        minLTV: { $min: "$lifetimeValue" },
        maxLTV: { $max: "$lifetimeValue" }
      }
    }
  },
  {
    $addFields: {
      segment: {
        $switch: {
          branches: [
            { case: { $lte: ["$maxLTV", 100] }, then: "Bronze" },
            { case: { $lte: ["$maxLTV", 500] }, then: "Silver" },
            { case: { $lte: ["$maxLTV", 1000] }, then: "Gold" },
            { case: { $lte: ["$maxLTV", 5000] }, then: "Platinum" }
          ],
          default: "Diamond"
        }
      }
    }
  }
]).toArray();

await client.close();`}</code>
                </pre>
              </div>

              {/* $redact, $merge, $out */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  4. $redact, $merge, $out - Advanced Operations
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://localhost:27017");
await client.connect();
const db = client.db("myDatabase");
const documents = db.collection("documents");

// ===== $redact - RESTRICT CONTENT =====

// Sample document with access levels:
// {
//   _id: 1,
//   title: "Report",
//   content: "...",
//   accessLevel: 3,
//   sections: [
//     { name: "Public", accessLevel: 1, data: "..." },
//     { name: "Internal", accessLevel: 2, data: "..." },
//     { name: "Confidential", accessLevel: 3, data: "..." }
//   ]
// }

// Redact based on access level
await documents.aggregate([
  {
    $redact: {
      $cond: {
        if: { $lte: ["$accessLevel", 2] },  // User access level: 2
        then: "$$DESCEND",  // Examine subdocuments
        else: "$$PRUNE"     // Remove this level and subdocuments
      }
    }
  }
]).toArray();

// $$DESCEND - Continue to next level
// $$PRUNE - Exclude this level and below
// $$KEEP - Include this level and below

// Redact sensitive fields
await documents.aggregate([
  {
    $redact: {
      $cond: {
        if: { $eq: ["$confidential", true] },
        then: "$$PRUNE",
        else: "$$DESCEND"
      }
    }
  }
]).toArray();

// Role-based redaction
await documents.aggregate([
  {
    $redact: {
      $cond: {
        if: {
          $or: [
            { $eq: ["$public", true] },
            { $in: ["admin", "$allowedRoles"] }
          ]
        },
        then: "$$DESCEND",
        else: "$$PRUNE"
      }
    }
  }
]).toArray();

// ===== $merge - WRITE TO COLLECTION =====

// Merge results into another collection
await db.collection("sales").aggregate([
  {
    $group: {
      _id: "$productId",
      totalSales: { $sum: "$quantity" },
      revenue: { $sum: { $multiply: ["$quantity", "$price"] } }
    }
  },
  {
    $merge: {
      into: "productStats",           // Target collection
      on: "_id",                      // Match field
      whenMatched: "replace",         // replace | merge | keepExisting | fail | pipeline
      whenNotMatched: "insert"        // insert | discard | fail
    }
  }
]).toArray();

// Merge with pipeline on match
await db.collection("sales").aggregate([
  {
    $group: {
      _id: "$productId",
      newSales: { $sum: "$quantity" }
    }
  },
  {
    $merge: {
      into: "productStats",
      on: "_id",
      whenMatched: [
        {
          $addFields: {
            totalSales: { $add: ["$totalSales", "$$new.newSales"] },
            lastUpdated: new Date()
          }
        }
      ],
      whenNotMatched: "insert"
    }
  }
]).toArray();

// Merge into different database
await db.collection("logs").aggregate([
  { $match: { date: { $gte: new Date("2024-01-01") } } },
  {
    $merge: {
      into: { db: "analytics", coll: "dailyLogs" },
      whenMatched: "replace",
      whenNotMatched: "insert"
    }
  }
]).toArray();

// ===== $out - REPLACE COLLECTION =====

// Write results to new collection (replaces existing)
await db.collection("orders").aggregate([
  { $match: { status: "completed" } },
  {
    $group: {
      _id: "$customerId",
      totalSpent: { $sum: "$total" },
      orderCount: { $sum: 1 }
    }
  },
  {
    $out: "customerStats"  // Replaces collection if exists
  }
]).toArray();

// Output to different database
await db.collection("sales").aggregate([
  {
    $group: {
      _id: {
        year: { $year: "$date" },
        month: { $month: "$date" }
      },
      revenue: { $sum: "$amount" }
    }
  },
  {
    $out: { db: "reporting", coll: "monthlySales" }
  }
]).toArray();

// ===== MATERIALIZED VIEWS WITH $merge =====

// Create/update materialized view
await db.collection("orders").aggregate([
  {
    $match: {
      orderDate: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    }
  },
  { $unwind: "$items" },
  {
    $group: {
      _id: "$items.productId",
      last7DaysSales: { $sum: "$items.quantity" },
      revenue: { 
        $sum: { $multiply: ["$items.quantity", "$items.price"] } 
      }
    }
  },
  {
    $merge: {
      into: "weeklyProductStats",
      on: "_id",
      whenMatched: "replace",
      whenNotMatched: "insert"
    }
  }
]).toArray();

// ===== INCREMENTAL UPDATES =====

// Update only changed documents
await db.collection("sensors").aggregate([
  {
    $match: {
      timestamp: { $gte: new Date(Date.now() - 60000) }  // Last minute
    }
  },
  {
    $group: {
      _id: "$deviceId",
      latestReading: { $last: "$value" },
      avgReading: { $avg: "$value" },
      count: { $sum: 1 }
    }
  },
  {
    $merge: {
      into: "deviceStats",
      on: "_id",
      whenMatched: [
        {
          $set: {
            latestReading: "$$new.latestReading",
            recentAvg: "$$new.avgReading",
            totalReadings: { $add: ["$totalReadings", "$$new.count"] }
          }
        }
      ],
      whenNotMatched: "insert"
    }
  }
]).toArray();

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

              {/* Transformation in Mongoose */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-purple-300">
                  1. Data Transformation in Mongoose
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const mongoose = require("mongoose");

await mongoose.connect("mongodb://localhost:27017/myDatabase");

const orderSchema = new mongoose.Schema({
  customer: String,
  items: [{
    product: String,
    quantity: Number,
    price: Number
  }],
  total: Number
});

const Order = mongoose.model("Order", orderSchema);

// ===== $unwind =====

await Order.aggregate([
  { $unwind: "$items" },
  {
    $group: {
      _id: "$items.product",
      totalSold: { $sum: "$items.quantity" }
    }
  }
]);

// ===== $addFields / $set =====

await Order.aggregate([
  {
    $addFields: {
      itemCount: { $size: "$items" },
      avgItemPrice: { $avg: "$items.price" }
    }
  }
]);

// ===== $replaceRoot =====

await Order.aggregate([
  {
    $replaceRoot: {
      newRoot: {
        $mergeObjects: [{ orderId: "$_id" }, "$$ROOT"]
      }
    }
  }
]);

// ===== $bucket =====

await Order.aggregate([
  {
    $bucket: {
      groupBy: "$total",
      boundaries: [0, 50, 100, 500],
      default: "500+",
      output: {
        count: { $sum: 1 }
      }
    }
  }
]);

// ===== $merge =====

await Order.aggregate([
  {
    $group: {
      _id: "$customer",
      totalSpent: { $sum: "$total" }
    }
  },
  {
    $merge: {
      into: "customerStats",
      whenMatched: "replace",
      whenNotMatched: "insert"
    }
  }
]);

// ===== $out =====

await Order.aggregate([
  { $match: { status: "completed" } },
  {
    $out: "completedOrders"
  }
]);

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
                  <strong>Filter before $unwind:</strong> Reduce documents
                  before unwinding arrays
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Use $addFields over $project:</strong> When you only
                  need to add fields, not reshape
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>$bucket for analytics:</strong> Great for histograms
                  and data distribution
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>$merge for incremental updates:</strong> Better than
                  $out for maintaining history
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>$redact for multi-tenancy:</strong> Secure way to
                  filter document content
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Use $bucketAuto:</strong> When you don't know data
                  distribution in advance
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>$out replaces collection:</strong> Use $merge for
                  safer updates
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>preserveNullAndEmptyArrays:</strong> Use with $unwind
                  to keep all documents
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Test $merge carefully:</strong> Ensure on field
                  matches correctly to avoid duplicates
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>$replaceRoot for flattening:</strong> Great for
                  promoting nested documents
                </span>
              </li>
            </ul>
          </section>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8">
            <Link
              href="/phase4/joins-lookups"
              className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              ← Previous: Joins & Lookups
            </Link>
            <Link
              href="/phase4/expressions-1"
              className="bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-500 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              Next: Expression Operators Part 1 →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
