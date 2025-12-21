"use client";

import Link from "next/link";
import { useState } from "react";

export default function ComparisonLogicalPage() {
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
          Comparison & Logical Operators
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Complete guide to all comparison and logical query operators
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
                Comparison Operators
              </h3>
              <p className="text-lg">
                Compare values in queries to filter documents based on field
                values.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>$eq:</strong> Equal to (implicit when not specified)
                </li>
                <li>
                  <strong>$ne:</strong> Not equal to
                </li>
                <li>
                  <strong>$gt:</strong> Greater than
                </li>
                <li>
                  <strong>$gte:</strong> Greater than or equal to
                </li>
                <li>
                  <strong>$lt:</strong> Less than
                </li>
                <li>
                  <strong>$lte:</strong> Less than or equal to
                </li>
                <li>
                  <strong>$in:</strong> Match any value in array
                </li>
                <li>
                  <strong>$nin:</strong> Match no values in array
                </li>
              </ul>

              <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                Logical Operators
              </h3>
              <p className="text-lg">Combine multiple conditions in queries.</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>$and:</strong> All conditions must be true (implicit)
                </li>
                <li>
                  <strong>$or:</strong> At least one condition must be true
                </li>
                <li>
                  <strong>$not:</strong> Inverts the condition
                </li>
                <li>
                  <strong>$nor:</strong> All conditions must be false
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

              {/* Comparison Operators */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  1. Comparison Operators
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient } = require('mongodb');

const client = new MongoClient('mongodb://localhost:27017');
await client.connect();
const db = client.db('myDatabase');
const products = db.collection('products');

// ===== $eq - EQUAL TO =====

// Explicit $eq
await products.find({ price: { $eq: 99.99 } }).toArray();

// Implicit equality (same as above)
await products.find({ price: 99.99 }).toArray();

// With nested fields
await products.find({ 'details.color': { $eq: 'red' } }).toArray();

// With arrays (matches if ANY element equals)
await products.find({ tags: { $eq: 'sale' } }).toArray();

// With null
await products.find({ deletedAt: { $eq: null } }).toArray();

// With boolean
await products.find({ active: { $eq: true } }).toArray();

// ===== $ne - NOT EQUAL TO =====

// Not equal to value
await products.find({ status: { $ne: 'deleted' } }).toArray();

// Not equal to number
await products.find({ stock: { $ne: 0 } }).toArray();

// Not null
await products.find({ description: { $ne: null } }).toArray();

// Arrays (matches if NO element equals)
await products.find({ tags: { $ne: 'discontinued' } }).toArray();

// ===== $gt - GREATER THAN =====

// Greater than number
await products.find({ price: { $gt: 100 } }).toArray();

// Greater than date
await products.find({ 
  createdAt: { $gt: new Date('2024-01-01') } 
}).toArray();

// With nested fields
await products.find({ 
  'metrics.views': { $gt: 1000 } 
}).toArray();

// ===== $gte - GREATER THAN OR EQUAL =====

// Greater than or equal to number
await products.find({ stock: { $gte: 10 } }).toArray();

// Age restriction
await products.find({ 
  'user.age': { $gte: 18 } 
}).toArray();

// Date range start
await products.find({ 
  publishDate: { $gte: new Date('2024-01-01') } 
}).toArray();

// ===== $lt - LESS THAN =====

// Less than number
await products.find({ price: { $lt: 50 } }).toArray();

// Less than date
await products.find({ 
  expiresAt: { $lt: new Date() } 
}).toArray();

// Rating threshold
await products.find({ 
  'rating.average': { $lt: 3.0 } 
}).toArray();

// ===== $lte - LESS THAN OR EQUAL =====

// Less than or equal to number
await products.find({ discount: { $lte: 20 } }).toArray();

// Maximum price
await products.find({ price: { $lte: 999.99 } }).toArray();

// Date range end
await products.find({ 
  endDate: { $lte: new Date('2024-12-31') } 
}).toArray();

// ===== COMBINING COMPARISON OPERATORS =====

// Range query
await products.find({ 
  price: { $gte: 50, $lte: 200 } 
}).toArray();

// Age range
await products.find({ 
  age: { $gt: 18, $lt: 65 } 
}).toArray();

// Date range
await products.find({ 
  createdAt: {
    $gte: new Date('2024-01-01'),
    $lt: new Date('2024-12-31')
  }
}).toArray();

// Multiple field comparisons
await products.find({ 
  price: { $gte: 100 },
  stock: { $gt: 0 },
  rating: { $gte: 4.0 }
}).toArray();

// ===== $in - MATCH ANY IN ARRAY =====

// Match any value in array
await products.find({ 
  status: { $in: ['active', 'pending', 'processing'] } 
}).toArray();

// Match numbers
await products.find({ 
  categoryId: { $in: [1, 2, 3, 5, 8] } 
}).toArray();

// Match ObjectIds
const { ObjectId } = require('mongodb');
await products.find({ 
  _id: { 
    $in: [
      new ObjectId('507f1f77bcf86cd799439011'),
      new ObjectId('507f1f77bcf86cd799439012')
    ]
  }
}).toArray();

// Match dates
await products.find({ 
  createdAt: { 
    $in: [
      new Date('2024-01-01'),
      new Date('2024-06-01'),
      new Date('2024-12-01')
    ]
  }
}).toArray();

// Match with regex patterns
await products.find({ 
  category: { $in: [/^electronics/i, /^computers/i] } 
}).toArray();

// Empty array matches nothing
await products.find({ status: { $in: [] } }).toArray();  // Returns nothing

// ===== $nin - NOT IN ARRAY =====

// Not in status values
await products.find({ 
  status: { $nin: ['deleted', 'banned', 'suspended'] } 
}).toArray();

// Not in price range
await products.find({ 
  price: { $nin: [0, null, undefined] } 
}).toArray();

// Exclude categories
await products.find({ 
  categoryId: { $nin: [13, 666, 999] } 
}).toArray();

// Exclude specific IDs
await products.find({ 
  userId: { 
    $nin: [
      new ObjectId('507f1f77bcf86cd799439011'),
      new ObjectId('507f1f77bcf86cd799439012')
    ]
  }
}).toArray();

// ===== COMPARISON WITH NULL =====

// Equals null (field is null OR doesn't exist)
await products.find({ deletedAt: null }).toArray();

// Not null (field exists and is not null)
await products.find({ deletedAt: { $ne: null } }).toArray();

// Greater than null
await products.find({ price: { $gt: null } }).toArray();

await client.close();`}</code>
                </pre>
              </div>

              {/* Logical Operators */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  2. Logical Operators
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient } = require('mongodb');

const client = new MongoClient('mongodb://localhost:27017');
await client.connect();
const db = client.db('myDatabase');
const users = db.collection('users');

// ===== $and - ALL CONDITIONS MUST BE TRUE =====

// Explicit $and
await users.find({
  $and: [
    { age: { $gte: 18 } },
    { age: { $lte: 65 } },
    { active: true }
  ]
}).toArray();

// Implicit $and (same as above)
await users.find({
  age: { $gte: 18, $lte: 65 },
  active: true
}).toArray();

// When to use explicit $and: same field multiple times
await users.find({
  $and: [
    { price: { $ne: 1.99 } },
    { price: { $exists: true } }
  ]
}).toArray();

// Complex nested conditions
await users.find({
  $and: [
    { 
      $or: [
        { status: 'active' },
        { status: 'pending' }
      ]
    },
    { verified: true },
    { age: { $gte: 18 } }
  ]
}).toArray();

// Multiple ranges
await users.find({
  $and: [
    { createdAt: { $gte: new Date('2024-01-01') } },
    { createdAt: { $lte: new Date('2024-12-31') } },
    { updatedAt: { $gte: new Date('2024-06-01') } }
  ]
}).toArray();

// ===== $or - AT LEAST ONE CONDITION MUST BE TRUE =====

// Basic $or
await users.find({
  $or: [
    { status: 'active' },
    { status: 'pending' }
  ]
}).toArray();

// Multiple fields
await users.find({
  $or: [
    { email: 'admin@example.com' },
    { role: 'admin' },
    { permissions: 'superuser' }
  ]
}).toArray();

// With ranges
await users.find({
  $or: [
    { age: { $lt: 18 } },
    { age: { $gt: 65 } }
  ]
}).toArray();

// Complex conditions
await users.find({
  $or: [
    { 
      $and: [
        { role: 'admin' },
        { active: true }
      ]
    },
    { userId: 'superadmin' }
  ]
}).toArray();

// ===== $nor - ALL CONDITIONS MUST BE FALSE =====

// None of the conditions should match
await users.find({
  $nor: [
    { status: 'deleted' },
    { status: 'banned' },
    { status: 'suspended' }
  ]
}).toArray();

// Exclude multiple criteria
await users.find({
  $nor: [
    { age: { $lt: 18 } },
    { verified: false },
    { banned: true }
  ]
}).toArray();

// With nested conditions
await users.find({
  $nor: [
    { 
      $and: [
        { role: 'guest' },
        { expired: true }
      ]
    },
    { status: 'inactive' }
  ]
}).toArray();

// ===== $not - NEGATE CONDITION =====

// Not greater than (less than or equal)
await users.find({
  age: { $not: { $gt: 18 } }
}).toArray();
// Same as: { age: { $lte: 18 } }

// Not in range
await users.find({
  price: { $not: { $gte: 10, $lte: 100 } }
}).toArray();

// Not matching regex
await users.find({
  email: { $not: /gmail\\.com$/ }
}).toArray();

// Not exists
await users.find({
  deletedAt: { $not: { $exists: true } }
}).toArray();
// Same as: { deletedAt: { $exists: false } }

// Not equal (alternative)
await users.find({
  status: { $not: { $eq: 'deleted' } }
}).toArray();
// Same as: { status: { $ne: 'deleted' } }

// ===== COMPLEX NESTED LOGICAL OPERATIONS =====

// Combination of $and, $or, $nor
await users.find({
  $and: [
    {
      $or: [
        { role: 'admin' },
        { role: 'moderator' }
      ]
    },
    {
      $nor: [
        { banned: true },
        { suspended: true }
      ]
    },
    { active: true }
  ]
}).toArray();

// Deep nesting
await users.find({
  $or: [
    {
      $and: [
        { age: { $gte: 18 } },
        { verified: true },
        {
          $or: [
            { plan: 'premium' },
            { plan: 'enterprise' }
          ]
        }
      ]
    },
    { role: 'admin' }
  ]
}).toArray();

// ===== PRACTICAL EXAMPLES =====

// Active users within age range
await users.find({
  active: true,
  age: { $gte: 18, $lte: 65 },
  status: { $in: ['verified', 'premium'] }
}).toArray();

// Search with exclusions
await users.find({
  $and: [
    {
      $or: [
        { name: /john/i },
        { email: /john/i }
      ]
    },
    {
      $nor: [
        { deleted: true },
        { banned: true }
      ]
    }
  ]
}).toArray();

// Date range with status
await users.find({
  $and: [
    { createdAt: { $gte: new Date('2024-01-01') } },
    { createdAt: { $lt: new Date('2025-01-01') } },
    {
      $or: [
        { status: 'active' },
        { status: 'trial' }
      ]
    },
    { verified: true }
  ]
}).toArray();

// Exclude test accounts
await users.find({
  $and: [
    { email: { $not: /test|demo|example/ } },
    { username: { $not: /^test_/ } },
    { role: { $ne: 'test' } }
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

              {/* Comparison Operators in Mongoose */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-purple-300">
                  1. Comparison Operators in Mongoose
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const mongoose = require('mongoose');

await mongoose.connect('mongodb://localhost:27017/myDatabase');

const Product = mongoose.model('Product', new mongoose.Schema({
  name: String,
  price: Number,
  stock: Number,
  category: String,
  tags: [String],
  active: Boolean,
  createdAt: Date
}));

// ===== $eq - EQUAL TO =====

// Implicit equality
await Product.find({ price: 99.99 });

// Explicit $eq
await Product.find({ price: { $eq: 99.99 } });

// With nested fields
await Product.find({ 'details.color': 'red' });

// ===== $ne - NOT EQUAL TO =====

await Product.find({ status: { $ne: 'deleted' } });
await Product.find({ stock: { $ne: 0 } });

// ===== $gt & $gte =====

await Product.find({ price: { $gt: 100 } });
await Product.find({ stock: { $gte: 10 } });

// ===== $lt & $lte =====

await Product.find({ price: { $lt: 50 } });
await Product.find({ discount: { $lte: 20 } });

// ===== RANGE QUERIES =====

await Product.find({ 
  price: { $gte: 50, $lte: 200 } 
});

await Product.find({
  createdAt: {
    $gte: new Date('2024-01-01'),
    $lt: new Date('2025-01-01')
  }
});

// ===== $in =====

await Product.find({ 
  category: { $in: ['electronics', 'computers', 'phones'] } 
});

await Product.find({ 
  status: { $in: ['active', 'pending'] } 
});

// ===== $nin =====

await Product.find({ 
  status: { $nin: ['deleted', 'banned'] } 
});

await Product.find({ 
  categoryId: { $nin: [13, 666] } 
});

// ===== QUERY HELPER METHODS =====

// Mongoose where() helper
await Product.find()
  .where('price').gte(50).lte(200)
  .where('stock').gt(0)
  .where('category').in(['electronics', 'computers']);

// Chaining
await Product.find()
  .where('price').gt(100)
  .where('active').equals(true)
  .where('tags').in(['featured', 'sale']);

await mongoose.disconnect();`}</code>
                </pre>
              </div>

              {/* Logical Operators in Mongoose */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-purple-300">
                  2. Logical Operators in Mongoose
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const mongoose = require('mongoose');

await mongoose.connect('mongodb://localhost:27017/myDatabase');

const User = mongoose.model('User', new mongoose.Schema({
  name: String,
  email: String,
  age: Number,
  role: String,
  active: Boolean,
  verified: Boolean
}));

// ===== $and =====

// Explicit $and
await User.find({
  $and: [
    { age: { $gte: 18 } },
    { age: { $lte: 65 } },
    { active: true }
  ]
});

// Implicit $and
await User.find({
  age: { $gte: 18, $lte: 65 },
  active: true
});

// ===== $or =====

await User.find({
  $or: [
    { role: 'admin' },
    { role: 'moderator' }
  ]
});

await User.find({
  $or: [
    { age: { $lt: 18 } },
    { age: { $gt: 65 } }
  ]
});

// ===== $nor =====

await User.find({
  $nor: [
    { status: 'deleted' },
    { status: 'banned' }
  ]
});

// ===== $not =====

await User.find({
  age: { $not: { $gt: 18 } }
});

await User.find({
  email: { $not: /test@/ }
});

// ===== COMPLEX QUERIES =====

await User.find({
  $and: [
    {
      $or: [
        { role: 'admin' },
        { role: 'moderator' }
      ]
    },
    { active: true },
    { verified: true }
  ]
});

// ===== QUERY BUILDER =====

await User.find()
  .or([
    { role: 'admin' },
    { role: 'moderator' }
  ])
  .where('active').equals(true);

await User.find()
  .and([
    { age: { $gte: 18 } },
    { verified: true }
  ]);

// ===== PRACTICAL PATTERNS =====

// Find active premium users
await User.find({
  active: true,
  $or: [
    { plan: 'premium' },
    { plan: 'enterprise' }
  ]
});

// Exclude deleted/banned users
await User.find({
  $nor: [
    { deleted: true },
    { banned: true },
    { suspended: true }
  ]
});

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
                  <strong>Use implicit $and when possible:</strong> Cleaner and
                  more readable
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Index fields used in comparisons:</strong>{" "}
                  Dramatically improves query performance
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Use $in for OR on same field:</strong> More efficient
                  than $or
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Avoid $ne when possible:</strong> Cannot use index
                  efficiently
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Put most selective conditions first:</strong> Better
                  query optimization
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Use range queries for dates:</strong> Efficient with
                  proper indexes
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Limit $or branches:</strong> Too many can slow down
                  queries
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Use $nor sparingly:</strong> Often slower than
                  alternatives
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Combine operators efficiently:</strong> Minimize
                  nesting depth
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Test complex queries:</strong> Use explain() to verify
                  performance
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
              href="/phase3/element-evaluation"
              className="bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-500 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              Next: Element & Evaluation →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
