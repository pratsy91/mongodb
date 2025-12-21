"use client";

import Link from "next/link";
import { useState } from "react";

export default function DeleteOperationsPage() {
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
          Delete Operations
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Complete guide to deleting documents with all options and methods
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
                Delete Methods
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>deleteOne():</strong> Deletes first matching document
                </li>
                <li>
                  <strong>deleteMany():</strong> Deletes all matching documents
                </li>
                <li>
                  <strong>findOneAndDelete():</strong> Deletes and returns
                  document
                </li>
              </ul>

              <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                Important Considerations
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Delete operations are permanent and cannot be undone</li>
                <li>Always test delete operations in development first</li>
                <li>Consider soft deletes for important data</li>
                <li>Use write concerns for critical delete operations</li>
                <li>Indexes on filter fields improve delete performance</li>
              </ul>

              <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                Soft Delete Pattern
              </h3>
              <p className="text-lg">
                Instead of permanently deleting documents, mark them as deleted
                with a flag. This allows data recovery and maintains audit
                trails.
              </p>
            </div>
          </section>

          {/* MongoDB Native Driver Examples */}
          {activeTab === "mongodb" && (
            <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
              <h2 className="text-3xl font-bold mb-6 text-blue-300">
                MongoDB Native Driver Examples
              </h2>

              {/* deleteOne and deleteMany */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  1. deleteOne() and deleteMany()
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient } = require('mongodb');

const client = new MongoClient('mongodb://localhost:27017');
await client.connect();
const db = client.db('myDatabase');
const users = db.collection('users');

// ===== DELETE ONE =====

// Delete first matching document
const result1 = await users.deleteOne({
  email: 'alice@example.com'
});

console.log('Delete result:', {
  acknowledged: result1.acknowledged,
  deletedCount: result1.deletedCount
});

// Delete by _id
const { ObjectId } = require('mongodb');
await users.deleteOne({
  _id: new ObjectId('507f1f77bcf86cd799439011')
});

// Delete with multiple conditions
await users.deleteOne({
  active: false,
  createdAt: { $lt: new Date('2020-01-01') }
});

// No match returns deletedCount: 0
const result2 = await users.deleteOne({
  email: 'nonexistent@example.com'
});
console.log('Deleted:', result2.deletedCount);  // 0

// ===== DELETE MANY =====

// Delete all matching documents
const result3 = await users.deleteMany({
  active: false
});
console.log('Deleted count:', result3.deletedCount);

// Delete all documents in collection
const result4 = await users.deleteMany({});
console.log('All documents deleted:', result4.deletedCount);

// Delete with complex filter
await users.deleteMany({
  $or: [
    { lastLogin: { $lt: new Date('2023-01-01') } },
    { verified: false, createdAt: { $lt: new Date('2023-06-01') } }
  ]
});

// Delete by date range
await users.deleteMany({
  createdAt: {
    $gte: new Date('2024-01-01'),
    $lt: new Date('2024-02-01')
  }
});

// Delete by array content
await users.deleteMany({
  tags: { $in: ['spam', 'bot'] }
});

// Delete by nested field
await users.deleteMany({
  'profile.status': 'deleted'
});

// ===== DELETE WITH OPTIONS =====

// Delete with write concern
await users.deleteOne(
  { email: 'important@example.com' },
  {
    writeConcern: {
      w: 'majority',
      j: true,
      wtimeout: 5000
    }
  }
);

// Delete with collation
await users.deleteMany(
  { name: 'john' },
  {
    collation: {
      locale: 'en',
      strength: 2  // Case-insensitive
    }
  }
);

// Delete with hint (force index)
await users.deleteMany(
  { status: 'inactive' },
  {
    hint: { status: 1 }
  }
);

// Delete with comment
await users.deleteMany(
  { banned: true },
  {
    comment: 'Cleanup banned users'
  }
);

// ===== ERROR HANDLING =====

try {
  const result = await users.deleteOne({ _id: 'invalid' });
  if (result.deletedCount === 0) {
    console.log('No document found to delete');
  }
} catch (error) {
  console.error('Delete error:', error);
}

// ===== DELETE WITH SESSION (TRANSACTIONS) =====

const session = client.startSession();
try {
  await session.withTransaction(async () => {
    await users.deleteOne(
      { _id: 1 },
      { session }
    );
    
    await db.collection('logs').insertOne(
      { action: 'user_deleted', userId: 1, date: new Date() },
      { session }
    );
  });
} finally {
  await session.endSession();
}

await client.close();`}</code>
                </pre>
              </div>

              {/* findOneAndDelete */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  2. findOneAndDelete() - Delete and Return
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient } = require('mongodb');

const client = new MongoClient('mongodb://localhost:27017');
await client.connect();
const db = client.db('myDatabase');
const users = db.collection('users');

// ===== BASIC FIND ONE AND DELETE =====

// Delete and return document
const deleted = await users.findOneAndDelete({
  email: 'bob@example.com'
});

console.log('Deleted document:', deleted);  // null if not found

// ===== WITH PROJECTION =====

// Return only specific fields
const result = await users.findOneAndDelete(
  { status: 'inactive' },
  {
    projection: { name: 1, email: 1, _id: 0 }
  }
);

// ===== WITH SORT =====

// Delete oldest document
const oldest = await users.findOneAndDelete(
  { active: false },
  {
    sort: { createdAt: 1 }  // Ascending (oldest first)
  }
);

// Delete newest document
const newest = await users.findOneAndDelete(
  { active: false },
  {
    sort: { createdAt: -1 }  // Descending (newest first)
  }
);

// Delete document with highest value
const highest = await users.findOneAndDelete(
  { category: 'premium' },
  {
    sort: { score: -1 }
  }
);

// ===== WITH MULTIPLE OPTIONS =====

const deletedUser = await users.findOneAndDelete(
  { banned: true },
  {
    // Sort to choose which document if multiple match
    sort: { bannedDate: 1 },
    
    // Projection - fields to return
    projection: { 
      name: 1, 
      email: 1, 
      bannedReason: 1 
    },
    
    // Write concern
    writeConcern: {
      w: 'majority',
      j: true
    },
    
    // Collation
    collation: {
      locale: 'en',
      strength: 2
    },
    
    // Max time
    maxTimeMS: 5000,
    
    // Comment
    comment: 'Delete banned user',
    
    // Hint (force index)
    hint: { banned: 1 }
  }
);

// ===== USE CASES =====

// Delete from queue (oldest first)
const task = await db.collection('queue').findOneAndDelete(
  { status: 'pending' },
  { sort: { createdAt: 1 } }
);

if (task) {
  // Process task
  console.log('Processing:', task);
}

// Delete expired sessions
const expiredSession = await db.collection('sessions').findOneAndDelete({
  expiresAt: { $lt: new Date() }
});

// Delete and log
const deletedDoc = await users.findOneAndDelete({ _id: 123 });
if (deletedDoc) {
  await db.collection('audit_log').insertOne({
    action: 'delete',
    collection: 'users',
    document: deletedDoc,
    timestamp: new Date()
  });
}

// ===== PATTERN: DELETE WITH VALIDATION =====

async function deleteWithValidation(id) {
  const doc = await users.findOneAndDelete(
    { _id: id },
    { 
      projection: { 
        name: 1, 
        email: 1, 
        hasActiveSubscription: 1 
      }
    }
  );
  
  if (!doc) {
    throw new Error('Document not found');
  }
  
  if (doc.hasActiveSubscription) {
    // Rollback - reinsert document
    await users.insertOne(doc);
    throw new Error('Cannot delete user with active subscription');
  }
  
  return doc;
}

// ===== WITH SESSION =====

const session = client.startSession();
try {
  await session.withTransaction(async () => {
    const user = await users.findOneAndDelete(
      { email: 'test@example.com' },
      { session }
    );
    
    if (user) {
      await db.collection('deleted_users').insertOne(
        { ...user, deletedAt: new Date() },
        { session }
      );
    }
  });
} finally {
  await session.endSession();
}

await client.close();`}</code>
                </pre>
              </div>

              {/* Soft Delete Pattern */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  3. Soft Delete Pattern
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient } = require('mongodb');

const client = new MongoClient('mongodb://localhost:27017');
await client.connect();
const db = client.db('myDatabase');
const users = db.collection('users');

// ===== SOFT DELETE =====

// Mark as deleted instead of removing
await users.updateOne(
  { email: 'alice@example.com' },
  {
    $set: {
      deleted: true,
      deletedAt: new Date(),
      deletedBy: 'admin_id'
    }
  }
);

// ===== QUERIES EXCLUDING SOFT DELETED =====

// Find only non-deleted documents
const activeUsers = await users.find({
  deleted: { $ne: true }
}).toArray();

// Or explicitly check for false
const activeUsers2 = await users.find({
  $or: [
    { deleted: false },
    { deleted: { $exists: false } }
  ]
}).toArray();

// ===== SOFT DELETE WITH REASON =====

await users.updateOne(
  { _id: 123 },
  {
    $set: {
      deleted: true,
      deletedAt: new Date(),
      deletedBy: 'user_id',
      deletionReason: 'User requested account deletion',
      deletionMetadata: {
        ip: '192.168.1.1',
        userAgent: 'Mozilla/5.0...'
      }
    }
  }
);

// ===== RESTORE SOFT DELETED =====

await users.updateOne(
  { email: 'alice@example.com' },
  {
    $unset: {
      deleted: '',
      deletedAt: '',
      deletedBy: '',
      deletionReason: ''
    }
  }
);

// Or set to false
await users.updateOne(
  { _id: 123 },
  {
    $set: { deleted: false },
    $unset: { deletedAt: '', deletedBy: '' }
  }
);

// ===== PERMANENT DELETE (CLEANUP) =====

// Delete soft-deleted documents older than 30 days
const thirtyDaysAgo = new Date();
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

await users.deleteMany({
  deleted: true,
  deletedAt: { $lt: thirtyDaysAgo }
});

// ===== HELPER FUNCTIONS =====

// Soft delete function
async function softDelete(collection, filter, deletedBy) {
  return await collection.updateOne(
    filter,
    {
      $set: {
        deleted: true,
        deletedAt: new Date(),
        deletedBy
      }
    }
  );
}

// Query active (non-deleted) documents
async function findActive(collection, filter = {}) {
  return await collection.find({
    ...filter,
    deleted: { $ne: true }
  }).toArray();
}

// Restore document
async function restore(collection, filter) {
  return await collection.updateOne(
    filter,
    {
      $set: { deleted: false },
      $unset: { deletedAt: '', deletedBy: '', deletionReason: '' }
    }
  );
}

// Usage
await softDelete(users, { email: 'test@example.com' }, 'admin123');
const active = await findActive(users, { age: { $gte: 18 } });
await restore(users, { email: 'test@example.com' });

// ===== PARTIAL INDEX FOR SOFT DELETE =====

// Create index excluding deleted documents
await users.createIndex(
  { email: 1 },
  {
    partialFilterExpression: {
      deleted: { $ne: true }
    }
  }
);

// ===== TTL FOR SOFT DELETED DOCUMENTS =====

// Auto-delete soft-deleted documents after 90 days
await users.createIndex(
  { deletedAt: 1 },
  {
    expireAfterSeconds: 90 * 24 * 60 * 60,  // 90 days
    partialFilterExpression: {
      deleted: true
    }
  }
);

await client.close();`}</code>
                </pre>
              </div>

              {/* Bulk Delete and Drop */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  4. Bulk Delete and Collection Drop
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient } = require('mongodb');

const client = new MongoClient('mongodb://localhost:27017');
await client.connect();
const db = client.db('myDatabase');
const logs = db.collection('logs');

// ===== DELETE IN BATCHES =====

// Delete large number of documents in batches
async function batchDelete(collection, filter, batchSize = 1000) {
  let deletedTotal = 0;
  let result;
  
  do {
    result = await collection.deleteMany(filter, {
      limit: batchSize  // Not directly supported, use find then delete
    });
    deletedTotal += result.deletedCount;
    console.log(\`Deleted \${deletedTotal} documents so far\`);
  } while (result.deletedCount === batchSize);
  
  return deletedTotal;
}

// Better batch delete using find and bulkWrite
async function batchDeleteOptimized(collection, filter, batchSize = 1000) {
  let deletedTotal = 0;
  
  while (true) {
    const docs = await collection
      .find(filter, { projection: { _id: 1 } })
      .limit(batchSize)
      .toArray();
    
    if (docs.length === 0) break;
    
    const ids = docs.map(doc => doc._id);
    const result = await collection.deleteMany({
      _id: { $in: ids }
    });
    
    deletedTotal += result.deletedCount;
    console.log(\`Deleted \${deletedTotal} documents\`);
    
    if (docs.length < batchSize) break;
  }
  
  return deletedTotal;
}

// Usage
await batchDeleteOptimized(logs, { 
  level: 'debug',
  createdAt: { $lt: new Date('2024-01-01') }
}, 500);

// ===== DROP COLLECTION =====

// Drop entire collection
await logs.drop();
console.log('Collection dropped');

// Drop if exists
try {
  await logs.drop();
} catch (error) {
  if (error.code === 26) {
    console.log('Collection does not exist');
  } else {
    throw error;
  }
}

// Check existence before drop
const collections = await db.listCollections({ name: 'logs' }).toArray();
if (collections.length > 0) {
  await logs.drop();
}

// ===== DROP DATABASE =====

// Drop entire database
await db.dropDatabase();
console.log('Database dropped');

// ===== TRUNCATE COLLECTION (FAST DELETE ALL) =====

// Fastest way to delete all documents
// Method 1: Drop and recreate
await logs.drop();
await db.createCollection('logs');

// Method 2: Delete many (slower but preserves indexes)
await logs.deleteMany({});

// ===== DELETE WITH PROGRESS TRACKING =====

async function deleteWithProgress(collection, filter) {
  const totalCount = await collection.countDocuments(filter);
  console.log(\`Total documents to delete: \${totalCount}\`);
  
  let deletedCount = 0;
  const batchSize = 1000;
  
  while (deletedCount < totalCount) {
    const result = await collection.deleteMany(filter);
    deletedCount += result.deletedCount;
    
    const percentage = ((deletedCount / totalCount) * 100).toFixed(2);
    console.log(\`Progress: \${percentage}% (\${deletedCount}/\${totalCount})\`);
    
    if (result.deletedCount === 0) break;
  }
  
  return deletedCount;
}

// ===== CONDITIONAL BULK DELETE =====

// Delete documents based on complex conditions
const result = await logs.deleteMany({
  $and: [
    { level: { $in: ['debug', 'trace'] } },
    {
      $or: [
        { createdAt: { $lt: new Date('2024-01-01') } },
        { size: { $gt: 1000000 } }
      ]
    }
  ]
});

console.log(\`Deleted \${result.deletedCount} log entries\`);

// ===== DELETE DUPLICATES =====

// Find and delete duplicate documents
const duplicates = await logs.aggregate([
  {
    $group: {
      _id: '$email',
      uniqueIds: { $addToSet: '$_id' },
      count: { $sum: 1 }
    }
  },
  {
    $match: { count: { $gt: 1 } }
  }
]).toArray();

// Delete all but first occurrence
for (const dup of duplicates) {
  const [keep, ...remove] = dup.uniqueIds;
  await logs.deleteMany({
    _id: { $in: remove }
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

              {/* Basic Delete Methods */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-purple-300">
                  1. Basic Delete Methods in Mongoose
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const mongoose = require('mongoose');

await mongoose.connect('mongodb://localhost:27017/myDatabase');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  active: Boolean
});

const User = mongoose.model('User', userSchema);

// ===== DELETE ONE =====

const result = await User.deleteOne({ email: 'alice@example.com' });
console.log('Deleted count:', result.deletedCount);

// Delete by ID
await User.deleteOne({ _id: '507f1f77bcf86cd799439011' });

// ===== DELETE MANY =====

const result2 = await User.deleteMany({ active: false });
console.log('Deleted:', result2.deletedCount);

// Delete all documents
await User.deleteMany({});

// ===== FIND BY ID AND DELETE =====

const deleted = await User.findByIdAndDelete('507f1f77bcf86cd799439011');
console.log('Deleted document:', deleted);

// With options
const deleted2 = await User.findByIdAndDelete(
  '507f1f77bcf86cd799439011',
  {
    select: 'name email',  // Projection
    lean: true             // Return plain object
  }
);

// ===== FIND ONE AND DELETE =====

const doc = await User.findOneAndDelete({ email: 'bob@example.com' });

// With sort
const oldest = await User.findOneAndDelete(
  { active: false },
  { 
    sort: { createdAt: 1 },
    select: 'name email'
  }
);

// ===== DOCUMENT INSTANCE DELETE =====

const user = await User.findOne({ email: 'carol@example.com' });
if (user) {
  await user.deleteOne();
  console.log('Document deleted via instance method');
}

// Alternative: remove() (deprecated but still works)
// await user.remove();

await mongoose.disconnect();`}</code>
                </pre>
              </div>

              {/* Delete with Middleware */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-purple-300">
                  2. Delete with Middleware and Hooks
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const mongoose = require('mongoose');

await mongoose.connect('mongodb://localhost:27017/myDatabase');

// ===== SCHEMA WITH DELETE MIDDLEWARE =====

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]
});

