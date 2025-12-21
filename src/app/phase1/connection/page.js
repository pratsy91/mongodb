"use client";

import Link from "next/link";
import { useState } from "react";

export default function ConnectionPage() {
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

        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          Connection & Configuration
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Complete guide to MongoDB connections with all options and parameters
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
            <h2 className="text-3xl font-bold mb-6 text-cyan-300">📚 Theory</h2>

            <div className="space-y-4 text-gray-200">
              <p className="text-lg">
                MongoDB connections are established using connection strings
                (URIs) and various configuration options. Understanding
                connection parameters is crucial for production deployments.
              </p>

              <h3 className="text-2xl font-semibold text-blue-300 mt-6">
                Connection String Format
              </h3>
              <div className="bg-black/30 p-4 rounded-lg font-mono text-sm">
                mongodb://[username:password@]host[:port][/database][?options]
                <br />
                mongodb+srv://[username:password@]host[/database][?options]
              </div>

              <h3 className="text-2xl font-semibold text-blue-300 mt-6">
                Connection Components
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Protocol:</strong> mongodb:// or mongodb+srv:// (for
                  DNS SRV records)
                </li>
                <li>
                  <strong>Credentials:</strong> username and password (URL
                  encoded)
                </li>
                <li>
                  <strong>Host:</strong> Server hostname or IP address
                </li>
                <li>
                  <strong>Port:</strong> Default is 27017 for mongodb://
                </li>
                <li>
                  <strong>Database:</strong> Default database for authentication
                </li>
                <li>
                  <strong>Options:</strong> Query parameters for configuration
                </li>
              </ul>
            </div>
          </section>

          {/* MongoDB Native Driver Examples */}
          {activeTab === "mongodb" && (
            <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
              <h2 className="text-3xl font-bold mb-6 text-blue-300">
                MongoDB Native Driver Examples
              </h2>

              {/* Basic Connection */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  1. Basic Connection
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient } = require('mongodb');

// Simple connection
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

async function connect() {
  try {
    await client.connect();
    console.log('Connected successfully to MongoDB');
    
    // Use the connection
    const db = client.db('myDatabase');
    
    // Perform operations...
    
  } catch (error) {
    console.error('Connection failed:', error);
  } finally {
    await client.close();
  }
}

connect();`}</code>
                </pre>
              </div>

              {/* Connection with Authentication */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  2. Connection with Authentication
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient } = require('mongodb');

// URL-encoded credentials
const username = encodeURIComponent('myUser');
const password = encodeURIComponent('myP@ssw0rd!');
const uri = \`mongodb://\${username}:\${password}@localhost:27017/admin\`;

const client = new MongoClient(uri);

// Alternative: Separate auth options
const client2 = new MongoClient('mongodb://localhost:27017', {
  auth: {
    username: 'myUser',
    password: 'myP@ssw0rd!'
  },
  authSource: 'admin', // Database to authenticate against
  authMechanism: 'SCRAM-SHA-256' // Default mechanism
});`}</code>
                </pre>
              </div>

              {/* All Connection Options */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  3. All Connection Options (Comprehensive)
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient, ReadPreference } = require('mongodb');

const client = new MongoClient('mongodb://localhost:27017', {
  
  // ===== AUTHENTICATION OPTIONS =====
  auth: {
    username: 'myUser',
    password: 'myPassword'
  },
  authSource: 'admin',              // Database to authenticate against
  authMechanism: 'SCRAM-SHA-256',    // SCRAM-SHA-1, SCRAM-SHA-256, MONGODB-X509, 
                                     // GSSAPI (Kerberos), PLAIN, MONGODB-AWS
  
  // ===== CONNECTION POOL OPTIONS =====
  minPoolSize: 10,                   // Minimum number of connections (default: 0)
  maxPoolSize: 100,                  // Maximum number of connections (default: 100)
  maxIdleTimeMS: 60000,              // Max time a connection can be idle (default: 0 - no limit)
  waitQueueTimeoutMS: 5000,          // Time to wait for available connection
  
  // ===== SERVER SELECTION OPTIONS =====
  serverSelectionTimeoutMS: 30000,   // Time to wait for server selection (default: 30000)
  heartbeatFrequencyMS: 10000,       // Frequency of heartbeat checks (default: 10000)
  localThresholdMS: 15,              // Latency window for server selection (default: 15)
  
  // ===== CONNECTION TIMEOUT OPTIONS =====
  connectTimeoutMS: 30000,           // Time to wait for initial connection (default: 30000)
  socketTimeoutMS: 0,                // Time to wait for socket operations (default: 0 - no timeout)
  
  // ===== TLS/SSL OPTIONS =====
  tls: true,                         // Enable TLS/SSL (alias: ssl)
  tlsAllowInvalidCertificates: false, // Allow invalid certificates
  tlsAllowInvalidHostnames: false,   // Allow invalid hostnames
  tlsCAFile: '/path/to/ca.pem',      // Path to CA certificate
  tlsCertificateKeyFile: '/path/to/client.pem', // Path to client certificate
  tlsCertificateKeyFilePassword: 'password',    // Certificate password
  tlsInsecure: false,                // Disable certificate validation (INSECURE!)
  
  // ===== REPLICA SET OPTIONS =====
  replicaSet: 'myReplicaSet',        // Name of the replica set
  
  // ===== READ PREFERENCE OPTIONS =====
  readPreference: 'primary',         // primary, primaryPreferred, secondary, 
                                     // secondaryPreferred, nearest
  readPreferenceTags: [              // Tag sets for read preference
    { datacenter: 'ny', rack: '1' },
    { datacenter: 'sf' }
  ],
  maxStalenessSeconds: 90,           // Max replication lag for secondary reads
  
  // ===== WRITE CONCERN OPTIONS =====
  w: 'majority',                     // Write concern: number, 'majority', or tag
  wtimeoutMS: 5000,                  // Time to wait for write concern
  journal: true,                     // Wait for journal commit (j option)
  
  // ===== READ CONCERN OPTIONS =====
  readConcern: {
    level: 'majority'                // local, available, majority, linearizable, snapshot
  },
  
  // ===== COMPRESSION OPTIONS =====
  compressors: ['snappy', 'zlib', 'zstd'], // Compression algorithms
  zlibCompressionLevel: 6,           // Zlib compression level (0-9)
  
  // ===== RETRY OPTIONS =====
  retryWrites: true,                 // Enable retryable writes (default: true)
  retryReads: true,                  // Enable retryable reads (default: true)
  
  // ===== MONITORING OPTIONS =====
  monitorCommands: true,             // Enable command monitoring
  
  // ===== LOGGING OPTIONS =====
  loggerLevel: 'info',               // debug, info, warn, error
  
  // ===== DIRECT CONNECTION =====
  directConnection: false,            // Connect directly to host (bypass topology discovery)
  
  // ===== APPLICATION NAME =====
  appName: 'MyApplication',          // Application name for monitoring
  
  // ===== DRIVER INFO =====
  driverInfo: {
    name: 'MyDriver',
    version: '1.0.0',
    platform: 'Node.js'
  },
  
  // ===== SRV OPTIONS =====
  srvMaxHosts: 0,                    // Maximum number of SRV hosts (0 = unlimited)
  srvServiceName: 'mongodb',         // SRV service name
  
  // ===== LOAD BALANCED =====
  loadBalanced: false,               // Enable load-balanced mode
  
  // ===== SERVER API OPTIONS =====
  serverApi: {
    version: '1',                    // Server API version
    strict: true,                    // Strict mode
    deprecationErrors: true          // Throw errors on deprecated features
  },
  
  // ===== AUTO ENCRYPTION OPTIONS =====
  autoEncryption: {
    keyVaultNamespace: 'encryption.__keyVault',
    kmsProviders: {
      local: {
        key: Buffer.from('...') // 96-byte master key
      }
    },
    schemaMap: {
      'myDb.users': {
        // JSON schema for field-level encryption
      }
    },
    bypassAutoEncryption: false,
    extraOptions: {
      mongocryptdURI: 'mongodb://localhost:27020',
      mongocryptdBypassSpawn: false,
      mongocryptdSpawnPath: '/path/to/mongocryptd'
    }
  },
  
  // ===== PROXY OPTIONS =====
  proxyHost: 'proxy.example.com',
  proxyPort: 8080,
  proxyUsername: 'proxyUser',
  proxyPassword: 'proxyPass',
  
  // ===== DATABASE NAME =====
  dbName: 'myDatabase',              // Default database name
  
  // ===== NO CURSOR TIMEOUT =====
  noCursorTimeout: false,            // Prevent cursor timeout
  
  // ===== FIND AND MODIFY =====
  findAndModify: true,               // Use findAndModify command
  
  // ===== CHECK KEYS =====
  checkKeys: false,                  // Check for $ and . in keys
  
  // ===== SERIALIZATION OPTIONS =====
  serializeFunctions: false,         // Serialize functions
  ignoreUndefined: false,            // Ignore undefined values
  promoteLongs: true,                // Convert longs to numbers
  promoteBuffers: false,             // Convert buffers to native types
  promoteValues: true,               // Convert values to native types
  
  // ===== UUID REPRESENTATION =====
  uuidRepresentation: 'standard',    // standard, csharpLegacy, javaLegacy, pythonLegacy
  
  // ===== PKFactory =====
  pkFactory: {
    createPk: () => new ObjectId()   // Custom primary key factory
  },
  
  // ===== RAW =====
  raw: false,                        // Return documents as raw BSON buffers
  
  // ===== ENABLE UTF8 VALIDATION =====
  enableUtf8Validation: true         // Validate UTF-8 strings
});`}</code>
                </pre>
              </div>

              {/* URI Parameters */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  4. All URI Parameters
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`// Complete URI with all possible parameters
const uri = 'mongodb://username:password@host1:27017,host2:27017,host3:27017/myDatabase?' +
  
  // Authentication
  'authSource=admin&' +
  'authMechanism=SCRAM-SHA-256&' +
  'authMechanismProperties=CANONICALIZE_HOST_NAME:true&' +
  
  // Replica Set
  'replicaSet=myReplicaSet&' +
  
  // TLS/SSL
  'tls=true&' +
  'tlsCAFile=/path/to/ca.pem&' +
  'tlsCertificateKeyFile=/path/to/client.pem&' +
  'tlsCertificateKeyFilePassword=password&' +
  'tlsAllowInvalidCertificates=false&' +
  'tlsAllowInvalidHostnames=false&' +
  'tlsInsecure=false&' +
  
  // Connection Pool
  'maxPoolSize=100&' +
  'minPoolSize=10&' +
  'maxIdleTimeMS=60000&' +
  'waitQueueTimeoutMS=5000&' +
  
  // Timeouts
  'connectTimeoutMS=30000&' +
  'socketTimeoutMS=0&' +
  'serverSelectionTimeoutMS=30000&' +
  'heartbeatFrequencyMS=10000&' +
  
  // Read Preference
  'readPreference=primary&' +
  'readPreferenceTags=datacenter:ny,rack:1&' +
  'readPreferenceTags=datacenter:sf&' +
  'maxStalenessSeconds=90&' +
  
  // Write Concern
  'w=majority&' +
  'wtimeoutMS=5000&' +
  'journal=true&' +
  
  // Read Concern
  'readConcernLevel=majority&' +
  
  // Compression
  'compressors=snappy,zlib,zstd&' +
  'zlibCompressionLevel=6&' +
  
  // Retry
  'retryWrites=true&' +
  'retryReads=true&' +
  
  // Application
  'appName=MyApplication&' +
  
  // Direct Connection
  'directConnection=false&' +
  
  // Load Balanced
  'loadBalanced=false&' +
  
  // SRV
  'srvMaxHosts=0&' +
  'srvServiceName=mongodb';

const client = new MongoClient(uri);`}</code>
                </pre>
              </div>

              {/* MongoDB Atlas Connection */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  5. MongoDB Atlas Connection (Cloud)
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient } = require('mongodb');

// Atlas connection string with SRV
const atlasUri = 'mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/myDatabase?' +
  'retryWrites=true&' +
  'w=majority&' +
  'maxPoolSize=50';

const client = new MongoClient(atlasUri, {
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true
  }
});

async function connectToAtlas() {
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');
    
    const db = client.db();
    const collection = db.collection('users');
    
    // Perform operations...
    
  } catch (error) {
    console.error('Atlas connection failed:', error);
  } finally {
    await client.close();
  }
}

connectToAtlas();`}</code>
                </pre>
              </div>

              {/* Connection Events */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  6. Connection Events & Monitoring
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient } = require('mongodb');

