# 01. Pod Lifecycle Phases
      a. Pending
         - Pod object is created and accepted by the API server.
         - Scheduling occurs: images are pulled, volumes attached.
         - No container has started yet.
      
      b. Running
         - Pod is bound to a node.
         - At least one container has started and is either running or initializing.
      
      c. Succeeded
         - All containers in the Pod have terminated successfully (exit code 0).
         - Pod will not restart (with restartPolicy: Never).
      
      d. Failed
         - At least one container terminated with a non‐zero exit code.
         - Pod will not restart (with restartPolicy: Never)
    
      e. Unknown
         - API server cannot determine the Pod’s status, often due to node or network issues.