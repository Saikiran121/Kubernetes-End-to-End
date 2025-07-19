# 01. Pod
      - A Pod is the smallest deployale unit in kubernetes.
      - A group of one or more containers that share network, storage, and configuration.
      - Pods are ephemeral and managed by higher-level controllers (e.g., Deployments), but understanding them is the foundation of Kubernetes.


# 02. What is Pod?
      - A Pod represents a single instance of a running process in your cluster. It encapsulates:
        a. One or more containers (always co-located and co-scheduled on the same node)
        b. Shared storage volumes
        c. A unique IP address
        d. Options for security, resource limits, and restart policies
      
      - Pods model an application-specific “logical host” where its containers share the Pod’s namespace and filesystem


# 03. Pod Lifecycle Phases
      - Pods transition through five high-level phases
        
        a. Pending – Pod object accepted; images downloading; not yet bound to a node.

        b. Running – Pod bound to a node; at least one container is running or starting.

        c. Succeeded – All containers exited successfully; will not restart.

        d. Failed – At least one container terminated with failure; won’t restart.

        e. Unknown – API server cannot determine Pod status due to node communication error.


# 04. Minimal Pod YAML
      - Every Pod YAML must include apiVersion, kind, metadata, and spec. The simplest Pod runs one container:
        
        apiVersion: v1
        kind: Pod
        metadata:
          name: hello-pod         # Unique name
          labels:
            app: hello-app        # Useful for selectors
        spec:
          containers:
          - name: hello-container # Container name
            image: nginx:latest   # Docker image
            ports:
            - containerPort: 80   # Port exposed
      
      - Apply with:
        # kubectl apply -f pod.yaml
        # kubectl get pods


# 05. Key PodSpec Fields
      - Within spec, important fields include
        a. containers (required): List of containers to run.

        b. initContainers: Run to completion before main containers start.

        c. volumes: Mount storage (e.g., emptyDir, PVC).

        d. restartPolicy: Always (default), OnFailure, or Never.

        e. nodeSelector / affinity: Schedule Pods onto specific nodes.

        f. securityContext: Apply security settings at Pod or container level.

        g. imagePullSecrets: Credentials for private registries.


# 06. When to Use Pods Directly
      - Pods are typically managed by controllers (Deployments, ReplicaSets). Create standalone Pods only for:
        a. Debugging and one-off tasks (using kubectl run or Job).
        b. Init-container workflows.
        c. Ephemeral utility workloads.

