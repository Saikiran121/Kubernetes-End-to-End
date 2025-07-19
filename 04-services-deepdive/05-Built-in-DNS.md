# 01. Built-in-DNS
      - When you ask for a Kubernetes Service by name, you dont need to know any Pod IPs, CoreDNS makes it "just work"

      - Here’s how it happens and why it matters in real-world use:
        
        a. Automatic DNS Record Creation
           - As soon as you create a service called my-svc in namespace dev, CoreDNS (the cluster DNS server) automatically
             makes a DNS A reocrd:
             
             my-svc.dev.svc.cluster.local → 10.96.5.12
             
             That long name breaks down as:
             - my-svc (your Service)
             - dev (its namespace)
             - svc (all Services)
             - cluster.local (your cluster’s domain)
        
        b. ClusterIP Discovery & Load-Balancing
           - The DNS Entry points to a ClusterIP, which is a virtual IP inside your cluster (e.g. 10.96.5.12)

           - When any Pod does curl http://my-svc.dev.svc.cluster.local, its request hits that ClusterIP.

           - kube-proxy on each node sees the packet and round-robins it onto one of the healthy backend Pods (matched by labels).
      
      - Real-Time Usage Examples
        a. Microservices talking to each other:
           - curl http://user-api.prod.svc.cluster.local/users/123
           - No need to look up Pod IPs—DNS + ClusterIP + kube-proxy handle it.

        b. In-cluster health checks or scripts:
           readinessProbe:
            httpGet:
              host: inventory-svc.prod.svc.cluster.local
              port: 80
              path: /healthz
        
        c. Debugging from a Pod shell:
           kubectl exec -it busybox -- nslookup cart-svc.shop.svc.cluster.local

      - Why it matters
        a. Stability: Your code and configs always refer to the same DNS name—even as Pods come and go.
        b. Simplicity: No manual Service discovery logic needed in your apps.
        c. Reliability: Built-in load-balancing via kube-proxy ensures even traffic distribution.


# 02. Built-in-DNS Example
      - A Kubernetes Service DNS name like my-svc.dev.svc.cluster.local → 10.96.5.12 gives you a stable, in-cluster address to reach your
        application even as Pods come and go.
      
      - Imagine you have a frontend web app (Pod-A) and backend API (Pod-B). Pods are ephemeral, if Pod-B crashes or scales up, its IP
        changes. Hard-Coding Pod IPs in your frontend would break whenever backend Pods Restarts
      
      - Instead, you:
        a. Label your back-end Pods:
           metadata:
              labels:
                app: my-svc

        b. Create a ClusterIP Service:
           apiVersion: v1
           kind: Service
           metadata:
             name: my-svc
             namespace: dev
           spec:
             type: ClusterIP
             selector:
               app: my-svc
             ports:
             - port: 80
               targetPort: 
        
        c. Your front end simply calls http://my-svc.dev.svc.cluster.local (which resolves to 10.96.5.12).
      
      - Because Kubernetes updates the DNS record automatically to point at whatever Pods match app: my-svc, your front-end never needs to know 
        individual Pod IPs. Traffic is load-balanced and stays healthy, even as Pods are replaced, scaled up, or moved. This is the core benefit of Service discovery via DNS in Kubernetes.


# 03. THE COMPLETE END TO END CODE IS IN /05-CoreDNS-Example



