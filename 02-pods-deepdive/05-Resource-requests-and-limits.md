# 01. Resource requests and limits
      - Resource requests and limits control how much CPU and memory your containers get and can use in Kubernetes

      - Properly setting them ensures predictable scheduling, stable performance, and efficient cluster utilization.


# 02. What Are Requests and Limits?
      
      a. Requests
         - Minimum resources guarenteed for a container. The scheduler only places Pods on nodes with at least that much free CPU
           or memory
      
      b. Limits
         - Maximum resources a container may consume. The kubelet enforces this at runtime CPU is throttled, and exceeding memory causes an OOM 
           kill.


# 03. Quality of Service (QoS) Classes
      - Imagine your kubernetes cluster is like a "hotel with limited rooms". When the hotel gets overcrowded and needs to ask some guests
        to leave, it needs a fair way to decide who goes first. Thats exactly what QoS classes do for your Pods when your cluster runs 
        out of resources (CPU or Memoy).


# 04. The Three QoS Classes
      
      a. Guaranteed - (VIP Treatment)
         - What it Means: Your Pod has equal requests and limits.
         - Example: You ask for 100MB memory and set limit to 100MB (same values).
         - Hotel Analogy: VIP guests with confirmed reservations, they are the last one to be kicked out
         - Real meaning: These Pods are most protected from being killed

         resources:
           requests:
             memory: "256Mi"
             cpu: "100m"
           limits:
             memory: "256Mi"    # Same as request = Guaranteed
             cpu: "100m"        # Same as request = Guaranteed
      
      
      b. Burstable - (Regular Guests)
         - What it means: Your Pod can use more than it requested but has limits
         - Example: You ask for 100MB but can use up to 200MB if available
         - Hotel analogy: Regular guests who might get upgraded if rooms are available, but get evicted before VIPs
         - Real meaning: These Pods get medium protection - killed after BestEffort but before Guaranteed

         resources:
           requests:
             memory: "128Mi"
             cpu: "50m"
           limits:
             memory: "256Mi"    # Higher than request = Burstable
             cpu: "100m"        # Higher than request = Burstable
      

      c. BestEffort - (Walk-in Customers)
         - What it means: Your Pod has no resource specifications at all
         - Example: No requests or limits set - it gets whatever is leftover
         - Hotel analogy: Walk-in guests with no reservation - first to be asked to leave
         - Real meaning: These Pods have no protection and are killed first when resources run low

         resources: {}  # No requests or limits = BestEffort


# 05. When Does This Matter?
      - This eviction priority only kicks in when your cluster node is under pressure - meaning it's running out of:
        a. Memory (RAM)
        b. CPU (processing power)
        c. Storage space


# 06. Simple Decision Tree
      - When Kubernetes needs to free up resources, it follows this order:
        a. Kill BestEffort Pods first (they have no guarantees anyway)
        b. Kill Burstable Pods next (they can survive with less resources)
        c. Kill Guaranteed Pods last (only as a final resort)


# 07. Practical Example
      - Let's say you have three applications:
        a. Critical Database → Set as Guaranteed (requests = limits)
        b. Web Server → Set as Burstable (can burst when needed)
        c. Log Collector → Set as BestEffort (not mission-critical)
      
      - When memory runs low, Kubernetes will:
        a. Kill the Log Collector first (BestEffort)
        b. Kill the Web Server next if still needed (Burstable)
        c. Protect the Database until the very end (Guaranteed)

----------------------

# 08. Resource Tuning Strategy
      - Think of a resource management like "budgeting your monthly expenses". Just as you need to know how much money you actually spend
        on groceries (vs. your budget), Kubernetes needs to know how much CPU and Memory your applications actually use(vs. what you requested).


# 09. The Three-Step Strategy
      
      a. Initial Guess: Over-provision requests conservatively
         - Start by asking for "more resources than you think you need", like bringing extra snacks on a road trip "just in case".

         - Why do this?
           - It's better to have too much than too little at first
           - Your app won't crash from lack of resources while you're still learning
           - Think of it as a safety buffer while you collect real data

         - Example
           resources:
             requests:
               cpu: "500m"      # Ask for 0.5 CPU cores (generous guess)
               memory: "1Gi"    # Ask for 1GB memory (generous guess)
      

      b. Measure: Collect real usage metrics
         - Watch and record what your applications actually use over time, like tracking your real grocery spending for a few months.

         - Using kubectl top (Basic monitoring)
           kubectl top pods
           kubectl top nodes

           This shows you live usage like:
           NAME           CPU(cores)   MEMORY(bytes)
           my-app-pod     120m         256Mi

           My app is using 0.12 CPU cores and 256MB memory right now
         
         - Using Prometheus + Grafana (Advanced monitoring)
           Prometheus: Collects and stores usage data over time (like keeping detailed expense receipts)
           Grafana: Creates pretty charts and dashboards to visualize the data
           95th percentile: This means "95% of the time, your app uses this amount or less"
         
         - Why 95th percentile?
           It captures most of your usage without being thrown off by occasional spikes
           Like knowing you spend $200 or less on groceries 95% of the time (ignoring that one expensive holiday shopping trip)
      

      c. Refine: Set requests near 95th percentile and limits ~1.5× requests
         - Simple Meaning: Once you know your real usage patterns, adjust your resource "budget" to match reality with a small buffer.

         - The Formula
           Request: Set at 95th percentile usage (what you need 95% of the time)
           Limit: Set at ~1.5× your request (allows for occasional bursts)
         
         - Example: If your monitoring shows:
           95th percentile CPU usage: 200m (0.2 cores)
           95th percentile memory usage: 512Mi

           Then set:
           resources:
              requests:
                cpu: "200m"      # What you need 95% of the time
                memory: "512Mi"  # What you need 95% of the time
              limits:
                cpu: "300m"      # 1.5× request (allows bursting)
                memory: "768Mi"  # 1.5× request (allows bursting)
         
         - Why This Strategy Works
           Prevents waste: You're not asking for way more than you need
           Ensures reliability: Your app still gets what it needs to run properly
           Allows flexibility: The limit gives room for occasional traffic spikes
           Helps scheduling: Kubernetes can pack more apps efficiently on nodes


