# 01. What Are Deployment Strategies?
      - Think of Deployment Strategies as different ways to upgrade your restaurant's menu:
        
        a. Recreate: Close the Restaurant, change everything, then reopen (downtime)

        b. Rolling Update: Replace one dish at a time while staying open (gradual)

        c. Blue/Green: Open a Second Restaurant, test it, then redirect all customers

        d. Canary: Serve the new dish to just a few customers first.

        e. A/B Testing: Give half your customers pizza, half burgers, see which sells better.

        f. Shadow: Cook the new dish alongside the old one but dont serve it to customers.

---------------------------------------------------------------------------------------------------------

# 02. Recreate Strategy
      - What it does: Kill all old Pods, then start new ones

      - Real-world use cases:
        a. Major database schema changes that aren't backward-compatible
        b. Switching between completely different architectures
        c. Development environments where downtime is acceptable
      
      - Pros: Simple, clean slate

      - Cons: Downtime (seconds to minutes depending on startup time)

         apiVersion: apps/v1
         kind: Deployment
         metadata:
           name: myapp
         spec:
           strategy:
             type: Recreate  # Built-in Kubernetes strategy
           replicas: 3
           template:
             spec:
               containers:
               - name: myapp
                 image: myapp:v2.0

----------------------------------------------------------------------------------------------------------------

# 03. Rolling Update (Default)
      - What it does: Gradually replace old Pods with new ones

      - Real-world use cases:
        a. Standard application updates
        b. API changes that are backward-compatible
        c. Web applications requiring high availability
      
      - Pros: Zero downtime, built-in rollback

      - Cons: Both versions run simultaneously (can cause issues with shared databases)

          apiVersion: apps/v1
          kind: Deployment
          spec:
            strategy:
              type: RollingUpdate
              rollingUpdate:
                maxUnavailable: 25%  # Max 25% of pods can be down
                maxSurge: 25%        # Max 25% extra pods during update


--------------------------------------------------------------------------------------------------------------

# 04. Blue/Green Deployment
      - What it does: Run two identical environments; switch traffic instantly

      - Real-world use cases:
        a. E-commerce sites during major sales (instant rollback if needed)
        b. Financial systems requiring zero downtime
        c. Applications with heavy frontend asset changes
      
      - Pros: Instant cutover, safe rollback, full production testing
      
      - Cons: Double resource usage, database compatibility challenges


         # Blue environment (current)
        apiVersion: apps/v1
        kind: Deployment
        metadata:
          name: myapp-blue
        spec:
          replicas: 3
          selector:
            matchLabels:
              app: myapp
              version: blue  # Service targets this version

        
        # Green environment (new)
        apiVersion: apps/v1
        kind: Deployment
        metadata:
          name: myapp-green
        spec:
          replicas: 3
          selector:
            matchLabels:
              app: myapp
              version: green  # Switch service selector to this
        

        # Service switches between blue and green
        apiVersion: v1
        kind: Service
        metadata:
          name: myapp-service
        spec:
          selector:
            app: myapp
            version: blue  # Change to "green" when ready to switch
          ports:
          - port: 80

--------------------------------------------------------------------------------------------------------


# 05. Canary Deployment
      - What it does: Send small percentage of traffic to new version, gradually increase

      - Implementation approaches:
        a. Pod-based canary: Deploy 1 new pod alongside 9 old pods (10% traffic)
        b. Ingress-based canary: Use ingress controller to split traffic by percentage

      - Real-world use cases:
        a. Social media platforms testing new features
        b. Recommendation engines with algorithm changes
        c. Any high-traffic application where you want to limit blast radius
    
      - Pros: Controlled risk exposure, real user feedback, gradual rollout
      
      - Cons: Requires traffic splitting tools, more complex monitoring

        # Stable deployment (90% traffic)
        apiVersion: apps/v1
        kind: Deployment
        metadata:
          name: myapp-stable
        spec:
          replicas: 9
          selector:
            matchLabels:
              app: myapp
              track: stable
        

        # Canary deployment (10% traffic)
        apiVersion: apps/v1
        kind: Deployment
        metadata:
          name: myapp-canary
        spec:
          replicas: 1
          selector:
            matchLabels:
              app: myapp
              track: canary


--------------------------------------------------------------------------------------------------


# 06. A/B Testing
      - What it does: Route different user segments to different versions for feature comparison

      - Traffic routing methods:
        a. Browser cookies
        b. Geographic location
        c. User demographics
        d. Query parameters
      
      - Real-world use cases:
        a. E-commerce conversion optimization (different checkout flows)
        b. UI/UX experiments (button colors, layouts)
        c. Marketing campaigns testing
      
      - Pros: Data-driven decisions, statistical significance, business insights
      
      - Cons: Requires advanced routing, complex analytics, user tracking

        # Ingress with A/B testing rules
        apiVersion: networking.k8s.io/v1
        kind: Ingress
        metadata:
          name: ab-test-ingress
          annotations:
            nginx.ingress.kubernetes.io/canary: "true"
            nginx.ingress.kubernetes.io/canary-by-cookie: "version"
        spec:
          rules:
          - http:
              paths:
              - path: /app
                backend:
                  service:
                    name: myapp-version-b


------------------------------------------------------------------------------------------------------


# 07. Shadow/Mirror Deployment
      - What it does: Copy production traffic to new version without serving responses to users

      - Real-world use cases:
        a. Performance testing new algorithms with production load
        b. Database migration validation
        c. API compatibility testing
      
      - Pros: Real production testing, zero user impact, performance validation

      - Cons: Double infrastructure cost, complex traffic mirroring setup

        apiVersion: apps/v1
        kind: Deployment
        metadata:
          name: myapp-shadow
        spec:
          replicas: 2
          selector:
            matchLabels:
              app: myapp
              track: shadow  # Won't receive live traffic
          template:
            spec:
              containers:
              - name: myapp
                image: myapp:shadow-test









