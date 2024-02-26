import express from "express";
import { collectDefaultMetrics, Registry } from "prom-client";

const register = new Registry();

collectDefaultMetrics({ register });

const app = express();
const port = 3000;

app.get("/metrics", async (req, res) => {
  try {
    const metrics = await register.metrics();
    res.set("Content-Type", register.contentType);
    res.end(metrics);
  } catch (err) {
    res.status(500).end(err);
  }
});

app.listen(port, () => {
  console.log(`Metrics server listening at http://localhost:${port}`);
});

export { register };
