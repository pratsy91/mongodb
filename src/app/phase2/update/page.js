"use client";

import Link from "next/link";
import { useState } from "react";

export default function UpdateOperationsPage() {
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
          Update Operations
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Complete guide to all update operators and methods
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
                Update Methods
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>updateOne():</strong> Updates first matching document
                </li>
                <li>
                  <strong>updateMany():</strong> Updates all matching documents
                </li>
                <li>
                  <strong>replaceOne():</strong> Replaces entire document
                </li>
                <li>
                  <strong>findOneAndUpdate():</strong> Updates and returns
                  document
                </li>
              </ul>

              <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                Update Operator Categories
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Field Operators:</strong> $set, $unset, $rename,
                  $setOnInsert
                </li>
                <li>
                  <strong>Numeric Operators:</strong> $inc, $mul, $min, $max
                </li>
                <li>
                  <strong>Array Operators:</strong> $push, $pull, $pop,
                  $addToSet, $pullAll
                </li>
                <li>
                  <strong>Array Modifiers:</strong> $each, $slice, $sort,
                  $position
                </li>
                <li>
                  <strong>Bitwise Operator:</strong> $bit
                </li>
                <li>
                  <strong>Date Operator:</strong> $currentDate
                </li>
              </ul>

              <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                Upsert
              </h3>
              <p className="text-lg">
                Upsert creates a new document if no match is found. Useful for
                ensuring a document exists.
              </p>
            </div>
          </section>

          {/* MongoDB Native Driver Examples */}
          {activeTab === "mongodb" && (
            <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
              <h2 className="text-3xl font-bold mb-6 text-blue-300">
                MongoDB Native Driver Examples
              </h2>

              {/* Basic Update Methods */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  1. Basic Update Methods
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient } = require('mongodb');

const client = new MongoClient('mongodb://localhost:27017');
await client.connect();
const db = client.db('myDatabase');
const users = db.collection('users');

// ===== UPDATE ONE =====

// Update first matching document
const result1 = await users.updateOne(
  { email: 'alice@example.com' },
  { $set: { age: 29, active: true } }
);

console.log('Update result:', {
  acknowledged: result1.acknowledged,
  matchedCount: result1.matchedCount,
  modifiedCount: result1.modifiedCount,
  upsertedId: result1.upsertedId
});

// ===== UPDATE MANY =====

// Update all matching documents
const result2 = await users.updateMany(
  { active: false },
  { $set: { status: 'inactive' } }
);

console.log('Updated documents:', result2.modifiedCount);

// ===== REPLACE ONE =====

// Replace entire document (except _id)
await users.replaceOne(
  { email: 'bob@example.com' },
  {
    name: 'Bob Smith Jr',
    email: 'bob@example.com',
    age: 30,
    active: true
  }
);

// ===== FIND ONE AND UPDATE =====

// Update and return document
const updatedDoc = await users.findOneAndUpdate(
  { email: 'carol@example.com' },
  { $set: { lastLogin: new Date() } },
  { 
    returnDocument: 'after',  // 'before' or 'after'
    projection: { password: 0 }
  }
);

console.log('Updated document:', updatedDoc);

// Return document before update
const oldDoc = await users.findOneAndUpdate(
  { email: 'dave@example.com' },
  { $inc: { loginCount: 1 } },
  { returnDocument: 'before' }
);

// ===== FIND ONE AND REPLACE =====

const replaced = await users.findOneAndReplace(
  { email: 'eve@example.com' },
  {
    name: 'Eve Davis',
    email: 'eve@example.com',
    age: 28
  },
  { returnDocument: 'after' }
);

// ===== UPSERT =====

// Create if doesn't exist
await users.updateOne(
  { email: 'new@example.com' },
  { 
    $set: { 
      name: 'New User',
      createdAt: new Date() 
    }
  },
  { upsert: true }
);

// Upsert with setOnInsert
await users.updateOne(
  { email: 'another@example.com' },
  {
    $set: { lastUpdated: new Date() },
    $setOnInsert: { 
      createdAt: new Date(),
      version: 1
    }
  },
  { upsert: true }
);

await client.close();`}</code>
                </pre>
              </div>

              {/* Field Update Operators */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  2. Field Update Operators
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient } = require('mongodb');

const client = new MongoClient('mongodb://localhost:27017');
await client.connect();
const db = client.db('myDatabase');
const users = db.collection('users');

// ===== $set - SET FIELD VALUE =====

// Set single field
await users.updateOne(
  { _id: 1 },
  { $set: { age: 30 } }
);

// Set multiple fields
await users.updateOne(
  { _id: 1 },
  { 
    $set: { 
      age: 30, 
      city: 'New York',
      updatedAt: new Date()
    }
  }
);

// Set nested field
await users.updateOne(
  { _id: 1 },
  { $set: { 'address.city': 'Boston' } }
);

// Set array element
await users.updateOne(
  { _id: 1 },
  { $set: { 'scores.0': 100 } }
);

// Set embedded document
await users.updateOne(
  { _id: 1 },
  { 
    $set: { 
      profile: {
        bio: 'Software developer',
        website: 'https://example.com'
      }
    }
  }
);

// ===== $unset - REMOVE FIELD =====

// Remove single field
await users.updateOne(
  { _id: 1 },
  { $unset: { middleName: '' } }
);

// Remove multiple fields
await users.updateOne(
  { _id: 1 },
  { $unset: { tempField: '', oldData: '' } }
);

// Remove nested field
await users.updateOne(
  { _id: 1 },
  { $unset: { 'address.apartment': '' } }
);

// Remove array element (sets to null)
await users.updateOne(
  { _id: 1 },
  { $unset: { 'scores.2': '' } }
);

// ===== $rename - RENAME FIELD =====

// Rename single field
await users.updateOne(
  { _id: 1 },
  { $rename: { 'name': 'fullName' } }
);

// Rename multiple fields
await users.updateOne(
  { _id: 1 },
  { 
    $rename: { 
      'firstName': 'fname',
      'lastName': 'lname'
    }
  }
);

// Rename nested field
await users.updateOne(
  { _id: 1 },
  { $rename: { 'address.zipCode': 'address.postalCode' } }
);

// Move field to nested position
await users.updateOne(
  { _id: 1 },
  { $rename: { 'phone': 'contact.phone' } }
);

// ===== $setOnInsert - SET ON UPSERT INSERT ONLY =====

// Only sets fields when document is inserted (upsert creates new doc)
await users.updateOne(
  { email: 'unique@example.com' },
  {
    $set: { lastLogin: new Date() },
    $setOnInsert: {
      createdAt: new Date(),
      accountType: 'free',
      version: 1
    }
  },
  { upsert: true }
);

// On subsequent updates, $setOnInsert fields are not modified
await users.updateOne(
  { email: 'unique@example.com' },
  {
    $set: { lastLogin: new Date() },
    $setOnInsert: { version: 2 }  // Won't change
  },
  { upsert: true }
);

await client.close();`}</code>
                </pre>
              </div>

              {/* Numeric Operators */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  3. Numeric Update Operators
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient } = require('mongodb');

const client = new MongoClient('mongodb://localhost:27017');
await client.connect();
const db = client.db('myDatabase');
const products = db.collection('products');

// ===== $inc - INCREMENT/DECREMENT =====

// Increment by positive value
await products.updateOne(
  { _id: 1 },
  { $inc: { stock: 10 } }
);

// Decrement by negative value
await products.updateOne(
  { _id: 1 },
  { $inc: { stock: -5 } }
);

// Increment multiple fields
await products.updateOne(
  { _id: 1 },
  { 
    $inc: { 
      views: 1,
      likes: 1,
      version: 1
    }
  }
);

// Increment nested field
await products.updateOne(
  { _id: 1 },
  { $inc: { 'stats.viewCount': 1 } }
);

// Increment array element
await products.updateOne(
  { _id: 1 },
  { $inc: { 'monthlyViews.0': 100 } }
);

// Increment decimal values
await products.updateOne(
  { _id: 1 },
  { $inc: { price: 10.50 } }
);

// ===== $mul - MULTIPLY =====

// Multiply by value
await products.updateOne(
  { _id: 1 },
  { $mul: { price: 1.1 } }  // 10% increase
);

// Multiply by zero (sets to zero)
await products.updateOne(
  { _id: 1 },
  { $mul: { discount: 0 } }
);

// Multiply multiple fields
await products.updateOne(
  { _id: 1 },
  { 
    $mul: { 
      price: 0.9,      // 10% discount
      weight: 1.05     // 5% increase
    }
  }
);

// Multiply nested field
await products.updateOne(
  { _id: 1 },
  { $mul: { 'pricing.basePrice': 1.15 } }
);

// ===== $min - UPDATE IF SMALLER =====

// Update only if new value is smaller
await products.updateOne(
  { _id: 1 },
  { $min: { lowestPrice: 99.99 } }
);

// If current lowestPrice is 150, it becomes 99.99
// If current lowestPrice is 50, it stays 50

// Multiple min updates
await products.updateOne(
  { _id: 1 },
  { 
    $min: { 
      lowestPrice: 89.99,
      minStock: 5
    }
  }
);

// Min with date
await products.updateOne(
  { _id: 1 },
  { $min: { firstSeenDate: new Date('2020-01-01') } }
);

// ===== $max - UPDATE IF LARGER =====

// Update only if new value is larger
await products.updateOne(
  { _id: 1 },
  { $max: { highestPrice: 199.99 } }
);

// If current highestPrice is 150, it becomes 199.99
// If current highestPrice is 250, it stays 250

// Multiple max updates
await products.updateOne(
  { _id: 1 },
  { 
    $max: { 
      highestPrice: 299.99,
      maxViews: 10000
    }
  }
);

// Max with date
await products.updateOne(
  { _id: 1 },
  { $max: { lastSeenDate: new Date() } }
);

// ===== COMBINED NUMERIC OPERATIONS =====

await products.updateOne(
  { _id: 1 },
  {
    $inc: { stock: -1, salesCount: 1 },
    $mul: { price: 1.05 },
    $min: { lowestPrice: 79.99 },
    $max: { highestSale: 199.99 }
  }
);

await client.close();`}</code>
                </pre>
              </div>

              {/* Array Update Operators Part 1 */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  4. Array Update Operators - Part 1
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient } = require('mongodb');

const client = new MongoClient('mongodb://localhost:27017');
await client.connect();
const db = client.db('myDatabase');
const users = db.collection('users');

// ===== $push - ADD TO ARRAY =====

// Push single element
await users.updateOne(
  { _id: 1 },
  { $push: { tags: 'premium' } }
);

// Push multiple elements with $each
await users.updateOne(
  { _id: 1 },
  { 
    $push: { 
      tags: { 
        $each: ['verified', 'active', 'trusted'] 
      }
    }
  }
);

// Push with $position (insert at index)
await users.updateOne(
  { _id: 1 },
  { 
    $push: { 
      tags: { 
        $each: ['featured'],
        $position: 0  // Insert at beginning
      }
    }
  }
);

// Push with $slice (keep only N elements)
await users.updateOne(
  { _id: 1 },
  { 
    $push: { 
      recentLogins: { 
        $each: [new Date()],
        $slice: -10  // Keep last 10 only
      }
    }
  }
);

// Push with $sort (sort after push)
await users.updateOne(
  { _id: 1 },
  { 
    $push: { 
      scores: { 
        $each: [{ score: 85, subject: 'Math' }],
        $sort: { score: -1 }  // Sort descending
      }
    }
  }
);

// Push with all modifiers
await users.updateOne(
  { _id: 1 },
  { 
    $push: { 
      items: { 
        $each: [
          { name: 'Item1', price: 100 },
          { name: 'Item2', price: 50 }
        ],
        $position: 0,
        $slice: 5,
        $sort: { price: -1 }
      }
    }
  }
);

// ===== $addToSet - ADD UNIQUE TO ARRAY =====

// Add if not exists (no duplicates)
await users.updateOne(
  { _id: 1 },
  { $addToSet: { tags: 'premium' } }
);
// If 'premium' already exists, nothing happens

// Add multiple unique elements
await users.updateOne(
  { _id: 1 },
  { 
    $addToSet: { 
      tags: { 
        $each: ['verified', 'active', 'trusted'] 
      }
    }
  }
);
// Only adds elements that don't exist

// Add complex objects (checks entire object equality)
await users.updateOne(
  { _id: 1 },
  { 
    $addToSet: { 
      preferences: { theme: 'dark', lang: 'en' } 
    }
  }
);

// ===== $pull - REMOVE MATCHING ELEMENTS =====

// Remove specific value
await users.updateOne(
  { _id: 1 },
  { $pull: { tags: 'inactive' } }
);

// Remove with condition
await users.updateOne(
  { _id: 1 },
  { 
    $pull: { 
      scores: { $lt: 60 }  // Remove scores < 60
    }
  }
);

// Remove objects matching condition
await users.updateOne(
  { _id: 1 },
  { 
    $pull: { 
      items: { 
        status: 'expired'
      }
    }
  }
);

// Remove with multiple conditions
await users.updateOne(
  { _id: 1 },
  { 
    $pull: { 
      orders: { 
        status: 'cancelled',
        amount: { $lt: 10 }
      }
    }
  }
);

// ===== $pullAll - REMOVE ALL MATCHING VALUES =====

// Remove multiple specific values
await users.updateOne(
  { _id: 1 },
  { $pullAll: { tags: ['old', 'deprecated', 'unused'] } }
);

// Remove multiple numbers
await users.updateOne(
  { _id: 1 },
  { $pullAll: { scores: [0, null, undefined] } }
);

// ===== $pop - REMOVE FIRST OR LAST ELEMENT =====

// Remove last element
await users.updateOne(
  { _id: 1 },
  { $pop: { tags: 1 } }
);

// Remove first element
await users.updateOne(
  { _id: 1 },
  { $pop: { tags: -1 } }
);

// Pop from multiple arrays
await users.updateOne(
  { _id: 1 },
  { 
    $pop: { 
      recentLogins: 1,
      notifications: -1
    }
  }
);

await client.close();`}</code>
                </pre>
              </div>

              {/* Array Update Operators Part 2 */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  5. Array Update Operators - Part 2 (Positional)
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient } = require('mongodb');

const client = new MongoClient('mongodb://localhost:27017');
await client.connect();
const db = client.db('myDatabase');
const users = db.collection('users');

// ===== $ POSITIONAL OPERATOR - UPDATE FIRST MATCH =====

// Update first matching array element
await users.updateOne(
  { 
    _id: 1,
    'scores.subject': 'Math'  // Match condition
  },
  { 
    $set: { 
      'scores.$.grade': 'A'  // $ refers to matched element
    }
  }
);

// Increment matched element
await users.updateOne(
  { 
    _id: 1,
    'items.name': 'Laptop'
  },
  { 
    $inc: { 'items.$.quantity': 1 }
  }
);

// Update nested field in matched element
await users.updateOne(
  { 
    _id: 1,
    'orders.orderId': '12345'
  },
  { 
    $set: { 
      'orders.$.status': 'shipped',
      'orders.$.shippedDate': new Date()
    }
  }
);

// ===== $[] ALL POSITIONAL - UPDATE ALL ELEMENTS =====

// Update all array elements
await users.updateOne(
  { _id: 1 },
  { 
    $set: { 
      'scores.$[].attempted': true 
    }
  }
);

// Increment all array elements
await users.updateOne(
  { _id: 1 },
  { 
    $inc: { 
      'monthlyViews.$[]': 100 
    }
  }
);

// ===== $[identifier] FILTERED POSITIONAL - UPDATE MATCHING =====

// Update elements matching filter
await users.updateOne(
  { _id: 1 },
  { 
    $set: { 
      'scores.$[elem].grade': 'Pass'
    }
  },
  {
    arrayFilters: [
      { 'elem.score': { $gte: 60 } }
    ]
  }
);

// Update multiple conditions
await users.updateOne(
  { _id: 1 },
  { 
    $set: { 
      'items.$[item].discount': 0.1
    }
  },
  {
    arrayFilters: [
      { 
        'item.price': { $gte: 100 },
        'item.inStock': true
      }
    ]
  }
);

// Multiple filtered updates
await users.updateOne(
  { _id: 1 },
  { 
    $set: { 
      'scores.$[highScore].badge': 'gold',
      'scores.$[lowScore].needsImprovement': true
    }
  },
  {
    arrayFilters: [
      { 'highScore.score': { $gte: 90 } },
      { 'lowScore.score': { $lt: 60 } }
    ]
  }
);

// Nested array update with filter
await users.updateOne(
  { _id: 1 },
  { 
    $set: { 
      'courses.$[course].modules.$[module].completed': true
    }
  },
  {
    arrayFilters: [
      { 'course.name': 'MongoDB' },
      { 'module.duration': { $lt: 30 } }
    ]
  }
);

// ===== COMBINED ARRAY OPERATIONS =====

await users.updateOne(
  { _id: 1 },
  {
    $push: { 
      tags: { 
        $each: ['new', 'featured'],
        $position: 0 
      }
    },
    $pull: { oldTags: 'deprecated' },
    $set: { 
      'scores.$[good].verified': true 
    }
  },
  {
    arrayFilters: [
      { 'good.score': { $gte: 80 } }
    ]
  }
);

await client.close();`}</code>
                </pre>
              </div>

              {/* Date and Bitwise Operators */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  6. Date and Bitwise Operators
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient } = require('mongodb');

const client = new MongoClient('mongodb://localhost:27017');
await client.connect();
const db = client.db('myDatabase');
const users = db.collection('users');

// ===== $currentDate - SET TO CURRENT DATE =====

// Set to current date
await users.updateOne(
  { _id: 1 },
  { 
    $currentDate: { 
      lastModified: true 
    }
  }
);

// Set to timestamp
await users.updateOne(
  { _id: 1 },
  { 
    $currentDate: { 
      lastLogin: { 
        $type: 'timestamp' 
      }
    }
  }
);

// Set to date (default)
await users.updateOne(
  { _id: 1 },
  { 
    $currentDate: { 
      updatedAt: { 
        $type: 'date' 
      }
    }
  }
);

// Multiple current dates
await users.updateOne(
  { _id: 1 },
  { 
    $currentDate: { 
      lastModified: true,
      lastAccessed: true,
      statusChanged: { $type: 'timestamp' }
    }
  }
);

// Combined with other operators
await users.updateOne(
  { _id: 1 },
  { 
    $set: { status: 'active' },
    $currentDate: { 
      statusChangedAt: true 
    },
    $inc: { version: 1 }
  }
);

// ===== $bit - BITWISE OPERATIONS =====

// Bitwise AND
await users.updateOne(
  { _id: 1 },
  { 
    $bit: { 
      permissions: { 
        and: 0b1010  // Binary 1010
      }
    }
  }
);

// Bitwise OR
await users.updateOne(
  { _id: 1 },
  { 
    $bit: { 
      flags: { 
        or: 0b0100  // Binary 0100
      }
    }
  }
);

// Bitwise XOR
await users.updateOne(
  { _id: 1 },
  { 
    $bit: { 
      settings: { 
        xor: 0b1100  // Binary 1100
      }
    }
  }
);

// Multiple bitwise operations
await users.updateOne(
  { _id: 1 },
  { 
    $bit: { 
      permissions: { and: 255 },
      flags: { or: 1 },
      settings: { xor: 128 }
    }
  }
);

// Practical example: toggle flags
// Current value: 0b1010 (10)
// XOR with 0b0010 toggles second bit
await users.updateOne(
  { _id: 1 },
  { 
    $bit: { 
      userFlags: { 
        xor: 0b0010  // Toggle bit
      }
    }
  }
);

// Set specific bit (OR)
await users.updateOne(
  { _id: 1 },
  { 
    $bit: { 
      accessFlags: { 
        or: 0b00001000  // Set 4th bit
      }
    }
  }
);

// Clear specific bit (AND with complement)
await users.updateOne(
  { _id: 1 },
  { 
    $bit: { 
      accessFlags: { 
        and: 0b11110111  // Clear 4th bit
      }
    }
  }
);

await client.close();`}</code>
                </pre>
              </div>

              {/* Update Options */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  7. Update Options and Advanced Features
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient } = require('mongodb');

