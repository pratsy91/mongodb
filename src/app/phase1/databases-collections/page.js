"use client";

import Link from "next/link";
import { useState } from "react";

export default function DatabasesCollectionsPage() {
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
          Databases & Collections
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Complete guide to database and collection operations, validation, and
          management
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
                What are Databases?
              </h3>
              <p className="text-lg">
                A database in MongoDB is a physical container for collections.
                Each database gets its own set of files on the file system. A
                MongoDB server can have multiple databases.
              </p>

              <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                What are Collections?
              </h3>
              <p className="text-lg">
                Collections are groups of MongoDB documents. They are analogous
                to tables in relational databases. Collections do not enforce a
                schema by default, but you can add validation rules.
              </p>

              <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                Collection Types
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Regular Collections:</strong> Standard collections
                  with no special behavior
                </li>
                <li>
                  <strong>Capped Collections:</strong> Fixed-size collections
                  with insertion order preserved
                </li>
                <li>
                  <strong>Time Series Collections:</strong> Optimized for
                  time-series data
                </li>
                <li>
                  <strong>Views:</strong> Read-only collections based on
                  aggregation pipelines
                </li>
              </ul>

              <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                Database Names Restrictions
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Cannot be empty</li>
                <li>
                  Cannot contain spaces, ., ", /, \\, *, &lt;, &gt;, :, |, ?, $,
                  null character
                </li>
                <li>Database names are case-sensitive</li>
                <li>Maximum 64 bytes</li>
                <li>Reserved names: admin, local, config</li>
              </ul>

              <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                Collection Names Restrictions
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Cannot be empty</li>
                <li>Cannot contain null character</li>
                <li>Cannot start with "system." (reserved prefix)</li>
                <li>Cannot contain $ (reserved for special collections)</li>
                <li>Maximum length: 120 bytes</li>
              </ul>
            </div>
          </section>

          {/* MongoDB Native Driver Examples */}
          {activeTab === "mongodb" && (
            <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
              <h2 className="text-3xl font-bold mb-6 text-blue-300">
                MongoDB Native Driver Examples
              </h2>

              {/* Database Operations */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  1. Database Operations
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient } = require('mongodb');

const client = new MongoClient('mongodb://localhost:27017');
await client.connect();

// ===== ACCESSING DATABASES =====

// Access database (creates if doesn't exist)
const db = client.db('myDatabase');

// Access with specific read/write concern
const dbWithOptions = client.db('myDatabase', {
  readPreference: 'secondary',
  readConcern: { level: 'majority' },
  writeConcern: { w: 'majority', j: true, wtimeout: 5000 }
});

// ===== LIST DATABASES =====

// List all databases
const adminDb = client.db().admin();
const { databases } = await adminDb.listDatabases();

console.log('All databases:');
databases.forEach(db => {
  console.log(\` - \${db.name}: \${db.sizeOnDisk} bytes\`);
});

// List databases with filter
const largeDatabases = await adminDb.listDatabases({
  filter: { sizeOnDisk: { $gt: 1000000 } },
  nameOnly: true,  // Return only names
  authorizedDatabases: true  // Only authorized databases
});

// ===== DATABASE STATISTICS =====

// Get database statistics
const stats = await db.stats();
console.log('Database stats:', {
  collections: stats.collections,
  views: stats.views,
  objects: stats.objects,
  avgObjSize: stats.avgObjSize,
  dataSize: stats.dataSize,
  storageSize: stats.storageSize,
  indexes: stats.indexes,
  indexSize: stats.indexSize,
  totalSize: stats.totalSize,
  scaleFactor: stats.scaleFactor,
  fsUsedSize: stats.fsUsedSize,
  fsTotalSize: stats.fsTotalSize
});

// Get stats with scale factor
const statsInMB = await db.stats({ scale: 1024 * 1024 }); // Scale to MB

// ===== DROP DATABASE =====

// Drop entire database
await db.dropDatabase();
console.log('Database dropped');

// Drop with write concern
await db.dropDatabase({
  writeConcern: { w: 'majority', wtimeout: 5000 }
});

// ===== DATABASE COMMANDS =====

// Run arbitrary database command
const result = await db.command({ ping: 1 });
console.log('Ping result:', result);

// Get server status
const serverStatus = await db.command({ serverStatus: 1 });

// Get database profiling level
const profileLevel = await db.command({ profile: -1 });
console.log('Current profile level:', profileLevel.was);

// Set database profiling
await db.command({
  profile: 2,  // 0=off, 1=slow ops, 2=all ops
  slowms: 100, // Log operations slower than 100ms
  sampleRate: 0.5  // Sample 50% of operations
});

// ===== DATABASE PROPERTIES =====

console.log('Database name:', db.databaseName);
console.log('Database namespace:', db.namespace);

await client.close();`}</code>
                </pre>
              </div>

              {/* Collection Operations */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  2. Collection Operations
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient } = require('mongodb');

const client = new MongoClient('mongodb://localhost:27017');
await client.connect();
const db = client.db('myDatabase');

// ===== ACCESSING COLLECTIONS =====

// Access collection (creates if doesn't exist on first write)
const users = db.collection('users');

// Access with options
const usersWithOptions = db.collection('users', {
  readPreference: 'secondary',
  readConcern: { level: 'majority' },
  writeConcern: { w: 'majority' }
});

// ===== CREATE COLLECTION =====

// Create collection explicitly
await db.createCollection('products');

// Create with options
await db.createCollection('orders', {
  // Capped collection
  capped: true,
  size: 10000000,  // Size in bytes (10MB)
  max: 5000,       // Maximum number of documents
  
  // Storage engine options
  storageEngine: {
    wiredTiger: {
      configString: 'block_compressor=zlib'
    }
  },
  
  // Validation
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'price'],
      properties: {
        name: {
          bsonType: 'string',
          description: 'must be a string and is required'
        },
        price: {
          bsonType: 'number',
          minimum: 0,
          description: 'must be a non-negative number and is required'
        },
        category: {
          bsonType: 'string',
          enum: ['electronics', 'clothing', 'food', 'books'],
          description: 'must be one of the enum values'
        }
      }
    }
  },
  validationLevel: 'strict',  // 'off', 'strict', 'moderate'
  validationAction: 'error',   // 'error', 'warn'
  
  // Collation
  collation: {
    locale: 'en',
    strength: 2,
    caseLevel: false,
    caseFirst: 'off',
    numericOrdering: false,
    alternate: 'non-ignorable',
    maxVariable: 'punct',
    backwards: false
  },
  
  // Write concern
  writeConcern: {
    w: 'majority',
    j: true,
    wtimeout: 5000
  },
  
  // Comment
  comment: 'Creating orders collection with validation'
});

// ===== CREATE TIME SERIES COLLECTION =====

await db.createCollection('weather', {
  timeseries: {
    timeField: 'timestamp',
    metaField: 'metadata',
    granularity: 'hours'  // 'seconds', 'minutes', 'hours'
  },
  expireAfterSeconds: 86400  // TTL: delete after 1 day
});

// ===== LIST COLLECTIONS =====

// List all collections
const collections = await db.listCollections().toArray();
console.log('Collections:', collections.map(c => c.name));

// List with filter
const userCollections = await db.listCollections({
  name: { $regex: /^user/ }
}).toArray();

// List with options
const collectionInfo = await db.listCollections({}, {
  nameOnly: false,  // Return full info
  authorizedCollections: true
}).toArray();

console.log('Collection details:');
collectionInfo.forEach(coll => {
  console.log(\`\${coll.name}:\`, {
    type: coll.type,  // 'collection', 'view', 'timeseries'
    options: coll.options,
    info: coll.info
  });
});

// ===== COLLECTION STATISTICS =====

// Get collection statistics
const stats = await db.collection('users').stats();
console.log('Collection stats:', {
  namespace: stats.ns,
  count: stats.count,
  size: stats.size,
  avgObjSize: stats.avgObjSize,
  storageSize: stats.storageSize,
  freeStorageSize: stats.freeStorageSize,
  nindexes: stats.nindexes,
  totalIndexSize: stats.totalIndexSize,
  totalSize: stats.totalSize,
  scaleFactor: stats.scaleFactor
});

// Stats with scale
const statsInKB = await db.collection('users').stats({ scale: 1024 });

// ===== RENAME COLLECTION =====

// Rename collection
await db.collection('oldName').rename('newName');

// Rename with dropTarget option
await db.collection('source').rename('target', {
  dropTarget: true  // Drop target if exists
});

// ===== DROP COLLECTION =====

// Drop collection
await db.collection('users').drop();

// Drop with write concern
await db.collection('users').drop({
  writeConcern: { w: 'majority' }
});

// Check if collection exists before dropping
const exists = await db.listCollections({ name: 'users' }).hasNext();
if (exists) {
  await db.collection('users').drop();
}

await client.close();`}</code>
                </pre>
              </div>

              {/* Capped Collections */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  3. Capped Collections (Complete)
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient } = require('mongodb');

const client = new MongoClient('mongodb://localhost:27017');
await client.connect();
const db = client.db('myDatabase');

// ===== CREATE CAPPED COLLECTION =====

// Create capped collection
await db.createCollection('logs', {
  capped: true,
  size: 5242880,    // 5MB size limit (required)
  max: 10000        // Maximum 10000 documents (optional)
});

// ===== CAPPED COLLECTION CHARACTERISTICS =====

/*
  1. Fixed size
  2. Insertion order is preserved
  3. Oldest documents are automatically removed when limit is reached
  4. No updates that increase document size
  5. Cannot delete individual documents
  6. Very fast insertion and retrieval
  7. Ideal for: logs, cache, real-time analytics
*/

// ===== INSERT INTO CAPPED COLLECTION =====

const logs = db.collection('logs');

// Documents are inserted in order
for (let i = 0; i < 100; i++) {
  await logs.insertOne({
    level: 'info',
    message: \`Log message \${i}\`,
    timestamp: new Date()
  });
}

// ===== QUERY CAPPED COLLECTION =====

// Natural order (insertion order)
const logsInOrder = await logs.find().toArray();

// Reverse natural order
const logsReversed = await logs.find().sort({ $natural: -1 }).toArray();

// ===== TAILABLE CURSORS =====

// Create tailable cursor (stays open, waits for new documents)
const cursor = logs.find({}, {
  tailable: true,
  awaitData: true,
  noCursorTimeout: true
});

// Process documents as they arrive
cursor.on('data', (doc) => {
  console.log('New log:', doc);
});

cursor.on('error', (error) => {
  console.error('Cursor error:', error);
});

cursor.on('end', () => {
  console.log('Cursor ended');
});

// ===== TAILABLE CURSOR WITH AWAIT =====

async function tailableCursorExample() {
  const cursor = logs.find({}, {
    tailable: true,
    awaitData: true
  });

  while (await cursor.hasNext()) {
    const doc = await cursor.next();
    if (doc) {
      console.log('Document:', doc);
    }
  }
}

// ===== CHECK IF COLLECTION IS CAPPED =====

const collectionInfo = await db.listCollections({ name: 'logs' }).next();
const isCapped = collectionInfo.options.capped;
console.log('Is capped:', isCapped);

// Or use stats
const stats = await logs.stats();
console.log('Is capped:', stats.capped);
console.log('Max documents:', stats.max);
console.log('Max size:', stats.maxSize);

// ===== CONVERT TO CAPPED COLLECTION =====

// Convert regular collection to capped
await db.command({
  convertToCapped: 'regularCollection',
  size: 10000000,  // 10MB
  max: 5000
});

// ===== LIMITATIONS OF CAPPED COLLECTIONS =====

/*
  1. Cannot shard capped collections
  2. Cannot use $out or $merge to capped collections in aggregation
  3. Cannot change document size with updates
  4. Cannot delete documents (only drop entire collection)
  5. No support for remove operations
  6. Indexes other than _id are not recommended
*/

await client.close();`}</code>
                </pre>
              </div>

              {/* Schema Validation */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  4. Schema Validation (Complete)
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient } = require('mongodb');

const client = new MongoClient('mongodb://localhost:27017');
await client.connect();
const db = client.db('myDatabase');

// ===== CREATE COLLECTION WITH JSON SCHEMA VALIDATION =====

await db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      title: 'User Object Validation',
      required: ['name', 'email', 'age'],
      properties: {
        name: {
          bsonType: 'string',
          minLength: 2,
          maxLength: 100,
          description: 'Name must be a string between 2-100 characters'
        },
        email: {
          bsonType: 'string',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\\\.[a-zA-Z]{2,}$',
          description: 'Email must be a valid email address'
        },
        age: {
          bsonType: 'int',
          minimum: 0,
          maximum: 150,
          description: 'Age must be an integer between 0 and 150'
        },
        phone: {
          bsonType: ['string', 'null'],
          pattern: '^\\\\+?[0-9]{10,15}$',
          description: 'Phone must be a valid phone number'
        },
        address: {
          bsonType: 'object',
          required: ['street', 'city'],
          properties: {
            street: { bsonType: 'string' },
            city: { bsonType: 'string' },
            zipCode: { 
              bsonType: 'string',
              pattern: '^[0-9]{5}(-[0-9]{4})?$'
            },
            country: {
              bsonType: 'string',
              enum: ['USA', 'Canada', 'Mexico']
            }
          }
        },
        tags: {
          bsonType: 'array',
          minItems: 0,
          maxItems: 10,
          items: {
            bsonType: 'string'
          },
          uniqueItems: true,
          description: 'Tags must be an array of unique strings, max 10 items'
        },
        role: {
          enum: ['admin', 'user', 'guest'],
          description: 'Role must be one of: admin, user, guest'
        },
        createdAt: {
          bsonType: 'date',
          description: 'Must be a date'
        },
        metadata: {
          bsonType: 'object',
          additionalProperties: true,  // Allow any additional properties
          description: 'Flexible metadata object'
        }
      },
      additionalProperties: false  // No properties outside of schema
    }
  },
  validationLevel: 'strict',    // 'off', 'strict', 'moderate'
  validationAction: 'error'     // 'error', 'warn'
});

// ===== VALIDATION LEVELS =====

/*
  - off: No validation
  - strict: Validate all inserts and updates (default)
  - moderate: Validate inserts and updates to valid documents only
               (don't validate updates to invalid existing documents)
*/

// ===== VALIDATION ACTIONS =====

/*
  - error: Reject documents that don't match (default)
  - warn: Log warning but allow the operation
*/

// ===== QUERY OPERATOR VALIDATION =====

await db.createCollection('products', {
  validator: {
    $and: [
      { price: { $type: 'number' } },
      { price: { $gte: 0 } },
      { name: { $type: 'string' } },
      { name: { $ne: '' } },
      {
        $or: [
          { category: 'electronics' },
          { category: 'clothing' },
          { category: 'food' }
        ]
      }
    ]
  },
  validationLevel: 'strict',
  validationAction: 'error'
});

// ===== EXPRESSION VALIDATION =====

await db.createCollection('accounts', {
  validator: {
    $expr: {
      $and: [
        { $gte: ['$balance', 0] },
        { $lte: ['$balance', 1000000] },
        {
          $cond: {
            if: { $eq: ['$type', 'premium'] },
            then: { $gte: ['$balance', 1000] },
            else: true
          }
        }
      ]
    }
  }
});

// ===== MODIFY VALIDATION RULES =====

// Update validator
await db.command({
  collMod: 'users',
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'email'],  // Modified requirements
      properties: {
        name: { bsonType: 'string' },
        email: { bsonType: 'string' }
      }
    }
  },
  validationLevel: 'moderate',  // Changed from strict
  validationAction: 'warn'      // Changed from error
});

