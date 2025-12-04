#!/bin/bash

echo "🚀 Ejecutando build de F1 Dashboard en Jenkins..."

# Verificar que Jenkins esté corriendo
if ! curl -s http://localhost:8080 > /dev/null; then
    echo "❌ Jenkins no está corriendo"
    exit 1
fi

# Función para ejecutar build
trigger_build() {
    echo "🔄 Iniciando build..."
    
    # Trigger build usando curl (requiere configurar API token)
    curl -X POST http://localhost:8080/job/F1-Dashboard/build \
         --user admin:tu_api_token
    
    echo "✅ Build iniciado. Ve a http://localhost:8080/job/F1-Dashboard/"
}

# Verificar si el job existe
if curl -s "http://localhost:8080/job/F1-Dashboard/" | grep -q "F1-Dashboard"; then
    echo "✅ Job 'F1-Dashboard' encontrado"
    trigger_build
else
    echo "❌ Job 'F1-Dashboard' no encontrado"
    echo "📝 Crea el job primero en Jenkins:"
    echo "   1. New Item → Pipeline → 'F1-Dashboard'"
    echo "   2. Copia el pipeline script o configura SCM"
    echo "   3. Ejecuta este script de nuevo"
fi
