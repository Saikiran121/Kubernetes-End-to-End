# 01. Namespaces: Virtual Departments
      - Imagine your kubernetes cluster is a large office building. Namespaces are like separate departments, "engineering", 
        "marketing", and "HR"
      
      - Every resource (Pods, Services, Deployments) lives in exactly one department.

      - Two departments can each have a "web-server" without conflict, because names only have to be unique wihtin their own
        department.
      
      - By default Kubernetes gives you four departments out of the box—“default” (general use), “kube-system” (core system components), 
        “kube-public” (public read-only), and “kube-node-lease” (node heartbeats).


# 02. Labels and Selectors: Name Tags for Grouping
      - A Label is like a colored sticker you put on each resourc; for instance app=frontend or tier=backend

      - Later, you can ask Kubernetes "show me all resources with the red app=frontend sticker" by using a selector
        (e.g., kubectl get pods -l app=frontend).
      
      - This makes it easy to group, filter, and operate on sets of related resources just like picking all files with the same tag.


# 03. Annotations: Sticky Notes for Extra Details
      - An annotation is like a sticky note you attach to a resource. It holds extra information (“maintainer: alice@example.com” or “git-commit: 
        abc123”).
      
      - Kubernetes itself ignores these notes, but other tools or your team can read them to understand who owns the resource, why it exists, or 
        how it was created.


# 04. ResourceQuotas: Department Budgets
      - A ResourceQuota sets a “budget” for each department (namespace)—for example, “this team can use up to 4 CPU cores, 8 GB of RAM, and create 
        no more than 10 Pods.”
      
      - If anyone in that department tries to exceed the budget (say, create an 11th Pod), Kubernetes rejects their request and returns a “403 
        Forbidden” error.
      
      - This prevents one team from accidentally using all cluster resources and starving out other teams.