// ===== REMOVE VALIDATION =====

// Remove all validation
await db.command({
  collMod: 'users',
  validator: {},
  validationLevel: 'off'
});

// ===== GET COLLECTION INFO WITH VALIDATION =====

const collectionInfo = await db.listCollections({ name: 'users' }).next();
console.log('Validation:', {
  validator: collectionInfo.options.validator,
  validationLevel: collectionInfo.options.validationLevel,
  validationAction: collectionInfo.options.validationAction
});

// ===== VALIDATION BYPASS (ADMIN ONLY) =====

// Bypass validation for specific operation
await db.collection('users').insertOne(
  { invalidData: true },
  { bypassDocumentValidation: true }
);

// ===== ALL BSON TYPES FOR VALIDATION =====

await db.createCollection('allTypes', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      properties: {
        stringField: { bsonType: 'string' },
        numberField: { bsonType: 'number' },     // double, int, long, decimal
        intField: { bsonType: 'int' },
        longField: { bsonType: 'long' },
        doubleField: { bsonType: 'double' },
        decimalField: { bsonType: 'decimal' },
        boolField: { bsonType: 'bool' },
        dateField: { bsonType: 'date' },
        timestampField: { bsonType: 'timestamp' },
        objectField: { bsonType: 'object' },
        arrayField: { bsonType: 'array' },
        binDataField: { bsonType: 'binData' },
        objectIdField: { bsonType: 'objectId' },
        nullField: { bsonType: 'null' },
        regexField: { bsonType: 'regex' },
        javascriptField: { bsonType: 'javascript' },
        javascriptWithScopeField: { bsonType: 'javascriptWithScope' },
        minKeyField: { bsonType: 'minKey' },
        maxKeyField: { bsonType: 'maxKey' }
      }
    }
  }
});

