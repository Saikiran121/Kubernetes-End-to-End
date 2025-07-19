# 01. Service
      - A Kubernetes Service provides a stable network endpoint for a set of Pods.
      - Even as Pods start, stop, or move, the Service’s IP and DNS name stay the same.
      - Think of a Service as a virtual load-balancer or phone switchboard for your application.


# 02. Why You Need Services
      a. Pods are ephemeral: their IPs can change when they restart.
      b. Services give you a single, fixed address to reach a group of Pods.
      c. They handle load balancing, distributing traffic evenly.


# 03. Core Service Types
      a. ClusterIP: Internal-only access within the cluster, use when Most microservices that talk to each other

      b. NodePort; Exposes Service on each node’s port (30000–32767 range), use when Quick testing or simple on-prem setups

      c. LoadBalancer: Provisions a cloud provider’s external load balancer, use when Public access in managed cloud environments

      d. ExternalName: Maps a Service to an external DNS name via CNAME record, use when Connecting to legacy services or databases


# 04. How It Works
      a. Pod Labels
         - Assign each Pod a label, e.g., app: my-api.
      
      b. Service Selector
         - Service uses a selector to match those labels.
      
      c. Virtual IP
         - Kubernetes assigns a ClusterIP: a virtual IP inside the cluster.
      
      d. Routing & Load Balancing
         - Requests to the Service IP are forwarded to one of the matching Pods.
      

      Client Pod
           │
           ▼
      Service (ClusterIP: 10.0.0.100)
           │  ──► Pod A (10.0.1.4)
           │  ──► Pod B (10.0.1.5)
           └─► Pod C (10.0.1.6)


# 05. Simple YAML Example
      
      apiVersion: v1
      kind: Service
      metadata:
        name: my-api-service
      spec:
        selector:
          app: my-api            # Matches Pods labeled app: my-api
        ports:
          - port: 80             # Service port
            targetPort: 8080     # Container’s port
        type: ClusterIP         # Internal-only access

