import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory('/'), // usa '/' en vez de import.meta.env.BASE_URL
  routes: [],
})

export default router
