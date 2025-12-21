"use client";

import Link from "next/link";
import { useState } from "react";

export default function AuthenticationAuthorizationPage() {
  const [activeTab, setActiveTab] = useState("authentication");

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
          Authentication & Authorization
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Secure access control and user management
        </p>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 flex-wrap">
          <button
            onClick={() => setActiveTab("authentication")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "authentication"
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Authentication
          </button>
          <button
            onClick={() => setActiveTab("authorization")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "authorization"
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Authorization
          </button>
          <button
            onClick={() => setActiveTab("rbac")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "rbac"
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Roles & RBAC
          </button>
        </div>

        <div className="space-y-8">
          {/* Authentication Tab */}
          {activeTab === "authentication" && (
            <>
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  📚 Authentication Theory
                </h2>

                <div className="space-y-4 text-gray-200">
                  <p className="text-lg">
                    <strong>Authentication</strong> verifies the identity of a
                    user or client connecting to MongoDB.
                  </p>

                  <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                    Authentication Mechanisms
                  </h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong>SCRAM (Default):</strong> Salted Challenge
                      Response Authentication Mechanism
                    </li>
                    <li>
                      <strong>x.509:</strong> Certificate-based authentication
                    </li>
                    <li>
                      <strong>LDAP:</strong> Lightweight Directory Access
                      Protocol
                    </li>
                    <li>
                      <strong>Kerberos:</strong> Network authentication protocol
                    </li>
                    <li>
                      <strong>AWS IAM:</strong> Amazon Web Services Identity and
                      Access Management
                    </li>
                  </ul>

                  <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                    SCRAM Variants
                  </h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong>SCRAM-SHA-1:</strong> Legacy, less secure
                    </li>
                    <li>
                      <strong>SCRAM-SHA-256:</strong> Default, recommended
                    </li>
                  </ul>
                </div>
              </section>

              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  Authentication Examples
                </h2>

                {/* Enable Authentication */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    1. Enable Authentication (SCRAM)
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== INITIAL SETUP (NO AUTH) =====

// Start MongoDB without auth
mongod --dbpath /data/db --port 27017

// Connect to MongoDB
mongosh --port 27017

// ===== CREATE ADMIN USER =====

use admin

db.createUser({
  user: "admin",
  pwd: "securePassword123",  // Use strong password
  roles: [
    { role: "userAdminAnyDatabase", db: "admin" },
    { role: "readWriteAnyDatabase", db: "admin" },
    { role: "dbAdminAnyDatabase", db: "admin" }
  ]
});

// ===== RESTART WITH AUTH =====

// Stop MongoDB
db.adminCommand({ shutdown: 1 });

// Start with authentication enabled
mongod --auth --dbpath /data/db --port 27017

// Or in config file (mongod.conf):
/*
security:
  authorization: enabled
*/

// ===== CONNECT WITH AUTHENTICATION =====

// Method 1: Command line
mongosh --port 27017 -u admin -p securePassword123 --authenticationDatabase admin

// Method 2: Connection string
mongosh "mongodb://admin:securePassword123@localhost:27017/?authSource=admin"

// Method 3: Authenticate after connecting
mongosh --port 27017
use admin
db.auth("admin", "securePassword123");

// ===== MONGODB NATIVE DRIVER =====

const { MongoClient } = require("mongodb");

const uri = "mongodb://admin:securePassword123@localhost:27017/?authSource=admin";
const client = new MongoClient(uri);

await client.connect();
console.log("Connected with authentication");

// Or with options
const client2 = new MongoClient("mongodb://localhost:27017", {
  auth: {
    username: "admin",
    password: "securePassword123"
  },
  authSource: "admin"
});

await client.close();

// ===== MONGOOSE =====

const mongoose = require("mongoose");

await mongoose.connect(
  "mongodb://admin:securePassword123@localhost:27017/myDatabase?authSource=admin"
);

// Or with options
await mongoose.connect("mongodb://localhost:27017/myDatabase", {
  user: "admin",
  pass: "securePassword123",
  authSource: "admin"
});

await mongoose.disconnect();`}</code>
                  </pre>
                </div>

                {/* x.509 Authentication */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    2. x.509 Certificate Authentication
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== GENERATE CERTIFICATES =====

// 1. Create CA certificate
openssl req -new -x509 -days 365 -out ca.crt -keyout ca.key

// 2. Create server certificate
openssl req -new -out mongodb-server.csr -keyout mongodb-server.key
openssl x509 -req -in mongodb-server.csr -CA ca.crt -CAkey ca.key \\
  -CAcreateserial -out mongodb-server.crt -days 365

// 3. Create client certificate
openssl req -new -out client.csr -keyout client.key
openssl x509 -req -in client.csr -CA ca.crt -CAkey ca.key \\
  -CAcreateserial -out client.crt -days 365

// 4. Combine client cert and key
cat client.crt client.key > client.pem

// ===== START MONGODB WITH x.509 =====

mongod --auth \\
  --tlsMode requireTLS \\
  --tlsCertificateKeyFile /path/to/mongodb-server.pem \\
  --tlsCAFile /path/to/ca.crt \\
  --dbpath /data/db

// Config file (mongod.conf):
/*
net:
  tls:
    mode: requireTLS
    certificateKeyFile: /path/to/mongodb-server.pem
    CAFile: /path/to/ca.crt
security:
  authorization: enabled
*/

// ===== CREATE USER WITH x.509 =====

// Connect as admin first
mongosh --tls --tlsCertificateKeyFile client.pem \\
  --tlsCAFile ca.crt --host localhost

use $external

// Create user (subject from certificate)
db.createUser({
  user: "CN=client,OU=IT,O=MyCompany,L=NYC,ST=NY,C=US",
  roles: [
    { role: "readWrite", db: "myDatabase" }
  ]
});

// ===== CONNECT WITH x.509 =====

// MongoDB shell
mongosh --tls \\
  --tlsCertificateKeyFile /path/to/client.pem \\
  --tlsCAFile /path/to/ca.crt \\
  --authenticationMechanism MONGODB-X509 \\
  --authenticationDatabase '$external' \\
  --host localhost

// MongoDB Native Driver
const client = new MongoClient("mongodb://localhost:27017", {
  tls: true,
  tlsCertificateKeyFile: fs.readFileSync("client.pem"),
  tlsCAFile: fs.readFileSync("ca.crt"),
  authMechanism: "MONGODB-X509",
  authSource: "$external"
});

await client.connect();`}</code>
                  </pre>
                </div>

                {/* LDAP Authentication */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    3. LDAP Authentication (Enterprise)
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== MONGODB ENTERPRISE ONLY =====

// Start MongoDB with LDAP
mongod --auth \\
  --setParameter authenticationMechanisms=PLAIN \\
  --setParameter saslauthdPath=/run/saslauthd/mux \\
  --dbpath /data/db

// Config file:
/*
security:
  authorization: enabled
  ldap:
    servers: "ldap.example.com"
    bind:
      method: "simple"
      queryUser: "cn=admin,dc=example,dc=com"
      queryPassword: "password"
    userToDNMapping:
      '[
        {
          match: "(.+)",
          substitution: "cn={0},ou=users,dc=example,dc=com"
        }
      ]'
setParameter:
  authenticationMechanisms: PLAIN
*/

// ===== CREATE LDAP USER =====

use $external

db.createUser({
  user: "ldapuser",
  roles: [
    { role: "read", db: "myDatabase" }
  ]
});

// ===== CONNECT WITH LDAP =====

mongosh --authenticationMechanism PLAIN \\
  --authenticationDatabase '$external' \\
  -u ldapuser -p ldapPassword

// MongoDB Native Driver
const client = new MongoClient(
  "mongodb://ldapuser:ldapPassword@localhost:27017/?authMechanism=PLAIN&authSource=$external"
);`}</code>
                  </pre>
                </div>

                {/* Kerberos Authentication */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    4. Kerberos Authentication (Enterprise)
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== SETUP KERBEROS =====

// 1. Create service principal for MongoDB
kadmin: addprinc -randkey mongodb/hostname.example.com@EXAMPLE.COM

// 2. Create keytab
kadmin: ktadd -k /path/to/mongodb.keytab mongodb/hostname.example.com@EXAMPLE.COM

// 3. Start MongoDB with Kerberos
mongod --auth \\
  --setParameter authenticationMechanisms=GSSAPI \\
  --setParameter saslHostName=hostname.example.com \\
  --dbpath /data/db

// Config file:
/*
security:
  authorization: enabled
setParameter:
  authenticationMechanisms: GSSAPI
  saslHostName: hostname.example.com
*/

// ===== CREATE KERBEROS USER =====

use $external

db.createUser({
  user: "user@EXAMPLE.COM",
  roles: [
    { role: "readWrite", db: "myDatabase" }
  ]
});

// ===== CONNECT WITH KERBEROS =====

// Get Kerberos ticket
kinit user@EXAMPLE.COM

// Connect
mongosh --authenticationMechanism GSSAPI \\
  --authenticationDatabase '$external' \\
  --host hostname.example.com

// MongoDB Native Driver
const client = new MongoClient(
  "mongodb://user%40EXAMPLE.COM@hostname.example.com:27017/?authMechanism=GSSAPI&authSource=$external"
);`}</code>
                  </pre>
                </div>

                {/* User Management */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    5. User Management
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== CREATE USERS =====

use admin

// Basic user
db.createUser({
  user: "appUser",
  pwd: "password123",
  roles: [
    { role: "readWrite", db: "myDatabase" }
  ]
});

// User with multiple roles
db.createUser({
  user: "dataAnalyst",
  pwd: "password123",
  roles: [
    { role: "read", db: "myDatabase" },
    { role: "read", db: "analytics" },
    { role: "readWrite", db: "reports" }
  ]
});

// ===== VIEW USERS =====

// All users in current database
use myDatabase
db.getUsers();

// Specific user
db.getUser("appUser");

// All users (admin only)
use admin
db.system.users.find();

// ===== UPDATE USER =====

// Change password
use admin
db.changeUserPassword("appUser", "newPassword456");

// Update roles
db.updateUser("appUser", {
  roles: [
    { role: "readWrite", db: "myDatabase" },
    { role: "read", db: "analytics" }
  ]
});

// Grant additional role
db.grantRolesToUser("appUser", [
  { role: "dbAdmin", db: "myDatabase" }
]);

// Revoke role
db.revokeRolesFromUser("appUser", [
  { role: "dbAdmin", db: "myDatabase" }
]);

// ===== DELETE USER =====

use admin
db.dropUser("appUser");

// ===== PROGRAMMATIC USER MANAGEMENT =====

const { MongoClient } = require("mongodb");

const client = new MongoClient(
  "mongodb://admin:password@localhost:27017/?authSource=admin"
);
await client.connect();

const adminDb = client.db("admin");

// Create user
await adminDb.command({
  createUser: "newUser",
  pwd: "password123",
  roles: [
    { role: "readWrite", db: "myDatabase" }
  ]
});

// Update user
await adminDb.command({
  updateUser: "newUser",
  roles: [
    { role: "read", db: "myDatabase" }
  ]
});

// Drop user
await adminDb.command({
  dropUser: "newUser"
});

await client.close();`}</code>
                  </pre>
                </div>
              </section>
            </>
          )}

          {/* Authorization Tab */}
          {activeTab === "authorization" && (
            <>
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  📚 Authorization Theory
                </h2>

                <div className="space-y-4 text-gray-200">
                  <p className="text-lg">
                    <strong>Authorization</strong> determines what authenticated
                    users are allowed to do.
                  </p>

                  <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                    Role-Based Access Control (RBAC)
                  </h3>
                  <p>MongoDB uses RBAC to manage permissions:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong>Roles:</strong> Define privileges (actions on
                      resources)
                    </li>
                    <li>
                      <strong>Users:</strong> Assigned one or more roles
                    </li>
                    <li>
                      <strong>Privileges:</strong> Actions (find, insert,
                      update) on resources (databases, collections)
                    </li>
                  </ul>

                  <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                    Built-in Roles
                  </h3>
                  <p>Database-level roles:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong>read:</strong> Read data from database
                    </li>
                    <li>
                      <strong>readWrite:</strong> Read and modify data
                    </li>
                    <li>
                      <strong>dbAdmin:</strong> Database administration
                    </li>
                    <li>
                      <strong>dbOwner:</strong> All database privileges
                    </li>
                    <li>
                      <strong>userAdmin:</strong> Create and modify users/roles
                    </li>
                  </ul>

                  <p className="mt-4">All-databases roles:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong>readAnyDatabase:</strong> Read all databases
                    </li>
                    <li>
                      <strong>readWriteAnyDatabase:</strong> Read/write all
                      databases
                    </li>
                    <li>
                      <strong>dbAdminAnyDatabase:</strong> Admin all databases
                    </li>
                    <li>
                      <strong>userAdminAnyDatabase:</strong> User admin all
                      databases
                    </li>
                  </ul>

                  <p className="mt-4">Cluster administration:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong>clusterAdmin:</strong> All cluster management
                    </li>
                    <li>
                      <strong>clusterMonitor:</strong> Read-only cluster access
                    </li>
                    <li>
                      <strong>hostManager:</strong> Monitor and manage servers
                    </li>
                    <li>
                      <strong>clusterManager:</strong> Cluster operations
                    </li>
                  </ul>

                  <p className="mt-4">Special roles:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong>backup:</strong> Backup cluster data
                    </li>
                    <li>
                      <strong>restore:</strong> Restore cluster data
                    </li>
                    <li>
                      <strong>root:</strong> Superuser (all privileges)
                    </li>
                  </ul>
                </div>
              </section>

              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  Authorization Examples
                </h2>

                {/* Privilege Actions */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    1. Privilege Actions Reference
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== DATABASE & COLLECTION ACTIONS =====

/*
Read Actions:
- find: Query documents
- listCollections: List collections
- listIndexes: List indexes

Write Actions:
- insert: Insert documents
- update: Update documents
- remove: Delete documents

Index Actions:
- createIndex: Create indexes
- dropIndex: Drop indexes

Collection Actions:
- createCollection: Create collections
- dropCollection: Drop collections
- renameCollectionSameDB: Rename collections

Database Actions:
- dropDatabase: Drop database
- listDatabases: List databases
*/

// ===== USER & ROLE ACTIONS =====

/*
User Management:
- createUser: Create users
- updateUser: Modify users
- dropUser: Delete users
- changeOwnPassword: Change own password
- changeOwnCustomData: Change own custom data
- viewUser: View user information
- createRole: Create roles
- updateRole: Modify roles
- dropRole: Delete roles
- viewRole: View role information
- grantRole: Grant roles to users/roles
- revokeRole: Revoke roles
*/

// ===== CLUSTER ACTIONS =====

/*
Replication:
- replSetGetStatus: Get replica set status
- replSetGetConfig: Get replica set config
- replSetConfigure: Configure replica set
- resync: Resync member

Sharding:
- addShard: Add shard to cluster
- removeShard: Remove shard
- listShards: List shards
- moveChunk: Manually move chunks
- enableSharding: Enable sharding on database
- shardCollection: Shard a collection

Server Administration:
- serverStatus: Get server status
- shutdown: Shutdown server
- logRotate: Rotate logs
- setParameter: Set server parameters
*/

// ===== DIAGNOSTIC ACTIONS =====

/*
- collStats: Collection statistics
- dbStats: Database statistics
- getCmdLineOpts: Get command line options
- getLog: Get log data
- getParameter: Get server parameters
- hostInfo: Get host information
- listDatabases: List all databases
- top: Get usage statistics
*/`}</code>
                  </pre>
                </div>

                {/* Check Privileges */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    2. Check User Privileges
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== VIEW CURRENT USER =====

db.runCommand({ connectionStatus: 1 });

// Output shows:
/*
{
  authInfo: {
    authenticatedUsers: [
      { user: "appUser", db: "admin" }
    ],
    authenticatedUserRoles: [
      { role: "readWrite", db: "myDatabase" }
    ],
    authenticatedUserPrivileges: [
      {
        resource: { db: "myDatabase", collection: "" },
        actions: ["find", "insert", "update", "remove"]
      }
    ]
  }
}
*/

// ===== CHECK SPECIFIC PRIVILEGE =====

db.runCommand({
  usersInfo: { user: "appUser", db: "admin" },
  showPrivileges: true
});

// ===== TEST AUTHORIZATION =====

// Try operation to see if allowed
try {
  db.users.find();
  console.log("Read access granted");
} catch (error) {
  console.error("Not authorized:", error.message);
}

// Check if can perform action
db.adminCommand({
  checkAuthorization: 1,
  privilege: {
    resource: { db: "myDatabase", collection: "users" },
    actions: ["find"]
  }
});`}</code>
                  </pre>
                </div>
              </section>
            </>
          )}

          {/* RBAC Tab */}
          {activeTab === "rbac" && (
            <>
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  Custom Roles & Advanced RBAC
                </h2>

                {/* Custom Roles */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    1. Create Custom Roles
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`use admin

// ===== BASIC CUSTOM ROLE =====

db.createRole({
  role: "readOnlyProducts",
  privileges: [
    {
      resource: { db: "myDatabase", collection: "products" },
      actions: ["find", "listIndexes"]
    }
  ],
  roles: []  // Can inherit from other roles
});

// ===== COLLECTION-SPECIFIC ROLE =====

db.createRole({
  role: "ordersManager",
  privileges: [
    {
      resource: { db: "myDatabase", collection: "orders" },
      actions: ["find", "insert", "update", "remove"]
    },
    {
      resource: { db: "myDatabase", collection: "customers" },
      actions: ["find"]
    }
  ],
  roles: []
});

// ===== ROLE WITH INHERITANCE =====

db.createRole({
  role: "reportingRole",
  privileges: [
    {
      resource: { db: "analytics", collection: "" },
      actions: ["find", "listCollections"]
    }
  ],
  roles: [
    { role: "read", db: "myDatabase" }  // Inherit read role
  ]
});

// ===== DATABASE-LEVEL ROLE =====

db.createRole({
  role: "dataScientist",
  privileges: [
    {
      resource: { db: "analytics", collection: "" },
      actions: ["find", "listCollections", "listIndexes"]
    },
    {
      resource: { db: "analytics", collection: "reports" },
      actions: ["insert", "update"]
    }
  ],
  roles: []
});

// ===== CLUSTER-LEVEL ROLE =====

db.createRole({
  role: "clusterMonitorCustom",
  privileges: [
    {
      resource: { cluster: true },
      actions: ["listDatabases", "serverStatus"]
    },
    {
      resource: { db: "", collection: "" },
      actions: ["listCollections", "dbStats", "collStats"]
    }
  ],
  roles: []
});

// ===== ADMIN OPERATIONS ROLE =====

db.createRole({
  role: "backupOperator",
  privileges: [
    {
      resource: { db: "", collection: "" },
      actions: ["listDatabases", "listCollections"]
    },
    {
      resource: { cluster: true },
      actions: ["appendOplogNote"]  // For backup consistency
    }
  ],
  roles: [
    { role: "backup", db: "admin" }
  ]
});`}</code>
                  </pre>
                </div>

                {/* Manage Roles */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    2. Manage Custom Roles
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`use admin

// ===== VIEW ROLES =====

// All roles
db.getRoles();

// Specific role with details
db.getRole("readOnlyProducts", { showPrivileges: true });

// All built-in roles
db.getRoles({ rolesInfo: 1, showBuiltinRoles: true });

// ===== UPDATE ROLE =====

// Add privileges
db.updateRole("ordersManager", {
  privileges: [
    {
      resource: { db: "myDatabase", collection: "orders" },
      actions: ["find", "insert", "update", "remove"]
    },
    {
      resource: { db: "myDatabase", collection: "customers" },
      actions: ["find"]
    },
    // New privilege
    {
      resource: { db: "myDatabase", collection: "inventory" },
      actions: ["find", "update"]
    }
  ]
});

// Grant privileges to role
db.grantPrivilegesToRole("ordersManager", [
  {
    resource: { db: "myDatabase", collection: "shipping" },
    actions: ["find", "update"]
  }
]);

// Revoke privileges from role
db.revokePrivilegesFromRole("ordersManager", [
  {
    resource: { db: "myDatabase", collection: "shipping" },
    actions: ["update"]
  }
]);

// Grant roles to role (inheritance)
db.grantRolesToRole("dataScientist", [
  { role: "read", db: "reports" }
]);

// Revoke inherited roles
db.revokeRolesFromRole("dataScientist", [
  { role: "read", db: "reports" }
]);

// ===== DELETE ROLE =====

db.dropRole("readOnlyProducts");

// ===== ASSIGN CUSTOM ROLE TO USER =====

// Create user with custom role
db.createUser({
  user: "analyst",
  pwd: "password123",
  roles: [
    { role: "dataScientist", db: "admin" }
  ]
});

// Grant custom role to existing user
db.grantRolesToUser("analyst", [
  { role: "reportingRole", db: "admin" }
]);`}</code>
                  </pre>
                </div>

                {/* Practical Examples */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    3. Practical RBAC Patterns
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== APPLICATION USER =====

// Read-write access to app database only
db.createUser({
  user: "appService",
  pwd: "appPassword",
  roles: [
    { role: "readWrite", db: "myApp" }
  ]
});

// ===== READ-ONLY USER =====

// Analytics user - read only
db.createUser({
  user: "analyticsUser",
  pwd: "analyticsPassword",
  roles: [
    { role: "read", db: "myApp" },
    { role: "read", db: "analytics" }
  ]
});

// ===== MULTI-TENANT USER =====

// Tenant-specific role
db.createRole({
  role: "tenant1User",
  privileges: [
    {
      resource: { db: "myApp", collection: "tenant1_data" },
      actions: ["find", "insert", "update", "remove"]
    }
  ],
  roles: []
});

db.createUser({
  user: "tenant1",
  pwd: "tenant1Password",
  roles: [
    { role: "tenant1User", db: "admin" }
  ]
});

// ===== BACKUP USER =====

db.createUser({
  user: "backupUser",
  pwd: "backupPassword",
  roles: [
    { role: "backup", db: "admin" },
    { role: "clusterMonitor", db: "admin" }
  ]
});

// ===== MONITORING USER =====

db.createUser({
  user: "monitorUser",
  pwd: "monitorPassword",
  roles: [
    { role: "clusterMonitor", db: "admin" },
    { role: "read", db: "local" }  // Read oplog
  ]
});

// ===== DBA USER =====

db.createUser({
  user: "dbaUser",
  pwd: "dbaPassword",
  roles: [
    { role: "root", db: "admin" }  // All privileges
  ]
});

// Or more restrictive DBA
db.createUser({
  user: "dbAdmin",
  pwd: "dbAdminPassword",
  roles: [
    { role: "dbAdminAnyDatabase", db: "admin" },
    { role: "readWriteAnyDatabase", db: "admin" },
    { role: "userAdminAnyDatabase", db: "admin" },
    { role: "clusterAdmin", db: "admin" }
  ]
});

// ===== DEVELOPER USER =====

// Development environment - full access to dev database
db.createUser({
  user: "developer",
  pwd: "devPassword",
  roles: [
    { role: "dbOwner", db: "myApp_dev" }
  ]
});

// ===== PROGRAMMATIC ROLE MANAGEMENT =====

const { MongoClient } = require("mongodb");

async function setupRoles() {
  const client = new MongoClient(
    "mongodb://admin:password@localhost:27017/?authSource=admin"
  );
  
  await client.connect();
  const adminDb = client.db("admin");
  
  // Create custom role
  await adminDb.command({
    createRole: "customRole",
    privileges: [
      {
        resource: { db: "myDatabase", collection: "users" },
        actions: ["find", "update"]
      }
    ],
    roles: []
  });
  
  // Create user with role
  await adminDb.command({
    createUser: "customUser",
    pwd: "password",
    roles: [
      { role: "customRole", db: "admin" }
    ]
  });
  
  await client.close();
}

await setupRoles();`}</code>
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
                  <strong>Always enable authentication:</strong> Even in
                  development
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Use SCRAM-SHA-256:</strong> Default, most secure
                  password auth
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Strong passwords:</strong> Minimum 12 characters,
                  mixed case, numbers, symbols
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Principle of least privilege:</strong> Grant minimum
                  required permissions
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Separate app and admin users:</strong> Don&apos;t use
                  admin for applications
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Database-specific users:</strong> Limit scope to
                  required databases
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Custom roles:</strong> Create role for each
                  application/service
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Regular audits:</strong> Review users and roles
                  periodically
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Remove unused accounts:</strong> Delete old users
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Use x.509 for internal cluster auth:</strong> More
                  secure than passwords
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
              href="/phase10/encryption-auditing"
              className="bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-500 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              Next: Encryption & Auditing →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
