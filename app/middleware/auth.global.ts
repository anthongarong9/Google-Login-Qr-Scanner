export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return
  const token = localStorage.getItem('google_token')

  if (to.path === '/login' && token) return navigateTo('/')
  if (to.path !== '/login' && !token) return navigateTo('/login')
})