# Formula 1 Dashboard PWA 🏎️

Una Progressive Web App (PWA) para fanáticos de la Fórmula 1 con datos en tiempo real desde OpenF1.

## 🚀 Características PWA

- ✅ **Instalable** - Se puede instalar como una app nativa
- ⚡ **Offline First** - Funciona sin conexión una vez cargada
- 📱 **Responsive** - Optimizada para móvil, tablet y desktop
- 🔄 **Auto-actualización** - Se actualiza automáticamente
- 📊 **Datos en tiempo real** - API de OpenF1 con cache inteligente
- 🎨 **Diseño moderno** - Interface elegante con Tailwind CSS

## 📱 Instalación

### En móvil:
1. Abre la app en tu navegador móvil
2. Aparecerá un prompt para "Instalar F1 Dashboard"
3. Toca "Instalar" y la app se agregará a tu pantalla de inicio

### En desktop:
1. Busca el ícono de instalación en la barra de direcciones
2. Haz clic en "Instalar F1 Dashboard"
3. La app se instalará como una aplicación nativa

## 🛠️ Desarrollo

Este proyecto usa Vue 3 + TypeScript + Vite + PWA.

### Instalación

```sh
npm install
```

### Desarrollo

```sh
npm run dev
```

### Build para producción

```sh
npm run build
```

### Preview de producción

```sh
npm run preview
```

## 🔧 Configuración PWA

- **Service Worker**: Cache automático de recursos y APIs
- **Manifest**: Configuración completa para instalación
- **Offline Support**: Los datos se guardan para uso sin conexión
- **Update Notifications**: Notifica cuando hay actualizaciones

## 📊 APIs Utilizadas

- **OpenF1**: Datos en tiempo real de F1
- **FlagCDN**: Banderas de países
- **Wikipedia**: Logo oficial de F1

## 🎨 Tecnologías

- Vue 3 (Composition API)
- TypeScript
- Tailwind CSS
- Vite PWA Plugin
- Workbox (Service Worker)
- Axios (HTTP Client)
- Pinia (State Management)

## 📱 Compatibilidad

- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari (iOS/macOS)
- ✅ Samsung Internet
- ✅ Opera

## 🚀 Deploy

La app está optimizada para deploy en:
- Vercel
- Netlify
- GitHub Pages
- Cualquier servidor estático

## CI/CD con Jenkins + Docker + Kubernetes

Pasos:
1. Docker:
   - Construir: `docker build -t f1-dashboard:local .`
   - Ejecutar: `docker run -p 8080:8080 f1-dashboard:local`

2. Jenkins:
   - Configura credenciales:
     - `github-credentials` (PAT GitHub)
     - `render-docker-registry` (usuario/token del registry)
     - `kubeconfig-credentials` (archivo kubeconfig)
   - Instala NodeJS tool "NodeJS 20".
   - Pipeline con `Jenkinsfile`.

3. Registry:
   - Actualiza `REGISTRY` y `NAMESPACE` en `Jenkinsfile`.
   - Asegura `imagePullSecrets` en `k8s/deployment.yaml` con tu secreto de registry:
     ```
     kubectl create secret docker-registry registry-credentials \
       --docker-server=<REGISTRY> \
       --docker-username=<USER> \
       --docker-password=<TOKEN> \
       --docker-email=<EMAIL>
     ```

4. Kubernetes:
   - Aplica manifests:
     ```
     kubectl apply -f k8s/deployment.yaml
     kubectl apply -f k8s/service.yaml
     kubectl apply -f k8s/ingress.yaml
     ```
   - Ajusta ingress según tu cluster/ingress controller.

5. Render (contenedor):
   - Usa `Dockerfile` y sube tu imagen al registry.
   - Crea servicio Web en Render apuntando a esa imagen.

6. Vercel (estático):
   - Opcional si no requieres contenedor:
     - `npm run build`
     - Sube `dist/` con configuración de framework Vite.
     - Nota: PWA funciona, pero sin Nginx; usa headers/rewrites de Vercel.

Tips:
- Healthcheck: `http://<host>/health`
- SPA fallback: index.html en Nginx config.
- PWA: Service Worker registrado en producción.

## Jenkins en Docker (setup rápido)

1. Levantar Jenkins (Docker):
```bash
docker run -d \
  --name jenkins \
  -p 8090:8080 -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  jenkins/jenkins:lts
```

2. Obtener contraseña inicial:
```bash
docker logs jenkins | grep -i "password" || \
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```
Abre http://localhost:8090 y completa el wizard.

3. Instalar plugins sugeridos + básicos:
- NodeJS
- Pipeline
- Docker Pipeline
- Git
- GitHub

4. Configurar NodeJS Tool:
- Manage Jenkins → Global Tool Configuration → NodeJS
- Añade "NodeJS 20" (usar la versión LTS/20.x)

5. Añadir credenciales:
- Manage Jenkins → Manage Credentials → global
- GitHub (PAT): Kind: Username with password
  - ID: github-credentials
  - Username: tu usuario GitHub
  - Password: tu Personal Access Token
