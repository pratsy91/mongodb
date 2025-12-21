"use client";

import Link from "next/link";
import { useState } from "react";

export default function ExpressionsOnePage() {
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
          Expression Operators - Part 1
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Arithmetic, Boolean, Comparison, Conditional, and Type operators
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
                Expression operators are used within aggregation pipeline stages
                to transform and compute values. They can be used in $project,
                $addFields, $match with $expr, and more.
              </p>

              <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                Operator Categories
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Arithmetic:</strong> Mathematical operations on
                  numbers
                </li>
                <li>
                  <strong>Boolean:</strong> Logical operations (AND, OR, NOT)
                </li>
                <li>
                  <strong>Comparison:</strong> Compare values
                </li>
                <li>
                  <strong>Conditional:</strong> If-then-else logic
                </li>
                <li>
                  <strong>Type:</strong> Check and convert data types
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

              {/* Arithmetic Operators */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  1. Arithmetic Operators - All Operations
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://localhost:27017");
await client.connect();
const db = client.db("myDatabase");
const products = db.collection("products");

// ===== BASIC ARITHMETIC =====

// $add - Addition
await products.aggregate([
  {
    $project: {
      name: 1,
      price: 1,
      tax: 1,
      totalPrice: { $add: ["$price", "$tax"] }
    }
  }
]).toArray();

// Add multiple values
await products.aggregate([
  {
    $project: {
      total: { $add: ["$price", "$shipping", "$tax", "$handling"] }
    }
  }
]).toArray();

// $subtract - Subtraction
await products.aggregate([
  {
    $project: {
      name: 1,
      price: 1,
      discount: 1,
      finalPrice: { $subtract: ["$price", "$discount"] }
    }
  }
]).toArray();

// $multiply - Multiplication
await products.aggregate([
  {
    $project: {
      name: 1,
      price: 1,
      quantity: 1,
      total: { $multiply: ["$price", "$quantity"] }
    }
  }
]).toArray();

// $divide - Division
await products.aggregate([
  {
    $project: {
      name: 1,
      totalCost: 1,
      quantity: 1,
      unitCost: { $divide: ["$totalCost", "$quantity"] }
    }
  }
]).toArray();

// $mod - Modulo (remainder)
await products.aggregate([
  {
    $project: {
      name: 1,
      price: 1,
      isEven: { $eq: [{ $mod: ["$price", 2] }, 0] }
    }
  }
]).toArray();

// ===== ADVANCED ARITHMETIC =====

// $abs - Absolute value
await products.aggregate([
  {
    $project: {
      name: 1,
      difference: "$actualPrice",
      absDifference: { $abs: "$difference" }
    }
  }
]).toArray();

// $ceil - Round up
await products.aggregate([
  {
    $project: {
      name: 1,
      price: 1,
      roundedUpPrice: { $ceil: "$price" }
    }
  }
]).toArray();

// $floor - Round down
await products.aggregate([
  {
    $project: {
      name: 1,
      price: 1,
      roundedDownPrice: { $floor: "$price" }
    }
  }
]).toArray();

// $round - Round to decimal places
await products.aggregate([
  {
    $project: {
      name: 1,
      price: 1,
      roundedPrice: { $round: ["$price", 2] }  // 2 decimal places
    }
  }
]).toArray();

// $trunc - Truncate decimal
await products.aggregate([
  {
    $project: {
      name: 1,
      price: 1,
      truncatedPrice: { $trunc: ["$price", 1] }
    }
  }
]).toArray();

// ===== EXPONENTIAL & LOGARITHMIC =====

// $pow - Power
await products.aggregate([
  {
    $project: {
      name: 1,
      value: 1,
      squared: { $pow: ["$value", 2] },
      cubed: { $pow: ["$value", 3] }
    }
  }
]).toArray();

// $sqrt - Square root
await products.aggregate([
  {
    $project: {
      name: 1,
      area: 1,
      sideLength: { $sqrt: "$area" }
    }
  }
]).toArray();

// $exp - e^x (exponential)
await products.aggregate([
  {
    $project: {
      name: 1,
      rate: 1,
      exponential: { $exp: "$rate" }
    }
  }
]).toArray();

// $ln - Natural logarithm (base e)
await products.aggregate([
  {
    $project: {
      name: 1,
      value: 1,
      naturalLog: { $ln: "$value" }
    }
  }
]).toArray();

// $log - Logarithm with custom base
await products.aggregate([
  {
    $project: {
      name: 1,
      value: 1,
      log2: { $log: ["$value", 2] },
      log10: { $log: ["$value", 10] }
    }
  }
]).toArray();

// $log10 - Base 10 logarithm
await products.aggregate([
  {
    $project: {
      name: 1,
      value: 1,
      log10: { $log10: "$value" }
    }
  }
]).toArray();

// ===== COMPLEX CALCULATIONS =====

// Compound interest formula
await products.aggregate([
  {
    $project: {
      principal: "$investmentAmount",
      rate: "$annualRate",
      years: "$term",
      futureValue: {
        $multiply: [
          "$investmentAmount",
          {
            $pow: [
              { $add: [1, { $divide: ["$annualRate", 100] }] },
              "$term"
            ]
          }
        ]
      }
    }
  }
]).toArray();

// Percentage calculation
await products.aggregate([
  {
    $project: {
      name: 1,
      price: 1,
      discount: 1,
      discountPercent: {
        $multiply: [
          { $divide: ["$discount", "$price"] },
          100
        ]
      },
      discountedPrice: {
        $subtract: [
          "$price",
          { $multiply: ["$price", { $divide: ["$discount", 100] }] }
        ]
      }
    }
  }
]).toArray();

await client.close();`}</code>
                </pre>
              </div>

              {/* Boolean and Comparison Operators */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  2. Boolean and Comparison Operators
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://localhost:27017");
await client.connect();
const db = client.db("myDatabase");
const products = db.collection("products");

// ===== BOOLEAN OPERATORS =====

// $and - Logical AND
await products.aggregate([
  {
    $project: {
      name: 1,
      price: 1,
      quantity: 1,
      isPremiumInStock: {
        $and: [
          { $gte: ["$price", 100] },
          { $gt: ["$quantity", 0] }
        ]
      }
    }
  }
]).toArray();

// $or - Logical OR
await products.aggregate([
  {
    $project: {
      name: 1,
      status: 1,
      isAvailable: {
        $or: [
          { $eq: ["$status", "in_stock"] },
          { $eq: ["$status", "pre_order"] }
        ]
      }
    }
  }
]).toArray();

// $not - Logical NOT
await products.aggregate([
  {
    $project: {
      name: 1,
      inStock: 1,
      outOfStock: { $not: ["$inStock"] }
    }
  }
]).toArray();

// Complex boolean logic
await products.aggregate([
  {
    $project: {
      name: 1,
      isEligibleForDiscount: {
        $and: [
          { $gte: ["$price", 50] },
          {
            $or: [
              { $eq: ["$category", "electronics"] },
              { $gte: ["$rating", 4.5] }
            ]
          },
          { $not: [{ $eq: ["$onSale", true] }] }
        ]
      }
    }
  }
]).toArray();

// ===== COMPARISON OPERATORS =====

// $eq - Equal
await products.aggregate([
  {
    $project: {
      name: 1,
      category: 1,
      isElectronics: { $eq: ["$category", "electronics"] }
    }
  }
]).toArray();

// $ne - Not equal
await products.aggregate([
  {
    $project: {
      name: 1,
      status: 1,
      notPending: { $ne: ["$status", "pending"] }
    }
  }
]).toArray();

// $gt - Greater than
await products.aggregate([
  {
    $project: {
      name: 1,
      price: 1,
      isExpensive: { $gt: ["$price", 100] }
    }
  }
]).toArray();

// $gte - Greater than or equal
await products.aggregate([
  {
    $project: {
      name: 1,
      rating: 1,
      isHighRated: { $gte: ["$rating", 4] }
    }
  }
]).toArray();

// $lt - Less than
await products.aggregate([
  {
    $project: {
      name: 1,
      stock: 1,
      isLowStock: { $lt: ["$stock", 10] }
    }
  }
]).toArray();

// $lte - Less than or equal
await products.aggregate([
  {
    $project: {
      name: 1,
      price: 1,
      isAffordable: { $lte: ["$price", 50] }
    }
  }
]).toArray();

// $cmp - Compare (returns -1, 0, or 1)
await products.aggregate([
  {
    $project: {
      name: 1,
      price: 1,
      targetPrice: 100,
      comparison: { $cmp: ["$price", 100] }
      // -1 if price < 100
      //  0 if price == 100
      //  1 if price > 100
    }
  }
]).toArray();

// ===== COMBINING COMPARISONS =====

// Price range check
await products.aggregate([
  {
    $project: {
      name: 1,
      price: 1,
      inPriceRange: {
        $and: [
          { $gte: ["$price", 50] },
          { $lte: ["$price", 200] }
        ]
      }
    }
  }
]).toArray();

// Field comparison
await products.aggregate([
  {
    $project: {
      name: 1,
      price: 1,
      cost: 1,
      isProfitable: { $gt: ["$price", "$cost"] }
    }
  }
]).toArray();

// Multiple conditions
await products.aggregate([
  {
    $project: {
      name: 1,
      isFeatured: {
        $and: [
          { $gte: ["$rating", 4.5] },
          { $gte: ["$reviewCount", 50] },
          { $eq: ["$inStock", true] },
          { $lte: ["$price", 1000] }
        ]
      }
    }
  }
]).toArray();

await client.close();`}</code>
                </pre>
              </div>

              {/* Conditional Operators */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  3. Conditional Operators - Complete Guide
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://localhost:27017");
await client.connect();
const db = client.db("myDatabase");
const products = db.collection("products");

// ===== $cond - IF-THEN-ELSE =====

// Basic conditional
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

// Shorthand syntax
await products.aggregate([
  {
    $project: {
      name: 1,
      stock: 1,
      availability: {
        $cond: [
          { $gt: ["$stock", 0] },
          "in stock",
          "out of stock"
        ]
      }
    }
  }
]).toArray();

// Nested conditions
await products.aggregate([
  {
    $project: {
      name: 1,
      price: 1,
      category: {
        $cond: {
          if: { $gte: ["$price", 1000] },
          then: "premium",
          else: {
            $cond: {
              if: { $gte: ["$price", 100] },
              then: "mid-range",
              else: "budget"
            }
          }
        }
      }
    }
  }
]).toArray();

// ===== $switch - MULTI-WAY CONDITIONAL =====

// Multiple conditions
await products.aggregate([
  {
    $project: {
      name: 1,
      price: 1,
      priceCategory: {
        $switch: {
          branches: [
            { case: { $gte: ["$price", 1000] }, then: "luxury" },
            { case: { $gte: ["$price", 500] }, then: "premium" },
            { case: { $gte: ["$price", 100] }, then: "mid-range" },
            { case: { $gte: ["$price", 20] }, then: "budget" }
          ],
          default: "economy"
        }
      }
    }
  }
]).toArray();

// Status mapping
await products.aggregate([
  {
    $project: {
      name: 1,
      statusCode: 1,
      statusText: {
        $switch: {
          branches: [
            { case: { $eq: ["$statusCode", 1] }, then: "Active" },
            { case: { $eq: ["$statusCode", 2] }, then: "Pending" },
            { case: { $eq: ["$statusCode", 3] }, then: "Inactive" },
            { case: { $eq: ["$statusCode", 4] }, then: "Archived" }
          ],
          default: "Unknown"
        }
      }
    }
  }
]).toArray();

// Complex conditions in switch
await products.aggregate([
  {
    $project: {
      name: 1,
      discountRate: {
        $switch: {
          branches: [
            {
              case: {
                $and: [
                  { $gte: ["$price", 1000] },
                  { $gte: ["$rating", 4.5] }
                ]
              },
              then: 0.2
            },
            {
              case: { $gte: ["$price", 500] },
              then: 0.15
            },
            {
              case: { $gte: ["$price", 100] },
              then: 0.1
            }
          ],
          default: 0.05
        }
      }
    }
  }
]).toArray();

// ===== $ifNull - NULL COALESCING =====

// Provide default value for null
await products.aggregate([
  {
    $project: {
      name: 1,
      description: { $ifNull: ["$description", "No description available"] },
      rating: { $ifNull: ["$rating", 0] }
    }
  }
]).toArray();

// Chain multiple fields
await products.aggregate([
  {
    $project: {
      name: 1,
      displayName: {
        $ifNull: [
          "$displayName",
          { $ifNull: ["$shortName", "$name"] }
        ]
      }
    }
  }
]).toArray();

// With calculations
await products.aggregate([
  {
    $project: {
      name: 1,
      price: 1,
      discount: 1,
      finalPrice: {
        $subtract: [
          "$price",
          { $ifNull: ["$discount", 0] }
        ]
      }
    }
  }
]).toArray();

// ===== COMBINING CONDITIONALS =====

// Complex business logic
await products.aggregate([
  {
    $project: {
      name: 1,
      price: 1,
      stock: 1,
      rating: 1,
      badge: {
        $switch: {
          branches: [
            {
              case: {
                $and: [
                  { $eq: ["$stock", 0] },
                  { $ne: ["$restockDate", null] }
                ]
              },
              then: "COMING SOON"
            },
            {
              case: { $eq: ["$stock", 0] },
              then: "OUT OF STOCK"
            },
            {
              case: {
                $and: [
                  { $gte: ["$rating", 4.5] },
                  { $gte: ["$reviewCount", 100] }
                ]
              },
              then: "BESTSELLER"
            },
            {
              case: { $lt: ["$stock", 5] },
              then: "LIMITED STOCK"
            }
          ],
          default: null
        }
      },
      shippingCost: {
        $cond: [
          { $gte: ["$price", 50] },
          0,
          { $ifNull: ["$baseShippingCost", 5.99] }
        ]
      }
    }
  }
]).toArray();

// Scoring system
await products.aggregate([
  {
    $addFields: {
      score: {
        $add: [
          // Price points
          {
            $cond: [
              { $lte: ["$price", 50] },
              10,
              { $cond: [{ $lte: ["$price", 100] }, 5, 0] }
            ]
          },
          // Rating points
          { $multiply: [{ $ifNull: ["$rating", 0] }, 10] },
          // Stock bonus
          { $cond: [{ $gt: ["$stock", 10] }, 5, 0] }
        ]
      }
    }
  }
]).toArray();

await client.close();`}</code>
                </pre>
              </div>

              {/* Type Operators */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  4. Type Operators - Check and Convert
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://localhost:27017");
await client.connect();
const db = client.db("myDatabase");
const data = db.collection("data");

// ===== $type - CHECK TYPE =====

// Check field type
await data.aggregate([
  {
    $project: {
      value: 1,
      valueType: { $type: "$value" }
      // Returns: "double", "string", "object", "array", "binData", 
      //          "objectId", "bool", "date", "null", "regex", 
      //          "int", "timestamp", "long", "decimal", etc.
    }
  }
]).toArray();

// Conditional based on type
await data.aggregate([
  {
    $project: {
      value: 1,
      isNumber: { $eq: [{ $type: "$value" }, "number"] },
      isString: { $eq: [{ $type: "$value" }, "string"] },
      isArray: { $isArray: "$value" }
    }
  }
]).toArray();

// ===== $isArray - CHECK IF ARRAY =====

await data.aggregate([
  {
    $project: {
      tags: 1,
      isArray: { $isArray: "$tags" },
      arraySize: {
        $cond: [
          { $isArray: "$tags" },
          { $size: "$tags" },
          0
        ]
      }
    }
  }
]).toArray();

// ===== $isNumber - CHECK IF NUMBER =====

await data.aggregate([
  {
    $project: {
      value: 1,
      isNumeric: { $isNumber: "$value" }
    }
  }
]).toArray();

// ===== TYPE CONVERSION OPERATORS =====

// $toString - Convert to string
await data.aggregate([
  {
    $project: {
      price: 1,
      priceString: { $toString: "$price" }
    }
  }
]).toArray();

// $toInt - Convert to 32-bit integer
await data.aggregate([
  {
    $project: {
      stringValue: "$priceString",
      intValue: { $toInt: "$priceString" }
    }
  }
]).toArray();

// $toLong - Convert to 64-bit integer
await data.aggregate([
  {
    $project: {
      value: 1,
      longValue: { $toLong: "$value" }
    }
  }
]).toArray();

// $toDouble - Convert to double
await data.aggregate([
  {
    $project: {
      stringPrice: "$price",
      doublePrice: { $toDouble: "$price" }
    }
  }
]).toArray();

// $toDecimal - Convert to decimal
await data.aggregate([
  {
    $project: {
      value: 1,
      decimalValue: { $toDecimal: "$value" }
    }
  }
]).toArray();

// $toBool - Convert to boolean
await data.aggregate([
  {
    $project: {
      value: 1,
      boolValue: { $toBool: "$value" }
      // 0, null, undefined, "" -> false
      // Everything else -> true
    }
  }
]).toArray();

// $toDate - Convert to date
await data.aggregate([
  {
    $project: {
      dateString: "$timestamp",
      dateValue: { $toDate: "$timestamp" }
    }
  }
]).toArray();

// $toObjectId - Convert to ObjectId
await data.aggregate([
  {
    $project: {
      idString: "$userId",
      objectId: { $toObjectId: "$userId" }
    }
  }
]).toArray();

// ===== $convert - CONVERT WITH ERROR HANDLING =====

// Convert with custom error handling
await data.aggregate([
  {
    $project: {
      value: 1,
      numericValue: {
        $convert: {
          input: "$value",
          to: "double",
          onError: 0,         // Value if conversion fails
          onNull: 0           // Value if input is null
        }
      }
    }
  }
]).toArray();

// Safe string to number conversion
await data.aggregate([
  {
    $project: {
      priceString: 1,
      price: {
        $convert: {
          input: "$priceString",
          to: "decimal",
          onError: "Invalid price",
          onNull: null
        }
      }
    }
  }
]).toArray();

// ===== PRACTICAL TYPE OPERATIONS =====

// Clean and normalize data
await data.aggregate([
  {
    $project: {
      name: 1,
      price: {
        $cond: [
          { $isNumber: "$price" },
          "$price",
          {
            $convert: {
              input: "$price",
              to: "double",
              onError: 0,
              onNull: 0
            }
          }
        ]
      },
      tags: {
        $cond: [
          { $isArray: "$tags" },
          "$tags",
          []
        ]
      }
    }
  }
]).toArray();

// Type-safe calculations
await data.aggregate([
  {
    $project: {
      name: 1,
      total: {
        $cond: [
          {
            $and: [
              { $isNumber: "$price" },
              { $isNumber: "$quantity" }
            ]
          },
          { $multiply: ["$price", "$quantity"] },
          null
        ]
      }
    }
  }
]).toArray();

// Format for display
await data.aggregate([
  {
    $project: {
      name: 1,
      displayPrice: {
        $concat: [
          "$",
          {
            $toString: {
              $round: [
                {
                  $convert: {
                    input: "$price",
                    to: "double",
                    onError: 0
                  }
                },
                2
              ]
            }
          }
        ]
      }
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

              {/* Expression Operators in Mongoose */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-purple-300">
                  1. Expression Operators in Mongoose
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const mongoose = require("mongoose");

await mongoose.connect("mongodb://localhost:27017/myDatabase");

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  cost: Number,
  quantity: Number,
  rating: Number
});

const Product = mongoose.model("Product", productSchema);

// ===== ARITHMETIC =====

await Product.aggregate([
  {
    $project: {
      name: 1,
      profit: { $subtract: ["$price", "$cost"] },
      totalValue: { $multiply: ["$price", "$quantity"] }
    }
  }
]);

// ===== CONDITIONAL =====

await Product.aggregate([
  {
    $project: {
      name: 1,
      category: {
        $cond: {
          if: { $gte: ["$price", 100] },
          then: "premium",
          else: "standard"
        }
      }
    }
  }
]);

// ===== TYPE OPERATIONS =====

await Product.aggregate([
  {
    $project: {
      name: 1,
      priceString: { $toString: "$price" },
      isExpensive: { $gte: ["$price", 100] }
    }
  }
]);

// ===== COMPLEX EXPRESSIONS =====

await Product.aggregate([
  {
    $addFields: {
      score: {
        $add: [
          { $multiply: [{ $ifNull: ["$rating", 0] }, 20] },
          {
            $cond: [
              { $gte: ["$price", 100] },
              10,
              0
            ]
          }
        ]
      }
    }
  },
  { $sort: { score: -1 } }
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
                  <strong>Use $switch over nested $cond:</strong> More readable
                  for multiple conditions
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>$ifNull for default values:</strong> Handle
                  null/missing fields gracefully
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Type check before operations:</strong> Use $isNumber,
                  $isArray to prevent errors
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>$convert with error handling:</strong> Use onError and
                  onNull for safe conversions
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Round financial calculations:</strong> Use $round for
                  currency values
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Avoid division by zero:</strong> Check denominator
                  before $divide
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Use arithmetic operators:</strong> More efficient than
                  JavaScript in $where
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Boolean logic order:</strong> Put cheaper conditions
                  first in $and/$or
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Type conversions are expensive:</strong> Minimize
                  conversions in hot paths
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Test edge cases:</strong> Null, undefined, empty
                  strings with conditionals
                </span>
              </li>
            </ul>
          </section>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8">
            <Link
              href="/phase4/data-transformation"
              className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              ← Previous: Data Transformation
            </Link>
            <Link
              href="/phase4/expressions-2"
              className="bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-500 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              Next: Expression Operators Part 2 →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
