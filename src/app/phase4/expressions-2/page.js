"use client";

import Link from "next/link";
import { useState } from "react";

export default function ExpressionsTwoPage() {
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
          Expression Operators - Part 2
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Array, String, and Date operators - All 80+ operators
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
                Array Operators (30+)
              </h3>
              <p>Manipulate, query, and transform arrays</p>

              <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                String Operators (20+)
              </h3>
              <p>String manipulation, searching, and formatting</p>

              <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                Date Operators (30+)
              </h3>
              <p>Date extraction, formatting, and manipulation</p>
            </div>
          </section>

          {/* MongoDB Native Driver Examples */}
          {activeTab === "mongodb" && (
            <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
              <h2 className="text-3xl font-bold mb-6 text-blue-300">
                MongoDB Native Driver Examples
              </h2>

              {/* Array Operators - Part 1 */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  1. Array Operators - Access & Manipulation
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://localhost:27017");
await client.connect();
const db = client.db("myDatabase");
const products = db.collection("products");

// ===== ARRAY ACCESS =====

// $arrayElemAt - Get element at index
await products.aggregate([
  {
    $project: {
      name: 1,
      tags: 1,
      firstTag: { $arrayElemAt: ["$tags", 0] },
      lastTag: { $arrayElemAt: ["$tags", -1] },
      thirdTag: { $arrayElemAt: ["$tags", 2] }
    }
  }
]).toArray();

// $first - First array element
await products.aggregate([
  {
    $project: {
      name: 1,
      reviews: 1,
      firstReview: { $first: "$reviews" }
    }
  }
]).toArray();

// $last - Last array element
await products.aggregate([
  {
    $project: {
      name: 1,
      reviews: 1,
      latestReview: { $last: "$reviews" }
    }
  }
]).toArray();

// ===== ARRAY SIZE & QUERIES =====

// $size - Array length
await products.aggregate([
  {
    $project: {
      name: 1,
      tags: 1,
      tagCount: { $size: "$tags" }
    }
  }
]).toArray();

// $in - Check if value in array
await products.aggregate([
  {
    $project: {
      name: 1,
      categories: 1,
      isElectronics: { $in: ["electronics", "$categories"] }
    }
  }
]).toArray();

// ===== ARRAY TRANSFORMATION =====

// $concatArrays - Concatenate arrays
await products.aggregate([
  {
    $project: {
      name: 1,
      allTags: { $concatArrays: ["$tags", "$categories", ["featured"]] }
    }
  }
]).toArray();

// $slice - Extract array subset
await products.aggregate([
  {
    $project: {
      name: 1,
      first3Tags: { $slice: ["$tags", 3] },          // First 3
      last2Tags: { $slice: ["$tags", -2] },          // Last 2
      middle: { $slice: ["$tags", 2, 3] }            // Skip 2, take 3
    }
  }
]).toArray();

// $reverseArray - Reverse array order
await products.aggregate([
  {
    $project: {
      name: 1,
      tags: 1,
      reversedTags: { $reverseArray: "$tags" }
    }
  }
]).toArray();

// $sortArray - Sort array
await products.aggregate([
  {
    $project: {
      name: 1,
      prices: 1,
      sortedPrices: {
        $sortArray: {
          input: "$prices",
          sortBy: 1                                   // 1 = ascending, -1 = descending
        }
      }
    }
  }
]).toArray();

// Sort array of objects
await products.aggregate([
  {
    $project: {
      name: 1,
      reviews: 1,
      sortedReviews: {
        $sortArray: {
          input: "$reviews",
          sortBy: { rating: -1, date: 1 }
        }
      }
    }
  }
]).toArray();

// ===== ARRAY MANIPULATION =====

// $filter - Filter array elements
await products.aggregate([
  {
    $project: {
      name: 1,
      reviews: 1,
      highRatings: {
        $filter: {
          input: "$reviews",
          as: "review",
          cond: { $gte: ["$$review.rating", 4] }
        }
      }
    }
  }
]).toArray();

// $map - Transform array elements
await products.aggregate([
  {
    $project: {
      name: 1,
      prices: 1,
      discountedPrices: {
        $map: {
          input: "$prices",
          as: "price",
          in: { $multiply: ["$$price", 0.9] }        // 10% discount
        }
      }
    }
  }
]).toArray();

// $map with objects
await products.aggregate([
  {
    $project: {
      name: 1,
      items: 1,
      itemNames: {
        $map: {
          input: "$items",
          as: "item",
          in: "$$item.name"
        }
      }
    }
  }
]).toArray();

// $reduce - Aggregate array values
await products.aggregate([
  {
    $project: {
      name: 1,
      prices: 1,
      totalPrice: {
        $reduce: {
          input: "$prices",
          initialValue: 0,
          in: { $add: ["$$value", "$$this"] }
        }
      }
    }
  }
]).toArray();

// $reduce with complex logic
await products.aggregate([
  {
    $project: {
      name: 1,
      items: 1,
      summary: {
        $reduce: {
          input: "$items",
          initialValue: { total: 0, count: 0 },
          in: {
            total: { $add: ["$$value.total", "$$this.price"] },
            count: { $add: ["$$value.count", 1] }
          }
        }
      }
    }
  }
]).toArray();

// ===== ADVANCED ARRAY OPERATORS =====

// $zip - Combine arrays
await products.aggregate([
  {
    $project: {
      name: 1,
      colors: ["red", "blue", "green"],
      sizes: ["S", "M", "L"],
      variants: {
        $zip: {
          inputs: [["red", "blue", "green"], ["S", "M", "L"]],
          useLongestLength: false,
          defaults: ["N/A", "N/A"]
        }
      }
    }
  }
]).toArray();

// $range - Generate number array
await products.aggregate([
  {
    $project: {
      name: 1,
      quantityOptions: { $range: [1, 11] }           // [1,2,3...10]
    }
  }
]).toArray();

// $range with step
await products.aggregate([
  {
    $project: {
      evenNumbers: { $range: [0, 21, 2] }            // [0,2,4...20]
    }
  }
]).toArray();

// $indexOfArray - Find element index
await products.aggregate([
  {
    $project: {
      name: 1,
      tags: 1,
      saleIndex: { $indexOfArray: ["$tags", "sale"] }
    }
  }
]).toArray();

// $indexOfArray with range
await products.aggregate([
  {
    $project: {
      name: 1,
      tags: 1,
      saleIndex: { 
        $indexOfArray: ["$tags", "sale", 2, 10]     // Search from index 2 to 10
      }
    }
  }
]).toArray();

await client.close();`}</code>
                </pre>
              </div>

              {/* Array Operators - Part 2 */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  2. Array Operators - Advanced & Conversion
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://localhost:27017");
await client.connect();
const db = client.db("myDatabase");
const products = db.collection("products");

// ===== ARRAY CONVERSION =====

// $arrayToObject - Convert array to object
await products.aggregate([
  {
    $project: {
      name: 1,
      attributes: [
        { k: "color", v: "red" },
        { k: "size", v: "large" }
      ],
      attributeObj: {
        $arrayToObject: [
          [["color", "red"], ["size", "large"]]
        ]
      }
    }
  }
]).toArray();

// $objectToArray - Convert object to array
await products.aggregate([
  {
    $project: {
      name: 1,
      specs: { color: "red", size: "L", weight: "2kg" },
      specsArray: { $objectToArray: "$specs" }
      // Result: [{ k: "color", v: "red" }, { k: "size", v: "L" }, ...]
    }
  }
]).toArray();

// ===== SET OPERATIONS =====

// $setUnion - Union of arrays (unique values)
await products.aggregate([
  {
    $project: {
      name: 1,
      allCategories: {
        $setUnion: ["$primaryCategories", "$secondaryCategories"]
      }
    }
  }
]).toArray();

// $setIntersection - Common elements
await products.aggregate([
  {
    $project: {
      name: 1,
      commonTags: {
        $setIntersection: ["$userTags", "$adminTags"]
      }
    }
  }
]).toArray();

// $setDifference - Elements in first but not second
await products.aggregate([
  {
    $project: {
      name: 1,
      uniqueToUser: {
        $setDifference: ["$userTags", "$adminTags"]
      }
    }
  }
]).toArray();

// $setEquals - Check if arrays have same elements
await products.aggregate([
  {
    $project: {
      name: 1,
      tagsMatch: {
        $setEquals: ["$expectedTags", "$actualTags"]
      }
    }
  }
]).toArray();

// $setIsSubset - Check if all elements of first are in second
await products.aggregate([
  {
    $project: {
      name: 1,
      requiredTagsPresent: {
        $setIsSubset: [["featured", "new"], "$tags"]
      }
    }
  }
]).toArray();

// $anyElementTrue - Check if any element is true
await products.aggregate([
  {
    $project: {
      name: 1,
      flags: 1,
      anyFlagSet: { $anyElementTrue: "$flags" }
    }
  }
]).toArray();

// $allElementsTrue - Check if all elements are true
await products.aggregate([
  {
    $project: {
      name: 1,
      checks: 1,
      allChecksPassed: { $allElementsTrue: "$checks" }
    }
  }
]).toArray();

// ===== NEW ARRAY OPERATORS (MongoDB 5.2+) =====

// $maxN/$minN - N largest/smallest values
await products.aggregate([
  {
    $project: {
      name: 1,
      prices: 1,
      top3Prices: { $maxN: { n: 3, input: "$prices" } },
      bottom3Prices: { $minN: { n: 3, input: "$prices" } }
    }
  }
]).toArray();

// $firstN/$lastN - First/last N elements
await products.aggregate([
  {
    $project: {
      name: 1,
      reviews: 1,
      first5Reviews: { $firstN: { n: 5, input: "$reviews" } },
      last5Reviews: { $lastN: { n: 5, input: "$reviews" } }
    }
  }
]).toArray();

// ===== PRACTICAL EXAMPLES =====

// Complex array processing
await products.aggregate([
  {
    $project: {
      name: 1,
      // Filter high-rated reviews
      goodReviews: {
        $filter: {
          input: "$reviews",
          as: "r",
          cond: { $gte: ["$$r.rating", 4] }
        }
      }
    }
  },
  {
    $addFields: {
      // Extract review text
      reviewTexts: {
        $map: {
          input: "$goodReviews",
          as: "r",
          in: "$$r.text"
        }
      },
      // Calculate average rating
      avgGoodRating: {
        $avg: {
          $map: {
            input: "$goodReviews",
            as: "r",
            in: "$$r.rating"
          }
        }
      }
    }
  }
]).toArray();

// Shopping cart total
await products.aggregate([
  {
    $project: {
      customerId: 1,
      items: 1,
      cartTotal: {
        $reduce: {
          input: "$items",
          initialValue: 0,
          in: {
            $add: [
              "$$value",
              { $multiply: ["$$this.price", "$$this.quantity"] }
            ]
          }
        }
      },
      itemCount: {
        $reduce: {
          input: "$items",
          initialValue: 0,
          in: { $add: ["$$value", "$$this.quantity"] }
        }
      }
    }
  }
]).toArray();

await client.close();`}</code>
                </pre>
              </div>

              {/* String Operators */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  3. String Operators - All Operations
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://localhost:27017");
await client.connect();
const db = client.db("myDatabase");
const users = db.collection("users");

// ===== STRING MANIPULATION =====

// $concat - Concatenate strings
await users.aggregate([
  {
    $project: {
      firstName: 1,
      lastName: 1,
      fullName: { $concat: ["$firstName", " ", "$lastName"] }
    }
  }
]).toArray();

// $substr - Extract substring
await users.aggregate([
  {
    $project: {
      email: 1,
      emailPrefix: { $substr: ["$email", 0, 5] }
    }
  }
]).toArray();

// $substrBytes - Extract substring by bytes
await users.aggregate([
  {
    $project: {
      text: 1,
      prefix: { $substrBytes: ["$text", 0, 10] }
    }
  }
]).toArray();

// $substrCP - Extract substring by code points (Unicode)
await users.aggregate([
  {
    $project: {
      text: 1,
      unicodeSubstr: { $substrCP: ["$text", 0, 5] }
    }
  }
]).toArray();

// $toLower - Convert to lowercase
await users.aggregate([
  {
    $project: {
      email: 1,
      normalizedEmail: { $toLower: "$email" }
    }
  }
]).toArray();

// $toUpper - Convert to uppercase
await users.aggregate([
  {
    $project: {
      code: 1,
      upperCode: { $toUpper: "$code" }
    }
  }
]).toArray();

// ===== STRING SEARCH =====

// $indexOfBytes - Find substring position (bytes)
await users.aggregate([
  {
    $project: {
      email: 1,
      atPosition: { $indexOfBytes: ["$email", "@"] }
    }
  }
]).toArray();

// $indexOfCP - Find substring position (code points)
await users.aggregate([
  {
    $project: {
      text: 1,
      position: { $indexOfCP: ["$text", "search"] }
    }
  }
]).toArray();

// $indexOfCP with range
await users.aggregate([
  {
    $project: {
      text: 1,
      position: { $indexOfCP: ["$text", "word", 5, 20] }  // Search from 5 to 20
    }
  }
]).toArray();

// ===== STRING LENGTH =====

// $strLenBytes - String length in bytes
await users.aggregate([
  {
    $project: {
      name: 1,
      byteLength: { $strLenBytes: "$name" }
    }
  }
]).toArray();

// $strLenCP - String length in code points
await users.aggregate([
  {
    $project: {
      name: 1,
      charLength: { $strLenCP: "$name" }
    }
  }
]).toArray();

// ===== STRING FORMATTING =====

// $trim - Remove whitespace
await users.aggregate([
  {
    $project: {
      name: 1,
      trimmed: { $trim: { input: "$name" } }
    }
  }
]).toArray();

// $trim with custom characters
await users.aggregate([
  {
    $project: {
      code: 1,
      trimmed: { $trim: { input: "$code", chars: "-_" } }
    }
  }
]).toArray();

// $ltrim - Remove left whitespace
await users.aggregate([
  {
    $project: {
      text: 1,
      leftTrimmed: { $ltrim: { input: "$text" } }
    }
  }
]).toArray();

// $rtrim - Remove right whitespace
await users.aggregate([
  {
    $project: {
      text: 1,
      rightTrimmed: { $rtrim: { input: "$text" } }
    }
  }
]).toArray();

// ===== STRING SPLITTING & JOINING =====

// $split - Split string into array
await users.aggregate([
  {
    $project: {
      tags: "$tagString",                              // "tag1,tag2,tag3"
      tagArray: { $split: ["$tagString", ","] }        // ["tag1", "tag2", "tag3"]
    }
  }
]).toArray();

// $strcasecmp - Case-insensitive compare
await users.aggregate([
  {
    $project: {
      name1: "$firstName",
      name2: "$comparisonName",
      comparison: { $strcasecmp: ["$firstName", "$comparisonName"] }
      // Returns: -1 (less), 0 (equal), 1 (greater)
    }
  }
]).toArray();

// ===== REGEX =====

// $regexFind - Find first regex match
await users.aggregate([
  {
    $project: {
      email: 1,
      domainMatch: {
        $regexFind: {
          input: "$email",
          regex: /@([a-z]+)\\.com$/,
          options: "i"
        }
      }
    }
  }
]).toArray();

// $regexFindAll - Find all regex matches
await users.aggregate([
  {
    $project: {
      text: 1,
      allNumbers: {
        $regexFindAll: {
          input: "$text",
          regex: /\\d+/g
        }
      }
    }
  }
]).toArray();

// $regexMatch - Test if regex matches
await users.aggregate([
  {
    $project: {
      email: 1,
      isValidEmail: {
        $regexMatch: {
          input: "$email",
          regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/
        }
      }
    }
  }
]).toArray();

// ===== STRING REPLACEMENT =====

// $replaceOne - Replace first occurrence
await users.aggregate([
  {
    $project: {
      text: 1,
      updated: {
        $replaceOne: {
          input: "$text",
          find: "old",
          replacement: "new"
        }
      }
    }
  }
]).toArray();

// $replaceAll - Replace all occurrences
await users.aggregate([
  {
    $project: {
      text: 1,
      normalized: {
        $replaceAll: {
          input: "$text",
          find: " ",
          replacement: "_"
        }
      }
    }
  }
]).toArray();

// ===== PRACTICAL EXAMPLES =====

// Email domain extraction
await users.aggregate([
  {
    $project: {
      email: 1,
      domain: {
        $arrayElemAt: [
          { $split: ["$email", "@"] },
          1
        ]
      }
    }
  }
]).toArray();

// Format full name
await users.aggregate([
  {
    $project: {
      firstName: 1,
      lastName: 1,
      displayName: {
        $concat: [
          { $toUpper: { $substrCP: ["$firstName", 0, 1] } },
          { $toLower: { $substrCP: ["$firstName", 1, -1] } },
          " ",
          { $toUpper: "$lastName" }
        ]
      }
    }
  }
]).toArray();

// Username validation
await users.aggregate([
  {
    $project: {
      username: 1,
      isValid: {
        $and: [
          { $gte: [{ $strLenCP: "$username" }, 3] },
          { $lte: [{ $strLenCP: "$username" }, 20] },
          {
            $regexMatch: {
              input: "$username",
              regex: /^[a-zA-Z0-9_]+$/
            }
          }
        ]
      }
    }
  }
]).toArray();

await client.close();`}</code>
                </pre>
              </div>

              {/* Date Operators */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  4. Date Operators - All 30+ Operations
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://localhost:27017");
await client.connect();
const db = client.db("myDatabase");
const orders = db.collection("orders");

// ===== DATE EXTRACTION =====

// $year - Extract year
await orders.aggregate([
  {
    $project: {
      orderDate: 1,
      year: { $year: "$orderDate" }
    }
  }
]).toArray();

// $month - Extract month (1-12)
await orders.aggregate([
  {
    $project: {
      orderDate: 1,
      month: { $month: "$orderDate" }
    }
  }
]).toArray();

// $dayOfMonth - Day of month (1-31)
await orders.aggregate([
  {
    $project: {
      orderDate: 1,
      day: { $dayOfMonth: "$orderDate" }
    }
  }
]).toArray();

// $dayOfWeek - Day of week (1=Sunday, 7=Saturday)
await orders.aggregate([
  {
    $project: {
      orderDate: 1,
      dayOfWeek: { $dayOfWeek: "$orderDate" }
    }
  }
]).toArray();

// $dayOfYear - Day of year (1-366)
await orders.aggregate([
  {
    $project: {
      orderDate: 1,
      dayOfYear: { $dayOfYear: "$orderDate" }
    }
  }
]).toArray();

// $hour - Extract hour (0-23)
await orders.aggregate([
  {
    $project: {
      orderDate: 1,
      hour: { $hour: "$orderDate" }
    }
  }
]).toArray();

// $minute - Extract minute (0-59)
await orders.aggregate([
  {
    $project: {
      orderDate: 1,
      minute: { $minute: "$orderDate" }
    }
  }
]).toArray();

// $second - Extract second (0-59)
await orders.aggregate([
  {
    $project: {
      orderDate: 1,
      second: { $second: "$orderDate" }
    }
  }
]).toArray();

// $millisecond - Extract millisecond (0-999)
await orders.aggregate([
  {
    $project: {
      orderDate: 1,
      ms: { $millisecond: "$orderDate" }
    }
  }
]).toArray();

// $week - Week of year (0-53)
await orders.aggregate([
  {
    $project: {
      orderDate: 1,
      week: { $week: "$orderDate" }
    }
  }
]).toArray();

// $isoWeek - ISO week number (1-53)
await orders.aggregate([
  {
    $project: {
      orderDate: 1,
      isoWeek: { $isoWeek: "$orderDate" }
    }
  }
]).toArray();

// $isoWeekYear - ISO week year
await orders.aggregate([
  {
    $project: {
      orderDate: 1,
      isoYear: { $isoWeekYear: "$orderDate" }
    }
  }
]).toArray();

// $isoDayOfWeek - ISO day of week (1=Monday, 7=Sunday)
await orders.aggregate([
  {
    $project: {
      orderDate: 1,
      isoDayOfWeek: { $isoDayOfWeek: "$orderDate" }
    }
  }
]).toArray();

// ===== DATE FORMATTING =====

// $dateToString - Format date as string
await orders.aggregate([
  {
    $project: {
      orderDate: 1,
      formatted: {
        $dateToString: {
          format: "%Y-%m-%d",
          date: "$orderDate"
        }
      }
    }
  }
]).toArray();

// Custom format
await orders.aggregate([
  {
    $project: {
      orderDate: 1,
      formatted: {
        $dateToString: {
          format: "%B %d, %Y at %H:%M",              // "January 15, 2024 at 14:30"
          date: "$orderDate"
        }
      }
    }
  }
]).toArray();

// Format specifiers:
// %Y - Year (4 digits)
// %m - Month (01-12)
// %d - Day (01-31)
// %H - Hour (00-23)
// %M - Minute (00-59)
// %S - Second (00-59)
// %L - Millisecond (000-999)
// %B - Month name (January-December)
// %b - Abbreviated month (Jan-Dec)
// %A - Weekday name (Sunday-Saturday)
// %a - Abbreviated weekday (Sun-Sat)
// %w - Day of week (0-6)
// %U - Week number (00-53)
// %j - Day of year (001-366)
// %% - Literal %

// With timezone
await orders.aggregate([
  {
    $project: {
      orderDate: 1,
      formattedET: {
        $dateToString: {
          format: "%Y-%m-%d %H:%M:%S",
          date: "$orderDate",
          timezone: "America/New_York"
        }
      }
    }
  }
]).toArray();

// $dateFromString - Parse string to date
await orders.aggregate([
  {
    $project: {
      dateString: "$orderDateStr",
      parsedDate: {
        $dateFromString: {
          dateString: "$orderDateStr",
          format: "%Y-%m-%d"
        }
      }
    }
  }
]).toArray();

// ===== DATE ARITHMETIC =====

// $dateAdd - Add time to date
await orders.aggregate([
  {
    $project: {
      orderDate: 1,
      deliveryDate: {
        $dateAdd: {
          startDate: "$orderDate",
          unit: "day",
          amount: 7
        }
      }
    }
  }
]).toArray();

// Units: year, quarter, month, week, day, hour, minute, second, millisecond

// $dateSubtract - Subtract time from date
await orders.aggregate([
  {
    $project: {
      orderDate: 1,
      oneWeekAgo: {
        $dateSubtract: {
          startDate: "$orderDate",
          unit: "week",
          amount: 1
        }
      }
    }
  }
]).toArray();

// $dateDiff - Difference between dates
await orders.aggregate([
  {
    $project: {
      orderDate: 1,
      shippedDate: 1,
      daysDiff: {
        $dateDiff: {
          startDate: "$orderDate",
          endDate: "$shippedDate",
          unit: "day"
        }
      }
    }
  }
]).toArray();

// $dateTrunc - Truncate date to unit
await orders.aggregate([
  {
    $project: {
      orderDate: 1,
      startOfDay: {
        $dateTrunc: {
          date: "$orderDate",
          unit: "day"
        }
      },
      startOfMonth: {
        $dateTrunc: {
          date: "$orderDate",
          unit: "month"
        }
      }
    }
  }
]).toArray();

// ===== DATE CONVERSION =====

// $toDate - Convert to date
await orders.aggregate([
  {
    $project: {
      timestamp: 1,
      dateValue: { $toDate: "$timestamp" }
    }
  }
]).toArray();

// $toLong - Convert date to milliseconds
await orders.aggregate([
  {
    $project: {
      orderDate: 1,
      timestamp: { $toLong: "$orderDate" }
    }
  }
]).toArray();

// ===== PRACTICAL EXAMPLES =====

// Age calculation
await orders.aggregate([
  {
    $project: {
      birthDate: 1,
      age: {
        $dateDiff: {
          startDate: "$birthDate",
          endDate: new Date(),
          unit: "year"
        }
      }
    }
  }
]).toArray();

// Business hours check
await orders.aggregate([
  {
    $project: {
      orderDate: 1,
      isDuringBusinessHours: {
        $and: [
          { $gte: [{ $hour: "$orderDate" }, 9] },
          { $lt: [{ $hour: "$orderDate" }, 17] },
          { $gte: [{ $dayOfWeek: "$orderDate" }, 2] },  // Monday = 2
          { $lte: [{ $dayOfWeek: "$orderDate" }, 6] }   // Friday = 6
        ]
      }
    }
  }
]).toArray();

// Monthly revenue grouping
await orders.aggregate([
  {
    $group: {
      _id: {
        year: { $year: "$orderDate" },
        month: { $month: "$orderDate" }
      },
      revenue: { $sum: "$total" },
      count: { $sum: 1 }
    }
  },
  {
    $project: {
      _id: 0,
      date: {
        $dateFromString: {
          dateString: {
            $concat: [
              { $toString: "$_id.year" },
              "-",
              { $toString: "$_id.month" },
              "-01"
            ]
          }
        }
      },
      revenue: 1,
      count: 1
    }
  },
  { $sort: { date: 1 } }
]).toArray();

// Time until expiration
await orders.aggregate([
  {
    $project: {
      expiryDate: 1,
      daysUntilExpiry: {
        $dateDiff: {
          startDate: new Date(),
          endDate: "$expiryDate",
          unit: "day"
        }
      },
      status: {
        $switch: {
          branches: [
            {
              case: {
                $lte: [
                  {
                    $dateDiff: {
                      startDate: new Date(),
                      endDate: "$expiryDate",
                      unit: "day"
                    }
                  },
                  0
                ]
              },
              then: "expired"
            },
            {
              case: {
                $lte: [
                  {
                    $dateDiff: {
                      startDate: new Date(),
                      endDate: "$expiryDate",
                      unit: "day"
                    }
                  },
                  7
                ]
              },
              then: "expiring soon"
            }
          ],
          default: "active"
        }
      }
    }
  }
]).toArray();

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

              {/* Expression Operators in Mongoose */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-purple-300">
                  1. Array, String, Date Operators in Mongoose
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const mongoose = require("mongoose");

await mongoose.connect("mongodb://localhost:27017/myDatabase");

const productSchema = new mongoose.Schema({
  name: String,
  tags: [String],
  reviews: [{ rating: Number, text: String }],
  createdAt: Date
});

const Product = mongoose.model("Product", productSchema);

// ===== ARRAY OPERATORS =====

await Product.aggregate([
  {
    $project: {
      name: 1,
      tagCount: { $size: "$tags" },
      firstTag: { $arrayElemAt: ["$tags", 0] },
      sortedTags: { $sortArray: { input: "$tags", sortBy: 1 } }
    }
  }
]);

// ===== STRING OPERATORS =====

await Product.aggregate([
  {
    $project: {
      name: 1,
      upperName: { $toUpper: "$name" },
      nameLength: { $strLenCP: "$name" },
      formatted: {
        $concat: [
          "Product: ",
          "$name",
          " (",
          { $toString: { $size: "$tags" } },
          " tags)"
        ]
      }
    }
  }
]);

// ===== DATE OPERATORS =====

await Product.aggregate([
  {
    $project: {
      name: 1,
      createdAt: 1,
      year: { $year: "$createdAt" },
      month: { $month: "$createdAt" },
      formatted: {
        $dateToString: {
          format: "%Y-%m-%d",
          date: "$createdAt"
        }
      },
      daysOld: {
        $dateDiff: {
          startDate: "$createdAt",
          endDate: new Date(),
          unit: "day"
        }
      }
    }
  }
]);

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
                  <strong>$map over array iteration:</strong> More efficient
                  than multiple operations
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>$filter before $map:</strong> Reduce array size before
                  transformation
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Index for string searches:</strong> Create text
                  indexes for $regex queries
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Timezone awareness:</strong> Always specify timezone
                  in date operations
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>$concat performance:</strong> Better than multiple
                  string operations
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Store computed arrays:</strong> Cache results of
                  expensive array operations
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Date formatting at query time:</strong> Store dates as
                  Date type, format in aggregation
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>$reduce carefully:</strong> Can be slow on large
                  arrays
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Unicode vs Bytes:</strong> Use CP operators for
                  international text
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Date arithmetic units:</strong> Choose appropriate
                  unit for precision vs performance
                </span>
              </li>
            </ul>
          </section>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8">
            <Link
              href="/phase4/expressions-1"
              className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              ← Previous: Expression Operators Part 1
            </Link>
            <Link
              href="/"
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
