# 01. How to Use ConfigMaps and Secrets

# 02. Create a ConfigMap
      
       apiVersion: v1
       kind: ConfigMap
       metadata:
         name: app-config
       data:
         APP_COLOR: "green"
         API_URL: "https://api.example.com"
      
      - Store normal configuration here (not for secrets)

# 03. Create a Secret

       apiVersion: v1
       kind: Secret
       metadata:
           name: app-secret
       type: Opaque
       data:
           DATABASE_PASSWORD: cGFzc3dvcmQ=      # 'password' base64 encoded
      
      - Put sensitive info here. The values must be base64 encoded


# 04. Use Them in Your Pods
      
      a. As Environment Variables
         
         envFrom:
           - configMapRef:
               name: app-config
           - secretRef:
               name: app-secret

         -  Your app reads settings as environment variables, just like traditional .env files
      

      b. As Mounted Files (Volumes)
         
         volumes:
           - name: config-volume
             configMap:
               name: app-config
           - name: secret-volume
             secret:
               secretName: app-secret
         containers:
           - name: app
             image: your-image
             volumeMounts:
               - name: config-volume
                 mountPath: /etc/config
               - name: secret-volume
                 mountPath: /etc/secret
         
         - Kubernetes provides files inside your container at the specified locations
