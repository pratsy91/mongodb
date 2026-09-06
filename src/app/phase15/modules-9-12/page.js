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

export default function Modules9to12Page() {
  const [activeTab, setActiveTab] = useState("m9");

  const tabs = [
    { id: "m9", label: "Module 9: Sharding" },
    { id: "m10", label: "Module 10: Security" },
    { id: "m11", label: "Module 11: Performance" },
    { id: "m12", label: "Module 12: Operators" },
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
          Interview Q&A — Modules 9–12
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Most-asked questions on Sharding, Security, Performance/Ops, and
          Operators reference (Junior → Mid → Senior).
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
          {/* MODULE 9 */}
          {activeTab === "m9" && (
            <>
              <h2 className="text-2xl font-bold text-rose-300 mb-4">
                Module 9 — Phase 9: Sharding
              </h2>

              <QA
                level="Junior"
                q="What is sharding?"
                a={`Sharding is horizontal scaling — splitting data across multiple machines (shards).

Use when a single replica set can’t handle data size or write/read throughput.

Components:
• Shards – store data subsets (usually replica sets)
• mongos – query router
• Config servers – metadata (chunk distribution)`}
              />

              <QA
                level="Junior"
                q="What is a shard key?"
                a={`The field(s) MongoDB uses to partition data across shards.

Choosing a bad shard key is one of the most common production mistakes.
Once chosen, changing it historically was hard (improving over versions, but still a serious decision).`}
              />

              <QA
                level="Mid"
                q="Ranged vs hashed sharding?"
                a={`• Ranged – contiguous ranges of shard key values on shards; good for range queries; risk of hot shards if monotonically increasing keys (_id/timestamps)
• Hashed – hash of key distributes writes evenly; great for write scaling; range queries on that key become scatter-gather

Interview example: userId hashed for even writes; date ranged if time-series analytics dominate.`}
              />

              <QA
                level="Mid"
                q="What are chunks and the balancer?"
                a={`• Chunks – contiguous ranges of shard key values
• Balancer – migrates chunks between shards to keep distribution even

Jumbo chunks (too large to move) are a classic ops problem — often from poor shard key cardinality.`}
              />

              <QA
                level="Mid"
                q="What is a targeted query vs scatter-gather?"
                a={`• Targeted – includes shard key → mongos routes to specific shard(s)
• Scatter-gather – no shard key in filter → query all shards and merge

Performance rule: high-frequency queries should include the shard key whenever possible.`}
              />

              <QA
                level="Senior"
                q="How do you choose a good shard key? (interview framework)"
                a={`Ideal shard key properties:
1. High cardinality
2. Avoids monotonically increasing hotspots (or use hashed)
3. Aligns with common query filters (targetability)
4. Sufficient write distribution
5. Avoids jumbo chunks

Compound shard keys often best: { customerId: 1, createdAt: 1 }

Discuss zones/tag-aware sharding for geo/data residency.`}
              />

              <QA
                level="Senior"
                q="What operational issues appear in sharded clusters?"
                a={`• Hot shards / uneven distribution
• Jumbo chunks
• Scatter-gather query storms
• Cross-shard transactions cost
• Config server availability
• Migration impact during balancing
• Orphaned documents (rare but discuss cleanup concepts)

Senior candidates talk about monitoring + query patterns, not just definitions.`}
              />

              <QA
                level="Senior"
                q="When would you NOT shard?"
                a={`Don’t shard prematurely.
Scale vertically / optimize indexes / archive cold data first.
Sharding adds complexity (ops, query design, transactions).
Shard when metrics prove single replica set limits are near (CPU, storage, IOPS, working set).`}
              />
            </>
          )}

          {/* MODULE 10 */}
          {activeTab === "m10" && (
            <>
              <h2 className="text-2xl font-bold text-rose-300 mb-4">
                Module 10 — Phase 10: Security
              </h2>

              <QA
                level="Junior"
                q="How does authentication work in MongoDB?"
                a={`Users authenticate against an authentication database (often admin) using mechanisms like SCRAM (default username/password).

Never run production without auth enabled.
Credentials should live in env/secret managers, not code.`}
              />

              <QA
                level="Junior"
                q="What is RBAC in MongoDB?"
                a={`Role-Based Access Control: users are granted roles with specific privileges.

Built-in roles examples: read, readWrite, dbAdmin, clusterAdmin, root (avoid root for apps).

Principle of least privilege is the expected interview phrase.`}
              />

              <QA
                level="Mid"
                q="TLS/SSL vs encryption at rest vs field-level encryption?"
                a={`• TLS – encrypts data in transit (client ↔ server, between nodes)
• Encryption at rest – encrypts storage/files (KMIP/Key Management)
• Client-Side Field Level Encryption (CSFLE) – encrypt sensitive fields before they leave the app; server may never see plaintext

Defense in depth: use all layers appropriately.`}
              />

              <QA
                level="Mid"
                q="How do you securely design app database users?"
                a={`• Separate users per app/environment
• Grant only needed DB/collection privileges
• No clusterAdmin for application runtime
• Rotate passwords/certificates
• Prefer short-lived creds where possible (cloud IAM / secrets)
• Disable unused interfaces; bind to private networks`}
              />

              <QA
                level="Mid"
                q="What is auditing used for?"
                a={`Audit logs record auth attempts, DDL, CRUD (configurable) for compliance (SOC2, HIPAA-ish controls, etc.).

Trade-off: performance and log volume. Tune filters carefully.`}
              />

              <QA
                level="Senior"
                q="How would you prevent NoSQL injection in Node/MongoDB apps?"
                a={`Risks: passing raw req.query objects into find() allowing operators like $gt/$ne.

Mitigations:
• Validate/sanitize inputs (allowlists)
• Cast types explicitly
• Avoid mixing user JSON directly as filters
• Use ODMs carefully (still validate)
• Disable dangerous operators where applicable
• Principle: never trust client JSON as a query document`}
              />

              <QA
                level="Senior"
                q="Network security architecture for MongoDB in production?"
                a={`• Private VPC / security groups; no public 27017
• TLS everywhere
• IP allowlists / PrivateLink / peering
• Bastion or SSO for admin access
• Separate network for backup/analytics members
• Monitor failed auths and unusual access patterns`}
              />

              <QA
                level="Senior"
                q="SCRAM vs x.509 vs LDAP/Kerberos — when to use which?"
                a={`• SCRAM – common app/user password auth
• x.509 – certificate-based, strong for inter-node and some clients
• LDAP/Kerberos – enterprise SSO / centralized identity

Enterprises often combine: certs between cluster members + centralized user auth.`}
              />
            </>
          )}

          {/* MODULE 11 */}
          {activeTab === "m11" && (
            <>
              <h2 className="text-2xl font-bold text-rose-300 mb-4">
                Module 11 — Phase 11: Performance & Operations
              </h2>

              <QA
                level="Junior"
                q="How do you find a slow query?"
                a={`• Enable profiler (profile level 1/2) or use Atlas Performance Advisor
• db.currentOp() for in-progress ops
• explain('executionStats') on suspects
• Check logs for slow query lines (operationProfiling.slowOpThresholdMs)`}
              />

              <QA
                level="Junior"
                q="Top reasons MongoDB queries are slow?"
                a={`1. Missing / wrong indexes (COLLSCAN)
2. Returning too many fields/docs
3. Large skip pagination
4. Unbounded arrays / huge documents
5. Blocking sort without index
6. Inefficient $lookup/$unwind pipelines
7. Undersized hardware / working set not in RAM`}
              />

              <QA
                level="Mid"
                q="Name common schema design patterns and when to use them."
                a={`Most asked patterns:
• Embedding vs Referencing
• Subset pattern – store frequently accessed subset
• Bucket pattern – group time-series events
• Computed pattern – precompute expensive values
• Extended Reference – embed key fields to avoid joins
• Outlier pattern – handle rare huge arrays separately
• Attribute pattern – flexible attributes for many similar fields
• Tree patterns – parent refs / material paths / graphs

Interview tip: always justify with access patterns.`}
              />

              <QA
                level="Mid"
                q="Embedding vs referencing — decision framework?"
                a={`Embed when:
• Data read together
• Bounded growth
• Strong ownership (address inside user)

Reference when:
• Unbounded growth
• Many-to-many
• Independently updated / reused
• Would exceed 16MB or cause huge docs

Hybrid (extended reference) is often the real-world answer.`}
              />

              <QA
                level="Mid"
                q="What metrics do you monitor in production?"
                a={`• Connections / pool saturation
• Opcounters (query/insert/update/delete)
• Replication lag
• CPU, disk IOPS, disk space
• Cache hit ratio / WiredTiger cache
• Slow queries count
• Lock / queue metrics
• Page faults

Tools: Atlas metrics, Prometheus exporters, mongostat/mongotop.`}
              />

              <QA
                level="Mid"
                q="Backup strategies — what should you mention?"
                a={`• mongodump/mongorestore (logical)
• Filesystem / snapshot / Atlas continuous backups (physical)
• Point-in-time recovery goals (RPO/RTO)
• Test restores regularly (most people forget this)
• Prefer backups from secondary/hidden member`}
              />

              <QA
                level="Senior"
                q="How do you approach a production performance incident?"
                a={`Structured answer:
1. Identify symptom (latency, CPU, disk, errors)
2. currentOp + slow query logs — is it one query shape?
3. explain plans — COLLSCAN? bad sort? high docs examined?
4. Check recent deploys / index drops / data growth
5. Temporary mitigation (kill long ops, scale, cache) carefully
6. Permanent fix (index, schema, query rewrite, pagination)
7. Postmortem + monitors/alerts

Shows seniority beyond trivia.`}
              />

              <QA
                level="Senior"
                q="Working set and WiredTiger cache — why do interviews ask this?"
                a={`If frequently accessed data + indexes fit in RAM (WiredTiger cache), performance is great.
If working set > RAM, disk reads explode → latency spikes.

Fixes: more RAM, reduce working set (archival, projection, better indexes), fix scans.

This is a classic senior capacity-planning topic.`}
              />

              <QA
                level="Senior"
                q="Online index builds and migration safety?"
                a={`Creating indexes on large collections can impact performance.
Discuss:
• Build during low traffic
• Rolling index builds on replica sets
• Hidden index technique before drop
• Schema migrations with expand/contract pattern (add new field → dual write → backfill → switch reads → remove old)

Zero-downtime thinking is the senior signal.`}
              />
            </>
          )}

          {/* MODULE 12 */}
          {activeTab === "m12" && (
            <>
              <h2 className="text-2xl font-bold text-rose-300 mb-4">
                Module 12 — Phase 12: Operators Reference (Interview Hotspots)
              </h2>

              <QA
                level="Junior"
                q="Quickly list must-know update operators."
                a={`$set, $unset, $inc, $push, $pull, $addToSet, $pop, $rename, $currentDate, $min, $max, $mul

Modifiers with $push: $each, $position, $slice, $sort

These appear constantly in coding rounds.`}
              />

              <QA
                level="Junior"
                q="$push vs $addToSet?"
                a={`• $push – always appends (can duplicate)
• $addToSet – adds only if value not already present (set semantics for that value)

For unique tags, prefer $addToSet (or unique constraints at app level for object uniqueness nuances).`}
              />

              <QA
                level="Mid"
                q="What does $pull do vs $pullAll?"
                a={`• $pull – removes elements matching a condition/value
• $pullAll – removes all listed exact values

Example:
{ $pull: { votes: { userId: 1 } } }
{ $pullAll: { tags: ["old", "legacy"] } }`}
              />

              <QA
                level="Mid"
                q="Common aggregation expression operators asked in interviews?"
                a={`Conditional: $cond, $ifNull, $switch
Arithmetic: $add, $subtract, $multiply, $divide, $mod
String: $concat, $substr/$substrBytes, $toLower, $split
Array: $map, $filter, $reduce, $size, $in, $arrayElemAt
Date: $year, $month, $dayOfMonth, $dateToString, $dateAdd
Type: $toString, $toObjectId, $convert, $type

Be ready to write a $map/$filter example on a whiteboard.`}
              />

              <QA
                level="Mid"
                q="How do you update a matching array element? ($ / $[] / $[ident])"
                a={`• $ – first matching element from query predicate
• $[] – all elements
• $[ident] – filtered positional operator with arrayFilters

Example:
updateOne(
  { _id },
  { $set: { "items.$[it].qty": 5 } },
  { arrayFilters: [{ "it.sku": "A1" }] }
)

Very common mid/senior coding question.`}
              />

              <QA
                level="Mid"
                q="$lookup pipeline vs localField/foreignField — which to prefer?"
                a={`Pipeline form of $lookup is more powerful:
• Filter joined docs early
• Project only needed fields
• Correlate with expressions

Prefer pipeline form for performance and clarity in complex joins.`}
              />

              <QA
                level="Senior"
                q="Operator pitfalls that break production queries?"
                a={`• Mixing include/exclude projections incorrectly
• $elemMatch forgotten for multi-field array matches
• Comparing fields without $expr
• $size with ranges (not supported) — denormalize length
• Regex with leading wildcard → scans
• $where usage
• Updating without $ operators accidentally replacing docs
• Null vs missing field confusion
• Timezones with Date operators`}
              />

              <QA
                level="Senior"
                q="Write a mini pipeline interview prompt: top 5 products by revenue last 30 days."
                a={`Shape answer:
[
  { $match: { createdAt: { $gte: thirtyDaysAgo }, status: "paid" } },
  { $unwind: "$items" },
  { $group: {
      _id: "$items.productId",
      revenue: { $sum: { $multiply: ["$items.qty", "$items.price"] } }
  }},
  { $sort: { revenue: -1 } },
  { $limit: 5 },
  { $lookup: { ... product name ... } } // optional
]

Call out indexes on createdAt/status and early $match.`}
              />

              <QA
                level="Senior"
                q="How do window-style analytics show up (setWindowFields)?"
                a={`$setWindowFields enables running totals, moving averages, rankings over partitions — without self-joins.

Example use: cumulative revenue by day per region, rank products within category.

Mention when discussing advanced analytics vs exporting to a warehouse.`}
              />
            </>
          )}
        </div>

        <div className="flex justify-between items-center pt-10">
          <Link
            href="/phase15/modules-5-8"
            className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold"
          >
            ← Modules 5–8
          </Link>
          <Link
            href="/"
            className="bg-gradient-to-r from-rose-600 to-pink-700 hover:from-rose-500 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Back to Home →
          </Link>
        </div>
      </div>
    </div>
  );
}
