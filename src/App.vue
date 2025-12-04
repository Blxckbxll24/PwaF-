<!-- filepath: /Users/blxckbxll/Documents/Proyectos/AM/AccionMejora/src/App.vue -->
<script setup lang="ts">
import TheNavigation from '@/components/TheNavigation.vue'
import HeroSection from '@/components/HeroSection.vue'
import FeaturesSection from '@/components/FeaturesSection.vue'
import DriversSection from '@/components/DriversSection.vue'
import TeamsSection from '@/components/TeamsSection.vue'
import RacesSection from '@/components/RacesSection.vue'
import GallerySection from '@/components/GallerySection.vue'
import CtaSection from '@/components/CtaSection.vue'
import AppFooter from '@/components/AppFooter.vue'
import PwaPrompt from '@/components/PwaPrompt.vue'
import OfflineIndicator from '@/components/OfflineIndicator.vue'
</script>

<template>
  <div class="bg-black text-white overflow-x-hidden">
    <TheNavigation />
    <HeroSection />
    <GallerySection />
    <FeaturesSection />
    <DriversSection />
    <TeamsSection />
    <RacesSection />
    <CtaSection />
    <AppFooter />
    <PwaPrompt />
    <OfflineIndicator />
  </div>
</template>