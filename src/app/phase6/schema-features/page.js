"use client";

import Link from "next/link";
import { useState } from "react";

export default function SchemaFeaturesPage() {
  const [activeTab, setActiveTab] = useState("virtuals");

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
          Schema Features
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Virtuals, Methods, Statics, Query Helpers, and Middleware
        </p>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 flex-wrap">
          <button
            onClick={() => setActiveTab("virtuals")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "virtuals"
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Virtuals
          </button>
          <button
            onClick={() => setActiveTab("methods")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "methods"
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Methods & Statics
          </button>
          <button
            onClick={() => setActiveTab("middleware")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "middleware"
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Middleware
          </button>
        </div>

        <div className="space-y-8">
          {/* Virtuals Tab */}
          {activeTab === "virtuals" && (
            <>
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  Virtuals - Computed Properties
                </h2>

                {/* Basic Virtuals */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    1. Basic Virtuals (Getters)
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  age: Number
});

// Virtual getter
userSchema.virtual("fullName").get(function() {
  return \`\${this.firstName} \${this.lastName}\`;
});

// Virtual with calculation
userSchema.virtual("isAdult").get(function() {
  return this.age >= 18;
});

// Virtual with nested data
userSchema.virtual("emailDomain").get(function() {
  return this.email ? this.email.split("@")[1] : null;
});

const User = mongoose.model("User", userSchema);

// Usage
const user = new User({
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  age: 25
});

console.log(user.fullName);      // "John Doe"
console.log(user.isAdult);       // true
console.log(user.emailDomain);   // "example.com"

// Virtuals NOT saved to MongoDB
await user.save();  // Only saves firstName, lastName, email, age`}</code>
                  </pre>
                </div>

                {/* Virtual Setters */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    2. Virtual Setters
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`const personSchema = new mongoose.Schema({
  firstName: String,
  lastName: String
});

// Virtual with getter and setter
personSchema.virtual("fullName")
  .get(function() {
    return \`\${this.firstName} \${this.lastName}\`;
  })
  .set(function(v) {
    const parts = v.split(" ");
    this.firstName = parts[0];
    this.lastName = parts[parts.length - 1];
  });

const Person = mongoose.model("Person", personSchema);

// Using setter
const person = new Person();
person.fullName = "Jane Smith";

console.log(person.firstName);  // "Jane"
console.log(person.lastName);   // "Smith"
console.log(person.fullName);   // "Jane Smith"

await person.save();  // Saves firstName and lastName`}</code>
                  </pre>
                </div>

                {/* Virtual Populate */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    3. Virtual Populate
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`const authorSchema = new mongoose.Schema({
  name: String,
  email: String
});

// Virtual populate - no ref stored in document
authorSchema.virtual("posts", {
  ref: "Post",           // Model to use
  localField: "_id",     // Field in this model
  foreignField: "author" // Field in Post model
});

// Count virtual
authorSchema.virtual("postCount", {
  ref: "Post",
  localField: "_id",
  foreignField: "author",
  count: true  // Return count instead of documents
});

const Author = mongoose.model("Author", authorSchema);

const postSchema = new mongoose.Schema({
  title: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: "Author" }
});

const Post = mongoose.model("Post", postSchema);

// Query with virtual populate
const author = await Author.findOne({ name: "John" })
  .populate("posts")
  .populate("postCount");

console.log(author.posts);      // Array of Post documents
console.log(author.postCount);  // Number of posts

// With match
const activeAuthor = await Author.findOne({ name: "John" })
  .populate({
    path: "posts",
    match: { published: true },
    select: "title createdAt"
  });`}</code>
                  </pre>
                </div>

                {/* Aliases */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    4. Aliases
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`const productSchema = new mongoose.Schema({
  // Use alias for shorter property name
  n: {
    type: String,
    alias: "name"  // Create 'name' alias for 'n'
  },
  p: {
    type: Number,
    alias: "price"
  }
});

const Product = mongoose.model("Product", productSchema);

// Can use either name or alias
const product = new Product({
  name: "Laptop",
  price: 999
});

// Stored as 'n' and 'p' in database
console.log(product.n);      // "Laptop"
console.log(product.name);   // "Laptop" (alias)
console.log(product.p);      // 999
console.log(product.price);  // 999 (alias)

// Both work for queries
await Product.find({ name: "Laptop" });
await Product.find({ n: "Laptop" });

// Saves space in database
await product.save();  // Stores { n: "Laptop", p: 999 }`}</code>
                  </pre>
                </div>

                {/* Getters and Setters */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    5. Getters and Setters
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`const orderSchema = new mongoose.Schema({
  // Price stored in cents, displayed in dollars
  price: {
    type: Number,
    get: v => (v / 100).toFixed(2),
    set: v => Math.round(v * 100)
  },
  
  // Uppercase transformation
  code: {
    type: String,
    get: v => v.toUpperCase(),
    set: v => v.toUpperCase()
  },
  
  // Date formatting
  createdAt: {
    type: Date,
    get: v => v.toISOString(),
    set: v => new Date(v)
  },
  
  // Encryption (simplified)
  secret: {
    type: String,
    get: v => decrypt(v),
    set: v => encrypt(v)
  }
});

// Enable getters in toJSON
orderSchema.set("toJSON", { getters: true });
orderSchema.set("toObject", { getters: true });

const Order = mongoose.model("Order", orderSchema);

// Using getters/setters
const order = new Order({
  price: 99.99,  // Setter: stores 9999
  code: "abc123" // Setter: stores "ABC123"
});

console.log(order.price);  // Getter: "99.99"
console.log(order.code);   // Getter: "ABC123"

// In database: { price: 9999, code: "ABC123" }`}</code>
                  </pre>
                </div>
              </section>
            </>
          )}

          {/* Methods & Statics Tab */}
          {activeTab === "methods" && (
            <>
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  Methods & Statics
                </h2>

                {/* Instance Methods */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    1. Instance Methods
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  tokens: [String]
});

// Instance method - called on document instance
userSchema.methods.getFullName = function() {
  return \`\${this.firstName} \${this.lastName}\`;
};

// Async instance method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method that modifies document
userSchema.methods.addToken = function(token) {
  this.tokens.push(token);
  return this.save();
};

// Method with parameters
userSchema.methods.sendEmail = async function(subject, body) {
  return await emailService.send({
    to: this.email,
    subject,
    body
  });
};

const User = mongoose.model("User", userSchema);

// Usage
const user = await User.findOne({ email: "john@example.com" });

console.log(user.getFullName());  // Instance method
const isValid = await user.comparePassword("password123");
await user.addToken("abc123");
await user.sendEmail("Welcome", "Hello!");`}</code>
                  </pre>
                </div>

                {/* Static Methods */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    2. Static Methods
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`const userSchema = new mongoose.Schema({
  email: String,
  role: String,
  active: Boolean
});

// Static method - called on Model
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email });
};

// Static method with multiple operations
userSchema.statics.findActiveUsers = function() {
  return this.find({ active: true }).sort({ createdAt: -1 });
};

// Static method with parameters
userSchema.statics.findByRole = function(role) {
  return this.find({ role });
};

// Complex static method
userSchema.statics.getStatistics = async function() {
  const total = await this.countDocuments();
  const active = await this.countDocuments({ active: true });
  const byRole = await this.aggregate([
    { $group: { _id: "$role", count: { $sum: 1 } } }
  ]);
  
  return { total, active, byRole };
};

// Static method for creation
userSchema.statics.createWithDefaults = function(data) {
  return this.create({
    ...data,
    active: true,
    role: data.role || "user",
    createdAt: new Date()
  });
};

const User = mongoose.model("User", userSchema);

// Usage - called on Model, not instance
const user = await User.findByEmail("john@example.com");
const activeUsers = await User.findActiveUsers();
const admins = await User.findByRole("admin");
const stats = await User.getStatistics();
const newUser = await User.createWithDefaults({ email: "new@example.com" });`}</code>
                  </pre>
                </div>

                {/* Query Helpers */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    3. Query Helpers
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`const postSchema = new mongoose.Schema({
  title: String,
  published: Boolean,
  author: String,
  views: Number,
  tags: [String]
});

// Query helper - chainable query modifier
postSchema.query.byAuthor = function(author) {
  return this.where({ author });
};

postSchema.query.published = function() {
  return this.where({ published: true });
};

postSchema.query.recent = function(days = 7) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return this.where({ createdAt: { $gte: date } });
};

postSchema.query.popular = function(minViews = 1000) {
  return this.where({ views: { $gte: minViews } });
};

postSchema.query.byTag = function(tag) {
  return this.where({ tags: tag });
};

const Post = mongoose.model("Post", postSchema);

// Usage - chain query helpers
const posts = await Post
  .find()
  .byAuthor("John")
  .published()
  .recent(30)
  .popular(500)
  .sort({ views: -1 })
  .limit(10);

// Multiple helpers
const techPosts = await Post
  .find()
  .byTag("technology")
  .published()
  .recent();

// With other query methods
const count = await Post
  .find()
  .published()
  .byAuthor("Jane")
  .countDocuments();`}</code>
                  </pre>
                </div>

                {/* Indexes in Schema */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    4. Schema Indexes
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,  // Creates unique index
    index: true    // Creates regular index
  },
  username: {
    type: String,
    index: true
  },
  createdAt: Date
});

// Compound index
userSchema.index({ email: 1, createdAt: -1 });

// Text index
userSchema.index({ username: "text", bio: "text" });

// Sparse index
userSchema.index({ resetToken: 1 }, { sparse: true });

// TTL index
userSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

// Partial index
userSchema.index(
  { email: 1 },
  { 
    partialFilterExpression: { active: true },
    unique: true
  }
);

// 2dsphere index
userSchema.index({ location: "2dsphere" });

// Create indexes
const User = mongoose.model("User", userSchema);
await User.createIndexes();

// Sync indexes (removes old ones)
await User.syncIndexes();`}</code>
                  </pre>
                </div>
              </section>
            </>
          )}

          {/* Middleware Tab */}
          {activeTab === "middleware" && (
            <>
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  Middleware (Pre/Post Hooks)
                </h2>

                {/* Document Middleware */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    1. Document Middleware
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  updatedAt: Date
});

// ===== SAVE MIDDLEWARE =====

// Pre-save hook
userSchema.pre("save", function(next) {
  console.log("About to save user");
  this.updatedAt = Date.now();
  next();
});

// Post-save hook
userSchema.post("save", function(doc, next) {
  console.log("User saved:", doc._id);
  next();
});

// Async pre-save
userSchema.pre("save", async function() {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

// Error handling in middleware
userSchema.post("save", function(error, doc, next) {
  if (error.name === "MongoServerError" && error.code === 11000) {
    next(new Error("Email already exists"));
  } else {
    next(error);
  }
});

// ===== VALIDATE MIDDLEWARE =====

userSchema.pre("validate", function(next) {
  console.log("Validating user");
  next();
});

userSchema.post("validate", function(doc) {
  console.log("Validation complete");
});

// ===== REMOVE MIDDLEWARE =====

userSchema.pre("remove", async function() {
  // Clean up related documents
  await Post.deleteMany({ author: this._id });
});

userSchema.post("remove", function(doc) {
  console.log("User removed:", doc._id);
});

// ===== INIT MIDDLEWARE =====

userSchema.post("init", function(doc) {
  console.log("Document loaded from DB");
});

const User = mongoose.model("User", userSchema);`}</code>
                  </pre>
                </div>

                {/* Query Middleware */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    2. Query Middleware
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`const postSchema = new mongoose.Schema({
  title: String,
  deleted: Boolean,
  author: mongoose.Schema.Types.ObjectId
});

// ===== FIND MIDDLEWARE =====

// Pre-find hook (applies to all find operations)
postSchema.pre(/^find/, function(next) {
  // Exclude deleted documents
  this.where({ deleted: { $ne: true } });
  next();
});

// Specific find hooks
postSchema.pre("find", function() {
  console.log("Finding documents");
  this.start = Date.now();
});

postSchema.post("find", function(docs) {
  console.log(\`Found \${docs.length} documents\`);
  console.log(\`Time: \${Date.now() - this.start}ms\`);
});

// FindOne hooks
postSchema.pre("findOne", function() {
  this.populate("author");
});

postSchema.post("findOne", function(doc) {
  if (doc) {
    console.log("Found one:", doc._id);
  }
});

// ===== UPDATE MIDDLEWARE =====

postSchema.pre("updateOne", function() {
  this.set({ updatedAt: Date.now() });
});

postSchema.post("updateOne", function(result) {
  console.log("Modified:", result.modifiedCount);
});

// UpdateMany
postSchema.pre("updateMany", function() {
  console.log("Updating multiple documents");
});

// FindOneAndUpdate
postSchema.pre("findOneAndUpdate", function() {
  this.set({ updatedAt: Date.now() });
});

postSchema.post("findOneAndUpdate", function(doc) {
  console.log("Updated document:", doc);
});

// ===== DELETE MIDDLEWARE =====

postSchema.pre("deleteOne", { document: true }, async function() {
  // Clean up related data
  await Comment.deleteMany({ post: this._id });
});

postSchema.post("deleteOne", { document: true }, function(doc) {
  console.log("Deleted:", doc._id);
});

// DeleteMany
postSchema.pre("deleteMany", function() {
  console.log("Deleting multiple documents");
});

const Post = mongoose.model("Post", postSchema);`}</code>
                  </pre>
                </div>

                {/* Aggregate Middleware */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    3. Aggregate Middleware
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`const orderSchema = new mongoose.Schema({
  total: Number,
  status: String,
  deleted: Boolean
});

// Pre-aggregate hook
orderSchema.pre("aggregate", function(next) {
  // Add $match stage to exclude deleted
  this.pipeline().unshift({ $match: { deleted: { $ne: true } } });
  next();
});

// Post-aggregate hook
orderSchema.post("aggregate", function(result) {
  console.log(\`Aggregation returned \${result.length} results\`);
});

const Order = mongoose.model("Order", orderSchema);

// All aggregations automatically exclude deleted
const stats = await Order.aggregate([
  { $group: { _id: "$status", total: { $sum: "$total" } } }
]);
// Pipeline: [{ $match: { deleted: { $ne: true } } }, { $group: ... }]`}</code>
                  </pre>
                </div>

                {/* Model Middleware */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    4. Model Middleware
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`const productSchema = new mongoose.Schema({
  name: String,
  slug: String
});

// InsertMany middleware
productSchema.pre("insertMany", function(next, docs) {
  console.log(\`Inserting \${docs.length} documents\`);
  
  // Modify documents before insert
  docs.forEach(doc => {
    if (!doc.slug) {
      doc.slug = doc.name.toLowerCase().replace(/\\s/g, "-");
    }
  });
  
  next();
});

productSchema.post("insertMany", function(docs) {
  console.log("Inserted:", docs.length);
});

const Product = mongoose.model("Product", productSchema);

// Usage
await Product.insertMany([
  { name: "Product One" },
  { name: "Product Two" }
]);
// Slugs automatically generated`}</code>
                  </pre>
                </div>

                {/* Middleware Patterns */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    5. Advanced Middleware Patterns
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`const articleSchema = new mongoose.Schema({
  title: String,
  slug: String,
  author: mongoose.Schema.Types.ObjectId,
  views: Number
});

// ===== CONDITIONAL MIDDLEWARE =====

articleSchema.pre("save", function(next) {
  // Only run if title modified
  if (this.isModified("title")) {
    this.slug = this.title.toLowerCase().replace(/\\s/g, "-");
  }
  next();
});

// ===== PARALLEL MIDDLEWARE =====

articleSchema.pre("save", true, function(next, done) {
  // Parallel middleware (true flag)
  setTimeout(() => {
    console.log("Parallel task 1");
    done();
  }, 100);
  next();
});

articleSchema.pre("save", true, function(next, done) {
  setTimeout(() => {
    console.log("Parallel task 2");
    done();
  }, 100);
  next();
});

// ===== ERROR HANDLING =====

articleSchema.pre("save", function(next) {
  if (!this.title) {
    return next(new Error("Title is required"));
  }
  next();
});

// Catch errors in post hooks
articleSchema.post("save", function(error, doc, next) {
  if (error.code === 11000) {
    next(new Error("Duplicate key"));
  } else {
    next(error);
  }
});

// ===== SKIP MIDDLEWARE =====

const article = new Article({ title: "Test" });

// Skip all middleware
await article.save({ validateBeforeSave: false });

// ===== ACCESSING QUERY IN MIDDLEWARE =====

articleSchema.pre("findOneAndUpdate", function() {
  // Access query
  const update = this.getUpdate();
  console.log("Update:", update);
  
  // Modify query
  this.where({ published: true });
});

const Article = mongoose.model("Article", articleSchema);`}</code>
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
                  <strong>Virtuals for computed properties:</strong> Use instead
                  of storing redundant data
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Instance methods for document operations:</strong>{" "}
                  Actions on single document
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Static methods for collection operations:</strong>{" "}
                  Queries and bulk operations
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Query helpers for reusable filters:</strong> Chain
                  common query patterns
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Pre-save for transformations:</strong> Hash passwords,
                  generate slugs
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Post-save for side effects:</strong> Logging,
                  notifications, cache updates
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Pre-find for soft deletes:</strong> Filter deleted
                  documents globally
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Pre-remove for cleanup:</strong> Delete related
                  documents
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Avoid heavy operations in middleware:</strong> Keep
                  middleware fast
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Use error handling middleware:</strong> Handle
                  duplicate keys and validation errors
                </span>
              </li>
            </ul>
          </section>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8">
            <Link
              href="/phase6/schema-definition"
              className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              ← Previous: Schema Definition
            </Link>
            <Link
              href="/phase6/models-queries"
              className="bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-500 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              Next: Models & Queries →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
