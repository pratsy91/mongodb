"use client";

import Link from "next/link";
import { useState } from "react";

export default function SchemaDefinitionPage() {
  const [activeTab, setActiveTab] = useState("types");

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
          Mongoose Schema Definition
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          All SchemaTypes, Schema Options, and Built-in Validation
        </p>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 flex-wrap">
          <button
            onClick={() => setActiveTab("types")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "types"
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            SchemaTypes
          </button>
          <button
            onClick={() => setActiveTab("options")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "options"
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Schema Options
          </button>
          <button
            onClick={() => setActiveTab("validation")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "validation"
                ? "bg-purple-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Validation
          </button>
        </div>

        <div className="space-y-8">
          {/* SchemaTypes Tab */}
          {activeTab === "types" && (
            <>
              {/* Theory Section */}
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  📚 All Mongoose SchemaTypes
                </h2>

                <div className="space-y-4 text-gray-200">
                  <p className="text-lg">
                    Mongoose provides 12 SchemaTypes for defining document
                    structure and validation:
                  </p>

                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong>String</strong> - Text data
                    </li>
                    <li>
                      <strong>Number</strong> - Integer or float
                    </li>
                    <li>
                      <strong>Date</strong> - Date and time
                    </li>
                    <li>
                      <strong>Buffer</strong> - Binary data
                    </li>
                    <li>
                      <strong>Boolean</strong> - true/false
                    </li>
                    <li>
                      <strong>Mixed</strong> - Any type (Schema.Types.Mixed)
                    </li>
                    <li>
                      <strong>ObjectId</strong> - MongoDB ObjectId
                      (Schema.Types.ObjectId)
                    </li>
                    <li>
                      <strong>Array</strong> - Array of any type
                    </li>
                    <li>
                      <strong>Decimal128</strong> - High precision decimals
                      (Schema.Types.Decimal128)
                    </li>
                    <li>
                      <strong>Map</strong> - Key-value pairs (Schema.Types.Map)
                    </li>
                    <li>
                      <strong>UUID</strong> - UUID strings (Schema.Types.UUID)
                    </li>
                    <li>
                      <strong>BigInt</strong> - Large integers
                      (Schema.Types.BigInt)
                    </li>
                  </ul>
                </div>
              </section>

              {/* All SchemaTypes Examples */}
              <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                <h2 className="text-3xl font-bold mb-6 text-purple-300">
                  All SchemaTypes Examples
                </h2>

                {/* String Type */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    1. String SchemaType
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  // Basic string
  name: String,
  
  // String with options
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,        // Convert to lowercase
    trim: true,            // Remove whitespace
    minlength: 5,          // Minimum length
    maxlength: 100,        // Maximum length
    match: /^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$/,  // Regex validation
    enum: ["admin@example.com", "user@example.com"],  // Allowed values
    default: "user@example.com"
  },
  
  // String with custom validation
  username: {
    type: String,
    required: [true, "Username is required"],
    validate: {
      validator: function(v) {
        return /^[a-zA-Z0-9_]+$/.test(v);
      },
      message: props => \`\${props.value} is not a valid username!\`
    }
  },
  
  // String with getter/setter
  password: {
    type: String,
    set: v => bcrypt.hashSync(v, 10),  // Hash on set
    select: false  // Exclude from queries by default
  }
});

const User = mongoose.model("User", userSchema);`}</code>
                  </pre>
                </div>

                {/* Number Type */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    2. Number SchemaType
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`const productSchema = new mongoose.Schema({
  // Basic number
  quantity: Number,
  
  // Number with options
  price: {
    type: Number,
    required: true,
    min: 0,                // Minimum value
    max: 100000,           // Maximum value
    default: 0,
    get: v => (v / 100).toFixed(2),  // Store cents, return dollars
    set: v => v * 100      // Store as cents
  },
  
  // Integer only
  stock: {
    type: Number,
    validate: {
      validator: Number.isInteger,
      message: "{VALUE} is not an integer"
    }
  },
  
  // Number with enum
  rating: {
    type: Number,
    enum: [1, 2, 3, 4, 5],
    default: 5
  }
});

const Product = mongoose.model("Product", productSchema);`}</code>
                  </pre>
                </div>

                {/* Date Type */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    3. Date SchemaType
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`const eventSchema = new mongoose.Schema({
  // Basic date
  startDate: Date,
  
  // Date with options
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true  // Cannot be changed after creation
  },
  
  // Date with validation
  birthDate: {
    type: Date,
    required: true,
    min: new Date("1900-01-01"),
    max: Date.now,
    validate: {
      validator: function(v) {
        return v < new Date();
      },
      message: "Birth date must be in the past"
    }
  },
  
  // Date with getter
  updatedAt: {
    type: Date,
    default: Date.now,
    get: v => v.toISOString()
  }
});

const Event = mongoose.model("Event", eventSchema);`}</code>
                  </pre>
                </div>

                {/* Boolean, Buffer, Mixed */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    4. Boolean, Buffer, Mixed Types
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`const dataSchema = new mongoose.Schema({
  // Boolean
  isActive: {
    type: Boolean,
    default: true,
    required: true
  },
  
  verified: Boolean,
  
  // Buffer (binary data)
  avatar: {
    type: Buffer,
    validate: {
      validator: function(v) {
        return v.length <= 5 * 1024 * 1024;  // Max 5MB
      },
      message: "Avatar size must be less than 5MB"
    }
  },
  
  // Mixed (any type)
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  
  // Mixed can store anything
  flexibleData: mongoose.Schema.Types.Mixed
});

// Usage
const doc = new DataModel({
  isActive: false,
  metadata: {
    key1: "value",
    key2: 123,
    nested: { data: true }
  }
});`}</code>
                  </pre>
                </div>

                {/* ObjectId and Arrays */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    5. ObjectId and Array Types
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`const postSchema = new mongoose.Schema({
  // ObjectId reference
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  
  // Array of strings
  tags: {
    type: [String],
    default: [],
    validate: {
      validator: function(v) {
        return v.length <= 10;
      },
      message: "Maximum 10 tags allowed"
    }
  },
  
  // Array of numbers
  ratings: [Number],
  
  // Array of ObjectIds
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment"
  }],
  
  // Array of subdocuments
  likes: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now }
  }],
  
  // Array with validation
  categories: {
    type: [String],
    enum: ["tech", "news", "sports", "entertainment"],
    required: true
  }
});

const Post = mongoose.model("Post", postSchema);`}</code>
                  </pre>
                </div>

                {/* Decimal128, Map, UUID, BigInt */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    6. Decimal128, Map, UUID, BigInt Types
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`const advancedSchema = new mongoose.Schema({
  // Decimal128 (high precision)
  precisePrice: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
    get: v => parseFloat(v.toString())  // Convert to number
  },
  
  // Map (key-value pairs)
  settings: {
    type: Map,
    of: String,  // Values must be strings
    default: new Map()
  },
  
  permissions: {
    type: Map,
    of: Boolean
  },
  
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed  // Values can be anything
  },
  
  // UUID
  uuid: {
    type: mongoose.Schema.Types.UUID,
    default: () => crypto.randomUUID()
  },
  
  // BigInt (large integers)
  largeNumber: {
    type: mongoose.Schema.Types.BigInt,
    required: true
  }
});

// Usage examples
const doc = new AdvancedModel({
  precisePrice: mongoose.Types.Decimal128.fromString("99.99"),
  settings: new Map([
    ["theme", "dark"],
    ["language", "en"]
  ]),
  permissions: new Map([
    ["read", true],
    ["write", false]
  ]),
  uuid: "550e8400-e29b-41d4-a716-446655440000",
  largeNumber: 9007199254740991n
});

// Accessing Map values
console.log(doc.settings.get("theme"));  // "dark"
doc.settings.set("timezone", "UTC");

const Advanced = mongoose.model("Advanced", advancedSchema);`}</code>
                  </pre>
                </div>

                {/* Nested and Embedded Documents */}
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                    7. Nested and Embedded Documents
                  </h3>
                  <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                    <code className="text-sm">{`const addressSchema = new mongoose.Schema({
  street: String,
  city: String,
  state: String,
  zipCode: String,
  country: { type: String, default: "USA" }
});

const userSchema = new mongoose.Schema({
  name: String,
  
  // Single nested document
  address: {
    type: addressSchema,
    required: true
  },
  
  // Inline nested document
  profile: {
    bio: String,
    website: String,
    social: {
      twitter: String,
      github: String
    }
  },
  
  // Array of embedded documents
  addresses: [addressSchema],
  
  // Array of inline embedded documents
  phones: [{
    type: { type: String, enum: ["mobile", "home", "work"] },
    number: String,
    primary: { type: Boolean, default: false }
  }]
});

const User = mongoose.model("User", userSchema);

// Usage
const user = new User({
  name: "John",
  address: {
    street: "123 Main St",
    city: "New York",
    zipCode: "10001"
  },
  addresses: [
    { street: "456 Oak Ave", city: "Boston" }
  ],
  phones: [
    { type: "mobile", number: "555-1234", primary: true }
  ]
});`}</code>
                  </pre>
                </div>
              </section>
            </>
          )}

          {/* Schema Options Tab */}
          {activeTab === "options" && (
            <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
              <h2 className="text-3xl font-bold mb-6 text-purple-300">
                Schema Options
              </h2>

              {/* Schema-level Options */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  1. Schema-Level Options
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number
}, {
  // Timestamps
  timestamps: true,  // Adds createdAt and updatedAt
  
  // Custom timestamp field names
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  },
  
  // Collection name
  collection: "users",
  
  // Disable _id
  _id: false,
  
  // Auto-create indexes
  autoIndex: true,  // false in production
  
  // Strict mode
  strict: true,      // Discard fields not in schema
  strict: false,     // Allow any fields
  strict: "throw",   // Throw error for unknown fields
  
  // Version key
  versionKey: "__v",  // Default
  versionKey: false,  // Disable versioning
  
  // Minimize empty objects
  minimize: true,  // Remove empty objects (default)
  minimize: false, // Keep empty objects
  
  // toJSON options
  toJSON: {
    virtuals: true,
    getters: true,
    transform: function(doc, ret) {
      delete ret.password;
      delete ret.__v;
      return ret;
    }
  },
  
  // toObject options
  toObject: {
    virtuals: true,
    getters: true
  },
  
  // Schema ID
  id: true,  // Create virtual 'id' getter (default)
  id: false, // Disable virtual id
  
  // Collation
  collation: {
    locale: "en",
    strength: 2  // Case-insensitive
  },
  
  // Select
  selectPopulatedPaths: false,
  
  // Skip version for arrays
  skipVersioning: { dontVersionMe: true },
  
  // Read/Write concerns
  read: "primary",
  writeConcern: {
    w: "majority",
    j: true,
    wtimeout: 1000
  }
});

const User = mongoose.model("User", userSchema);`}</code>
                </pre>
              </div>

              {/* Field-Level Options */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  2. Field-Level Options
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const productSchema = new mongoose.Schema({
  name: {
    type: String,
    
    // Required
    required: true,
    required: [true, "Name is required"],
    required: function() { return this.isPublished; },
    
    // Default
    default: "Unnamed Product",
    default: () => "Default Name",
    default: Date.now,
    
    // Unique
    unique: true,
    
    // Index
    index: true,
    index: { unique: true, sparse: true },
    
    // Sparse index
    sparse: true,
    
    // Select
    select: true,   // Include by default
    select: false,  // Exclude by default
    
    // Immutable
    immutable: true,
    immutable: function() { return this.isPublished; },
    
    // Alias
    alias: "productName",
    
    // Lowercase/Uppercase/Trim (String only)
    lowercase: true,
    uppercase: true,
    trim: true,
    
    // Min/Max (Number/Date)
    min: 0,
    max: 100,
    
    // Enum
    enum: ["small", "medium", "large"],
    enum: {
      values: ["small", "medium", "large"],
      message: "{VALUE} is not supported"
    },
    
    // Match (String only)
    match: /^[a-zA-Z0-9]+$/,
    match: [/pattern/, "Custom error message"],
    
    // Minlength/Maxlength (String only)
    minlength: 3,
    maxlength: 100,
    
    // Get/Set
    get: v => Math.round(v),
    set: v => v.toLowerCase(),
    
    // Validate
    validate: {
      validator: function(v) {
        return v.length > 0;
      },
      message: "Name cannot be empty"
    },
    
    // Populate
    ref: "Category",
    refPath: "categoryType",
    
    // Text index
    text: true
  }
});

const Product = mongoose.model("Product", productSchema);`}</code>
                </pre>
              </div>

              {/* Advanced Options */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  3. Advanced Schema Options
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`// Discriminators
const eventSchema = new mongoose.Schema({
  title: String,
  date: Date
}, { discriminatorKey: "kind" });

const Event = mongoose.model("Event", eventSchema);

const clickEventSchema = new mongoose.Schema({
  element: String
});

const ClickEvent = Event.discriminator("ClickEvent", clickEventSchema);

// Plugins
const timestampPlugin = function(schema, options) {
  schema.add({
    createdAt: Date,
    updatedAt: Date
  });
  
  schema.pre("save", function(next) {
    this.updatedAt = Date.now();
    if (this.isNew) {
      this.createdAt = Date.now();
    }
    next();
  });
};

userSchema.plugin(timestampPlugin);

// Schema with all options
const comprehensiveSchema = new mongoose.Schema({
  name: String,
  email: String
}, {
  timestamps: true,
  collection: "users",
  strict: true,
  versionKey: "__v",
  minimize: false,
  autoIndex: false,
  id: true,
  _id: true,
  validateBeforeSave: true,
  
  toJSON: {
    virtuals: true,
    getters: true,
    versionKey: false,
    transform: (doc, ret) => {
      delete ret._id;
      return ret;
    }
  },
  
  toObject: {
    virtuals: true,
    getters: true
  },
  
  collation: { locale: "en", strength: 2 },
  
  read: "nearest",
  
  writeConcern: {
    w: 1,
    j: true
  },
  
  shardKey: { userId: 1 },
  
  selectPopulatedPaths: true,
  
  typeKey: "$type"  // Use $type instead of type
});`}</code>
                </pre>
              </div>
            </section>
          )}

          {/* Validation Tab */}
          {activeTab === "validation" && (
            <section className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
              <h2 className="text-3xl font-bold mb-6 text-purple-300">
                Validation
              </h2>

              {/* Built-in Validators */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  1. Built-in Validators
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const userSchema = new mongoose.Schema({
  // Required validator
  username: {
    type: String,
    required: true  // Basic required
  },
  
  email: {
    type: String,
    required: [true, "Email is required"]  // With message
  },
  
  phone: {
    type: String,
    required: function() {
      return this.notificationMethod === "sms";  // Conditional
    }
  },
  
  // String validators
  name: {
    type: String,
    minlength: 2,
    maxlength: 50,
    trim: true,
    lowercase: true,
    uppercase: false,
    match: /^[a-zA-Z\\s]+$/,
    enum: ["John", "Jane", "Bob"]
  },
  
  // Number validators
  age: {
    type: Number,
    min: [18, "Must be at least 18"],
    max: [120, "Must be less than 120"]
  },
  
  rating: {
    type: Number,
    enum: {
      values: [1, 2, 3, 4, 5],
      message: "{VALUE} is not a valid rating"
    }
  },
  
  // Date validators
  birthDate: {
    type: Date,
    min: new Date("1900-01-01"),
    max: Date.now
  },
  
  // Array validators
  tags: {
    type: [String],
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: "At least one tag is required"
    }
  }
});

const User = mongoose.model("User", userSchema);`}</code>
                </pre>
              </div>

              {/* Custom Validators */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  2. Custom Validators
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const userSchema = new mongoose.Schema({
  // Simple custom validator
  username: {
    type: String,
    validate: {
      validator: function(v) {
        return /^[a-zA-Z0-9_]+$/.test(v);
      },
      message: props => \`\${props.value} contains invalid characters\`
    }
  },
  
  // Multiple validators
  email: {
    type: String,
    validate: [
      {
        validator: function(v) {
          return /^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$/.test(v);
        },
        message: "Invalid email format"
      },
      {
        validator: async function(v) {
          const count = await mongoose.models.User.countDocuments({
            email: v,
            _id: { $ne: this._id }
          });
          return count === 0;
        },
        message: "Email already exists"
      }
    ]
  },
  
  // Async validator
  slug: {
    type: String,
    validate: {
      validator: async function(v) {
        const existing = await this.constructor.findOne({
          slug: v,
          _id: { $ne: this._id }
        });
        return !existing;
      },
      message: "Slug must be unique"
    }
  },
  
  // Validator with access to document
  password: {
    type: String,
    validate: {
      validator: function(v) {
        // 'this' refers to the document
        return v.length >= 8 && /[A-Z]/.test(v) && /[0-9]/.test(v);
      },
      message: "Password must be at least 8 chars with uppercase and number"
    }
  },
  
  // Cross-field validation
  confirmPassword: {
    type: String,
    validate: {
      validator: function(v) {
        return v === this.password;
      },
      message: "Passwords do not match"
    }
  }
});

// Schema-level validation
userSchema.pre("validate", function(next) {
  if (this.age < 18 && !this.parentEmail) {
    this.invalidate("parentEmail", "Parent email required for minors");
  }
  next();
});

const User = mongoose.model("User", userSchema);`}</code>
                </pre>
              </div>

              {/* Update Validators */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-4 text-cyan-300">
                  3. Update Validators
                </h3>
                <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3
  },
  price: {
    type: Number,
    min: 0
  }
});

const Product = mongoose.model("Product", productSchema);

// Update validators are OFF by default
await Product.updateOne(
  { _id: productId },
  { name: "AB" }  // Won't validate minlength
);

// Enable update validators
await Product.updateOne(
  { _id: productId },
  { name: "AB" },
  { runValidators: true }  // Now validates
);

// Context for update validators
productSchema.path("price").validate({
  validator: function(v) {
    // 'this' is the query in update operations
    return v > 0;
  },
  message: "Price must be positive"
});

// Use context: 'query' for update operations
productSchema.path("discount").validate({
  validator: function(v) {
    // Access update values
    return v < this.price;
  },
  message: "Discount cannot exceed price"
});

// Update with validation
await Product.findByIdAndUpdate(
  productId,
  { name: "New Name", price: -10 },
  {
    runValidators: true,
    context: "query",
    new: true
  }
);

// Bulk update with validation
await Product.updateMany(
  { category: "electronics" },
  { $set: { inStock: true } },
  { runValidators: true }
);`}</code>
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
                  <strong>Use appropriate types:</strong> Choose the most
                  specific SchemaType for your data
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Required validation:</strong> Always validate required
                  fields with meaningful error messages
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Custom validators:</strong> Use async validators for
                  database lookups
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Timestamps:</strong> Use timestamps: true for
                  automatic tracking
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Indexes:</strong> Add indexes at schema level for
                  better performance
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Strict mode:</strong> Use strict mode in production to
                  prevent unwanted fields
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>toJSON transform:</strong> Remove sensitive data in
                  toJSON option
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Update validators:</strong> Enable runValidators for
                  update operations
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Mixed type:</strong> Use Mixed sparingly, prefer
                  defined schemas
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>
                  <strong>Decimal128:</strong> Use for financial calculations
                  requiring precision
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
              href="/phase6/schema-features"
              className="bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-500 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              Next: Schema Features →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