# 10. Real-World Analogy
      - This is like optimizing your grocery budget:
        a. Start generous: Budget $300/month for groceries (over-provision)
        b. Track spending: Use receipts to see you actually spend $180-220/month (monitoring)
        c. Optimize: Set budget to $200/month with $250 emergency limit (refined requests/limits)
      
      - The Result: You save money while ensuring you never go hungry, and the grocery store (Kubernetes cluster) can serve more customers
        efficiently because everyone isn't hoarding resources "just in case."

-------------------------------------------------


# Vertical & Horizontal Pod Autoscalers

# 11. Vertical Pod Autoscaler (VPA): “Resize the chairs”
      
      a. What problem does it solve?
         - Imagine your pod is a worker who needs chair (CPU) and desk (Memory). Some workers get chairs that are too big (wasting space)
           others get tiny stools and complain.
         - VPA Watches each worker and silently swaps their chair(CPU) and desk(Memory) sizes to fit their real need.


# 12. How it works – three mini-services
      a. Recommender
         - Job: Measures past CPU/Memory usage and decides the right size.
         - Plain meaning: You’ve only been sitting on half the chair—let’s shrink it.
      
      b. Updater
         - Job: If the current Pod is the wrong size, it politely evicts (kills) that Pod so Kubernetes can recreate it with the new sizes.
         - Plain meaning: Stand up for a second while I replace your chair
      
      c. Admission controller
         - When new Pods start, it injects the recommended CPU/Memory values immediately.
         - New hire? Let’s give them the right-sized furniture from day one.


# 13. Key YAML snippet (updateMode: Auto)
      apiVersion: autoscaling.k8s.io/v1
      kind: VerticalPodAutoscaler
      metadata:
        name: app-vpa
      spec:
        targetRef:            # Which workload to watch
          apiVersion: apps/v1
          kind: Deployment
          name: basic-demo
        updatePolicy:
          updateMode: Auto    # Let VPA evict + recreate Pods automatically
      
      - Set to Auto and VPA will both recommend and apply the new sizes for you.


# 14. Horizontal Pod Autoscaler (HPA): “Add or remove workers”
      a. What problem does it solve?
         - If the office suddenly gets busy, one worker (Pod) can’t handle all phone calls.
         - HPA adds more identical workers when load rises and sends them home when it’s quiet.


# 15. How it works
      a. Watches a metric (CPU, memory, or custom).
      b. When the average goes above the target, it increases the replica count in your Deployment.
      c. When the metric drops, it scales replicas back down.


# 16. Simple HPA outline:
      apiVersion: autoscaling/v2
      kind: HorizontalPodAutoscaler
      metadata:
        name: basic-demo-hpa
      spec:
        scaleTargetRef:
          apiVersion: apps/v1
          kind: Deployment
          name: basic-demo
        minReplicas: 2
        maxReplicas: 10
        metrics:
        - type: Resource
          resource:
            name: cpu
            target:
              type: Utilization
              averageUtilization: 60   # Keep CPU around 60 %


# 17. Why combine them?
      - VPA keeps each Pod right-sized (no over- or under-provision).
      - HPA ensures you have the right number of Pods when traffic spikes.

      - Together you get both vertical (bigger/smaller chairs) and horizontal (more/fewer workers) scaling—efficient and automatic.


--------------------------------------

# 18. LimitRange: "Individual Room Rules"
      - LimitRange controls what EACH INDIVIDUAL container/pod can do. Its like setting rules for each apartment unit.

      - What LimitRange does?
        a. Sets Defaults: If you dont specify how much CPU/memory your container needs, LimitRange fills in sensible defaults.

        b. Sets boundaries: Prevents any single container from asking for too much or too little resources

        c. Quality control: Ensures every container has reasonable resource settings