await client.close();`}</code>
                </pre>
              </div>

              {/* Views */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  5. Views (Complete)
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient } = require('mongodb');

const client = new MongoClient('mongodb://localhost:27017');
await client.connect();
const db = client.db('myDatabase');

// ===== CREATE VIEW =====

// Create view with aggregation pipeline
await db.createCollection('activeUsers', {
  viewOn: 'users',  // Source collection
  pipeline: [
    { $match: { active: true } },
    { $project: { name: 1, email: 1, lastLogin: 1 } },
    { $sort: { lastLogin: -1 } }
  ]
});

// ===== COMPLEX VIEW WITH AGGREGATION =====

await db.createCollection('userStats', {
  viewOn: 'orders',
  pipeline: [
    {
      $group: {
        _id: '$userId',
        totalOrders: { $sum: 1 },
        totalSpent: { $sum: '$amount' },
        averageOrderValue: { $avg: '$amount' },
        lastOrderDate: { $max: '$createdAt' }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'userInfo'
      }
    },
    {
      $unwind: '$userInfo'
    },
    {
      $project: {
        userId: '$_id',
        userName: '$userInfo.name',
        email: '$userInfo.email',
        totalOrders: 1,
        totalSpent: 1,
        averageOrderValue: 1,
        lastOrderDate: 1
      }
    }
  ]
});

// ===== VIEW WITH COLLATION =====

await db.createCollection('sortedProducts', {
  viewOn: 'products',
  pipeline: [
    { $sort: { name: 1 } }
  ],
  collation: {
    locale: 'en',
    strength: 2,  // Case-insensitive
    caseLevel: false
  }
});

// ===== QUERY VIEW =====

// Views are read-only
const view = db.collection('activeUsers');
const activeUsers = await view.find({}).toArray();

// Can use find operations on views
const filteredView = await view.find({ 
  lastLogin: { $gte: new Date('2024-01-01') } 
}).toArray();

// Can use aggregation on views
const viewAggregation = await view.aggregate([
  { $match: { email: /@gmail.com$/ } },
  { $count: 'gmailUsers' }
]).toArray();

// ===== VIEW CHARACTERISTICS =====

/*
  1. Read-only (no inserts, updates, or deletes)
  2. Computed on-demand (not materialized)
  3. Can be indexed via underlying collection
  4. Can be used in aggregation pipelines
  5. Can have their own read preferences
  6. Support collation
  7. Cannot contain $out or $merge stages
  8. Cannot be renamed
*/

// ===== LIST VIEWS =====

const views = await db.listCollections({ type: 'view' }).toArray();
console.log('Views:');
views.forEach(view => {
  console.log(\`  \${view.name}:\`);
  console.log(\`    - Source: \${view.options.viewOn}\`);
  console.log(\`    - Pipeline: \${JSON.stringify(view.options.pipeline)}\`);
});

// ===== MODIFY VIEW =====

// Modify view pipeline
await db.command({
  collMod: 'activeUsers',
  viewOn: 'users',
  pipeline: [
    { $match: { active: true, verified: true } },  // Added verified
    { $project: { name: 1, email: 1, lastLogin: 1 } },
    { $sort: { lastLogin: -1 } }
  ]
});

// ===== DROP VIEW =====

await db.collection('activeUsers').drop();

// ===== ON-DEMAND MATERIALIZED VIEWS (using $merge) =====

// This is not a true view, but a pattern for materialized views
async function refreshMaterializedView() {
  await db.collection('orders').aggregate([
    {
      $group: {
        _id: '$userId',
        totalOrders: { $sum: 1 },
        totalSpent: { $sum: '$amount' }
      }
    },
    {
      $merge: {
        into: 'userOrderSummary',
        whenMatched: 'replace',
        whenNotMatched: 'insert'
      }
    }
  ]).toArray();
}

// Call this periodically to refresh the materialized view
await refreshMaterializedView();

// ===== VIEW PERFORMANCE CONSIDERATIONS =====

/*
  1. Views execute pipeline on every query (not cached)
  2. Index the underlying collection for better performance
  3. Keep pipelines simple for better performance
  4. Consider materialized views for expensive computations
  5. Views don't support map-reduce operations
*/

await client.close();`}</code>
                </pre>
              </div>

              {/* Time Series Collections */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  6. Time Series Collections (Complete)
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient } = require('mongodb');

