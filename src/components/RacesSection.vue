<!-- filepath: /Users/blxckbxll/Documents/Proyectos/AM/AccionMejora/src/components/RacesSection.vue -->
<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useF1Api } from '@/composables/useF1Api'

const { 
  meetings, 
  loading, 
  fetchMeetings, 
  getUpcomingRaces, 
  getRecentRaces,
  getCountryFlag
} = useF1Api()

const upcomingRaces = computed(() => getUpcomingRaces())
const recentRaces = computed(() => getRecentRaces())

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  if (target) {
    target.style.display = 'none'
  }
}

onMounted(async () => {
  await fetchMeetings(2024)
})
</script>

<template>
  <section id="races" class="py-32 px-8 bg-gradient-to-b from-black via-purple-950/20 to-black">
    <div class="max-w-7xl mx-auto">
      <!-- Section Header -->
      <div class="text-center mb-16">
        <span class="block text-sm font-bold tracking-[0.2em] text-f1-purple mb-4">
          CALENDARIO 2024-2025
        </span>
        <h2 class="text-4xl md:text-6xl font-black tracking-tight mb-6">
          Circuitos Legendarios
        </h2>
        <p class="text-lg text-white/60 max-w-3xl mx-auto leading-relaxed">
          Descubre los circuitos más emocionantes del mundo donde se decide el campeonato
        </p>
      </div>

      <div class="grid lg:grid-cols-2 gap-16">
        <!-- Upcoming Races -->
        <div>
          <h3 class="text-2xl font-black text-white mb-8 flex items-center gap-3">
            <span class="text-green-400">🏁</span>
            Próximas Carreras
          </h3>
          
          <div class="space-y-4">
            <div 
              v-for="(race, index) in upcomingRaces" 
              :key="race.meeting_key"
              class="group bg-gradient-to-r from-green-500/10 to-transparent border border-green-500/30 rounded-2xl p-6 hover:border-green-400/50 transition-all duration-300"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-3">
                    <img 
                      :src="getCountryFlag(race.country_code)" 
                      :alt="race.country_name"
                      class="w-8 h-6 object-cover rounded-sm shadow-sm"
                      @error="handleImageError"
                    >
                    <div>
                      <h4 class="text-white font-bold text-lg leading-tight">
                        {{ race.meeting_name }}
                      </h4>
                      <p class="text-white/60 text-sm">
                        {{ race.location }}, {{ race.country_name }}
                      </p>
                    </div>
                  </div>
                  
                  <div class="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <div class="text-green-400 font-bold">
                        {{ formatDate(race.date_start) }}
                      </div>
                      <div class="text-white/60 text-sm">
                        {{ formatTime(race.date_start) }}
                      </div>
                    </div>
                    <div>
                      <div class="text-white/80 font-medium">
                        {{ race.circuit_short_name }}
                      </div>
                      <div class="text-white/60 text-sm">
                        Circuito
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="text-2xl font-black text-green-400/60">
                  {{ String(index + 1).padStart(2, '0') }}
                </div>
              </div>
            </div>
            
            <div v-if="upcomingRaces.length === 0 && !loading" class="text-center py-8">
              <div class="text-white/40 text-4xl mb-4">🏁</div>
              <p class="text-white/60">No hay carreras próximas programadas</p>
            </div>
          </div>
        </div>

        <!-- Recent Races -->
        <div>
          <h3 class="text-2xl font-black text-white mb-8 flex items-center gap-3">
            <span class="text-f1-red">🏆</span>
            Carreras Recientes
          </h3>
          
          <div class="space-y-4">
            <div 
              v-for="(race, index) in recentRaces" 
              :key="race.meeting_key"
              class="group bg-gradient-to-r from-f1-red/10 to-transparent border border-f1-red/30 rounded-2xl p-6 hover:border-f1-red/50 transition-all duration-300"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-3">
                    <img 
                      :src="getCountryFlag(race.country_code)" 
                      :alt="race.country_name"
                      class="w-8 h-6 object-cover rounded-sm shadow-sm"
                      @error="handleImageError"
                    >
                    <div>
                      <h4 class="text-white font-bold text-lg leading-tight">
                        {{ race.meeting_name }}
                      </h4>
                      <p class="text-white/60 text-sm">
                        {{ race.location }}, {{ race.country_name }}
                      </p>
                    </div>
                  </div>
                  
                  <div class="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <div class="text-f1-red font-bold">
                        {{ formatDate(race.date_start) }}
                      </div>
                      <div class="text-white/60 text-sm">
                        Completado
                      </div>
                    </div>
                    <div>
                      <div class="text-white/80 font-medium">
                        {{ race.circuit_short_name }}
                      </div>
                      <div class="text-white/60 text-sm">
                        Circuito
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="text-2xl font-black text-f1-red/60">
                  ✓
                </div>
              </div>
            </div>
            
            <div v-if="recentRaces.length === 0 && !loading" class="text-center py-8">
              <div class="text-white/40 text-4xl mb-4">🏆</div>
              <p class="text-white/60">No hay datos de carreras recientes</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Race Stats -->
      <div class="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div class="text-center">
          <div class="text-4xl font-black text-f1-purple mb-2">
            {{ meetings.length }}
          </div>
          <div class="text-white/60 text-sm">
            Total Carreras
          </div>
        </div>
        <div class="text-center">
          <div class="text-4xl font-black text-green-400 mb-2">
            {{ upcomingRaces.length }}
          </div>
          <div class="text-white/60 text-sm">
            Próximas
          </div>
        </div>
        <div class="text-center">
          <div class="text-4xl font-black text-f1-red mb-2">
            {{ recentRaces.length }}
          </div>
          <div class="text-white/60 text-sm">
            Completadas
          </div>
        </div>
        <div class="text-center">
          <div class="text-4xl font-black text-f1-orange mb-2">
            5
          </div>
          <div class="text-white/60 text-sm">
            Continentes
          </div>
        </div>
      </div>
    </div>
  </section>
</template>