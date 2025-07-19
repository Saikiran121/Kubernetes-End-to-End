# 01. ClusterIP (analogy)
      - ClusterIP is like an Invisible hallway inside your kubernetes "office building" where only employees(Pods) can walk.

      - Here’s what that means:
      
        a. Stable internal address
           - Kubernetes gives your service a private, internal IP (the "hallway entrance") that never changes, even if the rooms
             behind it (Pods) come and go.
        
        b. Traffic Routing
           - When one Pod wants to talk to another service, it walks down the hallway (sends to the ClusterIP) and kube-proxy
             quietly directs it to any matching Pod behind that door, no extra setup needed.
        
        c. Use Case
           - Great for things that only need in-building communication, like one microservice calling another, a database or internal APIs
             wihtout exposing anything to the outside world


# 02. ClusterIP
      - Purpose: Internal-only access within the cluster.

      - Behavior: Assigns a virtual IP (ClusterIP) that routes traffic to matching Pods via kube-proxy (iptables or IPVS).

      - Use Cases: Microservice-to-microservice communication, databases, internal APIs.

