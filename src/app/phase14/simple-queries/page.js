"use client";

import Link from "next/link";
import { useState } from "react";

export default function SimpleQueriesPage() {
  const [activeTab, setActiveTab] = useState("mongodb");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <Link
          href="/"
          className="text-teal-400 hover:text-teal-300 mb-6 inline-block"
        >
          ← Back to Home
        </Link>

        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
          Simple to Intermediate Queries
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Complete collection of basic to intermediate MongoDB queries with both
          native driver and Mongoose examples
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
          {/* MongoDB Native Driver Examples */}
          {activeTab === "mongodb" && (
            <div className="space-y-8">
              {/* Basic Find Queries */}
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-blue-300">
                  1. Basic Find Queries
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-cyan-300">
                      Find All Documents
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm">{`const users = await db.collection('users').find().toArray();`}</code>
                    </pre>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-cyan-300">
                      Find with Simple Filter
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm">{`// Find active users
const activeUsers = await db.collection('users')
  .find({ status: 'active' })
  .toArray();

// Find by multiple conditions
const users = await db.collection('users')
  .find({ 
    status: 'active',
    age: { $gte: 18 }
  })
  .toArray();`}</code>
                    </pre>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-cyan-300">
                      Find One Document
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm">{`// Find single user
const user = await db.collection('users')
  .findOne({ email: 'user@example.com' });

// Find by ObjectId
const { ObjectId } = require('mongodb');
const user = await db.collection('users')
  .findOne({ _id: new ObjectId('507f1f77bcf86cd799439011') });`}</code>
                    </pre>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-cyan-300">
                      Find with Projection
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm">{`// Include specific fields
const users = await db.collection('users')
  .find({ status: 'active' })
  .project({ name: 1, email: 1, _id: 0 })
  .toArray();

// Exclude specific fields
const users = await db.collection('users')
  .find({ status: 'active' })
  .project({ password: 0, tokens: 0 })
  .toArray();`}</code>
                    </pre>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-cyan-300">
                      Find with Sorting
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm">{`// Sort ascending
const users = await db.collection('users')
  .find({ status: 'active' })
  .sort({ createdAt: 1 })
  .toArray();

// Sort descending
const users = await db.collection('users')
  .find({ status: 'active' })
  .sort({ createdAt: -1 })
  .toArray();

// Sort by multiple fields
const users = await db.collection('users')
  .find({ status: 'active' })
  .sort({ age: -1, name: 1 })
  .toArray();`}</code>
                    </pre>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-cyan-300">
                      Find with Limit and Skip
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm">{`// Limit results
const users = await db.collection('users')
  .find({ status: 'active' })
  .limit(10)
  .toArray();

// Pagination
const page = 2;
const limit = 10;
const skip = (page - 1) * limit;

const users = await db.collection('users')
  .find({ status: 'active' })
  .skip(skip)
  .limit(limit)
  .sort({ createdAt: -1 })
  .toArray();`}</code>
                    </pre>
                  </div>
                </div>
              </section>

              {/* Comparison Operators */}
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-blue-300">
                  2. Comparison Operators
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-cyan-300">
                      Greater Than / Less Than
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm">{`// Age greater than 18
const adults = await db.collection('users')
  .find({ age: { $gt: 18 } })
  .toArray();

// Age between 18 and 65
const workers = await db.collection('users')
  .find({ 
    age: { $gte: 18, $lte: 65 }
  })
  .toArray();

// Price less than 100
const cheapProducts = await db.collection('products')
  .find({ price: { $lt: 100 } })
  .toArray();`}</code>
                    </pre>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-cyan-300">
                      In / Not In
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm">{`// Find users with specific statuses
const users = await db.collection('users')
  .find({ 
    status: { $in: ['active', 'pending', 'verified'] }
  })
  .toArray();

// Exclude specific statuses
const users = await db.collection('users')
  .find({ 
    status: { $nin: ['deleted', 'banned'] }
  })
  .toArray();`}</code>
                    </pre>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-cyan-300">
                      Not Equal
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm">{`// Exclude deleted users
const activeUsers = await db.collection('users')
  .find({ status: { $ne: 'deleted' } })
  .toArray();`}</code>
                    </pre>
                  </div>
                </div>
              </section>

              {/* Logical Operators */}
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-blue-300">
                  3. Logical Operators
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-cyan-300">
                      AND / OR
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm">{`// AND (implicit)
const users = await db.collection('users')
  .find({ 
    status: 'active',
    age: { $gte: 18 }
  })
  .toArray();

// AND (explicit)
const users = await db.collection('users')
  .find({
    $and: [
      { status: 'active' },
      { age: { $gte: 18 } }
    ]
  })
  .toArray();

// OR
const users = await db.collection('users')
  .find({
    $or: [
      { status: 'active' },
      { status: 'pending' }
    ]
  })
  .toArray();

// Complex AND/OR
const users = await db.collection('users')
  .find({
    $and: [
      { age: { $gte: 18 } },
      {
        $or: [
          { status: 'active' },
          { status: 'premium' }
        ]
      }
    ]
  })
  .toArray();`}</code>
                    </pre>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-cyan-300">
                      NOT / NOR
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm">{`// NOT
const users = await db.collection('users')
  .find({
    $not: { status: 'deleted' }
  })
  .toArray();

// NOR (neither condition true)
const users = await db.collection('users')
  .find({
    $nor: [
      { status: 'deleted' },
      { age: { $lt: 18 } }
    ]
  })
  .toArray();`}</code>
                    </pre>
                  </div>
                </div>
              </section>

              {/* Array Queries */}
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-blue-300">
                  4. Array Queries
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-cyan-300">
                      Array Contains
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm">{`// Array contains value
const users = await db.collection('users')
  .find({ tags: 'premium' })
  .toArray();

// Array contains all values
const users = await db.collection('users')
  .find({ tags: { $all: ['premium', 'verified'] } })
  .toArray();

// Array size
const users = await db.collection('users')
  .find({ tags: { $size: 3 } })
  .toArray();`}</code>
                    </pre>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-cyan-300">
                      Element Match
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm">{`// Array element matches multiple conditions
const orders = await db.collection('orders')
  .find({
    items: {
      $elemMatch: {
        quantity: { $gt: 5 },
        price: { $lt: 100 }
      }
    }
  })
  .toArray();`}</code>
                    </pre>
                  </div>
                </div>
              </section>

              {/* Nested Document Queries */}
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-blue-300">
                  5. Nested Document Queries
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-cyan-300">
                      Dot Notation
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm">{`// Query nested field
const users = await db.collection('users')
  .find({ 'address.city': 'New York' })
  .toArray();

// Query nested array in nested document
const users = await db.collection('users')
  .find({ 'address.phones.type': 'mobile' })
  .toArray();

// Multiple nested conditions
const users = await db.collection('users')
  .find({
    'address.city': 'New York',
    'address.zipCode': { $gte: 10000 }
  })
  .toArray();`}</code>
                    </pre>
                  </div>
                </div>
              </section>

              {/* Text Search */}
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-blue-300">
                  6. Text Search & Regex
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-cyan-300">
                      Regex Queries
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm">{`// Case-insensitive search
const users = await db.collection('users')
  .find({ name: { $regex: /john/i } })
  .toArray();

// Starts with
const users = await db.collection('users')
  .find({ email: { $regex: /^admin/ } })
  .toArray();

// Ends with
const users = await db.collection('users')
  .find({ email: { $regex: /@gmail\\.com$/ } })
  .toArray();

// Contains
const users = await db.collection('users')
  .find({ name: { $regex: 'smith', $options: 'i' } })
  .toArray();`}</code>
                    </pre>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-cyan-300">
                      Text Index Search
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm">{`// Full-text search (requires text index)
const products = await db.collection('products')
  .find({ $text: { $search: 'laptop computer' } })
  .toArray();

// With score
const products = await db.collection('products')
  .find(
    { $text: { $search: 'laptop' } },
    { score: { $meta: 'textScore' } }
  )
  .sort({ score: { $meta: 'textScore' } })
  .toArray();`}</code>
                    </pre>
                  </div>
                </div>
              </section>

              {/* Count and Distinct */}
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-blue-300">
                  7. Count and Distinct
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-cyan-300">
                      Count Documents
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm">{`// Count matching documents
const count = await db.collection('users')
  .countDocuments({ status: 'active' });

// Estimated count (faster, less accurate)
const totalCount = await db.collection('users')
  .estimatedDocumentCount();`}</code>
                    </pre>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-cyan-300">
                      Distinct Values
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm">{`// Get unique values
const statuses = await db.collection('users')
  .distinct('status');

// Distinct with filter
const cities = await db.collection('users')
  .distinct('address.city', { status: 'active' });`}</code>
                    </pre>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* Mongoose Examples */}
          {activeTab === "mongoose" && (
            <div className="space-y-8">
              {/* Basic Find Queries */}
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  1. Basic Find Queries
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-pink-300">
                      Find All Documents
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm">{`const users = await User.find();`}</code>
                    </pre>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-pink-300">
                      Find with Filter
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm">{`// Simple filter
const activeUsers = await User.find({ status: 'active' });

// Multiple conditions
const users = await User.find({ 
  status: 'active',
  age: { $gte: 18 }
});`}</code>
                    </pre>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-pink-300">
                      Find One
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm">{`// Find single document
const user = await User.findOne({ email: 'user@example.com' });

// Find by ID
const user = await User.findById('507f1f77bcf86cd799439011');`}</code>
                    </pre>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-pink-300">
                      Select Fields (Projection)
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm">{`// Select specific fields
const users = await User.find({ status: 'active' })
  .select('name email');

// Exclude fields
const users = await User.find({ status: 'active' })
  .select('-password -tokens');

// Select and exclude
const users = await User.find({ status: 'active' })
  .select('name email -_id');`}</code>
                    </pre>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-pink-300">
                      Sort, Limit, Skip
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm">{`// Sort
const users = await User.find({ status: 'active' })
  .sort({ createdAt: -1 });

// Pagination
const page = 2;
const limit = 10;
const skip = (page - 1) * limit;

const users = await User.find({ status: 'active' })
  .skip(skip)
  .limit(limit)
  .sort({ createdAt: -1 });`}</code>
                    </pre>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-pink-300">
                      Lean Queries (Faster)
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm">{`// Returns plain JavaScript objects (faster)
const users = await User.find({ status: 'active' })
  .lean();

// With options
const users = await User.find({ status: 'active' })
  .lean({ virtuals: true });`}</code>
                    </pre>
                  </div>
                </div>
              </section>

              {/* Query Builder */}
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  2. Query Builder Pattern
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-pink-300">
                      Chaining Query Methods
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm">{`// Build query step by step
const query = User.find({ status: 'active' })
  .where('age').gte(18)
  .where('email').regex(/@gmail\\.com$/)
  .select('name email age')
  .sort({ age: -1 })
  .limit(10);

const users = await query.exec();`}</code>
                    </pre>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-pink-300">
                      Conditional Queries
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm">{`// Build query conditionally
let query = User.find();

if (req.query.status) {
  query = query.where('status').equals(req.query.status);
}

if (req.query.minAge) {
  query = query.where('age').gte(parseInt(req.query.minAge));
}

if (req.query.search) {
  query = query.where('name').regex(new RegExp(req.query.search, 'i'));
}

const users = await query.exec();`}</code>
                    </pre>
                  </div>
                </div>
              </section>

              {/* Comparison Operators */}
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  3. Comparison Operators
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-pink-300">
                      Using Query Methods
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm">{`// Greater than
const adults = await User.find()
  .where('age').gt(18);

// Greater than or equal
const adults = await User.find()
  .where('age').gte(18);

// Less than
const kids = await User.find()
  .where('age').lt(18);

// Between
const workers = await User.find()
  .where('age').gte(18).lte(65);

// In
const users = await User.find()
  .where('status').in(['active', 'pending']);

// Not in
const users = await User.find()
  .where('status').nin(['deleted', 'banned']);`}</code>
                    </pre>
                  </div>
                </div>
              </section>

              {/* Array Queries */}
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  4. Array Queries
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-pink-300">
                      Array Operations
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm">{`// Array contains
const users = await User.find({ tags: 'premium' });

// Array contains all
const users = await User.find({ 
  tags: { $all: ['premium', 'verified'] }
});

// Array size
const users = await User.find({ tags: { $size: 3 } });

// Element match
const orders = await Order.find({
  items: {
    $elemMatch: {
      quantity: { $gt: 5 },
      price: { $lt: 100 }
    }
  }
});`}</code>
                    </pre>
                  </div>
                </div>
              </section>

              {/* Count and Distinct */}
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  5. Count and Distinct
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-pink-300">
                      Count Methods
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm">{`// Count documents
const count = await User.countDocuments({ status: 'active' });

// Estimated count
const total = await User.estimatedDocumentCount();`}</code>
                    </pre>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-pink-300">
                      Distinct Values
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm">{`// Get unique values
const statuses = await User.distinct('status');

// With filter
const cities = await User.distinct('address.city', { 
  status: 'active' 
});`}</code>
                    </pre>
                  </div>
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