const client = new MongoClient('mongodb://localhost:27017');
await client.connect();
const db = client.db('myDatabase');
const products = db.collection('products');

// ===== UPDATE OPTIONS =====

await products.updateOne(
  { _id: 1 },
  { $set: { name: 'Updated Product' } },
  {
    // Upsert - create if not exists
    upsert: false,
    
    // Write concern
    writeConcern: {
      w: 'majority',
      j: true,
      wtimeout: 5000
    },
    
    // Array filters
    arrayFilters: [
      { 'elem.status': 'active' }
    ],
    
    // Collation
    collation: {
      locale: 'en',
      strength: 2
    },
    
    // Hint (force index)
    hint: { name: 1 },
    
    // Comment
    comment: 'Update from API',
    
    // Bypass document validation
    bypassDocumentValidation: false
  }
);

// ===== FIND ONE AND UPDATE OPTIONS =====

const updated = await products.findOneAndUpdate(
  { name: 'Product A' },
  { $inc: { views: 1 } },
  {
    // Return document after update
    returnDocument: 'after',  // 'before' or 'after'
    
    // Projection
    projection: { name: 1, price: 1 },
    
    // Sort (which document to update if multiple match)
    sort: { createdAt: -1 },
    
    // Upsert
    upsert: true,
    
    // Max time
    maxTimeMS: 5000,
    
    // Include result metadata
    includeResultMetadata: false
  }
);