const client = new MongoClient('mongodb://localhost:27017', {
  monitorCommands: true
});

// ===== CONNECTION EVENTS =====

// Topology events
client.on('topologyOpening', () => {
  console.log('Topology is being constructed');
});

client.on('topologyOpened', () => {
  console.log('Topology has been opened');
});

client.on('topologyClosed', () => {
  console.log('Topology has been closed');
});

client.on('topologyDescriptionChanged', (event) => {
  console.log('Topology description changed:', event);
});

// Server events
client.on('serverOpening', (event) => {
  console.log('Server opening:', event.address);
});

client.on('serverClosed', (event) => {
  console.log('Server closed:', event.address);
});

client.on('serverDescriptionChanged', (event) => {
  console.log('Server description changed:', event);
});

client.on('serverHeartbeatStarted', (event) => {
  console.log('Heartbeat started:', event.connectionId);
});

client.on('serverHeartbeatSucceeded', (event) => {
  console.log('Heartbeat succeeded:', event.duration, 'ms');
});

client.on('serverHeartbeatFailed', (event) => {
  console.log('Heartbeat failed:', event.failure);
});

// Connection pool events
client.on('connectionPoolCreated', (event) => {
  console.log('Connection pool created:', event.options);
});

client.on('connectionPoolClosed', (event) => {
  console.log('Connection pool closed:', event.address);
});