const client = new MongoClient('mongodb://localhost:27017');
await client.connect();
const db = client.db('myDatabase');

// ===== CREATE TIME SERIES COLLECTION =====

await db.createCollection('weather', {
  timeseries: {
    timeField: 'timestamp',     // Required: field storing timestamp
    metaField: 'metadata',      // Optional: field for metadata
    granularity: 'hours'        // Optional: 'seconds', 'minutes', 'hours'
  },
  expireAfterSeconds: 2592000   // Optional: TTL in seconds (30 days)
});

// ===== TIME SERIES GRANULARITY =====

/*
  - seconds: High-frequency data (IoT sensors)
  - minutes: Medium-frequency data (application metrics)
  - hours: Low-frequency data (daily analytics)
*/

// ===== COMPLETE TIME SERIES EXAMPLE =====

// Create temperature monitoring collection
await db.createCollection('temperatures', {
  timeseries: {
    timeField: 'timestamp',
    metaField: 'sensor',
    granularity: 'minutes'
  },
  expireAfterSeconds: 86400,  // Delete after 1 day
  
  // Storage engine options
  storageEngine: {
    wiredTiger: {
      configString: 'block_compressor=zstd'
    }
  }
});

// ===== INSERT TIME SERIES DATA =====

const temperatures = db.collection('temperatures');

// Insert single measurement
await temperatures.insertOne({
  timestamp: new Date(),
  sensor: {
    id: 'sensor-001',
    location: 'warehouse-1',
    floor: 2
  },
  temperature: 22.5,
  humidity: 45
});

// Insert multiple measurements
await temperatures.insertMany([
  {
    timestamp: new Date('2024-01-01T10:00:00Z'),
    sensor: { id: 'sensor-001', location: 'warehouse-1' },
    temperature: 21.0,
    humidity: 50
  },
  {
    timestamp: new Date('2024-01-01T10:01:00Z'),
    sensor: { id: 'sensor-001', location: 'warehouse-1' },
    temperature: 21.2,
    humidity: 49
  },
  {
    timestamp: new Date('2024-01-01T10:02:00Z'),
    sensor: { id: 'sensor-001', location: 'warehouse-1' },
    temperature: 21.5,
    humidity: 48
  }
]);