- (Opcional) Registry para Docker: ID: render-docker-registry (usuario/token)

6. Crear Job (Pipeline Script from SCM):
- New Item → Pipeline → F1-Dashboard-PWA
- Pipeline:
  - Definition: Pipeline script from SCM
  - SCM: Git
  - Repository: https://github.com/Blxckbxll24/PwaF-.git
  - Credentials: github-credentials
  - Branch: */main
  - Script Path: Jenkinsfile

7. Ejecutar Build:
- Clic en "Build Now" y verifica consola.
- Si usas Docker en pipeline, asegúrate que el nodo tenga acceso al socket Docker.

Notas:
- Si tu pipeline construye imagen y corre contenedor, valida permisos del socket:
  `-v /var/run/docker.sock:/var/run/docker.sock` en el contenedor Jenkins.
- Healthcheck disponible en: http://localhost:8080/health (si levantas tu app con Docker).
- Para despliegue a Render: crea servicio Docker y empuja imagen al registro configurado.

## Configurar GitHub en Jenkins (credenciales y webhook)

1. Crear Personal Access Token (PAT) en GitHub:
   - En GitHub: Settings → Developer settings → Personal access tokens → Fine-grained tokens
   - Generate new token:
     - Repository access: Solo el repo PwaF- (selección específica)
     - Permissions:
       - Repository permissions:
         - Contents: Read (para clonar) o Read/Write si Jenkins empuja tags
         - Metadata: Read
       - Webhooks (solo si Jenkins creará webhooks): Read/Write
     - Copia el token (se muestra una vez)

2. Guardar el PAT en Jenkins:
   - Manage Jenkins → Manage Credentials → (global) → Add Credentials
   - Kind: Username with password
   - Username: Tu usuario GitHub (ej. Blxckbxll24)
   - Password: Pega el PAT generado
   - ID: github-credentials
   - Description: GitHub PAT for PwaF-

3. Usar credenciales en el Job:
   - Job → Configure → Pipeline script from SCM
   - SCM: Git
   - Repository URL: https://github.com/Blxckbxll24/PwaF-.git
   - Credentials: github-credentials
   - Branch: */main
   - Script Path: Jenkinsfile

4. Webhook para builds automáticos (opcional):
   - En GitHub repo: Settings → Webhooks → Add webhook
   - Payload URL: http://TU_JENKINS_HOST:8090/github-webhook/ (si corriste Jenkins en Docker: http://localhost:8090/github-webhook/)
   - Content type: application/json
   - Events: Just the push event
   - Save
   - En Jenkins: Instala plugin “GitHub” y activa el trigger “GitHub hook trigger for GITScm polling” en el job.

5. Alternativa SSH (si no quieres PAT):
   - Genera clave SSH en Jenkins (dentro del contenedor):
     ```
     docker exec -it jenkins ssh-keygen -t ed25519 -C "jenkins@local" -N "" -f /var/jenkins_home/.ssh/id_ed25519
     docker exec -it jenkins cat /var/jenkins_home/.ssh/id_ed25519.pub
     ```
   - En GitHub repo: Settings → Deploy keys → Add key (Read-only o Read/Write según necesidad)
   - En Jenkins: Manage Credentials → Add → Kind: SSH Username with private key
     - ID: github-ssh
     - Username: git
     - Private Key: From file /var/jenkins_home/.ssh/id_ed25519
   - Job: Repository URL (SSH): git@github.com:Blxckbxll24/PwaF-.git
   - Credentials: github-ssh

6. Errores comunes y solución:
   - 403 o Authentication failed:
     - Verifica que el PAT no expiró y tiene permisos “Contents: Read”.
     - Revisa que el repo URL sea correcto (HTTPS con PAT o SSH con Deploy Key).
   - Jenkins no recibe webhook:
     - Asegúrate que Jenkins esté accesible desde GitHub (si es local, usa ngrok o Render para URL pública).
     - Revisa logs del webhook en GitHub (Settings → Webhooks → Recent deliveries).
   - Clonado lento o sin cache:
     - Activa shallow clone en Jenkins (Additional Behaviours → Sparse checkout/shallow clone si es necesario).

Checklist rápido:
- PAT creado (Fine-grained) con Contents: Read.
- Credencial en Jenkins: ID github-credentials.
- Job con “Pipeline script from SCM” apuntando al repo.
- Webhook configurado (opcional) a http://localhost:8090/github-webhook/.

## Nota de Nginx (Docker)
Si ves:
```
invalid value "must-revalidate" in /etc/nginx/nginx.conf
```
Corrige los encabezados en nginx.conf usando comillas:
```
add_header Cache-Control "no-cache, no-store, must-revalidate";
add_header Pragma "no-cache";
add_header Expires "0";
```
Evita poner “must-revalidate” fuera de las comillas o como directiva separada.

---

**¡Disfruta de la velocidad de la F1! 🏁**
