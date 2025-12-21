"use client";

import Link from "next/link";
import { useState } from "react";

export default function QueryUpdateOperatorsPage() {
  const [activeTab, setActiveTab] = useState("comparison");

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
          Query & Update Operators Reference
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Complete reference for all MongoDB query and update operators
        </p>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 flex-wrap">
          <button
            onClick={() => setActiveTab("comparison")}
            className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
              activeTab === "comparison"
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Comparison
          </button>
          <button
            onClick={() => setActiveTab("logical")}
            className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
              activeTab === "logical"
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Logical
          </button>
          <button
            onClick={() => setActiveTab("element")}
            className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
              activeTab === "element"
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Element
          </button>
          <button
            onClick={() => setActiveTab("array")}
            className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
              activeTab === "array"
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Array
          </button>
          <button
            onClick={() => setActiveTab("update")}
            className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
              activeTab === "update"
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Update
          </button>
          <button
            onClick={() => setActiveTab("arrayUpdate")}
            className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
              activeTab === "arrayUpdate"
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Array Update
          </button>
        </div>

        <div className="space-y-6">
          {/* Comparison Operators */}
          {activeTab === "comparison" && (
            <section className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-4 text-purple-300">
                Comparison Query Operators
              </h2>

              <div className="space-y-4">
                {[
                  {
                    op: "$eq",
                    desc: "Equal to",
                    example: "{ age: { $eq: 25 } }  // age === 25",
                  },
                  {
                    op: "$ne",
                    desc: "Not equal to",
                    example: "{ age: { $ne: 25 } }  // age !== 25",
                  },
                  {
                    op: "$gt",
                    desc: "Greater than",
                    example: "{ age: { $gt: 25 } }  // age > 25",
                  },
                  {
                    op: "$gte",
                    desc: "Greater than or equal",
                    example: "{ age: { $gte: 25 } }  // age >= 25",
                  },
                  {
                    op: "$lt",
                    desc: "Less than",
                    example: "{ age: { $lt: 25 } }  // age < 25",
                  },
                  {
                    op: "$lte",
                    desc: "Less than or equal",
                    example: "{ age: { $lte: 25 } }  // age <= 25",
                  },
                  {
                    op: "$in",
                    desc: "In array",
                    example:
                      '{ status: { $in: ["active", "pending"] } }  // status in array',
                  },
                  {
                    op: "$nin",
                    desc: "Not in array",
                    example:
                      '{ status: { $nin: ["deleted", "banned"] } }  // status not in array',
                  },
                ].map((item) => (
                  <div key={item.op} className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-cyan-300">
                      {item.op}
                    </h3>
                    <p className="text-gray-300 mb-2">{item.desc}</p>
                    <pre className="bg-black/50 p-3 rounded text-sm overflow-x-auto">
                      <code>{item.example}</code>
                    </pre>
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-gray-400 mb-1">
                          Native Driver:
                        </p>
                        <pre className="bg-black/50 p-2 rounded text-xs">
                          <code>
                            db.collection.find({item.example.split("//")[0]})
                          </code>
                        </pre>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Mongoose:</p>
                        <pre className="bg-black/50 p-2 rounded text-xs">
                          <code>Model.find({item.example.split("//")[0]})</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Logical Operators */}
          {activeTab === "logical" && (
            <section className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-4 text-purple-300">
                Logical Query Operators
              </h2>

              <div className="space-y-4">
                {[
                  {
                    op: "$and",
                    desc: "All conditions must be true",
                    example:
                      '{ $and: [{ age: { $gte: 18 } }, { status: "active" }] }',
                  },
                  {
                    op: "$or",
                    desc: "At least one condition must be true",
                    example:
                      '{ $or: [{ age: { $lt: 18 } }, { status: "inactive" }] }',
                  },
                  {
                    op: "$not",
                    desc: "Inverts condition",
                    example: "{ age: { $not: { $gte: 18 } } }",
                  },
                  {
                    op: "$nor",
                    desc: "None of the conditions should be true",
                    example:
                      '{ $nor: [{ age: { $lt: 18 } }, { status: "deleted" }] }',
                  },
                ].map((item) => (
                  <div key={item.op} className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-cyan-300">
                      {item.op}
                    </h3>
                    <p className="text-gray-300 mb-2">{item.desc}</p>
                    <pre className="bg-black/50 p-3 rounded text-sm overflow-x-auto">
                      <code>{item.example}</code>
                    </pre>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Element Operators */}
          {activeTab === "element" && (
            <section className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-4 text-purple-300">
                Element Query Operators
              </h2>

              <div className="space-y-4">
                {[
                  {
                    op: "$exists",
                    desc: "Field exists",
                    example: "{ phone: { $exists: true } }  // Has phone field",
                  },
                  {
                    op: "$type",
                    desc: "Field type check",
                    example: '{ age: { $type: "number" } }  // age is number',
                  },
                ].map((item) => (
                  <div key={item.op} className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-cyan-300">
                      {item.op}
                    </h3>
                    <p className="text-gray-300 mb-2">{item.desc}</p>
                    <pre className="bg-black/50 p-3 rounded text-sm overflow-x-auto">
                      <code>{item.example}</code>
                    </pre>
                  </div>
                ))}

                <div className="bg-black/30 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-cyan-300">
                    $type - All BSON Types
                  </h3>
                  <pre className="bg-black/50 p-3 rounded text-sm overflow-x-auto">
                    <code>{`double (1), string (2), object (3), array (4),
binData (5), objectId (7), bool (8), date (9),
null (10), regex (11), int (16), timestamp (17),
long (18), decimal (19), minKey (-1), maxKey (127)`}</code>
                  </pre>
                </div>
              </div>
            </section>
          )}

          {/* Array Operators */}
          {activeTab === "array" && (
            <section className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-4 text-purple-300">
                Array Query Operators
              </h2>

              <div className="space-y-4">
                {[
                  {
                    op: "$all",
                    desc: "Array contains all elements",
                    example: '{ tags: { $all: ["mongodb", "database"] } }',
                  },
                  {
                    op: "$elemMatch",
                    desc: "Array element matches all conditions",
                    example:
                      "{ scores: { $elemMatch: { $gte: 80, $lt: 90 } } }",
                  },
                  {
                    op: "$size",
                    desc: "Array has specific size",
                    example: "{ tags: { $size: 3 } }  // Exactly 3 tags",
                  },
                ].map((item) => (
                  <div key={item.op} className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-cyan-300">
                      {item.op}
                    </h3>
                    <p className="text-gray-300 mb-2">{item.desc}</p>
                    <pre className="bg-black/50 p-3 rounded text-sm overflow-x-auto">
                      <code>{item.example}</code>
                    </pre>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Update Operators */}
          {activeTab === "update" && (
            <section className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-4 text-purple-300">
                Field Update Operators
              </h2>

              <div className="space-y-4">
                {[
                  {
                    op: "$set",
                    desc: "Set field value",
                    example: '{ $set: { age: 30, status: "active" } }',
                  },
                  {
                    op: "$unset",
                    desc: "Remove field",
                    example: '{ $unset: { tempField: "" } }',
                  },
                  {
                    op: "$inc",
                    desc: "Increment numeric value",
                    example: "{ $inc: { age: 1, views: 10 } }",
                  },
                  {
                    op: "$mul",
                    desc: "Multiply numeric value",
                    example: "{ $mul: { price: 1.1 } }  // 10% increase",
                  },
                  {
                    op: "$rename",
                    desc: "Rename field",
                    example: '{ $rename: { "old_name": "new_name" } }',
                  },
                  {
                    op: "$min",
                    desc: "Update if new value is less",
                    example: "{ $min: { lowScore: 50 } }",
                  },
                  {
                    op: "$max",
                    desc: "Update if new value is greater",
                    example: "{ $max: { highScore: 100 } }",
                  },
                  {
                    op: "$currentDate",
                    desc: "Set to current date",
                    example: "{ $currentDate: { lastModified: true } }",
                  },
                  {
                    op: "$setOnInsert",
                    desc: "Set value only on insert (upsert)",
                    example: "{ $setOnInsert: { createdAt: new Date() } }",
                  },
                ].map((item) => (
                  <div key={item.op} className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-cyan-300">
                      {item.op}
                    </h3>
                    <p className="text-gray-300 mb-2">{item.desc}</p>
                    <pre className="bg-black/50 p-3 rounded text-sm overflow-x-auto">
                      <code>{item.example}</code>
                    </pre>
                    <div className="mt-3">
                      <p className="text-xs text-gray-400 mb-1">Usage:</p>
                      <pre className="bg-black/50 p-2 rounded text-xs">
                        <code>
                          db.collection.updateOne({"{filter}"}, {item.example})
                        </code>
                      </pre>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Array Update Operators */}
          {activeTab === "arrayUpdate" && (
            <section className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-4 text-purple-300">
                Array Update Operators
              </h2>

              <div className="space-y-4">
                {[
                  {
                    op: "$push",
                    desc: "Add element to array",
                    example: '{ $push: { tags: "mongodb" } }',
                  },
                  {
                    op: "$pull",
                    desc: "Remove matching elements",
                    example: '{ $pull: { tags: "deprecated" } }',
                  },
                  {
                    op: "$pop",
                    desc: "Remove first (-1) or last (1) element",
                    example: "{ $pop: { items: 1 } }  // Remove last",
                  },
                  {
                    op: "$addToSet",
                    desc: "Add if not exists (unique)",
                    example: '{ $addToSet: { tags: "new" } }',
                  },
                  {
                    op: "$pullAll",
                    desc: "Remove all matching values",
                    example: '{ $pullAll: { tags: ["old", "deprecated"] } }',
                  },
                  {
                    op: "$each",
                    desc: "Modifier for $push/$addToSet",
                    example: '{ $push: { tags: { $each: ["a", "b"] } } }',
                  },
                  {
                    op: "$slice",
                    desc: "Limit array size (with $push)",
                    example:
                      "{ $push: { logs: { $each: [log], $slice: -10 } } }",
                  },
                  {
                    op: "$sort",
                    desc: "Sort array (with $push)",
                    example:
                      "{ $push: { scores: { $each: [80], $sort: -1 } } }",
                  },
                  {
                    op: "$position",
                    desc: "Insert position (with $push)",
                    example:
                      '{ $push: { items: { $each: ["new"], $position: 0 } } }',
                  },
                  {
                    op: "$",
                    desc: "Positional operator (first match)",
                    example: '{ $set: { "items.$.quantity": 5 } }',
                  },
                  {
                    op: "$[]",
                    desc: "All positional (all elements)",
                    example: '{ $set: { "items.$[].status": "active" } }',
                  },
                  {
                    op: "$[<identifier>]",
                    desc: "Filtered positional",
                    example: '{ $set: { "items.$[elem].status": "sold" } }',
                  },
                ].map((item) => (
                  <div key={item.op} className="bg-black/30 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-cyan-300">
                      {item.op}
                    </h3>
                    <p className="text-gray-300 mb-2">{item.desc}</p>
                    <pre className="bg-black/50 p-3 rounded text-sm overflow-x-auto">
                      <code>{item.example}</code>
                    </pre>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center pt-6">
            <Link
              href="/"
              className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              ← Back to Home
            </Link>
            <Link
              href="/phase12/aggregation-operators"
              className="bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-500 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              Next: Aggregation Operators →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
