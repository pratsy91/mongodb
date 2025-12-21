"use client";

import Link from "next/link";
import { useState } from "react";

export default function AggregationOperatorsPage() {
  const [activeTab, setActiveTab] = useState("stages");

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
          Aggregation Operators Reference
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Complete reference for all aggregation pipeline and expression
          operators
        </p>

        {/* Tabs */}
        <div className="flex gap-3 mb-8 flex-wrap">
          <button
            onClick={() => setActiveTab("stages")}
            className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
              activeTab === "stages"
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Pipeline Stages
          </button>
          <button
            onClick={() => setActiveTab("arithmetic")}
            className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
              activeTab === "arithmetic"
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Arithmetic
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
            onClick={() => setActiveTab("string")}
            className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
              activeTab === "string"
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            String
          </button>
          <button
            onClick={() => setActiveTab("date")}
            className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
              activeTab === "date"
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Date
          </button>
          <button
            onClick={() => setActiveTab("conditional")}
            className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
              activeTab === "conditional"
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Conditional
          </button>
          <button
            onClick={() => setActiveTab("accumulator")}
            className={`px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
              activeTab === "accumulator"
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Accumulator
          </button>
        </div>

        <div className="space-y-6">
          {/* Pipeline Stages */}
          {activeTab === "stages" && (
            <section className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-4 text-purple-300">
                Aggregation Pipeline Stages (40+)
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { op: "$match", desc: "Filter documents" },
                  { op: "$group", desc: "Group by expression" },
                  { op: "$project", desc: "Select/transform fields" },
                  { op: "$sort", desc: "Sort documents" },
                  { op: "$limit", desc: "Limit results" },
                  { op: "$skip", desc: "Skip documents" },
                  { op: "$unwind", desc: "Deconstruct array" },
                  { op: "$lookup", desc: "Left outer join" },
                  { op: "$graphLookup", desc: "Recursive search" },
                  { op: "$facet", desc: "Multiple pipelines" },
                  { op: "$bucket", desc: "Group by range" },
                  { op: "$bucketAuto", desc: "Auto group by range" },
                  { op: "$sortByCount", desc: "Group and count" },
                  { op: "$addFields", desc: "Add new fields" },
                  { op: "$set", desc: "Add/update fields" },
                  { op: "$unset", desc: "Remove fields" },
                  { op: "$replaceRoot", desc: "Replace document root" },
                  { op: "$replaceWith", desc: "Replace with expression" },
                  { op: "$merge", desc: "Merge to collection" },
                  { op: "$out", desc: "Write to collection" },
                  { op: "$count", desc: "Count documents" },
                  { op: "$sample", desc: "Random sample" },
                  { op: "$unionWith", desc: "Union collections" },
                  { op: "$redact", desc: "Restrict content" },
                  { op: "$geoNear", desc: "Geospatial query" },
                  { op: "$indexStats", desc: "Index usage stats" },
                  { op: "$collStats", desc: "Collection stats" },
                  { op: "$currentOp", desc: "Current operations" },
                  { op: "$listSessions", desc: "List sessions" },
                  { op: "$listLocalSessions", desc: "List local sessions" },
                  { op: "$planCacheStats", desc: "Query plan cache" },
                  { op: "$setWindowFields", desc: "Window functions" },
                  { op: "$densify", desc: "Fill gaps in data" },
                  { op: "$fill", desc: "Fill missing values" },
                  { op: "$documents", desc: "Literal documents" },
                  { op: "$search", desc: "Full-text search (Atlas)" },
                  { op: "$searchMeta", desc: "Search metadata" },
                ].map((item) => (
                  <div key={item.op} className="bg-black/30 p-3 rounded-lg">
                    <h3 className="text-lg font-semibold text-cyan-300">
                      {item.op}
                    </h3>
                    <p className="text-sm text-gray-300">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-black/30 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-cyan-300 mb-2">
                  Example Pipeline
                </h3>
                <pre className="bg-black/50 p-3 rounded text-sm overflow-x-auto">
                  <code>{`db.orders.aggregate([
  { $match: { status: "completed" } },
  { $group: {
    _id: "$customerId",
    total: { $sum: "$amount" }
  }},
  { $sort: { total: -1 } },
  { $limit: 10 }
]);

// Mongoose
Order.aggregate([
  { $match: { status: "completed" } },
  { $group: { _id: "$customerId", total: { $sum: "$amount" } } },
  { $sort: { total: -1 } },
  { $limit: 10 }
]);`}</code>
                </pre>
              </div>
            </section>
          )}

          {/* Arithmetic Operators */}
          {activeTab === "arithmetic" && (
            <section className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-4 text-purple-300">
                Arithmetic Expression Operators
              </h2>

              <div className="space-y-3">
                {[
                  {
                    op: "$add",
                    desc: "Addition",
                    example: '{ $add: ["$price", "$tax"] }',
                  },
                  {
                    op: "$subtract",
                    desc: "Subtraction",
                    example: '{ $subtract: ["$total", "$discount"] }',
                  },
                  {
                    op: "$multiply",
                    desc: "Multiplication",
                    example: '{ $multiply: ["$price", "$quantity"] }',
                  },
                  {
                    op: "$divide",
                    desc: "Division",
                    example: '{ $divide: ["$sum", "$count"] }',
                  },
                  {
                    op: "$mod",
                    desc: "Modulo",
                    example: '{ $mod: ["$value", 10] }',
                  },
                  {
                    op: "$abs",
                    desc: "Absolute value",
                    example: '{ $abs: "$difference" }',
                  },
                  {
                    op: "$ceil",
                    desc: "Round up",
                    example: '{ $ceil: "$price" }',
                  },
                  {
                    op: "$floor",
                    desc: "Round down",
                    example: '{ $floor: "$price" }',
                  },
                  {
                    op: "$round",
                    desc: "Round to decimal places",
                    example: '{ $round: ["$price", 2] }',
                  },
                  {
                    op: "$trunc",
                    desc: "Truncate to integer",
                    example: '{ $trunc: "$value" }',
                  },
                  {
                    op: "$exp",
                    desc: "e^x",
                    example: '{ $exp: "$value" }',
                  },
                  {
                    op: "$ln",
                    desc: "Natural logarithm",
                    example: '{ $ln: "$value" }',
                  },
                  {
                    op: "$log",
                    desc: "Logarithm (custom base)",
                    example: '{ $log: ["$value", 10] }',
                  },
                  {
                    op: "$log10",
                    desc: "Base 10 logarithm",
                    example: '{ $log10: "$value" }',
                  },
                  {
                    op: "$pow",
                    desc: "Power",
                    example: '{ $pow: ["$base", 2] }',
                  },
                  {
                    op: "$sqrt",
                    desc: "Square root",
                    example: '{ $sqrt: "$area" }',
                  },
                ].map((item) => (
                  <div key={item.op} className="bg-black/30 p-3 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-base font-semibold text-cyan-300">
                          {item.op}
                        </h3>
                        <p className="text-sm text-gray-300">{item.desc}</p>
                      </div>
                      <code className="text-xs bg-black/50 px-2 py-1 rounded">
                        {item.example}
                      </code>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Array Operators */}
          {activeTab === "array" && (
            <section className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-4 text-purple-300">
                Array Expression Operators
              </h2>

              <div className="space-y-3">
                {[
                  {
                    op: "$arrayElemAt",
                    desc: "Element at index",
                    example: '{ $arrayElemAt: ["$items", 0] }',
                  },
                  {
                    op: "$arrayToObject",
                    desc: "Convert to object",
                    example: '{ $arrayToObject: "$pairs" }',
                  },
                  {
                    op: "$concatArrays",
                    desc: "Concatenate arrays",
                    example: '{ $concatArrays: ["$arr1", "$arr2"] }',
                  },
                  {
                    op: "$filter",
                    desc: "Filter array elements",
                    example:
                      '{ $filter: { input: "$items", as: "item", cond: { $gte: ["$$item.qty", 10] } } }',
                  },
                  {
                    op: "$first",
                    desc: "First element",
                    example: '{ $first: "$items" }',
                  },
                  {
                    op: "$last",
                    desc: "Last element",
                    example: '{ $last: "$items" }',
                  },
                  {
                    op: "$in",
                    desc: "Value in array",
                    example: '{ $in: ["value", "$array"] }',
                  },
                  {
                    op: "$indexOfArray",
                    desc: "Index of value",
                    example: '{ $indexOfArray: ["$items", "target"] }',
                  },
                  {
                    op: "$isArray",
                    desc: "Is array check",
                    example: '{ $isArray: "$field" }',
                  },
                  {
                    op: "$map",
                    desc: "Transform elements",
                    example:
                      '{ $map: { input: "$items", as: "item", in: { $multiply: ["$$item", 2] } } }',
                  },
                  {
                    op: "$objectToArray",
                    desc: "Convert object to array",
                    example: '{ $objectToArray: "$document" }',
                  },
                  {
                    op: "$range",
                    desc: "Generate number range",
                    example: "{ $range: [0, 10, 2] }",
                  },
                  {
                    op: "$reduce",
                    desc: "Reduce array to value",
                    example:
                      '{ $reduce: { input: "$items", initialValue: 0, in: { $add: ["$$value", "$$this"] } } }',
                  },
                  {
                    op: "$reverseArray",
                    desc: "Reverse array",
                    example: '{ $reverseArray: "$items" }',
                  },
                  {
                    op: "$size",
                    desc: "Array length",
                    example: '{ $size: "$items" }',
                  },
                  {
                    op: "$slice",
                    desc: "Array subset",
                    example: '{ $slice: ["$items", 5] }',
                  },
                  {
                    op: "$zip",
                    desc: "Transpose arrays",
                    example: '{ $zip: { inputs: ["$a", "$b"] } }',
                  },
                  {
                    op: "$maxN",
                    desc: "N largest elements",
                    example: '{ $maxN: { n: 3, input: "$scores" } }',
                  },
                  {
                    op: "$minN",
                    desc: "N smallest elements",
                    example: '{ $minN: { n: 3, input: "$scores" } }',
                  },
                  {
                    op: "$firstN",
                    desc: "First N elements",
                    example: '{ $firstN: { n: 5, input: "$items" } }',
                  },
                  {
                    op: "$lastN",
                    desc: "Last N elements",
                    example: '{ $lastN: { n: 5, input: "$items" } }',
                  },
                ].map((item) => (
                  <div key={item.op} className="bg-black/30 p-3 rounded-lg">
                    <h3 className="text-base font-semibold text-cyan-300">
                      {item.op}
                    </h3>
                    <p className="text-sm text-gray-300 mb-1">{item.desc}</p>
                    <code className="text-xs bg-black/50 px-2 py-1 rounded block overflow-x-auto">
                      {item.example}
                    </code>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* String Operators */}
          {activeTab === "string" && (
            <section className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-4 text-purple-300">
                String Expression Operators
              </h2>

              <div className="space-y-3">
                {[
                  {
                    op: "$concat",
                    desc: "Concatenate strings",
                    example: '{ $concat: ["$firstName", " ", "$lastName"] }',
                  },
                  {
                    op: "$toLower",
                    desc: "Lowercase",
                    example: '{ $toLower: "$email" }',
                  },
                  {
                    op: "$toUpper",
                    desc: "Uppercase",
                    example: '{ $toUpper: "$name" }',
                  },
                  {
                    op: "$substr",
                    desc: "Substring",
                    example: '{ $substr: ["$name", 0, 5] }',
                  },
                  {
                    op: "$substrCP",
                    desc: "Substring (code points)",
                    example: '{ $substrCP: ["$text", 0, 10] }',
                  },
                  {
                    op: "$split",
                    desc: "Split string",
                    example: '{ $split: ["$fullName", " "] }',
                  },
                  {
                    op: "$strLenCP",
                    desc: "String length",
                    example: '{ $strLenCP: "$text" }',
                  },
                  {
                    op: "$indexOfCP",
                    desc: "Index of substring",
                    example: '{ $indexOfCP: ["$text", "search"] }',
                  },
                  {
                    op: "$trim",
                    desc: "Trim whitespace",
                    example: '{ $trim: { input: "$text" } }',
                  },
                  {
                    op: "$ltrim",
                    desc: "Trim left",
                    example: '{ $ltrim: { input: "$text" } }',
                  },
                  {
                    op: "$rtrim",
                    desc: "Trim right",
                    example: '{ $rtrim: { input: "$text" } }',
                  },
                  {
                    op: "$replaceOne",
                    desc: "Replace first occurrence",
                    example:
                      '{ $replaceOne: { input: "$text", find: "old", replacement: "new" } }',
                  },
                  {
                    op: "$replaceAll",
                    desc: "Replace all occurrences",
                    example:
                      '{ $replaceAll: { input: "$text", find: "old", replacement: "new" } }',
                  },
                  {
                    op: "$regexFind",
                    desc: "Find regex match",
                    example:
                      '{ $regexFind: { input: "$text", regex: /pattern/ } }',
                  },
                  {
                    op: "$regexFindAll",
                    desc: "Find all regex matches",
                    example:
                      '{ $regexFindAll: { input: "$text", regex: /pattern/ } }',
                  },
                  {
                    op: "$regexMatch",
                    desc: "Test regex match",
                    example:
                      '{ $regexMatch: { input: "$email", regex: /.*@.*/ } }',
                  },
                  {
                    op: "$strcasecmp",
                    desc: "Compare strings (case-sensitive)",
                    example: '{ $strcasecmp: ["$str1", "$str2"] }',
                  },
                ].map((item) => (
                  <div key={item.op} className="bg-black/30 p-3 rounded-lg">
                    <h3 className="text-base font-semibold text-cyan-300">
                      {item.op}
                    </h3>
                    <p className="text-sm text-gray-300 mb-1">{item.desc}</p>
                    <code className="text-xs bg-black/50 px-2 py-1 rounded block overflow-x-auto">
                      {item.example}
                    </code>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Date Operators */}
          {activeTab === "date" && (
            <section className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-4 text-purple-300">
                Date Expression Operators
              </h2>

              <div className="space-y-3">
                {[
                  {
                    op: "$year",
                    desc: "Extract year",
                    example: '{ $year: "$date" }',
                  },
                  {
                    op: "$month",
                    desc: "Extract month (1-12)",
                    example: '{ $month: "$date" }',
                  },
                  {
                    op: "$dayOfMonth",
                    desc: "Day of month (1-31)",
                    example: '{ $dayOfMonth: "$date" }',
                  },
                  {
                    op: "$dayOfWeek",
                    desc: "Day of week (1-7, Sun=1)",
                    example: '{ $dayOfWeek: "$date" }',
                  },
                  {
                    op: "$dayOfYear",
                    desc: "Day of year (1-366)",
                    example: '{ $dayOfYear: "$date" }',
                  },
                  {
                    op: "$hour",
                    desc: "Extract hour (0-23)",
                    example: '{ $hour: "$timestamp" }',
                  },
                  {
                    op: "$minute",
                    desc: "Extract minute (0-59)",
                    example: '{ $minute: "$timestamp" }',
                  },
                  {
                    op: "$second",
                    desc: "Extract second (0-59)",
                    example: '{ $second: "$timestamp" }',
                  },
                  {
                    op: "$millisecond",
                    desc: "Extract millisecond (0-999)",
                    example: '{ $millisecond: "$timestamp" }',
                  },
                  {
                    op: "$week",
                    desc: "Week of year (0-53)",
                    example: '{ $week: "$date" }',
                  },
                  {
                    op: "$isoWeek",
                    desc: "ISO week (1-53)",
                    example: '{ $isoWeek: "$date" }',
                  },
                  {
                    op: "$isoWeekYear",
                    desc: "ISO week year",
                    example: '{ $isoWeekYear: "$date" }',
                  },
                  {
                    op: "$isoDayOfWeek",
                    desc: "ISO day (1-7, Mon=1)",
                    example: '{ $isoDayOfWeek: "$date" }',
                  },
                  {
                    op: "$dateToString",
                    desc: "Format date as string",
                    example:
                      '{ $dateToString: { format: "%Y-%m-%d", date: "$date" } }',
                  },
                  {
                    op: "$dateFromString",
                    desc: "Parse date from string",
                    example: '{ $dateFromString: { dateString: "$dateStr" } }',
                  },
                  {
                    op: "$dateToParts",
                    desc: "Date to components",
                    example: '{ $dateToParts: { date: "$date" } }',
                  },
                  {
                    op: "$dateFromParts",
                    desc: "Construct date",
                    example:
                      "{ $dateFromParts: { year: 2024, month: 1, day: 15 } }",
                  },
                  {
                    op: "$dateDiff",
                    desc: "Difference between dates",
                    example:
                      '{ $dateDiff: { startDate: "$start", endDate: "$end", unit: "day" } }',
                  },
                  {
                    op: "$dateAdd",
                    desc: "Add to date",
                    example:
                      '{ $dateAdd: { startDate: "$date", unit: "day", amount: 7 } }',
                  },
                  {
                    op: "$dateSubtract",
                    desc: "Subtract from date",
                    example:
                      '{ $dateSubtract: { startDate: "$date", unit: "month", amount: 1 } }',
                  },
                  {
                    op: "$dateTrunc",
                    desc: "Truncate date",
                    example:
                      '{ $dateTrunc: { date: "$timestamp", unit: "day" } }',
                  },
                ].map((item) => (
                  <div key={item.op} className="bg-black/30 p-3 rounded-lg">
                    <h3 className="text-base font-semibold text-cyan-300">
                      {item.op}
                    </h3>
                    <p className="text-sm text-gray-300 mb-1">{item.desc}</p>
                    <code className="text-xs bg-black/50 px-2 py-1 rounded block overflow-x-auto">
                      {item.example}
                    </code>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Conditional Operators */}
          {activeTab === "conditional" && (
            <section className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-4 text-purple-300">
                Conditional & Boolean Operators
              </h2>

              <div className="space-y-4">
                <div className="bg-black/30 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-cyan-300">$cond</h3>
                  <p className="text-sm text-gray-300 mb-2">
                    If-then-else condition
                  </p>
                  <pre className="bg-black/50 p-3 rounded text-xs overflow-x-auto">
                    <code>{`{
  $cond: {
    if: { $gte: ["$qty", 100] },
    then: "bulk",
    else: "retail"
  }
}`}</code>
                  </pre>
                </div>

                <div className="bg-black/30 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-cyan-300">
                    $ifNull
                  </h3>
                  <p className="text-sm text-gray-300 mb-2">
                    Return alternative if null
                  </p>
                  <pre className="bg-black/50 p-3 rounded text-xs overflow-x-auto">
                    <code>{`{ $ifNull: ["$description", "No description"] }`}</code>
                  </pre>
                </div>

                <div className="bg-black/30 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-cyan-300">
                    $switch
                  </h3>
                  <p className="text-sm text-gray-300 mb-2">
                    Switch-case statement
                  </p>
                  <pre className="bg-black/50 p-3 rounded text-xs overflow-x-auto">
                    <code>{`{
  $switch: {
    branches: [
      { case: { $eq: ["$grade", "A"] }, then: "Excellent" },
      { case: { $eq: ["$grade", "B"] }, then: "Good" }
    ],
    default: "Needs Improvement"
  }
}`}</code>
                  </pre>
                </div>

                <h3 className="text-xl font-bold text-purple-300 mt-6">
                  Boolean Operators
                </h3>

                {[
                  {
                    op: "$and",
                    desc: "Logical AND",
                    example: '{ $and: [{ $gte: ["$age", 18] }, "$active"] }',
                  },
                  {
                    op: "$or",
                    desc: "Logical OR",
                    example: '{ $or: [{ $lt: ["$qty", 10] }, "$urgent"] }',
                  },
                  {
                    op: "$not",
                    desc: "Logical NOT",
                    example: '{ $not: ["$isDeleted"] }',
                  },
                  {
                    op: "$eq",
                    desc: "Equal",
                    example: '{ $eq: ["$status", "active"] }',
                  },
                  {
                    op: "$ne",
                    desc: "Not equal",
                    example: '{ $ne: ["$status", "deleted"] }',
                  },
                  {
                    op: "$gt",
                    desc: "Greater than",
                    example: '{ $gt: ["$price", 100] }',
                  },
                  {
                    op: "$gte",
                    desc: "Greater than or equal",
                    example: '{ $gte: ["$age", 18] }',
                  },
                  {
                    op: "$lt",
                    desc: "Less than",
                    example: '{ $lt: ["$stock", 10] }',
                  },
                  {
                    op: "$lte",
                    desc: "Less than or equal",
                    example: '{ $lte: ["$discount", 0.5] }',
                  },
                  {
                    op: "$cmp",
                    desc: "Compare (-1, 0, 1)",
                    example: '{ $cmp: ["$a", "$b"] }',
                  },
                ].map((item) => (
                  <div key={item.op} className="bg-black/30 p-3 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-base font-semibold text-cyan-300">
                          {item.op}
                        </h3>
                        <p className="text-sm text-gray-300">{item.desc}</p>
                      </div>
                      <code className="text-xs bg-black/50 px-2 py-1 rounded">
                        {item.example}
                      </code>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Accumulator Operators */}
          {activeTab === "accumulator" && (
            <section className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-4 text-purple-300">
                Accumulator Operators (Group Stage)
              </h2>

              <div className="space-y-3">
                {[
                  {
                    op: "$sum",
                    desc: "Sum values",
                    example: '{ $sum: "$amount" }',
                  },
                  {
                    op: "$avg",
                    desc: "Average",
                    example: '{ $avg: "$score" }',
                  },
                  {
                    op: "$min",
                    desc: "Minimum value",
                    example: '{ $min: "$price" }',
                  },
                  {
                    op: "$max",
                    desc: "Maximum value",
                    example: '{ $max: "$price" }',
                  },
                  {
                    op: "$first",
                    desc: "First value",
                    example: '{ $first: "$name" }',
                  },
                  {
                    op: "$last",
                    desc: "Last value",
                    example: '{ $last: "$name" }',
                  },
                  {
                    op: "$push",
                    desc: "Push to array",
                    example: '{ $push: "$item" }',
                  },
                  {
                    op: "$addToSet",
                    desc: "Add unique to array",
                    example: '{ $addToSet: "$category" }',
                  },
                  {
                    op: "$stdDevPop",
                    desc: "Standard deviation (population)",
                    example: '{ $stdDevPop: "$score" }',
                  },
                  {
                    op: "$stdDevSamp",
                    desc: "Standard deviation (sample)",
                    example: '{ $stdDevSamp: "$score" }',
                  },
                  {
                    op: "$mergeObjects",
                    desc: "Merge objects",
                    example: '{ $mergeObjects: "$metadata" }',
                  },
                  {
                    op: "$count",
                    desc: "Count documents",
                    example: "{ $count: {} }",
                  },
                  {
                    op: "$top",
                    desc: "Top element",
                    example:
                      '{ $top: { sortBy: { score: -1 }, output: "$name" } }',
                  },
                  {
                    op: "$bottom",
                    desc: "Bottom element",
                    example:
                      '{ $bottom: { sortBy: { score: 1 }, output: "$name" } }',
                  },
                  {
                    op: "$topN",
                    desc: "Top N elements",
                    example:
                      '{ $topN: { n: 3, sortBy: { score: -1 }, output: "$name" } }',
                  },
                  {
                    op: "$bottomN",
                    desc: "Bottom N elements",
                    example:
                      '{ $bottomN: { n: 3, sortBy: { score: 1 }, output: "$name" } }',
                  },
                  {
                    op: "$firstN",
                    desc: "First N values",
                    example: '{ $firstN: { n: 5, input: "$items" } }',
                  },
                  {
                    op: "$lastN",
                    desc: "Last N values",
                    example: '{ $lastN: { n: 5, input: "$items" } }',
                  },
                  {
                    op: "$maxN",
                    desc: "N maximum values",
                    example: '{ $maxN: { n: 3, input: "$scores" } }',
                  },
                  {
                    op: "$minN",
                    desc: "N minimum values",
                    example: '{ $minN: { n: 3, input: "$scores" } }',
                  },
                  {
                    op: "$accumulator",
                    desc: "Custom accumulator",
                    example:
                      '{ $accumulator: { init: "function() {...}", accumulate: "function(state, item) {...}", merge: "function(state1, state2) {...}", finalize: "function(state) {...}", lang: "js" } }',
                  },
                ].map((item) => (
                  <div key={item.op} className="bg-black/30 p-3 rounded-lg">
                    <h3 className="text-base font-semibold text-cyan-300">
                      {item.op}
                    </h3>
                    <p className="text-sm text-gray-300 mb-1">{item.desc}</p>
                    <code className="text-xs bg-black/50 px-2 py-1 rounded block overflow-x-auto">
                      {item.example}
                    </code>
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-black/30 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-cyan-300 mb-2">
                  Example Usage
                </h3>
                <pre className="bg-black/50 p-3 rounded text-sm overflow-x-auto">
                  <code>{`db.orders.aggregate([
  {
    $group: {
      _id: "$customerId",
      totalAmount: { $sum: "$amount" },
      avgAmount: { $avg: "$amount" },
      orderCount: { $count: {} },
      items: { $push: "$itemName" },
      categories: { $addToSet: "$category" },
      firstOrder: { $first: "$date" },
      lastOrder: { $last: "$date" }
    }
  }
]);`}</code>
                </pre>
              </div>
            </section>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center pt-6">
            <Link
              href="/phase12/query-update-operators"
              className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              ← Previous: Query & Update Operators
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
