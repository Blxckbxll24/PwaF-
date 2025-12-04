<!-- filepath: /Users/blxckbxll/Documents/Proyectos/AM/AccionMejora/src/components/CtaSection.vue -->
<template>
  <section id="cta" class="relative py-32 px-8 overflow-hidden">
    <!-- Background -->
    <div class="absolute inset-0">
      <div class="absolute inset-0 bg-gradient-radial from-f1-red/20 via-transparent to-transparent opacity-60"></div>
      <div class="absolute inset-0 bg-gradient-radial from-f1-blue/20 via-transparent to-transparent opacity-60" style="transform: translateX(50%);"></div>
    </div>

    <!-- Content -->
    <div class="relative z-10 max-w-4xl mx-auto text-center">
      <h2 class="text-4xl md:text-6xl font-black mb-6 tracking-tight">
        ¿Listo para la Carrera?
      </h2>
      
      <p class="text-xl md:text-2xl text-white/70 mb-12 leading-relaxed">
        Únete a millones de fanáticos alrededor del mundo y vive la emoción de la F1
      </p>
      
      <button class="group bg-gradient-to-br from-f1-red to-f1-red-dark text-white px-12 py-6 rounded-full text-xl font-bold transition-all duration-300 shadow-2xl hover:shadow-f1-red/50 hover:-translate-y-2 inline-flex items-center gap-3">
        Comenzar Ahora
        <span class="animate-rotate-slow">✦</span>
      </button>
    </div>
  </section>
</template>