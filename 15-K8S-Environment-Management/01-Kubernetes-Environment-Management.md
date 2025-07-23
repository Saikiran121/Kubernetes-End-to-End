# 01. Kubernetes Environment Management
      - A couple for small YAML tweaks can turn one Kubernetes cluster into three different "worlds", a Playground (Dev),
        a dress-rehearsal stage (staging), and the real show (prod).

      - Environment Management is the discipine of keeping those worlds consistent yet safely isolated, with configuration that 
        can be shared, templated, and overriden where it matters.


# 02. Why Environments Exist
      - Inside one cluster every pod sees every other Pod unless you create fences. Teams use separate environments to:
        a. Experiment safely (dev).
        b. Test release candidates under production-like conditions (staging).
        c. Serve real customers with strict reliability (prod).
      
      - Without clear separation, a bad configuration in dev could delete data in prod.


# 03. One Cluster, Three Namespaces

      apiVersion: v1
      kind: Namespace
      metadata:
        name: dev
      ---
      apiVersion: v1
      kind: Namespace
      metadata:
        name: staging
      ---
      apiVersion: v1
      kind: Namespace
      metadata:
        name: prod


# 04. Environment-Specific Overrides
      a. Replicas & Resources
         - Dev: replicas: 1, small CPU/memory.
         - Prod: replicas: 6, high limits.
      
      b. Image Tags
         - Dev uses :snapshot for rapid builds.
         - Prod uses immutable Git-SHA tags.
      
      c. Secrets
         - Different TLS certificates or database passwords per namespace.
         - Store encrypted secrets in separate back-end paths (e.g., Vault kv/dev/, kv/prod/).
      
      d. Ingress & DNS
         - dev.example.com → dev ingress class.
         - prod.example.com → prod ALB with WAF.
      
      e. Feature Flags
         - ConfigMap in dev enables experimental endpoints.
