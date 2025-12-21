"use client";

import Link from "next/link";
import { useState } from "react";

export default function InsertOperationsPage() {
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
          Insert Operations
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Complete guide to inserting documents with all options and write
          concerns
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
                What are Insert Operations?
              </h3>
              <p className="text-lg">
                Insert operations add new documents to a collection. MongoDB
                provides methods to insert single or multiple documents with
                various options for controlling the operation behavior.
              </p>

              <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                Insert Methods
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>insertOne():</strong> Inserts a single document
                </li>
                <li>
                  <strong>insertMany():</strong> Inserts multiple documents
                </li>
              </ul>

              <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                Ordered vs Unordered Inserts
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Ordered (default):</strong> Documents inserted in
                  sequence; stops on first error
                </li>
                <li>
                  <strong>Unordered:</strong> Documents inserted in parallel;
                  continues after errors
                </li>
              </ul>

              <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                Write Concerns
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>w:</strong> Number of nodes that must acknowledge
                  write
                </li>
                <li>
                  <strong>j:</strong> Whether to wait for journal sync
                </li>
                <li>
                  <strong>wtimeout:</strong> Time limit for write concern
                </li>
              </ul>

              <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                _id Field
              </h3>
              <p className="text-lg">
                If not provided, MongoDB automatically generates an ObjectId for
                the _id field. You can provide your own _id value of any type
                (must be unique).
              </p>
            </div>
          </section>

          {/* MongoDB Native Driver Examples */}
          {activeTab === "mongodb" && (
            <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
              <h2 className="text-3xl font-bold mb-6 text-blue-300">
                MongoDB Native Driver Examples
              </h2>

              {/* insertOne */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  1. insertOne() - Insert Single Document
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient, ObjectId } = require('mongodb');

const client = new MongoClient('mongodb://localhost:27017');
await client.connect();
const db = client.db('myDatabase');
const users = db.collection('users');

// ===== BASIC INSERT =====

// Simple insert
const result = await users.insertOne({
  name: 'Alice Johnson',
  email: 'alice@example.com',
  age: 28,
  active: true
});

console.log('Inserted document:', {
  acknowledged: result.acknowledged,
  insertedId: result.insertedId
});

// ===== INSERT WITH CUSTOM _id =====

// Provide custom _id
await users.insertOne({
  _id: 'user123',
  name: 'Bob Smith',
  email: 'bob@example.com'
});

// Insert with ObjectId
await users.insertOne({
  _id: new ObjectId(),
  name: 'Carol White',
  email: 'carol@example.com'
});

// Insert with numeric _id
await users.insertOne({
  _id: 12345,
  name: 'David Brown',
  email: 'david@example.com'
});

// ===== INSERT WITH ALL DATA TYPES =====

await users.insertOne({
  name: 'Complete User',
  email: 'complete@example.com',
  age: 30,
  balance: 1250.50,
  active: true,
  tags: ['premium', 'verified'],
  address: {
    street: '123 Main St',
    city: 'New York',
    zipCode: '10001',
    coordinates: [-73.935242, 40.730610]
  },
  preferences: {
    newsletter: true,
    notifications: {
      email: true,
      sms: false,
      push: true
    }
  },
  createdAt: new Date(),
  metadata: null,
  scores: [85, 90, 78, 92]
});

// ===== INSERT WITH WRITE CONCERN =====

// Wait for majority of replica set
const result1 = await users.insertOne(
  {
    name: 'Eve Davis',
    email: 'eve@example.com'
  },
  {
    writeConcern: {
      w: 'majority',        // Wait for majority nodes
      j: true,              // Wait for journal sync
      wtimeout: 5000        // Timeout after 5 seconds
    }
  }
);

// Write concern with specific number of nodes
await users.insertOne(
  {
    name: 'Frank Miller',
    email: 'frank@example.com'
  },
  {
    writeConcern: {
      w: 2,                 // Wait for 2 nodes
      j: true,
      wtimeout: 3000
    }
  }
);

// Write concern - no acknowledgment (fire and forget)
await users.insertOne(
  {
    name: 'Grace Lee',
    email: 'grace@example.com'
  },
  {
    writeConcern: { w: 0 }  // No acknowledgment
  }
);

// ===== INSERT WITH COMMENT =====

await users.insertOne(
  {
    name: 'Henry Wilson',
    email: 'henry@example.com'
  },
  {
    comment: 'Inserting new user from API'
  }
);

// ===== INSERT WITH BYPASS VALIDATION =====

// Bypass document validation (if collection has validator)
await users.insertOne(
  {
    name: 'Invalid User'
    // Missing required fields
  },
  {
    bypassDocumentValidation: true
  }
);

// ===== ERROR HANDLING =====

try {
  await users.insertOne({
    _id: 'duplicate',
    name: 'First Insert'
  });
  
  // This will fail - duplicate _id
  await users.insertOne({
    _id: 'duplicate',
    name: 'Second Insert'
  });
} catch (error) {
  if (error.code === 11000) {
    console.log('Duplicate key error:', error.message);
  }
}

// ===== INSERT WITH SESSION (TRANSACTIONS) =====

const session = client.startSession();
try {
  await session.withTransaction(async () => {
    await users.insertOne(
      {
        name: 'Transaction User',
        email: 'transaction@example.com'
      },
      { session }
    );
  });
} finally {
  await session.endSession();
}

await client.close();`}</code>
                </pre>
              </div>

              {/* insertMany */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  2. insertMany() - Insert Multiple Documents
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient } = require('mongodb');

const client = new MongoClient('mongodb://localhost:27017');
await client.connect();
const db = client.db('myDatabase');
const products = db.collection('products');

// ===== BASIC INSERT MANY =====

const result = await products.insertMany([
  {
    name: 'Laptop',
    price: 999.99,
    category: 'electronics',
    stock: 50
  },
  {
    name: 'Mouse',
    price: 29.99,
    category: 'electronics',
    stock: 200
  },
  {
    name: 'Keyboard',
    price: 79.99,
    category: 'electronics',
    stock: 150
  }
]);

console.log('Insert result:', {
  acknowledged: result.acknowledged,
  insertedCount: result.insertedCount,
  insertedIds: result.insertedIds
});

// Access individual inserted IDs
console.log('First ID:', result.insertedIds[0]);
console.log('Second ID:', result.insertedIds[1]);

// ===== ORDERED INSERT (DEFAULT) =====

// Ordered: stops on first error
try {
  await products.insertMany(
    [
      { _id: 1, name: 'Product 1', price: 10 },
      { _id: 2, name: 'Product 2', price: 20 },
      { _id: 1, name: 'Duplicate', price: 30 },  // Error here
      { _id: 3, name: 'Product 3', price: 40 }   // Won't be inserted
    ],
    {
      ordered: true  // Default behavior
    }
  );
} catch (error) {
  console.log('Error on ordered insert');
  console.log('Documents inserted before error:', error.result.insertedCount);
  // Only first 2 documents were inserted
}

// ===== UNORDERED INSERT =====

// Unordered: continues despite errors
try {
  await products.insertMany(
    [
      { _id: 10, name: 'Product 10', price: 10 },
      { _id: 11, name: 'Product 11', price: 20 },
      { _id: 10, name: 'Duplicate', price: 30 },  // Error, but continues
      { _id: 12, name: 'Product 12', price: 40 }  // Still inserted
    ],
    {
      ordered: false  // Continue on error
    }
  );
} catch (error) {
  console.log('Unordered insert completed with errors');
  console.log('Total inserted:', error.result.insertedCount);
  console.log('Write errors:', error.writeErrors);
  // Documents 10, 11, and 12 were inserted (skipped duplicate)
}

// ===== INSERT MANY WITH WRITE CONCERN =====

await products.insertMany(
  [
    { name: 'Product A', price: 100 },
    { name: 'Product B', price: 200 },
    { name: 'Product C', price: 300 }
  ],
  {
    writeConcern: {
      w: 'majority',
      j: true,
      wtimeout: 5000
    }
  }
);

// ===== INSERT LARGE BATCH =====

// Generate 1000 documents
const largeBatch = [];
for (let i = 0; i < 1000; i++) {
  largeBatch.push({
    name: \`Product \${i}\`,
    price: Math.random() * 1000,
    stock: Math.floor(Math.random() * 500),
    createdAt: new Date()
  });
}

const largeResult = await products.insertMany(largeBatch);
console.log('Inserted documents:', largeResult.insertedCount);

// ===== INSERT WITH CUSTOM IDs =====

await products.insertMany([
  { _id: 'PROD001', name: 'Custom ID 1', price: 50 },
  { _id: 'PROD002', name: 'Custom ID 2', price: 60 },
  { _id: 'PROD003', name: 'Custom ID 3', price: 70 }
]);

// ===== INSERT WITH BYPASS VALIDATION =====

await products.insertMany(
  [
    { name: 'Invalid 1' },  // May not meet validation rules
    { name: 'Invalid 2' }
  ],
  {
    bypassDocumentValidation: true
  }
);

// ===== INSERT WITH COMMENT =====

await products.insertMany(
  [
    { name: 'Bulk Product 1', price: 25 },
    { name: 'Bulk Product 2', price: 35 }
  ],
  {
    comment: 'Bulk insert from import script'
  }
);

// ===== BATCH INSERT WITH ERROR HANDLING =====

async function insertInBatches(collection, documents, batchSize = 100) {
  const batches = [];
  for (let i = 0; i < documents.length; i += batchSize) {
    batches.push(documents.slice(i, i + batchSize));
  }
  
  const results = [];
  for (const batch of batches) {
    try {
      const result = await collection.insertMany(batch, { ordered: false });
      results.push({
        success: true,
        insertedCount: result.insertedCount
      });
    } catch (error) {
      results.push({
        success: false,
        insertedCount: error.result?.insertedCount || 0,
        errors: error.writeErrors?.length || 0
      });
    }
  }
  
  return results;
}

// Use batch insert
const docs = Array.from({ length: 500 }, (_, i) => ({
  name: \`Batch Product \${i}\`,
  price: i * 10
}));

const batchResults = await insertInBatches(products, docs, 100);
console.log('Batch results:', batchResults);

// ===== INSERT MANY WITH SESSION =====

const session = client.startSession();
try {
  await session.withTransaction(async () => {
    await products.insertMany(
      [
        { name: 'Transaction Product 1', price: 100 },
        { name: 'Transaction Product 2', price: 200 }
      ],
      { session }
    );
  });
} finally {
  await session.endSession();
}

await client.close();`}</code>
                </pre>
              </div>

              {/* Write Concerns */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  3. Write Concerns - Complete Guide
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient } = require('mongodb');

const client = new MongoClient('mongodb://localhost:27017');
await client.connect();
const db = client.db('myDatabase');
const orders = db.collection('orders');

// ===== WRITE CONCERN OPTIONS =====

/*
  w: Write acknowledgment
    - 0: No acknowledgment (fire and forget)
    - 1: Acknowledgment from primary (default)
    - 2+: Acknowledgment from primary + N-1 secondaries
    - "majority": Acknowledgment from majority of replica set
    - "tagName": Acknowledgment from members with specific tag
  
  j: Journal acknowledgment
    - true: Wait for journal sync
    - false: Don't wait for journal (default)
  
  wtimeout: Timeout in milliseconds
    - 0: No timeout (default)
    - N: Timeout after N milliseconds
*/

// ===== w: 0 - NO ACKNOWLEDGMENT =====

// Fastest, no confirmation, data may be lost
await orders.insertOne(
  { item: 'Order 1', total: 100 },
  {
    writeConcern: { w: 0 }
  }
);
// Returns immediately, no guarantee of write

// ===== w: 1 - PRIMARY ACKNOWLEDGMENT (DEFAULT) =====

// Wait for primary to acknowledge
await orders.insertOne(
  { item: 'Order 2', total: 200 },
  {
    writeConcern: { w: 1 }
  }
);
// Confirmed by primary, but may not be on secondaries yet

// ===== w: "majority" - MAJORITY ACKNOWLEDGMENT =====

// Wait for majority of replica set members
await orders.insertOne(
  { item: 'Order 3', total: 300 },
  {
    writeConcern: {
      w: 'majority',
      wtimeout: 5000
    }
  }
);
// Most durable option for replica sets

// ===== j: true - JOURNAL SYNC =====

// Wait for journal sync on primary
await orders.insertOne(
  { item: 'Order 4', total: 400 },
  {
    writeConcern: {
      w: 1,
      j: true,
      wtimeout: 5000
    }
  }
);
// Survives server restart

// ===== MAXIMUM DURABILITY =====

// Most durable configuration
await orders.insertOne(
  { item: 'Critical Order', total: 10000 },
  {
    writeConcern: {
      w: 'majority',
      j: true,
      wtimeout: 10000
    }
  }
);
// Acknowledged by majority + journaled

// ===== SPECIFIC NODE COUNT =====

// Wait for specific number of nodes
await orders.insertOne(
  { item: 'Order 5', total: 500 },
  {
    writeConcern: {
      w: 3,              // Wait for 3 nodes
      j: true,
      wtimeout: 5000
    }
  }
);

// ===== WRITE CONCERN WITH TIMEOUT ERROR =====

try {
  await orders.insertOne(
    { item: 'Order 6', total: 600 },
    {
      writeConcern: {
        w: 'majority',
        wtimeout: 1  // Very short timeout
      }
    }
  );
} catch (error) {
  if (error.code === 64) {
    console.log('Write concern timeout');
  }
}

// ===== COLLECTION-LEVEL WRITE CONCERN =====

// Set default write concern for collection
const ordersWithWC = db.collection('orders', {
  writeConcern: {
    w: 'majority',
    j: true,
    wtimeout: 5000
  }
});

// All operations use this write concern by default
await ordersWithWC.insertOne({ item: 'Order 7', total: 700 });

// Override collection default
await ordersWithWC.insertOne(
  { item: 'Order 8', total: 800 },
  {
    writeConcern: { w: 1 }  // Override
  }
);

// ===== DATABASE-LEVEL WRITE CONCERN =====

const dbWithWC = client.db('myDatabase', {
  writeConcern: {
    w: 'majority',
    j: true,
    wtimeout: 5000
  }
});

const col = dbWithWC.collection('testCollection');
await col.insertOne({ test: true });  // Uses db-level write concern

// ===== CLIENT-LEVEL WRITE CONCERN =====

const clientWithWC = new MongoClient('mongodb://localhost:27017', {
  writeConcern: {
    w: 'majority',
    j: true,
    wtimeout: 5000
  }
});

await clientWithWC.connect();
// All operations use this write concern unless overridden

// ===== WRITE CONCERN PERFORMANCE COMPARISON =====

console.time('w:0 insert');
await orders.insertOne({ item: 'Fast' }, { writeConcern: { w: 0 } });
console.timeEnd('w:0 insert');  // Fastest

console.time('w:1 insert');
await orders.insertOne({ item: 'Normal' }, { writeConcern: { w: 1 } });
console.timeEnd('w:1 insert');  // Medium

console.time('w:majority insert');
await orders.insertOne({ item: 'Durable' }, { writeConcern: { w: 'majority' } });
console.timeEnd('w:majority insert');  // Slower

console.time('w:majority,j:true insert');
await orders.insertOne(
  { item: 'Most Durable' },
  { writeConcern: { w: 'majority', j: true } }
);
console.timeEnd('w:majority,j:true insert');  // Slowest

// ===== USE CASES =====

// Logging/Analytics - Speed over durability
await db.collection('logs').insertOne(
  { level: 'info', message: 'User logged in' },
  { writeConcern: { w: 0 } }
);

// Normal operations - Balance
await db.collection('users').insertOne(
  { name: 'John', email: 'john@example.com' },
  { writeConcern: { w: 1 } }
);

// Financial transactions - Maximum durability
await db.collection('transactions').insertOne(
  { amount: 10000, type: 'payment' },
  { writeConcern: { w: 'majority', j: true, wtimeout: 10000 } }
);

await client.close();
await clientWithWC.close();`}</code>
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

              {/* Create and Save */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-purple-300">
                  1. Create and Save Documents
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const mongoose = require('mongoose');

await mongoose.connect('mongodb://localhost:27017/myDatabase');

// Define schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: Number,
  active: { type: Boolean, default: true },
  tags: [String],
  address: {
    street: String,
    city: String,
    zipCode: String
  },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// ===== METHOD 1: CREATE + SAVE =====

// Create document instance
const user1 = new User({
  name: 'Alice Johnson',
  email: 'alice@example.com',
  age: 28
});

// Save to database
const savedUser = await user1.save();
console.log('Saved user:', savedUser);

// ===== METHOD 2: CREATE (SHORTHAND) =====

// Create and save in one step
const user2 = await User.create({
  name: 'Bob Smith',
  email: 'bob@example.com',
  age: 32,
  tags: ['premium', 'verified']
});

console.log('Created user:', user2);

// ===== CREATE WITH NESTED OBJECTS =====

const user3 = await User.create({
  name: 'Carol White',
  email: 'carol@example.com',
  age: 25,
  address: {
    street: '123 Main St',
    city: 'New York',
    zipCode: '10001'
  },
  tags: ['new', 'active']
});

// ===== CREATE WITH CUSTOM _id =====

const userWithId = await User.create({
  _id: 'custom_id_123',
  name: 'David Brown',
  email: 'david@example.com'
});

// ===== CREATE WITH DEFAULTS =====

const userWithDefaults = await User.create({
  name: 'Eve Davis',
  email: 'eve@example.com'
  // active: true (default)
  // createdAt: new Date() (default)
});

// ===== VALIDATION ON CREATE =====

try {
  // Missing required fields
  await User.create({
    age: 30
  });
} catch (error) {
  console.log('Validation error:', error.message);
}

// ===== SAVE WITH VALIDATION =====

const user = new User({
  name: 'Frank Miller',
  email: 'frank@example.com'
});

try {
  await user.save();
} catch (error) {
  if (error.name === 'ValidationError') {
    console.log('Validation errors:', error.errors);
  }
}

// ===== SKIP VALIDATION =====

const invalidUser = new User({
  name: 'Invalid'
  // Missing required email
});

await invalidUser.save({ validateBeforeSave: false });

await mongoose.disconnect();`}</code>
                </pre>
              </div>

              {/* insertMany in Mongoose */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-purple-300">
                  2. insertMany() in Mongoose
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const mongoose = require('mongoose');

await mongoose.connect('mongodb://localhost:27017/myDatabase');

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  stock: Number
});

