pipeline {
  agent any
  environment {
    APP_NAME = 'f1-dashboard'
    IMAGE = 'f1-dashboard'
    REGISTRY = 'registry-1.docker.io' // Docker Hub oficial
    NAMESPACE = 'blxckbxll24' // tu usuario de Docker Hub
    IMAGE_TAG = "${env.BUILD_NUMBER}"
    FULL_IMAGE = "${NAMESPACE}/${IMAGE}:${IMAGE_TAG}"
    KUBE_CONTEXT = 'your-kube-context'
    // IDs de credenciales en Jenkins:
    // REGISTRY_CREDS: credencial Docker Hub (Username/Password o Token)
    // KUBE_CREDS: credencial tipo "Secret file" que contiene tu kubeconfig
    // GITHUB_CREDS: credencial GitHub (PAT)
    REGISTRY_CREDS = 'dockerhub-credentials'
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
      steps { sh 'npm ci' }
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
          docker.build("${NAMESPACE}/${IMAGE}:${IMAGE_TAG}")
        }
      }
    }
    stage('Docker Push') {
      steps {
        script {
          docker.withRegistry("https://${REGISTRY}", "${REGISTRY_CREDS}") {
            def dockerImage = docker.image("${NAMESPACE}/${IMAGE}:${IMAGE_TAG}")
            dockerImage.push()
            dockerImage.push('latest')
          }
          echo "Pushed image: ${FULL_IMAGE}"
        }
      }
    }
    stage('Kubernetes Deploy') {
      when { anyOf { branch 'main'; branch 'develop' } }
      steps {
        withCredentials([file(credentialsId: "${KUBE_CREDS}", variable: 'KUBECONFIG')]) {
          sh '''
            export KUBECONFIG=$KUBECONFIG
            # Aplicar manifests (sin tocar archivos)
            kubectl apply -f k8s/deployment.yaml
            kubectl apply -f k8s/service.yaml
            kubectl apply -f k8s/ingress.yaml
            # Actualizar la imagen del deployment al tag del build
            kubectl set image deployment/f1-dashboard f1-dashboard=${NAMESPACE}/${IMAGE}:${IMAGE_TAG} --record
            # Esperar rollout
            kubectl rollout status deployment/f1-dashboard --timeout=120s
          '''
        }
      }
    }
    stage('Render Trigger (opcional)') {
      when { branch 'main' }
      steps {
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