// ===== UPDATE WITH SESSION (TRANSACTIONS) =====

const session = client.startSession();
try {
  await session.withTransaction(async () => {
    await products.updateOne(
      { _id: 1 },
      { $inc: { stock: -1 } },
      { session }
    );
    
    await products.updateOne(
      { _id: 2 },
      { $inc: { stock: 1 } },
      { session }
    );
  });
} finally {
  await session.endSession();
}

// ===== UPDATE MANY WITH LIMIT (via aggregation) =====

// Update first N matching documents
await products.updateMany(
  { category: 'electronics' },
  [
    {
      $set: {
        discounted: {
          $cond: {
            if: { $gte: ['$price', 100] },
            then: true,
            else: false
          }
        }
      }
    }
  ]
);

// ===== AGGREGATION PIPELINE UPDATE =====

await products.updateOne(
  { _id: 1 },
  [
    {
      $set: {
        // Use current field values in update
        discountPrice: {
          $multiply: ['$price', 0.9]
        },
        totalValue: {
          $multiply: ['$price', '$stock']
        },
        fullName: {
          $concat: ['$brand', ' - ', '$name']
        }
      }
    }
  ]
);

// Complex aggregation update
await products.updateMany(
  { active: true },
  [
    {
      $set: {
        priceCategory: {
          $switch: {
            branches: [
              { case: { $lt: ['$price', 50] }, then: 'budget' },
              { case: { $lt: ['$price', 200] }, then: 'mid-range' },
              { case: { $gte: ['$price', 200] }, then: 'premium' }
            ],
            default: 'uncategorized'
          }
        }
      }
    }
  ]
);

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

              {/* Basic Updates in Mongoose */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-purple-300">
                  1. Basic Update Methods in Mongoose
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const mongoose = require('mongoose');

await mongoose.connect('mongodb://localhost:27017/myDatabase');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number,
  active: Boolean,
  tags: [String]
});

