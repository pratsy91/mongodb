"use client";

import Link from "next/link";
import { useState } from "react";

export default function ElementEvaluationPage() {
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
          Element & Evaluation Operators
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Complete guide to element and evaluation query operators
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
                Element Operators
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>$exists:</strong> Match documents where field exists
                  or not
                </li>
                <li>
                  <strong>$type:</strong> Match documents by BSON type
                </li>
              </ul>

              <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                Evaluation Operators
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>$regex:</strong> Pattern matching with regular
                  expressions
                </li>
                <li>
                  <strong>$expr:</strong> Use aggregation expressions in queries
                </li>
                <li>
                  <strong>$jsonSchema:</strong> Validate documents against JSON
                  Schema
                </li>
                <li>
                  <strong>$mod:</strong> Modulo operation
                </li>
                <li>
                  <strong>$text:</strong> Full-text search
                </li>
                <li>
                  <strong>$where:</strong> JavaScript expression (use sparingly)
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

              {/* Element Operators */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  1. Element Operators
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient } = require('mongodb');

const client = new MongoClient('mongodb://localhost:27017');
await client.connect();
const db = client.db('myDatabase');
const users = db.collection('users');

// ===== $exists - FIELD EXISTS =====

// Find documents where field exists
await users.find({ 
  middleName: { $exists: true } 
}).toArray();

// Find documents where field doesn't exist
await users.find({ 
  deletedAt: { $exists: false } 
}).toArray();

// Check multiple fields
await users.find({
  email: { $exists: true },
  phone: { $exists: false }
}).toArray();

// Nested field exists
await users.find({ 
  'address.apartment': { $exists: true } 
}).toArray();

// Array field exists
await users.find({ 
  tags: { $exists: true } 
}).toArray();

// Combine with other operators
await users.find({
  $and: [
    { optionalField: { $exists: true } },
    { optionalField: { $ne: null } }
  ]
}).toArray();

// $exists vs null comparison
// { field: null } matches null OR doesn't exist
// { field: { $exists: true } } matches exists (any value including null)
// { field: { $exists: false } } matches doesn't exist

await users.find({ middleName: null }).toArray();  
// Returns docs with middleName: null OR no middleName field

await users.find({ 
  middleName: { $exists: true } 
}).toArray();  
// Returns docs that HAVE middleName field (any value)

await users.find({
  middleName: { $exists: true, $ne: null }
}).toArray();  
// Returns docs with middleName that is NOT null

// ===== $type - BSON TYPE =====

// Match by BSON type (number)
await users.find({ 
  age: { $type: 16 }  // 16 = int
}).toArray();

// Match by BSON type (string)
await users.find({ 
  age: { $type: 'number' } 
}).toArray();

// All BSON types:
// 1 or 'double'
// 2 or 'string'
// 3 or 'object'
// 4 or 'array'
// 5 or 'binData'
// 7 or 'objectId'
// 8 or 'bool'
// 9 or 'date'
// 10 or 'null'
// 11 or 'regex'
// 13 or 'javascript'
// 15 or 'javascriptWithScope'
// 16 or 'int'
// 17 or 'timestamp'
// 18 or 'long'
// 19 or 'decimal'
// -1 or 'minKey'
// 127 or 'maxKey'

// Match string type
await users.find({ 
  name: { $type: 'string' } 
}).toArray();

// Match ObjectId type
await users.find({ 
  _id: { $type: 'objectId' } 
}).toArray();

// Match array type
await users.find({ 
  tags: { $type: 'array' } 
}).toArray();

// Match date type
await users.find({ 
  createdAt: { $type: 'date' } 
}).toArray();

// Match null type
await users.find({ 
  deletedAt: { $type: 'null' } 
}).toArray();

// Match multiple types
await users.find({ 
  value: { $type: ['string', 'number'] } 
}).toArray();

// Numeric types
await users.find({ 
  price: { $type: ['int', 'long', 'double', 'decimal'] } 
}).toArray();

// Type with exists
await users.find({
  $and: [
    { optionalNumber: { $exists: true } },
    { optionalNumber: { $type: 'number' } }
  ]
}).toArray();

await client.close();`}</code>
                </pre>
              </div>

              {/* Evaluation Operators - Part 1 */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  2. Evaluation Operators - $regex, $expr, $mod
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient } = require('mongodb');

const client = new MongoClient('mongodb://localhost:27017');
await client.connect();
const db = client.db('myDatabase');
const products = db.collection('products');

// ===== $regex - REGULAR EXPRESSIONS =====

// Basic regex
await products.find({ 
  name: { $regex: /laptop/i } 
}).toArray();

// Case-insensitive search
await products.find({ 
  name: { $regex: 'laptop', $options: 'i' } 
}).toArray();

// Starts with
await products.find({ 
  name: { $regex: /^Dell/ } 
}).toArray();

// Ends with
await products.find({ 
  email: { $regex: /gmail\\.com$/ } 
}).toArray();

// Contains
await products.find({ 
  description: { $regex: /warranty/ } 
}).toArray();

// Multiple patterns with $or
await products.find({
  $or: [
    { name: { $regex: /laptop/i } },
    { name: { $regex: /notebook/i } }
  ]
}).toArray();

// Regex options:
// i - case insensitive
// m - multiline
// x - ignore whitespace
// s - dot matches newline

await products.find({ 
  name: { 
    $regex: /^product/,
    $options: 'im'  // case insensitive + multiline
  }
}).toArray();

// Complex pattern
await products.find({ 
  sku: { $regex: /^[A-Z]{3}-\\d{4}$/ }  // ABC-1234 format
}).toArray();

// Word boundary
await products.find({ 
  title: { $regex: /\\bMongoDB\\b/i } 
}).toArray();

// Email validation pattern
await products.find({ 
  email: { 
    $regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/ 
  }
}).toArray();

// ===== $expr - AGGREGATION EXPRESSIONS =====

// Compare two fields
await products.find({
  $expr: { 
    $gt: ['$price', '$cost'] 
  }
}).toArray();
// Find products where price > cost

// Mathematical expressions
await products.find({
  $expr: { 
    $gte: [
      { $multiply: ['$price', 0.9] },  // 10% discount
      '$minPrice'
    ]
  }
}).toArray();

// String operations
await products.find({
  $expr: {
    $eq: [
      { $substr: ['$name', 0, 4] },
      'Dell'
    ]
  }
}).toArray();

// Conditional logic
await products.find({
  $expr: {
    $cond: {
      if: { $gte: ['$stock', 10] },
      then: true,
      else: false
    }
  }
}).toArray();

// Array operations
await products.find({
  $expr: {
    $gt: [{ $size: '$tags' }, 3]
  }
}).toArray();

// Date operations
await products.find({
  $expr: {
    $eq: [
      { $month: '$createdAt' },
      1  // January
    ]
  }
}).toArray();

// Complex expression
await products.find({
  $expr: {
    $and: [
      { $gte: ['$price', 100] },
      { $lte: ['$price', 1000] },
      { $gt: [{ $size: '$reviews' }, 10] }
    ]
  }
}).toArray();

// ===== $mod - MODULO OPERATION =====

// Find even numbers
await products.find({ 
  quantity: { $mod: [2, 0] } 
}).toArray();
// quantity % 2 == 0

// Find odd numbers
await products.find({ 
  quantity: { $mod: [2, 1] } 
}).toArray();
// quantity % 2 == 1

// Divisible by 5
await products.find({ 
  price: { $mod: [5, 0] } 
}).toArray();

// Remainder of 3
await products.find({ 
  count: { $mod: [10, 3] } 
}).toArray();
// count % 10 == 3

// Combined with other operators
await products.find({
  quantity: { 
    $mod: [2, 0],
    $gte: 10 
  }
}).toArray();

await client.close();`}</code>
                </pre>
              </div>

              {/* Evaluation Operators - Part 2 */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  3. Evaluation Operators - $text, $where, $jsonSchema
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient } = require('mongodb');

