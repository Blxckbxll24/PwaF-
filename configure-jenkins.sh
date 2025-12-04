#!/bin/bash

echo "⚙️ Configurando Jenkins para Node.js y Docker..."

# Función para instalar plugin de Jenkins
install_plugin() {
    local plugin_name=$1
    echo "Instalando plugin: $plugin_name"
    java -jar jenkins-cli.jar -s http://localhost:8080/ install-plugin $plugin_name
}

# Descargar Jenkins CLI
if [ ! -f jenkins-cli.jar ]; then
    echo "📥 Descargando Jenkins CLI..."
    wget http://localhost:8080/jnlpJars/jenkins-cli.jar
fi

echo "🔌 Instalando plugins necesarios..."

# Instalar plugins necesarios
install_plugin "nodejs"
install_plugin "docker-workflow" 
install_plugin "pipeline-stage-view"
install_plugin "blueocean"
install_plugin "github"

echo "✅ Plugins instalados. Reinicia Jenkins para activarlos:"
echo "   brew services restart jenkins-lts"
echo ""
echo "🔧 Configuración manual requerida:"
echo "1. Ve a 'Manage Jenkins' → 'Global Tool Configuration'"
echo "2. En 'NodeJS installations' agrega:"
echo "   - Name: 'NodeJS 20'"
echo "   - Version: '20.x'"
echo "   - Global npm packages: 'npm@latest'"
echo ""
echo "3. En 'Docker installations' agrega:"
echo "   - Name: 'Docker'"
echo "   - Install automatically: Yes"
