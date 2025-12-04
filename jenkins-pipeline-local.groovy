pipeline {
    agent any
    
    environment {
        APP_NAME = 'f1-dashboard'
        NODE_VERSION = '20'
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo '📥 Obteniendo código fuente...'
                // Para testing local, ya está en workspace
                sh 'pwd && ls -la'
            }
        }
        
        stage('Setup Node.js') {
            steps {
                echo '🔧 Configurando Node.js...'
                sh '''
                    node --version
                    npm --version
                '''
            }
        }
        
        stage('Install Dependencies') {
            steps {
                echo '📦 Instalando dependencias...'
                sh 'npm ci'
            }
        }
        
        stage('Lint & Type Check') {
            parallel {
                stage('Lint') {
                    steps {
                        echo '🔍 Ejecutando linter...'
                        sh 'npm run lint'
                    }
                }
                stage('Type Check') {
                    steps {
                        echo '🔷 Verificando tipos...'
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
        }
        
        stage('Build') {
            steps {
                echo '🏗️ Construyendo aplicación...'
                sh 'npm run build'
            }
            post {
                success {
                    archiveArtifacts artifacts: 'dist/**/*', fingerprint: true
                    echo '✅ Build completado exitosamente'
                }
            }
        }
        
        stage('Build Docker Image') {
            steps {
                echo '🐳 Construyendo imagen Docker...'
                script {
                    def image = docker.build("${APP_NAME}:${env.BUILD_NUMBER}")
                    echo "✅ Imagen construida: ${image.id}"
                }
            }
        }
        
        stage('Deploy Local') {
            steps {
                echo '🚀 Desplegando localmente...'
                sh '''
                    docker stop f1-dashboard-local || true
                    docker rm f1-dashboard-local || true
                    docker run -d --name f1-dashboard-local -p 8080:8080 f1-dashboard:${BUILD_NUMBER}
                '''
                echo '✅ Aplicación disponible en http://localhost:8080'
            }
        }
    }
    
    post {
        always {
            echo '🧹 Limpiando workspace...'
        }
        success {
            echo '🎉 Pipeline ejecutado exitosamente!'
            echo '🌐 Aplicación: http://localhost:8080'
        }
        failure {
            echo '❌ Pipeline falló'
            sh 'docker logs f1-dashboard-local || true'
        }
    }
}
