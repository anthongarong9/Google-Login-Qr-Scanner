<template>
  <v-app>
    <v-main>
      <div
        class="mx-auto d-flex align-center justify-center"
        style="height: 100vh;">

        <v-card
          width="500"
          class="py-8"
          rounded="xl"
          elevation="8">
          <v-card-text class="text-center">
            <v-icon
              size="100"
              color="primary">
              mdi-account
            </v-icon>
            <h3>Welcome back, please login</h3>

            <div class="px-8 mt-6">
              <v-btn
                prepend-icon="mdi-google"
                variant="flat"
                color="red"
                rounded
                block
                size="large"
                @click="loginWithGoogle">
                Sign in with Google
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </div>
    </v-main>
  </v-app>
</template>
<script setup lang="ts">
// @ts-nocheck
definePageMeta({ layout: false })
const config = useRuntimeConfig()
declare global {
 interface Window {
 google: any
 }
}
const loginWithGoogle = () => {
 const client = window.google.accounts.oauth2.initTokenClient({
 client_id: config.public.googleClientId,
 scope: 'openid email profile',
 callback: async (response: any) => {
 const userInfo = await $fetch(
 'https://www.googleapis.com/oauth2/v3/userinfo',
 {
 headers: {
 Authorization: `Bearer ${response.access_token}`
 }
 }
 )
 localStorage.setItem(
 'google_user',
 JSON.stringify(userInfo)
 )
 localStorage.setItem(
 'google_token',
 response.access_token
 )
 useAuthUser().value = userInfo
 navigateTo('/')
 }
 })
 client.requestAccessToken()
}
</script>