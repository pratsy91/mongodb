"use client";

import Link from "next/link";
import { useState } from "react";

export default function ReadOperationsPage() {
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
          Read Operations
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Complete guide to querying documents with projections, cursors, and
          all query operators
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
                Read Operation Methods
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>find():</strong> Returns multiple documents as a
                  cursor
                </li>
                <li>
                  <strong>findOne():</strong> Returns single document or null
                </li>
                <li>
                  <strong>countDocuments():</strong> Count matching documents
                </li>
                <li>
                  <strong>estimatedDocumentCount():</strong> Fast count of all
                  documents
                </li>
                <li>
                  <strong>distinct():</strong> Get unique values for a field
                </li>
              </ul>

              <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                Projection
              </h3>
              <p className="text-lg">
                Projection determines which fields to include or exclude in
                returned documents. Reduces network bandwidth and improves
                performance.
              </p>

              <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                Cursors
              </h3>
              <p className="text-lg">
                Cursors are pointers to query result sets. They support
                iteration, batching, and various modifiers like sort, limit, and
                skip.
              </p>

              <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                Read Preferences
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>primary:</strong> Read from primary only (default)
                </li>
                <li>
                  <strong>primaryPreferred:</strong> Primary, then secondaries
                </li>
                <li>
                  <strong>secondary:</strong> Read from secondaries only
                </li>
                <li>
                  <strong>secondaryPreferred:</strong> Secondaries, then primary
                </li>
                <li>
                  <strong>nearest:</strong> Lowest network latency
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

              {/* find and findOne */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  1. find() and findOne() Basics
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient } = require('mongodb');

const client = new MongoClient('mongodb://localhost:27017');
await client.connect();
const db = client.db('myDatabase');
const users = db.collection('users');

// ===== FIND ALL DOCUMENTS =====

// Find all (returns cursor)
const cursor = users.find();
const allUsers = await cursor.toArray();
console.log('All users:', allUsers);

// Shorter version
const allUsersShort = await users.find().toArray();

// ===== FIND WITH FILTER =====

// Find by exact match
const activeUsers = await users.find({ active: true }).toArray();

// Find by multiple conditions (implicit AND)
const results = await users.find({
  active: true,
  age: 25
}).toArray();

// Find by nested field
const nyUsers = await users.find({
  'address.city': 'New York'
}).toArray();

// ===== FIND ONE =====

// Find single document
const user = await users.findOne({ email: 'alice@example.com' });
console.log('User:', user);  // Returns null if not found

// Find by _id
const { ObjectId } = require('mongodb');
const userById = await users.findOne({
  _id: new ObjectId('507f1f77bcf86cd799439011')
});

// Find with multiple conditions
const firstMatch = await users.findOne({
  active: true,
  age: { $gte: 18 }
});

// ===== COMPARISON OPERATORS =====

// $eq - Equal to
await users.find({ age: { $eq: 25 } }).toArray();

// $ne - Not equal to
await users.find({ status: { $ne: 'deleted' } }).toArray();

// $gt - Greater than
await users.find({ age: { $gt: 18 } }).toArray();

// $gte - Greater than or equal
await users.find({ age: { $gte: 21 } }).toArray();

// $lt - Less than
await users.find({ age: { $lt: 65 } }).toArray();

// $lte - Less than or equal
await users.find({ age: { $lte: 30 } }).toArray();

// $in - In array
await users.find({ 
  status: { $in: ['active', 'pending', 'verified'] } 
}).toArray();

// $nin - Not in array
await users.find({ 
  status: { $nin: ['deleted', 'banned'] } 
}).toArray();

// ===== LOGICAL OPERATORS =====

// $and - All conditions must be true
await users.find({
  $and: [
    { age: { $gte: 18 } },
    { age: { $lte: 65 } },
    { active: true }
  ]
}).toArray();

// Implicit AND (same as above)
await users.find({
  age: { $gte: 18, $lte: 65 },
  active: true
}).toArray();

// $or - At least one condition must be true
await users.find({
  $or: [
    { age: { $lt: 18 } },
    { age: { $gt: 65 } }
  ]
}).toArray();

// $nor - All conditions must be false
await users.find({
  $nor: [
    { status: 'deleted' },
    { banned: true }
  ]
}).toArray();

// $not - Negates the condition
await users.find({
  age: { $not: { $gte: 18 } }
}).toArray();

// ===== ELEMENT OPERATORS =====

// $exists - Field exists
await users.find({ middleName: { $exists: true } }).toArray();

// $exists false - Field doesn't exist
await users.find({ deletedAt: { $exists: false } }).toArray();

// $type - Field type
await users.find({ age: { $type: 'number' } }).toArray();
await users.find({ age: { $type: 16 } }).toArray();  // 16 = int

// Multiple types
await users.find({ 
  value: { $type: ['number', 'string'] } 
}).toArray();

// ===== ARRAY OPERATORS =====

// $all - Array contains all elements
await users.find({ 
  tags: { $all: ['premium', 'verified'] } 
}).toArray();

// $elemMatch - Array element matches all conditions
await users.find({
  scores: {
    $elemMatch: { $gte: 80, $lt: 90 }
  }
}).toArray();

// $size - Array size
await users.find({ tags: { $size: 3 } }).toArray();

// ===== STRING OPERATORS =====

// $regex - Regular expression
await users.find({ 
  name: { $regex: /^John/, $options: 'i' } 
}).toArray();

// String pattern
await users.find({ 
  email: { $regex: '.*@gmail\\\\.com$' } 
}).toArray();

// ===== EVALUATION OPERATORS =====

// $expr - Use aggregation expressions
await users.find({
  $expr: { 
    $gt: ['$balance', '$creditLimit'] 
  }
}).toArray();

// $jsonSchema - Validate against JSON schema
await users.find({
  $jsonSchema: {
    required: ['name', 'email'],
    properties: {
      age: { minimum: 18 }
    }
  }
}).toArray();

// $mod - Modulo operation
await users.find({ 
  age: { $mod: [5, 0] }  // age % 5 == 0
}).toArray();

// $text - Text search
await users.find({ 
  $text: { $search: 'coffee' } 
}).toArray();

// $where - JavaScript expression (slow, avoid if possible)
await users.find({
  $where: 'this.age > 18 && this.active === true'
}).toArray();

await client.close();`}</code>
                </pre>
              </div>

              {/* Projection */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  2. Projection - All Operators
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient } = require('mongodb');

const client = new MongoClient('mongodb://localhost:27017');
await client.connect();
const db = client.db('myDatabase');
const users = db.collection('users');

// ===== BASIC PROJECTION =====

// Include specific fields
await users.find({}, {
  projection: { name: 1, email: 1 }
}).toArray();
// Returns: { _id, name, email }

// Exclude _id
await users.find({}, {
  projection: { name: 1, email: 1, _id: 0 }
}).toArray();
// Returns: { name, email }

// Exclude specific fields
await users.find({}, {
  projection: { password: 0, ssn: 0 }
}).toArray();
// Returns: all fields except password and ssn

// ===== NESTED FIELD PROJECTION =====

// Include nested field
await users.find({}, {
  projection: { 
    name: 1, 
    'address.city': 1, 
    'address.state': 1 
  }
}).toArray();

// Exclude nested field
await users.find({}, {
  projection: { 
    'profile.privateData': 0 
  }
}).toArray();

// ===== $ (POSITIONAL) OPERATOR =====

// Return first matching array element
await users.find(
  { 'scores.score': { $gt: 85 } },
  { projection: { 'scores.$': 1 } }
).toArray();
// Returns only the first matching score

// ===== $ELEM_MATCH PROJECTION =====

// Project first array element matching condition
await users.find({}, {
  projection: {
    name: 1,
    scores: {
      $elemMatch: { score: { $gt: 80 } }
    }
  }
}).toArray();
// Returns first score > 80 for each user

// Multiple conditions
await users.find({}, {
  projection: {
    orders: {
      $elemMatch: {
        status: 'completed',
        total: { $gte: 100 }
      }
    }
  }
}).toArray();

// ===== $SLICE PROJECTION =====

// Return first N array elements
await users.find({}, {
  projection: {
    name: 1,
    tags: { $slice: 3 }  // First 3 tags
  }
}).toArray();

// Return last N array elements
await users.find({}, {
  projection: {
    tags: { $slice: -3 }  // Last 3 tags
  }
}).toArray();

// Skip and limit
await users.find({}, {
  projection: {
    scores: { $slice: [2, 5] }  // Skip 2, return 5
  }
}).toArray();

// ===== $META PROJECTION =====

// Text search score
await users.find(
  { $text: { $search: 'coffee' } },
  {
    projection: {
      name: 1,
      score: { $meta: 'textScore' }
    }
  }
).toArray();

// Sort by text score
await users.find(
  { $text: { $search: 'coffee' } },
  {
    projection: { score: { $meta: 'textScore' } }
  }
).sort({ score: { $meta: 'textScore' } }).toArray();

// ===== COMBINED PROJECTIONS =====

await users.find({}, {
  projection: {
    name: 1,
    email: 1,
    'address.city': 1,
    tags: { $slice: 5 },
    recentOrders: {
      $elemMatch: { 
        status: 'completed' 
      }
    },
    _id: 0
  }
}).toArray();

// ===== PROJECTION WITH COMPUTED FIELDS (aggregation) =====

// For complex projections, use aggregation
await users.aggregate([
  {
    $project: {
      name: 1,
      email: 1,
      fullName: { $concat: ['$firstName', ' ', '$lastName'] },
      ageInMonths: { $multiply: ['$age', 12] },
      isAdult: { $gte: ['$age', 18] },
      tagCount: { $size: { $ifNull: ['$tags', []] } }
    }
  }
]).toArray();

await client.close();`}</code>
                </pre>
              </div>

              {/* Cursors and Options */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  3. Cursors, Sorting, Limiting, and Batching
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient } = require('mongodb');

