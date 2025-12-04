#!/bin/bash

# Comandos útiles para manejar Jenkins en Docker

case "$1" in
  start)
    echo "🚀 Iniciando Jenkins y servicios..."
    docker-compose -f docker-compose.jenkins.yml up -d
    echo "⏳ Esperando a que Jenkins inicie..."
    sleep 30
    echo "✅ Jenkins disponible en: http://localhost:8090"
    echo "✅ F1 Dashboard disponible en: http://localhost:3000"
    ;;
    
  stop)
    echo "🛑 Deteniendo todos los servicios..."
    docker-compose -f docker-compose.jenkins.yml down
    ;;
    
  restart)
    echo "🔄 Reiniciando servicios..."
    docker-compose -f docker-compose.jenkins.yml restart
    ;;
    
  logs)
    echo "📝 Mostrando logs de Jenkins..."
    docker logs f1-jenkins -f
    ;;
    
  password)
    echo "🔑 Obteniendo contraseña de Jenkins..."
    docker exec f1-jenkins cat /var/jenkins_home/secrets/initialAdminPassword
    ;;
    
  status)
    echo "📊 Estado de los contenedores:"
    docker-compose -f docker-compose.jenkins.yml ps
    ;;
    
  shell)
    echo "🐚 Accediendo al shell de Jenkins..."
    docker exec -it f1-jenkins /bin/bash
    ;;
    
  build)
    echo "🏗️ Ejecutando build de F1 Dashboard..."
    docker exec f1-jenkins java -jar /var/jenkins_home/war/WEB-INF/jenkins-cli.jar -s http://localhost:8080/ build f1-dashboard
    ;;
    
  cleanup)
    echo "🧹 Limpiando imágenes no utilizadas..."
    docker system prune -f
    docker volume prune -f
    ;;
    
  *)
    echo "🏁 Jenkins F1 Dashboard - Comandos disponibles:"
    echo ""
    echo "  $0 start     - Iniciar Jenkins y servicios"
    echo "  $0 stop      - Detener todos los servicios"
    echo "  $0 restart   - Reiniciar servicios"
    echo "  $0 logs      - Ver logs de Jenkins"
    echo "  $0 password  - Obtener contraseña inicial"
    echo "  $0 status    - Ver estado de contenedores"
    echo "  $0 shell     - Acceder al shell de Jenkins"
    echo "  $0 build     - Ejecutar build del proyecto"
    echo "  $0 cleanup   - Limpiar imágenes no utilizadas"
    echo ""
    echo "🌐 URLs:"
    echo "  Jenkins: http://localhost:8090"
    echo "  F1 Dashboard: http://localhost:3000"
    ;;
esac
