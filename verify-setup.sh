#!/bin/bash

echo "🔍 Verificando setup del proyecto..."

# Verificar dependencias
echo "📦 Verificando dependencias..."
if [ ! -d "node_modules" ]; then
    echo "⚠️  node_modules no encontrado. Ejecutando npm install..."
    npm install
fi

# Verificar que el build funciona
echo "🏗️ Verificando build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build exitoso"
else
    echo "❌ Build falló"
    exit 1
fi

# Verificar Docker
echo "🐳 Verificando Docker..."
if command -v docker &> /dev/null; then
    echo "✅ Docker instalado"
    docker --version
else
    echo "❌ Docker no instalado. Instala Docker Desktop"
fi

# Verificar Jenkins
echo "🏗️ Verificando Jenkins..."
if curl -s http://localhost:8080 > /dev/null; then
    echo "✅ Jenkins corriendo en http://localhost:8080"
else
    echo "❌ Jenkins no está corriendo"
    echo "   Ejecuta: brew services start jenkins-lts"
fi

echo ""
echo "🎯 Resumen para subir a Jenkins:"
echo "1. Asegúrate que Jenkins esté corriendo"
echo "2. Crea un nuevo Pipeline Job en Jenkins"
echo "3. Usa el Jenkinsfile del proyecto"
echo "4. Ejecuta el build"
echo ""
echo "🌐 URLs importantes:"
echo "   Jenkins: http://localhost:8080"
echo "   App local: http://localhost:5173 (dev)"
echo "   App Docker: http://localhost:8080 (después del deploy)"