const client = new MongoClient('mongodb://localhost:27017');
await client.connect();
const db = client.db('myDatabase');
const products = db.collection('products');

// ===== CURSOR BASICS =====

// Get cursor
const cursor = products.find({});

// Iterate with for await
for await (const doc of cursor) {
  console.log(doc);
}

// Convert to array
const allDocs = await products.find({}).toArray();

// ===== SORTING =====

// Sort ascending
await products.find({}).sort({ price: 1 }).toArray();

// Sort descending
await products.find({}).sort({ price: -1 }).toArray();

// Multi-field sort
await products.find({})
  .sort({ category: 1, price: -1 })
  .toArray();

// Sort by nested field
await products.find({})
  .sort({ 'metadata.createdAt': -1 })
  .toArray();

// Sort by text score
await products.find(
  { $text: { $search: 'laptop' } }
)
  .sort({ score: { $meta: 'textScore' } })
  .toArray();

// Natural order (insertion order)
await products.find({}).sort({ $natural: 1 }).toArray();

// Reverse natural order
await products.find({}).sort({ $natural: -1 }).toArray();

// ===== LIMITING =====

// Limit results
await products.find({}).limit(10).toArray();

// Sort and limit (top 10 most expensive)
await products.find({})
  .sort({ price: -1 })
  .limit(10)
  .toArray();