const User = mongoose.model('User', userSchema);

// ===== UPDATE ONE =====

const result = await User.updateOne(
  { email: 'alice@example.com' },
  { $set: { age: 29, active: true } }
);

console.log('Modified count:', result.modifiedCount);

// ===== UPDATE MANY =====

await User.updateMany(
  { active: false },
  { $set: { status: 'inactive' } }
);

// ===== REPLACE ONE =====

await User.replaceOne(
  { email: 'bob@example.com' },
  {
    name: 'Bob Smith',
    email: 'bob@example.com',
    age: 30
  }
);

// ===== FIND BY ID AND UPDATE =====

const updated = await User.findByIdAndUpdate(
  '507f1f77bcf86cd799439011',
  { $set: { active: true } },
  { new: true }  // Return updated document
);

// ===== FIND ONE AND UPDATE =====

const user = await User.findOneAndUpdate(
  { email: 'carol@example.com' },
  { $inc: { loginCount: 1 } },
  { 
    new: true,              // Return updated doc
    upsert: true,           // Create if not exists
    runValidators: true,    // Run schema validation
    select: 'name email'    // Projection
  }
);

// ===== UPDATE WITH VALIDATION =====

const validatedUpdate = await User.findOneAndUpdate(
  { email: 'dave@example.com' },
  { age: 150 },  // May fail validation
  { 
    new: true,
    runValidators: true  // Enable validation
  }
);

