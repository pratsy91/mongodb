"use client";

import Link from "next/link";
import { useState } from "react";

export default function AdvancedQueriesPage() {
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

        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
          Advanced Queries
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Complex aggregations, transactions, graph lookups, and performance
          optimization queries
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
              {/* Graph Lookup */}
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  1. Graph Lookup (Recursive Joins)
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-pink-300">
                      Hierarchical Data
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm">{`// Find all descendants of a category
const result = await db.collection('categories')
  .aggregate([
    { $match: { _id: categoryId } },
    { $graphLookup: {
        from: 'categories',
        startWith: '$_id',
        connectFromField: '_id',
        connectToField: 'parentId',
        as: 'descendants',
        maxDepth: 10
      }
    }
  ])
  .toArray();`}</code>
                    </pre>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-pink-300">
                      Employee Hierarchy
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm">{`// Find all subordinates
const result = await db.collection('employees')
  .aggregate([
    { $match: { _id: managerId } },
    { $graphLookup: {
        from: 'employees',
        startWith: '$_id',
        connectFromField: '_id',
        connectToField: 'managerId',
        as: 'team',
        depthField: 'level'
      }
    },
    { $project: {
        manager: { name: '$name', level: 0 },
        team: {
          $map: {
            input: '$team',
            as: 'member',
            in: {
              name: '$$member.name',
              level: '$$member.level'
            }
          }
        }
      }
    }
  ])
  .toArray();`}</code>
                    </pre>
                  </div>
                </div>
              </section>

              {/* Complex Multi-Stage Aggregation */}
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  2. Complex Multi-Stage Aggregation
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-pink-300">
                      Sales Analytics Pipeline
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm">{`// Comprehensive sales analysis
const result = await db.collection('orders')
  .aggregate([
    // Stage 1: Filter completed orders
    { $match: {
        status: 'completed',
        createdAt: { $gte: startDate, $lte: endDate }
      }
    },
    // Stage 2: Unwind items
    { $unwind: '$items' },
    // Stage 3: Join with products
    { $lookup: {
        from: 'products',
        localField: 'items.productId',
        foreignField: '_id',
        as: 'product'
      }
    },
    { $unwind: '$product' },
    // Stage 4: Calculate line totals
    { $addFields: {
        lineTotal: {
          $multiply: ['$items.quantity', '$items.price']
        },
        lineProfit: {
          $subtract: [
            { $multiply: ['$items.quantity', '$items.price'] },
            { $multiply: ['$items.quantity', '$product.cost'] }
          ]
        }
      }
    },
    // Stage 5: Group by product
    { $group: {
        _id: '$items.productId',
        productName: { $first: '$product.name' },
        totalQuantity: { $sum: '$items.quantity' },
        totalRevenue: { $sum: '$lineTotal' },
        totalProfit: { $sum: '$lineProfit' },
        orderCount: { $sum: 1 },
        avgOrderValue: { $avg: '$lineTotal' }
      }
    },
    // Stage 6: Calculate profit margin
    { $addFields: {
        profitMargin: {
          $cond: {
            if: { $gt: ['$totalRevenue', 0] },
            then: {
              $multiply: [
                { $divide: ['$totalProfit', '$totalRevenue'] },
                100
              ]
            },
            else: 0
          }
        }
      }
    },
    // Stage 7: Sort by revenue
    { $sort: { totalRevenue: -1 } },
    // Stage 8: Limit top products
    { $limit: 20 }
  ])
  .toArray();`}</code>
                    </pre>
                  </div>
                </div>
              </section>

              {/* Window Functions */}
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  3. Window Functions
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-pink-300">
                      Running Totals and Rankings
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm">{`// Calculate running totals and rankings
const result = await db.collection('sales')
  .aggregate([
    { $match: { date: { $gte: startDate } } },
    { $sort: { date: 1 } },
    { $setWindowFields: {
        partitionBy: '$region',
        sortBy: { date: 1 },
        output: {
          runningTotal: {
            $sum: '$amount',
            window: {
              documents: ['unboundedPreceding', 'current']
            }
          },
          monthlyTotal: {
            $sum: '$amount',
            window: {
              range: [-30, 0],
              unit: 'day'
            }
          },
          rank: {
            $denseRank: {}
          }
        }
      }
    }
  ])
  .toArray();`}</code>
                    </pre>
                  </div>
                </div>
              </section>

              {/* Transactions */}
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  4. Transactions
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-pink-300">
                      Multi-Document Transaction
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm">{`// Transfer funds between accounts
const session = client.startSession();

try {
  await session.withTransaction(async () => {
    const accounts = db.collection('accounts');
    
    // Debit from source
    await accounts.updateOne(
      { _id: sourceAccountId, balance: { $gte: amount } },
      { $inc: { balance: -amount } },
      { session }
    );
    
    // Credit to destination
    await accounts.updateOne(
      { _id: destAccountId },
      { $inc: { balance: amount } },
      { session }
    );
    
    // Record transaction
    await db.collection('transactions').insertOne({
      from: sourceAccountId,
      to: destAccountId,
      amount: amount,
      timestamp: new Date()
    }, { session });
  });
} finally {
  await session.endSession();
}`}</code>
                    </pre>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-pink-300">
                      Order Processing Transaction
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm">{`// Create order with inventory update
const session = client.startSession();

try {
  await session.withTransaction(async () => {
    // Create order
    const orderResult = await db.collection('orders').insertOne({
      userId: userId,
      items: orderItems,
      total: totalAmount,
      status: 'pending'
    }, { session });
    
    // Update inventory for each item
    for (const item of orderItems) {
      await db.collection('products').updateOne(
        { _id: item.productId, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        { session }
      );
    }
    
    // Update user balance
    await db.collection('users').updateOne(
      { _id: userId, balance: { $gte: totalAmount } },
      { $inc: { balance: -totalAmount } },
      { session }
    );
    
    // Update order status
    await db.collection('orders').updateOne(
      { _id: orderResult.insertedId },
      { $set: { status: 'completed' } },
      { session }
    );
  });
} finally {
  await session.endSession();
}`}</code>
                    </pre>
                  </div>
                </div>
              </section>

              {/* Union and Merge */}
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  5. Union and Merge Operations
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-pink-300">
                      Union Multiple Collections
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm">{`// Combine data from multiple collections
const result = await db.collection('orders')
  .aggregate([
    { $match: { status: 'completed' } },
    { $unionWith: {
        coll: 'refunds',
        pipeline: [
          { $match: { status: 'processed' } },
          { $project: {
              type: 'refund',
              amount: { $multiply: ['$amount', -1] },
              date: '$processedAt'
            }
          }
        ]
      }
    },
    { $group: {
        _id: {
          $dateToString: {
            format: '%Y-%m',
            date: '$date'
          }
        },
        netAmount: { $sum: '$amount' }
      }
    },
    { $sort: { _id: 1 } }
  ])
  .toArray();`}</code>
                    </pre>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-pink-300">
                      Merge Results
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm">{`// Merge aggregation results into collection
await db.collection('orders')
  .aggregate([
    { $match: { status: 'completed' } },
    { $group: {
        _id: {
          $dateToString: {
            format: '%Y-%m-%d',
            date: '$createdAt'
          }
        },
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: '$amount' }
      }
    },
    { $merge: {
        into: 'daily_stats',
        whenMatched: 'replace',
        whenNotMatched: 'insert'
      }
    }
  ])
  .toArray();`}</code>
                    </pre>
                  </div>
                </div>
              </section>

              {/* Performance Optimization */}
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  6. Performance Optimization Queries
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-pink-300">
                      Index Hints
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm">{`// Force specific index
const users = await db.collection('users')
  .find({ status: 'active', email: /@gmail\\.com$/ })
  .hint({ status: 1, email: 1 })
  .toArray();`}</code>
                    </pre>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-pink-300">
                      Explain Query Plan
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm">{`// Analyze query performance
const explain = await db.collection('users')
  .find({ status: 'active', age: { $gte: 18 } })
  .explain('executionStats');

console.log('Execution time:', explain.executionStats.executionTimeMillis);
console.log('Documents examined:', explain.executionStats.totalDocsExamined);
console.log('Index used:', explain.executionStats.executionStages.indexName);`}</code>
                    </pre>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-pink-300">
                      Covered Query
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm">{`// Query using only index (covered query)
// Index: { status: 1, email: 1 }
const users = await db.collection('users')
  .find({ status: 'active' })
  .project({ status: 1, email: 1, _id: 0 })
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
              {/* Graph Lookup */}
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  1. Graph Lookup
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-pink-300">
                      Hierarchical Queries
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm">{`// Find category descendants
const result = await Category.aggregate([
  { $match: { _id: categoryId } },
  { $graphLookup: {
      from: 'categories',
      startWith: '$_id',
      connectFromField: '_id',
      connectToField: 'parentId',
      as: 'descendants'
    }
  }
]);`}</code>
                    </pre>
                  </div>
                </div>
              </section>

              {/* Complex Aggregation */}
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  2. Complex Aggregation
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-pink-300">
                      Sales Analytics
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm">{`// Comprehensive sales analysis
const result = await Order.aggregate([
  { $match: {
      status: 'completed',
      createdAt: { $gte: startDate, $lte: endDate }
    }
  },
  { $unwind: '$items' },
  { $lookup: {
      from: 'products',
      localField: 'items.productId',
      foreignField: '_id',
      as: 'product'
    }
  },
  { $unwind: '$product' },
  { $addFields: {
      lineTotal: {
        $multiply: ['$items.quantity', '$items.price']
      }
    }
  },
  { $group: {
      _id: '$items.productId',
      productName: { $first: '$product.name' },
      totalQuantity: { $sum: '$items.quantity' },
      totalRevenue: { $sum: '$lineTotal' }
    }
  },
  { $sort: { totalRevenue: -1 } },
  { $limit: 20 }
]);`}</code>
                    </pre>
                  </div>
                </div>
              </section>

              {/* Transactions */}
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  3. Transactions
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-pink-300">
                      Multi-Document Transaction
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm">{`// Transfer funds
const session = await mongoose.startSession();

try {
  await session.withTransaction(async () => {
    // Debit
    await Account.updateOne(
      { _id: sourceId, balance: { $gte: amount } },
      { $inc: { balance: -amount } },
      { session }
    );
    
    // Credit
    await Account.updateOne(
      { _id: destId },
      { $inc: { balance: amount } },
      { session }
    );
    
    // Record
    await Transaction.create([{
      from: sourceId,
      to: destId,
      amount: amount
    }], { session });
  });
} finally {
  await session.endSession();
}`}</code>
                    </pre>
                  </div>
                </div>
              </section>

              {/* Window Functions */}
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  4. Window Functions
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-pink-300">
                      Running Totals
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm">{`// Calculate running totals
const result = await Sale.aggregate([
  { $match: { date: { $gte: startDate } } },
  { $sort: { date: 1 } },
  { $setWindowFields: {
      partitionBy: '$region',
      sortBy: { date: 1 },
      output: {
        runningTotal: {
          $sum: '$amount',
          window: {
            documents: ['unboundedPreceding', 'current']
          }
        }
      }
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
