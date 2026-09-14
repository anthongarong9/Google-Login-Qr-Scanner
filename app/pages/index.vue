<script setup lang="ts">
definePageMeta({ title: 'Welcome' })
const user = useAuthUser()
</script>

<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card class="pa-6" rounded="lg">
          <div class="d-flex align-center mb-4" v-if="user">
            <v-avatar size="56" class="mr-4">
              <v-img :src="user.picture" :alt="user.name" />
            </v-avatar>
            <div>
              <div class="text-h5 font-weight-bold">
                Welcome, {{ user.name }} 👋
              </div>
              <div class="text-body-2 text-medium-emphasis">
                Here's a quick overview of what you can do.
              </div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-2">
      <v-col cols="12" md="6">
        <v-card to="/scan" hover rounded="lg" class="pa-4" height="100%">
          <v-icon size="36" color="primary" class="mb-2">mdi-qrcode-scan</v-icon>
          <div class="text-h6 font-weight-medium">Scan</div>
          <div class="text-body-2 text-medium-emphasis">
            Quick single-shot scan using your browser's built-in scanner.
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card to="/html5-qrcode" hover rounded="lg" class="pa-4" height="100%">
          <v-icon size="36" color="primary" class="mb-2">mdi-qrcode</v-icon>
          <div class="text-h6 font-weight-medium">HTML 5 QR Scanner</div>
          <div class="text-body-2 text-medium-emphasis">
            Continuous scanner with live scan history tracking.
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
