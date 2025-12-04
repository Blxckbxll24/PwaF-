#!/bin/bash

echo "🚀 Configurando Jenkins para F1 Dashboard..."

# Verificar si Jenkins está corriendo
if ! curl -s http://localhost:8080 > /dev/null; then
    echo "❌ Jenkins no está corriendo. Iniciando..."
    brew services start jenkins-lts
    echo "⏳ Esperando a que Jenkins inicie..."
    sleep 30
fi

echo "✅ Jenkins está corriendo en http://localhost:8080"
echo "📋 Sigue estos pasos:"
echo ""
echo "1. Abre http://localhost:8080 en tu navegador"
echo "2. Si es la primera vez, necesitarás la contraseña inicial:"

# Buscar contraseña inicial
if [ -f ~/.jenkins/secrets/initialAdminPassword ]; then
    echo "   Contraseña inicial: $(cat ~/.jenkins/secrets/initialAdminPassword)"
elif [ -f /var/jenkins_home/secrets/initialAdminPassword ]; then
    echo "   Contraseña inicial: $(cat /var/jenkins_home/secrets/initialAdminPassword)"
else
    echo "   Busca en: ~/.jenkins/secrets/initialAdminPassword"
fi

echo ""
echo "3. Instala los plugins sugeridos"
echo "4. Crea un usuario admin"
echo "5. Continúa con la configuración del proyecto..."
