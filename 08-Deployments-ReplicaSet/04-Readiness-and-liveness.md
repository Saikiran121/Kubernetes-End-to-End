# 01. Readiness and Liveness Probes
      - Kubernetes health checks (readiness and liveness probes) keep only healthy Pods serving traffic and automatically  restart
        faulty ones. As you grow from simple probes to policy-driven governance and observability pipelines you’ll layer on PodDisruptionBudgets,
        quotas, admission controls, GitOps, canary analysis, and monitoring to achieve Black Belt–level resilience and agility.
      
      a. Liveness probe:
         - “Is my app alive?” If it fails, Kubernetes kills and restarts the Pod.
      
      b. Readiness probe
         - “Am I ready to serve traffic?” If it fails, Kubernetes removes the Pod from Service endpoints without killing it.  


      - Basic YAML Example
        
        readinessProbe:
          httpGet:
            path: /healthz
            port: 80
          initialDelaySeconds: 5   # Wait 5s before first check
          periodSeconds: 10        # Recheck every 10s
        
        livenessProbe:
          httpGet:
            path: /livez
            port: 80
          initialDelaySeconds: 15  # Give more startup time
          periodSeconds: 20


# 02. How It Works (Analogy)
      - Think of Pods as cashiers at a store.
      - A readiness check asks, “Is your register open?” If not, customers skip you.
      - A liveness check asks, “Are you awake?” If not, you’re escorted home (Pod restarted).



# 03. PodDisruptionBudget (PDB)
      - Goal: Guarantee at least N Pods stay up during voluntary maintenance (e.g., node upgrades).

      - YAML Snippet:
        
        apiVersion: policy/v1
        kind: PodDisruptionBudget
        metadata:
          name: webapp-pdb
        spec:
          minAvailable: 2           # Always keep ≥2 Pods running
          selector:
            matchLabels:
              app: webapp
      
      - Why it Matters:
        During upgrades or manual evictions, Kubernetes won’t drain nodes if doing so would breach your budget—protecting your users from sudden capacity loss.

