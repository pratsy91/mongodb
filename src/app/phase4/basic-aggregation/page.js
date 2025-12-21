"use client";

import Link from "next/link";
import { useState } from "react";

export default function BasicAggregationPage() {
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
          Basic Aggregation Pipeline
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Core pipeline stages and accumulator operators
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
                The <strong>Aggregation Pipeline</strong> processes documents
                through multiple stages, each transforming the documents and
                passing results to the next stage.
              </p>

              <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                Core Pipeline Stages
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>$match:</strong> Filter documents (like find query)
                </li>
                <li>
                  <strong>$group:</strong> Group documents by expression and
                  compute aggregations
                </li>
                <li>
                  <strong>$project:</strong> Reshape documents, include/exclude
                  fields
                </li>
                <li>
                  <strong>$sort:</strong> Sort documents by field(s)
                </li>
                <li>
                  <strong>$limit:</strong> Limit number of documents
                </li>
                <li>
                  <strong>$skip:</strong> Skip number of documents
                </li>
                <li>
                  <strong>$count:</strong> Count documents
                </li>
                <li>
                  <strong>$sample:</strong> Random sample of documents
                </li>
                <li>
                  <strong>$sortByCount:</strong> Group by value and count,
                  sorted descending
                </li>
              </ul>

              <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                Accumulator Operators
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>$sum:</strong> Sum values
                </li>
                <li>
                  <strong>$avg:</strong> Average values
                </li>
                <li>
                  <strong>$min/$max:</strong> Minimum/maximum values
                </li>
                <li>
                  <strong>$first/$last:</strong> First/last values
                </li>
                <li>
                  <strong>$push:</strong> Create array of all values
                </li>
                <li>
                  <strong>$addToSet:</strong> Create array of unique values
                </li>
                <li>
                  <strong>$stdDevPop/$stdDevSamp:</strong> Standard deviation
                </li>
                <li>
                  <strong>$mergeObjects:</strong> Merge objects
                </li>
                <li>
                  <strong>$top/$topN/$bottom/$bottomN:</strong> Top/bottom N
                  values
                </li>
                <li>
                  <strong>$firstN/$lastN/$maxN/$minN:</strong>{" "}
                  First/last/max/min N values
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

              {/* $match and $group */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  1. $match and $group - Filter and Aggregate
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://localhost:27017");
await client.connect();
const db = client.db("myDatabase");
const orders = db.collection("orders");

// ===== $match - FILTER DOCUMENTS =====

// Basic match (like find)
await orders.aggregate([
  { $match: { status: "completed" } }
]).toArray();

// Match with operators
await orders.aggregate([
  { 
    $match: { 
      total: { $gte: 100 },
      status: { $in: ["completed", "shipped"] }
    } 
  }
]).toArray();

// Match with date range
await orders.aggregate([
  { 
    $match: { 
      orderDate: {
        $gte: new Date("2024-01-01"),
        $lt: new Date("2024-12-31")
      }
    } 
  }
]).toArray();

// Multiple $match stages (filters early for performance)
await orders.aggregate([
  { $match: { status: "completed" } },
  { $match: { total: { $gte: 100 } } }
]).toArray();

// ===== $group - GROUP AND AGGREGATE =====

// Count documents per group
await orders.aggregate([
  { 
    $group: { 
      _id: "$status",
      count: { $sum: 1 }
    } 
  }
]).toArray();
// Result: [{ _id: "completed", count: 150 }, { _id: "pending", count: 25 }]

// Sum field values
await orders.aggregate([
  { 
    $group: { 
      _id: "$customerId",
      totalSpent: { $sum: "$total" },
      orderCount: { $sum: 1 }
    } 
  }
]).toArray();

// Average
await orders.aggregate([
  { 
    $group: { 
      _id: "$category",
      avgPrice: { $avg: "$price" },
      count: { $sum: 1 }
    } 
  }
]).toArray();

// Min and Max
await orders.aggregate([
  { 
    $group: { 
      _id: "$customerId",
      minOrder: { $min: "$total" },
      maxOrder: { $max: "$total" },
      totalSpent: { $sum: "$total" }
    } 
  }
]).toArray();

// Group by multiple fields
await orders.aggregate([
  { 
    $group: { 
      _id: {
        year: { $year: "$orderDate" },
        month: { $month: "$orderDate" },
        status: "$status"
      },
      total: { $sum: "$total" },
      count: { $sum: 1 }
    } 
  }
]).toArray();

// Group all documents (_id: null)
await orders.aggregate([
  { 
    $group: { 
      _id: null,
      totalRevenue: { $sum: "$total" },
      avgOrderValue: { $avg: "$total" },
      orderCount: { $sum: 1 }
    } 
  }
]).toArray();

// ===== COMBINING $match and $group =====

// Filter then group
await orders.aggregate([
  { $match: { status: "completed" } },
  { 
    $group: { 
      _id: "$customerId",
      totalSpent: { $sum: "$total" },
      orderCount: { $sum: 1 }
    } 
  }
]).toArray();

// Group then filter
await orders.aggregate([
  { 
    $group: { 
      _id: "$customerId",
      totalSpent: { $sum: "$total" }
    } 
  },
  { $match: { totalSpent: { $gte: 1000 } } }  // Filter groups
]).toArray();

await client.close();`}</code>
                </pre>
              </div>

              {/* $project, $sort, $limit, $skip */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  2. $project, $sort, $limit, $skip - Shape and Order
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://localhost:27017");
await client.connect();
const db = client.db("myDatabase");
const products = db.collection("products");

// ===== $project - RESHAPE DOCUMENTS =====

// Include specific fields
await products.aggregate([
  { 
    $project: { 
      name: 1,
      price: 1,
      category: 1
      // _id is included by default
    } 
  }
]).toArray();

// Exclude fields
await products.aggregate([
  { 
    $project: { 
      _id: 0,          // Exclude _id
      internalCode: 0  // Exclude internalCode
    } 
  }
]).toArray();

// Rename fields
await products.aggregate([
  { 
    $project: { 
      productName: "$name",
      productPrice: "$price"
    } 
  }
]).toArray();

// Computed fields
await products.aggregate([
  { 
    $project: { 
      name: 1,
      price: 1,
      discount: 1,
      finalPrice: { 
        $subtract: ["$price", "$discount"] 
      }
    } 
  }
]).toArray();

// Conditional fields
await products.aggregate([
  { 
    $project: { 
      name: 1,
      price: 1,
      priceCategory: {
        $cond: {
          if: { $gte: ["$price", 100] },
          then: "expensive",
          else: "affordable"
        }
      }
    } 
  }
]).toArray();

// Nested field extraction
await products.aggregate([
  { 
    $project: { 
      name: 1,
      street: "$address.street",
      city: "$address.city"
    } 
  }
]).toArray();

// Array element access
await products.aggregate([
  { 
    $project: { 
      name: 1,
      firstTag: { $arrayElemAt: ["$tags", 0] },
      lastTag: { $arrayElemAt: ["$tags", -1] }
    } 
  }
]).toArray();

// ===== $sort - SORT DOCUMENTS =====

// Sort ascending
await products.aggregate([
  { $sort: { price: 1 } }  // 1 = ascending
]).toArray();

// Sort descending
await products.aggregate([
  { $sort: { price: -1 } }  // -1 = descending
]).toArray();

// Sort by multiple fields
await products.aggregate([
  { 
    $sort: { 
      category: 1,   // First by category ascending
      price: -1      // Then by price descending
    } 
  }
]).toArray();

// Sort after grouping
await products.aggregate([
  { 
    $group: { 
      _id: "$category",
      avgPrice: { $avg: "$price" }
    } 
  },
  { $sort: { avgPrice: -1 } }
]).toArray();

// ===== $limit - LIMIT RESULTS =====

// Get first 10 documents
await products.aggregate([
  { $limit: 10 }
]).toArray();

// Top 5 most expensive
await products.aggregate([
  { $sort: { price: -1 } },
  { $limit: 5 }
]).toArray();

// ===== $skip - SKIP DOCUMENTS =====

// Skip first 10
await products.aggregate([
  { $skip: 10 }
]).toArray();

// Pagination: Page 3, 10 per page
const page = 3;
const perPage = 10;
await products.aggregate([
  { $sort: { name: 1 } },
  { $skip: (page - 1) * perPage },
  { $limit: perPage }
]).toArray();

// ===== COMBINING ALL =====

// Complete query: filter, group, sort, limit
await products.aggregate([
  { $match: { inStock: true } },
  { 
    $group: { 
      _id: "$category",
      avgPrice: { $avg: "$price" },
      count: { $sum: 1 }
    } 
  },
  { $sort: { avgPrice: -1 } },
  { $limit: 10 },
  { 
    $project: { 
      category: "$_id",
      avgPrice: { $round: ["$avgPrice", 2] },
      count: 1,
      _id: 0
    } 
  }
]).toArray();

await client.close();`}</code>
                </pre>
              </div>

              {/* Accumulator Operators */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  3. Accumulator Operators - Complete List
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://localhost:27017");
await client.connect();
const db = client.db("myDatabase");
const sales = db.collection("sales");

// ===== BASIC ACCUMULATORS =====

// $sum - Sum values
await sales.aggregate([
  { 
    $group: { 
      _id: "$region",
      totalSales: { $sum: "$amount" },
      count: { $sum: 1 }  // Count documents
    } 
  }
]).toArray();

// $avg - Average
await sales.aggregate([
  { 
    $group: { 
      _id: "$product",
      avgPrice: { $avg: "$price" }
    } 
  }
]).toArray();

// $min and $max
await sales.aggregate([
  { 
    $group: { 
      _id: "$category",
      minPrice: { $min: "$price" },
      maxPrice: { $max: "$price" }
    } 
  }
]).toArray();

// $first and $last (depends on sort order)
await sales.aggregate([
  { $sort: { date: 1 } },
  { 
    $group: { 
      _id: "$customerId",
      firstPurchase: { $first: "$date" },
      lastPurchase: { $last: "$date" },
      firstAmount: { $first: "$amount" },
      lastAmount: { $last: "$amount" }
    } 
  }
]).toArray();

// ===== ARRAY ACCUMULATORS =====

// $push - Create array of all values (includes duplicates)
await sales.aggregate([
  { 
    $group: { 
      _id: "$customerId",
      allPurchases: { $push: "$productName" },
      allAmounts: { $push: "$amount" }
    } 
  }
]).toArray();

// $push with object
await sales.aggregate([
  { 
    $group: { 
      _id: "$customerId",
      purchases: { 
        $push: {
          product: "$productName",
          amount: "$amount",
          date: "$date"
        }
      }
    } 
  }
]).toArray();

// $addToSet - Create array of unique values
await sales.aggregate([
  { 
    $group: { 
      _id: "$customerId",
      uniqueProducts: { $addToSet: "$productName" },
      uniqueCategories: { $addToSet: "$category" }
    } 
  }
]).toArray();

// ===== STATISTICAL ACCUMULATORS =====

// $stdDevPop - Population standard deviation
await sales.aggregate([
  { 
    $group: { 
      _id: "$region",
      avgSales: { $avg: "$amount" },
      stdDevPopulation: { $stdDevPop: "$amount" }
    } 
  }
]).toArray();

// $stdDevSamp - Sample standard deviation
await sales.aggregate([
  { 
    $group: { 
      _id: "$product",
      stdDevSample: { $stdDevSamp: "$price" }
    } 
  }
]).toArray();

// ===== MERGE ACCUMULATOR =====

// $mergeObjects - Merge objects into one
await sales.aggregate([
  { 
    $group: { 
      _id: "$orderId",
      mergedData: { $mergeObjects: "$metadata" }
    } 
  }
]).toArray();

// ===== NEW ACCUMULATORS (MongoDB 5.2+) =====

// $top - Top document(s) based on sort
await sales.aggregate([
  { 
    $group: { 
      _id: "$category",
      topSale: {
        $top: {
          output: ["$productName", "$amount"],
          sortBy: { amount: -1 }
        }
      }
    } 
  }
]).toArray();

// $topN - Top N documents
await sales.aggregate([
  { 
    $group: { 
      _id: "$category",
      top3Sales: {
        $topN: {
          n: 3,
          output: { product: "$productName", amount: "$amount" },
          sortBy: { amount: -1 }
        }
      }
    } 
  }
]).toArray();

// $bottom - Bottom document
await sales.aggregate([
  { 
    $group: { 
      _id: "$region",
      lowestSale: {
        $bottom: {
          output: ["$productName", "$amount"],
          sortBy: { amount: 1 }
        }
      }
    } 
  }
]).toArray();

// $bottomN - Bottom N documents
await sales.aggregate([
  { 
    $group: { 
      _id: "$category",
      bottom5Sales: {
        $bottomN: {
          n: 5,
          output: "$amount",
          sortBy: { amount: 1 }
        }
      }
    } 
  }
]).toArray();

// $firstN - First N values
await sales.aggregate([
  { $sort: { date: 1 } },
  { 
    $group: { 
      _id: "$customerId",
      first3Purchases: {
        $firstN: {
          n: 3,
          input: "$productName"
        }
      }
    } 
  }
]).toArray();

// $lastN - Last N values
await sales.aggregate([
  { $sort: { date: 1 } },
  { 
    $group: { 
      _id: "$customerId",
      last5Purchases: {
        $lastN: {
          n: 5,
          input: { product: "$productName", amount: "$amount" }
        }
      }
    } 
  }
]).toArray();

// $maxN - N maximum values
await sales.aggregate([
  { 
    $group: { 
      _id: "$category",
      top3Prices: {
        $maxN: {
          n: 3,
          input: "$price"
        }
      }
    } 
  }
]).toArray();

// $minN - N minimum values
await sales.aggregate([
  { 
    $group: { 
      _id: "$category",
      bottom3Prices: {
        $minN: {
          n: 3,
          input: "$price"
        }
      }
    } 
  }
]).toArray();

// ===== CUSTOM ACCUMULATOR =====

// $accumulator - Custom JavaScript accumulator (use carefully)
await sales.aggregate([
  { 
    $group: { 
      _id: "$region",
      customMetric: {
        $accumulator: {
          init: function() { return { sum: 0, count: 0 }; },
          accumulate: function(state, amount) {
            return {
              sum: state.sum + amount,
              count: state.count + 1
            };
          },
          accumulateArgs: ["$amount"],
          merge: function(state1, state2) {
            return {
              sum: state1.sum + state2.sum,
              count: state1.count + state2.count
            };
          },
          finalize: function(state) {
            return state.sum / state.count;
          },
          lang: "js"
        }
      }
    } 
  }
]).toArray();

await client.close();`}</code>
                </pre>
              </div>

              {/* $count, $sample, $sortByCount */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  4. $count, $sample, $sortByCount
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://localhost:27017");
await client.connect();
const db = client.db("myDatabase");
const users = db.collection("users");

// ===== $count - COUNT DOCUMENTS =====

// Count all documents
await users.aggregate([
  { $count: "totalUsers" }
]).toArray();
// Result: [{ totalUsers: 1523 }]

// Count after filtering
await users.aggregate([
  { $match: { active: true } },
  { $count: "activeUsers" }
]).toArray();

// Count by group
await users.aggregate([
  { $match: { registrationDate: { $gte: new Date("2024-01-01") } } },
  { $count: "newUsers" }
]).toArray();

// ===== $sample - RANDOM SAMPLE =====

// Get 10 random documents
await users.aggregate([
  { $sample: { size: 10 } }
]).toArray();

// Random sample after filtering
await users.aggregate([
  { $match: { active: true } },
  { $sample: { size: 5 } }
]).toArray();

// Random sample for testing
await users.aggregate([
  { $match: { country: "USA" } },
  { $sample: { size: 100 } }
]).toArray();

// ===== $sortByCount - GROUP AND COUNT =====

// Count documents by field value (sorted descending)
await users.aggregate([
  { $sortByCount: "$country" }
]).toArray();
// Result: [
//   { _id: "USA", count: 500 },
//   { _id: "UK", count: 300 },
//   { _id: "Canada", count: 200 }
// ]

// Count by nested field
await users.aggregate([
  { $sortByCount: "$address.city" }
]).toArray();

// Count by computed value
await users.aggregate([
  { 
    $sortByCount: {
      $cond: {
        if: { $gte: ["$age", 18] },
        then: "adult",
        else: "minor"
      }
    }
  }
]).toArray();

// Count with filter
await users.aggregate([
  { $match: { active: true } },
  { $sortByCount: "$subscriptionPlan" }
]).toArray();

// ===== REAL-WORLD EXAMPLES =====

// Analytics: User registration by month
await users.aggregate([
  { 
    $project: { 
      yearMonth: {
        $dateToString: {
          format: "%Y-%m",
          date: "$registrationDate"
        }
      }
    } 
  },
  { $sortByCount: "$yearMonth" },
  { $sort: { _id: 1 } }  // Sort by month
]).toArray();

// Top products by sales count
const orders = db.collection("orders");
await orders.aggregate([
  { $unwind: "$items" },
  { $sortByCount: "$items.productName" },
  { $limit: 20 }
]).toArray();

// Activity distribution
await users.aggregate([
  { 
    $bucket: {
      groupBy: "$loginCount",
      boundaries: [0, 10, 50, 100, 500, 1000],
      default: "1000+",
      output: {
        count: { $sum: 1 },
        users: { $push: "$username" }
      }
    }
  }
]).toArray();

// Random A/B test assignment
await users.aggregate([
  { $match: { active: true } },
  { $sample: { size: 1000 } },
  { 
    $project: { 
      email: 1,
      testGroup: {
        $cond: {
          if: { $lt: [{ $rand: {} }, 0.5] },
          then: "A",
          else: "B"
        }
      }
    } 
  }
]).toArray();

// Complex counting with multiple stages
await orders.aggregate([
  { $match: { status: "completed", orderDate: { $gte: new Date("2024-01-01") } } },
  { $unwind: "$items" },
  { 
    $group: { 
      _id: "$items.category",
      totalSales: { $sum: "$items.quantity" },
      revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
      uniqueCustomers: { $addToSet: "$customerId" }
    } 
  },
  { 
    $project: { 
      category: "$_id",
      totalSales: 1,
      revenue: 1,
      uniqueCustomers: { $size: "$uniqueCustomers" },
      _id: 0
    } 
  },
  { $sort: { revenue: -1 } },
  { $limit: 10 }
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

              {/* Basic Aggregation in Mongoose */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-purple-300">
                  1. Basic Aggregation in Mongoose
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const mongoose = require("mongoose");

await mongoose.connect("mongodb://localhost:27017/myDatabase");

const orderSchema = new mongoose.Schema({
  customerId: mongoose.Schema.Types.ObjectId,
  total: Number,
  status: String,
  orderDate: Date,
  items: [{
    product: String,
    quantity: Number,
    price: Number
  }]
});

const Order = mongoose.model("Order", orderSchema);

// ===== BASIC AGGREGATION =====

// $match and $group
const result = await Order.aggregate([
  { $match: { status: "completed" } },
  { 
    $group: { 
      _id: "$customerId",
      totalSpent: { $sum: "$total" },
      orderCount: { $sum: 1 }
    } 
  }
]);

// $project
await Order.aggregate([
  { 
    $project: { 
      customerName: 1,
      total: 1,
      discountedTotal: { $multiply: ["$total", 0.9] }
    } 
  }
]);

// $sort, $limit, $skip
await Order.aggregate([
  { $sort: { total: -1 } },
  { $limit: 10 }
]);

// Pagination
const page = 2;
const perPage = 20;
await Order.aggregate([
  { $sort: { orderDate: -1 } },
  { $skip: (page - 1) * perPage },
  { $limit: perPage }
]);

// ===== ACCUMULATOR OPERATORS =====

// Multiple accumulators
await Order.aggregate([
  { 
    $group: { 
      _id: null,
      totalRevenue: { $sum: "$total" },
      avgOrderValue: { $avg: "$total" },
      minOrder: { $min: "$total" },
      maxOrder: { $max: "$total" },
      orderCount: { $sum: 1 }
    } 
  }
]);

// $push and $addToSet
await Order.aggregate([
  { 
    $group: { 
      _id: "$customerId",
      allOrders: { $push: "$_id" },
      uniqueStatuses: { $addToSet: "$status" }
    } 
  }
]);

// ===== CHAINING WITH MONGOOSE =====

// Using aggregate() method
await Order
  .aggregate([
    { $match: { status: "completed" } },
    { $group: { _id: "$customerId", total: { $sum: "$total" } } }
  ])
  .exec();

// With options
await Order.aggregate([
  { $match: { status: "completed" } }
], {
  allowDiskUse: true,
  maxTimeMS: 30000
});

// ===== STATIC METHODS =====

orderSchema.statics.getTopCustomers = function(limit = 10) {
  return this.aggregate([
    { $match: { status: "completed" } },
    { 
      $group: { 
        _id: "$customerId",
        totalSpent: { $sum: "$total" },
        orderCount: { $sum: 1 }
      } 
    },
    { $sort: { totalSpent: -1 } },
    { $limit: limit }
  ]);
};

// Usage
const topCustomers = await Order.getTopCustomers(20);

// ===== WITH POPULATE =====

// Cannot directly populate in aggregation, use $lookup instead
await Order.aggregate([
  {
    $lookup: {
      from: "customers",
      localField: "customerId",
      foreignField: "_id",
      as: "customer"
    }
  },
  { $unwind: "$customer" }
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
                  <strong>$match early:</strong> Filter documents before other
                  stages to reduce processing
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Use indexes:</strong> Ensure $match and $sort stages
                  use indexed fields
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>$project to reduce data:</strong> Remove unnecessary
                  fields early in pipeline
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Pipeline order matters:</strong> Optimize stage order
                  for performance
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Use allowDiskUse:</strong> For large aggregations
                  exceeding 100MB memory
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Test with explain():</strong> Analyze aggregation
                  performance
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>$limit after $sort:</strong> Reduce documents before
                  expensive operations
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Avoid $accumulator:</strong> Use built-in operators
                  for better performance
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Group efficiently:</strong> Choose appropriate _id to
                  minimize group size
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Use $sample carefully:</strong> Can be slow on large
                  collections without index
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
              href="/phase4/joins-lookups"
              className="bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-500 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              Next: Joins & Lookups →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