// ===== QUERY TIME SERIES DATA =====

// Query with time range
const recentData = await temperatures.find({
  timestamp: {
    $gte: new Date('2024-01-01T00:00:00Z'),
    $lt: new Date('2024-01-02T00:00:00Z')
  },
  'sensor.id': 'sensor-001'
}).toArray();

// Aggregation on time series
const hourlyAverage = await temperatures.aggregate([
  {
    $match: {
      timestamp: { $gte: new Date('2024-01-01T00:00:00Z') },
      'sensor.location': 'warehouse-1'
    }
  },
  {
    $group: {
      _id: {
        hour: { $dateTrunc: { date: '$timestamp', unit: 'hour' } },
        sensor: '$sensor.id'
      },
      avgTemperature: { $avg: '$temperature' },
      minTemperature: { $min: '$temperature' },
      maxTemperature: { $max: '$temperature' },
      avgHumidity: { $avg: '$humidity' },
      count: { $sum: 1 }
    }
  },
  {
    $sort: { '_id.hour': 1 }
  }
]).toArray();

// ===== WINDOW FUNCTIONS ON TIME SERIES =====

const movingAverage = await temperatures.aggregate([
  {
    $match: { 'sensor.id': 'sensor-001' }
  },
  {
    $setWindowFields: {
      partitionBy: '$sensor.id',
      sortBy: { timestamp: 1 },
      output: {
        movingAvgTemp: {
          $avg: '$temperature',
          window: {
            documents: [-2, 0]  // Current + 2 previous documents
          }
        },
        rollingMinTemp: {
          $min: '$temperature',
          window: {
            range: [-1, 0],
            unit: 'hour'
          }
        }
      }
    }
  }
]).toArray();

// ===== TIME SERIES COLLECTION METADATA =====

// Get collection info
const collInfo = await db.listCollections({ name: 'temperatures' }).next();
console.log('Time series info:', {
  type: collInfo.type,  // 'timeseries'
  options: collInfo.options.timeseries,
  expireAfterSeconds: collInfo.options.expireAfterSeconds
});

// Get statistics
const stats = await temperatures.stats();
console.log('Time series stats:', {
  count: stats.count,
  size: stats.size,
  storageSize: stats.storageSize,
  timeseries: stats.timeseries  // Bucket information
});

// ===== MODIFY TIME SERIES COLLECTION =====

// Modify expireAfterSeconds
await db.command({
  collMod: 'temperatures',
  expireAfterSeconds: 172800  // Change to 2 days
});

// Modify granularity (MongoDB 5.1+)
await db.command({
  collMod: 'temperatures',
  timeseries: {
    granularity: 'hours'  // Change from minutes to hours
  }
});

// ===== SECONDARY INDEXES ON TIME SERIES =====

// Create index on metaField
await temperatures.createIndex({ 'sensor.location': 1 });

// Create compound index
await temperatures.createIndex({ 
  'sensor.location': 1, 
  timestamp: 1 
});

// Create index on measurement field
await temperatures.createIndex({ temperature: 1 });

// ===== TIME SERIES LIMITATIONS =====

/*
  1. Cannot update or delete individual documents
  2. Can only insert documents
  3. Cannot rename time series collections
  4. Cannot use $out or $merge to time series collections
  5. timeField must be a BSON date type
  6. Updates only allowed if they don't modify timeField or metaField
  7. No support for deletes except TTL
  8. Unique indexes not supported except on metaField
*/

// ===== DROP TIME SERIES COLLECTION =====

await temperatures.drop();

// ===== REAL-WORLD TIME SERIES EXAMPLES =====

// Stock prices
await db.createCollection('stockPrices', {
  timeseries: {
    timeField: 'timestamp',
    metaField: 'stock',
    granularity: 'seconds'
  }
});

await db.collection('stockPrices').insertMany([
  {
    timestamp: new Date(),
    stock: { symbol: 'AAPL', exchange: 'NASDAQ' },
    open: 150.00,
    high: 152.00,
    low: 149.50,
    close: 151.00,
    volume: 1000000
  }
]);

// Application metrics
await db.createCollection('appMetrics', {
  timeseries: {
    timeField: 'timestamp',
    metaField: 'host',
    granularity: 'minutes'
  },
  expireAfterSeconds: 604800  // 7 days
});

