<script setup lang="ts">
const drawer = ref(true)
const route = useRoute()
const user = useAuthUser()

const navItems = [
  { title: 'Welcome', icon: 'mdi-view-dashboard-outline', to: '/' },
  { title: 'Scan', icon: 'mdi-qrcode-scan', to: '/scan' },
  { title: 'HTML 5 QR Scanner', icon: 'mdi-qrcode', to: '/html5-qrcode' },
]

function handleLogout() {
  clearAuthUser()
  navigateTo('/login')
}
</script>

<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" permanent>
      <!-- User profile -->
      <div class="pa-4 d-flex align-center" v-if="user">
        <v-avatar size="40" class="mr-3">
          <v-img :src="user.picture" :alt="user.name" />
        </v-avatar>
        <div class="text-truncate">
          <div class="text-body-2 font-weight-medium text-truncate">
            {{ user.name }}
          </div>
          <div class="text-caption text-medium-emphasis text-truncate">
            {{ user.email }}
          </div>
        </div>
      </div>

      <v-divider />

      <!-- Nav items -->
      <v-list nav density="comfortable">
        <v-list-item
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          :prepend-icon="item.icon"
          :title="item.title"
          :active="route.path === item.to"
          rounded="lg"
        />
      </v-list>

      <!-- Logout + footer pinned to bottom -->
      <template #append>
        <v-divider />
        <v-list nav>
          <v-list-item
            prepend-icon="mdi-logout"
            title="Logout"
            rounded="lg"
            @click="handleLogout"
          />
        </v-list>
        <div class="text-center text-caption text-medium-emphasis pb-2">
          © {{ new Date().getFullYear() }}
        </div>
      </template>
    </v-navigation-drawer>

    <v-app-bar flat>
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-toolbar-title>{{ route.meta.title || 'App' }}</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>