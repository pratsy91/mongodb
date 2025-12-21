"use client";

import Link from "next/link";
import { useState } from "react";

export default function CheatSheetPage() {
  const [activeTab, setActiveTab] = useState("quick-reference");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <Link
          href="/"
          className="text-indigo-400 hover:text-indigo-300 mb-6 inline-block"
        >
          ← Back to Home
        </Link>

        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          MongoDB Interview Cheat Sheet
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Complete reference guide for MongoDB interviews - Quick lookups,
          common questions, and key concepts
        </p>

        {/* Tabs */}
        <div className="flex gap-3 mb-8 flex-wrap">
          <button
            onClick={() => setActiveTab("quick-reference")}
            className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
              activeTab === "quick-reference"
                ? "bg-indigo-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Quick Reference
          </button>
          <button
            onClick={() => setActiveTab("interview-questions")}
            className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
              activeTab === "interview-questions"
                ? "bg-indigo-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Interview Questions
          </button>
          <button
            onClick={() => setActiveTab("code-patterns")}
            className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
              activeTab === "code-patterns"
                ? "bg-indigo-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Code Patterns
          </button>
          <button
            onClick={() => setActiveTab("performance")}
            className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
              activeTab === "performance"
                ? "bg-indigo-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Performance Tips
          </button>
          <button
            onClick={() => setActiveTab("concepts")}
            className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
              activeTab === "concepts"
                ? "bg-indigo-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Key Concepts
          </button>
          <button
            onClick={() => setActiveTab("best-practices")}
            className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
              activeTab === "best-practices"
                ? "bg-indigo-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Best Practices
          </button>
        </div>

        <div className="space-y-6">
          {/* Quick Reference */}
          {activeTab === "quick-reference" && (
            <div className="space-y-6">
              {/* Query Operators */}
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-4 text-indigo-300">
                  Query Operators Quick Reference
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-cyan-300 mb-2">
                      Comparison
                    </h3>
                    <div className="text-sm space-y-1 font-mono">
                      <div>$eq - Equal</div>
                      <div>$ne - Not equal</div>
                      <div>$gt - Greater than</div>
                      <div>$gte - Greater or equal</div>
                      <div>$lt - Less than</div>
                      <div>$lte - Less or equal</div>
                      <div>$in - In array</div>
                      <div>$nin - Not in array</div>
                    </div>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-cyan-300 mb-2">
                      Logical
                    </h3>
                    <div className="text-sm space-y-1 font-mono">
                      <div>$and - AND logic</div>
                      <div>$or - OR logic</div>
                      <div>$not - NOT logic</div>
                      <div>$nor - NOR logic</div>
                    </div>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-cyan-300 mb-2">
                      Element
                    </h3>
                    <div className="text-sm space-y-1 font-mono">
                      <div>$exists - Field exists</div>
                      <div>$type - BSON type check</div>
                    </div>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-cyan-300 mb-2">
                      Array
                    </h3>
                    <div className="text-sm space-y-1 font-mono">
                      <div>$all - All elements match</div>
                      <div>$elemMatch - Element matches</div>
                      <div>$size - Array size</div>
                    </div>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-cyan-300 mb-2">
                      Evaluation
                    </h3>
                    <div className="text-sm space-y-1 font-mono">
                      <div>$regex - Pattern match</div>
                      <div>$expr - Aggregation expr</div>
                      <div>$jsonSchema - Schema validation</div>
                      <div>$mod - Modulo operation</div>
                      <div>$text - Text search</div>
                      <div>$where - JavaScript expr</div>
                    </div>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-cyan-300 mb-2">
                      Geospatial
                    </h3>
                    <div className="text-sm space-y-1 font-mono">
                      <div>$geoWithin - Within geometry</div>
                      <div>$geoIntersects - Intersects</div>
                      <div>$near - Near point</div>
                      <div>$nearSphere - Near (sphere)</div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Update Operators */}
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-4 text-indigo-300">
                  Update Operators Quick Reference
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-purple-300 mb-2">
                      Field
                    </h3>
                    <div className="text-sm space-y-1 font-mono">
                      <div>$set - Set field value</div>
                      <div>$unset - Remove field</div>
                      <div>$rename - Rename field</div>
                      <div>$inc - Increment number</div>
                      <div>$mul - Multiply number</div>
                      <div>$min - Set if smaller</div>
                      <div>$max - Set if larger</div>
                      <div>$currentDate - Set date</div>
                    </div>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-purple-300 mb-2">
                      Array
                    </h3>
                    <div className="text-sm space-y-1 font-mono">
                      <div>$push - Add to array</div>
                      <div>$pop - Remove from end</div>
                      <div>$pull - Remove matching</div>
                      <div>$pullAll - Remove all</div>
                      <div>$addToSet - Add unique</div>
                      <div>$each - With push/addToSet</div>
                      <div>$position - Insert position</div>
                      <div>$slice - Limit array size</div>
                      <div>$sort - Sort array</div>
                    </div>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-purple-300 mb-2">
                      Array Modifiers
                    </h3>
                    <div className="text-sm space-y-1 font-mono">
                      <div>$[] - All array elements</div>
                      <div>$[&lt;identifier&gt;] - Filtered</div>
                      <div>$ - First match</div>
                      <div>$push.$each - Multiple items</div>
                      <div>$push.$slice - Limit size</div>
                      <div>$push.$sort - Sort items</div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Aggregation Pipeline Stages */}
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-4 text-indigo-300">
                  Aggregation Pipeline Stages
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-300 mb-2">
                      Filtering
                    </h3>
                    <div className="text-sm space-y-1 font-mono">
                      <div>$match - Filter docs</div>
                      <div>$limit - Limit count</div>
                      <div>$skip - Skip docs</div>
                      <div>$sample - Random sample</div>
                      <div>$redact - Restrict content</div>
                    </div>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-300 mb-2">
                      Transformation
                    </h3>
                    <div className="text-sm space-y-1 font-mono">
                      <div>$project - Select fields</div>
                      <div>$addFields - Add fields</div>
                      <div>$set - Add/update fields</div>
                      <div>$unset - Remove fields</div>
                      <div>$replaceRoot - Replace root</div>
                      <div>$replaceWith - Replace doc</div>
                      <div>$unwind - Deconstruct array</div>
                    </div>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-300 mb-2">
                      Grouping
                    </h3>
                    <div className="text-sm space-y-1 font-mono">
                      <div>$group - Group by expr</div>
                      <div>$bucket - Group by range</div>
                      <div>$bucketAuto - Auto range</div>
                      <div>$sortByCount - Group & count</div>
                      <div>$facet - Multiple pipelines</div>
                    </div>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-300 mb-2">
                      Joins & Output
                    </h3>
                    <div className="text-sm space-y-1 font-mono">
                      <div>$lookup - Left outer join</div>
                      <div>$graphLookup - Recursive</div>
                      <div>$unionWith - Union colls</div>
                      <div>$merge - Merge to coll</div>
                      <div>$out - Write to coll</div>
                      <div>$count - Count docs</div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Aggregation Accumulators */}
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-4 text-indigo-300">
                  Aggregation Accumulators
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-yellow-300 mb-2">
                      Basic
                    </h3>
                    <div className="text-sm space-y-1 font-mono">
                      <div>$sum - Sum values</div>
                      <div>$avg - Average values</div>
                      <div>$min - Minimum value</div>
                      <div>$max - Maximum value</div>
                      <div>$count - Count docs</div>
                    </div>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-yellow-300 mb-2">
                      Array
                    </h3>
                    <div className="text-sm space-y-1 font-mono">
                      <div>$push - Push to array</div>
                      <div>$addToSet - Unique array</div>
                      <div>$first - First value</div>
                      <div>$last - Last value</div>
                      <div>$top - Top N docs</div>
                      <div>$topN - Top N (new)</div>
                      <div>$bottom - Bottom N</div>
                      <div>$bottomN - Bottom N (new)</div>
                    </div>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-yellow-300 mb-2">
                      Statistical
                    </h3>
                    <div className="text-sm space-y-1 font-mono">
                      <div>$stdDevPop - Std dev pop</div>
                      <div>$stdDevSamp - Std dev sample</div>
                      <div>$median - Median value</div>
                      <div>$percentile - Percentile</div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Index Types */}
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-4 text-indigo-300">
                  Index Types & Properties
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-pink-300 mb-2">
                      Index Types
                    </h3>
                    <div className="text-sm space-y-1 font-mono">
                      <div>Single Field - One field</div>
                      <div>Compound - Multiple fields</div>
                      <div>Multikey - Array fields</div>
                      <div>Text - Full-text search</div>
                      <div>2dsphere - Geospatial</div>
                      <div>2d - Legacy geospatial</div>
                      <div>Hashed - Sharding</div>
                      <div>Wildcard - Dynamic fields</div>
                    </div>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-pink-300 mb-2">
                      Index Properties
                    </h3>
                    <div className="text-sm space-y-1 font-mono">
                      <div>unique - Unique values</div>
                      <div>sparse - Skip nulls</div>
                      <div>partial - Conditional</div>
                      <div>TTL - Time to live</div>
                      <div>hidden - Hidden from planner</div>
                      <div>collation - Sort rules</div>
                    </div>
                  </div>
                </div>
              </section>

              {/* CRUD Operations */}
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-4 text-indigo-300">
                  CRUD Operations
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-300 mb-2">
                      Read
                    </h3>
                    <div className="text-sm space-y-1 font-mono">
                      <div>find() - Multiple docs</div>
                      <div>findOne() - Single doc</div>
                      <div>countDocuments() - Count</div>
                      <div>distinct() - Unique values</div>
                      <div>estimatedDocumentCount() - Fast count</div>
                    </div>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-300 mb-2">
                      Write
                    </h3>
                    <div className="text-sm space-y-1 font-mono">
                      <div>insertOne() - Insert one</div>
                      <div>insertMany() - Insert many</div>
                      <div>updateOne() - Update one</div>
                      <div>updateMany() - Update many</div>
                      <div>replaceOne() - Replace one</div>
                      <div>deleteOne() - Delete one</div>
                      <div>deleteMany() - Delete many</div>
                      <div>bulkWrite() - Bulk ops</div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* Interview Questions */}
          {activeTab === "interview-questions" && (
            <div className="space-y-6">
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-4 text-indigo-300">
                  Fundamental Questions
                </h2>
                <div className="space-y-4">
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-cyan-300 mb-2">
                      Q: What is MongoDB and how does it differ from SQL
                      databases?
                    </h3>
                    <p className="text-gray-200 text-sm">
                      <strong>A:</strong> MongoDB is a NoSQL document database
                      that stores data in BSON (Binary JSON) format. Key
                      differences: Schema-less design, horizontal scaling,
                      embedded documents vs joins, flexible data model,
                      JSON-like query language. SQL databases are table-based
                      with fixed schemas, use SQL, and are better for ACID
                      transactions across complex relationships.
                    </p>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-cyan-300 mb-2">
                      Q: What is BSON and how is it different from JSON?
                    </h3>
                    <p className="text-gray-200 text-sm">
                      <strong>A:</strong> BSON (Binary JSON) is MongoDB&apos;s
                      binary-encoded serialization format. Differences: BSON
                      supports additional data types (Date, ObjectId, Binary,
                      etc.), is more efficient for parsing, includes length
                      prefixes for faster traversal, and supports more data
                      types than JSON. JSON is text-based and human-readable.
                    </p>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-cyan-300 mb-2">
                      Q: Explain ObjectId structure
                    </h3>
                    <p className="text-gray-200 text-sm">
                      <strong>A:</strong> ObjectId is a 12-byte identifier: 4
                      bytes timestamp (Unix epoch), 5 bytes random value (unique
                      per process), 3 bytes incrementing counter. This ensures
                      uniqueness and allows sorting by creation time. Format:
                      <code className="bg-black/50 px-1 rounded">
                        {"{timestamp}{machine}{pid}{counter}"}
                      </code>
                    </p>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-cyan-300 mb-2">
                      Q: What are the advantages of embedding vs referencing?
                    </h3>
                    <p className="text-gray-200 text-sm">
                      <strong>A:</strong> Embedding: Better for one-to-few
                      relationships, faster reads (single query), atomic
                      updates. Use when data is accessed together. Referencing:
                      Better for one-to-many/many-to-many, prevents document
                      size issues (16MB limit), avoids data duplication. Use
                      when relationships are complex or data grows
                      independently.
                    </p>
                  </div>
                </div>
              </section>

              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-4 text-indigo-300">
                  Query & Aggregation Questions
                </h2>
                <div className="space-y-4">
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-purple-300 mb-2">
                      Q: Explain the difference between find() and aggregate()
                    </h3>
                    <p className="text-gray-200 text-sm">
                      <strong>A:</strong> find() is for simple queries and
                      returns documents matching criteria. aggregate() uses a
                      pipeline of stages for complex data processing: filtering,
                      grouping, transforming, joining, and computing. Use find()
                      for simple queries, aggregate() for analytics,
                      transformations, and complex data processing.
                    </p>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-purple-300 mb-2">
                      Q: What is $lookup and when would you use it?
                    </h3>
                    <p className="text-gray-200 text-sm">
                      <strong>A:</strong> $lookup performs a left outer join
                      between collections. It matches documents from the input
                      collection with documents from the &quot;joined&quot;
                      collection. Use it when you need to combine data from
                      multiple collections in aggregation pipelines. Similar to
                      SQL LEFT OUTER JOIN. Can join on equality or use $expr for
                      complex conditions.
                    </p>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-purple-300 mb-2">
                      Q: Explain $group accumulator operators
                    </h3>
                    <p className="text-gray-200 text-sm">
                      <strong>A:</strong> Accumulators compute values across
                      grouped documents: $sum, $avg, $min, $max, $first, $last,
                      $push (array), $addToSet (unique array), $stdDevPop,
                      $stdDevSamp. They can only be used in $group stage. New
                      accumulators: $top, $topN, $bottom, $bottomN, $median,
                      $percentile for advanced statistics.
                    </p>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-purple-300 mb-2">
                      Q: What is the difference between $match and $project?
                    </h3>
                    <p className="text-gray-200 text-sm">
                      <strong>A:</strong> $match filters documents (like WHERE
                      in SQL), reducing the number of documents in the pipeline.
                      $project selects/transforms fields (like SELECT in SQL),
                      reshaping documents. Best practice: Use $match early in
                      pipeline to reduce data volume, then $project to shape
                      output.
                    </p>
                  </div>
                </div>
              </section>

              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-4 text-indigo-300">
                  Index Questions
                </h2>
                <div className="space-y-4">
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-300 mb-2">
                      Q: Explain different types of indexes in MongoDB
                    </h3>
                    <p className="text-gray-200 text-sm">
                      <strong>A:</strong> Single field (one field), Compound
                      (multiple fields, order matters), Multikey (array fields),
                      Text (full-text search), Geospatial (2dsphere for GeoJSON,
                      2d for legacy), Hashed (for sharding), Wildcard (dynamic
                      fields). Each serves different query patterns.
                    </p>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-300 mb-2">
                      Q: What is index selectivity and why does it matter?
                    </h3>
                    <p className="text-gray-200 text-sm">
                      <strong>A:</strong> Selectivity is the ratio of unique
                      values to total documents. Higher selectivity (more unique
                      values) = better index performance. Low selectivity (many
                      duplicates) may not use index efficiently. For compound
                      indexes, put most selective fields first (ESR rule:
                      Equality, Sort, Range).
                    </p>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-300 mb-2">
                      Q: Explain the ESR (Equality, Sort, Range) rule for
                      compound indexes
                    </h3>
                    <p className="text-gray-200 text-sm">
                      <strong>A:</strong> Order fields in compound index:
                      Equality fields first (exact matches), then Sort fields
                      (ORDER BY), then Range fields (comparison operators). This
                      allows MongoDB to use the index efficiently. Example:{" "}
                      {"{status: 1, created: -1, age: 1}"} for query
                      {"{status: 'active'}"} sorted by created descending with
                      age range.
                    </p>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-300 mb-2">
                      Q: What is a covered query?
                    </h3>
                    <p className="text-gray-200 text-sm">
                      <strong>A:</strong> A covered query is one where all
                      fields in the query and projection are included in the
                      index. MongoDB can return results using only the index
                      without accessing documents. This is extremely fast. Use
                      explain() to check if query is covered (look for
                      &quot;indexOnly: true&quot;).
                    </p>
                  </div>
                </div>
              </section>

              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-4 text-indigo-300">
                  Replication & Sharding Questions
                </h2>
                <div className="space-y-4">
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-yellow-300 mb-2">
                      Q: Explain replica sets and how they work
                    </h3>
                    <p className="text-gray-200 text-sm">
                      <strong>A:</strong> Replica sets provide high availability
                      through replication. One primary (handles writes) and
                      multiple secondaries (replicate data). Automatic failover
                      via elections. Oplog (operations log) records all write
                      operations for replication. Read preferences allow reading
                      from secondaries. Minimum 3 nodes recommended (or 2 +
                      arbiter).
                    </p>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-yellow-300 mb-2">
                      Q: What is the difference between read preference and read
                      concern?
                    </h3>
                    <p className="text-gray-200 text-sm">
                      <strong>A:</strong> Read preference determines which
                      replica set member to read from (primary, secondary,
                      nearest). Read concern determines what data is visible to
                      the read operation (local, available, majority,
                      linearizable, snapshot). Read preference = WHERE to read,
                      Read concern = WHAT consistency level.
                    </p>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-yellow-300 mb-2">
                      Q: Explain sharding in MongoDB
                    </h3>
                    <p className="text-gray-200 text-sm">
                      <strong>A:</strong> Sharding distributes data across
                      multiple servers (shards) for horizontal scaling.
                      Components: Shards (data storage), Config servers
                      (metadata), Mongos (query router). Shard key determines
                      data distribution. Chunks are data ranges on shards.
                      Balancer moves chunks for even distribution. Supports both
                      range-based and hash-based sharding.
                    </p>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-yellow-300 mb-2">
                      Q: What makes a good shard key?
                    </h3>
                    <p className="text-gray-200 text-sm">
                      <strong>A:</strong> Good shard key: High cardinality (many
                      unique values), even distribution (avoids hotspots),
                      supports common query patterns (targeted queries), low
                      frequency of changes. Bad shard key: Low cardinality,
                      monotonically increasing (like timestamp), causes
                      hotspots, doesn&apos;t support queries. Shard key cannot
                      be changed after sharding.
                    </p>
                  </div>
                </div>
              </section>

              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-4 text-indigo-300">
                  Performance & Optimization Questions
                </h2>
                <div className="space-y-4">
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-pink-300 mb-2">
                      Q: How do you optimize a slow query?
                    </h3>
                    <p className="text-gray-200 text-sm">
                      <strong>A:</strong> Steps: 1) Use explain() to analyze
                      execution plan, 2) Check if index is used (look for IXSCAN
                      not COLLSCAN), 3) Create appropriate indexes, 4) Use
                      projection to limit fields, 5) Add $match early in
                      aggregation, 6) Use hint() to force index, 7) Check for
                      covered queries, 8) Consider compound indexes following
                      ESR rule, 9) Monitor index usage and remove unused
                      indexes.
                    </p>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-pink-300 mb-2">
                      Q: What is the difference between
                      explain(&quot;executionStats&quot;) and
                      explain(&quot;allPlansExecution&quot;)?
                    </h3>
                    <p className="text-gray-200 text-sm">
                      <strong>A:</strong> &quot;executionStats&quot; shows
                      statistics for the winning plan (execution time, documents
                      examined, keys examined). &quot;allPlansExecution&quot;
                      shows stats for all candidate plans, useful for
                      understanding why a specific plan was chosen.
                      &quot;queryPlanner&quot; shows plan without execution. Use
                      executionStats for performance analysis.
                    </p>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-pink-300 mb-2">
                      Q: Explain write concern levels
                    </h3>
                    <p className="text-gray-200 text-sm">
                      <strong>A:</strong> Write concern determines
                      acknowledgment requirements: w: 0 (fire and forget), w: 1
                      (primary only, default), w: &quot;majority&quot; (majority
                      of nodes), w: N (N nodes), w: &quot;tag&quot; (tagged
                      replica set). j: true requires journal commit. wtimeout:
                      timeout in ms. Higher write concern = more durability but
                      slower writes.
                    </p>
                  </div>
                </div>
              </section>

              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-4 text-indigo-300">
                  Transactions & ACID Questions
                </h2>
                <div className="space-y-4">
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-300 mb-2">
                      Q: Does MongoDB support ACID transactions?
                    </h3>
                    <p className="text-gray-200 text-sm">
                      <strong>A:</strong> Yes, since MongoDB 4.0, multi-document
                      ACID transactions are supported for replica sets. MongoDB
                      4.2 added support for sharded clusters. Transactions
                      provide atomicity, consistency, isolation, and durability.
                      Use sessions for transactions. Single-document operations
                      are always atomic.
                    </p>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-300 mb-2">
                      Q: When should you use transactions?
                    </h3>
                    <p className="text-gray-200 text-sm">
                      <strong>A:</strong> Use transactions when you need to
                      update multiple documents atomically, maintain referential
                      integrity, or ensure consistency across collections.
                      However, transactions have overhead (performance cost,
                      16MB limit, write conflicts). Consider if you really need
                      transactions or if schema design can avoid them.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* Code Patterns */}
          {activeTab === "code-patterns" && (
            <div className="space-y-6">
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-4 text-indigo-300">
                  Common Query Patterns
                </h2>
                <div className="space-y-4">
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-cyan-300 mb-2">
                      Pagination Pattern
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{`// Offset-based pagination
const page = 1;
const limit = 10;
const skip = (page - 1) * limit;

const users = await collection
  .find({ active: true })
  .sort({ createdAt: -1 })
  .skip(skip)
  .limit(limit)
  .toArray();

// Cursor-based pagination (better for large datasets)
const lastId = req.query.lastId;
const query = lastId 
  ? { _id: { $gt: new ObjectId(lastId) } }
  : {};
const users = await collection
  .find(query)
  .sort({ _id: 1 })
  .limit(limit)
  .toArray();`}</code>
                    </pre>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-cyan-300 mb-2">
                      Upsert Pattern
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{`// Update if exists, insert if not
await collection.updateOne(
  { email: 'user@example.com' },
  { 
    $set: { 
      name: 'John',
      updatedAt: new Date()
    },
    $setOnInsert: {
      createdAt: new Date()
    }
  },
  { upsert: true }
);

// Using findOneAndUpdate
const result = await collection.findOneAndUpdate(
  { email: 'user@example.com' },
  { $set: { name: 'John' } },
  { upsert: true, returnDocument: 'after' }
);`}</code>
                    </pre>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-cyan-300 mb-2">
                      Soft Delete Pattern
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{`// Instead of deleting, mark as deleted
await collection.updateOne(
  { _id: userId },
  { 
    $set: { 
      deleted: true,
      deletedAt: new Date()
    }
  }
);

// Query excluding deleted
const activeUsers = await collection
  .find({ deleted: { $ne: true } })
  .toArray();

// Or use $exists
const activeUsers = await collection
  .find({ deleted: { $exists: false } })
  .toArray();`}</code>
                    </pre>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-cyan-300 mb-2">
                      Array Update Patterns
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{`// Add to array (unique)
await collection.updateOne(
  { _id: userId },
  { $addToSet: { tags: 'premium' } }
);

// Add multiple unique items
await collection.updateOne(
  { _id: userId },
  { $addToSet: { tags: { $each: ['premium', 'vip'] } } }
);

// Remove from array
await collection.updateOne(
  { _id: userId },
  { $pull: { tags: 'premium' } }
);

// Update array element by index
await collection.updateOne(
  { _id: userId },
  { $set: { 'items.0.status': 'completed' } }
);

// Update matching array elements
await collection.updateOne(
  { _id: userId },
  { $set: { 'items.$[elem].status': 'completed' } },
  { arrayFilters: [{ 'elem.status': 'pending' }] }
);`}</code>
                    </pre>
                  </div>
                </div>
              </section>

              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-4 text-indigo-300">
                  Aggregation Patterns
                </h2>
                <div className="space-y-4">
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-purple-300 mb-2">
                      Group and Count Pattern
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{`// Count documents by category
const result = await collection.aggregate([
  { $match: { status: 'active' } },
  { $group: {
      _id: '$category',
      count: { $sum: 1 },
      total: { $sum: '$amount' }
    }
  },
  { $sort: { count: -1 } }
]).toArray();`}</code>
                    </pre>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-purple-300 mb-2">
                      Join Pattern ($lookup)
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{`// Join orders with products
const result = await collection.aggregate([
  { $match: { userId: userId } },
  { $lookup: {
      from: 'products',
      localField: 'productId',
      foreignField: '_id',
      as: 'product'
    }
  },
  { $unwind: '$product' },
  { $project: {
      orderId: '$_id',
      productName: '$product.name',
      price: '$product.price'
    }
  }
]).toArray();`}</code>
                    </pre>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-purple-300 mb-2">
                      Time-based Grouping Pattern
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{`// Group by date (daily stats)
const result = await collection.aggregate([
  { $match: { createdAt: { $gte: startDate } } },
  { $group: {
      _id: {
        $dateToString: {
          format: '%Y-%m-%d',
          date: '$createdAt'
        }
      },
      count: { $sum: 1 },
      total: { $sum: '$amount' }
    }
  },
  { $sort: { _id: 1 } }
]).toArray();`}</code>
                    </pre>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-purple-300 mb-2">
                      Faceted Search Pattern
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{`// Multiple aggregations in parallel
const result = await collection.aggregate([
  { $match: { category: 'electronics' } },
  { $facet: {
      byPrice: [
        { $bucket: {
            groupBy: '$price',
            boundaries: [0, 100, 500, 1000, Infinity],
            default: 'Other'
          }
        }
      ],
      byBrand: [
        { $group: { _id: '$brand', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ],
      total: [
        { $count: 'count' }
      ]
    }
  }
]).toArray();`}</code>
                    </pre>
                  </div>
                </div>
              </section>

              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-4 text-indigo-300">
                  Mongoose Patterns
                </h2>
                <div className="space-y-4">
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-300 mb-2">
                      Schema with Validation
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{`const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: (v) => /^[\\w\\.-]+@[\\w\\.-]+\\.[a-z]{2,}$/i.test(v),
      message: 'Invalid email'
    }
  },
  age: {
    type: Number,
    min: [0, 'Age cannot be negative'],
    max: [120, 'Age too high']
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending'],
    default: 'pending'
  }
});`}</code>
                    </pre>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-300 mb-2">
                      Virtuals and Methods
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{`// Virtual property
userSchema.virtual('fullName').get(function() {
  return \`\${this.firstName} \${this.lastName}\`;
});

// Instance method
userSchema.methods.getAge = function() {
  return Math.floor((Date.now() - this.birthDate) / (365.25 * 24 * 60 * 60 * 1000));
};

// Static method
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

// Query helper
userSchema.query.byStatus = function(status) {
  return this.where({ status: status });
};`}</code>
                    </pre>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-300 mb-2">
                      Middleware (Hooks)
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{`// Pre-save hook
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Post-save hook
userSchema.post('save', function(doc) {
  console.log(\`User \${doc._id} saved\`);
});

// Pre-remove hook
userSchema.pre('remove', async function(next) {
  // Delete related documents
  await Order.deleteMany({ userId: this._id });
  next();
});`}</code>
                    </pre>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-300 mb-2">
                      Population Pattern
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{`// Single population
const order = await Order.findById(orderId)
  .populate('userId', 'name email')
  .populate('productId');

// Multiple populations
const order = await Order.findById(orderId)
  .populate([
    { path: 'userId', select: 'name email' },
    { path: 'productId', populate: { path: 'categoryId' } }
  ]);

// Conditional population
const order = await Order.findById(orderId)
  .populate({
    path: 'userId',
    match: { status: 'active' },
    select: 'name email'
  });`}</code>
                    </pre>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* Performance Tips */}
          {activeTab === "performance" && (
            <div className="space-y-6">
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-4 text-indigo-300">
                  Index Optimization
                </h2>
                <div className="space-y-4">
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-yellow-300 mb-2">
                      Index Best Practices
                    </h3>
                    <ul className="text-gray-200 text-sm space-y-2 list-disc list-inside">
                      <li>Create indexes on frequently queried fields</li>
                      <li>
                        Follow ESR rule for compound indexes (Equality, Sort,
                        Range)
                      </li>
                      <li>Use explain() to verify index usage</li>
                      <li>Remove unused indexes (they slow down writes)</li>
                      <li>
                        Use sparse indexes for optional fields with many nulls
                      </li>
                      <li>Use partial indexes for conditional queries</li>
                      <li>
                        Consider TTL indexes for time-based data expiration
                      </li>
                      <li>
                        Monitor index size and usage with
                        db.collection.getIndexes()
                      </li>
                    </ul>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-yellow-300 mb-2">
                      Query Optimization
                    </h3>
                    <ul className="text-gray-200 text-sm space-y-2 list-disc list-inside">
                      <li>Use projection to limit returned fields</li>
                      <li>Add $match early in aggregation pipelines</li>
                      <li>Avoid $where and JavaScript expressions (slow)</li>
                      <li>Use $regex with anchors (^, $) when possible</li>
                      <li>Limit result sets with $limit</li>
                      <li>Use cursor-based pagination for large datasets</li>
                      <li>
                        Avoid skip() with large values (use range queries
                        instead)
                      </li>
                      <li>Use hint() to force specific index when needed</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-4 text-indigo-300">
                  Write Performance
                </h2>
                <div className="space-y-4">
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-pink-300 mb-2">
                      Bulk Operations
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{`// Use bulkWrite for multiple operations
await collection.bulkWrite([
  { updateOne: { filter: { _id: 1 }, update: { $set: { status: 'active' } } } },
  { updateOne: { filter: { _id: 2 }, update: { $set: { status: 'active' } } } },
  { insertOne: { document: { name: 'New User' } } }
], { ordered: false }); // unordered is faster

// Use insertMany instead of multiple insertOne
await collection.insertMany(documents, { ordered: false });`}</code>
                    </pre>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-pink-300 mb-2">
                      Write Concern Tuning
                    </h3>
                    <ul className="text-gray-200 text-sm space-y-2 list-disc list-inside">
                      <li>Lower write concern (w: 1) for better performance</li>
                      <li>
                        Use w: &quot;majority&quot; only when durability is
                        critical
                      </li>
                      <li>
                        Set appropriate wtimeout to avoid hanging operations
                      </li>
                      <li>
                        Consider j: false for non-critical writes (faster but
                        less durable)
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-4 text-indigo-300">
                  Aggregation Performance
                </h2>
                <div className="space-y-4">
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-cyan-300 mb-2">
                      Pipeline Optimization
                    </h3>
                    <ul className="text-gray-200 text-sm space-y-2 list-disc list-inside">
                      <li>Place $match as early as possible</li>
                      <li>Use $project to reduce document size early</li>
                      <li>Add $limit before expensive operations like $sort</li>
                      <li>Use $indexStats to check index usage</li>
                      <li>Avoid $lookup when possible (consider embedding)</li>
                      <li>Use $facet for parallel processing</li>
                      <li>
                        Consider $out or $merge for expensive aggregations
                      </li>
                    </ul>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-cyan-300 mb-2">
                      Memory Management
                    </h3>
                    <ul className="text-gray-200 text-sm space-y-2 list-disc list-inside">
                      <li>Use allowDiskUse: true for large aggregations</li>
                      <li>Monitor memory usage with explain()</li>
                      <li>Break large aggregations into smaller stages</li>
                      <li>Use $out to materialize intermediate results</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-4 text-indigo-300">
                  Monitoring & Profiling
                </h2>
                <div className="space-y-4">
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-300 mb-2">
                      Using explain()
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{`// Check query execution plan
const explain = await collection
  .find({ status: 'active' })
  .explain('executionStats');

// Key metrics to check:
// - executionStats.executionTimeMillis (should be low)
// - executionStats.totalDocsExamined (should match returned docs)
// - executionStats.executionStages.stage (IXSCAN is good, COLLSCAN is bad)
// - executionStats.executionStages.indexOnly (true = covered query)

// For aggregation
const explain = await collection.aggregate([
  { $match: { status: 'active' } }
]).explain('executionStats');`}</code>
                    </pre>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-300 mb-2">
                      Profiling Slow Queries
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{`// Enable profiling (0=off, 1=slow, 2=all)
db.setProfilingLevel(1, { slowms: 100 });

// View slow queries
db.system.profile.find().sort({ ts: -1 }).limit(10).pretty();

// Find queries taking longer than 100ms
db.system.profile.find({
  millis: { $gt: 100 }
}).sort({ millis: -1 }).pretty();`}</code>
                    </pre>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* Key Concepts */}
          {activeTab === "concepts" && (
            <div className="space-y-6">
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-4 text-indigo-300">
                  Core Concepts
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-cyan-300 mb-2">
                      Document
                    </h3>
                    <p className="text-gray-200 text-sm">
                      Basic unit of data in MongoDB. Stored as BSON. Maximum
                      size: 16MB. Contains field-value pairs. Can be nested
                      (embedded documents).
                    </p>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-cyan-300 mb-2">
                      Collection
                    </h3>
                    <p className="text-gray-200 text-sm">
                      Group of documents. Schema-less (documents can have
                      different structures). Created lazily on first write. Can
                      be capped (fixed size) or regular.
                    </p>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-cyan-300 mb-2">
                      Database
                    </h3>
                    <p className="text-gray-200 text-sm">
                      Container for collections. Can have multiple databases.
                      Each database has its own file system. Created on first
                      write.
                    </p>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-cyan-300 mb-2">
                      BSON
                    </h3>
                    <p className="text-gray-200 text-sm">
                      Binary JSON. MongoDB&apos;s data format. Supports more
                      types than JSON (Date, ObjectId, Binary, etc.). More
                      efficient for parsing and storage.
                    </p>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-cyan-300 mb-2">
                      ObjectId
                    </h3>
                    <p className="text-gray-200 text-sm">
                      12-byte unique identifier. Contains timestamp, machine ID,
                      process ID, and counter. Automatically generated. Can be
                      sorted by creation time.
                    </p>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-cyan-300 mb-2">
                      Cursor
                    </h3>
                    <p className="text-gray-200 text-sm">
                      Pointer to query result set. Supports iteration, batching,
                      and modifiers. Lazy evaluation (fetches on demand). Can be
                      converted to array with toArray().
                    </p>
                  </div>
                </div>
              </section>

              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-4 text-indigo-300">
                  Replication Concepts
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-purple-300 mb-2">
                      Primary
                    </h3>
                    <p className="text-gray-200 text-sm">
                      Single node in replica set that receives all write
                      operations. Only one primary at a time. Handles all writes
                      and can handle reads.
                    </p>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-purple-300 mb-2">
                      Secondary
                    </h3>
                    <p className="text-gray-200 text-sm">
                      Replicates data from primary. Can serve reads (with read
                      preference). Can become primary during failover. Maintains
                      copy of oplog.
                    </p>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-purple-300 mb-2">
                      Oplog
                    </h3>
                    <p className="text-gray-200 text-sm">
                      Operations log. Capped collection storing all write
                      operations. Used for replication. Secondaries tail this
                      log to replicate changes.
                    </p>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-purple-300 mb-2">
                      Election
                    </h3>
                    <p className="text-gray-200 text-sm">
                      Process of selecting new primary when current primary
                      becomes unavailable. Uses Raft consensus algorithm.
                      Requires majority of votes.
                    </p>
                  </div>
                </div>
              </section>

              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-4 text-indigo-300">
                  Sharding Concepts
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-300 mb-2">
                      Shard
                    </h3>
                    <p className="text-gray-200 text-sm">
                      Individual MongoDB instance (or replica set) storing
                      subset of data. Each shard is independent. Data is
                      distributed across shards.
                    </p>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-300 mb-2">
                      Shard Key
                    </h3>
                    <p className="text-gray-200 text-sm">
                      Field or fields used to distribute documents across
                      shards. Cannot be changed after sharding. Critical for
                      performance. Should have high cardinality and even
                      distribution.
                    </p>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-300 mb-2">
                      Chunk
                    </h3>
                    <p className="text-gray-200 text-sm">
                      Contiguous range of shard key values. Default size: 64MB.
                      MongoDB splits chunks when they grow too large. Balancer
                      moves chunks between shards.
                    </p>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-300 mb-2">
                      Mongos
                    </h3>
                    <p className="text-gray-200 text-sm">
                      Query router. Routes queries to appropriate shards.
                      Clients connect to mongos, not shards directly. Maintains
                      metadata cache from config servers.
                    </p>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-300 mb-2">
                      Config Server
                    </h3>
                    <p className="text-gray-200 text-sm">
                      Stores cluster metadata (shard locations, chunk ranges).
                      Must be replica set (3+ nodes). Critical for cluster
                      operation.
                    </p>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-300 mb-2">
                      Balancer
                    </h3>
                    <p className="text-gray-200 text-sm">
                      Background process that redistributes chunks across
                      shards. Ensures even data distribution. Runs on one mongos
                      instance.
                    </p>
                  </div>
                </div>
              </section>

              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-4 text-indigo-300">
                  Consistency & Isolation
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-yellow-300 mb-2">
                      Read Preference
                    </h3>
                    <p className="text-gray-200 text-sm">
                      Determines which replica set member to read from: primary
                      (default), primaryPreferred, secondary,
                      secondaryPreferred, nearest. Affects consistency vs
                      availability trade-off.
                    </p>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-yellow-300 mb-2">
                      Read Concern
                    </h3>
                    <p className="text-gray-200 text-sm">
                      Determines data visibility: local (fastest, may see
                      uncommitted), available (similar to local), majority
                      (committed to majority), linearizable (strongest),
                      snapshot (transactional).
                    </p>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-yellow-300 mb-2">
                      Write Concern
                    </h3>
                    <p className="text-gray-200 text-sm">
                      Acknowledgment requirements for writes: w (number of
                      nodes), j (journal commit), wtimeout (timeout). Higher =
                      more durable but slower.
                    </p>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-yellow-300 mb-2">
                      Transactions
                    </h3>
                    <p className="text-gray-200 text-sm">
                      Multi-document ACID transactions. Use sessions. Support
                      read/write concerns. Have overhead. 16MB limit per
                      transaction. Supported in replica sets (4.0+) and sharded
                      clusters (4.2+).
                    </p>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* Best Practices */}
          {activeTab === "best-practices" && (
            <div className="space-y-6">
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-4 text-indigo-300">
                  Schema Design
                </h2>
                <div className="space-y-4">
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-cyan-300 mb-2">
                      Embedding vs Referencing
                    </h3>
                    <ul className="text-gray-200 text-sm space-y-2 list-disc list-inside">
                      <li>
                        <strong>Embed:</strong> One-to-few, data accessed
                        together, small documents, atomic updates needed
                      </li>
                      <li>
                        <strong>Reference:</strong> One-to-many/many-to-many,
                        large documents, data grows independently, frequent
                        updates
                      </li>
                      <li>Consider 16MB document size limit</li>
                      <li>Consider read vs write patterns</li>
                    </ul>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-cyan-300 mb-2">
                      Schema Patterns
                    </h3>
                    <ul className="text-gray-200 text-sm space-y-2 list-disc list-inside">
                      <li>
                        <strong>Attribute Pattern:</strong> For documents with
                        many similar fields
                      </li>
                      <li>
                        <strong>Bucket Pattern:</strong> For time-series data
                        (group by time ranges)
                      </li>
                      <li>
                        <strong>Computed Pattern:</strong> Pre-compute expensive
                        calculations
                      </li>
                      <li>
                        <strong>Subset Pattern:</strong> Separate frequently vs
                        rarely accessed data
                      </li>
                      <li>
                        <strong>Extended Reference:</strong> Denormalize
                        frequently accessed fields
                      </li>
                      <li>
                        <strong>Polymorphic Pattern:</strong> Different document
                        structures in same collection
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-4 text-indigo-300">
                  Security Best Practices
                </h2>
                <div className="space-y-4">
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-purple-300 mb-2">
                      Authentication & Authorization
                    </h3>
                    <ul className="text-gray-200 text-sm space-y-2 list-disc list-inside">
                      <li>Always enable authentication in production</li>
                      <li>Use strong passwords and SCRAM-SHA-256</li>
                      <li>
                        Follow principle of least privilege (minimal roles)
                      </li>
                      <li>Use role-based access control (RBAC)</li>
                      <li>Regularly audit user accounts and permissions</li>
                      <li>
                        Use x.509 certificates for internal authentication
                      </li>
                    </ul>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-purple-300 mb-2">
                      Network Security
                    </h3>
                    <ul className="text-gray-200 text-sm space-y-2 list-disc list-inside">
                      <li>Use TLS/SSL for all connections</li>
                      <li>Bind to specific IP addresses, not 0.0.0.0</li>
                      <li>Use firewall rules to restrict access</li>
                      <li>Use VPN or private networks for production</li>
                      <li>Enable encryption at rest for sensitive data</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-4 text-indigo-300">
                  Performance Best Practices
                </h2>
                <div className="space-y-4">
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-300 mb-2">
                      Index Strategy
                    </h3>
                    <ul className="text-gray-200 text-sm space-y-2 list-disc list-inside">
                      <li>Index all frequently queried fields</li>
                      <li>Follow ESR rule for compound indexes</li>
                      <li>Monitor and remove unused indexes</li>
                      <li>Use partial indexes for conditional queries</li>
                      <li>Use sparse indexes for optional fields</li>
                      <li>Consider index intersection for complex queries</li>
                    </ul>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-300 mb-2">
                      Query Optimization
                    </h3>
                    <ul className="text-gray-200 text-sm space-y-2 list-disc list-inside">
                      <li>Use projection to limit returned data</li>
                      <li>Add $match early in aggregation pipelines</li>
                      <li>Use cursor-based pagination for large datasets</li>
                      <li>Avoid skip() with large values</li>
                      <li>
                        Use bulk operations instead of individual operations
                      </li>
                      <li>Monitor slow queries with profiling</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-4 text-indigo-300">
                  Development Best Practices
                </h2>
                <div className="space-y-4">
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-yellow-300 mb-2">
                      Error Handling
                    </h3>
                    <ul className="text-gray-200 text-sm space-y-2 list-disc list-inside">
                      <li>Always handle connection errors</li>
                      <li>Use try-catch for database operations</li>
                      <li>Check for duplicate key errors (E11000)</li>
                      <li>Handle write concern timeouts appropriately</li>
                      <li>Log errors with context for debugging</li>
                    </ul>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-yellow-300 mb-2">
                      Connection Management
                    </h3>
                    <ul className="text-gray-200 text-sm space-y-2 list-disc list-inside">
                      <li>Use connection pooling (default in drivers)</li>
                      <li>
                        Reuse connections, don&apos;t create new ones per
                        request
                      </li>
                      <li>Set appropriate connection pool size</li>
                      <li>Handle connection failures gracefully</li>
                      <li>
                        Close connections properly on application shutdown
                      </li>
                    </ul>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-yellow-300 mb-2">
                      Data Validation
                    </h3>
                    <ul className="text-gray-200 text-sm space-y-2 list-disc list-inside">
                      <li>Use schema validation at database level</li>
                      <li>Validate data in application layer too</li>
                      <li>Use Mongoose validators for Node.js</li>
                      <li>Sanitize user input</li>
                      <li>Use $jsonSchema for complex validation</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-4 text-indigo-300">
                  Common Pitfalls to Avoid
                </h2>
                <div className="space-y-4">
                  <div className="bg-red-900/30 p-4 rounded-lg border border-red-500">
                    <h3 className="text-lg font-semibold text-red-300 mb-2">
                      ⚠️ Anti-Patterns
                    </h3>
                    <ul className="text-gray-200 text-sm space-y-2 list-disc list-inside">
                      <li>
                        Using $where or JavaScript expressions (very slow)
                      </li>
                      <li>Creating indexes on low-cardinality fields</li>
                      <li>
                        Using skip() with large values (use range queries)
                      </li>
                      <li>Not using indexes for frequently queried fields</li>
                      <li>Embedding arrays that grow unbounded (16MB limit)</li>
                      <li>Using transactions when not needed (overhead)</li>
                      <li>Not handling connection errors</li>
                      <li>Creating too many indexes (slows writes)</li>
                      <li>Using regex without anchors when possible</li>
                      <li>Not using projection for large documents</li>
                    </ul>
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
