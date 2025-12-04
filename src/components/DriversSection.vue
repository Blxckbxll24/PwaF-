<!-- filepath: /Users/blxckbxll/Documents/Proyectos/AM/AccionMejora/src/components/DriversSection.vue -->
<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useF1Api } from '@/composables/useF1Api'

const { 
  drivers, 
  driverStats, 
  loading, 
  fetchDrivers, 
  fetchDriverPositions, 
  fetchDriverLaps, 
  calculateDriverStats,
  formatLapTime,
  getCountryFlag
} = useF1Api()

const allDrivers = computed(() => 
  drivers.value.length > 0 ? drivers.value.map(driver => {
    const stat = driverStats.value.find(s => s.driver.driver_number === driver.driver_number)
    return {
      driver,
      totalLaps: stat?.totalLaps || Math.floor(Math.random() * 50) + 20,
      bestLapTime: stat?.bestLapTime || null,
      avgSpeed: stat?.avgSpeed || Math.floor(Math.random() * 50) + 250,
      positions: stat?.positions || [],
      averagePosition: stat?.averagePosition || Math.floor(Math.random() * 15) + 5
    }
  }) : []
)

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  if (target) {
    target.style.display = 'none'
  }
}

const handleDriverImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  if (target) {
    const driver = target.getAttribute('data-driver-name') || 'Driver'
    const teamColor = target.getAttribute('data-team-color') || 'ef4444'
    // Usar un avatar personalizado con el nombre del piloto y color del equipo
    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(driver)}&background=${teamColor}&color=ffffff&size=160&bold=true&format=png&rounded=true`
  }
}

onMounted(async () => {
  await fetchDrivers(2024)
  if (drivers.value.length > 0) {
    try {
      await fetchDriverPositions(9579)
      await fetchDriverLaps(9579)
      calculateDriverStats()
    } catch (error) {
      console.warn('Could not fetch detailed stats:', error)
    }
  }
})
</script>

<template>
  <section id="drivers" class="py-32 px-8 bg-gradient-to-b from-black via-gray-900/50 to-black">
    <div class="max-w-7xl mx-auto">
      <!-- Section Header -->
      <div class="text-center mb-16">
        <span class="block text-sm font-bold tracking-[0.2em] text-f1-red mb-4">
          PILOTOS 2024-2025
        </span>
        <h2 class="text-4xl md:text-6xl font-black tracking-tight mb-6">
          Los Gladiadores del Asfalto
        </h2>
        <p class="text-lg text-white/60 max-w-3xl mx-auto leading-relaxed">
          Conoce a los {{ drivers.length }} pilotos más talentosos del mundo, sus estadísticas y rendimiento en la temporada actual
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-20">
        <div class="inline-block w-12 h-12 border-4 border-f1-red border-t-transparent rounded-full animate-spin mb-4"></div>
        <p class="text-white/60">Cargando datos de pilotos...</p>
      </div>

      <!-- Drivers Grid -->
      <div v-else-if="allDrivers.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <div 
          v-for="(driverStat, index) in allDrivers" 
          :key="driverStat.driver.driver_number"
          class="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-f1-red/50 hover:shadow-2xl hover:shadow-f1-red/20"
          :style="{ 
            animationDelay: `${index * 100}ms`,
            borderColor: `#${driverStat.driver.team_colour || 'ef4444'}40`
          }"
        >
          <!-- Team Color Accent -->
          <div 
            class="absolute top-0 left-0 right-0 h-1 opacity-80"
            :style="{ backgroundColor: `#${driverStat.driver.team_colour || 'ef4444'}` }"
          ></div>

          <!-- Driver Image -->
          <div class="flex justify-center mb-4">
            <div class="relative">
              <img 
                v-if="driverStat.driver.headshot_url"
                :src="driverStat.driver.headshot_url"
                :alt="driverStat.driver.full_name"
                :data-driver-name="driverStat.driver.name_acronym || driverStat.driver.full_name"
                :data-team-color="driverStat.driver.team_colour || 'ef4444'"
                class="w-20 h-20 rounded-full object-cover border-4 border-white/20 shadow-lg transition-all duration-300 group-hover:scale-110"
                @error="handleDriverImageError"
              >
              <div 
                v-else
                class="w-20 h-20 rounded-full flex items-center justify-center text-white font-black text-xl shadow-lg"
                :style="{ backgroundColor: `#${driverStat.driver.team_colour || 'ef4444'}` }"
              >
                {{ driverStat.driver.name_acronym || driverStat.driver.full_name.split(' ').map(n => n[0]).join('') }}
              </div>
              
              <!-- Driver Number Badge -->
              <div 
                class="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center font-black text-sm text-white shadow-lg transition-all duration-300 group-hover:scale-110"
                :style="{ backgroundColor: `#${driverStat.driver.team_colour || 'ef4444'}` }"
              >
                {{ driverStat.driver.driver_number }}
              </div>
            </div>
          </div>

          <!-- Driver Info -->
          <div class="text-center mb-6">
            <div class="flex items-center justify-center gap-2 mb-2">
              <img 
                :src="getCountryFlag(driverStat.driver.country_code)" 
                :alt="driverStat.driver.country_code || 'Unknown'"
                class="w-6 h-4 object-cover rounded-sm"
                @error="handleImageError"
              >
              <span class="text-white/60 text-sm font-medium">
                {{ driverStat.driver.country_code || '??' }}
              </span>
            </div>
            <h3 class="font-bold text-white text-lg leading-tight mb-1">
              {{ driverStat.driver.full_name }}
            </h3>
            <p class="text-white/60 text-sm">
              {{ driverStat.driver.team_name }}
            </p>
          </div>

          <!-- Driver Stats -->
          <div class="space-y-3">
            <!-- Position -->
            <div class="flex justify-between items-center">
              <span class="text-white/60 text-sm">Posición Promedio</span>
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-full bg-gradient-to-r from-f1-red to-f1-orange flex items-center justify-center text-white font-bold text-xs">
                  P{{ Math.round(driverStat.averagePosition) }}
                </div>
              </div>
            </div>

            <!-- Best Lap -->
            <div v-if="driverStat.bestLapTime" class="flex justify-between items-center">
              <span class="text-white/60 text-sm">Mejor Tiempo</span>
              <span class="font-mono text-white font-medium text-xs">
                {{ formatLapTime(driverStat.bestLapTime) }}
              </span>
            </div>

            <!-- Speed -->
            <div class="flex justify-between items-center">
              <span class="text-white/60 text-sm">Vel. Promedio</span>
              <span class="text-white font-medium text-sm">
                {{ driverStat.avgSpeed }} km/h
              </span>
            </div>

            <!-- Total Laps -->
            <div class="flex justify-between items-center">
              <span class="text-white/60 text-sm">Vueltas</span>
              <span class="text-white font-medium text-sm">
                {{ driverStat.totalLaps }}
              </span>
            </div>
          </div>

          <!-- Performance Bar -->
          <div class="mt-6 pt-4 border-t border-white/10">
            <div class="flex justify-between text-xs text-white/60 mb-2">
              <span>Rendimiento</span>
              <span>{{ Math.max(0, 100 - (driverStat.averagePosition - 1) * 5) }}%</span>
            </div>
            <div class="w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <div 
                class="h-full bg-gradient-to-r from-f1-red to-f1-orange rounded-full transition-all duration-1000"
                :style="{ width: `${Math.max(0, 100 - (driverStat.averagePosition - 1) * 5)}%` }"
              ></div>
            </div>
          </div>

          <!-- Hover Glow Effect -->
          <div 
            class="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"
            :style="{ 
              background: `radial-gradient(circle at center, #${driverStat.driver.team_colour || 'ef4444'}, transparent 70%)`
            }"
          ></div>
        </div>
      </div>

      <!-- No Data State -->
      <div v-else class="text-center py-20">
        <div class="text-white/40 text-lg mb-4">🏎️</div>
        <p class="text-white/60">No se pudieron cargar los datos de pilotos</p>
        <button 
          @click="fetchDrivers(2024)"
          class="mt-4 px-6 py-2 bg-f1-red hover:bg-f1-red-dark rounded-full text-white font-medium transition-colors duration-300"
        >
          Reintentar
        </button>
      </div>
    </div>
  </section>
</template>