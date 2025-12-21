"use client";

import Link from "next/link";
import { useState } from "react";

export default function DocumentsPopulationPage() {
  const [activeTab, setActiveTab] = useState("documents");

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
          Documents & Population
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Document Methods, Subdocuments, and All Population Techniques
        </p>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 flex-wrap">
          <button
            onClick={() => setActiveTab("documents")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "documents"
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Documents
          </button>
          <button
            onClick={() => setActiveTab("populate")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "populate"
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Population
          </button>
          <button
            onClick={() => setActiveTab("subdocs")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "subdocs"
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Subdocuments
          </button>
        </div>

        <div className="space-y-8">
          {/* Documents Tab */}
          {activeTab === "documents" && (
            <>
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  Document Methods
                </h2>

                {/* Document Operations */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    1. Document Operations
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`const user = await User.findById(userId);

// ===== SAVE =====

// Save document
await user.save();

// Save with options
await user.save({
  validateBeforeSave: false,
  timestamps: false
});

// ===== UPDATE =====

// Update document
user.name = "New Name";
await user.save();

// Update nested field
user.address.city = "New York";
await user.save();

// ===== DELETE =====

// Delete document (triggers middleware)
await user.deleteOne();

// Or remove (deprecated but still works)
await user.remove();

// ===== VALIDATE =====

// Validate document
const error = user.validateSync();
if (error) {
  console.log(error);
}

// Async validate
try {
  await user.validate();
} catch (err) {
  console.log(err);
}

// Validate specific paths
await user.validate(["email", "password"]);

// ===== POPULATE =====

// Populate reference
await user.populate("posts");

// Populate multiple
await user.populate(["posts", "friends"]);

// Populate with options
await user.populate({
  path: "posts",
  select: "title createdAt",
  options: { sort: { createdAt: -1 }, limit: 10 }
});

// ===== TO JSON / TO OBJECT =====

// Convert to JSON
const json = user.toJSON();

// Convert to plain object
const obj = user.toObject();

// With options
const sanitized = user.toJSON({
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  }
});`}</code>
                  </pre>
                </div>

                {/* Document Properties */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    2. Document Properties & State
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`const user = await User.findById(userId);

// ===== IS NEW =====

console.log(user.isNew);  // false (loaded from DB)

const newUser = new User({ name: "John" });
console.log(newUser.isNew);  // true

await newUser.save();
console.log(newUser.isNew);  // false

// ===== IS MODIFIED =====

// Check if any field modified
console.log(user.isModified());  // false

user.name = "Updated";
console.log(user.isModified());  // true

// Check specific field
console.log(user.isModified("name"));  // true
console.log(user.isModified("email")); // false

// ===== MODIFIED PATHS =====

// Get all modified paths
const paths = user.modifiedPaths();
console.log(paths);  // ["name"]

// ===== IS DIRECT MODIFIED =====

user.address.city = "Boston";

console.log(user.isModified("address"));  // true
console.log(user.isDirectModified("address"));  // false (nested)
console.log(user.isDirectModified("address.city"));  // true

// ===== GET / SET =====

// Get field value
const name = user.get("name");

// Set field value
user.set("name", "New Name");
user.set({ name: "New", age: 30 });

// ===== MARK MODIFIED =====

// Manually mark as modified (for Mixed types)
user.metadata.key = "value";
user.markModified("metadata");

// ===== UNMARK MODIFIED =====

user.name = "Changed";
user.unmarkModified("name");  // Discard change

// ===== RESET =====

// Revert all changes
user.name = "Changed";
user.$reset();  // Revert to DB state`}</code>
                  </pre>
                </div>

                {/* Document Comparison */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    3. Document Comparison & Equality
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`const user1 = await User.findById(id1);
const user2 = await User.findById(id2);

// ===== EQUALS =====

// Compare ObjectIds
console.log(user1._id.equals(user2._id));

// Compare documents
console.log(user1.equals(user2));

// =====DEPOPULATE =====

// Depopulate reference (convert back to ID)
await user.populate("posts");
console.log(user.posts);  // Array of Post documents

user.depopulate("posts");
console.log(user.posts);  // Array of ObjectIds

// ===== INSPECT =====

// Custom inspect for console.log
console.log(user);  // Uses schema toJSON transform

// ===== ERRORS =====

// Get validation errors
try {
  await user.save();
} catch (err) {
  if (err.name === "ValidationError") {
    console.log(err.errors.email.message);
  }
}

// ===== PARENT =====

// For subdocuments
const address = user.addresses[0];
console.log(address.parent());  // User document
console.log(address.ownerDocument());  // User document`}</code>
                  </pre>
                </div>

                {/* Document Utilities */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    4. Document Utilities
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== OVERWRITE =====

// Replace document (keeps _id)
const newData = { name: "John", email: "john@new.com" };
user.overwrite(newData);
await user.save();

// ===== REPLACEONE =====

// Replace in database
await user.replaceOne({ name: "Replaced" });

// ===== UPDATE =====

// Update in database
await user.updateOne({ $set: { name: "Updated" } });

// ===== INCREMENT =====

// Increment version
user.increment();

// ===== SCHEMA =====

// Get schema
const schema = user.schema;
console.log(schema.paths);

// ===== MODEL =====

// Get model
const Model = user.constructor;
console.log(Model.modelName);  // "User"

// ===== ID =====

// Get ID as string
console.log(user.id);  // Virtual getter for _id

// ===== INIT =====

// Initialize document from plain object
const plain = { name: "John", _id: "..." };
const doc = new User();
doc.init(plain);`}</code>
                  </pre>
                </div>
              </section>
            </>
          )}

          {/* Population Tab */}
          {activeTab === "populate" && (
            <>
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  Population
                </h2>

                {/* Basic Population */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    1. Basic Population
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`const userSchema = new mongoose.Schema({
  name: String,
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }]
});

const postSchema = new mongoose.Schema({
  title: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

const User = mongoose.model("User", userSchema);
const Post = mongoose.model("Post", postSchema);

// ===== BASIC POPULATE =====

// Populate single reference
const post = await Post.findById(postId).populate("author");
console.log(post.author.name);  // Author document

// Populate array of references
const user = await User.findById(userId).populate("posts");
console.log(user.posts);  // Array of Post documents

// ===== POPULATE WITH SELECT =====

// Select specific fields
await Post.findById(postId).populate("author", "name email");

// Exclude fields
await Post.findById(postId).populate("author", "-password");

// ===== POPULATE MULTIPLE PATHS =====

// Method 1: Multiple populate calls
await User.findById(userId)
  .populate("posts")
  .populate("friends");

// Method 2: Array
await User.findById(userId)
  .populate(["posts", "friends"]);

// Method 3: Object
await User.findById(userId).populate({
  path: "posts",
  select: "title"
}).populate({
  path: "friends",
  select: "name"
});`}</code>
                  </pre>
                </div>

                {/* Advanced Population */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    2. Advanced Population
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== POPULATE WITH MATCH =====

// Filter populated documents
await User.findById(userId).populate({
  path: "posts",
  match: { published: true },
  select: "title createdAt"
});

// Dynamic match
await User.findById(userId).populate({
  path: "posts",
  match: { createdAt: { $gte: new Date("2024-01-01") } }
});

// ===== POPULATE WITH OPTIONS =====

await User.findById(userId).populate({
  path: "posts",
  options: {
    sort: { createdAt: -1 },
    limit: 10,
    skip: 0
  }
});

// ===== NESTED POPULATE =====

// Populate reference within populated document
await Post.findById(postId).populate({
  path: "author",
  populate: {
    path: "friends",
    select: "name"
  }
});

// Multiple levels
await Post.findById(postId).populate({
  path: "comments",
  populate: {
    path: "author",
    populate: {
      path: "profile"
    }
  }
});

// ===== CROSS-DATABASE POPULATE =====

const userSchema = new mongoose.Schema({
  name: String
});

const postSchema = new mongoose.Schema({
  title: String,
  authorId: String  // String, not ObjectId
});

// Use refPath
postSchema.virtual("author", {
  ref: "User",
  localField: "authorId",
  foreignField: "_id",
  justOne: true
});

// Or specify in populate
await Post.findById(postId).populate({
  path: "author",
  model: "User"
});`}</code>
                  </pre>
                </div>

                {/* Special Population Types */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    3. Special Population Types
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== VIRTUAL POPULATE =====

const authorSchema = new mongoose.Schema({
  name: String
});

// Virtual for posts (no ref stored)
authorSchema.virtual("posts", {
  ref: "Post",
  localField: "_id",
  foreignField: "author"
});

// Enable virtuals in toJSON
authorSchema.set("toJSON", { virtuals: true });

const Author = mongoose.model("Author", authorSchema);

// Populate virtual
const author = await Author.findById(id).populate("posts");

// ===== COUNT POPULATE =====

// Get count instead of documents
authorSchema.virtual("postCount", {
  ref: "Post",
  localField: "_id",
  foreignField: "author",
  count: true
});

const author = await Author.findById(id).populate("postCount");
console.log(author.postCount);  // Number

// ===== DYNAMIC REFERENCES =====

const commentSchema = new mongoose.Schema({
  text: String,
  itemType: String,  // "Post" or "Video"
  itemId: mongoose.Schema.Types.ObjectId
});

commentSchema.virtual("item", {
  ref: doc => doc.itemType,  // Dynamic ref
  localField: "itemId",
  foreignField: "_id",
  justOne: true
});

// Or use refPath
commentSchema.path("itemId").options.refPath = "itemType";

// Populate
const comment = await Comment.findById(id).populate("item");

// ===== POPULATE ON DOCUMENT =====

// Populate existing document
const user = await User.findById(userId);

await user.populate("posts");
await user.populate({
  path: "friends",
  select: "name"
});

// ===== POPULATE MULTIPLE DOCUMENTS =====

const users = await User.find();

await User.populate(users, {
  path: "posts",
  select: "title"
});`}</code>
                  </pre>
                </div>

                {/* Population Options */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    4. Population Options & Performance
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== LEAN WITH POPULATE =====

// Faster queries with lean
const users = await User.find()
  .populate("posts")
  .lean();

// ===== POPULATE WITH PROJECTION =====

await User.findById(userId).populate({
  path: "posts",
  select: "title createdAt -_id"
});

// ===== POPULATE WITH TRANSFORM =====

await User.findById(userId).populate({
  path: "posts",
  transform: (doc) => {
    // Transform populated document
    return {
      id: doc._id,
      title: doc.title.toUpperCase()
    };
  }
});

// ===== POPULATE WITH MATCH FUNCTION =====

await User.findById(userId).populate({
  path: "posts",
  match: function(user) {
    // Access parent document
    return { category: user.preferredCategory };
  }
});

// ===== POPULATE WITH PERMS =====

// Check permissions before populate
await User.findById(userId).populate({
  path: "privatePosts",
  match: function(user) {
    return { 
      $or: [
        { author: user._id },
        { public: true }
      ]
    };
  }
});

// ===== POPULATE OPTIONS =====

await User.findById(userId).populate({
  path: "posts",
  select: "title",
  match: { published: true },
  options: {
    sort: { createdAt: -1 },
    limit: 10,
    skip: 0
  },
  populate: {
    path: "comments",
    select: "text"
  }
});

// ===== DEPOPULATE =====

// Remove population
const user = await User.findById(userId).populate("posts");

user.depopulate("posts");
console.log(user.posts);  // Array of ObjectIds

// ===== POPULATED =====

// Check if path is populated
console.log(user.populated("posts"));  // Returns ObjectIds if populated`}</code>
                  </pre>
                </div>
              </section>
            </>
          )}

          {/* Subdocuments Tab */}
          {activeTab === "subdocs" && (
            <>
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  Subdocuments
                </h2>

                {/* Basic Subdocuments */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    1. Basic Subdocuments
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`const addressSchema = new mongoose.Schema({
  street: String,
  city: String,
  zipCode: String
});

const userSchema = new mongoose.Schema({
  name: String,
  // Single subdocument
  address: addressSchema,
  // Array of subdocuments
  addresses: [addressSchema]
});

const User = mongoose.model("User", userSchema);

// ===== CREATE WITH SUBDOCUMENTS =====

const user = new User({
  name: "John",
  address: {
    street: "123 Main St",
    city: "New York"
  },
  addresses: [
    { street: "456 Oak Ave", city: "Boston" },
    { street: "789 Pine Rd", city: "Chicago" }
  ]
});

await user.save();

// ===== ACCESS SUBDOCUMENTS =====

console.log(user.address.city);  // "New York"
console.log(user.addresses[0].city);  // "Boston"

// ===== MODIFY SUBDOCUMENTS =====

user.address.city = "Los Angeles";
user.addresses[0].street = "Updated Street";

await user.save();

// ===== ADD SUBDOCUMENTS =====

user.addresses.push({
  street: "New Address",
  city: "Seattle"
});

await user.save();`}</code>
                  </pre>
                </div>

                {/* Subdocument Methods */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    2. Subdocument Methods
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`const user = await User.findById(userId);

// ===== PARENT =====

const address = user.addresses[0];
console.log(address.parent());  // User document
console.log(address.ownerDocument());  // User document

// ===== IS MODIFIED =====

address.city = "Updated";
console.log(address.isModified("city"));  // true

// ===== REMOVE =====

// Remove subdocument
user.addresses[0].remove();
await user.save();

// Or
user.addresses.id(addressId).remove();
await user.save();

// ===== ID =====

// Get subdocument by ID
const address = user.addresses.id(addressId);

// ===== CREATE =====

// Create subdocument
const newAddress = user.addresses.create({
  street: "New Street",
  city: "Miami"
});

user.addresses.push(newAddress);
await user.save();

// ===== PULL =====

// Remove by ID
user.addresses.pull(addressId);
await user.save();

// Remove by condition
user.addresses.pull({ city: "Boston" });
await user.save();

// ===== SET =====

// Replace array
user.addresses.set(0, {
  street: "Replaced",
  city: "Denver"
});

await user.save();`}</code>
                  </pre>
                </div>

                {/* Subdocument Arrays */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    3. Subdocument Arrays
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`const phoneSchema = new mongoose.Schema({
  type: { type: String, enum: ["mobile", "home", "work"] },
  number: String,
  primary: Boolean
});

const userSchema = new mongoose.Schema({
  name: String,
  phones: [phoneSchema]
});

const User = mongoose.model("User", userSchema);

// ===== ARRAY OPERATIONS =====

const user = await User.findById(userId);

// Push
user.phones.push({ type: "mobile", number: "555-1234" });

// Unshift (add to beginning)
user.phones.unshift({ type: "work", number: "555-5678" });

// Pop (remove last)
user.phones.pop();

// Shift (remove first)
user.phones.shift();

// Splice
user.phones.splice(1, 1);  // Remove 1 at index 1

// Sort
user.phones.sort((a, b) => a.type.localeCompare(b.type));

await user.save();

// ===== FIND IN ARRAY =====

// Find by ID
const phone = user.phones.id(phoneId);

// Find by property
const mobile = user.phones.find(p => p.type === "mobile");

// Filter
const workPhones = user.phones.filter(p => p.type === "work");

// ===== ARRAY METHODS =====

// Map
const numbers = user.phones.map(p => p.number);

// ForEach
user.phones.forEach(phone => {
  console.log(phone.number);
});

// Some
const hasPrimary = user.phones.some(p => p.primary);

// Every
const allMobile = user.phones.every(p => p.type === "mobile");`}</code>
                  </pre>
                </div>

                {/* Embedded Documents */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    4. Embedded Documents
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`// ===== INLINE SCHEMAS =====

const userSchema = new mongoose.Schema({
  name: String,
  // Inline subdocument
  profile: {
    type: {
      bio: String,
      avatar: String,
      social: {
        twitter: String,
        github: String
      }
    }
  },
  // Inline array
  tags: [{
    type: {
      name: String,
      color: String
    }
  }]
});

// ===== MIXED TYPES =====

const blogSchema = new mongoose.Schema({
  title: String,
  // Any structure
  metadata: mongoose.Schema.Types.Mixed
});

const blog = new Blog({
  title: "Post",
  metadata: {
    views: 100,
    tags: ["tech", "news"],
    author: {
      name: "John",
      social: { twitter: "@john" }
    }
  }
});

// Mark as modified for Mixed types
blog.metadata.views = 101;
blog.markModified("metadata");
await blog.save();

// ===== MAP TYPE =====

const settingsSchema = new mongoose.Schema({
  name: String,
  config: {
    type: Map,
    of: String
  }
});

const doc = new Settings({
  name: "App",
  config: new Map([
    ["theme", "dark"],
    ["lang", "en"]
  ])
});

// Access Map
doc.config.get("theme");  // "dark"
doc.config.set("timezone", "UTC");

await doc.save();`}</code>
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
                  <strong>Populate selectively:</strong> Only populate what you
                  need to reduce query time
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Use lean() with populate:</strong> Faster for
                  read-only operations
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Limit nested populations:</strong> Deep nesting can be
                  slow
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Use virtual populate for reverse refs:</strong>{" "}
                  Cleaner than storing both sides
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Subdocuments for embedded data:</strong> When data
                  always accessed together
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>References for independent data:</strong> When data
                  can exist separately
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Mark Mixed types as modified:</strong> MongoDB
                  doesn&apos;t auto-detect changes
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Use document.save() for subdocs:</strong> Saves parent
                  and all subdocuments
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Validate subdocuments:</strong> Add validators to
                  subdocument schemas
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Consider denormalization:</strong> For frequently
                  accessed data together
                </span>
              </li>
            </ul>
          </section>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-8">
            <Link
              href="/phase6/models-queries"
              className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              ← Previous: Models & Queries
            </Link>
            <Link
              href="/phase6/advanced-features"
              className="bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-500 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              Next: Advanced Features →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
