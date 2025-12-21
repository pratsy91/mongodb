"use client";

import Link from "next/link";
import { useState } from "react";

export default function MonitoringBackupPage() {
  const [activeTab, setActiveTab] = useState("monitoring");

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
          Monitoring & Backup
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Operations, monitoring, and disaster recovery
        </p>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 flex-wrap">
          <button
            onClick={() => setActiveTab("monitoring")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "monitoring"
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Monitoring
          </button>
          <button
            onClick={() => setActiveTab("backup")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "backup"
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Backup & Restore
          </button>
          <button
            onClick={() => setActiveTab("tools")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "tools"
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Import/Export
          </button>
        </div>

        <div className="space-y-8">
          {/* Monitoring Tab */}
          {activeTab === "monitoring" && (
            <>
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  📚 Monitoring Theory
                </h2>

                <div className="space-y-4 text-gray-200">
                  <p className="text-lg">
                    <strong>Monitoring</strong> provides visibility into MongoDB
                    performance, health, and resource usage.
                  </p>

                  <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                    Key Metrics
                  </h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong>Operations:</strong> Read/write throughput
                    </li>
                    <li>
                      <strong>Connections:</strong> Active client connections
                    </li>
                    <li>
                      <strong>Memory:</strong> RAM usage, cache hit ratio
                    </li>
                    <li>
                      <strong>Storage:</strong> Disk usage, I/O
                    </li>
                    <li>
                      <strong>Replication:</strong> Lag, oplog status
                    </li>
                    <li>
                      <strong>Query Performance:</strong> Slow queries
                    </li>
                  </ul>

                  <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                    Monitoring Tools
                  </h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong>MongoDB Atlas:</strong> Built-in monitoring
                    </li>
                    <li>
                      <strong>mongotop:</strong> Track collection read/write
                      time
                    </li>
                    <li>
                      <strong>mongostat:</strong> Real-time server statistics
                    </li>
                    <li>
                      <strong>MongoDB Ops Manager:</strong> Enterprise
                      monitoring
                    </li>
                    <li>
                      <strong>Third-party:</strong> Datadog, Prometheus, Grafana
                    </li>
                  </ul>
                </div>
              </section>

              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  Monitoring Examples
                </h2>

                {/* Server Status */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    1. Server Status & Metrics
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== SERVER STATUS =====

db.serverStatus();

// Returns comprehensive server information:
/*
{
  host: "localhost:27017",
  version: "7.0.0",
  process: "mongod",
  pid: 12345,
  uptime: 86400,  // seconds
  uptimeMillis: 86400000,
  uptimeEstimate: 86400,
  localTime: ISODate("..."),
  
  // Connections
  connections: {
    current: 42,
    available: 51158,
    totalCreated: 150
  },
  
  // Network
  network: {
    bytesIn: 1048576000,
    bytesOut: 2097152000,
    numRequests: 50000
  },
  
  // Operations
  opcounters: {
    insert: 10000,
    query: 25000,
    update: 8000,
    delete: 2000,
    getmore: 5000,
    command: 50000
  },
  
  // Memory
  mem: {
    bits: 64,
    resident: 1024,  // MB
    virtual: 2048,
    supported: true
  },
  
  // Storage
  wiredTiger: {
    cache: {
      "bytes currently in the cache": 536870912,
      "maximum bytes configured": 1073741824,
      "bytes read into cache": 10737418240,
      "bytes written from cache": 5368709120,
      "pages evicted by application threads": 1000,
      "pages read into cache": 50000,
      "pages written from cache": 25000
    }
  }
}
*/

// ===== DATABASE STATS =====

db.stats();

// Returns database statistics:
/*
{
  db: "myDatabase",
  collections: 10,
  views: 2,
  objects: 1000000,  // Document count
  avgObjSize: 512,   // Bytes
  dataSize: 512000000,
  storageSize: 600000000,
  indexes: 15,
  indexSize: 100000000,
  totalSize: 700000000,
  scaleFactor: 1,
  fsUsedSize: 50000000000,
  fsTotalSize: 100000000000,
  ok: 1
}
*/

// ===== COLLECTION STATS =====

db.users.stats();

/*
{
  ns: "myDatabase.users",
  size: 50000000,
  count: 100000,
  avgObjSize: 500,
  storageSize: 60000000,
  nindexes: 5,
  totalIndexSize: 10000000,
  indexSizes: {
    "_id_": 2000000,
    "email_1": 2500000,
    "status_1_createdAt_1": 5500000
  }
}
*/

// ===== PROGRAMMATIC MONITORING =====

const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://localhost:27017");
await client.connect();

const adminDb = client.db("admin");

// Get server status
const serverStatus = await adminDb.command({ serverStatus: 1 });

console.log("Connections:", serverStatus.connections);
console.log("Opcounters:", serverStatus.opcounters);
console.log("Memory:", serverStatus.mem);

// Get database stats
const db = client.db("myDatabase");
const dbStats = await db.stats();

console.log("Collections:", dbStats.collections);
console.log("Data size:", dbStats.dataSize);
console.log("Index size:", dbStats.indexSize);

await client.close();`}</code>
                  </pre>
                </div>

                {/* Real-time Monitoring */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    2. Real-time Monitoring Tools
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== MONGOSTAT =====

// Command line tool for real-time server stats
mongostat --port 27017

// Output (every second):
/*
insert query update delete getmore command dirty used flushes vsize  res qrw arw net_in net_out conn
  *0    *0     *0     *0       0     2|0  0.0% 0.0%       0 1.5G 80.0M 0|0 0|0   162b   40.2k    5
  10    50      8      2       5    15|0  0.1% 1.2%       0 1.5G 82.0M 1|0 0|0   5.2k   120.5k    5
*/

// Custom interval (every 5 seconds)
mongostat --port 27017 5

// With authentication
mongostat --uri "mongodb://user:pass@localhost:27017/?authSource=admin"

// ===== MONGOTOP =====

// Track time spent reading/writing per collection
mongotop --port 27017

// Output (every second):
/*
                ns    total    read    write
  myDatabase.users    150ms    100ms    50ms
myDatabase.orders    80ms     60ms     20ms
*/

// Custom interval
mongotop --port 27017 5

// ===== CURRENT OPERATIONS =====

// See what's running now
db.currentOp();

/*
{
  inprog: [
    {
      opid: 12345,
      active: true,
      secs_running: 5,
      op: "query",
      ns: "myDatabase.users",
      command: {
        find: "users",
        filter: { age: { $gt: 25 } }
      },
      numYields: 10,
      locks: {},
      waitingForLock: false,
      lockStats: {}
    }
  ]
}
*/

// Filter operations
db.currentOp({
  "active": true,
  "secs_running": { $gt: 5 }  // Running > 5 seconds
});

// Kill slow operation
db.killOp(12345);

// ===== MONITORING SCRIPT =====

async function monitorServer() {
  const client = new MongoClient(uri);
  await client.connect();
  
  const adminDb = client.db("admin");
  
  setInterval(async () => {
    const status = await adminDb.command({ serverStatus: 1 });
    
    console.log("=== MongoDB Status ===");
    console.log(\`Connections: \${status.connections.current}/\${status.connections.available}\`);
    console.log(\`Operations/sec: \${status.opcounters.query + status.opcounters.insert}\`);
    console.log(\`Memory: \${status.mem.resident}MB resident\`);
    
    // Check for issues
    if (status.connections.current > status.connections.available * 0.8) {
      console.warn("⚠️  High connection usage!");
    }
    
    const cacheUsed = status.wiredTiger.cache["bytes currently in the cache"];
    const cacheMax = status.wiredTiger.cache["maximum bytes configured"];
    const cachePercent = (cacheUsed / cacheMax) * 100;
    
    console.log(\`Cache usage: \${cachePercent.toFixed(2)}%\`);
    
    if (cachePercent > 95) {
      console.warn("⚠️  Cache nearly full!");
    }
  }, 10000);  // Every 10 seconds
}

await monitorServer();`}</code>
                  </pre>
                </div>

                {/* Alerts & Thresholds */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    3. Alerts & Health Checks
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== HEALTH CHECK SCRIPT =====

async function healthCheck() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    
    const adminDb = client.db("admin");
    const status = await adminDb.command({ serverStatus: 1 });
    
    const checks = {
      connectivity: true,
      replication: null,
      diskSpace: null,
      memory: null,
      connections: null,
      slowQueries: null
    };
    
    // Check replication (if replica set)
    try {
      const replStatus = await adminDb.command({ replSetGetStatus: 1 });
      const primary = replStatus.members.find(m => m.state === 1);
      
      if (!primary) {
        checks.replication = "CRITICAL: No primary found";
      } else {
        const maxLag = Math.max(...replStatus.members
          .filter(m => m.state === 2)
          .map(m => (primary.optimeDate - m.optimeDate) / 1000)
        );
        
        checks.replication = maxLag > 10 
          ? \`WARNING: Replication lag \${maxLag}s\`
          : "OK";
      }
    } catch (err) {
      checks.replication = "Not a replica set";
    }
    
    // Check disk space
    const dbStats = await client.db("myDatabase").stats();
    const diskUsagePercent = (dbStats.fsUsedSize / dbStats.fsTotalSize) * 100;
    
    checks.diskSpace = diskUsagePercent > 90
      ? \`CRITICAL: Disk \${diskUsagePercent.toFixed(2)}% full\`
      : diskUsagePercent > 80
      ? \`WARNING: Disk \${diskUsagePercent.toFixed(2)}% full\`
      : "OK";
    
    // Check memory
    const memPercent = (status.mem.resident / (status.mem.virtual || 1)) * 100;
    checks.memory = memPercent > 90
      ? \`WARNING: Memory \${memPercent.toFixed(2)}% used\`
      : "OK";
    
    // Check connections
    const connPercent = (status.connections.current / status.connections.available) * 100;
    checks.connections = connPercent > 80
      ? \`WARNING: Connections \${connPercent.toFixed(2)}% used\`
      : "OK";
    
    // Check for slow queries
    const profiling = await client.db("myDatabase").collection("system.profile");
    const slowCount = await profiling.countDocuments({
      millis: { $gt: 100 },
      ts: { $gte: new Date(Date.now() - 60000) }  // Last minute
    });
    
    checks.slowQueries = slowCount > 10
      ? \`WARNING: \${slowCount} slow queries in last minute\`
      : "OK";
    
    console.log("=== Health Check ===");
    Object.entries(checks).forEach(([check, status]) => {
      const icon = status.includes("CRITICAL") ? "🔴"
        : status.includes("WARNING") ? "⚠️"
        : "✓";
      console.log(\`\${icon} \${check}: \${status}\`);
    });
    
    return checks;
    
  } catch (error) {
    console.error("❌ Connectivity check failed:", error.message);
    return { connectivity: false };
  } finally {
    await client.close();
  }
}

// Run health check
await healthCheck();

// Schedule regular health checks
setInterval(healthCheck, 60000);  // Every minute`}</code>
                  </pre>
                </div>
              </section>
            </>
          )}

          {/* Backup Tab */}
          {activeTab === "backup" && (
            <>
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  📚 Backup & Restore Theory
                </h2>

                <div className="space-y-4 text-gray-200">
                  <p className="text-lg">
                    <strong>Backup</strong> protects against data loss,
                    corruption, and disasters.
                  </p>

                  <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                    Backup Methods
                  </h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong>mongodump:</strong> Logical backup (BSON export)
                    </li>
                    <li>
                      <strong>File System Snapshot:</strong> Copy data directory
                    </li>
                    <li>
                      <strong>Cloud Provider:</strong> Atlas automated backups
                    </li>
                    <li>
                      <strong>Ops Manager:</strong> Enterprise backup solution
                    </li>
                  </ul>

                  <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                    Backup Strategies
                  </h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong>Full Backup:</strong> Complete database copy
                    </li>
                    <li>
                      <strong>Incremental:</strong> Only changes since last
                      backup
                    </li>
                    <li>
                      <strong>Point-in-Time:</strong> Restore to specific moment
                    </li>
                    <li>
                      <strong>Continuous:</strong> Real-time replication
                    </li>
                  </ul>
                </div>
              </section>

              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  Backup & Restore Examples
                </h2>

                {/* mongodump */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    1. mongodump (Logical Backup)
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== BASIC MONGODUMP =====

// Backup entire server
mongodump --uri="mongodb://localhost:27017"

// Output to specific directory
mongodump --uri="mongodb://localhost:27017" \\
  --out=/backup/mongodb/2024-01-01

// ===== BACKUP SPECIFIC DATABASE =====

mongodump --uri="mongodb://localhost:27017" \\
  --db=myDatabase \\
  --out=/backup/mongodb/myDatabase

// ===== BACKUP SPECIFIC COLLECTION =====

mongodump --uri="mongodb://localhost:27017" \\
  --db=myDatabase \\
  --collection=users \\
  --out=/backup/users

// ===== WITH AUTHENTICATION =====

mongodump --uri="mongodb://user:password@localhost:27017/?authSource=admin" \\
  --out=/backup/mongodb

// ===== BACKUP WITH QUERY =====

// Only backup specific documents
mongodump --uri="mongodb://localhost:27017" \\
  --db=myDatabase \\
  --collection=orders \\
  --query='{"status":"completed","date":{"$gte":{"$date":"2024-01-01T00:00:00Z"}}}' \\
  --out=/backup/completed-orders

// ===== COMPRESSED BACKUP =====

mongodump --uri="mongodb://localhost:27017" \\
  --gzip \\
  --out=/backup/mongodb-compressed

// ===== ARCHIVE FORMAT =====

// Single file backup
mongodump --uri="mongodb://localhost:27017" \\
  --archive=/backup/mongodb-backup.archive \\
  --gzip

// To stdout (pipe to another command)
mongodump --uri="mongodb://localhost:27017" \\
  --archive \\
  --gzip | aws s3 cp - s3://my-bucket/backup.archive.gz

// ===== REPLICA SET BACKUP =====

// Backup from secondary (recommended)
mongodump --uri="mongodb://secondary-host:27017" \\
  --readPreference=secondary \\
  --out=/backup/mongodb

// ===== BACKUP SCRIPT =====

#!/bin/bash

# Backup script with rotation
DATE=$(date +%Y-%m-%d)
BACKUP_DIR="/backup/mongodb"
RETENTION_DAYS=7

# Create backup
mongodump \\
  --uri="mongodb://localhost:27017" \\
  --gzip \\
  --out="\${BACKUP_DIR}/\${DATE}"

# Remove old backups
find "\${BACKUP_DIR}" -type d -mtime +\${RETENTION_DAYS} -exec rm -rf {} +

echo "Backup completed: \${DATE}"`}</code>
                  </pre>
                </div>

                {/* mongorestore */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    2. mongorestore (Restore from Backup)
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== BASIC RESTORE =====

// Restore entire backup
mongorestore --uri="mongodb://localhost:27017" \\
  /backup/mongodb/2024-01-01

// ===== RESTORE SPECIFIC DATABASE =====

mongorestore --uri="mongodb://localhost:27017" \\
  --db=myDatabase \\
  /backup/mongodb/2024-01-01/myDatabase

// ===== RESTORE SPECIFIC COLLECTION =====

mongorestore --uri="mongodb://localhost:27017" \\
  --db=myDatabase \\
  --collection=users \\
  /backup/mongodb/2024-01-01/myDatabase/users.bson

// ===== RESTORE WITH DROP =====

// Drop existing collections before restore
mongorestore --uri="mongodb://localhost:27017" \\
  --drop \\
  /backup/mongodb/2024-01-01

// ===== RESTORE FROM ARCHIVE =====

// From archive file
mongorestore --uri="mongodb://localhost:27017" \\
  --archive=/backup/mongodb-backup.archive \\
  --gzip

// From stdin (S3 example)
aws s3 cp s3://my-bucket/backup.archive.gz - | \\
  mongorestore --uri="mongodb://localhost:27017" \\
  --archive \\
  --gzip

// ===== RESTORE TO DIFFERENT DATABASE =====

mongorestore --uri="mongodb://localhost:27017" \\
  --db=myDatabase_restored \\
  /backup/mongodb/2024-01-01/myDatabase

// ===== RESTORE SPECIFIC NAMESPACE =====

// Restore to different collection
mongorestore --uri="mongodb://localhost:27017" \\
  --nsInclude="myDatabase.users" \\
  --nsFrom="myDatabase.users" \\
  --nsTo="myDatabase.users_backup" \\
  /backup/mongodb/2024-01-01

// ===== OPLOG REPLAY (POINT-IN-TIME RESTORE) =====

// 1. Take initial backup
mongodump --uri="mongodb://localhost:27017" \\
  --oplog \\
  --out=/backup/initial

// 2. Save oplog continuously
mongodump --uri="mongodb://localhost:27017" \\
  --db=local \\
  --collection=oplog.rs \\
  --query='{"ts":{"$gte":{"$timestamp":{"t":1640000000,"i":1}}}}' \\
  --out=/backup/oplog

// 3. Restore to point in time
mongorestore --uri="mongodb://localhost:27017" \\
  /backup/initial

mongorestore --uri="mongodb://localhost:27017" \\
  --oplogReplay \\
  --oplogLimit="1640005000:1" \\
  /backup/oplog/local/oplog.rs.bson`}</code>
                  </pre>
                </div>

                {/* Filesystem Backup */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    3. Filesystem Snapshot Backup
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== FILESYSTEM SNAPSHOT =====

// Advantages:
// - Faster than mongodump for large databases
// - Exact point-in-time copy
// - Includes indexes

// Disadvantages:
// - Requires filesystem snapshot support
// - Database must be in consistent state

// ===== BACKUP PROCESS =====

// 1. Lock database (prevent writes)
use admin
db.fsyncLock();

// 2. Create filesystem snapshot
// (Linux LVM example)
lvcreate --size 10G --snapshot --name mongodb-snapshot /dev/vg0/mongodb

// 3. Unlock database
db.fsyncUnlock();

// 4. Mount snapshot and copy data
mount /dev/vg0/mongodb-snapshot /mnt/snapshot
cp -r /mnt/snapshot/* /backup/mongodb-snapshot/
umount /mnt/snapshot
lvremove -f /dev/vg0/mongodb-snapshot

// ===== RESTORE FROM SNAPSHOT =====

// 1. Stop MongoDB
systemctl stop mongod

// 2. Restore data directory
rm -rf /data/db/*
cp -r /backup/mongodb-snapshot/* /data/db/

// 3. Fix permissions
chown -R mongodb:mongodb /data/db

// 4. Start MongoDB
systemctl start mongod

// ===== CLOUD SNAPSHOT (AWS EBS) =====

// Automated via AWS CLI or Ops Manager

// Create snapshot
aws ec2 create-snapshot \\
  --volume-id vol-1234567890abcdef0 \\
  --description "MongoDB backup 2024-01-01"

// Restore from snapshot
aws ec2 create-volume \\
  --snapshot-id snap-1234567890abcdef0 \\
  --availability-zone us-east-1a`}</code>
                  </pre>
                </div>
              </section>
            </>
          )}

          {/* Tools Tab */}
          {activeTab === "tools" && (
            <>
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  Import/Export Tools
                </h2>

                {/* mongoexport */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    1. mongoexport (JSON/CSV Export)
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== EXPORT TO JSON =====

// Export collection to JSON
mongoexport --uri="mongodb://localhost:27017" \\
  --db=myDatabase \\
  --collection=users \\
  --out=users.json

// ===== EXPORT TO CSV =====

// Export to CSV with specific fields
mongoexport --uri="mongodb://localhost:27017" \\
  --db=myDatabase \\
  --collection=users \\
  --type=csv \\
  --fields=name,email,age \\
  --out=users.csv

// ===== WITH QUERY =====

// Export only specific documents
mongoexport --uri="mongodb://localhost:27017" \\
  --db=myDatabase \\
  --collection=users \\
  --query='{"status":"active","age":{"$gte":18}}' \\
  --out=active-users.json

// ===== PRETTY PRINT =====

mongoexport --uri="mongodb://localhost:27017" \\
  --db=myDatabase \\
  --collection=users \\
  --pretty \\
  --out=users-pretty.json

// ===== SORT & LIMIT =====

mongoexport --uri="mongodb://localhost:27017" \\
  --db=myDatabase \\
  --collection=orders \\
  --sort='{"total":-1}' \\
  --limit=1000 \\
  --out=top-orders.json

// ===== WITH AUTHENTICATION =====

mongoexport --uri="mongodb://user:password@localhost:27017/?authSource=admin" \\
  --db=myDatabase \\
  --collection=users \\
  --out=users.json`}</code>
                  </pre>
                </div>

                {/* mongoimport */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    2. mongoimport (JSON/CSV Import)
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== IMPORT FROM JSON =====

// Import JSON file
mongoimport --uri="mongodb://localhost:27017" \\
  --db=myDatabase \\
  --collection=users \\
  --file=users.json

// ===== IMPORT FROM CSV =====

// Import CSV with header row
mongoimport --uri="mongodb://localhost:27017" \\
  --db=myDatabase \\
  --collection=users \\
  --type=csv \\
  --headerline \\
  --file=users.csv

// Specify field names
mongoimport --uri="mongodb://localhost:27017" \\
  --db=myDatabase \\
  --collection=users \\
  --type=csv \\
  --fields=name,email,age \\
  --file=users.csv

// ===== IMPORT MODES =====

// Insert only (default, fail on duplicates)
mongoimport --uri="mongodb://localhost:27017" \\
  --db=myDatabase \\
  --collection=users \\
  --file=users.json

// Upsert (insert or update)
mongoimport --uri="mongodb://localhost:27017" \\
  --db=myDatabase \\
  --collection=users \\
  --mode=upsert \\
  --upsertFields=email \\
  --file=users.json

// Merge (update existing fields only)
mongoimport --uri="mongodb://localhost:27017" \\
  --db=myDatabase \\
  --collection=users \\
  --mode=merge \\
  --file=users.json

// Delete matching documents then insert
mongoimport --uri="mongodb://localhost:27017" \\
  --db=myDatabase \\
  --collection=users \\
  --mode=delete \\
  --file=users.json

// ===== DROP COLLECTION FIRST =====

mongoimport --uri="mongodb://localhost:27017" \\
  --db=myDatabase \\
  --collection=users \\
  --drop \\
  --file=users.json

// ===== JSON ARRAY =====

// Import array of documents
mongoimport --uri="mongodb://localhost:27017" \\
  --db=myDatabase \\
  --collection=users \\
  --jsonArray \\
  --file=users-array.json

// ===== IMPORT WITH TRANSFORMATIONS =====

// Use --fieldFile for complex mappings
# fields.txt:
# name,email,age
# fullName,emailAddress,userAge

mongoimport --uri="mongodb://localhost:27017" \\
  --db=myDatabase \\
  --collection=users \\
  --type=csv \\
  --fieldFile=fields.txt \\
  --file=users.csv`}</code>
                  </pre>
                </div>

                {/* Data Migration */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    3. Data Migration Patterns
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== MIGRATE BETWEEN CLUSTERS =====

// Export from source
mongoexport --uri="mongodb://source-host:27017" \\
  --db=myDatabase \\
  --collection=users \\
  --out=users.json

// Import to destination
mongoimport --uri="mongodb://dest-host:27017" \\
  --db=myDatabase \\
  --collection=users \\
  --file=users.json

// ===== BULK DATA MIGRATION =====

// Script to migrate all collections
#!/bin/bash

SOURCE_URI="mongodb://source:27017"
DEST_URI="mongodb://dest:27017"
DATABASE="myDatabase"

# Get all collections
collections=$(mongosh "\${SOURCE_URI}" --quiet --eval \\
  "db.getSiblingDB('\${DATABASE}').getCollectionNames().join(' ')")

# Export and import each collection
for collection in \${collections}; do
  echo "Migrating \${collection}..."
  
  mongoexport --uri="\${SOURCE_URI}" \\
    --db="\${DATABASE}" \\
    --collection="\${collection}" \\
    --out="\${collection}.json"
  
  mongoimport --uri="\${DEST_URI}" \\
    --db="\${DATABASE}" \\
    --collection="\${collection}" \\
    --file="\${collection}.json"
  
  rm "\${collection}.json"
done

// ===== INCREMENTAL SYNC =====

// Sync only new/updated documents
const { MongoClient } = require("mongodb");

async function incrementalSync(lastSyncTime) {
  const sourceClient = new MongoClient(sourceUri);
  const destClient = new MongoClient(destUri);
  
  await sourceClient.connect();
  await destClient.connect();
  
  const sourceDb = sourceClient.db("myDatabase");
  const destDb = destClient.db("myDatabase");
  
  // Find documents modified since last sync
  const cursor = sourceDb.collection("users").find({
    updatedAt: { $gt: lastSyncTime }
  });
  
  // Bulk upsert to destination
  const operations = [];
  
  for await (const doc of cursor) {
    operations.push({
      replaceOne: {
        filter: { _id: doc._id },
        replacement: doc,
        upsert: true
      }
    });
    
    // Batch size
    if (operations.length >= 1000) {
      await destDb.collection("users").bulkWrite(operations);
      operations.length = 0;
    }
  }
  
  // Final batch
  if (operations.length > 0) {
    await destDb.collection("users").bulkWrite(operations);
  }
  
  await sourceClient.close();
  await destClient.close();
}

// Run sync
await incrementalSync(new Date("2024-01-01"));

// ===== CSV TO MONGODB =====

// Process and import CSV
const fs = require("fs");
const csv = require("csv-parser");

async function importCSV(filepath) {
  const client = new MongoClient(uri);
  await client.connect();
  
  const collection = client.db("myDatabase").collection("users");
  const documents = [];
  
  fs.createReadStream(filepath)
    .pipe(csv())
    .on("data", (row) => {
      // Transform data
      documents.push({
        name: row.name,
        email: row.email.toLowerCase(),
        age: parseInt(row.age),
        createdAt: new Date()
      });
      
      // Batch insert
      if (documents.length >= 1000) {
        await collection.insertMany(documents);
        documents.length = 0;
      }
    })
    .on("end", async () => {
      if (documents.length > 0) {
        await collection.insertMany(documents);
      }
      console.log("Import completed");
      await client.close();
    });
}`}</code>
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
                  <strong>Monitor continuously:</strong> Set up alerts for
                  critical metrics
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Automated backups:</strong> Schedule daily backups
                  with rotation
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Test restores:</strong> Regularly verify backup
                  integrity
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Backup from secondary:</strong> Reduce impact on
                  primary
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Off-site backups:</strong> Store backups in different
                  location
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Retention policy:</strong> Keep multiple backup
                  versions
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Document procedures:</strong> Maintain backup/restore
                  runbook
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Monitor disk space:</strong> Ensure adequate space for
                  backups
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Use compression:</strong> Reduce backup size and
                  transfer time
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Automate monitoring:</strong> Use scripts and
                  third-party tools
                </span>
              </li>
            </ul>
          </section>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8">
            <Link
              href="/phase11/schema-patterns"
              className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              ← Previous: Schema Design Patterns
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
