# 01. backend-service (ClusterIP) is only reachable inside the cluster on port 3000.

# 02. frontend-service (LoadBalancer) gets an external IP (in cloud environments) or waits for your cloud LB.

# 03. Test End-to-End
      a. Backend health check (inside cluster):
         kubectl run tmp --rm -it --namespace demo-app --image=busybox -- sh
         wget -qO- backend-service:3000/health
      
      b. Frontend access:
         If external IP assigned:
         curl http://<EXTERNAL_IP>/
