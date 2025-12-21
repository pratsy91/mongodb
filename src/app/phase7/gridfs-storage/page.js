"use client";

import Link from "next/link";
import { useState } from "react";

export default function GridFSStoragePage() {
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
          GridFS & Large File Storage
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Storing and retrieving large files with GridFS
        </p>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 flex-wrap">
          <button
            onClick={() => setActiveTab("mongodb")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "mongodb"
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            MongoDB Native
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
              📚 GridFS Theory
            </h2>

            <div className="space-y-4 text-gray-200">
              <p className="text-lg">
                <strong>GridFS</strong> is MongoDB's specification for storing
                and retrieving files larger than the 16MB BSON document size
                limit.
              </p>

              <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                How GridFS Works
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Chunks:</strong> Files divided into 255KB chunks
                  (configurable)
                </li>
                <li>
                  <strong>Two Collections:</strong> files (metadata) and chunks
                  (binary data)
                </li>
                <li>
                  <strong>Streams:</strong> Supports streaming upload and
                  download
                </li>
                <li>
                  <strong>Metadata:</strong> Store custom metadata with files
                </li>
              </ul>

              <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                When to Use GridFS
              </h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Files larger than 16MB</li>
                <li>
                  Need to access portions of files without loading entire file
                </li>
                <li>Want to keep files and metadata synchronized</li>
                <li>Automatic sharding of large files</li>
              </ul>

              <h3 className="text-2xl font-semibold text-purple-300 mt-6">
                Collections Structure
              </h3>
              <pre className="bg-black/50 p-4 rounded-lg text-sm mt-4">
                <code>{`// fs.files collection
{
  _id: ObjectId("..."),
  length: 1024,
  chunkSize: 261120,
  uploadDate: ISODate("..."),
  filename: "example.txt",
  metadata: { ... }
}

// fs.chunks collection
{
  _id: ObjectId("..."),
  files_id: ObjectId("..."),
  n: 0,  // chunk number
  data: BinData(...)
}`}</code>
              </pre>
            </div>
          </section>

          {/* MongoDB Native Tab */}
          {activeTab === "mongodb" && (
            <>
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  MongoDB Native Driver Examples
                </h2>

                {/* Upload Files */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    1. Upload Files
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`const { MongoClient, GridFSBucket } = require("mongodb");
const fs = require("fs");

const client = new MongoClient("mongodb://localhost:27017");
await client.connect();

const db = client.db("filesDatabase");

// ===== CREATE GRIDFS BUCKET =====

const bucket = new GridFSBucket(db, {
  bucketName: "uploads",  // Default is "fs"
  chunkSizeBytes: 255 * 1024  // 255KB default
});

// ===== UPLOAD FILE FROM STREAM =====

const uploadStream = bucket.openUploadStream("example.pdf", {
  metadata: {
    contentType: "application/pdf",
    uploadedBy: "user123",
    tags: ["document", "important"]
  }
});

fs.createReadStream("./example.pdf")
  .pipe(uploadStream)
  .on("error", (error) => {
    console.error("Upload error:", error);
  })
  .on("finish", () => {
    console.log("Upload complete:", uploadStream.id);
  });

// ===== UPLOAD FILE WITH BUFFER =====

const fileBuffer = fs.readFileSync("./image.jpg");

const uploadStream2 = bucket.openUploadStream("image.jpg", {
  metadata: {
    contentType: "image/jpeg",
    width: 1920,
    height: 1080
  }
});

uploadStream2.end(fileBuffer);

uploadStream2.on("finish", () => {
  console.log("File uploaded:", uploadStream2.id);
});

// ===== UPLOAD WITH CUSTOM ID =====

const customId = new ObjectId();

const uploadStream3 = bucket.openUploadStreamWithId(
  customId,
  "custom-id-file.txt",
  {
    metadata: { description: "File with custom ID" }
  }
);

fs.createReadStream("./file.txt").pipe(uploadStream3);`}</code>
                  </pre>
                </div>

                {/* Download Files */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    2. Download Files
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== DOWNLOAD BY ID =====

const fileId = new ObjectId("...");

const downloadStream = bucket.openDownloadStream(fileId);

downloadStream
  .pipe(fs.createWriteStream("./downloaded.pdf"))
  .on("error", (error) => {
    console.error("Download error:", error);
  })
  .on("finish", () => {
    console.log("Download complete");
  });

// ===== DOWNLOAD BY FILENAME =====

const downloadByName = bucket.openDownloadStreamByName("example.pdf");

downloadByName.pipe(fs.createWriteStream("./example-copy.pdf"));

// Get specific revision (-1 for latest)
const latestRevision = bucket.openDownloadStreamByName("example.pdf", {
  revision: -1
});

// ===== DOWNLOAD TO BUFFER =====

async function downloadToBuffer(fileId) {
  const downloadStream = bucket.openDownloadStream(fileId);
  
  const chunks = [];
  
  for await (const chunk of downloadStream) {
    chunks.push(chunk);
  }
  
  return Buffer.concat(chunks);
}

const buffer = await downloadToBuffer(fileId);
console.log("File size:", buffer.length);

// ===== DOWNLOAD RANGE =====

// Download specific byte range
const partialDownload = bucket.openDownloadStream(fileId, {
  start: 0,
  end: 1024  // First 1KB
});

partialDownload.pipe(fs.createWriteStream("./partial.pdf"));`}</code>
                  </pre>
                </div>

                {/* Find & List Files */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    3. Find & List Files
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== FIND FILES =====

const files = await bucket
  .find({ "metadata.contentType": "application/pdf" })
  .toArray();

console.log("PDF files:", files.map(f => ({
  id: f._id,
  filename: f.filename,
  size: f.length,
  uploadDate: f.uploadDate
})));

// ===== FIND WITH QUERY =====

const recentFiles = await bucket
  .find({
    uploadDate: { $gte: new Date("2024-01-01") }
  })
  .sort({ uploadDate: -1 })
  .limit(10)
  .toArray();

// ===== FIND BY METADATA =====

const userFiles = await bucket
  .find({
    "metadata.uploadedBy": "user123",
    "metadata.tags": "important"
  })
  .toArray();

// ===== GET FILE INFO =====

async function getFileInfo(fileId) {
  const files = await bucket.find({ _id: fileId }).toArray();
  return files[0];
}

const info = await getFileInfo(fileId);
console.log("File info:", {
  filename: info.filename,
  size: info.length,
  chunkSize: info.chunkSize,
  uploadDate: info.uploadDate,
  metadata: info.metadata
});

// ===== LIST ALL FILES =====

const allFiles = await bucket.find({}).toArray();

for (const file of allFiles) {
  console.log(\`\${file.filename} - \${file.length} bytes\`);
}`}</code>
                  </pre>
                </div>

                {/* Delete & Rename */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    4. Delete & Rename Files
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== DELETE FILE =====

await bucket.delete(fileId);
console.log("File deleted");

// ===== DELETE BY FILTER =====

// Get file ID first
const filesToDelete = await bucket
  .find({ "metadata.tags": "temp" })
  .toArray();

for (const file of filesToDelete) {
  await bucket.delete(file._id);
}

// ===== RENAME FILE =====

await bucket.rename(fileId, "new-filename.pdf");

// ===== DROP BUCKET =====

// Delete all files and chunks
await bucket.drop();

// ===== CLEANUP OLD FILES =====

async function deleteOldFiles(days) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  const oldFiles = await bucket.find({
    uploadDate: { $lt: cutoffDate }
  }).toArray();
  
  for (const file of oldFiles) {
    await bucket.delete(file._id);
  }
  
  console.log(\`Deleted \${oldFiles.length} files\`);
}

await deleteOldFiles(30);  // Delete files older than 30 days

await client.close();`}</code>
                  </pre>
                </div>
              </section>
            </>
          )}

          {/* Mongoose Tab */}
          {activeTab === "mongoose" && (
            <>
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  Mongoose GridFS Examples
                </h2>

                {/* Setup */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    1. Setup & Configuration
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");
const fs = require("fs");

await mongoose.connect("mongodb://localhost:27017/filesDatabase");

// ===== CREATE BUCKET =====

let bucket;

mongoose.connection.on("connected", () => {
  bucket = new GridFSBucket(mongoose.connection.db, {
    bucketName: "uploads"
  });
});

// ===== FILE SCHEMA (OPTIONAL) =====

const fileSchema = new mongoose.Schema({
  filename: String,
  fileId: mongoose.Schema.Types.ObjectId,
  contentType: String,
  size: Number,
  uploadDate: { type: Date, default: Date.now },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

const File = mongoose.model("File", fileSchema);`}</code>
                  </pre>
                </div>

                {/* Upload with Mongoose */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    2. Upload with Mongoose
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== UPLOAD HELPER FUNCTION =====

async function uploadFile(filePath, filename, metadata) {
  return new Promise((resolve, reject) => {
    const uploadStream = bucket.openUploadStream(filename, {
      metadata
    });

    fs.createReadStream(filePath)
      .pipe(uploadStream)
      .on("error", reject)
      .on("finish", () => {
        resolve({
          id: uploadStream.id,
          filename,
          size: uploadStream.length
        });
      });
  });
}

// Usage
const result = await uploadFile(
  "./document.pdf",
  "document.pdf",
  {
    contentType: "application/pdf",
    uploadedBy: userId
  }
);

// Create reference in File collection
await File.create({
  filename: result.filename,
  fileId: result.id,
  contentType: "application/pdf",
  size: result.size,
  uploadedBy: userId
});

// ===== UPLOAD FROM BUFFER =====

async function uploadBuffer(buffer, filename, metadata) {
  return new Promise((resolve, reject) => {
    const uploadStream = bucket.openUploadStream(filename, {
      metadata
    });

    uploadStream.end(buffer);

    uploadStream.on("error", reject);
    uploadStream.on("finish", () => {
      resolve(uploadStream.id);
    });
  });
}

// ===== UPLOAD WITH EXPRESS =====

// Using multer
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const fileId = await uploadBuffer(
      req.file.buffer,
      req.file.originalname,
      {
        contentType: req.file.mimetype,
        uploadedBy: req.user.id
      }
    );

    await File.create({
      filename: req.file.originalname,
      fileId,
      contentType: req.file.mimetype,
      size: req.file.size,
      uploadedBy: req.user.id
    });

    res.json({ success: true, fileId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});`}</code>
                  </pre>
                </div>

                {/* Download with Mongoose */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    3. Download with Mongoose
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== DOWNLOAD HELPER =====

async function downloadFile(fileId, outputPath) {
  return new Promise((resolve, reject) => {
    const downloadStream = bucket.openDownloadStream(fileId);
    
    downloadStream
      .pipe(fs.createWriteStream(outputPath))
      .on("error", reject)
      .on("finish", resolve);
  });
}

// Usage
await downloadFile(fileId, "./downloaded.pdf");

// ===== DOWNLOAD TO BUFFER =====

async function getFileBuffer(fileId) {
  const downloadStream = bucket.openDownloadStream(fileId);
  const chunks = [];
  
  for await (const chunk of downloadStream) {
    chunks.push(chunk);
  }
  
  return Buffer.concat(chunks);
}

// ===== EXPRESS DOWNLOAD ENDPOINT =====

app.get("/download/:fileId", async (req, res) => {
  try {
    const fileDoc = await File.findOne({ fileId: req.params.fileId });
    
    if (!fileDoc) {
      return res.status(404).json({ error: "File not found" });
    }

    res.set({
      "Content-Type": fileDoc.contentType,
      "Content-Disposition": \`attachment; filename="\${fileDoc.filename}"\`
    });

    const downloadStream = bucket.openDownloadStream(
      mongoose.Types.ObjectId(req.params.fileId)
    );

    downloadStream.pipe(res);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== STREAM VIDEO/AUDIO =====

app.get("/stream/:fileId", async (req, res) => {
  try {
    const fileDoc = await File.findOne({ fileId: req.params.fileId });
    
    if (!fileDoc) {
      return res.status(404).json({ error: "File not found" });
    }

    const range = req.headers.range;
    
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileDoc.size - 1;
      const chunkSize = (end - start) + 1;

      res.writeHead(206, {
        "Content-Range": \`bytes \${start}-\${end}/\${fileDoc.size}\`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize,
        "Content-Type": fileDoc.contentType
      });

      const downloadStream = bucket.openDownloadStream(
        mongoose.Types.ObjectId(req.params.fileId),
        { start, end: end + 1 }
      );

      downloadStream.pipe(res);
    } else {
      res.writeHead(200, {
        "Content-Length": fileDoc.size,
        "Content-Type": fileDoc.contentType
      });

      const downloadStream = bucket.openDownloadStream(
        mongoose.Types.ObjectId(req.params.fileId)
      );

      downloadStream.pipe(res);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});`}</code>
                  </pre>
                </div>

                {/* Complete Example */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    4. Complete File Management System
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== FILE SERVICE =====

class FileService {
  constructor(bucket) {
    this.bucket = bucket;
  }

  async upload(buffer, filename, metadata) {
    const uploadStream = this.bucket.openUploadStream(filename, {
      metadata
    });

    uploadStream.end(buffer);

    return new Promise((resolve, reject) => {
      uploadStream.on("error", reject);
      uploadStream.on("finish", () => {
        resolve({
          id: uploadStream.id,
          filename,
          size: uploadStream.length
        });
      });
    });
  }

  async download(fileId) {
    const downloadStream = this.bucket.openDownloadStream(fileId);
    const chunks = [];
    
    for await (const chunk of downloadStream) {
      chunks.push(chunk);
    }
    
    return Buffer.concat(chunks);
  }

  async delete(fileId) {
    await this.bucket.delete(fileId);
  }

  async getInfo(fileId) {
    const files = await this.bucket.find({ _id: fileId }).toArray();
    return files[0];
  }

  async list(filter = {}) {
    return await this.bucket.find(filter).toArray();
  }
}

const fileService = new FileService(bucket);

// ===== USAGE WITH MONGOOSE MODELS =====

async function saveFile(buffer, filename, userId) {
  const result = await fileService.upload(buffer, filename, {
    uploadedBy: userId,
    uploadDate: new Date()
  });

  const file = await File.create({
    filename: result.filename,
    fileId: result.id,
    size: result.size,
    uploadedBy: userId
  });

  return file;
}

async function getUserFiles(userId) {
  const files = await File.find({ uploadedBy: userId })
    .populate("uploadedBy", "name email")
    .sort({ uploadDate: -1 });

  return files;
}

async function deleteFile(fileId, userId) {
  const file = await File.findOne({ fileId });

  if (!file) {
    throw new Error("File not found");
  }

  if (file.uploadedBy.toString() !== userId) {
    throw new Error("Unauthorized");
  }

  await fileService.delete(mongoose.Types.ObjectId(fileId));
  await File.deleteOne({ fileId });
}

await mongoose.disconnect();`}</code>
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
                  <strong>Use streams:</strong> Stream large files instead of
                  loading into memory
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Store metadata:</strong> Include content type, size,
                  and custom data
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Index metadata:</strong> Create indexes on frequently
                  queried fields
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Cleanup:</strong> Implement retention policies for old
                  files
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Error handling:</strong> Handle stream errors properly
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Validation:</strong> Validate file types and sizes
                  before upload
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Access control:</strong> Verify user permissions
                  before operations
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Chunk size:</strong> Adjust for your specific use case
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Range requests:</strong> Support partial content for
                  streaming
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>CDN integration:</strong> Consider CDN for frequently
                  accessed files
                </span>
              </li>
            </ul>
          </section>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8">
            <Link
              href="/phase7/geospatial-text"
              className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              ← Previous: Geospatial & Text
            </Link>
            <Link
              href="/phase7/special-collections"
              className="bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-500 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              Next: Special Collections →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
