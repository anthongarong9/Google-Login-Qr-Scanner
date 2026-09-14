<script setup lang="ts">
definePageMeta({ title: 'HTML 5 QR Scanner' })

const scanning = ref(false)
const scanResult = ref('')
const scanHistory = ref<{ text: string; time: string }[]>([])
const errorMsg = ref('')
let html5QrCode: any = null

const SCANNER_ID = 'qr-reader'

async function startScanning() {
  errorMsg.value = ''
  const { Html5Qrcode } = await import('html5-qrcode')

  if (!html5QrCode) {
    html5QrCode = new Html5Qrcode(SCANNER_ID)
  }

  scanning.value = true

  try {
    await html5QrCode.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: { width: 250, height: 250 } },
      (decodedText: string) => {
        scanResult.value = decodedText
        scanHistory.value.unshift({
          text: decodedText,
          time: new Date().toLocaleTimeString(),
        })
        stopScanning()
      },
      () => {
        // per-frame scan failure, safe to ignore
      }
    )
  } catch (err: any) {
    errorMsg.value = err?.message || 'Unable to start scanning'
    scanning.value = false
  }
}

async function stopScanning() {
  if (html5QrCode && scanning.value) {
    try {
      await html5QrCode.stop()
      html5QrCode.clear()
    } catch {
      // scanner may already be stopped
    }
  }
  scanning.value = false
}

onBeforeUnmount(() => {
  if (html5QrCode && scanning.value) {
    html5QrCode.stop().catch(() => {})
  }
})
</script>

<template>
  <v-row justify="center">
    <v-col cols="12" md="6">
      <v-card rounded="lg" class="pa-4">
        <div class="text-h6 mb-4">QR Code Scanner</div>

        <div :id="SCANNER_ID" style="width: 100%;" />

        <div v-if="scanning" class="text-center my-3 font-weight-medium">
          Scanning...
        </div>

        <v-btn
          block
          size="large"
          :color="scanning ? 'error' : 'primary'"
          :prepend-icon="scanning ? 'mdi-stop' : 'mdi-play'"
          class="mt-2"
          @click="scanning ? stopScanning() : startScanning()"
        >
          {{ scanning ? 'Stop Scanning' : 'Start Scanning' }}
        </v-btn>

        <v-alert v-if="errorMsg" type="error" variant="tonal" class="mt-4">
          {{ errorMsg }}
        </v-alert>

        <v-sheet class="mt-4 pa-3 text-center" rounded="lg" border>
          <div class="text-body-2 text-medium-emphasis">Scan Result:</div>
          <div class="text-body-1 font-weight-medium">
            {{ scanResult || 'No result yet' }}
          </div>
        </v-sheet>

        <div class="mt-6">
          <div class="text-subtitle-1 font-weight-medium mb-2">Scan History</div>
          <v-list v-if="scanHistory.length" density="compact">
            <v-list-item
              v-for="(item, i) in scanHistory"
              :key="i"
              :title="item.text"
              :subtitle="item.time"
            />
          </v-list>
          <div v-else class="text-body-2 text-medium-emphasis">No scans yet</div>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>