// Pre-delete middleware
userSchema.pre('deleteOne', { document: true, query: false }, async function() {
  console.log('About to delete user:', this._id);
  
  // Delete related documents
  await mongoose.model('Post').deleteMany({ author: this._id });
});

// Post-delete middleware
userSchema.post('deleteOne', { document: true, query: false }, async function(doc) {
  console.log('User deleted:', doc._id);
  
  // Log deletion
  await mongoose.model('AuditLog').create({
    action: 'user_deleted',
    userId: doc._id,
    timestamp: new Date()
  });
});

// Query middleware (for deleteOne/deleteMany on Model)
userSchema.pre('deleteOne', { document: false, query: true }, function() {
  console.log('Query deleteOne about to execute');
});

userSchema.pre('deleteMany', function() {
  console.log('DeleteMany about to execute');
});

const User = mongoose.model('User', userSchema);

// Triggers document middleware
const user = await User.findOne({ email: 'test@example.com' });
await user.deleteOne();

// Triggers query middleware
await User.deleteOne({ email: 'test@example.com' });
await User.deleteMany({ active: false });

// ===== CASCADING DELETE =====

const postSchema = new mongoose.Schema({
  title: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
});

postSchema.pre('deleteOne', { document: true }, async function() {
  // Delete all comments when post is deleted
  await mongoose.model('Comment').deleteMany({
    _id: { $in: this.comments }
  });
});

