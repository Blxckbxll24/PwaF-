<!-- filepath: /Users/blxckbxll/Documents/Proyectos/AM/AccionMejora/src/components/GallerySection.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface GalleryImage {
  src: string
  alt: string
  title: string
  description: string
  category: string
  isLarge?: boolean // Nuevo campo para identificar imágenes grandes
}

const selectedImage = ref<GalleryImage | null>(null)
const selectedCategory = ref<string>('all')

const galleryImages: GalleryImage[] = [
  {
    src: '/red-bull-hero.jpg',
    alt: 'Red Bull Racing Hero',
    title: 'Red Bull Racing',
    description: 'Los campeones del mundo en acción, dominando las pistas con su tecnología de vanguardia.',
    category: 'teams'
  },
  {
    src: '/1291046782.avif',
    alt: 'F1 Action Shot',
    title: 'Velocidad Pura',
    description: 'La intensidad y velocidad de la Fórmula 1 capturada en cada curva.',
    category: 'action'
  },
  {
    src: '/Desktop_3.png',
    alt: 'F1 Desktop Wallpaper',
    title: 'Diseño F1',
    description: 'Arte y diseño inspirado en la estética moderna de la Fórmula 1.',
    category: 'design',
    isLarge: true // Marcar como imagen grande
  },
  {
    src: '/Mexico City GP 2024 Desktop Wallpaper 2.jpg',
    alt: 'Mexico City Grand Prix 2024',
    title: 'GP de México 2024',
    description: 'El vibrante y emocionante Gran Premio de México, una joya del calendario F1.',
    category: 'races'
  },
  {
    src: '/Singapore GP 2025 Desktop Wallpaper 4.jpg',
    alt: 'Singapore Grand Prix 2025',
    title: 'GP de Singapur 2025',
    description: 'La espectacular carrera nocturna de Singapur, luces y velocidad combinadas.',
    category: 'races',
    isLarge: true // Marcar como imagen grande
  },
  {
    src: '/W4 - GR W15 Blueprint.jpg',
    alt: 'Mercedes W15 Blueprint',
    title: 'Blueprint W15',
    description: 'Los planos técnicos del Mercedes W15, ingeniería de precisión alemana.',
    category: 'tech',
    isLarge: true // Marcar como imagen grande
  }
]

const categories = [
  { id: 'all', name: 'Todas', count: galleryImages.length },
  { id: 'teams', name: 'Equipos', count: galleryImages.filter(img => img.category === 'teams').length },
  { id: 'races', name: 'Carreras', count: galleryImages.filter(img => img.category === 'races').length },
  { id: 'action', name: 'Acción', count: galleryImages.filter(img => img.category === 'action').length },
  { id: 'tech', name: 'Técnico', count: galleryImages.filter(img => img.category === 'tech').length },
  { id: 'design', name: 'Diseño', count: galleryImages.filter(img => img.category === 'design').length }
]

const filteredImages = ref<GalleryImage[]>(galleryImages)

const filterImages = (category: string) => {
  selectedCategory.value = category
  if (category === 'all') {
    filteredImages.value = galleryImages
  } else {
    filteredImages.value = galleryImages.filter(img => img.category === category)
  }
}

const openModal = (image: GalleryImage) => {
  selectedImage.value = image
  document.body.style.overflow = 'hidden'
}

const closeModal = () => {
  selectedImage.value = null
  document.body.style.overflow = 'auto'
}

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  if (target) {
    target.src = 'https://ui-avatars.com/api/?name=F1&background=ef4444&color=ffffff&size=400&bold=true&format=png'
  }
}

onMounted(() => {
  filteredImages.value = galleryImages
})
</script>

<template>
  <section id="gallery" class="py-32 px-8 bg-gradient-to-b from-black via-red-950/10 to-black">
    <div class="max-w-7xl mx-auto">
      <!-- Section Header -->
      <div class="text-center mb-16">
        <span class="block text-sm font-bold tracking-[0.2em] text-f1-red mb-4">
          GALERÍA F1 2025
        </span>
        <h2 class="text-4xl md:text-6xl font-black tracking-tight mb-6">
          Momentos Épicos
        </h2>
        <p class="text-lg text-white/60 max-w-3xl mx-auto leading-relaxed">
          Descubre la belleza, velocidad y tecnología de la Fórmula 1 a través de estas imágenes espectaculares
        </p>
      </div>

      <!-- Category Filters -->
      <div class="flex flex-wrap justify-center gap-4 mb-12">
        <button v-for="category in categories" :key="category.id" @click="filterImages(category.id)"
          class="px-6 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2" :class="selectedCategory === category.id
            ? 'bg-f1-red text-white shadow-lg shadow-f1-red/30'
            : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'">
          {{ category.name }}
          <span class="text-xs px-2 py-1 rounded-full" :class="selectedCategory === category.id
            ? 'bg-white/20'
            : 'bg-white/10'">
            {{ category.count }}
          </span>
        </button>
      </div>

      <!-- Gallery Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="(image, index) in filteredImages" :key="index"
          class="group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-f1-red/20"
          @click="openModal(image)">
          <!-- Image Container -->
          <div class="relative aspect-[16/10] overflow-hidden bg-gray-900">
            <!-- Indicador de imagen grande -->
            <div v-if="image.isLarge"
              class="absolute top-2 left-2 z-10 px-2 py-1 bg-yellow-500/80 text-black text-xs font-bold rounded-full">
              HD
            </div>

            <img :src="image.src" :alt="image.alt"
              class="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
              @error="handleImageError" loading="lazy">

            <!-- Overlay Gradient -->
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300">
            </div>

            <!-- Hover Icon -->
            <div
              class="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
              <span class="text-white text-lg">🔍</span>
            </div>
          </div>

          <!-- Image Info -->
          <div class="absolute bottom-0 left-0 right-0 p-6">
            <h3
              class="text-white font-bold text-xl mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              {{ image.title }}
            </h3>
            <p
              class="text-white/70 text-sm leading-relaxed opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-100">
              {{ image.description }}
            </p>
          </div>

          <!-- Category Badge -->
          <div
            class="absolute top-4 left-4 px-3 py-1 bg-f1-red/80 backdrop-blur-sm rounded-full text-white text-xs font-semibold uppercase tracking-wider">
            {{categories.find(cat => cat.id === image.category)?.name || image.category}}
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredImages.length === 0" class="text-center py-16">
        <div class="text-6xl mb-4">🏎️</div>
        <h3 class="text-xl font-bold text-white mb-2">No hay imágenes en esta categoría</h3>
        <p class="text-white/60">Prueba seleccionando otra categoría</p>
      </div>
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <div v-if="selectedImage"
        class="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-8"
        @click="closeModal">
        <div class="relative max-w-6xl max-h-full">
          <!-- Close Button -->
          <button @click="closeModal"
            class="absolute -top-4 -right-4 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-xl transition-all duration-300 z-10">
            ✕
          </button>

          <!-- Modal Image -->
          <img :src="selectedImage.src" :alt="selectedImage.alt"
            class="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl" @click.stop>

          <!-- Modal Info -->
          <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
            <h3 class="text-white font-bold text-2xl mb-2">{{ selectedImage.title }}</h3>
            <p class="text-white/80 leading-relaxed">{{ selectedImage.description }}</p>
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>