// ===== SKIP =====

// Skip first N documents
await products.find({}).skip(20).toArray();

// Pagination
const page = 2;
const pageSize = 10;
await products.find({})
  .skip((page - 1) * pageSize)
  .limit(pageSize)
  .toArray();

// ===== COMBINED CURSOR METHODS =====

// Sort, skip, and limit
await products.find({ category: 'electronics' })
  .sort({ price: -1 })
  .skip(10)
  .limit(5)
  .toArray();

// ===== CURSOR OPTIONS =====

const cursor2 = products.find({}, {
  // Projection
  projection: { name: 1, price: 1 },
  
  // Sort
  sort: { price: -1 },
  
  // Limit
  limit: 100,
  
  // Skip
  skip: 0,
  
  // Batch size
  batchSize: 50,
  
  // Read preference
  readPreference: 'secondary',
  
  // Max time (ms)
  maxTimeMS: 5000,
  
  // Return key only (no document data)
  returnKey: false,
  
  // Show record ID
  showRecordId: false,
  
  // Disable cursor timeout
  noCursorTimeout: false,
  
  // Allow partial results from mongos
  allowPartialResults: false,
  
  // Collation
  collation: {
    locale: 'en',
    strength: 2
  },
  
  // Comment
  comment: 'Query from API endpoint',
  
  // Hint (force index)
  hint: { price: 1 },
  
  // Max documents to scan
  max: { price: 1000 },
  min: { price: 0 }
});

await cursor2.toArray();

// ===== BATCH SIZE =====

// Set batch size
const batchCursor = products.find({}).batchSize(100);
for await (const doc of batchCursor) {
  // Process in batches of 100
}

// ===== CURSOR ITERATION METHODS =====

const cursor3 = products.find({});

// next() - Get next document
const doc1 = await cursor3.next();
const doc2 = await cursor3.next();

// hasNext() - Check if more documents
while (await cursor3.hasNext()) {
  const doc = await cursor3.next();
  console.log(doc);
}

