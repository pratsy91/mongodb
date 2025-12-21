"use client";

import Link from "next/link";
import { useState } from "react";

export default function BulkOperationsPage() {
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
          Bulk Operations
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Complete guide to bulk write operations, ordered and unordered
          execution
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
                What are Bulk Operations?
              </h3>
              <p className="text-lg">
                Bulk operations allow you to perform multiple write operations
                (insert, update, delete) in a single request, improving
                performance by reducing network round trips.
              </p>

              <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                Ordered vs Unordered
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Ordered (default):</strong> Operations executed
                  sequentially; stops on first error
                </li>
                <li>
                  <strong>Unordered:</strong> Operations executed in parallel;
                  continues after errors for better performance
                </li>
              </ul>

              <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                Bulk Write Operations
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>insertOne:</strong> Insert single document
                </li>
                <li>
                  <strong>updateOne:</strong> Update first matching document
                </li>
                <li>
                  <strong>updateMany:</strong> Update all matching documents
                </li>
                <li>
                  <strong>replaceOne:</strong> Replace entire document
                </li>
                <li>
                  <strong>deleteOne:</strong> Delete first matching document
                </li>
                <li>
                  <strong>deleteMany:</strong> Delete all matching documents
                </li>
              </ul>

              <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                Performance Benefits
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Reduced network round trips</li>
                <li>Better throughput for large batches</li>
                <li>Atomic execution within single batch</li>
                <li>Efficient use of server resources</li>
              </ul>
            </div>
          </section>

          {/* MongoDB Native Driver Examples */}
          {activeTab === "mongodb" && (
            <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
              <h2 className="text-3xl font-bold mb-6 text-blue-300">
                MongoDB Native Driver Examples
              </h2>

              {/* Basic Bulk Write */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  1. Basic Bulk Write Operations
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient } = require('mongodb');

const client = new MongoClient('mongodb://localhost:27017');
await client.connect();
const db = client.db('myDatabase');
const users = db.collection('users');

// ===== BASIC BULK WRITE =====

const result = await users.bulkWrite([
  // Insert operations
  {
    insertOne: {
      document: { name: 'Alice', email: 'alice@example.com', age: 28 }
    }
  },
  {
    insertOne: {
      document: { name: 'Bob', email: 'bob@example.com', age: 32 }
    }
  },
  
  // Update operations
  {
    updateOne: {
      filter: { name: 'Alice' },
      update: { $set: { active: true } }
    }
  },
  {
    updateMany: {
      filter: { age: { $gte: 30 } },
      update: { $set: { senior: true } }
    }
  },
  
  // Replace operation
  {
    replaceOne: {
      filter: { name: 'Bob' },
      replacement: { name: 'Bob Smith', email: 'bob@example.com', age: 33 }
    }
  },
  
  // Delete operations
  {
    deleteOne: {
      filter: { name: 'OldUser' }
    }
  },
  {
    deleteMany: {
      filter: { active: false }
    }
  }
]);

// ===== BULK WRITE RESULT =====

console.log('Bulk write result:', {
  acknowledged: result.acknowledged,
  insertedCount: result.insertedCount,
  insertedIds: result.insertedIds,
  matchedCount: result.matchedCount,
  modifiedCount: result.modifiedCount,
  deletedCount: result.deletedCount,
  upsertedCount: result.upsertedCount,
  upsertedIds: result.upsertedIds
});

// ===== ORDERED BULK WRITE (DEFAULT) =====

try {
  await users.bulkWrite([
    {
      insertOne: {
        document: { _id: 1, name: 'User 1' }
      }
    },
    {
      insertOne: {
        document: { _id: 1, name: 'Duplicate' }  // Error here
      }
    },
    {
      insertOne: {
        document: { _id: 2, name: 'User 2' }  // Won't execute
      }
    }
  ], {
    ordered: true  // Default behavior
  });
} catch (error) {
  console.log('Error in ordered bulk write');
  console.log('Operations executed before error:', error.result.nInserted);
}

// ===== UNORDERED BULK WRITE =====

try {
  await users.bulkWrite([
    {
      insertOne: {
        document: { _id: 10, name: 'User 10' }
      }
    },
    {
      insertOne: {
        document: { _id: 10, name: 'Duplicate' }  // Error, but continues
      }
    },
    {
      insertOne: {
        document: { _id: 11, name: 'User 11' }  // Still executes
      }
    }
  ], {
    ordered: false  // Continue on error
  });
} catch (error) {
  console.log('Unordered bulk write completed with errors');
  console.log('Successful operations:', error.result.nInserted);
  console.log('Write errors:', error.writeErrors);
}

await client.close();`}</code>
                </pre>
              </div>

              {/* Advanced Bulk Operations */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  2. Advanced Bulk Write Operations
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient } = require('mongodb');

const client = new MongoClient('mongodb://localhost:27017');
await client.connect();
const db = client.db('myDatabase');
const products = db.collection('products');

// ===== UPSERT IN BULK =====

await products.bulkWrite([
  {
    updateOne: {
      filter: { sku: 'PROD001' },
      update: { 
        $set: { 
          name: 'Product 1', 
          price: 99.99 
        }
      },
      upsert: true  // Create if doesn't exist
    }
  },
  {
    updateOne: {
      filter: { sku: 'PROD002' },
      update: { 
        $set: { 
          name: 'Product 2', 
          price: 149.99 
        }
      },
      upsert: true
    }
  }
]);

// ===== BULK WITH ALL UPDATE OPERATORS =====

await products.bulkWrite([
  // $set
  {
    updateOne: {
      filter: { sku: 'PROD001' },
      update: { $set: { category: 'electronics' } }
    }
  },
  
  // $inc
  {
    updateMany: {
      filter: { category: 'electronics' },
      update: { $inc: { views: 1 } }
    }
  },
  
  // $push
  {
    updateOne: {
      filter: { sku: 'PROD002' },
      update: { 
        $push: { 
          tags: { 
            $each: ['featured', 'sale'],
            $position: 0
          }
        }
      }
    }
  },
  
  // $pull
  {
    updateMany: {
      filter: {},
      update: { $pull: { tags: 'deprecated' } }
    }
  },
  
  // $currentDate
  {
    updateMany: {
      filter: { modified: true },
      update: { $currentDate: { lastModified: true } }
    }
  }
]);

// ===== BULK WITH ARRAY FILTERS =====

await products.bulkWrite([
  {
    updateOne: {
      filter: { sku: 'PROD003' },
      update: {
        $set: { 
          'reviews.$[review].verified': true 
        }
      },
      arrayFilters: [
        { 'review.rating': { $gte: 4 } }
      ]
    }
  }
]);

// ===== LARGE BATCH PROCESSING =====

// Generate 10,000 operations
const operations = [];
for (let i = 0; i < 10000; i++) {
  operations.push({
    insertOne: {
      document: {
        name: \`Product \${i}\`,
        price: Math.random() * 1000,
        sku: \`SKU\${i.toString().padStart(5, '0')}\`
      }
    }
  });
}

// Execute bulk write
const result = await products.bulkWrite(operations, {
  ordered: false  // Faster for large batches
});

console.log(\`Inserted \${result.insertedCount} products\`);

// ===== BATCH PROCESSING WITH CHUNKS =====

async function bulkWriteInChunks(collection, operations, chunkSize = 1000) {
  const results = [];
  
  for (let i = 0; i < operations.length; i += chunkSize) {
    const chunk = operations.slice(i, i + chunkSize);
    try {
      const result = await collection.bulkWrite(chunk, { ordered: false });
      results.push({
        success: true,
        ...result
      });
    } catch (error) {
      results.push({
        success: false,
        error: error.message,
        result: error.result
      });
    }
    
    console.log(\`Processed \${Math.min(i + chunkSize, operations.length)}/\${operations.length}\`);
  }
  
  return results;
}

// Usage
const allOperations = [
  /* ... many operations ... */
];
const results = await bulkWriteInChunks(products, allOperations, 500);

await client.close();`}</code>
                </pre>
              </div>

              {/* Bulk Write with Options */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  3. Bulk Write Options and Error Handling
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient } = require('mongodb');

const client = new MongoClient('mongodb://localhost:27017');
await client.connect();
const db = client.db('myDatabase');
const orders = db.collection('orders');

// ===== BULK WRITE WITH ALL OPTIONS =====

await orders.bulkWrite(
  [
    {
      insertOne: {
        document: { orderId: 'ORD001', total: 100 }
      }
    },
    {
      updateOne: {
        filter: { orderId: 'ORD002' },
        update: { $set: { status: 'shipped' } }
      }
    }
  ],
  {
    // Ordered execution (default: true)
    ordered: false,
    
    // Write concern
    writeConcern: {
      w: 'majority',
      j: true,
      wtimeout: 5000
    },
    
    // Bypass document validation
    bypassDocumentValidation: false,
    
    // Comment
    comment: 'Bulk update from API'
  }
);

// ===== ERROR HANDLING =====

try {
  await orders.bulkWrite([
    {
      insertOne: {
        document: { _id: 1, orderId: 'ORD001' }
      }
    },
    {
      insertOne: {
        document: { _id: 1, orderId: 'ORD002' }  // Duplicate
      }
    },
    {
      updateOne: {
        filter: { orderId: 'INVALID' },
        update: { $set: { status: 'failed' } }
      }
    }
  ], {
    ordered: false
  });
} catch (error) {
  console.log('Bulk write error:', {
    message: error.message,
    code: error.code,
    writeErrors: error.writeErrors,
    writeConcernErrors: error.writeConcernErrors,
    result: {
      nInserted: error.result.nInserted,
      nUpserted: error.result.nUpserted,
      nMatched: error.result.nMatched,
      nModified: error.result.nModified,
      nRemoved: error.result.nRemoved
    }
  });
  
  // Process individual errors
  if (error.writeErrors) {
    error.writeErrors.forEach((err, index) => {
      console.log(\`Operation \${index} failed:\`, {
        code: err.code,
        message: err.errmsg,
        operation: err.op
      });
    });
  }
}

// ===== RETRY FAILED OPERATIONS =====

async function bulkWriteWithRetry(collection, operations, maxRetries = 3) {
  let remainingOps = [...operations];
  let attempt = 0;
  
  while (attempt < maxRetries && remainingOps.length > 0) {
    try {
      const result = await collection.bulkWrite(remainingOps, {
        ordered: false
      });
      return result;  // Success
    } catch (error) {
      attempt++;
      
      if (error.writeErrors) {
        // Retry only operations that failed due to temporary errors
        const retryableOps = error.writeErrors
          .filter(err => err.code === 50)  // Example: temporary error
          .map(err => remainingOps[err.index]);
        
        if (retryableOps.length === 0 || attempt >= maxRetries) {
          throw error;
        }
        
        remainingOps = retryableOps;
        console.log(\`Retrying \${remainingOps.length} operations (attempt \${attempt})\`);
        
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      } else {
        throw error;
      }
    }
  }
}

// ===== BULK WRITE WITH TRANSACTIONS =====

const session = client.startSession();
try {
  await session.withTransaction(async () => {
    await orders.bulkWrite([
      {
        insertOne: {
          document: { orderId: 'ORD003', total: 150 }
        }
      },
      {
        updateOne: {
          filter: { orderId: 'ORD003' },
          update: { $set: { status: 'pending' } }
        }
      }
    ], { session });
  });
} finally {
  await session.endSession();
}

// ===== BULK WRITE PERFORMANCE MONITORING =====

async function monitoredBulkWrite(collection, operations) {
  const startTime = Date.now();
  const startMemory = process.memoryUsage().heapUsed;
  
  try {
    const result = await collection.bulkWrite(operations, { ordered: false });
    
    const duration = Date.now() - startTime;
    const memoryUsed = process.memoryUsage().heapUsed - startMemory;
    
    console.log('Bulk write performance:', {
      duration: \`\${duration}ms\`,
      operationsPerSecond: (operations.length / duration * 1000).toFixed(2),
      memoryUsed: \`\${(memoryUsed / 1024 / 1024).toFixed(2)} MB\`,
      totalOperations: operations.length,
      successful: {
        inserted: result.insertedCount,
        updated: result.modifiedCount,
        deleted: result.deletedCount
      }
    });
    
    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error('Bulk write failed after', duration, 'ms');
    throw error;
  }
}

await client.close();`}</code>
                </pre>
              </div>

              {/* Practical Bulk Patterns */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  4. Practical Bulk Operation Patterns
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient } = require('mongodb');

const client = new MongoClient('mongodb://localhost:27017');
await client.connect();
const db = client.db('myDatabase');

// ===== DATA IMPORT PATTERN =====

async function importData(collection, records) {
  const operations = records.map(record => ({
    insertOne: { document: record }
  }));
  
  return await collection.bulkWrite(operations, {
    ordered: false  // Continue on duplicates
  });
}

// Usage
const records = [
  { id: 1, name: 'Record 1' },
  { id: 2, name: 'Record 2' }
];
await importData(db.collection('imports'), records);

// ===== SYNC PATTERN (UPSERT ALL) =====

async function syncCollection(collection, records, keyField = '_id') {
  const operations = records.map(record => ({
    updateOne: {
      filter: { [keyField]: record[keyField] },
      update: { $set: record },
      upsert: true
    }
  }));
  
  return await collection.bulkWrite(operations, {
    ordered: false
  });
}

// Usage
const products = [
  { sku: 'PROD001', name: 'Product 1', price: 99.99 },
  { sku: 'PROD002', name: 'Product 2', price: 149.99 }
];
await syncCollection(db.collection('products'), products, 'sku');

// ===== BULK UPDATE PATTERN =====

async function bulkUpdate(collection, updates) {
  const operations = updates.map(({ filter, update }) => ({
    updateOne: { filter, update }
  }));
  
  return await collection.bulkWrite(operations, {
    ordered: false
  });
}

// Usage
const updates = [
  { 
    filter: { _id: 1 }, 
    update: { $set: { status: 'active' } } 
  },
  { 
    filter: { _id: 2 }, 
    update: { $inc: { views: 1 } } 
  }
];
await bulkUpdate(db.collection('users'), updates);

// ===== CONDITIONAL BULK WRITE =====

async function conditionalBulkWrite(collection, items) {
  const operations = items.map(item => {
    if (item.action === 'insert') {
      return {
        insertOne: { document: item.data }
      };
    } else if (item.action === 'update') {
      return {
        updateOne: {
          filter: item.filter,
          update: item.update
        }
      };
    } else if (item.action === 'delete') {
      return {
        deleteOne: { filter: item.filter }
      };
    }
  }).filter(Boolean);
  
  return await collection.bulkWrite(operations, {
    ordered: false
  });
}

// Usage
const items = [
  { action: 'insert', data: { name: 'New Item' } },
  { action: 'update', filter: { _id: 1 }, update: { $set: { active: true } } },
  { action: 'delete', filter: { _id: 2 } }
];
await conditionalBulkWrite(db.collection('items'), items);

// ===== MERGE COLLECTIONS PATTERN =====

async function mergeCollections(sourceCol, targetCol, keyField = '_id') {
  const sourceDocs = await sourceCol.find().toArray();
  
  const operations = sourceDocs.map(doc => ({
    updateOne: {
      filter: { [keyField]: doc[keyField] },
      update: { $set: doc },
      upsert: true
    }
  }));
  
  return await targetCol.bulkWrite(operations, {
    ordered: false
  });
}

// Usage
await mergeCollections(
  db.collection('source'),
  db.collection('target'),
  'uniqueId'
);

// ===== BATCH DELETE PATTERN =====

async function batchDelete(collection, ids) {
  const operations = ids.map(id => ({
    deleteOne: { filter: { _id: id } }
  }));
  
  return await collection.bulkWrite(operations, {
    ordered: false
  });
}

// Usage
const idsToDelete = [1, 2, 3, 4, 5];
await batchDelete(db.collection('temp'), idsToDelete);

// ===== AGGREGATE AND UPDATE PATTERN =====

async function aggregateAndUpdate(collection) {
  // Find documents needing update
  const docs = await collection.aggregate([
    {
      $match: { needsUpdate: true }
    },
    {
      $project: {
        _id: 1,
        newValue: { $multiply: ['$value', 1.1] }
      }
    }
  ]).toArray();
  
  // Bulk update
  const operations = docs.map(doc => ({
    updateOne: {
      filter: { _id: doc._id },
      update: { 
        $set: { 
          value: doc.newValue,
          needsUpdate: false
        }
      }
    }
  }));
  
  return await collection.bulkWrite(operations, {
    ordered: false
  });
}

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

              {/* Bulk Write in Mongoose */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-purple-300">
                  1. Bulk Write in Mongoose
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const mongoose = require('mongoose');

await mongoose.connect('mongodb://localhost:27017/myDatabase');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number,
  active: Boolean
});

const User = mongoose.model('User', userSchema);

// ===== BASIC BULK WRITE =====

const result = await User.bulkWrite([
  {
    insertOne: {
      document: { name: 'Alice', email: 'alice@example.com', age: 28 }
    }
  },
  {
    updateOne: {
      filter: { name: 'Bob' },
      update: { $set: { active: true } }
    }
  },
  {
    updateMany: {
      filter: { age: { $gte: 30 } },
      update: { $set: { senior: true } }
    }
  },
  {
    replaceOne: {
      filter: { name: 'Carol' },
      replacement: { name: 'Carol White', email: 'carol@example.com' }
    }
  },
  {
    deleteOne: {
      filter: { name: 'OldUser' }
    }
  },
  {
    deleteMany: {
      filter: { active: false }
    }
  }
]);

console.log('Bulk write result:', {
  insertedCount: result.insertedCount,
  matchedCount: result.matchedCount,
  modifiedCount: result.modifiedCount,
  deletedCount: result.deletedCount,
  upsertedCount: result.upsertedCount
});

// ===== ORDERED VS UNORDERED =====

// Ordered (default)
await User.bulkWrite([
  { insertOne: { document: { name: 'User1' } } },
  { insertOne: { document: { name: 'User2' } } }
], {
  ordered: true
});

// Unordered
await User.bulkWrite([
  { insertOne: { document: { name: 'User3' } } },
  { insertOne: { document: { name: 'User4' } } }
], {
  ordered: false
});

// ===== WITH VALIDATION =====

await User.bulkWrite([
  {
    updateOne: {
      filter: { email: 'test@example.com' },
      update: { $set: { age: 25 } }
    }
  }
], {
  runValidators: true  // Run Mongoose validation
});

// ===== UPSERT IN BULK =====

await User.bulkWrite([
  {
    updateOne: {
      filter: { email: 'new@example.com' },
      update: { 
        $set: { 
          name: 'New User', 
          active: true 
        }
      },
      upsert: true
    }
  }
]);

// ===== WITH WRITE CONCERN =====

await User.bulkWrite([
  {
    insertOne: {
      document: { name: 'Important User', email: 'important@example.com' }
    }
  }
], {
  writeConcern: {
    w: 'majority',
    j: true,
    wtimeout: 5000
  }
});

await mongoose.disconnect();`}</code>
                </pre>
              </div>

              {/* Advanced Mongoose Bulk */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-purple-300">
                  2. Advanced Bulk Operations in Mongoose
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const mongoose = require('mongoose');

await mongoose.connect('mongodb://localhost:27017/myDatabase');

const Product = mongoose.model('Product', new mongoose.Schema({
  sku: String,
  name: String,
  price: Number,
  stock: Number
}));

// ===== IMPORT DATA PATTERN =====

async function importProducts(products) {
  const operations = products.map(product => ({
    insertOne: { document: product }
  }));
  
  return await Product.bulkWrite(operations, {
    ordered: false
  });
}

// ===== SYNC PATTERN =====

async function syncProducts(products) {
  const operations = products.map(product => ({
    updateOne: {
      filter: { sku: product.sku },
      update: { $set: product },
      upsert: true
    }
  }));
  
  return await Product.bulkWrite(operations, {
    ordered: false,
    runValidators: true
  });
}

// ===== BATCH UPDATE WITH MONGOOSE DOCUMENTS =====

async function batchUpdateFromQuery() {
  const products = await Product.find({ needsUpdate: true });
  
  const operations = products.map(product => {
    // Modify using Mongoose methods
    product.price *= 1.1;
    
    return {
      updateOne: {
        filter: { _id: product._id },
        update: { $set: { price: product.price } }
      }
    };
  });
  
  return await Product.bulkWrite(operations);
}

// ===== ERROR HANDLING =====

try {
  await Product.bulkWrite([
    { insertOne: { document: { sku: 'PROD001' } } },
    { insertOne: { document: { sku: 'PROD001' } } }  // Duplicate
  ], {
    ordered: false
  });
} catch (error) {
  console.log('Bulk write errors:');
  if (error.writeErrors) {
    error.writeErrors.forEach(err => {
      console.log('Error:', err.errmsg);
    });
  }
}

// ===== USING NATIVE COLLECTION =====

// Access native collection for bulk operations
const collection = Product.collection;
await collection.bulkWrite([
  {
    insertOne: {
      document: { sku: 'PROD002', name: 'Product 2', price: 99.99 }
    }
  }
]);

// ===== BULK WRITE WITH MIDDLEWARE =====

const productSchema = new mongoose.Schema({
  sku: String,
  name: String,
  price: Number
});

// Note: Bulk write does NOT trigger save middleware
// Use insertMany for middleware
await Product.insertMany([
  { sku: 'A', name: 'Product A', price: 10 },
  { sku: 'B', name: 'Product B', price: 20 }
], {
  ordered: false
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
                  <strong>Use unordered for large batches:</strong> Better
                  performance and error resilience
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Batch size optimization:</strong> 500-1000 operations
                  per batch is typically optimal
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Handle errors properly:</strong> Check writeErrors for
                  individual operation failures
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Use appropriate write concern:</strong> Balance
                  durability vs performance
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Monitor memory usage:</strong> Large bulk operations
                  can consume significant memory
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Index fields used in filters:</strong> Improves bulk
                  update/delete performance
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Use upsert for sync operations:</strong> Efficiently
                  merge external data
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Consider transactions:</strong> For operations
                  requiring atomicity
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Log bulk operation results:</strong> Track success
                  rates and errors
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Test bulk operations thoroughly:</strong> Verify
                  behavior with errors and edge cases
                </span>
              </li>
            </ul>
          </section>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8">
            <Link
              href="/phase2/delete"
              className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              ← Previous: Delete Operations
            </Link>
            <Link
              href="/"
              className="bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-500 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              Back to Home →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