# 19. Your YAML Explained Simply:
      apiVersion: v1
      kind: LimitRange
      metadata:
        name: limits
      spec:
        limits:
        - type: Container
          default:           # If you don't specify limits, use these
            cpu: "500m"      # Default: 0.5 CPU cores
            memory: "512Mi"  # Default: 512 MB memory
          defaultRequest:    # If you don't specify requests, use these
            cpu: "100m"      # Default request: 0.1 CPU cores  
            memory: "128Mi"  # Default request: 128 MB memory
          min:               # Absolute minimum allowed
            cpu: "50m"       # Can't request less than 0.05 CPU
            memory: "64Mi"   # Can't request less than 64 MB
          max:               # Absolute maximum allowed
            cpu: "1"         # Can't use more than 1 CPU core
            memory: "1Gi"    # Can't use more than 1 GB memory


# 20. Real-world analogy
      - In this apartment building, every unit must have at least 1 bedroom (min), but no more than 4 bedrooms (max). If you dont
        specify, we will give you a standard 2-bedroom unit (default).


# 21. ResourceQuota: "Building-Wide Budget"
      - ResourceQuota controls the TOTAL resources that ALL containers in a namespace can use combined.
      - Its like setting a budget for the entire apartment building.

      - What ResourceQuota Does:
        a. Total Limits: the entire team can use max 10 CPU cores total

        b. Object Limits: You can create max 20 pods in this namespace

        c. Prevents Hogging: Stops one team from using all cluster resources.


# 22. ResourceQuota Example:
      
      apiVersion: v1
      kind: ResourceQuota
      metadata:
        name: team-quota
      spec:
        hard:
          requests.cpu: "4"         # Total CPU requests: max 4 cores
          requests.memory: "8Gi"    # Total memory requests: max 8 GB  
          limits.cpu: "10"          # Total CPU limits: max 10 cores
          limits.memory: "16Gi"     # Total memory limits: max 16 GB
          pods: "50"                # Maximum 50 pods total
          services: "10"            # Maximum 10 services total


# 23. Real-world analogy
      - This apartment building has a total electricity budget of 1000 kWh per month. All units combined cannot exceed this, and
        you can have max 50 tenants total.


# 24. How They Work Together
      Scenario	                    LimitRange Says	                        ResourceQuota Says
      Single container	            "You can use max 500m CPU"	            "Your team used 3/10 total CPU so far"
      Team creates 20 pods	        "Each pod follows individual rules"	    "Team total: 8/10 CPU used, 20/50 pods used"
      New pod without limits	    "I'll give you default 100m CPU"	    "Team now using 8.1/10 total CPU"


# 25. Why Use Both?
      - LimitRange: Prevents individual bad actors (one container eating all resources)
      - ResourceQuota: Prevents team-level resource exhaustion (entire team using whole cluster)


# 26. Summary: 
      - LimitRange = individual rules, ResourceQuota = team budget. Together they ensure fair sharing and prevent both individual containers and 
        entire teams from destabilizing your Kubernetes cluster


------------------------------------------


# 27. Admission Controllers for Resource and Security Policy Enforcement
      - Kubernetes uses admission controllers Its small gatekeepers in the API server to automatically enforce resource and security rules
        before Pods are created. Here's what each one does:

        a. LimitRanger
           - Think of LimitRanger as an automatic rule-setter for Pods.
           - If you forget to ask for CPU or memory in your Pod spec, LimitRanger fills in sensible defaults (from your LimitRange) on the spot.
           - In other words, it makes sure every Pod has at least a minimal resource “reservation” so you don’t accidentally starve the node.

        b. ResourceQuota
           - The ResourceQuota controller acts like a bouncer at the club door: it counts up all the CPU, memory, Pods, Services, etc., your team 
             has already requested in a given namespace.
           - If you try to create one more Pod or ask for more total resources than your team’s agreed “budget,” ResourceQuota will reject the new 
             Pod outright.
           - This prevents any one team from hogging all the cluster’s capacity.
        
        c. ValidatingAdmissionPolicy (CEL-based)
           - A ValidatingAdmissionPolicy lets you write custom rules in a simple expression language (CEL).
           - For example, you can block any Pod whose CPU request is less than 50 mCPU or whose memory request is below a safe minimum.
           - If a Pod doesn’t meet your organization’s policy, the API server refuses to create it, enforcing “security as code.”
        
        d. PodSecurityPolicy Replacement (Gatekeeper/Open Policy Agent)
           - Although PodSecurityPolicy is deprecated, you can use Gatekeeper (an OPA plugin) to enforce similar or stricter policies.
           - Gatekeeper watches every Pod creation request and checks it against your custom policies (e.g., “no Pods without resource requests” or 
             “no privileged containers”).
           - If a Pod violates any policy, Gatekeeper rejects it, ensuring your entire cluster adheres to defined security and resource standards.


# 28. Why This Matters
      - These admission controllers run automatically each time you kubectl apply a Pod.
      - They ensure consistency (every Pod gets defaults), fairness (teams stay within quotas), and security (no under-resourced or unsafe Pods 
        slip through).
      - By shifting these checks into the cluster’s control plane, you bake good practices into your platform—so developers can’t accidentally 
        break resource or security rules.











 