// ===== DOCUMENT INSTANCE UPDATE =====

const doc = await User.findOne({ email: 'eve@example.com' });
doc.age = 30;
doc.tags.push('premium');
await doc.save();

// ===== SET METHOD =====

const doc2 = await User.findOne({ email: 'frank@example.com' });
doc2.set({ age: 35, active: true });
await doc2.save();

await mongoose.disconnect();`}</code>
                </pre>
              </div>

              {/* Update Operators in Mongoose */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-purple-300">
                  2. Update Operators in Mongoose
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const mongoose = require('mongoose');

await mongoose.connect('mongodb://localhost:27017/myDatabase');

const User = mongoose.model('User', new mongoose.Schema({
  name: String,
  age: Number,
  balance: Number,
  tags: [String],
  scores: [Number]
}));

// ===== FIELD OPERATORS =====

// $set
await User.updateOne(
  { name: 'Alice' },
  { $set: { age: 30, active: true } }
);

// $unset
await User.updateOne(
  { name: 'Bob' },
  { $unset: { tempField: '' } }
);

// $rename
await User.updateOne(
  { name: 'Carol' },
  { $rename: { 'oldName': 'newName' } }
);

// $setOnInsert
await User.updateOne(
  { email: 'new@example.com' },
  {
    $set: { lastLogin: new Date() },
    $setOnInsert: { createdAt: new Date() }
  },
  { upsert: true }
);

// ===== NUMERIC OPERATORS =====

// $inc
await User.updateOne(
  { name: 'Dave' },
  { $inc: { age: 1, version: 1 } }
);

// $mul
await User.updateOne(
  { name: 'Eve' },
  { $mul: { balance: 1.1 } }  // 10% increase
);

// $min
await User.updateOne(
  { name: 'Frank' },
  { $min: { lowestScore: 85 } }
);

// $max
await User.updateOne(
  { name: 'Grace' },
  { $max: { highestScore: 95 } }
);

// ===== ARRAY OPERATORS =====

// $push
await User.updateOne(
  { name: 'Henry' },
  { $push: { tags: 'premium' } }
);

// $push with $each
await User.updateOne(
  { name: 'Ivy' },
  { 
    $push: { 
      tags: { 
        $each: ['verified', 'active'],
        $position: 0  // Insert at beginning
      }
    }
  }
);

// $addToSet
await User.updateOne(
  { name: 'Jack' },
  { $addToSet: { tags: 'unique' } }
);

// $pull
await User.updateOne(
  { name: 'Kate' },
  { $pull: { tags: 'inactive' } }
);

// $pullAll
await User.updateOne(
  { name: 'Leo' },
  { $pullAll: { tags: ['old', 'deprecated'] } }
);

// $pop (remove last)
await User.updateOne(
  { name: 'Mike' },
  { $pop: { tags: 1 } }
);

// $pop (remove first)
await User.updateOne(
  { name: 'Nina' },
  { $pop: { tags: -1 } }
);

// ===== DATE OPERATOR =====

// $currentDate
await User.updateOne(
  { name: 'Oscar' },
  { 
    $currentDate: { 
      lastModified: true,
      timestamp: { $type: 'timestamp' }
    }
  }
);

// ===== POSITIONAL OPERATORS =====

// $ (first match)
await User.updateOne(
  { 'scores.0': { $gte: 80 } },
  { $set: { 'scores.$': 100 } }
);

// $[] (all elements)
await User.updateOne(
  { name: 'Peter' },
  { $mul: { 'scores.$[]': 1.1 } }
);

// $[identifier] (filtered)
await User.updateOne(
  { name: 'Quinn' },
  { $set: { 'scores.$[elem]': 100 } },
  {
    arrayFilters: [{ elem: { $gte: 95 } }]
  }
);

await mongoose.disconnect();`}</code>
                </pre>
              </div>

              {/* Mongoose-specific Features */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-purple-300">
                  3. Mongoose-Specific Update Features
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const mongoose = require('mongoose');

await mongoose.connect('mongodb://localhost:27017/myDatabase');

// ===== SCHEMA WITH MIDDLEWARE =====

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  updatedCount: { type: Number, default: 0 }
});