client.on('connectionCreated', (event) => {
  console.log('Connection created:', event.connectionId);
});

client.on('connectionReady', (event) => {
  console.log('Connection ready:', event.connectionId);
});

client.on('connectionClosed', (event) => {
  console.log('Connection closed:', event.connectionId, 'Reason:', event.reason);
});

client.on('connectionCheckOutStarted', (event) => {
  console.log('Connection checkout started');
});

client.on('connectionCheckOutFailed', (event) => {
  console.log('Connection checkout failed:', event.reason);
});

client.on('connectionCheckedOut', (event) => {
  console.log('Connection checked out:', event.connectionId);
});

client.on('connectionCheckedIn', (event) => {
  console.log('Connection checked in:', event.connectionId);
});

// Command monitoring events
client.on('commandStarted', (event) => {
  console.log('Command started:', event.commandName, event.command);
});

client.on('commandSucceeded', (event) => {
  console.log('Command succeeded:', event.commandName, 'Duration:', event.duration, 'ms');
});

client.on('commandFailed', (event) => {
  console.log('Command failed:', event.commandName, event.failure);
});

// Error event
client.on('error', (error) => {
  console.error('Client error:', error);
});

async function monitoredConnection() {
  try {
    await client.connect();
    console.log('Connected with monitoring enabled');
  } catch (error) {
    console.error('Connection failed:', error);
  }
}

