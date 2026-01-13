# DevOps Project Progress Report

This document details the progress made on the DevOps project as of the last review. It outlines which objectives have been met, which are in progress, and which are yet to be started, with specific examples from the codebase.

## Overall Progress

Here is a summary of your progress based on the project objectives:

| Objective                     | Status              |
| ----------------------------- | ------------------- |
| Backend REST API              | ✔️ Done             |
| Git/GitHub Version Control    | ✔️ Done             |
| CI/CD Pipeline                | ✔️ Done             |
| **Observability**             |                     |
| - Metrics                     |  parcialmente Done     |
| - Logs                        | ✔️ Done             |
| - Tracing                     | ✔️ Done             |
| **Security Checks**           |                     |
| - SAST                        | ✔️ Done             |
| - DAST                        | ❌ Not Done         |
| Containerization (Docker)     | ✔️ Done             |
| Kubernetes Deployment         | ❌ Not Done         |
| Project Documentation         | ❌ Not Done         |
| Final Report                  | ❌ Not Done         |

---

## Detailed Breakdown

### 1. Backend REST API (✔️ Done)

You have successfully created a small backend service using Node.js and Express. The service functions as a URL shortener.

**Code Example (`server.js`):**

The main application file sets up an Express server.

```javascript
const express = require("express");
const app = express();

// ... (middleware) ...

const urlDBs = {};

app.post("/encode-url", (req, res) => {
  const decodedUrl = req.body.url;
  // ... (logic to shorten URL) ...
  urlDBs[encodedUrl] = decodedUrl;
  return res
    .status(200)
    .json({ decodedUrl: decodedUrl, encodedUrl: encodedUrl });
});

app.get("/:id", (req, res) => {
  const encodedUrl = req.params.id;
  // ... (logic to redirect to original URL) ...
  res.redirect(decodedUrl);
});

// ... (other routes) ...

module.exports = app; // for our tests to import and use

if (require.main == module) {
  app.listen(process.env.PORT || 5000, () =>
    console.log("server running on 5000")
  );
}
```

### 2. Unit Tests (✔️ Done)

You have written tests for your API using `jest` and `supertest`.

**Code Example (`tests/app.test.js`):**

```javascript
const request = require("supertest");
const app = require("../server");

describe("my URL shortener API general tests :) ", () => {
  it("should shorten a valid URL", async () => {
    const longUrl = "http://www.enicarthage.rnu.tn/";

    const res = await request(app).post("/encode-url").send({ url: longUrl });

    expect(res.statusCode).toEqual(200);
    expect(res.body.decodedUrl).toEqual(longUrl);
    expect(res.body.encodedUrl).toBeDefined();
  });
});
```

### 3. Observability (partially Done)

You have started implementing observability basics.

#### Metrics (partially Done)

You have a `/metrics` endpoint to expose simple metrics.

**Code Example (`server.js`):**

```javascript
let requestCount = 0; // metrics

//obersavavility/metrics middleware
app.use((req, res, next) => {
  requestCount++;
  next();
});

//metrics endpoint
app.get("/metrics", (req, res) => {
  res.json({
    status: "up",
    totalRequests: requestCount,
    uptime: process.uptime(), //  How long server has been running (in seconds)
  });
});
```

#### Logs (✔️ Done)

You are using `morgan` for structured logging.

**Code Example (`server.js`):**

```javascript
const morgan = require("morgan");

// ...

// We modify morgan to include the Trace ID in the logs
morgan.token("id", (req) => req.traceId);
// format: [ID] Method URL Status ResponseTime
app.use(morgan("[:id] :method :url :status :response-time ms"));
```

#### Tracing (✔️ Done)

You have implemented basic request tracing by generating a unique ID for each request.

**Code Example (`server.js`):**

```javascript
const crypto = require("crypto");

app.use((req, res, next) => {
  const traceId = crypto.randomUUID(); // Generate a random UUID
  req.traceId = traceId; // Attach it to the req object
  res.set("X-Request-Id", traceId); // Send it back to the user
  next();
});
```

### 4. Containerization with Docker (✔️ Done)

You have created a `Dockerfile` to containerize your application.

**Code Example (`Dockerfile`):**

```dockerfile
# 1. THE BASE (The OS)
FROM node:18-alpine

# 2. THE SETUP (The Folder)
WORKDIR /app

# 3. THE DEPENDENCIES (The Smart Layering)
COPY package*.json ./
RUN npm install

# 4. THE CODE (The App)
COPY . .

# 5. THE PORT (Documentation)
EXPOSE 5000

# 6. THE START COMMAND (The Action)
CMD ["node", "server.js"]
```

### 5. CI/CD Pipeline & SAST (✔️ Done)

Your local `.github/workflows/ci.yml` now contains a correct and functioning CI/CD pipeline for your Node.js application. It properly installs dependencies, runs tests, and performs a security scan (SAST) with `npm audit`.

**Code Example (`.github/workflows/ci.yml`):**
```yaml
name: DevOps Pipeline

on:
  push:
    branches: ["main"]
  pull_request:
    branches: ["main"]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      # --- PHASE 1: CI (Continuous Integration) ---
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Install Dependencies
        run: npm install

      - name: Security Scan (SAST)
        run: npm run scan

      - name: Run Integration Tests
        run: npm test

      # --- PHASE 2: CD (Continuous Deployment) ---
      # We only run this if tests passed AND we are on the 'main' branch.

      - name: Set up Docker Buildx
        if: github.ref == 'refs/heads/main'
        uses: docker/setup-buildx-action@v2

      - name: Login to Docker Hub
        if: github.ref == 'refs/heads/main'
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build and Push Docker Image
        if: github.ref == 'refs/heads/main'
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: ${{ secrets.DOCKER_USERNAME }}/devops-project:latest
```

---

## What's Next?

Here are the remaining objectives for your project:

### 1. Security Checks (DAST) (❌ Not Done)

*   **DAST:** There is no Dynamic Application Security Testing in place. You'll need to add a step to your CI/CD pipeline to run a simple runtime scan of your deployed API.

### 2. Kubernetes Deployment (❌ Not Done)

*   You need to create Kubernetes manifest files (e.g., `deployment.yaml`, `service.yaml`) to deploy your application to a Kubernetes cluster (like minikube or kind).

### 3. Project Documentation (❌ Not Done)

*   Your `README.md` is currently a placeholder. It should be updated to include:
    *   A description of the project.
    *   Instructions on how to set up and run the project locally.
    *   Instructions on how to build and run the Docker container.
    *   API documentation (endpoints, request/response examples).

This detailed analysis should give you a clear understanding of your progress and the remaining work.
