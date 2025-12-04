#!/bin/bash

echo "🐳 Configurando Jenkins en Docker para F1 Dashboard..."

# Verificar que Docker esté corriendo
if ! docker ps >/dev/null 2>&1; then
    echo "❌ Docker no está corriendo. Por favor inicia Docker Desktop"
    exit 1
fi

echo "✅ Docker está corriendo"

# Crear directorio para Jenkins si no existe
mkdir -p ./jenkins_home

# Dar permisos al directorio de Jenkins
sudo chown -R 1000:1000 ./jenkins_home || chmod -R 777 ./jenkins_home

echo "📦 Iniciando servicios de Jenkins..."

# Levantar Jenkins y servicios relacionados
docker-compose -f docker-compose.jenkins.yml up -d

echo "⏳ Esperando a que Jenkins inicie (puede tomar 2-3 minutos)..."
sleep 60

# Verificar que Jenkins esté corriendo
if curl -s http://localhost:8090 >/dev/null; then
    echo "✅ Jenkins está corriendo en http://localhost:8090"
else
    echo "⏳ Aún iniciando... esperando más tiempo"
    sleep 60
fi

# Obtener la contraseña inicial de Jenkins
echo "🔑 Obteniendo contraseña inicial de Jenkins..."

# Intentar obtener la contraseña del contenedor
PASSWORD=$(docker exec f1-jenkins cat /var/jenkins_home/secrets/initialAdminPassword 2>/dev/null)

if [ ! -z "$PASSWORD" ]; then
    echo "📋 Contraseña inicial de Jenkins: $PASSWORD"
else
    echo "⚠️ No se pudo obtener la contraseña automáticamente"
    echo "💡 Ejecuta este comando para obtenerla:"
    echo "docker exec f1-jenkins cat /var/jenkins_home/secrets/initialAdminPassword"
fi

echo ""
echo "🌐 URLs importantes:"
echo "   - Jenkins: http://localhost:8090"
echo "   - F1 Dashboard: http://localhost:3000"
echo ""
echo "📋 Próximos pasos:"
echo "1. Ve a http://localhost:8090"
echo "2. Usa la contraseña mostrada arriba"
echo "3. Instala plugins sugeridos"
echo "4. Crea usuario admin"
echo "5. Configura el pipeline del proyecto F1"
echo ""
echo "📝 Para ver logs de Jenkins:"
echo "   docker logs f1-jenkins -f"
echo ""
echo "🛑 Para detener todo:"
echo "   docker-compose -f docker-compose.jenkins.yml down"