const client = new MongoClient('mongodb://localhost:27017');
await client.connect();
const db = client.db('myDatabase');
const articles = db.collection('articles');

// ===== $text - FULL TEXT SEARCH =====

// First, create a text index
await articles.createIndex({ 
  title: 'text', 
  content: 'text' 
});

// Basic text search
await articles.find({ 
  $text: { $search: 'mongodb' } 
}).toArray();

// Search multiple terms (OR)
await articles.find({ 
  $text: { $search: 'mongodb database' } 
}).toArray();

// Search phrase (exact)
await articles.find({ 
  $text: { $search: '"NoSQL database"' } 
}).toArray();

// Exclude terms
await articles.find({ 
  $text: { $search: 'mongodb -sql' } 
}).toArray();

// Case-sensitive search
await articles.find({ 
  $text: { 
    $search: 'MongoDB',
    $caseSensitive: true 
  }
}).toArray();

// Diacritic-sensitive search
await articles.find({ 
  $text: { 
    $search: 'café',
    $diacriticSensitive: true 
  }
}).toArray();

// Language-specific search
await articles.find({ 
  $text: { 
    $search: 'beautiful',
    $language: 'english' 
  }
}).toArray();

// Get text score
await articles.find(
  { $text: { $search: 'mongodb' } },
  { 
    projection: { 
      score: { $meta: 'textScore' } 
    }
  }
).toArray();

