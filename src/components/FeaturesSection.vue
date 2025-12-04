<!-- filepath: /Users/blxckbxll/Documents/Proyectos/AM/AccionMejora/src/components/FeaturesSection.vue -->
<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useF1Api } from '@/composables/useF1Api'

const { stats, drivers, meetings, loading, fetchDrivers, fetchMeetings, getUniqueTeams } = useF1Api()

const dynamicFeatures = computed(() => [
  { 
    title: `${stats.value.totalDrivers} Pilotos`, 
    description: 'Los mejores pilotos del mundo compitiendo', 
    icon: '🏎️',
    data: drivers.value.length > 0 ? `Último: ${drivers.value[0]?.full_name || 'Cargando...'}` : 'Cargando...'
  },
  { 
    title: `${stats.value.totalRaces} Carreras`, 
    description: 'Circuitos legendarios en todo el mundo', 
    icon: '🏁',
    data: meetings.value.length > 0 ? `Próximo: ${meetings.value.find(m => new Date(m.date_start) > new Date())?.meeting_name || 'TBD'}` : 'Cargando...'
  },
  { 
    title: `${stats.value.totalTeams} Equipos`, 
    description: 'Escuderías con tecnología de vanguardia', 
    icon: '🏆',
    data: drivers.value.length > 0 ? `Equipos: ${getUniqueTeams().slice(0, 2).join(', ')}...` : 'Cargando...'
  },
  { 
    title: '350+ km/h', 
    description: 'Velocidad máxima en circuitos como Monza', 
    icon: '⚡',
    data: 'Datos en tiempo real desde OpenF1'
  }
])

onMounted(async () => {
  await Promise.all([
    fetchDrivers(2024),
    fetchMeetings(2024)
  ])
})
</script>

<template>
  <section id="features" class="py-32 px-8 bg-gradient-to-b from-black to-red-950/20">
    <div class="max-w-7xl mx-auto">
      <!-- Section Header -->
      <div class="text-center mb-16">
        <span class="block text-sm font-bold tracking-[0.2em] text-f1-red mb-4">
          DATOS OPENF1 2025
        </span>
        <h2 class="text-4xl md:text-6xl font-black tracking-tight">
          La Élite del Motorsport
        </h2>
        <p class="mt-4 text-lg text-white/60 max-w-2xl mx-auto">
          Información actualizada en tiempo real desde la API oficial de OpenF1
        </p>
      </div>

      <!-- Features Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div 
          v-for="(feature, index) in dynamicFeatures" 
          :key="index"
          class="group relative bg-white/5 border border-white/10 rounded-3xl p-8 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:border-f1-red/50 hover:bg-white/10"
        >
          <!-- Loading State -->
          <div v-if="loading && index < 3" class="absolute top-4 right-4">
            <div class="w-3 h-3 bg-f1-red rounded-full animate-pulse"></div>
          </div>

          <!-- Glow Effect -->
          <div class="absolute inset-0 bg-gradient-radial from-f1-red/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <!-- Content -->
          <div class="relative z-10">
            <div class="text-5xl mb-6">{{ feature.icon }}</div>
            <h3 class="text-2xl font-bold mb-4">{{ feature.title }}</h3>
            <p class="text-white/60 leading-relaxed mb-3">{{ feature.description }}</p>
            
            <!-- Dynamic Data -->
            <div class="text-xs text-f1-red font-medium border-t border-white/10 pt-3 mt-3">
              {{ feature.data }}
            </div>
          </div>
        </div>
      </div>

      <!-- API Attribution -->
      <div class="text-center mt-16">
        <a 
          href="https://openf1.org/" 
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors duration-300 text-sm"
        >
          <span>Powered by OpenF1.org</span>
          <span class="text-f1-red">↗</span>
        </a>
      </div>
    </div>
  </section>
</template>