#!/bin/bash

echo "🚀 Configurando Jenkins para proyecto F1 Dashboard PWA..."
echo "Repository: https://github.com/Blxckbxll24/PwaF-.git"
echo ""

# Verificar que Jenkins esté corriendo
if ! curl -s http://localhost:8080 > /dev/null; then
    echo "❌ Jenkins no está corriendo. Iniciando..."
    brew services start jenkins-lts
    echo "⏳ Esperando a que Jenkins inicie (60 segundos)..."
    sleep 60
fi

echo "✅ Jenkins está corriendo en http://localhost:8080"
echo ""

echo "📋 PASOS PARA CONFIGURAR EL PIPELINE:"
echo ""
echo "1. 🌐 Abre Jenkins: http://localhost:8080"
echo ""
echo "2. 🔧 Configurar Credenciales GitHub:"
echo "   - Ve a 'Manage Jenkins' → 'Manage Credentials'"
echo "   - Clic en 'global' → 'Add Credentials'"
echo "   - Kind: 'Username with password'"
echo "   - Username: Blxckbxll24"
echo "   - Password: [Tu Personal Access Token de GitHub]"
echo "   - ID: 'github-credentials'"
echo "   - Description: 'GitHub Access for F1 Dashboard'"
echo ""
echo "3. 🔨 Configurar Node.js:"
echo "   - Ve a 'Manage Jenkins' → 'Global Tool Configuration'"
echo "   - En 'NodeJS installations' → 'Add NodeJS'"
echo "   - Name: 'NodeJS 20'"
echo "   - Version: '20.x.x'"
echo "   - Global npm packages to install: 'npm@latest'"
echo ""
echo "4. 📦 Crear Pipeline Job:"
echo "   - 'New Item' → 'Pipeline' → Name: 'F1-Dashboard-PWA'"
echo "   - En 'Pipeline' section:"
echo "     * Definition: 'Pipeline script from SCM'"
echo "     * SCM: 'Git'"
echo "     * Repository URL: 'https://github.com/Blxckbxll24/PwaF-.git'"
echo "     * Credentials: 'github-credentials'"
echo "     * Branch: '*/main'"
echo "     * Script Path: 'Jenkinsfile'"
echo ""
echo "5. ⚡ Configurar Webhooks (opcional):"
echo "   - En GitHub repo settings → Webhooks → Add webhook"
echo "   - Payload URL: http://tu-jenkins-url:8080/github-webhook/"
echo "   - Content type: application/json"
echo "   - Events: 'Just the push event'"
echo ""

# Crear archivo de configuración rápida para Jenkins
cat > jenkins-job-config.xml << 'EOF'
<?xml version='1.1' encoding='UTF-8'?>
<flow-definition plugin="workflow-job@2.40">
  <actions>
    <org.jenkinsci.plugins.pipeline.modeldefinition.actions.DeclarativeJobAction plugin="pipeline-model-definition@1.8.5"/>
    <org.jenkinsci.plugins.pipeline.modeldefinition.actions.DeclarativeJobPropertyTrackerAction plugin="pipeline-model-definition@1.8.5">
      <jobProperties/>
      <triggers/>
      <parameters/>
      <options/>
    </org.jenkinsci.plugins.pipeline.modeldefinition.actions.DeclarativeJobPropertyTrackerAction>
  </actions>
  <description>F1 Dashboard PWA - Pipeline automatizado para build, test y deploy</description>
  <keepDependencies>false</keepDependencies>
  <properties>
    <org.jenkinsci.plugins.workflow.job.properties.PipelineTriggersJobProperty>
      <triggers>
        <com.cloudbees.jenkins.GitHubPushTrigger plugin="github@1.34.1">
          <spec></spec>
        </com.cloudbees.jenkins.GitHubPushTrigger>
      </triggers>
    </org.jenkinsci.plugins.workflow.job.properties.PipelineTriggersJobProperty>
  </properties>
  <definition class="org.jenkinsci.plugins.workflow.cps.CpsScmFlowDefinition" plugin="workflow-cps@2.92">
    <scm class="hudson.plugins.git.GitSCM" plugin="git@4.8.3">
      <configVersion>2</configVersion>
      <userRemoteConfigs>
        <hudson.plugins.git.UserRemoteConfig>
          <url>https://github.com/Blxckbxll24/PwaF-.git</url>
          <credentialsId>github-credentials</credentialsId>
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

echo ""
echo "📄 Archivo de configuración creado: jenkins-job-config.xml"
echo ""
echo "🚀 COMANDOS RÁPIDOS:"
echo ""
echo "# Verificar status de Jenkins"
echo "curl -s http://localhost:8080/api/json | jq '.jobs[].name'"
echo ""
echo "# Ver logs de Jenkins"
echo "tail -f ~/.jenkins/logs/jenkins.log"
echo ""
echo "# Restart Jenkins"
echo "brew services restart jenkins-lts"
echo ""
echo "🎯 SIGUIENTE PASO: Ve a http://localhost:8080 y sigue las instrucciones arriba ⬆️"
