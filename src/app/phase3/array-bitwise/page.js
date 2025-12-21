"use client";

import Link from "next/link";
import { useState } from "react";

export default function ArrayBitwisePage() {
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
          Array & Bitwise Operators
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Complete guide to array query operators and bitwise operations
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
                Array Operators
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>$all:</strong> Match arrays that contain all specified
                  elements
                </li>
                <li>
                  <strong>$elemMatch:</strong> Match documents where array
                  element satisfies all conditions
                </li>
                <li>
                  <strong>$size:</strong> Match arrays by their length
                </li>
              </ul>

              <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                Bitwise Operators
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>$bitsAllClear:</strong> Match numeric values where all
                  specified bit positions are clear (0)
                </li>
                <li>
                  <strong>$bitsAllSet:</strong> Match numeric values where all
                  specified bit positions are set (1)
                </li>
                <li>
                  <strong>$bitsAnyClear:</strong> Match numeric values where any
                  specified bit position is clear (0)
                </li>
                <li>
                  <strong>$bitsAnySet:</strong> Match numeric values where any
                  specified bit position is set (1)
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

              {/* Array Operators */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  1. Array Operators - $all, $elemMatch, $size
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://localhost:27017");
await client.connect();
const db = client.db("myDatabase");
const products = db.collection("products");

// ===== $all - ARRAY CONTAINS ALL =====

// Find documents where array contains all specified elements
await products.find({ 
  tags: { $all: ["electronics", "sale"] } 
}).toArray();
// Matches: { tags: ["electronics", "sale", "new"] }
// Matches: { tags: ["sale", "electronics"] }
// Does NOT match: { tags: ["electronics"] }

// Order doesn't matter
await products.find({ 
  tags: { $all: ["laptop", "dell", "i7"] } 
}).toArray();

// Single element (equivalent to $in with one value)
await products.find({ 
  tags: { $all: ["featured"] } 
}).toArray();

// Nested arrays
await products.find({ 
  "attributes.colors": { $all: ["red", "blue"] } 
}).toArray();

// $all with numbers
await products.find({ 
  ratings: { $all: [4, 5] } 
}).toArray();

// $all with objects (order matters for objects)
await products.find({ 
  dimensions: { 
    $all: [
      { unit: "cm", value: 10 },
      { unit: "cm", value: 20 }
    ] 
  } 
}).toArray();

// Combine with other operators
await products.find({
  tags: { $all: ["electronics"] },
  price: { $lte: 1000 }
}).toArray();

// ===== $elemMatch - ARRAY ELEMENT MATCH =====

// Match array elements with multiple conditions
await products.find({ 
  reviews: { 
    $elemMatch: { 
      rating: { $gte: 4 },
      verified: true 
    } 
  } 
}).toArray();
// Matches if at least ONE review has rating >= 4 AND verified = true

// Complex nested conditions
await products.find({ 
  reviews: { 
    $elemMatch: { 
      rating: { $gte: 4, $lte: 5 },
      author: "John",
      helpful: { $gte: 10 }
    } 
  } 
}).toArray();

// $elemMatch with embedded documents
await products.find({ 
  inventory: { 
    $elemMatch: { 
      warehouse: "NYC",
      quantity: { $gt: 0 }
    } 
  } 
}).toArray();

// Multiple $elemMatch
await products.find({
  reviews: { 
    $elemMatch: { rating: { $gte: 4 } } 
  },
  inventory: { 
    $elemMatch: { quantity: { $gt: 0 } } 
  }
}).toArray();

// $elemMatch vs regular query
// Regular query (OR logic across array elements)
await products.find({ 
  "reviews.rating": { $gte: 4 },
  "reviews.verified": true 
}).toArray();
// Matches if ANY review has rating >= 4 OR ANY review is verified

// $elemMatch (AND logic within single element)
await products.find({ 
  reviews: { 
    $elemMatch: { 
      rating: { $gte: 4 },
      verified: true 
    } 
  } 
}).toArray();
// Matches only if ONE review has BOTH rating >= 4 AND verified = true

// $elemMatch with regex
await products.find({ 
  comments: { 
    $elemMatch: { 
      author: /john/i,
      text: /great/i 
    } 
  } 
}).toArray();

// Nested $elemMatch
await products.find({ 
  "variants.options": { 
    $elemMatch: { 
      name: "color",
      value: { $in: ["red", "blue"] }
    } 
  } 
}).toArray();

// ===== $size - ARRAY SIZE =====

// Match arrays with exact size
await products.find({ 
  tags: { $size: 3 } 
}).toArray();
// Matches only arrays with exactly 3 elements

// Zero-length arrays
await products.find({ 
  tags: { $size: 0 } 
}).toArray();

// $size with nested arrays
await products.find({ 
  "attributes.colors": { $size: 2 } 
}).toArray();

// NOTE: $size does NOT support range queries
// This does NOT work:
// await products.find({ tags: { $size: { $gte: 3 } } });

// Workaround: Use $expr with $size for ranges
await products.find({
  $expr: { 
    $gte: [{ $size: "$tags" }, 3] 
  }
}).toArray();

// Array size greater than
await products.find({
  $expr: { 
    $gt: [{ $size: "$reviews" }, 10] 
  }
}).toArray();

// Array size less than
await products.find({
  $expr: { 
    $lt: [{ $size: "$images" }, 5] 
  }
}).toArray();

// Array size in range
await products.find({
  $expr: {
    $and: [
      { $gte: [{ $size: "$tags" }, 2] },
      { $lte: [{ $size: "$tags" }, 5] }
    ]
  }
}).toArray();

// Combine $size with other conditions
await products.find({
  tags: { $size: 3 },
  price: { $lte: 1000 }
}).toArray();

// Check if array is not empty
await products.find({
  $expr: { 
    $gt: [{ $size: "$reviews" }, 0] 
  }
}).toArray();

// Alternative: Check if array exists and is not empty
await products.find({
  reviews: { $exists: true, $ne: [] }
}).toArray();

await client.close();`}</code>
                </pre>
              </div>

              {/* Bitwise Operators */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  2. Bitwise Operators - All Four Operators
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://localhost:27017");
await client.connect();
const db = client.db("myDatabase");
const permissions = db.collection("permissions");

// Binary representation reference:
// Decimal 54 = Binary 00110110
// Positions:        76543210 (right to left, 0-indexed)

// ===== $bitsAllSet - ALL BITS SET =====

// Match documents where ALL specified bit positions are set (1)

// Using bit positions (array)
await permissions.find({ 
  flags: { $bitsAllSet: [1, 5] } 
}).toArray();
// Matches if bits at positions 1 AND 5 are both 1
// Binary: ...0010010 (positions 1 and 5 are set)

// Using bitmask (number)
await permissions.find({ 
  flags: { $bitsAllSet: 50 } 
}).toArray();
// 50 in binary: 00110010
// Matches if ALL bits that are 1 in mask (positions 1, 4, 5) are also 1 in field

// Using binary string
await permissions.find({ 
  flags: { $bitsAllSet: "00110010" } 
}).toArray();

// Practical example: Permission checking
// READ = 1 (bit 0), WRITE = 2 (bit 1), EXECUTE = 4 (bit 2)
await permissions.find({ 
  userPermissions: { $bitsAllSet: [0, 1] } 
}).toArray();
// Find users with both READ and WRITE permissions

// Check for specific permission combination
const READ_WRITE = 0b11; // Binary: 11 (positions 0 and 1)
await permissions.find({ 
  userPermissions: { $bitsAllSet: READ_WRITE } 
}).toArray();

// ===== $bitsAllClear - ALL BITS CLEAR =====

// Match documents where ALL specified bit positions are clear (0)

// Using bit positions
await permissions.find({ 
  flags: { $bitsAllClear: [1, 5] } 
}).toArray();
// Matches if bits at positions 1 AND 5 are both 0

// Using bitmask
await permissions.find({ 
  flags: { $bitsAllClear: 50 } 
}).toArray();
// Matches if ALL bits that are 1 in mask are 0 in field

// Practical example: Find users WITHOUT specific permissions
await permissions.find({ 
  userPermissions: { $bitsAllClear: [3, 4] } 
}).toArray();
// Find users without DELETE and ADMIN permissions

// ===== $bitsAnySet - ANY BIT SET =====

// Match documents where ANY specified bit position is set (1)

// Using bit positions
await permissions.find({ 
  flags: { $bitsAnySet: [1, 2, 5] } 
}).toArray();
// Matches if bit at position 1 OR 2 OR 5 is 1

// Using bitmask
await permissions.find({ 
  flags: { $bitsAnySet: 35 } 
}).toArray();
// 35 in binary: 00100011
// Matches if ANY bit that is 1 in mask is also 1 in field

// Practical example: Find users with at least one permission
await permissions.find({ 
  userPermissions: { $bitsAnySet: [0, 1, 2, 3, 4] } 
}).toArray();

// ===== $bitsAnyClear - ANY BIT CLEAR =====

// Match documents where ANY specified bit position is clear (0)

// Using bit positions
await permissions.find({ 
  flags: { $bitsAnyClear: [1, 2, 5] } 
}).toArray();
// Matches if bit at position 1 OR 2 OR 5 is 0

// Using bitmask
await permissions.find({ 
  flags: { $bitsAnyClear: 35 } 
}).toArray();
// Matches if ANY bit that is 1 in mask is 0 in field

// Practical example: Find users missing at least one permission
await permissions.find({ 
  userPermissions: { $bitsAnyClear: [0, 1, 2] } 
}).toArray();

// ===== COMPREHENSIVE PRACTICAL EXAMPLES =====

// Real-world permission system
// Bits: 0=Read, 1=Write, 2=Delete, 3=Admin, 4=Share

// Find users with full access (all permissions)
await permissions.find({ 
  userPermissions: { $bitsAllSet: [0, 1, 2, 3, 4] } 
}).toArray();

// Find users with read-only (read set, others clear)
await permissions.find({ 
  userPermissions: { 
    $bitsAllSet: [0],
    $bitsAllClear: [1, 2, 3, 4] 
  } 
}).toArray();

// Find users with at least write permission
await permissions.find({ 
  userPermissions: { $bitsAnySet: [1] } 
}).toArray();

// Find users missing admin
await permissions.find({ 
  userPermissions: { $bitsAllClear: [3] } 
}).toArray();

// Feature flags system
const FEATURE_BETA = 1 << 0;  // Bit 0
const FEATURE_PREMIUM = 1 << 1;  // Bit 1
const FEATURE_EXPERIMENTAL = 1 << 2;  // Bit 2

// Find users with beta access
await permissions.find({ 
  features: { $bitsAllSet: FEATURE_BETA } 
}).toArray();

// Find premium users
await permissions.find({ 
  features: { $bitsAllSet: FEATURE_PREMIUM } 
}).toArray();

// Find users with beta OR premium
await permissions.find({ 
  features: { $bitsAnySet: FEATURE_BETA | FEATURE_PREMIUM } 
}).toArray();

// Status flags (using actual bit values)
await permissions.find({ 
  status: { 
    $bitsAllSet: 0b0110,    // Binary literal
    $bitsAllClear: 0b1001 
  } 
}).toArray();

// Combining with other operators
await permissions.find({
  userPermissions: { $bitsAllSet: [0, 1] },
  accountType: "premium",
  active: true
}).toArray();

// Working with large numbers (64-bit)
await permissions.find({ 
  largeFlags: { 
    $bitsAllSet: "1000000000000000000000000000000000000000000000000000000000000001" 
  } 
}).toArray();

await client.close();`}</code>
                </pre>
              </div>

              {/* Advanced Combinations */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  3. Advanced Array & Bitwise Combinations
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://localhost:27017");
await client.connect();
const db = client.db("myDatabase");

// ===== COMBINING ARRAY OPERATORS =====

const products = db.collection("products");

// $all + $size
await products.find({
  tags: { 
    $all: ["electronics", "sale"],
    $size: 3 
  }
}).toArray();
// Array has exactly 3 elements AND contains both "electronics" and "sale"

// Multiple $elemMatch on same array
await products.find({
  reviews: {
    $all: [
      { $elemMatch: { rating: 5, verified: true } },
      { $elemMatch: { rating: { $gte: 4 }, author: "John" } }
    ]
  }
}).toArray();
// At least one 5-star verified review AND at least one 4+ star review by John

// $all + $elemMatch combined
await products.find({
  variants: {
    $all: [
      { $elemMatch: { color: "red", size: "L", inStock: true } },
      { $elemMatch: { color: "blue", size: "M", inStock: true } }
    ]
  }
}).toArray();

// Complex nested query
await products.find({
  $and: [
    { tags: { $all: ["laptop"] } },
    { reviews: { $elemMatch: { rating: { $gte: 4 } } } },
    { $expr: { $gte: [{ $size: "$images" }, 3] } }
  ]
}).toArray();

// ===== ARRAY OPERATORS WITH $expr =====

// Compare array sizes
await products.find({
  $expr: {
    $gt: [
      { $size: "$reviews" },
      { $size: "$questions" }
    ]
  }
}).toArray();
// More reviews than questions

// Calculate average array length
await products.aggregate([
  {
    $match: {
      $expr: {
        $gte: [
          { $size: "$tags" },
          { $avg: [2, 4, 6] }  // Average of 2, 4, 6 = 4
        ]
      }
    }
  }
]).toArray();

// Filter by array element count
await products.find({
  $expr: {
    $and: [
      { $isArray: "$tags" },
      { $gte: [{ $size: "$tags" }, 2] },
      { $lte: [{ $size: "$tags" }, 10] }
    ]
  }
}).toArray();

// ===== BITWISE + OTHER OPERATORS =====

const users = db.collection("users");

// Bitwise with logical operators
await users.find({
  $or: [
    { permissions: { $bitsAllSet: [0, 1, 2] } },  // Full access
    { role: "admin" }  // Or admin role
  ]
}).toArray();

// Bitwise with date filters
await users.find({
  permissions: { $bitsAnySet: [3] },  // Has admin bit
  lastLogin: { $gte: new Date("2024-01-01") }
}).toArray();

// Multiple bitwise conditions
await users.find({
  $and: [
    { permissions: { $bitsAllSet: [0] } },      // Must have read
    { permissions: { $bitsAnySet: [1, 2] } },   // Must have write OR delete
    { permissions: { $bitsAllClear: [3] } }     // Must NOT have admin
  ]
}).toArray();

// Bitwise with arrays
await users.find({
  groups: { $in: ["developers", "testers"] },
  permissions: { $bitsAllSet: [0, 1] }
}).toArray();

// ===== REAL-WORLD COMPLEX QUERIES =====

// E-commerce: Products with specific attributes
await products.find({
  $and: [
    { tags: { $all: ["electronics", "sale"] } },
    { $expr: { $gte: [{ $size: "$images" }, 3] } },
    { reviews: { $elemMatch: { rating: { $gte: 4 }, verified: true } } },
    { price: { $lte: 1000 } },
    { "inventory.quantity": { $gt: 0 } }
  ]
}).toArray();

// Permission system: Find users for audit
await users.find({
  $or: [
    { 
      permissions: { $bitsAllSet: [3, 4] },  // Admin + elevated
      lastAudit: { $lt: new Date("2024-01-01") }
    },
    {
      permissions: { $bitsAnySet: [5, 6, 7] },  // Any critical permission
      department: { $in: ["finance", "hr"] }
    }
  ]
}).toArray();

// Social media: Posts matching criteria
const posts = db.collection("posts");

await posts.find({
  $and: [
    { tags: { $all: ["mongodb", "tutorial"] } },
    { $expr: { $gte: [{ $size: "$likes" }, 100] } },
    { 
      comments: { 
        $elemMatch: { 
          rating: { $gte: 4 },
          verified: true,
          helpful: { $gte: 10 }
        } 
      } 
    },
    { flags: { $bitsAllClear: [0, 1, 2] } }  // No spam/abuse/nsfw flags
  ]
}).toArray();

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

              {/* Array Operators in Mongoose */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-purple-300">
                  1. Array Operators in Mongoose
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const mongoose = require("mongoose");

await mongoose.connect("mongodb://localhost:27017/myDatabase");

const productSchema = new mongoose.Schema({
  name: String,
  tags: [String],
  reviews: [{
    rating: Number,
    author: String,
    verified: Boolean
  }],
  inventory: [{
    warehouse: String,
    quantity: Number
  }]
});

const Product = mongoose.model("Product", productSchema);

// ===== $all =====

// Array contains all elements
await Product.find({ 
  tags: { $all: ["electronics", "sale"] } 
});

// Query builder syntax
await Product.find()
  .where("tags").all(["electronics", "sale"]);

// ===== $elemMatch =====

// Element match with conditions
await Product.find({ 
  reviews: { 
    $elemMatch: { 
      rating: { $gte: 4 },
      verified: true 
    } 
  } 
});

// Query builder syntax
await Product.find()
  .where("reviews")
  .elemMatch({ rating: { $gte: 4 }, verified: true });

// Multiple conditions
await Product.find({
  reviews: { 
    $elemMatch: { 
      rating: { $gte: 4, $lte: 5 },
      author: "John"
    } 
  }
});

// ===== $size =====

// Exact array size
await Product.find({ 
  tags: { $size: 3 } 
});

// Query builder syntax
await Product.find()
  .where("tags").size(3);

// Size range using $expr
await Product.find({
  $expr: { 
    $gte: [{ $size: "$tags" }, 3] 
  }
});

// ===== COMBINATIONS =====

// Multiple array conditions
await Product.find({
  tags: { $all: ["electronics"], $size: 3 },
  reviews: { $elemMatch: { rating: { $gte: 4 } } }
});

// With populate
const orderSchema = new mongoose.Schema({
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    quantity: Number
  }]
});

const Order = mongoose.model("Order", orderSchema);

await Order.find({
  items: { 
    $elemMatch: { 
      quantity: { $gte: 5 } 
    } 
  }
}).populate("items.product");

await mongoose.disconnect();`}</code>
                </pre>
              </div>

              {/* Bitwise Operators in Mongoose */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-purple-300">
                  2. Bitwise Operators in Mongoose
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const mongoose = require("mongoose");

await mongoose.connect("mongodb://localhost:27017/myDatabase");

const userSchema = new mongoose.Schema({
  username: String,
  permissions: Number,
  features: Number,
  flags: Number
});

const User = mongoose.model("User", userSchema);

// ===== $bitsAllSet =====

// All bits must be set
await User.find({ 
  permissions: { $bitsAllSet: [0, 1] } 
});

// Using bitmask
await User.find({ 
  permissions: { $bitsAllSet: 3 } 
});  // Binary: 11 (bits 0 and 1)

// ===== $bitsAllClear =====

// All bits must be clear
await User.find({ 
  permissions: { $bitsAllClear: [3, 4] } 
});

// ===== $bitsAnySet =====

// Any bit must be set
await User.find({ 
  permissions: { $bitsAnySet: [0, 1, 2] } 
});

// ===== $bitsAnyClear =====

// Any bit must be clear
await User.find({ 
  permissions: { $bitsAnyClear: [0, 1] } 
});

// ===== PRACTICAL EXAMPLES =====

// Permission constants
const PERMISSIONS = {
  READ: 1 << 0,    // 1
  WRITE: 1 << 1,   // 2
  DELETE: 1 << 2,  // 4
  ADMIN: 1 << 3    // 8
};

// Find users with read and write
await User.find({ 
  permissions: { 
    $bitsAllSet: [0, 1] 
  } 
});

// Find users without admin
await User.find({ 
  permissions: { 
    $bitsAllClear: [3] 
  } 
});

// Virtual for permission checking
userSchema.virtual("hasReadPermission").get(function() {
  return (this.permissions & PERMISSIONS.READ) !== 0;
});

userSchema.virtual("hasWritePermission").get(function() {
  return (this.permissions & PERMISSIONS.WRITE) !== 0;
});

// Instance methods
userSchema.methods.hasPermission = function(permission) {
  return (this.permissions & permission) !== 0;
};

userSchema.methods.grantPermission = function(permission) {
  this.permissions |= permission;
  return this.save();
};

userSchema.methods.revokePermission = function(permission) {
  this.permissions &= ~permission;
  return this.save();
};

// Usage
const user = await User.findOne({ username: "john" });
if (user.hasPermission(PERMISSIONS.WRITE)) {
  console.log("User has write permission");
}

await user.grantPermission(PERMISSIONS.ADMIN);
await user.revokePermission(PERMISSIONS.DELETE);

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
                  <strong>Use $elemMatch for complex array queries:</strong>{" "}
                  Ensures all conditions apply to single element
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>$size doesn&apos;t support ranges:</strong> Use $expr
                  with $size for range queries
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Index array fields:</strong> Create multikey indexes
                  for better query performance
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Store array length separately:</strong> If frequently
                  querying by size, store length as field
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Bitwise for flags and permissions:</strong> Efficient
                  storage and querying of boolean flags
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Document bit positions:</strong> Clearly document what
                  each bit position represents
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Use constants for bit values:</strong> Define named
                  constants for better code readability
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Limit array sizes:</strong> Keep arrays reasonably
                  sized (&lt; 1000 elements) for performance
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>$all vs $in:</strong> Use $all when ALL elements must
                  match, $in when ANY matches
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Bitwise operators work on integers:</strong> Ensure
                  fields are numeric types
                </span>
              </li>
            </ul>
          </section>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8">
            <Link
              href="/phase3/element-evaluation"
              className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              ← Previous: Element & Evaluation
            </Link>
            <Link
              href="/phase3/geospatial"
              className="bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-500 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              Next: Geospatial →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
