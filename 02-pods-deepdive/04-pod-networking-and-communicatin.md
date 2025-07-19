# 01. Pod Networking and Communication
      - every kubernetes pod gets its own IP address and shares that address and storage volumes among its containers.

      - Pods communicate with one another and with Services across nodes via a flat. IP-per-Pod network.

      - Understanding this model is crucial for designing reliable, scalable applications.


# 02. Pod Network Fundamentals
      a. IP-per-Pod
         - Each pod is assigned a unique IP address when scheduled.
         - All containers in the Pod share that IP and port namespace.
      
      b. Flat, Cluster-Wide Network
         - Any Pod can reach any other Pod directly by its IP, without NAT.
         - Simplifies service discovery: you always talk to podIP:port.
      
      c. Container Network Interface (CNI)
         - Kubernetes delegates networking to a pluggable CNI (e.g., Calico, Flannel, Cilium).
         - The CNI allocates Pod IPs, programs routes and firewall rules on each node, and enables cross-node packet delivery


# 03. Intra-Pod Communication
      - Within a single Pod:
        a. Shared Network Namespace: All containers see the same network interfaces and IP address.

        b. Localhost: Containers talk to each other using localhost:<port>.

        c. Use Cases:
           - Sidecar containers (logging, proxying) pair directly with a main container.
           - Init containers prepare data or certificates before the main container starts.
        

# 04. Pod-to-Pod Communication on the Same Node
      a. veth Pairs & Bridge
         - Each Pod’s interface (veth peer) plugs into a node-level Linux bridge.
         - The bridge forwards packets between veth interfaces for Pods on that node
      
      b. IP Routing
         - When Pod A (10.244.1.5) sends to Pod B (10.244.1.8), the bridge delivers directly if on the same node.


# 05. Pod-to-Pod Communication Across Nodes
      a. Overlay or Underlay Networking
         - CNIs implement an overlay (e.g., VXLAN) or program the underlay network (BGP, routing).
         - Overlay: encapsulate Pod-to-Pod packets in UDP/IP and decapsulate on the destination node.
         - Underlay: assign Pod CIDR blocks per node and rely on routing tables.
      
      b. Packet Flow
         - Pod A → encapsulate for node-2’s IP → network transport → node-2 decapsulates → Pod B.

# 06. Service Discovery and kube-proxy
      a. Services vs. Direct Pod IPs
         - Pod IPs are ephemeral; when Pods die or reschedule, their IPs change.
         - Services provide a stable virtual IP (ClusterIP) and DNS name.

      b. kube-proxy Modes
         - iptables (default): writes NAT rules so traffic to ClusterIP is load-balanced to Pod IPs.
         - IPVS: uses Linux IPVS for higher-performance load-balancing.
         - Userspace (legacy): routes through a userspace proxy (slower).

      c. DNS Integration
         - Kubernetes runs a DNS add-on (CoreDNS).
         - A Service my-svc in namespace dev is reachable at my-svc.dev.svc.cluster.local.


# 07. Ingress and External Access
      a. NodePort & LoadBalancer
         - NodePort: opens a port on every node (30000–32767) forwarding to the Service’s ClusterIP.
         - NodePort: opens a port on every node (30000–32767) forwarding to the Service’s ClusterIP.
      
      b. Ingress Controller
         - A specialized pod that watches Ingress resources and programs an HTTP(S) load-balancer (e.g., NGINX, Traefik).
         - Provides path-based or host-based routing to Services.


# 08. Network Policies
      a. Pod-Level Firewalls
         - NetworkPolicy objects declare which traffic is allowed to/from Pods.
         - Enforced by the CNI (if it supports policies).
      
      b. Typical Rules
         - Default deny: block all ingress/egress by default.
         - Allow from namespace: permit traffic from Pods in the same namespace or labeled group.
         - Port-restricted: allow only specific ports (e.g., TCP 80/443).


# 09. Troubleshooting Tips
      a. Check Pod IPs and Connectivity
         - kubectl get pod -o wide
         - kubectl exec -it pod-A -- ping <pod-B-IP>
      
      b. Inspect Routes on Nodes
         - ip route show
         - bridge link show
      
      c. Verify Service Endpoints
         - kubectl get endpoints my-svc
         - kubectl describe svc my-svc
      
      d. NetworkPolicy Debugging
         - kubectl describe networkpolicy
         # Test connectivity with netcat inside Pods
         - kubectl exec -it pod-A -- nc -vz pod-B 80

