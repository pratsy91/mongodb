"use client";

import Link from "next/link";
import { useState } from "react";

export default function GeospatialPage() {
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
          Geospatial Query Operators
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Complete guide to geospatial queries, indexes, and geometry operations
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
                Geospatial Indexes
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>2d:</strong> For flat, Euclidean geometry (legacy,
                  planar coordinates)
                </li>
                <li>
                  <strong>2dsphere:</strong> For spherical geometry (Earth-like
                  coordinates, GeoJSON)
                </li>
              </ul>

              <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                Query Operators
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>$geoIntersects:</strong> Find geometries that
                  intersect with specified geometry
                </li>
                <li>
                  <strong>$geoWithin:</strong> Find geometries completely within
                  specified geometry
                </li>
                <li>
                  <strong>$near:</strong> Find points near a location (returns
                  sorted by distance)
                </li>
                <li>
                  <strong>$nearSphere:</strong> Like $near but for spherical
                  geometry
                </li>
              </ul>

              <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                Geometry Specifiers
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>$geometry:</strong> Specify GeoJSON object
                </li>
                <li>
                  <strong>$box:</strong> Rectangle for 2d index (legacy)
                </li>
                <li>
                  <strong>$center:</strong> Circle for 2d index (legacy)
                </li>
                <li>
                  <strong>$centerSphere:</strong> Spherical circle
                </li>
                <li>
                  <strong>$polygon:</strong> Polygon for 2d index (legacy)
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

          {/* MongoDB Native Driver Examples */}
          {activeTab === "mongodb" && (
            <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
              <h2 className="text-3xl font-bold mb-6 text-blue-300">
                MongoDB Native Driver Examples
              </h2>

              {/* Setup & Indexes */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  1. Geospatial Indexes & Setup
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://localhost:27017");
await client.connect();
const db = client.db("myDatabase");
const places = db.collection("places");

// ===== CREATE GEOSPATIAL INDEXES =====

// 2dsphere index (for GeoJSON, spherical queries)
await places.createIndex({ location: "2dsphere" });

// 2d index (legacy, flat coordinates)
await places.createIndex({ location: "2d" });

// Compound index with geospatial field
await places.createIndex({ 
  location: "2dsphere",
  category: 1 
});

// ===== GeoJSON DOCUMENT STRUCTURES =====

// Point
const point = {
  type: "Point",
  coordinates: [-73.97, 40.77]  // [longitude, latitude]
};

// LineString
const line = {
  type: "LineString",
  coordinates: [
    [-73.97, 40.77],
    [-73.98, 40.78],
    [-73.99, 40.79]
  ]
};

// Polygon
const polygon = {
  type: "Polygon",
  coordinates: [
    [  // Exterior ring
      [-73.97, 40.77],
      [-73.98, 40.77],
      [-73.98, 40.78],
      [-73.97, 40.78],
      [-73.97, 40.77]  // Must close the ring
    ]
  ]
};

// Polygon with hole
const polygonWithHole = {
  type: "Polygon",
  coordinates: [
    [  // Exterior ring
      [0, 0], [10, 0], [10, 10], [0, 10], [0, 0]
    ],
    [  // Interior ring (hole)
      [2, 2], [8, 2], [8, 8], [2, 8], [2, 2]
    ]
  ]
};

// MultiPoint
const multiPoint = {
  type: "MultiPoint",
  coordinates: [
    [-73.97, 40.77],
    [-73.98, 40.78],
    [-73.99, 40.79]
  ]
};

// MultiLineString
const multiLine = {
  type: "MultiLineString",
  coordinates: [
    [[-73.97, 40.77], [-73.98, 40.78]],
    [[-73.99, 40.79], [-74.00, 40.80]]
  ]
};

// MultiPolygon
const multiPolygon = {
  type: "MultiPolygon",
  coordinates: [
    [
      [[-73.97, 40.77], [-73.98, 40.77], [-73.98, 40.78], [-73.97, 40.78], [-73.97, 40.77]]
    ],
    [
      [[-74.00, 40.80], [-74.01, 40.80], [-74.01, 40.81], [-74.00, 40.81], [-74.00, 40.80]]
    ]
  ]
};

// GeometryCollection
const geometryCollection = {
  type: "GeometryCollection",
  geometries: [
    { type: "Point", coordinates: [-73.97, 40.77] },
    { type: "LineString", coordinates: [[-73.97, 40.77], [-73.98, 40.78]] }
  ]
};

// ===== INSERT SAMPLE DATA =====

await places.insertMany([
  {
    name: "Central Park",
    location: {
      type: "Point",
      coordinates: [-73.968285, 40.785091]
    },
    category: "park"
  },
  {
    name: "Times Square",
    location: {
      type: "Point",
      coordinates: [-73.985130, 40.758896]
    },
    category: "landmark"
  },
  {
    name: "Brooklyn Bridge",
    location: {
      type: "Point",
      coordinates: [-73.996736, 40.706086]
    },
    category: "landmark"
  },
  {
    name: "Manhattan",
    location: {
      type: "Polygon",
      coordinates: [[
        [-74.020, 40.700], [-73.930, 40.700],
        [-73.930, 40.880], [-74.020, 40.880],
        [-74.020, 40.700]
      ]]
    },
    category: "area"
  }
]);

await client.close();`}</code>
                </pre>
              </div>

              {/* $near and $nearSphere */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  2. $near and $nearSphere - Proximity Queries
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://localhost:27017");
await client.connect();
const db = client.db("myDatabase");
const places = db.collection("places");

// Ensure 2dsphere index exists
await places.createIndex({ location: "2dsphere" });

// ===== $nearSphere - SPHERICAL PROXIMITY =====

// Find places near a point (sorted by distance)
await places.find({
  location: {
    $nearSphere: {
      $geometry: {
        type: "Point",
        coordinates: [-73.97, 40.77]  // [longitude, latitude]
      }
    }
  }
}).toArray();

// With max distance (in meters for 2dsphere)
await places.find({
  location: {
    $nearSphere: {
      $geometry: {
        type: "Point",
        coordinates: [-73.97, 40.77]
      },
      $maxDistance: 5000  // 5 kilometers (5000 meters)
    }
  }
}).toArray();

// With min and max distance
await places.find({
  location: {
    $nearSphere: {
      $geometry: {
        type: "Point",
        coordinates: [-73.97, 40.77]
      },
      $minDistance: 1000,  // 1 km minimum
      $maxDistance: 5000   // 5 km maximum
    }
  }
}).toArray();

// Limited results
await places.find({
  location: {
    $nearSphere: {
      $geometry: {
        type: "Point",
        coordinates: [-73.97, 40.77]
      },
      $maxDistance: 10000
    }
  }
}).limit(10).toArray();

// ===== $near - LEGACY 2D PROXIMITY =====

// For 2d index (legacy)
await places.find({
  location: {
    $near: [-73.97, 40.77],  // [x, y] coordinates
    $maxDistance: 0.1  // In coordinate units
  }
}).toArray();

// $near with GeoJSON (2dsphere)
await places.find({
  location: {
    $near: {
      $geometry: {
        type: "Point",
        coordinates: [-73.97, 40.77]
      },
      $maxDistance: 5000
    }
  }
}).toArray();

// ===== PROXIMITY WITH FILTERS =====

// Near + category filter
await places.find({
  location: {
    $nearSphere: {
      $geometry: {
        type: "Point",
        coordinates: [-73.97, 40.77]
      },
      $maxDistance: 5000
    }
  },
  category: "restaurant"
}).toArray();

// Near + multiple conditions
await places.find({
  location: {
    $nearSphere: {
      $geometry: {
        type: "Point",
        coordinates: [-73.97, 40.77]
      },
      $maxDistance: 3000
    }
  },
  category: { $in: ["restaurant", "cafe"] },
  rating: { $gte: 4 },
  open: true
}).limit(20).toArray();

// ===== GET DISTANCE IN RESULTS =====

// Using aggregation to include distance
await places.aggregate([
  {
    $geoNear: {
      near: {
        type: "Point",
        coordinates: [-73.97, 40.77]
      },
      distanceField: "distance",  // Output field
      maxDistance: 5000,
      spherical: true,
      key: "location"
    }
  }
]).toArray();

// $geoNear with query filter
await places.aggregate([
  {
    $geoNear: {
      near: {
        type: "Point",
        coordinates: [-73.97, 40.77]
      },
      distanceField: "distance",
      maxDistance: 5000,
      spherical: true,
      query: { category: "restaurant" },
      key: "location"
    }
  },
  {
    $limit: 10
  }
]).toArray();

// Include distance in kilometers
await places.aggregate([
  {
    $geoNear: {
      near: {
        type: "Point",
        coordinates: [-73.97, 40.77]
      },
      distanceField: "distanceMeters",
      maxDistance: 5000,
      spherical: true,
      key: "location"
    }
  },
  {
    $addFields: {
      distanceKm: { $divide: ["$distanceMeters", 1000] }
    }
  }
]).toArray();

await client.close();`}</code>
                </pre>
              </div>

              {/* $geoWithin */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  3. $geoWithin - Find Points Within Area
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://localhost:27017");
await client.connect();
const db = client.db("myDatabase");
const places = db.collection("places");

// ===== $geoWithin WITH $geometry (GeoJSON) =====

// Within a polygon
await places.find({
  location: {
    $geoWithin: {
      $geometry: {
        type: "Polygon",
        coordinates: [[
          [-74.0, 40.7],   // Southwest corner
          [-73.9, 40.7],   // Southeast corner
          [-73.9, 40.8],   // Northeast corner
          [-74.0, 40.8],   // Northwest corner
          [-74.0, 40.7]    // Close the ring
        ]]
      }
    }
  }
}).toArray();

// Within a more complex polygon (Manhattan-like shape)
await places.find({
  location: {
    $geoWithin: {
      $geometry: {
        type: "Polygon",
        coordinates: [[
          [-74.020, 40.700],
          [-73.930, 40.700],
          [-73.930, 40.800],
          [-73.970, 40.850],
          [-74.020, 40.800],
          [-74.020, 40.700]
        ]]
      }
    }
  }
}).toArray();

// Within a MultiPolygon
await places.find({
  location: {
    $geoWithin: {
      $geometry: {
        type: "MultiPolygon",
        coordinates: [
          [  // First polygon
            [[-74.0, 40.7], [-73.9, 40.7], [-73.9, 40.75], [-74.0, 40.75], [-74.0, 40.7]]
          ],
          [  // Second polygon
            [[-74.0, 40.76], [-73.9, 40.76], [-73.9, 40.8], [-74.0, 40.8], [-74.0, 40.76]]
          ]
        ]
      }
    }
  }
}).toArray();

// ===== $geoWithin WITH $centerSphere =====

// Within a spherical circle
// Radius in radians: divide distance by Earth's radius
// Earth radius ≈ 6378.1 km or 3963.2 miles
await places.find({
  location: {
    $geoWithin: {
      $centerSphere: [
        [-73.97, 40.77],  // Center [longitude, latitude]
        5 / 6378.1         // Radius: 5 km / Earth radius in km
      ]
    }
  }
}).toArray();

// Helper function to convert km to radians
function kmToRadians(km) {
  return km / 6378.1;
}

await places.find({
  location: {
    $geoWithin: {
      $centerSphere: [
        [-73.97, 40.77],
        kmToRadians(10)  // 10 km radius
      ]
    }
  }
}).toArray();

// Helper function to convert miles to radians
function milesToRadians(miles) {
  return miles / 3963.2;
}

await places.find({
  location: {
    $geoWithin: {
      $centerSphere: [
        [-73.97, 40.77],
        milesToRadians(5)  // 5 mile radius
      ]
    }
  }
}).toArray();

// ===== $geoWithin WITH $box (LEGACY 2D) =====

// Within a rectangular box (requires 2d index)
await places.find({
  location: {
    $geoWithin: {
      $box: [
        [-74.0, 40.7],  // Bottom-left corner
        [-73.9, 40.8]   // Top-right corner
      ]
    }
  }
}).toArray();

// ===== $geoWithin WITH $center (LEGACY 2D) =====

// Within a circle (requires 2d index)
await places.find({
  location: {
    $geoWithin: {
      $center: [
        [-73.97, 40.77],  // Center
        0.1                // Radius in coordinate units
      ]
    }
  }
}).toArray();

// ===== $geoWithin WITH $polygon (LEGACY 2D) =====

// Within a polygon (requires 2d index)
await places.find({
  location: {
    $geoWithin: {
      $polygon: [
        [-74.0, 40.7],
        [-73.9, 40.7],
        [-73.9, 40.8],
        [-74.0, 40.8]
      ]
    }
  }
}).toArray();

// ===== COMBINING WITH OTHER QUERIES =====

// Within area + filters
await places.find({
  location: {
    $geoWithin: {
      $centerSphere: [
        [-73.97, 40.77],
        kmToRadians(5)
      ]
    }
  },
  category: "restaurant",
  rating: { $gte: 4 }
}).toArray();

// Within area + sorting
await places.find({
  location: {
    $geoWithin: {
      $geometry: {
        type: "Polygon",
        coordinates: [[
          [-74.0, 40.7], [-73.9, 40.7],
          [-73.9, 40.8], [-74.0, 40.8],
          [-74.0, 40.7]
        ]]
      }
    }
  }
}).sort({ rating: -1 }).toArray();

await client.close();`}</code>
                </pre>
              </div>

              {/* $geoIntersects */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  4. $geoIntersects - Find Intersecting Geometries
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://localhost:27017");
await client.connect();
const db = client.db("myDatabase");
const regions = db.collection("regions");

// ===== $geoIntersects WITH POINT =====

// Find regions that intersect with a point
await regions.find({
  boundary: {
    $geoIntersects: {
      $geometry: {
        type: "Point",
        coordinates: [-73.97, 40.77]
      }
    }
  }
}).toArray();

// ===== $geoIntersects WITH LINESTRING =====

// Find regions that intersect with a line
await regions.find({
  boundary: {
    $geoIntersects: {
      $geometry: {
        type: "LineString",
        coordinates: [
          [-73.97, 40.77],
          [-73.98, 40.78],
          [-73.99, 40.79]
        ]
      }
    }
  }
}).toArray();

// ===== $geoIntersects WITH POLYGON =====

// Find regions that intersect with a polygon
await regions.find({
  boundary: {
    $geoIntersects: {
      $geometry: {
        type: "Polygon",
        coordinates: [[
          [-74.0, 40.7], [-73.9, 40.7],
          [-73.9, 40.8], [-74.0, 40.8],
          [-74.0, 40.7]
        ]]
      }
    }
  }
}).toArray();

// ===== PRACTICAL USE CASES =====

// Find delivery zones that cover a customer location
const customerLocation = {
  type: "Point",
  coordinates: [-73.97, 40.77]
};

await regions.find({
  deliveryZone: {
    $geoIntersects: {
      $geometry: customerLocation
    }
  }
}).toArray();

// Find cities along a route
const route = {
  type: "LineString",
  coordinates: [
    [-73.97, 40.77],  // Start
    [-74.00, 40.72],  // Waypoint
    [-74.05, 40.70]   // End
  ]
};

await regions.find({
  cityBoundary: {
    $geoIntersects: {
      $geometry: route
    }
  }
}).toArray();

// Find overlapping service areas
const newServiceArea = {
  type: "Polygon",
  coordinates: [[
    [-74.0, 40.7], [-73.95, 40.7],
    [-73.95, 40.75], [-74.0, 40.75],
    [-74.0, 40.7]
  ]]
};

await regions.find({
  serviceArea: {
    $geoIntersects: {
      $geometry: newServiceArea
    }
  }
}).toArray();

// ===== $geoIntersects VS $geoWithin =====

// $geoWithin: geometry is COMPLETELY within the area
// $geoIntersects: geometry TOUCHES or OVERLAPS the area

// Example data
await regions.insertOne({
  name: "Manhattan",
  boundary: {
    type: "Polygon",
    coordinates: [[
      [-74.020, 40.700], [-73.930, 40.700],
      [-73.930, 40.880], [-74.020, 40.880],
      [-74.020, 40.700]
    ]]
  }
});

const queryArea = {
  type: "Polygon",
  coordinates: [[
    [-74.0, 40.75], [-73.95, 40.75],
    [-73.95, 40.80], [-74.0, 40.80],
    [-74.0, 40.75]
  ]]
};

// Find regions completely within query area
await regions.find({
  boundary: {
    $geoWithin: {
      $geometry: queryArea
    }
  }
}).toArray();

// Find regions that intersect with query area (includes partial overlaps)
await regions.find({
  boundary: {
    $geoIntersects: {
      $geometry: queryArea
    }
  }
}).toArray();

// ===== COMBINING GEOSPATIAL QUERIES =====

// Complex query: regions intersecting AND meeting criteria
await regions.find({
  $and: [
    {
      boundary: {
        $geoIntersects: {
          $geometry: {
            type: "Point",
            coordinates: [-73.97, 40.77]
          }
        }
      }
    },
    { population: { $gte: 1000000 } },
    { country: "USA" }
  ]
}).toArray();

await client.close();`}</code>
                </pre>
              </div>

              {/* Advanced Geospatial */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  5. Advanced Geospatial Queries
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://localhost:27017");
await client.connect();
const db = client.db("myDatabase");
const places = db.collection("places");

// ===== AGGREGATION WITH GEOSPATIAL =====

// $geoNear (must be first stage in pipeline)
await places.aggregate([
  {
    $geoNear: {
      near: {
        type: "Point",
        coordinates: [-73.97, 40.77]
      },
      distanceField: "distance",
      maxDistance: 5000,
      spherical: true,
      key: "location",
      query: { category: "restaurant" }
    }
  },
  {
    $project: {
      name: 1,
      category: 1,
      distanceKm: { $divide: ["$distance", 1000] }
    }
  }
]).toArray();

// Group by proximity zones
await places.aggregate([
  {
    $geoNear: {
      near: {
        type: "Point",
        coordinates: [-73.97, 40.77]
      },
      distanceField: "distance",
      spherical: true,
      key: "location"
    }
  },
  {
    $bucket: {
      groupBy: "$distance",
      boundaries: [0, 1000, 2000, 5000, 10000],
      default: "10000+",
      output: {
        count: { $sum: 1 },
        places: { $push: "$name" }
      }
    }
  }
]).toArray();

// ===== COMPOUND GEOSPATIAL QUERIES =====

// Multiple geospatial conditions
await places.find({
  $and: [
    {
      location: {
        $geoWithin: {
          $centerSphere: [
            [-73.97, 40.77],
            5 / 6378.1  // 5 km
          ]
        }
      }
    },
    {
      deliveryZone: {
        $geoIntersects: {
          $geometry: {
            type: "Point",
            coordinates: [-73.98, 40.78]
          }
        }
      }
    }
  ]
}).toArray();

// ===== GEOSPATIAL WITH TEXT SEARCH =====

// Create text and geospatial indexes
await places.createIndex({ 
  location: "2dsphere",
  name: "text",
  description: "text"
});

// Combine text search with proximity
await places.find({
  $text: { $search: "pizza" },
  location: {
    $nearSphere: {
      $geometry: {
        type: "Point",
        coordinates: [-73.97, 40.77]
      },
      $maxDistance: 3000
    }
  }
}).toArray();

// ===== CALCULATE AREA =====

// Using $geoIntersects to calculate coverage
await places.aggregate([
  {
    $project: {
      name: 1,
      location: 1,
      intersectsNYC: {
        $let: {
          vars: {
            nycPolygon: {
              type: "Polygon",
              coordinates: [[
                [-74.020, 40.700], [-73.930, 40.700],
                [-73.930, 40.880], [-74.020, 40.880],
                [-74.020, 40.700]
              ]]
            }
          },
          in: {
            $anyElementTrue: [
              {
                $map: {
                  input: ["$location"],
                  as: "loc",
                  in: true
                }
              }
            ]
          }
        }
      }
    }
  }
]).toArray();

// ===== FIND NEAREST NEIGHBORS =====

// Find 5 nearest restaurants
await places.find({
  category: "restaurant",
  location: {
    $nearSphere: {
      $geometry: {
        type: "Point",
        coordinates: [-73.97, 40.77]
      }
    }
  }
}).limit(5).toArray();

// ===== ROUTE PLANNING =====

// Find points along a route
const route = {
  type: "LineString",
  coordinates: [
    [-73.97, 40.77],
    [-73.99, 40.78],
    [-74.01, 40.79]
  ]
};

// Find places near the route (buffer)
await places.aggregate([
  {
    $geoNear: {
      near: route.coordinates[0],  // Start point
      distanceField: "distanceFromStart",
      maxDistance: 2000,
      spherical: true,
      key: "location"
    }
  },
  {
    $match: {
      $or: route.coordinates.map(coord => ({
        location: {
          $nearSphere: {
            $geometry: {
              type: "Point",
              coordinates: coord
            },
            $maxDistance: 500  // 500m buffer
          }
        }
      }))
    }
  }
]).toArray();

// ===== SPATIAL JOINS =====

const customers = db.collection("customers");
const stores = db.collection("stores");

// Find nearest store for each customer
await customers.aggregate([
  {
    $lookup: {
      from: "stores",
      let: { customerLoc: "$location" },
      pipeline: [
        {
          $geoNear: {
            near: "$$customerLoc",
            distanceField: "distance",
            spherical: true,
            key: "location"
          }
        },
        { $limit: 1 }
      ],
      as: "nearestStore"
    }
  },
  {
    $unwind: "$nearestStore"
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

              {/* Setup in Mongoose */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-purple-300">
                  1. Geospatial Setup in Mongoose
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const mongoose = require("mongoose");

await mongoose.connect("mongodb://localhost:27017/myDatabase");

// ===== SCHEMA WITH GEOSPATIAL FIELD =====

const placeSchema = new mongoose.Schema({
  name: String,
  category: String,
  location: {
    type: {
      type: String,
      enum: ["Point", "LineString", "Polygon"],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  rating: Number
});

// Create 2dsphere index
placeSchema.index({ location: "2dsphere" });

// Compound index
placeSchema.index({ location: "2dsphere", category: 1 });

const Place = mongoose.model("Place", placeSchema);

// ===== USING GEOJSON TYPE =====

// Alternative: Using Mongoose GeoJSON schema type
const locationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Point"],
    required: true,
    default: "Point"
  },
  coordinates: {
    type: [Number],
    required: true,
    validate: {
      validator: function(coords) {
        return coords.length === 2;
      },
      message: "Coordinates must be [longitude, latitude]"
    }
  }
});

// Schema with location subdocument
const storeSchema = new mongoose.Schema({
  name: String,
  location: {
    type: locationSchema,
    required: true
  }
});

storeSchema.index({ location: "2dsphere" });

const Store = mongoose.model("Store", storeSchema);

// ===== INSERT DATA =====

await Place.create({
  name: "Central Park",
  category: "park",
  location: {
    type: "Point",
    coordinates: [-73.968285, 40.785091]
  },
  rating: 5
});

// Bulk insert
await Place.insertMany([
  {
    name: "Times Square",
    category: "landmark",
    location: {
      type: "Point",
      coordinates: [-73.985130, 40.758896]
    }
  },
  {
    name: "Brooklyn Bridge",
    category: "landmark",
    location: {
      type: "Point",
      coordinates: [-73.996736, 40.706086]
    }
  }
]);

await mongoose.disconnect();`}</code>
                </pre>
              </div>

              {/* Queries in Mongoose */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-purple-300">
                  2. Geospatial Queries in Mongoose
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const mongoose = require("mongoose");

await mongoose.connect("mongodb://localhost:27017/myDatabase");

const Place = mongoose.model("Place");

// ===== $nearSphere =====

// Find nearby places
await Place.find({
  location: {
    $nearSphere: {
      $geometry: {
        type: "Point",
        coordinates: [-73.97, 40.77]
      },
      $maxDistance: 5000  // meters
    }
  }
});

// Query builder syntax
await Place.find()
  .where("location")
  .near({
    center: {
      type: "Point",
      coordinates: [-73.97, 40.77]
    },
    maxDistance: 5000
  });

// With filters
await Place.find({
  location: {
    $nearSphere: {
      $geometry: {
        type: "Point",
        coordinates: [-73.97, 40.77]
      },
      $maxDistance: 5000
    }
  },
  category: "restaurant",
  rating: { $gte: 4 }
});

// ===== $geoWithin =====

// Within polygon
await Place.find({
  location: {
    $geoWithin: {
      $geometry: {
        type: "Polygon",
        coordinates: [[
          [-74.0, 40.7], [-73.9, 40.7],
          [-73.9, 40.8], [-74.0, 40.8],
          [-74.0, 40.7]
        ]]
      }
    }
  }
});

// Within circle (spherical)
function kmToRadians(km) {
  return km / 6378.1;
}

await Place.find({
  location: {
    $geoWithin: {
      $centerSphere: [
        [-73.97, 40.77],
        kmToRadians(10)
      ]
    }
  }
});

// Query builder
await Place.find()
  .where("location")
  .within()
  .geometry({
    type: "Polygon",
    coordinates: [[
      [-74.0, 40.7], [-73.9, 40.7],
      [-73.9, 40.8], [-74.0, 40.8],
      [-74.0, 40.7]
    ]]
  });

// ===== $geoIntersects =====

await Place.find({
  boundary: {
    $geoIntersects: {
      $geometry: {
        type: "Point",
        coordinates: [-73.97, 40.77]
      }
    }
  }
});

// Query builder
await Place.find()
  .where("boundary")
  .intersects()
  .geometry({
    type: "Point",
    coordinates: [-73.97, 40.77]
  });

// ===== INSTANCE METHODS =====

placeSchema.methods.findNearby = function(maxDistance = 5000) {
  return this.model("Place").find({
    _id: { $ne: this._id },
    location: {
      $nearSphere: {
        $geometry: this.location,
        $maxDistance: maxDistance
      }
    }
  });
};

// Usage
const centralPark = await Place.findOne({ name: "Central Park" });
const nearbyPlaces = await centralPark.findNearby(3000);

// ===== STATIC METHODS =====

placeSchema.statics.findByProximity = function(coords, maxDistance = 5000) {
  return this.find({
    location: {
      $nearSphere: {
        $geometry: {
          type: "Point",
          coordinates: coords
        },
        $maxDistance: maxDistance
      }
    }
  });
};

// Usage
const nearby = await Place.findByProximity([-73.97, 40.77], 3000);

// ===== VIRTUALS WITH GEOSPATIAL =====

placeSchema.virtual("coordinates").get(function() {
  return {
    lng: this.location.coordinates[0],
    lat: this.location.coordinates[1]
  };
});

placeSchema.virtual("coordinates").set(function(coords) {
  this.location.coordinates = [coords.lng, coords.lat];
});

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
                  <strong>Use 2dsphere for Earth data:</strong> Always prefer
                  2dsphere index for real-world geographic data
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>GeoJSON coordinate order:</strong> Always [longitude,
                  latitude] not [lat, lng]
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Close polygon rings:</strong> First and last
                  coordinates must be identical
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Validate coordinates:</strong> Longitude: -180 to 180,
                  Latitude: -90 to 90
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Use $geoNear for distances:</strong> Returns distance
                  in results, must be first aggregation stage
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Limit proximity results:</strong> Always use limit()
                  with $near queries
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Index required for $near:</strong> Geospatial index
                  mandatory for proximity queries
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Use spherical queries:</strong> $nearSphere and
                  $centerSphere for accurate Earth distances
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Compound indexes:</strong> Combine geospatial with
                  other frequently queried fields
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Distance units:</strong> 2dsphere uses meters, 2d uses
                  coordinate units
                </span>
              </li>
            </ul>
          </section>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8">
            <Link
              href="/phase3/array-bitwise"
              className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              ← Previous: Array & Bitwise
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
