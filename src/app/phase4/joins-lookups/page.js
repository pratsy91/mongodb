"use client";

import Link from "next/link";
import { useState } from "react";

export default function JoinsLookupsPage() {
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
          Advanced Joins & Lookups
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          $lookup, $graphLookup, $unionWith, $facet - Complete guide
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
                Pipeline Stages
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>$lookup:</strong> Left outer join with another
                  collection
                </li>
                <li>
                  <strong>$graphLookup:</strong> Recursive join for hierarchical
                  data
                </li>
                <li>
                  <strong>$unionWith:</strong> Combine documents from multiple
                  collections
                </li>
                <li>
                  <strong>$facet:</strong> Process multiple aggregation
                  pipelines within single stage
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

              {/* $lookup */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  1. $lookup - Join Collections
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://localhost:27017");
await client.connect();
const db = client.db("myDatabase");
const orders = db.collection("orders");
const customers = db.collection("customers");

// ===== BASIC $lookup =====

// Simple join
await orders.aggregate([
  {
    $lookup: {
      from: "customers",           // Collection to join
      localField: "customerId",    // Field from orders
      foreignField: "_id",         // Field from customers
      as: "customerInfo"           // Output array field
    }
  }
]).toArray();
// Result: Each order has customerInfo: [{ customer document }]

// Unwind to convert array to object
await orders.aggregate([
  {
    $lookup: {
      from: "customers",
      localField: "customerId",
      foreignField: "_id",
      as: "customer"
    }
  },
  { $unwind: "$customer" }  // Convert array to object
]).toArray();

// ===== $lookup WITH PIPELINE =====

// Advanced join with filtering
await orders.aggregate([
  {
    $lookup: {
      from: "customers",
      let: { customerId: "$customerId" },  // Variables from current doc
      pipeline: [
        { 
          $match: { 
            $expr: { $eq: ["$_id", "$$customerId"] }  // Use $$ for variables
          } 
        },
        {
          $project: { name: 1, email: 1, _id: 0 }  // Only include specific fields
        }
      ],
      as: "customer"
    }
  }
]).toArray();

// Join with additional filtering
await orders.aggregate([
  {
    $lookup: {
      from: "products",
      let: { productIds: "$items.productId" },
      pipeline: [
        {
          $match: {
            $expr: { $in: ["$_id", "$$productIds"] },
            inStock: true  // Additional filter
          }
        },
        {
          $project: { name: 1, price: 1 }
        }
      ],
      as: "availableProducts"
    }
  }
]).toArray();

// ===== MULTIPLE $lookup =====

// Join multiple collections
await orders.aggregate([
  {
    $lookup: {
      from: "customers",
      localField: "customerId",
      foreignField: "_id",
      as: "customer"
    }
  },
  { $unwind: "$customer" },
  {
    $lookup: {
      from: "products",
      localField: "items.productId",
      foreignField: "_id",
      as: "products"
    }
  },
  {
    $lookup: {
      from: "reviews",
      localField: "_id",
      foreignField: "orderId",
      as: "reviews"
    }
  }
]).toArray();

// ===== NESTED $lookup =====

// Lookup within lookup
await orders.aggregate([
  {
    $lookup: {
      from: "customers",
      let: { customerId: "$customerId" },
      pipeline: [
        {
          $match: { $expr: { $eq: ["$_id", "$$customerId"] } }
        },
        {
          $lookup: {
            from: "addresses",
            localField: "addressId",
            foreignField: "_id",
            as: "address"
          }
        },
        { $unwind: { path: "$address", preserveNullAndEmptyArrays: true } }
      ],
      as: "customer"
    }
  }
]).toArray();

// ===== $lookup WITH AGGREGATION =====

// Aggregate related documents
await customers.aggregate([
  {
    $lookup: {
      from: "orders",
      let: { customerId: "$_id" },
      pipeline: [
        {
          $match: {
            $expr: { $eq: ["$customerId", "$$customerId"] },
            status: "completed"
          }
        },
        {
          $group: {
            _id: null,
            totalSpent: { $sum: "$total" },
            orderCount: { $sum: 1 }
          }
        }
      ],
      as: "orderStats"
    }
  },
  {
    $unwind: { path: "$orderStats", preserveNullAndEmptyArrays: true }
  }
]).toArray();

// ===== UNCORRELATED $lookup =====

// Join without matching fields (Cartesian product - use carefully!)
await orders.aggregate([
  {
    $lookup: {
      from: "promotions",
      pipeline: [
        { $match: { active: true } }
      ],
      as: "activePromotions"
    }
  }
]).toArray();

// ===== $lookup WITH $unwind =====

// Unwind array before lookup
await orders.aggregate([
  { $unwind: "$items" },
  {
    $lookup: {
      from: "products",
      localField: "items.productId",
      foreignField: "_id",
      as: "productDetails"
    }
  },
  { $unwind: "$productDetails" }
]).toArray();

await client.close();`}</code>
                </pre>
              </div>

              {/* $graphLookup */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  2. $graphLookup - Recursive Joins
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://localhost:27017");
await client.connect();
const db = client.db("myDatabase");
const employees = db.collection("employees");

// Sample data: Employee hierarchy
// { _id: 1, name: "CEO", reportsTo: null }
// { _id: 2, name: "VP", reportsTo: 1 }
// { _id: 3, name: "Manager", reportsTo: 2 }
// { _id: 4, name: "Developer", reportsTo: 3 }

// ===== BASIC $graphLookup =====

// Find all subordinates (recursive lookup)
await employees.aggregate([
  { $match: { name: "CEO" } },
  {
    $graphLookup: {
      from: "employees",
      startWith: "$_id",           // Start from current document's _id
      connectFromField: "_id",     // Field to start traversal from
      connectToField: "reportsTo", // Field to match
      as: "allSubordinates",       // Output array
      maxDepth: 10                 // Maximum recursion depth (optional)
    }
  }
]).toArray();

// ===== $graphLookup WITH DEPTH =====

// Include depth level
await employees.aggregate([
  { $match: { name: "CEO" } },
  {
    $graphLookup: {
      from: "employees",
      startWith: "$_id",
      connectFromField: "_id",
      connectToField: "reportsTo",
      as: "subordinates",
      maxDepth: 3,
      depthField: "level"  // Include depth in results
    }
  }
]).toArray();

// ===== $graphLookup WITH RESTRICTION =====

// Filter during traversal
await employees.aggregate([
  { $match: { name: "VP" } },
  {
    $graphLookup: {
      from: "employees",
      startWith: "$_id",
      connectFromField: "_id",
      connectToField: "reportsTo",
      as: "team",
      restrictSearchWithMatch: {  // Filter documents during traversal
        department: "Engineering"
      }
    }
  }
]).toArray();

// ===== ORGANIZATIONAL HIERARCHY =====

// Build complete org chart
await employees.aggregate([
  { $match: { reportsTo: null } },  // Start with top-level
  {
    $graphLookup: {
      from: "employees",
      startWith: "$_id",
      connectFromField: "_id",
      connectToField: "reportsTo",
      as: "organization",
      depthField: "level"
    }
  },
  {
    $project: {
      name: 1,
      organization: {
        $map: {
          input: "$organization",
          as: "emp",
          in: {
            name: "$$emp.name",
            level: "$$emp.level",
            position: "$$emp.position"
          }
        }
      }
    }
  }
]).toArray();

// ===== SOCIAL NETWORK - FRIENDS OF FRIENDS =====

const users = db.collection("users");
// { _id: 1, name: "Alice", friends: [2, 3] }
// { _id: 2, name: "Bob", friends: [1, 4] }
// { _id: 3, name: "Charlie", friends: [1, 5] }

await users.aggregate([
  { $match: { name: "Alice" } },
  {
    $graphLookup: {
      from: "users",
      startWith: "$friends",
      connectFromField: "friends",
      connectToField: "_id",
      as: "network",
      maxDepth: 2,
      depthField: "connectionLevel"
    }
  }
]).toArray();

// ===== CATEGORY TREE =====

const categories = db.collection("categories");
// { _id: 1, name: "Electronics", parentId: null }
// { _id: 2, name: "Computers", parentId: 1 }
// { _id: 3, name: "Laptops", parentId: 2 }

// Find all child categories
await categories.aggregate([
  { $match: { name: "Electronics" } },
  {
    $graphLookup: {
      from: "categories",
      startWith: "$_id",
      connectFromField: "_id",
      connectToField: "parentId",
      as: "subcategories"
    }
  }
]).toArray();

// Find category path (breadcrumb)
await categories.aggregate([
  { $match: { name: "Laptops" } },
  {
    $graphLookup: {
      from: "categories",
      startWith: "$parentId",
      connectFromField: "parentId",
      connectToField: "_id",
      as: "ancestors",
      depthField: "depth"
    }
  },
  {
    $project: {
      name: 1,
      breadcrumb: {
        $reduce: {
          input: {
            $sortArray: {
              input: "$ancestors",
              sortBy: { depth: -1 }
            }
          },
          initialValue: "",
          in: {
            $concat: [
              "$$value",
              { $cond: [{ $eq: ["$$value", ""] }, "", " > "] },
              "$$this.name"
            ]
          }
        }
      }
    }
  }
]).toArray();

// ===== FLIGHT ROUTES =====

const flights = db.collection("flights");
// { from: "NYC", to: "LAX", price: 300 }
// { from: "LAX", to: "SFO", price: 150 }
// { from: "SFO", to: "SEA", price: 100 }

// Find all reachable destinations
await flights.aggregate([
  { $match: { from: "NYC" } },
  {
    $graphLookup: {
      from: "flights",
      startWith: "$to",
      connectFromField: "to",
      connectToField: "from",
      as: "connections",
      maxDepth: 3,
      depthField: "stops"
    }
  }
]).toArray();

await client.close();`}</code>
                </pre>
              </div>

              {/* $unionWith */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  3. $unionWith - Combine Collections
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://localhost:27017");
await client.connect();
const db = client.db("myDatabase");

// ===== BASIC $unionWith =====

const sales2023 = db.collection("sales2023");
const sales2024 = db.collection("sales2024");

// Union two collections
await sales2023.aggregate([
  {
    $unionWith: {
      coll: "sales2024"
    }
  }
]).toArray();

// ===== $unionWith WITH PIPELINE =====

// Union with transformation
await sales2023.aggregate([
  {
    $unionWith: {
      coll: "sales2024",
      pipeline: [
        { $match: { region: "North America" } },
        { $project: { product: 1, amount: 1, year: { $literal: 2024 } } }
      ]
    }
  }
]).toArray();

// ===== MULTIPLE $unionWith =====

// Combine multiple collections
await sales2023.aggregate([
  { $addFields: { source: "2023" } },
  {
    $unionWith: {
      coll: "sales2024",
      pipeline: [
        { $addFields: { source: "2024" } }
      ]
    }
  },
  {
    $unionWith: {
      coll: "sales2022",
      pipeline: [
        { $addFields: { source: "2022" } }
      ]
    }
  }
]).toArray();

// ===== UNION WITH AGGREGATION =====

// Aggregate after union
await sales2023.aggregate([
  {
    $unionWith: "sales2024"
  },
  {
    $group: {
      _id: "$product",
      totalSales: { $sum: "$amount" },
      count: { $sum: 1 }
    }
  },
  { $sort: { totalSales: -1 } }
]).toArray();

// ===== COMBINE DIFFERENT SCHEMAS =====

const webOrders = db.collection("webOrders");
const mobileOrders = db.collection("mobileOrders");

// Normalize and combine
await webOrders.aggregate([
  {
    $project: {
      orderId: "$_id",
      total: 1,
      source: { $literal: "web" }
    }
  },
  {
    $unionWith: {
      coll: "mobileOrders",
      pipeline: [
        {
          $project: {
            orderId: "$_id",
            total: "$amount",
            source: { $literal: "mobile" }
          }
        }
      ]
    }
  }
]).toArray();

// ===== HISTORICAL DATA ANALYSIS =====

// Combine yearly collections
await db.collection("orders2020").aggregate([
  { $addFields: { year: 2020 } },
  { $unionWith: { coll: "orders2021", pipeline: [{ $addFields: { year: 2021 } }] } },
  { $unionWith: { coll: "orders2022", pipeline: [{ $addFields: { year: 2022 } }] } },
  { $unionWith: { coll: "orders2023", pipeline: [{ $addFields: { year: 2023 } }] } },
  { $unionWith: { coll: "orders2024", pipeline: [{ $addFields: { year: 2024 } }] } },
  {
    $group: {
      _id: "$year",
      totalRevenue: { $sum: "$total" },
      orderCount: { $sum: 1 }
    }
  },
  { $sort: { _id: 1 } }
]).toArray();

// ===== UNION WITH FILTERING =====

const activeUsers = db.collection("activeUsers");
const archivedUsers = db.collection("archivedUsers");

// Search across all user data
await activeUsers.aggregate([
  { $match: { email: /example\\.com$/ } },
  {
    $unionWith: {
      coll: "archivedUsers",
      pipeline: [
        { $match: { email: /example\\.com$/ } }
      ]
    }
  },
  { $sort: { lastLogin: -1 } }
]).toArray();

await client.close();`}</code>
                </pre>
              </div>

              {/* $facet */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  4. $facet - Multiple Pipelines
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://localhost:27017");
await client.connect();
const db = client.db("myDatabase");
const products = db.collection("products");

// ===== BASIC $facet =====

// Run multiple aggregations in parallel
await products.aggregate([
  {
    $facet: {
      priceStats: [
        {
          $group: {
            _id: null,
            avgPrice: { $avg: "$price" },
            minPrice: { $min: "$price" },
            maxPrice: { $max: "$price" }
          }
        }
      ],
      categoryCount: [
        { $sortByCount: "$category" },
        { $limit: 5 }
      ],
      topProducts: [
        { $sort: { sales: -1 } },
        { $limit: 10 },
        { $project: { name: 1, sales: 1 } }
      ]
    }
  }
]).toArray();
// Result: {
//   priceStats: [{ avgPrice: 50, minPrice: 10, maxPrice: 200 }],
//   categoryCount: [{ _id: "Electronics", count: 150 }, ...],
//   topProducts: [{ name: "Product A", sales: 1000 }, ...]
// }

// ===== PAGINATION WITH FACET =====

// Get data and total count simultaneously
await products.aggregate([
  { $match: { inStock: true } },
  {
    $facet: {
      metadata: [
        { $count: "total" },
        { $addFields: { page: 1, perPage: 20 } }
      ],
      data: [
        { $sort: { name: 1 } },
        { $skip: 0 },
        { $limit: 20 }
      ]
    }
  }
]).toArray();

// ===== ANALYTICS DASHBOARD =====

const orders = db.collection("orders");

await orders.aggregate([
  { $match: { status: "completed" } },
  {
    $facet: {
      salesByRegion: [
        {
          $group: {
            _id: "$region",
            total: { $sum: "$amount" }
          }
        },
        { $sort: { total: -1 } }
      ],
      salesByMonth: [
        {
          $group: {
            _id: {
              year: { $year: "$date" },
              month: { $month: "$date" }
            },
            total: { $sum: "$amount" }
          }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
      ],
      topCustomers: [
        {
          $group: {
            _id: "$customerId",
            totalSpent: { $sum: "$amount" }
          }
        },
        { $sort: { totalSpent: -1 } },
        { $limit: 10 }
      ],
      productPerformance: [
        { $unwind: "$items" },
        {
          $group: {
            _id: "$items.productId",
            quantity: { $sum: "$items.quantity" },
            revenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } }
          }
        },
        { $sort: { revenue: -1 } },
        { $limit: 20 }
      ]
    }
  }
]).toArray();

// ===== SEARCH WITH FACETS =====

// E-commerce search results with filters
await products.aggregate([
  { $match: { $text: { $search: "laptop" } } },
  {
    $facet: {
      results: [
        { $sort: { score: { $meta: "textScore" } } },
        { $limit: 20 },
        {
          $project: {
            name: 1,
            price: 1,
            category: 1
          }
        }
      ],
      priceRanges: [
        {
          $bucket: {
            groupBy: "$price",
            boundaries: [0, 500, 1000, 2000, 5000],
            default: "5000+",
            output: {
              count: { $sum: 1 }
            }
          }
        }
      ],
      brands: [
        { $sortByCount: "$brand" },
        { $limit: 10 }
      ],
      avgRating: [
        {
          $group: {
            _id: null,
            avg: { $avg: "$rating" }
          }
        }
      ]
    }
  }
]).toArray();

// ===== COMPLEX FACETED ANALYSIS =====

const users = db.collection("users");

await users.aggregate([
  {
    $facet: {
      demographics: [
        {
          $bucket: {
            groupBy: "$age",
            boundaries: [0, 18, 25, 35, 50, 65, 100],
            output: {
              count: { $sum: 1 },
              avgIncome: { $avg: "$income" }
            }
          }
        }
      ],
      geography: [
        { $sortByCount: "$country" },
        { $limit: 20 }
      ],
      engagement: [
        {
          $group: {
            _id: {
              $switch: {
                branches: [
                  { case: { $gte: ["$loginCount", 100] }, then: "power_user" },
                  { case: { $gte: ["$loginCount", 20] }, then: "active" },
                  { case: { $gte: ["$loginCount", 5] }, then: "occasional" }
                ],
                default: "inactive"
              }
            },
            count: { $sum: 1 }
          }
        }
      ],
      revenue: [
        {
          $group: {
            _id: "$subscriptionPlan",
            users: { $sum: 1 },
            totalRevenue: { $sum: "$subscriptionPrice" },
            avgLTV: { $avg: "$lifetimeValue" }
          }
        }
      ]
    }
  }
]).toArray();

// ===== NESTED $facet =====

// Facet within facet (rare but possible)
await products.aggregate([
  {
    $facet: {
      overview: [
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            avgPrice: { $avg: "$price" }
          }
        }
      ],
      breakdown: [
        {
          $facet: {
            byCategory: [
              { $sortByCount: "$category" }
            ],
            byPriceRange: [
              {
                $bucket: {
                  groupBy: "$price",
                  boundaries: [0, 50, 100, 500],
                  default: "500+",
                  output: { count: { $sum: 1 } }
                }
              }
            ]
          }
        }
      ]
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

              {/* Joins in Mongoose */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-purple-300">
                  1. Joins and Lookups in Mongoose
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const mongoose = require("mongoose");

await mongoose.connect("mongodb://localhost:27017/myDatabase");

// ===== SCHEMAS =====

const customerSchema = new mongoose.Schema({
  name: String,
  email: String
});

const orderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
  total: Number,
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    quantity: Number
  }]
});

const Customer = mongoose.model("Customer", customerSchema);
const Order = mongoose.model("Order", orderSchema);

// ===== $lookup IN MONGOOSE =====

// Basic lookup
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

// Lookup with pipeline
await Order.aggregate([
  {
    $lookup: {
      from: "customers",
      let: { custId: "$customerId" },
      pipeline: [
        { $match: { $expr: { $eq: ["$_id", "$$custId"] } } },
        { $project: { name: 1, email: 1 } }
      ],
      as: "customer"
    }
  }
]);

// ===== $graphLookup IN MONGOOSE =====

const employeeSchema = new mongoose.Schema({
  name: String,
  reportsTo: mongoose.Schema.Types.ObjectId
});

const Employee = mongoose.model("Employee", employeeSchema);

await Employee.aggregate([
  { $match: { name: "CEO" } },
  {
    $graphLookup: {
      from: "employees",
      startWith: "$_id",
      connectFromField: "_id",
      connectToField: "reportsTo",
      as: "subordinates",
      depthField: "level"
    }
  }
]);

// ===== $unionWith IN MONGOOSE =====

await Order.aggregate([
  { $match: { year: 2023 } },
  {
    $unionWith: {
      coll: "orders",
      pipeline: [
        { $match: { year: 2024 } }
      ]
    }
  }
]);

// ===== $facet IN MONGOOSE =====

await Order.aggregate([
  {
    $facet: {
      stats: [
        {
          $group: {
            _id: null,
            total: { $sum: "$total" },
            avg: { $avg: "$total" }
          }
        }
      ],
      topOrders: [
        { $sort: { total: -1 } },
        { $limit: 10 }
      ]
    }
  }
]);

// ===== POPULATE vs $lookup =====

// Populate (simpler, uses $lookup under the hood)
await Order.find().populate("customerId");

// Populate with select
await Order.find().populate({
  path: "customerId",
  select: "name email"
});

// Nested populate
await Order.find().populate({
  path: "customerId",
  populate: {
    path: "addressId"
  }
});

// Manual $lookup (more control)
await Order.aggregate([
  {
    $lookup: {
      from: "customers",
      localField: "customerId",
      foreignField: "_id",
      as: "customer"
    }
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
                  <strong>Index foreign keys:</strong> Create indexes on
                  localField and foreignField for $lookup
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Use $lookup pipeline:</strong> More flexible, allows
                  filtering during join
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>$match before $lookup:</strong> Filter main collection
                  first to reduce join size
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Limit $graphLookup depth:</strong> Prevent excessive
                  recursion with maxDepth
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Consider embedding:</strong> Sometimes denormalization
                  is better than joins
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Use $facet wisely:</strong> Great for dashboards but
                  can be memory-intensive
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>$unionWith for sharding:</strong> Useful for
                  time-series data across collections
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Project early:</strong> Reduce document size before
                  expensive operations
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Cache $graphLookup results:</strong> Hierarchical data
                  changes infrequently
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Test performance:</strong> Complex joins can impact
                  query time significantly
                </span>
              </li>
            </ul>
          </section>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8">
            <Link
              href="/phase4/basic-aggregation"
              className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              ← Previous: Basic Aggregation
            </Link>
            <Link
              href="/phase4/data-transformation"
              className="bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-500 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              Next: Data Transformation →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
