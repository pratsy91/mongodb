"use client";

import { useState } from "react";
import { Incident, Lesson, ScenarioPage } from "../ui";

export default function GeneralIncidents() {
  const [active, setActive] = useState("boot");

  return (
    <ScenarioPage
      title="General Production Incidents"
      subtitle="Cross-cutting Mongoose + Express outages. These do not belong to a single phase."
      tabs={[
        { id: "boot", label: "Boot and process" },
        { id: "routes", label: "Routes and retries" },
        { id: "debug", label: "How to debug" },
      ]}
      active={active}
      setActive={setActive}
      prev={{ href: "/phase18/modules-10-12", label: "Modules 10–12" }}
    >
      {active === "boot" && (
        <>
          <h2 className="text-2xl font-bold text-amber-300">
            Module 13 — Express process incidents
          </h2>
          <Lesson title="Lesson 1: The process is unhealthy">
            <Incident
              level="Mid"
              title="Kubernetes sends SIGTERM and the pod dies mid-request. Clients see connection resets. MongoDB logs socket exceptions."
              symptom={`app.listen(3000);
// no signal handler`}
              fix={`Cause: the platform killed the process before in-flight queries finished, and the pool was not closed.

Fix:
const server = app.listen(3000);
process.on("SIGTERM", async () => {
  server.close();
  await mongoose.connection.close();
  process.exit(0);
});
server.close() stops new connections and waits for current ones. Set a terminationGracePeriodSeconds long enough for that.`}
            />
            <Incident
              level="Mid"
              title="Jest never exits. CI times out on 'open handles'."
              symptom={`afterEach nothing closes mongoose. The test file calls mongoose.connect.`}
              fix={`Cause: the pool keeps the event loop alive.

Fix:
afterAll(async () => {
  await mongoose.connection.close();
});
Use mongodb-memory-server or a dedicated test database. Do not point tests at production. Call mongoose.deleteModel(/.*/) only if tests recompile schemas.`}
            />
            <Incident
              level="Senior"
              title="A dependency throws inside an async route and the process crashes. PM2 restarts it in a loop."
              symptom={`router.get("/orders", async (req, res) => {
  const orders = await Order.find({ userId: req.user.id });
  res.json(orders);
});`}
              fix={`Cause: a rejected promise from an async route is not passed to Express error middleware unless you catch it. In some Node versions that becomes an unhandledRejection.

Fix: a small wrapper, plus one error mapper.
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.get("/orders", wrap(async (req, res) => {
  const orders = await Order.find({ userId: req.user.id }).limit(50).lean();
  res.json(orders);
}));

app.use((err, req, res, next) => {
  if (err.name === "CastError") return res.status(400).json({ error: "Invalid id" });
  if (err.name === "ValidationError") return res.status(400).json({ error: err.message });
  if (err.code === 11000) return res.status(409).json({ error: "Duplicate" });
  if (err.name === "VersionError") return res.status(409).json({ error: "Conflict, reload" });
  console.error(err);
  res.status(500).json({ error: "Internal error" });
});`}
            />
            <Incident
              level="Senior"
              title="During a MongoDB failover the health check fails, the load balancer removes every pod, and the outage gets worse."
              symptom={`app.get("/health", async (req, res) => {
  await mongoose.connection.db.admin().ping();
  res.send("ok");
});`}
              fix={`Cause: liveness depends on the database. When the database blips, Kubernetes restarts healthy Node processes and drops their pools, which adds more connections when MongoDB returns.

Fix: liveness is process-only.
app.get("/health", (req, res) => res.send("ok"));
Put the ping on a separate readiness URL that can fail without killing the process, and back off reconnects.`}
            />
          </Lesson>
          <Lesson title="Lesson 2: Deploys that break old documents">
            <Incident
              level="Mid"
              title="After adding required: true on phone, every old user gets 500 when they edit their name."
              symptom={`phone: { type: String, required: true }
user.name = req.body.name;
await user.save();`}
              fix={`Cause: save() validates the whole document. Old users have no phone, so the name update fails.

Fix: do not mark a new field required until it is backfilled.
phone: { type: String }
Backfill, then required: true in a later deploy.
For the name route, a targeted update does not revalidate untouched required paths the same way, but you should still backfill:
await User.updateOne({ _id }, { $set: { name } }, { runValidators: true });`}
            />
            <Incident
              level="Senior"
              title="A hot reload in dev and a rolling deploy in prod briefly run two schemas. Some writes miss the new enum."
              symptom={`status enum gained "refunded". Old pods reject it. New pods write it. Old pods then cannot read-modify-save those orders.`}
              fix={`Cause: expand/contract was skipped. Validation is stricter than the data other pods write.

Fix, in order:
1. Deploy code that accepts the new enum but does not write it yet.
2. Deploy writers.
3. Only then remove the old value.
Never add a stricter validator and the writer in the same release if old pods are still up.`}
            />
          </Lesson>
        </>
      )}

      {active === "routes" && (
        <>
          <h2 className="text-2xl font-bold text-amber-300">
            Double submits, idempotency, and bad retries
          </h2>
          <Lesson title="Lesson 1: The client retried">
            <Incident
              level="Mid"
              title="A flaky mobile network created two orders and charged the card twice for one tap."
              symptom={`router.post("/orders", async (req, res) => {
  const order = await Order.create({ userId: req.user.id, items: req.body.items });
  await charge(order);
  res.status(201).json(order);
});`}
              fix={`Cause: the client retried a POST that was not idempotent. Both creates succeeded.

Fix: require an Idempotency-Key and unique-index it.
orderSchema.index({ userId: 1, idemKey: 1 }, { unique: true });
try {
  const order = await Order.create({
    userId: req.user.id,
    idemKey: req.get("Idempotency-Key"),
    items: req.body.items,
  });
  await charge(order);
  res.status(201).json(order);
} catch (err) {
  if (err.code === 11000) {
    const existing = await Order.findOne({ userId: req.user.id, idemKey: req.get("Idempotency-Key") });
    return res.status(200).json(existing);
  }
  throw err;
}
Charge the gateway with the same key.`}
            />
            <Incident
              level="Senior"
              title="The queue retries a job that already decremented stock. Stock drifts down on every retry."
              symptom={`async function handle(job) {
  await Product.updateOne({ sku: job.sku }, { $inc: { stock: -1 } });
  await Email.send(job);
  // send throws, the job retries
}`}
              fix={`Cause: the write is not idempotent. The email failure retries the decrement.

Fix: a processed-keys collection with a unique jobId.
try {
  await Processed.create({ jobId: job.id });
} catch (err) {
  if (err.code === 11000) return;
  throw err;
}
await Product.updateOne({ sku: job.sku, stock: { $gte: 1 } }, { $inc: { stock: -1 } });
await Email.send(job);
If email fails, do not retry the decrement. Retry only the email, or record the step.`}
            />
            <Incident
              level="Mid"
              title="Users double-click Pay. Both requests pass the stock check. You already fixed the stock race, but two orders still exist."
              symptom={`The conditional $inc runs twice because there is no idempotency key and stock was 5.`}
              fix={`Cause: the stock update is correct and still allows two purchases when stock remains. The product bug is a duplicate order, not the counter.

Fix: unique index on the client attempt id, as in the checkout incident above. Disable the button, but do not trust the UI. The database must reject the second insert.`}
            />
          </Lesson>
          <Lesson title="Lesson 2: Express + Mongoose shape bugs">
            <Incident
              level="Junior"
              title="POST /users returns 500 'User validation failed: email is required' even though the JSON has email. The log shows email: undefined."
              symptom={`app.use(express.urlencoded({ extended: true }));
// no express.json()
const user = await User.create({ email: req.body.email, name: req.body.name });`}
              fix={`Cause: the client sent Content-Type application/json and Express never parsed it. req.body is {}.

Fix:
app.use(express.json({ limit: "100kb" }));
Place it before the routes. A huge limit is a DoS; keep it small.`}
            />
            <Incident
              level="Mid"
              title="The route catches CastError and returns 400, but a bug in the catch block calls res.json twice and Node logs ERR_HTTP_HEADERS_SENT."
              symptom={`try {
  const user = await User.findById(req.params.id);
  res.json(user);
} catch (err) {
  res.status(400).json({ error: err.message });
}
// error middleware also sends a response`}
              fix={`Cause: both the route and the error middleware wrote a response, or the route wrote after next(err).

Fix: either handle it fully in the route and return, or only call next(err) and map CastError in one place. Never both.
if (err.name === "CastError") return res.status(400).json({ error: "Invalid id" });
return next(err);`}
            />
            <Incident
              level="Senior"
              title="An admin search endpoint is slow and sometimes returns unexpected users. req.query is passed through."
              symptom={`router.get("/admin/users", async (req, res) => {
  res.json(await User.find(req.query).lean());
});`}
              fix={`Cause: this is both a NoSQL operator injection hole and an unbounded query. ?role[$gt]= pulls a huge set.

Fix:
const filter = {};
if (req.query.email) filter.email = String(req.query.email).toLowerCase();
if (req.query.role && ["admin", "user"].includes(req.query.role)) filter.role = req.query.role;
const users = await User.find(filter).select("name email role").limit(50).lean();
res.json(users);`}
            />
            <Incident
              level="Mid"
              title="Timestamps say the document was updated tomorrow. Reports for 'today' miss it."
              symptom={`The API container UTC offset drifted, and the route stored createdAt: new Date(req.body.createdAt) from a client clock.`}
              fix={`Cause: client clocks and a hand-built createdAt bypass Mongoose timestamps.

Fix: let the schema own the time.
{ timestamps: true }
Ignore req.body.createdAt. Query with a server-built range:
const start = new Date();
start.setUTCHours(0, 0, 0, 0);
await Order.find({ createdAt: { $gte: start } }).lean();`}
            />
          </Lesson>
        </>
      )}

      {active === "debug" && (
        <>
          <h2 className="text-2xl font-bold text-amber-300">
            A production debug path you can say in an interview
          </h2>
          <Lesson title="Lesson 1: Latency, errors, and wrong data">
            <Incident
              level="Senior"
              title="Checkout p99 is 3 seconds. You have 15 minutes. What do you do, in order?"
              symptom={`Express route: validate body, decrement stock, create order, charge card, send email, res.json.`}
              fix={`1. Check the error rate and whether it is one route or every route.
2. If every route hangs, look at the pool: readyState, waiting connections, MongoDB failover, maxPoolSize.
3. If one route is slow, time each await. The email provider is often the outlier. Move email to a queue so the response does not wait on it.
4. explain() the stock and order queries. Fix COLLSCAN before adding instances.
5. Confirm the stock update is a conditional $inc, not find-then-save.
6. Confirm the charge uses an idempotency key so your mitigation retries are safe.
7. Add maxTimeMS on the MongoDB calls so a bad query fails instead of holding the pool.

Say this sequence out loud. Interviewers want the order, not a random list of tools.`}
            />
            <Incident
              level="Senior"
              title="Users report wrong balances. There is no error in the logs. How do you prove the bug?"
              symptom={`Wallet service uses find + save. A worker also applies refunds with updateOne.`}
              fix={`Cause to suspect first: lost updates between the request and the worker.

How to prove it:
- Log the document __v and balance before and after each write.
- Reproduce with two concurrent requests in a test.
- If both succeed and the final balance dropped one update, that is the bug.

Fix the write:
await Wallet.updateOne(
  { _id, balance: { $gte: amount } },
  { $inc: { balance: -amount } }
);
Write a ledger entry in the same unique-idempotent way. Do not debug this by reading a single document in Compass once. You need the concurrent case.`}
            />
            <Incident
              level="Mid"
              title="Only one customer is affected. Their order page is empty. Everyone else is fine."
              symptom={`GET /orders returns [] for user id 507f1f77bcf86cd799439011. Compass shows their orders.`}
              fix={`Check the types, not the cluster.
Orders may store userId as a string while the route queries with an ObjectId, or the opposite.
console.log(typeof orders[0].userId) in a one-off script.

Fix the query to the stored type, then migrate:
await Order.updateMany({ userId: { $type: "string" } }, [
  { $set: { userId: { $toObjectId: "$userId" } } },
]);
A single bad import often explains a single-tenant incident.`}
            />
            <Incident
              level="Senior"
              title="You need to see which operation is stuck right now. Mongoose has no currentOp helper."
              symptom={`Requests pile up. You need the MongoDB operation, not another Node log line.`}
              fix={`MongoDB fallback, through the existing Mongoose connection:

const admin = mongoose.connection.db.admin();
const { inprog } = await admin.command({ currentOp: 1, active: true });
console.log(inprog.map((op) => ({
  secs: op.secs_running,
  ns: op.ns,
  op: op.op,
  plan: op.planSummary,
})));

Kill only a known runaway with admin.command({ killOp: 1, op: id }) after you are sure.
Then fix the query. Killing it is the mitigation, not the repair.`}
            />
          </Lesson>
          <Lesson title="Lesson 2: Fixes that cause the next incident">
            <Incident
              level="Senior"
              title="You added an index in production from a laptop and the build is still running an hour later. Writes are queueing."
              symptom={`await User.collection.createIndex({ email: 1 }, { unique: true });
// unique build fails halfway because duplicates exist`}
              fix={`Cause: a unique index build aborts if duplicates exist, and a heavy build competes with traffic.

Fix:
1. Find duplicates first with an aggregation on email and $group count $gt 1.
2. Resolve them.
3. Build the index in a maintenance window from one script, not from the Express boot path.
4. If the build is harming production, drop the in-progress index only if you understand the currentOp state. Do not start a second build from another pod.`}
            />
            <Incident
              level="Mid"
              title="The bugfix deployed, but old Node pods still run the bad query. You think the fix failed."
              symptom={`Rolling deploy. Half the pods log the new release, half still show COLLSCAN in the profiler.`}
              fix={`Cause: you are looking at mixed versions.

Fix: confirm every pod's image digest, then read the profiler again.
Add the release id to the query comment so the profiler shows who sent it:
Order.find(filter).comment("orders-list release-142")
Do not roll back a correct index because an old pod is still scanning.`}
            />
            <Incident
              level="Senior"
              title="A cache in front of Express serves another user's orders after you added a shared CDN."
              symptom={`res.json(await Order.find({ userId: req.user.id }).lean());
Cache-Control was left as public from a copy-paste.`}
              fix={`Cause: a shared cache key ignored Authorization. This is an Express response bug that looks like a MongoDB leak.

Fix:
res.set("Cache-Control", "private, no-store");
res.json(orders);
Never put tenant data on a cache that varies only by URL.
The database query was fine.`}
            />
          </Lesson>
        </>
      )}
    </ScenarioPage>
  );
}