monitoredConnection();`}</code>
                </pre>
              </div>

              {/* Connection Pooling Details */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  7. Connection Pooling (Detailed)
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient } = require('mongodb');

// Connection pooling configuration
const client = new MongoClient('mongodb://localhost:27017', {
  // Pool size limits
  minPoolSize: 5,                    // Minimum connections to maintain
  maxPoolSize: 100,                  // Maximum connections allowed
  
  // Pool behavior
  maxIdleTimeMS: 30000,              // Close idle connections after 30s
  waitQueueTimeoutMS: 10000,         // Wait max 10s for available connection
  
  // Connection lifecycle
  maxConnecting: 2,                  // Max simultaneous connection establishments
});

// Get pool statistics
async function getPoolStats() {
  await client.connect();
  
  // Access internal pool (not officially documented, for learning)
  const topology = client.topology;
  
  console.log('Pool statistics:');
  console.log('- Available connections');
  console.log('- In-use connections');
  console.log('- Total connections');
}

// Best practices for connection pooling
async function poolBestPractices() {
  // 1. Create client once at application startup
  const globalClient = new MongoClient('mongodb://localhost:27017', {
    maxPoolSize: 50
  });
  
  await globalClient.connect();
  
  // 2. Reuse the client across requests
  async function handleRequest() {
    const db = globalClient.db('myDatabase');
    const collection = db.collection('users');
    
    // Automatically uses connection from pool
    const users = await collection.find({}).toArray();
    
    return users;
    // Connection automatically returned to pool
  }
  
  // 3. Close client on application shutdown
  process.on('SIGINT', async () => {
    await globalClient.close();
    process.exit(0);
  });
}

getPoolStats();`}</code>
                </pre>
              </div>

              {/* Multi-Host Connections */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  8. Multi-Host Connections (Replica Sets)
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient, ReadPreference } = require('mongodb');

// Connect to replica set with multiple hosts
const uri = 'mongodb://host1:27017,host2:27017,host3:27017/myDatabase?replicaSet=myReplicaSet';