// forEach() - Iterate
await products.find({}).forEach(doc => {
  console.log(doc.name);
});

// map() (not available, use with streams)

// ===== CURSOR STREAM =====

const stream = products.find({}).stream();

stream.on('data', (doc) => {
  console.log('Document:', doc);
});

stream.on('error', (err) => {
  console.error('Stream error:', err);
});

stream.on('end', () => {
  console.log('Stream ended');
});

// ===== CURSOR COUNT =====

// Count matching documents
const count = await products.countDocuments({ category: 'electronics' });

// Estimated count (fast, uses metadata)
const estimatedCount = await products.estimatedDocumentCount();

// Count with limit
const limitedCount = await products.countDocuments(
  { category: 'electronics' },
  { limit: 100 }
);

// ===== CURSOR EXPLAIN =====

// Explain query execution
const explanation = await products.find({ price: { $gt: 100 } }).explain();
console.log('Execution stats:', explanation.executionStats);

// Explain with different verbosity
await products.find({}).explain('queryPlanner');
await products.find({}).explain('executionStats');
await products.find({}).explain('allPlansExecution');

// ===== CURSOR REWIND =====

const rewindCursor = products.find({}).limit(5);
const firstBatch = await rewindCursor.toArray();

// Rewind to start
await rewindCursor.rewind();
const secondBatch = await rewindCursor.toArray();  // Same results

// ===== CURSOR CLONE =====

const originalCursor = products.find({}).limit(10);
const clonedCursor = originalCursor.clone();

// Both cursors are independent
const results1 = await originalCursor.toArray();
const results2 = await clonedCursor.toArray();

// ===== DISTINCT =====

// Get unique values
const categories = await products.distinct('category');
console.log('Categories:', categories);

// Distinct with filter
const activeCategories = await products.distinct('category', {
  active: true
});

// Distinct on nested field
const cities = await products.distinct('supplier.address.city');

// ===== MAX TIME MS =====

try {
  await products.find({})
    .maxTimeMS(1000)  // Timeout after 1 second
    .toArray();
} catch (error) {
  console.log('Query timeout');
}

// ===== COLLATION =====

// Case-insensitive sort
await products.find({})
  .collation({ locale: 'en', strength: 2 })
  .sort({ name: 1 })
  .toArray();

// Numeric string ordering
await products.find({})
  .collation({ locale: 'en', numericOrdering: true })
  .sort({ code: 1 })
  .toArray();