// Pre-update middleware
productSchema.pre('findOneAndUpdate', function() {
  this.set({ updatedAt: new Date() });
});

// Post-update middleware
productSchema.post('findOneAndUpdate', function(doc) {
  console.log('Document updated:', doc);
});

const Product = mongoose.model('Product', productSchema);

// ===== SCHEMA METHODS =====

productSchema.methods.incrementPrice = async function(amount) {
  this.price += amount;
  return this.save();
};

const product = await Product.findOne({ name: 'Laptop' });
await product.incrementPrice(50);

// ===== SCHEMA STATICS =====

productSchema.statics.updatePriceByCategory = async function(category, multiplier) {
  return this.updateMany(
    { category },
    { $mul: { price: multiplier } }
  );
};

await Product.updatePriceByCategory('electronics', 1.1);

// ===== VIRTUALS =====

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String
});

userSchema.virtual('fullName')
  .get(function() {
    return \`\${this.firstName} \${this.lastName}\`;
  })
  .set(function(v) {
    const parts = v.split(' ');
    this.firstName = parts[0];
    this.lastName = parts[1];
  });

const User = mongoose.model('User', userSchema);

const user = await User.findOne();
user.fullName = 'John Doe';  // Sets firstName and lastName
await user.save();

// ===== DISCRIMINATORS =====

const eventSchema = new mongoose.Schema({
  type: String,
  date: Date
});

const Event = mongoose.model('Event', eventSchema);

const clickEventSchema = new mongoose.Schema({
  element: String,
  x: Number,
  y: Number
});

const ClickEvent = Event.discriminator('Click', clickEventSchema);

await ClickEvent.updateOne(
  { _id: 'someId' },
  { $set: { element: 'button' } }
);

// ===== TIMESTAMPS =====

const timestampSchema = new mongoose.Schema({
  name: String
}, {
  timestamps: true  // Adds createdAt and updatedAt
});

const TimestampModel = mongoose.model('TimestampModel', timestampSchema);

// updatedAt automatically updated
await TimestampModel.updateOne(
  { name: 'Test' },
  { $set: { value: 123 } }
);

// ===== VERSIONING =====

const versionSchema = new mongoose.Schema({
  name: String,
  data: String
}, {
  versionKey: '__v'  // Default version key
});

const VersionModel = mongoose.model('VersionModel', versionSchema);

const doc = await VersionModel.findOne();
doc.data = 'updated';
await doc.save();  // Version incremented automatically

// ===== POPULATE AND UPDATE =====

const authorSchema = new mongoose.Schema({
  name: String,
  postCount: Number
});

const postSchema = new mongoose.Schema({
  title: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' }
});

const Author = mongoose.model('Author', authorSchema);
const Post = mongoose.model('Post', postSchema);

// Update and populate
const updatedPost = await Post.findOneAndUpdate(
  { title: 'My Post' },
  { $set: { published: true } },
  { new: true }
).populate('author');

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
                  <strong>Use atomic operators:</strong> Prefer $inc over
                  read-modify-write patterns
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Validate before updating:</strong> Use runValidators
                  in Mongoose
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Use upsert carefully:</strong> Consider $setOnInsert
                  for initial values
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Index fields used in filters:</strong> Update
                  performance depends on query performance
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Use array filters for complex updates:</strong> More
                  efficient than multiple updates
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Avoid $where in updates:</strong> Very slow, prefer
                  regular operators
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Use $currentDate for timestamps:</strong> Server time
                  is more reliable
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Test updates in development:</strong> Especially with
                  complex positional operators
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Use transactions for multi-document updates:</strong>{" "}
                  Ensure data consistency
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Monitor update performance:</strong> Check
                  modifiedCount vs matchedCount
                </span>
              </li>
            </ul>
          </section>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8">
            <Link
              href="/phase2/read"
              className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              ← Previous: Read Operations
            </Link>
            <Link
              href="/phase2/delete"
              className="bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-500 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              Next: Delete Operations →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
