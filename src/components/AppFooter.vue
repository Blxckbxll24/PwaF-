<!-- filepath: /Users/blxckbxll/Documents/Proyectos/AM/AccionMejora/src/components/AppFooter.vue -->
<template>
  <footer class="py-12 px-8 border-t border-white/10 bg-black">
    <div class="max-w-7xl mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <!-- Brand -->
        <div class="col-span-1 md:col-span-2">
          <div class="flex items-center gap-3 mb-4">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/3/33/F1.svg" 
              alt="Formula 1" 
              class="h-10 w-auto"
            >
            <div class="flex items-center gap-2">
              <span class="text-f1-red text-xl">●</span>
              <span class="text-lg text-white/40 font-normal">2025</span>
            </div>
          </div>
          <p class="text-white/60 leading-relaxed max-w-md">
            Experimenta la emoción de la Fórmula 1 con datos en tiempo real desde OpenF1. 
            La plataforma definitiva para fanáticos del motorsport.
          </p>
          <div class="flex gap-4 mt-6">
            <a 
              href="https://openf1.org/" 
              target="_blank"
              rel="noopener noreferrer"
              class="bg-f1-red hover:bg-f1-red-dark px-6 py-2 rounded-full text-white font-medium transition-colors duration-300 text-sm"
            >
              Explorar API
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h4 class="text-white font-bold mb-4">Navegación</h4>
          <ul class="space-y-2 text-sm">
            <li><a href="#features" class="text-white/60 hover:text-white transition-colors duration-300">Características</a></li>
            <li><a href="#drivers" class="text-white/60 hover:text-white transition-colors duration-300">Pilotos</a></li>
            <li><a href="#teams" class="text-white/60 hover:text-white transition-colors duration-300">Equipos</a></li>
            <li><a href="#races" class="text-white/60 hover:text-white transition-colors duration-300">Carreras</a></li>
            <li><a href="#gallery" class="text-white/60 hover:text-white transition-colors duration-300">Galería</a></li>
          </ul>
        </div>

        <!-- Data Sources -->
        <div>
          <h4 class="text-white font-bold mb-4">Fuentes de Datos</h4>
          <ul class="space-y-2 text-sm">
            <li>
              <a 
                href="https://openf1.org/" 
                target="_blank"
                rel="noopener noreferrer"
                class="text-white/60 hover:text-white transition-colors duration-300 flex items-center gap-2"
              >
                OpenF1 API <span class="text-xs">↗</span>
              </a>
            </li>
            <li>
              <a 
                href="https://www.formula1.com/" 
                target="_blank"
                rel="noopener noreferrer"
                class="text-white/60 hover:text-white transition-colors duration-300 flex items-center gap-2"
              >
                Fórmula 1 Oficial <span class="text-xs">↗</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p class="text-white/50 text-sm">
          © 2024-2025 F1 Dashboard. Diseño Conceptual con OpenF1.
        </p>
        <div class="flex items-center gap-6 text-xs text-white/40">
          <span>Temporada 2025</span>
          <span>•</span>
          <span>Datos en Tiempo Real</span>
          <span>•</span>
          <span>Powered by OpenF1</span>
        </div>
      </div>
    </div>
  </footer>
</template>