await client.close();`}</code>
                </pre>
              </div>

              {/* Advanced Read Options */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  4. Read Preferences and Read Concerns
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient, ReadPreference } = require('mongodb');

const client = new MongoClient('mongodb://localhost:27017');
await client.connect();
const db = client.db('myDatabase');
const orders = db.collection('orders');

// ===== READ PREFERENCES =====

// Primary (default)
await orders.find({})
  .withReadPreference(ReadPreference.PRIMARY)
  .toArray();

// Primary preferred
await orders.find({})
  .withReadPreference(ReadPreference.PRIMARY_PREFERRED)
  .toArray();

// Secondary
await orders.find({})
  .withReadPreference(ReadPreference.SECONDARY)
  .toArray();

// Secondary preferred
await orders.find({})
  .withReadPreference(ReadPreference.SECONDARY_PREFERRED)
  .toArray();

// Nearest (lowest latency)
await orders.find({})
  .withReadPreference(ReadPreference.NEAREST)
  .toArray();

// ===== READ PREFERENCE WITH OPTIONS =====

// Read from secondary with max staleness
await orders.find({}).withReadPreference(
  new ReadPreference('secondary', null, {
    maxStalenessSeconds: 90
  })
).toArray();

// Read from nodes with specific tags
await orders.find({}).withReadPreference(
  new ReadPreference('secondary', [
    { datacenter: 'east' },
    { datacenter: 'west' }
  ])
).toArray();

// ===== READ CONCERNS =====

// Local (default) - return most recent data
await orders.find({}, {
  readConcern: { level: 'local' }
}).toArray();

// Available - no guarantee of data from majority
await orders.find({}, {
  readConcern: { level: 'available' }
}).toArray();

// Majority - data acknowledged by majority
await orders.find({}, {
  readConcern: { level: 'majority' }
}).toArray();

// Linearizable - read own writes guarantee
await orders.find({}, {
  readConcern: { level: 'linearizable' }
}).toArray();

// Snapshot - multi-document read consistency
const session = client.startSession();
await session.withTransaction(async () => {
  await orders.find({}, {
    session,
    readConcern: { level: 'snapshot' }
  }).toArray();
});
await session.endSession();

// ===== COLLECTION-LEVEL READ PREFERENCE =====

const ordersWithRP = db.collection('orders', {
  readPreference: 'secondary'
});

await ordersWithRP.find({}).toArray();  // Uses secondary

// ===== DATABASE-LEVEL READ PREFERENCE =====

const dbWithRP = client.db('myDatabase', {
  readPreference: 'secondaryPreferred'
});

await dbWithRP.collection('orders').find({}).toArray();

// ===== ALLOW DISK USE =====

// Allow using disk for large sorts
await orders.find({})
  .sort({ createdAt: -1 })
  .allowDiskUse(true)
  .toArray();

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

              {/* find and findOne in Mongoose */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-purple-300">
                  1. find() and findOne() in Mongoose
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const mongoose = require('mongoose');

await mongoose.connect('mongodb://localhost:27017/myDatabase');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number,
  active: Boolean,
  tags: [String],
  address: {
    city: String,
    state: String
  }
});

const User = mongoose.model('User', userSchema);

// ===== FIND ALL =====

const users = await User.find();
console.log('All users:', users);

// ===== FIND WITH FILTER =====

// Find active users
const activeUsers = await User.find({ active: true });

// Find by multiple conditions
const results = await User.find({
  active: true,
  age: { $gte: 18 }
});

// Find by nested field
const nyUsers = await User.find({
  'address.city': 'New York'
});

// ===== FIND ONE =====

const user = await User.findOne({ email: 'alice@example.com' });
console.log('User:', user);  // null if not found

// ===== FIND BY ID =====

const userById = await User.findById('507f1f77bcf86cd799439011');

// findById with error handling
try {
  const user = await User.findById('invalid_id');
} catch (error) {
  console.log('Invalid ID format');
}

// ===== QUERY OPERATORS =====

// Comparison
await User.find({ age: { $gte: 18, $lte: 65 } });
await User.find({ status: { $in: ['active', 'pending'] } });
await User.find({ status: { $nin: ['deleted', 'banned'] } });

// Logical
await User.find({
  $or: [
    { age: { $lt: 18 } },
    { verified: false }
  ]
});

await User.find({
  $and: [
    { active: true },
    { verified: true }
  ]
});

// Element
await User.find({ middleName: { $exists: true } });
await User.find({ age: { $type: 'number' } });

// Array
await User.find({ tags: { $all: ['premium', 'verified'] } });
await User.find({ tags: { $size: 3 } });

// String
await User.find({ name: { $regex: /^John/i } });
await User.find({ email: /gmail\\.com$/ });

// ===== WHERE (HELPER) =====

// Mongoose where() helper
await User.find()
  .where('age').gte(18).lte(65)
  .where('active').equals(true)
  .where('tags').in(['premium', 'verified']);

// ===== QUERY CHAINING =====

const query = User.find()
  .where('age').gte(18)
  .where('active').equals(true)
  .select('name email')
  .limit(10);

const chainedResults = await query.exec();

await mongoose.disconnect();`}</code>
                </pre>
              </div>

              {/* Projection in Mongoose */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-purple-300">
                  2. Projection in Mongoose
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const mongoose = require('mongoose');

await mongoose.connect('mongodb://localhost:27017/myDatabase');

const User = mongoose.model('User', new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  age: Number,
  tags: [String]
}));

// ===== SELECT SPECIFIC FIELDS =====

// Include fields
await User.find().select('name email');
await User.find().select({ name: 1, email: 1 });

// Exclude _id
await User.find().select('name email -_id');
await User.find().select({ name: 1, email: 1, _id: 0 });

// Exclude fields
await User.find().select('-password -ssn');
await User.find().select({ password: 0, ssn: 0 });

// ===== PROJECTION IN QUERY =====

// Second parameter projection
await User.find({}, 'name email');
await User.find({}, { name: 1, email: 1 });
await User.findOne({}, 'name email');

// ===== NESTED FIELD PROJECTION =====

await User.find().select('name address.city address.state');
await User.find().select({ 
  name: 1, 
  'address.city': 1 
});

// ===== ARRAY PROJECTION =====

// $slice
await User.find().select({ 
  name: 1, 
  tags: { $slice: 3 } 
});

// $elemMatch
await User.find().select({
  name: 1,
  scores: { $elemMatch: { $gte: 80 } }
});

// ===== LEAN =====

