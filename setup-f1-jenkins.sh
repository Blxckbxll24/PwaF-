#!/bin/bash

echo "🏁 Configuración completa de Jenkins para F1 Dashboard"
echo "===================================================="

# Función para verificar si un puerto está libre
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        echo "⚠️ Puerto $port está ocupado"
        return 1
    else
        echo "✅ Puerto $port está libre"
        return 0
    fi
}

echo "🔍 Verificando puertos..."
check_port 8090 || echo "💡 Jenkins usará puerto alternativo"
check_port 3000 || echo "💡 F1 App usará puerto alternativo"

# Crear estructura de directorios
echo "📁 Creando estructura de directorios..."
mkdir -p jenkins_home
mkdir -p jenkins-jobs/f1-dashboard
mkdir -p jenkins-config

# Crear configuración del job F1 Dashboard
cat > jenkins-jobs/f1-dashboard/config.xml << 'EOF'
<?xml version='1.1' encoding='UTF-8'?>
<flow-definition plugin="workflow-job">
  <actions/>
  <description>F1 Dashboard PWA - Pipeline completo de CI/CD</description>
  <keepDependencies>false</keepDependencies>
  <properties>
    <org.jenkinsci.plugins.workflow.job.properties.PipelineTriggersJobProperty>
      <triggers>
        <hudson.triggers.SCMTrigger>
          <spec>H/15 * * * *</spec>
          <ignorePostCommitHooks>false</ignorePostCommitHooks>
        </hudson.triggers.SCMTrigger>
      </triggers>
    </org.jenkinsci.plugins.workflow.job.properties.PipelineTriggersJobProperty>
  </properties>
  <definition class="org.jenkinsci.plugins.workflow.cps.CpsScmFlowDefinition">
    <scm class="hudson.plugins.git.GitSCM">
      <configVersion>2</configVersion>
      <userRemoteConfigs>
        <hudson.plugins.git.UserRemoteConfig>
          <url>https://github.com/Blxckbxll24/PwaF-.git</url>
        </hudson.plugins.git.UserRemoteConfig>
      </userRemoteConfigs>
      <branches>
        <hudson.plugins.git.BranchSpec>
          <name>*/main</name>
        </hudson.plugins.git.BranchSpec>
      </branches>
      <doGenerateSubmoduleConfigurations>false</doGenerateSubmoduleConfigurations>
      <submoduleCfg class="list"/>
      <extensions/>
    </scm>
    <scriptPath>Jenkinsfile</scriptPath>
    <lightweight>true</lightweight>
  </definition>
  <triggers/>
  <disabled>false</disabled>
</flow-definition>
EOF

echo "✅ Configuración de job creada"

# Hacer ejecutable el script de setup
chmod +x jenkins-docker-setup.sh

echo "🚀 Iniciando Jenkins en Docker..."
./jenkins-docker-setup.sh

echo ""
echo "🎯 ¡Configuración completada!"
echo ""
echo "📊 Panel de control:"
echo "   - Jenkins: http://localhost:8090"
echo "   - F1 Dashboard: http://localhost:3000"
echo ""
echo "🔧 Comandos útiles:"
echo "   # Ver logs de Jenkins"
echo "   docker logs f1-jenkins -f"
echo ""
echo "   # Acceder al contenedor Jenkins"
echo "   docker exec -it f1-jenkins /bin/bash"
echo ""
echo "   # Reiniciar Jenkins"
echo "   docker restart f1-jenkins"
echo ""
echo "   # Ver estado de todos los contenedores"
echo "   docker-compose -f docker-compose.jenkins.yml ps"
echo ""
echo "   # Detener todo"
echo "   docker-compose -f docker-compose.jenkins.yml down"
echo ""
echo "🏁 ¡Ve a Jenkins y configura tu primer build del F1 Dashboard!"