const Product = mongoose.model('Product', productSchema);

// ===== BASIC INSERT MANY =====

const products = await Product.insertMany([
  { name: 'Laptop', price: 999.99, category: 'electronics', stock: 50 },
  { name: 'Mouse', price: 29.99, category: 'electronics', stock: 200 },
  { name: 'Keyboard', price: 79.99, category: 'electronics', stock: 150 }
]);

console.log('Inserted products:', products.length);

// ===== ORDERED INSERT (DEFAULT) =====

try {
  await Product.insertMany(
    [
      { _id: 1, name: 'Product 1', price: 10 },
      { _id: 2, name: 'Product 2', price: 20 },
      { _id: 1, name: 'Duplicate', price: 30 },  // Error
      { _id: 3, name: 'Product 3', price: 40 }   // Not inserted
    ],
    { ordered: true }
  );
} catch (error) {
  console.log('Ordered insert stopped at error');
}

// ===== UNORDERED INSERT =====

try {
  await Product.insertMany(
    [
      { _id: 10, name: 'Product 10', price: 10 },
      { _id: 11, name: 'Product 11', price: 20 },
      { _id: 10, name: 'Duplicate', price: 30 },  // Error, continues
      { _id: 12, name: 'Product 12', price: 40 }  // Still inserted
    ],
    { ordered: false }
  );
} catch (error) {
  console.log('Unordered insert completed with errors');
}

