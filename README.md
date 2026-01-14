# DevOps Project: URL Shortener API

This project is a small backend service for shortening URLs, built to practice and demonstrate a complete end-to-end DevOps lifecycle. It includes a REST API, unit tests, a full CI/CD pipeline with security scanning, containerization with Docker, and manifests for Kubernetes deployment.

## Features

-   **URL Shortener API**: A simple REST API to encode and decode URLs.
-   **CI/CD Pipeline**: Automated build, test, and containerization pipeline using GitHub Actions.
-   **Observability**: Built-in support for metrics, structured logging, and request tracing.
-   **Security**: Integrated SAST (`npm audit`) and DAST (OWASP ZAP) scans.
-   **Containerized**: Ready-to-run Docker image.
-   **Deployable**: Includes Kubernetes manifests for local deployment.

--- 

## Tech Stack

-   **Backend**: Node.js, Express
-   **Testing**: Jest, Supertest
-   **CI/CD**: GitHub Actions
-   **Containerization**: Docker
-   **Deployment**: Kubernetes (kind)
-   **API Specification**: OpenAPI 3.0

--- 

## Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

You must have the following tools installed:

-   [Docker Desktop](https://www.docker.com/products/docker-desktop/)
-   [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl-windows/) (Kubernetes command-line tool)
-   [kind](https://kind.sigs.k8s.io/docs/user/quick-start/#installation) (Kubernetes in Docker)

### Installation & Deployment Guide

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/Aymensat/Devops.git
    cd Devops
    ```

2.  **Create a Local Kubernetes Cluster**
    If you don't have a `kind` cluster running, create one with this command:
    ```bash
    kind create cluster
    ```

3.  **Deploy the Application**
    Run the deployment script. This will apply the Kubernetes manifests to your cluster, which will then pull the public Docker image and start the application.
    ```bash
    # On Windows
    .&#x2F;deploy.bat
    ```
    This script will finish by starting `kubectl port-forward`, which creates a connection to the application running inside your cluster. **Leave this terminal window open.**

4.  **Access the Application**
    Once the deployment is complete and port-forwarding is running, you can access the application in your web browser or via an API client:
    -   **Health Check**: [http://localhost:8080/hi](http://localhost:8080/hi)
    -   **Metrics**: [http://localhost:8080/metrics](http://localhost:8080/metrics)

--- 

## API Documentation

This project uses the OpenAPI standard for API documentation. The full specification, detailing all available endpoints, request bodies, and responses, can be found in the `openapi.yaml` file.

### Quick Example: Create a Shortened URL

You can use a tool like `curl` to interact with the API.

**Request:**
```bash
# In a new terminal
curl -X POST -H "Content-Type: application/json" -d "{\"url\":\"https://www.google.com\"}" http://localhost:8080/encode-url
```

**Expected Response:**
```json
{
  "decodedUrl": "https://www.google.com",
  "encodedUrl": "b3d1e6"
}
```
You can then access `http://localhost:8080/b3d1e6` and it will redirect you to Google.

--- 

## Project Workflow & Philosophy

-   **Git Workflow**: All work was done on feature branches and merged into `main` via Pull Requests, ensuring a clean and stable primary branch.
-   **CI/CD**: The GitHub Actions pipeline handles all the heavy lifting of integration, testing, and packaging. This includes running security scans (SAST and DAST) on every change.
-   **Infrastructure as Code**: All infrastructure components (Docker image, Kubernetes manifests, deployment logic) are defined as code within this repository, ensuring a repeatable and predictable setup.