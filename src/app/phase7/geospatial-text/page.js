"use client";

import Link from "next/link";
import { useState } from "react";

export default function GeospatialTextPage() {
  const [activeTab, setActiveTab] = useState("geospatial");

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
          Geospatial & Text Search
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Advanced Geospatial Queries and Full-Text Search
        </p>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 flex-wrap">
          <button
            onClick={() => setActiveTab("geospatial")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "geospatial"
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Geospatial
          </button>
          <button
            onClick={() => setActiveTab("text")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "text"
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Text Search
          </button>
        </div>

        <div className="space-y-8">
          {/* Geospatial Tab */}
          {activeTab === "geospatial" && (
            <>
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  📚 Geospatial Theory
                </h2>

                <div className="space-y-4 text-gray-200">
                  <p className="text-lg">
                    MongoDB supports <strong>geospatial queries</strong> for
                    location-based data using GeoJSON objects and legacy
                    coordinate pairs.
                  </p>

                  <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                    Coordinate Systems
                  </h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong>GeoJSON:</strong> WGS84 coordinate system
                      (longitude, latitude)
                    </li>
                    <li>
                      <strong>Legacy Pairs:</strong> Planar coordinates [x, y]
                      or [longitude, latitude]
                    </li>
                  </ul>

                  <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                    Geospatial Index Types
                  </h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong>2dsphere:</strong> For Earth-like spheres
                      (GeoJSON)
                    </li>
                    <li>
                      <strong>2d:</strong> For flat surfaces (legacy pairs)
                    </li>
                  </ul>

                  <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                    GeoJSON Types
                  </h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Point, LineString, Polygon</li>
                    <li>MultiPoint, MultiLineString, MultiPolygon</li>
                    <li>GeometryCollection</li>
                  </ul>
                </div>
              </section>

              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  Geospatial Examples
                </h2>

                {/* GeoJSON & Indexes */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    1. GeoJSON & Indexes
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://localhost:27017");
await client.connect();

const db = client.db("geoDatabase");
const places = db.collection("places");

// ===== CREATE 2DSPHERE INDEX =====

await places.createIndex({ location: "2dsphere" });

// ===== INSERT GEOJSON DATA =====

// Point
await places.insertOne({
  name: "Central Park",
  category: "park",
  location: {
    type: "Point",
    coordinates: [-73.9654, 40.7829]  // [longitude, latitude]
  }
});

// Polygon
await places.insertOne({
  name: "Downtown Area",
  location: {
    type: "Polygon",
    coordinates: [[
      [-73.99, 40.75],
      [-73.98, 40.75],
      [-73.98, 40.76],
      [-73.99, 40.76],
      [-73.99, 40.75]  // First point repeated to close polygon
    ]]
  }
});

// LineString
await places.insertOne({
  name: "Broadway",
  location: {
    type: "LineString",
    coordinates: [
      [-73.99, 40.75],
      [-73.98, 40.76],
      [-73.97, 40.77]
    ]
  }
});

// MultiPoint
await places.insertOne({
  name: "Chain Store Locations",
  location: {
    type: "MultiPoint",
    coordinates: [
      [-73.99, 40.75],
      [-73.98, 40.76]
    ]
  }
});`}</code>
                  </pre>
                </div>

                {/* Proximity Queries */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    2. Proximity Queries ($near, $nearSphere)
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== $near (2dsphere) =====

// Find places near a point
const nearbyPlaces = await places.find({
  location: {
    $near: {
      $geometry: {
        type: "Point",
        coordinates: [-73.97, 40.78]
      },
      $maxDistance: 5000,  // meters
      $minDistance: 0
    }
  }
}).limit(10).toArray();

console.log("Nearby places:", nearbyPlaces);

// ===== $nearSphere =====

// For spherical queries
const sphericalNear = await places.find({
  location: {
    $nearSphere: {
      $geometry: {
        type: "Point",
        coordinates: [-73.97, 40.78]
      },
      $maxDistance: 5000
    }
  }
}).toArray();

// ===== LEGACY COORDINATE PAIRS =====

// With 2d index
await places.createIndex({ legacyLocation: "2d" });

await places.insertOne({
  name: "Legacy Place",
  legacyLocation: [-73.97, 40.78]  // [x, y]
});

const legacyNear = await places.find({
  legacyLocation: {
    $near: [-73.97, 40.78],
    $maxDistance: 0.01  // radians for 2d index
  }
}).toArray();`}</code>
                  </pre>
                </div>

                {/* Geospatial Operators */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    3. Geospatial Operators
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== $geoWithin =====

// Find points within a polygon
const withinPolygon = await places.find({
  location: {
    $geoWithin: {
      $geometry: {
        type: "Polygon",
        coordinates: [[
          [-74.0, 40.7],
          [-73.9, 40.7],
          [-73.9, 40.8],
          [-74.0, 40.8],
          [-74.0, 40.7]
        ]]
      }
    }
  }
}).toArray();

// Within circle (2dsphere)
const withinCircle = await places.find({
  location: {
    $geoWithin: {
      $centerSphere: [
        [-73.97, 40.78],  // center
        1 / 3963.2  // radius in radians (1 mile / Earth radius in miles)
      ]
    }
  }
}).toArray();

// Within box (2d index)
const withinBox = await places.find({
  legacyLocation: {
    $geoWithin: {
      $box: [
        [-74.0, 40.7],  // bottom left
        [-73.9, 40.8]   // top right
      ]
    }
  }
}).toArray();

// Within center (2d index)
const withinCenter = await places.find({
  legacyLocation: {
    $geoWithin: {
      $center: [
        [-73.97, 40.78],  // center
        0.01              // radius
      ]
    }
  }
}).toArray();

// ===== $geoIntersects =====

// Find geometries that intersect
const intersecting = await places.find({
  location: {
    $geoIntersects: {
      $geometry: {
        type: "LineString",
        coordinates: [
          [-73.99, 40.75],
          [-73.97, 40.77]
        ]
      }
    }
  }
}).toArray();`}</code>
                  </pre>
                </div>

                {/* Aggregation Pipeline */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    4. Geospatial Aggregation
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== $geoNear STAGE =====

// Must be first stage in pipeline
const nearestPlaces = await places.aggregate([
  {
    $geoNear: {
      near: {
        type: "Point",
        coordinates: [-73.97, 40.78]
      },
      distanceField: "distance",
      maxDistance: 10000,
      minDistance: 0,
      query: { category: "restaurant" },
      spherical: true,
      distanceMultiplier: 0.001,  // Convert to km
      includeLocs: "location",
      key: "location"
    }
  },
  {
    $limit: 10
  },
  {
    $project: {
      name: 1,
      category: 1,
      distance: 1
    }
  }
]).toArray();

console.log("Nearest restaurants:", nearestPlaces);

// ===== CALCULATE DISTANCE =====

const withDistances = await places.aggregate([
  {
    $geoNear: {
      near: { type: "Point", coordinates: [-73.97, 40.78] },
      distanceField: "distanceInMeters",
      spherical: true
    }
  },
  {
    $addFields: {
      distanceInKm: { $divide: ["$distanceInMeters", 1000] },
      distanceInMiles: { $divide: ["$distanceInMeters", 1609.34] }
    }
  }
]).toArray();

// ===== GROUP BY PROXIMITY =====

const groupedByDistance = await places.aggregate([
  {
    $geoNear: {
      near: { type: "Point", coordinates: [-73.97, 40.78] },
      distanceField: "distance",
      spherical: true
    }
  },
  {
    $bucket: {
      groupBy: "$distance",
      boundaries: [0, 1000, 5000, 10000],
      default: "10000+",
      output: {
        count: { $sum: 1 },
        places: { $push: "$name" }
      }
    }
  }
]).toArray();

await client.close();`}</code>
                  </pre>
                </div>
              </section>
            </>
          )}

          {/* Text Search Tab */}
          {activeTab === "text" && (
            <>
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  📚 Text Search Theory
                </h2>

                <div className="space-y-4 text-gray-200">
                  <p className="text-lg">
                    MongoDB provides <strong>full-text search</strong> with
                    support for stemming, stop words, and language-specific
                    analyzers.
                  </p>

                  <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                    Key Features
                  </h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong>Stemming:</strong> Finds word roots (running →
                      run)
                    </li>
                    <li>
                      <strong>Stop Words:</strong> Ignores common words (the, a,
                      an)
                    </li>
                    <li>
                      <strong>Case Insensitive:</strong> Matches regardless of
                      case
                    </li>
                    <li>
                      <strong>Diacritic Insensitive:</strong> Matches accented
                      characters
                    </li>
                    <li>
                      <strong>Phrase Search:</strong> Exact phrase matching
                    </li>
                    <li>
                      <strong>Negation:</strong> Exclude terms from results
                    </li>
                    <li>
                      <strong>Weights:</strong> Prioritize fields in scoring
                    </li>
                  </ul>

                  <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                    Supported Languages
                  </h3>
                  <p>
                    MongoDB supports 20+ languages including: english, spanish,
                    french, german, italian, portuguese, russian, chinese,
                    japanese, korean, etc.
                  </p>
                </div>
              </section>

              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  Text Search Examples
                </h2>

                {/* Text Indexes */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    1. Text Indexes
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://localhost:27017");
await client.connect();

const db = client.db("searchDatabase");
const articles = db.collection("articles");

// ===== CREATE TEXT INDEX =====

// Single field
await articles.createIndex({ title: "text" });

// Multiple fields
await articles.createIndex({
  title: "text",
  content: "text",
  tags: "text"
});

// With weights (default is 1)
await articles.createIndex(
  {
    title: "text",
    content: "text"
  },
  {
    weights: {
      title: 10,    // Title matches score 10x higher
      content: 1
    },
    default_language: "english",
    language_override: "lang"  // Field that specifies language
  }
);

// Wildcard text index (all string fields)
await articles.createIndex({ "$**": "text" });

// ===== INSERT SAMPLE DATA =====

await articles.insertMany([
  {
    title: "MongoDB Basics",
    content: "Learn MongoDB fundamentals and core concepts",
    tags: ["database", "nosql", "mongodb"],
    lang: "english"
  },
  {
    title: "Advanced MongoDB",
    content: "Deep dive into advanced MongoDB features",
    tags: ["database", "advanced"],
    lang: "english"
  },
  {
    title: "MongoDB Tutorial",
    content: "Complete guide to MongoDB",
    tags: ["tutorial", "guide"],
    lang: "english"
  }
]);`}</code>
                  </pre>
                </div>

                {/* Text Search Queries */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    2. Text Search Queries
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== BASIC TEXT SEARCH =====

// Simple search
const results = await articles.find({
  $text: { $search: "mongodb" }
}).toArray();

// Multiple terms (OR)
const multiTerm = await articles.find({
  $text: { $search: "mongodb database" }
}).toArray();

// Phrase search
const phrase = await articles.find({
  $text: { $search: "\\"mongodb basics\\"" }
}).toArray();

// Negation (exclude term)
const exclude = await articles.find({
  $text: { $search: "mongodb -advanced" }
}).toArray();

// ===== TEXT SEARCH OPTIONS =====

// Case sensitive
const caseSensitive = await articles.find({
  $text: {
    $search: "MongoDB",
    $caseSensitive: true
  }
}).toArray();

// Diacritic sensitive
const diacriticSensitive = await articles.find({
  $text: {
    $search: "café",
    $diacriticSensitive: true
  }
}).toArray();

// Language-specific
const spanish = await articles.find({
  $text: {
    $search: "aprender mongodb",
    $language: "spanish"
  }
}).toArray();

// ===== TEXT SCORE =====

// Get relevance score
const scored = await articles.find(
  { $text: { $search: "mongodb" } },
  { score: { $meta: "textScore" } }
).sort({ score: { $meta: "textScore" } })
.toArray();

console.log("Results with scores:", scored.map(doc => ({
  title: doc.title,
  score: doc.score
})));

// Filter by score
const highScore = await articles.find(
  {
    $text: { $search: "mongodb" },
    score: { $meta: "textScore" }
  },
  { score: { $meta: "textScore" } }
).toArray().then(docs => 
  docs.filter(doc => doc.score > 1.0)
);`}</code>
                  </pre>
                </div>

                {/* Advanced Text Search */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    3. Advanced Text Search
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== COMBINE WITH OTHER QUERIES =====

// Text search + filter
const filtered = await articles.find({
  $text: { $search: "mongodb" },
  tags: "database",
  publishDate: { $gte: new Date("2024-01-01") }
}).toArray();

// Text search + projection
const projected = await articles.find(
  { $text: { $search: "mongodb" } },
  { title: 1, score: { $meta: "textScore" } }
).toArray();

// ===== AGGREGATION WITH TEXT SEARCH =====

const aggregated = await articles.aggregate([
  {
    $match: {
      $text: { $search: "mongodb database" }
    }
  },
  {
    $addFields: {
      score: { $meta: "textScore" }
    }
  },
  {
    $match: {
      score: { $gte: 1.0 }
    }
  },
  {
    $sort: { score: -1 }
  },
  {
    $limit: 10
  },
  {
    $project: {
      title: 1,
      content: { $substr: ["$content", 0, 100] },
      score: 1
    }
  }
]).toArray();

// ===== TEXT SEARCH WITH FACETS =====

const faceted = await articles.aggregate([
  {
    $match: {
      $text: { $search: "mongodb" }
    }
  },
  {
    $facet: {
      byScore: [
        { $addFields: { score: { $meta: "textScore" } } },
        { $sort: { score: -1 } },
        { $limit: 10 }
      ],
      byDate: [
        { $sort: { publishDate: -1 } },
        { $limit: 10 }
      ],
      byTags: [
        { $unwind: "$tags" },
        { $group: { _id: "$tags", count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]
    }
  }
]).toArray();

// ===== AUTOCOMPLETE PATTERN =====

// Using regex for prefix matching
const autocomplete = await articles.find({
  title: { $regex: "^mongo", $options: "i" }
}).limit(10).toArray();

// Combined with text search
const smartAutocomplete = await articles.find({
  $or: [
    { title: { $regex: "^mongo", $options: "i" } },
    { $text: { $search: "mongo" } }
  ]
}).toArray();`}</code>
                  </pre>
                </div>

                {/* Mongoose Text Search */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    4. Mongoose Text Search
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`const mongoose = require("mongoose");

await mongoose.connect("mongodb://localhost:27017/searchDatabase");

// ===== DEFINE SCHEMA WITH TEXT INDEX =====

const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
  tags: [String],
  author: String,
  publishDate: Date
});

// Create text index
articleSchema.index({
  title: "text",
  content: "text"
}, {
  weights: {
    title: 10,
    content: 1
  }
});

const Article = mongoose.model("Article", articleSchema);

// ===== TEXT SEARCH WITH MONGOOSE =====

// Basic search
const results = await Article.find({
  $text: { $search: "mongodb" }
});

// With score
const scored = await Article.find(
  { $text: { $search: "mongodb" } },
  { score: { $meta: "textScore" } }
).sort({ score: { $meta: "textScore" } });

// Combined query
const combined = await Article.find({
  $text: { $search: "mongodb" },
  author: "John Doe"
}).select("title content").limit(10);

// ===== STATIC METHOD FOR SEARCH =====

articleSchema.statics.search = function(searchTerm, options = {}) {
  const query = {
    $text: { $search: searchTerm }
  };

  return this.find(query, {
    score: { $meta: "textScore" }
  })
    .sort({ score: { $meta: "textScore" } })
    .limit(options.limit || 10)
    .skip(options.skip || 0);
};

// Usage
const searchResults = await Article.search("mongodb", {
  limit: 20,
  skip: 0
});

await mongoose.disconnect();
await client.close();`}</code>
                  </pre>
                </div>
              </section>
            </>
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
                  <strong>2dsphere for Earth:</strong> Use for
                  latitude/longitude queries
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Coordinates order:</strong> Always [longitude,
                  latitude] for GeoJSON
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Close polygons:</strong> First and last coordinates
                  must match
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>$geoNear first:</strong> Must be first stage in
                  aggregation
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>One text index:</strong> Only one text index per
                  collection
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Weight fields:</strong> Give higher weights to
                  important fields
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Sort by score:</strong> Use textScore for relevance
                  ranking
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Language-specific:</strong> Set correct language for
                  better stemming
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Phrase search:</strong> Use quotes for exact phrase
                  matching
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Combine filters:</strong> Add filters to narrow text
                  search results
                </span>
              </li>
            </ul>
          </section>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8">
            <Link
              href="/phase7/transactions-streams"
              className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              ← Previous: Transactions & Streams
            </Link>
            <Link
              href="/phase7/gridfs-storage"
              className="bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-500 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              Next: GridFS & Storage →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
