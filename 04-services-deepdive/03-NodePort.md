# 01. NodePort (analogy)
      - NodePort is like putting public door on every building (node) in your cluster so people outside can knock and get directed inside:
        
        a. Stable outside address
           - Kubernetes opens the same port (eg 30080) on every node's IP address - so you can reach your service at http://<NodeIP>:30080
             no matter which node you hit.

        b. Built on ClusterIP
           - That public door simply forwards your request into the cluster hallway (the ClusterIP) and then on to any matching Pod.
        
        c. When to Use
           - Great for quick demos or on-premises setups where you don’t have a cloud load balancer. Just pick a port in the 30000–32767 range, 
             expose it, and your service is reachable from outside.


# 02. NodePort
      - Purpose: Expose a Service on each node’s IP at a static port in the 30000–32767 range

      - Behavior: Builds on ClusterIP. Opens <NodeIP>:<NodePort> on every node and forwards to the Service’s ClusterIP.

      - Use Cases: Simple external access in on-prem clusters, quick testing without a cloud load balancer.

