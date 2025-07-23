# 01. What Are StorageClasses?
      - StorageClasses are templates that define different types of storage available in your cluster. Instead of manually creating PVs, you
        define what types of storage you offer, and Kubernetes creates them automatically when requested.


# 02. Key Components:
      a. provisioner: Which storage system to use (AWS EBS, GCP Disk, Azure Disk)

      b. parameters: Storage-specific settings (disk type, file system)

      c. reclaimPolicy: What happens when PVC is deleted (Delete, Retain)

      d. volumeBindingMode: When to create the volume (Immediate or WaitForFirstConsumer)

