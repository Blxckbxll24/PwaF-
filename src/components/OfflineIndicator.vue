<!-- filepath: /Users/blxckbxll/Documents/Proyectos/AM/AccionMejora/src/components/OfflineIndicator.vue -->
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isOnline = ref(navigator.onLine)

const updateOnlineStatus = () => {
    isOnline.value = navigator.onLine
}

onMounted(() => {
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)
})

onUnmounted(() => {
    window.removeEventListener('online', updateOnlineStatus)
    window.removeEventListener('offline', updateOnlineStatus)
})
</script>

<template>
    <Teleport to="body">
        <Transition enter-active-class="transition-transform duration-300" enter-from-class="translate-y-full"
            enter-to-class="translate-y-0" leave-active-class="transition-transform duration-300"
            leave-from-class="translate-y-0" leave-to-class="translate-y-full">
            <div v-if="!isOnline"
                class="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-3 text-center text-sm z-40 border-t border-gray-600">
                <div class="flex items-center justify-center gap-2">
                    <div class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span>Sin conexión - Usando datos guardados</span>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>