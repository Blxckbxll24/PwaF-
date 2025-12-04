pipeline {
  agent any
  environment {
    APP_NAME = 'f1-dashboard'
    IMAGE = 'f1-dashboard'
    REGISTRY = 'registry-1.docker.io' // endpoint oficial de Docker Hub
    NAMESPACE = 'blxckbxll24' // reemplaza por tu usuario de Docker Hub
    IMAGE_TAG = "${env.BUILD_NUMBER}"
    KUBE_CONTEXT = 'your-kube-context'
    // IDs de credenciales en Jenkins
    REGISTRY_CREDS = 'dockerhub-credentials' // ID de credencial en Jenkins para Docker Hub
    KUBE_CREDS = 'kubeconfig-credentials'
    GITHUB_CREDS = 'github-credentials'
  }
  tools { nodejs 'NodeJS 20' }
  stages {
    stage('Checkout') {
      steps {
        checkout([$class: 'GitSCM',
          branches: [[name: '*/main']],
          userRemoteConfigs: [[url: 'https://github.com/Blxckbxll24/PwaF-.git', credentialsId: "${GITHUB_CREDS}"]]
        ])
        sh 'ls -la'
      }
    }
    stage('Install') {
      steps {
        sh 'npm ci'
      }
    }
    stage('Lint & TypeCheck') {
      parallel {
        stage('Lint') { steps { sh 'npm run lint' } }
        stage('TypeCheck') { steps { sh 'npm run type-check' } }
      }
    }
    stage('Test') {
      steps { sh 'npm run test:unit -- --run' }
    }
    stage('Build') {
      steps { sh 'npm run build' }
      post { success { archiveArtifacts artifacts: 'dist/**/*', fingerprint: true } }
    }
    stage('Docker Build') {
      steps {
        script {
          def dockerImage = docker.build("${NAMESPACE}/${IMAGE}:${IMAGE_TAG}")
        }
      }
    }
    stage('Docker Push') {
      steps {
        script {
          // docker.withRegistry agrega el registry al login/push
          docker.withRegistry("https://${REGISTRY}", "${REGISTRY_CREDS}") {
            // reconstruir referencia igual que en build
            def dockerImage = docker.image("${NAMESPACE}/${IMAGE}:${IMAGE_TAG}")
            dockerImage.push()
            dockerImage.push('latest')
          }
        }
      }
    }
    stage('Kubernetes Deploy') {
      when { anyOf { branch 'main'; branch 'develop' } }
      steps {
        withCredentials([file(credentialsId: "${KUBE_CREDS}", variable: 'KUBECONFIG')]) {
          sh '''
            export KUBECONFIG=$KUBECONFIG
            # Reemplazar imagen en manifests
            sed -i.bak "s|<REGISTRY>/<NAMESPACE>/f1-dashboard:latest|'"${REGISTRY}/${NAMESPACE}/${IMAGE}:${IMAGE_TAG}"'|g" k8s/deployment.yaml
            kubectl apply -f k8s/deployment.yaml
            kubectl apply -f k8s/service.yaml
            kubectl apply -f k8s/ingress.yaml
            kubectl rollout status deployment/f1-dashboard --timeout=120s
          '''
        }
      }
    }
    stage('Render Trigger (opcional)') {
      when { branch 'main' }
      steps {
        // Si prefieres Render en lugar de Kubernetes, descomenta este trigger de deploy.
        sh '''
          echo "Trigger opcional a Render API aquí si no usas Kubernetes."
          # curl -X POST "https://api.render.com/v1/services/${RENDER_SERVICE_ID}/deploys" \
          # -H "Authorization: Bearer ${RENDER_API_KEY}" \
          # -H "Content-Type: application/json" -d '{"clearCache": "clear"}'
        '''
      }
    }
  }
  post {
    success { echo '✅ Pipeline OK' }
    failure { echo '❌ Pipeline falló' }
  }
}
