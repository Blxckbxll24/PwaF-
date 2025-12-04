pipeline {
    agent any
    
    environment {
        // Variables de entorno
        APP_NAME = 'f1-dashboard-pwa'
        DOCKER_IMAGE = "${APP_NAME}:${env.BUILD_NUMBER}"
        GITHUB_REPO = 'https://github.com/Blxckbxll24/PwaF-.git'
        NODE_VERSION = '20'
    }
    
    tools {
        nodejs 'NodeJS 20'
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo '📥 Clonando repositorio desde GitHub...'
                git branch: 'main',
                    url: "${GITHUB_REPO}",
                    credentialsId: 'github-credentials'
                
                sh 'ls -la'
                sh 'pwd'
            }
        }
        
        stage('Environment Info') {
            steps {
                echo '🔍 Información del entorno...'
                sh 'node --version'
                sh 'npm --version'
                sh 'git --version'
                sh 'docker --version'
            }
        }
        
        stage('Install Dependencies') {
            steps {
                echo '📦 Instalando dependencias...'
                sh 'npm ci'
                sh 'ls -la node_modules'
            }
        }
        
        stage('Code Quality') {
            parallel {
                stage('Lint') {
                    steps {
                        echo '🔍 Ejecutando linter...'
                        sh 'npm run lint'
                    }
                }
                stage('Type Check') {
                    steps {
                        echo '🔷 Verificando tipos de TypeScript...'
                        sh 'npm run type-check'
                    }
                }
            }
        }
        
        stage('Test') {
            steps {
                echo '🧪 Ejecutando tests...'
                sh 'npm run test:unit -- --run'
            }
            post {
                always {
                    // Publicar resultados de test si existen
                    script {
                        if (fileExists('coverage')) {
                            publishHTML([
                                allowMissing: false,
                                alwaysLinkToLastBuild: true,
                                keepAll: true,
                                reportDir: 'coverage',
                                reportFiles: 'index.html',
                                reportName: 'Coverage Report'
                            ])
                        }
                    }
                }
            }
        }
        
        stage('Build Application') {
            steps {
                echo '🏗️ Construyendo aplicación PWA...'
                sh 'npm run build'
                sh 'ls -la dist/'
            }
            post {
                success {
                    archiveArtifacts artifacts: 'dist/**/*', fingerprint: true
                    echo '✅ Build de la aplicación completado'
                }
            }
        }
        
        stage('Build Docker Image') {
            steps {
                echo '🐳 Construyendo imagen Docker...'
                script {
                    dockerImage = docker.build("${DOCKER_IMAGE}")
                    echo "✅ Imagen Docker creada: ${dockerImage.id}"
                }
            }
        }
        
        stage('Test Docker Image') {
            steps {
                echo '🔬 Probando imagen Docker...'
                script {
                    // Ejecutar contenedor de prueba
                    sh """
                        docker run -d --name test-container-${BUILD_NUMBER} -p 8081:8080 ${DOCKER_IMAGE}
                        sleep 10
                        curl -f http://localhost:8081/health || exit 1
                        docker stop test-container-${BUILD_NUMBER}
                        docker rm test-container-${BUILD_NUMBER}
                    """
                    echo '✅ Imagen Docker funciona correctamente'
                }
            }
        }
        
        stage('Security Scan') {
            when {
                anyOf {
                    branch 'main'
                    branch 'develop'
                }
            }
            steps {
                echo '🛡️ Escaneando vulnerabilidades...'
                script {
                    try {
                        sh """
                            docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \\
                            -v \$HOME/Library/Caches:/root/.cache/ \\
                            aquasec/trivy:latest image --exit-code 0 --no-progress \\
                            --format table ${DOCKER_IMAGE}
                        """
                    } catch (Exception e) {
                        echo "⚠️ Advertencia: Escaner de seguridad no disponible"
                    }
                }
            }
        }
        
        stage('Deploy to Staging') {
            when {
                anyOf {
                    branch 'main'
                    branch 'develop'
                }
            }
            steps {
                echo '🚀 Desplegando a staging...'
                script {
                    // Detener contenedor anterior si existe
                    sh """
                        docker stop f1-dashboard-staging || true
                        docker rm f1-dashboard-staging || true
                        
                        # Ejecutar nuevo contenedor
                        docker run -d --name f1-dashboard-staging \\
                            -p 8080:8080 \\
                            --restart unless-stopped \\
                            ${DOCKER_IMAGE}
                    """
                    
                    // Verificar que está funcionando
                    sh 'sleep 15'
                    sh 'curl -f http://localhost:8080/health'
                    
                    echo '✅ Aplicación desplegada en staging: http://localhost:8080'
                }
            }
        }
        
        stage('Performance Test') {
            when {
                branch 'main'
            }
            steps {
                echo '⚡ Ejecutando pruebas de rendimiento...'
                script {
                    try {
                        // Test básico de rendimiento con curl
                        sh """
                            echo "Probando tiempo de respuesta..."
                            time curl -o /dev/null -s -w "%{time_total}" http://localhost:8080/
                        """
                    } catch (Exception e) {
                        echo "⚠️ Pruebas de rendimiento opcionales fallaron"
                    }
                }
            }
        }
        
        stage('Cleanup & Tag') {
            steps {
                echo '🧹 Limpiando y etiquetando...'
                script {
                    // Tag de la imagen para versioning
                    if (env.BRANCH_NAME == 'main') {
                        sh "docker tag ${DOCKER_IMAGE} ${APP_NAME}:latest"
                        sh "docker tag ${DOCKER_IMAGE} ${APP_NAME}:stable"
                    }
                    
                    // Limpiar imágenes antiguas (mantener últimas 5)
                    sh """
                        docker images ${APP_NAME} --format "table {{.Repository}}:{{.Tag}}\\t{{.CreatedAt}}" | \\
                        tail -n +2 | sort -k2 -r | tail -n +6 | awk '{print \$1}' | \\
                        xargs -r docker rmi || true
                    """
                }
            }
        }
    }
    
    post {
        always {
            echo '🏁 Finalizando pipeline...'
            
            script {
                // Limpiar contenedores de test
                sh """
                    docker ps -a | grep test-container || true
                    docker rm -f \$(docker ps -aq --filter name=test-container) || true
                """
            }
        }
        
        success {
            echo '''
            🎉 ¡Pipeline ejecutado exitosamente! 
            
            📊 Resultados:
            ✅ Código verificado y testeado
            ✅ Aplicación construida correctamente  
            ✅ Imagen Docker creada
            ✅ Despliegue completado
            
            🌐 URLs:
            - Aplicación: http://localhost:8080
            - Health Check: http://localhost:8080/health
            '''
            
            // Notificación opcional (configurar webhook si es necesario)
            script {
                try {
                    // Webhook a Slack/Discord/etc (opcional)
                    sh """
                        curl -X POST -H 'Content-type: application/json' \\
                        --data '{"text":"🎉 F1 Dashboard PWA desplegado exitosamente! Build: ${BUILD_NUMBER}"}' \\
                        ${env.WEBHOOK_URL || 'echo "No webhook configured"'}
                    """
                } catch (Exception e) {
                    echo "Notificación opcional no enviada"
                }
            }
        }
        
        failure {
            echo '''
            ❌ Pipeline falló 
            
            🔍 Revisa:
            - Console output para errores específicos
            - Tests fallidos
            - Problemas de dependencias
            - Configuración de Docker
            '''
            
            script {
                // Cleanup en caso de fallo
                sh '''
                    docker stop f1-dashboard-staging || true
                    docker rm f1-dashboard-staging || true
                '''
            }
        }
        
        unstable {
            echo '⚠️ Pipeline inestable - algunos tests fallaron pero el build continuó'
        }
    }
}
