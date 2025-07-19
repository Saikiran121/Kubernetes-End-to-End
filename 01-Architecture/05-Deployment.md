# 01. Deployment
      - A Deployment in Kubernetes manages the lifecycle of your application pods, ensuring they run the correct version, scale to the desired 
        number, and update smoothly without downtime.
      
      - Think of a Deployment as a manager that uses ReplicaSets under the hood, handling updates, rollbacks, and scaling for you.


# 02. Why Use a Deployment?
      - Declarative updates: Simply change the image or replica count in your YAML, and Kubernetes handles the rest.

      - Rolling updates: Upgrade pods one by one so your app never goes fully offline.

      - Automatic rollbacks: If something goes wrong, you can revert to a previous working version.

      - Scaling: Easily increase or decrease pod count.

      - Version history: Keeps track of past ReplicaSets for audit and rollback.


# 03. How a Deployment Works
      - You declare your desired state: image version, replicas, update strategy.

      - Kubernetes creates a ReplicaSet matching that spec.

      - ReplicaSet creates pods and maintains the desired replica count.

      - On updates, the Deployment:
        a. Creates a new ReplicaSet for the new pod template.
        b. Scales up the new ReplicaSet while scaling down the old one, following your strategy.\
      
      - If you roll back, the Deployment switches back to an earlier ReplicaSet.


# 04. Deployment YAML Explained
      
      apiVersion: apps/v1
      kind: Deployment
      metadata:
        name: my-app-deployment      # Name of this Deployment
      spec:
        replicas: 3                  # How many pods you want running
        selector:
          matchLabels:
            app: my-app              # Must match labels in the pod template
        template:                    # Pod template used by the ReplicaSet
          metadata:
            labels:
              app: my-app
          spec:
            containers:
            - name: my-container
              image: nginx:1.23       # Docker image (versioned)
              ports:
              - containerPort: 80
        strategy:
          type: RollingUpdate        # Default update strategy
          rollingUpdate:
            maxUnavailable: 1        # At most 1 pod down during update
            maxSurge: 1              # At most 1 extra pod above replicas


# 05. Create, Update, and Roll Back
      
      a. Create the Deployment:
         kubectl apply -f deployment.yaml
      
      b. Check status:
         kubectl get deployments
         kubectl rollout status deployment/my-app-deployment
      
      c. Scale up or down:
         kubectl scale deployment my-app-deployment --replicas=5
      
      d. Update to a new version: edit image: in deployment.yaml (e.g., nginx:1.24), then:
         kubectl apply -f deployment.yaml
      
      e. Roll back if needed:
         kubectl rollout undo deployment/my-app-deployment
      
      f. View history:
         kubectl rollout history deployment/my-app-deployment


# 06. Strategies and Behaviors
      - RollingUpdate (default): replaces pods gradually.

      - Recreate: deletes all old pods before creating new ones (causes downtime).


# 07. Simple Analogy
      - Deployment: The project manager.

      - ReplicaSet: The team lead ensuring enough team members (pods).

      - Pods: The workers doing the actual tasks (running containers).

      - Rolling updates: Phased onboarding of new team members while phasing out old ones, ensuring continuous service.