// ===== INSERT WITH VALIDATION =====

const validatedSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 }
});

const ValidatedProduct = mongoose.model('ValidatedProduct', validatedSchema);

try {
  await ValidatedProduct.insertMany([
    { name: 'Valid Product', price: 100 },
    { name: 'Invalid Product', price: -50 },  // Fails min validation
    { name: 'Another Valid', price: 200 }
  ]);
} catch (error) {
  console.log('Validation failed during insertMany');
}

// ===== RAW INSERT (SKIP MONGOOSE MIDDLEWARE) =====

// Skip Mongoose validation and middleware
await Product.insertMany(
  [
    { name: 'Raw 1', price: 10 },
    { name: 'Raw 2', price: 20 }
  ],
  {
    rawResult: true  // Return raw MongoDB result
  }
);

// ===== INSERT MANY WITH WRITE CONCERN =====

await Product.insertMany(
  [
    { name: 'WC Product 1', price: 100 },
    { name: 'WC Product 2', price: 200 }
  ],
  {
    writeConcern: {
      w: 'majority',
      j: true,
      wtimeout: 5000
    }
  }
);

// ===== LEAN INSERT =====

// Insert without Mongoose document instances
const docs = await Product.insertMany(
  [
    { name: 'Lean 1', price: 50 },
    { name: 'Lean 2', price: 60 }
  ],
  { lean: true }
);

