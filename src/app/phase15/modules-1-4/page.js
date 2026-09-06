"use client";

import Link from "next/link";
import { useState } from "react";

function QA({ level, q, a }) {
  const [open, setOpen] = useState(false);
  const colors = {
    Junior: "bg-green-600/30 text-green-300 border-green-500/40",
    Mid: "bg-yellow-600/30 text-yellow-300 border-yellow-500/40",
    Senior: "bg-red-600/30 text-red-300 border-red-500/40",
  };

  return (
    <div className="border border-white/10 rounded-lg overflow-hidden bg-black/20">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left p-4 flex items-start gap-3 hover:bg-white/5 transition-all"
      >
        <span
          className={`text-xs font-bold px-2 py-1 rounded border shrink-0 mt-0.5 ${colors[level]}`}
        >
          {level}
        </span>
        <span className="flex-1 font-medium text-gray-100">{q}</span>
        <span className="text-gray-400 shrink-0">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div className="px-4 pb-4 pl-4 md:pl-20 text-gray-300 text-sm leading-relaxed border-t border-white/5 pt-3 whitespace-pre-wrap">
          {a}
        </div>
      )}
    </div>
  );
}

export default function Modules1to4Page() {
  const [activeTab, setActiveTab] = useState("m1");

  const tabs = [
    { id: "m1", label: "Module 1: Fundamentals" },
    { id: "m2", label: "Module 2: CRUD" },
    { id: "m3", label: "Module 3: Query Operators" },
    { id: "m4", label: "Module 4: Aggregation" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-rose-900 to-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <Link
          href="/"
          className="text-rose-400 hover:text-rose-300 mb-6 inline-block"
        >
          ← Back to Home
        </Link>

        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-rose-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
          Interview Q&A — Modules 1–4
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Most-asked MongoDB interview questions covering Fundamentals, CRUD,
          Query Operators, and Aggregation (Junior → Mid → Senior).
        </p>

        <div className="flex gap-3 mb-8 flex-wrap">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
                activeTab === t.id
                  ? "bg-rose-600 text-white"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {/* MODULE 1 */}
          {activeTab === "m1" && (
            <>
              <h2 className="text-2xl font-bold text-rose-300 mb-4">
                Module 1 — Phase 1: MongoDB Fundamentals & Setup
              </h2>

              <QA
                level="Junior"
                q="What is MongoDB and how is it different from a relational database?"
                a={`MongoDB is a document-oriented NoSQL database that stores data as BSON documents (JSON-like) in collections.

Key differences from RDBMS:
• Schema-flexible documents vs fixed tables/rows
• Horizontal scaling (sharding) is a first-class feature
• Joins exist ($lookup) but embedding is preferred when data is accessed together
• No rigid foreign-key constraints; relationships are application-managed
• Great for hierarchical/nested data and rapid iteration`}
              />

              <QA
                level="Junior"
                q="What is BSON? Why does MongoDB use BSON instead of JSON?"
                a={`BSON (Binary JSON) is MongoDB’s binary serialization format.

Why BSON over JSON:
• Supports richer types: ObjectId, Date, Binary, Decimal128, Long, etc.
• Faster to traverse/parse than text JSON
• Includes length prefixes for efficient scanning
• JSON is human-readable text; BSON is optimized for storage and network

Common interview types: ObjectId, String, Number (Int32/Int64/Double/Decimal128), Boolean, Date, Array, Embedded Document, Null, Binary.`}
              />

              <QA
                level="Junior"
                q="What is an ObjectId and what does it contain?"
                a={`ObjectId is a 12-byte unique identifier used as the default _id.

Structure (classic explanation interviewers expect):
• 4 bytes – timestamp (seconds since Unix epoch)
• 5 bytes – random value unique per machine/process (modern drivers)
• 3 bytes – incrementing counter

Useful facts:
• You can extract creation time: ObjectId.getTimestamp()
• Nearly unique without a central ID generator
• Sortable by creation time (roughly)`}
              />

              <QA
                level="Junior"
                q="What is the difference between a database, collection, and document?"
                a={`• Database – top-level container (e.g., ecommerce)
• Collection – group of documents (like a table, but schema-flexible)
• Document – single BSON record (like a row, but can be nested)

Example path: ecommerce.orders → collection; each order JSON is a document.`}
              />

              <QA
                level="Mid"
                q="Explain MongoDB connection URI options you commonly set in production."
                a={`Typical production URI concerns:
• replicaSet / srv – connect to a replica set (mongodb+srv://)
• authSource – auth DB (often admin)
• retryWrites=true – retry eligible writes on transient failures
• w / writeConcern – durability (majority recommended)
• readPreference – primary / secondaryPreferred / nearest
• maxPoolSize / minPoolSize – connection pool sizing
• tls=true – encrypted transport
• connectTimeoutMS / serverSelectionTimeoutMS – fail fast vs hang

Interview tip: mention pooling — drivers reuse connections; don’t create a new MongoClient per request.`}
              />

              <QA
                level="Mid"
                q="What are capped collections and when would you use them?"
                a={`Capped collections are fixed-size collections that overwrite oldest documents when full (circular buffer).

Use cases:
• High-throughput logs / event streams
• Caching recent N records
• MongoDB’s oplog is a capped collection

Constraints:
• Documents shouldn’t grow in size after insert
• No deletes of individual docs in normal usage patterns
• Natural insertion order is preserved`}
              />

              <QA
                level="Mid"
                q="What is the difference between mongosh shell commands and driver APIs?"
                a={`• mongosh – interactive admin/dev shell (db.users.find())
• Drivers (Node, Java, Python) – application code APIs (collection.find())

Same concepts, different syntax. Interviews often ask you to write both shell and Node/Mongoose versions.

Also distinguish:
• Database commands: db.runCommand({ ping: 1 })
• Helpers: show dbs, use mydb, db.stats()`}
              />

              <QA
                level="Senior"
                q="How do you design a safe MongoDB connection lifecycle in a Node.js app?"
                a={`Best-practice answer:
1. Create ONE MongoClient / mongoose connection at startup
2. Await connection before accepting traffic
3. Use connection pooling (default is fine; tune under load)
4. Handle reconnect / topology events; don’t swallow errors silently
5. On shutdown: close client gracefully (SIGTERM)
6. Never open/close client per request
7. Prefer connection string from env vars; never hardcode credentials
8. For serverless: reuse client across invocations (global cache)

Bonus: set sensible serverSelectionTimeoutMS and monitor pool wait queue.`}
              />

              <QA
                level="Senior"
                q="What BSON type pitfalls commonly cause production bugs?"
                a={`High-signal pitfalls:
• Number vs NumberLong vs Decimal128 — money should use Decimal128, not Double
• Dates stored as strings break range queries and indexes
• Mixing string and ObjectId for the same logical id field
• Null vs missing field — $exists and equality behave differently
• Arrays of different shapes breaking $elemMatch assumptions
• Large documents approaching 16MB limit — use GridFS or redesign

Interviewers love: “Never store currency as floating point Double.”`}
              />
            </>
          )}

          {/* MODULE 2 */}
          {activeTab === "m2" && (
            <>
              <h2 className="text-2xl font-bold text-rose-300 mb-4">
                Module 2 — Phase 2: CRUD Operations
              </h2>

              <QA
                level="Junior"
                q="What is the difference between insertOne and insertMany?"
                a={`• insertOne – inserts a single document; returns insertedId
• insertMany – inserts an array; returns insertedIds

insertMany options:
• ordered: true (default) – stop on first error
• ordered: false – continue inserting remaining docs on error

Interview tip: unordered is faster for bulk loads when some failures are acceptable.`}
              />

              <QA
                level="Junior"
                q="Difference between find and findOne?"
                a={`• find – returns a cursor (many docs); you iterate or toArray()
• findOne – returns a single document or null

Use findOne when you expect at most one result (e.g., by unique email).
Use find + limit(1) only when you need cursor options; findOne is clearer.`}
              />

              <QA
                level="Junior"
                q="What is projection in MongoDB?"
                a={`Projection controls which fields are returned.

Include: { name: 1, email: 1 }  (_id included by default)
Exclude: { password: 0 }

Rule: you generally cannot mix include and exclude (except excluding _id).

Why it matters: less data over the network, better memory use, can enable covered queries with indexes.`}
              />

              <QA
                level="Mid"
                q="updateOne vs replaceOne vs findOneAndUpdate — when do you use each?"
                a={`• updateOne – modify fields with update operators ($set, $inc); returns write result, not doc
• replaceOne – replace entire document (except _id)
• findOneAndUpdate – update and return the document (old or new)

Common options for findOneAndUpdate:
• returnDocument: 'after' (or new: true in Mongoose)
• upsert: true
• sort – if multiple matches, pick which one

Atomicity: findOneAndUpdate is atomic for that document — preferred over find + save race conditions.`}
              />

              <QA
                level="Mid"
                q="What is upsert? Give a real use case."
                a={`Upsert = update if found, insert if not found (upsert: true).

Use cases:
• “Create user settings if missing, else update”
• Idempotent event ingestion by eventId
• Counters / daily aggregates keyed by date

Caution: with update operators, only $setOnInsert fields apply on insert path; understand $set vs $setOnInsert.`}
              />

              <QA
                level="Mid"
                q="What is the difference between deleteOne, deleteMany, and soft delete?"
                a={`• deleteOne / deleteMany – hard delete from collection
• Soft delete – set flags like { deleted: true, deletedAt: Date } and filter them out in queries

Soft delete pros: recoverability, audit trail
Cons: every query must remember the filter; indexes get larger

Interview tip: mention partial indexes on { deleted: false } for performance.`}
              />

              <QA
                level="Mid"
                q="Explain write concern in the context of insert/update/delete."
                a={`Write concern controls acknowledgment of a write:
• w: 1 – acknowledged by primary
• w: 'majority' – majority of voting members
• j: true – journaled
• wtimeout – max wait

Higher write concern = safer durability, higher latency.
Most production apps use majority for critical data.`}
              />

              <QA
                level="Senior"
                q="How does bulkWrite work and when is it better than many single writes?"
                a={`bulkWrite sends many insert/update/delete/replace operations in one (or few) round trips.

Benefits:
• Huge reduction in network RTT
• Can be ordered or unordered
• Ideal for migrations, sync jobs, batch imports

Gotchas:
• Error handling differs for ordered vs unordered
• Still respect document 16MB limit and batch size limits
• Prefer bulkWrite over looping updateOne in app code`}
              />

              <QA
                level="Senior"
                q="How do you paginate large collections efficiently?"
                a={`Avoid deep skip() on huge offsets — O(n) and gets slow.

Better patterns:
1. Range / keyset pagination:
   find({ _id: { $gt: lastId } }).sort({ _id: 1 }).limit(20)
2. Sort on a stable indexed field (createdAt + _id)
3. For admin UIs needing page numbers, accept skip cost or precompute

Also: always pair sort + limit; never unbounded finds in APIs.`}
              />

              <QA
                level="Senior"
                q="What race conditions happen with read-modify-write, and how do you fix them?"
                a={`Classic bug:
const doc = await findOne(...)
doc.count += 1
await save(doc)
Two requests can overwrite each other.

Fixes:
• Atomic operators: updateOne({}, { $inc: { count: 1 } })
• findOneAndUpdate with conditions (optimistic checks)
• Transactions for multi-document invariants
• Versioning (__v / versionKey) for optimistic concurrency

Interview gold: prefer $inc / $push over loading the whole doc when possible.`}
              />
            </>
          )}

          {/* MODULE 3 */}
          {activeTab === "m3" && (
            <>
              <h2 className="text-2xl font-bold text-rose-300 mb-4">
                Module 3 — Phase 3: Query Operators
              </h2>

              <QA
                level="Junior"
                q="Name the most common comparison operators and give examples."
                a={`$eq, $ne, $gt, $gte, $lt, $lte, $in, $nin

Examples:
{ age: { $gte: 18 } }
{ status: { $in: ['active', 'pending'] } }
{ role: { $ne: 'banned' } }

Shorthand: { age: 18 } means { age: { $eq: 18 } }.`}
              />

              <QA
                level="Junior"
                q="Difference between $and, $or, $nor, and $not?"
                a={`• $and – all conditions true (implicit AND is default when multiple fields)
• $or – any condition true
• $nor – none of the conditions true
• $not – negates an operator expression

Use explicit $and when you need multiple conditions on the SAME field:
{ $and: [ { price: { $gt: 10 } }, { price: { $lt: 50 } } ] }
(or combine: { price: { $gt: 10, $lt: 50 } })`}
              />

              <QA
                level="Junior"
                q="What do $exists and $type do?"
                a={`• $exists: true/false – field is present / absent
• $type – match BSON type (e.g., "string", "objectId", 2)

Note: { field: null } matches both null values AND missing fields in many cases.
Use $exists: false when you specifically want missing fields.`}
              />

              <QA
                level="Mid"
                q="$in vs $or — which should you prefer?"
                a={`For equality against many values of ONE field, prefer $in:
{ status: { $in: ['a','b','c'] } }

$or is for different fields/conditions:
{ $or: [ { status: 'a' }, { priority: 1 } ] }

$in is usually cleaner and can use indexes better for that pattern.`}
              />

              <QA
                level="Mid"
                q="Explain $elemMatch and when a simple array match is not enough."
                a={`Simple match:
{ scores: { $gte: 80 } } — any element >= 80

Problem with compound conditions without $elemMatch:
{ "results.score": { $gte: 80 }, "results.pass": true }
can match DIFFERENT array elements.

$elemMatch ensures ONE element satisfies all:
{ results: { $elemMatch: { score: { $gte: 80 }, pass: true } } }

Extremely common interview question.`}
              />

              <QA
                level="Mid"
                q="How does $regex work and what are its performance risks?"
                a={`{ name: { $regex: /^john/i } } or { name: /john/i }

Performance:
• Prefix regex /^abc/ can use an index
• Leading wildcard /.*abc/ usually CANNOT use index efficiently → collection scan
• Prefer text indexes for full-text search use cases
• Escape user input to avoid ReDoS / unexpected patterns`}
              />

              <QA
                level="Mid"
                q="What is $expr and when do you use it?"
                a={`$expr lets you use aggregation expressions inside a find query — especially to compare fields to each other.

Example: find docs where spent > budget
{ $expr: { $gt: ["$spent", "$budget"] } }

Without $expr, find can’t easily compare two fields in the same document.`}
              />

              <QA
                level="Senior"
                q="How do array query operators $all, $size, and multikey indexes interact?"
                a={`• $all – array contains all listed values (order irrelevant)
• $size – exact array length (not range). For ranges, store arrayLength field or use aggregation
• Multikey indexes – MongoDB indexes each array element

Caveats:
• Compound index with two array fields is not allowed (parallel arrays restriction)
• $size doesn’t use multikey indexes well for selectivity sometimes — denormalize length if needed
• Large arrays → large multikey indexes; design carefully`}
              />

              <QA
                level="Senior"
                q="Explain geospatial operators you’d mention in an interview."
                a={`With 2dsphere index + GeoJSON:
• $near / $nearSphere – nearest points (sorted by distance)
• $geoWithin – points inside polygon/centerSphere
• $geoIntersects – geometries intersect

Must know:
• Legacy coordinate pairs vs GeoJSON { type: 'Point', coordinates: [lng, lat] }
• Longitude first, latitude second
• $near must be used carefully with other filters; often combine with $geoWithin for areas`}
              />

              <QA
                level="Senior"
                q="When would you use $where, and why do interviewers often say avoid it?"
                a={`$where runs JavaScript on the server per document.

Avoid because:
• Cannot use indexes effectively
• Slow and resource-heavy
• Security risk if built from user input
• Usually replaceable with $expr, aggregation, or better schema

Only mention as legacy/rare escape hatch.`}
              />
            </>
          )}

          {/* MODULE 4 */}
          {activeTab === "m4" && (
            <>
              <h2 className="text-2xl font-bold text-rose-300 mb-4">
                Module 4 — Phase 4: Aggregation Framework
              </h2>

              <QA
                level="Junior"
                q="What is the aggregation pipeline?"
                a={`A sequence of stages where each stage transforms documents and passes output to the next.

Common stages: $match → $group → $sort → $project → $limit

Mental model: like Unix pipes or a data factory line.
Prefer aggregation for analytics/reporting over many app-side loops.`}
              />

              <QA
                level="Junior"
                q="Difference between $match and find()?"
                a={`Both filter documents. $match uses the same query syntax inside a pipeline.

Why $match early:
• Reduces documents ASAP
• Can use indexes when first stage (or early enough)
• Improves pipeline performance dramatically`}
              />

              <QA
                level="Junior"
                q="Explain $group with a simple example."
                a={`$group aggregates by a key (_id) and uses accumulators.

Example: count users by role
{
  $group: {
    _id: "$role",
    total: { $sum: 1 },
    avgAge: { $avg: "$age" }
  }
}

Must-know accumulators: $sum, $avg, $min, $max, $push, $addToSet, $first, $last.`}
              />

              <QA
                level="Mid"
                q="What does $unwind do and what are its gotchas?"
                a={`$unwind deconstructs an array field into one document per element.

Gotchas:
• Missing/empty arrays drop the parent doc unless preserveNullAndEmptyArrays: true
• Can explode document count (cartesian growth) → memory/perf issues
• Often followed by $group to rebuild shape

Use carefully on large arrays.`}
              />

              <QA
                level="Mid"
                q="Explain $lookup like a left outer join."
                a={`$lookup joins another collection.

Basic:
{
  $lookup: {
    from: "orders",
    localField: "customerId",
    foreignField: "_id",
    as: "orders"
  }
}

Advanced (pipeline form) allows filtering/projecting inside the join — preferred for performance and shaping.

Interview tip: joins are powerful but embedding can be better if data is always read together.`}
              />

              <QA
                level="Mid"
                q="$project vs $addFields / $set — what’s the difference?"
                a={`• $project – include/exclude/reshape; can drop fields
• $addFields / $set – add or overwrite fields while keeping the rest

Use $addFields when you only want to compute extra fields without listing everything.
Use $project for a clean final shape/API response.`}
              />

              <QA
                level="Mid"
                q="What is $facet used for?"
                a={`$facet runs multiple sub-pipelines on the same input documents in one stage.

Use cases:
• Dashboard cards (counts + top lists + histograms) in one query
• Combined filters + aggregations for UI

Cost: can be memory heavy; still filter with $match before $facet.`}
              />

              <QA
                level="Senior"
                q="How do you optimize a slow aggregation pipeline?"
                a={`Checklist interviewers love:
1. $match as early as possible; use indexes
2. $project early to drop heavy unused fields
3. Avoid $unwind on huge arrays; redesign schema if frequent
4. allowDiskUse for large sorts/groups (with caution)
5. Prefer covered/indexed filters before $lookup
6. In $lookup pipeline, filter foreign collection early
7. Use explain('executionStats') on aggregations
8. Consider materialized views / pre-aggregated collections for hot dashboards
9. Watch document growth after $group/$push`}
              />

              <QA
                level="Senior"
                q="Explain $merge and $out — when to use each."
                a={`• $out – replaces an entire collection with pipeline results (or writes to new)
• $merge – can insert/merge/update into an existing collection with more control

Use $out for full rebuilds of reporting collections.
Use $merge for incremental upserts into a target collection.

Both are how you create materialized aggregates.`}
              />

              <QA
                level="Senior"
                q="What is $graphLookup and a typical interview scenario?"
                a={`$graphLookup does recursive search — hierarchical data / graph traversal.

Scenarios:
• Org chart (manager → reports)
• Category trees
• Friend-of-friend networks

Constraints: can be expensive; depth limits matter; not a full graph DB replacement.
Mention when hierarchical relationships are unbounded.`}
              />
            </>
          )}
        </div>

        <div className="flex justify-between items-center pt-10">
          <Link
            href="/"
            className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold"
          >
            ← Home
          </Link>
          <Link
            href="/phase15/modules-5-8"
            className="bg-gradient-to-r from-rose-600 to-pink-700 hover:from-rose-500 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Next: Modules 5–8 →
          </Link>
        </div>
      </div>
    </div>
  );
}
