"use client";

import Link from "next/link";
import { useState } from "react";

export default function IntermediateQueriesPage() {
  const [activeTab, setActiveTab] = useState("mongodb");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <Link
          href="/"
          className="text-blue-400 hover:text-blue-300 mb-6 inline-block"
        >
          ← Back to Home
        </Link>

        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
          Intermediate Queries
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Aggregation pipelines, joins, grouping, and data transformation
          queries
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
          {/* MongoDB Native Driver Examples */}
          {activeTab === "mongodb" && (
            <div className="space-y-8">
              {/* Basic Aggregation */}
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-blue-300">
                  1. Basic Aggregation Pipeline
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-cyan-300">
                      Match and Group
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm">{`// Count documents by category
const result = await db.collection('orders')
  .aggregate([
    { $match: { status: 'completed' } },
    { $group: {
        _id: '$category',
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' }
      }
    },
    { $sort: { count: -1 } }
  ])
  .toArray();`}</code>
                    </pre>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-cyan-300">
                      Project and Transform
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm">{`// Transform document structure
const result = await db.collection('users')
  .aggregate([
    { $match: { status: 'active' } },
    { $project: {
        fullName: { $concat: ['$firstName', ' ', '$lastName'] },
        email: 1,
        age: 1,
        isAdult: { $gte: ['$age', 18] }
      }
    }
  ])
  .toArray();`}</code>
                    </pre>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-cyan-300">
                      Unwind Arrays
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm">{`// Deconstruct array and group
const result = await db.collection('orders')
  .aggregate([
    { $unwind: '$items' },
    { $group: {
        _id: '$items.productId',
        totalQuantity: { $sum: '$items.quantity' },
        totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
      }
    }
  ])
  .toArray();`}</code>
                    </pre>
                  </div>
                </div>
              </section>

              {/* Lookup (Joins) */}
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-blue-300">
                  2. Lookup (Joins)
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-cyan-300">
                      Basic Lookup
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm">{`// Join orders with products
const result = await db.collection('orders')
  .aggregate([
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
        price: '$product.price',
        quantity: 1
      }
    }
  ])
  .toArray();`}</code>
                    </pre>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-cyan-300">
                      Lookup with Pipeline
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm">{`// Join with conditions
const result = await db.collection('orders')
  .aggregate([
    { $lookup: {
        from: 'products',
        let: { productId: '$productId' },
        pipeline: [
          { $match: {
              $expr: {
                $and: [
                  { $eq: ['$_id', '$$productId'] },
                  { $eq: ['$status', 'active'] }
                ]
              }
            }
          }
        ],
        as: 'product'
      }
    }
  ])
  .toArray();`}</code>
                    </pre>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-cyan-300">
                      Multiple Lookups
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm">{`// Join multiple collections
const result = await db.collection('orders')
  .aggregate([
    { $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user'
      }
    },
    { $lookup: {
        from: 'products',
        localField: 'productId',
        foreignField: '_id',
        as: 'product'
      }
    },
    { $unwind: '$user' },
    { $unwind: '$product' },
    { $project: {
        orderId: '$_id',
        userName: '$user.name',
        productName: '$product.name',
        amount: 1
      }
    }
  ])
  .toArray();`}</code>
                    </pre>
                  </div>
                </div>
              </section>

              {/* Grouping and Aggregation */}
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-blue-300">
                  3. Advanced Grouping
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-cyan-300">
                      Group with Multiple Accumulators
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm">{`// Comprehensive statistics
const result = await db.collection('orders')
  .aggregate([
    { $match: { status: 'completed' } },
    { $group: {
        _id: '$category',
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
        avgAmount: { $avg: '$amount' },
        minAmount: { $min: '$amount' },
        maxAmount: { $max: '$amount' },
        orders: { $push: '$_id' },
        uniqueUsers: { $addToSet: '$userId' }
      }
    },
    { $project: {
        category: '$_id',
        count: 1,
        totalAmount: 1,
        avgAmount: { $round: ['$avgAmount', 2] },
        minAmount: 1,
        maxAmount: 1,
        orderCount: { $size: '$orders' },
        userCount: { $size: '$uniqueUsers' }
      }
    }
  ])
  .toArray();`}</code>
                    </pre>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-cyan-300">
                      Group by Date
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm">{`// Group by day
const result = await db.collection('orders')
  .aggregate([
    { $match: { createdAt: { $gte: startDate } } },
    { $group: {
        _id: {
          $dateToString: {
            format: '%Y-%m-%d',
            date: '$createdAt'
          }
        },
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' }
      }
    },
    { $sort: { _id: 1 } }
  ])
  .toArray();`}</code>
                    </pre>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-cyan-300">
                      Group by Multiple Fields
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm">{`// Group by category and status
const result = await db.collection('orders')
  .aggregate([
    { $group: {
        _id: {
          category: '$category',
          status: '$status'
        },
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' }
      }
    },
    { $sort: { '_id.category': 1, '_id.status': 1 } }
  ])
  .toArray();`}</code>
                    </pre>
                  </div>
                </div>
              </section>

              {/* Facet */}
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-blue-300">
                  4. Facet (Multiple Pipelines)
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-cyan-300">
                      Parallel Aggregations
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm">{`// Multiple aggregations in one query
const result = await db.collection('products')
  .aggregate([
    { $match: { category: 'electronics' } },
    { $facet: {
        byPrice: [
          { $bucket: {
              groupBy: '$price',
              boundaries: [0, 100, 500, 1000, Infinity],
              default: 'Other',
              output: { count: { $sum: 1 } }
            }
          }
        ],
        byBrand: [
          { $group: { _id: '$brand', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 }
        ],
        stats: [
          { $group: {
              _id: null,
              total: { $sum: 1 },
              avgPrice: { $avg: '$price' },
              minPrice: { $min: '$price' },
              maxPrice: { $max: '$price' }
            }
          }
        ]
      }
    }
  ])
  .toArray();`}</code>
                    </pre>
                  </div>
                </div>
              </section>

              {/* Bucket */}
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-blue-300">
                  5. Bucket Grouping
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-cyan-300">
                      Fixed Buckets
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm">{`// Group into price ranges
const result = await db.collection('products')
  .aggregate([
    { $bucket: {
        groupBy: '$price',
        boundaries: [0, 50, 100, 200, 500, 1000, Infinity],
        default: 'Other',
        output: {
          count: { $sum: 1 },
          products: { $push: '$name' },
          avgPrice: { $avg: '$price' }
        }
      }
    }
  ])
  .toArray();`}</code>
                    </pre>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-cyan-300">
                      Auto Buckets
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm">{`// Automatic bucket creation
const result = await db.collection('products')
  .aggregate([
    { $bucketAuto: {
        groupBy: '$price',
        buckets: 5,
        output: {
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' }
        }
      }
    }
  ])
  .toArray();`}</code>
                    </pre>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* Mongoose Examples */}
          {activeTab === "mongoose" && (
            <div className="space-y-8">
              {/* Basic Aggregation */}
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  1. Basic Aggregation
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-pink-300">
                      Match and Group
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm">{`// Count by category
const result = await Order.aggregate([
  { $match: { status: 'completed' } },
  { $group: {
      _id: '$category',
      count: { $sum: 1 },
      totalAmount: { $sum: '$amount' }
    }
  },
  { $sort: { count: -1 } }
]);`}</code>
                    </pre>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-pink-300">
                      Project and Transform
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm">{`// Transform documents
const result = await User.aggregate([
  { $match: { status: 'active' } },
  { $project: {
      fullName: { $concat: ['$firstName', ' ', '$lastName'] },
      email: 1,
      age: 1,
      isAdult: { $gte: ['$age', 18] }
    }
  }
]);`}</code>
                    </pre>
                  </div>
                </div>
              </section>

              {/* Lookup with Populate Alternative */}
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  2. Joins and Population
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-pink-300">
                      Using Populate
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm">{`// Simple populate
const orders = await Order.find({ userId: userId })
  .populate('userId', 'name email')
  .populate('productId');

// Multiple populates
const orders = await Order.find({ userId: userId })
  .populate([
    { path: 'userId', select: 'name email' },
    { path: 'productId', populate: { path: 'categoryId' } }
  ]);

// Conditional populate
const orders = await Order.find({ userId: userId })
  .populate({
    path: 'userId',
    match: { status: 'active' },
    select: 'name email'
  });`}</code>
                    </pre>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-pink-300">
                      Using Aggregation Lookup
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm">{`// Lookup in aggregation
const result = await Order.aggregate([
  { $match: { userId: userId } },
  { $lookup: {
      from: 'users',
      localField: 'userId',
      foreignField: '_id',
      as: 'user'
    }
  },
  { $lookup: {
      from: 'products',
      localField: 'productId',
      foreignField: '_id',
      as: 'product'
    }
  },
  { $unwind: '$user' },
  { $unwind: '$product' }
]);`}</code>
                    </pre>
                  </div>
                </div>
              </section>

              {/* Grouping */}
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  3. Advanced Grouping
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-pink-300">
                      Group with Statistics
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm">{`// Comprehensive grouping
const result = await Order.aggregate([
  { $match: { status: 'completed' } },
  { $group: {
      _id: '$category',
      count: { $sum: 1 },
      totalAmount: { $sum: '$amount' },
      avgAmount: { $avg: '$amount' },
      minAmount: { $min: '$amount' },
      maxAmount: { $max: '$amount' },
      orders: { $push: '$_id' }
    }
  },
  { $project: {
      category: '$_id',
      count: 1,
      totalAmount: 1,
      avgAmount: { $round: ['$avgAmount', 2] }
    }
  }
]);`}</code>
                    </pre>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-pink-300">
                      Group by Date
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm">{`// Daily statistics
const result = await Order.aggregate([
  { $match: { createdAt: { $gte: startDate } } },
  { $group: {
      _id: {
        $dateToString: {
          format: '%Y-%m-%d',
          date: '$createdAt'
        }
      },
      count: { $sum: 1 },
      totalAmount: { $sum: '$amount' }
    }
  },
  { $sort: { _id: 1 } }
]);`}</code>
                    </pre>
                  </div>
                </div>
              </section>

              {/* Facet */}
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  4. Facet Queries
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-pink-300">
                      Multiple Pipelines
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm">{`// Parallel aggregations
const result = await Product.aggregate([
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
]);`}</code>
                    </pre>
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
