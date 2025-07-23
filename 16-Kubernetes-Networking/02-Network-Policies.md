# 01. Understanding Network Policies: Your Digital Firewall
      - Network Policies are like security checkpoints in an airport. By default, Kubernetes allows all pods to talk to each other, imagine 
        an airport where anyone can go anywhere. Network policies let you setup controlled access points.
      
      - Key Concepts:
        a. Default Allow: Without policies, all traffic flows freely.
        b. Default Deny: When policies are applied, only explicitly allowed traffic passes.
        c. Additive Nature: Multiple policies combine their "allow" rules


# 02. Types of Network Policy Rules
      a. Ingress Rules (Incoming Traffic)
         - The Ingress Rules YAML file is stored at 16-Kubernetes-Networking/03-Ingress-Rules.yaml
      
      b. Egress Rules (Outgoing Traffic)
         - The Egress Rules YAML file is stored at 16-Kubernetes-Networking/04-Egress-Rules.yaml


# 03. Real-World Network Policy Examples
      a. Database Isolation
         - Only allow web tier to access database and the file is stored at 16-Kubernetes-Networking/05-Database-Isolation.yaml
      
      b. Namespace Isolation
         - Only allow web tier to access database and the file is stored at 16-Kubernetes-Networking/06-Namespace-Isolation.yaml