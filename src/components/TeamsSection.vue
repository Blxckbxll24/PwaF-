<!-- filepath: /Users/blxckbxll/Documents/Proyectos/AM/AccionMejora/src/components/TeamsSection.vue -->
<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useF1Api } from '@/composables/useF1Api'

const { 
  drivers, 
  teamStats, 
  loading, 
  fetchDrivers, 
  getUniqueTeams
} = useF1Api()

const sortedTeams = computed(() => 
  teamStats.value.sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0))
)

onMounted(async () => {
  await fetchDrivers(2024)
  getUniqueTeams()
})
</script>

<template>
  <section id="teams" class="py-32 px-8 bg-gradient-to-b from-black to-blue-950/20">
    <div class="max-w-7xl mx-auto">
      <!-- Section Header -->
      <div class="text-center mb-16">
        <span class="block text-sm font-bold tracking-[0.2em] text-f1-blue mb-4">
          ESCUDERÍAS 2025
        </span>
        <h2 class="text-4xl md:text-6xl font-black tracking-tight mb-6">
          Las Potencias de F1
        </h2>
        <p class="text-lg text-white/60 max-w-3xl mx-auto leading-relaxed">
          Conoce los equipos que compiten por el campeonato mundial, sus pilotos estrella y estadísticas
        </p>
      </div>

      <!-- Teams Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div 
          v-for="(team, index) in sortedTeams" 
          :key="team.teamName"
          class="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-3xl p-8 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
          :style="{ 
            animationDelay: `${index * 150}ms`,
            '--team-color': `#${team.teamColor}`
          }"
        >
          <!-- Team Color Header -->
          <div 
            class="absolute top-0 left-0 right-0 h-2 opacity-80"
            :style="{ backgroundColor: `#${team.teamColor}` }"
          ></div>

          <!-- Team Info -->
          <div class="mb-8">
            <div class="flex items-center gap-4 mb-4">
              <div 
                class="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl text-white shadow-lg"
                :style="{ 
                  backgroundColor: `#${team.teamColor}`,
                  boxShadow: `0 8px 32px #${team.teamColor}40`
                }"
              >
                {{ team.teamName.charAt(0) }}
              </div>
              <div>
                <h3 class="text-2xl font-black text-white leading-tight">
                  {{ team.teamName }}
                </h3>
                <p class="text-white/60">
                  {{ team.drivers.length }} {{ team.drivers.length === 1 ? 'Piloto' : 'Pilotos' }}
                </p>
              </div>
            </div>
          </div>

          <!-- Team Stats -->
          <div class="grid grid-cols-3 gap-4 mb-8">
            <div class="text-center p-4 bg-white/5 rounded-xl">
              <div 
                class="text-2xl font-black mb-1"
                :style="{ color: `#${team.teamColor}` }"
              >
                {{ team.totalPoints }}
              </div>
              <div class="text-xs text-white/60">Puntos</div>
            </div>
            <div class="text-center p-4 bg-white/5 rounded-xl">
              <div 
                class="text-2xl font-black mb-1"
                :style="{ color: `#${team.teamColor}` }"
              >
                {{ team.wins }}
              </div>
              <div class="text-xs text-white/60">Victorias</div>
            </div>
            <div class="text-center p-4 bg-white/5 rounded-xl">
              <div 
                class="text-2xl font-black mb-1"
                :style="{ color: `#${team.teamColor}` }"
              >
                {{ team.podiums }}
              </div>
              <div class="text-xs text-white/60">Podios</div>
            </div>
          </div>

          <!-- Team Drivers -->
          <div class="space-y-3">
            <h4 class="text-white font-bold text-sm uppercase tracking-wider">Pilotos</h4>
            <div 
              v-for="driver in team.drivers" 
              :key="driver.driver_number"
              class="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors duration-300"
            >
              <div 
                class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm"
                :style="{ backgroundColor: `#${team.teamColor}` }"
              >
                {{ driver.driver_number }}
              </div>
              <div class="flex-1">
                <div class="text-white font-medium text-sm">
                  {{ driver.full_name }}
                </div>
                <div class="text-white/60 text-xs">
                  {{ driver.name_acronym }} • {{ driver.country_code }}
                </div>
              </div>
            </div>
          </div>

          <!-- Performance Indicator -->
          <div class="mt-6 pt-4 border-t border-white/10">
            <div class="flex justify-between text-xs text-white/60 mb-2">
              <span>Rendimiento del Equipo</span>
              <span>{{ Math.min(100, Math.round((team.totalPoints || 0) / 5)) }}%</span>
            </div>
            <div class="w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <div 
                class="h-full rounded-full transition-all duration-1000"
                :style="{ 
                  width: `${Math.min(100, Math.round((team.totalPoints || 0) / 5))}%`,
                  backgroundColor: `#${team.teamColor}`
                }"
              ></div>
            </div>
          </div>

          <!-- Hover Glow Effect -->
          <div 
            class="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
            :style="{ 
              background: `radial-gradient(circle at center, #${team.teamColor}, transparent 70%)`
            }"
          ></div>
        </div>
      </div>
    </div>
  </section>
</template>