console.log('Plain JavaScript objects:', docs);

await mongoose.disconnect();`}</code>
                </pre>
              </div>

              {/* Write Concerns in Mongoose */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-purple-300">
                  3. Write Concerns in Mongoose
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const mongoose = require('mongoose');

// ===== CONNECTION-LEVEL WRITE CONCERN =====

await mongoose.connect('mongodb://localhost:27017/myDatabase', {
  writeConcern: {
    w: 'majority',
    j: true,
    wtimeout: 5000
  }
});

// ===== SCHEMA-LEVEL WRITE CONCERN =====

const orderSchema = new mongoose.Schema({
  item: String,
  total: Number,
  status: String
}, {
  writeConcern: {
    w: 'majority',
    j: true,
    wtimeout: 5000
  }
});

const Order = mongoose.model('Order', orderSchema);

// ===== OPERATION-LEVEL WRITE CONCERN =====

// Override schema write concern
const order1 = await Order.create(
  { item: 'Laptop', total: 999 },
  {
    writeConcern: {
      w: 1,  // Override to faster setting
      j: false
    }
  }
);

// ===== SAVE WITH WRITE CONCERN =====

const order = new Order({
  item: 'Mouse',
  total: 29
});

await order.save({
  writeConcern: {
    w: 'majority',
    j: true,
    wtimeout: 10000
  }
});

// ===== BULK WRITE WITH WRITE CONCERN =====

await Order.bulkWrite(
  [
    {
      insertOne: {
        document: { item: 'Keyboard', total: 79 }
      }
    },
    {
      insertOne: {
        document: { item: 'Monitor', total: 299 }
      }
    }
  ],
  {
    writeConcern: {
      w: 'majority',
      j: true
    }
  }
);

// ===== COLLECTION-LEVEL WRITE CONCERN =====

// Access native collection with write concern
const collection = Order.collection;
await collection.insertOne(
  { item: 'Desk', total: 199 },
  {
    writeConcern: {
      w: 'majority',
      j: true,
      wtimeout: 5000
    }
  }
);

// ===== USE CASES =====

// High-value transactions
const paymentSchema = new mongoose.Schema({
  amount: Number,
  userId: String
}, {
  writeConcern: {
    w: 'majority',
    j: true,
    wtimeout: 10000
  }
});

const Payment = mongoose.model('Payment', paymentSchema);

// Analytics/Logs - speed over durability
const logSchema = new mongoose.Schema({
  level: String,
  message: String
});

const Log = mongoose.model('Log', logSchema);

// Use faster write concern for logs
await Log.collection.insertOne(
  { level: 'info', message: 'User action' },
  { writeConcern: { w: 0 } }
);

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
                  <strong>Use insertMany for bulk inserts:</strong> More
                  efficient than multiple insertOne calls
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Choose appropriate write concern:</strong> Balance
                  durability vs performance based on data importance
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Use unordered inserts for large batches:</strong>{" "}
                  Better performance and error resilience
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Handle duplicate key errors:</strong> Always catch and
                  handle error code 11000
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Validate before insert:</strong> Use schema validation
                  to maintain data quality
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Batch large inserts:</strong> Split very large
                  datasets into manageable batches (100-1000 docs)
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Use w: majority for critical data:</strong> Ensures
                  data survives node failures
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Enable journaling for durability:</strong> Set j: true
                  for important writes
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Set wtimeout appropriately:</strong> Prevent
                  indefinite hangs on slow replica sets
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Consider custom _id fields:</strong> Can improve query
                  performance for specific use cases
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
              href="/phase2/read"
              className="bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-500 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              Next: Read Operations →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
