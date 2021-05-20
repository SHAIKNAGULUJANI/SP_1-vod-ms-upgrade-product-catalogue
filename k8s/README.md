Kubernetes configuration files go here.

Deployment yaml should only specify the environment variables required by this project. The first 3 environment variables must always be:
1. KUBERNETES_NAMESPACE
2. NODE_ENV
3. POD_NAME

Resource limitations are also controlled in the deployment.yaml, the values require profiling to find the optimum settings your service requires.

The HPA yaml specifies the horizontal pod autoscaler configuration for your service. The minimum replicas must always be >= 2.

The `targetCPUUtilizationPercentage` property specifies the CPU usage at which to start scaling up pods.