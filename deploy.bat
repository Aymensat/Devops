@echo off
rem This script automates the deployment of the application to your local Kubernetes cluster.
rem It assumes you have a running Kubernetes cluster (like kind or minikube) and kubectl configured.

echo.
echo ➡️ STEP 1: Applying Kubernetes Manifests...
echo.

rem The 'kubectl apply -f' command tells Kubernetes to create or update resources
rem based on the configuration files in the 'k8s' directory.
rem It's idempotent, meaning you can run it multiple times safely.

kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml

echo.
echo ----------------------------------------
echo ✅ Deployment and Service applied successfully!
echo ----------------------------------------
echo.
echo The container image aymensat/devops-project:latest will now be pulled to your cluster.
echo You can check the status of the rollout by running:
echo kubectl rollout status deployment/devops-project-app
echo.
echo ℹ️ The script will now start port-forwarding to make the service accessible.
echo Your application will be available at http://localhost:8080/hi
echo.
echo THIS COMMAND WILL NOW BLOCK THIS TERMINAL.
echo Press CTRL+C in this window to stop the connection.
echo.

kubectl port-forward service/devops-project-service 8080:80