const Post = mongoose.model('Post', postSchema);

// ===== SOFT DELETE WITH MONGOOSE PLUGIN =====

const mongooseDelete = require('mongoose-delete');

const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});

// Add soft delete functionality
articleSchema.plugin(mongooseDelete, { 
  deletedAt: true,
  deletedBy: true,
  overrideMethods: 'all'
});

const Article = mongoose.model('Article', articleSchema);

// Soft delete
await Article.deleteById('article_id');

// Find non-deleted
const articles = await Article.find();

// Find all including deleted
const allArticles = await Article.findWithDeleted();

// Find only deleted
const deletedArticles = await Article.findDeleted();

// Restore
await Article.restore({ _id: 'article_id' });

await mongoose.disconnect();`}</code>
                </pre>
              </div>

              {/* Soft Delete Manual Implementation */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-purple-300">
                  3. Manual Soft Delete Implementation
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const mongoose = require('mongoose');

await mongoose.connect('mongodb://localhost:27017/myDatabase');

// ===== SCHEMA WITH SOFT DELETE FIELDS =====

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  deleted: { type: Boolean, default: false },
  deletedAt: Date,
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

// Helper methods
productSchema.methods.softDelete = function(deletedBy) {
  this.deleted = true;
  this.deletedAt = new Date();
  this.deletedBy = deletedBy;
  return this.save();
};

productSchema.methods.restore = function() {
  this.deleted = false;
  this.deletedAt = undefined;
  this.deletedBy = undefined;
  return this.save();
};

// Query helpers
productSchema.query.notDeleted = function() {
  return this.where({ deleted: false });
};

productSchema.query.onlyDeleted = function() {
  return this.where({ deleted: true });
};

// Static methods
productSchema.statics.findActive = function(filter = {}) {
  return this.find({ ...filter, deleted: false });
};

productSchema.statics.softDeleteMany = async function(filter, deletedBy) {
  return this.updateMany(
    filter,
    {
      $set: {
        deleted: true,
        deletedAt: new Date(),
        deletedBy
      }
    }
  );
};

const Product = mongoose.model('Product', productSchema);

// ===== USAGE =====

// Soft delete document
const product = await Product.findById('product_id');
await product.softDelete('user_id');

// Restore document
await product.restore();

// Find non-deleted products
const activeProducts = await Product.findActive({ category: 'electronics' });

// Query helper
const products = await Product.find().notDeleted();

// Soft delete many
await Product.softDeleteMany({ category: 'outdated' }, 'admin_id');

// ===== AUTO-EXCLUDE DELETED IN QUERIES =====

// Add query middleware to auto-exclude deleted
productSchema.pre(/^find/, function() {
  if (!this.getOptions().includeDeleted) {
    this.where({ deleted: { $ne: true } });
  }
});

// Normal queries exclude deleted
const normalResults = await Product.find();

// Include deleted explicitly
const allResults = await Product.find().setOptions({ includeDeleted: true });

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
                  <strong>Always test deletes in development:</strong> Delete
                  operations are permanent
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Use soft deletes for important data:</strong> Allows
                  recovery and audit trails
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Index filter fields:</strong> Improve delete
                  performance
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Use transactions for related deletes:</strong> Ensure
                  data consistency
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Batch large deletes:</strong> Avoid performance issues
                  and timeouts
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Log important deletions:</strong> Maintain audit
                  trails
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Implement cascading deletes:</strong> Clean up related
                  documents
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Set up TTL indexes:</strong> Automatic cleanup of old
                  data
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Validate before deletion:</strong> Check for
                  dependencies and constraints
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Consider retention policies:</strong> Comply with
                  legal requirements
                </span>
              </li>
            </ul>
          </section>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8">
            <Link
              href="/phase2/update"
              className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              ← Previous: Update Operations
            </Link>
            <Link
              href="/phase2/bulk"
              className="bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-500 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              Next: Bulk Operations →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
