# 01. what do you mean by multi-container pods?
      - A multi-container pod lets you run two or more tightly coupled containers together on the same node, sharing the Pods network
        namespace and storage volumes
      
      - This is ideal for common patterns—sidecar, ambassador, and adapter—where each container has a distinct role but must cooperate closely.


# 02. Why Multi-Container Pods?
      - Kubernetes Pods are the smallest deployable unit and normally contain a single container. You use multiple containers in one Pod when:
        a. Shared context: Containers need the same IP, port space, and storage.

        b. Tight coupling: Helper processes (logging, proxies, sync agents) must start, run, and stop with the primary application.

        c. Separation of concerns: Each container does one job—app code, log shipping, traffic proxy—so you don’t bloat your main image.


# 03. Core Design Patterns
      a. Sidecar
         Role: Supplements the main container (logging, metrics, config refresh)
         Use Case: Fluentd log shipper alongside web server
      
      b. Ambassador
         Role: Acts as a local proxy for external services
         Use case: Database proxy handling retries and TLS
      
      c. Adapter
         Role: Transforms I/O between containers
         Use Case: Log formatter reading raw logs, outputting JSON


# 04. How Containers Share Resources
      
      a. Network namespace
         - All containers share the Pod’s single IP.
         - Use localhost:<port> to communicate between containers.
      
      b. Storage volumes
         - Define a volume at Pod level (e.g., emptyDir or PersistentVolumeClaim).
         - Each container lists a volumeMount to read/write the same files.
      
      c. Lifecycle
         - All containers start together; if one crashes, the Pod’s restartPolicy applies collectively.


# 05. Example: Sidecar Logging Pod
      - The file is stored at pods-deepdive/03-multi-container-pods.yaml
      - Below is a minimal Pod manifest demonstrating a sidecar pattern.
        a. web serves HTTP requests and writes access logs to /var/log/web
        b. log-shipper reads those logs and ships them elsewhere
      
      - What Happens:
        a. Nginx writes logs to the shared emptyDir volume.
        b. The sidecar’s tail -F reads new lines and processes them (here reversed by sed).
        c. Both containers address the same path and share the Pod’s IP, enabling instant, local collaboration.


# 06. Deploying and Verifying
      - kubectl apply -f web-with-logging.yaml
      - kubectl get pod web-with-logging            # Should show 1/1 or 2/2 Ready once both containers run
      - kubectl logs web-with-logging -c log-shipper
      - kubectl exec -it web-with-logging -c web -- curl localhost


# 07. Best Practices
      - One concern per container: Keep images small and focused.
      - Resource limits: Assign CPU/memory to each container to avoid contention.
      - Health probes: Define readiness/liveness checks for both containers to ensure Pod health.
      - Namespace isolation: Use separate Pods for loosely coupled services—only use multi-container Pods for truly co-dependent processes.


# 08. When Not to Use
      - Avoid multi-container Pods if:
        a. Services are loosely coupled and need independent scaling or upgrades.
        b. Containers don’t share strong lifecycle or resource requirements.