await db.collection('appMetrics').insertMany([
  {
    timestamp: new Date(),
    host: { name: 'server-01', region: 'us-east' },
    cpu: 45.5,
    memory: 70.2,
    diskIO: 1200,
    networkIO: 5000
  }
]);

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

              {/* Database Operations in Mongoose */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-purple-300">
                  1. Database Operations in Mongoose
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const mongoose = require('mongoose');

await mongoose.connect('mongodb://localhost:27017/myDatabase');

// ===== ACCESS DATABASE =====

// Get database instance
const db = mongoose.connection.db;

// Get specific database
const otherDb = mongoose.connection.useDb('otherDatabase');

// ===== DATABASE OPERATIONS =====

// List all databases (requires admin connection)
const adminDb = mongoose.connection.db.admin();
const { databases } = await adminDb.listDatabases();

console.log('Databases:');
databases.forEach(db => {
  console.log(\`  - \${db.name}: \${db.sizeOnDisk} bytes\`);
});

// Get database stats
const stats = await db.stats();
console.log('Database stats:', {
  collections: stats.collections,
  dataSize: stats.dataSize,
  indexes: stats.indexes,
  objects: stats.objects
});

// Drop current database
await mongoose.connection.dropDatabase();

// ===== MULTIPLE DATABASES =====

const db1 = mongoose.connection.useDb('database1');
const db2 = mongoose.connection.useDb('database2');

// Create models on different databases
const schema = new mongoose.Schema({ name: String });
const Model1 = db1.model('User', schema);
const Model2 = db2.model('User', schema);

await Model1.create({ name: 'User in database1' });
await Model2.create({ name: 'User in database2' });

// ===== DATABASE EVENTS =====

mongoose.connection.on('connected', () => {
  console.log('Database connected');
  console.log('Database name:', mongoose.connection.name);
});

mongoose.connection.db.on('close', () => {
  console.log('Database connection closed');
});

await mongoose.disconnect();`}</code>
                </pre>
              </div>

              {/* Collection Operations in Mongoose */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-purple-300">
                  2. Collection Operations in Mongoose
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const mongoose = require('mongoose');

await mongoose.connect('mongodb://localhost:27017/myDatabase');

// ===== CREATE COLLECTION VIA SCHEMA =====

const userSchema = new mongoose.Schema({
  name: String,
  email: String
}, {
  collection: 'users',  // Explicit collection name
  capped: false,        // Not capped by default
  autoIndex: true,      // Build indexes automatically
  autoCreate: true      // Create collection automatically
});

const User = mongoose.model('User', userSchema);

// Collection is created on first write
await User.create({ name: 'Alice', email: 'alice@example.com' });

// ===== ACCESS UNDERLYING COLLECTION =====

const collection = User.collection;

// Use native MongoDB operations
await collection.insertOne({ name: 'Bob', email: 'bob@example.com' });

// ===== CREATE COLLECTION EXPLICITLY =====

await mongoose.connection.createCollection('products');

// Create with options
await mongoose.connection.createCollection('orders', {
  capped: true,
  size: 10000000,
  max: 5000
});

// ===== LIST COLLECTIONS =====

const db = mongoose.connection.db;
const collections = await db.listCollections().toArray();

console.log('Collections:');
collections.forEach(coll => {
  console.log(\`  - \${coll.name}\`);
});

// ===== DROP COLLECTION =====

// Drop via model
await User.collection.drop();

// Drop directly
await mongoose.connection.dropCollection('users');

// Drop if exists
if (mongoose.connection.collections['users']) {
  await mongoose.connection.collections['users'].drop();
}

// ===== RENAME COLLECTION =====

await User.collection.rename('customers');

// ===== COLLECTION STATISTICS =====

const stats = await User.collection.stats();
console.log('Collection stats:', {
  count: stats.count,
  size: stats.size,
  avgObjSize: stats.avgObjSize,
  storageSize: stats.storageSize,
  nindexes: stats.nindexes
});

// ===== GET COLLECTION NAME =====

console.log('Collection name:', User.collection.name);
console.log('Collection namespace:', User.collection.namespace);

await mongoose.disconnect();`}</code>
                </pre>
              </div>

              {/* Schema with Validation */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-purple-300">
                  3. Schema Validation in Mongoose
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const mongoose = require('mongoose');

await mongoose.connect('mongodb://localhost:27017/myDatabase');

// ===== MONGOOSE SCHEMA WITH VALIDATION =====

const userSchema = new mongoose.Schema({
  // String validation
  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [100, 'Name cannot exceed 100 characters'],
    trim: true,
    lowercase: false,
    uppercase: false,
    match: [/^[a-zA-Z\\s]+$/, 'Name can only contain letters']
  },
  
  // Email with custom validation
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/, 'Invalid email format'],
    validate: {
      validator: async function(value) {
        const count = await this.constructor.countDocuments({ email: value });
        return count === 0;
      },
      message: 'Email must be unique'
    }
  },
  
  // Number validation
  age: {
    type: Number,
    required: true,
    min: [0, 'Age cannot be negative'],
    max: [150, 'Age cannot exceed 150'],
    validate: {
      validator: Number.isInteger,
      message: 'Age must be an integer'
    }
  },
  
  // Enum validation
  role: {
    type: String,
    enum: {
      values: ['admin', 'user', 'guest'],
      message: 'Role must be admin, user, or guest'
    },
    default: 'user'
  },
  
  // Array validation
  tags: {
    type: [String],
    validate: {
      validator: function(arr) {
        return arr.length <= 10;
      },
      message: 'Cannot have more than 10 tags'
    }
  },
  
  // Nested object validation
  address: {
    street: {
      type: String,
      required: function() {
        return this.address != null;
      }
    },
    city: {
      type: String,
      required: function() {
        return this.address != null;
      }
    },
    zipCode: {
      type: String,
      match: /^[0-9]{5}(-[0-9]{4})?$/
    },
    country: {
      type: String,
      enum: ['USA', 'Canada', 'Mexico']
    }
  },
  
  // Date validation
  birthDate: {
    type: Date,
    validate: {
      validator: function(date) {
        return date < new Date();
      },
      message: 'Birth date must be in the past'
    }
  },
  
  // Custom validation
  password: {
    type: String,
    required: true,
    minlength: 8,
    validate: [
      {
        validator: function(value) {
          return /[A-Z]/.test(value);
        },
        message: 'Password must contain uppercase letter'
      },
      {
        validator: function(value) {
          return /[a-z]/.test(value);
        },
        message: 'Password must contain lowercase letter'
      },
      {
        validator: function(value) {
          return /[0-9]/.test(value);
        },
        message: 'Password must contain number'
      },
      {
        validator: function(value) {
          return /[!@#$%^&*]/.test(value);
        },
        message: 'Password must contain special character'
      }
    ]
  },
  
  // Async validation
  username: {
    type: String,
    required: true,
    validate: {
      validator: async function(value) {
        // Simulate async operation (e.g., API call)
        await new Promise(resolve => setTimeout(resolve, 100));
        return value.length >= 3;
      },
      message: 'Username must be at least 3 characters'
    }
  }
}, {
  // Schema options
  timestamps: true,  // Add createdAt and updatedAt
  validateBeforeSave: true,  // Validate before saving
  strict: true,      // Only allow fields defined in schema
  strictQuery: false  // Allow any field in queries
});

const User = mongoose.model('User', userSchema);

// ===== VALIDATION ON SAVE =====

try {
  const user = new User({
    name: 'Alice',
    email: 'alice@example.com',
    age: 25,
    role: 'user',
    password: 'SecurePass123!'
  });
  
  await user.save();  // Validation runs here
} catch (error) {
  if (error.name === 'ValidationError') {
    console.log('Validation errors:');
    Object.keys(error.errors).forEach(key => {
      console.log(\`  \${key}: \${error.errors[key].message}\`);
    });
  }
}

// ===== VALIDATION ON UPDATE =====

try {
  await User.updateOne(
    { email: 'alice@example.com' },
    { age: -5 },
    { runValidators: true }  // Must enable for updates
  );
} catch (error) {
  console.log('Update validation failed:', error.message);
}

// ===== SKIP VALIDATION =====

const user = new User({ name: 'Bob' });
await user.save({ validateBeforeSave: false });

// ===== MANUAL VALIDATION =====

const testUser = new User({ name: 'Test', age: 200 });
const validationError = testUser.validateSync();
if (validationError) {
  console.log('Validation failed:', validationError.message);
}

// Async validation
try {
  await testUser.validate();
} catch (error) {
  console.log('Async validation failed:', error.message);
}

// ===== MONGODB NATIVE VALIDATION (via Mongoose) =====

// Add JSON Schema validation to existing collection
await mongoose.connection.db.command({
  collMod: 'users',
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'email'],
      properties: {
        name: { bsonType: 'string' },
        email: { bsonType: 'string' }
      }
    }
  },
  validationLevel: 'strict',
  validationAction: 'error'
});

await mongoose.disconnect();`}</code>
                </pre>
              </div>

              {/* Capped Collections in Mongoose */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-purple-300">
                  4. Capped Collections in Mongoose
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const mongoose = require('mongoose');

await mongoose.connect('mongodb://localhost:27017/myDatabase');

// ===== CREATE CAPPED COLLECTION SCHEMA =====

const logSchema = new mongoose.Schema({
  level: String,
  message: String,
  timestamp: { type: Date, default: Date.now }
}, {
  capped: {
    size: 5242880,  // 5MB in bytes
    max: 10000,     // Maximum 10000 documents
    autoIndexId: true  // Create _id index (default: true)
  }
});

const Log = mongoose.model('Log', logSchema);

// Collection is created as capped on first operation

// ===== INSERT INTO CAPPED COLLECTION =====

await Log.create({
  level: 'info',
  message: 'Application started'
});

// Bulk insert
for (let i = 0; i < 100; i++) {
  await Log.create({
    level: 'debug',
    message: \`Debug message \${i}\`
  });
}

// ===== QUERY CAPPED COLLECTION =====

// Normal query
const logs = await Log.find().limit(10);

// Query in reverse order (newest first)
const recentLogs = await Log.find().sort({ $natural: -1 }).limit(10);

// ===== TAILABLE CURSOR IN MONGOOSE =====

// Create tailable cursor
const cursor = Log.find().tailable({ awaitData: true }).cursor();

// Process documents as they arrive
cursor.on('data', (doc) => {
  console.log('New log:', doc);
});

cursor.on('error', (error) => {
  console.error('Cursor error:', error);
});

// ===== CREATE CAPPED COLLECTION EXPLICITLY =====

await mongoose.connection.createCollection('notifications', {
  capped: true,
  size: 1048576,  // 1MB
  max: 100
});

// ===== CHECK IF COLLECTION IS CAPPED =====

const isCapped = Log.collection.isCapped();
console.log('Is capped:', isCapped);

// ===== CONVERT TO CAPPED =====

// Convert existing collection to capped
await mongoose.connection.db.command({
  convertToCapped: 'regularCollection',
  size: 10000000
});

// ===== SCHEMA OPTIONS FOR CAPPED COLLECTIONS =====

const cappedSchema = new mongoose.Schema({
  data: String
}, {
  capped: {
    size: 1024 * 1024,  // 1MB
    max: 1000,
    autoIndexId: false   // Don't create _id index
  },
  timestamps: true,
  strict: true
});

const CappedModel = mongoose.model('CappedModel', cappedSchema);

await mongoose.disconnect();`}</code>
                </pre>
              </div>

              {/* Views in Mongoose */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-purple-300">
                  5. Views in Mongoose
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const mongoose = require('mongoose');

await mongoose.connect('mongodb://localhost:27017/myDatabase');

// First, create source collection with model
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  active: Boolean,
  role: String,
  tags: [String],
  createdAt: Date
});

const User = mongoose.model('User', userSchema);

// ===== CREATE VIEW USING NATIVE DRIVER =====

const db = mongoose.connection.db;

await db.createCollection('activeUsers', {
  viewOn: 'users',
  pipeline: [
    { $match: { active: true } },
    { $project: { name: 1, email: 1 } }
  ]
});

// ===== ACCESS VIEW AS MODEL =====

// Create a schema for the view (matching projection)
const activeUserSchema = new mongoose.Schema({
  name: String,
  email: String
}, {
  strict: false,  // Views might have different fields
  collection: 'activeUsers'  // Specify view name
});

const ActiveUser = mongoose.model('ActiveUser', activeUserSchema);

// Query the view
const activeUsers = await ActiveUser.find();

// ===== COMPLEX VIEW =====

await db.createCollection('userStatistics', {
  viewOn: 'users',
  pipeline: [
    {
      $group: {
        _id: '$role',
        count: { $sum: 1 },
        users: { $push: '$name' }
      }
    },
    {
      $project: {
        role: '$_id',
        userCount: '$count',
        userList: '$users',
        _id: 0
      }
    }
  ]
});

// Create model for view
const UserStatSchema = new mongoose.Schema({
  role: String,
  userCount: Number,
  userList: [String]
}, {
  strict: false,
  collection: 'userStatistics'
});

const UserStatistics = mongoose.model('UserStatistics', UserStatSchema);

// Query view
const stats = await UserStatistics.find();

// ===== MODIFY VIEW =====

await db.command({
  collMod: 'activeUsers',
  viewOn: 'users',
  pipeline: [
    { $match: { active: true, role: 'admin' } },  // Modified
    { $project: { name: 1, email: 1, role: 1 } }
  ]
});

// ===== DROP VIEW =====

await ActiveUser.collection.drop();

// Or directly
await db.collection('activeUsers').drop();

// ===== VIEW WITH AGGREGATION =====

// Views can be used in aggregation pipelines
const result = await ActiveUser.aggregate([
  { $match: { name: /^A/ } },
  { $count: 'usersStartingWithA' }
]);

// ===== LIST VIEWS =====

const collections = await db.listCollections({ type: 'view' }).toArray();
console.log('Views:');
collections.forEach(view => {
  console.log(\`  - \${view.name}\`);
  console.log(\`    Source: \${view.options.viewOn}\`);
  console.log(\`    Pipeline: \${JSON.stringify(view.options.pipeline)}\`);
});

await mongoose.disconnect();`}</code>
                </pre>
              </div>

              {/* Time Series in Mongoose */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-purple-300">
                  6. Time Series Collections in Mongoose
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const mongoose = require('mongoose');

await mongoose.connect('mongodb://localhost:27017/myDatabase');

// ===== CREATE TIME SERIES COLLECTION =====

const db = mongoose.connection.db;

await db.createCollection('temperatures', {
  timeseries: {
    timeField: 'timestamp',
    metaField: 'metadata',
    granularity: 'hours'
  },
  expireAfterSeconds: 86400  // 1 day TTL
});

// ===== CREATE SCHEMA FOR TIME SERIES =====

const tempSchema = new mongoose.Schema({
  timestamp: { type: Date, required: true },
  metadata: {
    sensorId: String,
    location: String
  },
  temperature: Number,
  humidity: Number
}, {
  timeseries: {
    timeField: 'timestamp',
    metaField: 'metadata',
    granularity: 'hours'
  },
  collection: 'temperatures',
  autoCreate: false,  // Collection already created
  expires: 86400  // TTL in seconds
});

const Temperature = mongoose.model('Temperature', tempSchema);

// ===== INSERT TIME SERIES DATA =====

await Temperature.create({
  timestamp: new Date(),
  metadata: {
    sensorId: 'sensor-001',
    location: 'warehouse-1'
  },
  temperature: 22.5,
  humidity: 45
});

// Bulk insert
await Temperature.insertMany([
  {
    timestamp: new Date('2024-01-01T10:00:00Z'),
    metadata: { sensorId: 'sensor-001', location: 'warehouse-1' },
    temperature: 21.0,
    humidity: 50
  },
  {
    timestamp: new Date('2024-01-01T11:00:00Z'),
    metadata: { sensorId: 'sensor-001', location: 'warehouse-1' },
    temperature: 21.5,
    humidity: 49
  }
]);

// ===== QUERY TIME SERIES =====

// Find by time range
const recentTemps = await Temperature.find({
  timestamp: {
    $gte: new Date('2024-01-01T00:00:00Z'),
    $lt: new Date('2024-01-02T00:00:00Z')
  },
  'metadata.sensorId': 'sensor-001'
});

// Find latest reading
const latest = await Temperature.findOne()
  .sort({ timestamp: -1 });

// ===== AGGREGATION ON TIME SERIES =====

// Hourly averages
const hourlyAvg = await Temperature.aggregate([
  {
    $match: {
      timestamp: { $gte: new Date('2024-01-01T00:00:00Z') }
    }
  },
  {
    $group: {
      _id: {
        hour: { $dateTrunc: { date: '$timestamp', unit: 'hour' } },
        sensor: '$metadata.sensorId'
      },
      avgTemp: { $avg: '$temperature' },
      avgHumidity: { $avg: '$humidity' },
      count: { $sum: 1 }
    }
  },
  {
    $sort: { '_id.hour': 1 }
  }
]);

// Moving average with window functions
const movingAvg = await Temperature.aggregate([
  {
    $setWindowFields: {
      partitionBy: '$metadata.sensorId',
      sortBy: { timestamp: 1 },
      output: {
        movingAvgTemp: {
          $avg: '$temperature',
          window: { documents: [-2, 0] }
        }
      }
    }
  }
]);

// ===== MODIFY TIME SERIES COLLECTION =====

// Change TTL
await db.command({
  collMod: 'temperatures',
  expireAfterSeconds: 172800  // 2 days
});

// ===== CREATE INDEX ON TIME SERIES =====

await Temperature.collection.createIndex({ 'metadata.location': 1 });
await Temperature.collection.createIndex({ 'metadata.sensorId': 1, timestamp: 1 });

// ===== GET TIME SERIES INFO =====

const stats = await Temperature.collection.stats();
console.log('Time series stats:', stats.timeseries);

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
                  <strong>Use explicit collection names:</strong> Define
                  collection names in schemas to avoid pluralization issues
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Enable validation:</strong> Use schema validation to
                  maintain data quality
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Capped collections for logs:</strong> Use capped
                  collections for high-volume, time-based data
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Views for complex queries:</strong> Create views to
                  simplify repeated aggregations
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Time series for metrics:</strong> Use time series
                  collections for IoT, metrics, and analytics
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Database per environment:</strong> Separate databases
                  for dev, staging, and production
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Collation for internationalization:</strong> Use
                  collation for proper sorting of international text
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Index before validating:</strong> Create indexes
                  before adding validation to improve performance
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Monitor collection sizes:</strong> Regularly check
                  collection statistics to manage storage
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>TTL for temporary data:</strong> Use
                  expireAfterSeconds for auto-deletion of old data
                </span>
              </li>
            </ul>
          </section>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8">
            <Link
              href="/phase1/connection"
              className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              ← Previous: Connection
            </Link>
            <Link
              href="/phase1/bson-types"
              className="bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-500 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              Next: BSON Types →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