// Sort by text score
await articles.find({ 
  $text: { $search: 'mongodb database' } 
})
  .sort({ score: { $meta: 'textScore' } })
  .toArray();

// Combine with other queries
await articles.find({
  $text: { $search: 'mongodb' },
  category: 'tutorial',
  published: true
}).toArray();

// ===== $where - JAVASCRIPT EXPRESSION =====

// WARNING: $where is slow and should be avoided
// Use $expr instead when possible

// Basic $where
await articles.find({
  $where: 'this.views > this.likes * 10'
}).toArray();

// Function syntax
await articles.find({
  $where: function() {
    return this.price > 100 && this.stock > 0;
  }
}).toArray();

// String operations
await articles.find({
  $where: "this.name.length > 20"
}).toArray();

// Complex logic
await articles.find({
  $where: function() {
    return (this.price * this.quantity) > 1000;
  }
}).toArray();

// NOTE: Use $expr instead for better performance
await articles.find({
  $expr: {
    $gt: [
      { $multiply: ['$price', '$quantity'] },
      1000
    ]
  }
}).toArray();

// ===== $jsonSchema - JSON SCHEMA VALIDATION =====

// Validate document structure
await articles.find({
  $jsonSchema: {
    required: ['title', 'content'],
    properties: {
      title: {
        bsonType: 'string',
        minLength: 5,
        maxLength: 100
      },
      content: {
        bsonType: 'string',
        minLength: 10
      },
      views: {
        bsonType: 'int',
        minimum: 0
      },
      tags: {
        bsonType: 'array',
        items: {
          bsonType: 'string'
        },
        minItems: 1,
        maxItems: 10
      }
    }
  }
}).toArray();

// Nested schema validation
await articles.find({
  $jsonSchema: {
    required: ['author'],
    properties: {
      author: {
        bsonType: 'object',
        required: ['name', 'email'],
        properties: {
          name: { bsonType: 'string' },
          email: { 
            bsonType: 'string',
            pattern: '^.+@.+$'
          }
        }
      }
    }
  }
}).toArray();

// Enum validation
await articles.find({
  $jsonSchema: {
    properties: {
      status: {
        enum: ['draft', 'published', 'archived']
      }
    }
  }
}).toArray();

// Multiple types
await articles.find({
  $jsonSchema: {
    properties: {
      metadata: {
        bsonType: ['object', 'null']
      }
    }
  }
}).toArray();

// Array of specific type
await articles.find({
  $jsonSchema: {
    properties: {
      ratings: {
        bsonType: 'array',
        items: {
          bsonType: 'int',
          minimum: 1,
          maximum: 5
        }
      }
    }
  }
}).toArray();

