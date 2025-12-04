pipeline {
    agent any
    
    environment {
        // Variables de entorno
        APP_NAME = 'f1-dashboard'
        DOCKER_IMAGE = "${APP_NAME}:${env.BUILD_NUMBER}"
        DOCKER_REGISTRY = 'registry.render.com'
        RENDER_SERVICE_ID = credentials('render-service-id')
        RENDER_API_KEY = credentials('render-api-key')
        DOCKER_REGISTRY_CREDENTIALS = credentials('render-docker-registry')
    }
    
    tools {
        nodejs '20'
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Clonando repositorio...'
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                echo 'Instalando dependencias...'
                sh 'npm ci'
            }
        }
        
        stage('Lint & Type Check') {
            parallel {
                stage('Lint') {
                    steps {
                        echo 'Ejecutando linter...'
                        sh 'npm run lint'
                    }
                }
                stage('Type Check') {
                    steps {
                        echo 'Verificando tipos de TypeScript...'
                        sh 'npm run type-check'
                    }
                }
            }
        }
        
        stage('Test') {
            steps {
                echo 'Ejecutando tests...'
                sh 'npm run test:unit'
            }
            post {
                always {
                    publishTestResults testResultsPattern: 'test-results.xml'
                }
            }
        }
        
        stage('Build Application') {
            steps {
                echo 'Construyendo aplicación...'
                sh 'npm run build'
            }
            post {
                always {
                    archiveArtifacts artifacts: 'dist/**/*', fingerprint: true
                }
            }
        }
        
        stage('Build Docker Image') {
            steps {
                echo 'Construyendo imagen Docker...'
                script {
                    dockerImage = docker.build("${DOCKER_IMAGE}")
                }
            }
        }
        
        stage('Security Scan') {
            steps {
                echo 'Escaneando vulnerabilidades...'
                script {
                    // Opcional: usar herramientas como Trivy o Snyk
                    sh '''
                        docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
                        -v $HOME/Library/Caches:/root/.cache/ \
                        aquasec/trivy:latest image --exit-code 0 --no-progress \
                        --format table ${DOCKER_IMAGE} || true
                    '''
                }
            }
        }
        
        stage('Push to Registry') {
            when {
                anyOf {
                    branch 'main'
                    branch 'develop'
                }
            }
            steps {
                echo 'Subiendo imagen a registro...'
                script {
                    docker.withRegistry("https://${DOCKER_REGISTRY}", 'render-docker-registry') {
                        dockerImage.push()
                        dockerImage.push('latest')
                    }
                }
            }
        }
        
        stage('Deploy to Render') {
            when {
                branch 'main'
            }
            steps {
                echo 'Desplegando a Render...'
                script {
                    sh '''
                        curl -X POST \
                        "https://api.render.com/v1/services/${RENDER_SERVICE_ID}/deploys" \
                        -H "Authorization: Bearer ${RENDER_API_KEY}" \
                        -H "Content-Type: application/json" \
                        -d '{"clearCache": "clear"}'
                    '''
                }
            }
        }
    }
    
    post {
        always {
            echo 'Limpiando workspace...'
            cleanWs()
        }
        success {
            echo 'Pipeline ejecutado exitosamente! 🚀'
            // Opcional: enviar notificación de éxito
        }
        failure {
            echo 'Pipeline falló ❌'
            // Opcional: enviar notificación de fallo
        }
    }
}
