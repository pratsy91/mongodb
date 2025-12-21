import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Complete MongoDB & Mongoose Mastery
          </h1>
          <p className="text-xl text-gray-300">
            Exhaustive Coverage - Every Feature, Every Operator, Every Concept
          </p>
          <p className="text-lg text-gray-400 mt-2">
            Both MongoDB Native Driver & Mongoose Examples
          </p>
        </header>

        <div className="space-y-6">
          {/* Phase 1 */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 hover:bg-white/15 transition-all">
            <h2 className="text-3xl font-bold mb-4 text-blue-300">
              Phase 1: MongoDB Fundamentals & Setup
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/phase1/connection"
                className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-lg hover:from-blue-500 hover:to-blue-600 transition-all shadow-lg hover:shadow-xl"
              >
                <h3 className="text-xl font-semibold mb-2">
                  1. Connection & Configuration
                </h3>
                <p className="text-sm text-gray-200">
                  All connection options, URI parameters, SSL/TLS, connection
                  pooling
                </p>
              </Link>
              <Link
                href="/phase1/databases-collections"
                className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 rounded-lg hover:from-purple-500 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl"
              >
                <h3 className="text-xl font-semibold mb-2">
                  2. Databases & Collections
                </h3>
                <p className="text-sm text-gray-200">
                  Creation, deletion, validation, capped collections, views
                </p>
              </Link>
              <Link
                href="/phase1/bson-types"
                className="bg-gradient-to-r from-pink-600 to-pink-700 p-6 rounded-lg hover:from-pink-500 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl"
              >
                <h3 className="text-xl font-semibold mb-2">
                  3. Documents & BSON Types
                </h3>
                <p className="text-sm text-gray-200">
                  All 19 BSON types, ObjectId deep dive, document structure
                </p>
              </Link>
              <Link
                href="/phase1/shell-commands"
                className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-6 rounded-lg hover:from-indigo-500 hover:to-indigo-600 transition-all shadow-lg hover:shadow-xl"
              >
                <h3 className="text-xl font-semibold mb-2">
                  4. MongoDB Shell Commands
                </h3>
                <p className="text-sm text-gray-200">
                  Every admin command, database commands, collection commands
                </p>
              </Link>
            </div>
          </div>

          {/* Phase 2 */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 hover:bg-white/15 transition-all">
            <h2 className="text-3xl font-bold mb-4 text-green-300">
              Phase 2: CRUD Operations - Complete Coverage
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link
                href="/phase2/insert"
                className="bg-gradient-to-r from-green-600 to-green-700 p-6 rounded-lg hover:from-green-500 hover:to-green-600 transition-all shadow-lg hover:shadow-xl"
              >
                <h3 className="text-xl font-semibold mb-2">
                  1. Insert Operations
                </h3>
                <p className="text-sm text-gray-200">
                  insertOne, insertMany, ordered/unordered, write concerns
                </p>
              </Link>
              <Link
                href="/phase2/read"
                className="bg-gradient-to-r from-teal-600 to-teal-700 p-6 rounded-lg hover:from-teal-500 hover:to-teal-600 transition-all shadow-lg hover:shadow-xl"
              >
                <h3 className="text-xl font-semibold mb-2">
                  2. Read Operations
                </h3>
                <p className="text-sm text-gray-200">
                  find, findOne, projection operators, cursors, batching
                </p>
              </Link>
              <Link
                href="/phase2/update"
                className="bg-gradient-to-r from-cyan-600 to-cyan-700 p-6 rounded-lg hover:from-cyan-500 hover:to-cyan-600 transition-all shadow-lg hover:shadow-xl"
              >
                <h3 className="text-xl font-semibold mb-2">
                  3. Update Operations
                </h3>
                <p className="text-sm text-gray-200">
                  All update operators: $set, $inc, $push, $pull, and more
                </p>
              </Link>
              <Link
                href="/phase2/delete"
                className="bg-gradient-to-r from-red-600 to-red-700 p-6 rounded-lg hover:from-red-500 hover:to-red-600 transition-all shadow-lg hover:shadow-xl"
              >
                <h3 className="text-xl font-semibold mb-2">
                  4. Delete Operations
                </h3>
                <p className="text-sm text-gray-200">
                  deleteOne, deleteMany, findOneAndDelete, soft deletes
                </p>
              </Link>
              <Link
                href="/phase2/bulk"
                className="bg-gradient-to-r from-orange-600 to-orange-700 p-6 rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl"
              >
                <h3 className="text-xl font-semibold mb-2">
                  5. Bulk Operations
                </h3>
                <p className="text-sm text-gray-200">
                  bulkWrite, ordered/unordered, batch processing patterns
                </p>
              </Link>
            </div>
          </div>

          {/* Phase 3 */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 hover:bg-white/15 transition-all">
            <h2 className="text-3xl font-bold mb-4 text-yellow-300">
              Phase 3: Query Operators - ALL of Them
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/phase3/comparison-logical"
                className="bg-gradient-to-r from-yellow-600 to-yellow-700 p-6 rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all shadow-lg hover:shadow-xl"
              >
                <h3 className="text-xl font-semibold mb-2">
                  1. Comparison & Logical Operators
                </h3>
                <p className="text-sm text-gray-200">
                  $eq, $ne, $gt, $gte, $lt, $lte, $in, $nin, $and, $or, $not,
                  $nor
                </p>
              </Link>
              <Link
                href="/phase3/element-evaluation"
                className="bg-gradient-to-r from-amber-600 to-amber-700 p-6 rounded-lg hover:from-amber-500 hover:to-amber-600 transition-all shadow-lg hover:shadow-xl"
              >
                <h3 className="text-xl font-semibold mb-2">
                  2. Element & Evaluation Operators
                </h3>
                <p className="text-sm text-gray-200">
                  $exists, $type, $regex, $expr, $jsonSchema, $mod, $text,
                  $where
                </p>
              </Link>
              <Link
                href="/phase3/array-bitwise"
                className="bg-gradient-to-r from-lime-600 to-lime-700 p-6 rounded-lg hover:from-lime-500 hover:to-lime-600 transition-all shadow-lg hover:shadow-xl"
              >
                <h3 className="text-xl font-semibold mb-2">
                  3. Array & Bitwise Operators
                </h3>
                <p className="text-sm text-gray-200">
                  $all, $elemMatch, $size, $bitsAllSet, $bitsAllClear,
                  $bitsAnySet, $bitsAnyClear
                </p>
              </Link>
              <Link
                href="/phase3/geospatial"
                className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-6 rounded-lg hover:from-emerald-500 hover:to-emerald-600 transition-all shadow-lg hover:shadow-xl"
              >
                <h3 className="text-xl font-semibold mb-2">
                  4. Geospatial Operators
                </h3>
                <p className="text-sm text-gray-200">
                  $geoIntersects, $geoWithin, $near, $nearSphere, $geometry,
                  $box, $center, $centerSphere
                </p>
              </Link>
            </div>
          </div>

          {/* Phase 4 */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 hover:bg-white/15 transition-all">
            <h2 className="text-3xl font-bold mb-4 text-purple-300">
              Phase 4: Aggregation Framework - Complete
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link
                href="/phase4/basic-aggregation"
                className="bg-gradient-to-r from-violet-600 to-violet-700 p-6 rounded-lg hover:from-violet-500 hover:to-violet-600 transition-all shadow-lg hover:shadow-xl"
              >
                <h3 className="text-xl font-semibold mb-2">
                  1. Basic Aggregation Pipeline
                </h3>
                <p className="text-sm text-gray-200">
                  $match, $group, $project, $sort, all accumulators ($sum, $avg,
                  $push, $topN, etc.)
                </p>
              </Link>
              <Link
                href="/phase4/joins-lookups"
                className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 rounded-lg hover:from-purple-500 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl"
              >
                <h3 className="text-xl font-semibold mb-2">
                  2. Joins & Lookups
                </h3>
                <p className="text-sm text-gray-200">
                  $lookup, $graphLookup, $unionWith, $facet - Complete guide
                </p>
              </Link>
              <Link
                href="/phase4/data-transformation"
                className="bg-gradient-to-r from-fuchsia-600 to-fuchsia-700 p-6 rounded-lg hover:from-fuchsia-500 hover:to-fuchsia-600 transition-all shadow-lg hover:shadow-xl"
              >
                <h3 className="text-xl font-semibold mb-2">
                  3. Data Transformation
                </h3>
                <p className="text-sm text-gray-200">
                  $unwind, $replaceRoot, $addFields, $bucket, $redact, $merge,
                  $out
                </p>
              </Link>
              <Link
                href="/phase4/expressions-1"
                className="bg-gradient-to-r from-pink-600 to-pink-700 p-6 rounded-lg hover:from-pink-500 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl"
              >
                <h3 className="text-xl font-semibold mb-2">
                  4. Expression Operators Part 1
                </h3>
                <p className="text-sm text-gray-200">
                  Arithmetic, Boolean, Comparison, Conditional, Type operators
                </p>
              </Link>
              <Link
                href="/phase4/expressions-2"
                className="bg-gradient-to-r from-rose-600 to-rose-700 p-6 rounded-lg hover:from-rose-500 hover:to-rose-600 transition-all shadow-lg hover:shadow-xl"
              >
                <h3 className="text-xl font-semibold mb-2">
                  5. Expression Operators Part 2
                </h3>
                <p className="text-sm text-gray-200">
                  Array (30+), String (20+), Date (30+) operators - All 80+
                  operators
                </p>
              </Link>
            </div>
          </div>

          {/* Phase 5 */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 hover:bg-white/15 transition-all">
            <h2 className="text-3xl font-bold mb-4 text-cyan-300">
              Phase 5: Indexes - Complete Coverage
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/phase5/basic-indexes"
                className="bg-gradient-to-r from-cyan-600 to-cyan-700 p-6 rounded-lg hover:from-cyan-500 hover:to-cyan-600 transition-all shadow-lg hover:shadow-xl"
              >
                <h3 className="text-xl font-semibold mb-2">1. Basic Indexes</h3>
                <p className="text-sm text-gray-200">
                  Single field, Compound, Multikey indexes and all index
                  operations
                </p>
              </Link>
              <Link
                href="/phase5/specialized-indexes"
                className="bg-gradient-to-r from-sky-600 to-sky-700 p-6 rounded-lg hover:from-sky-500 hover:to-sky-600 transition-all shadow-lg hover:shadow-xl"
              >
                <h3 className="text-xl font-semibold mb-2">
                  2. Specialized Indexes
                </h3>
                <p className="text-sm text-gray-200">
                  Text, Geospatial (2d, 2dsphere), Hashed, Wildcard indexes
                </p>
              </Link>
              <Link
                href="/phase5/index-properties"
                className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-lg hover:from-blue-500 hover:to-blue-600 transition-all shadow-lg hover:shadow-xl"
              >
                <h3 className="text-xl font-semibold mb-2">
                  3. Index Properties
                </h3>
                <p className="text-sm text-gray-200">
                  TTL, Unique, Sparse, Partial, Hidden, Collation indexes
                </p>
              </Link>
              <Link
                href="/phase5/index-performance"
                className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-6 rounded-lg hover:from-indigo-500 hover:to-indigo-600 transition-all shadow-lg hover:shadow-xl"
              >
                <h3 className="text-xl font-semibold mb-2">
                  4. Index Performance & Analysis
                </h3>
                <p className="text-sm text-gray-200">
                  explain(), hint(), Covered Queries, Index optimization
                </p>
              </Link>
            </div>
          </div>

          {/* Phase 6 */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 hover:bg-white/15 transition-all">
            <h2 className="text-3xl font-bold mb-4 text-emerald-300">
              Phase 6: Mongoose - Complete API
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/phase6/schema-definition"
                className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-6 rounded-lg hover:from-emerald-500 hover:to-emerald-600 transition-all shadow-lg hover:shadow-xl"
              >
                <h3 className="text-xl font-semibold mb-2">
                  1. Schema Definition
                </h3>
                <p className="text-sm text-gray-200">
                  All 12 SchemaTypes, options, validation (built-in & custom)
                </p>
              </Link>
              <Link
                href="/phase6/schema-features"
                className="bg-gradient-to-r from-teal-600 to-teal-700 p-6 rounded-lg hover:from-teal-500 hover:to-teal-600 transition-all shadow-lg hover:shadow-xl"
              >
                <h3 className="text-xl font-semibold mb-2">
                  2. Schema Features
                </h3>
                <p className="text-sm text-gray-200">
                  Virtuals, Methods, Statics, Query Helpers, Middleware
                </p>
              </Link>
              <Link
                href="/phase6/models-queries"
                className="bg-gradient-to-r from-green-600 to-green-700 p-6 rounded-lg hover:from-green-500 hover:to-green-600 transition-all shadow-lg hover:shadow-xl"
              >
                <h3 className="text-xl font-semibold mb-2">
                  3. Models & Queries
                </h3>
                <p className="text-sm text-gray-200">
                  All Model methods, Query API, Aggregation, Cursors
                </p>
              </Link>
              <Link
                href="/phase6/documents-population"
                className="bg-gradient-to-r from-lime-600 to-lime-700 p-6 rounded-lg hover:from-lime-500 hover:to-lime-600 transition-all shadow-lg hover:shadow-xl"
              >
                <h3 className="text-xl font-semibold mb-2">
                  4. Documents & Population
                </h3>
                <p className="text-sm text-gray-200">
                  Document methods, Subdocuments, All populate techniques
                </p>
              </Link>
              <Link
                href="/phase6/advanced-features"
                className="bg-gradient-to-r from-cyan-600 to-cyan-700 p-6 rounded-lg hover:from-cyan-500 hover:to-cyan-600 transition-all shadow-lg hover:shadow-xl"
              >
                <h3 className="text-xl font-semibold mb-2">
                  5. Advanced Features
                </h3>
                <p className="text-sm text-gray-200">
                  Connections, Transactions, Change Streams, Plugins
                </p>
              </Link>
            </div>
          </div>

          {/* Phase 7 */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 hover:bg-white/15 transition-all">
            <h2 className="text-3xl font-bold mb-4 text-amber-300">
              Phase 7: Advanced MongoDB Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/phase7/transactions-streams"
                className="bg-gradient-to-r from-amber-600 to-amber-700 p-6 rounded-lg hover:from-amber-500 hover:to-amber-600 transition-all shadow-lg hover:shadow-xl"
              >
                <h3 className="text-xl font-semibold mb-2">
                  1. Transactions & Change Streams
                </h3>
                <p className="text-sm text-gray-200">
                  Multi-document ACID transactions, retryable writes, real-time
                  change streams
                </p>
              </Link>
              <Link
                href="/phase7/geospatial-text"
                className="bg-gradient-to-r from-yellow-600 to-yellow-700 p-6 rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all shadow-lg hover:shadow-xl"
              >
                <h3 className="text-xl font-semibold mb-2">
                  2. Geospatial & Text Search
                </h3>
                <p className="text-sm text-gray-200">
                  GeoJSON, 2dsphere, full-text search, language analyzers
                </p>
              </Link>
              <Link
                href="/phase7/gridfs-storage"
                className="bg-gradient-to-r from-orange-600 to-orange-700 p-6 rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl"
              >
                <h3 className="text-xl font-semibold mb-2">
                  3. GridFS & Large Files
                </h3>
                <p className="text-sm text-gray-200">
                  Storing large files, chunks, metadata, streaming
                </p>
              </Link>
              <Link
                href="/phase7/special-collections"
                className="bg-gradient-to-r from-red-600 to-red-700 p-6 rounded-lg hover:from-red-500 hover:to-red-600 transition-all shadow-lg hover:shadow-xl"
              >
                <h3 className="text-xl font-semibold mb-2">
                  4. Special Collections
                </h3>
                <p className="text-sm text-gray-200">
                  Capped, Time Series, Views, Collation
                </p>
              </Link>
            </div>
          </div>

          {/* Phase 8 */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 hover:bg-white/15 transition-all">
            <h2 className="text-3xl font-bold mb-4 text-rose-300">
              Phase 8: Replication & High Availability
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/phase8/replica-sets"
                className="bg-gradient-to-r from-rose-600 to-rose-700 p-6 rounded-lg hover:from-rose-500 hover:to-rose-600 transition-all shadow-lg hover:shadow-xl"
              >
                <h3 className="text-xl font-semibold mb-2">
                  1. Replica Sets & Architecture
                </h3>
                <p className="text-sm text-gray-200">
                  Elections, priorities, arbiter, oplog, rollback, initial sync
                </p>
              </Link>
              <Link
                href="/phase8/read-write-concerns"
                className="bg-gradient-to-r from-pink-600 to-pink-700 p-6 rounded-lg hover:from-pink-500 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl"
              >
                <h3 className="text-xl font-semibold mb-2">
                  2. Read & Write Concerns
                </h3>
                <p className="text-sm text-gray-200">
                  Read preferences, write concerns, read concerns (all levels)
                </p>
              </Link>
            </div>
          </div>

          {/* Phase 9 */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 hover:bg-white/15 transition-all">
            <h2 className="text-3xl font-bold mb-4 text-fuchsia-300">
              Phase 9: Sharding
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/phase9/sharding-architecture"
                className="bg-gradient-to-r from-fuchsia-600 to-fuchsia-700 p-6 rounded-lg hover:from-fuchsia-500 hover:to-fuchsia-600 transition-all shadow-lg hover:shadow-xl"
              >
                <h3 className="text-xl font-semibold mb-2">
                  1. Sharding Architecture & Basics
                </h3>
                <p className="text-sm text-gray-200">
                  Architecture, chunks, balancing, ranged vs hashed sharding
                </p>
              </Link>
              <Link
                href="/phase9/shard-key-strategies"
                className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 rounded-lg hover:from-purple-500 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl"
              >
                <h3 className="text-xl font-semibold mb-2">
                  2. Shard Key Strategies
                </h3>
                <p className="text-sm text-gray-200">
                  Selection strategies, zone sharding, monitoring
                </p>
              </Link>
            </div>
          </div>

          {/* Phase 10 */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 hover:bg-white/15 transition-all">
            <h2 className="text-3xl font-bold mb-4 text-emerald-300">
              Phase 10: Security
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/phase10/authentication-authorization"
                className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-6 rounded-lg hover:from-emerald-500 hover:to-emerald-600 transition-all shadow-lg hover:shadow-xl"
              >
                <h3 className="text-xl font-semibold mb-2">
                  1. Authentication & Authorization
                </h3>
                <p className="text-sm text-gray-200">
                  SCRAM, x.509, LDAP, Kerberos, RBAC, roles, users
                </p>
              </Link>
              <Link
                href="/phase10/encryption-auditing"
                className="bg-gradient-to-r from-teal-600 to-teal-700 p-6 rounded-lg hover:from-teal-500 hover:to-teal-600 transition-all shadow-lg hover:shadow-xl"
              >
                <h3 className="text-xl font-semibold mb-2">
                  2. Encryption & Auditing
                </h3>
                <p className="text-sm text-gray-200">
                  TLS/SSL, at-rest encryption, field-level encryption, auditing
                </p>
              </Link>
            </div>
          </div>

          {/* Phase 11 */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 hover:bg-white/15 transition-all">
            <h2 className="text-3xl font-bold mb-4 text-cyan-300">
              Phase 11: Performance & Operations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/phase11/profiling-performance"
                className="bg-gradient-to-r from-cyan-600 to-cyan-700 p-6 rounded-lg hover:from-cyan-500 hover:to-cyan-600 transition-all shadow-lg hover:shadow-xl"
              >
                <h3 className="text-xl font-semibold mb-2">
                  1. Profiling & Performance
                </h3>
                <p className="text-sm text-gray-200">
                  Explain plans, profiling, optimization best practices
                </p>
              </Link>
              <Link
                href="/phase11/schema-patterns"
                className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-lg hover:from-blue-500 hover:to-blue-600 transition-all shadow-lg hover:shadow-xl"
              >
                <h3 className="text-xl font-semibold mb-2">
                  2. Schema Design Patterns
                </h3>
                <p className="text-sm text-gray-200">
                  All 12+ patterns: attribute, bucket, computed, subset, etc.
                </p>
              </Link>
              <Link
                href="/phase11/monitoring-backup"
                className="bg-gradient-to-r from-sky-600 to-sky-700 p-6 rounded-lg hover:from-sky-500 hover:to-sky-600 transition-all shadow-lg hover:shadow-xl"
              >
                <h3 className="text-xl font-semibold mb-2">
                  3. Monitoring & Backup
                </h3>
                <p className="text-sm text-gray-200">
                  Monitoring, metrics, backup/restore, import/export
                </p>
              </Link>
            </div>
          </div>

          {/* Phase 12 */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 hover:bg-white/15 transition-all">
            <h2 className="text-3xl font-bold mb-4 text-indigo-300">
              Phase 12: MongoDB Operators Reference
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/phase12/query-update-operators"
                className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-6 rounded-lg hover:from-indigo-500 hover:to-indigo-600 transition-all shadow-lg hover:shadow-xl"
              >
                <h3 className="text-xl font-semibold mb-2">
                  1. Query & Update Operators
                </h3>
                <p className="text-sm text-gray-200">
                  All comparison, logical, element, array, and update operators
                </p>
              </Link>
              <Link
                href="/phase12/aggregation-operators"
                className="bg-gradient-to-r from-violet-600 to-violet-700 p-6 rounded-lg hover:from-violet-500 hover:to-violet-600 transition-all shadow-lg hover:shadow-xl"
              >
                <h3 className="text-xl font-semibold mb-2">
                  2. Aggregation Operators
                </h3>
                <p className="text-sm text-gray-200">
                  All pipeline stages, arithmetic, array, string, date operators
                </p>
              </Link>
            </div>
          </div>

          {/* Phase 13 */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 hover:bg-white/15 transition-all">
            <h2 className="text-3xl font-bold mb-4 text-amber-300">
              Phase 13: Interview Cheat Sheet
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <Link
                href="/phase13/cheat-sheet"
                className="bg-gradient-to-r from-amber-600 to-amber-700 p-6 rounded-lg hover:from-amber-500 hover:to-amber-600 transition-all shadow-lg hover:shadow-xl"
              >
                <h3 className="text-xl font-semibold mb-2">
                  Complete Interview Cheat Sheet
                </h3>
                <p className="text-sm text-gray-200">
                  Quick reference guide, common interview questions, code
                  patterns, performance tips, key concepts, and best practices -
                  Everything you need for MongoDB interviews
                </p>
              </Link>
            </div>
          </div>

          {/* Completion Badge */}
          <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border-2 border-green-500 backdrop-blur-lg rounded-xl p-8 text-center">
            <h2 className="text-4xl font-bold mb-4 text-green-300">
              🎉 Complete MongoDB Learning System 🎉
            </h2>
            <p className="text-xl text-gray-200 mb-4">
              13 Phases • 45 Comprehensive Lessons • 500+ MongoDB Features
            </p>
            <p className="text-lg text-gray-300">
              From fundamentals to advanced operations, security, performance,
              complete operator reference, and interview preparation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
