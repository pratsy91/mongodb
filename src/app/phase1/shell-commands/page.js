"use client";

import Link from "next/link";
import { useState } from "react";

export default function ShellCommandsPage() {
  const [activeTab, setActiveTab] = useState("mongosh");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <Link
          href="/"
          className="text-indigo-400 hover:text-indigo-300 mb-6 inline-block"
        >
          ← Back to Home
        </Link>

        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">
          MongoDB Shell Commands
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Complete reference of MongoDB Shell (mongosh) commands - admin,
          database, and collection operations
        </p>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab("mongosh")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "mongosh"
                ? "bg-indigo-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            MongoDB Shell (mongosh)
          </button>
          <button
            onClick={() => setActiveTab("admin")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "admin"
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Admin Commands
          </button>
        </div>

        <div className="space-y-8">
          {/* Theory Section */}
          <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
            <h2 className="text-3xl font-bold mb-6 text-indigo-300">
              📚 Theory
            </h2>

            <div className="space-y-4 text-gray-200">
              <h3 className="text-2xl font-semibold text-indigo-300 mt-6">
                MongoDB Shell (mongosh)
              </h3>
              <p className="text-lg">
                The MongoDB Shell (mongosh) is an interactive JavaScript
                interface to MongoDB. It's used to query and update data,
                perform administrative operations, and interact with MongoDB
                instances.
              </p>

              <h3 className="text-2xl font-semibold text-indigo-300 mt-6">
                Command Categories
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Database Commands:</strong> Create, drop, switch
                  databases
                </li>
                <li>
                  <strong>Collection Commands:</strong> CRUD operations,
                  indexing
                </li>
                <li>
                  <strong>Admin Commands:</strong> Server management, user
                  management, replication
                </li>
                <li>
                  <strong>Diagnostic Commands:</strong> Stats, profiling,
                  explain
                </li>
                <li>
                  <strong>Helper Methods:</strong> Shortcuts for common
                  operations
                </li>
              </ul>

              <h3 className="text-2xl font-semibold text-indigo-300 mt-6">
                Connecting to MongoDB
              </h3>
              <div className="bg-black/30 p-4 rounded-lg font-mono text-sm space-y-2">
                <div>mongosh # Connect to localhost:27017</div>
                <div>mongosh "mongodb://localhost:27017" # Explicit URI</div>
                <div>mongosh --host localhost --port 27017 # With flags</div>
                <div>mongosh --username user --password pass # With auth</div>
                <div>mongosh "mongodb+srv://cluster.mongodb.net" # Atlas</div>
              </div>
            </div>
          </section>

          {/* MongoDB Shell Commands */}
          {activeTab === "mongosh" && (
            <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
              <h2 className="text-3xl font-bold mb-6 text-indigo-300">
                MongoDB Shell Commands
              </h2>

              {/* Basic Commands */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  1. Basic Shell Commands
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`// ===== HELP COMMANDS =====

help                        // Show help
db.help()                   // Database methods help
db.collection.help()        // Collection methods help

// ===== DATABASE COMMANDS =====

show dbs                    // List all databases
show databases              // Same as show dbs
db                          // Show current database
use myDatabase              // Switch to database (creates if doesn't exist)

// ===== COLLECTION COMMANDS =====

show collections            // List all collections in current database
show tables                 // Same as show collections

// ===== USER COMMANDS =====

show users                  // Show users in current database
show roles                  // Show roles in current database

// ===== REPLICATION COMMANDS =====

show profile                // Show profiling data
show logs                   // Show available logs
show log [name]             // Show specific log

// ===== OTHER =====

exit                        // Exit shell
quit()                      // Same as exit
cls                         // Clear screen (Windows)
clear                       // Clear screen (Unix)

// ===== VERSION & SERVER INFO =====

version()                   // MongoDB shell version
db.version()                // Database version
db.serverBuildInfo()        // Detailed server info
db.serverStatus()           // Server status and metrics
db.hostInfo()               // Host system info

// ===== CURRENT CONNECTION INFO =====

db.getMongo()               // Get current connection
db.getCollectionNames()     // Get all collection names
db.getCollectionInfos()     // Get collection info`}</code>
                </pre>
              </div>

              {/* Database Operations */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  2. Database Operations
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`// ===== CREATE/USE DATABASE =====

use myDatabase              // Switch to database (auto-creates)

// ===== DATABASE INFO =====

db.getName()                // Get database name
db.stats()                  // Database statistics
db.stats(1024 * 1024)       // Stats in MB
db.stats({ scale: 1024 })   // Stats in KB

// Statistics include:
// - collections: number of collections
// - views: number of views
// - objects: number of documents
// - dataSize: total size of data
// - storageSize: total storage size
// - indexes: number of indexes
// - indexSize: total index size

// ===== DATABASE PROPERTIES =====

db.listCommands()           // List all available commands
db.currentOp()              // Show current operations
db.killOp(opid)             // Kill an operation

// ===== DROP DATABASE =====

db.dropDatabase()           // Drop current database

// With write concern
db.dropDatabase({ 
  writeConcern: { w: 'majority', wtimeout: 5000 } 
})

// ===== RUN COMMAND =====

db.runCommand({ ping: 1 })                    // Ping server
db.runCommand({ serverStatus: 1 })            // Server status
db.runCommand({ buildInfo: 1 })               // Build info
db.runCommand({ listDatabases: 1 })           // List databases
db.runCommand({ dbStats: 1 })                 // Database stats
db.runCommand({ getCmdLineOpts: 1 })          // Command line options
db.runCommand({ getParameter: '*' })          // All parameters
db.runCommand({ hostInfo: 1 })                // Host info

// ===== ADMIN DATABASE =====

use admin                   // Switch to admin database
db.adminCommand({ ... })    // Run admin command`}</code>
                </pre>
              </div>

              {/* Collection Operations */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  3. Collection Operations
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`// ===== CREATE COLLECTION =====

db.createCollection('users')

// With options
db.createCollection('logs', {
  capped: true,
  size: 5242880,
  max: 5000,
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
})

// ===== LIST COLLECTIONS =====

db.getCollectionNames()
db.getCollectionInfos()
db.getCollectionInfos({ name: 'users' })

// ===== COLLECTION INFO =====

db.users.stats()                    // Collection statistics
db.users.stats({ scale: 1024 })     // Stats in KB
db.users.dataSize()                 // Data size
db.users.storageSize()              // Storage size
db.users.totalIndexSize()           // Total index size
db.users.totalSize()                // Total size (data + indexes)

// ===== RENAME COLLECTION =====

db.users.renameCollection('customers')
db.users.renameCollection('customers', true)  // Drop target if exists

// ===== DROP COLLECTION =====

db.users.drop()

// ===== VALIDATE COLLECTION =====

db.users.validate()                 // Validate collection
db.users.validate(true)             // Full validation

// ===== COMPACT COLLECTION =====

db.runCommand({ compact: 'users' })

// ===== GET COLLECTION =====

db.getCollection('users')           // Get collection object
db['users']                         // Same as above

// ===== CHECK IF COLLECTION EXISTS =====

db.getCollectionNames().includes('users')`}</code>
                </pre>
              </div>

              {/* CRUD Operations */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  4. CRUD Operations (Quick Reference)
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`// ===== INSERT =====

db.users.insertOne({ name: 'Alice', age: 30 })
db.users.insertMany([
  { name: 'Bob', age: 25 },
  { name: 'Charlie', age: 35 }
])

// ===== FIND =====

db.users.find()                                 // Find all
db.users.find({ age: { $gte: 30 } })           // Find with query
db.users.findOne({ name: 'Alice' })            // Find one
db.users.find().limit(10)                      // Limit results
db.users.find().skip(5)                        // Skip results
db.users.find().sort({ age: -1 })              // Sort descending
db.users.find({}, { name: 1, age: 1 })         // Projection
db.users.find().count()                        // Count (deprecated)
db.users.countDocuments()                      // Count documents
db.users.estimatedDocumentCount()              // Estimated count
db.users.distinct('age')                       // Distinct values

// ===== UPDATE =====

db.users.updateOne(
  { name: 'Alice' },
  { $set: { age: 31 } }
)

db.users.updateMany(
  { age: { $lt: 30 } },
  { $inc: { age: 1 } }
)

db.users.replaceOne(
  { name: 'Alice' },
  { name: 'Alice', age: 32, email: 'alice@example.com' }
)

db.users.findOneAndUpdate(
  { name: 'Alice' },
  { $set: { age: 33 } },
  { returnNewDocument: true }
)

// ===== DELETE =====

db.users.deleteOne({ name: 'Alice' })
db.users.deleteMany({ age: { $lt: 25 } })
db.users.findOneAndDelete({ name: 'Bob' })

// ===== BULK OPERATIONS =====

db.users.bulkWrite([
  { insertOne: { document: { name: 'David', age: 40 } } },
  { updateOne: { filter: { name: 'Alice' }, update: { $set: { age: 31 } } } },
  { deleteOne: { filter: { name: 'Bob' } } }
])`}</code>
                </pre>
              </div>

              {/* Index Operations */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  5. Index Operations
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`// ===== CREATE INDEXES =====

db.users.createIndex({ name: 1 })                      // Single field ascending
db.users.createIndex({ name: -1 })                     // Descending
db.users.createIndex({ name: 1, age: -1 })             // Compound
db.users.createIndex({ location: '2dsphere' })         // Geospatial
db.users.createIndex({ description: 'text' })          // Text
db.users.createIndex({ email: 'hashed' })              // Hashed
db.users.createIndex({ '$**': 1 })                     // Wildcard

// Index with options
db.users.createIndex(
  { email: 1 },
  { 
    unique: true,                    // Unique index
    sparse: true,                    // Sparse index
    background: true,                // Build in background (deprecated in 4.2)
    name: 'email_unique_idx',        // Custom name
    expireAfterSeconds: 3600,        // TTL index (1 hour)
    partialFilterExpression: {       // Partial index
      age: { $gte: 21 }
    }
  }
)

// ===== LIST INDEXES =====

db.users.getIndexes()                               // All indexes
db.users.getIndexKeys()                             // Index keys only
db.users.getIndexSpecs()                            // Index specifications

// ===== DROP INDEXES =====

db.users.dropIndex('name_1')                        // Drop by name
db.users.dropIndex({ name: 1 })                     // Drop by specification
db.users.dropIndexes()                              // Drop all except _id
db.users.dropIndexes(['name_1', 'age_1'])          // Drop multiple

// ===== HIDE/UNHIDE INDEXES =====

db.users.hideIndex('name_1')
db.users.unhideIndex('name_1')

// ===== REBUILD INDEXES =====

db.users.reIndex()                                  // Rebuild all indexes

// ===== INDEX STATS =====

db.users.stats().indexSizes                         // Index sizes
db.users.totalIndexSize()                           // Total index size
db.users.aggregate([{ $indexStats: {} }])          // Detailed index stats`}</code>
                </pre>
              </div>

              {/* Aggregation */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  6. Aggregation Pipeline
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`// ===== BASIC AGGREGATION =====

db.orders.aggregate([
  { $match: { status: 'completed' } },
  { $group: { 
      _id: '$customerId', 
      total: { $sum: '$amount' },
      count: { $sum: 1 }
    }
  },
  { $sort: { total: -1 } },
  { $limit: 10 }
])

// ===== COMMON STAGES =====

// Match (filter)
{ $match: { age: { $gte: 21 } } }

// Group
{ $group: { 
    _id: '$category', 
    count: { $sum: 1 },
    avg: { $avg: '$price' }
  }
}

// Project
{ $project: { 
    name: 1, 
    age: 1, 
    adult: { $gte: ['$age', 18] } 
  }
}

// Sort
{ $sort: { age: -1, name: 1 } }

// Limit
{ $limit: 10 }

// Skip
{ $skip: 20 }

// Unwind (expand arrays)
{ $unwind: '$tags' }

// Lookup (join)
{ $lookup: {
    from: 'users',
    localField: 'userId',
    foreignField: '_id',
    as: 'userInfo'
  }
}

// Add fields
{ $addFields: { 
    fullName: { $concat: ['$firstName', ' ', '$lastName'] } 
  }
}

// Count
{ $count: 'total' }

// Out (write to collection)
{ $out: 'results' }

// Merge
{ $merge: { into: 'results', whenMatched: 'replace' } }

// ===== EXPLAIN AGGREGATION =====

db.orders.explain().aggregate([...])
db.orders.explain('executionStats').aggregate([...])`}</code>
                </pre>
              </div>

              {/* Diagnostic Commands */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  7. Diagnostic & Performance Commands
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`// ===== EXPLAIN =====

db.users.find({ age: { $gte: 30 } }).explain()
db.users.find({ age: { $gte: 30 } }).explain('executionStats')
db.users.find({ age: { $gte: 30 } }).explain('allPlansExecution')

// ===== PROFILING =====

db.getProfilingStatus()                     // Get profiling status
db.setProfilingLevel(2)                     // 0=off, 1=slow, 2=all
db.setProfilingLevel(1, { slowms: 100 })    // Log ops > 100ms
db.setProfilingLevel(0)                     // Disable profiling

db.system.profile.find()                    // View profiling data
db.system.profile.find({ millis: { $gt: 100 } }).sort({ ts: -1 })

// ===== CURRENT OPERATIONS =====

db.currentOp()                              // All current operations
db.currentOp({ secs_running: { $gt: 5 } }) // Long-running ops
db.killOp(12345)                            // Kill operation

// ===== SERVER STATUS =====

db.serverStatus()                           // Complete server status
db.serverStatus().connections               // Connection stats
db.serverStatus().opcounters                // Operation counters
db.serverStatus().network                   // Network stats
db.serverStatus().mem                       // Memory stats

// ===== DATABASE STATS =====

db.stats()                                  // Database statistics
db.stats(1024 * 1024)                       // Stats in MB

// ===== COLLECTION STATS =====

db.users.stats()                            // Collection statistics
db.users.stats({ indexDetails: true })      // Include index details

// ===== VALIDATE =====

db.users.validate()                         // Quick validation
db.users.validate({ full: true })           // Full validation

// ===== ANALYZE QUERY =====

db.users.find({ age: 30 }).explain('executionStats')

// ===== LOGS =====

db.adminCommand({ getLog: 'global' })       // Get global log
db.adminCommand({ getLog: 'startupWarnings' })

// ===== DIAGNOSTIC DATA =====

db.runCommand({ diagLogging: 3 })`}</code>
                </pre>
              </div>

              {/* Utility Commands */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  8. Utility & Helper Commands
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`// ===== PRINT & OUTPUT =====

print('Hello')                              // Print to console
printjson({ key: 'value' })                 // Print JSON
tojson({ key: 'value' })                    // Convert to JSON string

// ===== LOAD SCRIPT =====

load('script.js')                           // Load and execute JavaScript file

// ===== CURSOR OPERATIONS =====

const cursor = db.users.find()
cursor.hasNext()                            // Check if more documents
cursor.next()                               // Get next document
cursor.forEach(doc => print(doc.name))      // Iterate
cursor.toArray()                            // Convert to array
cursor.limit(10)                            // Limit results
cursor.skip(5)                              // Skip results
cursor.sort({ age: -1 })                    // Sort
cursor.count()                              // Count (deprecated)
cursor.close()                              // Close cursor

// ===== BATCH SIZE =====

db.users.find().batchSize(100)              // Set batch size

// ===== ITERATION CONTROLS =====

DBQuery.shellBatchSize = 20                 // Set default batch size

// ===== PRETTY PRINT =====

db.users.find().pretty()                    // Format output

// ===== OBJECT ID =====

ObjectId()                                  // Generate new ObjectId
ObjectId('507f1f77bcf86cd799439011')       // From string
ObjectId().getTimestamp()                   // Get timestamp
ObjectId().str                              // Get hex string

// ===== ISO DATE =====

ISODate()                                   // Current date
ISODate('2024-01-01')                       // From string
new Date()                                  // JavaScript date

// ===== UUID =====

UUID()                                      // Generate UUID

// ===== NUMBER TYPES =====

NumberInt(42)                               // 32-bit integer
NumberLong('9223372036854775807')          // 64-bit integer
NumberDecimal('99.99')                      // Decimal128

// ===== BINARY DATA =====

BinData(0, 'SGVsbG8=')                     // Binary data

// ===== REGEX =====

/pattern/                                   // Regex literal
/pattern/i                                  // Case-insensitive

// ===== MIN/MAX KEY =====

MinKey                                      // Min key
MaxKey                                      // Max key

// ===== TIMESTAMP =====

Timestamp(1, 0)                             // MongoDB timestamp`}</code>
                </pre>
              </div>
            </section>
          )}

          {/* Admin Commands */}
          {activeTab === "admin" && (
            <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
              <h2 className="text-3xl font-bold mb-6 text-purple-300">
                Admin Commands
              </h2>

              {/* User Management */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-purple-300">
                  1. User Management
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`// ===== CREATE USER =====

use admin
db.createUser({
  user: 'myUser',
  pwd: 'myPassword',
  roles: [
    { role: 'readWrite', db: 'myDatabase' },
    { role: 'dbAdmin', db: 'myDatabase' }
  ]
})

// ===== PREDEFINED ROLES =====

// Database User Roles:
// - read: Read data on all non-system collections
// - readWrite: Read and write data on all non-system collections

// Database Administration Roles:
// - dbAdmin: Database administration tasks
// - dbOwner: Database owner (all privileges)
// - userAdmin: Create and modify users and roles

// Cluster Administration Roles:
// - clusterAdmin: Cluster administration
// - clusterManager: Cluster management and monitoring
// - clusterMonitor: Read-only cluster monitoring
// - hostManager: Monitor and manage servers

// Backup and Restore Roles:
// - backup: Backup database
// - restore: Restore database

// All-Database Roles:
// - readAnyDatabase: Read all databases
// - readWriteAnyDatabase: Read/write all databases
// - userAdminAnyDatabase: User admin on all databases
// - dbAdminAnyDatabase: Database admin on all databases

// Superuser Roles:
// - root: Complete access to all resources

// ===== UPDATE USER =====

db.updateUser('myUser', {
  pwd: 'newPassword',
  roles: [
    { role: 'readWrite', db: 'myDatabase' }
  ]
})

// ===== CHANGE USER PASSWORD =====

db.changeUserPassword('myUser', 'newPassword')

// ===== GRANT ROLES =====

db.grantRolesToUser('myUser', [
  { role: 'dbAdmin', db: 'myDatabase' }
])

// ===== REVOKE ROLES =====

db.revokeRolesFromUser('myUser', [
  { role: 'dbAdmin', db: 'myDatabase' }
])

// ===== DROP USER =====

db.dropUser('myUser')

// ===== LIST USERS =====

db.getUsers()
show users

// ===== GET USER =====

db.getUser('myUser')
db.getUser('myUser', { showCredentials: true })

// ===== AUTHENTICATE =====

db.auth('myUser', 'myPassword')

// ===== LOGOUT =====

db.logout()`}</code>
                </pre>
              </div>

              {/* Role Management */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-purple-300">
                  2. Role Management
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`// ===== CREATE CUSTOM ROLE =====

db.createRole({
  role: 'customRole',
  privileges: [
    {
      resource: { db: 'myDatabase', collection: 'users' },
      actions: ['find', 'insert', 'update']
    },
    {
      resource: { db: 'myDatabase', collection: 'logs' },
      actions: ['find']
    }
  ],
  roles: [
    { role: 'read', db: 'otherDatabase' }
  ]
})

// ===== UPDATE ROLE =====

db.updateRole('customRole', {
  privileges: [
    {
      resource: { db: 'myDatabase', collection: 'users' },
      actions: ['find', 'insert', 'update', 'remove']
    }
  ],
  roles: []
})

// ===== GRANT PRIVILEGES =====

db.grantPrivilegesToRole('customRole', [
  {
    resource: { db: 'myDatabase', collection: 'products' },
    actions: ['find']
  }
])

// ===== REVOKE PRIVILEGES =====

db.revokePrivilegesFromRole('customRole', [
  {
    resource: { db: 'myDatabase', collection: 'products' },
    actions: ['find']
  }
])

// ===== GRANT ROLES TO ROLE =====

db.grantRolesToRole('customRole', [
  { role: 'readWrite', db: 'myDatabase' }
])

// ===== REVOKE ROLES FROM ROLE =====

db.revokeRolesFromRole('customRole', [
  { role: 'readWrite', db: 'myDatabase' }
])

// ===== DROP ROLE =====

db.dropRole('customRole')

// ===== LIST ROLES =====

db.getRoles()
show roles

// ===== GET ROLE =====

db.getRole('customRole')
db.getRole('customRole', { showPrivileges: true })

// ===== ALL ACTIONS =====

/*
  Collection Actions:
  - find, insert, update, remove
  - createCollection, dropCollection
  - createIndex, dropIndex
  - renameCollectionSameDB
  - collMod, convertToCapped
  
  Database Actions:
  - listCollections, listIndexes
  - dbStats, collStats
  - createRole, dropRole, grantRole, revokeRole
  - createUser, dropUser, changePassword, grantRole
  
  Cluster Actions:
  - serverStatus, replSetGetStatus
  - shutdown, resync, appendOplogNote
  - setParameter, getParameter
  
  All Collection:
  - all database actions on all collections
*/`}</code>
                </pre>
              </div>

              {/* Server Administration */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-purple-300">
                  3. Server Administration
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`// ===== SERVER STATUS =====

db.serverStatus()
db.serverStatus({ repl: 1, metrics: 0 })

// ===== SERVER INFO =====

db.serverBuildInfo()
db.serverCmdLineOpts()
db.hostInfo()

// ===== SHUTDOWN SERVER =====

use admin
db.shutdownServer()
db.shutdownServer({ force: true, timeoutSecs: 10 })

// ===== SET/GET PARAMETERS =====

db.adminCommand({ setParameter: 1, logLevel: 2 })
db.adminCommand({ getParameter: 1, logLevel: 1 })
db.adminCommand({ getParameter: '*' })

// ===== FSYNC & LOCK =====

db.fsyncLock()                              // Lock and flush
db.fsyncUnlock()                            // Unlock
db.runCommand({ fsync: 1 })                // Flush to disk
db.runCommand({ fsync: 1, lock: true })    // Flush and lock

// ===== COMPACT =====

db.runCommand({ compact: 'users' })
db.runCommand({ compact: 'users', force: true })

// ===== REPAIR DATABASE =====

db.runCommand({ repairDatabase: 1 })

// ===== CLONE DATABASE =====

db.cloneDatabase('source-host:27017')

// ===== COPY DATABASE =====

db.copyDatabase('sourceDb', 'targetDb')

// ===== CONNECTION MANAGEMENT =====

db.adminCommand({ connPoolStats: 1 })
db.adminCommand({ getCmdLineOpts: 1 })

// ===== KILL OPERATIONS =====

db.currentOp()
db.killOp(12345)

// ===== MANAGE INDEXES =====

db.adminCommand({ reIndex: 'users' })`}</code>
                </pre>
              </div>

              {/* Replication Commands */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-purple-300">
                  4. Replication Commands
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`// ===== REPLICA SET STATUS =====

rs.status()                                 // Replica set status
rs.conf()                                   // Replica set configuration
rs.config()                                 // Same as rs.conf()

// ===== INITIATE REPLICA SET =====

rs.initiate()
rs.initiate({
  _id: 'myReplicaSet',
  members: [
    { _id: 0, host: 'localhost:27017' },
    { _id: 1, host: 'localhost:27018' },
    { _id: 2, host: 'localhost:27019' }
  ]
})

// ===== ADD MEMBERS =====

rs.add('localhost:27020')
rs.add({ host: 'localhost:27020', priority: 0.5 })
rs.add({ host: 'localhost:27021', arbiterOnly: true })

// ===== REMOVE MEMBERS =====

rs.remove('localhost:27020')

// ===== RECONFIGURE =====

const config = rs.conf()
config.members[0].priority = 2
rs.reconfig(config)
rs.reconfig(config, { force: true })

// ===== STEP DOWN PRIMARY =====

rs.stepDown()
rs.stepDown(60)                            // Step down for 60 seconds

// ===== CHECK PRIMARY =====

rs.isMaster()
db.isMaster()

// ===== FREEZE MEMBER =====

rs.freeze(120)                             // Prevent elections for 120s

// ===== SYNC FROM =====

rs.syncFrom('localhost:27018')

// ===== REPLICA SET HELPER METHODS =====

rs.help()
rs.printReplicationInfo()
rs.printSlaveReplicationInfo()

// ===== OPLOG INFO =====

use local
db.oplog.rs.find().sort({ $natural: -1 }).limit(1)`}</code>
                </pre>
              </div>

              {/* Sharding Commands */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-purple-300">
                  5. Sharding Commands
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`// ===== ENABLE SHARDING =====

use admin
db.runCommand({ enableSharding: 'myDatabase' })

// ===== SHARD COLLECTION =====

db.runCommand({
  shardCollection: 'myDatabase.users',
  key: { userId: 1 }
})

// Hashed sharding
db.runCommand({
  shardCollection: 'myDatabase.users',
  key: { userId: 'hashed' }
})

// ===== ADD SHARD =====

sh.addShard('localhost:27020')
sh.addShard('replicaSet/host1:27017,host2:27017')

// ===== REMOVE SHARD =====

db.runCommand({ removeShard: 'shard0001' })

// ===== SHARD STATUS =====

sh.status()
db.printShardingStatus()

// ===== LIST SHARDS =====

db.adminCommand({ listShards: 1 })

// ===== MOVE CHUNK =====

sh.moveChunk('myDatabase.users', 
  { userId: 100 }, 
  'shard0001'
)

// ===== SPLIT CHUNK =====

sh.splitAt('myDatabase.users', { userId: 100 })
sh.splitFind('myDatabase.users', { userId: 100 })

// ===== BALANCER =====

sh.enableBalancing('myDatabase.users')
sh.disableBalancing('myDatabase.users')
sh.getBalancerState()
sh.isBalancerRunning()
sh.setBalancerState(true)
sh.startBalancer()
sh.stopBalancer()

// ===== SHARDING HELPERS =====

sh.help()
sh.status()
sh.enableSharding('database')
sh.shardCollection('database.collection', { key: 1 })`}</code>
                </pre>
              </div>

              {/* Backup & Restore */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-purple-300">
                  6. Backup & Restore (CLI Tools)
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`// ===== MONGODUMP (Backup) =====

// Backup entire server
mongodump

// Backup specific database
mongodump --db myDatabase

// Backup specific collection
mongodump --db myDatabase --collection users

// Output directory
mongodump --out /backup/mongodb

// With compression
mongodump --gzip --out /backup/mongodb

// With authentication
mongodump --username user --password pass --authenticationDatabase admin

// Remote server
mongodump --host mongodb.example.com --port 27017

// ===== MONGORESTORE (Restore) =====

// Restore entire backup
mongorestore /backup/mongodb

// Restore specific database
mongorestore --db myDatabase /backup/mongodb/myDatabase

// Drop existing data
mongorestore --drop /backup/mongodb

// Restore with compression
mongorestore --gzip /backup/mongodb

// ===== MONGOEXPORT (Export to JSON/CSV) =====

// Export collection to JSON
mongoexport --db myDatabase --collection users --out users.json

// Export to CSV
mongoexport --db myDatabase --collection users --type=csv --fields name,email --out users.csv

// Export with query
mongoexport --db myDatabase --collection users --query '{ "age": { "$gte": 21 } }' --out adults.json

// ===== MONGOIMPORT (Import from JSON/CSV) =====

// Import JSON
mongoimport --db myDatabase --collection users --file users.json

// Import CSV
mongoimport --db myDatabase --collection users --type=csv --headerline --file users.csv

// Import with drop
mongoimport --db myDatabase --collection users --drop --file users.json

// Import JSON array
mongoimport --db myDatabase --collection users --jsonArray --file users.json`}</code>
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
                  <strong>Use mongosh over legacy mongo:</strong> mongosh is the
                  modern, improved shell
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Enable authentication:</strong> Always use
                  authentication in production
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Least privilege principle:</strong> Grant minimum
                  necessary permissions
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Regular backups:</strong> Use mongodump or Atlas
                  automated backups
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Monitor performance:</strong> Use profiling and
                  explain for slow queries
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Index optimization:</strong> Create indexes for common
                  queries
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Validate before production:</strong> Test schema
                  validation rules
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Use scripts:</strong> Automate repetitive tasks with
                  shell scripts
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Connection strings:</strong> Use connection strings
                  for environment configuration
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Document commands:</strong> Keep a reference of
                  frequently used commands
                </span>
              </li>
            </ul>
          </section>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8">
            <Link
              href="/phase1/bson-types"
              className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              ← Previous: BSON Types
            </Link>
            <Link
              href="/"
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              Phase 1 Complete! Back to Home →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
