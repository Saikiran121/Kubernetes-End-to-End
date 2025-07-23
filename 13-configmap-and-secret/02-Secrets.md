# 01. What is Secret?
      - Definition: A Secret Stores sensitive information(passwords, API tokens, Keys) in a base64-encoded format.

      - Purpose: Keeps confidential data out of container images, code and logs, and applies stricter access controls than ConfigMaps.


# 02. Example (Store a database password and a token.)

      apiVersion: v1
      kind: Secret
      metadata:
          name: mysecret
      type: Opaque
      data:
          DB_PASSWORD: cGFzc3M= # base64 of 'pass'
          API_TOKEN: ZGVmYXVsdA==   # base64 of 'default'