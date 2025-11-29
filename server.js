// @ts-check

const express = require("express");
const morgan = require("morgan"); //for obersavavility/mertics
const app = express();
const crypto = require("crypto"); // for creating unique id

app.use(express.json()); //for post request

app.use((req, res, next) => {
  const traceId = crypto.randomUUID(); // Generate a random UUID (e.g., '1b9d6bcd-bbfd-4b2d-9b5d...')
  req.traceId = traceId; // Attach it to the req object so we can use it later
  res.set("X-Request-Id", traceId); // Send it back to the user in the Headers (Standard practice)
  next();
});

// 2. LOGS (Structured)
// We modify morgan to include the Trace ID in the logs
morgan.token("id", (req) => req.traceId);
// format: [ID] Method URL Status ResponseTime
app.use(morgan("[:id] :method :url :status :response-time ms"));

let requestCount = 0; // metrics

//obersavavility/metrics middleware
app.use((req, res, next) => {
  requestCount++;
  next();
});

const urlDBs = {};

app.get("/hi", (req, res) => {
  res.json({ message: "hii" });
});

app.get("/all", (req, res) => {
  res.json(urlDBs);
});

//metrics endpoint
app.get("/metrics", (req, res) => {
  res.json({
    status: "up",
    totalRequests: requestCount,
    uptime: process.uptime(), //  How long server has been running (in seconds)
  });
});

app.post("/encode-url", (req, res) => {
  const decodedUrl = req.body.url;

  if (!decodedUrl) return res.status(400).json({ message: "u must put url" });

  try {
    new URL(decodedUrl);
  } catch {
    return res.status(400).json({ message: "url malformed" });
  }

  let encodedUrl; // encoded url
  //logic
  let x = Math.random();
  encodedUrl = x.toString(36).substring(2, 8);

  urlDBs[encodedUrl] = decodedUrl;
  return res
    .status(200)
    .json({ decodedUrl: decodedUrl, encodedUrl: encodedUrl });
});

//decode

app.get("/:id", (req, res) => {
  const encodedUrl = req.params.id;

  if (!urlDBs[encodedUrl])
    return res
      .status(404)
      .json({ message: " there is no such encoded url man " });

  const decodedUrl = urlDBs[encodedUrl]; //urlDBs[encodedUrl] always give error idk why

  res.redirect(decodedUrl);
});

app.delete("/:id", (req, res) => {
  const encodedUrl = req.params.id;

  if (!(encodedUrl in urlDBs)) {
    return res
      .status(404)
      .json({ message: "there is no such encoded url to begin with" });
  }

  delete urlDBs[encodedUrl];
  return res.status(204).json({ message: "delete succeful" });
});

app.listen(process.env.PORT || 5000, () =>
  console.log("server running on 5000")
);
