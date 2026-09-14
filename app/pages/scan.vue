<script setup lang="ts">
definePageMeta({ title: 'Scan' })

const videoRef = ref<HTMLVideoElement | null>(null)
const supported = ref(true)
const scanning = ref(false)
const result = ref('')
const errorMsg = ref('')

let stream: MediaStream | null = null
let detector: any = null
let rafId: number | null = null

function checkSupport() {
  if (typeof window === 'undefined' || !('BarcodeDetector' in window)) {
    supported.value = false
    return false
  }
  return true
}

async function startScan() {
  errorMsg.value = ''
  result.value = ''

  if (!checkSupport()) return

  try {
    // @ts-ignore - BarcodeDetector isn't in TS lib.dom yet everywhere
    detector = new window.BarcodeDetector({ formats: ['qr_code'] })
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })

    if (videoRef.value) {
      videoRef.value.srcObject = stream
      await videoRef.value.play()
    }

    scanning.value = true
    detectLoop()
  } catch (err: any) {
    errorMsg.value = err?.message || 'Unable to access camera'
    scanning.value = false
  }
}

async function detectLoop() {
  if (!scanning.value || !videoRef.value || !detector) return

  try {
    const codes = await detector.detect(videoRef.value)
    if (codes.length > 0) {
      result.value = codes[0].rawValue
      stopScan()
      return
    }
  } catch {
    // per-frame detection failure, safe to ignore
  }

  rafId = requestAnimationFrame(detectLoop)
}

function stopScan() {
  scanning.value = false
  if (rafId) cancelAnimationFrame(rafId)
  if (stream) {
    stream.getTracks().forEach((t) => t.stop())
    stream = null
  }
}

onBeforeUnmount(stopScan)
</script>

<template>
  <v-row justify="center">
    <v-col cols="12" md="6">
      <v-card rounded="lg" class="pa-4">
        <div class="text-h6 mb-4">Scan</div>

        <v-alert v-if="!supported" type="warning" variant="tonal" class="mb-4">
          Your browser doesn't support the native barcode scanner. Try the
          <NuxtLink to="/html5-qrcode">HTML 5 QR Scanner</NuxtLink> page instead.
        </v-alert>

        <template v-else>
          <video
            ref="videoRef"
            style="width: 100%; border-radius: 8px; background: #000;"
            muted
            playsinline
          />

          <div v-if="scanning" class="text-center my-3 font-weight-medium">
            Scanning...
          </div>

          <v-btn
            block
            size="large"
            :color="scanning ? 'error' : 'primary'"
            :prepend-icon="scanning ? 'mdi-stop' : 'mdi-camera'"
            class="mt-2"
            @click="scanning ? stopScan() : startScan()"
          >
            {{ scanning ? 'Stop' : 'Start Scan' }}
          </v-btn>

          <v-alert v-if="errorMsg" type="error" variant="tonal" class="mt-4">
            {{ errorMsg }}
          </v-alert>

          <v-sheet class="mt-4 pa-3 text-center" rounded="lg" border>
            <div class="text-body-2 text-medium-emphasis">Result:</div>
            <div class="text-body-1 font-weight-medium">
              {{ result || 'No result yet' }}
            </div>
          </v-sheet>
        </template>
      </v-card>
    </v-col>
  </v-row>
</template>
