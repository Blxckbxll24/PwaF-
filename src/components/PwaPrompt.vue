<!-- filepath: /Users/blxckbxll/Documents/Proyectos/AM/AccionMejora/src/components/PwaPrompt.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const showInstallPrompt = ref(false)
const showUpdatePrompt = ref(false)
const deferredPrompt = ref<any>(null)

const installApp = async () => {
    if (!deferredPrompt.value) return

    deferredPrompt.value.prompt()
    const { outcome } = await deferredPrompt.value.userChoice

    if (outcome === 'accepted') {
        console.log('Usuario aceptó instalar la app')
    }

    deferredPrompt.value = null
    showInstallPrompt.value = false
}

const dismissInstall = () => {
    showInstallPrompt.value = false
    localStorage.setItem('pwa-install-dismissed', 'true')
}

const reloadPage = () => {
    window.location.reload()
}

const dismissUpdate = () => {
    showUpdatePrompt.value = false
}

onMounted(() => {
    // Install prompt
    window.addEventListener('beforeinstallprompt', (e: Event) => {
        e.preventDefault()
        deferredPrompt.value = e

        const dismissed = localStorage.getItem('pwa-install-dismissed')
        if (!dismissed) {
            setTimeout(() => {
                showInstallPrompt.value = true
            }, 3000) // Mostrar después de 3 segundos
        }
    })

    // Update available
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            showUpdatePrompt.value = true
        })
    }

    // Check if app is installed
    window.addEventListener('appinstalled', () => {
        console.log('App instalada exitosamente')
        showInstallPrompt.value = false
    })
})
</script>

<template>
    <!-- Install Prompt -->
    <Teleport to="body">
        <div v-if="showInstallPrompt"
            class="fixed bottom-4 left-4 right-4 z-50 bg-gradient-to-r from-f1-red to-f1-red-dark text-white rounded-2xl p-6 shadow-2xl backdrop-blur-sm border border-white/10 md:left-auto md:right-4 md:w-96">
            <div class="flex items-start gap-4">
                <div class="flex-shrink-0 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/3/33/F1.svg" alt="F1" class="w-6 h-6">
                </div>
                <div class="flex-1">
                    <h3 class="font-bold text-lg mb-2">Instalar F1 Dashboard</h3>
                    <p class="text-white/90 text-sm mb-4">
                        Obtén acceso rápido y disfruta de la experiencia offline completa
                    </p>
                    <div class="flex gap-2">
                        <button @click="installApp"
                            class="bg-white text-f1-red px-4 py-2 rounded-lg font-semibold text-sm hover:bg-white/90 transition-colors duration-300">
                            Instalar
                        </button>
                        <button @click="dismissInstall"
                            class="text-white/80 hover:text-white px-4 py-2 text-sm transition-colors duration-300">
                            Más tarde
                        </button>
                    </div>
                </div>
                <button @click="dismissInstall" class="text-white/60 hover:text-white p-1 rounded">
                    ✕
                </button>
            </div>
        </div>
    </Teleport>

    <!-- Update Prompt -->
    <Teleport to="body">
        <div v-if="showUpdatePrompt"
            class="fixed top-4 left-4 right-4 z-50 bg-green-600 text-white rounded-xl p-4 shadow-lg md:left-auto md:right-4 md:w-80">
            <div class="flex items-center justify-between">
                <div>
                    <h3 class="font-bold text-sm mb-1">Actualización disponible</h3>
                    <p class="text-green-100 text-xs">Nueva versión lista para instalar</p>
                </div>
                <div class="flex gap-2 ml-4">
                    <button @click="reloadPage"
                        class="bg-white text-green-600 px-3 py-1 rounded text-xs font-semibold hover:bg-green-50 transition-colors duration-300">
                        Actualizar
                    </button>
                    <button @click="dismissUpdate"
                        class="text-green-100 hover:text-white px-2 py-1 text-xs transition-colors duration-300">
                        ✕
                    </button>
                </div>
            </div>
        </div>
    </Teleport>
</template>