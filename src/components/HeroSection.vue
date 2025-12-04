<!-- filepath: /Users/blxckbxll/Documents/Proyectos/AM/AccionMejora/src/components/HeroSection.vue -->
<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useF1Api } from '@/composables/useF1Api'

const { stats, drivers, loading, fetchDrivers, fetchMeetings } = useF1Api()

const dynamicStats = computed(() => [
  { value: '75', label: 'Años de Historia' },
  { value: stats.value.totalRaces.toString(), label: 'Grandes Premios 2024' },
  { value: stats.value.totalDrivers.toString(), label: 'Pilotos Activos' }
])

onMounted(async () => {
  await Promise.all([
    fetchDrivers(2024),
    fetchMeetings(2024)
  ])
})
</script>

<template>
  <section class="relative min-h-screen flex items-center justify-center px-8 overflow-hidden">
    <!-- Hero Background Image -->
    <div class="absolute inset-0">
      <!-- Main F1 Background Image -->
      <div class="absolute inset-0">
        <!-- Usar imagen .avif si está disponible, sino fallback a .jpg -->
        <picture>
          <source srcset="/public/red-bull-hero.avif" type="image/avif">
          <img 
            src="/public/red-bull-hero.jpg" 
            alt="Red Bull Racing F1" 
            class="w-full h-full object-cover"
          >
        </picture>
        
        <!-- Dark overlay for better text readability -->
        <div class="absolute inset-0 bg-black/60"></div>
        <!-- Gradient overlays for modern effect -->
        <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30"></div>
        <div class="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20"></div>
      </div>
      
      <!-- Animated gradient overlays -->
      <div class="absolute inset-0 bg-gradient-radial from-f1-red/15 via-transparent to-transparent animate-pulse-bg opacity-40"></div>
      <div class="absolute inset-0 bg-gradient-radial from-f1-blue/15 via-transparent to-transparent animate-pulse-bg opacity-40" style="animation-delay: 2s;"></div>
      <div class="absolute inset-0 bg-gradient-radial from-f1-purple/10 via-transparent to-transparent animate-pulse-bg opacity-30" style="animation-delay: 4s;"></div>
    </div>

    <!-- Content -->
    <div class="relative z-10 max-w-4xl text-center">
      <!-- Badge -->
      <div class="inline-block px-6 py-2 bg-gradient-to-r from-f1-red/30 to-f1-blue/30 border border-white/30 rounded-full text-sm font-bold tracking-widest mb-8 animate-fade-in-down backdrop-blur-sm mt-28">
        TEMPORADA 2025
      </div>

      <!-- Title -->
      <h1 class="text-5xl md:text-7xl lg:text-8xl font-black leading-tight mb-6 tracking-tight animate-fade-in-up animation-delay-200 drop-shadow-2xl">
        La Máxima
        <span class="gradient-text block">Velocidad</span>
        del Automovilismo
      </h1>

      <!-- Description -->
      <p class="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-400 drop-shadow-lg">
        Experimenta la adrenalina, la tecnología y la pasión de la Fórmula 1.
        Datos en tiempo real desde OpenF1, los mejores pilotos, los circuitos más desafiantes.
      </p>

      <!-- Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in-up animation-delay-600">
        <a 
          href="https://openf1.org/" 
          target="_blank"
          rel="noopener noreferrer"
          class="btn-primary group backdrop-blur-sm"
        >
          <span>Ver Datos F1</span>
          <span class="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </a>
        <button class="btn-secondary backdrop-blur-sm" :disabled="loading">
          <span v-if="loading">Cargando...</span>
          <span v-else>Explorar</span>
        </button>
      </div>

      <!-- Stats -->
      <div class="flex flex-wrap gap-8 justify-center animate-fade-in-up animation-delay-800">
        <div v-for="stat in dynamicStats" :key="stat.label" class="text-center backdrop-blur-sm bg-black/20 rounded-xl p-4 border border-white/10">
          <div class="text-4xl md:text-5xl font-black gradient-text drop-shadow-lg">
            {{ stat.value }}
          </div>
          <div class="text-sm text-white/80 font-medium mt-2">
            {{ stat.label }}
          </div>
        </div>
      </div>

      <!-- API Status -->
      <div v-if="drivers.length > 0" class="mt-8 text-xs text-white/60 animate-fade-in-up animation-delay-1000 backdrop-blur-sm bg-black/20 rounded-full px-4 py-2 inline-block">
        Datos actualizados desde OpenF1.org
      </div>
    </div>

    <!-- Scroll Indicator -->
    <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-fade-in-up animation-delay-1000">
      <div class="w-8 h-12 border-2 border-white/50 rounded-full relative backdrop-blur-sm">
        <div class="w-1 h-2 bg-white/70 rounded-full absolute top-2 left-1/2 transform -translate-x-1/2 animate-scroll"></div>
      </div>
    </div>

    <!-- Decorative elements -->
    <div class="absolute top-1/4 left-10 w-2 h-2 bg-f1-red rounded-full animate-ping opacity-60"></div>
    <div class="absolute top-1/3 right-16 w-1 h-1 bg-f1-blue rounded-full animate-ping opacity-40" style="animation-delay: 1s;"></div>
    <div class="absolute bottom-1/4 left-1/4 w-1.5 h-1.5 bg-f1-orange rounded-full animate-ping opacity-50" style="animation-delay: 2s;"></div>
  </section>
</template>
