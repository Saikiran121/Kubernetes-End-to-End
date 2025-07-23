# 01. Understanding the Networking Foundation
      - Kubernetes Networking is the backbone that enables all the magic of container orchestration. Think of it as the digital highways 
        that allow your applications to communicate, just like how roads connect different parts of the city.


# 02. What is CNI?
      - Container Network Interface(CNI) is like the universal translator for container networking.

      - Imagine you have different types of phones that all need to connect to the same cell tower, CNI is the standard that makes sure they 
        can all communicate, regardless of their manufacturer.


# 03. Core Purpose:
      a. Assigns IP addresses to containers/pods
      b. Sets up network interfaces within container namespaces
      c. Manages routing between containers
      d. Handles network cleanup when containers are destroyed


# 04. How CNI Works: The Step-by-Step Process
      - When a Pod is created in Kubernetes, here's what happens behind the scenes
        a. Pod Creation: Kubelet Schedules a pod on a node

        b. Container Runtime: Creates the container and network namespace

        c. CNI Plugin Call: Kubelet calls the configured CNI plugin

        d. Network Setup: Plugin creates network interfaces and assigns IP addresses

        e. Routing Configuration: Sets up routes for pod-to-pod communication

        f. Policy Application: Applies any network policies


# 05. Popular CNI Plugins Explained
      a. Flannel - The Simple Choice
         - Lightweight and easy to setup
         - Creates a flat overlay network
         - Best for: Small clusters, learning environments
         - Think of it as the "bicycle" of CNI plugins - simple but effective
      
      b. Calico - The Security Expert
         - Advanced network policy enforcement
         - BGP routing capabilities
         - Best for: Production environments requiring security
         - Like having a security guard at every network junction
      
      c. Cilium - The Modern Powerhouse
         - Uses eBPF for high performance
         - Advanced observability features
         - Best for: High-performance, modern applications
         - The "sports car" of CNI plugins
      
      d. Weave Net - The Mesh Creator
         - Creates mesh overlay networks
         - Built-in DNS and service discovery
         - Best for: Multi-host deployments
         - Like having a built-in GPS for your containers