// Conditional validation
await articles.find({
  $jsonSchema: {
    properties: {
      premium: { bsonType: 'bool' }
    },
    if: {
      properties: { premium: { enum: [true] } }
    },
    then: {
      required: ['subscriptionId']
    }
  }
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

              {/* Element Operators in Mongoose */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-purple-300">
                  1. Element Operators in Mongoose
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const mongoose = require('mongoose');

await mongoose.connect('mongodb://localhost:27017/myDatabase');

const User = mongoose.model('User', new mongoose.Schema({
  name: String,
  email: String,
  middleName: String,
  age: Number,
  deletedAt: Date
}));

// ===== $exists =====

// Field exists
await User.find({ middleName: { $exists: true } });

// Field doesn't exist
await User.find({ deletedAt: { $exists: false } });

// Query builder
await User.find()
  .where('middleName').exists()
  .where('deletedAt').exists(false);

// ===== $type =====

// Match by type
await User.find({ age: { $type: 'number' } });
await User.find({ tags: { $type: 'array' } });
await User.find({ createdAt: { $type: 'date' } });

// Multiple types
await User.find({ 
  value: { $type: ['string', 'number'] } 
});

// Schema-based type checking
const typedSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number },
  tags: [String]
});

await mongoose.disconnect();`}</code>
                </pre>
              </div>

              {/* Evaluation Operators in Mongoose */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-purple-300">
                  2. Evaluation Operators in Mongoose
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const mongoose = require('mongoose');

await mongoose.connect('mongodb://localhost:27017/myDatabase');

const Product = mongoose.model('Product', new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  cost: Number,
  quantity: Number
}));

// ===== $regex =====

// Basic regex
await Product.find({ name: /laptop/i });
await Product.find({ name: { $regex: /laptop/i } });

// Query builder
await Product.find()
  .where('name').regex(/laptop/i);

// Starts with
await Product.find({ name: /^Dell/ });

// Contains
await Product.find({ description: /warranty/ });

// ===== $expr =====

// Compare fields
await Product.find({
  $expr: { $gt: ['$price', '$cost'] }
});

// Mathematical operations
await Product.find({
  $expr: {
    $gte: [
      { $multiply: ['$price', 0.9] },
      '$minPrice'
    ]
  }
});

// ===== $mod =====

// Even numbers
await Product.find({ quantity: { $mod: [2, 0] } });

// Odd numbers
await Product.find({ quantity: { $mod: [2, 1] } });

// Query builder
await Product.find()
  .where('quantity').mod(2, 0);

// ===== $text =====

// Text index required first
const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});
articleSchema.index({ title: 'text', content: 'text' });

const Article = mongoose.model('Article', articleSchema);

// Text search
await Article.find({ $text: { $search: 'mongodb' } });

// With score
await Article.find(
  { $text: { $search: 'mongodb' } },
  { score: { $meta: 'textScore' } }
).sort({ score: { $meta: 'textScore' } });

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
                  <strong>Use $exists with $ne null:</strong> To find non-null
                  existing fields
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Prefer $expr over $where:</strong> Much better
                  performance
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Index fields for text search:</strong> Create text
                  indexes before using $text
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Avoid $where completely:</strong> Extremely slow, no
                  index support
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Use $regex efficiently:</strong> Anchor patterns (^)
                  when possible for index use
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Combine $text with filters:</strong> Narrow results
                  for better performance
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Use $type for polymorphic fields:</strong> Handle
                  varying data types
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Leverage $expr for complex comparisons:</strong>{" "}
                  Compare document fields dynamically
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Use $jsonSchema for validation queries:</strong> Find
                  non-compliant documents
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Optimize regex patterns:</strong> Avoid leading
                  wildcards for index usage
                </span>
              </li>
            </ul>
          </section>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8">
            <Link
              href="/phase3/comparison-logical"
              className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              ← Previous: Comparison & Logical
            </Link>
            <Link
              href="/phase3/array-bitwise"
              className="bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-500 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              Next: Array & Bitwise →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
