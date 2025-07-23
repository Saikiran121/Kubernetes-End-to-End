# 01. What is ConfigMap?
      - Definition: A ConfigMap is a Kubernetes Object for storing non-sensitive configuration as key-value pairs (like settings, URLs, feature 
        flags).

      - Purpose: Decouples configuration from container images so you can re-use the same image in different environments.


# 02. Example

       apiVersion: v1
       kind: ConfigMap
       metadata:
           name: settings
       data:
           LOG_LEVEL: "info:
           API_URL: "https://api.mycompany.com"



        