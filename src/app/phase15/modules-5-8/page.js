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

export default function Modules5to8Page() {
  const [activeTab, setActiveTab] = useState("m5");

  const tabs = [
    { id: "m5", label: "Module 5: Indexes" },
    { id: "m6", label: "Module 6: Mongoose" },
    { id: "m7", label: "Module 7: Advanced Features" },
    { id: "m8", label: "Module 8: Replication" },
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
          Interview Q&A — Modules 5–8
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Most-asked questions on Indexes, Mongoose, Advanced Features, and
          Replication (Junior → Mid → Senior).
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
          {/* MODULE 5 */}
          {activeTab === "m5" && (
            <>
              <h2 className="text-2xl font-bold text-rose-300 mb-4">
                Module 5 — Phase 5: Indexes
              </h2>

              <QA
                level="Junior"
                q="What is an index and why do we need it?"
                a={`An index is a special data structure (B-tree / similar) that makes queries faster by avoiding full collection scans.

Trade-off:
• Faster reads/queries
• Extra disk/memory
• Slightly slower writes (index maintenance)

Default: every collection has an index on _id.`}
              />

              <QA
                level="Junior"
                q="Single-field vs compound index?"
                a={`• Single-field: { email: 1 }
• Compound: { status: 1, createdAt: -1 }

Compound indexes support queries on:
1. The prefix fields (status)
2. status + createdAt together

Order matters (ESR rule often cited: Equality, Sort, Range).`}
              />

              <QA
                level="Junior"
                q="What is a unique index?"
                a={`Ensures no two documents have the same value for the indexed field(s).

db.users.createIndex({ email: 1 }, { unique: true })

Duplicate insert → E11000 duplicate key error.
Compound unique indexes enforce uniqueness across the combination of fields.`}
              />

              <QA
                level="Mid"
                q="Explain sparse, partial, and TTL indexes."
                a={`• Sparse – only indexes documents that contain the field (skips missing)
• Partial – indexes only docs matching a filter expression (more flexible than sparse)
• TTL – automatically deletes docs after a time based on a date field (expireAfterSeconds)

Examples:
partialFilterExpression: { status: "active" }
TTL on session.expiresAt for session cleanup.`}
              />

              <QA
                level="Mid"
                q="What is a multikey index?"
                a={`Created automatically when you index a field that holds arrays — each array element gets an index entry.

Use: tags: ["mongodb", "nodejs"]

Limitation: a compound index cannot include more than one array field (parallel arrays issue).`}
              />

              <QA
                level="Mid"
                q="What is a covered query?"
                a={`A query answered entirely from the index — no need to fetch full documents.

Requirements:
• All filter fields in an index
• All projected fields in that index
• No fields outside the index (except carefully with _id)

Shown in explain as index-only / totalDocsExamined: 0 (ideal case).`}
              />

              <QA
                level="Mid"
                q="How do you read explain() output in an interview?"
                a={`Focus on:
• stage: COLLSCAN (bad for large data) vs IXSCAN (good)
• totalDocsExamined vs nReturned — high examined/returned ratio is a red flag
• executionTimeMillis
• indexName used
• whether SORT is in-memory or index-provided

Levels: queryPlanner, executionStats, allPlansExecution.`}
              />

              <QA
                level="Senior"
                q="How do you choose a good compound index? (ESR)"
                a={`ESR guideline:
1. Equality fields first (status: "active")
2. Sort fields next (createdAt: -1)
3. Range fields last (price: { $gt: 10 })

Also consider:
• Query frequency / workload
• Selectivity (high-cardinality fields help more)
• Avoid redundant indexes that are prefixes of others
• Write amplification cost on hot collections`}
              />

              <QA
                level="Senior"
                q="Text index vs regex vs Atlas Search — what do you say?"
                a={`• Text index ($text / $search language features in classic text) – stemming, stop words, score
• Regex – flexible but often not index-friendly with leading wildcards
• Atlas Search – Lucene-based, production full-text / fuzzy / facets

Interview answer: for serious search UX, prefer Atlas Search; for simple keyword, text index; avoid unbounded regex scans.`}
              />

              <QA
                level="Senior"
                q="What are hidden indexes and when are they useful?"
                a={`Hidden indexes are maintained but not used by the query planner.

Use case: safely test impact before dropping an index in production.
Workflow: hide → monitor → drop if no regressions.

Great senior-level ops answer.`}
              />
            </>
          )}

          {/* MODULE 6 */}
          {activeTab === "m6" && (
            <>
              <h2 className="text-2xl font-bold text-rose-300 mb-4">
                Module 6 — Phase 6: Mongoose
              </h2>

              <QA
                level="Junior"
                q="What is Mongoose and why use it?"
                a={`Mongoose is an ODM (Object Document Mapper) for Node.js + MongoDB.

Benefits:
• Schemas & validation
• Middleware (hooks)
• Population (relationships)
• Models/methods/statics/virtuals
• Casts types automatically

Trade-off: some overhead vs native driver; less flexible than raw BSON at times.`}
              />

              <QA
                level="Junior"
                q="Schema vs Model vs Document?"
                a={`• Schema – structure/definition (fields, validators, indexes)
• Model – compiled schema; used to query/create (User)
• Document – instance of a model (one user record with methods)

const user = new User({ name: "A" }); await user.save();`}
              />

              <QA
                level="Junior"
                q="Difference between save() and updateOne() in Mongoose?"
                a={`• save() – runs validators + middleware (pre/post save) by default; document-based
• updateOne/updateMany – direct query update; middleware differs (query middleware); validators off unless runValidators: true

Interview classic: “Why didn’t my pre('save') hook run?” → because you used updateOne.`}
              />

              <QA
                level="Mid"
                q="What are virtuals, methods, and statics?"
                a={`• Virtuals – computed fields not stored in MongoDB (fullName from first+last)
• Methods – instance functions (user.comparePassword())
• Statics – model-level functions (User.findByEmail())

Virtuals need toJSON/toObject { virtuals: true } to appear in output.`}
              />

              <QA
                level="Mid"
                q="Explain populate. Is it a real MongoDB join?"
                a={`populate replaces ObjectId refs with actual documents from another collection.

Under the hood: Mongoose issues additional queries (not always a single $lookup).

Pros: developer ergonomics
Cons: N+1 style risks if misused; can be slower than carefully designed $lookup aggregation or embedding

Tips: select only needed fields; use lean(); avoid deep populate trees blindly.`}
              />

              <QA
                level="Mid"
                q="What does lean() do and when should you use it?"
                a={`lean() returns plain JavaScript objects instead of full Mongoose documents.

Pros: faster, less memory
Cons: no save(), no getters/virtuals (unless configured), no document methods

Use for read-only API responses and high-throughput reads.`}
              />

              <QA
                level="Mid"
                q="How does validation work? Built-in vs custom?"
                a={`Built-in: required, min/max, minLength/maxLength, enum, match
Custom: validate: { validator: fn, message }

Async validators supported.
Updates need runValidators: true.
ValidationError contains error.errors map per path — common API error shaping topic.`}
              />

              <QA
                level="Senior"
                q="Explain Mongoose middleware types and ordering pitfalls."
                a={`Types:
• Document middleware: save, validate, remove
• Query middleware: find, updateOne, deleteMany
• Aggregate middleware: aggregate
• Model middleware: insertMany

Pitfalls:
• updateOne does not run save hooks
• findOneAndUpdate hooks are query middleware
• next() vs async/await styles
• cascading deletes often implemented in pre hooks — careful with transactions

Senior answer: know which hook runs for which API.`}
              />

              <QA
                level="Senior"
                q="How do you handle transactions with Mongoose?"
                a={`const session = await mongoose.startSession();
session.startTransaction();
try {
  await User.create([{...}], { session });
  await Order.create([{...}], { session });
  await session.commitTransaction();
} catch (e) {
  await session.abortTransaction();
  throw e;
} finally {
  session.endSession();
}

Or connection.transaction(async (session) => { ... })

Requires replica set (even single-node for local).`}
              />

              <QA
                level="Senior"
                q="Common Mongoose interview errors: CastError, ValidationError, OverwriteModelError?"
                a={`• CastError – invalid ObjectId / type cast failure (often bad :id param)
• ValidationError – schema rules failed
• OverwriteModelError – mongoose.model('User') called twice in hot reload / tests
• VersionError – optimistic concurrency (__v) conflict
• DocumentNotFoundError – orFail() when no doc

Good API design maps these to 400/404/409 responses.`}
              />
            </>
          )}

          {/* MODULE 7 */}
          {activeTab === "m7" && (
            <>
              <h2 className="text-2xl font-bold text-rose-300 mb-4">
                Module 7 — Phase 7: Advanced MongoDB Features
              </h2>

              <QA
                level="Junior"
                q="What are multi-document transactions?"
                a={`ACID transactions across multiple documents/collections/databases in a replica set / sharded cluster.

Use when business invariants span multiple docs (transfer money between accounts).

Don’t overuse — single-document atomicity is often enough and cheaper.`}
              />

              <QA
                level="Junior"
                q="What are change streams?"
                a={`Real-time stream of change events (insert/update/replace/delete/invalidate) on a collection, DB, or deployment.

Use cases: sync caches, notifications, CDC pipelines, live dashboards.

Requires replica set. Resume tokens allow restarting without missing events.`}
              />

              <QA
                level="Mid"
                q="When do you need GridFS?"
                a={`MongoDB document limit is 16MB. GridFS stores large files as chunks + metadata.

Use for: large uploads, media, documents.
Often better alternatives today: S3/GCS + store URL in MongoDB — mention this trade-off in interviews.`}
              />

              <QA
                level="Mid"
                q="What are time series collections?"
                a={`Specialized collections optimized for time-ordered measurements (IoT, metrics, logs).

Benefits: compression, efficient range queries on time, automatic bucketing internals.

You define timeField and often metaField.`}
              />

              <QA
                level="Mid"
                q="Views in MongoDB — what are they?"
                a={`Read-only virtual collections defined by an aggregation pipeline.

Use: simplify complex reads, expose a stable API shape, security/abstraction.

Unlike materialized $merge output, standard views compute on read.`}
              />

              <QA
                level="Mid"
                q="Text search basics — $text and textScore?"
                a={`1. Create text index on fields
2. Query: { $text: { $search: "mongodb performance" } }
3. Project score: { score: { $meta: "textScore" } }
4. Sort by score

Limitations vs Atlas Search: language support, fuzzy, relevance tuning — know when to upgrade.`}
              />

              <QA
                level="Senior"
                q="Transaction pitfalls interviewers expect you to know."
                a={`• Must run on replica set
• Keep transactions short; avoid heavy work inside
• TransientTransactionError / UnknownTransactionCommitResult → retry logic
• Write conflicts under concurrency
• In sharding, transactions have more constraints/overhead
• Don’t interact with non-transactional side effects naively (emails, queues) without outbox patterns`}
              />

              <QA
                level="Senior"
                q="How would you design CDC with change streams reliably?"
                a={`• Store resume token after processing
• Make consumers idempotent (at-least-once delivery)
• Handle invalidate events (drop/rename)
• Consider fullDocument: 'updateLookup'
• Scale carefully — one stream per worker pattern / Kafka bridge for fanout
• Monitor lag and errors

Senior systems answer, not just API syntax.`}
              />

              <QA
                level="Senior"
                q="Collation — what problem does it solve?"
                a={`Collation defines language-specific string comparison rules (case-insensitive, locale, accent).

Example: case-insensitive unique email indexes, sorting in German/French rules.

You can set collation at collection, index, or operation level.`}
              />
            </>
          )}

          {/* MODULE 8 */}
          {activeTab === "m8" && (
            <>
              <h2 className="text-2xl font-bold text-rose-300 mb-4">
                Module 8 — Phase 8: Replication & High Availability
              </h2>

              <QA
                level="Junior"
                q="What is a replica set?"
                a={`A group of mongod processes that maintain the same data for high availability.

Roles:
• Primary – accepts writes
• Secondaries – replicate via oplog
• Arbiter (optional) – votes in elections, holds no data

Typical production: 3 data-bearing nodes (PSS).`}
              />

              <QA
                level="Junior"
                q="What happens when the primary goes down?"
                a={`Automatic election: remaining nodes elect a new primary if a majority is available.

Application with retryable writes / proper driver can continue after brief interruption.
If majority is lost, replica set becomes read-only (no primary).`}
              />

              <QA
                level="Mid"
                q="What is the oplog?"
                a={`Operations log — a capped collection recording operations that secondaries apply to stay in sync.

Size matters: too small → secondaries can’t catch up after long downtime (need initial sync).
Monitor replication lag.`}
              />

              <QA
                level="Mid"
                q="Explain read preference options."
                a={`• primary – default, strongest freshness
• primaryPreferred
• secondary – scale reads; may be stale
• secondaryPreferred
• nearest – lowest network latency

Use secondary reads for analytics only if eventual consistency is OK.`}
              />

              <QA
                level="Mid"
                q="Read concern vs write concern?"
                a={`• Write concern – when is a write acknowledged (w:1, majority, journal)
• Read concern – consistency guarantees of reads (local, available, majority, linearizable, snapshot)

Together they define durability and isolation trade-offs.
Transactions often use snapshot read concern + majority write concern.`}
              />

              <QA
                level="Mid"
                q="What is replication lag and why does it matter?"
                a={`Lag = delay between primary op and secondary apply.

Impacts:
• Stale reads from secondaries
• Risk if primary fails before secondaries catch up (depending on write concern)
• Alerting is critical in ops interviews`}
              />

              <QA
                level="Senior"
                q="How do write concern majority and failover interact?"
                a={`w: 'majority' ensures write is durable on a majority before ack — survives primary failure without rollback of that write (under normal assumptions).

w:1 can acknowledge before secondaries have it → possible rollback if primary crashes.

Senior expectation: recommend majority for critical data, discuss latency cost.`}
              />

              <QA
                level="Senior"
                q="What is priority, hidden, and delayed members?"
                a={`• priority – election preference (0 means cannot become primary)
• hidden – not visible to app read preference; used for dedicated backups/analytics
• delayed – applies oplog with delay (accidental delete protection)

Architecture design question favorite.`}
              />

              <QA
                level="Senior"
                q="Explain initial sync vs incremental replication."
                a={`• Incremental – continuous oplog application
• Initial sync – full copy when a new/restarted member is too far behind or new

Initial sync is expensive (I/O, network). Avoid by sizing oplog and monitoring lag.`}
              />
            </>
          )}
        </div>

        <div className="flex justify-between items-center pt-10">
          <Link
            href="/phase15/modules-1-4"
            className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold"
          >
            ← Modules 1–4
          </Link>
          <Link
            href="/phase15/modules-9-12"
            className="bg-gradient-to-r from-rose-600 to-pink-700 hover:from-rose-500 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Next: Modules 9–12 →
          </Link>
        </div>
      </div>
    </div>
  );
}
