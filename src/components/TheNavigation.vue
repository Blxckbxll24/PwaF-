<!-- filepath: /Users/blxckbxll/Documents/Proyectos/AM/AccionMejora/src/components/TheNavigation.vue -->
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const scrolled = ref(false)

const handleScroll = () => {
  scrolled.value = window.scrollY > 50
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <nav 
    class="fixed top-0 left-0 right-0 z-50 px-8 py-6 transition-all duration-300"
    :class="scrolled ? 'bg-black/95 backdrop-blur-xl py-4 border-b border-white/10' : 'bg-black/20 backdrop-blur-sm'"
  >
    <div class="max-w-7xl mx-auto flex justify-between items-center">
      <div class="flex items-center gap-3">
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/3/33/F1.svg" 
          alt="Formula 1" 
          class="h-8 w-auto transition-all duration-300 drop-shadow-lg"
          :class="scrolled ? 'h-7' : 'h-8'"
        >
        <div class="flex items-center gap-2">
          <span class="text-f1-red animate-blink text-lg drop-shadow-lg">●</span>
          <span class="text-sm text-white/60 font-normal">2025</span>
        </div>
      </div>
      
      <div class="hidden md:flex items-center gap-6">
        <a 
          href="#features" 
          class="text-white/90 hover:text-white font-medium transition-colors duration-300 drop-shadow-lg"
        >
          Datos F1
        </a>
        <a 
          href="#gallery" 
          class="text-white/90 hover:text-white font-medium transition-colors duration-300 drop-shadow-lg"
        >
          Galería
        </a>
        <a 
          href="https://openf1.org/" 
          target="_blank"
          rel="noopener noreferrer"
          class="text-white/90 hover:text-white font-medium transition-colors duration-300 drop-shadow-lg"
        >
          OpenF1 API
        </a>
        <a href="#cta" class="btn-primary backdrop-blur-sm">
          Comenzar
        </a>
      </div>
    </div>
  </nav>
</template>