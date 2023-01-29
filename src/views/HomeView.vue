<template>
  <main>
    <div>{{ isbn }}</div>
    <quagga-scanner @onscan="onscan" ref="quagga" v-if="quagga_visible"></quagga-scanner>
    <button @click="toggle_quagga">{{ quagga_visible ? 'Chiudi lettore ISBN' : 'Leggi ISBN' }}</button>
  </main>
</template>
<script>
import TheWelcome from '../components/TheWelcome.vue'
import QuaggaScanner from '../components/QuaggaScanner.vue'
export default {
  components: {
    'quagga-scanner': QuaggaScanner
  },
  data: () => ({
    quagga_visible: false,
    isbn: undefined,
  }),
  methods: {
    onscan(code) {
      console.log('scanned:', code)
      this.isbn = code
    },
    toggle_quagga() {
      this.quagga_visible = !this.quagga_visible
    }
  }
}
</script>