// Return plain JavaScript objects (faster)
const leanUsers = await User.find().lean();
console.log('Plain objects:', leanUsers);

// Lean with select
const leanSelected = await User.find()
  .select('name email')
  .lean();

// ===== POPULATE (JOINS) =====

const postSchema = new mongoose.Schema({
  title: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const Post = mongoose.model('Post', postSchema);

// Populate referenced documents
await Post.find().populate('author');

// Populate with select
await Post.find().populate('author', 'name email');

// Populate nested
await Post.find().populate({
  path: 'author',
  select: 'name email',
  match: { active: true }
});

await mongoose.disconnect();`}</code>
                </pre>
              </div>

              {/* Cursors and Options in Mongoose */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-purple-300">
                  3. Sorting, Limiting, and Cursors
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const mongoose = require('mongoose');

await mongoose.connect('mongodb://localhost:27017/myDatabase');

const Product = mongoose.model('Product', new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  stock: Number
}));

// ===== SORTING =====

// Sort ascending
await Product.find().sort('price');
await Product.find().sort({ price: 1 });

// Sort descending
await Product.find().sort('-price');
await Product.find().sort({ price: -1 });

// Multi-field sort
await Product.find().sort('category -price');
await Product.find().sort({ category: 1, price: -1 });

// ===== LIMITING =====

await Product.find().limit(10);

// Sort and limit
await Product.find()
  .sort({ price: -1 })
  .limit(10);

// ===== SKIP =====

await Product.find().skip(20);

// Pagination
const page = 2;
const pageSize = 10;
await Product.find()
  .skip((page - 1) * pageSize)
  .limit(pageSize);

// ===== COMBINED =====

await Product.find({ category: 'electronics' })
  .select('name price')
  .sort({ price: -1 })
  .skip(10)
  .limit(5);

// ===== CURSOR =====

// Get cursor
const cursor = Product.find().cursor();

// Iterate
for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
  console.log(doc);
}

// For await
for await (const doc of Product.find().cursor()) {
  console.log(doc);
}

// ===== BATCH SIZE =====

await Product.find()
  .batchSize(100)
  .cursor()
  .eachAsync(async (doc) => {
    // Process each document
  });

// ===== COUNT =====

const count = await Product.countDocuments({ category: 'electronics' });
const estimatedCount = await Product.estimatedDocumentCount();

// Count with deprecated method
const oldCount = await Product.find({ active: true }).count();

// ===== DISTINCT =====

const categories = await Product.distinct('category');
const activeCategories = await Product.distinct('category', { active: true });

// ===== QUERY OPTIONS =====

await Product.find({}, null, {
  sort: { price: -1 },
  limit: 10,
  skip: 0,
  maxTimeMS: 5000,
  lean: true
});

// ===== WHERE HELPER =====

await Product.find()
  .where('price').gte(100).lte(1000)
  .where('category').equals('electronics')
  .where('tags').in(['featured', 'sale'])
  .sort('-price')
  .limit(20);

// ===== COLLATION =====

await Product.find()
  .collation({ locale: 'en', strength: 2 })
  .sort({ name: 1 });

// ===== READ PREFERENCES =====

await Product.find()
  .read('secondary');

await Product.find()
  .read('secondaryPreferred');

// ===== EXPLAIN =====

const explanation = await Product.find({ price: { $gt: 100 } }).explain();
console.log('Execution stats:', explanation);

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
                  <strong>Use projection to reduce bandwidth:</strong> Only
                  fetch fields you need
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Create indexes for frequent queries:</strong> Improve
                  query performance dramatically
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Use limit() for large result sets:</strong> Prevent
                  memory issues
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Avoid skip() for pagination:</strong> Use range
                  queries on indexed fields instead
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Use cursors for large datasets:</strong> Process
                  documents in batches
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Set maxTimeMS for long queries:</strong> Prevent
                  queries from running indefinitely
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Use lean() in Mongoose:</strong> Faster queries when
                  you don't need Mongoose methods
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Choose appropriate read preference:</strong> Balance
                  latency vs consistency
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Use read concern for consistency:</strong> Critical
                  for financial or sensitive data
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Explain queries to optimize:</strong> Understand query
                  execution and index usage
                </span>
              </li>
            </ul>
          </section>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8">
            <Link
              href="/phase2/insert"
              className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              ← Previous: Insert Operations
            </Link>
            <Link
              href="/phase2/update"
              className="bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-500 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              Next: Update Operations →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
