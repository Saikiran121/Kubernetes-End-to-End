# 01. ReplicaSet
      - A ReplicaSet in Kubernetes ensures that a specified number of identical Pods are always running.

      - Think of it like an automated babysitter: if any Pod “cries” (fails or is deleted), the ReplicaSet immediately brings up a new one, so your
        application stays healthy.


# 02. Why Use a ReplicaSet?
      - High availability: Keeps your app always up by replacing failed Pods.

      - Scalability: Easily increase or decrease the number of Pods.

      - Self-healing: Detects unhealthy Pods and recreates them automatically.


# 03. How a ReplicaSet Works
      
      a. Desired state: You declare how many replicas you want.

      b. Pod template: You provide a Pod specification (containers, labels, ports).

      c. Selector: You define labels to match which Pods the ReplicaSet should manage.

      d. Control loop: The ReplicaSet continuously watches the cluster and:
         - Creates new Pods if the running count is below the desired number.
         - Deletes extra Pods if the count exceeds the desired number.
         - Adopts matching Pods not created by itself, if they share the selector labels.


# 04. ReplicaSet YAML Example
      
      apiVersion: apps/v1
      kind: ReplicaSet
      metadata:
        name: hello-rs             # ReplicaSet name
      spec:
        replicas: 3                # Desired number of Pods
        selector:
          matchLabels:
            app: hello-app         # Must match Pod template labels
        template:                  # Pod template
          metadata:
            labels:
              app: hello-app
          spec:
            containers:
            - name: web
              image: nginx:latest
              ports:
              - containerPort: 80
      
      - apiVersion and kind specify the object type.
      - metadata.name names the ReplicaSet.
      - spec.replicas sets how many Pods you want.
      - spec.selector finds matching Pods by label.
      - spec.template is the Pod blueprint used to create new Pods.


# 05. When to Use vs. When Not to Use
      - Use directly if you need a fixed set of Pods without rolling updates or version history.

      - Prefer Deployments for most applications, because a Deployment manages ReplicaSets and adds:
        a. Rolling updates (zero-downtime upgrades)
        b. Automatic rollbacks
        c. Revision history


# 06. Troubleshooting Tips
      a. No Pods launching?
         - Check selector labels exactly match the Pod template labels.
         - Run kubectl describe rs hello-rs to see events and errors.
      
      b. Too many Pods?
         - You may have orphaned Pods matching the selector. Delete them or tighten the selector.

      c. Pods stuck in Pending:
         - Inspect node resources (kubectl describe node) for insufficient CPU/memory.

