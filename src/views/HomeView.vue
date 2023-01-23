<template>
  <main>
    <TheWelcome />
    <quagga-scanner @onscan="onscan"></quagga-scanner>
  </main>
</template>
<script>
import TheWelcome from '../components/TheWelcome.vue'
import QuaggaScanner from '../components/QuaggaScanner.vue'
export default {
  components: {
    'quagga-scanner': QuaggaScanner
  },
  methods: {
    onscan(code) {
      console.log('scanned:', code)
    }
  }
}
</script>

