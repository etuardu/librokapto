<template>
  <main>
    <div>{{ isbn }}</div>
    <quagga-scanner @onscan="onscan" ref="quagga" v-if="quagga_visible"></quagga-scanner>
    <button @click="toggle_quagga">{{ quagga_visible ? 'Chiudi lettore ISBN' : 'Leggi ISBN' }}</button>
    <v-app>
      <v-btn stacked prepend-icon="mdi-vuetify">
        Button
      </v-btn>
      <v-icon color="secondary" icon="mdi-home" /> home
    </v-app>
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