const client = new MongoClient(uri, {
  replicaSet: 'myReplicaSet',
  
  // Read preference for replica set
  readPreference: ReadPreference.SECONDARY_PREFERRED,
  
  // Server selection
  serverSelectionTimeoutMS: 30000,
  localThresholdMS: 15,
  
  // Write concern for replica set
  w: 'majority',
  wtimeoutMS: 5000,
  journal: true,
  
  // Read concern
  readConcern: { level: 'majority' }
});

async function replicaSetOperations() {
  await client.connect();
  const db = client.db();
  
  // Read from secondary (if available)
  const users = await db.collection('users')
    .find({})
    .readPref(ReadPreference.SECONDARY)
    .toArray();
  
  // Write to primary (always)
  await db.collection('users').insertOne({
    name: 'Alice',
    email: 'alice@example.com'
  });
  
  await client.close();
}

replicaSetOperations();`}</code>
                </pre>
              </div>

              {/* Client-Side Field Level Encryption */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  9. Client-Side Field Level Encryption (CSFLE)
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const { MongoClient, Binary } = require('mongodb');
const crypto = require('crypto');

// Generate a local master key (96 bytes)
const localMasterKey = crypto.randomBytes(96);

const client = new MongoClient('mongodb://localhost:27017', {
  autoEncryption: {
    // Key vault configuration
    keyVaultNamespace: 'encryption.__keyVault',
    
    // KMS providers
    kmsProviders: {
      local: {
        key: localMasterKey
      },
      aws: {
        accessKeyId: 'YOUR_ACCESS_KEY',
        secretAccessKey: 'YOUR_SECRET_KEY'
      },
      azure: {
        tenantId: 'YOUR_TENANT_ID',
        clientId: 'YOUR_CLIENT_ID',
        clientSecret: 'YOUR_CLIENT_SECRET'
      },
      gcp: {
        email: 'YOUR_EMAIL',
        privateKey: 'YOUR_PRIVATE_KEY'
      }
    },
    
    // Schema map for automatic encryption
    schemaMap: {
      'myDatabase.users': {
        bsonType: 'object',
        properties: {
          ssn: {
            encrypt: {
              bsonType: 'string',
              algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic',
              keyId: [new Binary(Buffer.from('...'), 4)] // UUID of data encryption key
            }
          },
          creditCard: {
            encrypt: {
              bsonType: 'string',
              algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Random'
            }
          }
        }
      }
    },
    
    // Bypass automatic encryption (manual encryption)
    bypassAutoEncryption: false,
    
    // Extra options for mongocryptd
    extraOptions: {
      mongocryptdURI: 'mongodb://localhost:27020',
      mongocryptdBypassSpawn: false,
      mongocryptdSpawnPath: '/usr/local/bin/mongocryptd',
      mongocryptdSpawnArgs: ['--port=27020']
    }
  }
});

async function encryptedOperations() {
  await client.connect();
  
  const db = client.db('myDatabase');
  const users = db.collection('users');
  
  // Data is automatically encrypted
  await users.insertOne({
    name: 'John Doe',
    ssn: '123-45-6789',        // Encrypted deterministically
    creditCard: '4111111111111111' // Encrypted randomly
  });
  
  // Querying encrypted fields (deterministic only)
  const user = await users.findOne({ ssn: '123-45-6789' });
  console.log(user); // SSN is automatically decrypted
  
  await client.close();
}

encryptedOperations();`}</code>
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

              {/* Basic Mongoose Connection */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-purple-300">
                  1. Basic Mongoose Connection
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const mongoose = require('mongoose');

// Simple connection
const uri = 'mongodb://localhost:27017/myDatabase';

async function connect() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB via Mongoose');
  } catch (error) {
    console.error('Connection failed:', error);
  }
}

connect();

// Event-based connection
mongoose.connect('mongodb://localhost:27017/myDatabase');

mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});`}</code>
                </pre>
              </div>

              {/* All Mongoose Connection Options */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-purple-300">
                  2. All Mongoose Connection Options
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/myDatabase', {
  
  // ===== AUTHENTICATION =====
  user: 'username',
  pass: 'password',
  authSource: 'admin',
  authMechanism: 'SCRAM-SHA-256',
  
  // ===== CONNECTION POOL =====
  maxPoolSize: 100,                  // Maximum number of sockets (default: 100)
  minPoolSize: 10,                   // Minimum number of sockets (default: 0)
  maxIdleTimeMS: 60000,              // Close sockets after idle time
  waitQueueTimeoutMS: 5000,          // Wait time for connection from pool
  
  // ===== SERVER SELECTION =====
  serverSelectionTimeoutMS: 30000,   // Timeout for server selection
  heartbeatFrequencyMS: 10000,       // Heartbeat frequency
  localThresholdMS: 15,              // Local threshold for selecting server
  
  // ===== TIMEOUTS =====
  connectTimeoutMS: 30000,           // Connection timeout
  socketTimeoutMS: 0,                // Socket timeout (0 = no timeout)
  
  // ===== TLS/SSL =====
  tls: true,
  tlsAllowInvalidCertificates: false,
  tlsAllowInvalidHostnames: false,
  tlsCAFile: '/path/to/ca.pem',
  tlsCertificateKeyFile: '/path/to/client.pem',
  tlsCertificateKeyFilePassword: 'password',
  
  // ===== REPLICA SET =====
  replicaSet: 'myReplicaSet',
  
  // ===== READ PREFERENCE =====
  readPreference: 'primary',         // primary, primaryPreferred, secondary, 
                                     // secondaryPreferred, nearest
  readPreferenceTags: [
    { region: 'east', rack: '1' }
  ],
  maxStalenessSeconds: 90,
  
  // ===== WRITE CONCERN =====
  w: 'majority',
  wtimeoutMS: 5000,
  journal: true,
  
  // ===== READ CONCERN =====
  readConcern: {
    level: 'majority'
  },
  
  // ===== COMPRESSION =====
  compressors: ['snappy', 'zlib'],
  zlibCompressionLevel: 6,
  
  // ===== RETRY =====
  retryWrites: true,
  retryReads: true,
  
  // ===== APPLICATION =====
  appName: 'MyMongooseApp',
  
  // ===== DIRECT CONNECTION =====
  directConnection: false,
  
  // ===== LOAD BALANCED =====
  loadBalanced: false,
  
  // ===== SERVER API =====
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true
  },
  
  // ===== AUTO INDEX =====
  autoIndex: true,                   // Build indexes (default: true in dev)
  
  // ===== AUTO CREATE =====
  autoCreate: true,                  // Auto create collections (default: true)
  
  // ===== BUFFER COMMANDS =====
  bufferCommands: true,              // Buffer commands until connected
  bufferTimeoutMS: 10000,            // Buffer timeout
  
  // ===== FAMILY =====
  family: 4,                         // IP version (4 or 6)
  
  // ===== PROMISELIB =====
  promiseLibrary: global.Promise,    // Promise library to use
  
  // ===== MAX TIME MS =====
  maxTimeMS: 30000,                  // Max execution time for operations
  
  // ===== UUID REPRESENTATION =====
  uuidRepresentation: 'standard',
  
  // ===== SANITIZE FILTER =====
  sanitizeFilter: false,             // Sanitize filter for query selectors
  
  // ===== DRIVER OPTIONS =====
  driverInfo: {
    name: 'Mongoose',
    version: '7.0.0'
  }
});`}</code>
                </pre>
              </div>

              {/* Multiple Connections */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-purple-300">
                  3. Multiple Connections in Mongoose
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const mongoose = require('mongoose');

// Default connection
await mongoose.connect('mongodb://localhost:27017/mainDB');

// Create additional connections
const secondConnection = mongoose.createConnection('mongodb://localhost:27017/secondDB', {
  maxPoolSize: 50
});

const thirdConnection = mongoose.createConnection('mongodb://localhost:27017/thirdDB', {
  maxPoolSize: 30
});

// Using different connections with models
const userSchema = new mongoose.Schema({ name: String });

// Model on default connection
const User = mongoose.model('User', userSchema);

// Model on second connection
const Admin = secondConnection.model('Admin', userSchema);

// Model on third connection
const Guest = thirdConnection.model('Guest', userSchema);

// Operations on different databases
await User.create({ name: 'User in mainDB' });
await Admin.create({ name: 'Admin in secondDB' });
await Guest.create({ name: 'Guest in thirdDB' });

// Close specific connection
await secondConnection.close();

// Close all connections
await mongoose.disconnect();
await thirdConnection.close();`}</code>
                </pre>
              </div>

              {/* Connection States */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-purple-300">
                  4. Connection States & Events
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const mongoose = require('mongoose');

// Connection states
console.log(mongoose.connection.readyState);
// 0 = disconnected
// 1 = connected
// 2 = connecting
// 3 = disconnecting
// 99 = uninitialized

// Connection events
mongoose.connection.on('connecting', () => {
  console.log('Connecting to MongoDB...');
});

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
  console.log('Host:', mongoose.connection.host);
  console.log('Port:', mongoose.connection.port);
  console.log('Name:', mongoose.connection.name);
});

mongoose.connection.on('open', () => {
  console.log('Connection opened');
});

mongoose.connection.on('disconnecting', () => {
  console.log('Disconnecting from MongoDB...');
});

mongoose.connection.on('disconnected', () => {
  console.log('Disconnected from MongoDB');
});

mongoose.connection.on('close', () => {
  console.log('Connection closed');
});

mongoose.connection.on('reconnected', () => {
  console.log('Reconnected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Connection error:', err);
});

mongoose.connection.on('fullsetup', () => {
  console.log('All replica set members connected');
});

mongoose.connection.on('all', () => {
  console.log('All servers connected');
});

mongoose.connection.on('reconnectFailed', () => {
  console.error('Reconnection attempts failed');
});

// Connection info
await mongoose.connect('mongodb://localhost:27017/myDB');

console.log('Connection details:');
console.log('- Host:', mongoose.connection.host);
console.log('- Port:', mongoose.connection.port);
console.log('- Database:', mongoose.connection.name);
console.log('- Ready state:', mongoose.connection.readyState);
console.log('- Models:', Object.keys(mongoose.connection.models));
console.log('- Collections:', Object.keys(mongoose.connection.collections));`}</code>
                </pre>
              </div>

              {/* Mongoose with URI Options */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-purple-300">
                  5. Mongoose with Complete URI Options
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const mongoose = require('mongoose');

// Complete URI with all options
const uri = 'mongodb://username:password@host1:27017,host2:27017,host3:27017/myDatabase?' +
  'authSource=admin&' +
  'authMechanism=SCRAM-SHA-256&' +
  'replicaSet=myReplicaSet&' +
  'tls=true&' +
  'maxPoolSize=100&' +
  'minPoolSize=10&' +
  'maxIdleTimeMS=60000&' +
  'waitQueueTimeoutMS=5000&' +
  'connectTimeoutMS=30000&' +
  'socketTimeoutMS=0&' +
  'serverSelectionTimeoutMS=30000&' +
  'heartbeatFrequencyMS=10000&' +
  'readPreference=primaryPreferred&' +
  'readConcernLevel=majority&' +
  'w=majority&' +
  'wtimeoutMS=5000&' +
  'journal=true&' +
  'retryWrites=true&' +
  'retryReads=true&' +
  'appName=MyApp&' +
  'compressors=snappy,zlib';

await mongoose.connect(uri);`}</code>
                </pre>
              </div>

              {/* Mongoose Atlas Connection */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-purple-300">
                  6. Mongoose with MongoDB Atlas
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const mongoose = require('mongoose');

// MongoDB Atlas connection
const atlasUri = 'mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/myDatabase?retryWrites=true&w=majority';

mongoose.connect(atlasUri, {
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true
  },
  maxPoolSize: 50,
  retryWrites: true
});

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB Atlas');
});

// Alternative with better error handling
async function connectToAtlas() {
  try {
    await mongoose.connect(atlasUri, {
      serverApi: { version: '1' }
    });
    console.log('Atlas connection successful');
  } catch (error) {
    console.error('Atlas connection failed:', error);
    process.exit(1);
  }
}

connectToAtlas();`}</code>
                </pre>
              </div>

              {/* Connection Helpers */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-purple-300">
                  7. Mongoose Connection Helpers & Utilities
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const mongoose = require('mongoose');

// Get native MongoDB client
await mongoose.connect('mongodb://localhost:27017/myDB');
const nativeClient = mongoose.connection.getClient();

// Get native database
const nativeDb = mongoose.connection.db;

// Use native MongoDB operations
const collections = await nativeDb.listCollections().toArray();
console.log('Collections:', collections);

// Drop database
await mongoose.connection.dropDatabase();

// Drop collection
await mongoose.connection.dropCollection('users');

// Start session for transactions
const session = await mongoose.startSession();
session.startTransaction();
try {
  await User.create([{ name: 'Alice' }], { session });
  await Post.create([{ title: 'Hello' }], { session });
  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
  throw error;
} finally {
  session.endSession();
}

// Connection.prototype methods
console.log('Collections:', mongoose.connection.collections);
console.log('Models:', mongoose.connection.models);
console.log('Config:', mongoose.connection.config);
console.log('Client:', mongoose.connection.client);

// Close connection
await mongoose.connection.close();

// Close with force (kills all operations)
await mongoose.connection.close(true);

// Destroy connection (more aggressive)
await mongoose.connection.destroy();`}</code>
                </pre>
              </div>

              {/* Connection Plugins */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-purple-300">
                  8. Connection with Custom Configuration
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const mongoose = require('mongoose');

// Set global options before connecting
mongoose.set('strictQuery', false);
mongoose.set('debug', true);           // Log all operations
mongoose.set('bufferCommands', false); // Disable command buffering
mongoose.set('autoCreate', false);     // Don't auto-create collections
mongoose.set('autoIndex', false);      // Don't auto-build indexes

// Custom connection with all configurations
const connection = await mongoose.createConnection('mongodb://localhost:27017/myDB', {
  maxPoolSize: 100,
  serverSelectionTimeoutMS: 5000,
}).asPromise();

// Plugin for connection
connection.plugin((schema) => {
  schema.set('timestamps', true);
});

// Connection-specific configurations
connection.set('debug', true);

// Use connection
const User = connection.model('User', new mongoose.Schema({
  name: String,
  email: String
}));

await User.create({ name: 'Bob', email: 'bob@example.com' });`}</code>
                </pre>
              </div>

              {/* Environment-based Connection */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-purple-300">
                  9. Environment-Based Connection (Best Practices)
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const mongoose = require('mongoose');

// config/database.js
class DatabaseConnection {
  constructor() {
    this.connection = null;
  }

  async connect() {
    if (this.connection) {
      return this.connection;
    }

    const env = process.env.NODE_ENV || 'development';
    
    const configs = {
      development: {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/dev',
        options: {
          maxPoolSize: 10,
          serverSelectionTimeoutMS: 5000,
          autoIndex: true,
          autoCreate: true
        }
      },
      test: {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/test',
        options: {
          maxPoolSize: 5,
          serverSelectionTimeoutMS: 3000,
          autoIndex: false
        }
      },
      production: {
        uri: process.env.MONGODB_URI,
        options: {
          maxPoolSize: 100,
          minPoolSize: 10,
          serverSelectionTimeoutMS: 30000,
          socketTimeoutMS: 45000,
          family: 4,
          autoIndex: false,
          autoCreate: false,
          retryWrites: true,
          w: 'majority',
          serverApi: {
            version: '1',
            strict: true,
            deprecationErrors: true
          }
        }
      }
    };

    const config = configs[env];

    try {
      await mongoose.connect(config.uri, config.options);
      
      mongoose.connection.on('error', (err) => {
        console.error('MongoDB error:', err);
      });

      mongoose.connection.on('disconnected', () => {
        console.warn('MongoDB disconnected. Attempting to reconnect...');
      });

      this.connection = mongoose.connection;
      console.log(\`Connected to MongoDB (\${env})\`);
      
      return this.connection;
    } catch (error) {
      console.error('MongoDB connection error:', error);
      throw error;
    }
  }

  async disconnect() {
    if (this.connection) {
      await mongoose.disconnect();
      this.connection = null;
      console.log('Disconnected from MongoDB');
    }
  }

  getConnection() {
    return this.connection;
  }
}

// Usage
const db = new DatabaseConnection();
await db.connect();

// Graceful shutdown
process.on('SIGINT', async () => {
  await db.disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await db.disconnect();
  process.exit(0);
});`}</code>
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
                  <strong>Reuse connections:</strong> Create one
                  client/connection at startup and reuse it
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Connection pooling:</strong> Configure appropriate
                  pool sizes based on your workload
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Timeouts:</strong> Set reasonable timeouts to prevent
                  hanging operations
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Error handling:</strong> Always implement error
                  handlers for connection events
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Graceful shutdown:</strong> Close connections properly
                  on application exit
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Environment variables:</strong> Store sensitive
                  connection strings in env variables
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>TLS/SSL:</strong> Always use encryption in production
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Write concerns:</strong> Use appropriate write
                  concerns for your data consistency needs
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Read preferences:</strong> Choose read preferences
                  based on your availability/consistency requirements
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Monitoring:</strong> Enable command monitoring in
                  development to understand performance
                </span>
              </li>
            </ul>
          </section>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8">
            <Link
              href="/"
              className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              ← Back to Home
            </Link>
            <Link
              href="/phase1/databases-collections"
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              Next: Databases & Collections →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
