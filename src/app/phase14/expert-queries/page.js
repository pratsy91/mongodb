"use client";

import Link from "next/link";
import { useState } from "react";

export default function ExpertQueriesPage() {
  const [activeTab, setActiveTab] = useState("mongodb");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <Link
          href="/"
          className="text-indigo-400 hover:text-indigo-300 mb-6 inline-block"
        >
          ← Back to Home
        </Link>

        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Expert Queries
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Most complex queries: Multi-collection analytics, recursive
          operations, advanced data transformations, and production-ready
          patterns
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
              {/* Complex E-commerce Analytics */}
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-indigo-300">
                  1. E-commerce Analytics Dashboard
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-purple-300">
                      Complete Sales Dashboard
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto text-xs">
                      <code>{`// Comprehensive e-commerce analytics
const dashboard = await db.collection('orders')
  .aggregate([
    // Filter and date range
    {
      $match: {
        status: 'completed',
        createdAt: { $gte: startDate, $lte: endDate }
      }
    },
    // Unwind items
    { $unwind: '$items' },
    // Join products
    {
      $lookup: {
        from: 'products',
        localField: 'items.productId',
        foreignField: '_id',
        as: 'product'
      }
    },
    { $unwind: '$product' },
    // Join categories
    {
      $lookup: {
        from: 'categories',
        localField: 'product.categoryId',
        foreignField: '_id',
        as: 'category'
      }
    },
    { $unwind: '$category' },
    // Join users
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user'
      }
    },
    { $unwind: '$user' },
    // Calculate metrics
    {
      $addFields: {
        lineTotal: {
          $multiply: ['$items.quantity', '$items.price']
        },
        lineCost: {
          $multiply: ['$items.quantity', '$product.cost']
        },
        lineProfit: {
          $subtract: [
            { $multiply: ['$items.quantity', '$items.price'] },
            { $multiply: ['$items.quantity', '$product.cost'] }
          ]
        },
        discountAmount: {
          $multiply: [
            '$lineTotal',
            { $divide: ['$discount', 100] }
          ]
        }
      }
    },
    // Group by multiple dimensions
    {
      $group: {
        _id: {
          date: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$createdAt'
            }
          },
          category: '$category.name',
          region: '$user.address.region'
        },
        totalOrders: { $sum: 1 },
        totalQuantity: { $sum: '$items.quantity' },
        totalRevenue: { $sum: '$lineTotal' },
        totalCost: { $sum: '$lineCost' },
        totalProfit: { $sum: '$lineProfit' },
        totalDiscount: { $sum: '$discountAmount' },
        uniqueProducts: { $addToSet: '$items.productId' },
        uniqueCustomers: { $addToSet: '$userId' },
        avgOrderValue: { $avg: '$lineTotal' }
      }
    },
    // Calculate derived metrics
    {
      $addFields: {
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
        },
        netRevenue: {
          $subtract: ['$totalRevenue', '$totalDiscount']
        },
        productCount: { $size: '$uniqueProducts' },
        customerCount: { $size: '$uniqueCustomers' }
      }
    },
    // Sort
    {
      $sort: {
        '_id.date': 1,
        totalRevenue: -1
      }
    }
  ])
  .toArray();`}</code>
                    </pre>
                  </div>
                </div>
              </section>

              {/* Recursive Graph Operations */}
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-indigo-300">
                  2. Complex Recursive Graph Operations
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-purple-300">
                      Multi-Level Organization Chart
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto text-xs">
                      <code>{`// Build complete organization hierarchy
const orgChart = await db.collection('employees')
  .aggregate([
    { $match: { _id: rootEmployeeId } },
    // Get all subordinates recursively
    {
      $graphLookup: {
        from: 'employees',
        startWith: '$_id',
        connectFromField: '_id',
        connectToField: 'managerId',
        as: 'subordinates',
        maxDepth: 10,
        depthField: 'level'
      }
    },
    // Get manager chain
    {
      $graphLookup: {
        from: 'employees',
        startWith: '$managerId',
        connectFromField: 'managerId',
        connectToField: '_id',
        as: 'managers',
        maxDepth: 10
      }
    },
    // Join departments
    {
      $lookup: {
        from: 'departments',
        localField: 'departmentId',
        foreignField: '_id',
        as: 'department'
      }
    },
    { $unwind: { path: '$department', preserveNullAndEmptyArrays: true } },
    // Calculate team statistics
    {
      $addFields: {
        teamSize: { $size: '$subordinates' },
        totalTeamBudget: {
          $sum: '$subordinates.salary'
        },
        avgTeamSalary: {
          $avg: '$subordinates.salary'
        }
      }
    },
    // Structure hierarchy
    {
      $project: {
        employee: {
          name: '$name',
          title: '$title',
          level: 0,
          department: '$department.name'
        },
        managers: {
          $map: {
            input: '$managers',
            as: 'mgr',
            in: {
              name: '$$mgr.name',
              title: '$$mgr.title',
              level: { $subtract: [0, { $indexOfArray: ['$managers._id', '$$mgr._id'] }] }
            }
          }
        },
        subordinates: {
          $map: {
            input: '$subordinates',
            as: 'sub',
            in: {
              name: '$$sub.name',
              title: '$$sub.title',
              level: '$$sub.level',
              department: '$$sub.departmentId'
            }
          }
        },
        statistics: {
          teamSize: '$teamSize',
          totalBudget: '$totalTeamBudget',
          avgSalary: '$avgTeamSalary'
        }
      }
    }
  ])
  .toArray();`}</code>
                    </pre>
                  </div>
                </div>
              </section>

              {/* Time Series Analysis */}
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-indigo-300">
                  3. Advanced Time Series Analysis
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-purple-300">
                      Complex Time Series with Moving Averages
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto text-xs">
                      <code>{`// Time series with multiple calculations
const timeSeries = await db.collection('metrics')
  .aggregate([
    { $match: { timestamp: { $gte: startDate, $lte: endDate } } },
    { $sort: { timestamp: 1 } },
    // Window functions for moving averages
    {
      $setWindowFields: {
        partitionBy: '$metricType',
        sortBy: { timestamp: 1 },
        output: {
          // 7-day moving average
          movingAvg7d: {
            $avg: '$value',
            window: {
              range: [-6, 0],
              unit: 'day'
            }
          },
          // 30-day moving average
          movingAvg30d: {
            $avg: '$value',
            window: {
              range: [-29, 0],
              unit: 'day'
            }
          },
          // Running total
          runningTotal: {
            $sum: '$value',
            window: {
              documents: ['unboundedPreceding', 'current']
            }
          },
          // Previous value
          previousValue: {
            $shift: {
              output: '$value',
              by: -1,
              default: null
            }
          },
          // Percent change
          percentChange: {
            $cond: {
              if: { $ne: [{ $shift: { output: '$value', by: -1 } }, null] },
              then: {
                $multiply: [
                  {
                    $divide: [
                      { $subtract: ['$value', { $shift: { output: '$value', by: -1 } }] },
                      { $shift: { output: '$value', by: -1 } }
                    ]
                  },
                  100
                ]
              },
              else: null
            }
          },
          // Rank
          rank: {
            $denseRank: {}
          }
        }
      }
    },
    // Group by time periods
    {
      $group: {
        _id: {
          metricType: '$metricType',
          period: {
            $dateToString: {
              format: '%Y-%m',
              date: '$timestamp'
            }
          }
        },
        avgValue: { $avg: '$value' },
        maxValue: { $max: '$value' },
        minValue: { $min: '$value' },
        avgMovingAvg7d: { $avg: '$movingAvg7d' },
        avgMovingAvg30d: { $avg: '$movingAvg30d' },
        dataPoints: { $sum: 1 }
      }
    },
    { $sort: { '_id.period': 1, '_id.metricType': 1 } }
  ])
  .toArray();`}</code>
                    </pre>
                  </div>
                </div>
              </section>

              {/* Multi-Collection Correlation */}
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-indigo-300">
                  4. Multi-Collection Correlation Analysis
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-purple-300">
                      Cross-Collection Analytics
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto text-xs">
                      <code>{`// Correlate user behavior with purchases
const correlation = await db.collection('user_sessions')
  .aggregate([
    { $match: { timestamp: { $gte: startDate } } },
    // Join with page views
    {
      $lookup: {
        from: 'page_views',
        let: { sessionId: '$_id', userId: '$userId' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$sessionId', '$$sessionId'] },
                  { $eq: ['$userId', '$$userId'] }
                ]
              }
            }
          }
        ],
        as: 'pageViews'
      }
    },
    // Join with purchases
    {
      $lookup: {
        from: 'orders',
        let: { userId: '$userId', sessionStart: '$startTime', sessionEnd: '$endTime' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$userId', '$$userId'] },
                  { $gte: ['$createdAt', '$$sessionStart'] },
                  { $lte: ['$createdAt', '$$sessionEnd'] }
                ]
              }
            }
          }
        ],
        as: 'purchases'
      }
    },
    // Calculate metrics
    {
      $addFields: {
        pageViewCount: { $size: '$pageViews' },
        purchaseCount: { $size: '$purchases' },
        totalPurchaseValue: {
          $sum: '$purchases.total'
        },
        sessionDuration: {
          $subtract: ['$endTime', '$startTime']
        },
        conversionRate: {
          $cond: {
            if: { $gt: [{ $size: '$pageViews' }, 0] },
            then: {
              $multiply: [
                {
                  $divide: [
                    { $size: '$purchases' },
                    { $size: '$pageViews' }
                  ]
                },
                100
              ]
            },
            else: 0
          }
        }
      }
    },
    // Group by user segments
    {
      $group: {
        _id: {
          deviceType: '$deviceType',
          trafficSource: '$trafficSource',
          userSegment: {
            $cond: {
              if: { $gt: ['$totalPurchaseValue', 1000] },
              then: 'high_value',
              else: {
                $cond: {
                  if: { $gt: ['$totalPurchaseValue', 100] },
                  then: 'medium_value',
                  else: 'low_value'
                }
              }
            }
          }
        },
        sessionCount: { $sum: 1 },
        avgPageViews: { $avg: '$pageViewCount' },
        avgPurchaseValue: { $avg: '$totalPurchaseValue' },
        totalRevenue: { $sum: '$totalPurchaseValue' },
        conversionRate: { $avg: '$conversionRate' },
        avgSessionDuration: { $avg: '$sessionDuration' }
      }
    },
    { $sort: { totalRevenue: -1 } }
  ])
  .toArray();`}</code>
                    </pre>
                  </div>
                </div>
              </section>

              {/* Advanced Data Transformation */}
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-indigo-300">
                  5. Advanced Data Transformation
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-purple-300">
                      Complex Pivot and Reshape
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto text-xs">
                      <code>{`// Pivot data from rows to columns
const pivot = await db.collection('sales_data')
  .aggregate([
    { $match: { date: { $gte: startDate } } },
    // Group by product and month
    {
      $group: {
        _id: {
          productId: '$productId',
          month: {
            $dateToString: {
              format: '%Y-%m',
              date: '$date'
            }
          }
        },
        totalSales: { $sum: '$amount' },
        totalQuantity: { $sum: '$quantity' }
      }
    },
    // Group by product to collect months
    {
      $group: {
        _id: '$_id.productId',
        months: {
          $push: {
            month: '$_id.month',
            sales: '$totalSales',
            quantity: '$totalQuantity'
          }
        }
      }
    },
    // Reshape to pivot format
    {
      $project: {
        productId: '$_id',
        jan: {
          $let: {
            vars: {
              janData: {
                $arrayElemAt: [
                  {
                    $filter: {
                      input: '$months',
                      as: 'm',
                      cond: { $eq: ['$$m.month', '2024-01'] }
                    }
                  },
                  0
                ]
              }
            },
            in: '$$janData.sales'
          }
        },
        feb: {
          $let: {
            vars: {
              febData: {
                $arrayElemAt: [
                  {
                    $filter: {
                      input: '$months',
                      as: 'm',
                      cond: { $eq: ['$$m.month', '2024-02'] }
                    }
                  },
                  0
                ]
              }
            },
            in: '$$febData.sales'
          }
        }
        // ... continue for all months
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
              {/* Complex E-commerce Analytics */}
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  1. E-commerce Analytics
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-pink-300">
                      Sales Dashboard
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto text-xs">
                      <code>{`// Comprehensive analytics
const dashboard = await Order.aggregate([
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
  { $lookup: {
      from: 'categories',
      localField: 'product.categoryId',
      foreignField: '_id',
      as: 'category'
    }
  },
  { $unwind: '$category' },
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
  { $group: {
      _id: {
        date: {
          $dateToString: {
            format: '%Y-%m-%d',
            date: '$createdAt'
          }
        },
        category: '$category.name'
      },
      totalRevenue: { $sum: '$lineTotal' },
      totalProfit: { $sum: '$lineProfit' },
      totalQuantity: { $sum: '$items.quantity' }
    }
  },
  { $addFields: {
      profitMargin: {
        $multiply: [
          { $divide: ['$totalProfit', '$totalRevenue'] },
          100
        ]
      }
    }
  },
  { $sort: { '_id.date': 1, totalRevenue: -1 } }
]);`}</code>
                    </pre>
                  </div>
                </div>
              </section>

              {/* Graph Lookup */}
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  2. Recursive Graph Operations
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-pink-300">
                      Organization Chart
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto text-xs">
                      <code>{`// Build hierarchy
const orgChart = await Employee.aggregate([
  { $match: { _id: rootId } },
  { $graphLookup: {
      from: 'employees',
      startWith: '$_id',
      connectFromField: '_id',
      connectToField: 'managerId',
      as: 'subordinates',
      maxDepth: 10
    }
  },
  { $lookup: {
      from: 'departments',
      localField: 'departmentId',
      foreignField: '_id',
      as: 'department'
    }
  },
  { $unwind: '$department' },
  { $addFields: {
      teamSize: { $size: '$subordinates' }
    }
  }
]);`}</code>
                    </pre>
                  </div>
                </div>
              </section>

              {/* Time Series */}
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  3. Time Series Analysis
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-pink-300">
                      Moving Averages
                    </h3>
                    <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto text-xs">
                      <code>{`// Time series with windows
const timeSeries = await Metric.aggregate([
  { $match: { timestamp: { $gte: startDate } } },
  { $sort: { timestamp: 1 } },
  { $setWindowFields: {
      partitionBy: '$metricType',
      sortBy: { timestamp: 1 },
      output: {
        movingAvg7d: {
          $avg: '$value',
          window: { range: [-6, 0], unit: 'day' }
        },
        runningTotal: {
          $sum: '$value',
          window: {
            documents: ['unboundedPreceding', 'current']
          }
        }
      }
    }
  },
  { $group: {
      _id: {
        metricType: '$metricType',
        period: {
          $dateToString: {
            format: '%Y-%m',
            date: '$timestamp'
          }
        }
      },
      avgValue: { $avg: '$value' },
      avgMovingAvg: { $avg: '$movingAvg7d' }
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
