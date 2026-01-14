# Final Project Report

This document provides a comprehensive overview of the DevOps project, detailing its architecture, the tools and technologies used, and the implementation of key DevOps practices including observability, security, and automated deployment. It concludes with a summary of the lessons learned throughout the project lifecycle.

---

## 1. Project Architecture & Tools

### 1.1. Application Choice

For this project, I chose to build a **URL Shortener**. This is a classic "starter" project in the DevOps space as it is simple enough to manage within the project constraints but complex enough to involve all the necessary components of a modern web service: a persistent (in-memory) database, multiple API endpoints, and clear, testable logic.

### 1.2. Architecture & Technology Stack

The application is a monolithic backend service built on **Node.js** and the **Express** framework.

- **Node.js & Express**: This stack was chosen for its convenience and suitability for small, I/O-bound applications. The minimal and flexible nature of Express made it ideal for staying within the 150-line code constraint while still building a functional REST API. It also provided a good opportunity to practice JavaScript development in a backend context.

- **Jest & Supertest**: For unit and integration testing, `jest` was used as the test runner, and `supertest` was used to make HTTP requests to the API. A key advantage of `supertest` is its ability to test the API endpoints without needing to have the server actively listening on a port, making tests faster and more reliable in a CI environment.

---

## 2. CI/CD & Automation

A full CI/CD pipeline was set up using **GitHub Actions**. The pipeline automates testing, security scanning, and containerization.

- **Workflow**: The pipeline is triggered on every `push` or `pull_request` to the `main` branch. It checks out the code, installs dependencies, runs tests, performs security scans, and finally builds and pushes a Docker image.

- **Secrets Management**: To maintain security, my Docker Hub credentials were not hardcoded. Instead, they were stored as encrypted **GitHub Secrets** (`DOCKER_USERNAME` and `DOCKER_PASSWORD`) and securely passed to the login action in the workflow.

- **Development Process**: The project adhered to a strict Git workflow. All new features and fixes were developed on separate branches and integrated into `main` via **Pull Requests**. This process, combined with peer reviews, ensured code quality and a stable master branch. A notable exception was minor documentation updates to the README, which were sometimes committed directly.

---

## 3. Observability

Observability was a core focus, implemented through three pillars: metrics, logs, and tracing. I chose to implement these from scratch rather than using a full-fledged solution like Prometheus to better understand the underlying concepts.

- **Metrics**: A custom `/metrics` endpoint was created. This endpoint exposes simple but important application metrics:

  - `totalRequests`: A counter that increments on every incoming request.
  - `uptime`: The number of seconds the server has been running.

- **Logs**: Structured logging was implemented using the `morgan` middleware. By defining a custom format, every log entry for an incoming request is enriched with a unique Trace ID, allowing for easy filtering and correlation of logs related to a single request.

  - _Log Format_: `[:id] :method :url :status :response-time ms`

- **Tracing**: Basic request tracing was implemented by generating a unique ID (`crypto.randomUUID()`) for every single request that comes into the server. This **Trace ID** is passed in the `X-Request-Id` response header and is also included in the structured logs, effectively linking a specific request to all of its corresponding log entries.

---

## 4. Security (SAST & DAST)

Security was integrated directly into the CI/CD pipeline through both Static and Dynamic Application Security Testing.

- **SAST (Static Application Security Testing)**: This was performed using `npm audit`. This tool scans the project's dependencies for known security vulnerabilities. This proved to be a valuable learning experience. Initially, a high-severity vulnerability that could cause a Denial-of-Service (DoS) attack was found and fixed. Months later, running the scan again revealed a new high-severity vulnerability in a different package, demonstrating that SAST is not a one-time check but a continuous process.

- **DAST (Dynamic Application Security Testing)**: This was implemented using the **OWASP ZAP** baseline scanner. Setting up DAST was challenging, as it required the application's container to be running within the GitHub Actions environment so the scanner could target it. Once configured, ZAP successfully scanned the running application for common runtime vulnerabilities and generated a detailed report.

---

## 5. Containerization & Deployment

### 5.1. Docker

The application was containerized using Docker. The `Dockerfile` is optimized for small image size and build speed, using the `node:18-alpine` base image and leveraging Docker's layer caching by copying `package.json` and installing dependencies before copying the rest of the application code.

### 5.2. Kubernetes Setup

The project is configured for deployment to a local Kubernetes cluster (like `kind` or `minikube`).

- **Manifests**: The `k8s/` directory contains a `deployment.yaml` and a `service.yaml` file. The Deployment manages the application pods, ensuring they are running the correct Docker image, while the Service provides a stable internal IP address to access them.

- **Local Deployment**: A `deploy.bat` script was created to automate the local deployment process. This script runs the necessary `kubectl apply` commands to deploy the application and includes the `kubectl port-forward` command to make the service accessible from the local machine.

---

## 6. Lessons Learned

- **Merge Conflicts Can Be Deceiving**: A significant amount of time was lost debugging a CI/CD pipeline failure that was ultimately caused by a faulty merge. The merge conflict resulted in a subtle syntax error in the `ci.yml` file, which was difficult to spot. This highlighted the importance of carefully resolving merge conflicts, especially in configuration files.

- **Security is a Moving Target**: The SAST scan experience showed that a project's dependencies can become vulnerable at any time. Security scanning cannot be an afterthought; it must be an integrated and continuous part of the development lifecycle.

- **DAST is Tricky but Worthwhile**: While challenging to set up in a CI environment, DAST provides an essential layer of security by testing the application as it is actually running, catching vulnerabilities that static analysis might miss.

- **Infrastructure as Code is Powerful**: Defining the Kubernetes setup in YAML files and the deployment process in a script provides a repeatable and reliable way to manage the application's environment, which is a core principle of DevOps.
