# 01. Best Practices and Real-World Use
      - ConfigMaps for general settings: Language options, log level, endpoint URLs etc

      - Secrets for confidential data only: API keys, database credentials, certificates

      - Never hardcode sensitive data in your app images or pods

      - Update configs or secrets by changing the ConfigMap/Secret object. New pods pick up the change automatically; some apps can reload live, 
        others need a restart


# 02. Mounting tips
      - If you mount the same ConfigMap or Secret as both an environment variable and a file, your app can pick whichever is more convenient.

      - You can control exactly where in the container’s filesystem files appear, and map specific keys to specific file names


# 03. Security and Access Control
      - Secrets are strongly access-controlled: Only explicitly authorized users or apps can read them

      - Enable encryption at rest (so even the files on disk are protected on the Kubernetes server)

      - Use Role-Based Access Control (RBAC) to ensure only the right service accounts or users can see or update secrets


# 04. Advanced Patterns
      - Automate periodic secret rotation: Use CI pipelines or secret management tools to refresh secrets and update Kubernetes automatically

      - Immutable ConfigMaps and Secrets: Mark settings as immutable to prevent accidental changes

      - External managers: Integrate Kubernetes with external secret tools (like HashiCorp Vault) for dynamic secrets and automatic rotation

      - Admission controllers and policies: Automatically require that sensitive data only goes in Secrets—not in ConfigMaps.

