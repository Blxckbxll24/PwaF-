#!/bin/bash

echo "🚀 Quick Deploy Script para F1 Dashboard PWA"
echo "==============================================="

# Verificar prerrequisitos
echo "🔍 Verificando prerrequisitos..."

# Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no encontrado"
    exit 1
fi
echo "✅ Node.js $(node --version)"

# npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm no encontrado"
    exit 1
fi
echo "✅ npm $(npm --version)"

# Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no encontrado"
    exit 1
fi
echo "✅ Docker $(docker --version)"

echo ""
echo "📦 Instalando dependencias..."
npm ci

echo ""
echo "🔍 Ejecutando linter..."
npm run lint

echo ""
echo "🔷 Verificando tipos..."
npm run type-check

echo ""
echo "🧪 Ejecutando tests..."
npm run test:unit -- --run

echo ""
echo "🏗️ Construyendo aplicación..."
npm run build

echo ""
echo "🐳 Construyendo imagen Docker..."
docker build -t f1-dashboard-pwa:latest .

echo ""
echo "🧹 Limpiando contenedores anteriores..."
docker stop f1-dashboard-local 2>/dev/null || true
docker rm f1-dashboard-local 2>/dev/null || true

echo ""
echo "🚀 Desplegando aplicación..."
docker run -d \
    --name f1-dashboard-local \
    -p 8080:8080 \
    --restart unless-stopped \
    f1-dashboard-pwa:latest

echo ""
echo "⏳ Esperando a que la aplicación inicie..."
sleep 10

echo ""
echo "🔬 Verificando health check..."
if curl -f http://localhost:8080/health; then
    echo ""
    echo "🎉 ¡Despliegue exitoso!"
    echo ""
    echo "🌐 URLs disponibles:"
    echo "   - Aplicación: http://localhost:8080"
    echo "   - Health Check: http://localhost:8080/health"
    echo ""
    echo "📊 Información del contenedor:"
    docker ps | grep f1-dashboard-local
    echo ""
    echo "📝 Para ver logs:"
    echo "   docker logs f1-dashboard-local"
    echo ""
    echo "🛑 Para detener:"
    echo "   docker stop f1-dashboard-local"
else
    echo ""
    echo "❌ Fallo en health check"
    echo "📝 Revisando logs..."
    docker logs f1-dashboard-local
    exit 1
fi
