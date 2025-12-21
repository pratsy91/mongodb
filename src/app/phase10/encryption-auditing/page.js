"use client";

import Link from "next/link";
import { useState } from "react";

export default function EncryptionAuditingPage() {
  const [activeTab, setActiveTab] = useState("tlsEncryption");

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
          Encryption & Auditing
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Data protection and security monitoring
        </p>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 flex-wrap">
          <button
            onClick={() => setActiveTab("tlsEncryption")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "tlsEncryption"
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            TLS/In-Transit
          </button>
          <button
            onClick={() => setActiveTab("atRestEncryption")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "atRestEncryption"
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            At-Rest Encryption
          </button>
          <button
            onClick={() => setActiveTab("fieldLevel")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "fieldLevel"
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Field-Level Encryption
          </button>
          <button
            onClick={() => setActiveTab("auditing")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "auditing"
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Auditing
          </button>
        </div>

        <div className="space-y-8">
          {/* TLS Encryption Tab */}
          {activeTab === "tlsEncryption" && (
            <>
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  📚 TLS/SSL Encryption Theory
                </h2>

                <div className="space-y-4 text-gray-200">
                  <p className="text-lg">
                    <strong>TLS/SSL</strong> encrypts data in transit between
                    clients and servers, protecting against eavesdropping.
                  </p>

                  <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                    TLS Modes
                  </h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong>disabled:</strong> No TLS (default, insecure)
                    </li>
                    <li>
                      <strong>allowTLS:</strong> Accepts TLS and non-TLS
                      connections
                    </li>
                    <li>
                      <strong>preferTLS:</strong> Prefers TLS, falls back to
                      non-TLS
                    </li>
                    <li>
                      <strong>requireTLS:</strong> Requires TLS for all
                      connections
                    </li>
                  </ul>

                  <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                    What Gets Encrypted
                  </h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Client-server communication</li>
                    <li>Replica set member communication</li>
                    <li>Sharded cluster communication (mongos ↔ shards)</li>
                    <li>Config server communication</li>
                  </ul>
                </div>
              </section>

              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  TLS/SSL Configuration
                </h2>

                {/* Setup TLS */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    1. Setup TLS/SSL
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== GENERATE CERTIFICATES =====

// 1. Create CA certificate
openssl req -x509 -newkey rsa:4096 -sha256 -days 365 \\
  -nodes -keyout ca-key.pem -out ca-cert.pem \\
  -subj "/CN=MyCA"

// 2. Create server certificate request
openssl req -newkey rsa:4096 -nodes \\
  -keyout server-key.pem -out server-req.pem \\
  -subj "/CN=mongodb.example.com"

// 3. Sign server certificate with CA
openssl x509 -req -in server-req.pem -days 365 \\
  -CA ca-cert.pem -CAkey ca-key.pem -CAcreateserial \\
  -out server-cert.pem -sha256

// 4. Combine certificate and key
cat server-cert.pem server-key.pem > server.pem

// ===== START MONGODB WITH TLS =====

// Command line
mongod --tlsMode requireTLS \\
  --tlsCertificateKeyFile /path/to/server.pem \\
  --tlsCAFile /path/to/ca-cert.pem \\
  --dbpath /data/db

// Configuration file (mongod.conf)
/*
net:
  port: 27017
  tls:
    mode: requireTLS
    certificateKeyFile: /path/to/server.pem
    CAFile: /path/to/ca-cert.pem
    allowConnectionsWithoutCertificates: false
*/

// ===== CONNECT WITH TLS =====

// MongoDB shell
mongosh --tls \\
  --host mongodb.example.com \\
  --tlsCAFile /path/to/ca-cert.pem \\
  --tlsCertificateKeyFile /path/to/client.pem

// MongoDB Native Driver
const { MongoClient } = require("mongodb");
const fs = require("fs");

const client = new MongoClient("mongodb://mongodb.example.com:27017", {
  tls: true,
  tlsCAFile: "/path/to/ca-cert.pem",
  tlsCertificateKeyFile: "/path/to/client.pem"
});

await client.connect();
console.log("Connected with TLS");
await client.close();

// Mongoose
const mongoose = require("mongoose");

await mongoose.connect("mongodb://mongodb.example.com:27017/myDatabase", {
  tls: true,
  tlsCAFile: "/path/to/ca-cert.pem",
  tlsCertificateKeyFile: "/path/to/client.pem"
});

await mongoose.disconnect();`}</code>
                  </pre>
                </div>

                {/* Replica Set TLS */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    2. TLS for Replica Sets
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== CLUSTER FILE FOR INTERNAL AUTH =====

// Create cluster authentication key
openssl rand -base64 756 > mongodb-keyfile
chmod 400 mongodb-keyfile

// Or use x.509 for internal auth

// ===== CONFIGURE REPLICA SET WITH TLS =====

// Each member config (mongod.conf)
/*
net:
  port: 27017
  tls:
    mode: requireTLS
    certificateKeyFile: /path/to/member.pem
    CAFile: /path/to/ca-cert.pem
    clusterFile: /path/to/cluster.pem  # For internal communication
    
security:
  authorization: enabled
  clusterAuthMode: x509
  keyFile: /path/to/mongodb-keyfile  # If using keyfile
*/

// ===== CLIENT CONNECTION =====

// Connection string with TLS
const uri = "mongodb://host1:27017,host2:27017,host3:27017/?replicaSet=rs0&tls=true&tlsCAFile=/path/to/ca-cert.pem";

const client = new MongoClient(uri);
await client.connect();`}</code>
                  </pre>
                </div>

                {/* TLS Options */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    3. Advanced TLS Options
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== CONFIGURATION OPTIONS =====

// mongod.conf (complete TLS configuration)
/*
net:
  tls:
    mode: requireTLS
    certificateKeyFile: /path/to/server.pem
    certificateKeyFilePassword: "password"  # If cert is encrypted
    CAFile: /path/to/ca-cert.pem
    CRLFile: /path/to/crl.pem  # Certificate Revocation List
    allowConnectionsWithoutCertificates: false
    allowInvalidCertificates: false
    allowInvalidHostnames: false
    disabledProtocols: TLS1_0,TLS1_1  # Disable old protocols
    clusterFile: /path/to/cluster.pem
    clusterCAFile: /path/to/cluster-ca.pem
*/

// ===== VALIDATE CERTIFICATES =====

// Test certificate
openssl x509 -in server-cert.pem -text -noout

// Verify certificate chain
openssl verify -CAfile ca-cert.pem server-cert.pem

// Test TLS connection
openssl s_client -connect mongodb.example.com:27017 \\
  -CAfile ca-cert.pem -showcerts

// ===== MONGODB DRIVER OPTIONS =====

const client = new MongoClient(uri, {
  tls: true,
  tlsCAFile: "/path/to/ca-cert.pem",
  tlsCertificateKeyFile: "/path/to/client.pem",
  tlsCertificateKeyFilePassword: "password",
  tlsAllowInvalidCertificates: false,
  tlsAllowInvalidHostnames: false,
  tlsInsecure: false  // Don't skip validation
});`}</code>
                  </pre>
                </div>
              </section>
            </>
          )}

          {/* At-Rest Encryption Tab */}
          {activeTab === "atRestEncryption" && (
            <>
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  📚 Encryption at Rest Theory
                </h2>

                <div className="space-y-4 text-gray-200">
                  <p className="text-lg">
                    <strong>Encryption at Rest</strong> protects data stored on
                    disk (Enterprise/Atlas feature).
                  </p>

                  <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                    What Gets Encrypted
                  </h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Data files</li>
                    <li>Journal files</li>
                    <li>Index files</li>
                    <li>Metadata</li>
                  </ul>

                  <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                    Key Management
                  </h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong>Local Key:</strong> Key stored locally (testing
                      only)
                    </li>
                    <li>
                      <strong>KMIP:</strong> Key Management Interoperability
                      Protocol
                    </li>
                    <li>
                      <strong>AWS KMS:</strong> Amazon Key Management Service
                    </li>
                    <li>
                      <strong>Azure Key Vault:</strong> Microsoft Azure
                    </li>
                    <li>
                      <strong>GCP KMS:</strong> Google Cloud Platform
                    </li>
                  </ul>
                </div>
              </section>

              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  Encryption at Rest Configuration
                </h2>

                {/* Local Key */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    1. Local Key (Development/Testing)
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== MONGODB ENTERPRISE ONLY =====

// Generate local key
openssl rand -base64 32 > mongodb-keyfile

// Start MongoDB with encryption
mongod --enableEncryption \\
  --encryptionKeyFile /path/to/mongodb-keyfile \\
  --dbpath /data/db

// Configuration file
/*
security:
  enableEncryption: true
  encryptionKeyFile: /path/to/mongodb-keyfile
  encryptionCipherMode: AES256-CBC  # or AES256-GCM
*/

// ===== WARNING =====
// Local key storage is NOT recommended for production
// Use KMIP or cloud KMS for production`}</code>
                  </pre>
                </div>

                {/* KMIP */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    2. KMIP Key Management
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== KMIP CONFIGURATION =====

// Configuration file
/*
security:
  enableEncryption: true
  kmip:
    serverName: kmip.example.com
    port: 5696
    clientCertificateFile: /path/to/client.pem
    serverCAFile: /path/to/ca.pem
    keyIdentifier: "myMongoDBKey"  # Optional
*/

// Start MongoDB
mongod --config /path/to/mongod.conf --dbpath /data/db

// ===== KEY ROTATION =====

// Rotate master key
db.adminCommand({
  rotateMasterKey: 1
});

// MongoDB will:
// 1. Get new key from KMIP
// 2. Re-encrypt database keys
// 3. Update metadata`}</code>
                  </pre>
                </div>

                {/* AWS KMS */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    3. AWS KMS
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== AWS KMS CONFIGURATION =====

// Configuration file
/*
security:
  enableEncryption: true
  kmip:
    serverName: kms.us-east-1.amazonaws.com
    port: 443
    clientCertificateFile: /path/to/client.pem
    serverCAFile: /path/to/aws-ca.pem
*/

// Or use AWS CLI to configure

// Environment variables
export AWS_ACCESS_KEY_ID="your-access-key"
export AWS_SECRET_ACCESS_KEY="your-secret-key"
export AWS_REGION="us-east-1"

// ===== MONGODB ATLAS =====

// Encryption at rest enabled by default
// Managed through Atlas UI
// Supports AWS KMS, Azure Key Vault, GCP KMS

// Atlas configuration:
/*
1. Navigate to Security → Encryption at Rest
2. Choose cloud provider KMS
3. Provide IAM role/credentials
4. Select master key
5. Enable encryption
*/`}</code>
                  </pre>
                </div>
              </section>
            </>
          )}

          {/* Field-Level Encryption Tab */}
          {activeTab === "fieldLevel" && (
            <>
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  📚 Field-Level Encryption Theory
                </h2>

                <div className="space-y-4 text-gray-200">
                  <p className="text-lg">
                    <strong>Field-Level Encryption</strong> encrypts specific
                    fields before sending to MongoDB.
                  </p>

                  <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                    Types
                  </h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong>Manual FLE:</strong> Application handles
                      encryption
                    </li>
                    <li>
                      <strong>Automatic FLE:</strong> Driver handles encryption
                      (CSFLE)
                    </li>
                  </ul>

                  <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                    Client-Side Field Level Encryption (CSFLE)
                  </h3>
                  <p>MongoDB 4.2+ Enterprise/Atlas feature:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      Encryption happens in driver before sending to server
                    </li>
                    <li>Server never sees unencrypted data</li>
                    <li>Supports deterministic and random encryption</li>
                    <li>Automatic decryption on read</li>
                  </ul>

                  <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                    Encryption Algorithms
                  </h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong>Deterministic:</strong> Same value → same
                      ciphertext (allows equality queries)
                    </li>
                    <li>
                      <strong>Random:</strong> Same value → different ciphertext
                      (more secure)
                    </li>
                  </ul>
                </div>
              </section>

              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  Field-Level Encryption Examples
                </h2>

                {/* Manual Encryption */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    1. Manual Encryption
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== MANUAL FIELD ENCRYPTION =====

const crypto = require("crypto");

// Generate key
const key = crypto.randomBytes(32);
const algorithm = "aes-256-gcm";

// Encrypt function
function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  
  const authTag = cipher.getAuthTag();
  
  return {
    iv: iv.toString("hex"),
    encryptedData: encrypted,
    authTag: authTag.toString("hex")
  };
}

// Decrypt function
function decrypt(encrypted) {
  const decipher = crypto.createDecipheriv(
    algorithm,
    key,
    Buffer.from(encrypted.iv, "hex")
  );
  
  decipher.setAuthTag(Buffer.from(encrypted.authTag, "hex"));
  
  let decrypted = decipher.update(encrypted.encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");
  
  return decrypted;
}

// ===== USE WITH MONGODB =====

const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://localhost:27017");
await client.connect();

const db = client.db("myDatabase");
const collection = db.collection("users");

// Insert with encrypted field
const ssn = "123-45-6789";
const encryptedSSN = encrypt(ssn);

await collection.insertOne({
  name: "John Doe",
  ssn: encryptedSSN,  // Encrypted
  email: "john@example.com"  // Not encrypted
});

// Read and decrypt
const user = await collection.findOne({ name: "John Doe" });
const decryptedSSN = decrypt(user.ssn);
console.log("SSN:", decryptedSSN);

await client.close();`}</code>
                  </pre>
                </div>

                {/* CSFLE Setup */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    2. Client-Side Field Level Encryption (CSFLE)
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== INSTALL DEPENDENCIES =====

// npm install mongodb-client-encryption

// ===== SETUP CSFLE =====

const { MongoClient } = require("mongodb");
const { ClientEncryption } = require("mongodb-client-encryption");

// Generate data encryption key
const localKey = require("crypto").randomBytes(96);

// KMS configuration (local for demo)
const kmsProviders = {
  local: {
    key: localKey
  }
};

// Schema map
const schemaMap = {
  "myDatabase.users": {
    bsonType: "object",
    properties: {
      ssn: {
        encrypt: {
          bsonType: "string",
          algorithm: "AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic",
          keyId: [/* Data Encryption Key UUID */]
        }
      },
      creditCard: {
        encrypt: {
          bsonType: "string",
          algorithm: "AEAD_AES_256_CBC_HMAC_SHA_512-Random"
        }
      }
    }
  }
};

// Client with encryption
const client = new MongoClient("mongodb://localhost:27017", {
  autoEncryption: {
    keyVaultNamespace: "encryption.__keyVault",
    kmsProviders: kmsProviders,
    schemaMap: schemaMap
  }
});

await client.connect();

// ===== CREATE DATA ENCRYPTION KEY =====

const encryption = new ClientEncryption(client, {
  keyVaultNamespace: "encryption.__keyVault",
  kmsProviders: kmsProviders
});

const dataKeyId = await encryption.createDataKey("local");
console.log("Data Key ID:", dataKeyId);

// ===== INSERT WITH AUTO ENCRYPTION =====

const db = client.db("myDatabase");
const users = db.collection("users");

// Fields are automatically encrypted
await users.insertOne({
  name: "John Doe",
  ssn: "123-45-6789",  // Encrypted deterministically
  creditCard: "4111-1111-1111-1111",  // Encrypted randomly
  email: "john@example.com"  // Not encrypted
});

// ===== QUERY ENCRYPTED FIELDS =====

// Can query deterministic fields
const user = await users.findOne({
  ssn: "123-45-6789"  // Automatically encrypted for query
});

console.log(user);  // Automatically decrypted
// Output:
/*
{
  _id: ObjectId("..."),
  name: "John Doe",
  ssn: "123-45-6789",  // Decrypted
  creditCard: "4111-1111-1111-1111",  // Decrypted
  email: "john@example.com"
}
*/

// Cannot query random encrypted fields
// This will not work:
const user2 = await users.findOne({
  creditCard: "4111-1111-1111-1111"  // No match (random encryption)
});

await client.close();`}</code>
                  </pre>
                </div>

                {/* AWS KMS CSFLE */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    3. CSFLE with AWS KMS
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== AWS KMS CONFIGURATION =====

const kmsProviders = {
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
};

// Master key configuration
const masterKey = {
  region: "us-east-1",
  key: "arn:aws:kms:us-east-1:123456789:key/abc-123-def-456",
  endpoint: "kms.us-east-1.amazonaws.com"
};

// Create client encryption
const encryption = new ClientEncryption(client, {
  keyVaultNamespace: "encryption.__keyVault",
  kmsProviders: kmsProviders
});

// Create data key with AWS KMS
const dataKeyId = await encryption.createDataKey("aws", {
  masterKey: masterKey
});

// ===== CLIENT CONFIGURATION =====

const client = new MongoClient(uri, {
  autoEncryption: {
    keyVaultNamespace: "encryption.__keyVault",
    kmsProviders: kmsProviders,
    extraOptions: {
      mongocryptdSpawnPath: "/usr/local/bin/mongocryptd"
    }
  }
});

// ===== EXPLICIT ENCRYPTION =====

// For more control, use explicit encryption
const encryptedValue = await encryption.encrypt("sensitive-data", {
  keyId: dataKeyId,
  algorithm: "AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic"
});

await collection.insertOne({
  name: "Jane",
  secretField: encryptedValue
});

// Explicit decryption
const doc = await collection.findOne({ name: "Jane" });
const decryptedValue = await encryption.decrypt(doc.secretField);
console.log(decryptedValue);`}</code>
                  </pre>
                </div>
              </section>
            </>
          )}

          {/* Auditing Tab */}
          {activeTab === "auditing" && (
            <>
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  📚 Auditing Theory
                </h2>

                <div className="space-y-4 text-gray-200">
                  <p className="text-lg">
                    <strong>Auditing</strong> records database activities for
                    compliance and security (Enterprise feature).
                  </p>

                  <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                    Audited Events
                  </h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Authentication and authorization</li>
                    <li>CRUD operations</li>
                    <li>DDL operations (create/drop database/collection)</li>
                    <li>User and role management</li>
                    <li>Replica set operations</li>
                    <li>Sharding operations</li>
                  </ul>

                  <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                    Audit Destinations
                  </h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong>Console:</strong> Standard output
                    </li>
                    <li>
                      <strong>File:</strong> JSON or BSON file
                    </li>
                    <li>
                      <strong>Syslog:</strong> System log facility
                    </li>
                  </ul>
                </div>
              </section>

              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  Auditing Configuration
                </h2>

                {/* Enable Auditing */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    1. Enable Auditing
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== MONGODB ENTERPRISE ONLY =====

// Start with auditing enabled
mongod --dbpath /data/db \\
  --auditDestination file \\
  --auditFormat JSON \\
  --auditPath /var/log/mongodb/audit.json

// Configuration file
/*
auditLog:
  destination: file
  format: JSON
  path: /var/log/mongodb/audit.json
  filter: '{ atype: { $in: ["authenticate", "authCheck"] } }'
*/

// ===== AUDIT TO SYSLOG =====

// Configuration
/*
auditLog:
  destination: syslog
*/

// ===== AUDIT TO CONSOLE =====

// Configuration
/*
auditLog:
  destination: console
  format: JSON
*/`}</code>
                  </pre>
                </div>

                {/* Audit Filters */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    2. Audit Filters
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== FILTER BY ACTION TYPE =====

// Audit only authentication events
/*
auditLog:
  filter: '{ atype: "authenticate" }'
*/

// Multiple action types
/*
auditLog:
  filter: '{ atype: { $in: ["authenticate", "logout"] } }'
*/

// ===== FILTER BY USER =====

// Audit specific user
/*
auditLog:
  filter: '{ "users.user": "admin" }'
*/

// ===== FILTER BY DATABASE =====

// Audit specific database
/*
auditLog:
  filter: '{ "param.ns": /^myDatabase\\./ }'
*/

// ===== FILTER BY OPERATION =====

// Audit write operations
/*
auditLog:
  filter: '{
    atype: "authCheck",
    "param.command": { $in: ["insert", "update", "delete"] }
  }'
*/

// ===== COMPLEX FILTERS =====

// Audit failed authorization
/*
auditLog:
  filter: '{
    atype: "authCheck",
    result: { $ne: 0 }
  }'
*/

// Audit DDL operations
/*
auditLog:
  filter: '{
    atype: { $in: ["createCollection", "dropCollection", "dropDatabase"] }
  }'
*/

// Audit sensitive collections
/*
auditLog:
  filter: '{
    $or: [
      { "param.ns": "myDatabase.users" },
      { "param.ns": "myDatabase.payments" },
      { "param.ns": "myDatabase.secrets" }
    ]
  }'
*/

// ===== RUNTIME FILTER UPDATE =====

// Update filter without restart
db.adminCommand({
  setParameter: 1,
  auditAuthorizationSuccess: true
});`}</code>
                  </pre>
                </div>

                {/* Audit Log Format */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    3. Audit Log Format & Analysis
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== AUDIT LOG ENTRY STRUCTURE =====

// Example JSON audit entry
/*
{
  "atype": "authCheck",
  "ts": { "$date": "2024-01-15T10:30:00.000Z" },
  "local": { "ip": "127.0.0.1", "port": 27017 },
  "remote": { "ip": "192.168.1.100", "port": 54321 },
  "users": [
    { "user": "appUser", "db": "admin" }
  ],
  "roles": [
    { "role": "readWrite", "db": "myDatabase" }
  ],
  "param": {
    "command": "find",
    "ns": "myDatabase.users",
    "args": { "find": "users", "filter": { "active": true } }
  },
  "result": 0  // 0 = success, non-zero = failure
}
*/

// ===== AUDIT EVENT TYPES =====

/*
Authentication:
- authenticate: Login attempt
- logout: User logout

Authorization:
- authCheck: Permission check

CRUD:
- insert, update, delete, find

DDL:
- createDatabase, dropDatabase
- createCollection, dropCollection
- createIndex, dropIndex

User Management:
- createUser, updateUser, dropUser
- createRole, updateRole, dropRole
- grantRolesToUser, revokeRolesFromUser

Replication:
- replSetReconfig
- replSetGetStatus

Sharding:
- shardCollection
- addShard, removeShard
*/

// ===== ANALYZE AUDIT LOGS =====

// Parse and analyze (Node.js)
const fs = require("fs");
const readline = require("readline");

async function analyzeAuditLog(filePath) {
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const stats = {
    totalEvents: 0,
    failedAuth: 0,
    writeOperations: 0,
    ddlOperations: 0,
    usersByActivity: {}
  };

  for await (const line of rl) {
    const event = JSON.parse(line);
    stats.totalEvents++;

    // Failed authentication
    if (event.atype === "authenticate" && event.result !== 0) {
      stats.failedAuth++;
    }

    // Write operations
    if (["insert", "update", "delete"].includes(event.param?.command)) {
      stats.writeOperations++;
    }

    // DDL operations
    if (["createCollection", "dropCollection", "dropDatabase"]
        .includes(event.atype)) {
      stats.ddlOperations++;
    }

    // User activity
    const user = event.users?.[0]?.user;
    if (user) {
      stats.usersByActivity[user] = (stats.usersByActivity[user] || 0) + 1;
    }
  }

  return stats;
}

// Usage
const stats = await analyzeAuditLog("/var/log/mongodb/audit.json");
console.log("Audit Statistics:", stats);

// ===== QUERY AUDIT LOGS (IF STORED IN MONGODB) =====

// Store audit logs in MongoDB for querying
const auditCollection = db.collection("auditLogs");

// Find failed authentication attempts
const failedLogins = await auditCollection.find({
  atype: "authenticate",
  result: { $ne: 0 }
}).toArray();

// Find operations by user
const userActivity = await auditCollection.find({
  "users.user": "appUser"
}).sort({ ts: -1 }).limit(100).toArray();

// Count operations by type
const operationStats = await auditCollection.aggregate([
  {
    $group: {
      _id: "$atype",
      count: { $sum: 1 }
    }
  },
  { $sort: { count: -1 } }
]).toArray();`}</code>
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
                  <strong>Always use TLS/SSL:</strong> Encrypt all network
                  communication
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Enable at-rest encryption:</strong> For sensitive data
                  (Enterprise/Atlas)
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Use cloud KMS:</strong> AWS/Azure/GCP for key
                  management
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Rotate keys regularly:</strong> Master keys and data
                  encryption keys
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Use CSFLE for PII:</strong> Encrypt sensitive fields
                  client-side
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Deterministic for queries:</strong> Only when equality
                  queries needed
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Enable auditing:</strong> For compliance and security
                  monitoring
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Filter audit logs:</strong> Focus on critical events
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Monitor audit logs:</strong> Regular review and alerts
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Secure audit logs:</strong> Protect from unauthorized
                  access
                </span>
              </li>
            </ul>
          </section>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8">
            <Link
              href="/phase10/authentication-authorization"
              className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              ← Previous: Authentication & Authorization
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
